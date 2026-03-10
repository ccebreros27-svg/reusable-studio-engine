# Creative Spark Interrupt — Submission Packet

Use this file as the final bundle cover page before exporting to PDF.

## Fill These In Before Submission
- Live deployed link: https://ccebreros27-svg.github.io/reusable-studio-engine/creative-spark-interrupt/
- GitHub repository: https://github.com/ccebreros27-svg/reusable-studio-engine
- Screen recording link or filename: ______________________________
- Date submitted: ______________________________

## Project Summary
Creative Spark Interrupt is a mechanics-first behavioral tool. It catches an urge at check-in, creates a visible choice point, inserts a 3-minute creative mission, then asks for reflection and stores the session locally.

## Core Function
Interrupt an urge with one timed creative action before the user acts on impulse.

## Input / Processing / Output
### Input
- Urge type
- Urge intensity
- Energy
- Emotion
- Mission response
- Reflection note

### Processing
- Local rules engine selects a mission from emotion + urge + energy prompt pools
- 3-minute timer creates intentional friction
- Reflection computes urge reduction
- Session metrics are recalculated from persistent local data

### Output
- Visible choice point
- Mission prompt and timer
- Reflection prompt
- Updated progress metrics

## Back-End Architecture Notes
- Data needed: session records, counters, timestamps, mission response, reflection note
- Storage: browser `localStorage`
- Persistence: yes, on the same browser/device
- Memory between sessions: yes
- AI inference required: no
- API calls required: 0
- API failure fallback: local prompt banks keep the tool functional

## Behavior Integrity Check
- The interruption occurs immediately after the check-in
- The tool preserves user choice with `interrupt` or `skip`
- No shaming, surveillance, or hidden scoring is used
- Friction is intentional and minimal
- The build stays focused on one core loop

## Recording Checklist
- Show the system map
- Demonstrate a full check-in
- Pause on the visible choice point
- Start the mission and show the timer
- Submit a reflection
- Show updated stats

## PDF Export Notes
- Export this file and the README as PDF, or combine them into one PDF
- Paste the final deployed link and repo link before exporting
- Keep the screen recording under 2 minutes