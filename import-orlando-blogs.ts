import fs from 'fs';
import { db } from './server/db';
import { blogPosts } from './shared/schema';

interface BlogMeta {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  imageKeyword: string;
  category: string;
  readTime: number;
}

interface BlogImage {
  slug: string;
  imageUrl: string;
  imageAlt: string;
  photographerName: string;
  photographerLink: string;
}

// Full blog content from the attached file
const blogContent: Record<string, string> = {
  "how-to-choose-psychiatrist-orlando": `Finding the right psychiatrist can make a meaningful difference in how supported and understood you feel while navigating mental health concerns. With many options across Orlando, the search can feel overwhelming. Knowing what to look for helps you make a confident, informed decision.

Start by identifying your goals. Some people are looking for help understanding changes in mood or sleep. Others want clarity about focus-related challenges or emotional responses to stress. Being clear about what you hope to address makes it easier to evaluate whether a psychiatric provider feels like a good fit.

Next, review the provider's qualifications. Look for licensed psychiatric professionals with experience treating concerns similar to yours. Many providers share information about their background, areas of interest, and approach to care on their websites. This can give you a sense of their style and how they work with patients.

It's also helpful to consider the environment where you'll be receiving care. Some patients prefer the structure of an in-office visit, while others choose online appointments for convenience. Many Orlando practices offer both options, which can make scheduling easier and help you stay consistent with follow-up care.

Availability matters, too. If you're hoping to be seen soon, ask whether the provider has openings within the next few weeks. Practices with larger teams sometimes offer faster scheduling and more flexibility.

Finally, trust your intuition. A good psychiatric provider listens closely, communicates clearly, and creates a space where you feel comfortable discussing sensitive topics. If the first provider you meet with doesn't feel like the right fit, it's completely acceptable to explore other options.

Choosing a psychiatrist is a personal process, but with a thoughtful approach, you can find someone who supports your goals and makes your care feel manageable and grounded.`,

  "first-psychiatry-appointment-orlando": `Many adults feel uncertain about what a first psychiatry appointment will involve. Knowing what to expect can help the process feel more predictable and less stressful.

Your initial visit focuses on understanding your experiences, history, and goals. The psychiatric provider will ask about your symptoms, overall health, sleep patterns, stressors, and any past experiences with mental health support. There are no right or wrong answers — the purpose is to build a complete picture so your provider can offer the most helpful recommendations.

The conversation often starts broadly. You may discuss how you've been feeling over the past weeks or months, what led you to seek help now, and how your symptoms affect daily life. The provider may ask about work, relationships, routines, and anything that influences your mood or functioning.

You'll also have time to ask questions. Many people want to know what options might be available for care, how often follow-up visits happen, or how progress is monitored. Your provider will walk you through what to expect in future appointments and outline a realistic plan for next steps.

At the end of the visit, most patients leave with more clarity, a sense of direction, and an understanding of how their psychiatric care will move forward. The first appointment is about building comfort, setting expectations, and ensuring you feel supported from the start.`,

  "anxiety-treatment-options-orlando": `Anxiety is one of the most common reasons adults seek mental health support in Orlando. While symptoms vary from person to person, many people experience worry, tension, restlessness, or racing thoughts. The good news is that effective treatment options are widely available.

Therapy is often a core part of anxiety treatment. Evidence-based approaches such as cognitive behavioral therapy (CBT) help patients understand the connection between thoughts, emotions, and physical reactions. Therapists work with individuals to identify patterns, learn coping strategies, and develop a more balanced response to stressful situations.

Psychiatric support can also play an important role. A psychiatric provider helps evaluate how anxiety is affecting your life and offers guidance on care planning, follow-up visits, and long-term management strategies. Regular check-ins provide opportunities to adjust your plan as your needs change.

Lifestyle approaches can support treatment as well. Improving sleep routines, building more structure into your day, and reducing unnecessary stressors can help create a foundation that supports emotional regulation. Mindfulness, breathing techniques, and gentle physical activity can also be helpful additions.

Many adults in Orlando benefit from combining therapy with psychiatric care. Together, these approaches create a comprehensive plan that addresses both the emotional and practical aspects of anxiety. Treatment isn't one-size-fits-all — it's tailored to each person's goals, history, and daily responsibilities.

If anxiety is getting in the way of your relationships, work, or general well-being, support is available.`,

  "adhd-support-orlando-psychiatric-care": `ADHD affects adults in many ways, ranging from difficulties with focus and organization to challenges with time management, follow-through, and emotional regulation. While ADHD is often discussed in the context of children, many adults in Orlando seek help later in life when they recognize longstanding patterns affecting work or home.

A psychiatric provider can help clarify whether ADHD is contributing to your challenges. This process involves reviewing your history, discussing specific symptoms, and understanding how they impact daily functioning. Many adults describe losing track of tasks, feeling overwhelmed, or struggling to prioritize responsibilities.

Visits with a psychiatric provider also include planning. Together, you'll outline strategies that support your goals, whether that means improving focus, reducing distractions, or developing more structured routines. Follow-up appointments help you review progress and maintain accountability.

For many adults, a combination of practical routines, therapy-based skills, and ongoing psychiatric support provides the structure needed to manage symptoms over time. If you've been wondering whether ADHD affects your daily life, exploring an evaluation can offer clarity and direction.`,

  "online-psychiatry-orlando-virtual-care": `Online mental health care has become a convenient option for many adults in Orlando. Virtual psychiatry visits use secure video platforms to connect you with a licensed provider, offering flexibility when schedules or travel make in-person appointments difficult.

Patients often choose online visits for several reasons. Some prefer the comfort of being in their own space during conversations about mental health. Others appreciate the ability to schedule appointments around work or caregiving responsibilities.

Virtual appointments work much like in-person visits. You'll discuss your symptoms, history, and daily challenges, and your provider will help outline a plan for ongoing care. Follow-up visits provide opportunities to review progress and make adjustments as needed.

Online psychiatry can be especially helpful for adults who have busy schedules, limited transportation, or a preference for meeting from home. For many Orlando residents, it allows care to fit more naturally into daily life.

If you're unsure whether virtual care is right for you, your psychiatric provider can help you decide based on your needs and preferences.`,

  "understanding-depression-orlando": `Depression affects the mind, emotions, and body in a way that can make everyday life feel heavy or unmanageable. Many adults in Orlando experience periods of low mood, reduced motivation, difficulty concentrating, or changes in sleep.

Understanding depression begins with recognizing that it's a medical condition — not a personal weakness. A psychiatric provider can help identify whether what you're feeling aligns with depressive symptoms and outline a plan for support.

Treatment often involves therapy, psychiatric care, or a combination of both. Therapy provides space to understand your emotions, explore patterns that contribute to low mood, and develop strategies to manage stress. Psychiatric visits allow for regular check-ins and adjustments to your care plan.

Lifestyle changes also support recovery. Better sleep routines, consistent meals, gentle physical activity, and structured daily habits can all make a meaningful difference.

Depression is highly treatable, and many people begin to feel relief with the right support. If you've been feeling disconnected, overwhelmed, or stuck, reaching out is an important first step.`,

  "orlando-mental-health-resources-guide": `The Orlando area offers a wide range of mental health support, from community programs to private practices. Knowing what resources exist can help you decide what type of care fits your needs.

Therapy practices provide support for stress, trauma, anxiety, and many other concerns. Many offer in-person sessions, virtual appointments, or both. Therapists help you process emotions, develop coping strategies, and build healthier routines.

Psychiatric providers offer evaluations and help you create a plan for ongoing mental health care. Regular appointments help track progress, adjust your plan, and ensure your care aligns with your daily life and goals.

Community organizations also offer support groups, educational resources, and crisis assistance for individuals who need immediate help or ongoing guidance.

If you're unsure where to start, connecting first with a psychiatric provider or therapist can help you understand which type of care would be most helpful based on your situation.

Orlando has a strong network of mental health professionals, making it easier to find the support you need.`,

  "common-psychiatry-questions-orlando": `Patients often come to their first visit with questions. Knowing what others ask can help you prepare and feel more confident going in.

One common question is how long treatment will last. The answer depends on your symptoms, goals, and how you respond to care over time. Some people benefit from short-term support, while others prefer ongoing check-ins.

Another frequent question is how often follow-up visits happen. Many people meet with their provider every few weeks at first, then move to less frequent visits as they start to feel more stable and supported.

Patients also ask whether their provider will work with their therapist or primary care doctor. With your permission, coordination is often helpful and can make care feel more connected.

It's natural to have questions about your symptoms, care plan, and next steps. A good psychiatric provider welcomes questions and encourages open communication.`,

  "when-to-see-psychiatrist-orlando": `It isn't always easy to recognize when it's time to seek help. Symptoms can build gradually or appear suddenly during stressful periods.

Some common signs include persistent worry, low mood, difficulty focusing, disrupted sleep, or changes in motivation. You may also notice that daily responsibilities feel harder, relationships feel strained, or stress feels harder to manage.

Physical signs can show up too, such as headaches, restlessness, or fatigue connected to emotional strain.

If these symptoms have been affecting your daily life, relationships, or sense of well-being, it may be time to speak with a psychiatric provider. Early support can prevent symptoms from growing and help you feel more grounded and in control.

Reaching out is a strong, healthy step — not an indication of failure. Many adults in Orlando seek psychiatric support at various points in their lives.`,

  "therapy-vs-psychiatry-orlando": `Therapy and psychiatry each play important roles in mental health care, but they serve different purposes. Understanding the difference helps you decide where to begin.

Therapists focus on talk-based approaches that help you process emotions, examine patterns, and develop coping strategies. Therapy can be especially helpful for stress, trauma, relationship challenges, anxiety, and emotional regulation.

Psychiatric providers focus on evaluations, treatment planning, and ongoing support for mental health concerns. They help monitor symptoms over time and adjust your plan as needed. Many adults benefit from combining therapy and psychiatric care.

For Orlando patients, the best place to start often depends on your current concerns. If you're feeling anxious, overwhelmed, or stuck, therapy may be a helpful first step. If your symptoms significantly affect functioning or you want clarity about your mental health, starting with a psychiatric provider may be the right choice.

You don't have to pick only one. Many people find that working with both a therapist and a psychiatric provider gives them the most balanced support.`
};

async function importOrlandoBlogs() {
  const metadata: BlogMeta[] = JSON.parse(fs.readFileSync('orlando-blog-posts.json', 'utf-8'));
  const images: BlogImage[] = JSON.parse(fs.readFileSync('orlando-blog-images.json', 'utf-8'));

  // Create image map for quick lookup
  const imageMap: Record<string, BlogImage> = {};
  images.forEach(img => {
    imageMap[img.slug] = img;
  });

  // Calculate staggered publish dates (one per day starting tomorrow)
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 1); // Start tomorrow
  baseDate.setHours(9, 0, 0, 0); // 9 AM

  const postsToInsert = metadata.map((meta, index) => {
    const publishDate = new Date(baseDate);
    publishDate.setDate(publishDate.getDate() + index);

    const image = imageMap[meta.slug];
    const content = blogContent[meta.slug] || '';

    // Create excerpt (first 2 sentences)
    const sentences = content.split(/\.\s+/).slice(0, 2);
    const excerpt = sentences.join('. ') + '.';

    return {
      title: meta.title,
      slug: meta.slug,
      excerpt,
      content,
      author: "Empathy Health Clinic",
      publishedDate: publishDate.toISOString().split('T')[0],
      category: meta.category,
      featuredImage: image?.imageUrl || '',
      isFeatured: index === 0, // Make first post featured
      status: 'scheduled',
      scheduledPublishAt: publishDate.toISOString(),
      publishedAt: null,
      metaTitle: meta.metaTitle,
      metaDescription: meta.metaDescription,
      keywords: meta.keywords,
      ogImage: image?.imageUrl || null,
      canonicalSlug: meta.slug,
      order: 1000 + index
    };
  });

  // Insert all posts
  for (const post of postsToInsert) {
    try {
      await db.insert(blogPosts).values(post);
      console.log(`✓ Created scheduled post: ${post.slug} (publishes ${post.scheduledPublishAt})`);
    } catch (error: any) {
      console.error(`✗ Error creating ${post.slug}:`, error.message);
    }
  }

  console.log(`\n✓ Imported ${postsToInsert.length} Orlando blog posts with staggered publish dates`);
  console.log(`First post publishes: ${postsToInsert[0].scheduledPublishAt}`);
  console.log(`Last post publishes: ${postsToInsert[postsToInsert.length - 1].scheduledPublishAt}`);
}

importOrlandoBlogs().then(() => process.exit(0));
