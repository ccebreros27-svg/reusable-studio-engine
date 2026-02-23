// Captures mouse X position as signal (0 to 1)
export function setupInput(canvas, state) {
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    state.signal = (e.clientX - rect.left) / rect.width;
  });
}
// Annotated: Maps mouse X to a normalized signal for the sketch.
