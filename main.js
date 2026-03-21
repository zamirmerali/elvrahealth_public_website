/* ================================================
   Elvra Health — main.js
   ================================================ */

// ── 1. Nav scroll effect ──────────────────────────────────────────
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('nav--scrolled');
  } else {
    nav.classList.remove('nav--scrolled');
  }
}, { passive: true });


// ── 2. Smooth scroll for anchor links ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    // Close mobile menu if open
    closeMobileMenu();

    const navHeight = nav.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});


// ── 3. Mobile hamburger menu ─────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.querySelectorAll('span').forEach((s, i) => {
    s.style.transform = '';
    s.style.opacity = '';
  });
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));

  // Animate hamburger to X
  const spans = hamburger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    closeMobileMenu();
  }
});

// Close menu when clicking outside
document.addEventListener('click', e => {
  if (!nav.contains(e.target)) {
    closeMobileMenu();
  }
});


// ── 4. Demo form submission ───────────────────────────────────────
const demoForm = document.getElementById('demoForm');
const formSuccess = document.getElementById('formSuccess');

demoForm.addEventListener('submit', e => {
  e.preventDefault();

  // Basic validation
  const inputs = demoForm.querySelectorAll('input[required]');
  let valid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      valid = false;
      input.style.borderColor = '#ef4444';
      input.addEventListener('input', () => {
        input.style.borderColor = '';
      }, { once: true });
    }
  });

  if (!valid) return;

  // Hide form, show success
  demoForm.style.display = 'none';
  formSuccess.classList.add('visible');

  // Scroll success message into view
  formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
});


// ── 5. Scroll reveal (IntersectionObserver) ───────────────────────
const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sibling reveals slightly
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          let delay = 0;
          siblings.forEach((el, idx) => {
            if (el === entry.target) delay = idx * 80;
          });

          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => observer.observe(el));
} else {
  // Fallback: reveal everything immediately
  revealElements.forEach(el => el.classList.add('revealed'));
}
