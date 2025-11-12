#!/usr/bin/env python3
"""
Domain Authority Score Validator
Validates DA scores from backlink prospecting list
"""

import requests
import csv
import time
from typing import List, Dict

# Domains from the screenshot to validate
DOMAINS_TO_CHECK = [
    {"url": "https://nerdbol.com/", "claimed_da": 51},
    {"url": "https://ventsmagazine.co.uk/", "claimed_da": 56},
    {"url": "https://gorod.it.com/", "claimed_da": 91},
    {"url": "https://westernbusiness.co.uk/", "claimed_da": 41},
    {"url": "https://www.londondaily.news/", "claimed_da": 57},
    {"url": "https://primeinsider.co.uk/", "claimed_da": 41},
    {"url": "https://thetaxheaven.com/", "claimed_da": 54},
    {"url": "http://charfen.co.uk/", "claimed_da": 44},
    {"url": "https://coopmagazine.co.uk/", "claimed_da": 40},
    {"url": "https://www.openpr.com/", "claimed_da": 72},
    {"url": "https://managementworksmedia.com/", "claimed_da": 44},
    {"url": "https://fourmagazine.co.uk/", "claimed_da": 43},
    {"url": "https://imagefap.pro/", "claimed_da": 41},
    {"url": "https://shkoh.com/", "claimed_da": 40},
    {"url": "https://windmoonmagic.com/", "claimed_da": 39},
    {"url": "https://nodlemagazine.org/", "claimed_da": 39},
    {"url": "https://techbullion.com/", "claimed_da": 72},
    {"url": "https://dotmagazine.co.uk/", "claimed_da": 35},
    {"url": "https://theeuropetimes.co.uk/", "claimed_da": 40},
    {"url": "https://mikewolfepassionproject.com/", "claimed_da": 38},
    {"url": "https://breakingac.com/", "claimed_da": 41},
    {"url": "https://ocnjdaily.com/", "claimed_da": 48},
    {"url": "https://northpennnow.com/", "claimed_da": 38},
    {"url": "https://seaislenews.com/", "claimed_da": 38},
    {"url": "https://goodmenproject.com/", "claimed_da": 82},
    {"url": "https://www.daily.uk.com/", "claimed_da": 34},
    {"url": "https://orangedlp.com/", "claimed_da": 33},
    {"url": "https://sfmcompileclub.org/", "claimed_da": 42},
    {"url": "https://thebaddiehub.uk/", "claimed_da": 42},
]


def check_da_via_seoreviewtools(url: str) -> Dict:
    """
    Check DA using SEO Review Tools free endpoint
    Note: This is for demonstration - actual API may require authentication
    """
    try:
        # Clean URL
        clean_url = url.replace("https://", "").replace("http://", "").strip("/")
        
        # Using a free checker endpoint (this is a demo - may need actual API key)
        # In production, you'd use Moz API or paid service
        print(f"Checking: {clean_url}")
        
        # For now, return placeholder - we'll use web scraping or paid API
        return {
            "url": url,
            "da": None,
            "pa": None,
            "status": "needs_api_key"
        }
    except Exception as e:
        return {
            "url": url,
            "da": None,
            "pa": None,
            "status": f"error: {e}"
        }


def validate_da_scores():
    """
    Validate DA scores from the prospecting list
    """
    print("=" * 60)
    print("DOMAIN AUTHORITY VALIDATION")
    print("=" * 60)
    print()
    
    results = []
    discrepancies = []
    
    print("Available validation methods:")
    print("1. Free online tools (manual): dapachecker.org")
    print("2. Moz API (paid): $5/month for basic access")
    print("3. SEO Review Tools API (paid): $75/month")
    print()
    print("For automated validation, you'll need an API key.")
    print("For now, I'll show you how to validate manually:")
    print()
    print("=" * 60)
    print("DOMAINS TO VALIDATE")
    print("=" * 60)
    print()
    
    # Group by claimed DA for easier manual checking
    by_da = {}
    for domain in DOMAINS_TO_CHECK:
        da = domain["claimed_da"]
        if da not in by_da:
            by_da[da] = []
        by_da[da].append(domain)
    
    # Show sorted by DA (highest first)
    print(f"{'#':<4} {'URL':<45} {'Claimed DA':<12}")
    print("-" * 60)
    
    for i, domain in enumerate(sorted(DOMAINS_TO_CHECK, key=lambda x: x["claimed_da"], reverse=True), 1):
        print(f"{i:<4} {domain['url']:<45} {domain['claimed_da']:<12}")
    
    print()
    print("=" * 60)
    print("MANUAL VALIDATION STEPS")
    print("=" * 60)
    print()
    print("1. Go to: https://www.dapachecker.org/")
    print("2. Copy and paste this list (one URL per line):")
    print()
    
    for domain in DOMAINS_TO_CHECK:
        print(domain["url"])
    
    print()
    print("3. Click 'Check Authority'")
    print("4. Compare results with claimed DA scores")
    print()
    print("=" * 60)
    print("HIGH-VALUE TARGETS (DA 70+)")
    print("=" * 60)
    print()
    
    high_value = [d for d in DOMAINS_TO_CHECK if d["claimed_da"] >= 70]
    for domain in sorted(high_value, key=lambda x: x["claimed_da"], reverse=True):
        print(f"✅ {domain['url']:<45} DA {domain['claimed_da']}")
    
    print()
    print("=" * 60)
    print("SUSPICIOUS SCORES (Verify These Carefully)")
    print("=" * 60)
    print()
    print("These domains have unusually high DA scores and should be verified:")
    print()
    
    suspicious = [
        {"url": "https://gorod.it.com/", "claimed_da": 91, "reason": "Very high DA for unfamiliar domain"},
        {"url": "https://goodmenproject.com/", "claimed_da": 82, "reason": "Should verify - known domain but high DA"},
    ]
    
    for item in suspicious:
        print(f"⚠️  {item['url']}")
        print(f"    Claimed DA: {item['claimed_da']}")
        print(f"    Reason: {item['reason']}")
        print()
    
    print("=" * 60)
    print("EXPORT FOR BULK CHECKING")
    print("=" * 60)
    
    # Create CSV for bulk checking
    with open("domains_to_validate.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["URL", "Claimed_DA"])
        for domain in DOMAINS_TO_CHECK:
            writer.writerow([domain["url"], domain["claimed_da"]])
    
    print()
    print("✅ Created: domains_to_validate.csv")
    print("   Upload this to bulk DA checker tools")
    print()
    
    # Create just URLs file for copy-paste
    with open("urls_only.txt", "w") as f:
        for domain in DOMAINS_TO_CHECK:
            f.write(domain["url"] + "\n")
    
    print("✅ Created: urls_only.txt")
    print("   Copy/paste into dapachecker.org")
    print()
    
    print("=" * 60)
    print("RECOMMENDATION")
    print("=" * 60)
    print()
    print("To automate this validation, consider:")
    print()
    print("1. Moz API ($5/month):")
    print("   - 2,500 requests/month free tier")
    print("   - Official DA source")
    print("   - Sign up: https://moz.com/products/api")
    print()
    print("2. Use free bulk checker:")
    print("   - https://www.dapachecker.org/ (1000 URLs at once)")
    print("   - No registration required")
    print("   - Manual but accurate")
    print()
    print("Focus validation on:")
    print("✅ DA 70+ domains (highest value)")
    print("⚠️  Suspiciously high scores (gorod.it.com DA 91)")
    print("✅ Domains you plan to use immediately")


if __name__ == "__main__":
    validate_da_scores()
