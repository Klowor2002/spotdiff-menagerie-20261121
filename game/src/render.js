// render.js — the stage: it pre-paints both panels of a scene once (the
// plain room on the left, the altered room on the right), then each frame
// lays the living marks over them — gold rings on the differences found,
// a breathing pulse on the hinted one, a red cross where a click missed,
// and little bursts of sparks and floating points when a find lands.

import { PANEL_W, PANEL_H } from './scenes.js';

const GOLD = '#f0c96a';
const GOLD_DEEP = '#c9973f';

export class StageView {
  constructor(canvasLeft, canvasRight) {
    this.left = canvasLeft;
    this.right = canvasRight;
    this.ctxL = canvasLeft.getContext('2d');
    this.ctxR = canvasRight.getContext('2d');
    this.effects = [];
    this.shakeUntil = 0;
    this.scene = null;
    this.hunt = null;
  }

  loadScene(scene, hunt) {
    this.scene = scene;
    this.hunt = hunt;
    this.effects = [];
    this.plain = document.createElement('canvas');
    this.plain.width = PANEL_W;
    this.plain.height = PANEL_H;
    scene.paint(this.plain.getContext('2d'), new Set());
    this.altered = document.createElement('canvas');
    this.altered.width = PANEL_W;
    this.altered.height = PANEL_H;
    scene.paint(this.altered.getContext('2d'), new Set(scene.diffs.map((d, i) => i)));
  }

  celebrate(index, points, combo) {
    const d = this.scene.diffs[index];
    this.effects.push({ kind: 'burst', index, x: d.x, y: d.y, at: performance.now() });
    this.effects.push({
      kind: 'float', x: d.x, y: d.y - d.r - 8, at: performance.now(),
      text: `+${points}${combo > 1 ? `  ×${combo}` : ''}`,
    });
  }

  missMark(x, y) {
    this.effects.push({ kind: 'miss', x, y, at: performance.now() });
    this.shakeUntil = performance.now() + 180;
  }

  drawMarker(ctx, d, now, justFoundAt) {
    const age = justFoundAt ? (now - justFoundAt) / 1000 : 9;
    const settle = age < 0.45 ? 1 + Math.sin((age / 0.45) * Math.PI) * 0.35 : 1;
    const r = Math.max(d.r, 24) * settle;
    ctx.save();
    ctx.beginPath();
    ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(20,10,0,0.55)';
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(d.x, d.y, r - 5, 0, Math.PI * 2);
    ctx.strokeStyle = GOLD_DEEP;
    ctx.lineWidth = 1.6;
    ctx.stroke();
    // the keeper's tick
    ctx.beginPath();
    ctx.moveTo(d.x - r * 0.34, d.y + r * 0.02);
    ctx.lineTo(d.x - r * 0.1, d.y + r * 0.28);
    ctx.lineTo(d.x + r * 0.38, d.y - r * 0.26);
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 4.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();
  }

  drawPanel(ctx, base, now) {
    ctx.save();
    if (now < this.shakeUntil) {
      const dx = Math.sin(now * 0.09) * 3.2;
      ctx.translate(dx, 0);
    }
    ctx.drawImage(base, 0, 0);
    // found rings
    for (const i of this.hunt.found) {
      const fx = this.effects.find((e) => e.kind === 'burst' && e.index === i);
      this.drawMarker(ctx, this.scene.diffs[i], now, fx ? fx.at : 0);
    }
    // the hinted difference breathes
    if (this.hunt.activeHint !== null && this.hunt.activeHint !== undefined) {
      const d = this.scene.diffs[this.hunt.activeHint];
      const pulse = 1 + Math.sin(now * 0.012) * 0.13;
      ctx.beginPath();
      ctx.arc(d.x, d.y, Math.max(d.r, 26) * pulse + 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(120,255,220,0.9)';
      ctx.lineWidth = 3.4;
      ctx.setLineDash([10, 7]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // one-off effects
    for (const e of this.effects) {
      const age = (now - e.at) / 1000;
      if (e.kind === 'burst' && age < 0.6) {
        for (let k = 0; k < 10; k++) {
          const a = (k / 10) * Math.PI * 2 + e.at % 1;
          const dist = age * 90;
          const sx = e.x + Math.cos(a) * dist;
          const sy = e.y + Math.sin(a) * dist - age * 22;
          ctx.globalAlpha = 1 - age / 0.6;
          ctx.beginPath();
          ctx.arc(sx, sy, 3.1 - age * 3, 0, Math.PI * 2);
          ctx.fillStyle = GOLD;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      if (e.kind === 'miss' && age < 0.55) {
        ctx.globalAlpha = 1 - age / 0.55;
        ctx.strokeStyle = '#ff5d47';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        const s = 13;
        ctx.beginPath();
        ctx.moveTo(e.x - s, e.y - s);
        ctx.lineTo(e.x + s, e.y + s);
        ctx.moveTo(e.x + s, e.y - s);
        ctx.lineTo(e.x - s, e.y + s);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      if (e.kind === 'float' && age < 1.05) {
        ctx.globalAlpha = age < 0.75 ? 1 : 1 - (age - 0.75) / 0.3;
        ctx.font = '700 25px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(24,12,0,0.8)';
        const fy = e.y - age * 42;
        ctx.strokeText(e.text, e.x, fy);
        ctx.fillStyle = GOLD;
        ctx.fillText(e.text, e.x, fy);
        ctx.globalAlpha = 1;
      }
    }
    // time pressure you can feel: the frame itself flushes red
    if (!this.hunt.over && this.hunt.timeLeft <= 15) {
      const throb = 0.1 + 0.07 * Math.sin(now * 0.011);
      ctx.strokeStyle = `rgba(255,64,40,${throb + 0.14})`;
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, PANEL_W - 10, PANEL_H - 10);
    }
    ctx.restore();
  }

  draw(now) {
    if (!this.scene) return;
    this.drawPanel(this.ctxL, this.plain, now);
    this.drawPanel(this.ctxR, this.altered, now);
    // spent one-offs go; bursts linger a little so their marker can settle
    this.effects = this.effects.filter((e) => (now - e.at) / 1000 < (e.kind === 'burst' ? 3 : 1.1));
  }
}
