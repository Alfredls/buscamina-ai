import { DIFFICULTY, CELL_STATE } from './constants.js';

export function getBoardDimensions(board) {
  return {
    rows: board.length,
    cols: board[0]?.length || 0
  };
}

export function countAdjacentMines(board, row, col) {
  const { rows, cols } = getBoardDimensions(board);
  let count = 0;
  
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      
      const nr = row + dr;
      const nc = col + dc;
      
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].hasMine) {
        count++;
      }
    }
  }
  
  return count;
}

export function getNeighbors(board, row, col) {
  const { rows, cols } = getBoardDimensions(board);
  const neighbors = [];
  
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      
      const nr = row + dr;
      const nc = col + dc;
      
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        neighbors.push(board[nr][nc]);
      }
    }
  }
  
  return neighbors;
}

export function countFlaggedCells(board) {
  return board.flat().filter(cell => cell.state === CELL_STATE.FLAGGED).length;
}

export function countHiddenCells(board) {
  return board.flat().filter(cell => cell.state === CELL_STATE.HIDDEN).length;
}

export function checkWinCondition(board, totalMines) {
  return countHiddenCells(board) === totalMines;
}
