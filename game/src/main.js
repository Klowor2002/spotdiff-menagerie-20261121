// main.js — the keeper of the Menagerie: wires the scenes, the hunt, the
// stage and the sound together, runs the clock, keeps the hall's score,
// and walks the player from the title card through all four rooms to the
// final reckoning.

import { SCENES } from './scenes.js';
import { Hunt } from './play.js';
import { StageView } from './render.js';
import { attachInput } from './input.js';
import { SoundBox } from './audio.js';
import { applyShot } from './shots.js';

const $ = (id) => document.getElementById(id);

const els = {
  counter: $('counter'),
  score: $('score'),
  combo: $('combo'),
  sceneName: $('scene-name'),
  timerFill: $('timer-fill'),
  timerText: $('timer-text'),
  dots: $('dots'),
  message: $('message'),
  hintBtn: $('hint-btn'),
  stage: $('stage'),
  overlays: {
    title: $('overlay-title'),
    clear: $('overlay-clear'),
    complete: $('overlay-complete'),
    failed: $('overlay-failed'),
    pause: $('overlay-pause'),
  },
  clearStars: $('clear-stars'),
  clearScore: $('clear-score'),
  clearNext: $('clear-next'),
  finalScore: $('final-score'),
  finalGrade: $('final-grade'),
  failedText: $('failed-text'),
};

function formatClock(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${(s / 60) | 0}:${String(s % 60).padStart(2, '0')}`;
}

function gradeFor(total) {
  if (total >= 9000) return 'Grand Keeper of the Menagerie';
  if (total >= 7000) return 'Master of the Brass Hunt';
  if (total >= 5000) return 'Eagle-Eyed Keeper';
  if (total >= 3000) return 'Promising Apprentice';
  return 'Friend of the Menagerie';
}

export class Game {
  constructor() {
    this.view = new StageView($('panel-left'), $('panel-right'));
    this.sound = new SoundBox();
    this.sceneIndex = 0;
    this.totalScore = 0;
    this.hunt = null;
    this.mode = 'title';
    this.lastTickSecond = -1;
    this.lastTime = performance.now();
    attachInput([$('panel-left'), $('panel-right')], {
      onPoint: (x, y) => this.onPoint(x, y),
      onHint: () => this.onHint(),
      onPause: () => this.onPause(),
      onRetry: () => { if (this.mode === 'playing' || this.mode === 'failed') this.startScene(this.sceneIndex); },
      onAdvance: () => this.onAdvance(),
    });
    $('begin-btn').addEventListener('click', () => { this.sound.ensure(); this.startScene(0); });
    $('clear-next').addEventListener('click', () => this.onAdvance());
    $('again-btn').addEventListener('click', () => { this.totalScore = 0; this.startScene(0); });
    $('retry-btn').addEventListener('click', () => this.startScene(this.sceneIndex));
    $('resume-btn').addEventListener('click', () => this.onPause());
    els.hintBtn.addEventListener('click', () => this.onHint());
    this.startScene(0);
    this.mode = 'title';
    this.showOverlay('title');
    this.syncHud('Four rooms. Thirty-six small betrayals. Find them all.');
    requestAnimationFrame((t) => this.loop(t));
  }

  showOverlay(name) {
    for (const [key, el] of Object.entries(els.overlays)) {
      el.classList.toggle('visible', key === name);
    }
  }

  startScene(index) {
    this.sceneIndex = index;
    const scene = SCENES[index];
    this.hunt = new Hunt(scene);
    this.view.loadScene(scene, this.hunt);
    this.mode = 'playing';
    this.lastTickSecond = -1;
    this.showOverlay(null);
    this.syncHud(scene.tagline);
  }

  finishScene() {
    if (this.hunt.won) {
      this.totalScore += this.hunt.score;
      this.mode = 'clear';
      this.sound.clear();
      els.clearStars.textContent = '★'.repeat(this.hunt.stars()) + '☆'.repeat(3 - this.hunt.stars());
      els.clearScore.textContent = `Room score ${this.hunt.score.toLocaleString('en-US')} · Hall total ${this.totalScore.toLocaleString('en-US')}`;
      els.clearNext.textContent = this.sceneIndex === SCENES.length - 1 ? 'See the reckoning →' : 'Next room →';
      this.showOverlay('clear');
    } else {
      this.mode = 'failed';
      els.failedText.textContent = `You found ${this.hunt.found.size} of ${this.hunt.total} before the clock ran out.`;
      this.showOverlay('failed');
    }
    this.syncHud('');
  }

  onAdvance() {
    if (this.mode === 'title') { this.sound.ensure(); this.startScene(0); return; }
    if (this.mode !== 'clear') return;
    if (this.sceneIndex === SCENES.length - 1) {
      this.mode = 'complete';
      this.sound.complete();
      els.finalScore.textContent = this.totalScore.toLocaleString('en-US');
      els.finalGrade.textContent = gradeFor(this.totalScore);
      this.showOverlay('complete');
    } else {
      this.startScene(this.sceneIndex + 1);
    }
  }

  onPause() {
    if (this.mode === 'playing') {
      this.mode = 'paused';
      this.showOverlay('pause');
    } else if (this.mode === 'paused') {
      this.mode = 'playing';
      this.showOverlay(null);
    }
  }

  onPoint(x, y) {
    if (this.mode !== 'playing') return;
    this.sound.ensure();
    const res = this.hunt.click(x, y);
    if (res.kind === 'found') {
      this.view.celebrate(res.index, res.points, res.combo);
      this.sound.find(res.combo);
      const d = this.hunt.scene.diffs[res.index];
      this.syncHud(res.combo > 1 ? `Combo ×${res.combo} — ${d.label}.` : `Found: ${d.label}.`);
    } else if (res.kind === 'miss') {
      this.view.missMark(x, y);
      this.sound.miss();
      this.syncHud('Not there. The clock takes five seconds for that.');
    }
    if (this.hunt.over) this.finishScene();
    else this.syncHud();
  }

  onHint() {
    if (this.mode !== 'playing') return;
    const pick = this.hunt.useHint();
    if (pick !== null && pick !== undefined) {
      this.sound.hint();
      this.syncHud('Something glimmers. Look for the breathing ring.');
    } else if (this.hunt.hintsLeft <= 0) {
      this.syncHud('No hints left in this room.');
    }
    this.syncHud();
  }

  syncHud(message) {
    const hunt = this.hunt;
    if (!hunt) return;
    els.counter.textContent = `${hunt.remaining} LEFT TO FIND`;
    els.score.textContent = `SCORE ${(this.totalScore + (this.mode === 'clear' || this.mode === 'complete' ? 0 : hunt.score)).toLocaleString('en-US')}`;
    els.sceneName.textContent = `ROOM ${this.sceneIndex + 1} OF ${SCENES.length} · ${hunt.scene.name.toUpperCase()}`;
    els.combo.textContent = hunt.combo > 1 ? `COMBO ×${hunt.combo}` : '';
    els.combo.classList.toggle('lit', hunt.combo > 1);
    els.hintBtn.textContent = `✦ HINT (${hunt.hintsLeft})`;
    els.hintBtn.disabled = hunt.hintsLeft <= 0 || this.mode !== 'playing';
    els.timerText.textContent = formatClock(hunt.timeLeft);
    const frac = Math.max(0, hunt.timeLeft / hunt.scene.timeLimit);
    els.timerFill.style.width = `${frac * 100}%`;
    els.timerFill.classList.toggle('low', hunt.timeLeft <= 15);
    els.dots.innerHTML = '';
    hunt.scene.diffs.forEach((d, i) => {
      const dot = document.createElement('span');
      dot.className = 'dot' + (hunt.found.has(i) ? ' found' : '');
      dot.title = hunt.found.has(i) ? d.label : 'still hiding';
      els.dots.appendChild(dot);
    });
    if (message !== undefined && message !== '') els.message.textContent = message;
    else if (message === '') els.message.textContent = '';
  }

  loop(now) {
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;
    if (this.mode === 'playing' && this.hunt) {
      this.hunt.tick(dt);
      const whole = Math.ceil(this.hunt.timeLeft);
      if (whole !== this.lastTickSecond) {
        this.lastTickSecond = whole;
        if (whole <= 10 && whole > 0) this.sound.tick();
        this.syncHud();
      }
      if (this.hunt.over) this.finishScene();
    }
    if (this.hunt) this.view.draw(now);
    requestAnimationFrame((t) => this.loop(t));
  }
}

const game = new Game();
window.__menagerie = game;

const shotName = new URLSearchParams(location.search).get('shot');
if (shotName) applyShot(game, shotName, els);
