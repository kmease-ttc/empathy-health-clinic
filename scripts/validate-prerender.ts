/**
 * Pre-deployment Validation Script
 * 
 * This script validates that all prerendered HTML files have the required
 * production assets (CSS and JS) before publishing. Run this before deployment
 * to catch missing assets that would cause broken layouts in production.
 * 
 * Usage: npx tsx scripts/validate-prerender.ts
 */

import fs from 'fs';
import path from 'path';

interface ValidationResult {
  file: string;
  hasCSS: boolean;
  hasJS: boolean;
  cssHref?: string;
  jsHref?: string;
}

interface ValidationSummary {
  total: number;
  passed: number;
  failed: number;
  missingCSS: string[];
  missingJS: string[];
}

function extractAssetPatterns(prodIndexPath: string): { cssPattern: RegExp; jsPattern: RegExp; cssHref: string; jsHref: string } {
  const content = fs.readFileSync(prodIndexPath, 'utf-8');
  
  const cssMatch = content.match(/href="(\/assets\/index[^"]*\.css)"/);
  const jsMatch = content.match(/src="(\/assets\/index[^"]*\.js)"/);
  
  if (!cssMatch) {
    throw new Error('Could not find CSS asset in production index.html');
  }
  if (!jsMatch) {
    throw new Error('Could not find JS asset in production index.html');
  }
  
  return {
    cssPattern: new RegExp(cssMatch[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    jsPattern: new RegExp(jsMatch[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    cssHref: cssMatch[1],
    jsHref: jsMatch[1]
  };
}

function validateFile(filePath: string, cssHref: string, jsHref: string): ValidationResult {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  return {
    file: filePath,
    hasCSS: content.includes(cssHref),
    hasJS: content.includes(jsHref),
    cssHref,
    jsHref
  };
}

function walkDir(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

function runValidation(): ValidationSummary {
  const prerenderDir = 'dist/prerendered';
  const prodIndexPath = 'dist/public/index.html';
  
  console.log('🔍 Pre-deployment Validation\n');
  console.log('━'.repeat(50));
  
  // Check if directories exist
  if (!fs.existsSync(prerenderDir)) {
    throw new Error(`Prerender directory not found: ${prerenderDir}`);
  }
  if (!fs.existsSync(prodIndexPath)) {
    throw new Error(`Production index.html not found: ${prodIndexPath}`);
  }
  
  // Extract expected asset patterns
  const { cssHref, jsHref } = extractAssetPatterns(prodIndexPath);
  console.log(`📦 Expected CSS: ${cssHref}`);
  console.log(`📦 Expected JS:  ${jsHref}\n`);
  
  // Get all HTML files
  const htmlFiles = walkDir(prerenderDir);
  console.log(`📄 Found ${htmlFiles.length} prerendered HTML files\n`);
  
  // Validate each file
  const summary: ValidationSummary = {
    total: htmlFiles.length,
    passed: 0,
    failed: 0,
    missingCSS: [],
    missingJS: []
  };
  
  for (const filePath of htmlFiles) {
    const result = validateFile(filePath, cssHref, jsHref);
    
    if (!result.hasCSS) {
      summary.missingCSS.push(filePath);
    }
    if (!result.hasJS) {
      summary.missingJS.push(filePath);
    }
    
    if (result.hasCSS && result.hasJS) {
      summary.passed++;
    } else {
      summary.failed++;
    }
  }
  
  return summary;
}

function printSummary(summary: ValidationSummary): void {
  console.log('━'.repeat(50));
  console.log('📊 VALIDATION SUMMARY\n');
  
  console.log(`Total files:    ${summary.total}`);
  console.log(`✅ Passed:      ${summary.passed}`);
  console.log(`❌ Failed:      ${summary.failed}\n`);
  
  if (summary.missingCSS.length > 0) {
    console.log(`\n⚠️  Files missing CSS (${summary.missingCSS.length}):`);
    summary.missingCSS.slice(0, 10).forEach(f => console.log(`   - ${f}`));
    if (summary.missingCSS.length > 10) {
      console.log(`   ... and ${summary.missingCSS.length - 10} more`);
    }
  }
  
  if (summary.missingJS.length > 0) {
    console.log(`\n⚠️  Files missing JS (${summary.missingJS.length}):`);
    summary.missingJS.slice(0, 10).forEach(f => console.log(`   - ${f}`));
    if (summary.missingJS.length > 10) {
      console.log(`   ... and ${summary.missingJS.length - 10} more`);
    }
  }
  
  console.log('\n' + '━'.repeat(50));
  
  if (summary.failed === 0) {
    console.log('✅ ALL PRERENDERED FILES ARE VALID');
    console.log('   Safe to publish!\n');
  } else {
    console.log('❌ VALIDATION FAILED');
    console.log('   Fix missing assets before publishing!\n');
    console.log('   Run: npx tsx scripts/fix-prerender-assets.ts');
    process.exit(1);
  }
}

// Run validation
try {
  const summary = runValidation();
  printSummary(summary);
} catch (error) {
  console.error('\n❌ Validation Error:', error instanceof Error ? error.message : error);
  process.exit(1);
}
