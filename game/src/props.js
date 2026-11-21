// props.js — the Menagerie's prop workshop: every reusable object a scene
// can place. Each painter takes a position and a size, draws in the shared
// brass-and-jewel style, and never uses unseeded randomness, so the left
// and right panels of a scene stay identical except at the differences.

import { circle, star, BRASS, BRASS_LIGHT, BRASS_DARK, CREAM, INK } from './palette.js';

export function gear(ctx, x, y, r, teeth, fill, missingTooth) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < teeth; i++) {
    if (i === missingTooth) continue;
    const a = (i / teeth) * Math.PI * 2;
    const tx = Math.cos(a) * r;
    const ty = Math.sin(a) * r;
    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(a);
    ctx.rect(-r * 0.16, -r * 0.16, r * 0.34, r * 0.32);
    ctx.restore();
  }
  ctx.fill();
  circle(ctx, 0, 0, r * 0.92, fill);
  circle(ctx, 0, 0, r * 0.92, null, BRASS_DARK, 2);
  circle(ctx, 0, 0, r * 0.42, '#2b1d12');
  circle(ctx, 0, 0, r * 0.42, null, BRASS_LIGHT, 2.5);
  circle(ctx, 0, 0, r * 0.14, BRASS);
  ctx.restore();
}

export function hangingLamp(ctx, x, yTop, drop, lit, hue) {
  ctx.strokeStyle = BRASS_DARK;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, yTop);
  ctx.lineTo(x, yTop + drop);
  ctx.stroke();
  const cy = yTop + drop + 16;
  if (lit) {
    const g = ctx.createRadialGradient(x, cy, 2, x, cy, 46);
    g.addColorStop(0, 'rgba(255,214,120,0.85)');
    g.addColorStop(1, 'rgba(255,214,120,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, cy, 46, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(x - 20, cy + 12);
  ctx.quadraticCurveTo(x, cy - 26, x + 20, cy + 12);
  ctx.closePath();
  ctx.fillStyle = hue;
  ctx.fill();
  ctx.strokeStyle = BRASS_DARK;
  ctx.lineWidth = 2;
  ctx.stroke();
  circle(ctx, x, cy + 10, 8, lit ? '#ffe9a8' : '#4a4238');
  circle(ctx, x, cy - 14, 3.5, BRASS);
}

export function bottle(ctx, x, y, w, h, liquid) {
  ctx.fillStyle = 'rgba(210,235,240,0.35)';
  ctx.strokeStyle = 'rgba(230,245,250,0.8)';
  ctx.lineWidth = 1.5;
  const nw = w * 0.36;
  ctx.beginPath();
  ctx.moveTo(x - nw / 2, y - h);
  ctx.lineTo(x + nw / 2, y - h);
  ctx.lineTo(x + nw / 2, y - h * 0.78);
  ctx.quadraticCurveTo(x + w / 2, y - h * 0.62, x + w / 2, y - h * 0.3);
  ctx.lineTo(x + w / 2, y);
  ctx.lineTo(x - w / 2, y);
  ctx.lineTo(x - w / 2, y - h * 0.3);
  ctx.quadraticCurveTo(x - w / 2, y - h * 0.62, x - nw / 2, y - h * 0.78);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = liquid;
  ctx.globalAlpha = 0.75;
  ctx.fillRect(x - w / 2 + 3, y - h * 0.45, w - 6, h * 0.45 - 3);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#8a5a2b';
  ctx.fillRect(x - nw / 2, y - h - 5, nw, 6);
}

export function jar(ctx, x, y, r, contents, lidColor) {
  circle(ctx, x, y, r, 'rgba(215,238,242,0.4)', 'rgba(235,248,250,0.85)', 1.5);
  ctx.fillStyle = contents;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.5;
    circle(ctx, x + Math.cos(a) * r * 0.45, y + Math.sin(a) * r * 0.4, r * 0.2, contents);
  }
  ctx.fillStyle = lidColor;
  ctx.fillRect(x - r * 0.8, y - r - 6, r * 1.6, 7);
}

export function wrench(ctx, x, y, len, angle, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = color;
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(len, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(len + 6, 0, 9, 0.7, Math.PI * 2 - 0.7);
  ctx.stroke();
  circle(ctx, 0, 0, 6, color);
  ctx.restore();
}

export function clockworkOwl(ctx, x, y, s, eyeColor) {
  ctx.fillStyle = '#6b4a2f';
  ctx.beginPath();
  ctx.ellipse(x, y, 26 * s, 32 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8a623d';
  ctx.beginPath();
  ctx.ellipse(x, y + 6 * s, 17 * s, 21 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(x + side * 14 * s, y - 26 * s);
    ctx.lineTo(x + side * 24 * s, y - 40 * s);
    ctx.lineTo(x + side * 26 * s, y - 20 * s);
    ctx.closePath();
    ctx.fillStyle = '#6b4a2f';
    ctx.fill();
    circle(ctx, x + side * 11 * s, y - 8 * s, 9.5 * s, CREAM, BRASS_DARK, 1.5);
    circle(ctx, x + side * 11 * s, y - 8 * s, 5 * s, eyeColor);
    circle(ctx, x + side * 11 * s, y - 8 * s, 2 * s, INK);
  }
  ctx.beginPath();
  ctx.moveTo(x - 4 * s, y + 3 * s);
  ctx.lineTo(x + 4 * s, y + 3 * s);
  ctx.lineTo(x, y + 9 * s);
  ctx.closePath();
  ctx.fillStyle = BRASS;
  ctx.fill();
  circle(ctx, x, y + 20 * s, 6 * s, BRASS, BRASS_DARK, 1.5);
}

export function mechBird(ctx, x, y, s, body, facing, crestFeathers) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing * s, s);
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(0, 0, 30, 20, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-24, 2);
  ctx.lineTo(-46, -12);
  ctx.lineTo(-42, 8);
  ctx.lineTo(-48, 16);
  ctx.lineTo(-22, 12);
  ctx.closePath();
  ctx.fillStyle = BRASS;
  ctx.fill();
  circle(ctx, 26, -12, 13, body);
  ctx.beginPath();
  ctx.moveTo(36, -12);
  ctx.lineTo(50, -8);
  ctx.lineTo(36, -4);
  ctx.closePath();
  ctx.fillStyle = BRASS_LIGHT;
  ctx.fill();
  circle(ctx, 29, -14, 3.4, INK);
  ctx.strokeStyle = BRASS_DARK;
  ctx.lineWidth = 2.4;
  for (let i = 0; i < crestFeathers; i++) {
    const a = -1.9 + i * 0.42;
    ctx.beginPath();
    ctx.moveTo(22, -22);
    ctx.quadraticCurveTo(22 + Math.cos(a) * 14, -22 + Math.sin(a) * 14, 22 + Math.cos(a) * 20, -22 + Math.sin(a) * 20);
    ctx.stroke();
    circle(ctx, 22 + Math.cos(a) * 20, -22 + Math.sin(a) * 20, 2.6, RUBY_DOT);
  }
  ctx.beginPath();
  ctx.ellipse(-2, 2, 16, 10, -0.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(20,16,28,0.35)';
  ctx.fill();
  ctx.restore();
}

const RUBY_DOT = '#d6455b';

export function birdCage(ctx, x, y, w, h, doorOpen) {
  ctx.strokeStyle = BRASS;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y + h);
  ctx.lineTo(x - w / 2, y + h * 0.3);
  ctx.quadraticCurveTo(x, y - h * 0.25, x + w / 2, y + h * 0.3);
  ctx.lineTo(x + w / 2, y + h);
  ctx.stroke();
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(x + (i * w) / 5, y + h * (0.28 - Math.abs(i) * 0.045));
    ctx.lineTo(x + (i * w) / 5, y + h);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y + h * 0.62);
  ctx.lineTo(x + w / 2, y + h * 0.62);
  ctx.stroke();
  ctx.fillStyle = BRASS_DARK;
  ctx.fillRect(x - w / 2 - 4, y + h, w + 8, 6);
  circle(ctx, x, y - h * 0.22, 5, BRASS);
  ctx.save();
  ctx.translate(x + w * 0.08, y + h * 0.66);
  if (doorOpen) ctx.rotate(-0.9);
  ctx.strokeStyle = BRASS_LIGHT;
  ctx.lineWidth = 2;
  ctx.strokeRect(-w * 0.16, 0, w * 0.32, h * 0.3);
  ctx.restore();
}

export function flower(ctx, x, y, s, petal, center) {
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(a) * 8 * s, y + Math.sin(a) * 8 * s, 7.5 * s, 4.6 * s, a, 0, Math.PI * 2);
    ctx.fillStyle = petal;
    ctx.fill();
  }
  circle(ctx, x, y, 5 * s, center, BRASS_DARK, 1);
}

export function leafyBranch(ctx, x, y, len, angle, leafColor, leafCount) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = '#4a3220';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(len * 0.5, -14, len, -4);
  ctx.stroke();
  ctx.lineWidth = 3.4;
  for (let i = 0; i < leafCount; i++) {
    const t = 0.18 + (i / leafCount) * 0.78;
    const bx = len * t;
    const by = -14 * 2 * t * (1 - t) - 4 * t * t + 0;
    const dir = i % 2 === 0 ? -1 : 1;
    ctx.strokeStyle = '#4a3220';
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + 10, by + dir * 14);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(bx + 15, by + dir * 20, 11, 5.6, dir * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = leafColor;
    ctx.fill();
  }
  ctx.restore();
}

export function mechFish(ctx, x, y, s, body, facing, stripeCount, lanternOn) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing * s, s);
  const grad = ctx.createLinearGradient(0, -18, 0, 18);
  grad.addColorStop(0, body);
  grad.addColorStop(1, '#10131f');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 34, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-30, 0);
  ctx.lineTo(-50, -14);
  ctx.lineTo(-50, 14);
  ctx.closePath();
  ctx.fillStyle = BRASS;
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 0, 34, 18, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = 'rgba(246,234,210,0.75)';
  for (let i = 0; i < stripeCount; i++) {
    const sx = -16 + i * 13;
    ctx.fillRect(sx, -18, 5.5, 36);
  }
  ctx.restore();
  ctx.beginPath();
  ctx.moveTo(-2, -16);
  ctx.quadraticCurveTo(8, -28, 18, -17);
  ctx.closePath();
  ctx.fillStyle = BRASS;
  ctx.fill();
  circle(ctx, 20, -4, 4.6, CREAM);
  circle(ctx, 20, -4, 2.3, INK);
  if (lanternOn !== undefined) {
    ctx.strokeStyle = BRASS_LIGHT;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(28, -10);
    ctx.quadraticCurveTo(40, -22, 46, -18);
    ctx.stroke();
    if (lanternOn) {
      const g = ctx.createRadialGradient(47, -16, 1, 47, -16, 20);
      g.addColorStop(0, 'rgba(160,255,230,0.9)');
      g.addColorStop(1, 'rgba(160,255,230,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(47, -16, 20, 0, Math.PI * 2);
      ctx.fill();
    }
    circle(ctx, 47, -16, 3.6, lanternOn ? '#b8ffe9' : '#39585a');
  }
  ctx.restore();
}

export function coral(ctx, x, y, s, color, branches) {
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  for (let i = 0; i < branches; i++) {
    const spread = (i - (branches - 1) / 2) * 0.34;
    ctx.lineWidth = 6 - Math.abs(i - (branches - 1) / 2);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + spread * 30 * s, y - 26 * s, x + spread * 52 * s, y - 46 * s);
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + spread * 30 * s, y - 26 * s);
    ctx.lineTo(x + spread * 52 * s + 8 * s, y - 58 * s);
    ctx.stroke();
  }
}

export function seaweed(ctx, x, y, h, color, strands) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  for (let i = 0; i < strands; i++) {
    const bx = x + i * 11;
    ctx.beginPath();
    ctx.moveTo(bx, y);
    ctx.bezierCurveTo(bx - 9, y - h * 0.35, bx + 9, y - h * 0.65, bx - 4, y - h);
    ctx.stroke();
  }
}

export function bubbles(ctx, rng, x, y, w, h, count) {
  ctx.strokeStyle = 'rgba(200,240,255,0.55)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < count; i++) {
    const bx = x + rng() * w;
    const by = y + rng() * h;
    const r = 1.6 + rng() * 3.6;
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export function paperLantern(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 0.78, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = 'rgba(60,30,10,0.45)';
  ctx.lineWidth = 1.4;
  for (const off of [-0.5, 0, 0.5]) {
    ctx.beginPath();
    ctx.ellipse(x, y, r * Math.cos(off * 0.9), r * 0.78, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = BRASS_DARK;
  ctx.fillRect(x - r * 0.3, y - r * 0.78 - 5, r * 0.6, 5);
  ctx.fillRect(x - r * 0.3, y + r * 0.78, r * 0.6, 5);
  const g = ctx.createRadialGradient(x, y, 1, x, y, r * 1.7);
  g.addColorStop(0, 'rgba(255,190,90,0.28)');
  g.addColorStop(1, 'rgba(255,190,90,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r * 1.7, 0, Math.PI * 2);
  ctx.fill();
}

export function pennant(ctx, x, y, w, color) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w / 2, y + w * 0.72);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = 'rgba(30,18,8,0.5)';
  ctx.lineWidth = 1.4;
  ctx.stroke();
}

export function moonCrescent(ctx, x, y, r, full) {
  circle(ctx, x, y, r, '#f7e7bd');
  if (!full) {
    circle(ctx, x + r * 0.42, y - r * 0.2, r * 0.82, '#16283e');
  }
}

export function sparkleStar(ctx, x, y, r, color) {
  star(ctx, x, y, r, color);
}
