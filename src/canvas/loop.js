// Animation loop: draws a dot whose radius is controlled by state.signal
// Animation loop: draws a dot whose radius is controlled by state.signal
// Now with a funny bounce animation
export function startLoop(ctx, state) {
  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, 400, 400);
    ctx.save();
    // Bouncing effect: dot moves up and down with a sine wave
    const bounce = Math.sin(t * 2) * 60 * state.signal;
    ctx.translate(200, 200 + bounce);
    ctx.beginPath();
    ctx.arc(0, 0, 40 + state.signal * 60, 0, Math.PI * 2);
    ctx.fillStyle = '#6a8cff';
    ctx.shadowColor = '#ffe066';
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.restore();
    t += 0.025 + state.signal * 0.03;
    requestAnimationFrame(draw);
  }
  draw();
}
// Annotated: This loop visualizes the signal as a pulsing, bouncing dot.
