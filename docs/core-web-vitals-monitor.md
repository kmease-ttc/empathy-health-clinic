# Core Web Vitals & Performance Monitor

## Purpose
Track performance health and identify regressions that impact rankings or conversions.

## Metrics Tracked
- LCP (Largest Contentful Paint)
- CLS (Cumulative Layout Shift)
- INP (Interaction to Next Paint)
- TTFB
- Total Blocking Time
- Page weight and request count

## Data Sources
- PageSpeed Insights
- CrUX
- Lighthouse-style audits

## Monitoring Behavior
- Track metrics per URL over time
- Detect regressions vs baseline
- Correlate performance drops with traffic loss

## Output
- URL-level performance summaries
- “What worsened” explanations
- Prioritized performance fixes

## Usage Rule
Performance regressions block SEO releases.
