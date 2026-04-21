/* ══════════════════════════════════════════
   SCRIPT.JS — Roberto Azcorra Portfolio
   ══════════════════════════════════════════ */

/* ── PRELOADER ──────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('hidden');
    // Trigger hero reveal after preloader
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 100 + i * 130);
    });
  }, 2000);
});

/* ── NAVBAR ─────────────────────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  setActiveNavLink();
  toggleBackToTop();
});

function setActiveNavLink() {
  const scrollY = window.scrollY + 90;
  document.querySelectorAll('section[id]').forEach(sec => {
    const top = sec.offsetTop;
    const bot = top + sec.offsetHeight;
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bot);
  });
}

// Hamburger
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── SMOOTH SCROLL ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    }
  });
});

/* ── TYPEWRITER ─────────────────────────── */
const phrases = [
  'Creatividad, tecnología y seguridad para soluciones digitales completas.',
  'Diseño gráfico que transforma marcas en experiencias memorables.',
  'Desarrollo web moderno que impulsa tu presencia digital al siguiente nivel.'
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function type() {
  if (!typeEl) return;
  const cur = phrases[phraseIdx];
  typeEl.textContent = deleting ? cur.substring(0, --charIdx) : cur.substring(0, ++charIdx);
  let delay = deleting ? 32 : 52;
  if (!deleting && charIdx === cur.length) { delay = 2400; deleting = true; }
  else if (deleting && charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 350; }
  setTimeout(type, delay);
}
setTimeout(type, 2300); // Start after preloader

/* ── SCROLL REVEAL ──────────────────────── */
let skillsAnimated = false;

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    // Animate skill bars when the skills section enters view
    if (entry.target.closest('.skills-section') || entry.target.classList.contains('skills-col')) {
      if (!skillsAnimated) { skillsAnimated = true; animateSkillBars(); }
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal-up:not(.hero *), .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

/* ── SKILL BARS ─────────────────────────── */
function animateSkillBars() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const w = bar.getAttribute('data-width');
    requestAnimationFrame(() => setTimeout(() => { bar.style.width = w + '%'; }, 80));
  });
}

/* ── PORTFOLIO FILTER ───────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const pfItems = document.querySelectorAll('.pf-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.getAttribute('data-filter');

    pfItems.forEach(item => {
      const show = f === 'all' || item.dataset.category === f;
      item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      if (show) {
        item.style.opacity = '1';
        item.style.transform = 'scale(1) translateY(0)';
        item.style.pointerEvents = 'auto';
        item.style.position = '';
        item.style.visibility = '';
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.88)';
        item.style.pointerEvents = 'none';
      }
    });
  });
});

/* ── PORTFOLIO MODAL + GALLERY ───────────── */
const modal = document.getElementById('portfolioModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalCatTag = document.getElementById('modalCatTag');
const modalDesc = document.getElementById('modalDesc');
const galleryMain = document.getElementById('galleryMain');
const galleryThumbs = document.getElementById('galleryThumbs');
const galleryCounter = document.getElementById('galleryCounter');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');

let currentImages = [];
let currentImgIdx = 0;

function openModal(item) {
  const title = item.dataset.title || '';
  const cat = item.dataset.cat || '';
  const desc = item.dataset.desc || '';
  let images = [];
  try { images = JSON.parse(item.dataset.images || '[]'); } catch(e) { images = []; }

  modalTitle.textContent = title;
  modalCatTag.textContent = cat;
  modalDesc.textContent = desc;
  currentImages = images;
  currentImgIdx = 0;

  renderGallery();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderGallery() {
  // Main image
  const bg = currentImages[currentImgIdx] || 'linear-gradient(135deg,#1c1c1c,#555)';
  galleryMain.style.background = bg;
  galleryCounter.textContent = `${currentImgIdx + 1} / ${currentImages.length}`;

  // Thumbnails
  galleryThumbs.innerHTML = '';
  currentImages.forEach((img, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'gal-thumb' + (i === currentImgIdx ? ' active' : '');
    thumb.style.background = img;
    thumb.setAttribute('aria-label', `Imagen ${i + 1}`);
    thumb.addEventListener('click', () => { currentImgIdx = i; renderGallery(); });
    galleryThumbs.appendChild(thumb);
  });
}

galleryPrev.addEventListener('click', () => {
  currentImgIdx = (currentImgIdx - 1 + currentImages.length) % currentImages.length;
  renderGallery();
});
galleryNext.addEventListener('click', () => {
  currentImgIdx = (currentImgIdx + 1) % currentImages.length;
  renderGallery();
});

// Keyboard navigation in gallery
document.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('open')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') { currentImgIdx = (currentImgIdx - 1 + currentImages.length) % currentImages.length; renderGallery(); }
  if (e.key === 'ArrowRight') { currentImgIdx = (currentImgIdx + 1) % currentImages.length; renderGallery(); }
});

// Touch swipe on gallery
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

// Open triggers
pfItems.forEach(item => {
  const openBtn = item.querySelector('.pf-open');
  if (openBtn) {
    openBtn.addEventListener('click', (e) => { e.stopPropagation(); openModal(item); });
  }
  item.addEventListener('click', () => openModal(item));
});

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

// Close modal when CTA is clicked and scroll to contact
document.getElementById('modalCta')?.addEventListener('click', () => { closeModal(); });

/* ── TIMELINE TABS ──────────────────────── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const id = btn.getAttribute('data-tab');
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

/* ── CONTACT FORM ───────────────────────── */
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

/* ── BACK TO TOP ────────────────────────── */
const backToTop = document.getElementById('backToTop');
function toggleBackToTop() { backToTop?.classList.toggle('visible', window.scrollY > 450); }
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── PORTFOLIO GRID — STAGGERED ENTRANCE ── */
const pfObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
      }, i * 70);
      pfObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

pfItems.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(28px) scale(0.97)';
  item.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.35s ease';
  pfObs.observe(item);
});

/* ── ABOUT PHOTOS — Hover 3D tilt ──────── */
document.querySelectorAll('.aph-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / rect.height) * 10;
    const ry = -((e.clientX - cx) / rect.width) * 10;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px) scale(1.03)`;
  });
  card.addEventListener('mouseleave', () => {
    // Reset to default rotation
    const idx = Array.from(card.parentElement.children).indexOf(card);
    const rotations = ['-3deg', '0deg', '3deg'];
    const ys = ['10px', '0', '10px'];
    card.style.transform = `rotate(${rotations[idx]}) translateY(${ys[idx]})`;
    setTimeout(() => { card.style.transform = ''; }, 50);
  });
});

/* ── HERO MOBILE: Rearrange stats ──────── */
function adjustHeroStats() {
  const heroImage = document.querySelector('.hero-image');
  const ring = document.querySelector('.hero-ring-outer');
  let statsRow = document.querySelector('.hero-stats-row');

  if (window.innerWidth <= 768) {
    if (!statsRow) {
      statsRow = document.createElement('div');
      statsRow.className = 'hero-stats-row';
      const s1 = document.querySelector('.hero-stat-1');
      const s2 = document.querySelector('.hero-stat-2');
      if (s1 && s2 && heroImage) {
        // Move stats to a row below the ring
        heroImage.appendChild(statsRow);
        statsRow.appendChild(s1);
        statsRow.appendChild(s2);
      }
    }
  } else {
    // On desktop: put stats back as positioned elements
    const s1 = document.querySelector('.hero-stat-1');
    const s2 = document.querySelector('.hero-stat-2');
    const ring = document.querySelector('.hero-ring-outer');
    if (s1 && s2 && ring) {
      ring.parentElement.appendChild(s1);
      ring.parentElement.appendChild(s2);
      const row = document.querySelector('.hero-stats-row');
      if (row) row.remove();
    }
  }
}

adjustHeroStats();
window.addEventListener('resize', adjustHeroStats);