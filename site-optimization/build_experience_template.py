from pathlib import Path
import json,re
root=Path(__file__).resolve().parent; site=root.parent/'dist'
s=(site/'模板/2/blog_exploring-natural-light.html').read_text(encoding='utf8')
s=s.replace('href="css/', 'href="/模板/2/css/').replace('src="js/', 'src="/模板/2/js/')
s=s.replace('<title>Exploring Natural Light</title>','<title>个人经历 · Le-soleile</title>')
s=s.replace('</head>','<link rel="stylesheet" href="/assets/experience-template2.css"></head>')
s=s.replace('<script type="text/javascript" src="/模板/2/js/jquery-', '<script src="/assets/experience-template2.js"></script><script type="text/javascript" src="/模板/2/js/jquery-',1)
s=s.replace('</head>', '<link rel="stylesheet" href="/assets/template-navigation.css"></head>')
s=s.replace('<script src="/assets/experience-template2.js"></script>', '<script src="/assets/experience-template2.js"></script><script src="/assets/template-navigation.js"></script>')
s=re.sub(r'<meta[^>]+(?:property="(?:og:[^"]+)"|name="(?:description|twitter:[^"]+)")[^>]*>', '', s)

(site/'experience.html').write_text(s,encoding='utf8')
base=(site/'assets/index-c7332d4c5fbd.js').read_text(encoding='utf8')
records=json.dumps(json.loads((root/'experience-content.json').read_text(encoding='utf8')),ensure_ascii=False)
b=base.index('],ne=',base.index('var te=['))+1
l=base.index('re={',b)+3;r=base.index(',ie={',l)
about=(root/'about.js').read_text(encoding='utf8');c=about.index('const ArchiveRecords = ')+len('const ArchiveRecords = ');d=about.index('\n};',c)+2
media=json.loads((root/'experience-media/content.json').read_text(encoding='utf8'))
js='const templateExperienceData='+records+';\nconst templateExperienceLinks='+base[l:r]+';\nconst templateExperienceRecords='+about[c:d].replace('6 项国家级、省级竞赛奖项','7 项国家级、省级竞赛奖项').replace('[[`6`, `国家级、省级奖项`]', '[[`7`, `国家级、省级奖项`]')+';\nconst templateExperienceMedia='+json.dumps(media,ensure_ascii=False)+';\n'+(root/'experience-template2.js').read_text(encoding='utf8')
(site/'assets/experience-template2.js').write_text(js,encoding='utf8')
(site/'assets/experience-template2.css').write_text((root/'experience-template2.css').read_text(encoding='utf8'),encoding='utf8')

(site/'assets/template-navigation.js').write_text((root/'template-navigation.js').read_text(encoding='utf8'),encoding='utf8')
(site/'assets/template-navigation.css').write_text((root/'template-navigation.css').read_text(encoding='utf8'),encoding='utf8')
