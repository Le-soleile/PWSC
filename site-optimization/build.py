"""Build versioned assets from the preserved compiled site and readable refinements."""
from pathlib import Path
import hashlib
import re
import runpy
import shutil
import sys
import json

source = Path(__file__).resolve().parent
if '--skip-prd' not in sys.argv:
    runpy.run_path(str(source / 'restaurant' / 'build_prd.py'), run_name='__main__')
runpy.run_path(str(source / 'certificates' / 'build.py'), run_name='__main__')
site = source.parent / 'dist'
assets = site / 'assets'
shutil.copy2(source / 'site-theme.css', assets / 'site-theme.css')
runpy.run_path(str(source / 'build_world_agents_motion.py'), run_name='__main__')
runpy.run_path(str(source / 'build_cleanbot_template.py'), run_name='__main__')
runpy.run_path(str(source / 'build_experience_template.py'), run_name='__main__')
shutil.copytree(source / 'world-agents-motion', assets / 'world-agents-motion', dirs_exist_ok=True)
shutil.copytree(source / 'world-agents' / 'images', assets / 'world-agents', dirs_exist_ok=True)
product_images = [
    'ChatGPT 图像 2026年11月1日 23_10_43-1.png',
    'ChatGPT 图像 2026年11月1日 23_10_52-2.png',
    'ChatGPT 图像 2026年11月1日 23_11_04-3.png',
]
for image_index, image_filename in enumerate(product_images):
    image_file = site / image_filename
    image_name = 'cleanbot-concept-' + hashlib.sha256(image_file.read_bytes()).hexdigest()[:12] + '.png'
    shutil.copy2(image_file, assets / image_name)
    if image_index == 0:
        concept_name = image_name
original = assets / 'index-c7332d4c5fbd.js'
bundle = original.read_text()
for start, end, filename in [
    ('function m(){', 'var h=', 'header.js'),
    ('function I(){', 'var te=[', 'hero.js'),
    ('function ce({', 'function le(', 'about.js'),
    ('function le(', 'var ue=', 'projects.js'),
    ('function cl(){', 'var ll=', 'motion.js'),
    ('function Oa({', 'var ka=', 'restaurant.js'),
    ('var ka=', 'var Fa=', 'world-agents.js'),
    ('function dl(){', '(0,f.createRoot)', 'root.js'),
]:
    left = bundle.index(start)
    right = bundle.index(end, left)
    bundle = bundle[:left] + (source / filename).read_text() + bundle[right:]
# Keep the public identity consistent, including the preserved profile data,
# copyright footer, accessibility labels, HTML title and sharing metadata.
def public_identity(text):
    return re.sub(r'杨晓春|XiaoChun Yang|Yang Xiaochun', 'Le-soleile', text, flags=re.IGNORECASE)

bundle = public_identity(bundle).replace('项目介绍', '产品练习（个人探索与尝试）')
# Remove the final contact section's introductory note, including its line break.
contact_note = ',(0,p.jsxs)(`p`,{className:`contact-note`,children:[`这里记录我做过的事、走过的弯路，`,(0,p.jsx)(`br`,{}),`和一些还没想明白的问题。`]})'
assert bundle.count(contact_note) == 1
bundle = bundle.replace(contact_note, '')
bundle = bundle.replace('WORLD_AGENTS_MOTION_HELPER', (source / 'world-agents-motion.js').read_text())
experience_media = json.loads((source / 'experience-media' / 'content.json').read_text())
bundle = bundle.replace('EXPERIENCE_MEDIA_CONTENT', json.dumps(experience_media, ensure_ascii=False))
shutil.copytree(source / 'experience-media', assets / 'experience-media', dirs_exist_ok=True)
media = json.loads((source / 'restaurant' / 'media.json').read_text())
bundle = bundle.replace('CLEANBOT_MEDIA', json.dumps(media, ensure_ascii=False))
content = json.loads((source / 'restaurant' / 'content.json').read_text())
bundle = bundle.replace('CLEANBOT_CONTENT', json.dumps(content, ensure_ascii=False))
contact = json.loads((source / 'contact.json').read_text())
assert re.fullmatch(r'1[0-9]{10}', contact['phone'])
bundle = bundle.replace('EXPERIENCE_CONTACT', json.dumps(contact, ensure_ascii=False))
world_agents = json.loads((source / 'world-agents' / 'content.json').read_text())
bundle = bundle.replace('WORLD_AGENTS_CONTENT', json.dumps(world_agents, ensure_ascii=False))
world_project = {'id':'P/01', 'status':'产品探索', 'slug':'world-of-agents', 'title':world_agents['title'], 'subtitle':world_agents['subtitle'], 'description':world_agents['intro'], 'focus':[], 'image':''}
bundle, world_replaced = re.subn(r'\{id:`P/01`,status:.*?image:`/embodied-dataops-cover.png`\}', lambda _: json.dumps(world_project, ensure_ascii=False), bundle)
assert world_replaced == 1
# The old embedded restaurant document is now the standalone PRD; its renderer
# is unused by the replacement component and need not ship to every visitor.
legacy_left = bundle.index('var Ca=`<!DOCTYPE html>')
legacy_right = bundle.index('function Oa({', legacy_left)
bundle = bundle[:legacy_left] + bundle[legacy_right:]
bundle = bundle.replace('function Oa({ onBack }) {', (source / 'restaurant' / 'touchscreen.js').read_text() + '\nfunction Oa({ onBack }) {')
concept_name = media['hero']['src'].split('/')[-1]
bundle = bundle.replace('/restaurant-cleaning-robot.png', '/assets/' + concept_name)
bundle = bundle.replace('slug:`g1-cleaning`', 'slug:`cleanbot`')
# The homepage summary reflects the current product concept, rather than a
# fixed dual-arm hardware configuration or a completed deployment claim.
project_summary_before = '面向高校食堂与餐饮连锁的轮式双臂清洁机器人，从桌面即时清洁到地面巡回作业，建立可落地的服务流程。'
project_summary_after = '面向餐具自助回收的高校食堂，探索离席识别、自动派单与到桌清洁，让餐桌尽快恢复可用。目前处于概念与验证阶段。'
assert bundle.count(project_summary_before) == 1
bundle = bundle.replace(project_summary_before, project_summary_after)
bundle = bundle.replace('面向高校食堂与广大餐饮行业，需求非常广泛、技术可行性强。', project_summary_after)
# User-approved update to the publication summary card.
publication_before = 'value:`02`,label:`IEEE ICMA 录用论文`,unit:`PUBLICATIONS`'
publication_after = 'value:`03`,label:`参与发表三篇深度强化学习论文`,unit:`PUBLICATIONS`'
assert bundle.count(publication_before) == 1
bundle = bundle.replace(publication_before, publication_after)
paper_title_before = 'shortTitle:`IEEE ICMA 论文（四作）`'
assert bundle.count(paper_title_before) == 1
bundle = bundle.replace(paper_title_before, 'shortTitle:`IEEE ICMA/Wiley JFR（四作）`')
contact_title_before = '把复杂的问题，做成能用的东西'
assert bundle.count(contact_title_before) == 2
bundle = bundle.replace(contact_title_before, '探究实际问题，共谋科技普惠')
email_button_before = '(0,p.jsxs)(`a`,{href:`mailto:${ie.email}`,children:[(0,p.jsxs)(`span`,{children:[(0,p.jsx)(j,{"aria-hidden":`true`}),` 发送邮件`]}),(0,p.jsx)(D,{"aria-hidden":`true`})]})'
email_display_after = '(0,p.jsxs)(`span`,{children:[(0,p.jsxs)(`span`,{children:[(0,p.jsx)(j,{"aria-hidden":`true`}),` 邮箱`]}),ie.email]})'
assert bundle.count(email_button_before) == 1
bundle = bundle.replace(email_button_before, email_display_after)
github_contact = '(0,p.jsxs)(`a`,{href:ie.github,target:`_blank`,rel:`noreferrer`,children:[(0,p.jsxs)(`span`,{children:[(0,p.jsx)(A,{"aria-hidden":`true`}),` GitHub`]}),(0,p.jsx)(D,{"aria-hidden":`true`})]})'
contact_order_before = email_display_after + ',' + github_contact
assert bundle.count(contact_order_before) == 1
bundle = bundle.replace(contact_order_before, github_contact + ',' + email_display_after)
# Keep the education headline and its full details consistent with the approved destination.
for previous in ['本校保研控制科学与工程', '保研控制科学与工程', '保研控制']:
    bundle = bundle.replace(previous, '已保研至本校智能科学与技术')
# Remove chapter numbering, including the notes heading inside the contact chapter.
bundle, removed_indices = re.subn(r'\(0,p\.jsx\)\(`span`,\{className:`section-head__index`,children:`0[234]`\}\),', '', bundle)
assert removed_indices == 2

# Read edited experience data for the homepage as well as detail pages.
experience_data = json.loads((source / 'experience-content.json').read_text(encoding='utf-8'))
experience_start = bundle.index('var te=[') + len('var te=')
experience_end = bundle.index('],ne=', experience_start) + 1
bundle = bundle[:experience_start] + json.dumps(experience_data, ensure_ascii=False) + bundle[experience_end:]
bundle = bundle.replace('参与发表三篇深度强化学习论文', '参与三篇深度强化学习研究论文')

css = '\n'.join((source / name).read_text() for name in ['interface.css', 'structure.css', 'editorial.css', 'reader.css', 'ambient.css', 'homepage-motion.css', 'restaurant.css', 'world-agents.css', 'site-theme.css'])
js_name = 'interface-' + hashlib.sha256(bundle.encode()).hexdigest()[:12] + '.js'
css_name = 'interface-' + hashlib.sha256(css.encode()).hexdigest()[:12] + '.css'
(assets / js_name).write_text(bundle)
(assets / css_name).write_text(css)
html = public_identity((site / 'index.html').read_text())
# Only the product route preloads its hero. The portfolio keeps its own first paint.
html = re.sub(r'\s*<script data-cleanbot-preload>.*?</script>', '', html, flags=re.S)
html = re.sub(r'\s*<script data-cleanbot-style-boot>.*?</script>', '', html, flags=re.S)
html = re.sub(r'\s*<script data-style-media>.*?</script>', '', html, flags=re.S)
preload = '<script data-cleanbot-preload>if(/^#product\\/(cleanbot|g1-cleaning)$/.test(location.hash)){const image=document.createElement("link");image.rel="preload";image.as="image";image.href=%s;image.imageSrcset=%s;image.imageSizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1023px) 620px, (max-width: 1400px) 46vw, 594px";image.fetchPriority="high";document.head.appendChild(image);}</script>' % (json.dumps(media['hero']['src']), json.dumps(media['hero']['srcSet']))
html = html.replace('    <script type="module"', '    ' + preload + '\n    <script type="module"')
html = re.sub(r'src="/assets/[^" ]+\.js"', f'src="/assets/{js_name}"', html)
html = re.sub(r'\s*<link[^>]+href="/assets/interface-[^" ]+\.css"[^>]*>', '', html)
html = html.replace('  </head>', f'    <link rel="stylesheet" href="/assets/{css_name}">\n  </head>')
# The product's critical stylesheet is small and independent. Shared portfolio
# styles remain cached in the background and are activated before returning.
critical_css = "html.cleanbot-document body{margin:0;min-width:320px;background:#0a0b0d;font-synthesis:none;-webkit-font-smoothing:antialiased}\n" + (source / 'restaurant.css').read_text()
style_boot = """<script data-cleanbot-style-boot>if(/^#product\\/(cleanbot|g1-cleaning)$/.test(location.hash)){document.documentElement.classList.add('cleanbot-document');document.write(%s);let ready;window.__restorePortfolioStyles=()=>ready||(ready=Promise.all([...document.querySelectorAll('link[data-site-style]')].map(link=>new Promise(resolve=>{if(link.sheet){link.media='all';resolve();}else{link.addEventListener('load',resolve,{once:true});link.addEventListener('error',resolve,{once:true});link.media='all';}}))));}</script>""" % json.dumps('<style data-cleanbot-inline>' + critical_css + '</style>')
def defer_shared_style(match):
    tag = re.sub(r'\s+(?:media="[^"]*"|data-site-style)', '', match.group())
    tag = tag[:-1] + ' data-site-style media="not all">'
    return tag + '<script data-style-media>if(!/^#product\\/(cleanbot|g1-cleaning)$/.test(location.hash))document.currentScript.previousElementSibling.media="all";</script>'
html = re.sub(r'<link[^>]+rel="stylesheet"[^>]*>', defer_shared_style, html)
html = html.replace('    <script type="module"', '    ' + style_boot + '\n    <script type="module"')
(site / 'index.html').write_text(html)
print(js_name)
print(css_name)
