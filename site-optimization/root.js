function dl() {
  const experienceTrigger = d.useRef(null);
  const [selected, setSelected] = d.useState(null);
  const [experienceSlug, setExperienceSlug] = d.useState(ll);
  const [productSlug, setProductSlug] = d.useState(ul);
  d.useEffect(() => {
    const update = () => {
      const apply = () => { setExperienceSlug(ll()); setProductSlug(ul()); };
      if (window.__restorePortfolioStyles && ![`cleanbot`, `g1-cleaning`].includes(ul())) window.__restorePortfolioStyles().then(apply);
      else apply();
    };
    window.addEventListener(`hashchange`, update);
    window.addEventListener(`popstate`, update);
    return () => { window.removeEventListener(`hashchange`, update); window.removeEventListener(`popstate`, update); };
  }, []);
  d.useEffect(() => {
    if (!selected) return;
    const close = event => { if (event.key === `Escape`) setSelected(null); };
    window.addEventListener(`keydown`, close);
    return () => window.removeEventListener(`keydown`, close);
  }, [selected]);
  const openProduct = slug => { window.history.pushState(null, ``, `#product/${slug}`); setProductSlug(slug); };
  const closeProduct = () => { window.history.pushState(null, ``, `#products`); setProductSlug(null); };
  const openExperience = (slug, trigger) => { experienceTrigger.current = trigger || document.activeElement; setExperienceSlug(slug); };
  const closeExperience = d.useCallback(() => {
    setExperienceSlug(null);
    if (ll()) window.history.replaceState(null, ``, `#about`);
  }, []);
  if (productSlug === `cleanbot` || productSlug === `g1-cleaning`) return p.jsx(Oa, { onBack: closeProduct });
  if (productSlug === `world-of-agents` || productSlug === `embodied-dataops`) return p.jsx(WorldAgentsPage, { onBack: closeProduct });
  const experience = experienceSlug ? ne(experienceSlug) : null;
  return p.jsxs(p.Fragment, { children: [
    p.jsx(SiteAmbientBackground, { paused: Boolean(experience) }),
    p.jsxs(`div`, { className: `portfolio-surface${experience ? ` has-reading-detail` : ``}`, inert: experience ? true : undefined, children: [
      p.jsx(m, {}), p.jsx(cl, {}),
      p.jsxs(`main`, { className: `site-main`, children: [p.jsx(I, {}), p.jsx(ce, { onOpenExperience: openExperience }), p.jsx(le, { selected, onSelect: setSelected, onOpenProduct: openProduct, onClose: () => setSelected(null) })] }),
      p.jsx(_a, {})
    ] }),
    experience && p.jsx(EditorialExperienceDrawer, { experience, onClose: closeExperience, returnFocus: experienceTrigger.current }, experience.slug)
  ] });
}
