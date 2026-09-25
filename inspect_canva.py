import urllib.request
import re
import json

url = 'https://www.canva.com/design/DAHWCzMobD0/9VRTBjfAWvcIndkcIqPM0g/view'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        
        # Look for meta tags
        og_img = re.findall(r'<meta property="og:image" content="([^"]+)"', html)
        og_title = re.findall(r'<meta property="og:title" content="([^"]+)"', html)
        og_desc = re.findall(r'<meta property="og:description" content="([^"]+)"', html)
        
        print("OG Title:", og_title)
        print("OG Desc:", og_desc)
        print("OG Image:", og_img)

        # Look for bootstrap data or JSON inside script tags
        scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
        for s in scripts:
            if 'schema.org' in s or 'document' in s or 'thumbnail' in s or 'export' in s:
                matches = re.findall(r'https://[^"\'\s]+\.(?:png|jpg|jpeg|webp)', s)
                if matches:
                    print("Found image URLs:", matches[:5])
                    
        # Check title tag
        titles = re.findall(r'<title>(.*?)</title>', html)
        print("Page Title:", titles)
        
        # Save HTML for inspection if needed
        with open('canva_view.html', 'w', encoding='utf-8') as f:
            f.write(html)
            
except Exception as e:
    print("Error fetching Canva:", e)
