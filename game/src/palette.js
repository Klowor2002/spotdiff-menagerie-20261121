// palette.js — shared drawing helpers for The Clockwork Menagerie.
// Seeded random, gradients, and small canvas utilities every scene uses,
// so both panels of a scene always paint pixel-identical pictures.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function nextRandom() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const INK = '#1d1420';
export const BRASS = '#c9973f';
export const BRASS_LIGHT = '#f0c96a';
export const BRASS_DARK = '#7d5a1e';
export const CREAM = '#f6ead2';
export const TEAL_DEEP = '#0e2a33';
export const RUBY = '#d6455b';
export const EMERALD = '#3fae7c';
export const SAPPHIRE = '#3f6fd8';
export const VIOLET = '#8a5fd0';

export function verticalGradient(ctx, x, y, w, h, stops) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  return g;
}

export function radialGlow(ctx, x, y, r, inner, outer) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function circle(ctx, x, y, r, fill, stroke, lineWidth) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth || 2; ctx.stroke(); }
}

export function roundedRect(ctx, x, y, w, h, r, fill, stroke, lineWidth) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth || 2; ctx.stroke(); }
}

export function star(ctx, x, y, r, fill) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

export function scatterStars(ctx, rng, w, h, count, maxY) {
  for (let i = 0; i < count; i++) {
    const x = rng() * w;
    const y = rng() * (maxY || h);
    const r = 0.8 + rng() * 1.6;
    ctx.globalAlpha = 0.35 + rng() * 0.6;
    star(ctx, x, y, r, '#ffe9b0');
  }
  ctx.globalAlpha = 1;
}

export function woodPlanks(ctx, rng, x, y, w, h, base, dark) {
  ctx.fillStyle = base;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = dark;
  ctx.lineWidth = 1.5;
  const step = 34;
  for (let px = x + step; px < x + w; px += step) {
    ctx.beginPath();
    ctx.moveTo(px, y);
    ctx.lineTo(px, y + h);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = '#000000';
  for (let i = 0; i < 26; i++) {
    const gy = y + (i * h) / 26 + rng() * 4;
    ctx.beginPath();
    ctx.moveTo(x, gy);
    ctx.bezierCurveTo(x + w * 0.3, gy + 3, x + w * 0.7, gy - 3, x + w, gy);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
