#!/usr/bin/env tsx
/**
 * Fix Prerender Assets Script
 *
 * This script ensures all prerendered HTML files have the correct production
 * CSS and JS asset references. Run this after building to fix any missing assets.
 *
 * Usage: npx tsx scripts/fix-prerender-assets.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const PRERENDER_DIR = path.join(rootDir, 'dist/prerendered');
const PROD_INDEX = path.join(rootDir, 'dist/public/index.html');

function walkDir(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function main() {
  console.log('🔧 Fixing Prerender Assets\n');
  console.log('━'.repeat(50));

  // Check directories exist
  if (!fs.existsSync(PRERENDER_DIR)) {
    console.error(`❌ Prerender directory not found: ${PRERENDER_DIR}`);
    process.exit(1);
  }
  if (!fs.existsSync(PROD_INDEX)) {
    console.error(`❌ Production index.html not found: ${PROD_INDEX}`);
    process.exit(1);
  }

  // Read production HTML
  const prodHtml = fs.readFileSync(PROD_INDEX, 'utf-8');

  // Extract production assets
  const cssMatch = prodHtml.match(/<link rel="stylesheet" crossorigin href="\/assets\/index[^"]*\.css">/);
  const jsMatch = prodHtml.match(/<script type="module" crossorigin src="\/assets\/index[^"]*\.js"><\/script>/);

  const prodCss = cssMatch ? cssMatch[0] : '';
  const prodJs = jsMatch ? jsMatch[0] : '';

  console.log(`📦 CSS: ${prodCss.substring(0, 60)}...`);
  console.log(`📦 JS:  ${prodJs.substring(0, 60)}...\n`);

  if (!prodCss || !prodJs) {
    console.error('❌ Could not extract production assets!');
    process.exit(1);
  }

  // Process all HTML files
  let fixedCss = 0;
  let fixedJs = 0;
  let totalFiles = 0;

  const htmlFiles = walkDir(PRERENDER_DIR);

  for (const fpath of htmlFiles) {
    totalFiles++;

    try {
      let html = fs.readFileSync(fpath, 'utf-8');
      const originalHtml = html;

      // Remove old/dev asset references
      html = html.replace(/<script[^>]*src="\/src\/main\.tsx[^"]*"[^>]*><\/script>/g, '');
      html = html.replace(/<link[^>]*rel="modulepreload"[^>]*href="\/src\/[^"]*"[^>]*>/g, '');
      html = html.replace(/<script[^>]*src="\/@replit\/[^"]*"[^>]*><\/script>/g, '');
      html = html.replace(/<script[^>]*src="\/@vite\/[^"]*"[^>]*><\/script>/g, '');

      // Add CSS if missing
      if (!html.includes(prodCss)) {
        if (html.includes('</head>')) {
          html = html.replace('</head>', `    ${prodCss}\n  </head>`);
          fixedCss++;
        }
      }

      // Add JS if missing
      if (!html.includes(prodJs)) {
        if (html.includes('</body>')) {
          html = html.replace('</body>', `    ${prodJs}\n  </body>`);
          fixedJs++;
        }
      }

      // Write if changed
      if (html !== originalHtml) {
        fs.writeFileSync(fpath, html, 'utf-8');
      }
    } catch (e: any) {
      console.error(`⚠️  Error processing ${fpath}: ${e.message}`);
    }
  }

  console.log('━'.repeat(50));
  console.log('📊 SUMMARY\n');
  console.log(`Total files:     ${totalFiles}`);
  console.log(`Fixed CSS:       ${fixedCss}`);
  console.log(`Fixed JS:        ${fixedJs}`);
  console.log();

  if (fixedCss === 0 && fixedJs === 0) {
    console.log('✅ All files already have correct assets');
  } else {
    console.log(`✅ Fixed ${fixedCss + fixedJs} asset references`);
  }

  console.log('\n🔍 Run validation: npx tsx scripts/validate-prerender.ts');
}

main();
