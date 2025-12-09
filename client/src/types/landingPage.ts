import { z } from "zod";
import { LucideIcon } from "lucide-react";

export const FAQItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const ServiceFeatureSchema = z.object({
  icon: z.any(), // LucideIcon component
  title: z.string(),
  description: z.string(),
});

export const WhyChoosePointSchema = z.object({
  icon: z.any(), // LucideIcon component
  title: z.string(),
  description: z.string(),
});

export const ConditionSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

export const QuickLinkSchema = z.object({
  href: z.string(),
  label: z.string(),
});

export const AuthoritativeSourceSchema = z.object({
  source: z.enum(["NIMH", "APA", "NIH", "MayoClinic", "SAMHSA", "CDC", "WHO"]),
  topic: z.string().optional(),
});

export const LandingPageConfigSchema = z.object({
  // SEO Data
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    canonicalPath: z.string(),
  }),
  
  // Schema.org JSON-LD
  jsonLd: z.record(z.any()),
  
  // Hero Section
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
    ctaPrimary: z.string(),
    ctaSecondary: z.string().optional(),
    heroImage: z.string(), // Import path
  }),
  
  // Proof/Trust Bar
  proofBar: z.object({
    googleRating: z.number().optional().default(4.8),
    showVerifiedBadge: z.boolean().optional().default(true),
    highlights: z.array(z.string()).optional(),
  }).optional(),
  
  // Location & Contact
  location: z.object({
    title: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    phone: z.string(),
    phoneDisplay: z.string(),
    hours: z.string(),
    mapUrl: z.string(),
  }),
  
  // Main Content
  content: z.object({
    mainHeading: z.string(),
    introduction: z.array(z.string()).optional().default([]),
    conditionsHeading: z.string().optional(),
    conditions: z.array(ConditionSchema).optional(),
    servicesHeading: z.string().optional(),
    services: z.array(ServiceFeatureSchema).optional(),
    whyChooseHeading: z.string().optional(),
    whyChoosePoints: z.array(WhyChoosePointSchema).optional(),
    authoritativeSources: z.array(AuthoritativeSourceSchema).optional(),
    showTrustFactors: z.boolean().optional().default(true),
    internalLinksCategory: z.enum(["services", "conditions", "treatments", "locations", "insurance"]).optional(),
    quickLinks: z.array(QuickLinkSchema).optional(),
    faqHeading: z.string().optional(),
    faqs: z.array(FAQItemSchema).optional(),
  }),
  
  // FAQ Section
  faqs: z.array(FAQItemSchema).optional(),
  
  // Sidebar (optional - uses defaults if not provided)
  sidebar: z.object({
    formHeading: z.string(),
    formSubheading: z.string(),
    formType: z.string(),
    quickLinks: z.array(QuickLinkSchema).optional(),
  }).optional(),
  
  // Analytics
  analytics: z.object({
    pageName: z.string(),
    conversionCategory: z.string(),
  }),
});

export type LandingPageConfig = z.infer<typeof LandingPageConfigSchema>;
export type FAQItem = z.infer<typeof FAQItemSchema>;
export type ServiceFeature = z.infer<typeof ServiceFeatureSchema>;
export type WhyChoosePoint = z.infer<typeof WhyChoosePointSchema>;
export type Condition = z.infer<typeof ConditionSchema>;
export type QuickLink = z.infer<typeof QuickLinkSchema>;
