WORLD_AGENTS_MOTION_HELPER
function WorldAgentsPage({ onBack }) {
  useWorldAgentsMotion();
  const content = WORLD_AGENTS_CONTENT;
  const [scene, setScene] = d.useState(0), [openFaqs, setOpenFaqs] = d.useState([0]);
  const [active, setActive] = d.useState(``);
  const sceneRefs = d.useRef([]);
  const sceneArea = d.useRef(null);
  const scenes = [
    {image:`islands.jpg`,title:`群岛海域`,label:`ISLANDS`,text:`岛屿与通道交错，为路径与任务规划提供可观察的场景。`},
    {image:`open-sea.jpg`,title:`开阔水域`,label:`OPEN WATER`,text:`开阔的水面航行场景，用于观察艇群与环境中的运动。`},
    {image:`platform.jpg`,title:`海上平台`,label:`OFFSHORE`,text:`海上设施周边的场景呈现，拓展任务的空间背景。`},
    {image:`underwater.jpg`,title:`海底世界`,label:`UNDERWATER`,text:`海底光学与探照灯交互展示，验证范围与水面训练分别说明。`},
    {image:`grassland.jpg`,title:`山地草原`,label:`LANDSCAPE`,text:`无人机与地面车交互展示，探索更多类型智能体的呈现。`}
  ];
  d.useEffect(() => {
    const area = sceneArea.current;
    if (!area) return;
    let accumulated = 0, lastEvent = 0, lockedUntil = 0;
    const wheel = event => {
      if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const now = Date.now();
      if (now < lockedUntil) { event.preventDefault(); return; }
      if (now - lastEvent > 250 || Math.sign(accumulated) !== Math.sign(event.deltaY)) accumulated = 0;
      lastEvent = now;
      const amount = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      accumulated += amount;
      event.preventDefault();
      if (Math.abs(accumulated) >= 90) {
        const direction = Math.sign(accumulated);
        setScene(current => (current + direction + scenes.length) % scenes.length);
        accumulated = 0;
        lockedUntil = now + 650;
      }
    };
    area.addEventListener(`wheel`, wheel, { passive: false });
    return () => area.removeEventListener(`wheel`, wheel);
  }, [scenes.length]);
  const h = p.jsxs;
  const nav = [[`场景与任务`,`woa-scenes`],[`核心能力`,`woa-platform`],[`开发者`,`woa-developers`],[`常见问题`,`woa-faq`]];
  d.useEffect(() => {
    const previous = document.title;
    document.title = `World of Agents · 水面无人艇算法实验平台`;
    document.documentElement.classList.add(`world-agents-document`);
    if (location.hash === `#product/embodied-dataops`) history.replaceState(null,``,`#product/world-of-agents`);
    window.scrollTo({top:0,behavior:`instant`});
    let frame;
    const update = () => { frame = 0; let current = ``; for (const [,id] of nav) if (document.getElementById(id)?.getBoundingClientRect().top < innerHeight * .4) current=id; setActive(current); };
    const scroll = () => { if (!frame) frame=requestAnimationFrame(update); };
    window.addEventListener(`scroll`,scroll,{passive:true});
    return () => { document.title=previous;document.documentElement.classList.remove(`world-agents-document`);window.removeEventListener(`scroll`,scroll);cancelAnimationFrame(frame); };
  },[]);
  const jump = id => { const behavior = matchMedia(`(prefers-reduced-motion: reduce)`).matches ? `instant` : `smooth`; if (id === `wa-main`) window.scrollTo({top:0,behavior}); else document.getElementById(id)?.scrollIntoView({block:`start`,behavior}); };
  const jumpStack = index => {
    const holder = document.querySelector(`.wa-workflow-stack .slider-image-holder`);
    if (!holder) return;
    const cards = [...holder.querySelectorAll(`.slider-sticky-holder`)];
    const gap = parseFloat(getComputedStyle(holder).rowGap) || 50;
    const firstMargin = parseFloat(getComputedStyle(cards[0]).marginTop) || 0;
    const preceding = cards.slice(0,index).reduce((sum,card)=>sum+card.offsetHeight+gap,0);
    window.scrollTo({top:holder.getBoundingClientRect().top+scrollY+firstMargin+preceding-135,behavior:matchMedia(`(prefers-reduced-motion: reduce)`).matches?`instant`:`smooth`});
  };
  const back = () => { onBack(); requestAnimationFrame(()=>document.getElementById(`products`)?.scrollIntoView({block:`start`,behavior:`instant`})); };
  const image = (file,alt,props={}) => h(`img`,{src:`/assets/world-agents/${file}`,alt,loading:`lazy`,...props});
  const arrow = () => h(`span`,{'aria-hidden':true,children:`↗`});
  const button = (text,id,secondary=false) => h(`button`,{className:`wa-button${secondary ? ` wa-button-outline` : ``}`,onClick:()=>jump(id),children:[h(`span`,{className:`wa-button-gradient`,'aria-hidden':true}),h(`span`,{className:`wa-button-fill`,'aria-hidden':true}),h(`span`,{className:`wa-button-label`,children:text}),arrow()]});
  const title = (label,heading,text,center=false) => h(`div`,{className:`wa-heading${center ? ` is-centered` : ``}`,children:[h(`p`,{className:`wa-eyebrow`,children:label}),h(`h2`,{children:heading}),text&&h(`p`,{className:`wa-muted`,children:text})]});
  const tabKeys = (event,index,length,set,refs) => {let next=index; if(event.key===`ArrowRight`)next=(index+1)%length;else if(event.key===`ArrowLeft`)next=(index+length-1)%length;else if(event.key===`Home`)next=0;else if(event.key===`End`)next=length-1;else return;event.preventDefault();set(next);refs.current[next]?.focus();};
  const contour = h(`svg`,{className:`wa-contours`,viewBox:`0 0 1200 700`,fill:`none`,'aria-hidden':true,children:Array.from({length:11},(_,i)=>h(`path`,{d:`M${-160+i*22} ${490-i*13} C ${-100+i*16} ${90-i*14}, ${390-i*11} ${-110+i*24}, ${460+i*20} ${100+i*10} S ${940+i*28} ${130-i*12}, ${960+i*26} ${460+i*12} S ${450-i*12} ${600+i*19}, ${-160+i*22} ${490-i*13}`,stroke:`currentColor`,strokeWidth:1},i))});
  return h(`div`,{className:`world-agents-page wa-page`,children:[
    h(`a`,{className:`wa-skip`,href:`#wa-main`,onClick:e=>{e.preventDefault();document.getElementById(`wa-main`).focus();},children:`跳至产品内容`}),
    h(`header`,{className:`wa-header`,children:h(`div`,{className:`wa-shell wa-nav`,children:[
      h(`button`,{className:`wa-brand`,onClick:()=>jump(`wa-main`),'aria-label':`World of Agents 返回顶部`,children:[h(`img`,{className:`wa-brand-logo`,src:`/assets/world-agents/brand-logo.png`,alt:``,width:34,height:45}),h(`span`,{children:[`World of Agents`,h(`small`,{children:`MARITIME SIMULATION`})]})]}),
      h(`nav`,{'aria-label':`产品导航`,children:nav.map(([text,id])=>h(`button`,{onClick:()=>jump(id),'aria-current':active===id?`location`:undefined,children:[text,h(`span`,{className:`wa-nav-underline`,'aria-hidden':true})]},id))}),
      h(`button`,{className:`wa-return`,onClick:back,children:[`作品集`,h(`span`,{'aria-hidden':true,children:`↗`})]})
    ]})}),
    h(`main`,{id:`wa-main`,tabIndex:-1,children:[
      h(`section`,{className:`wa-hero`,children:[contour,h(`div`,{className:`wa-shell`,children:[
        h(`p`,{className:`wa-status`,children:[h(`span`,{}),`第一阶段 · 本地运行 · 水面无人艇为核心`]}),
        h(`h1`,{children:[`为你的智能体，`,h(`br`,{}),h(`span`,{className:`wa-gradient`,children:`构建可探索的世界。`})]}),
        h(`p`,{className:`wa-hero-description`,children:`从搭场景到看回放，在一处完成水面无人艇算法实验。连接 UE5 场景、船体动力学与 GPU 批量环境，把训练方式留给你。`}),
        h(`div`,{className:`wa-actions`,children:[button(`探索平台能力`,`woa-platform`),button(`了解算法接入`,`woa-developers`,true)]}),
        h(`div`,{className:`wa-product-stage`,children:[
          h(`figure`,{className:`wa-window wa-hero-window`,children:[h(`div`,{className:`wa-window-bar`,children:[h(`span`,{children:`WORLD OF AGENTS / COASTAL BASE`}),h(`span`,{className:`wa-live`,children:`UE5`})]}),image(`hero.jpg`,`项目真实运行截图：海岸基地中的水面无人艇`,{loading:`eager`,fetchPriority:`high`}),h(`figcaption`,{children:`海岸基地 / 项目真实运行截图`})]}),

        ]}),
        h(`div`,{className:`wa-stack`, 'aria-label':`平台技术组成`,children:[`UE5 场景呈现`,`Fossen 动力学`,`Warp 批量推进`,`Python SDK`].map(x=>h(`span`,{children:x},x))})
      ]})]}),
      h(`section`,{id:`woa-platform`,className:`wa-section wa-shell`,children:[
        title(`ONE PLATFORM. YOUR ALGORITHMS.`,`让场景、模型与算法，协同工作。`,`面向水面艇研究，把实验中反复切换的环节连接起来。`,true),
        h(`div`,{className:`wa-principles`,children:content.advantages.map(([label,heading,text],i)=>h(`article`,{children:[h(`span`,{className:`wa-principle-num`,children:`0${i+1}`}),h(`h3`,{children:label}),h(`p`,{children:text})]},label))}),
        h(`article`,{className:`wa-feature-row`,children:[h(`div`,{className:`wa-feature-copy`,children:[h(`p`,{className:`wa-eyebrow`,children:`01 / SCENE EDITOR`}),h(`h2`,{children:[`先定义任务，`,h(`br`,{}),h(`span`,{className:`wa-gradient`,children:`再布置你的舰队。`})]}),h(`p`,{className:`wa-muted`,children:`检视模型、拖放智能体，编辑位置与航向。用稳定 GUID 引用对象，用场景存档保留实验的起点。`}),h(`ul`,{className:`wa-checks`,children:[`智能体库与模型检视`,`位置、航向与自由相机`,`海图、道具配置与存档`].map(x=>h(`li`,{children:x},x))}),button(`浏览场景`,`woa-scenes`,true)]}),h(`figure`,{className:`wa-feature-picture wa-picture-purple`,children:[image(`editor.jpg`,`项目场景编辑界面：对象检视与位置编辑`),h(`figcaption`,{children:`SCENE EDITOR / 项目运行截图`})]})]}),
        h(`article`,{className:`wa-feature-row is-reversed`,children:[h(`div`,{className:`wa-feature-copy`,children:[h(`p`,{className:`wa-eyebrow`,children:`02 / SHIP WORKSHOP`}),h(`h2`,{children:[`几项参数，`,h(`br`,{}),`一次数值试航。`]}),h(`p`,{className:`wa-muted`,children:`从船长、宽、吃水、质量与推进器参数出发，生成简化船体物理代理。先检查结构与参数，再观察直航、回转与停推。`}),h(`div`,{className:`wa-file-tags`,children:[`JSON`,`OBJ`,`URDF`].map(x=>h(`span`,{children:x},x))}),h(`p`,{className:`wa-small`,children:`模型包可导出，也可创建工作台内独立的静水训练世界。自定义船型尚未自动导入 UE 原生船库。`})]}),h(`div`,{className:`wa-workshop-collage`,children:[h(`figure`,{className:`wa-feature-picture wa-picture-rose`,children:[image(`hull.jpg`,`工坊中的船体结构与参数预览`),h(`figcaption`,{children:`SHIP MODEL / 参数与结构预览`})]}),h(`figure`,{className:`wa-trial-float`,children:[image(`trial-turn.jpg`,`工坊数值回转试航轨迹`),h(`figcaption`,{children:`回转试航 / 数值仿真`})]})]})]})
      ]}),
      h(`section`,{id:`woa-scenes`,className:`wa-section wa-scenes-section`,children:h(`div`,{className:`wa-shell`,children:[
        title(`ENVIRONMENTS`,`每一次实验，都有自己的世界。`,`从群岛、海上平台到开阔水域，用真实项目画面了解场景。`,true),
        h(`div`,{className:`wa-scene-tabs`,role:`tablist`,'aria-label':`选择仿真场景`,children:scenes.map((item,i)=>h(`button`,{role:`tab`,id:`wa-scene-tab-${i}`,'aria-controls':`wa-scene-panel-${i}`,'aria-selected':scene===i,tabIndex:scene===i?0:-1,ref:node=>sceneRefs.current[i]=node,onClick:()=>setScene(i),onKeyDown:e=>tabKeys(e,i,scenes.length,setScene,sceneRefs),children:item.title},item.title))}),
        h(`div`,{ref:sceneArea,children:scenes.map((item,i)=>h(`figure`,{className:`wa-scene-screen`,role:`tabpanel`,id:`wa-scene-panel-${i}`,'aria-labelledby':`wa-scene-tab-${i}`,tabIndex:0,hidden:scene!==i,children:[image(item.image,item.title+`项目运行截图`,{loading:i===0?`eager`:`lazy`}),h(`figcaption`,{children:[h(`div`,{children:[h(`span`,{className:`wa-eyebrow`,children:item.label}),h(`h3`,{children:item.title}),h(`p`,{children:item.text})]}),h(`span`,{className:`wa-capture-badge`,children:`项目真实运行截图`})]})]},item.title))}),
        h(`p`,{className:`wa-footnote`,children:`水面无人艇是当前批量训练主线。海底与草原以交互展示为主；各地图的物理与训练支持范围需分别确认，视觉天气与物理风浪配置分别定义。`})
      ]})}),
      h(`section`,{className:`wa-section wa-shell`,children:[
        title(`SCALE THE EXPERIMENT`,`把实验，扩展到更多世界。`,`世界数与每世界艇数分别配置，按具体任务检查资源、采样与状态推进。`,true),
        h(`div`,{className:`wa-bento`,children:[
          h(`article`,{className:`wa-bento-parallel`,children:[h(`p`,{className:`wa-eyebrow`,children:`GPU / PARALLEL ENVIRONMENTS`}),h(`h3`,{children:`多个世界，同一条实验主线。`}),h(`p`,{className:`wa-muted`,children:`Fossen / Warp 后端推进状态，UE5 负责三维呈现。计算与展示通过同一状态来源连接。`}),h(`div`,{className:`wa-world-grid`,'aria-label':`并行环境概念示意`,children:Array.from({length:24},(_,i)=>h(`span`,{children:[h(`i`,{}),h(`i`,{}),h(`small`,{children:`W${String(i+1).padStart(2,`0`)}`})]},i))}),h(`p`,{className:`wa-small`,children:`并行世界概念示意，非性能测试画面`})]}),
          h(`article`,{className:`wa-bento-metric`,children:[h(`small`,{children:`PARALLEL WORLDS`}),h(`strong`,{className:`wa-gradient`,children:`1–4096`}),h(`h3`,{children:`工作台可配置的并行世界数`}),h(`p`,{className:`wa-muted`,children:`围绕任务组织批量环境，训练逻辑由外部算法掌握。`})]}),
          h(`article`,{className:`wa-bento-metric`,children:[h(`small`,{children:`SURFACE AGENTS`}),h(`strong`,{className:`wa-gradient`,children:`1–256`}),h(`h3`,{children:`场景导出支持的水面智能体数`}),h(`p`,{className:`wa-muted`,children:`世界数与艇数是两个配置维度，分别检查实验条件。`})]})
        ]}),
        h(`p`,{className:`wa-footnote`,children:`配置范围不代表任意组合均已验收或吞吐保证。性能数据需同时说明硬件、世界数、艇数、精度、控制周期与计时范围。`})
      ]}),
      h(`section`,{id:`woa-workflow`,className:`wa-section wa-shell wa-workflow-stack`,children:[
        h(`div`,{className:`sticky-slider-container`,children:[
          h(`div`,{className:`sticky-text-container`,children:h(`div`,{className:`sticky-text-holder`,children:[
            title(`THE WORKFLOW`,[`从场景到复盘，`,h(`br`,{}),`保持实验的连续。`],`搭建场景、选择船型、接入算法，再通过诊断与回放检查过程。`),
            h(`ol`,{className:`wa-stack-steps`,'aria-label':`实验步骤`,children:content.features.map((item,i)=>h(`li`,{children:h(`button`,{onClick:()=>jumpStack(i),children:[h(`span`,{children:`0${i+1}`}),h(`span`,{children:item.title}),h(`span`,{'aria-hidden':true,children:`↗`})]})},item.title))}),
            h(`p`,{className:`wa-small wa-stack-hint`,children:`向下滚动，沿着实验过程逐层查看。`})
          ]})}),
          h(`div`,{className:`slider-image-holder`,children:content.features.map((item,i)=>h(`figure`,{id:`wa-stack-card-${i}`,className:`slider-sticky-holder _0${i+1}`,style:{'--stack-order':i},children:[
            h(`div`,{className:`wa-stack-card`,children:[
              h(`div`,{className:`wa-stack-card-bar`,children:[h(`span`,{children:`0${i+1} / ${item.label}`}),h(`span`,{children:i===3?`诊断与回放示意`:`项目运行截图`})]}),
              image(item.image,item.title+`示意图`,{loading:`eager`}),
              h(`figcaption`,{children:[h(`h3`,{children:item.heading}),h(`p`,{className:`wa-muted`,children:item.text}),h(`ul`,{className:`wa-checks`,children:item.points.map(x=>h(`li`,{children:x},x))})]})
            ]})
          ]},item.title))})
        ]})
      ]}),
      h(`section`,{id:`woa-developers`,className:`wa-section wa-shell`,children:[
        title(`BUILT FOR DEVELOPERS`,`你掌握策略，平台提供环境。`,`模型、训练循环、经验池、任务奖励与结束条件，留在你的代码中。`,true),
        h(`div`,{className:`wa-architecture`,children:[
          h(`article`,{children:[h(`span`,{className:`wa-eyebrow`,children:`YOUR CODE`}),h(`h3`,{children:`外部算法`}),h(`p`,{children:`模型与推理 / 训练循环`}),h(`p`,{children:`奖励 / 结束条件 / 经验池`})]}),
          h(`div`,{className:`wa-architecture-link`,children:[h(`strong`,{children:`Python SDK`}),h(`span`,{children:`观测 ⇄ 动作`})]}),
          h(`article`,{children:[h(`span`,{className:`wa-eyebrow`,children:`SIMULATION`}),h(`h3`,{children:`Fossen / Warp`}),h(`p`,{children:`船舶动力学 / 批量状态推进`}),h(`p`,{children:`场景 / 观测编码 / 动作施加`})]}),
          h(`div`,{className:`wa-architecture-link`,children:[h(`strong`,{children:`同一状态`}),h(`span`,{children:`计算与展示`})]}),
          h(`article`,{children:[h(`span`,{className:`wa-eyebrow`,children:`VISUALIZATION`}),h(`h3`,{children:`UE5`}),h(`p`,{children:`三维场景 / 交互 / 渲染`}),h(`p`,{children:`录制 / 只读回放`})]})
        ]}),
        h(`p`,{className:`wa-footnote`,children:`外部仿真拥有状态时，UE 关闭本地重复积分。架构连接方式不等于实船一致性验证。`}),
        h(`div`,{className:`wa-interfaces`,children:content.technology.map(([heading,text],i)=>h(`article`,{children:[h(`span`,{className:`wa-interface-icon`,children:[`⌘`,`↔`,`▦`,`◇`,`◎`,`…`][i]}),h(`h3`,{children:heading}),h(`p`,{className:`wa-muted`,children:text})]},heading))})
      ]}),
      h(`section`,{className:`wa-section wa-shell`,children:[
        title(`RESEARCH & EVIDENCE`,`实现了什么，验证到哪里。`,`以项目材料为依据，分别说明实现状态、验证范围与后续扩展。`),
        h(`div`,{className:`wa-evidence`,children:[[`01`,`已实现`,`本地源码运行`,`场景编辑与存档、船舶工坊、训练工作台、本地接口、录制与只读回放。`],[`02`,`限定验证`,`按船型与模式说明`,`Fossen 适配器数值检查、三类数值试航与冻结候选记录。尚未完成全船型海试标定。`],[`03`,`独立研究`,`可微实验`,`相关研究尚未并入平台，不代表已开放端到端可微训练。`],[`04`,`后续扩展`,`待实现或确认`,`自定义船进入 UE 船库、RGB 观测接口、独立安装包与云端服务。`]].map(([n,label,heading,text])=>h(`article`,{children:[h(`div`,{children:[h(`span`,{children:n}),h(`small`,{children:label})]}),h(`h3`,{children:heading}),h(`p`,{className:`wa-muted`,children:text})]},n))})
      ]}),
      h(`section`,{id:`woa-faq`,className:`wa-section wa-shell wa-faq`,children:[
        title(`QUESTIONS, ANSWERED.`,`开始之前，你可能想了解。`,`关于运行方式、观测接口与模型验证。`),
        h(`div`,{children:content.faqs.map(([question,answer],i)=>h(`article`,{className:`wa-faq-item`,children:[h(`h3`,{children:h(`button`,{id:`wa-question-${i}`,'aria-expanded':openFaqs.includes(i),'aria-controls':`wa-answer-${i}`,onClick:()=>setOpenFaqs(items=>items.includes(i)?items.filter(x=>x!==i):[...items,i]),children:[question,h(`span`,{'aria-hidden':true,children:openFaqs.includes(i)?`−`:`+`})]})}),h(`div`,{id:`wa-answer-${i}`,role:`region`,'aria-labelledby':`wa-question-${i}`,hidden:!openFaqs.includes(i),children:h(`p`,{children:answer})})]},question))})
      ]}),
      h(`section`,{className:`wa-section wa-shell`,children:h(`div`,{className:`wa-closing`,children:[h(`p`,{className:`wa-eyebrow`,children:`WORLD OF AGENTS`}),h(`h2`,{children:[`把下一个想法，`,h(`br`,{}),h(`span`,{className:`wa-gradient`,children:`放进可探索的世界。`})]}),h(`p`,{className:`wa-muted`,children:`从一个场景、一种船型、一次算法实验开始。`}),h(`div`,{className:`wa-actions`,children:[button(`回看平台能力`,`woa-platform`),h(`a`,{className:`wa-button wa-button-outline`,href:`https://www.bilibili.com/video/BV1MvxL6RENi`,target:`_blank`,rel:`noopener noreferrer`,children:[h(`span`,{className:`wa-button-gradient`,'aria-hidden':true}),h(`span`,{className:`wa-button-fill`,'aria-hidden':true}),h(`span`,{className:`wa-button-label`,children:`查看平台应用视频`}),arrow()]})]})]})})
    ]}),
    h(`footer`,{className:`wa-shell wa-footer`,children:[h(`div`,{children:[h(`strong`,{children:`World of Agents`}),h(`p`,{children:`Le-soleile / 个人产品探索`})]}),h(`p`,{children:`水面无人艇仿真与算法实验平台`}),h(`button`,{onClick:()=>jump(`wa-main`),children:`返回顶部 ↑`})]})
  ]});
}
