/* ---- Stat counter: count up on first viewport entry ---- */
(function () {
  var counters = document.querySelectorAll('.top-hero__stat-value[data-count]');
  if (!counters.length) return;

  var ease = function (t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  var animateCounter = function (el) {
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || '';
    var duration = 1400;
    var start = null;

    var step = function (ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(ease(progress) * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };

    requestAnimationFrame(step);
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ---- Hero background slideshow ---- */
(function () {
  var slides = document.querySelectorAll('.top-hero__slide');
  if (slides.length < 2) return;

  var current = 0;
  var zoomOutNext = false;

  function restartAnimation(el, useZoomOut) {
    el.classList.remove('is-active', 'zoom-out');
    void el.offsetWidth; // force reflow to restart animation
    el.classList.add('is-active');
    if (useZoomOut) el.classList.add('zoom-out');
  }

  restartAnimation(slides[0], false);

  setInterval(function () {
    slides[current].classList.remove('is-active', 'zoom-out');
    current = (current + 1) % slides.length;
    zoomOutNext = !zoomOutNext;
    restartAnimation(slides[current], zoomOutNext);
  }, 6000);
})();
