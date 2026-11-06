const ArchiveMediaContent = EXPERIENCE_MEDIA_CONTENT;
function ArchiveMediaStories({ slug, chapter }) {
  const groups = ArchiveMediaContent[slug]?.[chapter] || [];
  return groups.map((group,index) => p.jsxs(`section`, {className:`archive-media-story`, 'aria-label':group.title, children:[
    p.jsx(`p`,{className:`archive-media-kicker`,children:`现场记录 / ${String(index + 1).padStart(2,`0`)}`}),
    p.jsx(`h3`,{children:group.title}),
    p.jsx(`p`,{className:`archive-media-intro`,children:group.text}),
    p.jsx(`div`,{className:`archive-media-grid`,children:group.items.map((item,i)=>p.jsxs(`figure`,{className:`archive-media-figure${item.type === `video` ? ` is-video` : ``}${item.document || item.height > item.width * 1.8 ? ` is-document` : ``}`,children:[
      item.type === `video` ? p.jsxs(`video`,{controls:true,playsInline:true,preload:`none`,'data-poster':item.poster,'aria-label':item.title,onPlay:event=>{const current=event.currentTarget;current.closest(`.archive-reader`)?.querySelectorAll(`video`).forEach(video=>{if(video!==current)video.pause();});},children:[p.jsx(`source`,{src:item.src,type:`video/mp4`}),p.jsx(`a`,{href:item.src,children:`打开视频`})]}) : p.jsx(`a`,{href:item.original,target:`_blank`,rel:`noreferrer`,'aria-label':`查看原图：${item.title}`,children:p.jsx(`img`,{'data-src':item.src,alt:item.title,loading:`lazy`,decoding:`async`,width:item.width,height:item.height})}),
      p.jsxs(`figcaption`,{children:[p.jsx(`span`,{className:`archive-media-number`,children:`${item.type === `video` ? `VIDEO` : `PHOTO`} ${String(i+1).padStart(2,`0`)}`}),p.jsx(`h4`,{children:item.title}),p.jsx(`p`,{children:item.text}),p.jsx(`a`,{href:item.original || item.src,target:`_blank`,rel:`noreferrer`,children:item.type===`video`?`打开原始视频 ↗`:`查看原图 ↗`})]})
    ]},item.src))})
  ]},group.title));
}
const ArchiveRecords = {
  'heu-education': { category: `教育经历`, index: `01`, role: `电气自动化 · 大四`, title: `教育经历`, result: `已保研至本校智能科学与技术`, lead: `从电气自动化出发，以机器人、开源框架和强化学习项目连接硬件、系统与算法。`, stats: [[`2023`, `入学年份`], [`4`, `硬件 / 系统 / 算法 / 任务`], [`已保研`, `本校智能科学与技术`]] },
  'competitions': { category: `科创竞赛`, index: `02`, role: `第一作者`, title: `科创竞赛`, result: `6 项国家级、省级竞赛奖项`, lead: `智能车、电子设计与交通预测：在硬件、算力和比赛指标的约束下完成系统交付。`, stats: [[`6`, `国家级、省级奖项`], [`2`, `国家级奖项`], [`第一作者`, `竞赛项目署名`]] },
  'paddle-internship': { category: `开源实习`, index: `03`, role: `持续6个月`, title: `百度飞桨 · 远程实习`, result: `100+ PR 合入主仓，10K+ 行代码贡献`, lead: `将 API 兼容需求整理为 5 个验证维度，让接口适配与质量检查成为可复用的流程。`, stats: [[`100+`, `合入主仓 PR`], [`10K+`, `代码贡献`], [`5`, `API 兼容维度`]] },
  'icma-papers': { category: `研究论文`, index: `04`, role: `第四作者`, title: `IEEE ICMA/Wiley JFR`, result: `参与发表三篇深度强化学习论文`, lead: `负责多智能体强化学习的实验设计、评测体系与仿真验证，相关实验支撑 2 篇 IEEE ICMA 论文录用。`, stats: [[`3`, `参与发表论文`], [`2`, `IEEE ICMA 录用`], [`第四作者`, `论文署名`]] }
};
function ArchiveParagraphs({ text }) {
  const chunks = [];
  let pending = ``;
  for (const part of text.split(/(?<=[。！？；，])/)) {
    if (pending && (pending + part).length > 58) { chunks.push(pending); pending = ``; }
    pending += part;
  }
  if (pending) chunks.push(pending);
  return chunks.map((chunk, index) => p.jsx(`p`, { children: chunk }, index));
}
function ArchiveTags({ tags }) {
  return p.jsx(`div`, { className: `archive-tags`, 'aria-label': `主题索引`, children: tags.map(tag => p.jsx(`span`, { children: tag }, tag)) });
}
function ArchiveSourceLinks({ links }) {
  return p.jsx(`div`, { className: `archive-source-links`, children: links.map(link => p.jsxs(`a`, { href: link.href, target: `_blank`, rel: `noreferrer`, onClick: event => event.stopPropagation(), children: [link.label, p.jsx(D, { size: 16, strokeWidth: 1.25, 'aria-hidden': true })] }, link.href)) });
}
function ce({ onOpenExperience }) {
  const root = d.useRef(null);
  const [highlight, setHighlight] = d.useState(null);
  const metricLinks = [`https://github.com/search?q=is%3Apr+is%3Amerged+author%3ALe-soleile&type=pullrequests`, `https://github.com/PaddlePaddle/community/issues/1201#:~:text=%E6%9D%A8%E6%99%93%E6%98%A5,Le%2Dsoleile`, `/certificates.html`];
  const metricSlugs = [`paddle-internship`, `paddle-internship`, `competitions`, `icma-papers`];
  d.useEffect(() => {
    const node = root.current;
    const preference = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const entries = [...node.querySelectorAll(`.experience-timeline__entry`)];
    const counters = [...node.querySelectorAll(`[data-count-target]`)];
    let frame, counted = false;
    const finalNumbers = () => counters.forEach(counter => { counter.textContent = counter.dataset.countTarget; });
    const revealAll = () => entries.forEach(entry => entry.classList.add(`is-revealed`));
    const reveal = new IntersectionObserver(events => events.forEach(event => {
      if (event.isIntersecting) { event.target.classList.add(`is-revealed`); reveal.unobserve(event.target); }
    }), { threshold: .06 });
    const count = new IntersectionObserver(events => {
      if (counted || !events.some(event => event.isIntersecting)) return;
      counted = true;
      count.disconnect();
      if (preference.matches) { finalNumbers(); return; }
      let start;
      const tick = now => {
        if (start === undefined) start = now;
        const progress = Math.min(1, Math.max(0, (now - start) / 1200));
        const eased = 1 - Math.pow(1 - progress, 3);
        counters.forEach(counter => {
          const [, digits, suffix] = counter.dataset.countTarget.match(/^(\d+)(.*)$/);
          const value = Math.round(Number(digits) * eased);
          counter.textContent = (digits.startsWith(`0`) ? String(value).padStart(digits.length, `0`) : String(value)) + suffix;
        });
        if (progress < 1) frame = requestAnimationFrame(tick);
        else finalNumbers();
      };
      counters.forEach(counter => { const suffix = counter.dataset.countTarget.replace(/^\d+/, ``); counter.textContent = `0${suffix}`; });
      frame = requestAnimationFrame(tick);
    }, { threshold: .3 });
    entries.forEach((entry, index) => { entry.style.setProperty(`--enter-delay`, `${index * 80}ms`); reveal.observe(entry); });
    const applyPreference = () => {
      node.classList.toggle(`editorial-motion-ready`, !preference.matches);
      if (preference.matches) { cancelAnimationFrame(frame); counted = true; finalNumbers(); revealAll(); }
    };
    applyPreference();
    count.observe(node.querySelector(`.metrics`));
    preference.addEventListener(`change`, applyPreference);
    return () => { cancelAnimationFrame(frame); reveal.disconnect(); count.disconnect(); preference.removeEventListener(`change`, applyPreference); node.classList.remove(`editorial-motion-ready`); finalNumbers(); };
  }, []);
  return p.jsx(`section`, {
    ref: root, className: `section about site-chapter editorial-about`, id: `about`, "aria-labelledby": `about-title`,
    children: p.jsxs(`div`, { className: `shell about-layout`, children: [
      p.jsxs(`header`, { className: `about-overview`, children: [
        p.jsxs(`div`, { className: `section-head`, children: [
          p.jsx(`h2`, { id: `about-title`, children: `个人简介` }),
          p.jsx(`p`, { className: `editorial-positioning`, children: [`电气自动化`, `开源贡献`, `远程实习`, `软硬件联调`, `AI`].map((label, index) => p.jsxs(`span`, { children: [p.jsx(`i`, { "aria-hidden": true, className: `position-dot position-dot--${index}` }), label] }, label)) })
        ] }),
        p.jsx(`div`, { className: `overview-orbit`, "aria-hidden": true, children: p.jsx(`span`, { className: `overview-orbit__core` }) })
      ] }),
      p.jsx(`ul`, { className: `metrics`, "aria-label": `关键数据`, children: ae.map((metric, index) => index === 0 ? { ...metric, label: `合入PR` } : index === 1 ? { value: `2025`, label: `获得2025开源之星`, unit: `OPEN SOURCE STAR`, star: true } : index === 2 ? { ...metric, value: `07` } : metric).map((metric, index) => p.jsx(`li`, {
        className: `metric`, "data-category": metricSlugs[index], children: p.jsxs(index < 3 ? `a` : `button`, {
          type: index < 3 ? undefined : `button`, href: metricLinks[index], target: index < 2 ? `_blank` : undefined, rel: index < 2 ? `noopener noreferrer` : undefined, className: `metric-control`, "aria-label": `${metric.star ? `` : metric.value + ` `}${metric.label}${index < 2 ? `，在新标签页打开` : index === 2 ? `，查看全部证书` : `，查看相关经历`}`, "aria-haspopup": index === 3 ? `dialog` : undefined,
          onPointerEnter: () => setHighlight(metricSlugs[index]), onPointerLeave: event => { if (!event.currentTarget.contains(document.activeElement)) setHighlight(null); },
          onFocus: () => setHighlight(metricSlugs[index]), onBlur: event => { if (!event.currentTarget.matches(`:hover`)) setHighlight(null); },
          onClick: event => { setHighlight(null); if (index === 3) onOpenExperience(metricSlugs[index], event.currentTarget); },
          children: [
            p.jsxs(`strong`, { children: metric.star ? [p.jsxs(`svg`, { className: `metric-star`, viewBox: `0 0 80 80`, fill: `none`, "aria-hidden": true, children: [
              p.jsx(`path`, { d: `m40 6 10.5 21.3L74 30.7 57 47.3 61 71 40 59.8 19 71l4-23.7L6 30.7l23.5-3.4Z`, fill: `#d4ad6320`, stroke: `currentColor`, strokeWidth: 1.8, strokeLinejoin: `round` }),
              p.jsx(`path`, { className: `metric-star-facets`, d: `M40 6v35L6 30.7M40 41 19 71m21-30 21 30M40 41l34-10.3`, stroke: `currentColor`, strokeWidth: .8, opacity: .45 }),
              p.jsx(`path`, { className: `metric-star-glint`, d: `M68 6v12M62 12h12`, stroke: `currentColor`, strokeWidth: 1.4, strokeLinecap: `round` })
            ] })] : [p.jsx(`span`, { "data-count-target": metric.value, "aria-hidden": true, children: metric.value }), p.jsx(`i`, { className: `metric-dot`, "aria-hidden": true })] }),
            p.jsx(`span`, { className: `metric__label`, children: metric.label }),
            p.jsx(`span`, { className: `metric__unit`, children: metric.unit })
          ]
        })
      }, metric.unit)) }),
      p.jsx(`ol`, { className: `experience-timeline${highlight ? ` has-highlight` : ``}`, "aria-label": `个人经历`, children: [...te].reverse().map((experience, index) => {
        const [title, qualifier] = se(experience.title);
        const links = re[experience.slug] ?? [];
        const name = experience.shortTitle.replace(/（均一作）|（四作）/g, ``).trim();
        const titleBadge = experience.slug === `competitions` ? `第一作者` : experience.slug === `icma-papers` ? `第四作者` : experience.slug === `paddle-internship` ? `持续6个月` : null;
        const symbols = [
          [`M3 9 12 4l9 5-9 5-9-5Z`, `M6 11v6c4 3 8 3 12 0v-6`, `M21 9v8`],
          [`M8 4h8v5a4 4 0 0 1-8 0V4Z`, `M8 6H4v2a4 4 0 0 0 4 4`, `M16 6h4v2a4 4 0 0 1-4 4`, `M12 13v7`, `M8 20h8`],
          [`M8 7 3 12l5 5`, `m16 7 5 5-5 5`, `m14 4-4 16`],
          [`M6 3h9l4 4v14H6V3Z`, `M14 3v5h5`, `M9 12h7`, `M9 16h5`]
        ];
        return p.jsx(`li`, {
          id: `exp-${experience.slug}`, className: `experience-timeline__entry`, "data-category": experience.slug,
          "data-active": highlight === experience.slug ? `true` : undefined,
          children: p.jsxs(`article`, { className: `experience-card`, "data-interactive-card": true, "aria-labelledby": `exp-heading-${experience.slug}`, children: [
            p.jsx(`button`, { type: `button`, className: `editorial-card-hit`, "aria-label": `查看${name}详情`, "aria-haspopup": `dialog`, onClick: event => onOpenExperience(experience.slug, event.currentTarget) }),
            p.jsxs(`header`, { className: `experience-timeline__heading`, children: [
              p.jsxs(`div`, { className: `experience-card__top`, "aria-hidden": true, children: [
                p.jsx(`span`, { className: `experience-card__symbol`, children: p.jsx(`svg`, { viewBox: `0 0 24 24`, fill: `none`, stroke: `currentColor`, strokeWidth: 1.3, strokeLinecap: `round`, strokeLinejoin: `round`, children: symbols[index].map((path, i) => p.jsx(`path`, { d: path }, i)) }) }),

              ] }),
              p.jsxs(`div`, { className: `editorial-card-title`, children: [p.jsx(`h3`, { className: `experience-timeline__label`, id: `exp-heading-${experience.slug}`, children: name }), titleBadge && p.jsx(`span`, { className: `editorial-badge`, children: titleBadge })] }),
              p.jsx(`time`, { children: experience.time })
            ] }),
            p.jsxs(`div`, { className: `exp-preview`, children: [
              p.jsxs(`h4`, { className: `editorial-core`, children: [title, qualifier && (experience.slug === `icma-papers` ? p.jsx(`span`, { className: `editorial-badge editorial-outcome`, children: qualifier.replace(/^[·—\s]+/, ``) }) : p.jsx(`span`, { className: `exp-preview__qualifier`, children: qualifier }))] }),
              p.jsx(`p`, { className: `editorial-summary`, children: experience.summary }),
              p.jsxs(`div`, { className: `exp-tags`, children: [
                ...experience.tags.slice(0, 5).map(tag => p.jsx(`span`, { children: tag }, tag)),
                experience.tags.length > 5 && p.jsx(`button`, { type: `button`, className: `editorial-more-tags`, "aria-label": `查看全部 ${experience.tags.length} 个标签`, "aria-haspopup": `dialog`, onClick: event => { event.stopPropagation(); onOpenExperience(experience.slug, event.currentTarget); }, children: `+${experience.tags.length - 5}` })
              ] })
            ] }),
            p.jsxs(`footer`, { className: `editorial-card-footer`, children: [
              p.jsx(`div`, { className: `exp-links`, children: links.map(link => p.jsxs(`a`, { href: link.href, target: `_blank`, rel: `noreferrer`, onClick: event => event.stopPropagation(), children: [link.label, p.jsx(D, { size: 12, "aria-hidden": true })] }, link.href)) }),
              p.jsxs(`button`, { type: `button`, className: `exp-open`, "aria-label": `查看${name}详情`, "aria-haspopup": `dialog`, onClick: event => { event.stopPropagation(); onOpenExperience(experience.slug, event.currentTarget); }, children: [p.jsx(`span`, { children: `查看详情` }), p.jsx(D, { "aria-hidden": true })] })
            ] })
          ] })
        }, experience.slug);
      }) })
    ] })
  });
}


function ArchiveArchitecture({ slug }) {
  const groups = slug === `paddle-internship` ? [[`开发者场景`, `API 兼容规范`, `双端行为验证`], [`参数与返回值`, `适配实现`, `差异报告`]] : slug === `icma-papers` ? [[`环境与种子`, `算法与策略`, `统一评测`], [`控制变量`, `奖励与行为日志`, `可复核证据`]] : slug === `heu-education` ? [[`硬件与传感器`, `系统与框架`, `算法与任务`], [`ROS2 / Linux`, `PyTorch / Paddle`, `机器人项目验证`]] : [[`传感器输入`, `感知与决策`, `跟随控制`], [`船舶与起始港口`, `嵌入与特征拼接`, `目的港预测`]];
  return p.jsxs(`figure`, { className: `archive-diagram`, children: [p.jsx(`svg`, { className: `archive-diagram-wide`, viewBox: `0 0 480 212`, role: `img`, 'aria-label': `项目系统链路：${groups.map(row => row.join(`、`)).join(`；`)}`, children: groups.flatMap((row, r) => row.flatMap((label, c) => [p.jsx(`rect`, { x: 4 + c * 164, y: 20 + r * 100, width: 144, height: 52 }, `rect${r}${c}`), p.jsx(`text`, { x: 76 + c * 164, y: 51 + r * 100, textAnchor: `middle`, children: label }, `text${r}${c}`), c < 2 && p.jsx(`path`, { className: r === 0 && c === 1 ? `archive-key-flow` : undefined, d: `M${148 + c * 164} ${46 + r * 100}h20m-4-4 4 4-4 4` }, `flow${r}${c}`)])) }), p.jsx(`svg`, { className: `archive-diagram-narrow`, viewBox: `0 0 320 310`, role: `img`, 'aria-label': `项目系统链路：${groups.map(row => row.join(`、`)).join(`；`)}`, children: groups.flatMap((row, r) => row.flatMap((label, c) => [p.jsx(`rect`, { x: 4 + r * 168, y: 12 + c * 100, width: 144, height: 52 }, `rect${r}${c}`), p.jsx(`text`, { x: 76 + r * 168, y: 43 + c * 100, textAnchor: `middle`, children: label }, `text${r}${c}`), c < 2 && p.jsx(`path`, { className: r === 0 && c === 1 ? `archive-key-flow` : undefined, d: `M${76+r*168} ${64+c*100}v48m-4-4 4 4 4-4` }, `flow${r}${c}`)])) }), p.jsx(`figcaption`, { children: slug === `competitions` ? `图 01 / 智能车控制链路与航运目的港预测链路。依据项目描述及公开源码整理。` : `图 01 / 依据项目经历整理的工作链路。` })] });
}
function ArchiveEvidence({ experience }) {
  const slug = experience.slug;
  if (slug === `competitions`) {
    const points = [[`05`,14],[`06`,428],[`07`,3487],[`08`,3121],[`09`,2875],[`10`,3318],[`11`,3058],[`12`,2890]];
    const line = points.map(([,value],i) => `${i ? `L` : `M`}${40 + i * 56},${190 - value / 3500 * 146}`).join(` `);
    return p.jsxs(`section`, { className: `archive-evidence`, 'aria-label': `项目证据`, children: [p.jsx(`h2`, { children: `项目证据` }), p.jsx(ArchiveArchitecture, { slug }), p.jsxs(`figure`, { className: `archive-chart`, children: [p.jsx(`h3`, { children: `19,191 条公开航次记录` }), p.jsx(`p`, { children: `原始数据中，2022 年 5—12 月的航次出发月份分布。` }), p.jsxs(`svg`, { viewBox: `-16 0 496 242`, role: `img`, 'aria-label': `航次样本月度分布。${points.map(([month,n]) => `${month}月 ${n}条`).join(`；`)}`, children: [0,1000,2000,3000].flatMap(n => [p.jsx(`path`, { className: `chart-grid`, d: `M40 ${190-n/3500*146}H450` }, `grid${n}`), p.jsx(`text`, { x: 32, y: 194-n/3500*146, textAnchor: `end`, children: n }, `label${n}`)]).concat([p.jsx(`path`, { className: `chart-observed`, d: line }, `curve`), ...points.flatMap(([month,n],i) => [p.jsx(`text`, { x: 40+i*56, y: 218, textAnchor: `middle`, children: month }, month)]), p.jsx(`circle`, { cx: 432, cy: 190-2890/3500*146, r: 3 }, `point`), p.jsx(`text`, { x: 432, y: 190-2890/3500*146-12, textAnchor: `middle`, children: `2,890` }, `value`)]) }), p.jsxs(`figcaption`, { children: [`图 02 / 公开数据样本分布，按出发时间月份计数。`, p.jsx(`a`, { href: `https://github.com/Le-soleile/Forecasting-Model/blob/045af5ab56458485943b8ef165598661dd4120e7/data/raw/ship_dynamic_info_test.csv`, target: `_blank`, rel: `noreferrer`, children: `查看原始 CSV ↗` })] })] }), p.jsx(ArchiveAwards, {})] });
  }
  return p.jsxs(`section`, { className: `archive-evidence`, 'aria-label': `项目证据`, children: [p.jsx(`h2`, { children: slug === `heu-education` ? `学习路径` : `项目链路` }), p.jsx(ArchiveArchitecture, { slug }), slug === `heu-education` && p.jsxs(`figure`, { className: `archive-document-image`, children: [p.jsx(`a`, { href: `/project-cleaning.png`, target: `_blank`, rel: `noreferrer`, children: p.jsx(`img`, { src: `/project-cleaning.png`, alt: `原网站机器人清洁项目的仿真环境截图`, loading: `lazy` }) }), p.jsx(`figcaption`, { children: `图 02 / 机器人清洁项目仿真环境，来自原站项目资料。` })] })] });
}
function ArchiveOriginalPaddle({ experience, onClose }) {
  const reflow = node => {
    if (!node || typeof node !== `object` || !node.props) return node;
    if (node.type === `p` && typeof node.props.children === `string`) return p.jsx(ArchiveParagraphs, { text: node.props.children }, node.key);
    const children = node.props.children;
    return p.jsx(node.type, { ...node.props, children: Array.isArray(children) ? children.map(reflow) : reflow(children) }, node.key);
  };
  return reflow(Sa({ experience, onBack: onClose }));
}
function ArchiveAwards() {
  return p.jsxs(`div`, { className: `archive-awards`, children: [p.jsx(`h3`, { children: `获奖记录与证书` }), p.jsxs(`table`, { children: [p.jsx(`caption`, { className: `archive-sr-only`, children: `七份原始获奖记录，可点击奖项名查看证书原件` }), p.jsx(`thead`, { children: p.jsxs(`tr`, { children: [p.jsx(`th`, { scope: `col`, children: `年份` }), p.jsx(`th`, { scope: `col`, children: `级别` }), p.jsx(`th`, { scope: `col`, children: `奖项 / 角色` })] }) }), p.jsx(`tbody`, { children: va.map((award,index) => {
    const national = /全国/.test(award.award);
    const level = national ? `国家级` : /赛区/.test(award.award) ? `赛区` : `省级`;
    return p.jsxs(`tr`, { 'data-national': national ? `true` : undefined, children: [p.jsx(`td`, { children: award.year }), p.jsx(`td`, { children: level }), p.jsxs(`td`, { children: [p.jsx(`a`, { href: award.original, target: `_blank`, rel: `noreferrer`, children: `${award.title} · ${award.award}` }), p.jsx(`span`, { children: `第一作者 / 查看原件 ↗` })] })] }, index);
  }) })] })] });
}
function ExperienceContactDialog({ dialogRef, category, onClose }) {
  const contact = EXPERIENCE_CONTACT;
  const [message, setMessage] = d.useState(``);
  d.useEffect(() => {
    const dialog = dialogRef.current;
    const previous = document.activeElement;
    dialog.showModal();
    return () => {
      dialog.close();
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  const copy = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      setMessage(`${label}已复制`);
    } catch {
      setMessage(`复制未成功，可选中或长按${label}复制。`);
    }
  };
  return p.jsxs(`dialog`, {
    ref: dialogRef, className: `experience-contact-dialog`, 'aria-labelledby': `experience-contact-title`, 'aria-describedby': `experience-contact-context`,
    onCancel: event => { event.preventDefault(); onClose(); },
    onKeyDown: event => {
      if (event.key !== `Tab`) return;
      const buttons = [...event.currentTarget.querySelectorAll(`button:not([disabled])`)];
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    },
    onPointerDown: event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    },
    children: [
      p.jsxs(`div`, { className: `experience-contact-heading`, children: [
        p.jsx(`h2`, { id: `experience-contact-title`, children: `聊聊这段经历` }),
        p.jsx(`button`, { type: `button`, className: `experience-contact-close`, 'aria-label': `关闭联系方式`, onClick: onClose, children: p.jsx(P, { size: 18, strokeWidth: 1.5, 'aria-hidden': true }) })
      ] }),
      p.jsx(`p`, { id: `experience-contact-context`, className: `experience-contact-context`, children: category }),
      p.jsx(`dl`, { className: `experience-contact-list`, children: [[`手机号`, contact.phone], [`邮箱`, contact.email]].map(([label, value]) =>
        p.jsxs(`div`, { className: `experience-contact-row`, children: [
          p.jsx(`dt`, { children: label }),
          p.jsxs(`dd`, { children: [
            p.jsx(`span`, { className: `experience-contact-value`, children: value }),
            p.jsx(`button`, { type: `button`, 'aria-label': `复制${label}`, onClick: () => copy(value, label), children: `复制` })
          ] })
        ] }, label)
      ) }),
      p.jsx(`p`, { className: `experience-contact-status`, role: `status`, 'aria-live': `polite`, 'aria-atomic': true, children: message || `选择一种方便的方式联系我。` })
    ]
  });
}

function EditorialExperienceDrawer({ experience, onClose, returnFocus }) {
  const panel = d.useRef(null), scroll = d.useRef(null), closeButton = d.useRef(null), progress = d.useRef(null);
  const closing = d.useRef(false), contactDialog = d.useRef(null);
  const [contactOpen, setContactOpen] = d.useState(false);
  const [exiting, setExiting] = d.useState(false), [chapter, setChapter] = d.useState(`origin`);
  const item = ArchiveRecords[experience.slug];
  const close = () => { if (!closing.current) { closing.current = true; setExiting(true); } };
  d.useEffect(() => {
    if (!exiting) return;
    const timer = window.setTimeout(onClose, window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ? 120 : 420);
    return () => window.clearTimeout(timer);
  }, [exiting, onClose]);
  d.useEffect(() => {
    const previous = returnFocus || document.activeElement;
    const overflow = document.body.style.overflow;
    const surface = document.querySelector(`.portfolio-surface`);
    surface?.style.setProperty(`--reading-origin-y`, `${window.scrollY + window.innerHeight / 2}px`);
    document.body.style.overflow = `hidden`;
    closeButton.current?.focus({ preventScroll: true });
    const keydown = event => {
      if (contactDialog.current?.open) return;
      if (event.key === `Escape`) { event.preventDefault(); close(); }
      if (event.key === `Tab`) {
        const nodes = [...panel.current.querySelectorAll(`a[href], button:not([disabled]), video[controls], [tabindex="0"]`)].filter(node => node.getClientRects().length);
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (event.shiftKey && (document.activeElement === first || !panel.current.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || !panel.current.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener(`keydown`, keydown);
    const scroller = scroll.current;
    // Keep the drawer responsive: media is attached only as it approaches the viewport.
    const mediaObserver = `IntersectionObserver` in window ? new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      if (node.dataset.src) { node.src = node.dataset.src; node.removeAttribute(`data-src`); }
      if (node.dataset.poster) { node.poster = node.dataset.poster; node.removeAttribute(`data-poster`); }
      mediaObserver.unobserve(node);
    }), { root: scroller, rootMargin: `420px 0px` }) : null;
    panel.current.querySelectorAll(`img[data-src], video[data-poster]`).forEach(node => mediaObserver?.observe(node));
    let disposed = false;
    const update = () => {
      if (disposed || !progress.current) return;
      const node = scroller;
      const available = node.scrollHeight - node.clientHeight;
      progress.current.style.transform = `scaleX(${available > 0 ? node.scrollTop / available : 1})`;
      const sections = [...node.querySelectorAll(`[data-reading-chapter]`)];
      let active = `origin`;
      for (const section of sections) if (section.getBoundingClientRect().top <= node.getBoundingClientRect().top + 150) active = section.dataset.readingChapter;
      setChapter(active);
    };
    scroller.addEventListener(`scroll`, update, { passive: true });
    update();
    const observer = new ResizeObserver(update); observer.observe(scroller.firstElementChild);
    return () => { disposed = true; observer.disconnect(); mediaObserver?.disconnect(); scroller.removeEventListener(`scroll`, update); document.body.style.overflow = overflow; window.removeEventListener(`keydown`, keydown); requestAnimationFrame(() => { if (previous?.isConnected) previous.focus({ preventScroll: true }); }); };
  }, []);
  const links = re[experience.slug] ?? [];
  const chapters = [{id:`origin`,title:`起点`,keys:[`起点`]}, {id:`constraints`,title:`约束`,keys:[`挑战`]}, {id:`iterations`,title:`迭代`,keys:[`行动`,`产品方法`,`结果`,`产品思考`]}];
  const extraTags = experience.tags.filter(tag => /项.*奖|国家级/.test(tag));
  return p.jsx(`div`, { className: `editorial-drawer-backdrop archive-backdrop${exiting ? ` is-exiting` : ``}`, onPointerDown: event => { if (event.target === event.currentTarget) close(); }, children: p.jsxs(`aside`, { ref: panel, tabIndex: -1, className: `editorial-drawer archive-reader`, role: `dialog`, 'aria-modal': true, 'aria-labelledby': `editorial-drawer-title`, 'data-category': experience.slug, children: [
    p.jsxs(`header`, { className: `editorial-drawer-header`, children: [p.jsx(`span`, { className: `archive-case-label`, children: `CASE ${item.index} / ${item.category}` }), p.jsxs(`button`, { ref: closeButton, type: `button`, className: `editorial-drawer-close`, 'aria-label': `关闭经历详情`, onClick: close, children: [p.jsx(P, { className: `archive-close-icon`, size: 16, strokeWidth: 1.25, 'aria-hidden': true }), p.jsx(E, { className: `archive-back-icon`, size: 16, strokeWidth: 1.25, 'aria-hidden': true })] }), p.jsx(`div`, { className: `archive-reading-progress`, 'aria-hidden': true, children: p.jsx(`span`, { ref: progress }) })] }),
    p.jsx(`div`, { ref: scroll, className: `editorial-drawer-scroll`, children: p.jsxs(`div`, { className: `archive-reading-grid`, children: [
      p.jsxs(`aside`, { className: `archive-reading-meta`, 'aria-label': `档案元信息`, children: [
        p.jsx(`nav`, { className: `archive-chapter-nav`, 'aria-label': `阅读章节`, children: chapters.map((entry,index) => p.jsxs(`a`, { href: `#reading-${entry.id}`, 'aria-current': chapter === entry.id ? `location` : undefined, onClick: event => { event.preventDefault(); const target = panel.current.querySelector(`#reading-${entry.id}`); scroll.current.scrollTo({ top: scroll.current.scrollTop + target.getBoundingClientRect().top - scroll.current.getBoundingClientRect().top - 72, behavior: window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ? `instant` : `smooth` }); setChapter(entry.id); }, children: [p.jsx(`span`, { children: String(index+1).padStart(2,`0`) }), entry.title] }, entry.id)) }),
        p.jsxs(`div`, { className: `archive-metadata`, children: [p.jsxs(`dl`, { children: [p.jsx(`dt`, { children: `时间` }), p.jsx(`dd`, { children: experience.time }), p.jsx(`dt`, { children: `角色 / 阶段` }), p.jsx(`dd`, { children: item.role }), p.jsx(`dt`, { children: `档案要点` }), p.jsx(`dd`, { children: p.jsx(`ul`, { children: [...experience.facts,...extraTags].map(fact => p.jsx(`li`, { children: fact }, fact)) }) })] }), p.jsx(ArchiveSourceLinks, { links })] })
      ] }),
      p.jsxs(`article`, { className: `archive-reading-body`, children: [
        p.jsxs(`header`, { className: `archive-case-intro`, children: [p.jsx(`span`, { className: `archive-eyebrow`, children: `${experience.time} / ${item.category}` }), p.jsx(`h1`, { id: `editorial-drawer-title`, children: item.title }), p.jsx(`p`, { className: `archive-case-lead`, children: item.lead }), p.jsx(`p`, { className: `archive-original-title`, children: experience.title }), p.jsx(ArchiveTags, { tags: experience.tags.filter(tag => !extraTags.includes(tag)) })] }),
        p.jsx(`ul`, { className: `archive-result-strip`, 'aria-label': `结果摘要`, children: item.stats.map(([value,label]) => p.jsxs(`li`, { children: [p.jsx(`strong`, { children: value }), p.jsx(`span`, { children: label })] }, label)) }),
        p.jsxs(`section`, { className: `archive-reading-section`, id: `reading-origin`, 'data-reading-chapter': `origin`, children: [p.jsxs(`h2`, { children: [p.jsx(`span`, { children: `01` }), `起点`] }), p.jsx(`h3`, { children: `经历概述` }), p.jsx(ArchiveParagraphs, { text: experience.summary }), p.jsx(ArchiveParagraphs, { text: experience.story[`起点`] }), p.jsx(ArchiveEvidence, { experience }), p.jsx(ArchiveMediaStories, { slug: experience.slug, chapter: `origin` })] }),
        ...chapters.slice(1).map((entry,index) => p.jsxs(`section`, { className: `archive-reading-section`, id: `reading-${entry.id}`, 'data-reading-chapter': entry.id, children: [p.jsxs(`h2`, { children: [p.jsx(`span`, { children: String(index+2).padStart(2,`0`) }), entry.title] }), ...entry.keys.filter(key => experience.story[key]).map(key => p.jsxs(`section`, { className: `archive-story-block`, children: [p.jsx(`h3`, { children: key }), p.jsx(ArchiveParagraphs, { text: experience.story[key] })] }, key)), p.jsx(ArchiveMediaStories, { slug: experience.slug, chapter: entry.id })] }, entry.id)),
        experience.slug === `paddle-internship` && p.jsxs(`section`, { className: `archive-original-article`, children: [p.jsx(`h2`, { children: `原始项目资料` }), p.jsx(ArchiveOriginalPaddle, { experience, onClose: close })] }),
        p.jsxs(`footer`, { className: `archive-case-end`, children: [p.jsx(`span`, { className: `archive-eyebrow`, children: `END OF CASE / ${item.index}` }), p.jsx(`button`, { type: `button`, className: `editorial-drawer-contact`, 'aria-haspopup': `dialog`, onClick: () => setContactOpen(true), children: `就这段经历交流 ↗` })] })
      ] })
    ] }) }),
    contactOpen && p.jsx(ExperienceContactDialog, { dialogRef: contactDialog, category: item.category, onClose: () => setContactOpen(false) })
  ] }) });
}
