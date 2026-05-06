/* =============================================
   מוסך מומחי המסלול — JavaScript ראשי
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Hamburger menu ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---- Counter animation ---- */
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.floor(eased * target).toLocaleString('he-IL');
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('he-IL');
    };
    requestAnimationFrame(tick);
  };

  const statNums = document.querySelectorAll('.stat-num[data-target]');
  let statsAnimated = false;
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        setTimeout(() => {
          statNums.forEach(animateCounter);
        }, 400);
      }
    });
  }, { threshold: 0.5 });
  const heroSection = document.querySelector('.hero');
  if (heroSection) heroObserver.observe(heroSection);

  /* ---- Scroll reveal ---- */
  const revealTargets = [
    '.service-card',
    '.why-item',
    '.gallery-item',
    '.contact-item',
    '.cert-card',
    '.experience-badge',
  ];

  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 80}ms`;
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const highlightNav = () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--gold-light)';
      }
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ---- Contact form submit (demo) ---- */
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span> שולח...`;

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        form.reset();
        showToast('✅ ההודעה נשלחה! נחזור אליך בקרוב.');
      }, 1500);
    });
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  /* ---- Parallax on hero glow ---- */
  const heroGlow = document.querySelector('.hero-glow');
  if (heroGlow) {
    window.addEventListener('mousemove', (e) => {
      const xPct = (e.clientX / window.innerWidth - 0.5) * 40;
      const yPct = (e.clientY / window.innerHeight - 0.5) * 40;
      heroGlow.style.transform = `translate(calc(-50% + ${xPct}px), calc(-50% + ${yPct}px))`;
    }, { passive: true });
  }

  /* ---- Service card hover tilt effect ---- */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-4px) perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
      // Reposition glow under cursor
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.left = `${e.clientX - rect.left - 100}px`;
        glow.style.top = `${e.clientY - rect.top - 100}px`;
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---- Gallery lightbox (placeholder) ---- */
  document.querySelectorAll('.gallery-item:not(.placeholder)').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const src = item.querySelector('img')?.src;
      if (!src) return;
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,0.92);
        display:flex;align-items:center;justify-content:center;
        z-index:9999;cursor:pointer;
      `;
      const img = document.createElement('img');
      img.src = src;
      img.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;';
      overlay.appendChild(img);
      overlay.addEventListener('click', () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });

  /* ---- Ticker pause on hover ---- */
  const tickerTrack = document.querySelector('.ticker-track');
  if (tickerTrack) {
    tickerTrack.parentElement.addEventListener('mouseenter', () => {
      tickerTrack.style.animationPlayState = 'paused';
    });
    tickerTrack.parentElement.addEventListener('mouseleave', () => {
      tickerTrack.style.animationPlayState = 'running';
    });
  }

  console.log('%c🔧 מוסך מומחי המסלול', 'color:#E8A000;font-size:20px;font-weight:bold;');
  console.log('%cאתר נטען בהצלחה!', 'color:#9A9490;font-size:14px;');

});
