export const GAME_CONFIG = {
  SPEED: 8,
  GRAVITY: 22,
  JUMP_FORCE: 7.5,
  PLAYER_HEIGHT: 1.6,
  MAX_AMMO: 12,
  RELOAD_TIME_MS: 1200,
  ARENA_BOUNDS: 28,
  GAME_TIME_LIMIT: 600, // 10 minutos
  PLAYER_MAX_HP: 100,
};

export const KEYBOARD_MAP = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'reload', keys: ['KeyR'] },
];