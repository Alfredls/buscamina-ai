import { Cell } from './Cell.js';
import { 
  createEmptyBoard, 
  placeMines, 
  calculateAdjacentMines,
  getNeighbors,
  checkWinCondition,
  getBoardDimensions
} from '../utils/helpers.js';
import { DIFFICULTY, CELL_STATE, GAME_STATUS } from '../utils/constants.js';

export class Board {
  constructor(difficulty = DIFFICULTY.BEGINNER) {
    this.rows = difficulty.rows;
    this.cols = difficulty.cols;
    this.totalMines = difficulty.mines;
    this.grid = [];
    this.firstClick = true;
    this.gameOver = false;
    this.status = GAME_STATUS.READY;
  }

  initialize(excludeRow = null, excludeCol = null) {
    this.grid = createEmptyBoard(this.rows, this.cols);
    this.placeMinesSafe(excludeRow, excludeCol);
    this.firstClick = true;
    this.gameOver = false;
    this.status = GAME_STATUS.READY;
  }

  placeMinesSafe(excludeRow, excludeCol) {
    let excludeR = excludeRow;
    let excludeC = excludeCol;
    
    if (excludeR === null || excludeC === null) {
      excludeR = Math.floor(Math.random() * this.rows);
      excludeC = Math.floor(Math.random() * this.cols);
    }
    
    placeMines(this.grid, excludeR, excludeC, this.totalMines);
  }

  clickCell(row, col) {
    if (this.gameOver) return null;
    
    const cell = this.grid[row][col];
    
    if (cell.hasFlag()) return null;
    
    if (this.firstClick) {
      this.firstClick = false;
      this.status = GAME_STATUS.PLAYING;
    }
    
    if (cell.hasMine) {
      cell.explode();
      this.gameOver = true;
      this.status = GAME_STATUS.LOST;
      return { type: 'explosion', cell };
    }
    
    const revealed = this.revealCell(row, col);
    
    if (checkWinCondition(this.grid, this.totalMines)) {
      this.gameOver = true;
      this.status = GAME_STATUS.WON;
      return { type: 'win', revealed };
    }
    
    return { type: 'reveal', revealed };
  }

  revealCell(row, col) {
    const cell = this.grid[row][col];
    
    if (!cell.reveal()) return [];
    
    if (cell.hasMine) return [cell];
    
    if (cell.adjacentMines > 0) return [cell];
    
    const neighbors = getNeighbors(this.grid, row, col);
    let revealed = [cell];
    
    for (const neighbor of neighbors) {
      if (neighbor.isHidden() && !neighbor.hasFlag()) {
        revealed = revealed.concat(this.revealCell(neighbor.row, neighbor.col));
      }
    }
    
    return revealed;
  }

  flagCell(row, col) {
    if (this.gameOver) return null;
    
    const cell = this.grid[row][col];
    
    if (cell.isRevealed()) return null;
    
    const changed = cell.flag();
    
    if (changed) {
      const flaggedCount = this.countFlagged();
      if (checkWinCondition(this.grid, this.totalMines) && flaggedCount === this.totalMines) {
        this.gameOver = true;
        this.status = GAME_STATUS.WON;
        return { type: 'win', cell, flaggedCount };
      }
    }
    
    return { type: 'flag', cell, changed, flaggedCount: this.countFlagged() };
  }

  countFlagged() {
    let count = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c].hasFlag()) count++;
      }
    }
    return count;
  }

  getCell(row, col) {
    return this.grid[row]?.[col] || null;
  }

  revealAllMines(exceptFlagged = true) {
    const revealed = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (cell.hasMine && (!exceptFlagged || !cell.hasFlag())) {
          cell.state = CELL_STATE.REVEALED;
          revealed.push(cell);
        }
      }
    }
    return revealed;
  }

  getStats() {
    return {
      rows: this.rows,
      cols: this.cols,
      totalMines: this.totalMines,
      flaggedCount: this.countFlagged(),
      hiddenCount: this.grid.flat().filter(c => c.state === CELL_STATE.HIDDEN).length,
      status: this.status,
      isGameOver: this.gameOver
    };
  }
}
