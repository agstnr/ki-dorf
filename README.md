# KI-Dorf 3

Begleitspiel zum zweitägigen KI-Seminar von Aisha Gstöttner. Stand: November 2026.

## Starten

`index.html` doppelklicken. Kein Server, kein Konto, kein Internet nötig.

Für GitHub Pages: den Inhalt von ` ins Repository legen. Die leere Datei `.nojekyll` aus dem alten Repository behalten.

## Was wo liegt

| Pfad | Inhalt |
|---|---|
| index.html` | Seitengerüst mit Content-Security-Policy |
| daten/haeuser1.js`, `haeuser2.js` | Die 17 Häuser: Einstiegsfrage, Karten, Aufgaben, Vorlagen |
| daten/quellen.js` | Quellen, Dorfbewohner:innen, Tipps, Prüfdatum |
| daten/prompts.js` | Promptsammlung, Glossar, Stand der Tool-Angaben |
| js/kern.js` | Lernstand, Dorfrunde, Spielstand-Code, Icons |
| js/aufgaben.js` | Die acht Aufgabenarten |
| js/figuren.js` | Infografiken |
| js/app.js` | Ansichten, Hilfe, Menü, Bibliothek |
| js/welt.js` | 3D-Dorf |
| vendor/three.kd.js` | three.js r187, MIT-Lizenz |
| schrift/` | Fredoka und Nunito, SIL Open Font License 1.1 |
| sw.js` | Hält die Dateien auf GitHub Pages für die Nutzung ohne Netz vor |

## Datenschutz

Das Spiel sendet nichts. Es speichert im Browser unter dem Schlüssel `ki-dorf-v3`: welche Karten gelöst sind, wann sie zuletzt dran waren, Einstellungen, angehakte Checklisten, gesehene Tipps und die Wörter der Wordcloud. Keine Namen, keine Antworttexte. Im Menü lässt sich alles löschen.
