document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 30), { passive: true });
  document.getElementById('burger').addEventListener('click', () => document.getElementById('mobileNav').classList.toggle('open'));
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return; e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - 80, behavior: 'smooth' });
  }));
  // counters
  let done = false;
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !done) {
      done = true;
      document.querySelectorAll('.sn[data-t]').forEach(el => {
        const target = +el.dataset.t, d = 1600, s = performance.now();
        const tick = n => { const p = Math.min((n-s)/d,1), e = 1-Math.pow(2,-10*p); el.textContent = Math.floor(e*target); if(p<1) requestAnimationFrame(tick); else el.textContent = target; };
        requestAnimationFrame(tick);
      });
    }
  }, { threshold: 0.5 });
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) observer.observe(statsBar);
  // reveal
  const reveals = [];
  document.querySelectorAll('.srv-card, .why-item, .g-item, .cert, .about-frame').forEach((el, i) => {
    el.classList.add('reveal'); el.style.transitionDelay = (i % 4) * 80 + 'ms'; reveals.push(el);
  });
  new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } }), { threshold: 0.1 }).observe.call(
    new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } }), { threshold: 0.1 }),
    ...reveals
  );
  const ro = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');} }), {threshold:0.1});
  reveals.forEach(el => ro.observe(el));

  // form
  const toast = document.getElementById('toast');
  document.getElementById('cForm')?.addEventListener('submit', e => {
    e.preventDefault();
    setTimeout(() => { e.target.reset(); toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3500); }, 1000);
  });

  // mobile nav close on link click
  document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', () => document.getElementById('mobileNav').classList.remove('open')));
});