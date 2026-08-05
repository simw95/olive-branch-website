/* ==========================================================================
   Motion — one rAF loop, transforms only, no library.
   Writes a `--p` progress value (0 → 1) onto parallax elements; CSS consumes
   it. IntersectionObserver gates what is live so the loop stays cheap.
   `prefers-reduced-motion` short-circuits everything.
   ========================================================================== */

(function () {
  'use strict';

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Reveal on entry ------------------------------------------------ */
  function initReveals() {
    var els = document.querySelectorAll('.reveal, .wipe');
    if (!els.length) { return; }

    if (reduced || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);   // reveal once, never re-hide
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  }

  /* ---- Parallax -------------------------------------------------------- */
  function initParallax() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.par'));
    if (!els.length || reduced) { return; }

    var live = [];
    var ticking = false;

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var i = live.indexOf(entry.target);
          if (entry.isIntersecting && i === -1) { live.push(entry.target); }
          if (!entry.isIntersecting && i > -1) { live.splice(i, 1); }
        });
        request();
      }, { rootMargin: '15% 0px' });
      els.forEach(function (el) { io.observe(el); });
    } else {
      live = els;
    }

    function update() {
      ticking = false;
      var vh = window.innerHeight;
      for (var i = 0; i < live.length; i++) {
        var el = live[i];
        var r = el.getBoundingClientRect();
        // 0 when the element's top hits the bottom of the viewport,
        // 1 when its bottom clears the top.
        var p = (vh - r.top) / (vh + r.height);
        el.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(4));
      }
    }

    function request() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    update();
  }

  function boot() {
    initReveals();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
