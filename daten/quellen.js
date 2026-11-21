/* KI-Dorf: Quellen, Dorfbewohner:innen, Tipps.
   Status: o = am Original gelesen, z = an Zweitquelle gelesen, r = Existenz im DOI-Register bestätigt, e = Erfahrungswissen.
   abruf = Tag, an dem die Quelle zuletzt geprüft wurde. */
window.KD = window.KD || {};
KD.STAND = 'November 2026';
KD.ABRUF = '13.11.2026';

KD.SRC = {
  dsgvo4: {kurz: '§ DSGVO Art. 4', titel: 'Datenschutz-Grundverordnung, Art. 4 Nr. 1: personenbezogene Daten', hg: 'Europäische Union, Verordnung (EU) 2016/679', stand: '2016', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj', st: 'z', notiz: 'Wortlaut über dsgvo-gesetz.de gelesen. Der amtliche Text auf EUR-Lex war beim Prüfen nicht abrufbar.'},
  dsgvo5: {kurz: '§ DSGVO Art. 5', titel: 'Datenschutz-Grundverordnung, Art. 5 Abs. 1 lit. c: Datenminimierung', hg: 'Europäische Union, Verordnung (EU) 2016/679', stand: '2016', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj', st: 'z', notiz: 'Wortlaut über dsgvo-gesetz.de gelesen.'},
  dsgvo9: {kurz: '§ DSGVO Art. 9', titel: 'Datenschutz-Grundverordnung, Art. 9: besondere Kategorien personenbezogener Daten', hg: 'Europäische Union, Verordnung (EU) 2016/679', stand: '2016', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj', st: 'z', notiz: 'Wortlaut über dsgvo-gesetz.de gelesen.'},
  dsgvo28: {kurz: '§ DSGVO Art. 28', titel: 'Datenschutz-Grundverordnung, Art. 28: Auftragsverarbeiter', hg: 'Europäische Union, Verordnung (EU) 2016/679', stand: '2016', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj', st: 'z', notiz: 'Wortlaut über dsgvo-gesetz.de gelesen.'},
  dsgvo33: {kurz: '§ DSGVO Art. 33', titel: 'Datenschutz-Grundverordnung, Art. 33: Meldung von Datenschutzverletzungen', hg: 'Europäische Union, Verordnung (EU) 2016/679', stand: '2016', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj', st: 'z', notiz: 'Wortlaut über dsgvo-gesetz.de gelesen. Die Frist von 72 Stunden gilt für die Organisation gegenüber der Aufsichtsbehörde.'},
  dsgvo44: {kurz: '§ DSGVO Art. 44', titel: 'Datenschutz-Grundverordnung, Art. 44: Übermittlung in Drittländer', hg: 'Europäische Union, Verordnung (EU) 2016/679', stand: '2016', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj', st: 'z', notiz: 'Wortlaut über dsgvo-gesetz.de gelesen.'},
  eg26: {kurz: '§ DSGVO EG 26', titel: 'Datenschutz-Grundverordnung, Erwägungsgrund 26: anonyme und pseudonymisierte Daten', hg: 'Europäische Union, Verordnung (EU) 2016/679', stand: '2016', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj', st: 'z', notiz: 'Wortlaut über dsgvo-gesetz.de gelesen.'},
  kivo4: {kurz: '§ KI-VO Art. 4', titel: 'KI-Verordnung, Art. 4: KI-Kompetenz', hg: 'Europäische Union, Verordnung (EU) 2024/1689', stand: 'gilt seit 2. Februar 2025, 2026 geändert', url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj', st: 'z', notiz: 'Ursprünglicher Wortlaut über artificialintelligenceact.eu gelesen. Laut EU-Kommission wurde Artikel 4 durch den „AI Omnibus“ geändert (in Kraft seit 27. Juli 2026). Den neuen Wortlaut konnten wir nicht am Amtsblatt prüfen.'},
  kivo50: {kurz: '§ KI-VO Art. 50', titel: 'KI-Verordnung, Art. 50: Transparenzpflichten', hg: 'Europäische Union, Verordnung (EU) 2024/1689', stand: 'gilt seit 2. August 2026', url: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj', st: 'z', notiz: 'Wortlaut und Geltungsbeginn über artificialintelligenceact.eu gelesen (Art. 50 und Art. 113). Der amtliche Text war beim Prüfen nicht abrufbar.'},
  omnibus: {kurz: 'EU-Kommission 07/2026', titel: 'AI Omnibus enters into force', hg: 'Europäische Kommission', stand: '27.07.2026', url: 'https://digital-strategy.ec.europa.eu/en/news/ai-omnibus-enters-force', st: 'o', notiz: 'Meldung der Kommission. Die Änderungsverordnung selbst haben wir nicht gelesen.'},
  a_train: {kurz: 'Anthropic', titel: 'Einstellung „Help Improve our AI models“ (Free, Pro, Max)', hg: 'Anthropic Privacy Center, Artikel 12109829', stand: '03.08.2026', url: 'https://privacy.claude.com/en/articles/12109829', st: 'o', notiz: 'Welche Voreinstellung gilt, steht auf der Seite nicht.'},
  a_retain: {kurz: 'Anthropic', titel: 'How long do you store my data?', hg: 'Anthropic Privacy Center, Artikel 10023548', stand: '01.07.2026', url: 'https://privacy.claude.com/en/articles/10023548-how-long-do-you-store-my-data', st: 'o', notiz: ''},
  a_comm: {kurz: 'Anthropic', titel: 'Is my data used for model training? (Geschäftskunden)', hg: 'Anthropic Privacy Center, Artikel 7996868', stand: '18.08.2026', url: 'https://privacy.claude.com/en/articles/7996868-is-my-data-used-for-model-training', st: 'o', notiz: ''},
  a_memory: {kurz: 'Anthropic', titel: 'Use Claude’s chat search and memory to build on previous context', hg: 'Anthropic Hilfecenter, Artikel 11817273', stand: 'ohne Datum, abgerufen 13.11.2026', url: 'https://support.claude.com/en/articles/11817273', st: 'o', notiz: ''},
  a_inkognito: {kurz: 'Anthropic', titel: 'Using incognito chats', hg: 'Anthropic Hilfecenter, Artikel 12260368', stand: 'ohne Datum, abgerufen 13.11.2026', url: 'https://support.claude.com/en/articles/12260368-using-incognito-chats', st: 'o', notiz: ''},
  a_proj: {kurz: 'Anthropic', titel: 'What are projects?', hg: 'Anthropic Hilfecenter, Artikel 9517075', stand: 'ohne Datum, abgerufen 13.11.2026', url: 'https://support.claude.com/en/articles/9517075-what-are-projects', st: 'o', notiz: ''},
  a_skills: {kurz: 'Anthropic', titel: 'Skills in Claude verwenden und eigene Skills erstellen', hg: 'Anthropic Hilfecenter, Artikel 12512180 und 12512198', stand: 'ohne Datum, abgerufen 13.11.2026', url: 'https://support.claude.com/en/articles/12512180', st: 'o', notiz: ''},
  a_chrome: {kurz: 'Anthropic', titel: 'Claude in Chrome: Einstieg und sichere Nutzung', hg: 'Anthropic Hilfecenter, Artikel 12012173 und 12902428', stand: 'ohne Datum, abgerufen 13.11.2026', url: 'https://support.claude.com/en/articles/12902428-using-claude-in-chrome-safely', st: 'o', notiz: ''},
  a_cowork: {kurz: 'Anthropic', titel: 'Claude Cowork: mit lokalen Dateien arbeiten', hg: 'Anthropic Hilfecenter, Artikel 13345190', stand: 'ohne Datum, abgerufen 13.11.2026', url: 'https://support.claude.com/en/articles/13345190', st: 'o', notiz: ''},
  a_sched: {kurz: 'Anthropic', titel: 'Geplante Aufgaben (Scheduled tasks)', hg: 'Anthropic Hilfecenter, Artikel 13854387', stand: 'ohne Datum, abgerufen 13.11.2026', url: 'https://support.claude.com/en/articles/13854387', st: 'o', notiz: 'Zwei Hilfeartikel beschreiben unterschiedlich, wann eine Aufgabe ohne eingeschalteten Rechner läuft. Vor dem Einrichten selbst nachlesen.'},
  a_design: {kurz: 'Anthropic', titel: 'Get started with Claude Design', hg: 'Anthropic Hilfecenter, Artikel 14604416', stand: 'ohne Datum, abgerufen 13.11.2026', url: 'https://support.claude.com/en/articles/14604416-get-started-with-claude-design', st: 'o', notiz: ''},
  a_conn: {kurz: 'Anthropic', titel: 'Use connectors to extend Claude’s capabilities', hg: 'Anthropic Hilfecenter, Artikel 11176164', stand: 'ohne Datum, abgerufen 13.11.2026', url: 'https://support.claude.com/en/articles/11176164-pre-built-web-connectors-using-remote-mcp', st: 'o', notiz: ''},
  a_plugins: {kurz: 'Anthropic', titel: 'Use plugins in Claude', hg: 'Anthropic Hilfecenter, Artikel 13837440', stand: 'ohne Datum, abgerufen 13.11.2026', url: 'https://support.claude.com/en/articles/13837440-use-plugins-in-cowork', st: 'o', notiz: ''},
  ji: {kurz: 'Ji et al. 2023', titel: 'Survey of Hallucination in Natural Language Generation', hg: 'Ji, Lee, Frieske, Yu et al., ACM Computing Surveys 55(12)', stand: '2023', url: 'https://doi.org/10.1145/3571730', st: 'r', notiz: ''},
  walters: {kurz: 'Walters & Wilder 2023', titel: 'Fabrication and errors in the bibliographic citations generated by ChatGPT', hg: 'Walters & Wilder, Scientific Reports 13', stand: '2023', url: 'https://doi.org/10.1038/s41598-023-41032-5', st: 'r', notiz: 'Untersucht wurden ChatGPT-3.5 und ChatGPT-4. Für neuere Modelle gelten die Zahlen nicht automatisch.'},
  weber: {kurz: 'Weber-Wulff et al. 2023', titel: 'Testing of detection tools for AI-generated text', hg: 'Weber-Wulff, Anohina-Naumeca, Bjelobaba, Foltýnek et al., International Journal for Educational Integrity 19(1)', stand: '2023', url: 'https://doi.org/10.1007/s40979-023-00146-z', st: 'r', notiz: ''},
  liang: {kurz: 'Liang et al. 2023', titel: 'GPT detectors are biased against non-native English writers', hg: 'Liang, Yuksekgonul, Mao, Wu, Zou, Patterns 4(7)', stand: '2023', url: 'https://doi.org/10.1016/j.patter.2023.100779', st: 'r', notiz: ''},
  erf: {kurz: 'Erfahrungswissen', titel: 'Erfahrungswissen aus der Seminarpraxis', hg: 'Aisha Gstöttner', stand: KD.STAND, url: '', st: 'e', notiz: 'Kein Forschungsbeleg. Probier es an deiner eigenen Aufgabe aus.'},
  anbieter: {kurz: 'Anbieterseite prüfen', titel: 'Hilfeseiten deines Anbieters', hg: 'Anthropic (Claude), OpenAI (ChatGPT)', stand: '', url: '', st: 'e', notiz: 'Claude: support.anthropic.com. ChatGPT: help.openai.com.'}
};
KD.SRC_STATUS = {o: 'geprüft am Original', z: 'geprüft an Zweitquelle', r: 'Existenz im DOI-Register bestätigt', e: 'ohne Beleg, selbst prüfen'};

/* Quellen zur Gestaltung des Spiels, nur in der Bibliothek */
KD.SRC_LERN = [
  ['Dunlosky, Rawson, Marsh, Nathan & Willingham (2013). Improving Students’ Learning With Effective Learning Techniques. Psychological Science in the Public Interest 14(1), 4–58.', 'https://doi.org/10.1177/1529100612453266', 'Einstiegsfragen und Dorfrunde: sich selbst abfragen und verteilt üben'],
  ['Roediger & Karpicke (2006). Test-Enhanced Learning. Psychological Science 17(3), 249–255.', 'https://doi.org/10.1111/j.1467-9280.2006.01693.x', 'Abrufen statt Wiederlesen'],
  ['Adesope, Trevisan & Sundararajan (2017). Rethinking the Use of Tests: A Meta-Analysis of Practice Testing. Review of Educational Research 87(3), 659–701.', 'https://doi.org/10.3102/0034654316689306', 'Übungsaufgaben'],
  ['Cepeda, Pashler, Vul, Wixted & Rohrer (2006). Distributed practice in verbal recall tasks. Psychological Bulletin 132(3), 354–380.', 'https://doi.org/10.1037/0033-2909.132.3.354', 'Wiederholung mit Abstand'],
  ['Hattie & Timperley (2007). The Power of Feedback. Review of Educational Research 77(1), 81–112.', 'https://doi.org/10.3102/003465430298487', 'Rückmeldung'],
  ['Shute (2008). Focus on Formative Feedback. Review of Educational Research 78(1), 153–189.', 'https://doi.org/10.3102/0034654307313795', 'Erst Hinweis, dann Erklärung'],
  ['Wisniewski, Zierer & Hattie (2020). The Power of Feedback Revisited. Frontiers in Psychology 10, 3087.', 'https://doi.org/10.3389/fpsyg.2019.03087', 'Rückmeldung mit Begründung'],
  ['Sweller, van Merriënboer & Paas (2019). Cognitive Architecture and Instructional Design: 20 Years Later. Educational Psychology Review 31(2), 261–292.', 'https://doi.org/10.1007/s10648-019-09465-5', 'Wenig Text pro Karte'],
  ['Atkinson, Derry, Renkl & Wortham (2000). Learning from Examples. Review of Educational Research 70(2), 181–214.', 'https://doi.org/10.3102/00346543070002181', 'Vorgemachte Beispiele'],
  ['Wood, Bruner & Ross (1976). The Role of Tutoring in Problem Solving. Journal of Child Psychology and Psychiatry 17(2), 89–100.', 'https://doi.org/10.1111/j.1469-7610.1976.tb00381.x', 'Gestufte Hilfe'],
  ['Mayer (2009). Multimedia Learning, 2. Auflage. Cambridge University Press.', 'https://doi.org/10.1017/CBO9780511811678', 'Bild und Text zusammen, kleine Einheiten'],
  ['Sundararajan & Adesope (2020). Keep it Coherent: A Meta-Analysis of the Seductive Details Effect. Educational Psychology Review 32(3), 707–734.', 'https://doi.org/10.1007/s10648-020-09522-4', 'Kein schmückendes Beiwerk'],
  ['Ryan & Deci (2000). Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being. American Psychologist 55(1), 68–78.', 'https://doi.org/10.1037/0003-066X.55.1.68', 'Wahlfreiheit, kein Druck'],
  ['Deci, Koestner & Ryan (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. Psychological Bulletin 125(6), 627–668.', 'https://doi.org/10.1037/0033-2909.125.6.627', 'Sammelstücke als Rückmeldung, nicht als Währung'],
  ['Sailer & Homner (2020). The Gamification of Learning: a Meta-analysis. Educational Psychology Review 32(1), 77–112.', 'https://doi.org/10.1007/s10648-019-09498-w', 'Spielelemente sparsam'],
  ['Wouters, van Nimwegen, van Oostendorp & van der Spek (2013). A meta-analysis of the cognitive and motivational effects of serious games. Journal of Educational Psychology 105(2), 249–265.', 'https://doi.org/10.1037/a0031311', 'Lernspiele'],
  ['Clark, Tanner-Smith & Killingsworth (2016). Digital Games, Design, and Learning. Review of Educational Research 86(1), 79–122.', 'https://doi.org/10.3102/0034654315582065', 'Lernspiele'],
  ['W3C (2023). Web Content Accessibility Guidelines (WCAG) 2.2.', 'https://www.w3.org/TR/WCAG22/', 'Barrierefreiheit']
];

/* Impressum und Hinweise. Hier ergänzen, was rechtlich nötig ist (zum Beispiel Anschrift und Kontakt). */
KD.IMPRESSUM = {
  name: 'Aisha Gstöttner',
  zeilen: [],
  zweck: 'Das KI-Dorf ist ein Begleitspiel zum KI-Seminar. Es ist kostenlos und enthält keine Werbung.',
  hinweise: [
    'Alle Beispiele in den Aufgaben sind erfunden.',
    'Die Prompts der Promptsammlung sind auf Aufbau, Platzhalter und Datenschutz geprüft, aber in keinem KI-Tool getestet. Die Beschreibungen typischer Ergebnisse sind keine echten Läufe.'
  ],
  daten: [
    'Das Dorf sendet nichts und kennt keine Konten. Es speichert nur in diesem Browser: Lernstand, Einstellungen, angehakte Checklisten, gesammelte Tipps und die Wörter der Wordcloud. Keine Namen, keine Antworttexte.',
    'Im Menü lässt sich alles mit einem Knopf löschen.',
    'Die Seite liegt bei GitHub Pages. Beim Abruf fallen dort technisch nötige Verbindungsdaten an. Wer das Dorf als Ordner vom eigenen Gerät öffnet, braucht keine Verbindung.',
    'Links zu Quellen und zum Feedback-Formular öffnen fremde Seiten erst nach einem Klick.'
  ],
  lizenzen: [
    'three.js r187: MIT-Lizenz, Copyright 2010–2026 three.js authors, threejs.org. Der Lizenztext liegt im Ordner vendor.',
    'Schriften Fredoka und Nunito: SIL Open Font License 1.1.',
    'Icons, Infografiken, Texte und Aufgaben wurden für dieses Spiel erstellt.'
  ]
};

/* Dorfbewohner:innen. farbe = Farbname aus dem CSS, pos = Platz im 3D-Dorf */
KD.NPCS = [
  {id: 'mira', name: 'Mira', beruf: 'Briefträgerin', farbe: 'c-coral', pos: [-4.2, 20.2], hallo: 'Ich komme überall vorbei. Frag mich, wenn du nicht weißt, wo du anfangen sollst.'},
  {id: 'ada', name: 'Ada', beruf: 'Archivarin', farbe: 'c-violet', pos: [6.5, 4.2], hallo: 'Bei mir zählt nur, was im Original steht.'},
  {id: 'sevi', name: 'Sevi', beruf: 'Schlosserin', farbe: 'c-teal', pos: [-12.5, 15.2], hallo: 'Ich baue Schlösser. Die meisten Türen stehen aber offen, weil niemand nachsieht.'},
  {id: 'tobi', name: 'Tobi', beruf: 'Stellwerker', farbe: 'c-amber', pos: [-6.5, -12.2], hallo: 'Bei mir fährt nichts los, bevor die Weichen stimmen.'},
  {id: 'kito', name: 'Kito', beruf: 'Leuchtturmwärter', farbe: 'c-blue', pos: [14.5, -9.6], hallo: 'Von oben sieht man, wohin ein Schiff wirklich fährt.'}
];

/* Tipps. Neue Tipps nur hinten anhängen. */
KD.TIPS = [
  {t: 'Neues Thema, neuer Chat. In langen Chats gehen frühe Anweisungen leichter unter.', haus: 'werkstatt', npc: 'tobi'},
  {t: 'Sag der KI, für wen der Text ist. Die Zielgruppe ändert Ton, Wortwahl und Länge.', haus: 'werkstatt', npc: 'mira'},
  {t: 'Gib ein Beispiel für das gewünschte Ergebnis. Ein Muster sagt oft mehr als eine lange Beschreibung.', haus: 'werkstatt', npc: 'mira'},
  {t: 'Bitte die KI, dir zuerst Rückfragen zu stellen, bevor sie loslegt.', haus: 'werkstatt', npc: 'tobi'},
  {t: 'Ist dir die Antwort zu lang, sag, wie lang sie sein soll, etwa „höchstens fünf Sätze“.', haus: 'werkstatt', npc: 'mira'},
  {t: 'Lass dir zu jeder Zahl die Quelle nennen und öffne sie selbst.', haus: 'archiv', npc: 'ada'},
  {t: 'Findest du eine genannte Quelle nicht, gilt die Aussage als unbelegt.', haus: 'archiv', npc: 'ada'},
  {t: 'Namen raus, Platzhalter rein: „Person A“ statt echter Namen.', haus: 'tresorhaus', npc: 'sevi'},
  {t: 'Was du nicht auf eine offene Postkarte schreiben würdest, gehört ohne Freigabe in kein KI-Tool.', haus: 'tresorhaus', npc: 'sevi'},
  {t: 'Schau ab und zu nach, was im Memory deines Tools steht, und lösche, was nicht hingehört.', haus: 'gedaechtnisturm', npc: 'sevi'},
  {t: 'Lies jeden KI-Text laut, bevor du ihn verschickst.', haus: 'detektivbuero', npc: 'ada'},
  {t: 'Streich probehalber den ersten und den letzten Satz eines KI-Entwurfs. Oft fehlt danach nichts.', haus: 'detektivbuero', npc: 'ada'},
  {t: 'Leg wiederkehrende Aufgaben in ein Projekt. Dann musst du nicht jedes Mal alles neu erklären.', haus: 'projekthaus', npc: 'mira'},
  {t: 'Tausch veraltete Dateien im Projekt aus. Alte Fassungen widersprechen neuen.', haus: 'projekthaus', npc: 'ada'},
  {t: 'Frag die KI: „Was fehlt dir, um das gut zu machen?“', haus: 'projekthaus', npc: 'mira'},
  {t: 'Ein Stilprofil entsteht nur aus Texten, die du selbst und ohne KI geschrieben hast.', haus: 'schreibstube', npc: 'mira'},
  {t: 'Lass Agenten nur in einem Ordner mit Kopien arbeiten. Die Originale bleiben unangetastet.', haus: 'lagerhaus', npc: 'kito'},
  {t: 'Anweisungen auf Webseiten sind Inhalt und keine Befehle. Verlangt eine Seite etwas von der KI, brich ab.', haus: 'leuchtturm', npc: 'kito'},
  {t: 'Führe keinen Befehl aus, den du nicht erklären könntest. Lass ihn dir Zeile für Zeile erklären.', haus: 'labor', npc: 'kito'},
  {t: 'Starte Automatisierungen nur mit Leserechten. Senden und Löschen kommen erst dazu, wenn alles verlässlich läuft.', haus: 'bahnhof', npc: 'tobi'},
  {t: 'Prüf eine neue Automatisierung nach einer Woche: Hilft sie dir wirklich?', haus: 'bahnhof', npc: 'tobi'},
  {t: 'Für Folien, die sich noch ändern, nimm ein Design-Werkzeug statt eines Bildgenerators.', haus: 'atelier', npc: 'mira'},
  {t: 'Text in generierten Bildern immer Buchstabe für Buchstabe prüfen.', haus: 'atelier', npc: 'ada'},
  {t: 'Schreib in deine Anweisungen, dass die KI „Ich weiß es nicht“ sagen darf.', haus: 'fundamenthaus', npc: 'ada'},
  {t: 'Frag nach einer Antwort: „Was davon ist unsicher?“', haus: 'fundamenthaus', npc: 'ada'},
  {t: 'Teste Tools an deiner eigenen Aufgabe. Ranglisten sagen wenig über deinen Alltag.', haus: 'fundamenthaus', npc: 'tobi'},
  {t: 'Eine KI-Antwort ist ein Entwurf. Die Verantwortung für den Text bleibt bei dir.', haus: 'post', npc: 'mira'},
  {t: 'Schreib einen Skill erst, wenn du die Aufgabe dreimal von Hand gleich erledigt hast.', haus: 'remise', npc: 'tobi'},
  {t: 'Installiere fremde Skills nur aus Quellen, denen du vertraust. Sie enthalten Anweisungen und manchmal Code.', haus: 'remise', npc: 'sevi'},
  {t: 'Ein Inkognito-Chat landet nicht im Verlauf. Beim Anbieter liegt er trotzdem eine Zeit lang.', haus: 'gedaechtnisturm', npc: 'sevi'},
  {t: 'Ist doch etwas Falsches im Chat gelandet: melden, nicht verstecken.', haus: 'tresorhaus', npc: 'sevi'},
  {t: 'Lies bei einem fremden Repo zuerst die Datei README und die Lizenz.', haus: 'hafen', npc: 'kito'}
];
