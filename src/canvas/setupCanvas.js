// Sets up a HiDPI canvas and returns the 2D context
export function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = 400 * dpr;
  canvas.height = 400 * dpr;
  canvas.style.width = '400px';
  canvas.style.height = '400px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}
// Annotated: Ensures crisp rendering on retina displays.
