export const GAME_CONFIG = {
  SPEED: 8,
  GRAVITY: 22,
  JUMP_FORCE: 7.5,
  PLAYER_HEIGHT: 2.2,
  PLAYER_RADIUS: 0.45,
  MAX_AMMO: 12,
  RELOAD_TIME_MS: 1200,
  ARENA_BOUNDS: 58,
  GAME_TIME_LIMIT: 600,
  PLAYER_MAX_HP: 100,
};

export const MAP_OBSTACLES = [
  { position: [-12, 7, -12], size: [8, 14, 8], sign: 'VIRUS DETECTED' },
  { position: [12, 5, -16], size: [10, 10, 7], sign: 'SYSTEM BREACH' },
  { position: [-22, 9, 8], size: [7, 18, 11], sign: 'MALWARE DETECTED' },
  { position: [22, 6, 12], size: [9, 12, 8], sign: 'VIRUS REMOVED' },
  { position: [0, 4, 18], size: [13, 8, 6], sign: 'VIRUS DETECTED' },
  { position: [-34, 5, -24], size: [8, 10, 8], sign: 'SYSTEM BREACH' },
  { position: [34, 8, -28], size: [10, 16, 7], sign: 'MALWARE DETECTED' },
  { position: [-38, 4, 30], size: [7, 8, 12], sign: 'VIRUS REMOVED' },
  { position: [36, 6, 32], size: [8, 12, 10], sign: 'VIRUS DETECTED' },
  { position: [0, 5, -34], size: [15, 10, 5], sign: 'SYSTEM BREACH' },
];

export const KEYBOARD_MAP = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'reload', keys: ['KeyR'] },
];
