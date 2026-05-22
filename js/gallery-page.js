/* gallery-page.js — страница проектов: лайтбокс */
(function () {
  'use strict';

  var grid = document.getElementById('gallery-grid');
  var lightbox = document.getElementById('lightbox');
  if (!grid || !lightbox) return;

  var items = grid.querySelectorAll('.gallery-item');
  var lbImg = document.getElementById('lightbox-img');
  var lbCounter = document.getElementById('lightbox-counter');
  var lbClose = document.getElementById('lightbox-close');
  var lbPrev = document.getElementById('lightbox-prev');
  var lbNext = document.getElementById('lightbox-next');
  if (!items.length || !lbImg || !lbCounter || !lbClose || !lbPrev || !lbNext) return;

  var total = items.length;
  var current = 0;

  var hero = document.querySelector('.gallery-hero');
  if (hero) {
    requestAnimationFrame(function () {
      hero.classList.add('is-visible');
    });
  }

  function itemImage(index) {
    return items[index].querySelector('img');
  }

  function syncLightboxMeta() {
    var img = itemImage(current);
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
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
    items[current].focus();
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
    if (!item) return;
    openLightbox(Array.prototype.indexOf.call(items, item));
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
