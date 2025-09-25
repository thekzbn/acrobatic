
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function toggleTheme() {
    const currentTheme = body.classList.contains('theme-dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if (newTheme === 'dark') {
        body.classList.add('theme-dark');
    } else {
        body.classList.remove('theme-dark');
    }

    localStorage.setItem('theme', newTheme);

    const icon = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
    themeToggle.querySelector('.material-symbols-rounded').textContent = icon;
}

const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    body.classList.add('theme-dark');
}
const icon = savedTheme === 'dark' ? 'light_mode' : 'dark_mode';
themeToggle.querySelector('.material-symbols-rounded').textContent = icon;

themeToggle.addEventListener('click', toggleTheme);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = body.classList.contains('theme-dark')
            ? 'rgba(15, 15, 35, 0.95)'
            : 'rgba(250, 251, 252, 0.95)';
    } else {
        header.style.background = body.classList.contains('theme-dark')
            ? 'rgba(15, 15, 35, 0.8)'
            : 'rgba(250, 251, 252, 0.8)';
    }
});
(function () { function c() { var b = a.contentDocument || a.contentWindow.document; if (b) { var d = b.createElement('script'); d.innerHTML = "window.__CF$cv$params={r:'984ab317d6a5789f',t:'MTc1ODgwNTE3NS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);"; b.getElementsByTagName('head')[0].appendChild(d) } } if (document.body) { var a = document.createElement('iframe'); a.height = 1; a.width = 1; a.style.position = 'absolute'; a.style.top = 0; a.style.left = 0; a.style.border = 'none'; a.style.visibility = 'hidden'; document.body.appendChild(a); if ('loading' !== document.readyState) c(); else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c); else { var e = document.onreadystatechange || function () { }; document.onreadystatechange = function (b) { e(b); 'loading' !== document.readyState && (document.onreadystatechange = e, c()) } } } })();