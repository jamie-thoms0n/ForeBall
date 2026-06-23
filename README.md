# ForeBall

ForeBall is a personal golf scorecard and analytics tracker. It runs as a static web app, works as a PWA, and stores round data locally in the browser.

Live app: https://jamie-thoms0n.github.io/ForeBall/

## Features

- Start rounds from a course dropdown.
- Play 18 holes, front 9, back 9, or 9-hole courses.
- Track score, putts, putt distances, fairways, approaches, GIR, chips, bunkers, penalties, and picked-up holes.
- Add end-of-round context such as weather, wind, food, and notes.
- Review completed rounds and round-level stats.
- View analytics for scoring, ball striking, short game, putting, trends, comparisons, and conditions.
- Export round data as JSON or CSV.
- Install as a PWA on supported browsers/devices.

## Data Storage

ForeBall stores data in the browser using `localStorage`.

This means:

- Completed rounds should still be there after closing and reopening the app on the same device/browser.
- Active rounds should also persist if you close the app mid-round.
- Data does not automatically sync between devices.
- Clearing browser/site data can delete saved rounds.
- GitHub Pages does not store your round data on a server.

The PWA can work offline after the app has been loaded and cached by the service worker. For best offline reliability, open the app once while online before using it without WiFi or cellular.

## Running Locally

This project does not need a build step or package install. It is plain HTML, CSS, and JavaScript.

From the project directory:

```bash
cd /Users/jamiethomson/Desktop/ForeBall
python3 -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

If port `5173` is already in use:

```bash
python3 -m http.server 5174
```

Then open:

```text
http://localhost:5174
```

## Files

- `index.html` contains the app structure.
- `style.css` contains all styling.
- `app.js` contains courses, round state, scoring, persistence, and analytics logic.
- `chart.local.js` provides chart rendering.
- `manifest.json` configures the PWA install metadata.
- `sw.js` caches the app shell for offline use.
- `logo-icon.png` and `logo-wordmark.png` are app branding assets.

## Deployment

The app is designed to run directly from GitHub Pages. Push changes to the repository branch configured for Pages, then open:

```text
https://jamie-thoms0n.github.io/ForeBall/
```

Because this is a PWA, browsers may cache old files. If a change does not appear immediately, refresh the page, close and reopen the installed PWA, or clear site data for the app.
