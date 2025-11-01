import OpenAI from "openai";
import { db } from "./db";
import { usedBlogImages } from "@shared/schema";
import { sql } from "drizzle-orm";

// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
// Lazy initialization of OpenAI client to ensure env vars are loaded
let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    if (!process.env.AI_INTEGRATIONS_OPENAI_API_KEY || !process.env.AI_INTEGRATIONS_OPENAI_BASE_URL) {
      throw new Error("Replit AI Integrations not configured. Please ensure the OpenAI integration is set up.");
    }
    openai = new OpenAI({
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    });
  }
  return openai;
}

interface BlogGenerationRequest {
  topic: string;
  keywords: string;
  city?: string;
  imageStyle?: string;
}

interface BlogGenerationResult {
  title: string;
  slug: string;
  metaDescription: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  featuredImageAlt: string;
  contentImages: Array<{ url: string; alt: string; description: string }>;
  internalLinks: string[];
  externalLinks: string[];
  seoScore: number;
  wordCount: number;
  validationResults: {
    wordCountValid: boolean;
    metaDescriptionValid: boolean;
    h1Count: number;
    internalLinkCount: number;
    externalLinkCount: number;
    uniqueAnchorText: boolean;
  };
}

export class BlogGeneratorService {
  /**
   * Fetch unique images from Unsplash that haven't been used in any blog
   * Handles race conditions by retrying if images are taken by concurrent requests
   */
  private async fetchUniqueImages(
    query: string,
    count: number,
    retryCount = 0
  ): Promise<Array<{ url: string; description: string }>> {
    const MAX_RETRIES = 3;
    
    try {
      // Get all previously used image URLs from database (with fresh read)
      const usedImages = await db.select({ imageUrl: usedBlogImages.imageUrl })
        .from(usedBlogImages);
      const usedUrls = new Set(usedImages.map(img => img.imageUrl));

      // Fetch more images than needed to account for duplicates
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.statusText}`);
      }

      const data = await response.json();
      const availableImages = data.results
        .filter((img: any) => !usedUrls.has(img.urls.regular))
        .slice(0, count)
        .map((img: any) => ({
          url: img.urls.regular,
          description: img.description || img.alt_description || query,
        }));

      // Immediately try to reserve these images in the database
      const successfullyReserved: Array<{ url: string; description: string }> = [];
      
      for (const img of availableImages) {
        try {
          // Try to insert - if it conflicts (another request took it), skip it
          await db.insert(usedBlogImages).values({
            imageUrl: img.url,
            description: img.description,
            altText: img.description,
            source: "unsplash",
          });
          // If insert succeeded, this image is ours
          successfullyReserved.push(img);
        } catch (error) {
          // Image was taken by another concurrent request, skip it
          console.log(`Image ${img.url} already taken, skipping`);
        }
        
        // Stop once we have enough images
        if (successfullyReserved.length >= count) {
          break;
        }
      }

      // If we didn't get enough unique images, retry with a fresh fetch
      if (successfullyReserved.length < count && retryCount < MAX_RETRIES) {
        console.log(`Only got ${successfullyReserved.length}/${count} images, retrying (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
        const additionalNeeded = count - successfullyReserved.length;
        const additionalImages = await this.fetchUniqueImages(query, additionalNeeded, retryCount + 1);
        return [...successfullyReserved, ...additionalImages];
      }

      return successfullyReserved;
    } catch (error) {
      console.error("Error fetching Unsplash images:", error);
      
      // Fallback: Generate unique placeholder URLs using timestamp + random
      // Don't mark these as "used" since they're fallbacks
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(7);
      return Array(count).fill(null).map((_, i) => ({
        url: `/attached_assets/stock_images/fallback-${timestamp}-${randomId}-${i}.jpg`,
        description: query,
      }));
    }
  }

  /**
   * Generate a catchy, clickbait title from keywords using OpenAI
   */
  async generateTitle(keywords: string, city?: string): Promise<string> {
    const cityContext = city ? ` Focus on ${city}, Florida if relevant.` : '';
    
    const prompt = `Generate ONE engaging, clickbait-style blog title for a mental health clinic's blog.

Keywords: ${keywords}${cityContext}

Requirements:
- Make it attention-grabbing and emotionally compelling
- Use power words that evoke curiosity or emotion
- Keep it under 70 characters for SEO
- Make it actionable or question-based when possible
- Appeal to people seeking mental health help

Examples of good styles:
- "The Hidden Signs of [Condition] Most People Miss"
- "How to Know If It's [X] or [Y] — And When to Seek Help"
- "7 Surprising Ways [Treatment] Changes Your Life"
- "What Everyone Gets Wrong About [Topic]"

Return ONLY the title, nothing else.`;

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o", // Using gpt-4o - compatible with chat completions API via Replit AI Integrations
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.9, // Higher temperature for creative titles
      max_tokens: 100,
    });

    return completion.choices[0].message.content?.trim() || "Understanding Mental Health: A Complete Guide";
  }

  /**
   * Validate that all links are not broken (no 404s)
   */
  private async validateLinks(links: string[]): Promise<boolean> {
    try {
      const validationPromises = links.map(async (link) => {
        try {
          const response = await fetch(link, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
          return response.ok;
        } catch {
          return false;
        }
      });

      const results = await Promise.all(validationPromises);
      return results.every(result => result === true);
    } catch {
      return false;
    }
  }

  /**
   * Calculate SEO score based on 32 quality standards
   */
  private calculateSEOScore(
    content: string,
    metaDescription: string,
    title: string,
    internalLinks: string[],
    externalLinks: string[],
    keywords: string
  ): {
    score: number;
    validationResults: any;
  } {
    let score = 100;
    const issues: string[] = [];

    // Extract primary keyword (first keyword in the list)
    const primaryKeyword = keywords.split(',')[0]?.trim().toLowerCase() || '';

    // Critical: Meta description length (150-160 chars)
    if (metaDescription.length < 150 || metaDescription.length > 160) {
      score -= 25;
      issues.push("Meta description must be 150-160 characters");
    }

    // Critical: Word count (2000 ±5 words)
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 1995 || wordCount > 2005) {
      score -= 25;
      issues.push("Word count must be 2000±5 words");
    }

    // Critical: H1 tag check (exactly one)
    const h1Matches = content.match(/<h1[^>]*>/gi);
    const h1Count = h1Matches ? h1Matches.length : 0;
    if (h1Count !== 1) {
      score -= 20;
      issues.push("Must have exactly one H1 tag");
    }

    // Important: H2 tags (multiple subheadings for structure)
    const h2Matches = content.match(/<h2[^>]*>/gi);
    const h2Count = h2Matches ? h2Matches.length : 0;
    if (h2Count < 6) {
      score -= 5;
      issues.push("Should have at least 6 H2 subheadings for proper structure");
    }

    // Important: Internal links (minimum 4)
    if (internalLinks.length < 4) {
      score -= 8;
      issues.push("Must have at least 4 internal links");
    }

    // Important: External links (minimum 3)
    if (externalLinks.length < 3) {
      score -= 8;
      issues.push("Must have at least 3 external authoritative links");
    }

    // Verify unique anchor text
    const anchorTextSet = new Set<string>();
    const anchorMatches = Array.from(content.matchAll(/<a[^>]*>([^<]+)<\/a>/gi));
    let duplicateAnchors = false;
    for (const match of anchorMatches) {
      const anchorText = match[1].toLowerCase().trim();
      if (anchorTextSet.has(anchorText)) {
        duplicateAnchors = true;
        break;
      }
      anchorTextSet.add(anchorText);
    }
    if (duplicateAnchors) {
      score -= 10;
      issues.push("All anchor text must be unique - found duplicates");
    }

    // Title length (≤60 chars)
    if (title.length > 60) {
      score -= 5;
      issues.push("Title should be ≤60 characters");
    }

    // Primary keyword in title
    if (primaryKeyword && !title.toLowerCase().includes(primaryKeyword)) {
      score -= 8;
      issues.push("Title should include primary keyword");
    }

    // Primary keyword in meta description
    if (primaryKeyword && !metaDescription.toLowerCase().includes(primaryKeyword)) {
      score -= 8;
      issues.push("Meta description should include primary keyword");
    }

    // Primary keyword in first paragraph (first 300 chars)
    const firstParagraph = content.substring(0, 300).toLowerCase();
    if (primaryKeyword && !firstParagraph.includes(primaryKeyword)) {
      score -= 5;
      issues.push("Primary keyword should appear in first paragraph");
    }

    // Check for HIPAA compliance indicators (no specific patient identifiers)
    const hipaaViolations = /(patient named|john doe|jane doe|patient's name is|mr\.|mrs\.|ms\.)\s+[A-Z][a-z]+/i;
    if (hipaaViolations.test(content)) {
      score -= 15;
      issues.push("Possible HIPAA violation - avoid specific patient identifiers");
    }

    // Check for local SEO mentions (Orlando, Winter Park, etc.)
    const localMentions = /(orlando|winter park|altamonte springs|maitland|casselberry|lake mary)/gi;
    const localMatches = content.match(localMentions);
    if (!localMatches || localMatches.length < 2) {
      score -= 5;
      issues.push("Should mention Orlando/Winter Park area at least twice for local SEO");
    }

    // Verify external links are from authoritative sources
    const authoritativeSources = ['nimh.nih.gov', 'apa.org', 'samhsa.gov', 'who.int', 'cdc.gov', 'mayoclinic.org', 'psychologytoday.com'];
    const hasAuthoritativeLink = externalLinks.some(link => 
      authoritativeSources.some(source => link.includes(source))
    );
    if (!hasAuthoritativeLink) {
      score -= 7;
      issues.push("Should include at least one link to authoritative sources (NIMH, APA, SAMHSA, etc.)");
    }

    // Check for proper HTML structure (paragraphs, no loose text)
    const hasLooseText = /<body[^>]*>[^<]*[a-zA-Z]{20,}|<\/h[123]>[^<]*[a-zA-Z]{20,}/i.test(content);
    if (hasLooseText) {
      score -= 5;
      issues.push("Content should be properly wrapped in HTML tags (p, h2, h3, etc.)");
    }

    // Check for placeholder text
    const placeholderText = /\[.*?\]|lorem ipsum|coming soon|todo|tbd|xxx|placeholder/i;
    if (placeholderText.test(content)) {
      score -= 15;
      issues.push("No placeholder text allowed - content must be complete");
    }

    // Validate keyword density (0.5-3%)
    let keywordDensity = 0;
    if (primaryKeyword && wordCount > 0) {
      const keywordRegex = new RegExp(primaryKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const keywordMatches = content.match(keywordRegex);
      const keywordCount = keywordMatches ? keywordMatches.length : 0;
      keywordDensity = (keywordCount / wordCount) * 100;
      
      if (keywordDensity < 0.5 || keywordDensity > 3) {
        score -= 7;
        issues.push(`Keyword density should be 0.5-3% (currently ${keywordDensity.toFixed(2)}%)`);
      }
    }

    // Check for CTA (Call to Action) in content
    const ctaPatterns = /(contact us|call us|schedule|appointment|reach out|get help|book now|request|connect with)/i;
    if (!ctaPatterns.test(content)) {
      score -= 8;
      issues.push("Content should include a clear call-to-action");
    }

    // Validate internal link destinations (should point to actual pages)
    const validInternalPaths = [
      '/services', '/team', '/request-appointment', '/insurance', '/blog',
      '/emdr-therapy', '/depression-counseling', '/anxiety-therapy', '/virtual-therapy',
      '/crisis-therapy', '/treatments', '/therapies', '/conditions', '/locations'
    ];
    const invalidInternalLinks = internalLinks.filter(link => 
      !validInternalPaths.some(path => link.includes(path))
    );
    if (invalidInternalLinks.length > 0) {
      score -= 5;
      issues.push(`Some internal links point to invalid pages: ${invalidInternalLinks.join(', ')}`);
    }

    // Check for adult-only content indicators (18+) - Required for mental health clinic content
    const adultContentIndicators = /(adults?|18\+|over 18|18 and older|age 18)/i;
    const hasAdultIndicator = adultContentIndicators.test(content);
    if (!hasAdultIndicator) {
      score -= 5;
      issues.push("Content should specify it's for adults (18+) as per mental health clinic standards");
    }
    
    // Check H3 tags for proper hierarchy
    const h3Matches = content.match(/<h3[^>]*>/gi);
    const h3Count = h3Matches ? h3Matches.length : 0;
    
    // Verify heading hierarchy (H2s should be followed by H3s in sections)
    const hasProperHierarchy = h2Count > 0 && (h3Count === 0 || h3Count >= h2Count * 0.5);
    if (!hasProperHierarchy && h2Count > 0) {
      score -= 3;
      issues.push("Heading hierarchy should include H3 subheadings under H2 sections");
    }

    // Enhanced penalty for critical HIPAA violations
    if (hipaaViolations.test(content)) {
      score -= 10; // Additional penalty for HIPAA (total -25)
      issues.push("CRITICAL: Potential HIPAA violation detected - must remove patient identifiers");
    }

    // Enhanced penalty for missing authoritative links (total -15)
    if (!hasAuthoritativeLink) {
      score -= 8; // Additional penalty (total -15)
      issues.push("CRITICAL: Must include authoritative medical sources (NIMH, APA, SAMHSA, etc.)");
    }

    // Enhanced penalty for insufficient local SEO (total -12)
    if (!localMatches || localMatches.length < 2) {
      score -= 7; // Additional penalty (total -12)
      issues.push("CRITICAL: Must mention Orlando/Winter Park area at least twice");
    }

    if (issues.length > 0) {
      console.warn("⚠️  SEO/Quality Issues Found:", issues);
    }

    const finalScore = Math.max(0, score);
    
    // Log warning if score is below recommended threshold
    if (finalScore < 70) {
      console.error(`❌ QUALITY WARNING: Blog score ${finalScore}/100 is below recommended threshold of 70`);
      console.error(`   Issues found: ${issues.join(', ')}`);
    }

    return {
      score: finalScore,
      validationResults: {
        wordCountValid: wordCount >= 1995 && wordCount <= 2005,
        metaDescriptionValid: metaDescription.length >= 150 && metaDescription.length <= 160,
        h1Count,
        h2Count,
        h3Count,
        internalLinkCount: internalLinks.length,
        externalLinkCount: externalLinks.length,
        uniqueAnchorText: !duplicateAnchors,
        hasAuthoritativeLinks: hasAuthoritativeLink,
        primaryKeywordInTitle: primaryKeyword ? title.toLowerCase().includes(primaryKeyword) : true,
        primaryKeywordInMeta: primaryKeyword ? metaDescription.toLowerCase().includes(primaryKeyword) : true,
        primaryKeywordInFirstPara: primaryKeyword ? firstParagraph.includes(primaryKeyword) : true,
        keywordDensity: keywordDensity.toFixed(2) + '%',
        localSEOMentions: localMatches?.length || 0,
        noHIPAAViolations: !hipaaViolations.test(content),
        noPlaceholders: !placeholderText.test(content),
        hasCTA: ctaPatterns.test(content),
        validInternalLinks: invalidInternalLinks.length === 0,
        hasProperHeadingHierarchy: hasProperHierarchy,
        hasAdultContentIndicator: hasAdultIndicator,
        wordCount,
        issues,
      },
    };
  }

  /**
   * Generate blog post using GPT-4 with all 32 best practices
   */
  async generateBlog(request: BlogGenerationRequest): Promise<BlogGenerationResult> {
    const { topic, keywords, city, imageStyle } = request;

    // Build the comprehensive prompt following all 32 standards
    const systemPrompt = `You are the blog generation system for Empathy Health Clinic, a mental health practice in Winter Park and Orlando, Florida.

You must strictly apply these 32 automated quality standards:

CONTENT QUALITY:
1. Exactly 2,000 words (±5 words tolerance)
2. Complete sentences only - no truncation
3. Professional structure with intro, 6-8 sections, strong conclusion with CTA
4. Exactly ONE H1 tag, multiple H2/H3 subheadings
5. HIPAA-compliant - no patient identifiers, generalized scenarios only

SEO OPTIMIZATION:
6. Meta description: exactly 150-160 characters, includes primary keyword
7. Primary keyword in title, meta description, and first paragraph
8. Keyword density 0.5-3% - natural, never forced
9. Title under 60 characters
10. Proper HTML structure

IMAGES:
11. Suggest 1 featured image + 3-4 content images
12. HIPAA-compliant imagery - no identifiable patients
13. Professional stock photos
14. All images need descriptive alt text

LINKS:
15. Minimum 4 internal links (to empathyhealthclinic.com pages)
16. Minimum 3 external authoritative links (NIMH, APA, SAMHSA, WHO)
17. 100% unique anchor text - every link has different text
18. Proper hyperlink formatting <a href="">text</a>
19. Natural distribution throughout content

LOCAL SEO:
20. Orlando, Winter Park, and surrounding cities mentioned naturally
21. Mental health specialization focus
22. Adult-only content (18+)

TECHNICAL:
23. Ready-to-publish HTML
24. No placeholders or "Coming soon"
25. Accessibility - proper heading hierarchy
26. Mobile-friendly formatting

INPUT:
- Topic: ${topic}
- Keywords: ${keywords}
- ${city ? `City/Location: ${city}` : 'Location: Orlando/Winter Park area'}
- ${imageStyle ? `Image Style: ${imageStyle}` : 'Image Style: calming, professional mental health'}

OUTPUT AS JSON:
{
  "title": "SEO-optimized title (≤60 chars)",
  "metaDescription": "150-160 chars, includes primary keyword",
  "slug": "url-friendly-slug",
  "excerpt": "First 200 characters of content",
  "content": "<Full 2000-word HTML article with H1, H2, H3 tags, paragraphs, and inline links>",
  "featuredImageQuery": "Search query for featured image (e.g., 'peaceful nature forest mental health')",
  "contentImageQueries": ["Query 1", "Query 2", "Query 3"],
  "internalLinks": [
    "/services",
    "/emdr-therapy",
    "/depression-counseling", 
    "/request-appointment"
  ],
  "externalLinks": [
    "https://www.nimh.nih.gov/...",
    "https://www.apa.org/...",
    "https://www.samhsa.gov/..."
  ]
}

CRITICAL RULES:
- Word count MUST be 2000±5 words
- Meta description MUST be 150-160 characters
- Exactly ONE H1 tag
- All anchor text MUST be unique
- HIPAA-compliant throughout
- Professional mental health clinic tone`;

    try {
      console.log("🤖 Generating blog with OpenAI GPT-4...");
      
      // Call OpenAI API
      const completion = await getOpenAI().chat.completions.create({
        model: "gpt-4o", // Using gpt-4o - compatible with chat completions API via Replit AI Integrations
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a comprehensive blog post about: ${topic}` }
        ],
        temperature: 0.7,
        max_tokens: 8192,
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");
      
      // Fetch unique images that haven't been used before
      // Images are automatically reserved in the database during fetch to prevent race conditions
      console.log("🖼️  Fetching unique images from Unsplash...");
      const featuredImages = await this.fetchUniqueImages(
        result.featuredImageQuery || imageStyle || "mental health wellness",
        1
      );
      const contentImages = await this.fetchUniqueImages(
        result.contentImageQueries?.[0] || "therapy counseling",
        3
      );

      // Validate links
      console.log("🔗 Validating all links...");
      const allLinks = [...result.internalLinks, ...result.externalLinks];
      const linksValid = await this.validateLinks(allLinks);
      
      if (!linksValid) {
        console.warn("⚠️  Some links may be broken");
      }

      // Calculate SEO score with comprehensive validation
      const { score, validationResults } = this.calculateSEOScore(
        result.content,
        result.metaDescription,
        result.title,
        result.internalLinks,
        result.externalLinks,
        keywords
      );

      console.log(`✅ Blog generated! SEO Score: ${score}/100`);

      return {
        title: result.title,
        slug: result.slug,
        metaDescription: result.metaDescription,
        content: result.content,
        excerpt: result.excerpt,
        featuredImage: featuredImages[0]?.url || "",
        featuredImageAlt: featuredImages[0]?.description || "",
        contentImages: contentImages.map(img => ({
          url: img.url,
          alt: img.description,
          description: img.description,
        })),
        internalLinks: result.internalLinks,
        externalLinks: result.externalLinks,
        seoScore: score,
        wordCount: validationResults.wordCount,
        validationResults,
      };
    } catch (error) {
      console.error("❌ Error generating blog:", error);
      throw new Error(`Blog generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const blogGeneratorService = new BlogGeneratorService();
