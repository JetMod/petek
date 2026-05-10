/* Лайтбокс блока «Наши работы» на главной: открыть / закрыть / стрелки / свайп */
(function () {
  'use strict';

  var gallery = document.getElementById('proj-show-gallery');
  var lightbox = document.getElementById('proj-lightbox');
  if (!gallery || !lightbox) return;

  var lbImg = document.getElementById('proj-lightbox-img');
  var lbCaption = document.getElementById('proj-lightbox-caption');
  var lbCounter = document.getElementById('proj-lightbox-counter');
  var lbClose = document.getElementById('proj-lightbox-close');
  var lbPrev = document.getElementById('proj-lightbox-prev');
  var lbNext = document.getElementById('proj-lightbox-next');
  if (!lbImg || !lbCaption || !lbCounter || !lbClose || !lbPrev || !lbNext) return;

  var items = [];
  var current = 0;
  var lastFocus = null;

  function rebuildItems() {
    var triggers = gallery.querySelectorAll('.proj-collage__open');
    items = [];
    Array.prototype.forEach.call(triggers, function (btn) {
      var img = btn.querySelector('img');
      if (!img || !img.getAttribute('src')) return;
      items.push({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || ''
      });
    });
    return gallery.querySelectorAll('.proj-collage__open');
  }

  function sync() {
    var it = items[current];
    if (!it) return;
    lbImg.src = it.src;
    lbImg.alt = it.alt;
    lbCaption.textContent = it.alt;
    lbCounter.textContent = current + 1 + ' / ' + items.length;
    var multi = items.length > 1;
    lbPrev.hidden = !multi;
    lbNext.hidden = !multi;
  }

  function open(idx) {
    rebuildItems();
    if (!items.length || idx < 0 || idx >= items.length) return;
    lastFocus = document.activeElement;
    current = idx;
    sync();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') {
      try {
        lastFocus.focus();
      } catch (err) { /* ignore */ }
    }
  }

  function showPrev() {
    if (items.length < 2) return;
    current = (current - 1 + items.length) % items.length;
    sync();
  }

  function showNext() {
    if (items.length < 2) return;
    current = (current + 1) % items.length;
    sync();
  }

  gallery.addEventListener('click', function (e) {
    var btn = e.target.closest('.proj-collage__open');
    if (!btn || !gallery.contains(btn)) return;
    var triggers = rebuildItems();
    var idx = Array.prototype.indexOf.call(triggers, btn);
    if (idx >= 0) open(idx);
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', showPrev);
  lbNext.addEventListener('click', showNext);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
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
      if (Math.abs(dx) > 50) {
        if (dx < 0) showNext();
        else showPrev();
      }
    },
    { passive: true }
  );
})();
