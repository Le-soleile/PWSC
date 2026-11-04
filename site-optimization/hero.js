function SiteAmbientBackground({ paused }) {
  const media = d.useRef(null);
  const shade = d.useRef(null);
  d.useEffect(() => {
    const video = media.current;
    const preference = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const updatePlayback = () => {
      video.defaultPlaybackRate = .35;
      video.playbackRate = .35;
      if (paused || preference.matches || document.hidden) video.pause();
      else video.play().catch(() => {});
    };
    updatePlayback();
    video.addEventListener(`loadedmetadata`, updatePlayback);
    preference.addEventListener(`change`, updatePlayback);
    document.addEventListener(`visibilitychange`, updatePlayback);
    return () => {
      video.pause();
      video.removeEventListener(`loadedmetadata`, updatePlayback);
      preference.removeEventListener(`change`, updatePlayback);
      document.removeEventListener(`visibilitychange`, updatePlayback);
    };
  }, [paused]);
  d.useEffect(() => {
    let frame = 0;
    const updateShade = () => {
      frame = 0;
      const hero = document.getElementById(`top`);
      const distance = Math.max(1, hero?.offsetHeight || window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / (distance * .9)));
      const eased = progress * progress * (3 - 2 * progress);
      if (shade.current) shade.current.style.opacity = String(.04 + .14 * eased);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(updateShade); };
    window.addEventListener(`scroll`, schedule, { passive: true });
    window.addEventListener(`resize`, schedule, { passive: true });
    updateShade();
    return () => { cancelAnimationFrame(frame); window.removeEventListener(`scroll`, schedule); window.removeEventListener(`resize`, schedule); };
  }, []);
  return p.jsxs(`div`, { className: `site-backdrop`, 'aria-hidden': true, children: [
    p.jsx(`video`, { ref: media, className: `site-backdrop-video`, src: `/video/prisma-hero-background.mp4`, poster: `/video/prisma-hero-poster.jpg`, autoPlay: true, loop: true, muted: true, playsInline: true, tabIndex: -1, disablePictureInPicture: true }),
    p.jsx(`div`, { className: `site-backdrop-tint` }),
    p.jsx(`div`, { ref: shade, className: `site-backdrop-shade` })
  ] });
}

function I() {
  const actions = [
    { ...F[1], primary: F[0].primary },
    { ...F[0], primary: F[1].primary },
    ...F.slice(2)
  ];
  return p.jsxs(`section`, { className: `hero site-chapter`, id: `top`, "aria-labelledby": `hero-title`, children: [
    p.jsxs(`div`, { className: `hero-content`, children: [
      p.jsxs(`p`, { className: `hero-kicker`, children: [
        p.jsx(`span`, { className: `hero-kicker__line`, "aria-hidden": true }), `A LITTLE ABOUT ME`
      ] }),
      p.jsxs(`h1`, { id: `hero-title`, children: [
        `这里展示我的经历、`, p.jsx(`span`, { children: `作品与思考` })
      ] }),
      p.jsx(`p`, { className: `hero-lead`, children: `从控制与机器人，到 AI 工程与开源实践。这里记录我的经历、作品。` }),
      p.jsx(ee, { items: actions, className: `hero-actions` }),
      p.jsxs(`div`, { className: `hero-footer`, children: [
        p.jsxs(`div`, { className: `hero-identity`, children: [
          p.jsx(`img`, { src: `/avatar.jpg`, width: 42, height: 42, alt: `Le-soleile的头像`, decoding: `async` }),
          p.jsxs(`p`, { children: [p.jsx(`span`, { children: `哈尔滨工程大学` }), p.jsx(`small`, { children: `控制 · 机器人 · AI` })] })
        ] }),
        p.jsx(`span`, { className: `hero-edition`, children: `EXPERIENCE / WORK / THOUGHTS` })
      ] })
    ] }),
    p.jsxs(`a`, { className: `hero-scroll`, href: `#about`, "aria-label": `向下浏览个人经历`, children: [
      p.jsx(T, { "aria-hidden": true }), p.jsx(`span`, { children: `向下探索` })
    ] })
  ] });
}
