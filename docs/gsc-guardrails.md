# Google Search Console Guardrails (Prevent Common Issues)

Owner: SEO / Web Ops\
Applies to: All sites + all deploys\
Goal: Prevent indexing, experience, enhancement, and security issues
before they appear in Google Search Console.

------------------------------------------------------------------------

## 1) Pre-Deploy Release Checklist (Run Every Deploy)

### A. Robots + Indexing (Hard Blockers)

-   [ ] `robots.txt` exists at `/<root>/robots.txt`
-   [ ] `robots.txt` does NOT block important paths
-   [ ] Staging/dev blocked from indexing
-   [ ] Production has no `noindex` on public pages

### B. Canonicals

-   [ ] One canonical per page
-   [ ] Absolute URL
-   [ ] Points to 200 status page

### C. Status & Redirects

-   [ ] Key pages return 200
-   [ ] No redirect chains or loops

### D. Sitemaps

-   [ ] Only canonical indexable URLs
-   [ ] No blocked, redirected, or 404 URLs

### E. Rendering

-   [ ] Content renders server-side
-   [ ] Title/meta present

------------------------------------------------------------------------

## Monitoring

Daily: - uptime + 5xx alerts - robots.txt & sitemap change detection

Weekly: - full crawl validation

------------------------------------------------------------------------

## Core Web Vitals

-   LCP \< 2.5s
-   CLS \< 0.1
-   INP \< 200ms

------------------------------------------------------------------------

## Structured Data

-   Valid schema only
-   Required fields included

------------------------------------------------------------------------

## CI Fail Conditions

-   Broken canonicals
-   Non-200 sitemap URLs
-   Noindex in sitemap
-   CWV regression

------------------------------------------------------------------------

## URL Policy

-   HTTPS only
-   Single host
-   Clean canonicals
