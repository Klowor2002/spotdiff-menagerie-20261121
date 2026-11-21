// audio.js — a tiny WebAudio music box. Every sound is synthesized in
// code (no audio files to ship): a two-note chime when a difference is
// found, a dull buzz for a miss, a soft bell for a hint, a ticking clock
// when time runs low, and a small arpeggio when a scene is cleared.

export class SoundBox {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  tone(freq, at, dur, type, gainPeak) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime + at;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(gainPeak || 0.16, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  find(combo) {
    if (!this.ensure()) return;
    const base = 660 * Math.pow(1.059, Math.min(combo, 8));
    this.tone(base, 0, 0.22, 'sine', 0.18);
    this.tone(base * 1.5, 0.07, 0.3, 'sine', 0.14);
    this.tone(base * 2, 0.13, 0.34, 'triangle', 0.07);
  }

  miss() {
    if (!this.ensure()) return;
    this.tone(140, 0, 0.18, 'sawtooth', 0.06);
    this.tone(110, 0.02, 0.2, 'square', 0.04);
  }

  hint() {
    if (!this.ensure()) return;
    this.tone(880, 0, 0.3, 'sine', 0.1);
    this.tone(880, 0.16, 0.3, 'sine', 0.07);
  }

  tick() {
    if (!this.ensure()) return;
    this.tone(1250, 0, 0.05, 'square', 0.035);
  }

  clear() {
    if (!this.ensure()) return;
    [523, 659, 784, 1047].forEach((f, i) => this.tone(f, i * 0.09, 0.32, 'triangle', 0.13));
  }

  complete() {
    if (!this.ensure()) return;
    [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => this.tone(f, i * 0.11, 0.4, 'triangle', 0.12));
  }
}
