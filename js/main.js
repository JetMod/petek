/* =====================================================
   main.js — Petek site scripts
   - Mobile hamburger menu
   - Smooth scroll for anchor links
   - Active nav link highlight
   - Hero Ken-Burns entrance
   - File input label update
   - Order form basic validation
   - Projects filmstrip + cinema screen (homepage)
   ===================================================== */

(function () {
  'use strict';

  /* -------------------------------------------------------
     Hamburger / Mobile Nav
  ------------------------------------------------------- */
  const burger   = document.getElementById('burger-btn');
  const nav      = document.getElementById('site-nav');
  const overlay  = document.getElementById('nav-overlay');

  function openNav() {
    nav.classList.add('is-open');
    overlay && overlay.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    nav.classList.remove('is-open');
    overlay && overlay.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      const isOpen = nav.classList.contains('is-open');
      isOpen ? closeNav() : openNav();
    });

    overlay && overlay.addEventListener('click', closeNav);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        burger.focus();
      }
    });

    nav.querySelectorAll('.site-nav__link, .site-nav__dropdown-link, .site-nav__dropdown-more').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) closeNav();
      });
    });
  }

  /* -------------------------------------------------------
     Header scroll shadow — add .is-scrolled when page scrolls
  ------------------------------------------------------- */
  (function () {
    const header = document.getElementById('site-header');
    if (!header) return;
    var scrolled = false;
    function onScroll() {
      var threshold =
        document.body.classList.contains('page-home') ||
        document.body.classList.contains('page-prices') ||
        document.body.classList.contains('page-materials') ||
        document.body.classList.contains('page-contacts')
          ? 96
          : 10;
      var shouldScroll = window.scrollY > threshold;
      if (shouldScroll !== scrolled) {
        scrolled = shouldScroll;
        header.classList.toggle('is-scrolled', scrolled);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }());

  /* -------------------------------------------------------
     Hero Slider
  ------------------------------------------------------- */
  (function () {
    const slider   = document.getElementById('hero-slider');
    if (!slider) return;

    const track    = document.getElementById('hero-slider-track');
    const slides   = track ? Array.from(track.children) : [];
    const dotsWrap = document.getElementById('hero-dots');
    const prevBtn  = document.getElementById('hero-prev');
    const nextBtn  = document.getElementById('hero-next');
    const total    = slides.length;
    if (total === 0) return;

    let current = 0;
    let autoTimer = null;

    // Build dots
    const dots = slides.map(function (_, i) {
      const btn = document.createElement('button');
      btn.className = 'hero-slider__dot' + (i === 0 ? ' is-active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', 'Слайд ' + (i + 1));
      btn.addEventListener('click', function () { goTo(i); resetAuto(); });
      dotsWrap && dotsWrap.appendChild(btn);
      return btn;
    });

    function goTo(idx) {
      dots[current].classList.remove('is-active');
      current = (idx + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots[current].classList.add('is-active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(next, 5000);
    }

    prevBtn && prevBtn.addEventListener('click', function () { prev(); resetAuto(); });
    nextBtn && nextBtn.addEventListener('click', function () { next(); resetAuto(); });

    // Pause on hover
    slider.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    slider.addEventListener('mouseleave', resetAuto);

    // Touch swipe
    let touchStartX = 0;
    slider.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); resetAuto(); }
    });

    resetAuto();
  }());

  /* -------------------------------------------------------
     File input — update label text
  ------------------------------------------------------- */
  const fileInput   = document.getElementById('f-file');
  const fileDisplay = document.getElementById('file-name-display');

  if (fileInput && fileDisplay) {
    fileInput.addEventListener('change', function () {
      if (fileInput.files.length > 0) {
        fileDisplay.textContent = Array.from(fileInput.files)
          .map(function (f) { return f.name; })
          .join(', ');
      } else {
        fileDisplay.textContent = 'Выбрать файл (pdf, dwg, jpg…)';
      }
    });
  }

  /* -------------------------------------------------------
     Order form — basic client-side validation
  ------------------------------------------------------- */
  const orderForm = document.getElementById('order-form');
  const consentEl = document.getElementById('f-consent');

  if (consentEl) {
    consentEl.addEventListener('change', function () {
      var wrap = consentEl.closest('.order-checkbox');
      if (wrap) wrap.classList.remove('order-checkbox--error');
    });
  }

  if (orderForm) {
    orderForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameEl  = document.getElementById('f-name');
      const phoneEl = document.getElementById('f-phone');
      let valid = true;

      if (consentEl) {
        var consentWrap = consentEl.closest('.order-checkbox');
        if (consentWrap) consentWrap.classList.remove('order-checkbox--error');
      }

      [nameEl, phoneEl].forEach(function (el) {
        if (!el) return;
        el.classList.remove('form-control--error');
        if (!el.value.trim()) {
          el.classList.add('form-control--error');
          valid = false;
        }
      });

      if (consentEl && !consentEl.checked) {
        var w = consentEl.closest('.order-checkbox');
        if (w) w.classList.add('order-checkbox--error');
        valid = false;
      }

      if (!valid) {
        const firstFieldError = orderForm.querySelector('.form-control--error');
        if (firstFieldError) {
          firstFieldError.focus();
        } else if (consentEl && orderForm.querySelector('.order-checkbox--error')) {
          consentEl.focus();
        }
        return;
      }

      // Placeholder success state
      const submitBtn = orderForm.querySelector('.order__submit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправлено!';
        setTimeout(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Отправить заявку';
          orderForm.reset();
          if (fileDisplay) fileDisplay.textContent = 'Выбрать файл (pdf, dwg, jpg…)';
        }, 3000);
      }
    });
  }

  /* -------------------------------------------------------
     Smooth scroll for same-page anchor links (#...)
  ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      if (anchor.getAttribute('data-open-quick-modal') === 'true') {
        e.preventDefault();
        return;
      }
      var raw = anchor.getAttribute('href');
      if (!raw || raw === '#') {
        e.preventDefault();
        return;
      }
      var id = raw.slice(1);
      if (!id) {
        e.preventDefault();
        return;
      }
      try {
        id = decodeURIComponent(id);
      } catch (err) {
        return;
      }
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* -------------------------------------------------------
     Active nav link — highlight the link matching the
     current page, removing any hardcoded active classes
     that may be out of sync.
  ------------------------------------------------------- */
  (function () {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.site-nav__link').forEach(function (link) {
      const href = (link.getAttribute('href') || '').split('/').pop();
      const isActive = href === currentFile ||
        // treat bare "/" or "" as index.html
        (currentFile === '' && href === 'index.html');

      if (isActive) {
        link.classList.add('site-nav__link--active');
        link.ariaCurrent = 'page';
      } else {
        link.classList.remove('site-nav__link--active');
        link.removeAttribute('aria-current');
      }
    });
  }());

  /* -------------------------------------------------------
     Contacts — live working-hours status badge
     Mon–Fri 09:00–18:00 Crimea time (UTC+3)
  ------------------------------------------------------- */
  (function () {
    var badge = document.getElementById('contacts-status');
    if (!badge) return;

    function update() {
      var now   = new Date();
      var utc   = now.getTime() + now.getTimezoneOffset() * 60000;
      var local = new Date(utc + 3 * 3600000); // UTC+3
      var day   = local.getDay();   // 0=Sun … 6=Sat
      var h     = local.getHours();
      var m     = local.getMinutes();
      var mins  = h * 60 + m;
      var open  = day >= 1 && day <= 5 && mins >= 9 * 60 && mins < 18 * 60;

      badge.textContent = open ? 'Сейчас работаем' : 'Закрыто';
      badge.className   = 'contacts-show__status ' + (open ? 'is-open' : 'is-closed');
    }

    update();
    setInterval(update, 60000);
  }());

  /* -------------------------------------------------------
     Quick call popup — floating phone button + modal
  ------------------------------------------------------- */
  (function () {
    var openBtn = document.getElementById('quick-call-btn');
    var modal = document.getElementById('quick-modal');
    var closeBtn = document.getElementById('quick-modal-close');
    var form = document.getElementById('quick-modal-form');
    var nameEl = document.getElementById('qm-name');
    var phoneEl = document.getElementById('qm-phone');
    var nameErr = document.getElementById('qm-name-error');
    var phoneErr = document.getElementById('qm-phone-error');
    if (!modal || !closeBtn || !form || !nameEl || !phoneEl || !nameErr || !phoneErr) return;
    var phonePrefill = '+7';
    var phoneAutoclearDone = false;

    function openModal() {
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      clearFieldError(nameEl, nameErr);
      clearFieldError(phoneEl, phoneErr);
      phoneEl.value = phonePrefill;
      phoneAutoclearDone = false;
      nameEl.focus();
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
      if (openBtn) openBtn.focus();
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-open-quick-modal="true"]');
      if (!trigger) return;
      e.preventDefault();
      openModal();
    });

    modal.addEventListener('click', function (e) {
      var target = e.target;
      if (target && target.getAttribute('data-close') === 'quick-modal') {
        closeModal();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

    function clearFieldError(field, errorEl) {
      field.classList.remove('is-error');
      field.removeAttribute('aria-invalid');
      errorEl.textContent = '';
    }

    function setFieldError(field, errorEl, message) {
      field.classList.add('is-error');
      field.setAttribute('aria-invalid', 'true');
      errorEl.textContent = message;
    }

    function hasValidName(value) {
      var v = value.trim();
      return v.length >= 2 && /^[A-Za-zА-Яа-яЁё\-\s]+$/.test(v);
    }

    function hasValidPhone(value) {
      var digits = value.replace(/\D/g, '');
      return digits.length >= 11 && digits.length <= 15;
    }

    function normalizePhoneValue(value) {
      var hasPlus = value.trim().charAt(0) === '+';
      var digits = value.replace(/\D/g, '').slice(0, 15);
      return (hasPlus ? '+' : '') + digits;
    }

    [nameEl, phoneEl].forEach(function (el) {
      el.addEventListener('input', function () {
        if (el === nameEl) clearFieldError(nameEl, nameErr);
        if (el === phoneEl) {
          el.value = normalizePhoneValue(el.value);
          clearFieldError(phoneEl, phoneErr);
        }
      });
    });

    phoneEl.addEventListener('keydown', function (e) {
      var isEditableKey = e.key.length === 1 || e.key === 'Backspace' || e.key === 'Delete';
      if (!phoneAutoclearDone && phoneEl.value === phonePrefill && isEditableKey) {
        phoneEl.value = '';
        phoneAutoclearDone = true;
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      clearFieldError(nameEl, nameErr);
      clearFieldError(phoneEl, phoneErr);

      if (!hasValidName(nameEl.value)) {
        setFieldError(nameEl, nameErr, 'Введите имя: минимум 2 буквы.');
        ok = false;
      }
      if (!hasValidPhone(phoneEl.value)) {
        setFieldError(phoneEl, phoneErr, 'Введите телефон: 11-15 цифр.');
        ok = false;
      }
      if (!ok) {
        (nameEl.classList.contains('is-error') ? nameEl : phoneEl).focus();
        return;
      }

      var submit = form.querySelector('.quick-modal__submit');
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Отправлено!';
      }
      setTimeout(function () {
        form.reset();
        phoneEl.value = phonePrefill;
        phoneAutoclearDone = false;
        if (submit) {
          submit.disabled = false;
          submit.textContent = 'Отправить заявку';
        }
        closeModal();
      }, 1200);
    });
  }());

  /* -------------------------------------------------------
     Card stacks — same logic as materials (furnitura) hero:
     click top → cycle to back; click another → bring to front.
     Any container [data-stack] with direct children [data-pos].
  ------------------------------------------------------- */
  (function () {
    document.querySelectorAll('[data-stack]').forEach(function (stack) {
      const cards = Array.from(stack.querySelectorAll('[data-pos]'));
      if (cards.length < 2) return;

      const total = cards.length;

      function promote(clickedCard) {
        const clickedPos = parseInt(clickedCard.dataset.pos, 10);
        if (!clickedPos) return;

        if (clickedPos === 1) {
          cards.forEach(function (card) {
            const pos = parseInt(card.dataset.pos, 10);
            card.dataset.pos = pos === 1 ? String(total) : String(pos - 1);
          });
          return;
        }

        cards.forEach(function (card) {
          const pos = parseInt(card.dataset.pos, 10);
          if (card === clickedCard) {
            card.dataset.pos = '1';
          } else if (pos < clickedPos) {
            card.dataset.pos = String(pos + 1);
          }
        });
      }

      cards.forEach(function (card) {
        card.addEventListener('click', function () {
          promote(card);
          if (!stack.classList.contains('is-touched')) {
            stack.classList.add('is-touched');
          }
        });
      });
    });
  }());

})();
