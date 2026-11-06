function useWorldAgentsMotion() {
  d.useEffect(() => {
    const root = document.querySelector(`.wa-page`);
    const preference = matchMedia(`(prefers-reduced-motion: reduce)`);
    const previousPage = document.documentElement.getAttribute(`data-wf-page`);
    const hadIx = document.documentElement.classList.contains(`w-mod-ix`);
    let disposed = false, running = false;
    const added = [];
    const load = (id,src) => {
      let script = document.getElementById(id);
      if (script?.dataset.loaded) return Promise.resolve();
      return new Promise((resolve,reject) => {
        if (!script) {script=document.createElement(`script`);script.id=id;script.src=src;script.async=true;document.head.appendChild(script);}
        script.addEventListener(`load`,()=>{script.dataset.loaded=`true`;resolve();},{once:true});
        script.addEventListener(`error`,()=>{script.remove();reject(new Error(`Motion asset failed: ${src}`));},{once:true});
      });
    };
    const reset = () => {
      if(running){window.Webflow?.require(`ix2`)?.destroy();running=false;}
      root.classList.remove(`wa-motion-ready`);
      root.querySelectorAll(`[style]`).forEach(node=>{node.style.removeProperty(`opacity`);node.style.removeProperty(`transform`);node.style.removeProperty(`transform-style`);node.style.removeProperty(`will-change`);});
      root.querySelector(`.wa-header`)?.style.removeProperty(`background-color`);
    };
    const start = async () => {
      if(preference.matches){reset();return;}
      try {
        if(!window.jQuery) await load(`wa-jquery`,`/assets/world-agents-motion/jquery.js`);
        if(disposed||preference.matches)return;
        await load(`wa-webflow`,`/assets/world-agents-motion/webflow-runtime.js`);
        const config=await fetch(`/assets/world-agents-motion/config.json`).then(response=>{if(!response.ok)throw new Error(`Motion configuration unavailable`);return response.json();});
        if(disposed||preference.matches)return;
        document.documentElement.setAttribute(`data-wf-page`,`world-of-agents`);
        root.querySelectorAll(`.wa-bento>article, .wa-evidence article`).forEach(card=>{
          if(card.querySelector(`.wa-pointer-light`))return;
          const light=document.createElement(`span`);light.className=`wa-pointer-light`;light.setAttribute(`aria-hidden`,`true`);card.prepend(light);added.push(light);
        });
        window.Webflow.ready();
        window.Webflow.require(`ix2`).init(config);
        document.dispatchEvent(new Event(`IX2_PAGE_UPDATE`));
        window.dispatchEvent(new Event(`scroll`));
        running=true;
        root.classList.add(`wa-motion-ready`);
        root.dataset.motionEngine=`vancouver-webflow-ix2`;
      } catch(error) {if(!disposed){reset();console.warn(`World of Agents motion:`,error);}}
    };
    const change=()=>{reset();if(!preference.matches)start();};
    preference.addEventListener(`change`,change);
    start();
    return () => {
      disposed=true;preference.removeEventListener(`change`,change);reset();added.forEach(node=>node.remove());
      if(previousPage===null)document.documentElement.removeAttribute(`data-wf-page`);else document.documentElement.setAttribute(`data-wf-page`,previousPage);
      if(!hadIx)document.documentElement.classList.remove(`w-mod-ix`);
    };
  },[]);
}
