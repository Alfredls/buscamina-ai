import { DIFFICULTY, CELL_STATE } from './constants.js';

export function createEmptyBoard(rows, cols) {
  const board = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        state: CELL_STATE.HIDDEN,
        hasMine: false,
        adjacentMines: 0,
        element: null
      });
    }
    board.push(row);
  }
  return board;
}

export function placeMines(board, excludeRow, excludeCol, totalMines) {
  const { rows, cols } = getBoardDimensions(board);
  let placed = 0;
  const tempBoard = board.map(row => row.map(cell => cell.hasMine));
  
  while (placed < totalMines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    
    const isExcluded = (r === excludeRow && c === excludeCol) ||
                       tempBoard[r][c];
    
    if (!isExcluded) {
      board[r][c].hasMine = true;
      tempBoard[r][c] = true;
      placed++;
    }
  }
  
  calculateAdjacentMines(board);
  
  return board;
}

export function calculateAdjacentMines(board) {
  const { rows, cols } = getBoardDimensions(board);
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].hasMine) {
        board[r][c].adjacentMines = countAdjacentMines(board, r, c);
      }
    }
  }
}

export function countAdjacentMines(board, row, col) {
  const { rows, cols } = getBoardDimensions(board);
  let count = 0;
  
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      
      const nr = row + dr;
      const nc = col + dc;
      
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        if (board[nr][nc].hasMine) {
          count++;
        }
      }
    }
  }
  
  return count;
}

export function getBoardDimensions(board) {
  return {
    rows: board.length,
    cols: board[0]?.length || 0
  };
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
  let count = 0;
  board.forEach(row => {
    row.forEach(cell => {
      if (cell.state === CELL_STATE.FLAGGED) {
        count++;
      }
    });
  });
  return count;
}

export function countHiddenCells(board) {
  let count = 0;
  board.forEach(row => {
    row.forEach(cell => {
      if (cell.state === CELL_STATE.HIDDEN) {
        count++;
      }
    });
  });
  return count;
}

export function checkWinCondition(board, totalMines) {
  const hiddenCells = countHiddenCells(board);
  return hiddenCells === totalMines;
}
