import { readFileSync, writeFileSync } from 'fs';
import OpenAI from "openai";

let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    if (!process.env.AI_INTEGRATIONS_OPENAI_API_KEY || !process.env.AI_INTEGRATIONS_OPENAI_BASE_URL) {
      throw new Error("Replit AI Integrations not configured");
    }
    openai = new OpenAI({
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    });
  }
  return openai;
}

async function expandDescription(title: string, currentDescription: string, type: string): Promise<string> {
  const client = getOpenAI();
  
  const prompt = `You are an expert medical content writer for Empathy Health Clinic, a mental health clinic in Winter Park, FL. 

TASK: Expand this ${type} description to 350-450 words of SEO-optimized content.

CURRENT: "${currentDescription}"

REQUIREMENTS:
- Target 350-450 words
- Professional medical tone, second person ("you", "your")
- Include keywords: "${title}", "Winter Park", "mental health"
- Add benefits, treatment approaches, what patients expect
- Empathetic, compassionate tone
- NO emojis, NO bullet points, NO headers
- NO disclaimers
- Flowing paragraphs only

Write expanded description:`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are an expert mental health content writer." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 1200,
  });

  return completion.choices[0]?.message?.content?.trim() || currentDescription;
}

// Mapping of slugs to titles for items needing expansion
const itemsToExpand: { [slug: string]: string } = {
  // Treatments
  "medication-management": "Medication Management",
  "depression-treatment": "Depression Treatment",
  "anxiety-treatment": "Anxiety Treatment",
  "adhd-treatment": "ADHD Testing & Evaluation",
  "bipolar-disorder-treatment": "Bipolar Disorder Treatment",
  "ocd-treatment": "OCD Treatment",
  "ptsd-treatment": "PTSD Treatment",
  "esa-letter": "ESA Letter",
  
  // Therapies
  "cognitive-behavioral-therapy": "Cognitive Behavioral Therapy",
  "concentration-and-focus-therapy": "Concentration and Focus Therapy",
  "grief-counseling-services": "Grief Counseling Services",
  "anger-management": "Anger Management",
  "depression-therapy": "Depression Therapy",
  "bipolar-disorder-therapy": "Bipolar Disorder Therapy",
  "ocd-therapy": "OCD Therapy",
  "emdr-therapy": "EMDR Therapy",
  "couples-therapy": "Couples Therapy",
  "intimacy-therapy": "Intimacy Therapy",
  "orlando-marriage-counseling": "Orlando Marriage Counseling",
  "toxic-relationship-therapy": "Toxic Relationship Therapy",
  "lgbtq-therapy": "LGBTQ Therapy",
  "in-person-therapy": "In Person Therapy",
  "virtual-counseling-services": "Virtual Counseling Services",
  
  // Conditions
  "personality-disorders": "Personality Disorders",
  "eating-disorders": "Eating Disorders",
  "schizophrenia-psychotic-disorders": "Schizophrenia & Psychotic Disorders",
  "postpartum-depression-perinatal-mood-disorders": "Postpartum Depression & Perinatal Mood Disorders",
};

async function main() {
  console.log('\n🚀 Automated Content Expansion\n');
  
  const storagePath = 'server/storage.ts';
  let storageContent = readFileSync(storagePath, 'utf-8');
  let totalExpanded = 0;
  
  for (const [slug, title] of Object.entries(itemsToExpand)) {
    try {
      // Find the description line for this slug
      // Pattern: find slug, then find description field within next ~2000 chars
      const slugIndex = storageContent.indexOf(`slug: "${slug}"`);
      
      if (slugIndex === -1) {
        console.log(`⚠️  Slug not found: ${slug}`);
        continue;
      }
      
      // Look for description field after the slug (within reasonable range)
      const searchWindow = storageContent.substring(slugIndex, slugIndex + 2000);
      const descPattern = /description:\s*"([^"]*(?:\\.[^"]*)*)"/;
      const descMatch = searchWindow.match(descPattern);
      
      if (!descMatch) {
        console.log(`⚠️  Description not found for: ${slug}`);
        continue;
      }
      
      const currentDesc = descMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
      const wordCount = currentDesc.split(/\s+/).length;
      
      if (wordCount >= 300) {
        console.log(`✓ ${title}: ${wordCount} words (already expanded)\n`);
        continue;
      }
      
      console.log(`Expanding: ${title} (${wordCount} → 400 words)`);
      
      // Determine type
      const type = slug.includes('therapy') ? 'therapy' : 
                   (slug.includes('treatment') || slug.includes('evaluation') || slug.includes('letter') || slug === 'medication-management') ? 'treatment' : 
                   'condition';
      
      // Generate expanded content
      const expandedDesc = await expandDescription(title, currentDesc, type);
      const newWordCount = expandedDesc.split(/\s+/).length;
      
      // Escape for TypeScript string
      const escapedDesc = expandedDesc.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n\n/g, '\\n\\n');
      
      // Replace the description in the file
      const fullDescMatch = `description: "${descMatch[1]}"`;
      const replacement = `description: "${escapedDesc}"`;
      storageContent = storageContent.replace(fullDescMatch, replacement);
      
      console.log(`  ✓ Expanded to ${newWordCount} words\n`);
      totalExpanded++;
      
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.error(`❌ Error processing ${title}:`, error);
    }
  }
  
  // Write updated file
  writeFileSync(storagePath, storageContent, 'utf-8');
  
  console.log(`\n✅ Complete! Expanded ${totalExpanded} items`);
  console.log(`💾 Updated ${storagePath}\n`);
}

main().catch(console.error);
