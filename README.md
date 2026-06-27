# ForeBall

ForeBall is a personal golf scorecard, handicap, and analytics tracker. It runs as a static web app, can be installed as a PWA, and stores your data locally in the browser.

Live app: https://jamie-thoms0n.github.io/ForeBall/

## What It Does

- Start rounds from saved courses and supported tees.
- Play 18 holes, front 9, back 9, and 9-hole courses.
- Track hole-by-hole score, putts, putt distances, tee clubs, approach clubs, fairways, fairway misses, approach distance, approach misses, GIR, chips, chip types, fairway bunkers, greenside bunkers, penalties, and picked-up holes.
- Add end-of-round context including weather, wind speed, wind direction, food consumed by hole, and notes.
- Review completed rounds, view the scorecard, and view round-level stats.
- Mark rounds as excluded from analytics or handicap calculations.
- Export one round or multiple recent rounds as CSV, JSON, or text.
- Install and use as a PWA after the app has been loaded once.

## Profile And Bag

The profile page stores:

- Name
- Profile photo
- Current handicap
- Handicap goal and goal date
- Clubs in the bag
- Wedges with custom name and loft

Saved clubs are used in the scorecard club selectors, so tee-shot and approach-shot data can be tied back to the clubs actually in your bag.

## Analytics

The analytics tab includes section-based analysis:

- Performance Overview
- Strokes Lost Analysis
- Driving
- Approach Play
- Short Game
- Putting
- Scoring Analysis
- Situational Analysis
- Trends
- Practice Priorities

Analytics include handicap trends, scoring distribution, front/back splits, strokes-lost style estimates, club performance, miss patterns, approach distance and club matrices, bunker leave stats, putting distance outcomes, scoring cause attribution, wind/weather/food correlations, rolling trends, and automatic practice priorities.

Score-impact tables generally use score relative to par rather than raw average score, so par-3, par-4, and par-5 holes are compared more fairly.

## Handicap

ForeBall estimates handicap index using stored course rating and slope data where available.

- Regular handicap excludes North Berwick Children's Course.
- Children's Course has its own separate index.
- PCC is treated as `0`.
- Rounds missing required handicap data are excluded from handicap calculations.
- Rounds manually excluded from handicap are not used.
- Counting handicap rounds are marked on the Rounds tab.

## Data Storage

ForeBall stores data in browser `localStorage`.

This means:

- Completed rounds should remain after closing and reopening the app on the same device/browser.
- Active rounds should persist if you close the app mid-round.
- Profile, bag, photos, rounds, exclusions, and context data are local to that browser.
- Data does not automatically sync between devices.
- GitHub Pages does not store your round data on a server.
- Clearing browser/site data can delete saved rounds.

The PWA can work offline after the app shell has been cached by the service worker. For best offline reliability, open the app once while online before using it without WiFi or cellular.

## Running Locally

No package install or build step is required. The project is plain HTML, CSS, and JavaScript.

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

The service worker is not registered on `localhost`, so local testing should update immediately after refreshing.

## Local Demo Data

The app can seed demo rounds when running locally. This is intended for testing analytics without affecting the live GitHub Pages app or real user data.

## Deployment

The app is designed to run directly from GitHub Pages. Push changes to the repository branch configured for Pages, then open:

```text
https://jamie-thoms0n.github.io/ForeBall/
```

Because this is a PWA, browsers may cache old files. If a change does not appear immediately, refresh the page, close and reopen the installed PWA, or wait for the service worker cache update to activate.

## Project Files

- `index.html` contains the app structure.
- `style.css` contains all styling.
- `app.js` contains courses, state, scoring, profile, persistence, exports, handicap logic, and analytics.
- `chart.local.js` provides local chart rendering.
- `manifest.json` configures the PWA install metadata.
- `sw.js` caches the app shell for offline use.
- `logo-icon.png`, `logo-icon-192.png`, `logo-icon-512.png`, and `logo-wordmark.png` are app branding assets.
