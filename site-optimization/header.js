function m() {
  const [active, setActive] = d.useState(`top`);
  d.useEffect(() => {
    const sections = [...document.querySelectorAll(`.site-chapter`)];
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const current = [...sections].reverse().find(section => section.getBoundingClientRect().top <= window.innerHeight * .38);
        setActive(current?.id || `top`);
      });
    };
    update();
    window.addEventListener(`scroll`, update, { passive: true });
    window.addEventListener(`resize`, update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(`scroll`, update);
      window.removeEventListener(`resize`, update);
    };
  }, []);
  return p.jsxs(p.Fragment, { children: [
    p.jsx(`a`, { className: `skip-link`, href: `#about`, children: `跳转到个人经历` }),
    p.jsxs(`header`, { className: `site-header`, children: [
      p.jsxs(`a`, { className: `brand`, href: `#top`, "aria-label": `Le-soleile · 返回首页`, children: [
        p.jsx(`span`, { children: `Le-soleile` }),
        p.jsx(`small`, { children: `PERSONAL PORTFOLIO` })
      ] }),
      p.jsx(`nav`, { className: `site-nav`, "aria-label": `主导航`, children: [
        [`top`, `首页`], [`about`, `经历`], [`products`, `项目`], [`contact`, `联系`]
      ].map(([id, label]) => p.jsx(`a`, {
        href: `#${id}`, "aria-current": active === id ? `location` : undefined,
        children: label
      }, id)) })
    ] })
  ] });
}
