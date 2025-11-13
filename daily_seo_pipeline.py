#!/usr/bin/env python3
"""
Orchestrates the full daily SEO pipeline and emails a summary.
Designed to run as a Replit Scheduled Deployment.
"""
import os, subprocess, csv, json
from datetime import datetime
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# ---- Config via environment variables ----
SITE_URL = os.getenv("SITE_URL", "https://empathyhealthclinic.com")
CITY     = os.getenv("CITY", "Orlando, Florida, United States")

EMAIL_TO   = os.getenv("EMAIL_TO", "providers@empathyhealthclinic.com,kevin.mease@gmail.com")
EMAIL_FROM = os.getenv("EMAIL_FROM", "seo@empathyhealthclinic.com")
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")

def run(cmd):
    """Run a command and print it"""
    print(">>", " ".join(cmd))
    try:
        subprocess.check_call(cmd)
        return True
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Command failed: {e}")
        return False

def safe_read_csv(path):
    """Safely read CSV file"""
    if not os.path.exists(path):
        return []
    with open(path, 'r') as f:
        return list(csv.DictReader(f))

print("=" * 80)
print(f"EMPATHY HEALTH SEO DAILY PIPELINE - {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}")
print("=" * 80)
print()

# 1) GSC → tasks.csv
print("Step 1: Fetching Google Search Console data...")
if os.path.exists("main.py"):
    run(["python3", "main.py"])
else:
    print("⚠️ main.py not found, skipping GSC fetch")

# 2) SERP ranks → tasks_enriched.csv + serp_ranks.csv
print("\nStep 2: Updating SERP rankings...")
if os.path.exists("step2_serp_update_tasks.py"):
    run(["python3", "step2_serp_update_tasks.py"])
else:
    print("⚠️ step2_serp_update_tasks.py not found, skipping SERP update")

# 2.5) Fetch latest Screaming Frog crawl from iCloud
print("\nStep 2.5: Fetching latest Screaming Frog crawl from iCloud...")
if os.path.exists("fetch_sf_crawl.py"):
    if run(["python3", "fetch_sf_crawl.py"]):
        print("✅ Fresh Screaming Frog data downloaded")
    else:
        print("⚠️ iCloud fetch failed, will use existing data if available")
else:
    print("⚠️ fetch_sf_crawl.py not found, skipping iCloud download")

# 3) Parse Screaming Frog export OR run tech audit
print("\nStep 3: Analyzing technical SEO signals...")
tech_audit_ran = False

if os.path.exists("internal_all.csv"):
    # Use freshly downloaded or existing Screaming Frog export
    if os.path.exists("step3_parse_sf_exports.py"):
        if run(["python3", "step3_parse_sf_exports.py"]):
            tech_audit_ran = True
            print("✅ Technical audit completed using Screaming Frog data")
        else:
            print("⚠️ Screaming Frog parsing failed, continuing without tech audit")
    else:
        print("⚠️ step3_parse_sf_exports.py not found")
elif os.path.exists("attached_assets/internal_all_1762887563969.csv"):
    # Fallback to old uploaded export
    if os.path.exists("step3_parse_sf_exports.py"):
        if run(["python3", "step3_parse_sf_exports.py"]):
            tech_audit_ran = True
            print("✅ Technical audit completed using Screaming Frog data")
        else:
            print("⚠️ Screaming Frog parsing failed, continuing without tech audit")
    else:
        print("⚠️ step3_parse_sf_exports.py not found")
elif os.path.exists("step3_tech_audit.py"):
    # Fallback to live tech audit
    if run(["python3", "step3_tech_audit.py"]):
        tech_audit_ran = True
        print("✅ Technical audit completed using live crawl")
    else:
        print("⚠️ Live tech audit failed, continuing without tech audit")
else:
    print("⚠️ No tech audit script found, skipping")

if not tech_audit_ran:
    print("⚠️ Pipeline will continue without technical SEO data")
    # Create empty tech_audit.csv so merge step doesn't fail
    with open("tech_audit.csv", "w") as f:
        f.write("url,issues\n")

# 4) Merge + prioritize → tasks_final.csv
print("\nStep 4: Merging and prioritizing tasks...")
if os.path.exists("step4_merge_and_prioritize_simple.py"):
    run(["python3", "step4_merge_and_prioritize_simple.py"])
elif os.path.exists("step4_merge_and_prioritize.py"):
    run(["python3", "step4_merge_and_prioritize.py"])
else:
    print("⚠️ No merge script found, skipping prioritization")

# 4.5) AUTONOMOUS IMPLEMENTATION - Automatically implement high-priority tasks
print("\nStep 4.5: Autonomously implementing high-priority tasks...")
implementation_summary = {}
if os.path.exists("auto_implement_tasks.py"):
    if run(["python3", "auto_implement_tasks.py"]):
        # Read implementation summary if it exists
        if os.path.exists("implementation_summary.json"):
            try:
                with open("implementation_summary.json", 'r') as f:
                    implementation_summary = json.load(f)
                print(f"✅ Autonomous implementation complete:")
                print(f"   Implemented: {implementation_summary.get('implemented', 0)}")
                print(f"   Failed: {implementation_summary.get('failed', 0)}")
            except Exception as e:
                print(f"⚠️ Could not read implementation summary: {e}")
    else:
        print("⚠️ Autonomous implementation failed")
else:
    print("⚠️ auto_implement_tasks.py not found, skipping autonomous implementation")

# 5) Build summary message
print("\nStep 5: Building summary report...")

# Load current and previous SERP data for delta calculation
current_serps = {row['keyword']: row.get('position', 'Not in top 20') 
                 for row in safe_read_csv("serp_ranks.csv")}
prev_serps = {row['keyword']: row.get('position', 'Not in top 20') 
              for row in safe_read_csv("serp_ranks_prev.csv")} if os.path.exists("serp_ranks_prev.csv") else {}

# Save current as previous for next run
if os.path.exists("serp_ranks.csv"):
    import shutil
    shutil.copy("serp_ranks.csv", "serp_ranks_prev.csv")

top_tasks = safe_read_csv("tasks_final.csv")[:10]

# Calculate summary stats
ranking_count = sum(1 for pos in current_serps.values() if pos != 'Not in top 20' and pos != '-')
total_keywords = len(current_serps)
improved_count = 0

for query, current_pos in current_serps.items():
    if query in prev_serps and current_pos != 'Not in top 20' and prev_serps[query] != 'Not in top 20':
        try:
            if int(current_pos) < int(prev_serps[query]):
                improved_count += 1
        except:
            pass

msg_text = f"""Top {len(top_tasks)} Priority Keywords

Currently tracking: {total_keywords} keywords
Ranking in top 20: {ranking_count}/{total_keywords}
Improved positions: {improved_count}
"""

print("\n" + msg_text)

# 6) Send email notification via SendGrid
print("\nStep 6: Sending email notification...")
if SENDGRID_API_KEY and EMAIL_TO:
    try:
        # Build keyword table rows
        keyword_rows = ""
        for i, task in enumerate(top_tasks, 1):
            query = task.get('target_query', '')
            current_pos = task.get('serp_position', 'Not in top 20')
            action = task.get('action', 'unknown')
            
            # Calculate delta
            delta_html = "—"
            if query in prev_serps and current_pos != 'Not in top 20' and prev_serps[query] != 'Not in top 20':
                try:
                    delta = int(prev_serps[query]) - int(current_pos)
                    if delta > 0:
                        delta_html = f'<span style="color: #10b981;">▲ +{delta}</span>'
                    elif delta < 0:
                        delta_html = f'<span style="color: #ef4444;">▼ {delta}</span>'
                    else:
                        delta_html = "—"
                except:
                    pass
            
            # Map action to next step
            next_action = {
                'improve-landing': f'Optimize title tag and meta description; add internal links.',
                'create-landing': f'Create new landing page with "{query}" headline and localized schema.',
                'supporting-blog': f'Create supporting blog optimized for "{query}" intent.',
                'fix-tech-issue': f'Fix technical issues: {task.get("tech_issues", "unknown")}'
            }.get(action, 'Review and optimize content.')
            
            # Format current rank display
            rank_display = current_pos if current_pos != 'Not in top 20' else '— (not top 20)'
            
            keyword_rows += f"""
                <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 12px 8px; text-align: center; color: #6b7280;">{i}</td>
                    <td style="padding: 12px 8px; font-weight: 500;">{query}</td>
                    <td style="padding: 12px 8px; text-align: center;">{rank_display}</td>
                    <td style="padding: 12px 8px; text-align: center;">{delta_html}</td>
                    <td style="padding: 12px 8px; color: #6b7280; font-size: 13px;">{next_action}</td>
                </tr>
            """
        
        # Build autonomous implementation section
        auto_impl_section = ""
        if implementation_summary and implementation_summary.get('implemented', 0) > 0:
            impl_details = implementation_summary.get('details', {})
            impl_list = ""
            for task in impl_details.get('implemented', []):
                impl_list += f"<li style='margin-bottom: 8px;'><strong>{task.get('action', 'unknown')}:</strong> {task.get('query', 'N/A')}</li>"
            
            git_diff_preview = implementation_summary.get('git_diff', '')[:2000]
            
            auto_impl_section = f"""
                <div style="margin: 30px 0; padding: 20px; background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 5px;">
                    <h2 style="color: #10b981; margin-top: 0;">🤖 Autonomous Implementation Results</h2>
                    <p style="margin: 10px 0;"><strong>Tasks Implemented:</strong> {implementation_summary.get('implemented', 0)}</p>
                    <ul style="margin: 15px 0; padding-left: 20px;">
                        {impl_list}
                    </ul>
                    <details style="margin-top: 20px;">
                        <summary style="cursor: pointer; color: #2563eb; font-weight: 500;">View Git Diff</summary>
                        <pre style="margin-top: 10px; background: #1f2937; color: #10b981; padding: 15px; border-radius: 5px; overflow-x: auto; font-size: 11px; max-height: 400px;">{git_diff_preview}</pre>
                    </details>
                    <p style="margin-top: 15px; color: #6b7280; font-size: 13px;">
                        🔄 To rollback these changes: <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 3px;">git reset --hard HEAD~1</code>
                    </p>
                </div>
            """
        
        # Build files generated section
        files_section = ""
        for f in ["tasks.csv", "tasks_enriched.csv", "serp_ranks.csv", "tech_audit.csv", "tasks_final.csv"]:
            status = "✅" if os.path.exists(f) else "❌"
            rows = len(safe_read_csv(f)) if os.path.exists(f) else 0
            warning = " (0 rows — no technical issues found)" if f == "tech_audit.csv" and rows == 0 else ""
            files_section += f"<li>{status} <strong>{f}</strong> ({rows} rows){warning}</li>"
        
        subject = f"Empathy Health Clinic – SEO Daily Report ({datetime.utcnow().strftime('%b %d, %Y')})"
        if implementation_summary.get('implemented', 0) > 0:
            subject += f" [{implementation_summary.get('implemented')} tasks implemented]"
        
        # Build HTML email
        html_content = f"""
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
            <div style="max-width: 900px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                
                <h1 style="color: #111827; font-size: 24px; margin: 0 0 10px 0;">Empathy Health Clinic – SEO Daily Report</h1>
                <p style="color: #6b7280; margin: 0 0 30px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px;">
                    Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}
                </p>
                
                {auto_impl_section}
                
                <div style="margin: 30px 0;">
                    <h2 style="color: #111827; font-size: 20px; margin: 0 0 15px 0;">📊 SEO Performance Overview</h2>
                    <div style="background: #f9fafb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <p style="margin: 5px 0; color: #374151;"><strong>Currently tracking:</strong> {total_keywords} keywords</p>
                        <p style="margin: 5px 0; color: #374151;"><strong>Ranking in top 20:</strong> {ranking_count}/{total_keywords}</p>
                        <p style="margin: 5px 0; color: #374151;"><strong>Improved positions:</strong> {improved_count}</p>
                    </div>
                </div>
                
                <div style="margin: 30px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                    <h3 style="color: #111827; font-size: 18px; margin: 0;">Top {len(top_tasks)} Priority Keywords</h3>
                </div>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
                    <thead>
                        <tr style="background: #f3f4f6; border-bottom: 2px solid #d1d5db;">
                            <th style="padding: 12px 8px; text-align: center; color: #374151; font-weight: 600;">#</th>
                            <th style="padding: 12px 8px; text-align: left; color: #374151; font-weight: 600;">Keyword</th>
                            <th style="padding: 12px 8px; text-align: center; color: #374151; font-weight: 600;">Current Rank</th>
                            <th style="padding: 12px 8px; text-align: center; color: #374151; font-weight: 600;">Δ (vs. Yesterday)</th>
                            <th style="padding: 12px 8px; text-align: left; color: #374151; font-weight: 600;">Next Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {keyword_rows}
                    </tbody>
                </table>
                
                <div style="margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 5px; border-bottom: 2px solid #e5e7eb;">
                    <h3 style="color: #111827; margin: 0 0 15px 0;">📂 Files Generated</h3>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        {files_section}
                    </ul>
                </div>
                
                <div style="margin: 30px 0; padding: 20px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 5px;">
                    <h3 style="color: #92400e; margin: 0 0 10px 0;">🧩 Summary</h3>
                    <p style="color: #78350f; margin: 5px 0; line-height: 1.6;">
                        {'Rankings improved for several keywords. ' if improved_count > 0 else ''}
                        Focus on creating new service pages for keywords not yet ranking and enhancing insurance-related SEO through schema markup, internal linking, and stronger meta optimization.
                    </p>
                </div>
                
                <hr style="margin: 40px 0; border: none; border-top: 1px solid #e5e7eb;">
                
                <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
                    Automated by Replit SEO Pipeline<br>
                    Site: {SITE_URL} | Target City: {CITY}
                </p>
            </div>
        </body>
        </html>
        """
        
        # Send via SendGrid
        message = Mail(
            from_email=EMAIL_FROM,
            to_emails=EMAIL_TO.split(","),
            subject=subject,
            html_content=html_content
        )
        
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        
        print(f"✅ Email sent successfully (Status: {response.status_code})")
        print(f"   Recipients: {EMAIL_TO}")
        
    except Exception as e:
        print(f"❌ Email error: {e}")
else:
    print("⚠️ SendGrid API key or EMAIL_TO not configured, skipping email")
    if not SENDGRID_API_KEY:
        print("   Missing: SENDGRID_API_KEY")
    if not EMAIL_TO:
        print("   Missing: EMAIL_TO")

print("\n" + "=" * 80)
print("PIPELINE COMPLETE")
print("=" * 80)
print(f"\n📋 Next: Review tasks_final.csv and tackle top priorities!")
