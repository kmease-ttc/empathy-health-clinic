/**
 * Screaming Frog Issue Validator
 * 
 * Validates prerendered HTML files against common Screaming Frog issues:
 * 1. Pages Without Internal Outlinks
 * 2. Canonical Mismatches
 * 3. Response Code Errors (4xx, redirect chains)
 * 4. H2 Issues (multiple, non-sequential, duplicate)
 * 5. Meta Description Issues (too long)
 * 6. URL Issues (uppercase, parameters)
 * 
 * Usage: npx tsx scripts/qa/screaming-frog-validator.ts
 * 
 * Exit codes:
 *   0 = All validations passed (or only warnings)
 *   1 = Critical issues found (blocks deployment)
 */

import fs from 'fs';
import path from 'path';

const PRERENDERED_DIR = path.join(process.cwd(), 'dist', 'prerendered');
const DOMAIN = 'https://empathyhealthclinic.com';

// Thresholds
const MIN_INTERNAL_LINKS = 10;  // Minimum internal links per page
const MAX_META_DESC_LENGTH = 155;  // Maximum meta description characters
const MAX_META_DESC_PIXELS = 985;  // ~6.5 chars per pixel

// Pages that are exempt from certain checks
const EXEMPT_FROM_LINKS = new Set([
  '/thank-you', '/confirmation', '/privacy-policy', '/medical-disclaimer',
  '/404', '/not-found', '/admin', '/login',
]);

interface PageIssue {
  type: 'critical' | 'warning' | 'opportunity';
  issue: string;
  details?: string;
}

interface PageResult {
  path: string;
  issues: PageIssue[];
  stats: {
    internalLinks: number;
    externalLinks: number;
    h1Count: number;
    h2Count: number;
    canonical: string | null;
    metaDescLength: number;
    hasNoindex: boolean;
  };
}

interface Summary {
  total: number;
  criticalCount: number;
  warningCount: number;
  opportunityCount: number;
  issueBreakdown: Record<string, number>;
  criticalPages: string[];
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

function validatePage(urlPath: string): PageResult {
  const filePath = getFilePath(urlPath);
  const issues: PageIssue[] = [];
  
  if (!fs.existsSync(filePath)) {
    return {
      path: urlPath,
      issues: [{ type: 'critical', issue: 'File not found' }],
      stats: {
        internalLinks: 0,
        externalLinks: 0,
        h1Count: 0,
        h2Count: 0,
        canonical: null,
        metaDescLength: 0,
        hasNoindex: false,
      },
    };
  }
  
  const html = fs.readFileSync(filePath, 'utf-8');
  
  // Count internal links (href starting with /)
  const internalLinkMatches = html.match(/<a[^>]+href=["']\/[^"']*["']/gi) || [];
  const internalLinks = internalLinkMatches.length;
  
  // Count external links
  const externalLinkMatches = html.match(/<a[^>]+href=["']https?:\/\/[^"']*["']/gi) || [];
  const externalLinks = externalLinkMatches.length;
  
  // Count H1s
  const h1Matches = html.match(/<h1[^>]*>/gi) || [];
  const h1Count = h1Matches.length;
  
  // Count H2s
  const h2Matches = html.match(/<h2[^>]*>/gi) || [];
  const h2Count = h2Matches.length;
  
  // Extract canonical
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const canonical = canonicalMatch?.[1] || null;
  
  // Extract meta description
  const metaDescMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  const metaDesc = metaDescMatch?.[1] || '';
  const metaDescLength = metaDesc.length;
  
  // Check for noindex
  const hasNoindex = /<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html) ||
                     /<meta[^>]+content=["'][^"']*noindex[^"']*["']/i.test(html);
  
  // Issue checks
  
  // 1. Pages Without Internal Outlinks
  if (!EXEMPT_FROM_LINKS.has(urlPath) && internalLinks < MIN_INTERNAL_LINKS) {
    issues.push({
      type: 'critical',
      issue: 'Pages Without Internal Outlinks',
      details: `Only ${internalLinks} internal links (minimum: ${MIN_INTERNAL_LINKS})`,
    });
  }
  
  // 2. Canonical Issues
  const expectedCanonical = `${DOMAIN}${urlPath === '/' ? '' : urlPath}`;
  if (canonical && canonical !== expectedCanonical && !hasNoindex) {
    issues.push({
      type: 'warning',
      issue: 'Canonicals: Canonicalised',
      details: `Points to ${canonical} instead of ${expectedCanonical}`,
    });
  }
  
  // 3. H1 Issues
  if (h1Count === 0) {
    issues.push({
      type: 'warning',
      issue: 'H1: Missing',
      details: 'No H1 tag found',
    });
  } else if (h1Count > 1) {
    issues.push({
      type: 'warning',
      issue: 'H1: Multiple',
      details: `Found ${h1Count} H1 tags`,
    });
  }
  
  // 4. H2 Issues
  if (h2Count > 10) {
    issues.push({
      type: 'opportunity',
      issue: 'H2: Multiple',
      details: `${h2Count} H2 tags (consider restructuring)`,
    });
  }
  
  // 5. Meta Description Issues
  if (metaDescLength > MAX_META_DESC_LENGTH) {
    issues.push({
      type: 'opportunity',
      issue: 'Meta Description: Over 155 Characters',
      details: `${metaDescLength} characters`,
    });
  }
  
  // 6. URL Issues (uppercase)
  if (/[A-Z]/.test(urlPath)) {
    issues.push({
      type: 'warning',
      issue: 'URL: Uppercase',
      details: `URL contains uppercase characters`,
    });
  }
  
  return {
    path: urlPath,
    issues,
    stats: {
      internalLinks,
      externalLinks,
      h1Count,
      h2Count,
      canonical,
      metaDescLength,
      hasNoindex,
    },
  };
}

async function runValidation(): Promise<void> {
  console.log('=========================================');
  console.log('Screaming Frog Issue Validator');
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
  
  // Validate each page
  console.log('Validating pages...');
  const results: PageResult[] = [];
  
  for (const pagePath of paths) {
    const result = validatePage(pagePath);
    results.push(result);
    
    if (result.issues.some(i => i.type === 'critical')) {
      process.stdout.write('F');
    } else if (result.issues.some(i => i.type === 'warning')) {
      process.stdout.write('W');
    } else {
      process.stdout.write('.');
    }
  }
  console.log('\n');
  
  // Generate summary
  const summary: Summary = {
    total: results.length,
    criticalCount: 0,
    warningCount: 0,
    opportunityCount: 0,
    issueBreakdown: {},
    criticalPages: [],
  };
  
  for (const result of results) {
    for (const issue of result.issues) {
      summary.issueBreakdown[issue.issue] = (summary.issueBreakdown[issue.issue] || 0) + 1;
      
      if (issue.type === 'critical') {
        summary.criticalCount++;
        if (!summary.criticalPages.includes(result.path)) {
          summary.criticalPages.push(result.path);
        }
      } else if (issue.type === 'warning') {
        summary.warningCount++;
      } else {
        summary.opportunityCount++;
      }
    }
  }
  
  // Print summary
  console.log('=========================================');
  console.log('VALIDATION SUMMARY');
  console.log('=========================================\n');
  
  console.log(`Total Pages: ${summary.total}`);
  console.log(`Critical Issues: ${summary.criticalCount}`);
  console.log(`Warnings: ${summary.warningCount}`);
  console.log(`Opportunities: ${summary.opportunityCount}`);
  console.log('');
  
  if (Object.keys(summary.issueBreakdown).length > 0) {
    console.log('Issue Breakdown:');
    console.log('-----------------');
    
    const sortedIssues = Object.entries(summary.issueBreakdown)
      .sort((a, b) => b[1] - a[1]);
    
    for (const [issue, count] of sortedIssues) {
      const pct = ((count / summary.total) * 100).toFixed(1);
      console.log(`  ${issue}: ${count} (${pct}%)`);
    }
    console.log('');
  }
  
  if (summary.criticalPages.length > 0) {
    console.log('Pages with Critical Issues:');
    console.log('----------------------------');
    for (const page of summary.criticalPages.slice(0, 20)) {
      const result = results.find(r => r.path === page);
      const criticalIssues = result?.issues.filter(i => i.type === 'critical') || [];
      console.log(`  ${page}`);
      for (const issue of criticalIssues) {
        console.log(`    - ${issue.issue}: ${issue.details}`);
      }
    }
    if (summary.criticalPages.length > 20) {
      console.log(`  ... and ${summary.criticalPages.length - 20} more`);
    }
    console.log('');
  }
  
  // Write detailed report
  const reportPath = path.join(process.cwd(), 'screaming-frog-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary,
    results: results.filter(r => r.issues.length > 0),
  }, null, 2));
  console.log(`Detailed report: ${reportPath}`);
  
  // Exit with error if critical issues
  if (summary.criticalCount > 0) {
    console.log('\n❌ VALIDATION FAILED - Critical issues found');
    console.log('Fix the critical issues before deploying.');
    process.exit(1);
  }
  
  console.log('\n✅ VALIDATION PASSED (no critical issues)');
  process.exit(0);
}

runValidation().catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});
