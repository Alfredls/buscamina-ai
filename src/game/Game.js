import { Board } from './Board.js';
import { DIFFICULTY, GAME_STATUS, CELL_STATE } from '../utils/constants.js';

export class Game {
  constructor() {
    this.board = null;
    this.difficulty = DIFFICULTY.BEGINNER;
    this.timer = null;
    this.seconds = 0;
    this.listeners = {};
  }

  init(difficulty = DIFFICULTY.BEGINNER) {
    this.difficulty = difficulty;
    this.board = new Board(difficulty);
    this.board.initialize();
    this.stopTimer();
    this.seconds = 0;
    this.emit('init', this.board.getStats());
  }

  start(excludeRow, excludeCol) {
    this.board.placeMines(excludeRow, excludeCol);
    this.emit('start', this.board.getStats());
  }

  click(row, col) {
    if (!this.board) return;
    
    const result = this.board.clickCell(row, col);
    
    if (result) {
      this.emit('click', result);
      
      if (result.type === 'explosion') {
        this.stopTimer();
        const allMines = this.board.revealAllMines();
        this.emit('gameover', { won: false, explodedCell: result.cell, allMines });
      } else if (result.type === 'win') {
        this.stopTimer();
        this.emit('gameover', { won: true });
      }
    }
  }

  flag(row, col) {
    if (!this.board) return null;
    
    const result = this.board.flagCell(row, col);
    
    if (result) {
      this.emit('flag', result);
      
      if (result.type === 'win') {
        this.stopTimer();
        this.emit('gameover', { won: true });
      }
    }
    
    return result;
  }

  reset() {
    this.init(this.difficulty);
    this.emit('reset');
  }

  changeDifficulty(difficulty) {
    this.difficulty = difficulty;
    this.init(difficulty);
  }

  startTimer() {
    this.stopTimer();
    this.seconds = 0;
    this.timer = setInterval(() => {
      this.seconds++;
      this.emit('timer', this.seconds);
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  getTime() {
    return this.seconds;
  }

  getStats() {
    return this.board ? this.board.getStats() : null;
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}
