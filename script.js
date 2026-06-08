document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavScroll();
  initScrollReveal();
  initMobileMenu();
});

function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const bar     = preloader.querySelector('.pre-bar');
  const pct     = preloader.querySelector('.pre-pct');
  const pline1  = document.getElementById('pline1');
  const pline2  = document.getElementById('pline2');
  const pline3  = document.getElementById('pline3');
  const cursor  = preloader.querySelector('.pre-cursor');
  const preTop  = preloader.querySelector('.pre-top');
  const preBtm  = preloader.querySelector('.pre-bottom');

  const LINES = [
    'Not another portfolio.',
    'Actually ships.',
    'Let\'s go.',
  ];

  let progress = 0;
  let linesDone = 0;

  function typeLine(el, text, speed, cb) {
    let i = 0;
    el.textContent = '';
    const iv = setInterval(() => {
      el.textContent += text[i++];
      if (i >= text.length) { clearInterval(iv); if (cb) cb(); }
    }, speed);
  }

  function advanceBar(to, cb) {
    const step = () => {
      progress = Math.min(progress + 1, to);
      bar.style.width = progress + '%';
      pct.textContent = progress + '%';
      if (progress < to) requestAnimationFrame(step);
      else if (cb) cb();
    };
    requestAnimationFrame(step);
  }

  const lineEls = [pline1, pline2, pline3];
  const speeds  = [38, 32, 28];

  function runLines(idx) {
    if (idx >= lineEls.length) {
      advanceBar(100, () => {
        cursor.style.animation = 'none';
        cursor.style.opacity   = '0';
        setTimeout(splitReveal, 200);
      });
      return;
    }
    const target = Math.round(((idx + 1) / lineEls.length) * 90);
    typeLine(lineEls[idx], LINES[idx], speeds[idx], () => {
      advanceBar(target, () => setTimeout(() => runLines(idx + 1), 140));
    });
  }

  function splitReveal() {
    document.body.classList.remove('is-loading');
    gsap.to(preTop,  { yPercent: -100, duration: 0.85, ease: 'power3.inOut' });
    gsap.to(preBtm,  { yPercent:  100, duration: 0.85, ease: 'power3.inOut',
      onComplete: () => preloader.remove()
    });
    gsap.to('.pre-center', { opacity: 0, duration: 0.3, ease: 'power2.in' });
  }

  gsap.from('.pre-logo', {
    opacity: 0, y: 18, duration: 0.7, ease: 'power3.out',
    onComplete: () => setTimeout(() => runLines(0), 300)
  });
}

function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

function initMobileMenu() {
  const hamburger = document.getElementById('navHamburger');
  const menu = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('mobileMenuClose');
  if (!hamburger || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => observer.observe(el));
}
