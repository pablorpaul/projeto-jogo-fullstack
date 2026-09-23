export const GAME_CONFIG = {
  SPEED: 8,
  GRAVITY: 22,
  JUMP_FORCE: 7.5,
  PLAYER_HEIGHT: 2.2,
  PLAYER_RADIUS: 0.45,
  MAX_AMMO: 12,
  RELOAD_TIME_MS: 1200,
  ARENA_BOUNDS: 58,
  GAME_TIME_LIMIT: 600, // 10 minutos
  PLAYER_MAX_HP: 100,
};

// Obstáculos em coordenadas do mapa. O formato é compatível com boxGeometry:
// position = centro do obstáculo e size = [largura, altura, profundidade].
export const MAP_OBSTACLES = [
  { position: [-12, 2, -12], size: [6, 4, 6] },
  { position: [12, 1.5, -16], size: [8, 3, 5] },
  { position: [-22, 2, 8], size: [5, 4, 9] },
  { position: [22, 1.5, 12], size: [7, 3, 6] },
  { position: [0, 2, 18], size: [10, 4, 4] },
  { position: [-34, 1.5, -24], size: [6, 3, 6] },
  { position: [34, 2, -28], size: [8, 4, 5] },
  { position: [-38, 1, 30], size: [5, 2, 10] },
  { position: [36, 1.5, 32], size: [6, 3, 8] },
  { position: [0, 1.5, -34], size: [12, 3, 4] },
];

export const KEYBOARD_MAP = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'reload', keys: ['KeyR'] },
];
