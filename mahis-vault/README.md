# Mahi's Vault — Remembering Tables

An original, child-friendly HTML5 cinematic platformer with ten progressively longer stages. Guide Mahi through distinct routes in the **Starglass Temple**, collect memory sparks, survive changing hazards, climb staircases and ladders to reach high ledges (hold **↑** to climb, **↓** to descend; **Space**/**↑** still jumps), time your runs past Prince-of-Persia-style traps — retracting floor spikes, slamming blades, erupting volcanoes, and loose tiles that crumble underfoot — light checkpoints, confront powered guardians, and solve addition, subtraction, multiplication, division, and mixed-operation challenges.

## Evolution-of-Computers knowledge track

Alongside the maths, the game teaches a Class-4/5 computer-history chapter
(early counting devices, pioneers, generations of computers, plus files &
folders). Source facts are transcribed in [`docs/chapter-content.md`](docs/chapter-content.md)
and encoded as ~90 multiple-choice questions in `src/data/knowledge.js`
(`src/quiz/quizEngine.js` serves them).

- **Data Cores** — glowing `?` beacons (6 per stage) float along each route. Touch
  one for a knowledge question. Correct → +150 points, the fact is shown, and the
  `🧠 learned / total` HUD counter rises. Wrong → the fact is revealed and you
  retry; **no heart is lost** (recall of new material, not drill).
- **Knowledge Gate** — after the three maths questions, one chapter fact must be
  answered to open the stage gate (also no heart lost).
- Learned facts persist across the whole adventure in `localStorage`
  (`mahi-knowledge`), so repeat runs work through every question, then recycle
  for revision.

No textbook artwork is used — each device shows an original SVG icon.

## Traps are a challenge, not an instant hit

Touching crystal thorns, a spike/blade trap or a volcanic blast no longer sends
Mahi straight back. Instead a quick question pops up (a fast maths sum or a
one-line chapter fact). Answer it correctly and Mahi springs clear with a short
burst of invincibility; answer wrong and the trap strikes — one heart lost and
back to the checkpoint.

## Hidden quicksave — Ctrl+S

Press **Ctrl+S** any time to save a full snapshot of the run for the current
stage (position, hearts, score, sparks, learned facts, Data Cores, guardian
state, gate state) to `localStorage` (`mahi-save-<stage>`). Reload or restart the
stage and you resume exactly there — handy for a tricky stretch. Mahi has four
hearts: the first three mistakes continue from the current point, and the
fourth clears the snapshot and restarts only the current stage.

## Run and test

Requires Node.js 18+. Run `npm start`, then open `http://localhost:4173`. Run `npm test` for the math unit tests. Progress and the completion report autosave in browser local storage.

**Cheat — manual questions:** press `Ctrl+7` at any time to type a question (`7 x 8`, `45 / 9`, `12 + 5`). If a challenge panel is open it loads immediately; either way the question is saved to `localStorage` (`mahi-custom-questions`) and afterwards has a ~25% chance of resurfacing in matching-operation challenges.

## Deploy / embed elsewhere

The game is fully static — `server.js` is only a local dev server. To put it on
another site:

```
npm run build          # -> standalone.html  (all CSS + JS inlined, assets/ referenced)
npm run build:inline    # -> also standalone-inline.html  (single file, PNGs embedded, ~19 MB)
```

- **Own static host / GitHub Pages / Netlify:** upload `standalone.html` together
  with the `assets/` folder (or upload the repo as-is and point at `index.html`).
  Must be served over HTTP(S) with `.js` as `text/javascript`.
- **Embed inside an existing page:** use an iframe, not inlined markup (the game
  has full-screen `position:fixed` dialogs and global key handlers):
  ```html
  <iframe src="mahis-vault/standalone.html"
          style="width:100%;max-width:1100px;aspect-ratio:1100/720;border:0"></iframe>
  ```
  Do not use a `sandbox` iframe without `allow-same-origin`, or `localStorage`
  (progress, quicksave, learned facts) stops working.
- **A one-file drop / restrictive playground:** use `standalone-inline.html` — it
  needs nothing else, but it is ~19 MB because of the sprite sheets.

`build.js` inlines every `src/*.css` and flattens the ES-module graph (imports
stripped, `export` keyword removed) into one `<script type="module">`. No bundler
or dependencies.

## Architecture

- `src/game/`: platform movement/collision, stair/ladder climbing, and world simulation
- `src/math/`: independent question generation, validation, hints, and explanations
- `src/data/`: editable level geometry and progression rules
- `src/main.js`: orchestration, Canvas rendering, UI, saves, input, and metrics
- `test/`: unit tests for all four operations, division safety, progression, and validation

The prototype uses procedural Canvas environments plus original generated animation sheets for Mahi, the Moonstone Sentinel, Ember Imp, and Moss Golem: no copied artwork, audio, maps, characters, or source code.

## Historical design study (ideas only)

The archival Apple II project is 6502 assembly organized into tightly constrained subsystems. Its porting documentation describes a recurring frame loop, table-driven character actions, room/tile data, foreground/background collision concerns, and transitions between bounded rooms. The public development history also documents filmed movement used as animation reference and an iterative path from rough test footage/placeholders to final movement.

Mahi's Vault borrows only broad design principles: readable anticipation and landing, explicit movement states, spatially meaningful tile-like platforms, forgiving edge/collision logic, compact room-scale goals, and prototype-first iteration. Modern modules, floating-point physics, semantic HTML UI, Canvas art, original fiction, and educational telemetry are independently authored. The repository itself warns that publication of the archive grants no franchise rights; this project therefore avoids its protected identity and expression.

## Expand later

Add stages by defining a level data module and selecting an operation rule from `difficulty.json`. Keep gates as events that request a challenge from `mathEngine`, never embedding math inside movement code. Suggested later interactions: subtraction bridge, division elevator, mixed-operation guardian, and multi-question treasure—after Stage 4 usability validation.
