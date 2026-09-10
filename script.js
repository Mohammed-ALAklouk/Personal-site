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
