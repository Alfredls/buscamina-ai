import { CellComponent } from './Cell.js';

export class BoardComponent {
  constructor(board, onCellClick, onCellRightClick) {
    this.board = board;
    this.onCellClick = onCellClick;
    this.onCellRightClick = onCellRightClick;
    this.cells = [];
    this.element = this.createElement();
  }

  createElement() {
    const div = document.createElement('div');
    div.className = 'board';
    return div;
  }

  render() {
    this.element.innerHTML = '';
    this.cells = [];
    this.element.className = 'board';
    this.element.style.gridTemplateColumns = `repeat(${this.board.cols}, 24px)`;
    this.element.style.gridTemplateRows = `repeat(${this.board.rows}, 24px)`;

    for (let r = 0; r < this.board.rows; r++) {
      for (let c = 0; c < this.board.cols; c++) {
        const cell = this.board.getCell(r, c);
        const cellComponent = new CellComponent(
          cell,
          this.onCellClick,
          this.onCellRightClick
        );
        this.cells.push(cellComponent);
        this.element.appendChild(cellComponent.element);
      }
    }
  }

  updateCell(row, col) {
    const index = row * this.board.cols + col;
    if (this.cells[index]) {
      this.cells[index].update();
    }
  }

  updateAll() {
    this.cells.forEach(cell => cell.update());
  }

  revealCells(cells) {
    cells.forEach(cell => {
      this.updateCell(cell.row, cell.col);
    });
  }

  destroy() {
    this.cells.forEach(cell => cell.destroy());
    this.cells = [];
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
