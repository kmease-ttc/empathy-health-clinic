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

async function expandFullDescription(title: string, currentDesc: string): Promise<string> {
  const client = getOpenAI();
  
  const prompt = `You are an expert medical content writer for Empathy Health Clinic, a mental health clinic in Winter Park, FL. 

TASK: Expand this mental health condition description to 400-500 words of comprehensive, SEO-optimized content.

CURRENT: "${currentDesc}"

REQUIREMENTS:
- Target 400-500 words
- Professional medical tone, patient-focused
- Include keywords: "${title}", "Winter Park", "Orlando", "mental health", "treatment"
- Cover: what the condition is, symptoms, who's affected, treatment approaches, outcomes
- Empathetic, supportive, non-stigmatizing tone
- NO emojis, NO bullet points, NO headers within paragraphs
- Write flowing paragraphs with \\n\\n between them
- Include specific treatment modalities available at Empathy Health Clinic

Write expanded fullDescription:`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are an expert mental health content writer." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  return completion.choices[0]?.message?.content?.trim() || currentDesc;
}

// Conditions needing expansion
const conditionsToExpand = [
  { slug: "personality-disorders", title: "Personality Disorders" },
  { slug: "eating-disorders", title: "Eating Disorders" },
  { slug: "postpartum-depression-perinatal-mood-disorders", title: "Postpartum Depression & Perinatal Mood Disorders" },
  { slug: "schizophrenia-psychotic-disorders", title: "Schizophrenia & Psychotic Disorders" },
];

async function main() {
  console.log('\n🚀 Expanding Condition Full Descriptions\n');
  
  const storagePath = 'server/storage.ts';
  let storageContent = readFileSync(storagePath, 'utf-8');
  let totalExpanded = 0;
  
  for (const condition of conditionsToExpand) {
    try {
      // Find the slug location
      const slugIndex = storageContent.indexOf(`slug: "${condition.slug}"`);
      
      if (slugIndex === -1) {
        console.log(`⚠️  Slug not found: ${condition.slug}`);
        continue;
      }
      
      // Find fullDescription field after slug
      const searchWindow = storageContent.substring(slugIndex, slugIndex + 3000);
      const fullDescPattern = /fullDescription:\s*"([^"]*(?:\\.[^"]*)*)"/;
      const match = searchWindow.match(fullDescPattern);
      
      if (!match) {
        console.log(`⚠️  fullDescription not found for: ${condition.slug}`);
        continue;
      }
      
      const currentDesc = match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
      const wordCount = currentDesc.split(/\s+/).length;
      
      if (wordCount >= 300) {
        console.log(`✓ ${condition.title}: ${wordCount} words (already expanded)\n`);
        continue;
      }
      
      console.log(`Expanding: ${condition.title} (${wordCount} → 450 words)`);
      
      // Generate expanded content
      const expandedDesc = await expandFullDescription(condition.title, currentDesc);
      const newWordCount = expandedDesc.split(/\s+/).length;
      
      // Escape for TypeScript string
      const escapedDesc = expandedDesc.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n\n/g, '\\n\\n');
      
      // Replace in file
      const fullMatch = `fullDescription: "${match[1]}"`;
      const replacement = `fullDescription: "${escapedDesc}"`;
      storageContent = storageContent.replace(fullMatch, replacement);
      
      console.log(`  ✓ Expanded to ${newWordCount} words\n`);
      totalExpanded++;
      
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } catch (error) {
      console.error(`❌ Error processing ${condition.title}:`, error);
    }
  }
  
  // Write updated file
  writeFileSync(storagePath, storageContent, 'utf-8');
  
  console.log(`\n✅ Complete! Expanded ${totalExpanded} condition descriptions`);
  console.log(`💾 Updated ${storagePath}\n`);
}

main().catch(console.error);
