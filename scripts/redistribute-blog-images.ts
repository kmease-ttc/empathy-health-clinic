import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Load blog posts data
const blogPostsPath = join(process.cwd(), 'server/blog-posts-data.json');
const blogPosts = JSON.parse(readFileSync(blogPostsPath, 'utf-8'));

// Get all available images
const stockImagesDir = join(process.cwd(), 'attached_assets/stock_images');
const generatedImagesDir = join(process.cwd(), 'attached_assets/generated_images');

const stockImages = readdirSync(stockImagesDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .map(f => `/attached_assets/stock_images/${f}`);

const generatedImages = readdirSync(generatedImagesDir)
  .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
  .map(f => `/attached_assets/generated_images/${f}`);

const allImages = [...generatedImages, ...stockImages];

console.log(`Total images available: ${allImages.length}`);
console.log(`Total blog posts: ${blogPosts.length}`);

// Distribute images across all blog posts (round-robin style)
blogPosts.forEach((post: any, index: number) => {
  const imageIndex = index % allImages.length;
  post.featuredImage = allImages[imageIndex];
});

// Write updated data back
writeFileSync(blogPostsPath, JSON.stringify(blogPosts, null, 2));

// Count unique images used
const uniqueImages = new Set(blogPosts.map((p: any) => p.featuredImage));
console.log(`Unique images after redistribution: ${uniqueImages.size}`);
console.log('✅ Blog images redistributed successfully!');
