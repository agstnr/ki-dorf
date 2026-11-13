/* KI-Dorf: Kern. DOM-Helfer, Icons, Lernstand, Wiederholung, Spielstand-Code.
   Es wird nirgends HTML aus Zeichenketten zusammengesetzt: Alle Texte landen als Textknoten im Dokument. */
(function () {
'use strict';
var KD = window.KD;

/* ---------- DOM ---------- */
var SVGNS = 'http://www.w3.org/2000/svg';
/* h('button', {class:'btn', onclick:fn, 'aria-pressed':'true'}, 'Text', kind, [kinder]) */
function h(tag, attrs) {
  var el = document.createElement(tag), i, k;
  if (attrs) {
    for (k in attrs) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) { continue; }
      if (k === 'class') { el.className = v; }
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') { el.addEventListener(k.slice(2), v); }
      else if (k === 'text') { el.textContent = v; }
      else if (v === true) { el.setAttribute(k, ''); }
      else { el.setAttribute(k, String(v)); }
    }
  }
  for (i = 2; i < arguments.length; i++) { add(el, arguments[i]); }
  return el;
}
function add(el, kid) {
  if (kid === null || kid === undefined || kid === false) { return; }
  if (Array.isArray(kid)) { kid.forEach(function (x) { add(el, x); }); return; }
  el.appendChild(typeof kid === 'object' ? kid : document.createTextNode(String(kid)));
}
function clear(el) { while (el.firstChild) { el.removeChild(el.firstChild); } return el; }
function svg(tag, attrs) {
  var el = document.createElementNS(SVGNS, tag), k, i;
  for (k in attrs || {}) { if (attrs[k] !== null && attrs[k] !== undefined) { el.setAttribute(k, String(attrs[k])); } }
  for (i = 2; i < arguments.length; i++) { var c = arguments[i]; if (Array.isArray(c)) { c.forEach(function (x) { if (x) { el.appendChild(x); } }); } else if (c) { el.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c))); } }
  return el;
}
KD.h = h; KD.add = add; KD.clear = clear; KD.svg = svg;
KD.rm = function () { return document.documentElement.getAttribute('data-motion') === 'aus' || !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); };

/* ---------- Icons: 24er-Raster, Linie, runde Enden. Selbst gezeichnet. ---------- */
var I = {
  haus: 'M4 11l8-7 8 7M6 10v9h12v-9M10 19v-5h4v5',
  karte: 'M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14',
  weg: 'M5 20c0-6 14-4 14-10a3 3 0 0 0-6 0M5 20h.01M19 4h.01',
  brief: 'M3 6h18v12H3zM3 7l9 6 9-6',
  buch: 'M12 6c-2-1.500-5-2-8-1.500v13c3-.5 6 0 8 1.500 2-1.500 5-2 8-1.500v-13c-3-.5-6 0-8 1.500zM12 6v13',
  schloss: 'M6 11h12v9H6zM8.500 11V8a3.500 3.500 0 0 1 7 0v3M12 15v2',
  bausteine: 'M3 13h8v8H3zM13 13h8v8h-8zM8 3h8v8H8z',
  zettel: 'M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h5',
  lupe: 'M10.500 17a6.500 6.500 0 1 1 0-13 6.500 6.500 0 0 1 0 13zM15.500 15.500L21 21',
  zahnrad: 'M12 15.500a3.500 3.500 0 1 0 0-7 3.500 3.500 0 0 0 0 7zM12 2v3M12 19v3M2 12h3M19 12h3M4.900 4.900l2.100 2.100M17 17l2.100 2.100M4.900 19.100L7 17M17 7l2.100-2.100',
  roboter: 'M5 9h14v10H5zM12 9V5M12 5h.01M9 13h.01M15 13h.01M9 16.500h6M3 13v3M21 13v3',
  person: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.500-6 8-6s8 2 8 6',
  herz: 'M12 20s-7-4.500-7-10a4 4 0 0 1 7-2.500A4 4 0 0 1 19 10c0 5.500-7 10-7 10z',
  schere: 'M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.500 7.500L20 19M8.500 16.500L20 5',
  maske: 'M3 8c3-1.500 6-1.500 9 0 3-1.500 6-1.500 9 0 0 5-2 8-4.500 8-2 0-2.500-2-4.500-2s-2.500 2-4.500 2C5 16 3 13 3 8zM8 11h.01M16 11h.01',
  vertrag: 'M6 3h12v18H6zM9 8h6M9 12h6M9 17c1-2 2 1 3-1s2 1 3 0',
  glocke: 'M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4M12 3v2',
  ordner: 'M3 6h6l2 2h10v11H3z',
  liste: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  datei: 'M6 3h9l4 4v14H6zM15 3v4h4',
  stopp: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM5.600 5.600l12.800 12.800',
  kalender: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  haken: 'M4 12.500l5 5L20 6.500',
  stern: 'M12 3l2.700 5.700 6.300.800-4.600 4.300 1.200 6.200L12 17l-5.600 3 1.200-6.200L3 9.500l6.300-.800z',
  waage: 'M12 4v16M6 20h12M5 7h14M5 7l-2.500 6a2.500 2.500 0 0 0 5 0zM19 7l-2.500 6a2.500 2.500 0 0 0 5 0z',
  uhr: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  rahmen: 'M4 4h16v16H4zM8 8h8v8H8z',
  drei: 'M5 7h.01M5 12h.01M5 17h.01M9 7h10M9 12h10M9 17h10',
  welle: 'M3 9c3-3 6 3 9 0s6 3 9 0M3 15c3-3 6 3 9 0s6 3 9 0',
  tropfen: 'M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z',
  etikett: 'M3 12V4h8l10 10-8 8zM7.500 8.500h.01',
  feder: 'M20 4c-8 0-13 5-14 13l-2 3M6 17c5 0 9-2 11-6M10 14l5-5',
  stapel: 'M12 4l9 4.500-9 4.500-9-4.500zM3 12.500l9 4.500 9-4.500M3 16.500l9 4.500 9-4.500',
  saeulen: 'M3 9l9-5 9 5zM5 9v9M10 9v9M14 9v9M19 9v9M3 20h18',
  zwei: 'M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM16 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  eins: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM10.500 9l2-1.500V17',
  turm: 'M8 21V9l4-6 4 6v12zM8 13h8M12 16v5',
  plus: 'M12 5v14M5 12h14',
  pause: 'M8 5v14M16 5v14',
  play: 'M7 4l13 8-13 8z',
  werkzeug: 'M14 6a4 4 0 0 0 5 5l-9 9a2.100 2.100 0 0 1-3-3zM16 4l4 4',
  paket: 'M3 8l9-4 9 4v9l-9 4-9-4zM3 8l9 4 9-4M12 12v9',
  leuchtturm: 'M9 21l1.500-13h3L15 21zM10 8V5h4v3M7 21h10M4 5l3 1M20 5l-3 1M10 13h4',
  fenster: 'M3 5h18v14H3zM3 9h18M6 7h.01M9 7h.01',
  tabelle: 'M3 5h18v14H3zM3 10h18M3 14.500h18M9 5v14',
  weiche: 'M4 20L12 8V3M20 20L12 8M9 3h6',
  kiste: 'M4 8h16v12H4zM3 4h18v4H3zM10 12h4',
  hand: 'M8 13V5a1.500 1.500 0 0 1 3 0v6V4a1.500 1.500 0 0 1 3 0v7V6a1.500 1.500 0 0 1 3 0v9c0 4-2 6-5.500 6S6 19 5 16l-1.500-4a1.500 1.500 0 0 1 2.700-1.200z',
  pfeilzurueck: 'M9 14l-5-5 5-5M4 9h10a6 6 0 0 1 0 12h-3',
  zug: 'M6 4h12v12H6zM6 10h12M9 13.500h.01M15 13.500h.01M8 16l-2 4M16 16l2 4M10 4V2h4v2',
  wolke: 'M7 18a4 4 0 0 1-.500-8A5.500 5.500 0 0 1 17 9a4.500 4.500 0 0 1 0 9z',
  palette: 'M12 3a9 9 0 1 0 0 18c1.500 0 2-1 1.500-2.500-.500-1.500.500-2.500 2-2.500H18a3 3 0 0 0 3-3c0-5-4-10-9-10zM7.500 11h.01M10 7h.01M15 7.500h.01',
  bild: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M15.500 9h.01',
  kolben: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M7.500 15h9',
  anker: 'M12 8a2.500 2.500 0 1 0 0-5 2.500 2.500 0 0 0 0 5zM12 8v13M5 13a7 7 0 0 0 14 0M8 11h8',
  hilfe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.500 9.500a2.500 2.500 0 1 1 3.500 2.300c-.700.300-1 .900-1 1.700M12 17h.01',
  menue: 'M4 7h16M4 12h16M4 17h16',
  x: 'M6 6l12 12M18 6L6 18',
  pfeil: 'M5 12h14M13 6l6 6-6 6',
  pfeill: 'M19 12H5M11 6l-6 6 6 6',
  kopie: 'M9 9h11v11H9zM5 15H4V4h11v1',
  suche: 'M10.500 17a6.500 6.500 0 1 1 0-13 6.500 6.500 0 0 1 0 13zM15.500 15.500L21 21',
  quelle: 'M6 4h12v16l-6-4-6 4z',
  drucken: 'M7 8V3h10v5M5 8h14v9H5zM8 14h8v7H8z',
  auf: 'M6 15l6-6 6 6',
  ab: 'M6 9l6 6 6-6',
  neu: 'M4 12a8 8 0 1 1 2.500 5.800M4 20v-5h5',
  punkt: 'M12 12h.01'
};
I.projekt = I.ordner; I.bild2 = I.bild;
KD.icon = function (name, cls) {
  var d = (I[name] || I.punkt).replace(/(\d)\.(\d)00/g, '$1.$2');
  return svg('svg', {viewBox: '0 0 24 24', class: 'ic' + (cls ? ' ' + cls : ''), 'aria-hidden': 'true', focusable: 'false'}, svg('path', {d: d}));
};

/* ---------- Lernstand ---------- */
var KEY = 'ki-dorf-v3', KEY_V2 = 'ki-dorf-v2';
var S = {v: 3, h: {}, k: {}, set: {}, tips: [], wc: [], fig: 'c-coral', seenHelp: false};
function hs(id) { if (!S.h[id]) { S.h[id] = {f: 0, q: 0, s: {}, g: 0, c: {}}; } return S.h[id]; }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* Speicher gesperrt: Das Spiel läuft weiter, merkt sich aber nichts. */ } }
function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var o = JSON.parse(raw);
      if (o && o.v === 3 && typeof o.h === 'object') {
        S.h = o.h || {}; S.k = o.k || {}; S.set = o.set || {}; S.wc = Array.isArray(o.wc) ? o.wc.slice(0, 80) : [];
        S.tips = Array.isArray(o.tips) ? o.tips.filter(function (i) { return typeof i === 'number' && i >= 0 && i < KD.TIPS.length; }) : [];
        S.fig = typeof o.fig === 'string' ? o.fig : S.fig; S.seenHelp = !!o.seenHelp;
        Object.keys(S.h).forEach(function (id) { var x = S.h[id]; if (!KD.BYID[id] || typeof x !== 'object' || !x) { delete S.h[id]; return; } x.s = x.s || {}; x.c = x.c || {}; x.g = +x.g || 0; });
        return;
      }
    }
    var old = localStorage.getItem(KEY_V2);
    if (old) { var d = decode(old); if (d) { applyLevels(d); save(); } }
  } catch (e) { /* unlesbarer Stand wird ignoriert */ }
}
function today() { var d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 864e5); }

/* Einheiten eines Hauses: jede Karte in sort, mark, scenario zählt einzeln, alle anderen Aufgaben als eine Einheit. */
function units(hh) {
  var out = [];
  (hh.tasks || []).forEach(function (t, ti) {
    var n = t.type === 'sort' || t.type === 'mark' ? t.items.length : t.type === 'scenario' ? t.steps.length : 0;
    if (n) { for (var i = 0; i < n; i++) { out.push({cid: hh.id + '.' + ti + '.' + i, ti: ti, ii: i, atom: true}); } }
    else { out.push({cid: hh.id + '.' + ti + '.x', ti: ti, ii: -1, atom: false}); }
  });
  return out;
}
function solvedCount(hh) { var s = hs(hh.id).s; return units(hh).filter(function (u) { return s[u.cid]; }).length; }
function pct(hh) { var u = units(hh); if (!u.length) { return hs(hh.id).f ? 1 : 0; } var g = hs(hh.id).g; if (g >= 3) { return 1; } return Math.max(solvedCount(hh) / u.length, g === 2 ? 0.8 : 0); }
function level(hh) {
  var st = hs(hh.id), p = pct(hh), l = 0;
  if (st.f || p > 0) { l = 1; }
  if (p >= 0.8) { l = 2; }
  if (p >= 1) { l = 3; }
  return Math.max(l, Math.min(3, st.g || 0));
}
function taskDone(hh, ti) { var s = hs(hh.id).s, g = hs(hh.id).g; if (g >= 3) { return true; } return units(hh).filter(function (u) { return u.ti === ti; }).every(function (u) { return s[u.cid]; }); }
function taskCount(hh, ti) { var s = hs(hh.id).s, us = units(hh).filter(function (u) { return u.ti === ti; }); return [us.filter(function (u) { return s[u.cid]; }).length, us.length]; }
/* Antwort festhalten. first = beim ersten Versuch richtig. Fächer: 0 neu, 1 wackelig, 2 sitzt. */
function record(cid, first, round) {
  var hid = cid.split('.')[0], st = hs(hid), k = S.k[cid] || [0, 0, 0, 0];
  st.s[cid] = 1;
  k[1] += 1; if (first) { k[2] += 1; }
  if (round) { k[0] = first ? Math.min(2, k[0] + 1) : 1; }
  else if (k[1] === 1) { k[0] = first ? 2 : 1; }
  else if (!first) { k[0] = 1; }
  k[3] = today(); S.k[cid] = k; save();
}
function visited() { return KD.HOUSES.filter(function (hh) { var st = S.h[hh.id]; return st && (st.f || Object.keys(st.s).length); }); }
/* Dorfrunde: fünf Einzelkarten aus besuchten Häusern, Wackeliges und lange nicht Gesehenes zuerst. */
function roundCards(n) {
  var t = today(), pool = [];
  visited().forEach(function (hh) {
    units(hh).forEach(function (u) {
      if (!u.atom) { return; }
      var k = S.k[u.cid]; if (!k) { return; }
      var age = t - k[3], score = (k[0] === 1 ? 100 : k[0] === 0 ? 40 : 0) + Math.min(60, age * 6) + Math.random() * 10;
      pool.push({hid: hh.id, ti: u.ti, ii: u.ii, cid: u.cid, score: score});
    });
  });
  pool.sort(function (a, b) { return b.score - a.score; });
  return pool.slice(0, n || 5);
}
function boxes() { var b = [0, 0, 0]; Object.keys(S.k).forEach(function (c) { if (KD.BYID[c.split('.')[0]]) { b[S.k[c][0]] += 1; } }); return b; }
function dueCount() { var t = today(), n = 0; Object.keys(S.k).forEach(function (c) { var k = S.k[c]; if (c.slice(-2) !== '.x' && (k[0] === 1 || t - k[3] >= 1)) { n++; } }); return Math.min(5, n); }
function totals() {
  var core = KD.HOUSES.filter(function (x) { return !x.extra && !x.platz; }), ext = KD.HOUSES.filter(function (x) { return x.extra; });
  var sum = function (arr) { return arr.reduce(function (n, x) { return n + pct(x); }, 0) / (arr.length || 1); };
  return {core: sum(core), extra: sum(ext), done: core.filter(function (x) { return level(x) >= 3; }).length, n: core.length};
}
function nextHouse() { for (var i = 0; i < KD.HOUSES.length; i++) { var x = KD.HOUSES[i]; if (!x.platz && !x.extra && level(x) < 2) { return x; } } for (i = 0; i < KD.HOUSES.length; i++) { if (!KD.HOUSES[i].platz && level(KD.HOUSES[i]) < 3) { return KD.HOUSES[i]; } } return null; }
function tipOfDay() {
  var v = visited().map(function (x) { return x.id; }), pool = [];
  KD.TIPS.forEach(function (t, i) { if (v.indexOf(t.haus) >= 0) { pool.push(i); } });
  if (pool.length < 5) { pool = KD.TIPS.map(function (t, i) { return i; }); }
  return pool[today() % pool.length];
}
function seeTip(i) { if (S.tips.indexOf(i) < 0) { S.tips.push(i); save(); } }

/* ---------- Spielstand-Code ----------
   DORF-3-<Base32>-<Prüfzeichen>: 2 Bits je Haus (Stufe 0 bis 3) in slot-Reihenfolge. Enthält keine Eingaben.
   Codes DORF-2 aus dem Vorgänger werden eingelesen. */
var ALPH = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
var V2 = ['fundamenthaus', 'tresorhaus', 'projekthaus', 'werkstatt', 'detektivbuero', 'schreibstube', 'archiv', 'atelier', 'bahnhof', 'labor', 'post'];
function chk(body) { var s = 0; for (var i = 0; i < body.length; i++) { s = (s + ALPH.indexOf(body.charAt(i)) * (2 * i + 1)) % 32; } return ALPH.charAt(s); }
function bySlot(n) { for (var i = 0; i < KD.HOUSES.length; i++) { if (KD.HOUSES[i].slot === n) { return KD.HOUSES[i]; } } return null; }
function encode() {
  var max = KD.HOUSES.reduce(function (m, x) { return Math.max(m, x.slot); }, 0), bits = '', body = '';
  for (var s = 0; s <= max; s++) { var x = bySlot(s), l = x ? level(x) : 0; bits += (l >> 1 & 1) + '' + (l & 1); }
  while (bits.length % 5) { bits += '0'; }
  for (var i = 0; i < bits.length; i += 5) { body += ALPH.charAt(parseInt(bits.substr(i, 5), 2)); }
  return 'DORF-3-' + body + '-' + chk(body);
}
function decode(str) {
  var s = String(str || '').toUpperCase().replace(/[\s\-–—_.]/g, ''), m = /^DORF([23])([0-9A-Z]+)$/.exec(s);
  if (!m) { return null; }
  var rest = m[2].replace(/O/g, '0').replace(/[IL]/g, '1');
  if (rest.length < 2) { return null; }
  var body = rest.slice(0, -1), c = rest.slice(-1), bits = '', out = {}, i;
  for (i = 0; i < body.length; i++) { var n = ALPH.indexOf(body.charAt(i)); if (n < 0) { return null; } var b = n.toString(2); while (b.length < 5) { b = '0' + b; } bits += b; }
  if (chk(body) !== c) { return null; }
  if (m[1] === '2') {
    for (i = 0; i * 3 + 2 < bits.length && i < V2.length; i++) { out[V2[i]] = (bits.charAt(i * 3) === '1' ? 1 : 0) + (bits.charAt(i * 3 + 1) === '1' ? 1 : 0) + (bits.charAt(i * 3 + 2) === '1' ? 1 : 0); }
    return out;
  }
  for (i = 0; i * 2 + 1 < bits.length; i++) { var x = bySlot(i); if (x) { out[x.id] = parseInt(bits.substr(i * 2, 2), 2); } }
  return out;
}
function applyLevels(d) { Object.keys(d).forEach(function (id) { if (KD.BYID[id] && d[id] > 0) { var st = hs(id); st.g = Math.max(st.g || 0, d[id]); st.f = 1; } }); }
function reset() { S.h = {}; S.k = {}; S.tips = []; S.wc = []; save(); }
function wipe() { try { ['ki-dorf-v3', 'ki-dorf-v2', 'ki-dorf-v1', 'ki-dorf-ansicht', 'ki-dorf-figur', 'ki-dorf-gebaut', 'ki-dorf-tipps'].forEach(function (k) { localStorage.removeItem(k); }); } catch (e) { /* nichts zu löschen */ } S.h = {}; S.k = {}; S.tips = []; S.wc = []; S.set = {}; S.seenHelp = false; }

KD.S = {data: S, hs: hs, save: save, load: load, units: units, pct: pct, level: level, solvedCount: solvedCount, taskDone: taskDone, taskCount: taskCount, record: record,
  visited: visited, roundCards: roundCards, boxes: boxes, dueCount: dueCount, totals: totals, nextHouse: nextHouse, tipOfDay: tipOfDay, seeTip: seeTip, today: today,
  encode: encode, decode: decode, applyLevels: applyLevels, reset: reset, wipe: wipe};

/* ---------- Kopieren ---------- */
KD.copy = function (text, msgEl, okText) {
  var done = function () { if (msgEl) { msgEl.textContent = okText || 'Kopiert.'; } };
  var fallback = function () {
    var ta = h('textarea', {class: 'sr', readonly: true}); ta.value = text; document.body.appendChild(ta); ta.select();
    var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    if (ok) { done(); } else if (msgEl) { msgEl.textContent = 'Kopieren ist hier gesperrt. Markiere den Text und kopiere mit Strg+C oder Cmd+C.'; }
  };
  try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, fallback); } else { fallback(); } } catch (e) { fallback(); }
};
})();
