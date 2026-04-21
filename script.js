/* ══════════════════════════════════════════════
   SCRIPT.JS — Roberto Azcorra Portfolio
   ══════════════════════════════════════════════ */

/* ── PRELOADER ──────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('hidden');
    // Animar elementos del hero después del preloader
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 100 + i * 130);
    });
  }, 2000);
});

/* ══════════════════════════════════════════════
   NAVBAR
   ══════════════════════════════════════════════ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

// Crear backdrop para cerrar menú al hacer clic fuera
const navBackdrop = document.createElement('div');
navBackdrop.id = 'nav-backdrop';
document.body.appendChild(navBackdrop);

/* Scroll: cambiar navbar entre blanco y oscuro */
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  highlightActiveLink();
  toggleBackToTop();
}, { passive: true });

/* Marcar link activo según sección visible */
function highlightActiveLink() {
  const scrollY = window.scrollY + parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '68') + 20;
  document.querySelectorAll('section[id]').forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight);
  });
}

/* Hamburger — abrir/cerrar menú móvil */
hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMobileMenu();
});

function toggleMobileMenu() {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  navBackdrop.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobileMenu() {
  navMenu.classList.remove('open');
  hamburger.classList.remove('open');
  navBackdrop.classList.remove('active');
  document.body.style.overflow = '';
}

/* Cerrar al hacer clic en el backdrop */
navBackdrop.addEventListener('click', closeMobileMenu);

/* Cerrar al hacer clic en cualquier enlace del menú */
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

/* ── SMOOTH SCROLL ─────────────────────────── */
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

/* ══════════════════════════════════════════════
   TYPEWRITER
   ══════════════════════════════════════════════ */
const phrases = [
  'Creatividad, tecnología y seguridad para soluciones digitales completas.',
  'Diseño gráfico que transforma marcas en experiencias memorables.',
  'Desarrollo web moderno que impulsa tu presencia digital al siguiente nivel.'
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function typeLoop() {
  if (!typeEl) return;
  const cur = phrases[phraseIdx];
  typeEl.textContent = deleting ? cur.substring(0, --charIdx) : cur.substring(0, ++charIdx);
  let delay = deleting ? 32 : 52;
  if (!deleting && charIdx === cur.length) { delay = 2400; deleting = true; }
  else if (deleting && charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 350; }
  setTimeout(typeLoop, delay);
}
setTimeout(typeLoop, 2300);

/* ══════════════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════════════ */
let skillsAnimated = false;

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    if (!skillsAnimated && (entry.target.classList.contains('skills-col') || entry.target.closest('.skills-section'))) {
      skillsAnimated = true;
      animateSkillBars();
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Observar todos los elementos de reveal EXCEPTO los del hero (esos se manejan por el preloader)
document.querySelectorAll('.reveal-up:not(.hero *), .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

/* Barras de habilidades */
function animateSkillBars() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const w = bar.getAttribute('data-width');
    requestAnimationFrame(() => setTimeout(() => { bar.style.width = w + '%'; }, 80));
  });
}

/* ══════════════════════════════════════════════
   PORTAFOLIO — FILTRO CON TRANSICIÓN SUAVE
   ══════════════════════════════════════════════ */
const filterBtns = document.querySelectorAll('.filter-btn');
const pfItems    = Array.from(document.querySelectorAll('.pf-item'));

// Inicializar: todos visibles
pfItems.forEach(item => item.style.display = '');
let isFiltering = false;

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    if (isFiltering) return;
    const filter = btn.dataset.filter;

    // Actualizar botón activo
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const toShow = pfItems.filter(item => filter === 'all' || item.dataset.category === filter);
    const toHide = pfItems.filter(item => filter !== 'all' && item.dataset.category !== filter);

    isFiltering = true;

    // FASE 1: marcar ítems a ocultar → CSS los desvanece
    toHide.forEach(item => item.classList.add('pf-exiting'));

    // FASE 2: después de la transición, ocultarlos y mostrar los nuevos
    setTimeout(() => {
      // Ocultar los que salen
      toHide.forEach(item => {
        item.classList.remove('pf-exiting');
        item.classList.add('pf-hidden');
        item.style.pointerEvents = 'none';
      });

      // Preparar los que entran: estado inicial (invisible + desplazado)
      toShow.forEach(item => {
        item.classList.remove('pf-hidden');
        item.style.pointerEvents = 'auto';
        // Si no era visible, aplicar estado "entering"
        if (!item.classList.contains('pf-entering')) {
          item.classList.add('pf-entering');
        }
      });

      // Forzar reflow para que el estado inicial se pinte antes de la transición
      void document.getElementById('portfolioGrid').offsetHeight;

      // FASE 3: animar entrada con stagger
      toShow.forEach((item, i) => {
        setTimeout(() => {
          item.classList.remove('pf-entering');
        }, i * 55);
      });

      // Liberar el flag al terminar
      setTimeout(() => { isFiltering = false; }, toShow.length * 55 + 400);

    }, 380); // Duración de la fase de salida
  });
});

/* ══════════════════════════════════════════════
   PORTAFOLIO — MODAL + GALERÍA
   ══════════════════════════════════════════════ */
const modal         = document.getElementById('portfolioModal');
const modalClose    = document.getElementById('modalClose');
const modalTitle    = document.getElementById('modalTitle');
const modalCatTag   = document.getElementById('modalCatTag');
const modalDesc     = document.getElementById('modalDesc');
const galleryMain   = document.getElementById('galleryMain');
const galleryThumbs = document.getElementById('galleryThumbs');
const galleryCounter= document.getElementById('galleryCounter');
const galleryPrev   = document.getElementById('galleryPrev');
const galleryNext   = document.getElementById('galleryNext');

let currentImages  = [];
let currentImgIdx  = 0;

function openModal(item) {
  const title = item.dataset.title || '';
  const cat   = item.dataset.cat   || '';
  const desc  = item.dataset.desc  || '';
  let images  = [];
  try { images = JSON.parse(item.dataset.images || '[]'); } catch(e) {}

  modalTitle.textContent  = title;
  modalCatTag.textContent = cat;
  modalDesc.textContent   = desc;
  currentImages  = images;
  currentImgIdx  = 0;

  renderGallery();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderGallery() {
  const bg = currentImages[currentImgIdx] || 'linear-gradient(135deg,#2a2a2a,#555)';
  galleryMain.style.background = bg;
  galleryCounter.textContent   = `${currentImgIdx + 1} / ${currentImages.length}`;

  galleryThumbs.innerHTML = '';
  currentImages.forEach((img, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'gal-thumb' + (i === currentImgIdx ? ' active' : '');
    thumb.style.background = img;
    thumb.addEventListener('click', () => { currentImgIdx = i; renderGallery(); });
    galleryThumbs.appendChild(thumb);
  });
}

galleryPrev.addEventListener('click', () => { currentImgIdx = (currentImgIdx - 1 + currentImages.length) % currentImages.length; renderGallery(); });
galleryNext.addEventListener('click', () => { currentImgIdx = (currentImgIdx + 1) % currentImages.length; renderGallery(); });

// Swipe táctil en galería
let touchStartX = 0;
galleryMain.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
galleryMain.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 40) {
    currentImgIdx = diff > 0
      ? (currentImgIdx + 1) % currentImages.length
      : (currentImgIdx - 1 + currentImages.length) % currentImages.length;
    renderGallery();
  }
});

// Teclado en galería
document.addEventListener('keydown', e => {
  if (!modal.classList.contains('open')) return;
  if (e.key === 'Escape')     closeModal();
  if (e.key === 'ArrowLeft')  { currentImgIdx = (currentImgIdx - 1 + currentImages.length) % currentImages.length; renderGallery(); }
  if (e.key === 'ArrowRight') { currentImgIdx = (currentImgIdx + 1) % currentImages.length; renderGallery(); }
});

// Abrir modal desde cada ítem
pfItems.forEach(item => {
  const openBtn = item.querySelector('.pf-open');
  if (openBtn) openBtn.addEventListener('click', e => { e.stopPropagation(); openModal(item); });
  item.addEventListener('click', () => openModal(item));
});

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.getElementById('modalCta')?.addEventListener('click', () => { closeModal(); });

/* ══════════════════════════════════════════════
   TABS DE TRAYECTORIA
   ══════════════════════════════════════════════ */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const id = btn.dataset.tab;
    document.querySelectorAll('.timeline').forEach(t => t.classList.add('hidden'));
    const target = document.getElementById(`tab-${id}`);
    if (target) {
      target.classList.remove('hidden');
      target.querySelectorAll('.reveal-left, .reveal-right').forEach((el, i) => {
        el.classList.remove('visible');
        setTimeout(() => el.classList.add('visible'), i * 90);
      });
    }
  });
});

/* ══════════════════════════════════════════════
   FORMULARIO DE CONTACTO
   ══════════════════════════════════════════════ */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  const btnSpan = contactForm.querySelector('button[type=submit] span');
  if (btnSpan) btnSpan.textContent = 'Enviando…';
  setTimeout(() => {
    contactForm.reset();
    formSuccess.classList.remove('hidden');
    if (btnSpan) btnSpan.textContent = 'Enviar mensaje';
    setTimeout(() => formSuccess.classList.add('hidden'), 6000);
  }, 1100);
});

/* ══════════════════════════════════════════════
   VOLVER ARRIBA
   ══════════════════════════════════════════════ */
const backToTopBtn = document.getElementById('backToTop');
function toggleBackToTop() { backToTopBtn?.classList.toggle('visible', window.scrollY > 450); }
backToTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ══════════════════════════════════════════════
   PORTAFOLIO — ANIMACIÓN DE ENTRADA EN SCROLL
   ══════════════════════════════════════════════ */
const pfScrollObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.remove('pf-entering');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
      }, i * 70);
      pfScrollObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

pfItems.forEach((item, i) => {
  // Estado inicial para animación de entrada
  item.style.opacity    = '0';
  item.style.transform  = 'translateY(28px) scale(0.97)';
  item.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.35s ease';
  pfScrollObs.observe(item);
});

/* ══════════════════════════════════════════════
   FOTOS SOBRE MÍ — TILT 3D AL HOVER
   ══════════════════════════════════════════════ */
document.querySelectorAll('.aph-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r   = card.getBoundingClientRect();
    const rx  = ((e.clientY - r.top  - r.height / 2) / r.height) * 12;
    const ry  = -((e.clientX - r.left - r.width  / 2) / r.width)  * 12;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px) scale(1.04)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = ''; // devolver a la rotación definida en CSS
  });
});

/* ══════════════════════════════════════════════
   HERO — STATS EN MÓVIL: REORDENAR BAJO EL CÍRCULO
   ══════════════════════════════════════════════ */
function setupHeroStats() {
  const heroImage = document.querySelector('.hero-image');
  if (!heroImage) return;

  const s1 = document.querySelector('.hero-stat-1');
  const s2 = document.querySelector('.hero-stat-2');
  let statsRow = document.querySelector('.hero-stats-row');

  if (window.innerWidth <= 768) {
    if (!statsRow) {
      statsRow = document.createElement('div');
      statsRow.className = 'hero-stats-row';
      heroImage.appendChild(statsRow);
    }
    if (s1 && !statsRow.contains(s1)) statsRow.appendChild(s1);
    if (s2 && !statsRow.contains(s2)) statsRow.appendChild(s2);
  } else {
    // En desktop: devolver al hero-image directamente
    if (s1 && heroImage && !heroImage.contains(s1)) heroImage.appendChild(s1);
    if (s2 && heroImage && !heroImage.contains(s2)) heroImage.appendChild(s2);
    if (statsRow) statsRow.remove();
  }
}

setupHeroStats();
window.addEventListener('resize', setupHeroStats, { passive: true });