#!/usr/bin/env python3
"""
Fix Prerender Assets Script

This script ensures all prerendered HTML files have the correct production
CSS and JS asset references. Run this after building to fix any missing assets.

Usage: python3 scripts/fix-prerender-assets.py
"""

import os
import re
import sys

def main():
    prerender_dir = 'dist/prerendered'
    prod_index = 'dist/public/index.html'
    
    print("🔧 Fixing Prerender Assets\n")
    print("━" * 50)
    
    # Check directories
    if not os.path.exists(prerender_dir):
        print(f"❌ Prerender directory not found: {prerender_dir}")
        sys.exit(1)
    if not os.path.exists(prod_index):
        print(f"❌ Production index.html not found: {prod_index}")
        sys.exit(1)
    
    # Read production HTML
    with open(prod_index, 'r') as f:
        prod_html = f.read()
    
    # Extract production assets
    css_match = re.search(r'<link rel="stylesheet" crossorigin href="/assets/index[^"]*\.css">', prod_html)
    js_match = re.search(r'<script type="module" crossorigin src="/assets/index[^"]*\.js"></script>', prod_html)
    
    prod_css = css_match.group() if css_match else ''
    prod_js = js_match.group() if js_match else ''
    
    print(f"📦 CSS: {prod_css[:60]}...")
    print(f"📦 JS:  {prod_js[:60]}...\n")
    
    if not prod_css or not prod_js:
        print("❌ Could not extract production assets!")
        sys.exit(1)
    
    # Process all HTML files
    fixed_css = 0
    fixed_js = 0
    total_files = 0
    
    for root, dirs, files in os.walk(prerender_dir):
        for fname in files:
            if not fname.endswith('.html'):
                continue
                
            total_files += 1
            fpath = os.path.join(root, fname)
            
            try:
                with open(fpath, 'r') as f:
                    html = f.read()
                
                original_html = html
                
                # Remove old/dev asset references
                html = re.sub(r'<script[^>]*src="/src/main\.tsx[^"]*"[^>]*></script>', '', html)
                html = re.sub(r'<link[^>]*rel="modulepreload"[^>]*href="/src/[^"]*"[^>]*>', '', html)
                html = re.sub(r'<script[^>]*src="/@replit/[^"]*"[^>]*></script>', '', html)
                html = re.sub(r'<script[^>]*src="/@vite/[^"]*"[^>]*></script>', '', html)
                
                # Add CSS if missing
                if prod_css not in html:
                    if '</head>' in html:
                        html = html.replace('</head>', f'    {prod_css}\n  </head>')
                        fixed_css += 1
                
                # Add JS if missing
                if prod_js not in html:
                    if '</body>' in html:
                        html = html.replace('</body>', f'    {prod_js}\n  </body>')
                        fixed_js += 1
                
                # Write if changed
                if html != original_html:
                    with open(fpath, 'w') as f:
                        f.write(html)
                        
            except Exception as e:
                print(f"⚠️  Error processing {fpath}: {e}")
    
    print("━" * 50)
    print("📊 SUMMARY\n")
    print(f"Total files:     {total_files}")
    print(f"Fixed CSS:       {fixed_css}")
    print(f"Fixed JS:        {fixed_js}")
    print()
    
    if fixed_css == 0 and fixed_js == 0:
        print("✅ All files already have correct assets")
    else:
        print(f"✅ Fixed {fixed_css + fixed_js} asset references")
    
    print("\n🔍 Run validation: npx tsx scripts/validate-prerender.ts")

if __name__ == '__main__':
    main()
