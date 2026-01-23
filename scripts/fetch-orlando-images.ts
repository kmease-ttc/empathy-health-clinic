import axios from 'axios';
import * as fs from 'fs';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

interface BlogPost {
  title: string;
  slug: string;
  imageKeyword: string;
}

async function fetchFloridaImages() {
  const posts: BlogPost[] = JSON.parse(fs.readFileSync('orlando-blog-posts.json', 'utf-8'));
  const imageResults: any[] = [];

  for (const post of posts) {
    try {
      console.log(`Fetching image for: ${post.title}`);
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: post.imageKeyword,
          per_page: 1,
          orientation: 'landscape'
        },
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        const image = response.data.results[0];
        imageResults.push({
          slug: post.slug,
          imageUrl: image.urls.regular,
          imageAlt: `${post.title} - ${image.alt_description || post.imageKeyword}`,
          photographerName: image.user.name,
          photographerLink: image.user.links.html
        });
        console.log(`✓ Found image for: ${post.slug}`);
      } else {
        console.log(`✗ No image found for: ${post.slug}`);
      }

      // Rate limit: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error: any) {
      console.error(`Error fetching image for ${post.slug}:`, error.message);
    }
  }

  fs.writeFileSync('orlando-blog-images.json', JSON.stringify(imageResults, null, 2));
  console.log(`\n✓ Saved ${imageResults.length} images to orlando-blog-images.json`);
}

fetchFloridaImages();
