/* ============================================
   BARBERSHOP PREMIUM — MAIN JAVASCRIPT
   ============================================ */

'use strict';

// ── NAVBAR SCROLL BEHAVIOR ──────────────────
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load
})();

// ── ACTIVE NAV LINK ─────────────────────────
(function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-links a, .mobile-menu a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ── MOBILE HAMBURGER MENU ───────────────────
(function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    if (isOpen) {
      mobileMenu.classList.add('visible');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('visible');
      document.body.style.overflow = '';
    }
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('visible');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('visible');
      document.body.style.overflow = '';
    }
  });
})();

// ── SCROLL REVEAL ANIMATION ─────────────────
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once visible, stop observing
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

// ── GALLERY FILTER ──────────────────────────
(function initGalleryFilter() {
  const filters = document.querySelectorAll('.gallery-filter');
  const items = document.querySelectorAll('.gallery-item');
  if (!filters.length || !items.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filters.forEach(f => f.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.filter;

      items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'block';
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
})();

// ── LIGHTBOX ────────────────────────────────
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!lightbox) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
})();

// ── CONTACT FORM (Web3Forms) ─────────────────
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>שולח...</span>';
    btn.disabled = true;

    const formData = new FormData(form);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        form.style.display = 'none';
        const success = document.getElementById('formSuccess');
        if (success) success.classList.add('show');
      } else {
        throw new Error('שגיאה בשליחה');
      }
    } catch (err) {
      btn.innerHTML = originalText;
      btn.disabled = false;
      alert('אירעה שגיאה בשליחת הטופס. אנא נסה שוב.');
    }
  });
})();

// ── NUMBER COUNTER ANIMATION ────────────────
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCount = (el, target, duration = 1800) => {
    let start = 0;
    const startTime = performance.now();
    const isPlus = el.dataset.count.includes('+');

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString('he-IL') + (isPlus ? '+' : '');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.dataset.count.replace('+', '');
        animateCount(el, parseInt(raw, 10));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ── SMOOTH ANCHOR SCROLL ────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── HERO VIDEO ──────────────────────────────
(function initHeroVideo() {
  const video = document.querySelector('.hero-video-wrapper video');
  if (!video) return;
  video.play().catch(() => {
    // Autoplay blocked — fine, video is decorative
  });
})();

// ── PAGE TRANSITION (subtle fade) ───────────
(function initPageTransition() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

  // Fade out on navigation
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Only for local .html page links
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('tel') || href.startsWith('mailto') || href.startsWith('whatsapp')) return;
    if (!href.endsWith('.html') && !href.match(/^\w/)) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 350);
    });
  });
})();

// ── OPENING STATUS ──────────────────────────
(function initOpeningStatus() {
  const dot = document.getElementById('openingStatus');
  const text = document.getElementById('openingText');

  if (!dot || !text) return;

  // ⬇️ שעות פתיחה מדויקות (שעה:דקה)
  const schedule = {
    0: { open: "10:00", close: "20:00" },
    1: { open: "10:00", close: "20:00" },
    2: { open: "10:00", close: "20:00" },
    3: { open: "10:00", close: "20:00" },
    4: { open: "10:00", close: "20:00" },
    5: { open: "09:00", close: "15:00" }, // שישי קצר
    6: null // שבת סגור
  };

  function toMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  function updateStatus() {
    const now = new Date();
    const day = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const today = schedule[day];

    if (!today) {
      setClosed();
      return;
    }

    const open = toMinutes(today.open);
    const close = toMinutes(today.close);

    const isOpen = currentMinutes >= open && currentMinutes < close;

    if (isOpen) {
      setOpen();
    } else {
      setClosed();
    }
  }

  function setOpen() {
    text.textContent = 'פתוח עכשיו · תל אביב';
    dot.style.background = '#d4af37';
    dot.style.boxShadow = '0 0 10px #d4af37';
  }

  function setClosed() {
    text.textContent = 'סגור עכשיו · תל אביב';
    dot.style.background = '#ff4d4d';
    dot.style.boxShadow = '0 0 10px #ff4d4d';
  }

  updateStatus();

  // ⬇️ עדכון כל דקה (אפשר גם כל 30 שניות אם בא לך יותר “חי”)
  setInterval(updateStatus, 60 * 1000);
})();