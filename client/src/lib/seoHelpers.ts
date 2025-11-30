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
  '/child-psychiatrist-orlando': 'Child Psychiatrist Orlando',
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
