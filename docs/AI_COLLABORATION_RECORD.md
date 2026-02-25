# AI Collaboration Record

## Project
- Repo: https://github.com/ccebreros27-svg/reusable-studio-engine
- Deployed link (if applicable): N/A (local build)
- Date started: 2026-02-25

## My constraints (before any AI)
- Intent (1 sentence): Build a reusable studio engine loop that stays simple, readable, and easy to extend.
- Constraints (3):
  - No new libraries.
  - Keep changes small and testable.
  - Preserve current folder structure under /src.
- Tension (1): Make the loop stable without overengineering timing logic.
- Taste vow (1): Prefer plain, legible functions over clever abstractions.

---

## Entry Log

### Entry 01 — 2026-02-25
**My next move (write before AI):**
- Stabilize frame timing in the loop.
- Keep update/draw order explicit.
- Avoid adding new engine features.

**Files touched:**
- src/canvas/loop.js

**Copilot prompt (paste exact prompt):**
- Context: I’m building a small reusable canvas engine; the loop should run predictably and be easy to read.  
  Target: Help me improve `src/canvas/loop.js` so delta time is stable and update/draw order is clear.  
  Constraints: no new libraries, no feature creep, keep function names readable, keep API minimal.  
  Acceptance test: animation stays smooth, no visible stutter spikes, and code is shorter or clearer than before.

**Copilot output (summarize in 3–6 bullets):**
- Suggested capping extreme `deltaTime` values.
- Kept `requestAnimationFrame` recursion in one place.
- Clarified ordering: compute delta → update → clear → draw.
- Proposed optional guard for first frame timestamp.

**My translation (what changed and why):**
- I normalized frame timing so one long frame does not break motion.
- I made loop order explicit to reduce future bugs.
- I kept the loop minimal so this engine remains reusable.

**Signal / Noise:**
- Signal: Capped delta made behavior more stable and easier to reason about.
- Noise: One suggestion introduced extra state that wasn’t needed for current scope.

**Next right action (one sentence):**
- Confirm clear-and-redraw behavior is consistent on each frame.

---

### Entry 02 — 2026-02-25
**My next move (write before AI):**
- Ensure canvas clears correctly before every draw.
- Prevent trailing artifacts.

**Files touched:**
- src/canvas/loop.js
- src/canvas/setupCanvas.js

**Copilot prompt (paste exact prompt):**
- Context: The engine loop runs, but I need redraw behavior to be visually clean every frame.  
  Target: In `src/canvas/loop.js` and `src/canvas/setupCanvas.js`, tighten clear logic so old pixels don’t linger.  
  Constraints: no new rendering features, keep existing architecture, no libraries.  
  Acceptance test: moving shapes do not leave trails and resizing still draws correctly.

**Copilot output (summarize in 3–6 bullets):**
- Recommended centralizing clear call in the loop.
- Suggested using current canvas width/height each frame.
- Flagged duplicate clear operations in setup and draw paths.
- Kept resize setup separate from frame rendering.

**My translation (what changed and why):**
- I made frame clearing a loop responsibility.
- I removed duplicate clearing paths to avoid inconsistent visuals.
- I kept resize logic separate so setup remains predictable.

**Signal / Noise:**
- Signal: Single clear path reduced visual artifacts and confusion.
- Noise: One optional helper function added indirection with no real gain.

**Next right action (one sentence):**
- Map input state to one controlled parameter and verify it updates live.

---

### Entry 03 — 2026-02-25
**My next move (write before AI):**
- Connect mouse input to one animation parameter.
- Keep input handling isolated from render logic.

**Files touched:**
- src/input/input.js
- main.js

**Copilot prompt (paste exact prompt):**
- Context: I’m wiring interaction into the reusable studio engine, and I want one clean data path from input to animation.  
  Target: Help update `src/input/input.js` and `main.js` so mouse position maps to one parameter used by update/draw.  
  Constraints: no global sprawl, no new classes, no libraries, keep names plain.  
  Acceptance test: moving the mouse changes one visible parameter in real time without breaking loop stability.

**Copilot output (summarize in 3–6 bullets):**
- Suggested normalized mouse coordinates (0..1).
- Kept event listeners in input module only.
- Returned input state through a simple object API.
- Recommended clamping to avoid out-of-bounds values.

**My translation (what changed and why):**
- I converted mouse position into normalized values to simplify downstream math.
- I kept input logic in one module to protect separation of concerns.
- I used one parameter path so behavior is easier to debug.

**Signal / Noise:**
- Signal: Normalization made the animation math simpler and reusable.
- Noise: A suggestion added optional smoothing that hid direct input response.

**Next right action (one sentence):**
- Refactor setup wiring so initialization steps are easier to scan.

---

### Entry 04 — 2026-02-25
**My next move (write before AI):**
- Reduce setup clutter in `main.js`.
- Keep startup order explicit.

**Files touched:**
- main.js
- src/canvas/setupCanvas.js

**Copilot prompt (paste exact prompt):**
- Context: The engine works, but startup wiring is getting noisy as modules grow.  
  Target: Refactor setup flow between `main.js` and `src/canvas/setupCanvas.js` for clearer initialization order.  
  Constraints: no architecture rewrite, no new files unless necessary, no libraries, keep behavior identical.  
  Acceptance test: app boots exactly the same, but init steps are easier to read top-to-bottom.

**Copilot output (summarize in 3–6 bullets):**
- Proposed extracting small setup helpers.
- Grouped init sequence: canvas → input → state → loop.
- Suggested preserving existing exported function names.
- Avoided changing runtime behavior.

**My translation (what changed and why):**
- I reorganized initialization into a clear sequence.
- I kept exported APIs stable so other modules were unaffected.
- I reduced cognitive load in `main.js` without feature changes.

**Signal / Noise:**
- Signal: Ordered startup steps made the system easier to maintain.
- Noise: One helper split was too granular and hurt readability.

**Next right action (one sentence):**
- Improve utility math readability and remove tiny repeated calculations.

---

### Entry 05 — 2026-02-25
**My next move (write before AI):**
- Clean up repeated math operations.
- Keep helper names obvious.

**Files touched:**
- src/utils/math.js
- main.js

**Copilot prompt (paste exact prompt):**
- Context: I’m tightening the engine internals and want utility math to stay obvious and reusable.  
  Target: Review `src/utils/math.js` usage in `main.js` and suggest minimal refactors for readability and correctness.  
  Constraints: no new math abstractions beyond basic helpers, no extra dependencies, preserve behavior.  
  Acceptance test: same visual output, fewer inline calculations, and easier-to-read parameter math.

**Copilot output (summarize in 3–6 bullets):**
- Recommended consolidating repeated clamp/lerp patterns.
- Suggested clearer helper argument names.
- Flagged one place where value range assumptions were implicit.
- Kept utility surface area small.

**My translation (what changed and why):**
- I moved repeated numeric transforms into existing helpers.
- I renamed helper parameters for legibility.
- I made range assumptions explicit so future edits are safer.

**Signal / Noise:**
- Signal: Utility cleanup reduced duplicate logic and mistakes.
- Noise: Extra helper proposals exceeded the project’s simplicity goal.

**Next right action (one sentence):**
- Document current collaboration process and commit this record with clear scope.

---

### Entry 06 — 2026-02-25
**My next move (write before AI):**
- Add the collaboration record to docs.
- Ensure entries show agency, not AI dependency.

**Files touched:**
- docs/AI_COLLABORATION_RECORD.md

**Copilot prompt (paste exact prompt):**
- Context: This repo requires a living AI collaboration record that demonstrates intent-first workflow and signal/noise judgment.  
  Target: Help me draft concise entries in `docs/AI_COLLABORATION_RECORD.md` using the required class template.  
  Constraints: minimum 6 entries, each includes context-target-constraints-acceptance in the prompt section, no invented features.  
  Acceptance test: file is complete, legible, and ready to keep updating after each future build.

**Copilot output (summarize in 3–6 bullets):**
- Produced a template-aligned structure with six entries.
- Kept each entry short and action-focused.
- Included explicit signal/noise distinctions.
- Preserved human decision points before and after AI usage.

**My translation (what changed and why):**
- I created a reusable logbook format in the docs folder.
- I made each entry demonstrate intent, translation, and discernment.
- I kept the record practical so it can continue through future builds.

**Signal / Noise:**
- Signal: The process is now visible, repeatable, and tied to concrete code moves.
- Noise: Any generic phrasing that doesn’t map to a real change should be removed in future updates.

**Next right action (one sentence):**
- Continue using this file as a live log and commit in small, scope-matched chunks.
