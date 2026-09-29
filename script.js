const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let lenis = null;
let animate = false;
const hasLenis = typeof Lenis !== 'undefined';
const hasGsap = typeof gsap !== 'undefined';
const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';

if (hasLenis && !prefersReducedMotion) {
  lenis = new Lenis({ duration: 0.9, smoothWheel: true });

  if (!hasGsap) {
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }
}

if (hasGsap && !prefersReducedMotion) {
  if (hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    animate = true;
    document.documentElement.classList.add('js-anim');
    
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
    }
  }

  if (lenis) {
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}

if (animate) {
  ScrollTrigger.batch("[data-reveal]", {
    start: "top 88%",
    once: true,
    onEnter: (els) =>
      gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.08, overwrite: true }),
  });
}


document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    if (!lenis) return;
    let href = link.getAttribute('href');
    if (href === '#') href = '#top';

    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

/*
  == Grid background mouse position ==

  Only enable the effect on devices that support hover (desktop devices)
  Mouse position is only updated a maximum of once per frame
*/
if (matchMedia('(hover: hover)').matches) {
  const below = document.querySelector('.below');
  let clientX = 0, clientY = 0, mouseUpdateQueued = false;

  // Calculate the mouse position relative to the .below element and update CSS variables
  const updateMousePosition = () => {
    const boundingRect = below.getBoundingClientRect(); 
    const mx = clientX - boundingRect.left;
    const my = clientY - boundingRect.top;

    below.style.setProperty('--mx', `${mx}px`);
    below.style.setProperty('--my', `${my}px`);
    mouseUpdateQueued = false;
  };

  const queueMouseUpdate = () => {
    if (mouseUpdateQueued) return;
    
    mouseUpdateQueued = true;
    requestAnimationFrame(updateMousePosition);
  };

  below.addEventListener('pointerenter', () => {
    below.classList.add('is-lit');
  });

  below.addEventListener('pointerleave', () => {
    below.classList.remove('is-lit');
  });

  // Queue a mouse position update on pointermove 
  below.addEventListener('pointermove', (e) => {
    clientX = e.clientX;
    clientY = e.clientY;
    queueMouseUpdate();
  });

  // Queue a mouse position update on scroll only if the .below element is lit
  document.addEventListener('scroll', () => {
    if (!below.classList.contains('is-lit')) return; 
    queueMouseUpdate();
  });
}

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

const copyButtons = document.querySelectorAll('.js-copy');
let timerID = null;

copyButtons.forEach((btn) => {
  btn.addEventListener('click', async () => {
    const text = btn.getAttribute('data-copy');
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied!';    
    } catch (err) {
      console.error('Failed to copy text: ', err);
      btn.textContent = 'Select & copy';
    }

    clearTimeout(timerID);
    timerID = setTimeout(() => {
      btn.textContent = 'Copy';
    }, 2000);
  });
});

const footerYear = document.querySelector('.js-footer-year');
const currentYear = new Date().getFullYear();
footerYear.textContent = currentYear;
