/* ─────────────────────────────────────────────
   SCRIPT.JS — Roberto Azcorra Portfolio
───────────────────────────────────────────── */

/* ── PRELOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      // Trigger hero animations after preloader
      document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 120);
      });
    }
  }, 1900);
});


/* ── NAVBAR: scroll behavior & active link ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  highlightNavLink();
  toggleBackToTop();
});

function highlightNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < bottom) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}


/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});


/* ── TYPEWRITER EFFECT ── */
const phrases = [
  'Creatividad, tecnología y seguridad para soluciones digitales completas.',
  'Diseño gráfico que transforma marcas en experiencias memorables.',
  'Desarrollo web moderno que impulsa tu presencia digital al siguiente nivel.'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterEl = document.getElementById('typewriter');

function type() {
  if (!typewriterEl) return;
  const current = phrases[phraseIndex];

  if (isDeleting) {
    typewriterEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typewriterEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 35 : 55;

  if (!isDeleting && charIndex === current.length) {
    delay = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  setTimeout(type, delay);
}

// Start typewriter after preloader
setTimeout(type, 2200);


/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate skill bars when about section comes into view
      if (entry.target.classList.contains('about-skills') || entry.target.closest('.about-skills')) {
        animateSkillBars();
      }
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

// Observe all reveal elements (except hero which is handled by preloader)
document.querySelectorAll('.reveal-up:not(.hero *), .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// Also observe about-skills specifically for skill bars
const aboutSkills = document.querySelector('.about-skills');
if (aboutSkills) revealObserver.observe(aboutSkills);


/* ── SKILL BARS ANIMATION ── */
let skillsAnimated = false;
function animateSkillBars() {
  if (skillsAnimated) return;
  skillsAnimated = true;
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const target = bar.getAttribute('data-width');
    setTimeout(() => {
      bar.style.width = target + '%';
    }, 100);
  });
}


/* ── PORTFOLIO FILTER ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    portfolioItems.forEach(item => {
      const category = item.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
        item.style.pointerEvents = 'auto';
        item.style.position = 'relative';
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.85)';
        item.style.pointerEvents = 'none';
        item.style.position = 'absolute';
      }
    });
  });
});


/* ── PORTFOLIO MODAL ── */
const modal = document.getElementById('portfolioModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalColorBar = document.getElementById('modalColorBar');
const modalClose = document.getElementById('modalClose');

portfolioItems.forEach(item => {
  const openBtn = item.querySelector('.portfolio-open-btn');
  if (openBtn) {
    openBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(item);
    });
  }
  item.addEventListener('click', () => openModal(item));
});

function openModal(item) {
  const title = item.getAttribute('data-title') || '';
  const desc = item.getAttribute('data-desc') || '';
  const color = item.getAttribute('data-color') || '#c9952a';

  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  modalColorBar.style.background = `linear-gradient(90deg, ${color}, var(--mustard))`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});


/* ── TIMELINE TABS ── */
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const tabId = btn.getAttribute('data-tab');
    document.querySelectorAll('.timeline').forEach(t => t.classList.add('hidden'));

    const target = document.getElementById(`tab-${tabId}`);
    if (target) {
      target.classList.remove('hidden');
      // Re-trigger reveal animations for newly shown items
      target.querySelectorAll('.reveal-left, .reveal-right').forEach((el, i) => {
        el.classList.remove('visible');
        setTimeout(() => el.classList.add('visible'), i * 100);
      });
    }
  });
});

// Trigger initial timeline items
setTimeout(() => {
  document.querySelectorAll('#tab-experiencia .reveal-left, #tab-experiencia .reveal-right').forEach((el, i) => {
    revealObserver.observe(el);
  });
}, 100);


/* ── CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"] span');
    if (btn) btn.textContent = 'Enviando...';

    // Simulate sending (replace with actual endpoint)
    setTimeout(() => {
      contactForm.reset();
      formSuccess.classList.remove('hidden');
      if (btn) btn.textContent = 'Enviar mensaje';
      setTimeout(() => formSuccess.classList.add('hidden'), 5000);
    }, 1200);
  });
}


/* ── BACK TO TOP ── */
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ── SMOOTH SCROLL for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ── PORTFOLIO GRID: animate on scroll ── */
const portfolioObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
      }, i * 80);
    }
  });
}, { threshold: 0.1 });

portfolioItems.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(30px) scale(0.96)';
  item.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.35s ease';
  portfolioObserver.observe(item);
});
