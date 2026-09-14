MINI ARCADE V7
PLAY. COMPETE. LEVEL UP.

V7.0.0 — Stable Offline Edition

WHAT'S INCLUDED
- 25 playable mini-games
- Responsive desktop + mobile input
- Local save/progression, XP, coins, achievements and daily challenges
- Favorites and settings
- Offline service worker / PWA support
- Dependency-free WebGL depth/world layer
- Single-file build: index-single.html

IMPORTANT V7 FIXES
1. Fixed the game factory return bug that made every Play button appear to do nothing.
2. Fixed mobile pointer coordinates so taps/drags are relative to the game canvas.
3. Fixed missing optional dashboard elements so the app cannot crash during startup.
4. Added safer game-launch error handling and visible in-game error reporting.
5. Fixed daily-challenge goal selection so the goal matches the selected challenge.
6. Improved save migration and validation for older/corrupt local saves.
7. Improved service-worker versioning and online update behavior to avoid stale V6 JavaScript.
8. Fixed visual settings runtime to use the real MAStorage API.
9. Prevented the WebGL layer from intercepting game input.
10. Added single-file rebuild from the same V7 source modules.

PROJECT STRUCTURE
index.html                 Main GitHub Pages entry point
index-single.html          Fully self-contained single-file build
style.css                  Premium responsive styling
app.js                     App shell and game launcher
game-registry.js           25-game registry
storage.js                 Local save system
progression.js             XP/coin progression
achievements.js            Achievement system
challenges.js              Daily challenges
audio.js                   Sound effects
graphics.js                Canvas + WebGL graphics
input.js                   Keyboard/touch input
utils.js                   Shared utilities
manifest.json              PWA manifest
service-worker.js          Offline cache/update logic
games/                     Exactly 25 game modules
assets/                    Icon assets

GITHUB PAGES
Use index.html as the published root page.
The game modules must be in a lowercase folder named:
  games/

After uploading V7, allow GitHub Pages to rebuild. If an older service worker is still visible, refresh once while online; V7 uses a new cache name and requests the app shell without the browser cache.

VALIDATION
- JavaScript syntax check: PASS
- Single-file inline JavaScript syntax check: PASS
- Game modules: 25/25 instantiate with create/start/destroy smoke test
- Registry entries: 25
- index.html game script references: 25
- Service worker syntax: PASS
