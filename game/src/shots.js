// shots.js — the portrait studio: deterministic mid-game states the
// screenshot camera asks for with ?shot=<name>. Each setup loads a room,
// marks a believable set of differences found, sets the clock and the
// score, and freezes play so the render is exactly the game, mid-hunt.

export function applyShot(game, name, els) {
  const setups = {
    // The cover: deep in the aquarium, four of ten found, the clock low.
    cover: () => {
      game.startScene(2);
      markFound(game, [0, 2, 4, 7]);
      game.hunt.timeLeft = 41;
      game.totalScore = 960;
      game.hunt.score = 890;
      game.hunt.combo = 3;
      game.hunt.comboSecondsLeft = 3.4;
      return 'Combo ×3 — the tank glows approvingly.';
    },
    // The workshop, early: two found, a hint breathing on the great gear.
    workshop: () => {
      game.startScene(0);
      markFound(game, [1, 4]);
      game.hunt.timeLeft = 96;
      game.hunt.score = 640;
      game.hunt.showHint(2, 9999);
      return 'A hint hums near the great gear…';
    },
    // The grand finale, mid-hunt: five of twelve ringed, combo lit.
    menagerie: () => {
      game.startScene(3);
      markFound(game, [0, 1, 4, 6, 9]);
      game.hunt.timeLeft = 47;
      game.totalScore = 2860;
      game.hunt.score = 1440;
      game.hunt.combo = 2;
      game.hunt.comboSecondsLeft = 3.1;
      return 'Combo ×2 — the carousel turns for you.';
    },
    // A room cleared: every ring in place, the keeper's stars above.
    clear: () => {
      game.startScene(1);
      markFound(game, [0, 1, 2, 3, 4, 5, 6, 7]);
      game.hunt.timeLeft = 38;
      game.hunt.score = 1460;
      game.totalScore = 3200;
      game.mode = 'clear';
      els.clearStars.textContent = '★★★';
      els.clearScore.textContent = 'Room score 1,460 · Hall total 3,200';
      els.clearNext.textContent = 'Next room →';
      game.showOverlay('clear');
      return '';
    },
  };
  const setup = setups[name];
  if (!setup) return;
  const message = setup();
  if (name !== 'clear') game.mode = 'shot';
  game.syncHud(message);
}

function markFound(game, indexes) {
  for (const i of indexes) game.hunt.found.add(i);
}
