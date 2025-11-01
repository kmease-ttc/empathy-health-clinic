import fs from 'fs';
import path from 'path';

interface BlogPost {
  title: string;
  featuredImage: string;
  slug: string;
}

// Normalize image path to detect visual duplicates (ignore size variations)
function normalizeImagePath(imagePath: string): string {
  if (!imagePath) return '';
  
  return imagePath
    .replace(/-\d+x\d+\.(jpg|jpeg|png|webp)/i, '.$1')
    .replace(/-scaled\.(jpg|jpeg|png|webp)/i, '.$1')
    .replace(/-\d+\.(jpg|jpeg|png|webp)/i, '.$1')
    .toLowerCase();
}

// Patterns for images we want to REPLACE
const REPLACE_PATTERNS = [
  // Provider photos
  'christine', 'keith', 'orr', 'team.jpg', 'staff', 'provider',
  
  // Insurance/company logos
  'logo', 'insurance', 'aetna', 'cigna', 'blue_cross', 'blue-cross',
  'adventhealth', 'optum', 'oscar', 'humana', 'tricare', 'medicare', 'umr',
  
  // Clinical/office settings
  'therapy-session', 'counseling-session', 'office', 'clinic-interior',
  
  // Promotional/marketing graphics
  'struggling', 'addiction', 'depression-banner', 'empathy-banner',
  
  // Generic placeholders
  'placeholder', 'hero-image', 'screenshot', 'clip-path', 'arrow',
  
  // Specific problematic images from WordPress
  '432377474', '431608868', 'goodtherapy', 'dental', 'implants',
  
  // AI/illustration graphics (brain puzzles, infographics)
  'brain', 'puzzle', 'infographic', 'illustration', 'graphic',
  
  // Specific filenames we saw duplicated
  'Image-2-15-25', 'IMG-20250222', 'pexels-alex-green',
  'Are-Men-or-Women', 'ADHD-Therapist', 'Blog-image-1',
  'PMHNP', 'image-blog', 'Group-1000002945', '2148891001',
  'Frame-1000001925', '10186705', '14932', '2590357', '1.jpg', '2.png',
  '12-2-700x700', '17474.png', '1-1.png', 'How-Long-Does'
];

function shouldReplaceImage(imagePath: string): boolean {
  const lowerPath = imagePath.toLowerCase();
  return REPLACE_PATTERNS.some(pattern => lowerPath.includes(pattern.toLowerCase()));
}

// Get all stock images, prioritizing nature photos
function getStockImages(): string[] {
  const stockDir = path.join('attached_assets', 'stock_images');
  if (!fs.existsSync(stockDir)) return [];
  
  const files = fs.readdirSync(stockDir);
  const allImages = files
    .filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i))
    .map(f => `/attached_assets/stock_images/${f}`);
  
  // Prioritize nature images
  const natureImages = allImages.filter(img => {
    const lower = img.toLowerCase();
    return lower.includes('forest') || lower.includes('ocean') || 
           lower.includes('mountain') || lower.includes('sunset') || 
           lower.includes('sunrise') || lower.includes('flower') ||
           lower.includes('peaceful') || lower.includes('misty') ||
           lower.includes('calm');
  });
  
  // Other good images (non-promotional, non-logo)
  const otherGoodImages = allImages.filter(img => {
    const lower = img.toLowerCase();
    return !natureImages.includes(img) && 
           !REPLACE_PATTERNS.some(pattern => lower.includes(pattern.toLowerCase()));
  });
  
  // Shuffle for variety
  const shuffle = (arr: string[]) => arr.sort(() => Math.random() - 0.5);
  
  return [...shuffle(natureImages), ...shuffle(otherGoodImages)];
}

function fixAllBlogImages() {
  console.log('🔍 Comprehensive blog image cleanup...\n');
  
  const blogPostsPath = 'server/blog-posts-data.json';
  const posts: BlogPost[] = JSON.parse(fs.readFileSync(blogPostsPath, 'utf-8'));
  
  console.log(`Total blog posts: ${posts.length}\n`);
  
  // Track normalized images to detect visual duplicates
  const normalizedImageMap = new Map<string, BlogPost[]>();
  
  // Analyze all images
  for (const post of posts) {
    if (post.featuredImage) {
      const normalized = normalizeImagePath(post.featuredImage);
      if (!normalizedImageMap.has(normalized)) {
        normalizedImageMap.set(normalized, []);
      }
      normalizedImageMap.get(normalized)!.push(post);
    }
  }
  
  // Find duplicates and problematic images
  const postsToFix: BlogPost[] = [];
  const reasons = new Map<BlogPost, string>();
  
  for (const post of posts) {
    if (!post.featuredImage) {
      postsToFix.push(post);
      reasons.set(post, 'Empty image');
      continue;
    }
    
    // Check if should be replaced due to pattern match
    if (shouldReplaceImage(post.featuredImage)) {
      postsToFix.push(post);
      reasons.set(post, 'Problematic image type');
      continue;
    }
    
    // Check if it's a duplicate
    const normalized = normalizeImagePath(post.featuredImage);
    const duplicates = normalizedImageMap.get(normalized) || [];
    if (duplicates.length > 1) {
      // Keep the first occurrence, replace others
      if (duplicates.indexOf(post) > 0) {
        postsToFix.push(post);
        reasons.set(post, `Duplicate (${duplicates.length} total)`);
      }
    }
  }
  
  console.log(`Found ${postsToFix.length} posts that need new images:\n`);
  
  // Get stock images
  const stockImages = getStockImages();
  console.log(`Available stock images: ${stockImages.length}\n`);
  
  if (stockImages.length < postsToFix.length) {
    console.log(`⚠️  Warning: Only ${stockImages.length} images for ${postsToFix.length} posts\n`);
  }
  
  // Track which stock images we've used
  const usedStockImages = new Set<string>();
  for (const post of posts) {
    if (post.featuredImage && post.featuredImage.includes('/stock_images/')) {
      usedStockImages.add(post.featuredImage);
    }
  }
  
  // Replace images
  let updated = 0;
  for (const post of postsToFix) {
    // Find an unused stock image
    let newImage: string | null = null;
    for (const img of stockImages) {
      if (!usedStockImages.has(img)) {
        newImage = img;
        usedStockImages.add(img);
        break;
      }
    }
    
    if (newImage) {
      const oldImage = post.featuredImage;
      const reason = reasons.get(post) || 'Unknown';
      
      post.featuredImage = newImage;
      updated++;
      
      console.log(`✅ [${reason}] "${post.title.substring(0, 50)}..."`);
      console.log(`   Old: ${oldImage ? path.basename(oldImage) : 'NONE'}`);
      console.log(`   New: ${path.basename(newImage)}\n`);
    } else {
      console.log(`❌ Ran out of stock images for: ${post.title.substring(0, 50)}...\n`);
    }
  }
  
  // Save
  fs.writeFileSync(blogPostsPath, JSON.stringify(posts, null, 2));
  
  console.log(`\n✨ Complete!`);
  console.log(`   Updated: ${updated} posts`);
  console.log(`   Remaining issues: ${postsToFix.length - updated}`);
  console.log(`\n💾 Saved to ${blogPostsPath}`);
  
  // Final verification
  const finalNormalizedMap = new Map<string, number>();
  for (const post of posts) {
    if (post.featuredImage) {
      const normalized = normalizeImagePath(post.featuredImage);
      finalNormalizedMap.set(normalized, (finalNormalizedMap.get(normalized) || 0) + 1);
    }
  }
  
  const remainingDupes = Array.from(finalNormalizedMap.entries())
    .filter(([, count]) => count > 1);
  
  if (remainingDupes.length > 0) {
    console.log(`\n⚠️  Remaining duplicates: ${remainingDupes.length}`);
    remainingDupes.forEach(([img, count]) => {
      console.log(`   ${path.basename(img)}: ${count} times`);
    });
  } else {
    console.log(`\n✅ No duplicates remaining! All images are unique!`);
  }
}

fixAllBlogImages();
