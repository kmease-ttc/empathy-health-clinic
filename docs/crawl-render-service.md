# Crawl & Render Service (Technical SEO)

## Purpose
Crawl the site as a search engine would and validate both raw HTML and rendered output to detect technical SEO issues.

## What This Service Checks
- HTTP status codes (200, 3xx, 4xx, 5xx)
- Redirect chains and loops
- Canonical tags and conflicts
- Indexability (meta robots, X-Robots-Tag)
- Internal links and crawl depth
- Orphan pages
- XML sitemap validity
- robots.txt rules
- Duplicate URLs
- Pagination handling

## Render Validation
- JavaScript rendering completeness
- Blank or empty rendered content
- Missing critical text after hydration
- Client-side routing failures
- Lazy-loaded content visibility

## Output
- Normalized list of findings
- Severity score per issue
- Affected URLs
- Recommended technical fixes

## Usage Rule
All releases must pass crawl + render checks before publish.
