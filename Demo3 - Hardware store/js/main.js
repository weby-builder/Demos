// =============================================
//  טמבוריה - חנות ציוד אומנות | JavaScript
// =============================================

// ---- Cart State ----
let cart = JSON.parse(localStorage.getItem('tamburiya-cart') || '[]');

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCountdown();
  initCart();
  initFilters();
  initMobileMenu();
  initScrollEvents();
  updateCartBadge();
});

// =============================================
//  Scroll Animations (Intersection Observer)
// =============================================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    observer.observe(el);
  });
}

// =============================================
//  Countdown Timer
// =============================================
function initCountdown() {
  const endTime = new Date();
  endTime.setHours(23, 59, 59, 0);

  function update() {
    const now = new Date();
    let diff = endTime - now;
    if (diff < 0) {
      endTime.setDate(endTime.getDate() + 1);
      diff = endTime - now;
    }

    const h = Math.floor(diff / 1000 / 3600);
    const m = Math.floor((diff / 1000 % 3600) / 60);
    const s = Math.floor(diff / 1000 % 60);

    const pad = n => String(n).padStart(2, '0');

    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-minutes');
    const secsEl = document.getElementById('cd-seconds');

    if (hoursEl) hoursEl.textContent = pad(h);
    if (minsEl) minsEl.textContent = pad(m);
    if (secsEl) secsEl.textContent = pad(s);
  }

  update();
  setInterval(update, 1000);
}

// =============================================
//  Product Filters
// =============================================
function initFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.product-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

// =============================================
//  Mobile Menu
// =============================================
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  hamburger?.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  mobileClose?.addEventListener('click', closeMobileMenu);

  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// =============================================
//  Scroll Events (navbar + back-to-top)
// =============================================
function initScrollEvents() {
  const backToTop = document.getElementById('back-to-top');
  const header = document.querySelector('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Back to top button
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 400);
    }

    // Hide/show header on scroll
    if (scrollY > 100 && scrollY > lastScroll) {
      header?.style.setProperty('transform', 'translateY(-100%)');
    } else {
      header?.style.setProperty('transform', 'translateY(0)');
    }
    lastScroll = scrollY;
  });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =============================================
//  Cart System
// =============================================
function initCart() {
  // Open cart
  document.getElementById('cart-btn')?.addEventListener('click', openCart);

  // Close cart
  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

  // Checkout button
  document.getElementById('cart-checkout-btn')?.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('העגלה שלך ריקה!');
      return;
    }
    showToast('מעביר לתשלום... 🛒');
    setTimeout(() => { closeCart(); }, 1200);
  });

  // Add to cart buttons (event delegation)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart');
    if (btn) {
      const card = btn.closest('.product-card');
      const name = card?.querySelector('.product-name')?.textContent;
      const priceText = card?.querySelector('.product-price')?.textContent;
      const price = parseFloat(priceText?.replace(/[^\d.]/g, '') || '0');
      const brand = card?.querySelector('.product-brand')?.textContent;

      addToCart({ name, price, brand, qty: 1 });
    }
  });

  renderCart();
}

function openCart() {
  document.getElementById('cart-overlay')?.classList.add('open');
  document.getElementById('cart-sidebar')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.getElementById('cart-sidebar')?.classList.remove('open');
  document.body.style.overflow = '';
}

function addToCart(item) {
  const existing = cart.find(c => c.name === item.name);
  if (existing) {
    existing.qty++;
  } else {
    item.id = Date.now();
    cart.push(item);
  }
  saveCart();
  updateCartBadge();
  renderCart();
  showToast(`✓ "${item.name}" נוסף לעגלה`);

  // Animate cart button
  const cartBtn = document.getElementById('cart-btn');
  cartBtn?.classList.add('bounce');
  setTimeout(() => cartBtn?.classList.remove('bounce'), 600);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  updateCartBadge();
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem('tamburiya-cart', JSON.stringify(cart));
}

function updateCartBadge() {
  const total = cart.reduce((sum, c) => sum + c.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) badge.textContent = total;
  document.getElementById('cart-count-text').textContent = `${cart.length} פריטים`;
}

function renderCart() {
  const body = document.getElementById('cart-body');
  const subtotalEl = document.getElementById('cart-subtotal-amount');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <p>העגלה שלך ריקה</p>
        <p style="font-size:.8rem;margin-top:8px;color:#aaa">הוסיפי מוצרים כדי להתחיל</p>
      </div>`;
    if (subtotalEl) subtotalEl.textContent = '₪0';
    return;
  }

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img" style="background:linear-gradient(135deg,#c0392b22,#c0392b44)"></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₪${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-remove" onclick="removeFromCart(${item.id})" title="הסר">✕</button>
    </div>
  `).join('');

  if (subtotalEl) subtotalEl.textContent = `₪${subtotal.toFixed(2)}`;
}

// =============================================
//  Toast Notification
// =============================================
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// =============================================
//  Wishlist (heart button)
// =============================================
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.action-btn.wishlist-btn');
  if (btn) {
    btn.classList.toggle('active');
    const active = btn.classList.contains('active');
    btn.innerHTML = active
      ? `<svg width="18" height="18" fill="#c0392b" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
      : `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
    showToast(active ? '❤️ נוסף לרשימת המשאלות' : 'הוסר מרשימת המשאלות');
  }
});

// =============================================
//  Newsletter Form
// =============================================
document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  if (input?.value) {
    showToast('🎨 נרשמת בהצלחה לניוזלטר!');
    input.value = '';
  }
});

// =============================================
//  Smooth scroll for nav links
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// =============================================
//  Active nav highlight on scroll
// =============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active-nav', link.getAttribute('href') === `#${current}`);
  });
});

// Add bounce animation to cart CSS dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3); }
  }
  #cart-btn.bounce { animation: bounce 0.4s ease; }
  .active-nav { color: var(--red) !important; }
  .active-nav::after { width: 100% !important; }
`;
document.head.appendChild(style);
