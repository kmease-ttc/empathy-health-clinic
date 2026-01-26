# Screaming Frog SEO Guardrails

Purpose: Prevent all common crawl, indexing, content, linking, schema,
and performance issues detected by Screaming Frog.

------------------------------------------------------------------------

## Pre-Deploy Crawl Requirements

### Status & Indexing

-   All important URLs return 200
-   No 4xx or 5xx on live pages
-   No redirect chains or loops
-   Noindex only on approved private pages
-   Robots.txt allows production crawling

### Canonicals

-   One canonical per page
-   Canonical returns 200
-   Internal links match canonical
-   No canonical loops

### Sitemaps

-   Only canonical indexable URLs
-   No redirects, 404s, blocked pages
-   Sitemap accessible

------------------------------------------------------------------------

## Content Quality

### Titles & Meta

-   No missing titles
-   No duplicates
-   Proper length (50--60 chars)
-   Unique meta descriptions

### Headings

-   One H1 per page
-   No missing H1
-   Clear topic match

### Thin & Duplicate Content

-   Avoid low word count pages
-   No near-duplicate templates without canonicals

------------------------------------------------------------------------

## Internal Linking

-   No broken internal links
-   No redirecting internal links
-   Every important page has 5+ internal links
-   No orphan pages

------------------------------------------------------------------------

## Images

-   All images return 200
-   Alt text present
-   File sizes optimized
-   Modern formats when possible

------------------------------------------------------------------------

## Structured Data

-   Schema matches visible content
-   Required fields present
-   No errors or warnings

------------------------------------------------------------------------

## Hreflang (if used)

-   Valid language codes
-   Return links present
-   Canonical consistency

------------------------------------------------------------------------

## JavaScript Rendering

-   Main content visible pre-render or post-render
-   Titles/meta consistent
-   Internal links crawlable

------------------------------------------------------------------------

## Performance

-   Fast server response times
-   Reasonable page size
-   Minimal heavy assets

------------------------------------------------------------------------

## Security

-   No mixed content
-   HTTPS everywhere
-   No exposed directories

------------------------------------------------------------------------

## CI Fail Conditions

-   Any 4xx/5xx on important URLs
-   Missing canonical
-   Duplicate titles/meta
-   Orphan pages
-   Broken links
-   Schema errors
-   Sitemap invalid URLs

------------------------------------------------------------------------

## Weekly Health Check

-   Full crawl
-   Status review
-   Duplicate scan
-   Link validation
-   Performance spot check

------------------------------------------------------------------------

Goal: A crawl that returns clean --- no errors, no duplicates, no wasted
crawl budget, no ranking blockers.
