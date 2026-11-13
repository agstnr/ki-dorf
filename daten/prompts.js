/* KI-Dorf: Promptsammlung und Glossar für die Bibliothek.
   Die Prompts sind auf Aufbau, Platzhalter und Datenschutz geprüft. Sie wurden nicht in einem KI-Tool getestet.
   „e“ beschreibt, was typischerweise entsteht, und ist kein Protokoll eines echten Laufs. */
KD.PROMPT_GRUPPEN = ['Recherche', 'Schreiben', 'Zusammenfassen', 'Lernen', 'Büroalltag', 'Datenschutz-sensibel'];
KD.PROMPTS = [
  {g: 0, t: 'Überblick mit Quellen', p: 'Gib mir einen Überblick zum Thema [Thema] für [Zielgruppe].\nGliedere in: Worum geht es, was ist gesichert, was ist umstritten, was ist offen.\nNenne zu jeder fachlichen Aussage eine Quelle mit Titel, Herausgeber, Datum und Link. Nutze bevorzugt Primärquellen.\nGib keine Quelle an, die du nicht tatsächlich geöffnet hast. Wenn du keine findest, sag das.',
    w: 'Aufgabe, Zielgruppe und ein festes Format. Der Prüfauftrag verlangt Quellen und erlaubt ausdrücklich „keine gefunden“.', e: 'Vier kurze Abschnitte mit Quellenangaben. Jede Quelle musst du selbst öffnen und die Aussage dort suchen.'},
  {g: 0, t: 'Quelle gegenprüfen', p: 'Hier ist eine Aussage und die Quelle, die sie belegen soll.\nAussage: [Aussage]\nQuelle: [Text oder Auszug einfügen]\n\nPrüfe nur anhand des eingefügten Textes: Steht die Aussage dort? Zitiere die Stelle wörtlich. Wenn sie nicht dort steht oder nur ähnlich, sag das deutlich.',
    w: 'Die KI arbeitet nur mit dem Text, den du lieferst, und muss wörtlich zitieren. Das macht die Antwort überprüfbar.', e: 'Ein Urteil (steht dort, steht nicht dort, steht anders dort) und ein wörtliches Zitat, das du im Original wiederfindest.'},
  {g: 0, t: 'Suchbegriffe finden', p: 'Ich suche verlässliche Quellen zum Thema [Thema].\nSchlage mir zehn Suchbegriffe vor, je fünf auf Deutsch und Englisch, dazu Fachbegriffe, die ich als Laie nicht kennen würde.\nNenne drei Arten von Stellen, bei denen ich suchen sollte (zum Beispiel Behörde, Fachgesellschaft, Statistikamt). Nenne keine konkreten Studien.',
    w: 'Die KI hilft beim Suchen und liefert keine Fakten. „Keine konkreten Studien“ verhindert erfundene Literatur.', e: 'Eine Liste von Suchbegriffen und Stellen. Die eigentliche Recherche machst du selbst.'},
  {g: 0, t: 'Gegenposition suchen', p: 'Meine Annahme ist: [Annahme].\nNenne die drei stärksten Einwände dagegen und sag jeweils, welche Art von Beleg den Einwand stützen oder entkräften würde.\nKennzeichne, was davon gesichertes Wissen ist und was deine Einschätzung.',
    w: 'Der Auftrag zwingt zur Gegenrede und trennt Wissen von Einschätzung.', e: 'Drei Einwände mit je einem Hinweis, wonach du suchen müsstest. Keine fertigen Belege.'},

  {g: 1, t: 'E-Mail aus Stichworten', p: 'Schreibe eine E-Mail an [Empfänger:in, Rolle].\nAnlass: [Anlass]\nDas muss drinstehen: [Stichworte]\nTon: [freundlich und sachlich, per Sie]\nLänge: höchstens [120] Wörter.\nErfinde keine Angaben. Wo etwas fehlt, setz [Platzhalter] und liste am Ende auf, was du gebraucht hättest.',
    w: 'Alle Fakten kommen von dir. Länge und Ton sind eindeutig. Platzhalter zeigen Lücken.', e: 'Eine kurze, versandfertige E-Mail. Stellen, an denen Angaben fehlten, sind markiert.'},
  {g: 1, t: 'Text in meinem Stil', p: 'Hier ist mein Stilprofil: [Stilprofil einfügen]\nHier ist ein Entwurf: [Entwurf]\n\nSchreibe den Entwurf in meinem Stil um. Ändere keine Fakten und füge keine hinzu. Liste danach die drei größten Änderungen auf.',
    w: 'Das Stilprofil ist Kontext, der Auftrag begrenzt die Änderung auf den Stil. Die Liste macht sichtbar, was passiert ist.', e: 'Derselbe Inhalt in deinem Ton, dazu drei Stichpunkte zu den Änderungen.'},
  {g: 1, t: 'Floskeln streichen', p: 'Prüfe diesen Text auf leere Sätze: Floskeln am Anfang oder Ende, „nicht nur, sondern“, Dreierlisten ohne Grund, Aussagen ohne Konkretes.\nListe jede Stelle auf und schlage vor: streichen oder durch welche konkrete Angabe ersetzen. Erfinde die Angabe nicht, sondern frag mich danach.\n\nText: [Text]',
    w: 'Feste Prüfkriterien und das Verbot, Konkretes zu erfinden.', e: 'Eine Liste von Stellen mit dem Vorschlag „streichen“ oder einer Rückfrage an dich.'},
  {g: 1, t: 'Drei Fassungen zur Wahl', p: 'Schreibe drei Fassungen für [Textart, zum Beispiel Betreffzeile, Überschrift, erster Absatz] zu [Thema].\nZielgruppe: [Zielgruppe]\nFassung 1 sachlich, Fassung 2 persönlich, Fassung 3 knapp.\nSag zu jeder Fassung in einem Satz, wofür sie sich eignet.',
    w: 'Statt eines Durchschnittstexts bekommst du drei klar unterschiedene Angebote und entscheidest selbst.', e: 'Drei kurze Fassungen mit je einem Satz Begründung.'},

  {g: 2, t: 'Bericht für die Leitung', p: 'Fasse den Text unten für [Zielgruppe, zum Beispiel die Geschäftsführung] zusammen.\nFormat: höchstens fünf Punkte, je ein Satz. Zuerst Entscheidungen, dann offene Fragen.\nVerwende nur, was im Text steht. Markiere Stellen, die im Text unklar oder widersprüchlich sind.\n\nText: [Text]',
    w: 'Zielgruppe, Format und Reihenfolge sind festgelegt. „Nur was im Text steht“ hält die KI am Material.', e: 'Fünf Sätze und, wenn nötig, eine kurze Liste unklarer Stellen.'},
  {g: 2, t: 'Protokoll aus Notizen', p: 'Mach aus diesen Notizen ein Protokoll.\nGliederung: Thema, Beschlüsse, Aufgaben (wer, was, bis wann), offene Punkte.\nÜbernimm nur, was in den Notizen steht. Wo unklar ist, wer etwas übernimmt oder bis wann, schreib „offen“.\n\nNotizen: [Notizen ohne Namen, mit Rollen oder Kürzeln]',
    w: 'Feste Gliederung, „offen“ statt Raten. Der Hinweis auf Rollen statt Namen erinnert an die Ampel.', e: 'Ein gegliedertes Protokoll. Lücken sind als „offen“ sichtbar.'},
  {g: 2, t: 'In einfacher Sprache', p: 'Schreibe den Text so um, dass ihn Menschen ohne Fachwissen verstehen.\nKurze Sätze, ein Gedanke pro Satz. Fachbegriffe beim ersten Vorkommen erklären.\nDen Inhalt nicht verändern und nichts weglassen, was für eine Entscheidung wichtig ist.\n\nText: [Text]',
    w: 'Zielgruppe und Regeln sind klar, und der Auftrag sagt, was gleich bleiben muss.', e: 'Ein längerer, aber leichter lesbarer Text. Vergleiche ihn mit dem Original, ob nichts Wichtiges fehlt.'},
  {g: 2, t: 'Was fehlt in diesem Text?', p: 'Lies den Text unten wie eine kritische Kollegin.\nWelche Fragen bleiben offen? Welche Behauptung ist nicht belegt? Wo fehlt eine Zahl, ein Datum oder eine Zuständigkeit?\nAntworte als Liste, die wichtigste Lücke zuerst.\n\nText: [Text]',
    w: 'Eine Rolle mit klarer Blickrichtung und drei konkrete Prüffragen.', e: 'Eine Liste von Lücken. Nicht jede ist berechtigt, aber meist sind zwei oder drei dabei, die du übersehen hast.'},

  {g: 3, t: 'Erklär es mir in Stufen', p: 'Erkläre mir [Begriff oder Thema] in drei Stufen: erst in einem Satz, dann in einem Absatz mit einem Alltagsbeispiel, dann genauer für jemanden aus [mein Arbeitsfeld].\nSag am Ende, was daran vereinfacht ist.',
    w: 'Drei Längen für drei Bedürfnisse, und die Vereinfachung wird offengelegt.', e: 'Drei Erklärungen und ein Satz zu den Grenzen der Vereinfachung.'},
  {g: 3, t: 'Frag mich ab', p: 'Ich möchte [Thema] besser behalten. Stell mir nacheinander fünf Fragen, immer nur eine.\nWarte auf meine Antwort. Sag mir dann, was stimmt, was fehlt, und erkläre es in zwei Sätzen.\nBeginne mit einer leichten Frage und werde schwerer.',
    w: 'Abrufen statt Wiederlesen. Der Ablauf ist genau beschrieben, die KI wartet auf dich.', e: 'Ein kurzes Frage-Antwort-Gespräch mit Rückmeldung nach jeder Antwort. Prüfe Fakten, bei denen du zweifelst, an einer Quelle.'},
  {g: 3, t: 'Lernplan für ein neues Thema', p: 'Ich will mich in [Thema] einarbeiten. Ich habe [Zeit pro Woche] und kenne schon [Vorwissen].\nSchlage einen Plan für vier Wochen vor: pro Woche ein Ziel, zwei Aufgaben und eine Frage, mit der ich prüfe, ob ich es verstanden habe.\nNenne Arten von Quellen, keine konkreten Titel.',
    w: 'Zeit und Vorwissen sind Kontext. Prüffragen machen den Plan überprüfbar. Keine Titel, damit nichts erfunden wird.', e: 'Eine Tabelle mit vier Wochen. Die Quellen suchst du selbst.'},
  {g: 3, t: 'Wo liegt mein Denkfehler?', p: 'So verstehe ich [Thema]: [meine Erklärung in eigenen Worten].\nWas daran stimmt, was ist ungenau, was ist falsch? Korrigiere nur, was nötig ist, und begründe jede Korrektur in einem Satz.',
    w: 'Du lieferst zuerst deine eigene Erklärung. Die KI korrigiert gezielt statt alles neu zu erzählen.', e: 'Zwei bis fünf Anmerkungen zu deiner Erklärung.'},

  {g: 4, t: 'Tagesordnung für eine Besprechung', p: 'Erstelle eine Tagesordnung für eine Besprechung.\nAnlass: [Anlass]\nDauer: [60] Minuten, [Anzahl] Personen.\nZiele: [Was soll am Ende entschieden oder geklärt sein?]\nFormat: Tabelle mit Punkt, Ziel, Zeit, Zuständigkeit. Plane fünf Minuten Puffer ein.',
    w: 'Dauer und Ziele geben den Rahmen, die Tabelle macht das Ergebnis direkt verwendbar.', e: 'Eine Tabelle mit vier bis sechs Punkten und Zeitangaben, die zusammen die Dauer ergeben.'},
  {g: 4, t: 'Entscheidungsvorlage', p: 'Ich muss zwischen diesen Möglichkeiten entscheiden: [A], [B], [C].\nMeine Kriterien: [Kriterien, nach Wichtigkeit].\nErstelle eine Tabelle: Zeilen sind die Möglichkeiten, Spalten die Kriterien. Trag nur ein, was ich angegeben habe: [Angaben]. Wo dir Angaben fehlen, schreib „fehlt“.\nSag danach, welche zwei Angaben meine Entscheidung am stärksten ändern würden.',
    w: 'Die KI ordnet deine Angaben und bewertet nicht frei. „Fehlt“ zeigt, wo du nachlegen musst.', e: 'Eine Tabelle mit Lücken und zwei Rückfragen. Die Entscheidung triffst du.'},
  {g: 4, t: 'Absage freundlich formulieren', p: 'Formuliere eine Absage.\nWorauf: [Anfrage, ohne Namen]\nGrund: [Grund, so viel ich nennen will]\nTon: freundlich, klar, ohne Ausflüchte, per [Du oder Sie].\nLänge: drei bis fünf Sätze. Biete an: [Alternative oder nichts].',
    w: 'Kurz, mit allen Angaben, die die KI sonst erfinden würde, vor allem Grund und Alternative.', e: 'Eine kurze Absage, die du mit Namen und Anrede ergänzt.'},
  {g: 4, t: 'Aufgabenliste aus einer langen Nachricht', p: 'Zieh aus dem Text unten alle Aufgaben heraus.\nFormat: Liste mit Aufgabe, zuständig, Frist. Wenn Zuständigkeit oder Frist nicht im Text stehen, schreib „nicht genannt“.\nErfinde nichts dazu.\n\nText: [Text ohne Namen, mit Rollen]',
    w: 'Klare Auszugsaufgabe mit festem Format und einer Regel für Lücken.', e: 'Eine Liste mit Aufgaben. Prüfe am Original, ob keine fehlt.'},

  {g: 5, t: 'Fall beschreiben, ohne dass jemand erkennbar wird', p: 'Ich beschreibe dir eine Situation ohne Namen und ohne Details, aus denen jemand erkennbar wäre.\nSituation: [Person A, Rolle, Anliegen in allgemeinen Worten]\nHilf mir, [Ziel, zum Beispiel eine Antwort zu formulieren].\nFrag nicht nach Namen, Orten oder Kennnummern. Wenn dir für eine gute Antwort etwas fehlt, frag nach der Art der Information, nicht nach der Angabe selbst.',
    w: 'Der Auftrag hält die KI davon ab, nach personenbezogenen Daten zu fragen.', e: 'Ein Entwurf mit Platzhaltern wie „Person A“. Die echten Angaben setzt du außerhalb des Tools ein.'},
  {g: 5, t: 'Text vor dem Einfügen prüfen lassen', p: 'Ich will einen Text in ein KI-Tool einfügen. Bevor ich das tue: Nenne mir, welche Arten von Angaben ich vorher entfernen oder ersetzen sollte, wenn es um [Art des Textes, zum Beispiel ein Gesprächsprotokoll] geht.\nGib mir eine Checkliste. Ich füge den Text hier nicht ein.',
    w: 'Du bekommst Hilfe beim Anonymisieren, ohne den heiklen Text preiszugeben.', e: 'Eine Checkliste mit Namen, Orten, Daten, Kennnummern und seltenen Details.'},
  {g: 5, t: 'Vorlage statt Einzelfall', p: 'Erstelle eine Vorlage für [Schreiben, zum Beispiel eine Terminbestätigung].\nSetz für alle personenbezogenen Angaben Platzhalter in eckigen Klammern: [Anrede], [Datum], [Ort].\nTon: [Ton]. Länge: [Länge].',
    w: 'Eine Vorlage braucht keine echten Daten. Die füllst du später in deinem eigenen System aus.', e: 'Ein wiederverwendbarer Text mit Platzhaltern.'},
  {g: 5, t: 'Brauche ich diese Angabe überhaupt?', p: 'Meine Aufgabe: [Aufgabe].\nIch habe diese Arten von Angaben zur Verfügung: [zum Beispiel Name, Alter, Diagnose, Wohnort, Anliegen].\nWelche davon brauchst du wirklich, um die Aufgabe gut zu lösen, und welche kann ich weglassen oder verallgemeinern? Begründe kurz.',
    w: 'Datenminimierung als Frage: Die KI hilft dir, weniger einzugeben.', e: 'Eine kurze Liste „nötig“ und „weglassen“. Im Zweifel lässt du weg.'}
];

KD.GLOSSAR = [
  ['Agent', 'Ein KI-Assistent, der Werkzeuge nutzt und mehrere Schritte hintereinander erledigt.', 'fundamenthaus'],
  ['Anonymisieren', 'Angaben so entfernen, dass niemand mehr erkennbar ist. Wer einen Schlüssel behält, hat nur pseudonymisiert.', 'tresorhaus'],
  ['Auftragsverarbeitung', 'Ein Dienstleister verarbeitet Daten im Auftrag einer Organisation. Dafür braucht es einen Vertrag.', 'tresorhaus'],
  ['Besondere Kategorien', 'Besonders geschützte Daten, etwa zu Gesundheit, Religion oder politischer Meinung.', 'tresorhaus'],
  ['Browser-Agent', 'Eine Erweiterung, mit der die KI im Browser liest, klickt und Formulare ausfüllt.', 'leuchtturm'],
  ['Datenminimierung', 'Nur so viele Daten verwenden, wie die Aufgabe braucht.', 'tresorhaus'],
  ['Geplante Aufgabe', 'Eine Aufgabe, die zu festen Zeiten von selbst startet.', 'bahnhof'],
  ['Halluzination', 'Eine Antwort, die überzeugend klingt und falsch ist.', 'fundamenthaus'],
  ['Inkognito-Chat', 'Ein Chat, der weder im Verlauf noch im Memory landet. Beim Anbieter wird er trotzdem eine Zeit lang aufbewahrt.', 'gedaechtnisturm'],
  ['KI-Slop', 'Unreflektiert übernommener KI-Text: allgemein, aufgebläht, faktisch wackelig.', 'detektivbuero'],
  ['Konnektor', 'Eine Verbindung zwischen KI-Tool und einer App, etwa Kalender oder Ablage.', 'remise'],
  ['Kontext', 'Alles, was das Modell beim Antworten sieht.', 'projekthaus'],
  ['Kontextfenster', 'Die Menge an Text, die ein Modell auf einmal berücksichtigen kann.', 'fundamenthaus'],
  ['Loop', 'Eine Aufgabe, die sich regelmäßig wiederholt.', 'bahnhof'],
  ['Memory', 'Was sich ein Tool über einzelne Chats hinaus merkt.', 'gedaechtnisturm'],
  ['Modell', 'Die Variante, die deine Antwort berechnet. Anbieter haben schnellere und gründlichere.', 'werkstatt'],
  ['Personenbezogene Daten', 'Alles, was sich auf eine erkennbare Person bezieht.', 'tresorhaus'],
  ['Plug-in', 'Ein Paket, das Skills, Konnektoren und weitere Teile bündelt.', 'remise'],
  ['Primärquelle', 'Das Original: Gesetz, Studie, Leitlinie, offizielle Statistik.', 'archiv'],
  ['Projekt', 'Ein Arbeitsbereich mit eigenen Anweisungen und Dateien.', 'projekthaus'],
  ['Prompt', 'Dein Auftrag an die KI.', 'werkstatt'],
  ['Prompt Injection', 'Versteckte Anweisungen in Webseiten, E-Mails oder Dokumenten, die eine KI zu etwas anderem bringen sollen.', 'leuchtturm'],
  ['Promptmaster', 'Ein Projekt, das Prompts für andere Chats schreibt.', 'werkstatt'],
  ['Prüfauftrag', 'Der Teil eines Prompts, der sagt, wie die KI ihr Ergebnis absichern soll.', 'werkstatt'],
  ['Repository', 'Eine Ablage für Code auf einer Plattform wie GitHub. Kurz: Repo.', 'hafen'],
  ['Skill', 'Eine gespeicherte Arbeitsanweisung für wiederkehrende Aufgaben.', 'remise'],
  ['Sprachmodell', 'Ein Programm, das aus sehr vielen Texten gelernt hat, welches Wort wahrscheinlich als Nächstes kommt.', 'fundamenthaus'],
  ['Stilprofil', 'Eine Beschreibung deines Schreibstils als Anweisung für die KI.', 'schreibstube'],
  ['Systemprompt', 'Eine Grundanweisung, die vor deinem Auftrag gilt.', 'fundamenthaus'],
  ['Token', 'Ein Wortstück. Modelle rechnen in Tokens, Limits werden meist darin gezählt.', 'fundamenthaus']
];

/* Stand der Tool-Angaben, geprüft für Claude am Abrufdatum. */
KD.TOOLSTAND = [
  ['Projekte', 'alle Tarife, kostenlos höchstens fünf', 'a_proj'],
  ['Memory', 'Free, Pro, Max, Ultra: standardmäßig an. Team und Enterprise: Organisation entscheidet', 'a_memory'],
  ['Trainingseinstellung „Help Improve our AI models“', 'Free, Pro, Max', 'a_train'],
  ['Inkognito-Chat', 'nicht im Verlauf, nicht im Memory, kein Training, 30 Tage Aufbewahrung', 'a_inkognito'],
  ['Skills', 'alle Tarife, Code-Ausführung muss an sein', 'a_skills'],
  ['Konnektoren', 'alle Nutzer:innen, in Organisationen nach Freigabe', 'a_conn'],
  ['Plug-ins', 'bezahlte Tarife', 'a_plugins'],
  ['Claude in Chrome', 'bezahlte Tarife, nur Google Chrome', 'a_chrome'],
  ['Cowork: lokale Dateien', 'bezahlte Tarife, Desktop-App für macOS, Windows, Linux (Beta)', 'a_cowork'],
  ['Geplante Aufgaben', 'bezahlte Tarife', 'a_sched'],
  ['Claude Design', 'alle Tarife', 'a_design']
];
