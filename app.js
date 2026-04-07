// ============================================
// PAPELES.ES — Main Application
// ============================================

(function() {
  'use strict';

  let currentLang = 'fr';
  let currentFunnelStep = 1;

  // ============================================
  // SVG Icons for service cards
  // ============================================
  const icons = {
    users: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    briefcase: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    clipboard: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
    heart: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    book: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    star: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 20.49 12 17.27 5.82 20.49 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    refresh: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>',
    check: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    clock: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    alert: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  };

  // ============================================
  // Language Detection & Selection
  // ============================================
  function detectLanguage() {
    const browserLang = navigator.language || navigator.userLanguage || '';
    const lang = browserLang.substring(0, 2).toLowerCase();
    if (['fr', 'en', 'es'].includes(lang)) return lang;
    return 'fr'; // Default to French
  }

  // Language selector overlay removed
  function updateLangSwitchUI() {
    document.querySelectorAll('.lang-switch__btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-switch-lang') === currentLang);
    });
  }

  function initLangSwitch() {
    document.querySelectorAll('[data-switch-lang]').forEach(btn => {
      btn.addEventListener('click', () => {
        currentLang = btn.getAttribute('data-switch-lang');
        document.documentElement.lang = currentLang;
        applyTranslations();
        renderServices();
        renderFAQ();
        renderFunnelStep(1);
        updateLangSwitchUI();
      });
    });
  }

  // ============================================
  // Apply Translations
  // ============================================
  function applyTranslations() {
    const t = translations[currentLang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.textContent = t[key];
      }
    });
  }

  // ============================================
  // Render Services Cards
  // ============================================
  function renderServices() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;

    const services = servicesData[currentLang] || servicesData.fr;
    const learnMore = translations[currentLang]?.service_learn_more || 'Learn more →';

    grid.innerHTML = services.map(s => `
      <div class="service-card fade-in ${s.highlighted ? 'service-card--highlighted' : ''}">
        ${s.badge ? `<span class="service-card__badge">${s.badge}</span>` : ''}
        <div class="service-card__icon">${icons[s.icon] || ''}</div>
        <h3 class="service-card__title">${s.title}</h3>
        <p class="service-card__desc">${s.desc}</p>
        <a href="#eligibility" class="service-card__link">${learnMore}</a>
      </div>
    `).join('');

    // Re-init scroll animations for new cards
    initScrollAnimations();
  }

  // ============================================
  // Render FAQ
  // ============================================
  function renderFAQ() {
    const list = document.getElementById('faq-list');
    if (!list) return;

    const faqs = faqData[currentLang] || faqData.fr;

    list.innerHTML = faqs.map((faq, i) => `
      <div class="faq-item fade-in" data-faq="${i}">
        <button class="faq-item__question" aria-expanded="false" aria-controls="faq-answer-${i}">
          <span>${faq.q}</span>
          <svg class="faq-item__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div class="faq-item__answer" id="faq-answer-${i}" role="region">
          <div class="faq-item__answer-inner">${faq.a}</div>
        </div>
      </div>
    `).join('');

    // FAQ toggle
    list.querySelectorAll('.faq-item__question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close all
        list.querySelectorAll('.faq-item').forEach(el => {
          el.classList.remove('open');
          el.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
        });

        // Toggle current
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    initScrollAnimations();
  }

  // ============================================
  // Eligibility Funnel
  // ============================================
  function renderFunnelStep(stepId) {
    currentFunnelStep = stepId;
    const content = document.getElementById('funnel-content');
    const bar = document.getElementById('funnel-bar');
    const data = funnelData[currentLang] || funnelData.fr;

    // Check if it's a result/ending
    if (typeof stepId === 'string') {
      renderFunnelEnding(stepId);
      bar.style.width = '100%';
      return;
    }

    const step = data.steps.find(s => s.id === stepId);
    if (!step) return;

    // Update progress
    const progress = ((stepId - 1) / data.steps.length) * 100;
    bar.style.width = `${progress}%`;

    content.innerHTML = `
      <div class="funnel-step">
        <h3 class="funnel-step__question">${step.question}</h3>
        <div class="funnel-step__options">
          ${step.options.map(opt => `
            <button class="funnel-option" data-next="${opt.next}" aria-label="${opt.label}">
              <div class="funnel-option__radio" aria-hidden="true"></div>
              <span>${opt.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Add click handlers
    content.querySelectorAll('.funnel-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = btn.getAttribute('data-next');
        const nextNum = parseInt(next);
        if (!isNaN(nextNum)) {
          renderFunnelStep(nextNum);
        } else {
          renderFunnelStep(next);
        }
      });
    });
  }

  function renderFunnelEnding(endingId) {
    const content = document.getElementById('funnel-content');
    const data = funnelData[currentLang] || funnelData.fr;
    const ending = data.endings[endingId];
    if (!ending) return;

    let html = `<div class="funnel-result">`;

    // Icon
    const iconKey = ending.icon || 'check';
    html += `<div class="funnel-result__icon">${icons[iconKey] || icons.check}</div>`;

    // Title
    html += `<h3 class="funnel-result__title">${ending.title}</h3>`;

    // Type (for arraigo results)
    if (ending.type) {
      html += `<div class="funnel-result__type">${ending.type}</div>`;
    }

    // Description
    html += `<p class="funnel-result__desc">${ending.desc}</p>`;

    // Checklist
    if (ending.checklist) {
      html += `
        <div class="funnel-result__checklist">
          <h4>${data.checklist_title}</h4>
          <ul>${ending.checklist.map(item => `<li>${item}</li>`).join('')}</ul>
        </div>
      `;
    }

    // Actions
    html += `<div class="funnel-result__actions">`;

    if (ending.cta) {
      html += `<a href="https://calendar.app.google/15xYu6QGrX95KSiF9" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--lg">${data.cta_text}</a>`;
    }

    if (ending.email) {
      let formUrl = 'https://www.notion.so/336c960bdd9580439968cfefa187672b?pvs=106'; // default FR
      if (currentLang === 'es') formUrl = 'https://www.notion.so/336c960bdd9580339bffdbd30bfd52f9?pvs=106';
      if (currentLang === 'en') formUrl = 'https://www.notion.so/336c960bdd9580d1b967f3a114455302?pvs=106';
      
      html += `<a href="${formUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--lg">${data.email_btn}</a>`;
    }

    html += `<button class="funnel-restart" onclick="window.restartFunnel()">${data.restart_text}</button>`;
    html += `</div></div>`;

    content.innerHTML = html;
  }

  // Expose restart for onclick
  window.restartFunnel = function() {
    renderFunnelStep(1);
  };

  // ============================================
  // Sticky Header
  // ============================================
  function initStickyHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      header.classList.toggle('scrolled', scrollY > 20);
      lastScroll = scrollY;
    }, { passive: true });
  }

  // ============================================
  // Mobile Menu
  // ============================================
  function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('mobile-nav');

    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
      const isOpen = nav.classList.contains('open');
      nav.classList.toggle('open');
      nav.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
      btn.setAttribute('aria-expanded', !isOpen);

      // Toggle icon
      if (!isOpen) {
        btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      } else {
        btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      }
    });

    // Close on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        nav.setAttribute('aria-hidden', 'true');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      });
    });
  }

  // ============================================
  // Scroll Animations (Fallback)
  // ============================================
  function initScrollAnimations() {
    // Only use JS fallback if CSS scroll-driven animations aren't supported
    if (CSS.supports && CSS.supports('animation-timeline', 'scroll()')) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
      observer.observe(el);
    });
  }

  // ============================================
  // Counter Animation
  // ============================================
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'));
          animateCount(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  function animateCount(el, target) {
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = '+' + current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ============================================
  // Smooth Scroll for anchor links
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ============================================
  // Init
  // ============================================
  function init() {
    initLangSwitch();
    initStickyHeader();
    initMobileMenu();
    initSmoothScroll();
    initCounters();

    // Automatically set detected language and render content
    currentLang = detectLanguage();
    document.documentElement.lang = currentLang;
    applyTranslations();
    renderServices();
    renderFAQ();
    renderFunnelStep(1);
    updateLangSwitchUI();
    initScrollAnimations();
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
