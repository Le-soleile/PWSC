(() => {
 const slug=new URLSearchParams(location.search).get('case')||'heu-education';
 const exp=templateExperienceData.find(x=>x.slug===slug), record=templateExperienceRecords[slug];
 if(!exp||!record){location.replace('/#about');return}
 const media=templateExperienceMedia[slug]||{};
 const items=Object.values(media).flat().flatMap(g=>g.items||[]);
 const first=items.find(x=>x.type==='image')||items.find(x=>x.poster);
 document.title=record.title+' · Le-soleile';document.documentElement.lang='zh-CN';
 const h=(tag,text)=>{const el=document.createElement(tag);el.textContent=text;return el};
 const brand=document.querySelector('.navbar-brand');brand.href='/#top';brand.replaceChildren(h('span','Le-soleile'));
 [['首页','/#top'],['个人经历','/#about'],['项目','/#products'],['联系','/#contact']].forEach(([text,url],i)=>{const a=document.querySelectorAll('.navbar-link')[i];a.textContent=text;a.href=url});
 const contact=document.querySelector('.navbar-wrapper .button');contact.href='/#contact';contact.textContent='联系我';
 const back=document.querySelector('.nav-back .helper');back.href='/#about';back.querySelector('.tittle-badge').textContent='返回经历';
 document.querySelector('.nav-back .badge .tittle-badge').textContent=exp.time;
 document.querySelector('.section-tittle .badge .tittle-badge').textContent=record.category;
 document.querySelector('.wrapper-blog .nav-back')?.remove();
 document.querySelector('.wrapper-blog .section-tittle>.badge')?.remove();
 document.querySelector('h1').textContent=record.title;
 document.querySelector('.paragraph-large').textContent=record.lead;
 const banner=document.querySelector('.banner-tumbnail');
 if(first){banner.src=first.type==='video'?first.poster:first.src;banner.removeAttribute('srcset');banner.alt=first.title;banner.loading='eager';banner.style.height='auto';banner.style.objectFit='contain'}else banner.parentElement.remove();
 const rich=document.querySelector('.rich-text');rich.replaceChildren();
 rich.append(h('h4','经历概述'),h('p',exp.summary));
 const facts=document.createElement('ul');exp.facts.forEach(x=>facts.append(h('li',x)));rich.append(facts);
 const appendGroups=(groups=[])=>groups.forEach(group=>{rich.append(h('h4',group.title),h('p',group.text));group.items.filter(item=>item!==first).forEach(item=>{const figure=document.createElement('figure');figure.className='w-richtext-align-fullwidth w-richtext-figure-type-image';const div=document.createElement('div');const asset=document.createElement(item.type==='video'?'video':'img');asset.src=item.src;if(item.type==='video'){asset.controls=true;asset.preload='none';asset.poster=item.poster;asset.playsInline=true;asset.setAttribute('aria-label',item.title)}else{asset.alt=item.title;asset.loading='lazy'}div.append(asset);figure.append(div,h('figcaption',item.text));if(item.original?.startsWith('https://')||item.original?.endsWith('.pdf')){const a=h('a',item.original.endsWith('.pdf')?'查看证书 PDF ↗':'查看原始记录 ↗');a.href=item.original;a.target='_blank';a.rel='noopener noreferrer';figure.querySelector('figcaption').append(document.createTextNode(' '),a)}rich.append(figure)})});
 for(const [key,text] of Object.entries(exp.story)){rich.append(h('h4',key),h('p',text));if(key==='起点')appendGroups(media.origin);if(key==='挑战')appendGroups(media.constraints);if(key==='结果')appendGroups(media.iterations)}
 rich.append(h('blockquote',record.result));
 const resources=h('h4','相关资料');rich.append(resources);
 (templateExperienceLinks[slug]||[]).forEach(({label,href})=>{const p=document.createElement('p'),a=h('a',label+' ↗');a.href=href;a.target='_blank';a.rel='noopener noreferrer';p.append(a);rich.append(p)});
 if(slug==='competitions'){const p=document.createElement('p'),a=h('a','查看全部证书 ↗');a.href='/certificates.html';p.append(a);rich.append(p)}
 rich.append(h('h4','继续浏览'));
 for(const [key,value] of Object.entries(templateExperienceRecords)){if(key===slug)continue;const p=document.createElement('p'),a=h('a',value.title+' ↗');a.href='/experience.html?case='+key;p.append(a);rich.append(p)}
 const footer=document.querySelector('footer');
 footer.querySelectorAll('a').forEach(a=>{const txt=a.textContent.trim();if(a.classList.contains('navbar-brand')){a.href='/#top';a.replaceChildren(h('span','Le-soleile'))}else if(['Home','Portfolio','Blog','About'].includes(txt)){a.href=txt==='Home'?'/#top':txt==='Portfolio'?'/#products':'/#about';a.textContent={Home:'首页',Portfolio:'项目',Blog:'经历',About:'关于'}[txt]}else if(txt==='Hello@mail.com'){a.replaceWith(h('span','Le-soleile / 个人网站'))}else if(txt==='XYZ Square'){a.href='/#contact';a.textContent='保持联系'}else{a.href='/#about';a.textContent=txt==='License'?'个人经历':'返回首页'}});
 const walker=document.createTreeWalker(footer,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){const t=n.textContent.trim();if(t==='Captivating Visual Stories')n.textContent='经历、作品与思考';if(t==='Pages')n.textContent='页面';if(t==='Informations')n.textContent='了解更多';if(t==='Contact')n.textContent='联系';if(t.includes('All Rights Reserved'))n.textContent='© 2026 Le-soleile'}
 document.querySelectorAll('video').forEach(v=>v.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(v!==other)other.pause()})));
})();
