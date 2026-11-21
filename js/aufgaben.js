/* KI-Dorf: Aufgabentypen.
   Regel für alle: erster Fehlversuch = Hinweis, zweiter Fehlversuch = Auflösung mit Begründung. Jede richtige Antwort bekommt ein „Warum“.
   Alles geht mit Maus, Finger und Tastatur. Ziehen ist nie der einzige Weg (WCAG 2.2, 2.5.7). */
(function () {
'use strict';
var KD = window.KD, h = KD.h, S = KD.S, T = {};
var FB = {ok: ['haken', 'Richtig.'], hint: ['hilfe', 'Hinweis:'], solved: ['pfeil', 'Aufgelöst:'], bad: ['x', 'Noch nicht.']};

function fb(kind, text) { return h('p', {class: 'fb fb-' + kind}, KD.icon(FB[kind][0]), h('strong', null, FB[kind][1] + ' '), text); }
function say(t) { if (KD.say) { KD.say(t); } }
function shuffle(arr, seed) { var a = arr.slice(), s = seed || 7; for (var i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; var j = Math.floor(s / 233280 * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
function seedOf(str) { var s = 0; for (var i = 0; i < str.length; i++) { s = (s * 31 + str.charCodeAt(i)) % 100000; } return s + 1; }
function btn(cls, label, fn, attrs) { var a = {class: cls, type: 'button', onclick: fn}; for (var k in attrs || {}) { a[k] = attrs[k]; } return h('button', a, label); }
function isDone(ctx, cid) { return !ctx.round && S.hs(ctx.hid).s[cid]; }
function finish(ctx, cid, first) { S.record(cid, first, ctx.round); if (ctx.onUnit) { ctx.onUnit(cid, first); } }

/* ---------- Zuordnen: ziehen oder Karte und Ziel antippen ---------- */
T.sort = function (root, t, ctx) {
  var only = ctx.only, items = t.items.map(function (it, i) { return {it: it, i: i, tries: 0}; }).filter(function (x) { return !only || only.indexOf(x.i) >= 0; });
  var order = ctx.round ? items : shuffle(items, seedOf(ctx.hid + ctx.ti));
  var sel = null, bins = [], stack = h('ul', {class: 'cards'}), status = h('p', {class: 'small', role: 'status'});
  var binRow = h('div', {class: 'bins bins-' + t.cats.length, role: 'group', 'aria-label': 'Ziele'});
  t.cats.forEach(function (c, ci) {
    var list = h('ul', {class: 'binlist'}), col = t.colors ? ' amp-' + t.colors[ci] : '';
    var b = btn('bin' + col, [t.colors ? h('span', {class: 'ampdot' + col, 'aria-hidden': 'true'}) : null, h('span', {class: 'binname'}, c)], function () { if (sel) { place(sel, ci); } else { status.textContent = 'Wähle zuerst eine Karte, dann das Ziel.'; } }, {'data-bin': ci});
    bins.push({b: b, list: list});
    binRow.appendChild(h('div', {class: 'bincol'}, b, list));
  });
  function cardEl(x) {
    var body = [h('span', {class: 'ctext'}, x.it.q)];
    (x.it.d || []).forEach(function (d) { body.push(h('span', {class: 'cdet'}, h('span', {class: 'tag'}, d[0]), ' ', d[1])); });
    var b = btn('card', body, function () { pick(x); }, {'aria-pressed': 'false'});
    x.el = h('li', {class: 'cardwrap'}, b); x.btn = b; x.note = h('div', {class: 'cnote'}); x.el.appendChild(x.note);
    drag(x);
    return x.el;
  }
  function pick(x) { if (sel) { sel.btn.setAttribute('aria-pressed', 'false'); } sel = sel === x ? null : x; if (sel) { sel.btn.setAttribute('aria-pressed', 'true'); status.textContent = 'Karte gewählt. Jetzt das Ziel antippen.'; } else { status.textContent = ''; } }
  function settle(x, ci, kind) {
    var cid = ctx.hid + '.' + ctx.ti + '.' + x.i;
    if (x.el.parentNode) { x.el.parentNode.removeChild(x.el); }
    bins[ci].list.appendChild(h('li', {class: 'placed placed-' + kind}, h('span', {class: 'ptext'}, x.it.q), fb(kind === 'ok' ? 'ok' : 'solved', x.it.why)));
    x.done = true; sel = null;
    if (kind !== 'old') { finish(ctx, cid, kind === 'ok' && x.tries === 0); }
    var left = order.filter(function (o) { return !o.done; });
    status.textContent = left.length ? 'Noch ' + left.length + (left.length === 1 ? ' Karte.' : ' Karten.') : 'Alle Karten zugeordnet.';
    say(kind === 'ok' ? 'Richtig. ' + x.it.why : 'Aufgelöst: ' + t.cats[ci] + '. ' + x.it.why);
    if (left.length) { left[0].btn.focus(); } else { bins[ci].b.focus(); if (ctx.onAll) { ctx.onAll(); } }
  }
  function place(x, ci) {
    if (ci === x.it.a) { settle(x, ci, 'ok'); return; }
    x.tries += 1;
    if (x.tries >= 2) { settle(x, x.it.a, 'solved'); return; }
    KD.clear(x.note).appendChild(fb('hint', x.it.hint || t.hint || 'Lies die Karte noch einmal genau.'));
    x.btn.setAttribute('aria-pressed', 'false'); sel = null; x.btn.focus();
    say('Noch nicht. Hinweis: ' + (x.it.hint || t.hint || ''));
  }
  /* Ziehen mit Zeiger: ab 8 Pixel Bewegung, Ablegen auf einem Ziel */
  function drag(x) {
    var st = null;
    x.btn.addEventListener('pointerdown', function (e) { if (e.button > 0) { return; } st = {x: e.clientX, y: e.clientY, on: false, id: e.pointerId}; try { x.btn.setPointerCapture(e.pointerId); } catch (er) { /* ohne Capture geht Antippen weiterhin */ } });
    x.btn.addEventListener('pointermove', function (e) {
      if (!st || e.pointerId !== st.id) { return; }
      var dx = e.clientX - st.x, dy = e.clientY - st.y;
      if (!st.on && Math.hypot(dx, dy) > 8) { st.on = true; x.btn.classList.add('dragging'); }
      if (st.on) { x.btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; e.preventDefault(); }
    });
    var end = function (e) {
      if (!st) { return; }
      var was = st.on; st = null; x.btn.classList.remove('dragging'); x.btn.style.transform = '';
      if (!was) { return; }
      x.skip = true; setTimeout(function () { x.skip = false; }, 0);
      var under = document.elementFromPoint(e.clientX, e.clientY), b = under && under.closest ? under.closest('.bincol') : null;
      if (b) { place(x, +b.querySelector('.bin').getAttribute('data-bin')); }
    };
    x.btn.addEventListener('pointerup', end); x.btn.addEventListener('pointercancel', end);
    x.btn.addEventListener('click', function (e) { if (x.skip) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
  }
  order.forEach(function (x) {
    var cid = ctx.hid + '.' + ctx.ti + '.' + x.i;
    if (isDone(ctx, cid)) { x.done = true; bins[x.it.a].list.appendChild(h('li', {class: 'placed placed-ok'}, h('span', {class: 'ptext'}, x.it.q), fb('ok', x.it.why))); }
    else { stack.appendChild(cardEl(x)); }
  });
  var open = order.filter(function (o) { return !o.done; }).length;
  if (!open) { status.textContent = 'Alle Karten zugeordnet.'; }
  KD.add(root, [open ? h('p', {class: 'small'}, 'Erst Karte, dann Ziel wählen.') : null, stack, status, binRow]);
};

/* ---------- Finde den Fehler: Stellen markieren ---------- */
T.mark = function (root, t, ctx) {
  if (ctx.only) { return markOne(root, t, ctx); }
  var round = 0, rows = t.items.map(function (it, i) { return {it: it, i: i, cid: ctx.hid + '.' + ctx.ti + '.' + i}; });
  var text = h('div', {class: 'letter'}), out = h('div', {class: 'fbwrap'}), go = btn('btn', 'Prüfen', check);
  rows.forEach(function (r) {
    r.btn = btn('sent', r.it.t, function () { if (r.lock) { return; } var on = r.btn.getAttribute('aria-pressed') !== 'true'; r.btn.setAttribute('aria-pressed', on ? 'true' : 'false'); }, {'aria-pressed': 'false'});
    r.note = h('span', {class: 'sentnote'});
    if (isDone(ctx, r.cid)) { lock(r, true); }
    text.appendChild(h('div', {class: 'sentrow'}, r.btn, r.note));
  });
  function lock(r, quiet) {
    r.lock = true; r.btn.setAttribute('aria-pressed', r.it.bad ? 'true' : 'false'); r.btn.setAttribute('aria-disabled', 'true'); r.btn.classList.add(r.it.bad ? 'is-bad' : 'is-fine');
    if (r.it.why) { KD.clear(r.note).appendChild(fb(quiet || r.first ? 'ok' : 'solved', (r.it.bad ? t.label + ': ' : 'In Ordnung: ') + r.it.why)); }
    else { KD.add(r.btn, [KD.icon('haken'), h('span', {class: 'sr'}, ', in Ordnung')]); }
  }
  function check() {
    round += 1;
    var wrong = rows.filter(function (r) { return !r.lock && ((r.btn.getAttribute('aria-pressed') === 'true') !== !!r.it.bad); });
    rows.forEach(function (r) { if (r.lock) { return; } var ok = (r.btn.getAttribute('aria-pressed') === 'true') === !!r.it.bad; if (ok || round >= 2) { r.first = ok && round === 1; lock(r); finish(ctx, r.cid, r.first); } });
    KD.clear(out);
    if (wrong.length && round < 2) { out.appendChild(fb('hint', wrong.length + (wrong.length === 1 ? ' Stelle stimmt' : ' Stellen stimmen') + ' noch nicht. ' + (t.hint || ''))); say(wrong.length + ' Stellen stimmen noch nicht.'); }
    else { go.hidden = true; out.appendChild(fb('ok', 'Alle Stellen sind aufgelöst.')); say('Alle Stellen sind aufgelöst.'); if (ctx.onAll) { ctx.onAll(); } }
  }
  if (rows.every(function (r) { return r.lock; })) { go.hidden = true; }
  KD.add(root, [text, go, out]);
};
function markOne(root, t, ctx) {
  var i = ctx.only[0], it = t.items[i], cid = ctx.hid + '.' + ctx.ti + '.' + i, tries = 0, out = h('div', {class: 'fbwrap'});
  var row = h('div', {class: 'choices'});
  function ans(v) {
    if (v === !!it.bad) { end(tries === 0); return; }
    tries += 1; if (tries >= 2) { end(false); return; }
    KD.clear(out).appendChild(fb('hint', t.hint || 'Lies den Satz noch einmal.'));
  }
  function end(first) { KD.clear(out).appendChild(fb(first ? 'ok' : 'solved', it.why ? (it.bad ? t.label + ': ' : 'In Ordnung: ') + it.why : 'Der Satz ist in Ordnung.')); row.hidden = true; finish(ctx, cid, first); if (ctx.onAll) { ctx.onAll(); } }
  row.appendChild(btn('choice', 'Ja, ' + t.label), null); row.lastChild.addEventListener('click', function () { ans(true); });
  row.appendChild(btn('choice', 'Nein, in Ordnung'), null); row.lastChild.addEventListener('click', function () { ans(false); });
  KD.add(root, [h('p', {class: 'quote'}, it.t), h('p', {class: 'small'}, 'Ist das ' + t.label + '?'), row, out]);
}

/* ---------- Szenario: Entscheidungen mit Folgen ---------- */
T.scenario = function (root, t, ctx) {
  var idx = ctx.only ? ctx.only[0] : 0, wrap = h('div', {class: 'scen'});
  function show(i, focus) {
    var st = t.steps[i], cid = ctx.hid + '.' + ctx.ti + '.' + i, tries = 0, out = h('div', {class: 'fbwrap'}), opts = h('div', {class: 'choices col'});
    var box = h('div', {class: 'scenstep'}, h('p', {class: 'scentag'}, ctx.only ? 'Entscheidung' : 'Entscheidung ' + (i + 1) + ' von ' + t.steps.length), h('p', {class: 'scentext'}, st.t), opts, out);
    var done = isDone(ctx, cid);
    shuffle(st.opts, seedOf(cid)).forEach(function (o) {
      var b = btn('choice', o.t, function () {
        if (o.ok) { KD.clear(out).appendChild(fb('ok', o.fb)); lockAll(b); finish(ctx, cid, tries === 0); next(); }
        else { tries += 1; b.disabled = true; b.classList.add('is-wrong'); KD.clear(out).appendChild(fb('bad', o.fb)); say('Noch nicht. ' + o.fb); }
      });
      if (done) { b.disabled = true; if (o.ok) { b.classList.add('is-right'); } }
      opts.appendChild(b);
    });
    function lockAll(right) { Array.prototype.forEach.call(opts.children, function (c) { c.disabled = true; }); right.classList.add('is-right'); }
    function next() {
      if (!ctx.only && i + 1 < t.steps.length) {
        var onward = btn('btn next-action', ['Zur nächsten Entscheidung ', KD.icon('pfeil')], function () { onward.remove(); show(i + 1, true); });
        out.appendChild(onward);
        onward.focus();
      } else if (ctx.onAll) { ctx.onAll(); }
    }
    wrap.appendChild(box);
    if (focus) { var prompt = box.querySelector('.scentext'); prompt.tabIndex = -1; prompt.focus(); }
    if (done && !ctx.only && i + 1 < t.steps.length) { show(i + 1); }
  }
  show(idx);
  root.appendChild(wrap);
};

/* ---------- Reihenfolge ---------- */
T.order = function (root, t, ctx) {
  var cid = ctx.hid + '.' + ctx.ti + '.x', round = 0, out = h('div', {class: 'fbwrap'}), list = h('ol', {class: 'orderlist'});
  var cur = isDone(ctx, cid) ? t.items.map(function (x, i) { return i; }) : shuffle(t.items.map(function (x, i) { return i; }), seedOf(cid));
  if (cur.every(function (v, i) { return v === i; })) { cur.push(cur.shift()); }
  var go = btn('btn', 'Prüfen', check), locked = isDone(ctx, cid);
  function draw(focusKey) {
    KD.clear(list);
    cur.forEach(function (v, pos) {
      var up = btn('mini', KD.icon('auf'), function () { move(pos, -1); }, {'aria-label': 'Nach oben: ' + t.items[v], disabled: locked || pos === 0, 'data-k': v + 'u'});
      var dn = btn('mini', KD.icon('ab'), function () { move(pos, 1); }, {'aria-label': 'Nach unten: ' + t.items[v], disabled: locked || pos === cur.length - 1, 'data-k': v + 'd'});
      list.appendChild(h('li', {class: 'orderitem' + (locked ? ' is-fine' : '')}, h('span', {class: 'otext'}, t.items[v]), h('span', {class: 'omove'}, up, dn)));
    });
    if (focusKey) { var f = list.querySelector('[data-k="' + focusKey + '"]'); if (f && !f.disabled) { f.focus(); } else { var alt = list.querySelector('[data-k="' + focusKey.slice(0, -1) + (focusKey.slice(-1) === 'u' ? 'd' : 'u') + '"]'); if (alt) { alt.focus(); } } }
  }
  function move(pos, d) { var v = cur[pos]; cur.splice(pos, 1); cur.splice(pos + d, 0, v); draw(v + (d < 0 ? 'u' : 'd')); say(t.items[v] + ': jetzt an Stelle ' + (pos + d + 1)); }
  function check() {
    round += 1;
    var right = cur.filter(function (v, i) { return v === i; }).length;
    KD.clear(out);
    if (right === cur.length) { end(round === 1); }
    else if (round < 2) { out.appendChild(fb('hint', right + ' von ' + cur.length + ' stehen an der richtigen Stelle. ' + (t.hint || ''))); say(right + ' von ' + cur.length + ' stehen richtig.'); }
    else { cur = t.items.map(function (x, i) { return i; }); end(false); }
  }
  function end(first) { locked = true; go.hidden = true; draw(); out.appendChild(fb(first ? 'ok' : 'solved', t.why)); finish(ctx, cid, first); if (ctx.onAll) { ctx.onAll(); } }
  if (locked) { go.hidden = true; out.appendChild(fb('ok', t.why)); }
  draw();
  KD.add(root, [locked ? null : h('p', {class: 'small'}, 'Sortiere die Schritte mit den Pfeiltasten neben der Liste.'), list, go, out]);
};

/* ---------- Lückentext: Wort wählen, Lücke antippen ---------- */
T.cloze = function (root, t, ctx) {
  var cid = ctx.hid + '.' + ctx.ti + '.x', round = 0, sel = null, fill = [], locked = isDone(ctx, cid);
  var para = h('p', {class: 'cloze'}), pool = h('div', {class: 'pool', role: 'group', 'aria-label': 'Wörter'}), out = h('div', {class: 'fbwrap'}), go = btn('btn', 'Prüfen', check), blanks = [];
  var words = shuffle(t.blanks.concat(t.pool || []), seedOf(cid)).map(function (w) { return {w: w, used: false}; });
  t.text.split(/(\{\d+\})/).forEach(function (part) {
    var m = /^\{(\d+)\}$/.exec(part);
    if (!m) { para.appendChild(document.createTextNode(part)); return; }
    var n = +m[1], b = btn('blank', '', function () { tapBlank(n); }, {'aria-label': 'Lücke ' + (n + 1) + ', leer'});
    blanks[n] = b; para.appendChild(b);
  });
  function drawPool() {
    KD.clear(pool);
    words.forEach(function (o) { if (o.used) { return; } o.b = btn('chipbtn', o.w, function () { sel = sel === o ? null : o; drawPool(); if (sel && sel.b) { sel.b.focus(); } }, {'aria-pressed': sel === o ? 'true' : 'false', disabled: locked}); pool.appendChild(o.b); });
  }
  function setBlank(n, o) { fill[n] = o; blanks[n].textContent = o ? o.w : ''; blanks[n].setAttribute('aria-label', 'Lücke ' + (n + 1) + (o ? ': ' + o.w : ', leer')); blanks[n].classList.toggle('filled', !!o); }
  function tapBlank(n) {
    if (locked || blanks[n].classList.contains('is-fine')) { return; }
    if (fill[n]) { fill[n].used = false; setBlank(n, null); }
    if (sel) { sel.used = true; setBlank(n, sel); sel = null; }
    drawPool();
  }
  function check() {
    round += 1; var wrong = 0;
    t.blanks.forEach(function (w, n) {
      if (fill[n] && fill[n].w === w) { blanks[n].classList.add('is-fine'); }
      else { wrong += 1; if (fill[n]) { fill[n].used = false; setBlank(n, null); } }
    });
    KD.clear(out);
    if (!wrong) { end(round === 1); }
    else if (round < 2) { out.appendChild(fb('hint', wrong + (wrong === 1 ? ' Lücke stimmt' : ' Lücken stimmen') + ' noch nicht. ' + (t.hint || ''))); drawPool(); say(wrong + ' Lücken stimmen noch nicht.'); }
    else { end(false); }
  }
  function end(first) { locked = true; go.hidden = true; t.blanks.forEach(function (w, n) { setBlank(n, {w: w}); blanks[n].classList.add('is-fine'); }); KD.clear(pool); out.appendChild(fb(first ? 'ok' : 'solved', t.why)); finish(ctx, cid, first); if (ctx.onAll) { ctx.onAll(); } }
  if (locked) { t.blanks.forEach(function (w, n) { setBlank(n, {w: w}); blanks[n].classList.add('is-fine'); }); go.hidden = true; out.appendChild(fb('ok', t.why)); } else { drawPool(); }
  KD.add(root, [locked ? null : h('p', {class: 'small'}, 'Erst Wort, dann Lücke wählen.'), para, pool, go, out]);
};

/* ---------- Paare finden: Begriff und Erklärung, in kleinen Runden ---------- */
T.pairs = function (root, t, ctx) {
  var cid = ctx.hid + '.' + ctx.ti + '.x', errors = 0, wrap = h('div'), done = isDone(ctx, cid);
  var rounds = [], per = 5; for (var i = 0; i < t.pairs.length; i += per) { rounds.push({name: 'Runde ' + (rounds.length + 1), list: t.pairs.slice(i, i + per)}); }
  var nPflicht = rounds.length; if (t.bonus && t.bonus.length) { rounds.push({name: 'Bonusrunde', list: t.bonus, bonus: true}); }
  function show(ri) {
    KD.clear(wrap);
    var R = rounds[ri], sel = null, left = h('div', {class: 'pcol'}), right = h('div', {class: 'pcol'}), out = h('div', {class: 'fbwrap', role: 'status'}), open = R.list.length;
    var defs = shuffle(R.list.map(function (p, i) { return i; }), seedOf(cid + ri));
    var L = R.list.map(function (p, i) { var b = btn('pair term', p[0], function () { if (sel) { L[sel.i].setAttribute('aria-pressed', 'false'); } sel = {i: i, tries: (sel && sel.i === i ? sel.tries : 0)}; b.setAttribute('aria-pressed', 'true'); }, {'aria-pressed': 'false'}); left.appendChild(b); return b; });
    var tries = {};
    defs.forEach(function (di) {
      var b = btn('pair def', R.list[di][1], function () {
        if (!sel) { KD.clear(out).appendChild(fb('hint', 'Wähle zuerst links einen Begriff.')); return; }
        var ti = sel.i;
        if (ti === di) { match(ti, b, true); }
        else { errors += 1; tries[ti] = (tries[ti] || 0) + 1;
          if (tries[ti] >= 2) { var target = right.querySelector('[data-d="' + ti + '"]'); match(ti, target, false); }
          else { KD.clear(out).appendChild(fb('hint', 'Das passt nicht zu „' + R.list[ti][0] + '“. Versuch es noch einmal.')); } }
      }, {'data-d': di});
      right.appendChild(b);
    });
    function match(ti, defBtn, ok) {
      L[ti].disabled = true; defBtn.disabled = true; L[ti].classList.add('is-fine'); defBtn.classList.add('is-fine'); L[ti].setAttribute('aria-pressed', 'false');
      var number = R.list.length - open + 1;
      [L[ti], defBtn].forEach(function (b) {
        b.prepend(h('span', {class: 'pair-number'}, h('span', {class: 'sr'}, 'Paar '), String(number)));
      });
      KD.clear(out).appendChild(fb(ok ? 'ok' : 'solved', 'Paar ' + number)); sel = null; open -= 1;
      if (!open) { roundDone(); } else { var nx = L.filter(function (x) { return !x.disabled; })[0]; if (nx) { nx.focus(); } }
    }
    function roundDone() {
      var last = ri + 1 >= rounds.length, nextBonus = !last && rounds[ri + 1].bonus;
      if (ri + 1 === nPflicht && !done) { done = true; finish(ctx, cid, errors === 0); if (ctx.onAll) { ctx.onAll(); } }
      if (!last) { var nb = btn('btn' + (nextBonus ? ' ghost' : ' next-action'), nextBonus ? 'Bonusrunde spielen (freiwillig)' : 'Weiter zu ' + rounds[ri + 1].name, function () { show(ri + 1); }); out.appendChild(nb); if (!nextBonus || ctx.round) { nb.focus(); } }
      else if (R.bonus) { say('Bonusrunde beendet.'); }
    }
    KD.add(wrap, [h('p', {class: 'scentag'}, R.name + ' · ' + R.list.length + ' Paare'), h('div', {class: 'pairs'}, left, right), out]);
  }
  if (done) { wrap.appendChild(fb('ok', 'Pflichtrunden geschafft.')); wrap.appendChild(btn('btn ghost', 'Noch einmal spielen', function () { errors = 0; show(0); })); if (t.bonus) { wrap.appendChild(btn('btn ghost', 'Bonusrunde spielen (freiwillig)', function () { show(rounds.length - 1); })); } }
  else { show(0); }
  root.appendChild(wrap);
};

/* ---------- Prompt-Werkstatt ---------- */
T.build = function (root, t, ctx) {
  var cid = ctx.hid + '.' + ctx.ti + '.x', errors = 0, chosen = [], open = t.slots.length, done = isDone(ctx, cid);
  var pre = h('pre', {class: 'promptout', 'aria-label': 'Dein Prompt'}), end = h('div', {class: 'buildend'}), rows = h('div', {class: 'slots'});
  function drawPre() { pre.textContent = chosen.filter(Boolean).join('\n') || '…'; }
  t.slots.forEach(function (sl, si) {
    var tries = 0, out = h('div', {class: 'fbwrap'}), opts = h('div', {class: 'choices col'});
    var order = seedOf(cid + si) % 2 ? [0, 1] : [1, 0];
    order.forEach(function (oi) {
      var b = btn('choice', sl.opts[oi], function () {
        if (oi === sl.a) { lock(tries === 0); }
        else { tries += 1; errors += 1; b.disabled = true; b.classList.add('is-wrong'); KD.clear(out).appendChild(fb('hint', 'Mit dieser Fassung müsste die KI raten. Welche Angabe fehlt ihr?')); if (sl.opts.length === 2) { lock(false); } }
      }, {'data-o': oi});
      opts.appendChild(b);
    });
    function lock(first) {
      Array.prototype.forEach.call(opts.children, function (c) { c.disabled = true; if (+c.getAttribute('data-o') === sl.a) { c.classList.add('is-right'); } });
      KD.clear(out).appendChild(fb(first ? 'ok' : 'solved', sl.why)); chosen[si] = sl.opts[sl.a]; drawPre(); open -= 1;
      if (!open) { finishAll(); }
    }
    rows.appendChild(h('div', {class: 'slot'}, h('h5', null, sl.k), opts, out));
    if (done) { lock(true); }
  });
  function finishAll() {
    if (!done) { done = true; finish(ctx, cid, errors === 0); if (ctx.onAll) { ctx.onAll(); } }
    var msg = h('p', {class: 'small', role: 'status'});
    KD.clear(end);
    KD.add(end, [h('h5', null, 'Was dabei typischerweise herauskommt'), h('p', null, t.result),
      h('p', {class: 'small'}, 'Das Spiel fragt keine KI. Die Beschreibung ist ein Erfahrungswert und kein echtes Ergebnis.'),
      h('fieldset', {class: 'checks'}, h('legend', null, 'Selbstcheck für deine eigenen Prompts'), t.criteria.map(function (c) { return h('label', {class: 'chk'}, h('input', {type: 'checkbox'}), h('span', null, c)); })),
      btn('btn ghost', [KD.icon('kopie'), ' Prompt kopieren'], function () { KD.copy(pre.textContent, msg, 'Prompt kopiert.'); }), msg]);
  }
  drawPre();
  KD.add(root, [h('div', {class: 'weak'}, h('span', {class: 'tag'}, 'Schwacher Prompt'), h('p', null, t.weak)), rows, h('div', {class: 'strong'}, h('span', {class: 'tag'}, 'Dein Prompt'), pre), end]);
};

/* ---------- Mini-Simulationen ---------- */
function sw(label, on, fn, dis) { var b = btn('switch', [h('span', {class: 'knob', 'aria-hidden': 'true'}), h('span', null, label)], function () { var v = b.getAttribute('aria-checked') !== 'true'; b.setAttribute('aria-checked', v ? 'true' : 'false'); fn(v); }, {role: 'switch', 'aria-checked': on ? 'true' : 'false', disabled: dis}); return b; }
var SIM = {};
SIM.kontext = function (root, t, ctx, cid, done) {
  var CAP = 7, msgs = [{t: 'Anweisung: „Schreib immer per Du.“', first: true}], shelf = h('ol', {class: 'shelf', 'aria-label': 'Kontextfenster'}), info = h('p', {class: 'siminfo', role: 'status'}), q = h('div');
  var texts = ['Frage zum Newsletter', 'Antwort der KI', 'Langer Bericht eingefügt', 'Antwort der KI', 'Nachfrage', 'Antwort der KI', 'Zweiter Bericht eingefügt', 'Antwort der KI', 'Bitte um Kürzung'];
  var add = btn('btn', [KD.icon('plus'), ' Nachricht hinzufügen'], function () {
    msgs.push({t: texts[(msgs.length - 1) % texts.length]}); draw();
    if (msgs.length > CAP && !q.firstChild) { ask(); }
  });
  function draw() {
    KD.clear(shelf); var out = Math.max(0, msgs.length - CAP);
    msgs.forEach(function (m, i) { shelf.appendChild(h('li', {class: 'block' + (m.first ? ' first' : '') + (i < out ? ' gone' : '')}, m.t, i < out ? h('span', {class: 'tag'}, ' herausgefallen') : null)); });
    info.textContent = out ? 'Das Fenster ist voll. ' + out + (out === 1 ? ' Teil ist' : ' Teile sind') + ' herausgefallen, darunter die erste Anweisung. Die KI schreibt jetzt vielleicht wieder per Sie.' : msgs.length + ' von ' + CAP + ' Plätzen belegt.';
  }
  function ask() {
    var tries = 0, out = h('div', {class: 'fbwrap'});
    var opts = [['Einen neuen Chat beginnen und eine kurze Zusammenfassung mitgeben.', true, 'So steht das Wichtige wieder am Anfang. Dauerhafte Regeln gehören in ein Projekt.'], ['Die Anweisung in Großbuchstaben wiederholen.', false, 'Lautstärke hilft nicht. Der Platz bleibt begrenzt.'], ['Noch mehr Text einfügen, damit die KI den Überblick behält.', false, 'Mehr Text verdrängt noch mehr vom Anfang.']];
    KD.add(q, [h('p', {class: 'scentext'}, 'Was hilft jetzt am besten?'), h('div', {class: 'choices col'}, opts.map(function (o) { var b = btn('choice', o[0], function () { if (o[1]) { KD.clear(out).appendChild(fb('ok', o[2])); finish(ctx, cid, tries === 0); if (ctx.onAll) { ctx.onAll(); } } else { tries++; b.disabled = true; KD.clear(out).appendChild(fb('bad', o[2])); } }); return b; })), out]);
  }
  draw();
  KD.add(root, [h('p', {class: 'small'}, 'Das Fenster hier fasst sieben Teile. Echte Kontextfenster sind viel größer, das Prinzip ist dasselbe.'), shelf, info, add, q]);
  if (done) { q.appendChild(fb('ok', 'Schon gelöst. Du kannst das Regal trotzdem noch einmal füllen.')); }
};
SIM.rechte = function (root, t, ctx, cid, done) {
  var z = t.ziel, st = {lesen: false, schreiben: false, senden: false, loeschen: false, frage: false}, round = 0, out = h('div', {class: 'fbwrap'}), info = h('ul', {class: 'simlist', role: 'status'});
  var L = {lesen: 'Lesen', schreiben: t.schreibenLabel || 'Formulare ausfüllen', senden: 'Senden und absenden', loeschen: 'Löschen', frage: 'Vor heiklen Schritten nachfragen'};
  function draw() {
    KD.clear(info);
    info.appendChild(h('li', null, st.lesen ? 'Die KI kann die Inhalte lesen, die sie für die Aufgabe braucht.' : 'Ohne Leserecht kann die KI nicht arbeiten.'));
    if (st.schreiben) { info.appendChild(h('li', null, z.schreiben ? 'Sie kann Ergebnisse als Entwurf ablegen.' : 'Sie kann Felder ausfüllen. Für diese Aufgabe ist das nicht nötig.')); }
    if (st.senden) { info.appendChild(h('li', {class: 'warn'}, 'Sie kann ohne dich etwas abschicken. Ein Fehler erreicht sofort andere.')); }
    if (st.loeschen) { info.appendChild(h('li', {class: 'warn'}, 'Sie kann löschen. Das lässt sich oft nicht rückgängig machen.')); }
    info.appendChild(h('li', null, st.frage ? 'Vor heiklen Schritten fragt sie nach.' : 'Sie fragt nicht nach.'));
  }
  var go = btn('btn', 'Prüfen', function () {
    round += 1; var wrong = Object.keys(z).filter(function (k) { return !!st[k] !== !!z[k]; });
    KD.clear(out);
    if (!wrong.length) { out.appendChild(fb('ok', 'So wenig wie möglich, so viel wie nötig. Senden und Löschen kommen erst dazu, wenn alles verlässlich läuft.')); go.hidden = true; finish(ctx, cid, round === 1); if (ctx.onAll) { ctx.onAll(); } }
    else if (round < 2) { out.appendChild(fb('hint', wrong.length + (wrong.length === 1 ? ' Schalter stimmt' : ' Schalter stimmen') + ' noch nicht. Frag dich bei jedem: Braucht die Aufgabe das wirklich?')); }
    else { out.appendChild(fb('solved', 'Richtig wäre: ' + Object.keys(z).map(function (k) { return L[k] + ' ' + (z[k] ? 'an' : 'aus'); }).join(', ') + '. So wenig wie möglich, so viel wie nötig.')); go.hidden = true; finish(ctx, cid, false); if (ctx.onAll) { ctx.onAll(); } }
  });
  draw();
  KD.add(root, [h('div', {class: 'switches'}, Object.keys(L).map(function (k) { return sw(L[k], false, function (v) { st[k] = v; draw(); }); })), info, go, out]);
  if (done) { out.appendChild(fb('ok', 'Schon gelöst. Du kannst die Schalter trotzdem noch einmal ausprobieren.')); }
};
SIM.reise = function (root, t, ctx, cid, done) {
  var st = {i: 0, ink: false, del: false, train: true}, fig = h('div', {class: 'figbox'}), body = h('div', {class: 'simbody'}), nav = h('div', {class: 'simnav'}), live = h('p', {class: 'sr', role: 'status'});
  var N = [
    ['Ich tippe', 'Ein Satz, wie er im Alltag vorkommt: „Bitte schreib eine Mail an Frau Huber (Diabetes), Tel. 0664 …“. Schon hier entscheidest du, was dein Gerät verlässt. Name, Diagnose und Telefonnummer gehören nicht hinein.'],
    ['Senden', 'Mit „Senden“ verlässt der Text dein Gerät und geht über das Internet zum Anbieter. Der sitzt nicht in deiner Organisation.'],
    ['Verarbeitung', 'Das Modell liest deinen Text und schreibt eine Antwort. Währenddessen liegt deine Eingabe beim Anbieter.'],
    ['Speicherung', 'Der Chat landet im Verlauf und bleibt dort, bis du ihn löschst. Probier die Schalter aus.'],
    ['Training', 'Eine Einstellung entscheidet, ob Chats zum Verbessern der Modelle dienen dürfen. In Claude heißt sie „Help Improve our AI models“ (Free, Pro, Max). Leg den Schalter um.'],
    ['Rückweg', 'Die Antwort kommt zurück auf dein Gerät. Was beim Anbieter bleibt, hängt von Verlauf, Memory, Trainingseinstellung und Tarif ab. Merksatz: Ich entscheide mit jeder Eingabe, was mein Gerät verlässt.']
  ];
  function draw() {
    KD.clear(fig).appendChild(KD.fig('reise', st));
    KD.clear(body);
    KD.add(body, [h('p', {class: 'scentag'}, 'Station ' + (st.i + 1) + ' von ' + N.length), h('h5', null, N[st.i][0]), h('p', null, N[st.i][1])]);
    if (st.i === 3) {
      body.appendChild(h('div', {class: 'switches'}, sw('Inkognito-Chat', st.ink, function (v) { st.ink = v; if (v) { st.del = false; } draw(); }), sw('Chat im Verlauf löschen', st.del, function (v) { st.del = v; if (v) { st.ink = false; } draw(); })));
      body.appendChild(h('p', {class: 'siminfo'}, st.ink ? 'Kein Eintrag im Verlauf und kein Memory aus diesem Chat. Beim Anbieter wird er laut Hilfeseite trotzdem 30 Tage aufbewahrt.' : st.del ? 'Aus dem Verlauf ist der Chat sofort weg, aus den Systemen im Hintergrund laut Anbieter innerhalb von 30 Tagen.' : 'Der Chat liegt im Verlauf.'));
    }
    if (st.i === 4) {
      body.appendChild(h('div', {class: 'switches'}, sw('Chats zum Verbessern der Modelle freigeben', st.train, function (v) { st.train = v; draw(); })));
      body.appendChild(h('p', {class: 'siminfo'}, st.train ? 'An: Chats dürfen ins Training fließen. Der Anbieter bewahrt sie dafür bis zu fünf Jahre in anonymisierter Form auf.' : 'Aus: Neue Chats werden nicht mehr für künftiges Training verwendet. Was schon in ein Training eingeflossen ist, bleibt dort. Der Schalter löscht keine Chats.'));
    }
    KD.clear(nav);
    KD.add(nav, [btn('btn ghost', [KD.icon('pfeill'), ' Zurück'], function () { st.i -= 1; draw(); nav.firstChild.focus(); }, {disabled: st.i === 0}),
      st.i < N.length - 1 ? btn('btn next-action', ['Weiter ', KD.icon('pfeil')], function () { st.i += 1; draw(); var next = nav.querySelector('.next-action'); if (next) { next.focus(); } }) : null]);
    live.textContent = 'Station ' + (st.i + 1) + ': ' + N[st.i][0];
    if (st.i === N.length - 1 && !done) { done = true; finish(ctx, cid, true); if (ctx.onAll) { ctx.onAll(); } }
  }
  draw();
  KD.add(root, [fig, body, nav, live]);
};
T.sim = function (root, t, ctx) { var cid = ctx.hid + '.' + ctx.ti + '.x'; (SIM[t.sim] || function () {})(root, t, ctx, cid, isDone(ctx, cid)); };

var NAMES = {sort: 'Zuordnen', mark: 'Finde den Fehler', scenario: 'Szenario', order: 'Reihenfolge', cloze: 'Lückentext', pairs: 'Paare finden', build: 'Prompt-Werkstatt', sim: 'Ausprobieren'};
var ICONS = {sort: 'weiche', mark: 'lupe', scenario: 'weg', order: 'liste', cloze: 'zettel', pairs: 'zwei', build: 'werkzeug', sim: 'zahnrad'};
KD.T = {render: function (root, t, ctx) { T[t.type](root, t, ctx); }, name: function (t) { return NAMES[t.type]; }, icon: function (t) { return ICONS[t.type]; }};
})();
