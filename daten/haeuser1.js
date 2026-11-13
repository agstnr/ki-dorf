/* KI-Dorf: Häuser 1 bis 8 (Tag 1 des Seminars).
   Ein Haus = ein Eintrag. slot = fester Platz im Spielstand-Code, nie umnummerieren.
   q0    Einstiegsfrage vor dem Lesen, zählt nicht.
   cards Fundament: k Begriff, v ein bis zwei Sätze, ic Icon, fig Infografik, src Quellen (Schlüssel aus KD.SRC).
   tasks Aufgaben, Typen: sort, pairs, order, cloze, mark, build, scenario, sim. Aufbau siehe js/aufgaben.js.
   einr  Checkliste (freiwillig) und Vorlage zum Kopieren.
   Alle Beispiele sind erfunden. */
window.KD = window.KD || {};
KD.HOUSES = [
{
  id: 'dorfplatz', slot: 0, name: 'Dorfplatz', sub: 'Einstieg und Orientierung', npc: 'mira', ic: 'karte', platz: true,
  cards: [
    {k: 'So funktioniert das Dorf', v: 'Jedes Haus ist ein Block aus dem Seminar. Du gehst hinein, beantwortest eine Einstiegsfrage, liest ein paar Karten und löst Aufgaben. Mit jeder gelösten Aufgabe wächst das Haus.', ic: 'haus'},
    {k: 'Du bestimmst den Weg', v: 'Die Häuser stehen in Seminarreihenfolge, du kannst aber überall anfangen. Nichts ist gesperrt, nichts läuft ab, niemand zählt mit.', ic: 'weg'},
    {k: 'Die Dorfrunde', v: 'Im Briefkasten liegen Karten aus Häusern, die du schon besucht hast. Bevorzugt kommen die, bei denen du noch unsicher warst. Wiederholen mit Abstand hilft beim Behalten.', ic: 'brief'},
    {k: 'Die Bibliothek', v: 'Oben im Reiter „Bibliothek“ steht alles als lesbarer Text: Inhalte, Glossar, Promptsammlung und Quellen. Zum Nachschlagen musst du nicht spielen.', ic: 'buch'},
    {k: 'Was das Dorf speichert', v: 'Nur deinen Lernstand, und nur in diesem Browser. Es gibt kein Konto und keine Verbindung nach außen. Mit dem Spielstand-Code nimmst du den Stand auf ein anderes Gerät mit.', ic: 'schloss'}
  ],
  tasks: [],
  einr: {
    title: 'Ablauf der zwei Tage',
    checkTitle: 'Bevor es losgeht',
    checks: ['Ich weiß, welches KI-Tool und welchen Tarif ich nutze.', 'Ich weiß, was meine Organisation zu KI-Tools erlaubt.', 'Ich habe fünf bis zehn eigene Texte bereit, die ohne KI entstanden sind.'],
    tplTitle: 'Fahrplan',
    tpl: 'Tag 1: Begriffe, Regeln, Kontext und Texte\n- Begriffe und Grundlagen (Fundamenthaus)\n- Datenschutz und Regeln (Tresorhaus)\n- Kontext und Projekte (Projekthaus)\n- Promptmaster, Modellwahl, Token (Werkstatt)\n- KI-Texte erkennen, Slop vermeiden (Detektivbüro)\n- Mein Schreibstil (Schreibstube)\n- Recherche und Quellen (Archiv)\n- Praxisfall Runde 1: nur Chat und Projekt\n\nTag 2: Skills, Praxis und Automatisierung\n- Memory kontrollieren (Gedächtnisturm)\n- Skills und Plug-ins (Remise)\n- Praxisfall Runde 2: mit Erweiterungen\n- Browser-Agent (Leuchtturm)\n- Lokal mit Dateien arbeiten (Lagerhaus)\n- Automatisierungen (Bahnhof)\n- Abschluss und Feedback (Post)\n\nZum Selbststudium: Atelier (Design), Labor (Code), Hafen (GitHub)',
    note: 'Der Fahrplan folgt dem Seminarkonzept. Zeiten nennt die Seminarleitung.'
  }
},
{
  id: 'fundamenthaus', slot: 1, name: 'Fundamenthaus', sub: 'Begriffe und Grundlagen', npc: 'ada', ic: 'bausteine',
  look: {wall: 'wall-5', roof: 'roof-1', roofType: 'gable', emblem: 'blocks', kind: 'school'},
  q0: {q: 'Eine KI nennt dir ein Buch mit Verlag und Erscheinungsjahr. Was weißt du jetzt sicher?', opts: ['Das Buch gibt es, sonst könnte sie es nicht nennen.', 'Noch nichts. Die Angabe kann erfunden sein.', 'Das Buch gibt es, nur das Jahr könnte falsch sein.'], a: 1, why: 'Ein Sprachmodell setzt wahrscheinliche Wörter aneinander. Ob das Ergebnis stimmt, prüft es dabei nicht. Darum drehen sich die nächsten Karten.'},
  cards: [
    {k: 'Sprachmodell', v: 'Ein Programm, das aus sehr vielen Texten gelernt hat, welches Wort wahrscheinlich als Nächstes kommt. Alltagsbild: eine sehr belesene Person, die jeden Satz flüssig fortsetzt und dabei nicht nachschlägt.', fig: 'wahrscheinlich', src: ['ji']},
    {k: 'Prompt und Kontext', v: 'Der Prompt ist dein Auftrag. Der Kontext ist alles, was das Modell dabei sieht: deine Nachricht, der Chat davor, Dateien, Projektanweisungen. Alltagsbild: der Zettel und die Mappe, die du einer Vertretung auf den Tisch legst.', ic: 'zettel'},
    {k: 'Token und Kontextfenster', v: 'Modelle rechnen in Tokens, das sind Wortstücke. Das Kontextfenster ist die Menge, die auf einmal Platz hat. Ist es voll, fallen frühe Teile weg. Alltagsbild: ein Regal mit fester Breite.', fig: 'kontextfenster', src: ['anbieter']},
    {k: 'Halluzination', v: 'Eine Antwort, die überzeugend klingt und falsch ist: ein erfundenes Zitat, eine falsche Zahl, eine Quelle, die es nicht gibt.', ic: 'lupe', src: ['ji', 'walters']},
    {k: 'Modell', v: 'Anbieter haben mehrere Modelle. Kleinere antworten schneller, größere arbeiten gründlicher. Welche es gibt, steht auf der Seite des Anbieters.', ic: 'zahnrad', src: ['anbieter']},
    {k: 'Projekt, Memory, Skill, Konnektor, Plug-in', v: 'Projekt: Arbeitsbereich mit eigenen Anweisungen und Dateien. Memory: was sich das Tool über Chats hinweg merkt. Skill: gespeicherte Arbeitsanweisung. Konnektor: Verbindung zu einer App. Plug-in: Paket aus mehreren davon.', fig: 'bausatz', src: ['a_proj', 'a_memory', 'a_skills', 'a_conn', 'a_plugins']},
    {k: 'Chatbot, Assistent, Agent', v: 'Ein Chatbot antwortet. Ein Assistent oder Agent nutzt zusätzlich Werkzeuge: Dateien öffnen, im Browser klicken, Termine lesen. Je mehr er darf, desto wichtiger sind klare Grenzen.', ic: 'roboter'}
  ],
  tasks: [
    {type: 'pairs', title: 'Begriffe und Bilder', intro: 'Finde zu jedem Begriff die passende Erklärung. Die Bonusrunde ist freiwillig.',
      pairs: [['Sprachmodell', 'Setzt wahrscheinliche Wörter aneinander'], ['Prompt', 'Dein Auftrag an die KI'], ['Kontext', 'Alles, was das Modell beim Antworten sieht'], ['Token', 'Ein Wortstück, in dem Modelle rechnen'], ['Modell', 'Die Variante, die deine Antwort berechnet: schnell oder gründlich'], ['Projekt', 'Arbeitsbereich mit eigenen Anweisungen und Dateien'], ['Memory', 'Was sich das Tool über Chats hinweg merkt'], ['Skill', 'Gespeicherte Arbeitsanweisung für wiederkehrende Aufgaben'], ['Konnektor', 'Verbindung zwischen KI-Tool und einer App'], ['Plug-in', 'Paket aus Skills, Konnektoren und mehr']],
      bonus: [['Kontextfenster', 'Wie viel Text auf einmal Platz hat'], ['Halluzination', 'Klingt überzeugend, ist falsch'], ['Systemprompt', 'Grundanweisung, die vor deinem Auftrag gilt'], ['Agent', 'Erledigt mehrere Schritte mit Werkzeugen']]},
    {type: 'sort', title: 'Was steckt dahinter?', intro: 'Ordne jede Situation dem passenden Begriff zu.', cats: ['Halluzination', 'Kontextfenster', 'Token', 'Agent'], hint: 'Frag dich: Ist etwas erfunden, ist etwas weggefallen, wird etwas gezählt oder handelt die KI selbst?',
      items: [
        {q: 'Die KI nennt eine Studie samt Zeitschrift. Die Studie gibt es nicht.', a: 0, why: 'Die Angabe klingt echt und ist erfunden. Das ist eine Halluzination.'},
        {q: 'Der Chat ist sehr lang. Eine Anweisung vom Anfang wird nicht mehr beachtet.', a: 1, why: 'Ein möglicher Grund: Das Kontextfenster ist voll und frühe Teile fallen weg. Ein neuer Chat mit kurzer Zusammenfassung hilft.'},
        {q: 'Dein Nutzungslimit wird in kleinen Textstücken gezählt.', a: 2, why: 'Limits und Preise werden meist in Tokens gerechnet.'},
        {q: 'Das Tool öffnet deinen Kalender, sucht einen freien Termin und legt einen Entwurf an.', a: 3, why: 'Wer Werkzeuge nutzt und mehrere Schritte erledigt, ist ein Assistent oder Agent.'},
        {q: 'Die KI gibt ein wörtliches Zitat einer Ministerin wieder, das nirgends zu finden ist.', a: 0, why: 'Erfundene Zitate sind eine typische Halluzination.'}
      ]},
    {type: 'sim', sim: 'kontext', title: 'Das Regal wird voll', intro: 'Füll das Kontextfenster und sieh, was mit der ersten Anweisung passiert.'}
  ],
  einr: {
    title: 'Dein Fundament trägt',
    checkTitle: 'Startklar mit deinem Tool',
    checks: ['Ich weiß, welches Tool und welchen Tarif ich nutze.', 'Ich weiß, ob mein Tool im Web suchen kann und ob das gerade eingeschaltet ist.', 'Ich weiß, welche Modelle ich auswählen kann.', 'Ich prüfe Fakten, Zahlen und Quellen, bevor ich sie verwende.', 'Bei langen Chats starte ich neu und gebe eine kurze Zusammenfassung mit.'],
    tplTitle: 'Grundanweisung für dein Tool',
    tpl: 'Grundanweisung\n- Antworte auf Deutsch (Österreich), kurz und konkret.\n- Wenn du etwas nicht weißt, sag das. Erfinde keine Fakten, Zahlen oder Quellen.\n- Kennzeichne, was Annahme ist und was belegt ist.\n- Frag nach, wenn meine Aufgabe unklar ist.',
    note: 'Eine Grundanweisung senkt das Risiko für Fehler. Halluzinationen verhindert sie nicht.'
  }
},
{
  id: 'tresorhaus', slot: 2, name: 'Tresorhaus', sub: 'Datenschutz und Regeln', npc: 'sevi', ic: 'schloss',
  look: {wall: 'stone', roof: 'roof-1', roofType: 'flat', emblem: 'lock', kind: 'vault'},
  q0: {q: 'Du tippst einen Satz in ein KI-Tool und drückst auf Senden. Wo liegt der Satz danach?', opts: ['Nur auf meinem Gerät.', 'Auf Rechnern des Anbieters, außerhalb meiner Organisation.', 'Nirgends, er wird sofort gelöscht.'], a: 1, why: 'Mit dem Senden verlässt der Text dein Gerät. Was danach passiert, hängt von Anbieter, Tarif und Einstellungen ab.'},
  cards: [
    {k: 'Die Ampel', v: 'Grün: darf hinein, etwa veröffentlichte Texte. Gelb: nur anonymisiert und in einem freigegebenen Tool. Rot: nie, etwa Passwörter oder Gesundheitsdaten mit Namen. Interne Vorgaben gehen immer vor.', fig: 'ampel'},
    {k: 'Personenbezogene Daten', v: 'Alles, was sich auf eine erkennbare Person bezieht: Name, Telefonnummer, aber auch eine Kombination von Angaben, die zusammen auf jemanden führt.', ic: 'person', src: ['dsgvo4']},
    {k: 'Besondere Kategorien', v: 'Besonders geschützt sind unter anderem Gesundheit, Religion, politische Meinung, Gewerkschaftszugehörigkeit, ethnische Herkunft und sexuelle Orientierung.', ic: 'herz', src: ['dsgvo9']},
    {k: 'Datenminimierung', v: 'Nur so viele Daten verwenden, wie die Aufgabe braucht. Für KI heißt das: weglassen oder anonymisieren, was nicht nötig ist.', ic: 'schere', src: ['dsgvo5']},
    {k: 'Anonymisieren', v: 'Namen, Adressen, Geburtsdaten und Kennnummern entfernen. Achtung: Wer nur „Person A“ schreibt und den Schlüssel behält, hat pseudonymisiert. Das gilt weiter als personenbezogen.', ic: 'maske', src: ['eg26']},
    {k: 'Training und Aufbewahrung', v: 'Viele Tools haben eine Einstellung, ob Chats zum Verbessern der Modelle dienen dürfen. In Claude heißt sie „Help Improve our AI models“ und gilt für Free, Pro und Max. Sie löscht keine Chats.', fig: 'reise', src: ['a_train', 'a_retain']},
    {k: 'Organisation und Vertrag', v: 'Nutzt eine Organisation einen Dienst für personenbezogene Daten, braucht es dafür einen Vertrag zur Auftragsverarbeitung. Ob er besteht, klärt die Organisation und nicht der einzelne Chat.', ic: 'vertrag', src: ['dsgvo28', 'a_comm']},
    {k: 'Wenn doch etwas passiert', v: 'Falsches eingegeben? Nach der internen Regel melden, zum Beispiel an die Datenschutzbeauftragten. Den Chat zu löschen ersetzt die Meldung nicht.', ic: 'glocke', src: ['dsgvo33']}
  ],
  tasks: [
    {type: 'sim', sim: 'reise', title: 'Reise einer Eingabe', intro: 'Folge einem Satz vom Gerät zum Anbieter und zurück. Leg die Schalter um und sieh, was sich ändert.'},
    {type: 'sort', title: 'Die Ampel', intro: 'Zieh jede Eingabe auf die passende Farbe oder tippe erst die Karte, dann die Farbe an.', cats: ['Grün: darf hinein', 'Gelb: nur anonymisiert', 'Rot: nie'], colors: ['g', 'y', 'r'], hint: 'Frag dich: Ist eine Person erkennbar? Ist es vertraulich oder schon öffentlich?',
      items: [
        {q: 'Eine veröffentlichte Pressemitteilung deiner Organisation, die du kürzen willst.', a: 0, why: 'Der Text ist bereits öffentlich.'},
        {q: 'Ein Gesprächsprotokoll, in dem noch Namen und Orte stehen.', a: 1, why: 'Erst Namen, Orte und Einrichtungen entfernen, dann in ein freigegebenes Tool.'},
        {q: 'Ein Arztbrief von Frau M. Beispiel mit Diagnose und Geburtsdatum.', a: 2, why: 'Gesundheitsdaten einer erkennbaren Person gehören zu den besonderen Kategorien.'},
        {q: 'Dein Passwort für das Intranet, damit die KI beim Login hilft.', a: 2, why: 'Zugangsdaten gibst du nie in ein KI-Tool ein.'},
        {q: 'Die Frage: Wie schreibe ich eine höfliche Absage?', a: 0, why: 'Keine Daten über Personen oder deine Organisation.'},
        {q: 'Eine E-Mail einer Klientin, die du beantworten willst.', a: 1, why: 'Beschreib das Anliegen ohne Namen und Details, aus denen sie erkennbar wird.'},
        {q: 'Eine Liste mit Namen und Telefonnummern aller Kursteilnehmer:innen.', a: 2, why: 'Diese Daten braucht die KI für deine Aufgabe nicht. Arbeite mit Platzhaltern.'}
      ]},
    {type: 'scenario', title: 'Ernstfall', intro: 'Eine kurze Geschichte mit drei Entscheidungen.',
      steps: [
        {t: 'Du willst eine Mail an eine Klientin formulieren lassen und hast aus Gewohnheit ihren vollen Namen und ihre Diagnose in den Chat kopiert. Senden ist schon gedrückt.', opts: [
          {t: 'Chat löschen und niemandem etwas sagen.', ok: false, fb: 'Löschen kann sinnvoll sein. Es ersetzt aber die Meldung nicht, und die Organisation erfährt nichts.'},
          {t: 'Nach der internen Regel melden, zum Beispiel an die Datenschutzbeauftragten.', ok: true, fb: 'Richtig. Wer meldet, gibt der Organisation die Chance zu reagieren. Für sie läuft eine Frist gegenüber der Behörde.'},
          {t: 'Abwarten, ob etwas passiert.', ok: false, fb: 'Abwarten nimmt der Organisation die Zeit, die sie zum Reagieren hat.'}]},
        {t: 'Die Datenschutzbeauftragte fragt, ob deine Chats beim Anbieter zum Training verwendet werden dürfen. Wo siehst du nach?', opts: [
          {t: 'In den Datenschutz-Einstellungen des Tools.', ok: true, fb: 'Richtig. Dort steht der Schalter. Bei Team- und Enterprise-Tarifen gelten die Bedingungen der Organisation.'},
          {t: 'Das lässt sich nicht herausfinden.', ok: false, fb: 'Doch. Die Einstellung findest du in den Datenschutz-Einstellungen deines Kontos.'},
          {t: 'Im Chatverlauf.', ok: false, fb: 'Im Verlauf siehst du deine Chats. Die Trainingseinstellung steht in den Datenschutz-Einstellungen.'}]},
        {t: 'Beim nächsten Mal willst du es besser machen. Was gibst du ein?', opts: [
          {t: '„Eine Klientin möchte ihren Termin verschieben und schlägt nächste Woche vor. Formuliere eine freundliche Antwort.“', ok: true, fb: 'Richtig. Die Aufgabe ist beschrieben, ohne dass jemand erkennbar wird.'},
          {t: 'Denselben Text wie vorher, aber in einem Inkognito-Chat.', ok: false, fb: 'Ein Inkognito-Chat landet nicht im Verlauf. Beim Anbieter liegen die Daten trotzdem. Das löst das Problem nicht.'},
          {t: 'Nur den Vornamen und die Diagnose.', ok: false, fb: 'Vorname plus Diagnose kann in einer kleinen Einrichtung reichen, um jemanden zu erkennen.'}]}
      ]},
    {type: 'sort', title: 'Wahr oder falsch?', intro: 'Aussagen zu Claude, geprüft an den Seiten des Anbieters. Für andere Tools sieh auf deren Hilfeseiten nach.', cats: ['Wahr', 'Falsch'], hint: 'Denk an den Unterschied zwischen Löschen, Verlauf und Training.',
      items: [
        {q: 'Wenn ich die Trainingseinstellung ausschalte, werden meine bisherigen Chats gelöscht.', a: 1, why: 'Die Einstellung regelt nur die Nutzung zum Verbessern der Modelle. Löschen ist ein eigener Schritt.'},
        {q: 'Die Trainingseinstellung gilt in allen Tarifen auf dieselbe Weise.', a: 1, why: 'Sie betrifft Free, Pro und Max. Für Team und Enterprise gelten eigene Bedingungen: Dort wird laut Anbieter standardmäßig nicht mit den Daten trainiert.'},
        {q: 'Ein Inkognito-Chat wird nicht für das Training verwendet und landet nicht im Verlauf.', a: 0, why: 'Laut Anbieter stimmt beides. Aufbewahrt wird er trotzdem 30 Tage, in Organisationen je nach Einstellung auch länger.'},
        {q: 'Lösche ich einen Chat, verschwindet er sofort von allen Systemen des Anbieters.', a: 1, why: 'Aus dem Verlauf sofort, aus den Systemen im Hintergrund laut Anbieter innerhalb von 30 Tagen.'}
      ]}
  ],
  einr: {
    title: 'Dein Tresor ist verschlossen',
    checkTitle: 'Einstellungen geprüft',
    checks: ['Ich kenne die internen Vorgaben meiner Organisation zu KI-Tools.', 'Ich habe nachgesehen, ob meine Chats zum Training verwendet werden dürfen, und die Einstellung bewusst gewählt.', 'Ich habe nachgesehen, ob mein Tool ein Memory hat und was darin steht.', 'Ich weiß, wie ich einen Chat ohne Verlauf starte, falls mein Tool das anbietet.', 'Ich weiß, wem ich einen Fehler melde.'],
    tplTitle: 'Anonymisieren vor dem Einfügen',
    tpl: 'Vor dem Einfügen ersetzen\n- Namen → Person A, Person B\n- Organisationen → Organisation X\n- Orte und Adressen → Ort 1\n- Geburtsdaten → Alter in Jahren oder weglassen\n- Kennnummern (Versicherung, Akte, Konto) → weglassen\n- Seltene Details, die jemanden erkennbar machen → verallgemeinern\n\nDanach prüfen: Könnte jemand, der den Fall kennt, die Person trotzdem erkennen? Wenn ja, weiter verallgemeinern oder weglassen.',
    note: 'Diese Übersicht ist keine Rechtsberatung und ersetzt keine interne Vorgabe. Im Zweifel fragst du die Datenschutzbeauftragten und lässt die Daten weg.'
  }
},
{
  id: 'projekthaus', slot: 3, name: 'Projekthaus', sub: 'Kontext und Projekte', npc: 'mira', ic: 'ordner',
  look: {wall: 'wall-2', roof: 'roof-3', roofType: 'gable', emblem: 'book', w: 4.8, kind: 'library'},
  q0: {q: 'Du stellst zweimal dieselbe Frage. Einmal weiß die KI, für wen du schreibst und wozu, einmal nicht. Was erwartest du?', opts: ['Kein Unterschied, das Modell ist dasselbe.', 'Die Antwort mit Kontext passt besser zu meiner Aufgabe.', 'Die Antwort ohne Kontext ist neutraler und darum besser.'], a: 1, why: 'Fehlt etwas, füllt die KI die Lücke mit Wahrscheinlichem. Dass Kontext der größte Hebel ist, ist Erfahrungswissen aus der Praxis und kein gemessener Effekt.'},
  cards: [
    {k: 'Kontext', v: 'Die KI antwortet nur auf Basis dessen, was im Gespräch steht. Guter Kontext ist darum der schnellste Weg zu passenden Antworten.', ic: 'zettel', src: ['erf']},
    {k: 'Projekt', v: 'Ein Arbeitsbereich mit eigenen Anweisungen und Dateien. Sie gelten für jeden Chat in diesem Projekt. In Claude gibt es Projekte auch im kostenlosen Tarif, dort höchstens fünf.', fig: 'projekt', src: ['a_proj']},
    {k: 'Anweisungen', v: 'Wer du bist, für wen du schreibst, was das Ziel ist, welcher Stil und welches Format gelten und was die KI lassen soll.', ic: 'liste'},
    {k: 'Dateien', v: 'Aktuelle Grundlagen wie Styleguide, Leitfaden oder Musterbeispiele. Lieber wenige gute Dateien als ein ungeordneter Stapel.', ic: 'datei'},
    {k: 'Was nicht hineingehört', v: 'Sensible Daten, veraltete Fassungen, Widersprüchliches. Für Projektdateien gilt dieselbe Ampel wie im Tresorhaus.', ic: 'stopp'},
    {k: 'Pflege', v: 'Ein Projekt ist nie fertig. Liegen Antworten daneben, ergänzt du die Anweisungen. Leg einen Rhythmus fest, zum Beispiel einmal im Quartal.', ic: 'kalender', src: ['erf']}
  ],
  tasks: [
    {type: 'order', title: 'Ein Projekt anlegen', intro: 'Bring die Schritte in eine sinnvolle Reihenfolge.', items: ['Aufgabe und Ziel des Projekts in zwei Sätzen festlegen', 'Projekt erstellen und klar benennen', 'Anweisungen eintragen: Rolle, Zielgruppe, Stil, Format, Grenzen', 'Wenige aktuelle Dateien hochladen', 'Testchat mit einer echten Aufgabe führen', 'Anweisungen nach dem Test nachschärfen'], hint: 'Erst denken, dann anlegen, dann füllen, dann testen.', why: 'Wer zuerst das Ziel klärt, lädt nur hoch, was dazu passt. Der Test zeigt, was in den Anweisungen noch fehlt.'},
    {type: 'sort', title: 'Gehört das ins Projekt?', intro: 'Du legst ein Projekt für den Newsletter des Beispielvereins an.', cats: ['Hinein', 'Draußen lassen'], colors: ['g', 'r'], hint: 'Frag dich: aktuell, nötig und unbedenklich?',
      items: [
        {q: 'Ziel und Zielgruppe des Newsletters in zwei Sätzen', a: 0, why: 'Ohne Ziel und Zielgruppe muss die KI raten.'},
        {q: 'Der aktuelle Styleguide des Vereins', a: 0, why: 'Aktuelle Stilvorgaben sorgen für einen einheitlichen Ton.'},
        {q: 'Das Passwort für den Versand-Account', a: 1, why: 'Zugangsdaten gehören in kein KI-Tool.'},
        {q: 'Zwei gelungene Newsletter aus dem Vorjahr', a: 0, why: 'Beispiele zeigen den gewünschten Ton oft besser als Beschreibungen.'},
        {q: 'Die Mitgliederliste mit Namen und Adressen', a: 1, why: 'Personenbezogene Daten braucht die KI für den Text nicht.'},
        {q: 'Die Anweisung: Frag nach, wenn Angaben fehlen', a: 0, why: 'So füllt die KI Lücken nicht mit Erfundenem.'},
        {q: 'Der Styleguide von 2019, der inzwischen ersetzt wurde', a: 1, why: 'Veraltete Fassungen widersprechen den aktuellen Vorgaben.'}
      ]},
    {type: 'cloze', title: 'Projektanweisung ergänzen', intro: 'Setz die passenden Wörter ein.', text: 'Du schreibst für den Beispielverein. {0}: Mitglieder und ihre Familien. {1}: einmal im Monat über Termine informieren. {2}: herzlich, per Du, kurze Sätze. {3}: höchstens 300 Wörter mit Zwischenüberschriften. Wenn Angaben fehlen, {4}.', blanks: ['Zielgruppe', 'Ziel', 'Stil', 'Format', 'frag nach'], pool: ['Quelle', 'rate'], hint: 'Für wen, wozu, wie klingt es, wie sieht es aus?', why: 'Zielgruppe, Ziel, Stil und Format sind der Kern jeder Projektanweisung. Die letzte Regel verhindert, dass die KI Lücken selbst füllt.'}
  ],
  einr: {
    title: 'Dein Projekt steht',
    checkTitle: 'Projekt-Checkliste',
    checks: ['Mein Projekt hat einen klaren Namen und eine Aufgabe.', 'Die Anweisungen nennen Ziel, Zielgruppe, Stil und Format.', 'Ich habe nur aktuelle Dateien hochgeladen.', 'Im Projekt liegen keine Daten, die laut Ampel nicht ins Tool gehören.', 'Ich habe einen Testchat gemacht und die Anweisungen danach angepasst.'],
    tplTitle: 'Vorlage für Projektanweisungen',
    tpl: 'Projekt: [Name]\n\nÜber mich: [Rolle, Organisation, Fachgebiet]\nZiel: [Wofür ist dieses Projekt da?]\nZielgruppe: [Für wen sind die Ergebnisse?]\nStil: [zum Beispiel kurz, sachlich, Du oder Sie, Gendern mit Doppelpunkt]\nFormat: [zum Beispiel Fließtext, höchstens eine Seite, Zwischenüberschriften]\nDateien: [Was liegt im Projekt und wofür ist es da?]\nRegeln:\n- Frag nach, wenn Angaben fehlen.\n- Erfinde keine Fakten, Zahlen oder Quellen.\n- [Was die KI nicht tun soll]',
    note: 'Die Vorlage ist ein Startpunkt. Gute Projektanweisungen entstehen durch Testen und Nachschärfen.'
  }
},
{
  id: 'werkstatt', slot: 4, name: 'Werkstatt', sub: 'Promptmaster, Modellwahl, Token', npc: 'tobi', ic: 'zahnrad',
  look: {wall: 'wall-4', roof: 'roof-2', roofType: 'barrel', emblem: 'gear', kind: 'workshop'},
  q0: {q: '„Schreib eine Einladung zum Sommerfest.“ Was macht die KI mit Datum und Ort?', opts: ['Sie fragt immer nach.', 'Sie lässt beides weg.', 'Sie erfindet oft etwas Plausibles oder setzt Platzhalter.'], a: 2, why: 'Was im Auftrag fehlt, wird mit Wahrscheinlichem gefüllt. Je klarer der Auftrag, desto weniger muss die KI raten.'},
  cards: [
    {k: 'Fünf Bausteine', v: 'Rolle, Aufgabe, Kontext, Format, Prüfauftrag. Nicht jeder Prompt braucht alle fünf.', fig: 'bausteine', src: ['erf']},
    {k: 'Rolle und Aufgabe', v: 'Rolle: aus welcher Sicht die KI arbeitet. Aufgabe: ein Verb und ein Ergebnis, etwa „Schreibe drei Betreffzeilen“.', ic: 'person'},
    {k: 'Kontext und Format', v: 'Kontext: alles, was eine neue Kollegin wissen müsste. Format: Länge, Aufbau, Ton, Tabelle oder Fließtext.', ic: 'zettel'},
    {k: 'Prüfauftrag', v: 'Sag der KI, wie sie ihr Ergebnis absichern soll: Unsicheres kennzeichnen, bei fehlenden Angaben nachfragen, nichts erfinden.', ic: 'haken'},
    {k: 'Promptmaster', v: 'Ein eigenes Projekt, das Prompts für andere Chats schreibt. Du beschreibst grob, was du brauchst. Es fragt nach und liefert einen fertigen Prompt.', ic: 'stern'},
    {k: 'Modellwahl', v: 'Schnelle Modelle reichen für kurze, einfache Aufgaben. Gründliche lohnen sich bei langen, schwierigen oder heiklen Aufgaben und belasten dein Limit oft stärker.', ic: 'waage', src: ['anbieter']},
    {k: 'Limit erreicht?', v: 'Neuer Chat für ein neues Thema. Nur die nötigen Auszüge einfügen. Oft gebrauchte Dateien ins Projekt legen. Gewünschte Länge angeben.', ic: 'uhr', src: ['anbieter']}
  ],
  tasks: [
    {type: 'build', title: 'Prompt-Werkstatt: Sommerfest', intro: 'Links steht ein schwacher Prompt. Bau ihn um: Wähle für jeden Baustein die stärkere Formulierung.', weak: 'Schreib eine Einladung zum Sommerfest.',
      slots: [
        {k: 'Rolle', opts: ['Du bist eine KI.', 'Du schreibst für den Beispielverein, einen Nachbarschaftsverein mit 200 Mitgliedern.'], a: 1, why: 'Die Rolle sagt, aus welcher Sicht und für wen geschrieben wird.'},
        {k: 'Aufgabe', opts: ['Schreib eine Einladung zum Sommerfest am 4. Juli um 15 Uhr im Vereinsgarten.', 'Mach was Schönes zum Sommerfest.'], a: 0, why: 'Ein Verb, ein Ergebnis und die Fakten, die sonst erfunden würden.'},
        {k: 'Kontext', opts: ['Es kommen Leute.', 'Zielgruppe: Mitglieder mit Familien. Anmeldung bis 25. Juni an fest@beispiel.example.'], a: 1, why: 'Zielgruppe und Anmeldeweg kann die KI nicht wissen.'},
        {k: 'Format', opts: ['Ton herzlich, per Du, höchstens 80 Wörter.', 'Nicht zu lang.'], a: 0, why: '„Nicht zu lang“ ist für jede Person etwas anderes. Eine Zahl ist eindeutig.'},
        {k: 'Prüfauftrag', opts: ['Sei kreativ.', 'Erfinde keine Angaben. Wenn etwas fehlt, setz [Platzhalter] und sag es mir.'], a: 1, why: 'So siehst du sofort, wo die KI etwas nicht wusste.'}
      ],
      result: 'Typisches Ergebnis: eine Einladung mit richtigem Datum, Ort und Anmeldeweg, im Du-Ton, in etwa 80 Wörtern. Ohne die Bausteine entsteht meist ein längerer Text mit erfundenem Datum oder Platzhaltern.',
      criteria: ['Steht drin, was genau entstehen soll?', 'Hat die KI den Kontext, den eine neue Kollegin bräuchte?', 'Sind Länge und Format genannt?', 'Weiß die KI, was sie bei fehlenden Angaben tun soll?']},
    {type: 'sort', title: 'Welcher Baustein ist das?', intro: 'Ordne jeden Satz einem Baustein zu.', cats: ['Rolle', 'Aufgabe', 'Kontext', 'Format', 'Prüfauftrag'], hint: 'Wer, was, womit, wie, wie abgesichert?',
      items: [
        {q: '„Du bist Lektor:in für Vereinszeitungen.“', a: 0, why: 'Das legt die Sicht fest, aus der die KI arbeitet.'},
        {q: '„Fasse den Bericht in fünf Punkten zusammen.“', a: 1, why: 'Verb und Ergebnis: Das ist die Aufgabe.'},
        {q: '„Die Leser:innen kennen das Projekt nicht.“', a: 2, why: 'Hintergrund zur Zielgruppe ist Kontext.'},
        {q: '„Als Tabelle mit drei Spalten, höchstens eine Seite.“', a: 3, why: 'Aufbau und Länge sind Format.'},
        {q: '„Markiere Stellen, bei denen du unsicher bist.“', a: 4, why: 'Das ist ein Prüfauftrag: Die KI soll Unsicheres sichtbar machen.'}
      ]},
    {type: 'sort', title: 'Schnell oder gründlich?', intro: 'Welches Modell passt? Die Fälle sind bewusst eindeutig. Im Alltag probierst du zuerst das schnellere.', cats: ['Schnelles Modell', 'Gründliches Modell'], hint: 'Wie lang ist der Text, wie viele Bezüge, wie teuer wäre ein Fehler?',
      items: [
        {q: 'Zehn Betreffzeilen für einen Newsletter vorschlagen.', a: 0, why: 'Kurze, einfache Aufgabe.'},
        {q: 'Einen 40-seitigen Vertragsentwurf auf Widersprüche zwischen den Abschnitten prüfen.', a: 1, why: 'Langer Text, viele Bezüge, Fehler wären teuer.'},
        {q: 'Eine E-Mail auf Tippfehler durchsehen.', a: 0, why: 'Einfache Korrektur, kurzer Text.'},
        {q: 'Aus drei Studienzusammenfassungen eine Entscheidungsvorlage mit Pro und Contra entwickeln.', a: 1, why: 'Mehrere Quellen abwägen ist anspruchsvoll.'}
      ]}
  ],
  einr: {
    title: 'Deine Werkstatt ist eingerichtet',
    checkTitle: 'Prompt-Check vor dem Absenden',
    checks: ['Steht drin, was genau entstehen soll?', 'Hat die KI den Kontext, den eine neue Kollegin bräuchte?', 'Sind Länge und Format genannt?', 'Habe ich einen Prüfauftrag mitgegeben?', 'Passt das gewählte Modell zur Aufgabe?', 'Ist das ein neues Thema? Dann starte ich einen neuen Chat.'],
    tplTitle: 'Anweisung für deinen Promptmaster',
    tpl: 'Du hilfst mir, Prompts für andere Chats zu schreiben.\n\nAblauf:\n1. Ich beschreibe grob, was ich brauche.\n2. Du stellst mir höchstens fünf Rückfragen zu Ziel, Zielgruppe, Kontext und Format.\n3. Du schreibst einen fertigen Prompt mit diesen Bausteinen: Rolle, Aufgabe, Kontext, Format, Prüfauftrag.\n4. Du schlägst vor, ob ein schnelles oder ein gründliches Modell reicht, und begründest das in einem Satz.\n\nRegeln:\n- Erfinde keine Fakten. Wo Angaben fehlen, setze [Platzhalter].\n- Der Prompt soll ohne weitere Erklärung in einem neuen Chat funktionieren.',
    note: 'Auch ein guter Prompt garantiert kein richtiges Ergebnis. Prüfen bleibt deine Aufgabe.'
  }
},
{
  id: 'detektivbuero', slot: 5, name: 'Detektivbüro', sub: 'KI-Texte erkennen, Slop vermeiden', npc: 'ada', ic: 'lupe',
  look: {wall: 'wall-3', roof: 'roof-3', roofType: 'gable', emblem: 'magnifier', kind: 'detective', w: 3.9, h: 3},
  q0: {q: 'Ein Programm verspricht, KI-Texte sicher zu erkennen. Wie verlässlich ist das?', opts: ['Sehr verlässlich, die Technik ist ausgereift.', 'Nicht verlässlich. Solche Programme irren sich in beide Richtungen.', 'Verlässlich, solange der Text auf Englisch ist.'], a: 1, why: 'Eine Untersuchung mehrerer Erkennungsprogramme kam zum Ergebnis, dass sie weder genau noch verlässlich sind. Eine andere zeigte, dass Texte von Nicht-Muttersprachler:innen häufiger fälschlich als KI-Text gelten.'},
  cards: [
    {k: 'Faustregeln, keine Beweise', v: 'Menschen schreiben auch so, und gute KI-Texte können unauffällig sein. Nutze die Merkmale als Prüffragen für deine eigenen Texte, nicht als Urteil über andere.', ic: 'waage', src: ['weber', 'liang']},
    {k: 'Floskel-Rahmen', v: 'Ein Einstieg wie „In der heutigen Zeit“ und ein Schluss, der alles noch einmal zusammenfasst.', ic: 'rahmen', src: ['erf']},
    {k: '„Nicht nur, sondern auch“', v: 'Gegenüberstellungen und Dreierlisten, die groß klingen und wenig sagen.', ic: 'drei', src: ['erf']},
    {k: 'Glatt und leer', v: 'Gleichmäßige Satzlängen, keine eigene Haltung, keine Namen, Zahlen oder Orte.', ic: 'welle', src: ['erf']},
    {k: 'KI-Slop', v: 'Unreflektiert übernommener KI-Text: allgemein, aufgebläht, faktisch wackelig. Er entsteht meist durch zu wenig Kontext und einen ungeprüften ersten Entwurf.', ic: 'tropfen'},
    {k: 'Kennzeichnen', v: 'Ob und wie du KI-Einsatz angibst, regelt deine Organisation. Für täuschend echte Bilder, Ton- und Videoaufnahmen gilt in der EU seit 2. August 2026 eine Pflicht zur Offenlegung.', ic: 'etikett', src: ['kivo50']}
  ],
  tasks: [
    {type: 'mark', title: 'Finde den Slop', intro: 'Das ist der Anfang eines Newsletters. Markiere die Sätze, die leer und austauschbar sind.', label: 'Slop', hint: 'Frag bei jedem Satz: Steht etwas Konkretes drin, das nur hier passt?',
      items: [
        {t: 'In der heutigen schnelllebigen Zeit ist digitale Kommunikation wichtiger denn je.', bad: true, why: 'Floskel-Einstieg. Der Satz passt zu jedem Thema.'},
        {t: 'Unser Team hat es sich zur Aufgabe gemacht, nicht nur Informationen zu vermitteln, sondern echte Mehrwerte zu schaffen.', bad: true, why: '„Nicht nur, sondern“ ohne Inhalt. Was der Mehrwert ist, bleibt offen.'},
        {t: 'Am Donnerstag, 12. November, 18 Uhr, zeigen wir im Pfarrsaal Beispielgasse 4, wie die Anmeldung funktioniert.', bad: false, why: 'Konkret: Tag, Uhrzeit, Ort und Inhalt.'},
        {t: 'Mit unserem neuen Angebot erreichen Sie schneller, effizienter und nachhaltiger Ihre Ziele.', bad: true, why: 'Dreierliste aus Schlagwörtern, keine Zahl, kein Beispiel.'},
        {t: 'Die Teilnahme ist kostenlos, bitte melden Sie sich bis Freitag unter anmeldung@beispiel.example an.', bad: false, why: 'Konkret: Preis, Frist und Kontakt.'},
        {t: 'Zusammenfassend lässt sich sagen, dass diese Initiative einen wichtigen Beitrag zu einer besseren Zukunft leistet.', bad: true, why: 'Floskel-Schluss. Er behauptet etwas, das nirgends belegt wird.'}
      ]},
    {type: 'sort', title: 'Welches Muster?', intro: 'Ordne jeden Satz dem Muster zu, das am stärksten auffällt.', cats: ['Floskel-Rahmen', 'Dreierliste', 'Nicht nur, sondern', 'Konkret und in Ordnung'], hint: 'Zähl Aufzählungen, such nach Gegenüberstellungen, prüf Anfang und Schluss.',
      items: [
        {q: '„Abschließend bleibt festzuhalten, dass Zusammenarbeit der Schlüssel zum Erfolg ist.“', a: 0, why: 'Ein Schlusssatz, der nur zusammenfasst und zu allem passt.'},
        {q: '„Wir arbeiten transparent, innovativ und zukunftsorientiert.“', a: 1, why: 'Drei Schlagwörter ohne Beleg.'},
        {q: '„Es geht nicht nur um Zahlen, sondern um Menschen.“', a: 2, why: 'Gegenüberstellung, die groß klingt und offen lässt, was gemeint ist.'},
        {q: '„Im Oktober kamen 43 Personen zur Sprechstunde, zwölf mehr als im September.“', a: 3, why: 'Zahl, Zeitraum, Vergleich: konkret.'}
      ]},
    {type: 'cloze', title: 'Slop überarbeiten', intro: 'Mach aus dem leeren Satz einen konkreten. Setz ein.', text: 'Vorher: „Unser Angebot schafft echten Mehrwert für alle Beteiligten.“ Nachher: „Seit {0} berät unser Team {1} kostenlos zu {2}. Anmeldung unter {3}.“', blanks: ['März', 'jeden Dienstag', 'Mietfragen', 'beratung@beispiel.example'], pool: ['nachhaltig', 'ganzheitlich'], hint: 'Wann, wie oft, wozu, wie erreichbar?', why: 'Zeitpunkt, Häufigkeit, Thema und Kontakt ersetzen das Wort „Mehrwert“. Die Angaben musst du selbst liefern, die KI kennt sie nicht.'}
  ],
  einr: {
    title: 'Dein Detektivbüro ist eingerichtet',
    checkTitle: 'Slop-Checkliste',
    checks: ['Würde ich das so sagen?', 'Steht etwas Konkretes drin: Zahl, Name, Ort, Beispiel?', 'Ist jede Aussage geprüft?', 'Habe ich Floskeln gestrichen, statt nur glatter zu formulieren?', 'Habe ich den Text selbst gelesen und angepasst?'],
    tplTitle: 'Zusatz für deine Aufträge gegen Slop',
    tpl: 'Schreibe konkret. Nenne Zahlen, Namen und Beispiele nur, wenn ich sie liefere, und erfinde keine.\nKeine Floskeln am Anfang oder Ende, keine Zusammenfassung am Schluss.\nKurze Sätze, wechselnde Satzlänge. Keine Dreierlisten, wenn ein Satz reicht.\nFrage nach, wenn dir Fakten fehlen.',
    note: 'Der Zusatz senkt die Gefahr von Slop, schließt sie nicht aus. Den Text liest und überarbeitest du selbst.'
  }
},
{
  id: 'schreibstube', slot: 6, name: 'Schreibstube', sub: 'Mein Schreibstil', npc: 'mira', ic: 'feder',
  look: {wall: 'wall-5', roof: 'roof-4', roofType: 'gable', emblem: 'quill', kind: 'writing'},
  q0: {q: 'Du gibst der KI Texte, damit sie deinen Stil lernt. Einer davon wurde früher mit KI „verbessert“. Was passiert?', opts: ['Nichts, Text ist Text.', 'Das Profil lernt die KI-Muster mit, die du vermeiden willst.', 'Das Profil wird besser, weil der Text schon geglättet ist.'], a: 1, why: 'Ein Stilprofil ist nur so sehr deins wie die Texte, aus denen es entsteht.'},
  cards: [
    {k: 'Warum klingt KI gleich?', v: 'Ohne weitere Angaben schreibt eine KI im Durchschnitt vieler Texte. Mit einem Stilprofil zeigst du ihr, wie du schreibst.', ic: 'welle', src: ['erf']},
    {k: 'Nur eigene Texte', v: 'Nimm Texte, die du selbst und ohne KI geschrieben hast. Texte anderer zeigen deren Stil und gehören ihnen.', ic: 'person'},
    {k: 'Auswählen', v: 'Fünf bis zehn Texte verschiedener Art, etwa E-Mail, Beitrag und Bericht. Entferne vorher Namen und Vertrauliches.', ic: 'stapel'},
    {k: 'Stilprofil', v: 'Die KI beschreibt Satzlänge, Wortwahl, Ton, Anrede, typische Wendungen und was du nie schreibst. Du korrigierst und speicherst das als Datei oder Projektanweisung.', ic: 'datei'},
    {k: 'Zweiter Durchgang', v: 'Lass jeden Entwurf auf typische KI-Muster prüfen und in deinem Stil umschreiben. Manche nennen das Humanizer.', ic: 'lupe'},
    {k: 'Grenzen', v: 'Deine eigenen Texte bleiben der Maßstab. Was du nicht selbst gelesen hast, schickst du nicht ab.', ic: 'stopp'}
  ],
  tasks: [
    {type: 'sort', title: 'Welche Texte taugen?', intro: 'Du sammelst Texte für dein Stilprofil.', cats: ['Verwenden', 'Weglassen'], colors: ['g', 'r'], hint: 'Selbst geschrieben? Ohne KI? Frei von vertraulichen Angaben?',
      items: [
        {q: 'Ein LinkedIn-Beitrag, den du 2022 selbst geschrieben hast.', a: 0, why: 'Eigener Text ohne KI-Hilfe.'},
        {q: 'Ein Newsletter, den ein KI-Tool für dich formuliert hat.', a: 1, why: 'Das Profil würde KI-Muster lernen.'},
        {q: 'Der Jahresbericht deiner Kollegin.', a: 1, why: 'Er zeigt ihren Stil und gehört ihr.'},
        {q: 'Deine Eröffnungsrede vom Sommerfest, selbst geschrieben.', a: 0, why: 'Eigener Text in einer anderen Textart. Gut für ein breites Profil.'},
        {q: 'Eine E-Mail von dir, aus der du Namen und Details entfernt hast.', a: 0, why: 'Eigener Text, vorher anonymisiert.'},
        {q: 'Ein Text, den du mit einem KI-Tool „verbessert“ hast.', a: 1, why: 'Darin steckt nicht mehr nur dein Stil.'}
      ]},
    {type: 'order', title: 'Vom Text zum Profil', intro: 'Bring die Schritte in eine sinnvolle Reihenfolge.', items: ['Eigene Texte sammeln, die ohne KI entstanden sind', 'Namen und Vertrauliches entfernen', 'Die KI den Stil beschreiben lassen, mit Belegstellen', 'Beschreibung lesen und korrigieren', 'Profil als Datei oder Projektanweisung speichern', 'Testtext schreiben lassen und mit einem eigenen vergleichen'], hint: 'Erst sammeln und bereinigen, dann analysieren, dann prüfen.', why: 'Die Korrektur vor dem Speichern ist wichtig: Die KI beschreibt deinen Stil manchmal freundlicher oder glatter, als er ist.'},
    {type: 'build', title: 'Prompt-Werkstatt: Stilprofil', intro: 'Bau den Auftrag für dein Stilprofil.', weak: 'Analysiere meinen Schreibstil.',
      slots: [
        {k: 'Aufgabe', opts: ['Beschreibe meinen Schreibstil als Anweisung für eine KI.', 'Sag mir, wie ich schreibe.'], a: 0, why: 'Das Ergebnis soll später als Anweisung dienen. Das muss im Auftrag stehen.'},
        {k: 'Kontext', opts: ['Hier sind Texte.', 'Hier sind sieben Texte, die ich selbst und ohne KI geschrieben habe: drei E-Mails, zwei Beiträge, zwei Berichte.'], a: 1, why: 'Anzahl, Herkunft und Art der Texte helfen der KI, Muster von Zufall zu trennen.'},
        {k: 'Format', opts: ['Gliedere nach Satzlänge, Wortwahl, Ton, Anrede, typischen Wendungen und dem, was ich nie schreibe.', 'Schreib einen schönen Absatz darüber.'], a: 0, why: 'Feste Punkte machen das Profil vergleichbar und später leicht zu korrigieren.'},
        {k: 'Prüfauftrag', opts: ['Belege jede Beobachtung mit einer kurzen Stelle aus meinen Texten. Erfinde keine Merkmale.', 'Sei ehrlich.'], a: 0, why: 'Mit Belegstellen kannst du jede Behauptung über deinen Stil nachprüfen.'}
      ],
      result: 'Typisches Ergebnis: eine Liste mit sechs Abschnitten, je zwei bis vier Beobachtungen und einem kurzen Zitat aus deinen Texten. Manches wirst du streichen, weil es nur in einem Text vorkommt.',
      criteria: ['Stammen alle Texte von mir und sind ohne KI entstanden?', 'Sind Namen und Vertrauliches entfernt?', 'Verlangt der Auftrag Belegstellen?', 'Weiß ich, wo ich das Profil speichere?']}
  ],
  einr: {
    title: 'Deine Schreibstube ist eingerichtet',
    checkTitle: 'Vor dem Veröffentlichen',
    checks: ['Mein Stilprofil liegt in einem Projekt oder als Datei bereit.', 'Ich habe den zweiten Durchgang gemacht.', 'Ich habe den Text laut gelesen.', 'Alle Fakten im Text sind geprüft.'],
    tplTitle: 'Stilprofil erstellen und Entwurf prüfen',
    tpl: '1) Stilprofil erstellen\nHier sind [Anzahl] Texte, die ich selbst und ohne KI geschrieben habe. Beschreibe meinen Schreibstil als Anweisung für eine KI: Satzlänge, Wortwahl, Ton, Anrede, typische Wendungen und was ich nie schreibe. Belege jede Beobachtung mit einem kurzen Beispiel aus meinen Texten. Erfinde keine Merkmale.\n\n2) Zweiter Durchgang für einen Entwurf\nPrüfe diesen Entwurf auf typische KI-Muster: Floskeln am Anfang oder Ende, „nicht nur, sondern“, Dreierlisten ohne Grund, viele Gedankenstriche, gleichförmige Satzlängen, Aussagen ohne Konkretes. Liste jede Stelle auf und schlage eine Formulierung in meinem Stil vor. Ändere keine Fakten.',
    note: 'Ein Stilprofil macht Entwürfe persönlicher. Für Inhalt und Richtigkeit bist weiterhin du verantwortlich.'
  }
},
{
  id: 'archiv', slot: 7, name: 'Archiv', sub: 'Recherche und Quellen', npc: 'ada', ic: 'saeulen',
  look: {wall: 'wall-2', roof: 'roof-2', roofType: 'gable', emblem: 'columns', w: 5.2, kind: 'archive'},
  q0: {q: 'Die KI nennt eine Quelle mit Link. Der Link funktioniert. Ist die Aussage damit belegt?', opts: ['Ja, die Seite gibt es ja.', 'Nein. Die Seite kann existieren und die Aussage trotzdem nicht enthalten.', 'Ja, wenn es eine offizielle Seite ist.'], a: 1, why: 'Ein funktionierender Link beweist nur, dass es die Seite gibt. Ob die Aussage dort steht, siehst du erst, wenn du sie im Original suchst.'},
  cards: [
    {k: 'KI erfindet Quellen', v: 'Eine KI kann Quellen erfinden, verwechseln oder falsch wiedergeben. In einer Untersuchung zu ChatGPT war ein erheblicher Teil der gelieferten Literaturangaben erfunden.', ic: 'lupe', src: ['walters', 'ji']},
    {k: 'Die Prüfroutine', v: 'Quelle verlangen. Original öffnen. Aussage im Original suchen. Stand prüfen. Unsicheres kennzeichnen lassen.', fig: 'pruefweg'},
    {k: 'Primär vor sekundär', v: 'Wenn möglich zum Original gehen: Gesetz, Studie, Leitlinie, offizielle Statistik. Zusammenfassungen anderer können Fehler weitertragen.', ic: 'saeulen'},
    {k: 'Zweite Quelle', v: 'Für wichtige Aussagen eine unabhängige Bestätigung suchen.', ic: 'zwei'},
    {k: 'Nicht auffindbar?', v: 'Dann gilt die Aussage als unbelegt: streichen oder so kennzeichnen. Überleg, welche Art von Quelle nötig wäre.', ic: 'stopp'}
  ],
  tasks: [
    {type: 'order', title: 'Die Prüfroutine', intro: 'Bring die Schritte in die richtige Reihenfolge.', items: ['Quelle mit Titel, Herausgeber und Datum verlangen', 'Original selbst öffnen', 'Zahl oder Satz im Original suchen', 'Stand prüfen: Gibt es eine neuere Fassung?', 'Für Wichtiges eine zweite Quelle suchen', 'Was offen bleibt, als unbelegt kennzeichnen'], hint: 'Vom Verlangen über das Öffnen zum Vergleichen.', why: 'Erst wenn du die Aussage im Original gefunden hast, lohnt sich die Frage nach Stand und zweiter Quelle.'},
    {type: 'sort', title: 'Übernehmen oder nicht?', intro: 'Eine KI hat diese Aussagen mit Quellen geliefert. Du hast jede geprüft, die Prüfnotiz steht dabei.', cats: ['Übernehmen', 'Nicht übernehmen'], colors: ['g', 'r'], hint: 'Lies die Prüfnotiz genau: Existiert die Quelle, steht es dort, ist sie aktuell?',
      items: [
        {q: 'Laut einer Befragung nutzen 62 % der Menschen im Beispielland Gesundheitsinformationen zuerst online.', d: [['Quelle laut KI', 'Institut für Gesundheitskommunikation Musterstadt, 2025'], ['Prüfnotiz', 'Link geöffnet. Titel und Herausgeber stimmen, die Zahl steht auf Seite 4.']], a: 0, why: 'Existenz, Zahl und Datum stimmen mit dem Original überein.'},
        {q: 'Eine Metaanalyse von 2024 belegt, dass Erinnerungsnachrichten die Teilnahme klar erhöhen.', d: [['Quelle laut KI', 'Dr. H. Lindner, „Reminder Effects Revisited“, 2024'], ['Prüfnotiz', 'Weder beim Verlag noch in der Fachdatenbank gibt es einen Eintrag zu Titel oder Autor.']], a: 1, why: 'Erfundene Quelle. Ohne auffindbare Quelle darf die Aussage nicht übernommen werden.'},
        {q: 'Die Leitlinie empfiehlt drei Kontrolltermine pro Jahr.', d: [['Quelle laut KI', 'Leitlinie Beispielthema, Fassung 2016'], ['Prüfnotiz', 'Die Leitlinie wurde 2023 durch eine neue Fassung ersetzt. Die Zahl steht nur in der alten.']], a: 1, why: 'Veraltet. Die neue Fassung kann etwas anderes sagen.'},
        {q: 'Die Zahl der Beratungen stieg 2024 um 18 %.', d: [['Quelle laut KI', 'Jahresbericht 2024, Verein Beispielhilfe'], ['Prüfnotiz', 'Im Bericht steht ein Anstieg um 8 %, nicht um 18 %.']], a: 1, why: 'Falsche Zahl. Zahlen immer am Original abgleichen.'},
        {q: 'Die Fachgesellschaft empfiehlt, Patient:innen schriftlich zu informieren.', d: [['Quelle laut KI', 'Fachgesellschaft Muster, Empfehlung zur Patienteninformation'], ['Prüfnotiz', 'Der Link führt auf die Startseite. Eine solche Empfehlung steht dort nirgends.']], a: 1, why: 'Link ohne Beleg. Die Seite existiert, die Aussage nicht.'},
        {q: 'Das Ministerium im Beispielland veröffentlichte 2025 einen Bericht zur Versorgungslage.', d: [['Quelle laut KI', 'Ministerium für Gesundheit Beispielland, Versorgungsbericht 2025'], ['Prüfnotiz', 'Link geöffnet, die Aussage steht auf Seite 12. Ein Fachmedium berichtet unabhängig dasselbe.']], a: 0, why: 'Original gefunden und von einer zweiten Quelle bestätigt.'}
      ]},
    {type: 'sort', title: 'Was ist hier das Original?', intro: 'Ordne jede Quelle ein.', cats: ['Primärquelle', 'Sekundärquelle'], hint: 'Stammt die Aussage von dort oder wird dort über sie berichtet?',
      items: [
        {q: 'Der Gesetzestext im Amtsblatt.', a: 0, why: 'Das Gesetz selbst ist das Original.'},
        {q: 'Ein Blogbeitrag, der das Gesetz zusammenfasst.', a: 1, why: 'Eine Zusammenfassung kann verkürzen oder irren.'},
        {q: 'Die Studie in der Fachzeitschrift.', a: 0, why: 'Dort stehen Methode und Ergebnisse aus erster Hand.'},
        {q: 'Ein Zeitungsartikel über die Studie.', a: 1, why: 'Gut zum Finden, zum Belegen gehst du zur Studie.'},
        {q: 'Die Hilfeseite des Anbieters zu einer Funktion.', a: 0, why: 'Für Funktionen und Tarife ist der Anbieter die erste Quelle. Achte auf das Datum.'}
      ]}
  ],
  einr: {
    title: 'Dein Archiv ist eingerichtet',
    checkTitle: 'Prüfliste vor jeder Verwendung',
    checks: ['Sind alle Quellen geöffnet und echt, nicht nur im Text genannt?', 'Stimmen Zahlen, Namen und Daten mit der Quelle überein?', 'Ist der Stand der Quelle aktuell genug?', 'Sind Annahmen und Unsicheres als solche gekennzeichnet?', 'Habe ich für wichtige Aussagen eine zweite Quelle?'],
    tplTitle: 'Quellenregeln für deine Grundregeln',
    tpl: 'Quellen\n- Nenne zu jeder fachlichen Aussage eine Quelle mit Titel, Herausgeber, Datum und Link.\n- Nutze bevorzugt Primärquellen, offizielle Institutionen, Leitlinien und Studien.\n- Gib keine Quelle an, die du nicht tatsächlich geöffnet und gelesen hast.\n- Erfinde nichts. Wenn du etwas nicht weißt oder keine Quelle findest, sage das ausdrücklich.\n- Kennzeichne Annahmen, Schätzungen und strittige Punkte als solche.\n- Zahlen immer mit Quelle und Stand.',
    note: 'Die Regeln senken das Risiko erfundener Quellen, schließen es aber nicht aus. Die Prüfung bleibt bei dir.'
  }
}
];
