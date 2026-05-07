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
      var threshold = document.body.classList.contains('page-home') ? 96 : 10;
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
     Projects showcase — split hero + index list
  ------------------------------------------------------- */
  (function () {
    var root = document.getElementById('proj-showcase-slider');
    var viewport = document.getElementById('proj-slider-viewport');
    var tocScroll = document.getElementById('proj-slider-toc-scroll');
    var toc = document.getElementById('proj-slider-toc');
    var heroImg = document.getElementById('proj-split-img');
    var titleEl = document.getElementById('proj-split-title');
    var idxEl = document.getElementById('proj-split-idx');
    var prevBtn = document.getElementById('proj-slider-prev');
    var nextBtn = document.getElementById('proj-slider-next');
    var curEl = document.getElementById('proj-slider-cur');
    var totalEl = document.getElementById('proj-slider-total');

    if (!root || !toc || !heroImg || !titleEl || !idxEl || !prevBtn || !nextBtn || !curEl || !totalEl) return;

    var picks = toc.querySelectorAll('.proj-split__item');
    var n = picks.length;
    if (!n) return;

    totalEl.textContent = String(n);

    var active = 0;
    var autoTimer = null;
    var reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function pad2(num) {
      var s = String(num);
      return s.length < 2 ? '0' + s : s;
    }

    function scrollToc() {
      var el = picks[active];
      if (!el || !tocScroll) return;
      var elRect = el.getBoundingClientRect();
      var scRect = tocScroll.getBoundingClientRect();
      var dy = elRect.top + elRect.height / 2 - scRect.top - scRect.height / 2;
      var dx = elRect.left + elRect.width / 2 - scRect.left - scRect.width / 2;
      tocScroll.scrollBy({
        top: dy,
        left: dx,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }

    function select(i) {
      active = (i + n) % n;
      var btn = picks[active];
      if (!btn) return;

      heroImg.src = btn.getAttribute('data-src') || heroImg.src;
      heroImg.alt = btn.getAttribute('data-alt') || '';

      titleEl.textContent = btn.getAttribute('data-caption') || '';
      idxEl.textContent = pad2(active + 1);
      curEl.textContent = String(active + 1);

      picks.forEach(function (p, j) {
        var on = j === active;
        p.classList.toggle('is-active', on);
        p.setAttribute('aria-selected', on ? 'true' : 'false');
        p.setAttribute(
          'aria-label',
          'Кадр ' +
            (j + 1) +
            ' из ' +
            n +
            (p.getAttribute('data-caption') ? ': ' + p.getAttribute('data-caption') : '')
        );
        p.tabIndex = on ? 0 : -1;
      });

      scrollToc();
    }

    function go(delta) {
      select(active + delta);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      if (reduceMotion) return;
      autoTimer = window.setInterval(function () {
        go(1);
      }, 5600);
    }

    picks.forEach(function (pick, i) {
      pick.addEventListener('click', function () {
        select(i);
        resetAuto();
      });
    });

    prevBtn.addEventListener('click', function () {
      go(-1);
      resetAuto();
    });
    nextBtn.addEventListener('click', function () {
      go(1);
      resetAuto();
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
        resetAuto();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
        resetAuto();
      }
    });

    root.addEventListener('mouseenter', function () {
      clearInterval(autoTimer);
    });
    root.addEventListener('mouseleave', resetAuto);

    root.addEventListener('focusin', function () {
      clearInterval(autoTimer);
    });
    root.addEventListener('focusout', function (e) {
      if (!root.contains(e.relatedTarget)) resetAuto();
    });

    var touchX = 0;
    var touchY = 0;
    if (viewport) {
      viewport.addEventListener(
        'touchstart',
        function (e) {
          touchX = e.changedTouches[0].screenX;
          touchY = e.changedTouches[0].screenY;
        },
        { passive: true }
      );
      viewport.addEventListener(
        'touchend',
        function (e) {
          var dx = e.changedTouches[0].screenX - touchX;
          var dy = e.changedTouches[0].screenY - touchY;
          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
            dx < 0 ? go(1) : go(-1);
            resetAuto();
          }
        },
        { passive: true }
      );
    }

    select(0);
    resetAuto();

    if (typeof window.matchMedia === 'function') {
      var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      var onMotionChange = function (ev) {
        reduceMotion = ev.matches;
        clearInterval(autoTimer);
        resetAuto();
      };
      if (mq.addEventListener) mq.addEventListener('change', onMotionChange);
      else if (mq.addListener) mq.addListener(onMotionChange);
    }
  })();

  /* -------------------------------------------------------
     Smooth scroll for same-page anchor links (#...)
  ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
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

})();
