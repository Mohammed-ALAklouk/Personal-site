document.addEventListener('mousemove', (e) => {
    const mx = e.clientX;
    const my = e.clientY;
    document.documentElement.style.setProperty('--mx', `${mx}px`);
    document.documentElement.style.setProperty('--my', `${my}px`);
});
