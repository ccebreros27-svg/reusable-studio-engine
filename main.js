// Entry point: wires together canvas setup, loop, and input
import { setupCanvas } from './src/canvas/setupCanvas.js';
import { startLoop } from './src/canvas/loop.js';
import { setupInput } from './src/input/input.js';

const canvas = document.getElementById('main-canvas');
const ctx = setupCanvas(canvas);
const state = { signal: 0 };
setupInput(canvas, state);
startLoop(ctx, state);

// Annotated: This file connects the engine parts and starts the sketch.
