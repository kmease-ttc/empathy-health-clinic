import * as fs from 'fs';

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  publishedDate: string;
  category: string;
  [key: string]: any;
}

// Stock image categories
const stockImages = {
  therapy: [
    '/attached_assets/stock_images/person_talking_to_th_a37a2588.jpg',
    '/attached_assets/stock_images/person_talking_to_th_cd645237.jpg',
    '/attached_assets/stock_images/person_talking_to_th_37aef94c.jpg',
    '/attached_assets/stock_images/person_talking_to_th_b31f2491.jpg',
    '/attached_assets/stock_images/person_talking_to_th_e89bf1dc.jpg',
  ],
  meditation: [
    '/attached_assets/stock_images/peaceful_meditation__a4ef5dd4.jpg',
    '/attached_assets/stock_images/peaceful_meditation__e6430506.jpg',
    '/attached_assets/stock_images/peaceful_meditation__7caf733f.jpg',
    '/attached_assets/stock_images/peaceful_meditation__bf0be33e.jpg',
    '/attached_assets/stock_images/peaceful_meditation__caad6764.jpg',
  ],
  depression: [
    '/attached_assets/stock_images/depression_anxiety_m_12ef3176.jpg',
    '/attached_assets/stock_images/depression_anxiety_m_4f8ec540.jpg',
    '/attached_assets/stock_images/depression_anxiety_m_263ac057.jpg',
    '/attached_assets/stock_images/depression_anxiety_m_9ea51f2f.jpg',
    '/attached_assets/stock_images/depression_anxiety_m_36a0e057.jpg',
  ],
  healthcare: [
    '/attached_assets/stock_images/healthcare_professio_70df12ba.jpg',
    '/attached_assets/stock_images/healthcare_professio_65229ac0.jpg',
    '/attached_assets/stock_images/healthcare_professio_0f7ee982.jpg',
    '/attached_assets/stock_images/healthcare_professio_7522a755.jpg',
    '/attached_assets/stock_images/healthcare_professio_ba0e6a64.jpg',
  ],
  wellness: [
    '/attached_assets/stock_images/happy_person_mental__c63c450e.jpg',
    '/attached_assets/stock_images/happy_person_mental__e8868e5d.jpg',
    '/attached_assets/stock_images/happy_person_mental__0ab33bbb.jpg',
    '/attached_assets/stock_images/happy_person_mental__2270f084.jpg',
    '/attached_assets/stock_images/happy_person_mental__ced92300.jpg',
  ],
};

function categorizePost(post: BlogPost): 'therapy' | 'meditation' | 'depression' | 'healthcare' | 'wellness' {
  const text = (post.title + ' ' + post.excerpt + ' ' + post.content).toLowerCase();
  
  // Therapy/counseling keywords
  if (text.match(/therapy|therapist|counseling|counselor|psychotherapy|cbt|dbt|emdr|couples|relationship/)) {
    return 'therapy';
  }
  
  // Meditation/mindfulness keywords
  if (text.match(/meditation|mindfulness|relaxation|calm|peace|yoga|breathing|grounding/)) {
    return 'meditation';
  }
  
  // Depression/anxiety keywords
  if (text.match(/depression|anxiety|panic|stress|worry|fear|sad|anxious|depressed/)) {
    return 'depression';
  }
  
  // Healthcare professional keywords
  if (text.match(/psychiatrist|doctor|physician|nurse|practitioner|medical|medication|prescri/)) {
    return 'healthcare';
  }
  
  // Default to wellness
  return 'wellness';
}

function assignImages() {
  console.log('Loading blog posts...');
  const blogPosts: BlogPost[] = JSON.parse(
    fs.readFileSync('server/blog-posts-data.json', 'utf-8')
  );

  // Track usage of each image
  const imageUsage: { [key: string]: number } = {};
  const categoryCounters: { [key: string]: number } = {
    therapy: 0,
    meditation: 0,
    depression: 0,
    healthcare: 0,
    wellness: 0,
  };

  let postsUpdated = 0;

  const updatedPosts = blogPosts.map((post, index) => {
    // Only update posts that have external WordPress URLs
    if (!post.featuredImage) {
      return post;
    }
    
    if (!post.featuredImage.includes('empathyhealthclinic.com') && !post.featuredImage.includes('http')) {
      return post;
    }

    const category = categorizePost(post);
    const images = stockImages[category];
    const imageIndex = categoryCounters[category] % images.length;
    const assignedImage = images[imageIndex];
    
    categoryCounters[category]++;
    imageUsage[assignedImage] = (imageUsage[assignedImage] || 0) + 1;
    postsUpdated++;

    console.log(`✓ ${post.title.substring(0, 60)} → ${category} (${assignedImage.split('/').pop()})`);

    return {
      ...post,
      featuredImage: assignedImage,
    };
  });

  console.log(`\n=== Summary ===`);
  console.log(`Total posts: ${blogPosts.length}`);
  console.log(`Posts updated: ${postsUpdated}`);
  console.log(`\nCategory distribution:`);
  Object.entries(categoryCounters).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count} posts`);
  });

  console.log(`\nWriting updated blog posts...`);
  fs.writeFileSync(
    'server/blog-posts-data.json',
    JSON.stringify(updatedPosts, null, 2),
    'utf-8'
  );

  console.log(`✅ Done! All blog images updated to local stock images.`);
}

assignImages();
