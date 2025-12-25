/**
 * Extracts all blog post slugs from the LIVE DATABASE via API
 * and generates routes/blogRoutes.json
 * 
 * IMPORTANT: This now fetches from the API to get all blog posts,
 * not just those in the static seed file.
 */

import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const OUTPUT_PATH = path.join(process.cwd(), 'routes/blogRoutes.json');

interface BlogPostResponse {
  posts: Array<{ slug: string }>;
  total: number;
}

async function extractBlogRoutes(): Promise<string[]> {
  try {
    // Fetch all published blog posts from the API
    const response = await fetch(`${BASE_URL}/api/blog-posts?pageSize=1000`);
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }
    
    const data: BlogPostResponse = await response.json();
    
    const routes = data.posts
      .filter(post => post.slug && post.slug.trim())
      .map(post => `/blog/${post.slug}`);
    
    return routes.sort();
  } catch (error) {
    console.error('❌ Failed to fetch blog posts from API:', error);
    console.error('   Make sure the server is running: npm run dev');
    process.exit(1);
  }
}

async function main() {
  const routes = await extractBlogRoutes();
  
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(routes, null, 2));
  
  console.log(`✅ Extracted ${routes.length} blog routes from database to ${OUTPUT_PATH}`);
  console.log('Sample routes:', routes.slice(0, 5));
}

main();
