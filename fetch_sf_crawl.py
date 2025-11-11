#!/usr/bin/env python3
"""
Downloads the latest Screaming Frog crawl from iCloud.
Requires ICLOUD_SF_URL environment variable set to your iCloud share link.
"""
import requests, os

# Replace this with your iCloud share link
ICLOUD_URL = os.getenv("ICLOUD_SF_URL")

if not ICLOUD_URL:
    raise SystemExit("❌ Missing ICLOUD_SF_URL secret (your iCloud share link).")

print("Downloading Screaming Frog crawl from iCloud…")
r = requests.get(ICLOUD_URL)
if r.status_code == 200:
    with open("internal_all.csv", "wb") as f:
        f.write(r.content)
    print("✅ Downloaded latest internal_all.csv")
else:
    print(f"❌ Download failed ({r.status_code})")
