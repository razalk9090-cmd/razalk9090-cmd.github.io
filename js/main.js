/* ==========================================================
   Razal K — Portfolio scripts (vanilla JS, no dependencies)
   ========================================================== */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const wait = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));

  /* ---------- Email links ----------
     Phones: mailto: opens the mail app (Gmail / Mail) with a new message.
     Computers: many have no mail app set up, so mailto: does nothing —
     open Gmail's compose window in a new tab instead. */
  const isPhone = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));

  const gmailCompose = (mailto) => {
    const url = new URL(mailto);
    const p = new URLSearchParams({ view: 'cm', fs: '1', to: decodeURIComponent(url.pathname) });
    if (url.searchParams.get('subject')) p.set('su', url.searchParams.get('subject'));
    if (url.searchParams.get('body')) p.set('body', url.searchParams.get('body'));
    return 'https://mail.google.com/mail/?' + p.toString();
  };

  // Opens a new email. Must be called directly from a click/submit so the new tab isn't blocked.
  const openEmail = (mailto) => {
    if (isPhone) { window.location.href = mailto; return; }
    const tab = window.open(gmailCompose(mailto), '_blank', 'noopener');
    if (!tab) window.location.href = mailto; // pop-up blocked → fall back to the mail app
  };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="mailto:"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    openEmail(a.href);
  });

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Mobile menu ---------- */
  const toggle = $('.nav-toggle');
  const menu = $('#nav-menu');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('is-open') && !e.target.closest('.nav')) setMenu(false);
  });

  /* ---------- Active nav link while scrolling ---------- */
  const links = $$('.nav-links a');
  const sections = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const setActive = (id) => {
    links.forEach((a) => {
      const on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  };
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
    // clear highlight when back in the hero
    const hero = $('#top');
    new IntersectionObserver(([en]) => { if (en.isIntersecting) setActive(''); },
      { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
  }

  /* ---------- Reveal tiles on scroll ---------- */
  const reveals = $$('.reveal');
  const finishReveal = (el) => {
    el.classList.add('is-visible');
    // once the entrance is done, hand control back to the normal hover transitions
    const done = () => { el.classList.remove('reveal', 'is-visible'); el.style.removeProperty('--d'); };
    if (reduceMotion) done(); else setTimeout(done, 900 + (parseFloat(el.style.getPropertyValue('--d')) || 0) * 1000);
  };
  if (!reduceMotion && 'IntersectionObserver' in window) {
    // small stagger for tiles that share a parent
    reveals.forEach((el) => {
      const siblings = $$(':scope > .reveal', el.parentElement);
      const i = siblings.indexOf(el);
      if (i > 0) el.style.setProperty('--d', (Math.min(i, 5) * 0.08).toFixed(2) + 's');
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { finishReveal(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach(finishReveal);
  }

  /* ---------- Skills marquee (built from the skill pills) ---------- */
  const track = $('[data-marquee]');
  if (track) {
    const skills = [...new Set($$('.skill-group .pills li').map((li) => li.textContent.trim()))];
    const list = skills.length ? skills : ['Skills'];
    // repeat so one copy is wider than the screen, then duplicate it for a seamless loop
    const render = (arr) => arr.map((s) => `<span class="marquee-item">${escapeHtml(s)}</span>`).join('');
    if (reduceMotion) {
      track.innerHTML = render(list); // static: show each skill once
    } else {
      let copy = [];
      while (copy.length < 14) copy = copy.concat(list);
      track.innerHTML = render(copy) + render(copy);
    }
  }

  /* ---------- Print CV ---------- */
  $$('[data-print]').forEach((btn) => btn.addEventListener('click', () => window.print()));

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
})();
