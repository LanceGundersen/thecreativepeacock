(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = 'http://www.w3.org/2000/svg';
  $('#yr').textContent = new Date().getFullYear();

  /* ---------- peacock tail fan ---------- */
  const fan = $('#fan');
  const eyes = [];                         // { el, pupil, angle, max }
  const mk = (tag, attrs, parent) => {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };
  function eyeMarkup(parent, s, angle, cx, cy) {
    const g = mk('g', { class: 'eye-g', transform: `translate(${cx} ${cy}) scale(${s})` }, parent);
    mk('ellipse', { rx: 34, ry: 46, fill: '#d1239b' }, g);
    mk('ellipse', { rx: 27, ry: 37, fill: '#7a3fb0' }, g);
    mk('ellipse', { rx: 20, ry: 28, fill: '#16a79c' }, g);
    mk('ellipse', { rx: 12, ry: 18, fill: '#a6d63a' }, g);
    const p = mk('g', { class: 'pupil' }, g);
    mk('ellipse', { rx: 6.5, ry: 9.5, fill: '#190b24' }, p);
    eyes.push({ el: g, pupil: p, angle, max: 6 });
  }
  function buildFan() {
    const defs = mk('defs', {}, fan);
    const gr = mk('linearGradient', { id: 'fb', x1: 0, y1: 1, x2: 0, y2: 0 }, defs);
    mk('stop', { offset: '0', 'stop-color': '#7a3fb0', 'stop-opacity': '.05' }, gr);
    mk('stop', { offset: '.55', 'stop-color': '#16a79c', 'stop-opacity': '.45' }, gr);
    mk('stop', { offset: '1', 'stop-color': '#a6d63a', 'stop-opacity': '.55' }, gr);
    const gl = mk('radialGradient', { id: 'glow', cx: .5, cy: 1, r: .8 }, defs);
    mk('stop', { offset: '0', 'stop-color': '#d1239b', 'stop-opacity': '.38' }, gl);
    mk('stop', { offset: '1', 'stop-color': '#d1239b', 'stop-opacity': '0' }, gl);
    mk('rect', { width: 1000, height: 720, fill: 'url(#glow)' }, fan);

    const sway = mk('g', { id: 'sway' }, fan);
    const layers = [
      { n: 13, from: -82, to: 82, len: 440, s: .7, o: .55, off: 6 },
      { n: 15, from: -76, to: 76, len: 540, s: 1, o: 1, off: 0 },
    ];
    layers.forEach((L, li) => {
      for (let i = 0; i < L.n; i++) {
        const t = L.n === 1 ? 0 : i / (L.n - 1);
        const angle = L.from + t * (L.to - L.from) + L.off;
        const len = L.len + (i % 2 ? -34 : 20) + Math.cos(t * Math.PI * 2) * 12;
        const f = mk('g', { class: 'feather' }, sway);
        f.style.opacity = L.o;
        f.style.transform = `rotate(${angle}deg)`;
        f.style.transitionDelay = `${(li * 0.25 + Math.abs(t - .5) * 0.9).toFixed(2)}s`;
        mk('line', { x1: 500, y1: 710, x2: 500, y2: 710 - len, stroke: '#a6d63a', 'stroke-width': 2.2, 'stroke-opacity': .75 }, f);
        mk('ellipse', { cx: 500, cy: 710 - len * .62, rx: 40 * L.s, ry: len * .4, fill: 'url(#fb)' }, f);
        // soft barbs
        for (let b = 0; b < 7; b++) {
          const y = 710 - len * (.3 + b * .09);
          const w = (22 - b * 1.6) * L.s * 1.4;
          mk('path', { d: `M500 ${y} q ${-w} ${-14} ${-w * 1.4} ${-30} M500 ${y} q ${w} ${-14} ${w * 1.4} ${-30}`, stroke: '#16a79c', 'stroke-width': 1.3, fill: 'none', 'stroke-opacity': .5 }, f);
        }
        eyeMarkup(f, 1.15 * L.s, angle, 500, 710 - len + 54 * L.s);
      }
    });
    if (!reduce) {
      fan.classList.add('pre');
      requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => fan.classList.remove('pre'), 150)));
    }
  }
  buildFan();

  // headline "o" is also an eye
  const o = $('.eye-o');
  if (o) eyes.push({ el: o, pupil: $('.pupil', o), angle: 0, max: 7 });

  /* ---------- eyes follow the pointer ---------- */
  let px = innerWidth / 2, py = innerHeight / 2, eyeRaf = 0;
  function look() {
    eyeRaf = 0;
    for (const e of eyes) {
      const r = e.el.getBoundingClientRect();
      if (r.bottom < -50 || r.top > innerHeight + 50) continue;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      let dx = px - cx, dy = py - cy;
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 260);
      dx = (dx / d) * k; dy = (dy / d) * k;
      const a = -e.angle * Math.PI / 180;            // undo the feather's rotation
      const lx = dx * Math.cos(a) - dy * Math.sin(a);
      const ly = dx * Math.sin(a) + dy * Math.cos(a);
      e.pupil.setAttribute('transform', `translate(${(lx * e.max).toFixed(2)} ${(ly * e.max * 1.2).toFixed(2)})`);
    }
    fan.style.transform = `rotate(${(((px / innerWidth) - .5) * 3).toFixed(2)}deg)`;
  }
  if (fine && !reduce) {
    addEventListener('pointermove', ev => {
      px = ev.clientX; py = ev.clientY;
      if (!eyeRaf) eyeRaf = requestAnimationFrame(look);
    }, { passive: true });
    fan.style.transformOrigin = '50% 100%';
    fan.style.transition = 'transform .6s var(--ease)';
    look();
  }

  /* ---------- custom cursor ---------- */
  if (fine) {
    const c = $('.cursor');
    let x = 0, y = 0, tx = 0, ty = 0;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; c.classList.add('on'); }, { passive: true });
    document.addEventListener('pointerleave', () => c.classList.remove('on'));
    (function loop() { x += (tx - x) * 0.22; y += (ty - y) * 0.22; c.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(loop); })();
    $$('a,button').forEach(el => {
      el.addEventListener('pointerenter', () => c.classList.add('big'));
      el.addEventListener('pointerleave', () => c.classList.remove('big'));
    });
  }

  /* ---------- manifesto word reveal ---------- */
  const words = $('[data-words]');
  let wordEls = [];
  if (words) {
    const hot = new Set(['magic', 'nerve']);
    wordEls = words.textContent.trim().split(/\s+/).map(t => {
      const s = document.createElement('span');
      s.className = 'w' + (hot.has(t.replace(/[^a-z]/gi, '').toLowerCase()) ? ' hot' : '');
      s.textContent = t + ' ';
      return s;
    });
    words.textContent = '';
    wordEls.forEach(s => words.appendChild(s));
  }
  function lightWords() {
    if (!words) return;
    const r = words.getBoundingClientRect(), vh = innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
    const n = Math.round(p * wordEls.length);
    wordEls.forEach((w, i) => w.classList.toggle('lit', reduce || i < n));
  }

  /* ---------- parallax ---------- */
  const par = $$('[data-parallax]');
  function parallax() {
    if (reduce) return;
    par.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) return;
      const mid = r.top + r.height / 2 - innerHeight / 2;
      el.style.transform = `translate3d(0,${(-mid * (parseFloat(el.dataset.parallax) || .2)).toFixed(1)}px,0)`;
    });
  }
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { lightWords(); parallax(); ticking = false; });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- polaroids drop in ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.18 });
  $$('.polaroid').forEach((p, i) => { p.style.transitionDelay = `${(i % 3) * 0.12}s`; io.observe(p); });

  /* ---------- book cover tilt ---------- */
  const tilt = $('[data-tilt]');
  if (tilt && fine && !reduce) {
    const img = $('img', tilt);
    tilt.addEventListener('pointermove', e => {
      const r = tilt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      img.style.transform = `rotateY(${(x * 14).toFixed(1)}deg) rotateX(${(-y * 10).toFixed(1)}deg) rotate(-1deg) scale(1.02)`;
    });
    tilt.addEventListener('pointerleave', () => { img.style.transform = ''; });
  }
})();
