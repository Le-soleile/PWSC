document.getElementById('print-doc').addEventListener('click', () => window.print());
const sections = [...document.querySelectorAll('main>section')];
const links = [...document.querySelectorAll('aside nav a')];
let frame = 0;
const update = () => {
  frame = 0;
  let current = sections[0]?.id;
  for (const section of sections) if (section.getBoundingClientRect().top <= 160) current = section.id;
  for (const link of links) {
    if (link.hash === '#' + current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
};
window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
document.querySelectorAll('.mobile-toc a').forEach(link => link.addEventListener('click', () => { link.closest('details').open = false; }));
update();
