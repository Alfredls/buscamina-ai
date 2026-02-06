import { CELL_STATE } from '../utils/constants.js';

export class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.state = CELL_STATE.HIDDEN;
    this.hasMine = false;
    this.adjacentMines = 0;
    this.element = null;
  }

  reveal() {
    if (this.state === CELL_STATE.FLAGGED || this.state === CELL_STATE.REVEALED) {
      return false;
    }
    
    this.state = CELL_STATE.REVEALED;
    return true;
  }

  flag() {
    if (this.state === CELL_STATE.REVEALED) {
      return false;
    }
    
    if (this.state === CELL_STATE.FLAGGED) {
      this.state = CELL_STATE.HIDDEN;
    } else {
      this.state = CELL_STATE.FLAGGED;
    }
    return true;
  }

  explode() {
    this.state = CELL_STATE.EXPLODED;
  }

  hasFlag() {
    return this.state === CELL_STATE.FLAGGED;
  }

  isHidden() {
    return this.state === CELL_STATE.HIDDEN;
  }

  isRevealed() {
    return this.state === CELL_STATE.REVEALED || this.state === CELL_STATE.EXPLODED;
  }

  isMine() {
    return this.hasMine;
  }

  isEmpty() {
    return !this.hasMine && this.adjacentMines === 0;
  }
}
