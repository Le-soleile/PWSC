"""Build the current PRD from its editable Markdown source (standard library only)."""
from pathlib import Path
from html import escape
import hashlib
import re
import shutil

ROOT = Path(__file__).resolve().parent
DEST = ROOT.parent.parent / 'dist' / 'docs'
DEST.mkdir(exist_ok=True)
source = (ROOT / 'prd.md').read_text()
lines = source.splitlines()
sections = []
preamble = []
current = preamble
for line in lines:
    if line.startswith('## '):
        title = line[3:].strip()
        index = re.match(r'(\d{2}) ', title)
        assert index, 'Section headings must start with a two-digit index'
        sections.append({'id': 'section-' + index.group(1), 'title': title, 'lines': []})
        current = sections[-1]['lines']
    else:
        current.append(line)
assert len(sections) == 10
identifiers = []
for line in lines:
    if line.startswith('| '):
        first = line.split('|')[1].strip()
        match = re.match(r'((?:FR|HW|SW|SAFE|PERF|ODD|TEST|D)-\d+)\b', first)
        if match:
            identifiers.append(match.group(1))
assert len(identifiers) == len(set(identifiers)), 'Duplicate requirement identifiers'
known = set(identifiers)
for reference in re.findall(r'\b(?:FR|HW|SW|SAFE|PERF|ODD|TEST|D)-\d+\b', source):
    assert reference in known, 'Unresolved identifier: ' + reference


def inline(text):
    slots = []
    def link(match):
        label, url = match.groups()
        assert url.startswith(('/', '#', 'https://')), 'Unsupported link URL'
        extra = ' target="_blank" rel="noopener noreferrer"' if url.startswith('https://') else ''
        slots.append('<a href="' + escape(url, quote=True) + '"' + extra + '>' + escape(label) + '</a>')
        return '\x01' + str(len(slots) - 1) + '\x02'
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link, text)
    text = escape(text)
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
    text = re.sub(r'\b(?:FR|HW|SW|SAFE|PERF|ODD|TEST|D)-\d+\b', lambda m: '<a class="req-link" href="#' + m.group().lower() + '">' + m.group() + '</a>', text)
    for index, value in enumerate(slots):
        text = text.replace('\x01' + str(index) + '\x02', value)
    return text


def render(block, label):
    output = []
    i = 0
    while i < len(block):
        line = block[i].strip()
        if not line or line.startswith('# '):
            i += 1
            continue
        if line.startswith('|'):
            rows = []
            while i < len(block) and block[i].strip().startswith('|'):
                rows.append([cell.strip() for cell in block[i].strip().strip('|').split('|')])
                i += 1
            headers = rows[0]
            assert all(re.fullmatch(r':?-+:?', cell) for cell in rows[1]), 'Missing table separator'
            assert all(len(row) == len(headers) for row in rows), 'Mismatched table columns'
            head = '<thead><tr>' + ''.join('<th scope="col">' + inline(h) + '</th>' for h in headers) + '</tr></thead>'
            body = []
            for row in rows[2:]:
                match = re.match(r'((?:FR|HW|SW|SAFE|PERF|ODD|TEST|D)-\d+)\b', row[0])
                anchor = ' id="' + match.group(1).lower() + '"' if match else ''
                body.append('<tr' + anchor + '>' + ''.join('<td>' + inline(cell) + '</td>' for cell in row) + '</tr>')
            output.append('<p class="table-hint">表格可左右滑动</p><div class="table-scroll" tabindex="0" role="region" aria-label="' + escape(label) + '表格"><table data-columns="' + str(len(headers)) + '">' + head + '<tbody>' + ''.join(body) + '</tbody></table></div>')
            continue
        if line.startswith('- ') or re.match(r'\d+\. ', line):
            ordered = bool(re.match(r'\d+\. ', line))
            pattern = r'\d+\. ' if ordered else r'- '
            items = []
            while i < len(block) and re.match(pattern, block[i].strip()):
                items.append('<li>' + inline(re.sub('^' + pattern, '', block[i].strip())) + '</li>')
                i += 1
            tag = 'ol' if ordered else 'ul'
            cls = ' class="doc-meta"' if label == '文档信息' else ''
            output.append('<' + tag + cls + '>' + ''.join(items) + '</' + tag + '>')
            continue
        paragraph = []
        while i < len(block) and block[i].strip() and not block[i].startswith(('|', '- ', '#')) and not re.match(r'\d+\. ', block[i]):
            paragraph.append(block[i].strip())
            i += 1
        output.append('<p>' + inline(' '.join(paragraph)) + '</p>')
    return '\n'.join(output)

nav = ''.join('<a href="#' + s['id'] + '">' + escape(s['title']) + '</a>' for s in sections)
body = '\n'.join('<section id="' + s['id'] + '" aria-labelledby="' + s['id'] + '-title"><h2 id="' + s['id'] + '-title">' + escape(s['title']) + '</h2>' + render(s['lines'], s['title']) + '</section>' for s in sections)
intro = render(preamble, '文档信息').replace('<p>', '<p class="intro">', 1)
css = (ROOT / 'prd.css').read_text()
js = (ROOT / 'prd.js').read_text()
cssname = 'cleanbot-prd-' + hashlib.sha256(css.encode()).hexdigest()[:12] + '.css'
jsname = 'cleanbot-prd-' + hashlib.sha256(js.encode()).hexdigest()[:12] + '.js'
(DEST / cssname).write_text(css)
(DEST / jsname).write_text(js)
shutil.copyfile(ROOT / 'prd.md', DEST / 'cleanbot-prd.md')
html = '''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="description" content="CleanBot 产品需求文档：规则空桌清洁的范围、作业边界、需求、异常处理和验收方法。"><title>CleanBot · 产品需求文档 PRD</title><link rel="icon" href="/avatar.jpg?v=2"><link rel="stylesheet" href="/docs/{css}"><script src="/docs/{js}" defer></script></head>
<body><a class="skip" href="#doc-main">跳至文档正文</a><header><div class="topbar"><a href="/#product/cleanbot">← 返回产品介绍</a><span>CleanBot / 产品需求文档</span><div class="doc-actions"><a href="/docs/cleanbot-prd.md" download>下载源稿</a><button id="print-doc" type="button">打印 / PDF</button></div></div></header>
<div class="doc-layout"><aside aria-label="文档目录"><p>CONTENTS / 文档目录</p><nav>{nav}</nav></aside><main id="doc-main"><p class="eyebrow">PRODUCT REQUIREMENTS · V2.1</p><h1>CleanBot 产品需求文档</h1>{intro}<details class="mobile-toc"><summary>查看文档目录</summary><nav>{nav}</nav></details>{body}<footer>Le-soleile · CleanBot · v2.1 评审稿<br>源稿为 Markdown，网页与打印版由同一份源稿生成。<br><a href="/#product/cleanbot">返回产品介绍</a></footer></main></div></body></html>'''.format(css=cssname, js=jsname, nav=nav, intro=intro, body=body)
(DEST / 'cleanbot-prd.html').write_text(html)
# The compatibility document is retained; current navigation uses CleanBot.
print('Built CleanBot PRD v2.1: {} sections, {} traceable IDs, {} source characters'.format(len(sections), len(known), len(source)))
print(cssname)
print(jsname)
