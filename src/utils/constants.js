export const DIFFICULTY = {
  BEGINNER: {
    rows: 9,
    cols: 9,
    mines: 10
  },
  INTERMEDIATE: {
    rows: 16,
    cols: 16,
    mines: 40
  },
  ADVANCED: {
    rows: 16,
    cols: 30,
    mines: 99
  }
};

export const CELL_STATE = {
  HIDDEN: 'hidden',
  REVEALED: 'revealed',
  FLAGGED: 'flagged',
  EXPLODED: 'exploded'
};

export const GAME_STATUS = {
  READY: 'ready',
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost'
};

export const NUMBERS = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8'
};

export const ICONS = {
  MINE: '💣',
  FLAG: '🚩',
  EXPLODED: '💥',
  HAPPY: '😊',
  DEAD: '😵',
  COOL: '😎'
};
