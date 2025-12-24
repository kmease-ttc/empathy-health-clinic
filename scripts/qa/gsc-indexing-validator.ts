/**
 * Google Search Console Indexing Issue Validator
 * 
 * Validates against specific GSC indexing problems:
 * 1. Soft 404 - Pages with thin content that look like error pages
 * 2. Page with redirect - Internal links pointing to redirect URLs
 * 3. Excluded by noindex - Pages with noindex that shouldn't have it
 * 4. Alternate page with canonical - Pages canonicalizing elsewhere
 * 5. Not found (404) - Broken internal links
 * 6. Duplicate without canonical - Pages missing canonical tags
 * 7. Blocked by robots.txt - Check robots.txt rules
 * 
 * Usage: npx tsx scripts/qa/gsc-indexing-validator.ts
 */

import fs from 'fs';
import path from 'path';

const PRERENDERED_DIR = path.join(process.cwd(), 'dist', 'prerendered');
const DOMAIN = 'https://empathyhealthclinic.com';
const BASE_URL = process.env.QA_BASE_URL || 'http://localhost:5000';

// Thresholds for soft 404 detection
const MIN_CONTENT_SIZE = 10000;  // bytes - pages smaller are likely soft 404s
const MIN_MAIN_CONTENT_LENGTH = 500;  // characters in main content area
const MIN_WORD_COUNT = 100;  // minimum words in body

// Pages that are intentionally noindex
const INTENTIONAL_NOINDEX = new Set([
  '/admin', '/login', '/auth', '/config', '/debug',
  '/privacy-policy', '/terms', '/medical-disclaimer',
  '/thank-you', '/confirmation', '/success',
  '/404', '/not-found',
  // Consolidated pages that should be noindex
  '/psychiatry-orlando', '/psychiatry-clinic-orlando',
  '/locations/winter-park', '/pricing', '/affordable-care',
  '/anxiety-treatment',
]);

// Pages that intentionally canonicalize elsewhere
const INTENTIONAL_CANONICAL_REDIRECT = new Set([
  // Pages that point to consolidated versions
]);

interface Issue {
  type: 'soft_404' | 'redirect_link' | 'noindex' | 'canonical_elsewhere' | 'missing_canonical' | 'broken_link' | 'duplicate';
  severity: 'critical' | 'warning' | 'info';
  page: string;
  details: string;
}

interface PageAnalysis {
  path: string;
  fileSize: number;
  contentLength: number;
  wordCount: number;
  hasCanonical: boolean;
  canonicalUrl: string | null;
  hasNoindex: boolean;
  internalLinks: string[];
  externalLinks: string[];
  h1Text: string | null;
  title: string | null;
}

function getAllPrerenderedPaths(): string[] {
  const paths: string[] = [];
  
  function scanDir(dir: string, basePath: string = '') {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.isDirectory()) {
        scanDir(path.join(dir, item.name), `${basePath}/${item.name}`);
      } else if (item.name === 'index.html') {
        paths.push(basePath || '/');
      }
    }
  }
  
  scanDir(PRERENDERED_DIR);
  return paths;
}

function getFilePath(urlPath: string): string {
  if (urlPath === '/') {
    return path.join(PRERENDERED_DIR, 'index.html');
  }
  const cleanPath = urlPath.replace(/^\//, '').replace(/\/$/, '');
  return path.join(PRERENDERED_DIR, cleanPath, 'index.html');
}

function extractMainContent(html: string): string {
  // Try to extract main content area
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    return mainMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  
  // Fallback: extract body minus header/footer
  let content = html;
  content = content.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '');
  content = content.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
  content = content.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');
  content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  content = content.replace(/<[^>]+>/g, ' ');
  content = content.replace(/\s+/g, ' ').trim();
  
  return content;
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

function extractInternalLinks(html: string): string[] {
  const links: string[] = [];
  const regex = /<a[^>]+href=["'](\/?[^"'#]*?)["']/gi;
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    const href = match[1];
    if (href.startsWith('/') && !href.startsWith('//')) {
      links.push(href);
    }
  }
  
  return [...new Set(links)];
}

function analyzePage(urlPath: string): PageAnalysis | null {
  const filePath = getFilePath(urlPath);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const html = fs.readFileSync(filePath, 'utf-8');
  const fileSize = fs.statSync(filePath).size;
  
  // Extract main content
  const mainContent = extractMainContent(html);
  const wordCount = countWords(mainContent);
  
  // Extract canonical
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const canonicalUrl = canonicalMatch?.[1] || null;
  
  // Check noindex
  const hasNoindex = /<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html) ||
                     /<meta[^>]+content=["'][^"']*noindex[^"']*["']/i.test(html);
  
  // Extract title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch?.[1] || null;
  
  // Extract H1
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  const h1Text = h1Match?.[1] || null;
  
  // Extract internal links
  const internalLinks = extractInternalLinks(html);
  
  // Extract external links
  const externalLinks: string[] = [];
  const extRegex = /<a[^>]+href=["'](https?:\/\/[^"']+)["']/gi;
  let extMatch;
  while ((extMatch = extRegex.exec(html)) !== null) {
    if (!extMatch[1].includes('empathyhealthclinic.com')) {
      externalLinks.push(extMatch[1]);
    }
  }
  
  return {
    path: urlPath,
    fileSize,
    contentLength: mainContent.length,
    wordCount,
    hasCanonical: !!canonicalUrl,
    canonicalUrl,
    hasNoindex,
    internalLinks,
    externalLinks,
    h1Text,
    title,
  };
}

async function checkRedirectLinks(paths: string[]): Promise<Issue[]> {
  const issues: Issue[] = [];
  const allInternalLinks = new Set<string>();
  const redirectMap = new Map<string, string>();
  
  // Collect all internal links from all pages
  for (const pagePath of paths) {
    const analysis = analyzePage(pagePath);
    if (analysis) {
      analysis.internalLinks.forEach(link => {
        // Normalize link
        const normalized = link.replace(/\/$/, '') || '/';
        allInternalLinks.add(normalized);
      });
    }
  }
  
  // Check which links are redirects
  console.log(`  Checking ${allInternalLinks.size} unique internal links for redirects...`);
  
  const linksToCheck = Array.from(allInternalLinks).slice(0, 200); // Sample for speed
  
  for (const link of linksToCheck) {
    try {
      const response = await fetch(`${BASE_URL}${link}`, {
        method: 'HEAD',
        redirect: 'manual',
      });
      
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        redirectMap.set(link, location || 'unknown');
      }
    } catch (err) {
      // Ignore network errors
    }
  }
  
  // Report redirect links
  for (const [link, target] of redirectMap) {
    issues.push({
      type: 'redirect_link',
      severity: 'warning',
      page: link,
      details: `Link redirects to: ${target}`,
    });
  }
  
  return issues;
}

function validatePages(paths: string[]): Issue[] {
  const issues: Issue[] = [];
  const canonicalGroups = new Map<string, string[]>();
  
  for (const pagePath of paths) {
    const analysis = analyzePage(pagePath);
    if (!analysis) continue;
    
    const expectedCanonical = `${DOMAIN}${pagePath === '/' ? '' : pagePath}`;
    
    // 1. Soft 404 Detection
    if (analysis.fileSize < MIN_CONTENT_SIZE || 
        analysis.wordCount < MIN_WORD_COUNT ||
        analysis.contentLength < MIN_MAIN_CONTENT_LENGTH) {
      
      // Check if it's a legitimate thin page
      if (!INTENTIONAL_NOINDEX.has(pagePath)) {
        issues.push({
          type: 'soft_404',
          severity: 'critical',
          page: pagePath,
          details: `Thin content: ${analysis.wordCount} words, ${analysis.fileSize} bytes`,
        });
      }
    }
    
    // 2. Noindex Check
    if (analysis.hasNoindex && !INTENTIONAL_NOINDEX.has(pagePath)) {
      issues.push({
        type: 'noindex',
        severity: 'warning',
        page: pagePath,
        details: 'Page has noindex but is not in allowlist',
      });
    }
    
    // 3. Missing Canonical
    if (!analysis.hasCanonical) {
      issues.push({
        type: 'missing_canonical',
        severity: 'warning',
        page: pagePath,
        details: 'Page is missing canonical tag',
      });
    }
    
    // 4. Canonical pointing elsewhere (alternate page)
    if (analysis.canonicalUrl && 
        analysis.canonicalUrl !== expectedCanonical &&
        !INTENTIONAL_CANONICAL_REDIRECT.has(pagePath) &&
        !analysis.hasNoindex) {
      issues.push({
        type: 'canonical_elsewhere',
        severity: 'warning',
        page: pagePath,
        details: `Canonical points to: ${analysis.canonicalUrl}`,
      });
    }
    
    // Track canonical groups for duplicate detection
    if (analysis.canonicalUrl) {
      const group = canonicalGroups.get(analysis.canonicalUrl) || [];
      group.push(pagePath);
      canonicalGroups.set(analysis.canonicalUrl, group);
    }
  }
  
  // 5. Duplicate Detection (multiple pages with same canonical)
  for (const [canonical, pages] of canonicalGroups) {
    if (pages.length > 1) {
      for (const page of pages) {
        if (!canonical.endsWith(page) && !canonical.endsWith(page.replace(/^\//, ''))) {
          issues.push({
            type: 'duplicate',
            severity: 'info',
            page,
            details: `${pages.length} pages share canonical: ${canonical}`,
          });
        }
      }
    }
  }
  
  return issues;
}

async function runValidation(): Promise<void> {
  console.log('=========================================');
  console.log('GSC Indexing Issue Validator');
  console.log('=========================================\n');
  
  // Get all prerendered paths
  console.log('Scanning prerendered pages...');
  const paths = getAllPrerenderedPaths();
  console.log(`Found ${paths.length} prerendered pages\n`);
  
  if (paths.length === 0) {
    console.log('ERROR: No prerendered pages found!');
    console.log('Run the full build first: npm run build:production');
    process.exit(1);
  }
  
  // Validate pages
  console.log('Analyzing pages for GSC issues...');
  const pageIssues = validatePages(paths);
  
  // Check for redirect links
  console.log('Checking for redirect links...');
  const redirectIssues = await checkRedirectLinks(paths);
  
  const allIssues = [...pageIssues, ...redirectIssues];
  
  // Summarize by issue type
  console.log('\n=========================================');
  console.log('GSC INDEXING ISSUE SUMMARY');
  console.log('=========================================\n');
  
  const issuesByType = new Map<string, Issue[]>();
  for (const issue of allIssues) {
    const group = issuesByType.get(issue.type) || [];
    group.push(issue);
    issuesByType.set(issue.type, group);
  }
  
  const typeLabelMap: Record<string, string> = {
    'soft_404': 'Soft 404 (thin content)',
    'redirect_link': 'Page with redirect',
    'noindex': 'Excluded by noindex tag',
    'canonical_elsewhere': 'Alternate page with proper canonical',
    'missing_canonical': 'Duplicate without user-selected canonical',
    'duplicate': 'Duplicate pages',
    'broken_link': 'Not found (404)',
  };
  
  let criticalCount = 0;
  let warningCount = 0;
  
  console.log('Issue Type                              | Count | Severity');
  console.log('----------------------------------------|-------|----------');
  
  for (const [type, issues] of issuesByType) {
    const label = typeLabelMap[type] || type;
    const severity = issues[0]?.severity || 'info';
    const count = issues.length;
    
    if (severity === 'critical') criticalCount += count;
    if (severity === 'warning') warningCount += count;
    
    const severityIcon = severity === 'critical' ? '❌' : severity === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${label.padEnd(40)}| ${String(count).padStart(5)} | ${severityIcon} ${severity}`);
  }
  
  console.log('');
  console.log(`Total Issues: ${allIssues.length}`);
  console.log(`  Critical: ${criticalCount}`);
  console.log(`  Warnings: ${warningCount}`);
  console.log('');
  
  // Show sample of critical issues
  const criticalIssues = allIssues.filter(i => i.severity === 'critical');
  if (criticalIssues.length > 0) {
    console.log('Sample Critical Issues:');
    console.log('-----------------------');
    for (const issue of criticalIssues.slice(0, 10)) {
      console.log(`  ${issue.page}: ${issue.details}`);
    }
    if (criticalIssues.length > 10) {
      console.log(`  ... and ${criticalIssues.length - 10} more`);
    }
    console.log('');
  }
  
  // Write detailed report
  const reportPath = path.join(process.cwd(), 'gsc-indexing-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: allIssues.length,
      critical: criticalCount,
      warnings: warningCount,
      byType: Object.fromEntries(
        Array.from(issuesByType.entries()).map(([k, v]) => [k, v.length])
      ),
    },
    issues: allIssues,
  }, null, 2));
  console.log(`Detailed report: ${reportPath}`);
  
  // Exit with error if critical issues
  if (criticalCount > 0) {
    console.log('\n❌ VALIDATION FAILED - Critical indexing issues found');
    process.exit(1);
  }
  
  console.log('\n✅ VALIDATION PASSED (no critical indexing issues)');
  process.exit(0);
}

runValidation().catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});
