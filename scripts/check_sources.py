from pathlib import Path
from hashlib import sha256
import json
import logging
from pypdf import PdfReader
from download_sources import Links

logging.getLogger('pypdf').setLevel(logging.ERROR)
root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'sources/manifest.json').read_text(encoding='utf-8'))
parser = Links()
parser.feed((root / 'sources/course-page.html').read_text(encoding='utf-8'))
assert set(parser.links) == {f['url'] for f in manifest['files']}
count = pages = 0
for record in manifest['files']:
    if record['status'] != 200:
        continue
    file = root / record['file']
    payload = file.read_bytes()
    assert len(payload) == record['bytes']
    assert sha256(payload).hexdigest() == record['sha256']
    if file.suffix == '.pdf':
        assert payload.startswith(b'%PDF-')
        assert len(PdfReader(file).pages) == record['pages']
        count += 1
        pages += record['pages']
assert count == manifest['downloaded_pdf_count']
print(f'Verified {count} downloaded PDFs, {pages} pages, checksums, and complete link inventory.')
print('Unavailable URLs:')
for record in manifest['files']:
    if record['status'] != 200:
        print(f"  HTTP {record['status']} {record['url']}")
