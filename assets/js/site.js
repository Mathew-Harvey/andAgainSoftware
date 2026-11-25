/*
 * andAgainSoftware site script. Plain JavaScript, no dependencies, shared by both pages.
 *
 * It does five small jobs, each driven by a data attribute in the page:
 *   data-t="key"       text that changes when WebFPV launches on Steam (see TEXT)
 *   data-cd="dd|hh|mm" the countdown digits
 *   data-when="..."    a block shown only in one state (before, after, playing, pausedNow, trailerIdle)
 *   data-act="..."     a button: motion (pause and play the loops), trailer, req (system requirements)
 *   data-trailer       the trailer video, which plays with sound only when asked
 *
 * The page reads correctly with this script off: it shows the wording from before launch and
 * the loops stay on their poster frames.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-site]');
  if (!root) return;

  /* WebFPV's Steam launch: midnight on 27 November 2026 in the visitor's own time zone.
   * Change this one line if Steam unlocks at a different moment. */
  var LAUNCH = new Date(2026, 10, 27).getTime();

  /* key: [before launch, after launch].   is a no-break space. */
  var TEXT = {
    steamLabel: ['Wishlist on Steam', 'Buy on Steam'],
    steamShort: ['Wishlist', 'Buy'],
    steamSub: ['USD\u00a09.99, out 27\u00a0November', 'USD\u00a09.99, out now'],
    stripSteam: ['On Steam 27 November.', 'On Steam for USD 9.99.'],
    edStep: ['27 November', 'Out now'],
    ctaWhen: ['On Steam 27 November.', 'Out now on Steam.'],
    endWhen: ['27 November.', 'Out now.'],
    cvTag: ['Free now', 'Out now'],
    wfSteamLine: [
      'The Steam edition, for Windows, has lower latency and works offline. It comes out on 27 November for USD 9.99.',
      'The Steam edition, for Windows, has lower latency and works offline. It is out now for USD 9.99.'
    ],
    nextUp: [
      'WebFPV lands on Steam on 27 November, for USD 9.99.',
      'WebFPV is out on Steam, for Windows, for USD 9.99.'
    ]
  };

  function all(sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function setText(el, t) { if (el.textContent !== t) el.textContent = t; }

  var trailer = root.querySelector('[data-trailer]');
  var loops = all('video').filter(function (v) { return v !== trailer; });
  var state = { paused: false, trailerOn: false };

  /* Motion starts off for anyone who has asked their system for less of it, or for less data.
   * Their own choice on this site, once made, wins. */
  try {
    var saved = window.localStorage.getItem('andagain-motion');
    var less = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var lean = navigator.connection && navigator.connection.saveData;
    state.paused = saved ? saved === 'off' : !!(less || lean);
  } catch (e) { /* private windows can refuse storage; the default stands */ }

  function show(name, on) {
    all('[data-when="' + name + '"]').forEach(function (el) { el.hidden = !on; });
  }

  /* Loops play only while they are on screen and motion is on. */
  function motion() {
    root.classList.toggle('still', state.paused);
    show('playing', !state.paused);
    show('pausedNow', state.paused);
    loops.forEach(function (v) {
      if (!state.paused && v.__seen) {
        v.muted = true;
        if (v.paused) {
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        }
      } else if (!v.paused) {
        v.pause();
      }
    });
  }

  if (typeof IntersectionObserver === 'function') {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.__seen = en.isIntersecting; });
      motion();
    }, { rootMargin: '160px' });
    loops.forEach(function (v) { io.observe(v); });
  } else {
    loops.forEach(function (v) { v.__seen = true; });
  }

  /* The launch switch and the countdown. */
  function tick() {
    var left = Math.max(0, LAUNCH - Date.now());
    var out = left <= 0;
    var mins = Math.floor(left / 60000);
    var cd = { dd: pad(Math.floor(mins / 1440)), hh: pad(Math.floor((mins % 1440) / 60)), mm: pad(mins % 60) };
    all('[data-t]').forEach(function (el) {
      var pair = TEXT[el.getAttribute('data-t')];
      if (pair) setText(el, pair[out ? 1 : 0]);
    });
    all('[data-cd]').forEach(function (el) { setText(el, cd[el.getAttribute('data-cd')]); });
    show('before', !out);
    show('after', out);
  }

  root.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!b) return;
    var act = b.getAttribute('data-act');
    if (act === 'motion') {
      state.paused = !state.paused;
      try { window.localStorage.setItem('andagain-motion', state.paused ? 'off' : 'on'); } catch (err) { /* see above */ }
      motion();
    } else if (act === 'trailer' && trailer) {
      trailer.muted = false;
      trailer.controls = true;
      var p = trailer.play();
      if (p && p.catch) p.catch(function () {});
      state.trailerOn = true;
      show('trailerIdle', false);
      trailer.focus();
    } else if (act === 'req') {
      var box = b.closest('.rq');
      var open = box ? box.classList.toggle('open') : false;
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
      setText(b, open ? 'Hide the requirements' : 'Show the requirements');
    }
  });

  tick();
  motion();
  setInterval(tick, 30000);
})();
