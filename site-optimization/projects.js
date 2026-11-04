function le({ selected, onSelect, onOpenProduct, onClose }) {
  const projects = [...L].reverse();
  return p.jsxs(`section`, {
    className: `section concepts site-chapter`, id: `products`, 'aria-labelledby': `concepts-title`,
    children: [
      p.jsxs(`div`, { className: `shell`, children: [
        p.jsxs(`div`, { className: `section-head`, 'data-reveal': true, children: [
          p.jsx(`h2`, { id: `concepts-title`, children: `产品练习（个人探索与尝试）` }),
          p.jsx(`p`, { children: `围绕多智能体训练与餐厅清洁展开的两项个人产品探索。` })
        ] }),
        p.jsx(`div`, { className: `project-stack`, children: projects.map((project, index) =>
          p.jsx(`div`, { className: `project-stack-item`, 'data-reveal': true, children:
            p.jsxs(`button`, {
              type: `button`, className: `project-card`, 'data-project-index': index, 'data-product': project.slug,
              onClick: () => project.slug ? onOpenProduct(project.slug) : onSelect(project),
              'aria-label': `${project.title} · ${project.status}`,
              children: [
                p.jsx(`div`, { className: `project-card__media`, 'aria-hidden': true, children:
                  p.jsx(`video`, { autoPlay: true, muted: true, loop: true, playsInline: true, preload: `metadata`, children:
                    p.jsx(`source`, { src: project.slug === `cleanbot` ? `/video/product-card-ai-bg.mp4` : `/video/product-card-dataops-bg.mp4`, type: `video/mp4` })
                  })
                }),
                p.jsxs(`div`, { className: `project-card__body`, children: [
                  p.jsx(`span`, { className: `project-card__num`, children: String(index + 1).padStart(2, `0`) }),
                  p.jsxs(`div`, { className: `project-card__copy`, children: [
                    p.jsx(`small`, { children: project.status }), p.jsx(`h3`, { children: project.title }), p.jsx(`p`, { children: project.subtitle })
                  ] }),
                  p.jsxs(`span`, { className: `project-card__cta`, children: [`进入项目`, p.jsx(D, { 'aria-hidden': true })] })
                ] })
              ]
            })
          }, project.id)
        ) })
      ] }),
      selected && p.jsx(`div`, { className: `dialog-backdrop`, role: `presentation`, onMouseDown: event => event.target === event.currentTarget && onClose(), children:
        p.jsxs(`div`, { className: `concept-dialog`, role: `dialog`, 'aria-modal': true, 'aria-labelledby': `dialog-title`, children: [
          p.jsx(`button`, { type: `button`, className: `dialog-close`, onClick: onClose, 'aria-label': `关闭产品详情`, children: p.jsx(P, {}) }),
          p.jsxs(`span`, { children: [selected.id, ` · `, selected.status] }), p.jsx(`h3`, { id: `dialog-title`, children: selected.title }), p.jsx(`p`, { children: selected.description }),
          p.jsx(`div`, { className: `tags`, children: selected.focus.map(tag => p.jsx(`span`, { children: tag }, tag)) })
        ] })
      })
    ]
  });
}
