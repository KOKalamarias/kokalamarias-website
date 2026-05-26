// =====================================================
//  Κ.Ο. Καλαμαριάς — Page-agnostic JS
//  Τρέχει σε ΟΛΕΣ τις σελίδες. Κάθε feature ελέγχει αν υπάρχει το element.
// =====================================================

document.addEventListener('DOMContentLoaded', () => {

  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a:not(.dropdown-trigger)').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // Dropdown menus
  document.querySelectorAll('.has-dropdown > .dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        trigger.parentElement.classList.toggle('open');
      }
    });
  });

  // Animated stat counters
  const stats = document.querySelectorAll('.stat-num');
  if (stats.length) {
    const animateValue = (el, end) => {
      const duration = 1500;
      const startTime = performance.now();
      const suffix = el.dataset.suffix || '';
      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(end * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const text = entry.target.textContent;
          const num = parseInt(text);
          if (!isNaN(num)) {
            entry.target.dataset.suffix = text.replace(/[0-9]/g, '');
            if (num >= 1900 && num <= 2100) {
              entry.target.textContent = num + entry.target.dataset.suffix;
            } else {
              animateValue(entry.target, num);
            }
          }
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach(s => statsObserver.observe(s));
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.team-card, .social-card, .news-card, .about-card, .contact-item, .champion-card, .board-card, .inst-card, .home-card');
  if (revealEls.length) {
    revealEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
    });
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 60);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  // Contact form -> Web3Forms (direct email delivery)
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (form) {
    const WEB3FORMS_KEY = '11db950a-f146-478a-8c56-2e89278fd872';
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim() || 'Website contact';
      const message = document.getElementById('message').value.trim();
      const isEN = document.documentElement.lang === 'en';

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = isEN ? 'Sending…' : 'Αποστολή…';
      }

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: '[Website] ' + subject,
            from_name: 'Κ.Ο. Καλαμαριάς — Φόρμα Επικοινωνίας',
            name,
            email,
            topic: subject,
            message,
            botcheck: '',
          }),
        });
        const data = await res.json();
        if (data.success) {
          if (formSuccess) {
            formSuccess.textContent = isEN
              ? '✓ Your message was sent successfully. We will contact you soon.'
              : '✓ Το μήνυμά σας στάλθηκε επιτυχώς. Θα επικοινωνήσουμε σύντομα μαζί σας.';
            formSuccess.classList.add('show');
          }
          form.reset();
          setTimeout(() => { if (formSuccess) formSuccess.classList.remove('show'); }, 8000);
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      } catch (err) {
        if (formSuccess) {
          formSuccess.textContent = isEN
            ? '✗ Something went wrong. Please email info@kokalamarias.gr directly.'
            : '✗ Κάτι πήγε στραβά. Στείλτε email απευθείας στο info@kokalamarias.gr.';
          formSuccess.classList.add('show', 'error');
          setTimeout(() => { if (formSuccess) formSuccess.classList.remove('show', 'error'); }, 10000);
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }

  // Language toggle (EL/EN)
  const STORAGE_KEY = 'kok-lang';
  const langToggle = document.getElementById('langToggle');

  function applyLanguage(lang) {
    if (typeof TRANSLATIONS === 'undefined') return;
    const dict = TRANSLATIONS[lang];
    if (!dict) return;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = dict[key];
      if (value === undefined) return;
      const attrName = el.getAttribute('data-i18n-attr');
      if (attrName) el.setAttribute(attrName, value);
      else if (el.hasAttribute('data-i18n-html')) el.innerHTML = value;
      else el.textContent = value;
    });
    if (langToggle) {
      const cur = langToggle.querySelector('.lang-current');
      const oth = langToggle.querySelector('.lang-other');
      if (lang === 'el') { cur.textContent = 'EL'; oth.textContent = 'EN'; }
      else { cur.textContent = 'EN'; oth.textContent = 'EL'; }
    }
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const next = document.documentElement.lang === 'el' ? 'en' : 'el';
      applyLanguage(next);
    });
  }

  let initial = 'el';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'el' || stored === 'en') initial = stored;
    else if ((navigator.language || '').toLowerCase().startsWith('en')) initial = 'en';
  } catch (e) {}
  applyLanguage(initial);

});
