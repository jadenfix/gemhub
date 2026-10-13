# GemHub

The original repository contained only its title. This implementation chooses a local discovery catalog and saved collections workspace as its purpose.

Search, collection filtering, save/remove, add validated links, local persistence, JSON backup import/export. Four editable sample resources.

## Run

Requires Python 3 and Node 22+ for tests. No packages, external assets, API keys, or installation required.

```sh
python3 -m http.server 8080
# open http://localhost:8080
node --test tests/*.test.js
```

Serve over HTTP; opening the file directly does not load ES modules reliably. All resources use relative paths, including static hosting under a repository prefix.

## Boundaries

No backend, authentication, shared collections, web scraping, or synchronization. Browser storage can be cleared; export backups.

Data stays in localStorage on the current origin. No network requests beyond the app assets. A failed storage write is announced in the interface. Domain logic is isolated in `engine.js`, with Node regression tests. Browser acceptance covers actual controls, reload persistence, exports, desktop and mobile; `scripts/browser-check.cjs` accepts an externally installed Playwright core and Chromium through environment variables.

```sh
PLAYWRIGHT_CORE_PATH=/absolute/path/to/playwright-core CHROMIUM_PATH=/absolute/path/to/chromium node scripts/browser-check.cjs
```

The browser runner starts its own server on port 3188, checks 1440px and 390px views, and captures temporary screenshots under `/tmp` for inspection.
