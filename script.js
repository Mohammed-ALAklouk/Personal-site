const lenis = new Lenis({ duration: 0.9, smoothWheel: true, autoRaf: false });
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') {
      e.preventDefault();
      return;
    }

    const target = document.querySelector(href);
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

const videos = document.querySelectorAll('.js-video');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const video = entry.target;
    if (entry.isIntersecting) {
      video.play();
    } else {
      video.pause();
    }
  });
}, { threshold: 0.25 });

if (prefersReducedMotion) {
  videos.forEach((video) => {
    video.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  });
} else {
  videos.forEach((video) => {
    observer.observe(video);
  });
}

const progressBar = document.querySelector('.progress-bar');
const progressBarFill = document.querySelector('.progress-bar__fill');
const startingDate = document.querySelector('.timeline').getAttribute('data-start');
const endingDate = document.querySelector('.timeline').getAttribute('data-end');
const progress = Math.min(Math.max((new Date() - new Date(startingDate)) / (new Date(endingDate) - new Date(startingDate)) * 100, 0), 100);

document.querySelector('.timeline__year').textContent = `${Math.min(Math.floor(progress / 100 * 4) + 1, 4)}`;
document.querySelector('.timeline__percent').textContent = `${Math.round(progress)}`;
progressBar.setAttribute('aria-valuenow', `${Math.round(progress)}`);

if (prefersReducedMotion) {
  progressBarFill.style.width = `${progress}%`;
} else {
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        progressBarFill.style.width = `${progress}%`;
        progressObserver.disconnect();
      }
    });
  }, { threshold: 0.25 });
 
  progressObserver.observe(progressBar);
}

