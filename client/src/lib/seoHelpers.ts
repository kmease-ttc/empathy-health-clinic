/**
 * SEO Helper Functions
 * Centralized utilities for consistent SEO formatting across the application
 */

const MIN_H1_LENGTH = 20;
const MAX_H1_LENGTH = 70;

const LOWERCASE_WORDS = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'in', 'of', 'vs']);

const UPPERCASE_PRESERVE = new Set([
  'FL', 'ADHD', 'CBT', 'DBT', 'EMDR', 'OCD', 'PTSD', 'TMS', 'GAD',
  'BCBS', 'UMR', 'UHC', 'PPO', 'HMO', 'EPO',
  'II', 'III', 'IV',
]);

/**
 * Convert string to Title Case (AP style)
 * Preserves uppercase abbreviations (FL, ADHD, etc.)
 * Handles common lowercase words that should stay lowercase except at start
 */
export function toTitleCase(str: string): string {
  return str.split(' ').map((word, index) => {
    if (UPPERCASE_PRESERVE.has(word.toUpperCase())) {
      return word.toUpperCase();
    }
    if (index === 0 || !LOWERCASE_WORDS.has(word.toLowerCase())) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return word.toLowerCase();
  }).join(' ');
}

/**
 * Format H1 tag for SEO compliance
 * - Preserves already-compliant H1s (within 20-70 chars without pipe)
 * - Enforces Title Case while preserving uppercase abbreviations
 * - Removes pipe symbols and replaces with dash if needed
 * - Trims to max length at word boundary
 */
export function formatH1(h1: string): string {
  if (!h1) return '';
  
  let formatted = h1.trim();
  
  if (!formatted.includes('|') && formatted.length >= MIN_H1_LENGTH && formatted.length <= MAX_H1_LENGTH) {
    return formatted;
  }
  
  formatted = formatted.replace(/\s*\|\s*/g, ' - ');
  formatted = formatted.replace(/\s+/g, ' ');
  formatted = toTitleCase(formatted);
  
  if (formatted.length > MAX_H1_LENGTH) {
    const words = formatted.split(' ');
    let result = '';
    for (const word of words) {
      if ((result + ' ' + word).trim().length <= MAX_H1_LENGTH) {
        result = (result + ' ' + word).trim();
      } else {
        break;
      }
    }
    formatted = result;
  }
  
  return formatted;
}

/**
 * Validate H1 tag meets SEO requirements
 * Returns issues array (empty if valid)
 */
export function validateH1(h1: string): string[] {
  const issues: string[] = [];
  
  if (!h1 || h1.trim().length === 0) {
    issues.push('H1 is missing');
    return issues;
  }
  
  if (h1.length < MIN_H1_LENGTH) {
    issues.push(`H1 too short (${h1.length} chars, minimum ${MIN_H1_LENGTH})`);
  }
  
  if (h1.length > MAX_H1_LENGTH) {
    issues.push(`H1 too long (${h1.length} chars, maximum ${MAX_H1_LENGTH})`);
  }
  
  if (h1.includes('|')) {
    issues.push('H1 contains pipe character (use dash instead)');
  }
  
  if (h1.toLowerCase().startsWith('welcome')) {
    issues.push('H1 starts with generic "Welcome" text');
  }
  
  return issues;
}

/**
 * Orlando cluster H1 mapping
 * Unique H1s for each Orlando page to prevent cannibalization
 */
export const ORLANDO_H1_MAP: Record<string, string> = {
  '/psychiatrist-orlando': 'Psychiatrist Orlando',
  '/psychiatry-clinic-orlando': 'Psychiatry Clinic in Orlando',
  '/adhd-psychiatrist-orlando': 'ADHD Psychiatrist Orlando',
  '/anxiety-psychiatrist-orlando': 'Anxiety Psychiatrist Orlando',
  '/bipolar-psychiatrist-orlando': 'Bipolar Psychiatrist Orlando',
  '/medication-management-orlando': 'Medication Management Orlando',
  '/telepsychiatry-orlando': 'Telepsychiatry Orlando',
  '/same-day-psychiatrist-orlando': 'Same-Day Psychiatrist Orlando',
  '/therapist-orlando': 'Therapist in Orlando, FL',
  '/counseling-orlando': 'Counseling in Orlando, FL',
  '/psychologist-orlando': 'Psychologist in Orlando, FL',
  '/psychiatry-orlando': 'Psychiatry Services Orlando',
  '/mental-health-services-orlando': 'Mental Health Services Orlando',
  '/mental-health-clinic-orlando': 'Mental Health Clinic Orlando',
  '/psychiatric-evaluation-orlando': 'Psychiatric Evaluation Orlando',
};

/**
 * Location page H1 mapping
 * Concise city names for location-specific pages
 * Note: These entries are for reference/validation. Actual H1s may be
 * hardcoded in components. Use getOptimizedH1() or formatH1() for consistency.
 */
export const LOCATION_H1_MAP: Record<string, string> = {
  '/winter-park': 'Psychiatrist Winter Park',
  '/locations/winter-park': 'Psychiatrist Winter Park',
  '/psychiatrist-winter-park': 'Psychiatrist Winter Park',
  '/altamonte-springs': 'Psychiatrist Altamonte Springs',
  '/locations/altamonte-springs': 'Psychiatrist Altamonte Springs',
  '/kissimmee': 'Psychiatrist Kissimmee',
  '/locations/kissimmee': 'Psychiatrist Kissimmee',
  '/lake-mary': 'Psychiatrist Lake Mary',
  '/locations/lake-mary': 'Psychiatrist Lake Mary',
  '/sanford': 'Psychiatrist Sanford',
  '/locations/sanford': 'Psychiatrist Sanford',
  '/apopka': 'Psychiatrist Apopka',
  '/locations/apopka': 'Psychiatrist Apopka',
  '/maitland': 'Therapist Maitland',
  '/therapist-maitland': 'Therapist Maitland',
  '/casselberry': 'Psychiatrist Casselberry',
  '/oviedo': 'Therapy Oviedo',
  '/therapy-oviedo': 'Therapy Oviedo',
};

/**
 * Condition page H1 mapping
 * Location-specific H1s for condition pages
 */
export const CONDITION_H1_MAP: Record<string, string> = {
  '/depression': 'Depression Treatment in Orlando, FL',
  '/depression-treatment': 'Depression Treatment in Orlando, FL',
  '/depression-counseling': 'Depression Counseling in Orlando, FL',
  '/anxiety': 'Anxiety Treatment in Orlando, FL',
  '/anxiety-therapy': 'Anxiety Therapy in Orlando, FL',
  '/ptsd': 'PTSD Treatment in Orlando, FL',
  '/ptsd-treatment': 'PTSD Treatment in Orlando, FL',
  '/bipolar': 'Bipolar Disorder Treatment in Orlando, FL',
  '/bipolar-disorder': 'Bipolar Disorder Treatment in Orlando, FL',
  '/ocd': 'OCD Treatment in Orlando, FL',
  '/ocd-treatment': 'OCD Treatment in Orlando, FL',
  '/eating-disorders': 'Eating Disorder Treatment in Orlando, FL',
  '/trauma-specialist': 'Trauma Specialist in Orlando, FL',
  '/stress-management': 'Stress Management in Orlando, FL',
};

/**
 * Get optimized H1 for a path
 * Checks all H1 maps and returns the optimized version
 */
export function getOptimizedH1(path: string, fallbackH1?: string): string {
  const normalizedPath = path.toLowerCase().replace(/\/$/, '');
  
  if (ORLANDO_H1_MAP[normalizedPath]) {
    return ORLANDO_H1_MAP[normalizedPath];
  }
  
  if (LOCATION_H1_MAP[normalizedPath]) {
    return LOCATION_H1_MAP[normalizedPath];
  }
  
  if (CONDITION_H1_MAP[normalizedPath]) {
    return CONDITION_H1_MAP[normalizedPath];
  }
  
  if (fallbackH1) {
    return formatH1(fallbackH1);
  }
  
  return '';
}

// ============================================================================
// H2 Formatting and Optimization
// ============================================================================

const MAX_H2_LENGTH = 70;

/**
 * Generic H2s that should be replaced with keyword-focused alternatives
 * Includes variations with punctuation and plurals
 */
const GENERIC_H2S = new Set([
  'overview',
  'introduction',
  'our services',
  'services',
  'mental health treatment',
  'additional information',
  'learn more',
  'faq',
  'faqs',
  'frequently asked questions',
  'contact us',
  'treatment',
  'symptoms',
  'causes',
  'our approach',
  'why choose us',
  'why choose us?',
  'why us',
  'why us?',
  'about us',
  'our team',
  'our providers',
  'psychiatry services',
  'mental health care',
  'get started',
  'next steps',
  'resources',
  'what we offer',
  'what we do',
]);

const MIN_H2_LENGTH = 25;

/**
 * Format H2 tag for SEO compliance
 * - Enforces 25-70 char length limits for ALL inputs
 * - Enforces Title Case while preserving abbreviations
 * - Rejects generic headings and returns safe fallback
 * - Trims to max 70 chars at word boundary
 */
export function formatH2(h2: string, fallback?: string): string {
  if (!h2) return fallback ? formatH2(fallback) : '';
  
  let formatted = h2.trim();
  
  // Check if the input is a generic heading that should be replaced
  const normalized = formatted.toLowerCase().replace(/[?!.:]/g, '');
  if (GENERIC_H2S.has(normalized)) {
    // Return fallback if provided and different from original, otherwise add context
    if (fallback && fallback.toLowerCase().trim() !== h2.toLowerCase().trim()) {
      return formatH2(fallback);
    }
    // Add contextual suffix to make it less generic
    formatted = formatted.replace(/\?$/, '') + ' - Mental Health Services';
  }
  
  // Apply Title Case formatting
  formatted = toTitleCase(formatted);
  
  // Ensure minimum length by adding context - applies to ALL headings below 25 chars
  if (formatted.length < MIN_H2_LENGTH) {
    // Add context suffix to ensure minimum length compliance
    formatted = formatted + ' in Orlando, FL';
    // If still too short, add more context
    if (formatted.length < MIN_H2_LENGTH) {
      formatted = formatted.replace(' in Orlando, FL', ' - Expert Care in Orlando, FL');
    }
  }
  
  // Trim to max length at word boundary
  if (formatted.length > MAX_H2_LENGTH) {
    const words = formatted.split(' ');
    let result = '';
    for (const word of words) {
      if ((result + ' ' + word).trim().length <= MAX_H2_LENGTH) {
        result = (result + ' ' + word).trim();
      } else {
        break;
      }
    }
    formatted = result;
  }
  
  return formatted;
}

/**
 * Check if an H2 is generic/weak and needs improvement
 * Returns true if the H2 is too short, generic, or lacks specificity
 */
export function isGenericH2(h2: string): boolean {
  if (!h2 || h2.trim().length === 0) return true;
  
  const normalized = h2.toLowerCase().trim().replace(/[?!.:]/g, '');
  
  // Check against known generic headings
  if (GENERIC_H2S.has(normalized)) return true;
  
  // Check for short generic headings (less than min length)
  if (h2.length < MIN_H2_LENGTH) {
    // Allow short but specific headings containing keywords
    const specificKeywords = ['adhd', 'bipolar', 'anxiety', 'depression', 'orlando', 'treatment', 'therapy', 'psychiatry'];
    const hasSpecificKeyword = specificKeywords.some(k => normalized.includes(k));
    if (!hasSpecificKeyword) return true;
  }
  
  return false;
}

/**
 * Validate H2 tag meets SEO requirements
 * Returns issues array (empty if valid)
 */
export function validateH2(h2: string): string[] {
  const issues: string[] = [];
  
  if (!h2 || h2.trim().length === 0) {
    issues.push('H2 is missing');
    return issues;
  }
  
  if (h2.length < MIN_H2_LENGTH) {
    issues.push(`H2 too short (${h2.length} chars, minimum ${MIN_H2_LENGTH})`);
  }
  
  if (h2.length > MAX_H2_LENGTH) {
    issues.push(`H2 too long (${h2.length} chars, maximum ${MAX_H2_LENGTH})`);
  }
  
  if (isGenericH2(h2)) {
    issues.push('H2 is generic and needs keyword focus');
  }
  
  return issues;
}

/**
 * Orlando cluster H2 sets - unique H2s for each page to prevent cannibalization
 * Each page gets its own set of contextual H2s
 */
export const ORLANDO_H2_MAP: Record<string, { main: string; conditions: string; services: string; whyUs: string; process?: string }> = {
  '/psychiatrist-orlando': {
    main: 'Psychiatric Care in Orlando',
    conditions: 'Conditions Our Orlando Psychiatrists Treat',
    services: 'Orlando Psychiatry Services',
    whyUs: 'Why Choose Our Orlando Psychiatry Team',
    process: 'Your First Orlando Psychiatry Appointment',
  },
  '/psychiatry-clinic-orlando': {
    main: 'Full-Service Psychiatry Clinic in Orlando',
    conditions: 'Mental Health Conditions We Specialize In',
    services: 'Comprehensive Psychiatric Services',
    whyUs: 'Why Patients Choose Our Orlando Clinic',
    process: 'Getting Started at Our Orlando Psychiatry Clinic',
  },
  '/adhd-psychiatrist-orlando': {
    main: 'ADHD Evaluation and Treatment in Orlando',
    conditions: 'ADHD Symptoms We Evaluate',
    services: 'ADHD Testing and Medication Management',
    whyUs: 'Why Choose Our Orlando ADHD Specialists',
    process: 'ADHD Assessment Process',
  },
  '/anxiety-psychiatrist-orlando': {
    main: 'Anxiety Disorder Treatment in Orlando',
    conditions: 'Types of Anxiety Disorders We Treat',
    services: 'Anxiety Medication and Therapy Options',
    whyUs: 'Why Choose Our Orlando Anxiety Specialists',
    process: 'Starting Anxiety Treatment',
  },
  '/bipolar-psychiatrist-orlando': {
    main: 'Bipolar Disorder Treatment in Orlando',
    conditions: 'Bipolar Symptoms and Diagnosis',
    services: 'Mood Stabilization and Medication Management',
    whyUs: 'Why Choose Our Orlando Bipolar Specialists',
    process: 'Bipolar Disorder Evaluation Process',
  },
  '/medication-management-orlando': {
    main: 'Psychiatric Medication Management in Orlando',
    conditions: 'Conditions Treated With Medication',
    services: 'Our Medication Management Approach',
    whyUs: 'Why Choose Our Orlando Medication Specialists',
    process: 'How Medication Management Works',
  },
  '/telepsychiatry-orlando': {
    main: 'Virtual Psychiatry Appointments in Orlando',
    conditions: 'Conditions Treated Via Telepsychiatry',
    services: 'Online Psychiatric Services',
    whyUs: 'Why Choose Orlando Telepsychiatry',
    process: 'How Telepsychiatry Appointments Work',
  },
  '/same-day-psychiatrist-orlando': {
    main: 'Urgent Same-Day Psychiatric Care in Orlando',
    conditions: 'Urgent Mental Health Conditions We Treat',
    services: 'Same-Day Psychiatric Evaluation',
    whyUs: 'Why Choose Our Same-Day Orlando Psychiatry',
    process: 'Getting a Same-Day Appointment',
  },
};

/**
 * Location page H2 sets with geographic modifiers
 */
export const LOCATION_H2_MAP: Record<string, { main: string; conditions: string; services: string; whyUs: string }> = {
  '/winter-park': {
    main: 'Psychiatry Services in Winter Park, FL',
    conditions: 'Mental Health Conditions We Treat in Winter Park',
    services: 'Psychiatric Care for Winter Park Residents',
    whyUs: 'Why Winter Park Patients Choose Empathy Health',
  },
  '/altamonte-springs': {
    main: 'Psychiatry Services in Altamonte Springs, FL',
    conditions: 'Mental Health Conditions We Treat in Altamonte Springs',
    services: 'Psychiatric Care for Altamonte Springs Residents',
    whyUs: 'Why Altamonte Springs Patients Choose Empathy Health',
  },
  '/kissimmee': {
    main: 'Psychiatry Services in Kissimmee, FL',
    conditions: 'Mental Health Conditions We Treat in Kissimmee',
    services: 'Psychiatric Care for Kissimmee Residents',
    whyUs: 'Why Kissimmee Patients Choose Empathy Health',
  },
  '/lake-mary': {
    main: 'Psychiatry Services in Lake Mary, FL',
    conditions: 'Mental Health Conditions We Treat in Lake Mary',
    services: 'Psychiatric Care for Lake Mary Residents',
    whyUs: 'Why Lake Mary Patients Choose Empathy Health',
  },
  '/sanford': {
    main: 'Psychiatry Services in Sanford, FL',
    conditions: 'Mental Health Conditions We Treat in Sanford',
    services: 'Psychiatric Care for Sanford Residents',
    whyUs: 'Why Sanford Patients Choose Empathy Health',
  },
  '/apopka': {
    main: 'Psychiatry Services in Apopka, FL',
    conditions: 'Mental Health Conditions We Treat in Apopka',
    services: 'Psychiatric Care for Apopka Residents',
    whyUs: 'Why Apopka Patients Choose Empathy Health',
  },
  '/maitland': {
    main: 'Therapy Services in Maitland, FL',
    conditions: 'Mental Health Conditions We Treat in Maitland',
    services: 'Counseling and Therapy for Maitland Residents',
    whyUs: 'Why Maitland Patients Choose Empathy Health',
  },
  '/casselberry': {
    main: 'Psychiatry Services in Casselberry, FL',
    conditions: 'Mental Health Conditions We Treat in Casselberry',
    services: 'Psychiatric Care for Casselberry Residents',
    whyUs: 'Why Casselberry Patients Choose Empathy Health',
  },
  '/oviedo': {
    main: 'Therapy Services in Oviedo, FL',
    conditions: 'Mental Health Conditions We Treat in Oviedo',
    services: 'Counseling and Therapy for Oviedo Residents',
    whyUs: 'Why Oviedo Patients Choose Empathy Health',
  },
};

/**
 * Insurance page H2 sets with insurer-specific keywords
 */
export const INSURANCE_H2_MAP: Record<string, { main: string; coverage: string; services: string; whyUs: string }> = {
  '/aetna': {
    main: 'Aetna Mental Health Coverage in Orlando',
    coverage: 'Aetna Psychiatry Benefits Explained',
    services: 'Aetna-Covered Psychiatric Services',
    whyUs: 'Why Choose Our Aetna-Accepting Psychiatrists',
  },
  '/bcbs': {
    main: 'BCBS Mental Health Coverage in Orlando',
    coverage: 'Blue Cross Blue Shield Psychiatry Benefits',
    services: 'BCBS-Covered Psychiatric Services',
    whyUs: 'Why Choose Our BCBS-Accepting Psychiatrists',
  },
  '/cigna': {
    main: 'Cigna Mental Health Coverage in Orlando',
    coverage: 'Cigna Psychiatry Benefits Explained',
    services: 'Cigna-Covered Psychiatric Services',
    whyUs: 'Why Choose Our Cigna-Accepting Psychiatrists',
  },
  '/unitedhealthcare': {
    main: 'UnitedHealthcare Mental Health Coverage in Orlando',
    coverage: 'UHC Psychiatry Benefits Explained',
    services: 'UnitedHealthcare-Covered Psychiatric Services',
    whyUs: 'Why Choose Our UHC-Accepting Psychiatrists',
  },
  '/humana': {
    main: 'Humana Mental Health Coverage in Orlando',
    coverage: 'Humana Psychiatry Benefits Explained',
    services: 'Humana-Covered Psychiatric Services',
    whyUs: 'Why Choose Our Humana-Accepting Psychiatrists',
  },
  '/tricare': {
    main: 'TRICARE Mental Health Coverage in Orlando',
    coverage: 'TRICARE Psychiatry Benefits for Veterans',
    services: 'TRICARE-Covered Psychiatric Services',
    whyUs: 'Why Veterans Choose Our Orlando Psychiatrists',
  },
  '/medicare': {
    main: 'Medicare Mental Health Coverage in Orlando',
    coverage: 'Medicare Psychiatry Benefits Explained',
    services: 'Medicare-Covered Psychiatric Services',
    whyUs: 'Why Seniors Choose Our Medicare-Accepting Psychiatrists',
  },
};

/**
 * Condition/treatment page H2 sets with symptom keywords
 */
export const CONDITION_H2_MAP: Record<string, { symptoms: string; causes: string; treatment: string; whyUs: string; whenSeekHelp: string }> = {
  '/depression': {
    symptoms: 'Depression Symptoms and Warning Signs',
    causes: 'Common Causes of Depression',
    treatment: 'Evidence-Based Depression Treatment Options',
    whyUs: 'Why Choose Our Orlando Depression Specialists',
    whenSeekHelp: 'When to Seek Help for Depression',
  },
  '/anxiety': {
    symptoms: 'Anxiety Symptoms and Warning Signs',
    causes: 'Common Causes and Triggers of Anxiety',
    treatment: 'Anxiety Treatment Options That Work',
    whyUs: 'Why Choose Our Orlando Anxiety Specialists',
    whenSeekHelp: 'When to Seek Help for Anxiety',
  },
  '/adhd': {
    symptoms: 'ADHD Symptoms in Adults and Children',
    causes: 'Understanding ADHD Causes',
    treatment: 'ADHD Treatment and Medication Options',
    whyUs: 'Why Choose Our Orlando ADHD Specialists',
    whenSeekHelp: 'When to Get Tested for ADHD',
  },
  '/ptsd': {
    symptoms: 'PTSD Symptoms and Trauma Responses',
    causes: 'Understanding Trauma and PTSD',
    treatment: 'EMDR and Trauma Treatment Options',
    whyUs: 'Why Choose Our Orlando PTSD Specialists',
    whenSeekHelp: 'When to Seek Trauma Treatment',
  },
  '/bipolar': {
    symptoms: 'Bipolar Disorder Symptoms',
    causes: 'Understanding Bipolar Disorder',
    treatment: 'Bipolar Medication and Treatment Options',
    whyUs: 'Why Choose Our Orlando Bipolar Specialists',
    whenSeekHelp: 'When to Seek Help for Mood Swings',
  },
  '/ocd': {
    symptoms: 'OCD Symptoms and Compulsions',
    causes: 'Understanding OCD Causes',
    treatment: 'ERP and OCD Treatment Options',
    whyUs: 'Why Choose Our Orlando OCD Specialists',
    whenSeekHelp: 'When to Seek Help for OCD',
  },
};

/**
 * Get optimized H2 set for a path
 */
export function getOptimizedH2Set(path: string): Record<string, string> | null {
  const normalizedPath = path.toLowerCase().replace(/\/$/, '');
  
  if (ORLANDO_H2_MAP[normalizedPath]) {
    return ORLANDO_H2_MAP[normalizedPath];
  }
  
  if (LOCATION_H2_MAP[normalizedPath]) {
    return LOCATION_H2_MAP[normalizedPath];
  }
  
  if (INSURANCE_H2_MAP[normalizedPath]) {
    return INSURANCE_H2_MAP[normalizedPath];
  }
  
  if (CONDITION_H2_MAP[normalizedPath]) {
    return CONDITION_H2_MAP[normalizedPath];
  }
  
  return null;
}

/**
 * Get a specific optimized H2 for a path and section
 */
export function getOptimizedH2(path: string, section: string, fallback?: string): string {
  const h2Set = getOptimizedH2Set(path);
  
  if (h2Set && h2Set[section]) {
    return formatH2(h2Set[section]);
  }
  
  if (fallback) {
    return formatH2(fallback);
  }
  
  return '';
}
