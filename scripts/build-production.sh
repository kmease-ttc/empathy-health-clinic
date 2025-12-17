#!/bin/bash
# Production Build Script
# This script builds the application AND generates prerendered HTML for SEO crawlability.
# Used by Replit deployment: build = ["bash", "scripts/build-production.sh"]

set -e

echo "=========================================="
echo "Production Build with Prerendering"
echo "=========================================="
echo ""

# Step 1: Standard Vite + esbuild build
echo "Step 1: Building frontend and backend..."
npm run build
echo ""

# Step 2: Install Chrome for Puppeteer
echo "Step 2: Installing Chrome for Puppeteer..."
npx puppeteer browsers install chrome
echo ""

# Step 3: Start server temporarily for prerendering
echo "Step 3: Starting temporary server for prerendering..."
NODE_ENV=production node dist/index.js &
SERVER_PID=$!
sleep 5

# Wait for server to be ready
for i in {1..30}; do
  if curl -s http://localhost:5000/ > /dev/null 2>&1; then
    echo "Server is ready"
    break
  fi
  echo "Waiting for server... ($i/30)"
  sleep 1
done

# Step 4: Run prerender script
echo ""
echo "Step 4: Prerendering all routes..."
PRERENDER_URL=http://localhost:5000 npx tsx scripts/prerender-puppeteer.ts

# Stop the temporary server
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true
echo ""

# Step 5: Verify prerender completeness
echo "Step 5: Verifying prerender completeness..."
npx tsx scripts/verify-prerender.ts
echo ""

# Step 6: Final check
echo "Step 6: Final verification..."
PRERENDER_COUNT=$(find dist/prerendered -name "index.html" 2>/dev/null | wc -l)
echo "Prerendered files: $PRERENDER_COUNT"
ls -la dist/prerendered | head -10
echo ""

echo "=========================================="
echo "Production build complete!"
echo "=========================================="
