/* KI-Dorf: Oberfläche. Reiter Dorf, Bibliothek, Fortschritt; Hausansicht; Dorfrunde; Hilfe, Menü, Quellenkarten. */
(function () {
'use strict';
var KD = window.KD, h = KD.h, S = KD.S, D = S.data;
var app = document.getElementById('app'), live = document.getElementById('live');
var FEEDBACK_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdlJpLSyZw5E4cujkjPKlSKAxAd94JDIbJgaIvvzsfTpmZfLA/viewform';
var ui = {step: {}, task: {}, card: {}, bib: 'inhalte', q: ''};

KD.say = function (t) { live.textContent = ''; setTimeout(function () { live.textContent = t; }, 30); };
function btn(cls, kids, fn, attrs) { var a = {class: cls, type: 'button', onclick: fn}; for (var k in attrs || {}) { a[k] = attrs[k]; } return h('button', a, kids); }
function link(href, kids, cls, attrs) { var a = {href: href, class: cls || null}; for (var k in attrs || {}) { a[k] = attrs[k]; } return h('a', a, kids); }
function setW(el, p) { el.style.width = Math.round(p * 100) + '%'; return el; }
function bar(p, label) { return h('div', {class: 'bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round(p * 100), 'aria-label': label}, setW(h('span'), p)); }
var LV = ['Bauplatz', 'Fundament', 'Gebaut', 'Eingerichtet'];

/* ---------- Bauplätze im Dorf (Seminarreihenfolge, drei Straßen im Zickzack) ---------- */
/* Jedes Haus steht dort, wo es zum Thema passt: Leuchtturm und Hafen am Wasser, Remise und Bahnhof am Gleis. */
(function () {
  var P = {fundamenthaus: [-18, 10], tresorhaus: [-9, 10], projekthaus: [0, 10], werkstatt: [9, 10], detektivbuero: [18, 10],
    schreibstube: [18, -4], archiv: [9, -4], gedaechtnisturm: [0, -4], lagerhaus: [-9, -4], leuchtturm: [-29, -4.5],
    remise: [-18, -21], bahnhof: [-9, -21], post: [0, -18], atelier: [9, -18], labor: [18, -18], hafen: [28.5, -4.5]};
  KD.HOUSES.forEach(function (x) { if (x.look && P[x.id]) { x.spot = {x: P[x.id][0], z: P[x.id][1]}; } });
})();

/* ---------- Einstellungen ---------- */
function applySettings() {
  var r = document.documentElement, st = D.set;
  if (st.theme) { r.setAttribute('data-theme', st.theme); } else { r.removeAttribute('data-theme'); }
  r.setAttribute('data-font', st.font || '1');
  if (st.motion) { r.setAttribute('data-motion', 'aus'); } else { r.removeAttribute('data-motion'); }
  if (KD.World) { KD.World.settings(); }
}
function use3d() { return D.set.view !== '2d' && KD.World && KD.World.available(); }

/* ---------- Quellen-Marken ---------- */
function srcBadge(key) {
  var q = KD.SRC[key]; if (!q) { return null; }
  return btn('src src-' + q.st, [KD.icon('quelle'), h('span', null, q.kurz)], function (e) { openSrc(key, e.currentTarget); }, {'aria-label': 'Quelle: ' + q.kurz + ', ' + KD.SRC_STATUS[q.st]});
}
function srcRow(keys) { return keys && keys.length ? h('div', {class: 'srcrow'}, keys.map(srcBadge)) : null; }
function srcDetail(key) {
  var q = KD.SRC[key];
  return [h('p', {class: 'srcstat src-' + q.st}, KD.icon(q.st === 'o' ? 'haken' : q.st === 'e' ? 'hilfe' : 'lupe'), ' ', KD.SRC_STATUS[q.st]),
    h('dl', {class: 'kv'}, h('dt', null, 'Titel'), h('dd', null, q.titel), h('dt', null, 'Herausgeber'), h('dd', null, q.hg), h('dt', null, 'Stand'), h('dd', null, q.stand), h('dt', null, 'Geprüft am'), h('dd', null, KD.ABRUF)),
    q.notiz ? h('p', {class: 'small'}, q.notiz) : null,
    q.url ? h('p', null, link(q.url, [q.url, h('span', {class: 'sr'}, ' (öffnet in neuem Tab, braucht Internet)')], 'ext', {target: '_blank', rel: 'noopener noreferrer'})) : null];
}

/* ---------- Dialoge ---------- */
var dlg = document.getElementById('dlg'), dlgTitle = document.getElementById('dlgTitle'), dlgBody = document.getElementById('dlgBody'), lastFocus = null;
function openDlg(title, kids, from) {
  lastFocus = from || document.activeElement;
  dlgTitle.textContent = title; KD.clear(dlgBody); KD.add(dlgBody, kids);
  if (dlg.showModal) { if (!dlg.open) { dlg.showModal(); } } else { dlg.setAttribute('open', ''); }
  dlgTitle.focus();
}
function closeDlg() { if (dlg.close && dlg.open) { dlg.close(); } else { dlg.removeAttribute('open'); } }
dlg.addEventListener('close', function () { if (lastFocus && lastFocus.isConnected && lastFocus.focus) { lastFocus.focus(); } lastFocus = null; });
dlg.addEventListener('click', function (e) { if (e.target === dlg) { closeDlg(); } });
document.getElementById('dlgClose').addEventListener('click', closeDlg);
function openSrc(key, from) { openDlg('Quelle', srcDetail(key), from); }

function helpBody() {
  var rows = [['Laufen im 3D-Dorf', 'Pfeiltasten oder W A S D', 'Joystick links unten oder auf den Boden tippen', 'Auf den Boden klicken'],
    ['Haus betreten, mit Figur sprechen', 'Enter oder Leertaste', 'Knopf rechts unten', 'Knopf rechts unten'],
    ['Ohne Laufen in ein Haus', 'Tab zur Karte, Enter', 'Haus in der Karte antippen', 'Haus in der Karte anklicken'],
    ['Karten zuordnen', 'Karte mit Enter wählen, Ziel mit Enter', 'Karte antippen, dann Ziel, oder ziehen', 'Ziehen oder klicken'],
    ['Reihenfolge ändern', 'Pfeilknöpfe neben der Zeile', 'Pfeilknöpfe', 'Pfeilknöpfe'],
    ['Dialog schließen', 'Escape', 'Kreuz oben rechts', 'Kreuz oder neben den Dialog klicken'],
    ['Vollbild im 3D-Dorf', 'F', 'Knopf „Vollbild“', 'Knopf „Vollbild“']];
  var tut = ['Jedes Haus ist ein Block aus dem Seminar. Such dir eines auf der Karte aus oder lauf hin.', 'Im Haus: Einstiegsfrage, ein paar Karten zum Lesen, dann Aufgaben. Nichts ist gesperrt.', 'Beim ersten Fehlversuch bekommst du einen Hinweis, beim zweiten die Auflösung mit Begründung. Es gibt keine Uhr und keine Punkteabzüge.', 'Im Briefkasten auf dem Dorfplatz liegt die Dorfrunde: fünf Karten zum Wiederholen. Alles zum Nachlesen steht in der Bibliothek.'];
  return [h('h3', null, 'So geht es'), h('ol', {class: 'tut'}, tut.map(function (t) { return h('li', null, t); })),
    h('h3', null, 'Steuerung'),
    h('div', {class: 'tablewrap'}, h('table', {class: 'tbl'}, h('thead', null, h('tr', null, ['Was', 'Tastatur', 'Finger', 'Maus'].map(function (x) { return h('th', {scope: 'col'}, x); }))),
      h('tbody', null, rows.map(function (r) { return h('tr', null, h('th', {scope: 'row'}, r[0]), h('td', null, r[1]), h('td', null, r[2]), h('td', null, r[3])); })))),
    h('p', {class: 'small'}, 'Das 3D-Dorf ist freiwillig. Alles geht auch über die Karte und die 2D-Ansicht (im Menü umschalten).')];
}
function openHelp(from) { D.seenHelp = true; S.save(); openDlg('Hilfe', helpBody(), from); }

function seg(label, opts, cur, fn) {
  return h('fieldset', {class: 'seg'}, h('legend', null, label), opts.map(function (o) { return btn('segbtn', o[1], function (e) { fn(o[0]); Array.prototype.forEach.call(e.currentTarget.parentNode.querySelectorAll('.segbtn'), function (b) { b.setAttribute('aria-pressed', b === e.currentTarget ? 'true' : 'false'); }); }, {'aria-pressed': String(cur === o[0])}); }));
}
function openMenu(from) {
  var st = D.set, msg = h('p', {class: 'small', role: 'status'});
  function set(k, v) { st[k] = v; S.save(); applySettings(); if (k === 'view' || k === 'quality') { route(); } }
  var wipeBox = h('div');
  function askWipe() {
    KD.clear(wipeBox);
    KD.add(wipeBox, [h('p', {class: 'warnbox'}, 'Wirklich alles löschen? Lernstand, Sammelstücke und Einstellungen in diesem Browser sind dann weg.'),
      btn('btn danger', 'Ja, alles löschen', function () { S.wipe(); applySettings(); closeDlg(); location.hash = ''; route(); KD.say('Alles gelöscht.'); }), ' ', btn('btn ghost', 'Abbrechen', function () { KD.clear(wipeBox); wipeBox.appendChild(btn('btn ghost', 'Alle Daten in diesem Browser löschen', askWipe)); })]);
    wipeBox.querySelector('.ghost').focus();
  }
  wipeBox.appendChild(btn('btn ghost', 'Alle Daten in diesem Browser löschen', askWipe));
  openDlg('Menü', [
    seg('Ansicht', [['3d', '3D-Dorf'], ['2d', 'Nur Karte (2D)']], st.view === '2d' ? '2d' : '3d', function (v) { set('view', v); }),
    seg('Schriftgröße', [['1', 'Normal'], ['2', 'Groß'], ['3', 'Sehr groß']], st.font || '1', function (v) { set('font', v); }),
    seg('Bewegung', [['', 'Normal'], ['aus', 'Reduziert']], st.motion ? 'aus' : '', function (v) { set('motion', v); }),
    seg('Farben', [['', 'Wie das Gerät'], ['light', 'Hell'], ['dark', 'Dunkel']], st.theme || '', function (v) { set('theme', v); }),
    seg('3D-Grafik', [['', 'Schön'], ['spar', 'Sparsam']], st.quality || '', function (v) { set('quality', v); }),
    h('p', {class: 'small'}, 'Das Dorf speichert nur in diesem Browser: Lernstand, Sammelstücke, Einstellungen. Keine Namen, keine Eingaben, keine Verbindung nach außen.'),
    h('p', null, link('#fortschritt', 'Spielstand-Code und Fortschritt', null, {onclick: closeDlg})), wipeBox, msg], from);
}

/* ---------- Dorfbewohner:innen ---------- */
function npcFace(n) { return h('span', {class: 'face ' + n.farbe, 'aria-hidden': 'true'}, h('i')); }
function openNpc(id, from) {
  var n = KD.NPCS.filter(function (x) { return x.id === id; })[0]; if (!n) { return; }
  var mine = KD.TIPS.map(function (t, i) { return i; }).filter(function (i) { return KD.TIPS[i].npc === id; });
  var unseen = mine.filter(function (i) { return D.tips.indexOf(i) < 0; }), pool = unseen.length ? unseen : mine, i = pool[Math.floor(Math.random() * pool.length)], t = KD.TIPS[i], hh = KD.BYID[t.haus];
  S.seeTip(i);
  openDlg(n.name + ', ' + n.beruf, [h('div', {class: 'npcsay'}, npcFace(n), h('div', null, h('p', {class: 'small'}, n.hallo), h('p', {class: 'tip'}, t.t))),
    hh ? h('p', null, link('#haus/' + hh.id, ['Mehr dazu: ', hh.name], 'more', {onclick: closeDlg})) : null,
    h('p', {class: 'small'}, 'Tipps gesammelt: ' + D.tips.length + ' von ' + KD.TIPS.length)], from);
}

/* ---------- Karte ---------- */
var posDot = null;
function mapSvg(curId) {
  var s = KD.svg, kids = [s('rect', {x: -40, y: -35, width: 80, height: 72, class: 'm-wasser'}), s('circle', {cx: 0, cy: 0, r: 33, class: 'm-insel'})];
  [[0, 13.3, 44, 2.4], [0, -0.7, 58, 2.4], [0, -14.7, 44, 2.4], [0, 18, 2.4, 9]].forEach(function (r) { kids.push(s('rect', {x: r[0] - r[2] / 2, y: r[1] - r[3] / 2, width: r[2], height: r[3], rx: 1, class: 'm-weg'})); });
  kids.push(s('circle', {cx: 0, cy: 23, r: 4.4, class: 'm-weg'}));
  kids.push(s('path', {d: 'M-28.5 -17.3H-2.6M-18 -17.3V-19.2', class: 'm-gleis'}));
  kids.push(s('rect', {x: 31.6, y: -5.2, width: 6.6, height: 1.4, class: 'm-steg'}));
  var next = S.nextHouse();
  KD.HOUSES.forEach(function (x, n) {
    var p = x.spot || {x: 0, z: 23}, lv = S.level(x), cls = 'm-haus lv' + lv + (x.extra ? ' extra' : '') + (curId === x.id ? ' cur' : '') + (next && next.id === x.id ? ' next' : '');
    var a = s('a', {href: '#haus/' + x.id, class: cls, 'aria-label': (n + 1) + ', ' + x.name + ': ' + x.sub + '. ' + LV[lv] + (next && next.id === x.id ? '. Empfohlen als Nächstes' : '')},
      x.platz ? s('circle', {cx: p.x, cy: p.z, r: 2.6}) : s('rect', {x: p.x - 3, y: p.z - 2.2, width: 6, height: 4.4, rx: 1}),
      s('text', {x: p.x, y: p.z + 1.1, class: 'm-nr'}, String(n + 1)),
      s('text', {x: p.x, y: p.z + (x.platz ? 6.2 : 5.4), class: 'm-name'}, x.name));
    kids.push(a);
  });
  posDot = s('circle', {cx: 0, cy: 19.8, r: 1.3, class: 'm-ich'}); posDot.setAttribute('visibility', 'hidden'); kids.push(posDot);
  return s('svg', {viewBox: '-39 -34 78 70', class: 'map', role: 'group', 'aria-label': 'Karte des Dorfs. Jedes Haus ist ein Link.'}, kids);
}
function legend() { return h('ul', {class: 'legend'}, [['lv0', 'Bauplatz'], ['lv1', 'Fundament'], ['lv2', 'Gebaut'], ['lv3', 'Eingerichtet'], ['next', 'Empfohlen']].map(function (l) { return h('li', null, h('span', {class: 'lg ' + l[0], 'aria-hidden': 'true'}), l[1]); })); }

/* ---------- Dorf ---------- */
function viewDorf() {
  var t = S.totals(), next = S.nextHouse(), tip = KD.TIPS[S.tipOfDay()], tn = KD.NPCS.filter(function (n) { return n.id === tip.npc; })[0], due = S.dueCount();
  S.seeTip(S.tipOfDay());
  var world = null, threeD = use3d();
  if (threeD) { world = h('div', {id: 'worldSlot'}); }
  var kids = [
    h('h1', {id: 'top', tabindex: '-1'}, 'KI-Dorf'),
    h('p', {class: 'lede'}, 'Begleitspiel zum KI-Seminar. Jedes Haus ist ein Seminarblock: Einstiegsfrage, ein paar Karten, Aufgaben. Mit jeder gelösten Aufgabe wächst das Haus.'),
    h('div', {class: 'progress'}, bar(t.core, 'Fortschritt in den Seminarhäusern'), h('p', null, t.done + ' von ' + t.n + ' Seminarhäusern eingerichtet'),
      next ? link('#haus/' + next.id, ['Weiter: ', next.name, ' ', KD.icon('pfeil')], 'btn') : h('p', {class: 'okline'}, KD.icon('haken'), ' Alle Seminarhäuser stehen.')),
    threeD ? h('section', {class: 'worldwrap', 'aria-label': '3D-Dorf'}, world) : null,
    h('div', {class: 'dorfgrid'},
      h('section', {class: 'panel', 'aria-labelledby': 'map-h'}, h('h2', {id: 'map-h'}, 'Karte'), mapSvg(null), legend(),
        h('p', {class: 'small'}, 'Nummern in Seminarreihenfolge. 15 bis 17 sind Zusatzhäuser zum Selbststudium.')),
      h('div', {class: 'stackcol'},
        h('section', {class: 'panel tipday', 'aria-labelledby': 'tip-h'}, h('h2', {id: 'tip-h'}, 'Tipp des Tages'), h('div', {class: 'npcsay'}, tn ? npcFace(tn) : null, h('div', null, h('p', {class: 'tip'}, tip.t), h('p', {class: 'small'}, tn ? tn.name + ', ' + tn.beruf : ''), KD.BYID[tip.haus] ? link('#haus/' + tip.haus, 'Mehr dazu: ' + KD.BYID[tip.haus].name, 'more') : null))),
        h('section', {class: 'panel', 'aria-labelledby': 'rd-h'}, h('h2', {id: 'rd-h'}, 'Briefkasten: Dorfrunde'),
          due ? [h('p', null, 'Im Briefkasten ' + (due === 1 ? 'liegt eine Karte' : 'liegen ' + due + ' Karten') + ' zum Wiederholen.'), link('#runde', ['Dorfrunde starten ', KD.icon('pfeil')], 'btn')]
            : S.roundCards(1).length ? [h('p', {class: 'small'}, 'Heute ist nichts fällig. Morgen liegen wieder Karten hier. Du kannst trotzdem eine Runde drehen.'), link('#runde', 'Trotzdem eine Runde', 'btn ghost')]
            : h('p', {class: 'small'}, 'Noch leer. Sobald du in einem Haus Aufgaben gelöst hast, liegen hier Karten zum Wiederholen.')),
        h('section', {class: 'panel', 'aria-labelledby': 'npc-h'}, h('h2', {id: 'npc-h'}, 'Wer hier wohnt'), h('ul', {class: 'npclist'}, KD.NPCS.map(function (n) { return h('li', null, btn('npcbtn', [npcFace(n), h('span', null, h('strong', null, n.name), h('small', null, n.beruf))], function (e) { openNpc(n.id, e.currentTarget); })); })))))
  ];
  KD.clear(app); KD.add(app, kids);
  if (threeD) { KD.World.attach(world, null); } else if (KD.World) { KD.World.detach(); }
}

/* ---------- Haus ---------- */
function steps(x) { var a = []; if (x.q0) { a.push(['q', 'Einstieg']); } a.push(['f', 'Fundament']); if (x.tasks.length) { a.push(['t', 'Aufgaben']); } a.push(['e', x.platz ? 'Fahrplan' : 'Einrichtung']); if (x.platz) { a.push(['w', 'Wordcloud']); } return a; }
function defaultStep(x) { var st = S.hs(x.id); if (x.q0 && !st.q) { return 'q'; } if (!st.f) { return 'f'; } if (x.tasks.length && S.pct(x) < 1) { return 't'; } return 'e'; }
var houseRefs = {};
function viewHaus(x) {
  var st = S.hs(x.id), sl = steps(x), cur = ui.step[x.id] || defaultStep(x); ui.step[x.id] = cur;
  var npc = KD.NPCS.filter(function (n) { return n.id === x.npc; })[0];
  var stage = h('section', {class: 'stage', id: 'stage', 'aria-labelledby': 'stage-h'}), tabs = h('div', {class: 'steps', role: 'group', 'aria-label': 'Schritte im Haus'});
  var pbar = bar(S.pct(x), 'Fortschritt in diesem Haus'), plabel = h('span', {class: 'small'}), art = h('div', {class: 'hausart'});
  var world = use3d() && x.look ? h('div', {id: 'worldSlot'}) : null;
  var content = h('div', {class: 'house-content', id: 'house-content', hidden: !!world}, tabs, stage);
  var launch = h('div', {class: 'house-actions', hidden: !world});
  var close = btn('btn ghost', 'Karten schließen', function () { setOpen(false); launch.querySelector('button').focus(); }, {hidden: true});
  var foundation = btn('btn next-action', ['Fundament errichten ', KD.icon('pfeil')], function () { openStep('f'); }, {'aria-controls': 'house-content'});
  if (world) { KD.add(launch, [foundation, x.q0 ? btn('btn ghost', 'Einstiegsfrage', function () { openStep('q'); }) : null]); }
  var main = h('div', {class: 'hausmain'}, launch, close, content);
  houseRefs = {openStep: openStep};
  function setOpen(open) {
    content.hidden = !open;
    launch.hidden = open;
    close.hidden = !open;
  }
  function openStep(k) {
    if (!sl.some(function (s) { return s[0] === k; })) { return; }
    if (world) { setOpen(true); }
    show(k, true);
  }
  function refresh() {
    var lv = S.level(x), p = S.pct(x);
    setW(pbar.firstChild, p); pbar.setAttribute('aria-valuenow', Math.round(p * 100));
    plabel.textContent = x.tasks.length ? LV[lv] + ' · ' + S.solvedCount(x) + ' von ' + S.units(x).length + ' Karten gelöst' : '';
    KD.clear(art).appendChild(KD.hausSvg(x, lv));
    Array.prototype.forEach.call(tabs.children, function (b) { var k = b.getAttribute('data-k'), done = k === 'q' ? st.q : k === 'f' ? st.f : k === 't' ? p >= 1 : false; b.classList.toggle('done', !!done); b.setAttribute('aria-current', k === cur ? 'step' : 'false'); });
    if (KD.World) { KD.World.sync(); }
  }
  function show(k, focus) {
    cur = k; ui.step[x.id] = k; KD.clear(stage);
    ({q: stepQ, f: stepF, t: stepT, e: stepE, w: stepW})[k](x, stage, {next: function () { var i = sl.map(function (s) { return s[0]; }).indexOf(k); if (sl[i + 1]) { show(sl[i + 1][0], true); } }, refresh: refresh});
    refresh();
    if (focus) { var hd = stage.querySelector('#stage-h'); if (hd) { hd.focus(); } }
  }
  sl.forEach(function (s, i) { tabs.appendChild(btn('step', [h('span', {class: 'n'}, String(i + 1)), s[1], h('span', {class: 'tick'}, KD.icon('haken'), h('span', {class: 'sr'}, ' erledigt'))], function () { show(s[0], true); }, {'data-k': s[0]})); });
  KD.clear(app);
  KD.add(app, [link('#dorf', [KD.icon('pfeill'), ' Zurück ins Dorf'], 'back'),
    h('div', {class: 'hausgrid' + (world ? ' with3d' : '')},
      h('header', {class: 'haushead'}, art, h('div', null, h('p', {class: 'eyebrow'}, 'Haus ' + (x.idx + 1) + ' von ' + KD.HOUSES.length + (x.extra ? ' · Zusatzhaus' : '')), h('h1', {id: 'top', tabindex: '-1'}, x.name), h('p', {class: 'sub'}, x.sub),
        x.tasks.length ? h('div', {class: 'progress slim'}, pbar, plabel) : null,
        npc ? btn('npcbtn inline', [npcFace(npc), h('span', null, 'Tipp von ' + npc.name)], function (e) { openNpc(npc.id, e.currentTarget); }) : null)),
      world ? h('aside', {class: 'roomwrap', 'aria-label': 'Blick ins Haus'}, world) : null,
      main)]);
  if (world && KD.World.attach(world, x.id)) { refresh(); }
  else {
    if (KD.World) { KD.World.detach(); }
    if (world) {
      world.parentNode.remove();
      main.parentNode.classList.remove('with3d');
      launch.hidden = true;
      content.hidden = false;
      world = null;
    }
    show(cur, false);
  }
}
function stageHead(el, tag, title) { KD.add(el, [h('p', {class: 'eyebrow'}, tag), h('h2', {id: 'stage-h', tabindex: '-1'}, title)]); }

function stepQ(x, el, api) {
  var q = x.q0, st = S.hs(x.id), out = h('div', {class: 'fbwrap', role: 'status'}), opts = h('div', {class: 'choices col'});
  stageHead(el, 'Einstiegsfrage · zählt nicht', q.q);
  function reveal(i) {
    Array.prototype.forEach.call(opts.children, function (b, k) { b.disabled = true; if (k === q.a) { b.classList.add('is-right'); } else if (k === i) { b.classList.add('is-wrong'); } });
    KD.clear(out);
    KD.add(out, [h('p', {class: 'fb fb-' + (q.a < 0 || i === q.a ? 'ok' : 'solved')}, KD.icon(q.a < 0 || i === q.a ? 'haken' : 'pfeil'), h('strong', null, q.a < 0 ? 'Notiert. ' : i === q.a ? 'Gut geschätzt. ' : 'Knapp daneben, und genau dafür ist die Frage da. '), q.why), btn('btn next-action', ['Weiter zum Fundament ', KD.icon('pfeil')], api.next)]);
    if (!st.q) { st.q = 1; S.save(); api.refresh(); }
  }
  q.opts.forEach(function (o, i) { opts.appendChild(btn('choice', o, function () { reveal(i); out.querySelector('.btn').focus(); })); });
  KD.add(el, [h('p', {class: 'small'}, 'Schätz einfach. Eine Frage vor dem Lesen hilft beim Behalten, auch wenn die Antwort danebenliegt.'), opts, out]);
  if (st.q) { KD.add(out, [h('p', {class: 'small'}, 'Schon beantwortet. Du kannst noch einmal wählen.')]); }
}
function stepF(x, el, api) {
  var st = S.hs(x.id), n = x.cards.length, i = Math.min(ui.card[x.id] || 0, n - 1), box = h('div', {class: 'deck'}), nav = h('div', {class: 'decknav'}), dots = h('ol', {class: 'dots', 'aria-label': 'Karten'});
  stageHead(el, 'Fundament', x.platz ? 'Willkommen im Dorf' : 'Das Wichtigste in ' + n + ' Karten');
  function draw(focus) {
    var c = x.cards[i]; ui.card[x.id] = i;
    KD.clear(box);
    KD.add(box, [h('article', {class: 'fcard', 'aria-labelledby': 'fc-h'}, c.fig ? h('div', {class: 'figbox'}, KD.fig(c.fig)) : h('div', {class: 'bigic', 'aria-hidden': 'true'}, KD.icon(c.ic || x.ic)),
      h('div', {class: 'fbody'}, h('p', {class: 'eyebrow'}, 'Karte ' + (i + 1) + ' von ' + n), h('h3', {id: 'fc-h', tabindex: '-1'}, c.k), h('p', null, c.v)))]);
    KD.clear(dots); x.cards.forEach(function (cc, k) { dots.appendChild(h('li', null, btn('dot' + (k === i ? ' on' : ''), h('span', {class: 'sr'}, 'Karte ' + (k + 1) + ': ' + cc.k), function () { i = k; draw(true); }, {'aria-current': k === i ? 'true' : null}))); });
    KD.clear(nav);
    KD.add(nav, [btn('btn ghost', [KD.icon('pfeill'), ' Zurück'], function () { i -= 1; draw(true); }, {disabled: i === 0}), dots,
      i < n - 1 ? btn('btn next-action', ['Nächste Karte ', KD.icon('pfeil')], function () { i += 1; draw(true); }) : btn('btn next-action', [x.tasks.length ? 'Zu den Aufgaben ' : 'Zum Fahrplan ', KD.icon('pfeil')], api.next)]);
    if (i === n - 1 && !st.f) { st.f = 1; S.save(); api.refresh(); KD.say('Fundament gelegt.'); }
    if (focus) { box.querySelector('#fc-h').focus(); }
  }
  draw(false);
  KD.add(el, [box, nav]);
}
function stepT(x, el, api) {
  var ti = Math.min(ui.task[x.id] === undefined ? firstOpen(x) : ui.task[x.id], x.tasks.length - 1), pills = h('div', {class: 'pills', role: 'group', 'aria-label': 'Aufgaben'}), body = h('div', {class: 'taskbody'});
  stageHead(el, 'Aufgaben', x.tasks.length + ' Aufgaben, in beliebiger Reihenfolge');
  function firstOpen(hh) { for (var k = 0; k < hh.tasks.length; k++) { if (!S.taskDone(hh, k)) { return k; } } return 0; }
  function drawPills() {
    KD.clear(pills);
    x.tasks.forEach(function (t, k) { var c = S.taskCount(x, k), done = S.taskDone(x, k); pills.appendChild(btn('pill' + (done ? ' done' : ''), [KD.icon(done ? 'haken' : KD.T.icon(t)), h('span', null, t.title), c[1] > 1 ? h('small', null, c[0] + '/' + c[1]) : null, h('span', {class: 'sr'}, done ? ', gelöst' : '')], function () { ti = k; draw(true); }, {'aria-current': k === ti ? 'true' : null})); });
  }
  function draw(focus) {
    var t = x.tasks[ti]; ui.task[x.id] = ti; drawPills(); KD.clear(body);
    var after = h('div', {class: 'after', role: 'status'});
    KD.add(body, [h('p', {class: 'eyebrow'}, KD.T.name(t)), h('h3', {id: 'task-h', tabindex: '-1'}, t.title), h('p', {class: 'lead'}, t.intro)]);
    var root = h('div', {class: 'task task-' + t.type}); body.appendChild(root); body.appendChild(after);
    var rendering = true;
    function showNext() {
      KD.clear(after);
      var nx = -1;
      for (var k = 1; k <= x.tasks.length; k++) {
        var c = (ti + k) % x.tasks.length;
        if (!S.taskDone(x, c)) { nx = c; break; }
      }
      var next = nx >= 0 && nx !== ti
        ? btn('btn next-action', ['Nächste Aufgabe: ' + x.tasks[nx].title + ' ', KD.icon('pfeil')], function () { ti = nx; draw(true); })
        : btn('btn next-action', ['Zur Einrichtung ', KD.icon('pfeil')], api.next);
      if (nx < 0) { after.appendChild(h('p', {class: 'okline'}, KD.icon('haken'), ' Alle Aufgaben in diesem Haus sind gelöst.')); }
      after.appendChild(next);
      if (!rendering) { next.focus(); }
    }
    KD.T.render(root, t, {hid: x.id, ti: ti, onUnit: function () { var before = +(el.getAttribute('data-lv') || 0), lv = S.level(x); api.refresh(); drawPills(); if (lv > before) { el.setAttribute('data-lv', lv); KD.say('Dein Haus ist gewachsen: ' + LV[lv] + '.'); toast(LV[lv] + ': ' + x.name + ' ist gewachsen.'); } },
      onAll: showNext});
    if (S.taskDone(x, ti) && !after.firstChild) { showNext(); }
    rendering = false;
    if (focus) { body.querySelector('#task-h').focus(); }
  }
  el.setAttribute('data-lv', S.level(x));
  KD.add(el, [pills, body]); draw(false);
}
function stepE(x, el, api) {
  var e = x.einr, st = S.hs(x.id), msg = h('p', {class: 'small', role: 'status'}), pre = h('pre', {id: 'tpl'}, e.tpl);
  stageHead(el, x.platz ? 'Fahrplan' : 'Einrichtung', e.title);
  KD.add(el, [h('p', {class: 'small'}, x.platz ? '' : 'Das hier nimmst du mit in dein eigenes Tool. Die Checkliste ist für dich und sperrt nichts.'),
    h('div', {class: 'tplhead'}, h('h3', null, e.tplTitle), btn('btn ghost', [KD.icon('kopie'), ' Text kopieren'], function () { KD.copy(e.tpl, msg, 'Kopiert.'); })), pre, msg,
    h('fieldset', {class: 'checks'}, h('legend', null, e.checkTitle), e.checks.map(function (c, i) { var inp = h('input', {type: 'checkbox', onchange: function () { if (inp.checked) { st.c[i] = 1; } else { delete st.c[i]; } S.save(); }}); inp.checked = !!st.c[i]; return h('label', {class: 'chk'}, inp, h('span', null, c)); })),
    e.link ? h('div', {class: 'extbox'}, h('h3', null, 'Feedback an die Seminarleitung'), h('p', null, 'Das Feedback-Formular liegt bei Google Forms. Wenn du es öffnest, verlässt du das Dorf, und deine Angaben gehen an Google. Bitte keine Namen eintragen. Ohne Internet nutzt du die Vorlage oben.'), link(FEEDBACK_URL, ['Formular bei Google öffnen', h('span', {class: 'sr'}, ' (öffnet in neuem Tab)')], 'btn ghost ext', {target: '_blank', rel: 'noopener noreferrer'})) : null,
    h('div', {class: 'after'}, x.platz ? btn('btn next-action', ['Zur Wordcloud ', KD.icon('pfeil')], api.next)
      : link('#dorf', ['Zurück ins Dorf ', KD.icon('pfeil')], 'btn next-action'))]);
}
/* Wordcloud: nur für das Gerät der Trainerin. Nichts wird gesendet. */
function stepW(x, el) {
  var cloud = h('div', {class: 'cloud', 'aria-live': 'polite'}), inp = h('input', {type: 'text', id: 'wcin', maxlength: '24', autocomplete: 'off'}), msg = h('p', {class: 'small', role: 'status'});
  stageHead(el, 'Für die Seminarleitung', 'Wordcloud „Erwartungen“');
  function draw() {
    KD.clear(cloud); var cnt = {}; D.wc.forEach(function (w) { cnt[w] = (cnt[w] || 0) + 1; });
    Object.keys(cnt).sort(function (a, b) { return cnt[b] - cnt[a] || a.localeCompare(b); }).forEach(function (w) { cloud.appendChild(h('span', {class: 'w w' + Math.min(4, cnt[w])}, w, cnt[w] > 1 ? h('sup', null, String(cnt[w])) : null)); });
    if (!D.wc.length) { cloud.appendChild(h('p', {class: 'small'}, 'Noch keine Wörter.')); }
  }
  function add() { var w = inp.value.trim().replace(/\s+/g, ' ').slice(0, 24); if (!w) { return; } if (D.wc.length >= 80) { msg.textContent = 'Die Wolke ist voll (80 Wörter).'; return; } D.wc.push(w.charAt(0).toUpperCase() + w.slice(1)); S.save(); inp.value = ''; draw(); inp.focus(); }
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); add(); } });
  draw();
  KD.add(el, [h('p', null, 'Die Teilnehmenden rufen ihre Erwartungen zu, du tippst sie hier ein und zeigst die Wolke am Beamer. Ein bis drei Wörter, keine Namen.'),
    h('div', {class: 'row'}, h('label', {for: 'wcin'}, 'Wort'), inp, btn('btn', 'Hinzufügen', add), btn('btn ghost', 'Letztes entfernen', function () { D.wc.pop(); S.save(); draw(); }), btn('btn ghost', 'Leeren', function () { D.wc = []; S.save(); draw(); })),
    cloud, msg, link('#dorf', ['Zurück ins Dorf ', KD.icon('pfeil')], 'btn next-action')]);
}

/* ---------- Dorfrunde ---------- */
function viewRunde() {
  var cards = S.roundCards(5), i = 0, right = 0, box = h('div', {class: 'stage'});
  KD.clear(app);
  KD.add(app, [link('#dorf', [KD.icon('pfeill'), ' Zurück ins Dorf'], 'back'), h('h1', {id: 'top', tabindex: '-1'}, 'Dorfrunde'), h('p', {class: 'lede'}, 'Fünf Karten aus Häusern, die du schon besucht hast. Wackeliges und lange nicht Gesehenes kommt zuerst. Keine Uhr, keine Punkte.'), box]);
  if (KD.World) { KD.World.detach(); }
  if (!cards.length) { KD.add(box, [h('p', null, 'Der Briefkasten ist leer. Lös zuerst Aufgaben in einem Haus.')]); return; }
  function show() {
    KD.clear(box);
    if (i >= cards.length) {
      var b = S.boxes();
      KD.add(box, [h('h2', {id: 'stage-h', tabindex: '-1'}, 'Runde geschafft'), h('p', null, right + ' von ' + cards.length + ' beim ersten Versuch richtig.'),
        h('ul', {class: 'boxes'}, [['Neu', b[0]], ['Wackelig', b[1]], ['Sitzt', b[2]]].map(function (r) { return h('li', null, h('strong', null, String(r[1])), ' ', r[0]); })),
        h('p', {class: 'small'}, 'Was wackelt, kommt in der nächsten Runde wieder. Mit etwas Abstand zu wiederholen hilft mehr als gleich noch einmal.'), link('#dorf', 'Zurück ins Dorf', 'btn')]);
      box.querySelector('#stage-h').focus(); return;
    }
    var c = cards[i], x = KD.BYID[c.hid], t = x.tasks[c.ti], root = h('div', {class: 'task task-' + t.type}), after = h('div', {class: 'after'});
    KD.add(box, [h('p', {class: 'eyebrow'}, 'Karte ' + (i + 1) + ' von ' + cards.length + ' · aus: ' + x.name), h('h2', {id: 'stage-h', tabindex: '-1'}, t.title), root, after]);
    KD.T.render(root, t, {hid: c.hid, ti: c.ti, only: [c.ii], round: true, onUnit: function (cid, first) { if (first) { right += 1; } }, onAll: function () { var nb = btn('btn next-action', [i + 1 < cards.length ? 'Nächste Karte ' : 'Zum Ergebnis ', KD.icon('pfeil')], function () { i += 1; show(); }); KD.clear(after).appendChild(nb); nb.focus(); }});
    box.querySelector('#stage-h').focus();
  }
  show();
}

/* ---------- Bibliothek ---------- */
function promptCard(p) {
  var msg = h('span', {class: 'small', role: 'status'});
  return h('article', {class: 'pcard'}, h('h4', null, p.t), h('pre', null, p.p), h('div', {class: 'row'}, btn('btn ghost', [KD.icon('kopie'), ' Kopieren'], function () { KD.copy(p.p, msg, 'Kopiert.'); }, {'aria-label': 'Prompt kopieren: ' + p.t}), msg),
    h('dl', {class: 'kv'}, h('dt', null, 'Warum das funktioniert'), h('dd', null, p.w), h('dt', null, 'Was typischerweise entsteht'), h('dd', null, p.e)));
}
function houseText(x) {
  var e = x.einr, keys = {}, msg = h('span', {class: 'small', role: 'status'});
  x.cards.forEach(function (c) { (c.src || []).forEach(function (k) { keys[k] = 1; }); });
  return h('details', {class: 'bibhaus', id: 'bib-' + x.id}, h('summary', null, h('span', {class: 'num'}, String(x.idx + 1)), ' ', x.name, h('small', null, ' ' + x.sub)),
    h('dl', {class: 'terms'}, x.cards.map(function (c) { return [h('dt', null, c.k), h('dd', null, c.v)]; })),
    h('h4', null, e.checkTitle), h('ul', null, e.checks.map(function (c) { return h('li', null, c); })),
    h('div', {class: 'tplhead'}, h('h4', null, e.tplTitle), btn('btn ghost', [KD.icon('kopie'), ' Kopieren'], function () { KD.copy(e.tpl, msg, 'Kopiert.'); }, {'aria-label': 'Vorlage kopieren: ' + e.tplTitle}), msg), h('pre', null, e.tpl),
    
    h('p', null, link('#haus/' + x.id, ['Zum Haus ', KD.icon('pfeil')], 'more')));
}
function viewBib() {
  var tabs = [['inhalte', 'Inhalte'], ['prompts', 'Promptsammlung'], ['glossar', 'Glossar'], ['quellen', 'Quellen'], ['stand', 'Stand der Tool-Angaben']], body = h('div', {class: 'bibbody'}), nav = h('div', {class: 'pills', role: 'group', 'aria-label': 'Bereiche der Bibliothek'});
  var inp = h('input', {type: 'search', id: 'bibq', placeholder: 'Suchen …', autocomplete: 'off'}), count = h('p', {class: 'small', role: 'status'});
  inp.value = ui.q;
  function hit(str) { return !ui.q || str.toLowerCase().indexOf(ui.q.toLowerCase()) >= 0; }
  function draw() {
    KD.clear(nav); tabs.forEach(function (t) { nav.appendChild(btn('pill', t[1], function () { ui.bib = t[0]; ui.q = ''; inp.value = ''; draw(); }, {'aria-current': ui.bib === t[0] && !ui.q ? 'true' : null})); });
    KD.clear(body); count.textContent = '';
    if (ui.q) { return search(); }
    if (ui.bib === 'inhalte') { KD.add(body, [h('h2', null, 'Inhalte nach Seminarblock'), h('p', {class: 'small'}, 'Stand: ' + KD.STAND + '. Tippe ein Haus an, um es aufzuklappen.'), KD.HOUSES.map(houseText)]); }
    if (ui.bib === 'prompts') {
      KD.add(body, [h('h2', null, 'Promptsammlung'), KD.PROMPT_GRUPPEN.map(function (g, gi) { return h('section', null, h('h3', null, g), h('div', {class: 'pgrid'}, KD.PROMPTS.filter(function (p) { return p.g === gi; }).map(promptCard))); })]);
    }
    if (ui.bib === 'glossar') { KD.add(body, [h('h2', null, 'Glossar'), h('dl', {class: 'terms'}, KD.GLOSSAR.map(function (g) { return [h('dt', null, g[0]), h('dd', null, g[1], ' ', link('#haus/' + g[2], KD.BYID[g[2]].name, 'more'))]; }))]); }
    if (ui.bib === 'quellen') {
      KD.add(body, [h('h2', null, 'Quellen'), h('p', {class: 'small'}, 'Alle Quellen zuletzt geprüft am ' + KD.ABRUF + '. Links brauchen Internet und öffnen in einem neuen Tab.'),
        h('h3', null, 'Zu den Inhalten'), Object.keys(KD.SRC).map(function (k) { return h('article', {class: 'srccard'}, h('h4', null, KD.SRC[k].kurz), srcDetail(k)); }),
        h('h3', null, 'Zur Gestaltung des Spiels'), h('p', {class: 'small'}, 'Für diese Arbeiten ist die Existenz über das DOI-Register bestätigt. Die Volltexte wurden für dieses Spiel nicht erneut gelesen.'),
        h('ul', {class: 'lit'}, KD.SRC_LERN.map(function (q) { return h('li', null, q[0], ' ', link(q[1], q[1], 'ext', {target: '_blank', rel: 'noopener noreferrer'}), h('br'), h('span', {class: 'small'}, 'Wofür: ' + q[2])); }))]);
    }
    if (ui.bib === 'stand') {
      KD.add(body, [h('h2', null, 'Stand der Tool-Angaben'), h('div', {class: 'tablewrap'}, h('table', {class: 'tbl'}, h('thead', null, h('tr', null, h('th', {scope: 'col'}, 'Funktion in Claude'), h('th', {scope: 'col'}, 'Verfügbar'), h('th', {scope: 'col'}, 'Quelle'))), h('tbody', null, KD.TOOLSTAND.map(function (r) { return h('tr', null, h('th', {scope: 'row'}, r[0]), h('td', null, r[1]), h('td', null, srcBadge(r[2]))); }))))]);
    }
  }
  function search() {
    var res = [];
    KD.HOUSES.forEach(function (x) { x.cards.forEach(function (c) { if (hit(c.k + ' ' + c.v)) { res.push(h('li', null, h('strong', null, c.k), ': ', c.v, ' ', link('#haus/' + x.id, x.name, 'more'))); } }); if (hit(x.einr.tpl + ' ' + x.einr.tplTitle)) { res.push(h('li', null, h('strong', null, 'Vorlage: ' + x.einr.tplTitle), ' ', link('#haus/' + x.id, x.name, 'more'))); } });
    KD.GLOSSAR.forEach(function (g) { if (hit(g[0] + ' ' + g[1])) { res.push(h('li', null, h('strong', null, 'Glossar: ' + g[0]), ': ', g[1])); } });
    var ps = KD.PROMPTS.filter(function (p) { return hit(p.t + ' ' + p.p + ' ' + p.w + ' ' + KD.PROMPT_GRUPPEN[p.g]); });
    Object.keys(KD.SRC).forEach(function (k) { var q = KD.SRC[k]; if (hit(q.kurz + ' ' + q.titel + ' ' + q.hg)) { res.push(h('li', null, h('strong', null, 'Quelle: '), q.titel, ' ', srcBadge(k))); } });
    var n = res.length + ps.length; count.textContent = n + (n === 1 ? ' Treffer' : ' Treffer') + ' für „' + ui.q + '“';
    KD.add(body, [h('h2', null, 'Suchergebnisse'), n ? null : h('p', null, 'Nichts gefunden. Versuch ein anderes Wort.'), res.length ? h('ul', {class: 'results'}, res) : null, ps.length ? [h('h3', null, 'Prompts'), h('div', {class: 'pgrid'}, ps.map(promptCard))] : null]);
  }
  var tmr = 0; inp.addEventListener('input', function () { clearTimeout(tmr); tmr = setTimeout(function () { ui.q = inp.value.trim(); draw(); }, 180); });
  KD.clear(app);
  KD.add(app, [h('h1', {id: 'top', tabindex: '-1'}, 'Bibliothek'), h('p', {class: 'lede'}, 'Alles aus dem Dorf als lesbarer Text: zum Nachschlagen, Kopieren und Drucken.'),
    h('div', {class: 'row bibtools'}, h('label', {for: 'bibq'}, KD.icon('suche'), h('span', {class: 'sr'}, 'Bibliothek durchsuchen')), inp, btn('btn ghost noprint', [KD.icon('drucken'), ' Drucken'], function () { Array.prototype.forEach.call(body.querySelectorAll('details'), function (d) { d.open = true; }); window.print(); })), count, nav, body]);
  draw();
  if (KD.World) { KD.World.detach(); }
}

/* ---------- Fortschritt ---------- */
function viewFort() {
  var t = S.totals(), b = S.boxes(), msg = h('p', {class: 'small', role: 'status'}), code = h('output', {class: 'code', id: 'codeOut', tabindex: '-1'}, S.encode()), inp = h('input', {type: 'text', id: 'loadIn', autocomplete: 'off', spellcheck: 'false', placeholder: 'DORF-3-…'});
  function row(x) { var lv = S.level(x); return h('li', {class: 'frow'}, KD.hausSvg(x, lv), h('div', {class: 'fmain'}, link('#haus/' + x.id, [h('strong', null, x.name), h('small', null, ' ' + x.sub)]), x.tasks.length ? bar(S.pct(x), x.name) : null),
    h('div', {class: 'stuecke', 'aria-label': 'Sammelstücke: ' + lv + ' von 3'}, [1, 2, 3].map(function (n) { return h('span', {class: 'stueck' + (lv >= n ? ' on' : ''), 'aria-hidden': 'true'}, KD.icon(n === 1 ? 'bausteine' : n === 2 ? 'haus' : x.ic)); })), h('span', {class: 'lvl lv' + lv}, LV[lv])); }
  KD.clear(app);
  KD.add(app, [h('h1', {id: 'top', tabindex: '-1'}, 'Fortschritt'),
    h('div', {class: 'dorfgrid'},
      h('section', {class: 'panel'}, h('h2', null, 'Seminarhäuser'), h('div', {class: 'progress'}, bar(t.core, 'Seminarhäuser gesamt'), h('p', null, Math.round(t.core * 100) + ' %')), h('ul', {class: 'flist'}, KD.HOUSES.filter(function (x) { return !x.extra && !x.platz; }).map(row)),
        h('h2', null, 'Zusatzhäuser'), h('p', {class: 'small'}, 'Zum Selbststudium. Sie zählen nicht zum Seminarfortschritt.'), h('ul', {class: 'flist'}, KD.HOUSES.filter(function (x) { return x.extra; }).map(row)),
        h('p', {class: 'small'}, 'Sammelstücke gibt es für Gelerntes: eines für das Fundament, eines ab 80 Prozent gelöster Karten, eines für alle. Sie richten das Haus im 3D-Dorf ein.')),
      h('div', {class: 'stackcol'},
        h('section', {class: 'panel'}, h('h2', null, 'Dorfrunde'), h('ul', {class: 'boxes'}, [['Neu', b[0]], ['Wackelig', b[1]], ['Sitzt', b[2]]].map(function (r) { return h('li', null, h('strong', null, String(r[1])), ' ', r[0]); })), h('p', {class: 'small'}, 'Je mehr Karten sitzen, desto mehr Blumen und Laternen stehen im 3D-Dorf.'), S.dueCount() ? link('#runde', 'Dorfrunde starten', 'btn') : null,
          h('p', {class: 'small'}, 'Tipps gesammelt: ' + D.tips.length + ' von ' + KD.TIPS.length)),
        h('section', {class: 'panel'}, h('h2', null, 'Spielstand'), h('p', {class: 'small'}, 'Der Code enthält nur, wie weit jedes Haus gebaut ist. Keine Namen, keine Antworten. Er ist nicht fälschungssicher und kein Teilnahmenachweis. Codes aus dem Vorgänger (DORF-2-…) funktionieren weiter.'),
          h('div', {class: 'row'}, code, btn('btn ghost', [KD.icon('kopie'), ' Kopieren'], function () { KD.copy(code.textContent, msg, 'Code kopiert.'); })),
          h('div', {class: 'row'}, h('label', {for: 'loadIn'}, 'Code einfügen'), inp, btn('btn', 'Laden', function () { var d = S.decode(inp.value); if (!d) { msg.textContent = 'Der Code wurde nicht erkannt. Prüfe, ob er vollständig ist. Er beginnt mit DORF-3 oder DORF-2.'; return; } S.applyLevels(d); S.save(); viewFort(); document.getElementById('codeOut').focus(); KD.say('Spielstand geladen.'); })), msg)))]);
  if (KD.World) { KD.World.detach(); }
}

/* ---------- Impressum, Hinweise, Lizenzen ---------- */
function viewImp() {
  var I = KD.IMPRESSUM;
  KD.clear(app);
  KD.add(app, [h('h1', {id: 'top', tabindex: '-1'}, 'Impressum und Lizenzen'),
    h('section', {class: 'panel'}, h('h2', null, 'Impressum'), h('p', null, 'Für den Inhalt verantwortlich: ' + I.name), I.zeilen.map(function (z) { return h('p', null, z); }), h('p', null, I.zweck)),
    h('section', {class: 'panel'}, h('h2', null, 'Hinweise'), h('ul', null, I.hinweise.map(function (z) { return h('li', null, z); }))),
    h('section', {class: 'panel'}, h('h2', null, 'Datenschutz'), h('ul', null, I.daten.map(function (z) { return h('li', null, z); }))),
    h('section', {class: 'panel'}, h('h2', null, 'Lizenzen'), h('ul', null, I.lizenzen.map(function (z) { return h('li', null, z); })), h('p', null, link('#bibliothek', 'Alle Quellen stehen in der Bibliothek', 'more')))]);
  if (KD.World) { KD.World.detach(); }
}

/* ---------- Meldung ---------- */
var toastEl = document.getElementById('toast'), toastT = 0;
function toast(t) { toastEl.textContent = t; toastEl.hidden = false; clearTimeout(toastT); toastT = setTimeout(function () { toastEl.hidden = true; }, 3500); }

/* ---------- Wegweiser ---------- */
var navEls = document.querySelectorAll('.tabs a'), lastRoute = null;
function route() {
  var r = (location.hash || '').replace(/^#/, ''), p = r.split('/'), tab = 'dorf';
  if (p[0] === 'haus' && KD.BYID[p[1]]) { viewHaus(KD.BYID[p[1]]); }
  else if (p[0] === 'bibliothek') { tab = 'bibliothek'; viewBib(); }
  else if (p[0] === 'fortschritt') { tab = 'fortschritt'; viewFort(); }
  else if (p[0] === 'runde') { viewRunde(); }
  else if (p[0] === 'impressum') { tab = ''; viewImp(); }
  else { viewDorf(); }
  Array.prototype.forEach.call(navEls, function (a) { if (a.getAttribute('data-tab') === tab) { a.setAttribute('aria-current', 'page'); } else { a.removeAttribute('aria-current'); } });
  document.title = (p[0] === 'haus' && KD.BYID[p[1]] ? KD.BYID[p[1]].name + ' · ' : tab === 'bibliothek' ? 'Bibliothek · ' : tab === 'fortschritt' ? 'Fortschritt · ' : p[0] === 'impressum' ? 'Impressum · ' : '') + 'KI-Dorf';
  if (lastRoute !== null && lastRoute !== r) { window.scrollTo(0, 0); var top = document.getElementById('top'); if (top && !(KD.World && KD.World.wantsFocus())) { top.focus({preventScroll: true}); } }
  lastRoute = r;
}
window.addEventListener('hashchange', route);

/* ---------- Leiste ---------- */
var pauseBtn = document.getElementById('btnPause');
document.getElementById('btnHelp').addEventListener('click', function (e) { openHelp(e.currentTarget); });
document.getElementById('btnMenu').addEventListener('click', function (e) { openMenu(e.currentTarget); });
pauseBtn.addEventListener('click', function () {
  var on = pauseBtn.getAttribute('aria-pressed') !== 'true'; pauseBtn.setAttribute('aria-pressed', String(on));
  document.documentElement.classList.toggle('paused', on); KD.clear(pauseBtn); KD.add(pauseBtn, [KD.icon(on ? 'play' : 'pause'), h('span', null, on ? 'Weiter' : 'Pause')]);
  if (KD.World) { KD.World.pause(on); } KD.say(on ? 'Pausiert. Alle Bewegung steht.' : 'Weiter.');
});
[['btnHelp', 'hilfe', 'Hilfe'], ['btnPause', 'pause', 'Pause'], ['btnMenu', 'menue', 'Menü']].forEach(function (b) { var el = document.getElementById(b[0]); KD.clear(el); KD.add(el, [KD.icon(b[1]), h('span', null, b[2])]); });

KD.app = {
  go: function (id) { location.hash = '#haus/' + id; },
  npc: function (id) { openNpc(id, null); },
  pos: function (x, z, on) { if (posDot && posDot.isConnected) { posDot.setAttribute('cx', x.toFixed(1)); posDot.setAttribute('cy', z.toFixed(1)); posDot.setAttribute('visibility', on ? 'visible' : 'hidden'); } },
  openStep: function (k) { if (houseRefs.openStep) { houseRefs.openStep(k); } },
  help: openHelp
};

S.load(); applySettings(); route();
if (!D.seenHelp) { openHelp(null); }
if ('serviceWorker' in navigator && location.protocol === 'https:') { navigator.serviceWorker.register('sw.js').catch(function () { /* ohne Service Worker läuft alles, nur nicht offline aus dem Netz */ }); }
})();
