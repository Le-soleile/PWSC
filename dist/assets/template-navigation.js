(() => {
 const experience=location.pathname.includes('experience');
 const title=experience?document.querySelector('h1').textContent:'CleanBot';
 const entries=experience?[...document.querySelectorAll('.rich-text h3, .rich-text h4')].filter(x=>x.tagName==='H3'||x.textContent==='相关资料').map((heading,i)=>{heading.id='experience-nav-'+i;return [heading.textContent,heading.id]}):[['产品能力','capabilities'],['工作流程','workflow'],['方案模块','feature'],['G1 微调实践','g1-practice']];
 const original=document.querySelector(experience?'body>.header':'body>.navbar');
 const header=document.createElement('header');header.className='wa-header shared-template-nav';
 const shell=document.createElement('div');shell.className='wa-shell wa-nav';
 const brand=document.createElement('button');brand.className='wa-brand';brand.innerHTML='<span></span>';brand.querySelector('span').textContent=title;const small=document.createElement('small');small.textContent=experience?'PERSONAL EXPERIENCE':'ROBOTICS EXPLORATION';brand.querySelector('span').append(small);brand.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
 const nav=document.createElement('nav');nav.setAttribute('aria-label',experience?'经历章节':'产品导航');entries.forEach(([label,id])=>{const b=document.createElement('button');b.textContent=label;const underline=document.createElement('span');underline.className='wa-nav-underline';b.append(underline);b.onclick=()=>document.getElementById(id)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});nav.append(b)});
 const back=document.createElement('button');back.className='wa-return';back.innerHTML=(experience?'个人简介':'作品集')+' <span aria-hidden="true">↗</span>';back.onclick=()=>location.href=experience?'/#about':'/#products';shell.append(brand,nav,back);header.append(shell);original.replaceWith(header);
 const update=()=>{let active=0;entries.forEach((entry,i)=>{if(document.getElementById(entry[1])?.getBoundingClientRect().top<180)active=i});[...nav.children].forEach((b,i)=>{if(i===active)b.setAttribute('aria-current','location');else b.removeAttribute('aria-current')})};let frame;window.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update)},{passive:true});update();
})();
