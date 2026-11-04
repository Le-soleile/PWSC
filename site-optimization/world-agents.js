function WorldAgentsArena({ active = 0 }) {
  const agents = [[94,104],[150,138],[222,86],[289,166],[352,114],[420,208],[124,267],[210,224],[300,290],[378,320],[448,112],[225,342]];
  return p.jsxs(`svg`, { className: `woa-arena`, viewBox: `0 0 540 430`, role: `img`, 'aria-label': `多智能体仿真空间示意，包含智能体、障碍与交互路径，不代表实际运行结果`, children: [
    p.jsx(`defs`, { children: p.jsxs(`pattern`, { id: `woa-grid`, width: 32, height: 32, patternUnits: `userSpaceOnUse`, children: [p.jsx(`path`, { d: `M32 0H0V32`, fill: `none`, stroke: `currentColor`, strokeWidth: .6 })] }) }),
    p.jsx(`rect`, { x: 24, y: 24, width: 492, height: 376, rx: 4, fill: `url(#woa-grid)`, className: `woa-arena-grid` }),
    p.jsx(`path`, { className: `woa-arena-boundary`, d: `M72 62H468V360H72ZM72 188H180V62M332 360V248H468` }),
    p.jsx(`path`, { className: `woa-arena-route`, d: `M94 104 150 138 222 86 289 166 352 114 448 112M124 267 210 224 289 166 420 208M210 224 300 290 378 320 225 342` }),
    ...[[184,158,48,38],[330,192,52,38],[137,307,38,30]].map(([x,y,width,height],i) => p.jsx(`rect`, { x,y,width,height, className: `woa-arena-obstacle` }, `obstacle-${i}`)),
    ...agents.map(([cx,cy],i) => p.jsxs(`g`, { className: `woa-arena-agent${i % 4 === active ? ` is-highlighted` : ``}`, children: [p.jsx(`circle`, { cx,cy,r: 11 }), p.jsx(`circle`, { cx,cy,r: 3, className: `woa-arena-agent-center` })] }, i)),
    p.jsx(`text`, { x: 28, y: 422, children: `SCENE / AGENTS / INTERACTIONS` })
  ] });
}
function WorldAgentsPage({ onBack }) {
  const content = WORLD_AGENTS_CONTENT;
  const [activeSection, setActiveSection] = d.useState(``), [feature, setFeature] = d.useState(0), [openFaqs, setOpenFaqs] = d.useState([0]);
  const tabs = d.useRef([]);
  d.useEffect(() => {
    const previous = document.title;
    document.title = `World of Agents · 多智能体仿真训练平台`;
    document.documentElement.classList.add(`world-agents-document`);
    const canonicalRoute = () => { if (location.hash === `#product/embodied-dataops`) history.replaceState(null, ``, `#product/world-of-agents`); };
    canonicalRoute();
    window.addEventListener(`hashchange`, canonicalRoute);
    window.scrollTo({ top:0, behavior:`instant` });
    let frame = 0;
    const update = () => {
      frame = 0;
      let active = ``;
      for (const [,id] of content.nav) if (document.getElementById(id)?.getBoundingClientRect().top <= innerHeight * .38) active = id;
      setActiveSection(active);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener(`scroll`, schedule, { passive:true });
    return () => { document.title = previous; document.documentElement.classList.remove(`world-agents-document`); window.removeEventListener(`scroll`, schedule); window.removeEventListener(`hashchange`, canonicalRoute); cancelAnimationFrame(frame); };
  }, []);
  const returnToPortfolio = () => {
    onBack();
    requestAnimationFrame(() => {
      document.getElementById(`products`)?.scrollIntoView({ block:`start`, behavior:`instant` });
      document.querySelector(`.project-card[data-product="world-of-agents"]`)?.focus({ preventScroll:true });
    });
  };
  const jump = id => document.getElementById(id)?.scrollIntoView({ block:`start`, behavior:matchMedia(`(prefers-reduced-motion: reduce)`).matches ? `instant` : `smooth` });
  const tabKey = (event,index) => {
    let next = index;
    if (event.key === `ArrowRight`) next = (index + 1) % content.features.length;
    else if (event.key === `ArrowLeft`) next = (index + content.features.length - 1) % content.features.length;
    else if (event.key === `Home`) next = 0;
    else if (event.key === `End`) next = content.features.length - 1;
    else return;
    event.preventDefault(); setFeature(next); tabs.current[next]?.focus();
  };
  const heading = (label,title,description) => p.jsxs(`div`, { className:`woa-section-heading`, children:[p.jsx(`p`, { className:`woa-eyebrow`, children:label }),p.jsx(`h2`, { children:title }),description && p.jsx(`p`, { className:`woa-description`, children:description })] });
  return p.jsxs(`div`, { className:`world-agents-page`, children:[
    p.jsx(`a`, { className:`woa-skip`, href:`#woa-main`, onClick:event => { event.preventDefault(); document.getElementById(`woa-main`).focus(); }, children:`跳至产品介绍` }),
    p.jsx(`header`, { className:`woa-header`, children:p.jsxs(`div`, { className:`woa-shell woa-topbar`, children:[
      p.jsx(`button`, { className:`woa-wordmark`, onClick:() => jump(`woa-main`), children:`World of Agents` }),
      p.jsx(`nav`, { 'aria-label':`World of Agents 产品导航`, children:content.nav.map(([label,id]) => p.jsx(`button`, { onClick:() => jump(id), 'aria-current':activeSection === id ? `location` : undefined, children:label },id)) }),
      p.jsxs(`button`, { className:`woa-back`, onClick:returnToPortfolio, children:[p.jsx(E, { size:16, 'aria-hidden':true }),`返回作品集`] })
    ] }) }),
    p.jsxs(`main`, { id:`woa-main`, tabIndex:-1, children:[
      p.jsxs(`section`, { className:`woa-hero woa-shell`, 'aria-labelledby':`woa-title`, children:[
        p.jsxs(`div`, { className:`woa-hero-copy`, children:[
          p.jsx(`p`, { className:`woa-eyebrow`, children:`MULTI-AGENT SIMULATION / 产品方案草稿` }),
          p.jsxs(`h1`, { id:`woa-title`, 'aria-label':content.title, children:[`World of`,p.jsx(`br`,{}),p.jsx(`span`, { children:`Agents` })] }),
          p.jsx(`p`, { className:`woa-subtitle`, children:content.subtitle }),
          p.jsx(`p`, { className:`woa-description`, children:content.intro }),
          p.jsxs(`button`, { className:`woa-explore`, onClick:() => jump(`woa-features`), children:[`了解平台构想`,p.jsx(T, { size:16, 'aria-hidden':true })] })
        ] }),
        p.jsxs(`figure`, { className:`woa-hero-visual`, children:[p.jsxs(`div`, { className:`woa-visual-toolbar`, children:[p.jsx(`span`, { children:`WORLD / 01` }),p.jsx(`span`, { children:`SIMULATION STUDY` })] }),p.jsx(WorldAgentsArena,{}),p.jsx(`figcaption`, { children:`多智能体空间示意 · 非实际运行画面` })] })
      ] }),
      p.jsx(`div`, { className:`woa-shell woa-capabilities`, 'aria-label':`平台工作流`, children:content.features.map((item,i) => p.jsxs(`div`, { children:[p.jsx(`span`, { children:`0${i+1}` }),p.jsx(`p`, { children:item.title }),p.jsx(`small`, { children:item.label })] },item.title)) }),
      p.jsxs(`section`, { id:`woa-needs`, className:`woa-section woa-shell woa-needs`, children:[
        heading(`THE NEED / 训练需求`,`为什么需要一个专门的训练平台？`,`多智能体训练不仅要让环境跑起来，还要让交互规则清楚、采样可扩展、实验可比较。`),
        p.jsx(`ol`, { className:`woa-need-list`, children:content.needs.map(([title,text],i) => p.jsxs(`li`, { children:[p.jsx(`span`, { children:`0${i+1}` }),p.jsxs(`div`, { children:[p.jsx(`h3`, { children:title }),p.jsx(`p`, { children:text })] })] },title)) })
      ] }),
      p.jsx(`section`, { id:`woa-advantages`, className:`woa-advantage-section`, children:p.jsxs(`div`, { className:`woa-shell`, children:[
        heading(`THE APPROACH / 平台优势`,`把注意力，留给策略。`,`以下是平台的设计方向，具体能力需要通过任务与性能测试验证。`),
        p.jsx(`div`, { className:`woa-advantage-grid`, children:content.advantages.map(([label,title,text]) => p.jsxs(`article`, { children:[p.jsx(`p`, { className:`woa-eyebrow`, children:label }),p.jsx(`h3`, { children:title }),p.jsx(`p`, { children:text })] },label)) })
      ] }) }),
      p.jsxs(`section`, { id:`woa-features`, className:`woa-section woa-shell`, children:[
        heading(`THE WORKFLOW / 核心能力`,`从场景，到策略。`,`用一条清楚的工作流，组织仿真训练中的四件事。以下为计划中的功能范围。`),
        p.jsxs(`div`, { className:`woa-workspace`, children:[
          p.jsx(`div`, { className:`woa-tabs`, role:`tablist`, 'aria-label':`平台功能`, children:content.features.map((item,i) => p.jsxs(`button`, { ref:node => { tabs.current[i] = node; }, role:`tab`, id:`woa-tab-${i}`, 'aria-selected':feature === i, 'aria-controls':`woa-panel-${i}`, tabIndex:feature === i ? 0 : -1, onClick:() => setFeature(i), onKeyDown:event => tabKey(event,i), children:[p.jsx(`span`, { children:`0${i+1}` }),item.title] },item.title)) }),
          ...content.features.map((item,i) => p.jsxs(`div`, { className:`woa-feature-panel`, role:`tabpanel`, id:`woa-panel-${i}`, 'aria-labelledby':`woa-tab-${i}`, tabIndex:0, hidden:feature !== i, children:[
            p.jsxs(`div`, { children:[p.jsx(`p`, { className:`woa-eyebrow`, children:item.label }),p.jsx(`h3`, { children:item.heading }),p.jsx(`p`, { children:item.text }),p.jsx(`ul`, { children:item.points.map(point => p.jsx(`li`, { children:point },point)) })] }),
            p.jsxs(`div`, { className:`woa-workflow-visual`, 'aria-label':`方案流程示意`, children:[...content.features.map((node,j) => p.jsxs(`div`, { className:`woa-workflow-node${i === j ? ` is-current` : ``}`, children:[p.jsx(`span`, { children:`0${j+1}` }),p.jsx(`span`, { children:node.title })] },node.title)),p.jsx(`p`, { children:`方案示意 · 待实现验证` })] })
          ] },item.title))
        ] })
      ] }),
      p.jsxs(`section`, { id:`woa-technology`, className:`woa-section woa-shell woa-tech`, children:[
        heading(`THE FOUNDATION / 技术与运行环境`,`先理清职责，再确定技术。`,`仿真引擎、训练框架、硬件配置与接口规格尚未冻结，先说明每层需要解决什么问题。`),
        p.jsx(`dl`, { className:`woa-specs`, children:content.technology.map(([title,text]) => p.jsxs(`div`, { children:[p.jsx(`dt`, { children:title }),p.jsx(`dd`, { children:text })] },title)) })
      ] }),
      p.jsxs(`section`, { id:`woa-faq`, className:`woa-section woa-shell woa-faq`, children:[
        heading(`QUESTIONS / 常见问题`,`关于这个平台。`,`先回答范围与验证方式，具体图片、实现进度和细节后续补充。`),
        p.jsx(`div`, { className:`woa-faq-list`, children:content.faqs.map(([question,answer],i) => { const open = openFaqs.includes(i);return p.jsxs(`article`, { children:[
          p.jsx(`h3`, { children:p.jsxs(`button`, { id:`woa-question-${i}`, 'aria-expanded':open, 'aria-controls':`woa-answer-${i}`, onClick:() => setOpenFaqs(items => items.includes(i) ? items.filter(item => item !== i) : [...items,i]), children:[question,p.jsx(`span`, { 'aria-hidden':true, children:open ? `−` : `+` })] }) }),
          p.jsx(`div`, { id:`woa-answer-${i}`, role:`region`, 'aria-labelledby':`woa-question-${i}`, hidden:!open, children:p.jsx(`p`, { children:answer }) })
        ] },question); }) })
      ] }),
      p.jsx(`section`, { className:`woa-closing`, children:p.jsxs(`div`, { className:`woa-shell`, children:[p.jsx(`p`, { className:`woa-eyebrow`, children:`WORLD OF AGENTS` }),p.jsx(`h2`, { children:`为智能体，构建可探索的世界。` }),p.jsx(`p`, { children:`从明确任务开始，逐步验证仿真、训练与评估的连接。` }),p.jsxs(`button`, { className:`woa-explore`, onClick:returnToPortfolio, children:[`返回产品练习`,p.jsx(E, { size:16, 'aria-hidden':true })] })] }) })
    ] }),
    p.jsxs(`footer`, { className:`woa-footer woa-shell`, children:[p.jsx(`span`, { children:`World of Agents` }),p.jsx(`span`, { children:`Le-soleile · 个人产品探索` })] })
  ] });
}
