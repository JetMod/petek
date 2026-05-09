/* gallery-page.js — страница проектов: сетка и лайтбокс */
(function () {
  'use strict';

  var PROJECTS = [
    { file: 'DSC00003.jpg' },
    { file: 'DSC00005.jpg' },
    { file: 'DSC00007.jpg' },
    { file: 'DSC00008.jpg' },
    { file: 'DSC00015.jpg' },
    { file: 'DSC00019.jpg' },
    { file: 'DSC00021.jpg' },
    { file: 'DSC00025.jpg' },
    { file: 'DSC00036.jpg' },
    { file: 'DSC00038.jpg' },
    { file: 'DSC00045.jpg' },
    { file: 'DSC00053.jpg' },
    { file: 'DSC00056.jpg' },
    { file: 'DSC00057.jpg' },
    { file: 'DSC00062.jpg' }
  ];

  var grid = document.getElementById('gallery-grid');
  var lightbox = document.getElementById('lightbox');
  if (!grid || !lightbox) return;

  var lbImg = document.getElementById('lightbox-img');
  var lbCounter = document.getElementById('lightbox-counter');
  var lbClose = document.getElementById('lightbox-close');
  var lbPrev = document.getElementById('lightbox-prev');
  var lbNext = document.getElementById('lightbox-next');
  if (!lbImg || !lbCounter || !lbClose || !lbPrev || !lbNext) return;

  var total = PROJECTS.length;
  var current = 0;

  var hero = document.querySelector('.gallery-hero');
  if (hero) {
    requestAnimationFrame(function () {
      hero.classList.add('is-visible');
    });
  }

  function photoAlt(index) {
    return 'Фото из портфолио Petek, Симферополь — снимок ' + (index + 1) + ' из ' + total;
  }

  PROJECTS.forEach(function (p, idx) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gallery-item';
    btn.setAttribute('role', 'listitem');
    btn.setAttribute('aria-label', 'Открыть фото ' + (idx + 1) + ' из ' + total);
    btn.dataset.index = String(idx);

    var img = document.createElement('img');
    img.src = 'img/' + p.file;
    img.alt = photoAlt(idx);
    img.loading = idx < 3 ? 'eager' : 'lazy';
    img.decoding = 'async';

    btn.appendChild(img);
    grid.appendChild(btn);
  });

  function syncLightboxMeta() {
    var p = PROJECTS[current];
    lbImg.src = 'img/' + p.file;
    lbImg.alt = photoAlt(current);
    lbCounter.textContent = current + 1 + ' / ' + total;
    var multi = total > 1;
    lbPrev.hidden = !multi;
    lbNext.hidden = !multi;
  }

  function openLightbox(idx) {
    current = idx;
    syncLightboxMeta();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    var trigger = grid.querySelector('[data-index="' + current + '"]');
    if (trigger) trigger.focus();
  }

  function showPrev() {
    if (total < 2) return;
    current = (current - 1 + total) % total;
    syncLightboxMeta();
  }

  function showNext() {
    if (total < 2) return;
    current = (current + 1) % total;
    syncLightboxMeta();
  }

  grid.addEventListener('click', function (e) {
    var item = e.target.closest('.gallery-item');
    if (item) openLightbox(parseInt(item.dataset.index, 10));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', showPrev);
  lbNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  var touchStartX = 0;
  lightbox.addEventListener(
    'touchstart',
    function (e) {
      touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  lightbox.addEventListener(
    'touchend',
    function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) dx < 0 ? showNext() : showPrev();
    },
    { passive: true }
  );
})();
