import urllib.request
import re
import os

with open('canva_view.html', 'r', encoding='utf-8') as f:
    html = f.read()

urls = re.findall(r'https://media\.canva\.com/v2/document-image/[^"\'\s<>]+', html)
print(f"Total matching URLs: {len(urls)}")

os.makedirs('canva_pages', exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
}

downloaded = []
seen = set()

for i, u in enumerate(urls):
    # Decode html entities if any
    clean_url = u.replace('&amp;', '&')
    # Extract page index
    page_match = re.search(r'000(\d)\.png', clean_url)
    p_num = page_match.group(1) if page_match else str(i+1)
    
    if p_num in seen:
        continue
    seen.add(p_num)
    
    out_file = f'canva_pages/page_{p_num}.png'
    try:
        req = urllib.request.Request(clean_url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(out_file, 'wb') as out:
            out.write(resp.read())
        print(f"Saved {out_file} ({os.path.getsize(out_file)} bytes)")
        downloaded.append(out_file)
    except Exception as e:
        print(f"Failed to download {clean_url}: {e}")

print("Downloaded pages:", downloaded)
