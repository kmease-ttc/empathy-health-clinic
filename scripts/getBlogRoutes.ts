/**
 * Extracts all blog post slugs and generates routes/blogRoutes.json
 */

import * as fs from 'fs';
import * as path from 'path';

const BLOG_DATA_PATH = path.join(process.cwd(), 'server/blog-posts-data.json');
const OUTPUT_PATH = path.join(process.cwd(), 'routes/blogRoutes.json');

interface BlogPost {
  slug: string;
  title: string;
  [key: string]: unknown;
}

function extractBlogRoutes(): string[] {
  const content = fs.readFileSync(BLOG_DATA_PATH, 'utf-8');
  const blogPosts: BlogPost[] = JSON.parse(content);
  
  const routes = blogPosts
    .filter(post => post.slug && post.slug.trim())
    .map(post => `/blog/${post.slug}`);
  
  return routes.sort();
}

function main() {
  const routes = extractBlogRoutes();
  
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(routes, null, 2));
  
  console.log(`✅ Extracted ${routes.length} blog routes to ${OUTPUT_PATH}`);
  console.log('Sample routes:', routes.slice(0, 5));
}

main();
