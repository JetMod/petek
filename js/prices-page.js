/* prices-page.js — hero Ken Burns (.is-visible), sticky anchor nav */
(function () {
  var hero = document.querySelector('.page-hero');
  if (hero) {
    requestAnimationFrame(function () {
      hero.classList.add('is-visible');
    });
  }
})();

(function () {
  var nav = document.getElementById('prices-anchor-nav');
  if (!nav) return;

  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var pairs = links
    .map(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      return section ? { link: link, section: section } : null;
    })
    .filter(Boolean);

  if (!pairs.length) return;

  function setActive(id) {
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      var on = href === '#' + id;
      link.classList.toggle('is-active', on);
      if (on) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function update() {
    var navH = nav.offsetHeight;
    var y = window.scrollY + navH + 20;
    var current = pairs[0];
    for (var i = 0; i < pairs.length; i++) {
      var el = pairs[i].section;
      var top = window.scrollY + el.getBoundingClientRect().top;
      if (top <= y) current = pairs[i];
    }
    setActive(current.section.id);
  }

  var scheduled = false;
  function onScroll() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      update();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
})();
