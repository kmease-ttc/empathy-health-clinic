import { IStorage } from './storage';

/**
 * Service to analyze empathyhealthclinic.com content and identify strategic blog opportunities
 */
export class ContentAnalyzerService {
  constructor(private storage: IStorage) {}

  /**
   * Analyze the entire site to identify the best next blog topic
   * This considers:
   * - Existing services, treatments, and conditions
   * - Current blog articles
   * - Keyword coverage gaps
   * - SEO value and strategic importance
   */
  async analyzeSiteAndSuggestTopic(): Promise<{
    topic: string;
    keywords: string;
    reasoning: string;
    priority: number;
  }> {
    console.log('🔍 Analyzing empathyhealthclinic.com for strategic blog opportunities...');

    // 1. Get all services, treatments, conditions
    const [treatments, therapies, conditions, blogs] = await Promise.all([
      this.storage.getAllTreatments(),
      this.storage.getAllTherapies(),
      this.storage.getAllConditions(),
      this.storage.getAllBlogPosts(),
    ]);

    console.log(`📊 Found ${treatments.length} treatments, ${therapies.length} therapies, ${conditions.length} conditions, ${blogs.length} existing blogs`);

    // 2. Extract all available topics from services
    const availableTopics = new Set<string>();
    
    treatments.forEach((t) => {
      availableTopics.add(t.title);
      if (t.description) availableTopics.add(t.description.substring(0, 50));
    });
    
    therapies.forEach((t) => {
      availableTopics.add(t.title);
      if (t.description) availableTopics.add(t.description.substring(0, 50));
    });
    
    conditions.forEach((c) => {
      availableTopics.add(c.title);
      if (c.description) availableTopics.add(c.description.substring(0, 50));
    });

    // 3. Extract existing blog topics
    const existingBlogTopics = new Set<string>();
    blogs.forEach((blog) => {
      existingBlogTopics.add(blog.title.toLowerCase());
      if (blog.content) {
        // Extract main topic from H1
        const h1Match = blog.content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        if (h1Match) existingBlogTopics.add(h1Match[1].toLowerCase());
      }
    });

    console.log(`✅ Identified ${existingBlogTopics.size} existing blog topics`);

    // 4. Define strategic keyword clusters (high-value topics for mental health clinic)
    const strategicTopics = [
      // Treatment-focused
      { topic: 'EMDR Therapy for Trauma Recovery', keywords: 'EMDR therapy, trauma treatment, EMDR counseling', priority: 10 },
      { topic: 'Cognitive Behavioral Therapy for Anxiety Disorders', keywords: 'CBT for anxiety, cognitive behavioral therapy, anxiety treatment', priority: 9 },
      { topic: 'Medication Management for Depression', keywords: 'depression medication, psychiatric medication management, antidepressants', priority: 9 },
      { topic: 'Dialectical Behavior Therapy for Emotional Regulation', keywords: 'DBT therapy, emotional regulation, dialectical behavior therapy', priority: 8 },
      
      // Condition-focused
      { topic: 'Understanding and Treating Social Anxiety Disorder', keywords: 'social anxiety disorder, social anxiety treatment, social phobia therapy', priority: 8 },
      { topic: 'Bipolar Disorder: Symptoms and Treatment Options', keywords: 'bipolar disorder treatment, bipolar symptoms, mood disorder therapy', priority: 9 },
      { topic: 'PTSD Treatment: Evidence-Based Approaches', keywords: 'PTSD treatment, post-traumatic stress disorder therapy, trauma recovery', priority: 9 },
      { topic: 'Managing Panic Disorder and Panic Attacks', keywords: 'panic disorder treatment, panic attack therapy, anxiety disorder counseling', priority: 8 },
      { topic: 'OCD Treatment: Breaking the Cycle', keywords: 'OCD treatment, obsessive compulsive disorder therapy, OCD counseling', priority: 8 },
      { topic: 'ADHD in Adults: Diagnosis and Treatment', keywords: 'adult ADHD treatment, ADHD therapy, attention deficit disorder', priority: 7 },
      
      // Therapy approach focused
      { topic: 'Virtual Therapy: Benefits of Online Mental Health Care', keywords: 'virtual therapy, online counseling, telehealth mental health', priority: 7 },
      { topic: 'Group Therapy vs Individual Therapy: Which Is Right for You?', keywords: 'group therapy, individual therapy, therapy options', priority: 6 },
      { topic: 'Mindfulness-Based Stress Reduction for Anxiety', keywords: 'mindfulness therapy, stress reduction, mindfulness-based therapy', priority: 7 },
      
      // Wellness and prevention
      { topic: 'Building Resilience: Mental Health Strategies for Adults', keywords: 'mental health resilience, emotional wellness, mental health strategies', priority: 6 },
      { topic: 'Recognizing Signs of Depression in Adults', keywords: 'depression symptoms, signs of depression, adult depression', priority: 8 },
      { topic: 'When to Seek Professional Mental Health Help', keywords: 'mental health help, when to see therapist, counseling support', priority: 7 },
      
      // Specialized treatments
      { topic: 'Couples Therapy: Strengthening Relationships', keywords: 'couples therapy, relationship counseling, marriage therapy', priority: 6 },
      { topic: 'Grief Counseling: Navigating Loss and Healing', keywords: 'grief counseling, bereavement therapy, loss support', priority: 7 },
      { topic: 'Anger Management Therapy for Adults', keywords: 'anger management therapy, anger counseling, emotional regulation', priority: 6 },
      
      // Local SEO focused
      { topic: 'Finding Quality Mental Health Care in Orlando', keywords: 'Orlando mental health, Orlando therapy, Winter Park counseling', priority: 8 },
      { topic: 'Telehealth Psychiatry Services in Florida', keywords: 'Florida telehealth psychiatry, virtual psychiatrist Florida, online therapy Florida', priority: 7 },
    ];

    // 5. Filter out topics we already have blogs about
    const uncoveredTopics = strategicTopics.filter(st => {
      const topicLower = st.topic.toLowerCase();
      const hasExisting = Array.from(existingBlogTopics).some(existingTopic => 
        topicLower.includes(existingTopic) || existingTopic.includes(topicLower.split(':')[0].trim().toLowerCase())
      );
      return !hasExisting;
    });

    console.log(`🎯 Found ${uncoveredTopics.length} strategic topics not yet covered`);

    // 6. Cross-reference with actual services offered
    const serviceNames = [
      ...treatments.map((t) => t.title.toLowerCase()),
      ...therapies.map((t) => t.title.toLowerCase()),
      ...conditions.map((c) => c.title.toLowerCase()),
    ];

    const serviceAlignedTopics = uncoveredTopics.map(topic => {
      // Calculate relevance score based on service alignment
      let relevanceBoost = 0;
      const topicWords = topic.topic.toLowerCase().split(' ');
      
      serviceNames.forEach((serviceName) => {
        topicWords.forEach((word) => {
          if (serviceName.includes(word) || word.includes(serviceName)) {
            relevanceBoost += 2; // Boost priority if topic aligns with actual service
          }
        });
      });

      return {
        ...topic,
        priority: topic.priority + relevanceBoost,
      };
    });

    // 7. Sort by priority (highest first)
    serviceAlignedTopics.sort((a, b) => b.priority - a.priority);

    // 8. Return the highest-priority topic
    if (serviceAlignedTopics.length === 0) {
      // Fallback: Create a generic topic based on most common service
      const mostCommonService = treatments[0]?.title || therapies[0]?.title || conditions[0]?.title || 'Mental Health';
      return {
        topic: `Comprehensive Guide to ${mostCommonService}`,
        keywords: `${mostCommonService.toLowerCase()}, ${mostCommonService.toLowerCase()} treatment, ${mostCommonService.toLowerCase()} therapy`,
        reasoning: 'Generated from most prominent service offering - no strategic topics remaining',
        priority: 5,
      };
    }

    const bestTopic = serviceAlignedTopics[0];
    
    console.log(`✨ Selected topic: "${bestTopic.topic}" (Priority: ${bestTopic.priority})`);

    return {
      topic: bestTopic.topic,
      keywords: bestTopic.keywords,
      reasoning: `High-value topic (priority ${bestTopic.priority}) that aligns with clinic services and fills content gap. Not yet covered in existing ${blogs.length} blog articles.`,
      priority: bestTopic.priority,
    };
  }

  /**
   * Analyze all content gaps and return a prioritized list of blog opportunities
   */
  async getContentGaps(): Promise<Array<{
    topic: string;
    keywords: string;
    priority: number;
    reason: string;
  }>> {
    const [treatments, therapies, conditions, blogs] = await Promise.all([
      this.storage.getAllTreatments(),
      this.storage.getAllTherapies(),
      this.storage.getAllConditions(),
      this.storage.getAllBlogPosts(),
    ]);

    const existingBlogTopics = new Set<string>();
    blogs.forEach((blog) => {
      existingBlogTopics.add(blog.title.toLowerCase());
    });

    // Define all strategic topics
    const allTopics = [
      { topic: 'EMDR Therapy for Trauma Recovery', keywords: 'EMDR therapy, trauma treatment, EMDR counseling', priority: 10, reason: 'High-value specialty treatment' },
      { topic: 'CBT for Anxiety Disorders', keywords: 'CBT for anxiety, cognitive behavioral therapy, anxiety treatment', priority: 9, reason: 'Common treatment approach' },
      { topic: 'Medication Management for Depression', keywords: 'depression medication, psychiatric medication management', priority: 9, reason: 'Core psychiatric service' },
      { topic: 'Social Anxiety Disorder Treatment', keywords: 'social anxiety disorder, social anxiety treatment', priority: 8, reason: 'Common condition' },
      { topic: 'Bipolar Disorder Treatment Options', keywords: 'bipolar disorder treatment, bipolar symptoms, mood disorder', priority: 9, reason: 'Complex psychiatric condition' },
      { topic: 'PTSD Treatment Approaches', keywords: 'PTSD treatment, trauma therapy, post-traumatic stress', priority: 9, reason: 'Specialty trauma treatment' },
      { topic: 'Virtual Therapy Benefits', keywords: 'virtual therapy, online counseling, telehealth', priority: 7, reason: 'Growing service demand' },
      { topic: 'Adult ADHD Diagnosis and Treatment', keywords: 'adult ADHD, ADHD treatment, attention deficit', priority: 7, reason: 'Underserved adult population' },
      { topic: 'Orlando Mental Health Services', keywords: 'Orlando mental health, Orlando therapy, Winter Park counseling', priority: 8, reason: 'Local SEO opportunity' },
    ];

    // Filter uncovered topics
    const gaps = allTopics.filter(t => {
      const hasExisting = Array.from(existingBlogTopics).some(existing => 
        existing.includes(t.topic.toLowerCase().substring(0, 20))
      );
      return !hasExisting;
    });

    return gaps.sort((a, b) => b.priority - a.priority);
  }
}
