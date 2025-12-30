#!/usr/bin/env node
/**
 * Repository Size Guardrail Script
 * 
 * Prevents repo bloat by checking:
 * 1. Total tracked file size < 300MB
 * 2. No tracked *.zip or *.sql files
 * 3. Warns if dist/ or node_modules are tracked
 * 
 * Run: npm run check:repo
 * CI: Add to pre-commit hook or CI pipeline
 */

import { execSync } from 'child_process';
import { existsSync, statSync } from 'fs';

const MAX_REPO_SIZE_MB = 300;
const FORBIDDEN_PATTERNS = ['*.zip', '*.sql', '*.tar.gz', '*.7z', '*.rar'];
const WARN_PATTERNS = ['dist/', 'node_modules/', 'build/', '.cache/'];

console.log('🔍 Repository Size Check\n');
console.log('━'.repeat(50));

let hasErrors = false;
let hasWarnings = false;

// Check 1: Total tracked file size
// Use maxBuffer to handle repos with many files (default 1MB is too small)
try {
  const trackedFiles = execSync('git ls-files', { 
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024 // 50MB buffer for large file lists
  }).trim().split('\n').filter(Boolean);
  
  let totalSize = 0;
  let fileCount = 0;
  
  for (const file of trackedFiles) {
    try {
      if (existsSync(file)) {
        totalSize += statSync(file).size;
        fileCount++;
      }
    } catch {
      // File may have been deleted but still tracked
    }
  }
  
  const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  
  if (totalSize > MAX_REPO_SIZE_MB * 1024 * 1024) {
    console.log(`❌ FAIL: Tracked files = ${sizeMB}MB (max: ${MAX_REPO_SIZE_MB}MB)`);
    console.log(`   Files tracked: ${fileCount}`);
    hasErrors = true;
  } else {
    console.log(`✅ Size: ${sizeMB}MB / ${MAX_REPO_SIZE_MB}MB (${fileCount} files)`);
  }
} catch (err) {
  console.log(`❌ FAIL: Could not calculate repo size: ${err.message}`);
  hasErrors = true; // Fail if we can't verify size
}

// Check 2: Forbidden file patterns
console.log('');
for (const pattern of FORBIDDEN_PATTERNS) {
  try {
    const matches = execSync(`git ls-files "${pattern}" 2>/dev/null || true`, { encoding: 'utf8' }).trim();
    if (matches) {
      const files = matches.split('\n').filter(Boolean);
      console.log(`❌ FAIL: Found ${files.length} tracked ${pattern} file(s):`);
      files.slice(0, 5).forEach(f => console.log(`   - ${f}`));
      if (files.length > 5) console.log(`   ... and ${files.length - 5} more`);
      hasErrors = true;
    }
  } catch {
    // Pattern not found - good
  }
}

if (!hasErrors) {
  console.log(`✅ No forbidden files (${FORBIDDEN_PATTERNS.join(', ')})`);
}

// Check 3: Warning patterns (should be gitignored)
console.log('');
for (const pattern of WARN_PATTERNS) {
  try {
    const matches = execSync(`git ls-files "${pattern}*" 2>/dev/null || true`, { encoding: 'utf8' }).trim();
    if (matches) {
      const files = matches.split('\n').filter(Boolean);
      console.log(`⚠️  WARN: ${pattern} is tracked (${files.length} files) - should be in .gitignore`);
      hasWarnings = true;
    }
  } catch {
    // Pattern not found - good
  }
}

if (!hasWarnings) {
  console.log(`✅ Build outputs properly gitignored`);
}

// Summary
console.log('');
console.log('━'.repeat(50));

if (hasErrors) {
  console.log('❌ REPO CHECK FAILED');
  console.log('');
  console.log('To fix:');
  console.log('  1. Remove large files: git rm --cached <file>');
  console.log('  2. Add to .gitignore');
  console.log('  3. Commit the changes');
  console.log('');
  console.log('For git history cleanup (local machine):');
  console.log('  pip install git-filter-repo');
  console.log('  git filter-repo --path <file> --invert-paths');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  REPO CHECK PASSED WITH WARNINGS');
  process.exit(0);
} else {
  console.log('✅ REPO CHECK PASSED');
  process.exit(0);
}
