function CleanBotTouchscreen() {
  const figure = d.useRef(null), nextChoice = d.useRef(`consent`);
  const [phase, setPhase] = d.useState(`ask`);
  const [reduced, setReduced] = d.useState(() => matchMedia(`(prefers-reduced-motion: reduce)`).matches);
  const [playing, setPlaying] = d.useState(() => !matchMedia(`(prefers-reduced-motion: reduce)`).matches);
  const [visible, setVisible] = d.useState(false), [documentVisible, setDocumentVisible] = d.useState(!document.hidden);
  d.useEffect(() => {
    const preference = matchMedia(`(prefers-reduced-motion: reduce)`);
    const changed = () => { setReduced(preference.matches); if (preference.matches) setPlaying(false); };
    const visibility = () => setDocumentVisible(!document.hidden);
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), { threshold:.3 });
    observer.observe(figure.current);
    preference.addEventListener(`change`, changed);
    document.addEventListener(`visibilitychange`, visibility);
    return () => { observer.disconnect(); preference.removeEventListener(`change`, changed); document.removeEventListener(`visibilitychange`, visibility); };
  }, []);
  const running = playing && visible && documentVisible && !reduced;
  d.useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      if (phase === `ask`) setPhase(nextChoice.current);
      else { nextChoice.current = phase === `consent` ? `leave` : `consent`; setPhase(`ask`); }
    }, phase === `ask` ? 4200 : 3600);
    return () => clearTimeout(timer);
  }, [running,phase]);
  const choose = value => { setPlaying(false); setPhase(value); };
  const activate = (event,value) => { if (event.key === `Enter` || event.key === ` `) { event.preventDefault(); choose(value); } };
  const states = {
    ask: { label:`等待您的选择`, first:`抱歉，我来晚了。`, second:`是否需要帮您清洁桌子？`, status:`到桌确认` },
    consent: { label:`已选择清洁 · 等待安全确认`, first:`好的，交给我。`, second:`请先让出安全作业空间。`, status:`等待确认` },
    leave: { label:`已选择暂不清洁 · 结束本次作业`, first:`好的，这就离开。`, second:`有需要时，可以再叫我。`, status:`礼貌退出` }
  };
  const current = states[phase];
  const controlIcon = kind => p.jsx(`svg`, { viewBox:`0 0 24 24`, width:16, height:16, fill:`none`, stroke:`currentColor`, strokeWidth:1.5, strokeLinecap:`round`, strokeLinejoin:`round`, 'aria-hidden':true, children:kind === `reset` ? [p.jsx(`path`, { d:`M4 10a8 8 0 1 1 1.6 7.2M4 4v6h6` },`reset`)] : kind === `pause` ? p.jsx(`path`, { d:`M9 5v14M15 5v14` }) : p.jsx(`path`, { d:`m8 5 11 7-11 7V5Z` }) });
  return p.jsxs(`figure`, { ref:figure, className:`cleanbot-touchscreen-example cb-touch-demo`, 'data-phase':phase, 'data-running':running, children:[
    p.jsxs(`figcaption`, { className:`cb-touch-heading`, children:[
      p.jsx(`span`, { id:`cb-touch-caption`, children:`触屏交互示意` }),
      p.jsxs(`div`, { className:`cb-touch-tools`, children:[
        !reduced && p.jsx(`button`, { type:`button`, className:`cb-touch-tool`, 'aria-label':playing ? `暂停自动演示` : `播放自动演示`, 'aria-pressed':playing, onClick:() => { if (!playing) setPhase(`ask`); setPlaying(!playing); }, children:controlIcon(playing ? `pause` : `play`) }),
        p.jsx(`button`, { type:`button`, className:`cb-touch-tool`, 'aria-label':`重新选择`, onClick:() => { setPlaying(false); setPhase(`ask`); }, children:controlIcon(`reset`) })
      ] })
    ] }),
    p.jsxs(`svg`, { className:`cb-touch-screen`, viewBox:`0 0 560 410`, role:`group`, 'aria-labelledby':`cb-touch-caption cb-touch-svg-title`, 'aria-describedby':`cb-touch-svg-desc`, children:[
      p.jsx(`title`, { id:`cb-touch-svg-title`, children:`CleanBot 到桌询问与顾客选择` }),
      p.jsx(`desc`, { id:`cb-touch-svg-desc`, children:`概念交互演示。可选择需要清洁或暂不清洁，查看机器人的回应。选择清洁后仍须确认安全作业空间。` }),
      p.jsx(`rect`, { className:`cb-touch-surface`, x:1,y:1,width:558,height:408,rx:18 }),
      p.jsx(`text`, { x:40,y:55,className:`cb-touch-brand`,children:`CleanBot` }),
      p.jsx(`path`, { d:`M40 80H520`,className:`cb-touch-rule` }),
      p.jsx(`text`, { x:476,y:54,textAnchor:`end`,className:`cb-touch-meta`,children:current.status }),
      p.jsxs(`g`, { className:`cb-touch-signal`, 'aria-hidden':true, children:[
        ...[8,16,24,16,8].map((height,index) => p.jsx(`rect`, { x:491+index*6,y:46-height/2,width:2,height,rx:1,style:{animationDelay:`${index*100}ms`} },`signal-${index}`))
      ] }),
      p.jsxs(`g`, { className:`cb-touch-message`, key:`message-${phase}`, children:[
        p.jsx(`text`, { x:40,y:146,className:`cb-touch-message-title`,children:current.first }),
        p.jsx(`text`, { x:40,y:194,className:`cb-touch-message-detail`,children:current.second }),
        p.jsx(`text`, { x:40,y:234,className:`cb-touch-message-hint`,children:phase === `ask` ? `在您确认前，我会保持等待。` : phase === `consent` ? `安全确认后，才开始清洁。` : `本次不清洁，不打扰您的用餐。` })
      ] }),
      ...[[`consent`,`需要清洁`,40],[`leave`,`暂不清洁`,292]].map(([value,label,x]) => p.jsxs(`g`, { className:`cb-touch-choice cb-touch-choice--${value}${phase === value ? ` is-selected` : ``}`,role:`button`,tabIndex:0,'aria-label':value === `consent` ? `示意：需要清洁` : `示意：暂不清洁，请离开`,'aria-pressed':phase === value,onFocus:() => setPlaying(false),onClick:() => choose(value),onKeyDown:event => activate(event,value),children:[
        p.jsx(`rect`, { x,y:272,width:228,height:94,rx:12 }),
        p.jsx(`text`, { x:x+26,y:329,children:label }),
        p.jsx(`path`, { className:`cb-touch-choice-arrow`,d:phase === value ? `m${x+178} 319 6 6 12-13` : `M${x+177} 319h18m-7-7 7 7-7 7`,fill:`none`,strokeWidth:1.7,strokeLinecap:`round`,strokeLinejoin:`round` })
      ] },`choice-${value}`)),
      p.jsx(`path`, { d:`M40 391H520`,className:`cb-touch-rule` }),
      running && phase === `ask` && p.jsx(`path`, { className:`cb-touch-progress`, d:`M40 391H520`, 'aria-hidden':true },`progress-${phase}`)
    ] }),
    p.jsxs(`div`, { className:`cb-touch-footer`, children:[p.jsx(`span`, { className:`cb-touch-state`,role:`status`,'aria-live':playing ? `off` : `polite`,'aria-atomic':true,children:current.label }),p.jsx(`span`, { className:`cb-touch-mode`,children:reduced ? `点选体验` : playing ? `自动演示` : `点选体验` })] }),
    p.jsx(`p`, { className:`cb-touch-note`,children:`同意后仍需让出作业空间；无人回应不默认同意。` })
  ] });
}
