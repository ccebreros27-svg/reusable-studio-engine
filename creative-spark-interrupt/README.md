# Creative Spark Interrupt

A mechanics-first prototype for addiction interruption that converts urges into short creative action.

## Submission Status
- Core build: complete
- README architecture notes: complete
- Recording plan: included below
- PDF bundle template: see `SUBMISSION_PACKET.md`
- Live deployment link: https://ccebreros27-svg.github.io/reusable-studio-engine/creative-spark-interrupt/
- Screen recording file: still needs to be recorded locally
- GitHub repository: https://github.com/ccebreros27-svg/reusable-studio-engine

## Tool Intent Statement
When a user feels an urge (of any type), this tool creates a **visible choice point** and redirects energy into a 3-minute creative task before the user acts impulsively.

## Core Loop (BUILD phase)
1. User checks in with urge type, intensity, emotion, and energy.
2. Tool presents a choice point: use interruption or skip.
3. If chosen, tool starts a timed 3-minute creative mission.
4. User reflects with post-urge intensity + short note.
5. Tool stores session and updates progress metrics.

## One Clearly Implemented Core Function
The single core function is: **interrupt an urge at the moment of action and replace it with one short creative task plus reflection**.

This is not a content feed, coaching app, or productivity dashboard. The system exists to create one visible behavioral detour.

## Input / Processing / Output

### Input layer
- Check-in form:
  - Urge type
  - Intensity (1–10)
  - Energy level
  - Emotion
- Mission response textarea:
  - Draft of the creative action the user takes
- Reflection form:
  - Post-intensity (1–10)
  - Short text reflection

### Processing layer
- Rules engine picks a mission from local prompt banks based on emotion + energy.
- A second prompt bank adjusts the mission based on urge type.
- The system merges those prompt pools and selects one mission.
- A countdown timer enforces intentional friction (3-minute delay).
- Runtime state tracks whether the tool is in check-in, choice point, mission, or reflection.
- Persistent metrics are recalculated after each completed reflection.
- Session reduction score is computed as:

$$
\Delta I = I_{pre} - I_{post}
$$

- Aggregate average reduction is computed across all saved sessions.

### Output layer
- Visible choice point (interrupt vs skip)
- Creative mission text + timer
- Logic feedback explaining what the rules engine is doing
- Progress snapshot:
  - completed interrupts
  - skips
  - total reflections
  - average urge reduction

## Back-End Architecture Notes

### What data does this tool need?
- Session records: pre-intensity, post-intensity, urge type, emotion, energy, note, timestamps
- Mission response draft text
- Counter metrics: completed count, skip count

### Where is it stored?
- Browser `localStorage` under one key: `creativeSparkInterruptData`
- Runtime-only state stays in memory until the session is submitted or skipped.

### Is it temporary or persistent?
- Persistent on this browser/device until storage is cleared.

### Does the system need memory between sessions?
- Yes. Stored history powers progress metrics and behavior feedback.

### Does the system require AI inference?
- No for this prototype. Prompt selection is deterministic/randomized from local libraries.
- Feedback copy is rule-based and local.

### How many API calls are realistically required?
- 0 in this build.
- Optional future enhancement: 1 call per session for dynamic prompt generation.

### What happens if the API fails?
- Not applicable now.
- Future-safe fallback: use local prompt bank and continue core loop.

### Failure modes in the current build
- If `localStorage` is unavailable, the app still runs but history will not persist.
- If the user refreshes during an active mission, runtime state is lost and they restart from check-in.
- If the timer is skipped, the tool still preserves user choice by recording a skip instead of blocking the interface.

### Data model
Each saved session stores:
- `urgeType`
- `otherUrgeText`
- `intensity`
- `energy`
- `emotion`
- `timestamp`
- `missionResponse`
- `postIntensity`
- `note`
- `completedAt`

## Separation of Concerns
- `index.html` → Input/Output structure
- `script.js` → Logic state machine, timer, selection rules, storage
- `style.css` → Presentation only

## Behavior Integrity Check
- Interruption happens immediately after check-in (correct timing).
- User always has choice (interrupt or skip), no coercion.
- No shame language, no surveillance, no hidden scoring.
- Friction is intentional (3-minute mission), not manipulative.
- Scope is minimal: one core function, one closed loop.

## Deployment Notes
This project is static HTML/CSS/JS. No build step is required.

### Fastest deployment path
1. Push the repository to GitHub.
2. Enable GitHub Pages from the root branch.
3. Use the deployed subpath for this tool:

  `/creative-spark-interrupt/`

Example final URL shape:

`https://your-username.github.io/reusable-studio-engine/creative-spark-interrupt/`

Current repo URL:

`https://github.com/ccebreros27-svg/reusable-studio-engine`

Expected live URL:

`https://ccebreros27-svg.github.io/reusable-studio-engine/creative-spark-interrupt/`

## Screen Recording Plan (under 2 minutes)
- 0:00–0:15 — Show the landing screen and the system map.
- 0:15–0:35 — Fill in the check-in form.
- 0:35–0:50 — Pause on the visible choice point.
- 0:50–1:15 — Start the interrupt and show the mission + timer.
- 1:15–1:35 — Jump to the reflection step and save a note.
- 1:35–1:55 — Show updated stats and recent wins.

## PDF Bundle Checklist
- Add live deployed link
- Add GitHub repository link
- Export this README or `SUBMISSION_PACKET.md` to PDF
- Include the short screen recording file or link
- Confirm the repo history is clean before submitting

## Run
Open `index.html` in a browser.
