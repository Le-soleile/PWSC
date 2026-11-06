from pathlib import Path
import json,re
root=Path(__file__).resolve().parent
site=root.parent/'dist'
s=(site/'模板/3/index.html').read_text(encoding='utf8')
s=s.replace('<html data-wf-page=', '<html lang="zh-CN" data-wf-page=',1).replace(' lang="en"','',1)
s=s.replace('<title>Daxa</title>','<title>CleanBot · 智能餐厅清洁</title>')
s=s.replace('href="css/', 'href="/模板/3/css/').replace('src="js/', 'src="/模板/3/js/')
s=re.sub(r'<style>html\.w-mod-js:not\(\.w-mod-ix3\).*?</style>', '', s, count=1, flags=re.S)
s=re.sub(r'<script type="application/ld\+json">.*?</script>', '', s, flags=re.S)
s=s.replace('</head>','<link rel="stylesheet" href="/assets/cleanbot-template3.css"></head>')
s=s.replace('<script src="/模板/3/js/jquery-', '<script src="/assets/cleanbot-template3.js"></script><script src="/模板/3/js/jquery-',1)
s=s.replace('</head>', '<link rel="stylesheet" href="/assets/template-navigation.css"></head>')
s=s.replace('<script src="/assets/cleanbot-template3.js"></script>', '<script src="/assets/cleanbot-template3.js"></script><script src="/assets/template-navigation.js"></script>')
s=re.sub(r'<meta[^>]+(?:property="(?:og:[^"]+)"|name="(?:description|twitter:[^"]+)")[^>]*>', '', s)

(site/'cleanbot.html').write_text(s,encoding='utf8')
(site/'assets/cleanbot-template3.js').write_text('window.CLEANBOT_TEMPLATE_CONTENT='+json.dumps(json.loads((root/'restaurant/content.json').read_text(encoding='utf8')),ensure_ascii=False)+';\n'+(root/'restaurant/template3.js').read_text(encoding='utf8'),encoding='utf8')
(site/'assets/cleanbot-template3.css').write_text((root/'restaurant/template3.css').read_text(encoding='utf8'),encoding='utf8')

(site/'assets/template-navigation.js').write_text((root/'template-navigation.js').read_text(encoding='utf8'),encoding='utf8')
(site/'assets/template-navigation.css').write_text((root/'template-navigation.css').read_text(encoding='utf8'),encoding='utf8')
