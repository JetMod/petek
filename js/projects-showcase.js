(function () {
  'use strict';

  var root = document.getElementById('projects-work-showcase');
  if (!root) return;

  var tabs = Array.prototype.slice.call(root.querySelectorAll('.proj-show__tab[data-filter]'));
  var masonry = root.querySelector('.proj-show__masonry');
  var tiles = Array.prototype.slice.call(root.querySelectorAll('.proj-show__tile[data-cats]'));
  if (!tabs.length || !tiles.length || !masonry) return;

  function parseCats(value) {
    return String(value || '')
      .split(',')
      .map(function (item) { return item.trim(); })
      .filter(Boolean);
  }

  function setActiveTab(activeTab) {
    tabs.forEach(function (tab) {
      var isActive = tab === activeTab;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.tabIndex = isActive ? 0 : -1;
    });
  }

  function applyFilter(filter) {
    var visibleCount = 0;

    if (filter === 'all') {
      masonry.classList.remove('is-filtered');
      tiles.forEach(function (tile) { tile.classList.remove('is-hidden'); });
      return;
    }

    masonry.classList.add('is-filtered');

    tiles.forEach(function (tile) {
      var cats = parseCats(tile.getAttribute('data-cats'));
      var show = cats.indexOf(filter) !== -1;
      tile.classList.toggle('is-hidden', !show);
      if (show) visibleCount += 1;
    });

    if (!visibleCount) {
      tiles.forEach(function (tile) { tile.classList.remove('is-hidden'); });
    }
  }

  function activateTab(tab) {
    var filter = tab.getAttribute('data-filter');
    if (!filter) return;
    setActiveTab(tab);
    applyFilter(filter);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activateTab(tab);
    });
  });

  root.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var activeIndex = tabs.findIndex(function (tab) { return tab.classList.contains('is-active'); });
    if (activeIndex < 0) return;

    e.preventDefault();
    var dir = e.key === 'ArrowRight' ? 1 : -1;
    var nextIndex = (activeIndex + dir + tabs.length) % tabs.length;
    var nextTab = tabs[nextIndex];
    if (!nextTab) return;
    activateTab(nextTab);
    nextTab.focus();
  });

  activateTab(tabs[0]);
})();
