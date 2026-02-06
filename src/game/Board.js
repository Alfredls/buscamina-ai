import { Cell } from './Cell.js';
import { 
  countAdjacentMines,
  getNeighbors,
  checkWinCondition
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

  initialize() {
    this.grid = [];
    for (let r = 0; r < this.rows; r++) {
      const row = [];
      for (let c = 0; c < this.cols; c++) {
        row.push(new Cell(r, c));
      }
      this.grid.push(row);
    }
    this.firstClick = true;
    this.gameOver = false;
    this.status = GAME_STATUS.READY;
  }

  placeMines(excludeRow, excludeCol) {
    let placed = 0;
    
    while (placed < this.totalMines) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      
      const isExcluded = (r === excludeRow && c === excludeCol) ||
                         this.grid[r][c].hasMine;
      
      if (!isExcluded) {
        this.grid[r][c].hasMine = true;
        placed++;
      }
    }
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!this.grid[r][c].hasMine) {
          this.grid[r][c].adjacentMines = countAdjacentMines(this.grid, r, c);
        }
      }
    }
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
      const flaggedCount = this.grid.flat().filter(c => c.hasFlag()).length;
      if (checkWinCondition(this.grid, this.totalMines) && flaggedCount === this.totalMines) {
        this.gameOver = true;
        this.status = GAME_STATUS.WON;
        return { type: 'win', cell, flaggedCount };
      }
      return { type: 'flag', cell, changed, flaggedCount };
    }
    
    return null;
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
      flaggedCount: this.grid.flat().filter(c => c.hasFlag()).length,
      hiddenCount: this.grid.flat().filter(c => c.state === CELL_STATE.HIDDEN).length,
      status: this.status,
      isGameOver: this.gameOver
    };
  }
}
