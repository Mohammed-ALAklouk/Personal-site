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

const clocks = document.querySelectorAll('.js-clock');

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Istanbul",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const updateClock = () => {
  const text = fmt.format(new Date());
  clocks.forEach((element) => {
    element.textContent = text;
  });
};

// Update the clock on page load
updateClock();

// Update the clock every 15 seconds 
setInterval(updateClock, 15000);

const nav = document.querySelector('.nav');

const updateNav = () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
};

// Update the nav on page load
updateNav();

// Update the nav on scroll
document.addEventListener('scroll', updateNav);

