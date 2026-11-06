function cl() {
  Ba(() => {
    if (window.matchMedia(`(prefers-reduced-motion: reduce)`).matches) return;
    const animations = ha.utils.toArray(`[data-reveal]`).filter(element => !element.closest(`#about`)).map((element) =>
      ha.fromTo(element, { y: 36, scale: .975, opacity: 0 }, {
        y: 0, scale: 1, opacity: 1, duration: .9, ease: `power3.out`,
        scrollTrigger: { trigger: element, start: `top 96%`, once: true }
      })
    );
    return () => animations.forEach(animation => { animation.scrollTrigger?.kill(); animation.kill(); });
  });
  d.useEffect(() => {
    const preference = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const finePointer = window.matchMedia(`(hover: hover) and (pointer: fine)`);
    const cards = [...document.querySelectorAll(`[data-interactive-card], .project-card`)];
    const controller = new AbortController();
    const frames = new Map();
    cards.forEach(card => {
      card.addEventListener(`pointermove`, event => {
        if (preference.matches || !finePointer.matches) return;
        cancelAnimationFrame(frames.get(card));
        frames.set(card, requestAnimationFrame(() => {
          const bounds = card.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width;
          const y = (event.clientY - bounds.top) / bounds.height;
          card.style.setProperty(`--pointer-x`, `${(x * 100).toFixed(1)}%`);
          card.style.setProperty(`--pointer-y`, `${(y * 100).toFixed(1)}%`);
          card.style.setProperty(`--tilt-x`, `${((.5 - y) * 3).toFixed(2)}deg`);
          card.style.setProperty(`--tilt-y`, `${((x - .5) * 3).toFixed(2)}deg`);
        }));
      }, { passive: true, signal: controller.signal });
      card.addEventListener(`pointerleave`, () => {
        cancelAnimationFrame(frames.get(card));
        card.style.setProperty(`--tilt-x`, `0deg`);
        card.style.setProperty(`--tilt-y`, `0deg`);
      }, { signal: controller.signal });
    });
    const videos = [...document.querySelectorAll(`.project-card video`)];
    const visible = new Set();
    const playback = video => {
      if (preference.matches || !visible.has(video)) video.pause();
      else video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
        playback(entry.target);
      });
    }, { rootMargin: `120px` });
    videos.forEach(video => {
      video.autoplay = false;
      video.pause();
      video.addEventListener(`play`, () => {
        if (preference.matches || !visible.has(video)) video.pause();
      }, { signal: controller.signal });
      observer.observe(video);
    });
    const onPreference = () => {
      videos.forEach(playback);
      if (preference.matches) {
        cards.forEach(card => { card.style.setProperty(`--tilt-x`, `0deg`); card.style.setProperty(`--tilt-y`, `0deg`); });
      }
    };
    preference.addEventListener(`change`, onPreference);
    return () => {
      controller.abort();
      frames.forEach(frame => cancelAnimationFrame(frame));
      observer.disconnect();
      preference.removeEventListener(`change`, onPreference);
    };
  }, []);
  return null;
}
