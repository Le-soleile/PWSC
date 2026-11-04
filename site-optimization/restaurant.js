function Oa({ onBack }) {
  const media = CLEANBOT_MEDIA;
  const { navItems, capabilities, needs, advantages, functions, hardware, technology, faqs } = CLEANBOT_CONTENT;
  const root = d.useRef(null);
  const [activeSection, setActiveSection] = d.useState(``);
  const [activeStep, setActiveStep] = d.useState(0);
  const [openFaqs, setOpenFaqs] = d.useState([0]);
  const prd = `/docs/cleanbot-prd.html`;
  const source = `https://github.com/Le-soleile/HumanoidLab`;
  const video = `https://www.bilibili.com/video/BV1C7Ey65E6E/`;
  const story = [
    { key: `发现`, label: `01 / DETECT`, title: `先找到，真正需要清洁的桌。`, text: `顶部摄像头覆盖编号餐桌，分别观察人员、物品和污渍。确认离席、没有占座物品且需要清洁，才自动建立任务；画面不确定时等待复核。`, result: `桌号连接摄像头区域与机器人地图位置。`, image: `closeup`, caption: `感知端构想 · 顶部发现，近端复核` },
    { key: `调度`, label: `02 / DISPATCH`, title: `把一张脏桌，变成明确的任务。`, text: `系统为任务记录目标桌号与到期时间，安排机器人沿可通行路线到桌。同桌任务去重；排队期间重新有人占用，就撤回旧任务。`, result: `识别、排队与行走，全部计入恢复用时。`, image: `hero`, caption: `整机能力构想 · 按桌号到位` },
    { key: `确认`, label: `03 / CONFIRM`, title: `如果您回来了，先问一句。`, text: `到桌后再次核对桌号和占用情况。若有人在场，机器人先停在作业区外，再通过触屏询问。选择清洁且作业区安全后执行；选择离开或无人回应，则不启动清洁。`, result: `清洁验收通过，才将餐桌恢复为可用。`, image: `hardware`, caption: `模块协同构想 · 清洁与现场交互` }
  ];
  const alts = { hero: `智能清洁机器人产品构想：移动底盘搭载机械臂，在桌面上执行擦拭`, hardware: `一体化清洁机器人结构展开构想，展示机械臂、设备模块、移动底盘和清洁刷`, closeup: `清洁端概念特写，摄像头与擦拭工具集成在机械臂末端` };
  d.useEffect(() => {
    const previousTitle = document.title;
    document.documentElement.classList.add(`cleanbot-document`);
    document.title = `CleanBot · 多模态智能清洁机器人`;
    const canonicalRoute = () => { if (window.location.hash === `#product/g1-cleaning`) window.history.replaceState(null, ``, `#product/cleanbot`); };
    canonicalRoute();
    window.addEventListener(`hashchange`, canonicalRoute);
    window.scrollTo({ top: 0, behavior: `instant` });
    return () => { document.documentElement.classList.remove(`cleanbot-document`); document.title = previousTitle; window.removeEventListener(`hashchange`, canonicalRoute); };
  }, []);
  d.useEffect(() => {
    const el = root.current;
    const header = el.querySelector(`.cleanbot-header`);
    const sections = [...el.querySelectorAll(`[data-cb-section]`)];
    const steps = [...el.querySelectorAll(`[data-story-step]`)];
    const reduced = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const fine = window.matchMedia(`(hover: hover) and (pointer: fine)`);
    let frame = 0, pointerFrame = 0, currentSection = ``, currentStep = 0, observer;
    const update = () => {
      frame = 0;
      header.classList.toggle(`is-scrolled`, window.scrollY > 24);
      let next = ``;
      sections.forEach(section => { if (section.getBoundingClientRect().top <= innerHeight * .48) next = section.id; });
      if (next !== currentSection) { currentSection = next; setActiveSection(next); }
      const featureRect = el.querySelector(`#cleanbot-features`).getBoundingClientRect();
      if (window.innerWidth >= 768 && featureRect.top < innerHeight && featureRect.bottom > 0) {
        let nearest = 0, distance = Infinity;
        steps.forEach((step, index) => {
          const rect = step.getBoundingClientRect();
          const delta = Math.abs(rect.top + rect.height / 2 - innerHeight * .52);
          if (delta < distance) { distance = delta; nearest = index; }
        });
        if (nearest !== currentStep) { currentStep = nearest; setActiveStep(nearest); }
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const setupReveal = () => {
      observer?.disconnect();
      if (reduced.matches || !(`IntersectionObserver` in window)) { el.classList.remove(`cb-motion-ready`); return; }
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.setAttribute(`data-revealed`, ``); observer.unobserve(entry.target); }
      }), { threshold: .06, rootMargin: `0px 0px -24px` });
      el.querySelectorAll(`[data-cb-reveal]:not([data-revealed])`).forEach(node => observer.observe(node));
      el.classList.add(`cb-motion-ready`);
    };
    const pointer = event => {
      if (reduced.matches || !fine.matches || pointerFrame) return;
      const card = event.target.closest(`[data-cb-glow]`);
      if (!card || !el.contains(card)) return;
      const { clientX, clientY } = event;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        const rect = card.getBoundingClientRect();
        card.style.setProperty(`--cb-mx`, `${clientX - rect.left}px`);
        card.style.setProperty(`--cb-my`, `${clientY - rect.top}px`);
      });
    };
    setupReveal(); update();
    window.addEventListener(`scroll`, schedule, { passive: true });
    window.addEventListener(`resize`, schedule, { passive: true });
    el.addEventListener(`pointermove`, pointer, { passive: true });
    reduced.addEventListener(`change`, setupReveal);
    return () => {
      observer?.disconnect(); cancelAnimationFrame(frame); cancelAnimationFrame(pointerFrame);
      window.removeEventListener(`scroll`, schedule); window.removeEventListener(`resize`, schedule);
      el.removeEventListener(`pointermove`, pointer); reduced.removeEventListener(`change`, setupReveal);
    };
  }, []);
  const returnToPortfolio = () => {
    if (window.__restorePortfolioStyles) window.__restorePortfolioStyles().then(onBack);
    else onBack();
  };
  const jump = id => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ? `instant` : `smooth`, block: `start` });
  const reveal = (index = 0) => ({ 'data-cb-reveal': ``, style: { '--cb-delay': `${Math.min(index, 3) * 70}ms` } });
  const arrow = () => p.jsx(D, { size: 16, strokeWidth: 1.5, className: `cleanbot-external`, 'aria-hidden': true });
  const icon = (kind, size = 24) => {
    const paths = {
      table: [`M3 9h18M5 9v11M19 9v11M4 4h16v5H4z`],
      floor: [`M4 17h16M6 21h12M6 13l2-8h8l2 8H6zM12 5V2`],
      eye: [`M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z`, `M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0`],
      navigation: [`M3 3l7 18 3-8 8-3L3 3z`],
      person: [`M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0`, `M5 22v-3a7 7 0 0 1 14 0v3`],
      play: [`M9 5l10 7-10 7V5z`],
      plus: [`M12 4v16M4 12h16`]
    };
    return p.jsx(`svg`, { width: size, height: size, viewBox: `0 0 24 24`, fill: `none`, stroke: `currentColor`, strokeWidth: 1.5, strokeLinecap: `round`, strokeLinejoin: `round`, 'aria-hidden': true, children: paths[kind].map((path, i) => p.jsx(`path`, { d: path }, i)) });
  };
  const image = (role, options = {}) => p.jsx(`img`, { src: media[role].src, srcSet: media[role].srcSet, sizes: `(max-width: 767px) 100vw, (max-width: 1500px) 60vw, 850px`, width: media[role].width, height: media[role].height, alt: alts[role], loading: `lazy`, decoding: `async`, ...options });
  const link = (href, label, className = `cleanbot-text-link`, play = false) => p.jsxs(`a`, { className, href, target: `_blank`, rel: `noopener noreferrer`, children: [play && icon(`play`, 16), label, !play && arrow()] });
  const intro = (eyebrow, title, id, description) => p.jsxs(`div`, { className: `cleanbot-section-intro`, ...reveal(), children: [
    p.jsxs(`div`, { children: [p.jsx(`p`, { className: `cleanbot-eyebrow`, children: eyebrow }), p.jsx(`h2`, { id, children: title })] }),
    p.jsx(`p`, { className: `cleanbot-section-description`, children: description })
  ] });
  const navButton = ([label, id], className) => p.jsx(`button`, { type: `button`, className, onClick: () => jump(id), 'aria-current': activeSection === id ? `location` : undefined, children: label }, id);
  return p.jsxs(`div`, { ref: root, className: `cleanbot-launch`, children: [
    p.jsx(`a`, { href: `#cleanbot-main`, className: `cleanbot-skip`, onClick: event => { event.preventDefault(); document.getElementById(`cleanbot-main`)?.focus(); }, children: `跳至产品介绍` }),
    p.jsxs(`header`, { className: `cleanbot-header`, children: [
      p.jsxs(`nav`, { className: `cleanbot-container cleanbot-topbar`, 'aria-label': `产品导航`, children: [
        p.jsx(`button`, { className: `cleanbot-brand`, onClick: () => jump(`cleanbot-main`), children: `CleanBot` }),
        p.jsxs(`div`, { className: `cleanbot-nav`, children: [
          ...navItems.map(item => navButton(item, `cleanbot-nav-jump`)),
          p.jsx(`button`, { className: `cleanbot-back`, onClick: returnToPortfolio, children: `返回作品集` })
        ] })
      ] }),
      p.jsx(`nav`, { className: `cleanbot-section-index cleanbot-container`, 'aria-label': `产品章节`, children: navItems.map(item => navButton(item)) })
    ] }),
    p.jsxs(`main`, { id: `cleanbot-main`, tabIndex: -1, children: [
      p.jsxs(`section`, { className: `cleanbot-hero cleanbot-container`, 'aria-labelledby': `cleanbot-title`, children: [
        p.jsxs(`figure`, { className: `cleanbot-hero-visual`, children: [
          p.jsx(`div`, { className: `cleanbot-hero-grid`, 'aria-hidden': true }),
          image(`hero`, { loading: `eager`, fetchPriority: `high`, sizes: `(max-width: 767px) calc(100vw - 48px), (max-width: 1023px) 620px, (max-width: 1400px) 46vw, 594px` }),
          p.jsx(`figcaption`, { children: `PRODUCT CONCEPT / 整机能力构想` })
        ] }),
        p.jsxs(`div`, { className: `cleanbot-hero-copy`, children: [
          p.jsxs(`p`, { className: `cleanbot-stage-pill`, children: [p.jsx(`i`, { 'aria-hidden': true }), `概念阶段 · 产品探索`] }),
          p.jsxs(`h1`, { id: `cleanbot-title`, children: [p.jsx(`span`, { children: `把重复擦拭，` }), p.jsx(`br`, {}), p.jsx(`span`, { children: `交给机器人。` })] }),
          p.jsx(`p`, { className: `cleanbot-lead`, children: `多模态智能清洁机器人` }),
          p.jsx(`p`, { className: `cleanbot-summary`, children: `顾客离席后，自动发现待清洁餐桌、生成任务并调度机器人。到桌再确认，清洁验收后恢复可用，让下一位顾客少等一会儿。` }),
          p.jsx(`div`, { className: `cleanbot-actions`, children: link(prd, `查看产品 PRD`, `cleanbot-primary`) }),
          p.jsx(`p`, { className: `cleanbot-stage`, children: `产品构想 · 一体化清洁方案探索` })
        ] }),
        p.jsx(`button`, { className: `cleanbot-scroll-cue`, onClick: () => jump(`cleanbot-capabilities`), 'aria-label': `SCROLL TO EXPLORE，向下了解产品能力`, children: `SCROLL TO EXPLORE` })
      ] }),
      p.jsxs(`section`, { id: `cleanbot-capabilities`, className: `cleanbot-capability-band cleanbot-container`, 'aria-labelledby': `cleanbot-capability-title`, ...reveal(), children: [
        p.jsxs(`div`, { className: `cleanbot-capability-heading`, children: [p.jsx(`h2`, { id: `cleanbot-capability-title`, children: `桌面 + 地面一体化清洁` }), p.jsx(`p`, { children: `发现 · 调度 · 清洁 · 恢复` })] }),
        p.jsx(`dl`, { className: `cleanbot-capability-list`, children: capabilities.map(([title, description], i) => p.jsxs(`div`, { children: [icon([`eye`, `navigation`, `table`, `person`][i]), p.jsx(`dt`, { children: title }), p.jsx(`dd`, { children: description.replaceAll(` / `, ` · `) })] }, title)) })
      ] }),
      p.jsxs(`section`, { id: `cleanbot-needs`, 'data-cb-section': ``, className: `cleanbot-section cleanbot-container`, 'aria-labelledby': `cleanbot-needs-title`, children: [
        intro(`THE NEED / 需求场景`, `为什么从餐厅开始？`, `cleanbot-needs-title`, `先聚焦餐具自助回收的高校食堂：不仅要擦干净，还要及时发现空桌，并在顾客返回时妥善回应。`),
        p.jsx(`div`, { className: `cleanbot-needs-grid`, children: needs.map(([title, description, result], i) => p.jsxs(`article`, { 'data-cb-glow': ``, ...reveal(i), children: [p.jsx(`span`, { className: `cleanbot-need-number`, 'aria-hidden': true, children: `0${i + 1}` }), p.jsx(`h3`, { children: title }), p.jsx(`p`, { children: description }), p.jsx(`p`, { className: `cleanbot-need-result`, children: result })] }, title)) }),
        p.jsxs(`div`, { className: `cleanbot-scenarios`, ...reveal(), children: [p.jsx(`span`, { children: `优先探索` }), ...[`高校食堂`, `桌型规范的餐饮空间`, `可控时段的单区域试点`].map(text => p.jsx(`p`, { className: `cleanbot-scenario-tag`, children: text }, text))] })
      ] }),
      p.jsxs(`section`, { id: `cleanbot-advantages`, 'data-cb-section': ``, className: `cleanbot-section cleanbot-container`, 'aria-labelledby': `cleanbot-advantages-title`, children: [
        intro(`THE APPROACH / 方案优势`, `少一些重复，多一些从容。`, `cleanbot-advantages-title`, `用自动发现与调度减少等待，用到桌确认尊重顾客，再用完整任务记录验证餐桌周转是否改善。`),
        p.jsx(`div`, { className: `cleanbot-advantage-grid`, children: advantages.map(([label, title, description], i) => p.jsxs(`article`, { 'data-cb-glow': ``, ...reveal(i), children: [p.jsx(`p`, { className: `cleanbot-card-label`, children: label }), p.jsx(`h3`, { children: title }), p.jsx(`p`, { className: `cleanbot-card-description`, children: description }), i === 0 && p.jsxs(`div`, { className: `cleanbot-mini-flow`, role: `img`, 'aria-label': `任务衔接：发现空桌，调度到桌，清洁恢复`, children: [
          p.jsxs(`div`, { className: `cleanbot-flow-node`, children: [icon(`eye`), p.jsx(`span`, { children: `发现空桌` })] }), p.jsx(`i`, { className: `cleanbot-flow-connector`, 'aria-hidden': true }),
          p.jsxs(`div`, { className: `cleanbot-flow-node`, children: [icon(`navigation`), p.jsx(`span`, { children: `调度到桌` })] }), p.jsx(`i`, { className: `cleanbot-flow-connector`, 'aria-hidden': true }),
          p.jsxs(`div`, { className: `cleanbot-flow-node`, children: [icon(`table`), p.jsx(`span`, { children: `清洁恢复` })] })
        ] })] }, title)) })
      ] }),
      p.jsxs(`section`, { id: `cleanbot-features`, 'data-cb-section': ``, className: `cleanbot-section cleanbot-container`, 'aria-labelledby': `cleanbot-features-title`, children: [
        intro(`THE FUNCTIONS / 核心功能`, `从看清，到清洁。`, `cleanbot-features-title`, `目标是在约定时间内，让离席后的餐桌重新可用。顶部摄像头与自动派单是初步方案，以下流程仍需通过联调与现场测试验证。`),
        p.jsxs(`div`, { className: `cleanbot-function-story`, children: [
          p.jsxs(`figure`, { className: `cleanbot-story-viewer`, children: [
            p.jsx(`div`, { className: `cleanbot-story-stage`, children: story.map((step, i) => p.jsx(`div`, { className: `cleanbot-story-image${i === activeStep ? ` is-active` : ``}`, 'data-image-role': step.image, 'aria-hidden': i !== activeStep, children: image(step.image, { alt: alts[step.image] }) }, step.key)) }),
            p.jsxs(`div`, { className: `cleanbot-story-caption`, children: [p.jsx(`figcaption`, { children: story[activeStep].caption }), p.jsx(`div`, { className: `cleanbot-story-progress`, role: `group`, 'aria-label': `功能叙事进度`, children: story.map((step, i) => p.jsx(`button`, { 'aria-pressed': i === activeStep, 'aria-label': `查看${step.key}`, onClick: () => { setActiveStep(i); jump(`cleanbot-story-${i}`); } }, step.key)) })] })
          ] }),
          p.jsx(`div`, { className: `cleanbot-story-steps`, children: story.map((step, i) => p.jsxs(`article`, { id: `cleanbot-story-${i}`, 'data-story-step': i, className: `cleanbot-story-step${i === activeStep ? ` is-active` : ``}`, children: [
            p.jsxs(`figure`, { className: `cleanbot-story-mobile-media`, 'data-image-role': step.image, children: [image(step.image), p.jsx(`figcaption`, { children: step.caption })] }),
            p.jsx(`p`, { className: `cleanbot-eyebrow`, children: `${step.label} / ${step.key}` }), p.jsx(`h3`, { children: step.title }), p.jsx(`p`, { children: step.text }), p.jsx(`p`, { className: `cleanbot-story-key`, children: step.result }), i === 2 && p.jsx(CleanBotTouchscreen, {})
          ] }, step.key)) })
        ] }),
        p.jsx(`div`, { className: `cleanbot-function-grid`, children: functions.map(([title, description], i) => p.jsxs(`article`, { 'data-cb-glow': ``, ...reveal(i), children: [p.jsx(`h3`, { children: title }), p.jsx(`p`, { children: description })] }, title)) })
      ] }),
      p.jsxs(`section`, { id: `cleanbot-hardware`, 'data-cb-section': ``, className: `cleanbot-section cleanbot-container`, 'aria-labelledby': `cleanbot-hardware-title`, children: [
        intro(`THE HARDWARE / 硬件方案`, `一台设备，各司其职。`, `cleanbot-hardware-title`, `顶部摄像头发现任务，任务服务调度到桌，机器人通过近端感知、机械臂与触屏完成现场作业。具体选型与覆盖范围仍需实测。`),
        p.jsxs(`div`, { className: `cleanbot-hardware-layout`, children: [
          p.jsxs(`figure`, { className: `cleanbot-hardware-visual`, children: [p.jsx(`div`, { className: `cleanbot-hardware-image-frame`, children: image(`hardware`, { sizes: `(max-width: 767px) 150vw, 850px` }) }), p.jsx(`figcaption`, { children: `硬件概念方案 · 模块示意，非已定型结构` })] }),
          p.jsx(`dl`, { className: `cleanbot-hardware-list`, children: hardware.map(([title, description]) => p.jsxs(`div`, { children: [p.jsx(`dt`, { children: title }), p.jsxs(`dd`, { children: [description, p.jsx(`br`, {}), p.jsx(`span`, { className: `cleanbot-pending`, children: `待验证` })] })] }, title)) })
        ] }),
        p.jsxs(`div`, { id: `cleanbot-technology`, className: `cleanbot-technology`, ...reveal(), children: [
          p.jsxs(`div`, { className: `cleanbot-technology-heading`, children: [p.jsx(`h3`, { children: `让想法落到可以验证的技术上。` }), p.jsx(`p`, { children: `先验证餐桌状态识别，再连接任务调度、导航、现场交互与清洁策略；记录每一步的结果和失败原因。` })] }),
          p.jsx(`div`, { className: `cleanbot-tech-grid`, children: technology.map(([title, category, description, state]) => p.jsxs(`article`, { children: [p.jsx(`p`, { className: `cleanbot-card-label`, children: category }), p.jsx(`h4`, { children: title }), p.jsx(`p`, { className: `cleanbot-card-description`, children: description }), p.jsx(`p`, { className: `cleanbot-tech-state`, children: state })] }, title)) })
        ] })
      ] }),
      p.jsxs(`section`, { id: `cleanbot-practice`, className: `cleanbot-practice cleanbot-container`, 'aria-labelledby': `cleanbot-practice-title`, children: [
        p.jsxs(`div`, { className: `cleanbot-practice-copy`, ...reveal(), children: [
          p.jsx(`p`, { className: `cleanbot-eyebrow`, children: `LEARNING & EXPERIMENTS / 学习记录` }),
          p.jsxs(`h2`, { id: `cleanbot-practice-title`, children: `技术学习与尝试` }),
          p.jsx(`p`, { children: `我做了一个 G1 清洁桌面的 demo，主要用于学习具身智能仿真与 VLA 微调的基本流程。` }),
          p.jsx(`p`, { children: `以桌面清洁为练习任务，尝试理解仿真环境、示范数据、模型微调与仿真评估之间如何衔接，为后续产品探索积累实践经验。` }),
          p.jsxs(`div`, { className: `cleanbot-progress-actions`, children: [link(source, `在 GitHub 查看 demo 源码`), link(video, `观看演示视频`)] })
        ] }),
        p.jsx(`ol`, { className: `cleanbot-roadmap`, 'aria-label': `技术学习内容`, ...reveal(1), children: [
          [`具身智能仿真`, `以 G1 桌面清洁为例，学习仿真场景搭建与动作执行。`], [`VLA 微调`, `学习示范数据整理、模型微调与策略评估的基本流程。`], [`链路尝试`, `逐步梳理从仿真、数据到微调，再回到仿真验证的学习链路。`]
        ].map(([title, description]) => p.jsxs(`li`, { children: [p.jsx(`h3`, { children: title }), p.jsx(`p`, { children: description })] }, title)) })
      ] }),
      p.jsxs(`section`, { id: `cleanbot-faq`, 'data-cb-section': ``, className: `cleanbot-section cleanbot-container`, 'aria-labelledby': `cleanbot-faq-title`, children: [
        p.jsxs(`div`, { className: `cleanbot-faq-layout`, children: [
          p.jsxs(`div`, { className: `cleanbot-faq-heading`, children: [p.jsx(`p`, { className: `cleanbot-eyebrow`, children: `QUESTIONS / 常见问题` }), p.jsx(`h2`, { id: `cleanbot-faq-title`, children: `开始了解前，你可能想问。` }), p.jsx(`p`, { className: `cleanbot-section-description`, children: `关于产品阶段、使用范围、人员协作与硬件参数，把目前能回答的事说明白。` })] }),
          p.jsx(`div`, { className: `cleanbot-faq-list`, children: faqs.map(([question, answer], i) => { const open = openFaqs.includes(i); return p.jsxs(`div`, { className: `cleanbot-faq-item${open ? ` is-open` : ``}`, children: [
            p.jsx(`h3`, { children: p.jsxs(`button`, { className: `cleanbot-faq-question`, id: `cleanbot-question-${i}`, 'aria-expanded': open, 'aria-controls': `cleanbot-answer-${i}`, onClick: () => setOpenFaqs(items => items.includes(i) ? items.filter(item => item !== i) : [...items, i]), children: [p.jsx(`span`, { children: question }), p.jsx(`svg`, { className: `cleanbot-faq-mark`, viewBox: `0 0 24 24`, fill: `none`, stroke: `currentColor`, strokeWidth: 1.5, 'aria-hidden': true, children: p.jsx(`path`, { d: `M12 4v16M4 12h16` }) })] }) }),
            p.jsx(`div`, { className: `cleanbot-faq-answer`, id: `cleanbot-answer-${i}`, role: `region`, 'aria-labelledby': `cleanbot-question-${i}`, 'aria-hidden': !open, inert: !open ? true : undefined, children: p.jsx(`div`, { children: p.jsx(`p`, { children: answer }) }) })
          ] }, question); }) })
        ] })
      ] }),
      p.jsx(`section`, { className: `cleanbot-closing`, 'aria-labelledby': `cleanbot-closing-title`, children: p.jsxs(`div`, { className: `cleanbot-container`, ...reveal(), children: [
        p.jsx(`p`, { className: `cleanbot-eyebrow`, children: `EXPLORE THE THINKING BEHIND IT` }), p.jsx(`h2`, { id: `cleanbot-closing-title`, children: `一个想法，认真展开。` }),
        p.jsx(`p`, { children: `进一步了解需求、功能取舍与验证计划，可以从完整产品文档继续阅读。` }),
        p.jsxs(`div`, { className: `cleanbot-actions`, children: [link(prd, `查看完整产品 PRD`, `cleanbot-primary`), link(source, `在 GitHub 查看 demo 源码`, `cleanbot-secondary`)] })
      ] }) })
    ] }),
    p.jsxs(`footer`, { className: `cleanbot-footer cleanbot-container`, children: [
      p.jsxs(`div`, { className: `cleanbot-footer-grid`, children: [
        p.jsxs(`div`, { children: [p.jsx(`p`, { className: `cleanbot-footer-brand`, children: `CleanBot` }), p.jsx(`p`, { className: `cleanbot-footer-positioning`, children: `多模态智能清洁机器人。\n让离席后的餐桌，重新可用。` })] }),
        p.jsxs(`nav`, { 'aria-label': `页脚章节导航`, children: [p.jsx(`p`, { children: `EXPLORE / 了解产品` }), ...navItems.map(item => navButton(item))] }),
        p.jsxs(`nav`, { 'aria-label': `项目资源`, children: [p.jsx(`p`, { children: `RESOURCES / 项目资源` }), link(source, `GitHub`), link(prd, `产品 PRD`), p.jsxs(`button`, { className: `cleanbot-text-link`, onClick: returnToPortfolio, children: [`返回作品集`, arrow()] })] })
      ] }),
      p.jsxs(`div`, { className: `cleanbot-copyright`, children: [p.jsx(`span`, { children: `© ${new Date().getFullYear()} CleanBot` }), p.jsx(`span`, { children: `A PRODUCT EXPLORATION BY Le-soleile` })] })
    ] })
  ] });
}
