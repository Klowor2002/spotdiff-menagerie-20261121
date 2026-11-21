// play.js — the rules of one hunt: what counts as a find, how the combo
// climbs, what a mistake costs, how hints behave, and when the clock has
// won. Pure state and scoring; the stage drawing lives in render.js and
// the pointing in input.js.

export const FIND_POINTS = 100;
export const HINT_COST = 150;
export const MISTAKE_POINTS = 25;
export const MISTAKE_SECONDS = 5;
export const COMBO_WINDOW_SECONDS = 4.5;
export const MAX_COMBO = 5;
export const HINTS_PER_SCENE = 3;

export class Hunt {
  constructor(scene) {
    this.scene = scene;
    this.found = new Set();
    this.mistakes = 0;
    this.hintsLeft = HINTS_PER_SCENE;
    this.hintUsed = 0;
    this.score = 0;
    this.combo = 0;
    this.comboSecondsLeft = 0;
    this.timeLeft = scene.timeLimit;
    this.over = false;
    this.won = false;
    this.activeHint = null;
    this.hintSecondsLeft = 0;
  }

  get total() {
    return this.scene.diffs.length;
  }

  get remaining() {
    return this.total - this.found.size;
  }

  // A click in panel coordinates. Returns what happened so the caller can
  // draw and play it: { kind: 'found', index, points } | { kind: 'miss' }.
  click(x, y) {
    if (this.over) return { kind: 'over' };
    let best = -1;
    let bestDist = Infinity;
    this.scene.diffs.forEach((d, i) => {
      if (this.found.has(i)) return;
      const dist = Math.hypot(x - d.x, y - d.y);
      if (dist < Math.max(d.r, 26) && dist < bestDist) {
        best = i;
        bestDist = dist;
      }
    });
    if (best >= 0) {
      this.found.add(best);
      if (this.activeHint === best) {
        this.activeHint = null;
        this.hintSecondsLeft = 0;
      }
      this.combo = this.comboSecondsLeft > 0 ? Math.min(this.combo + 1, MAX_COMBO) : 1;
      this.comboSecondsLeft = COMBO_WINDOW_SECONDS;
      const points = FIND_POINTS * this.combo;
      this.score += points;
      if (this.remaining === 0) {
        this.over = true;
        this.won = true;
        this.score += Math.ceil(this.timeLeft) * 2;
      }
      return { kind: 'found', index: best, points, combo: this.combo };
    }
    this.mistakes += 1;
    this.combo = 0;
    this.comboSecondsLeft = 0;
    this.score = Math.max(0, this.score - MISTAKE_POINTS);
    this.timeLeft = Math.max(0, this.timeLeft - MISTAKE_SECONDS);
    if (this.timeLeft <= 0) {
      this.over = true;
      this.won = false;
    }
    return { kind: 'miss' };
  }

  // Spend a hint: the stage pulses one unfound difference for a moment.
  useHint() {
    if (this.over || this.hintsLeft <= 0 || this.remaining === 0) return null;
    const unfound = this.scene.diffs.map((d, i) => i).filter((i) => !this.found.has(i));
    const pick = unfound[(Math.random() * unfound.length) | 0];
    this.hintsLeft -= 1;
    this.hintUsed += 1;
    this.score = Math.max(0, this.score - HINT_COST);
    this.activeHint = pick;
    this.hintSecondsLeft = 1.8;
    return pick;
  }

  // Reveal a specific difference as a hint without cost (screenshot setups).
  showHint(index, seconds) {
    this.activeHint = index;
    this.hintSecondsLeft = seconds || 9999;
  }

  tick(dt) {
    if (this.over) return;
    this.timeLeft = Math.max(0, this.timeLeft - dt);
    if (this.comboSecondsLeft > 0) {
      this.comboSecondsLeft = Math.max(0, this.comboSecondsLeft - dt);
      if (this.comboSecondsLeft === 0) this.combo = 0;
    }
    if (this.hintSecondsLeft > 0) {
      this.hintSecondsLeft = Math.max(0, this.hintSecondsLeft - dt);
      if (this.hintSecondsLeft === 0) this.activeHint = null;
    }
    if (this.timeLeft <= 0) {
      this.over = true;
      this.won = false;
    }
  }

  stars() {
    if (!this.won) return 0;
    const par = this.scene.timeLimit * 0.45;
    if (this.mistakes === 0 && this.timeLeft >= par) return 3;
    if (this.mistakes <= 2) return 2;
    return 1;
  }
}
