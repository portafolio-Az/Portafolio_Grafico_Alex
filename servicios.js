/* ══════════════════════════════════════════════
   SERVICIOS.JS — Roberto Azcorra
   ══════════════════════════════════════════════ */

/* ── PRELOADER ──────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('hidden');
    // Animar elementos del hero después del preloader
    document.querySelectorAll('.srv-hero .reveal-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 100 + i * 100);
    });
  }, 2000);
});

/* ── NAVBAR ─────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

// Backdrop para cerrar menú al tocar fuera
const navBackdrop = document.createElement('div');
navBackdrop.id = 'nav-backdrop';
document.body.appendChild(navBackdrop);

// Scroll: cambiar estilos del navbar
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  toggleBackToTop();
}, { passive: true });

// Hamburger
hamburger.addEventListener('click', e => {
  e.stopPropagation();
  toggleMenu();
});

function toggleMenu() {
  const open = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  navBackdrop.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function closeMenu() {
  navMenu.classList.remove('open');
  hamburger.classList.remove('open');
  navBackdrop.classList.remove('active');
  document.body.style.overflow = '';
}

navBackdrop.addEventListener('click', closeMenu);
navMenu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeMenu));

/* ── SMOOTH SCROLL ──────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    }
  });
});

/* ── BACK TO TOP ────────────────────────────── */
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  backToTopBtn?.classList.toggle('visible', window.scrollY > 400);
}

backToTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ══════════════════════════════════════════════
   SCROLL REVEAL — Elementos generales
   ══════════════════════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Observar elementos reveal del hero y secciones
document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

/* ══════════════════════════════════════════════
   PLAN CARDS — Scroll reveal con stagger
   ══════════════════════════════════════════════ */
const cardObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const grid = entry.target;
      const cards = grid.querySelectorAll('.plan-card');
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.classList.add('visible');
        }, i * 90);
      });
      cardObs.unobserve(grid);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.plans-grid').forEach(g => cardObs.observe(g));

/* ══════════════════════════════════════════════
   BROCHURE CARD — Scroll reveal
   ══════════════════════════════════════════════ */
const brochureObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      brochureObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.brochure-card').forEach(c => brochureObs.observe(c));

/* ══════════════════════════════════════════════
   HOVER: EFECTO DE BRILLO EN PLAN CARDS
   ══════════════════════════════════════════════ */
document.querySelectorAll('.plan-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const x     = ((e.clientX - rect.left) / rect.width)  * 100;
    const y     = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
    card.style.backgroundImage = `
      radial-gradient(circle at var(--mx, 50%) var(--my, 50%),
        rgba(201,149,42,0.06) 0%, transparent 65%),
      ${card.classList.contains('plan-dark') ? '#1c1c1c' : '#ffffff'}
    `;
  });
  card.addEventListener('mouseleave', () => {
    if (card.classList.contains('plan-dark')) {
      card.style.backgroundImage = '';
    } else if (card.classList.contains('plan-featured')) {
      card.style.backgroundImage = 'linear-gradient(160deg, rgba(201,149,42,0.04) 0%, #ffffff 100%)';
    } else {
      card.style.backgroundImage = '';
    }
  });
});

/* ══════════════════════════════════════════════
   PILLS DEL HERO — Efecto activo al hacer scroll
   ══════════════════════════════════════════════ */
const pills = document.querySelectorAll('.pill');
const sectionsMap = {
  '#freelancer':   document.getElementById('freelancer'),
  '#remoto':       document.getElementById('remoto'),
  '#logos':        document.getElementById('logos'),
  '#tarjetas':     document.getElementById('tarjetas'),
  '#brochures':    document.getElementById('brochures'),
  '#invitaciones': document.getElementById('invitaciones'),
};

window.addEventListener('scroll', () => {
  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
  const scrollY = window.scrollY + navH + 40;

  let activePill = null;
  for (const [href, sec] of Object.entries(sectionsMap)) {
    if (!sec) continue;
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      activePill = href;
    }
  }

  pills.forEach(pill => {
    const href = pill.getAttribute('href');
    pill.classList.toggle('pill-active', href === activePill);
  });
}, { passive: true });

/* ══════════════════════════════════════════════
   PLAN CARD — Feedback visual al click en botón
   ══════════════════════════════════════════════ */
document.querySelectorAll('.plan-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const original = this.textContent;
    this.textContent = '✓ Redirigiendo...';
    this.style.pointerEvents = 'none';
    setTimeout(() => {
      this.textContent = original;
      this.style.pointerEvents = '';
    }, 2500);
  });
});

/* ══════════════════════════════════════════════
   NÚMEROS ANIMADOS EN LOS PRECIOS (counter up)
   ══════════════════════════════════════════════ */
function parsePrice(str) {
  return parseInt(str.replace(/[^0-9]/g, ''), 10) || 0;
}

function formatPrice(num, originalStr) {
  if (num >= 1000) return '$' + num.toLocaleString('es-MX');
  return '$' + num;
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parsePrice(el.dataset.target);
    const start = Date.now();
    const duration = 900;

    function update() {
      const elapsed  = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = formatPrice(current, el.dataset.target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.plan-amount').forEach(el => {
  el.dataset.target = el.textContent;
  counterObs.observe(el);
});