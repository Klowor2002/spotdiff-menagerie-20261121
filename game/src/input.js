// input.js — pointing and keys. A click on either panel counts (the two
// pictures are one hunt), coordinates are mapped from the displayed size
// back to the painted panel size, and the keyboard drives the rest:
// H a hint, P pause, R retry the scene, Enter to begin or move on.

import { PANEL_W, PANEL_H } from './scenes.js';

export function panelPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * PANEL_W;
  const y = ((event.clientY - rect.top) / rect.height) * PANEL_H;
  return { x, y };
}

export function attachInput(canvases, handlers) {
  for (const canvas of canvases) {
    canvas.addEventListener('pointerdown', (event) => {
      const p = panelPoint(canvas, event);
      handlers.onPoint(p.x, p.y);
    });
  }
  window.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key.toLowerCase();
    if (key === 'h') handlers.onHint();
    else if (key === 'p') handlers.onPause();
    else if (key === 'r') handlers.onRetry();
    else if (key === 'enter' || key === ' ') handlers.onAdvance();
    else return;
    event.preventDefault();
  });
}
