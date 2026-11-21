// scenes.js — the four rooms of The Clockwork Menagerie, painted fresh on
// canvas every game. Each scene painter receives `alt`, the set of
// difference ids switched on for the right-hand panel: it draws the plain
// room when the set is empty and the altered room when it is full, and the
// two passes differ ONLY at the listed difference spots. All scatter uses
// a seeded rng consumed in a fixed order, so nothing else can drift.

import {
  mulberry32, verticalGradient, radialGlow, circle, roundedRect, star,
  scatterStars, woodPlanks, INK, BRASS, BRASS_LIGHT, BRASS_DARK, CREAM,
  RUBY, EMERALD, SAPPHIRE, VIOLET,
} from './palette.js';
import {
  gear, hangingLamp, bottle, jar, wrench, clockworkOwl, mechBird, birdCage,
  flower, leafyBranch, mechFish, coral, seaweed, bubbles, paperLantern,
  pennant, moonCrescent,
} from './props.js';

export const PANEL_W = 596;
export const PANEL_H = 640;

function drawButterfly(ctx, x, y, s, wing) {
  ctx.fillStyle = wing;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(x + side * 10 * s, y - 4 * s, 10 * s, 6.4 * s, side * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + side * 8 * s, y + 6 * s, 7.6 * s, 5 * s, side * -0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = INK;
  ctx.lineWidth = 2.4 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, y - 7 * s);
  ctx.lineTo(x, y + 8 * s);
  ctx.stroke();
}

function drawStarfish(ctx, x, y, r, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / 5;
    const bx = Math.cos(a) * r * 0.95;
    const by = Math.sin(a) * r * 0.95;
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(Math.cos(a + 0.32) * r * 0.5, Math.sin(a + 0.32) * r * 0.5, bx, by);
    ctx.quadraticCurveTo(Math.cos(a - 0.32) * r * 0.5, Math.sin(a - 0.32) * r * 0.5, 0, 0);
  }
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  for (let i = 0; i < 6; i++) circle(ctx, (i % 3 - 1) * r * 0.3, ((i / 3) | 0) * r * 0.3 - r * 0.15, r * 0.07, 'rgba(255,255,255,0.55)');
  ctx.restore();
}

function drawTreasureChest(ctx, x, y, open) {
  ctx.fillStyle = '#5d3a1a';
  ctx.fillRect(x - 44, y - 6, 88, 34);
  ctx.fillStyle = '#6f4620';
  if (open) {
    ctx.save();
    ctx.translate(x - 44, y - 6);
    ctx.rotate(-0.62);
    ctx.fillRect(0, -24, 88, 24);
    ctx.fillStyle = BRASS_DARK;
    ctx.fillRect(0, -24, 88, 5);
    ctx.restore();
    const g = ctx.createRadialGradient(x, y - 8, 2, x, y - 8, 42);
    g.addColorStop(0, 'rgba(255,215,110,0.95)');
    g.addColorStop(1, 'rgba(255,215,110,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y - 8, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd76e';
    for (let i = 0; i < 7; i++) circle(ctx, x - 30 + i * 10, y - 10 - (i % 3) * 4, 5.5, '#ffd76e', '#a87c1e', 1);
  } else {
    ctx.beginPath();
    ctx.arc(x, y - 6, 44, Math.PI, 0);
    ctx.fillStyle = '#6f4620';
    ctx.fill();
  }
  ctx.fillStyle = BRASS_DARK;
  ctx.fillRect(x - 44, y - 6, 88, 5);
  ctx.fillRect(x - 6, y - 26, 12, 54);
  circle(ctx, x, y + 6, 6, BRASS_LIGHT, BRASS_DARK, 1.5);
}

function drawFirework(ctx, x, y, r, color, seed) {
  const rng = mulberry32(seed);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.6;
  ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + rng() * 0.2;
    const len = r * (0.62 + rng() * 0.38);
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * r * 0.2, y + Math.sin(a) * r * 0.2);
    ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    ctx.stroke();
    circle(ctx, x + Math.cos(a) * len, y + Math.sin(a) * len, 2.2, color);
  }
}

// ---------------------------------------------------------------- Scene 1
function paintWorkshop(ctx, alt) {
  const rng = mulberry32(1101);
  verticalGradient(ctx, 0, 0, PANEL_W, PANEL_H, [[0, '#40260f'], [0.7, '#2c1a0b'], [1, '#201205']]);

  // window with the moon (difference 4: crescent becomes full)
  roundedRect(ctx, 46, 40, 168, 196, 10, '#16283e', BRASS_DARK, 5);
  ctx.save();
  roundedRect(ctx, 52, 46, 156, 184, 8, null);
  ctx.clip();
  verticalGradient(ctx, 52, 46, 156, 184, [[0, '#1d3a5f'], [1, '#0d1c30']]);
  scatterStars(ctx, rng, 150, 170, 12, 170);
  moonCrescent(ctx, 108, 108, 27, alt.has(4));
  ctx.restore();
  ctx.strokeStyle = BRASS_DARK;
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(130, 44); ctx.lineTo(130, 232); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(50, 138); ctx.lineTo(210, 138); ctx.stroke();

  // wall gears (difference 2: the big gear loses a tooth)
  gear(ctx, 300, 96, 30, 8, '#8a6a3a', -1);
  gear(ctx, 432, 122, 55, 9, BRASS, alt.has(2) ? 3 : -1);
  gear(ctx, 524, 206, 34, 8, '#a86f3c', -1);
  gear(ctx, 366, 196, 23, 7, '#8a6a3a', -1);

  // hanging lamps (difference 1: the middle lamp goes dark)
  hangingLamp(ctx, 168, 0, 44, true, '#b8452e');
  hangingLamp(ctx, 246, 0, 70, !alt.has(1), '#2e7d6b');
  hangingLamp(ctx, 492, 0, 36, true, '#37548f');

  // pinned blueprints
  for (const [bx, by, rot] of [[248, 268, -0.05], [316, 282, 0.04]]) {
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(rot);
    ctx.fillStyle = '#d9e4ea';
    ctx.fillRect(-34, -26, 68, 52);
    ctx.strokeStyle = '#7d99ad';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(-26, -18, 52, 36);
    circle(ctx, 0, 0, 10, null, '#7d99ad', 1.4);
    ctx.beginPath(); ctx.moveTo(-26, 8); ctx.lineTo(26, 8); ctx.stroke();
    ctx.restore();
  }

  // shelf with bottles and jars (difference 3: green liquid turns violet)
  ctx.fillStyle = '#5d3a1a';
  ctx.fillRect(344, 306, 226, 12);
  ctx.fillRect(344, 318, 10, 26);
  ctx.fillRect(560, 318, 10, 26);
  bottle(ctx, 384, 306, 30, 74, alt.has(3) ? '#9a5fd0' : '#3fae7c');
  bottle(ctx, 430, 306, 26, 58, '#e8a33c');
  jar(ctx, 478, 282, 21, '#d6455b', BRASS);
  bottle(ctx, 528, 306, 30, 80, '#3f6fd8');

  // the clockwork owl on its perch (difference 0: amber eyes turn ruby)
  ctx.strokeStyle = '#4a3220';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(28, 372); ctx.lineTo(196, 360); ctx.stroke();
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(52, 368); ctx.lineTo(38, 416); ctx.stroke();
  clockworkOwl(ctx, 112, 322, 1.05, alt.has(0) ? '#ff4d6d' : '#ffb340');

  // workbench and its tools (difference 5: the wrench vanishes)
  woodPlanks(ctx, rng, 30, 448, 536, 26, '#7a4d22', '#5d3a1a');
  ctx.fillStyle = '#4a2c10';
  ctx.fillRect(44, 474, 16, 66);
  ctx.fillRect(536, 474, 16, 66);
  if (!alt.has(5)) wrench(ctx, 128, 436, 44, -0.35, '#b9c2cc');
  gear(ctx, 268, 434, 17, 7, BRASS, -1);
  gear(ctx, 306, 438, 12, 6, '#a86f3c', -1);
  ctx.fillStyle = '#c94f38';
  roundedRect(ctx, 420, 420, 34, 26, 5, '#c94f38');
  ctx.fillStyle = CREAM;
  ctx.fillRect(428, 414, 18, 7);
  ctx.fillStyle = '#31435f';
  ctx.fillRect(478, 428, 52, 20);
  ctx.fillStyle = BRASS_LIGHT;
  ctx.fillRect(478, 428, 52, 5);

  // floor and rug
  verticalGradient(ctx, 0, 540, PANEL_W, 100, [[0, '#33200e'], [1, '#1c1006']]);
  ctx.beginPath();
  ctx.ellipse(298, 592, 190, 34, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#71323c';
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(298, 592, 158, 24, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#8a4250';
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(298, 592, 96, 14, 0, 0, Math.PI * 2);
  ctx.fillStyle = BRASS;
  ctx.fill();
}

// ---------------------------------------------------------------- Scene 2
function paintAviary(ctx, alt) {
  const rng = mulberry32(2202);
  verticalGradient(ctx, 0, 0, PANEL_W, PANEL_H, [[0, '#bfe6dd'], [0.45, '#8fd0c2'], [1, '#4d8a6d']]);
  radialGlow(ctx, 500, 92, 130, 'rgba(255,236,170,0.95)', 'rgba(255,236,170,0)');
  circle(ctx, 500, 92, 34, '#ffedb5', '#e8c96a', 3);

  // the glass dome
  ctx.strokeStyle = 'rgba(240,252,255,0.75)';
  ctx.lineWidth = 3;
  for (const r of [210, 300, 392]) {
    ctx.beginPath();
    ctx.arc(298, 648, r, Math.PI, 0);
    ctx.stroke();
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(240,252,255,0.42)';
  for (const a of [0.35, 0.7, 1.05, 1.4, 1.75, 2.1, 2.45, 2.8]) {
    ctx.beginPath();
    ctx.moveTo(298 + Math.cos(a) * 392, 648 - Math.sin(a) * 392);
    ctx.lineTo(298, 648);
    ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(240,252,255,0.75)';

  // branches and birds (difference 0: the left bird turns around;
  // difference 5: the middle bird loses a crest feather)
  leafyBranch(ctx, 30, 148, 250, -0.06, '#2e7d4f', 7);
  leafyBranch(ctx, 566, 108, 210, Math.PI + 0.12, '#35945e', 6);
  leafyBranch(ctx, 232, 284, 216, -0.13, '#2e7d4f', 5);
  mechBird(ctx, 152, 128, 1, '#3f6fd8', alt.has(0) ? -1 : 1, 3);
  mechBird(ctx, 332, 246, 1.1, '#d6455b', 1, alt.has(5) ? 2 : 3);
  mechBird(ctx, 472, 138, 0.92, '#3fae7c', -1, 3);

  // a feeder tray on a pole and a hanging basket fill the middle air
  ctx.strokeStyle = '#4a3220';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(150, 556); ctx.lineTo(150, 452); ctx.stroke();
  ctx.fillStyle = '#8a623d';
  ctx.beginPath();
  ctx.ellipse(150, 450, 40, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e8a33c';
  for (let i = 0; i < 6; i++) circle(ctx, 128 + i * 9, 446, 3.4, '#e8a33c');
  mechBird(ctx, 196, 430, 0.6, '#8a5fd0', -1, 2);
  ctx.strokeStyle = 'rgba(74,50,32,0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(428, 300); ctx.lineTo(452, 348); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(476, 300); ctx.lineTo(452, 348); ctx.stroke();
  ctx.fillStyle = '#a86f3c';
  ctx.beginPath();
  ctx.ellipse(452, 356, 27, 12, 0, 0, Math.PI);
  ctx.fill();
  flower(ctx, 438, 344, 0.85, '#e86a92', '#ffd76e');
  flower(ctx, 458, 340, 0.85, '#f0a83e', '#fff3c9');
  flower(ctx, 470, 348, 0.8, '#e84f7d', '#ffd76e');

  // a spare leafy spray (difference 6: half its leaves are gone)
  leafyBranch(ctx, 420, 66, 120, 0.5, '#2e7d4f', alt.has(6) ? 3 : 6);

  // hanging cages (difference 1: the left cage door swings open)
  ctx.strokeStyle = BRASS_DARK;
  ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.moveTo(96, 236); ctx.lineTo(96, 268); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(486, 262); ctx.lineTo(486, 292); ctx.stroke();
  birdCage(ctx, 96, 268, 88, 118, alt.has(1));
  birdCage(ctx, 486, 292, 72, 96, false);
  mechBird(ctx, 486, 348, 0.55, '#e8a33c', 1, 2);

  // the nest (difference 7: a third egg appears)
  circle(ctx, 240, 296, 8.5, '#ffe9f2');
  circle(ctx, 258, 293, 8.5, '#d9ecff');
  if (alt.has(7)) circle(ctx, 249, 303, 8, '#fff3c9');
  ctx.fillStyle = '#6b4a2f';
  ctx.beginPath();
  ctx.ellipse(252, 310, 25, 12, 0, 0, Math.PI);
  ctx.fill();
  ctx.strokeStyle = '#543820';
  ctx.lineWidth = 2.4;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(232 + i * 6, 302 + (i % 2) * 3);
    ctx.lineTo(246 + i * 7, 312 + (i % 2) * 2);
    ctx.stroke();
  }

  // the butterfly (difference 3: it is simply not there)
  if (!alt.has(3)) drawButterfly(ctx, 522, 118, 1.15, VIOLET);
  drawButterfly(ctx, 70, 470, 0.9, RUBY);
  drawButterfly(ctx, 306, 428, 0.72, '#2ec4b6');

  // flower beds (difference 2: the big bloom turns orange)
  ctx.fillStyle = '#2c5c40';
  ctx.fillRect(0, 556, PANEL_W, 84);
  const bed = [[40, 584], [86, 606], [140, 578], [196, 610], [470, 596], [528, 578], [560, 612]];
  for (const [fx, fy] of bed) flower(ctx, fx, fy, 0.9, '#e86a92', '#ffd76e');
  flower(ctx, 420, 540, 1.5, alt.has(2) ? '#f08c2e' : '#e84f7d', '#fff3c9');
  flower(ctx, 356, 596, 1.05, '#8a5fd0', '#ffd76e');

  // the fountain (difference 4: one of its three arcs stops)
  ctx.fillStyle = '#7d99ad';
  ctx.beginPath();
  ctx.ellipse(298, 588, 86, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#a9c6d4';
  ctx.beginPath();
  ctx.ellipse(298, 584, 70, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7d99ad';
  ctx.fillRect(290, 528, 16, 52);
  circle(ctx, 298, 522, 11, BRASS);
  ctx.strokeStyle = 'rgba(220,245,255,0.9)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  const arcs = alt.has(4) ? [-0.65, 0.65] : [-0.65, 0, 0.65];
  for (const off of arcs) {
    ctx.beginPath();
    ctx.moveTo(298, 516);
    ctx.quadraticCurveTo(298 + off * 90, 470, 298 + off * 130, 576);
    ctx.stroke();
  }
  scatterStars(ctx, rng, PANEL_W, 60, 4, 60);
}

// ---------------------------------------------------------------- Scene 3
function drawSquid(ctx, x, y, s) {
  ctx.fillStyle = '#c77fb8';
  ctx.beginPath();
  ctx.ellipse(x, y - 6 * s, 13 * s, 16 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c77fb8';
  ctx.lineWidth = 3.4 * s;
  ctx.lineCap = 'round';
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(x + i * 5 * s, y + 6 * s);
    ctx.quadraticCurveTo(x + i * 6 * s, y + 18 * s, x + i * 8 * s, y + 24 * s);
    ctx.stroke();
  }
  circle(ctx, x - 5 * s, y - 8 * s, 2.4 * s, INK);
  circle(ctx, x + 5 * s, y - 8 * s, 2.4 * s, INK);
}

function drawGhostFish(ctx, x, y, s, facing) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing * s, s);
  ctx.fillStyle = 'rgba(8,36,48,0.6)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 36, 17, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-32, 0);
  ctx.lineTo(-52, -13);
  ctx.lineTo(-52, 13);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-2, -15);
  ctx.quadraticCurveTo(9, -27, 19, -16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawPorthole(ctx, x, y, r, view) {
  circle(ctx, x, y, r + 9, BRASS_DARK);
  circle(ctx, x, y, r + 5, BRASS);
  ctx.save();
  circle(ctx, x, y, r, '#0d3242');
  ctx.clip();
  verticalGradient(ctx, x - r, y - r, r * 2, r * 2, [[0, '#1b5a74'], [1, '#08222e']]);
  if (view === 'moon') moonCrescent(ctx, x + 6, y - 6, r * 0.42, false);
  if (view === 'squid') drawSquid(ctx, x, y, r / 34);
  if (view === 'fish') mechFish(ctx, x + 2, y + 4, 0.62, '#e8a33c', 1, 3, undefined);
  ctx.restore();
  ctx.fillStyle = BRASS_LIGHT;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    circle(ctx, x + Math.cos(a) * (r + 5), y + Math.sin(a) * (r + 5), 2.6, BRASS_LIGHT);
  }
}

function paintAquarium(ctx, alt) {
  const rng = mulberry32(3303);
  verticalGradient(ctx, 0, 0, PANEL_W, PANEL_H, [[0, '#0a3542'], [0.55, '#072733'], [1, '#04161d']]);

  // light rays from the surface
  ctx.fillStyle = 'rgba(150,220,240,0.07)';
  for (const [rx, rw] of [[90, 60], [250, 84], [430, 66]]) {
    ctx.beginPath();
    ctx.moveTo(rx, 0);
    ctx.lineTo(rx + rw, 0);
    ctx.lineTo(rx + rw + 60, PANEL_H);
    ctx.lineTo(rx + 30, PANEL_H);
    ctx.closePath();
    ctx.fill();
  }
  bubbles(ctx, rng, 20, 60, 556, 420, 30);

  // the works behind the glass: two great drowned gears, turning nowhere,
  // and the silhouettes of fish that are not part of the hunt
  ctx.save();
  ctx.globalAlpha = 0.09;
  gear(ctx, 482, 442, 98, 10, '#c9973f', -1);
  ctx.globalAlpha = 0.07;
  gear(ctx, 84, 176, 58, 9, '#c9973f', -1);
  ctx.restore();
  drawGhostFish(ctx, 118, 252, 0.95, 1);
  drawGhostFish(ctx, 516, 486, 1.15, -1);
  drawGhostFish(ctx, 336, 158, 0.7, 1);

  // pipes and the valve (difference 4: the red wheel turns brass)
  ctx.fillStyle = '#274b57';
  ctx.fillRect(24, 0, 17, PANEL_H);
  ctx.fillRect(0, 196, PANEL_W, 15);
  ctx.fillStyle = '#315d6b';
  ctx.fillRect(24, 0, 5, PANEL_H);
  ctx.fillRect(0, 196, PANEL_W, 4);
  ctx.fillStyle = '#1d3d47';
  for (const jx of [150, 300, 450]) ctx.fillRect(jx, 192, 9, 23);
  ctx.fillRect(540, 0, 13, 196);
  ctx.fillStyle = '#315d6b';
  ctx.fillRect(540, 0, 4, 196);
  ctx.save();
  ctx.translate(52, 300);
  ctx.strokeStyle = alt.has(4) ? BRASS : RUBY;
  ctx.lineWidth = 6;
  circle(ctx, 0, 0, 19, null, alt.has(4) ? BRASS : RUBY, 6);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * 19, Math.sin(a) * 19);
    ctx.stroke();
  }
  ctx.restore();
  circle(ctx, 52, 300, 5, BRASS_DARK);

  // portholes (difference 7: the middle one's moon becomes a squid)
  drawPorthole(ctx, 128, 108, 42, 'fish');
  drawPorthole(ctx, 310, 88, 46, alt.has(7) ? 'squid' : 'moon');
  drawPorthole(ctx, 492, 108, 42, 'moon');

  // the great clockwork fish (difference 0: it loses a stripe)
  mechFish(ctx, 252, 306, 1.55, '#2e8f86', 1, alt.has(0) ? 3 : 4, undefined);
  mechFish(ctx, 128, 470, 0.78, '#3f6fd8', 1, 3, undefined);
  mechFish(ctx, 196, 506, 0.62, '#8a5fd0', 1, 2, undefined);
  // difference 5: the little amber fish is gone
  if (!alt.has(5)) mechFish(ctx, 472, 428, 0.8, '#e8a33c', -1, 3, undefined);
  // the lantern fish (difference 9: its light goes out)
  mechFish(ctx, 448, 226, 1.0, '#37548f', -1, 2, !alt.has(9));

  // one dense bubble cluster (difference 2: the cluster is not there)
  if (!alt.has(2)) {
    ctx.strokeStyle = 'rgba(200,240,255,0.8)';
    ctx.lineWidth = 1.6;
    for (const [bx, by, br] of [[512, 268, 6], [526, 288, 4.4], [506, 300, 3.4], [522, 318, 5.4], [534, 262, 3], [498, 282, 2.6]]) {
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // the sea floor
  verticalGradient(ctx, 0, 566, PANEL_W, 74, [[0, '#8a7648'], [1, '#5d4c2a']]);
  ctx.fillStyle = '#6d5c36';
  for (const [rx, ry, rr] of [[60, 596, 26], [210, 610, 18], [540, 600, 30]]) {
    ctx.beginPath();
    ctx.ellipse(rx, ry, rr, rr * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // corals (difference 6: the teal coral turns magenta)
  coral(ctx, 92, 622, 1.1, alt.has(6) ? '#d84f9e' : '#2ec4b6', 5);
  coral(ctx, 508, 628, 0.95, '#f08c2e', 4);
  // seaweed (difference 8: one strand is missing)
  seaweed(ctx, 330, 634, 92, '#2e9e5b', alt.has(8) ? 4 : 5);
  seaweed(ctx, 428, 634, 64, '#27824c', 3);
  seaweed(ctx, 52, 634, 74, '#27824c', 3);
  // shells resting in the sand
  for (const [sx, sy, ss] of [[238, 620, 1], [272, 626, 0.75], [486, 560, 0.85]]) {
    ctx.fillStyle = '#e8b4c4';
    ctx.beginPath();
    ctx.arc(sx, sy, 9 * ss, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,60,80,0.6)';
    ctx.lineWidth = 1.3;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + i * 3.4 * ss, sy - 8.4 * ss);
      ctx.stroke();
    }
  }
  // the treasure chest (difference 1: it stands open, glowing)
  drawTreasureChest(ctx, 402, 592, alt.has(1));
  // the starfish (difference 3: orange turns pink)
  drawStarfish(ctx, 152, 592, 21, alt.has(3) ? '#f2a0c4' : '#f08c2e');
}

// ---------------------------------------------------------------- Scene 4
function drawCarouselAnimal(ctx, kind, x, y, altFlags) {
  ctx.strokeStyle = BRASS_DARK;
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(x, y - 58); ctx.lineTo(x, y + 44); ctx.stroke();
  ctx.strokeStyle = BRASS_LIGHT;
  ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(x - 2, y - 58); ctx.lineTo(x - 2, y + 44); ctx.stroke();
  if (kind === 'horse') {
    ctx.fillStyle = '#e8e2d4';
    ctx.beginPath(); ctx.ellipse(x, y + 6, 34, 20, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x + 34, y - 14, 13, 10, 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#e8e2d4'; ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x + 24, y - 4); ctx.lineTo(x + 33, y - 12); ctx.stroke();
    ctx.strokeStyle = '#8a7a5c'; ctx.lineWidth = 4;
    for (const lx of [-20, -8, 12, 24]) {
      ctx.beginPath(); ctx.moveTo(x + lx, y + 20); ctx.lineTo(x + lx + 3, y + 42); ctx.stroke();
    }
    ctx.fillStyle = '#5d4a33';
    ctx.beginPath(); ctx.moveTo(x - 32, y - 6); ctx.quadraticCurveTo(x - 46, y + 8, x - 36, y + 22); ctx.lineTo(x - 26, y + 10); ctx.closePath(); ctx.fill();
    // difference 1: the saddle changes from ruby to sapphire
    roundedRect(ctx, x - 13, y - 10, 27, 17, 4, altFlags.saddle ? SAPPHIRE : RUBY, BRASS, 2);
  }
  if (kind === 'rabbit') {
    ctx.fillStyle = '#dfe6ee';
    ctx.beginPath(); ctx.ellipse(x, y + 10, 24, 19, 0, 0, Math.PI * 2); ctx.fill();
    circle(ctx, x + 20, y - 6, 12, '#dfe6ee');
    for (const tilt of [-0.16, 0.14]) {
      ctx.save();
      ctx.translate(x + 16, y - 14);
      ctx.rotate(tilt);
      ctx.beginPath(); ctx.ellipse(0, -17, 5.4, 18, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#dfe6ee'; ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, -17, 2.4, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#f2a0c4'; ctx.fill();
      ctx.restore();
    }
    circle(ctx, x + 23, y - 8, 2.4, INK);
    // difference 2: the ribbon on the left ear is gone
    if (!altFlags.ribbonGone) {
      ctx.fillStyle = RUBY;
      ctx.beginPath();
      ctx.moveTo(x + 8, y - 30);
      ctx.lineTo(x + 1, y - 38);
      ctx.lineTo(x + 4, y - 24);
      ctx.lineTo(x - 3, y - 22);
      ctx.closePath(); ctx.fill();
    }
  }
  if (kind === 'fox') {
    ctx.fillStyle = '#e07f35';
    ctx.beginPath(); ctx.ellipse(x, y + 8, 27, 17, 0, 0, Math.PI * 2); ctx.fill();
    circle(ctx, x + 24, y - 4, 12, '#e07f35');
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(x + 16 + s * 2, y - 12);
      ctx.lineTo(x + 20 + s * 5, y - 26);
      ctx.lineTo(x + 26 + s * 3, y - 11);
      ctx.closePath(); ctx.fill();
    }
    circle(ctx, x + 27, y - 6, 2.4, INK);
    // the great tail (difference 9: its cream tip turns orange)
    ctx.beginPath();
    ctx.moveTo(x - 22, y + 2);
    ctx.quadraticCurveTo(x - 52, y - 8, x - 46, y + 22);
    ctx.quadraticCurveTo(x - 34, y + 32, x - 20, y + 20);
    ctx.closePath();
    ctx.fillStyle = '#e07f35'; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 46, y + 22);
    ctx.quadraticCurveTo(x - 50, y + 8, x - 42, y - 2);
    ctx.quadraticCurveTo(x - 36, y + 10, x - 34, y + 24);
    ctx.quadraticCurveTo(x - 40, y + 28, x - 46, y + 22);
    ctx.closePath();
    ctx.fillStyle = altFlags.tailTip ? '#e07f35' : CREAM; ctx.fill();
  }
  if (kind === 'peacock') {
    // the tail fan (difference 5: two of its five eyes close)
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI * 0.82 + (i / 4) * Math.PI * 0.64;
      const fx = x - 6 + Math.cos(a) * 40;
      const fy = y + 4 + Math.sin(a) * 40;
      ctx.strokeStyle = '#2e8f86';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x - 6, y + 6); ctx.lineTo(fx, fy); ctx.stroke();
      const showEye = !altFlags.eyesClosed || i % 2 === 0;
      if (showEye) {
        ctx.beginPath(); ctx.ellipse(fx, fy, 7.4, 10, a + Math.PI / 2, 0, Math.PI * 2);
        ctx.fillStyle = '#2e8f86'; ctx.fill();
        circle(ctx, fx, fy, 3.4, SAPPHIRE);
      }
    }
    ctx.fillStyle = '#2b5ea7';
    ctx.beginPath(); ctx.ellipse(x + 8, y + 8, 19, 13, 0, 0, Math.PI * 2); ctx.fill();
    circle(ctx, x + 24, y - 6, 8.6, '#2b5ea7');
    circle(ctx, x + 26, y - 8, 1.9, CREAM);
    ctx.strokeStyle = BRASS;
    ctx.lineWidth = 1.8;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath(); ctx.moveTo(x + 24, y - 14); ctx.lineTo(x + 24 + i * 5, y - 21); ctx.stroke();
      circle(ctx, x + 24 + i * 5, y - 22, 1.8, BRASS);
    }
  }
}

function paintMenagerie(ctx, alt) {
  const rng = mulberry32(4404);
  verticalGradient(ctx, 0, 0, PANEL_W, PANEL_H, [[0, '#1c1440'], [0.55, '#2c1a4a'], [1, '#170f2c']]);
  scatterStars(ctx, rng, PANEL_W, 300, 42, 300);

  // the moon (difference 10: crescent becomes full)
  moonCrescent(ctx, 204, 66, 23, alt.has(10));
  // a firework (difference 8: it never went off)
  if (!alt.has(8)) drawFirework(ctx, 108, 92, 30, '#f2a0c4', 818);
  drawFirework(ctx, 330, 60, 20, '#8fd0ff', 919);

  // the ferris wheel (difference 4: one cabin is missing)
  ctx.save();
  ctx.translate(478, 138);
  ctx.strokeStyle = 'rgba(190,170,230,0.55)';
  ctx.lineWidth = 4;
  circle(ctx, 0, 0, 86, null, 'rgba(190,170,230,0.55)', 4);
  circle(ctx, 0, 0, 58, null, 'rgba(190,170,230,0.35)', 2.4);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * 86, Math.sin(a) * 86);
    ctx.stroke();
  }
  for (let i = 0; i < 8; i++) {
    if (alt.has(4) && i === 5) continue;
    const a = (i / 8) * Math.PI * 2 + 0.2;
    const cx = Math.cos(a) * 86;
    const cy = Math.sin(a) * 86;
    roundedRect(ctx, cx - 9, cy - 2, 18, 15, 4, i % 2 ? RUBY : '#3fae7c', null);
  }
  circle(ctx, 0, 0, 9, BRASS);
  ctx.strokeStyle = 'rgba(190,170,230,0.4)';
  ctx.beginPath(); ctx.moveTo(0, 8); ctx.lineTo(-34, 120); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 8); ctx.lineTo(34, 120); ctx.stroke();
  ctx.restore();

  // a cluster of three stars (difference 11: one winks out)
  star(ctx, 528, 236, 7, '#ffe9b0');
  star(ctx, 552, 258, 5.4, '#ffe9b0');
  if (!alt.has(11)) star(ctx, 512, 262, 4.6, '#ffe9b0');

  // pennant string (difference 6: the last flag is missing)
  ctx.strokeStyle = 'rgba(246,234,210,0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(24, 34);
  ctx.quadraticCurveTo(180, 84, 336, 52);
  ctx.stroke();
  const flags = [[58, 48], [112, 58], [168, 64], [226, 64], [282, 58]];
  flags.forEach(([fx, fy], i) => {
    if (alt.has(6) && i === flags.length - 1) return;
    pennant(ctx, fx, fy, 24, [RUBY, '#e8a33c', EMERALD, SAPPHIRE, VIOLET][i]);
  });

  // lantern string (difference 3: the middle lantern turns teal)
  ctx.strokeStyle = 'rgba(246,234,210,0.5)';
  ctx.beginPath();
  ctx.moveTo(30, 176);
  ctx.quadraticCurveTo(298, 232, 566, 182);
  ctx.stroke();
  const lanterns = [[84, 192], [188, 204], [300, 210], [414, 202], [518, 190]];
  lanterns.forEach(([lx, ly], i) => {
    const colors = ['#e86a5e', '#f0a83e', '#e86a5e', '#f0a83e', '#e86a5e'];
    paperLantern(ctx, lx, ly, 17, alt.has(3) && i === 2 ? '#2ec4b6' : colors[i]);
  });

  // distant tents on the horizon, their lamps lit, behind everything
  radialGlow(ctx, 330, 440, 300, 'rgba(122,72,180,0.20)', 'rgba(122,72,180,0)');
  ctx.fillStyle = '#221239';
  for (const [tx, tw, th] of [[18, 138, 78], [168, 104, 56], [428, 148, 86], [540, 92, 58]]) {
    ctx.beginPath();
    ctx.moveTo(tx, 472);
    ctx.lineTo(tx + tw / 2, 472 - th);
    ctx.lineTo(tx + tw, 472);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#f0c96a';
    ctx.fillRect(tx + tw / 2 - 4, 472 - th + 16, 8, 10);
    ctx.fillRect(tx + tw * 0.28, 472 - 14, 6, 8);
    ctx.fillStyle = '#221239';
  }
  ctx.strokeStyle = 'rgba(246,234,210,0.4)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(60, 420);
  ctx.quadraticCurveTo(298, 462, 540, 416);
  ctx.stroke();
  ctx.fillStyle = '#ffd76e';
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    const lx = 60 + t * 480;
    const ly = 420 + 2 * t * (1 - t) * 42 + t * (416 - 420) + 6;
    circle(ctx, lx, ly, 2.4, '#ffd76e');
  }

  // the ticket booth (difference 7: the star on its sign is gone)
  ctx.fillStyle = '#4a2c50';
  ctx.fillRect(36, 500, 104, 108);
  ctx.fillStyle = '#5d3a66';
  ctx.beginPath();
  ctx.moveTo(26, 500);
  ctx.lineTo(150, 500);
  ctx.lineTo(88, 462);
  ctx.closePath();
  ctx.fill();
  roundedRect(ctx, 50, 470, 76, 24, 5, '#f6ead2');
  if (!alt.has(7)) star(ctx, 66, 482, 8, RUBY);
  ctx.fillStyle = '#2c1a33';
  ctx.fillRect(58, 522, 26, 40);
  ctx.fillRect(96, 522, 26, 40);
  ctx.fillStyle = BRASS;
  ctx.fillRect(58, 540, 26, 4);
  ctx.fillRect(96, 540, 26, 4);

  // the carousel
  ctx.fillStyle = '#241335';
  ctx.beginPath();
  ctx.ellipse(330, 596, 218, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3a2152';
  ctx.beginPath();
  ctx.ellipse(330, 588, 218, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = BRASS_DARK;
  ctx.fillRect(322, 420, 16, 150);
  // canopy (difference 0: a cream segment turns ruby)
  for (let i = 0; i < 8; i++) {
    const x0 = 158 + i * 43;
    ctx.beginPath();
    ctx.moveTo(330, 356);
    ctx.lineTo(x0, 428);
    ctx.lineTo(x0 + 43, 428);
    ctx.closePath();
    ctx.fillStyle = i % 2 ? '#f6ead2' : RUBY;
    if (alt.has(0) && i === 3) ctx.fillStyle = RUBY;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(146, 428);
  ctx.lineTo(514, 428);
  ctx.lineTo(330, 350);
  ctx.closePath();
  ctx.strokeStyle = BRASS_DARK;
  ctx.lineWidth = 3;
  ctx.stroke();
  circle(ctx, 330, 348, 9, BRASS_LIGHT, BRASS_DARK, 2);
  ctx.fillStyle = BRASS;
  ctx.fillRect(146, 428, 368, 7);
  drawCarouselAnimal(ctx, 'horse', 208, 500, { saddle: alt.has(1) });
  drawCarouselAnimal(ctx, 'rabbit', 300, 506, { ribbonGone: alt.has(2) });
  drawCarouselAnimal(ctx, 'fox', 392, 500, { tailTip: alt.has(9) });
  drawCarouselAnimal(ctx, 'peacock', 478, 502, { eyesClosed: alt.has(5) });

  // fairground floor sparkle
  ctx.fillStyle = 'rgba(240,201,106,0.5)';
  for (let i = 0; i < 14; i++) {
    const fx = 30 + rng() * 540;
    const fy = 606 + rng() * 26;
    ctx.fillRect(fx, fy, 3, 2);
  }
}

// ---------------------------------------------------------------- registry
export const SCENES = [
  {
    id: 'workshop',
    name: 'The Brass Workshop',
    tagline: 'Six small betrayals among the gears.',
    timeLimit: 150,
    paint: paintWorkshop,
    diffs: [
      { x: 112, y: 314, r: 30, label: "the owl's amber eyes turned ruby" },
      { x: 246, y: 92, r: 34, label: 'the middle lamp went dark' },
      { x: 432, y: 122, r: 56, label: 'the great gear lost a tooth' },
      { x: 384, y: 268, r: 27, label: 'the green bottle turned violet' },
      { x: 108, y: 108, r: 30, label: 'the crescent moon filled out' },
      { x: 150, y: 436, r: 30, label: 'the wrench vanished from the bench' },
    ],
  },
  {
    id: 'aviary',
    name: 'The Aviary Dome',
    tagline: 'Eight quiet changes under the glass.',
    timeLimit: 140,
    paint: paintAviary,
    diffs: [
      { x: 152, y: 128, r: 34, label: 'the blue bird turned around' },
      { x: 108, y: 362, r: 26, label: 'the cage door swung open' },
      { x: 420, y: 540, r: 27, label: 'the great bloom turned orange' },
      { x: 522, y: 118, r: 25, label: 'the violet butterfly left' },
      { x: 298, y: 520, r: 36, label: 'one fountain arc stopped' },
      { x: 332, y: 218, r: 27, label: 'the red bird lost a crest feather' },
      { x: 478, y: 96, r: 30, label: 'half the leaves fell from the spray' },
      { x: 249, y: 297, r: 25, label: 'a third egg appeared in the nest' },
    ],
  },
  {
    id: 'aquarium',
    name: 'The Midnight Aquarium',
    tagline: 'Ten secrets in the deep brass water.',
    timeLimit: 130,
    paint: paintAquarium,
    diffs: [
      { x: 252, y: 306, r: 42, label: 'the great fish lost a stripe' },
      { x: 402, y: 566, r: 40, label: 'the treasure chest stands open' },
      { x: 518, y: 290, r: 27, label: 'the bubble cluster dispersed' },
      { x: 152, y: 592, r: 25, label: 'the starfish turned pink' },
      { x: 52, y: 300, r: 27, label: 'the red valve wheel turned brass' },
      { x: 472, y: 428, r: 31, label: 'the little amber fish slipped away' },
      { x: 92, y: 596, r: 36, label: 'the teal coral turned magenta' },
      { x: 310, y: 88, r: 44, label: 'a squid drifted past the porthole' },
      { x: 352, y: 596, r: 30, label: 'one seaweed strand went missing' },
      { x: 401, y: 210, r: 22, label: "the lantern fish's light went out" },
    ],
  },
  {
    id: 'menagerie',
    name: 'The Grand Menagerie',
    tagline: 'Twelve wonders at the midnight fair.',
    timeLimit: 120,
    paint: paintMenagerie,
    diffs: [
      { x: 316, y: 400, r: 30, label: 'a canopy panel changed its colour' },
      { x: 208, y: 498, r: 26, label: "the horse's saddle turned sapphire" },
      { x: 302, y: 474, r: 20, label: "the rabbit's ear ribbon vanished" },
      { x: 300, y: 210, r: 26, label: 'the middle lantern turned teal' },
      { x: 430, y: 72, r: 20, label: 'a ferris cabin is missing' },
      { x: 472, y: 478, r: 34, label: "two of the peacock's eyes closed" },
      { x: 294, y: 64, r: 20, label: 'the last pennant came down' },
      { x: 66, y: 482, r: 20, label: 'the star left the booth sign' },
      { x: 108, y: 92, r: 31, label: 'the pink firework never went off' },
      { x: 350, y: 508, r: 21, label: "the fox's tail tip lost its cream" },
      { x: 204, y: 66, r: 25, label: 'the crescent moon filled out' },
      { x: 514, y: 260, r: 20, label: 'one star of the cluster winked out' },
    ],
  },
];
