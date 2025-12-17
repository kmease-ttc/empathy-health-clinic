#!/bin/bash
# Post-Deploy Verification Script
# Run after publishing to verify prerendered HTML is being served correctly.
# Usage: ./scripts/post-deploy-verify.sh [URL]

set -e

PROD_URL="${1:-https://www.empathyhealthclinic.com}"
FINAL_URL="https://empathyhealthclinic.com"  # After www redirect

echo "=========================================="
echo "Post-Deploy Production Verification"
echo "=========================================="
echo ""
echo "Target: $PROD_URL"
echo ""

FAILED=0

# Test 1: Check HTTP response
echo "=== Test 1: HTTP Response ==="
HTTP_CODE=$(curl -sI --http1.1 -L "$PROD_URL" 2>/dev/null | grep "HTTP/" | tail -1 | awk '{print $2}')
echo "Final HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ]; then
    echo "PASS"
else
    echo "FAIL: Expected 200, got $HTTP_CODE"
    FAILED=1
fi
echo ""

# Test 2: Check Content-Type
echo "=== Test 2: Content-Type ==="
CONTENT_TYPE=$(curl -sI --http1.1 -L "$PROD_URL" 2>/dev/null | grep -i "content-type:" | tail -1)
echo "$CONTENT_TYPE"
if echo "$CONTENT_TYPE" | grep -qi "text/html"; then
    echo "PASS"
else
    echo "FAIL: Content-Type should be text/html"
    FAILED=1
fi
echo ""

# Test 3: Check prerender marker
echo "=== Test 3: Prerender Marker ==="
MARKER_COUNT=$(curl -sL "$FINAL_URL" 2>/dev/null | grep -c 'Prerendered by Puppeteer' || echo "0")
echo "Prerender markers found: $MARKER_COUNT"
if [ "$MARKER_COUNT" -ge 1 ]; then
    echo "PASS"
else
    echo "FAIL: Prerender marker not found"
    FAILED=1
fi
echo ""

# Test 4: Check homepage links
echo "=== Test 4: Homepage Links (> 50 required) ==="
HOMEPAGE_LINKS=$(curl -sL "$FINAL_URL" 2>/dev/null | grep -oi '<a [^>]*href="/' | wc -l)
echo "Homepage links: $HOMEPAGE_LINKS"
if [ "$HOMEPAGE_LINKS" -gt 50 ]; then
    echo "PASS"
else
    echo "FAIL: Homepage has $HOMEPAGE_LINKS links (need > 50)"
    FAILED=1
fi
echo ""

# Test 5: Check deep page links
echo "=== Test 5: Deep Page Links (> 10 required) ==="
DEEP_LINKS=$(curl -sL "$FINAL_URL/psychiatrist-orlando" 2>/dev/null | grep -oi '<a [^>]*href="/' | wc -l)
echo "/psychiatrist-orlando links: $DEEP_LINKS"
if [ "$DEEP_LINKS" -gt 10 ]; then
    echo "PASS"
else
    echo "FAIL: Deep page has $DEEP_LINKS links (need > 10)"
    FAILED=1
fi
echo ""

# Test 6: Sample internal links visible
echo "=== Test 6: Sample Internal Links ==="
echo "First 5 internal links from homepage:"
curl -sL "$FINAL_URL" 2>/dev/null | grep -oi '<a [^>]*href="/[a-zA-Z][^"]*"' | head -5 | sed 's/.*href="/  /' | sed 's/".*//'
echo ""

# Final result
echo "=========================================="
if [ "$FAILED" -eq 0 ]; then
    echo "ALL PRODUCTION TESTS PASSED"
    echo ""
    echo "The site is fully crawlable in HTML-only mode."
    echo "Screaming Frog should now discover 100+ URLs in default mode."
    exit 0
else
    echo "SOME PRODUCTION TESTS FAILED"
    echo ""
    echo "Check that:"
    echo "1. .replit build is set to: bash scripts/build-production.sh"
    echo "2. The deployment completed successfully"
    echo "3. dist/prerendered/ was included in the deployment"
    exit 1
fi
