#!/usr/bin/env python3
"""
Simplified tech audit without pandas dependency.
Audits Orlando pages + top pages for SEO and performance issues.
"""
import os, csv, json
from urllib.parse import urljoin
from psi import batch_psi
from crawl_light import audit_url

SITE = os.getenv("SITE_URL", "https://empathyhealthclinic.com").rstrip("/")

# Build URL set: Orlando pages + common pages
urls = set()

# Add Orlando pages (priority)
for slug in ["psychiatrist-orlando", "adhd-psychiatrist-orlando", "anxiety-psychiatrist-orlando",
             "child-psychiatrist-orlando", "bipolar-psychiatrist-orlando", "medication-management-orlando",
             "telepsychiatry-orlando", "same-day-psychiatrist-orlando"]:
    urls.add(f"{SITE}/{slug}")

# Add homepage and key service pages
urls.add(f"{SITE}/")
urls.add(f"{SITE}/services")

# Add top pages from GSC if available
if os.path.exists("gsc_pages_queries.csv"):
    with open("gsc_pages_queries.csv", "r") as f:
        reader = csv.DictReader(f)
        page_impressions = {}
        for row in reader:
            page = row.get("page", "")
            if page and page.startswith("http"):
                impressions = int(row.get("impressions", 0))
                page_impressions[page] = page_impressions.get(page, 0) + impressions
        
        # Add top 50 pages by impressions
        top_pages = sorted(page_impressions.items(), key=lambda x: x[1], reverse=True)[:50]
        for page, _ in top_pages:
            urls.add(page)

urls = [u for u in urls if u.startswith(SITE)]

print(f"Auditing {len(urls)} URLs...")
print()

# Run crawl (fast - no PSI to avoid rate limits for now)
crawl_results = []
for i, url in enumerate(urls, 1):
    print(f"[{i}/{len(urls)}] Crawling {url}...")
    result = audit_url(url)
    crawl_results.append(result)

# Flag issues
def flag_issues(row):
    issues = []
    
    # HTTP errors
    status = row.get("status")
    if status and status >= 400:
        issues.append("http-error")
    
    # Missing SEO elements
    if not row.get("title"):
        issues.append("missing-title")
    if not row.get("h1"):
        issues.append("missing-h1")
    if not row.get("meta_desc"):
        issues.append("missing-meta")
    
    # Thin content
    wordcount = row.get("wordcount", 0)
    if wordcount < 500:
        issues.append("thin-content")
    
    return ",".join(issues)

# Add issue flags
for row in crawl_results:
    row["issues"] = flag_issues(row)

# Write tech_audit.csv
with open("tech_audit.csv", "w", newline="") as f:
    fieldnames = ["url", "status", "title", "h1", "meta_desc", "canonical", "wordcount", "issues"]
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    for row in crawl_results:
        writer.writerow({k: row.get(k, "") for k in fieldnames})

print()
print(f"✓ Wrote tech_audit.csv ({len(crawl_results)} URLs)")

# Generate summary
total = len(crawl_results)
status_200 = sum(1 for r in crawl_results if r.get("status") == 200)
has_issues = sum(1 for r in crawl_results if r.get("issues"))
avg_wordcount = sum(r.get("wordcount", 0) for r in crawl_results) / total if total else 0

print()
print("=" * 80)
print("TECH AUDIT SUMMARY")
print("=" * 80)
print(f"Total URLs: {total}")
print(f"Status 200: {status_200}/{total} ({status_200*100//total}%)")
print(f"URLs with Issues: {has_issues}/{total} ({has_issues*100//total}%)")
print(f"Average Word Count: {avg_wordcount:.0f}")
print()

# Issue breakdown
issue_counts = {}
for r in crawl_results:
    if r.get("issues"):
        for issue in r["issues"].split(","):
            issue_counts[issue] = issue_counts.get(issue, 0) + 1

if issue_counts:
    print("Issue Breakdown:")
    for issue, count in sorted(issue_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {issue}: {count}")
    print()

# Highlight Orlando pages
print("=" * 80)
print("ORLANDO PAGES STATUS")
print("=" * 80)
orlando_pages = [r for r in crawl_results if "orlando" in r.get("url", "").lower()]
for page in orlando_pages:
    url = page.get("url", "")
    path = url.replace(SITE, "") or "/"
    status = page.get("status", "N/A")
    wordcount = page.get("wordcount", 0)
    issues = page.get("issues", "")
    
    status_icon = "✓" if status == 200 else "✗"
    issues_icon = "✗" if issues else "✓"
    
    print(f"{status_icon} {path:<40} {status:>3} {wordcount:>4}w {issues_icon} {issues}")

print()

# Create tasks_with_tech.csv
if os.path.exists("tasks_enriched.csv"):
    tasks_in = "tasks_enriched.csv"
elif os.path.exists("tasks.csv"):
    tasks_in = "tasks.csv"
else:
    print("⚠️  No tasks.csv found, skipping tasks_with_tech.csv generation")
    exit(0)

# Read existing tasks
with open(tasks_in, "r") as f:
    reader = csv.DictReader(f)
    existing_tasks = list(reader)
    fieldnames = reader.fieldnames

# Add tech-fix tasks
tech_tasks = []
for row in crawl_results:
    if row.get("issues"):
        tech_tasks.append({
            "type": "tech-fix",
            "target_query": "(n/a)",
            "suggested_url": row.get("url", ""),
            "rationale": f"Issues: {row['issues']}",
            "serp_position": "",
            "serp_url": "",
            "refined_action": "tech-fix",
            "rank_on_wrong_url": "False"
        })

# Write combined tasks
all_tasks = existing_tasks + tech_tasks
with open("tasks_with_tech.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(all_tasks)

print(f"✓ Wrote tasks_with_tech.csv ({len(existing_tasks)} existing + {len(tech_tasks)} tech tasks)")
print()
print(f"📊 Next: Review tech_audit.csv and prioritize fixes")
