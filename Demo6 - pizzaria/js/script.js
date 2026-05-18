'use strict';

/* ── HEADER SCROLL ── */
var header = document.getElementById('site-header');
var backBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', function () {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  if (window.scrollY > 400) {
    backBtn.classList.add('visible');
  } else {
    backBtn.classList.remove('visible');
  }
}, { passive: true });

/* ── BURGER ── */
var burger = document.getElementById('burger');
var mobileMenu = document.getElementById('mobile-menu');

burger.addEventListener('click', function () {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mob-link').forEach(function (link) {
  link.addEventListener('click', function () {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── MENU TABS ── */
var tabBtns = document.querySelectorAll('.tab-btn');
var tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    var target = btn.dataset.tab;
    tabBtns.forEach(function (b) { b.classList.remove('active'); });
    tabContents.forEach(function (c) { c.classList.remove('active'); });
    btn.classList.add('active');
    var activeTab = document.getElementById('tab-' + target);
    activeTab.classList.add('active');
    activeTab.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.remove('visible');
      setTimeout(function () { el.classList.add('visible'); }, 50);
    });
  });
});

/* ── SCROLL REVEAL ── */
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(function (el) {
  revealObserver.observe(el);
});

/* ── REVIEWS CAROUSEL ── */
var track = document.getElementById('reviews-track');
var prevBtn = document.getElementById('prev-review');
var nextBtn = document.getElementById('next-review');
var dotsContainer = document.getElementById('carousel-dots');
var cards = track.querySelectorAll('.review-card');
var currentIndex = 0;
var autoplayTimer = null;

function getSlidesPerView() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

var slidesPerView = getSlidesPerView();
var totalSlides = cards.length;

function buildDots() {
  dotsContainer.innerHTML = '';
  var dotCount = totalSlides - slidesPerView + 1;
  for (var i = 0; i < dotCount; i++) {
    (function (idx) {
      var dot = document.createElement('button');
      dot.classList.add('dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', function () { goTo(idx); });
      dotsContainer.appendChild(dot);
    })(i);
  }
}

function updateDots() {
  var dots = dotsContainer.querySelectorAll('.dot');
  dots.forEach(function (d, i) {
    d.classList.toggle('active', i === currentIndex);
  });
}

function getCardWidth() {
  if (cards.length === 0) return 0;
  var card = cards[0];
  var style = window.getComputedStyle(track);
  var gap = parseFloat(style.gap || style.columnGap) || 24;
  return card.offsetWidth + gap;
}

function goTo(index) {
  var maxIndex = Math.max(0, totalSlides - slidesPerView);
  currentIndex = Math.max(0, Math.min(index, maxIndex));
  var offset = currentIndex * getCardWidth();
  track.style.transform = 'translateX(' + offset + 'px)';
  updateDots();
}

prevBtn.addEventListener('click', function () { goTo(currentIndex - 1); resetAutoplay(); });
nextBtn.addEventListener('click', function () { goTo(currentIndex + 1); resetAutoplay(); });

function startAutoplay() {
  autoplayTimer = setInterval(function () {
    var maxIndex = Math.max(0, totalSlides - slidesPerView);
    goTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
  }, 4500);
}

function resetAutoplay() {
  clearInterval(autoplayTimer);
  startAutoplay();
}

var touchStartX = 0;
track.addEventListener('touchstart', function (e) {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

track.addEventListener('touchend', function (e) {
  var delta = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(delta) > 40) {
    goTo(delta > 0 ? currentIndex + 1 : currentIndex - 1);
    resetAutoplay();
  }
});

buildDots();
startAutoplay();

window.addEventListener('resize', function () {
  var newSPV = getSlidesPerView();
  if (newSPV !== slidesPerView) {
    slidesPerView = newSPV;
    currentIndex = 0;
    buildDots();
    goTo(0);
  }
});

/* ── BACK TO TOP ── */
backBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── CONTACT FORM ── */
var form = document.getElementById('contact-form');
var submitBtn = document.getElementById('form-submit-btn');
var btnText = submitBtn.querySelector('.btn-text');
var btnLoading = submitBtn.querySelector('.btn-loading');
var successMsg = document.getElementById('form-success');
var errorMsg = document.getElementById('form-error');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  submitBtn.disabled = true;
  successMsg.style.display = 'none';
  errorMsg.style.display = 'none';

  var formData = new FormData(form);
  var endpoint = 'https://api.web3forms.com/submit';

  var xhr = new XMLHttpRequest();
  xhr.open('POST', endpoint);
  xhr.onload = function () {
    try {
      var data = JSON.parse(xhr.responseText);
      if (data.success) {
        successMsg.style.display = 'block';
        form.reset();
      } else {
        errorMsg.style.display = 'block';
      }
    } catch (err) {
      errorMsg.style.display = 'block';
    }
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
  };
  xhr.onerror = function () {
    errorMsg.style.display = 'block';
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    submitBtn.disabled = false;
  };
  xhr.send(formData);
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    var target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      var headerH = header.offsetHeight;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  });
});

/* ── NAV ACTIVE LINK ── */
var sections = document.querySelectorAll('section[id]');
var navLinks = document.querySelectorAll('.nav-links a');

var sectionObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      navLinks.forEach(function (link) {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.classList.add('active-link');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(function (s) { sectionObserver.observe(s); });

// ── OPENING STATUS ──────────────────────────
(function initOpeningStatus() {
  const dot = document.getElementById('openingStatus');
  const text = document.getElementById('openingText');

  if (!dot || !text) return;

  // ⬇️ שעות פתיחה מדויקות (שעה:דקה)
  const schedule = {
    0: { open: "12:00", close: "23:00" },
    1: { open: "12:00", close: "23:00" },
    2: { open: "12:00", close: "23:00" },
    3: { open: "12:00", close: "23:00" },
    4: { open: "12:00", close: "23:00" },
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
    text.textContent = '🍕 פתוח עכשיו · משלוחים עד 23:00';
    dot.style.background = '#d4af37';
    dot.style.boxShadow = '0 0 10px #d4af37';
  }

  function setClosed() {
    text.textContent = '🍕 סגור עכשיו · אין משלוחים';
    dot.style.background = '#ff4d4d';
    dot.style.boxShadow = '0 0 10px #ff4d4d';
  }

  updateStatus();

  // ⬇️ עדכון כל דקה (אפשר גם כל 30 שניות אם בא לך יותר “חי”)
  setInterval(updateStatus, 60 * 1000);
})();
