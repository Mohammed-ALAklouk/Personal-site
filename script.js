const lenis = new Lenis({ duration: 0.9, smoothWheel: true, autoRaf: false });

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});


let clientX = 0, clientY = 0, scroll = 0;

const updateMousePosition = () => {
    const mx = clientX;
    const my = clientY + scroll;

    document.documentElement.style.setProperty('--mx', `${mx}px`);
    document.documentElement.style.setProperty('--my', `${my}px`);
};

document.addEventListener('mousemove', (e) => {
    clientX = e.clientX;
    clientY = e.clientY;
    updateMousePosition();
});

document.addEventListener('scroll', (e) => {
    scroll = window.scrollY;
    updateMousePosition();
});
