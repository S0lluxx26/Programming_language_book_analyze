"""Download exactly the PDF links exposed by the public course landing page."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from hashlib import sha256
from html.parser import HTMLParser
import json
import logging
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen
from urllib.error import HTTPError

ROOT = Path(__file__).resolve().parents[1]
URL = 'https://prl.korea.ac.kr/courses/cose212/2026/'

class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            href = dict(attrs).get('href', '')
            if urlparse(href).path.endswith(('.pdf', '.ml')):
                self.links.append(urljoin(URL, href))

def fetch(url):
    with urlopen(Request(url, headers={'User-Agent': 'COSE212-study-companion/1.0'}), timeout=60) as response:
        return response.read()

def download(url):
    relative = url.removeprefix(URL)
    if relative == url or '..' in Path(relative).parts:
        raise ValueError(f'Unexpected source URL: {url}')
    pdf = relative.endswith('.pdf')
    destination = ROOT / 'sources' / ('pdfs' if pdf else 'code') / relative
    destination.parent.mkdir(parents=True, exist_ok=True)
    try:
        payload = fetch(url)
    except HTTPError as error:
        return {'url': url, 'file': str(destination.relative_to(ROOT)).replace('\\', '/'), 'status': error.code, 'error': str(error)}
    if pdf and not payload.startswith(b'%PDF-'):
        raise ValueError(f'Not a PDF: {url}')
    destination.write_bytes(payload)
    record = {'status': 200, 'file': str(destination.relative_to(ROOT)).replace('\\', '/'), 'url': url,
              'bytes': len(payload), 'sha256': sha256(payload).hexdigest()}
    if pdf:
        from pypdf import PdfReader
        reader = PdfReader(destination)
        record['pages'] = len(reader.pages)
        record['title'] = str((reader.metadata or {}).get('/Title', ''))
        textfile = ROOT / 'sources' / 'text' / (relative + '.txt')
        textfile.parent.mkdir(parents=True, exist_ok=True)
        textfile.write_text('\n\n'.join(f'=== PDF PAGE {i + 1} ===\n{page.extract_text()}' for i, page in enumerate(reader.pages)), encoding='utf-8')
    return record

def main():
    logging.getLogger('pypdf').setLevel(logging.ERROR)
    source = fetch(URL)
    (ROOT / 'sources').mkdir(exist_ok=True)
    (ROOT / 'sources' / 'course-page.html').write_bytes(source)
    parser = Links()
    parser.feed(source.decode('utf-8'))
    urls = sorted(set(parser.links))
    with ThreadPoolExecutor(max_workers=4) as pool:
        files = list(pool.map(download, urls))
    manifest = {'course_url': URL, 'retrieved_at': datetime.now(timezone.utc).isoformat(),
                'pdf_count': sum(f['url'].endswith('.pdf') for f in files),
                'downloaded_pdf_count': sum(f['url'].endswith('.pdf') and f['status'] == 200 for f in files), 'files': files}
    (ROOT / 'sources' / 'manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print(json.dumps(manifest, indent=2, ensure_ascii=True))

if __name__ == '__main__':
    main()
