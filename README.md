# Studienplaner – Frontend

Angular-Frontend für den Studienplaner (Team 1, FIW, HTW Berlin).

## Voraussetzungen

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org) **24.16.0** oder neuer (npm ist dabei)

Prüfen mit `node -v`. Angular muss nicht separat installiert werden, das kommt über `npm install`.

## Setup

```bash
git clone https://github.com/fiw-studienplaner-team1/frontend.git
cd frontend
npm install
```

`npm install` installiert alle Abhängigkeiten inkl. Angular in den Versionen aus der `package-lock.json`, also bei allen gleich.

## Starten

```bash
npm start
```

Die App läuft unter http://localhost:4200 und lädt bei Änderungen automatisch neu. Beenden mit `Strg + C`.

## Hinweise

- Nach einem Pull, der die `package.json` ändert, erneut `npm install` ausführen.
- `package-lock.json` immer mitcommitten, `node_modules` nie.
- Angular-CLI-Befehle über `npx` ausführen (z. B. `npx ng generate component name`), damit die Projektversion genutzt wird.
- Wer [nvm](https://github.com/nvm-sh/nvm) nutzt, kann mit `nvm use` die Version aus der `.nvmrc` aktivieren. Ohne nvm einfach ignorieren.

## Befehle

| Befehl | Beschreibung |
|---|---|
| `npm start` | Entwicklungsserver starten |
| `npx ng generate component name` | Komponente anlegen |
| `npm run build` | Produktions-Build nach `dist/` |
| `npm test` | Tests ausführen |