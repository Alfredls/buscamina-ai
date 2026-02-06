import { CELL_STATE, NUMBERS, ICONS } from '../utils/constants.js';

export class CellComponent {
  constructor(cell, onClick, onRightClick) {
    this.cell = cell;
    this.onClick = onClick;
    this.onRightClick = onRightClick;
    this.element = this.createElement();
    this.bindEvents();
  }

  createElement() {
    const div = document.createElement('div');
    div.className = 'cell';
    div.dataset.row = this.cell.row;
    div.dataset.col = this.cell.col;
    return div;
  }

  bindEvents() {
    this.element.addEventListener('click', (e) => {
      e.preventDefault();
      this.onClick(this.cell.row, this.cell.col);
    });

    this.element.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.onRightClick(this.cell.row, this.cell.col);
    });

    this.element.addEventListener('mousedown', (e) => {
      if (e.button === 0 && this.cell.state === CELL_STATE.HIDDEN) {
        this.element.classList.add('cell--hover');
      }
    });

    this.element.addEventListener('mouseup', () => {
      this.element.classList.remove('cell--hover');
    });

    this.element.addEventListener('mouseleave', () => {
      this.element.classList.remove('cell--hover');
    });
  }

  update() {
    this.element.className = 'cell';

    switch (this.cell.state) {
      case CELL_STATE.REVEALED:
        this.element.classList.add('cell--revealed');
        if (this.cell.hasMine) {
          this.element.classList.add('cell--mine');
          this.element.textContent = ICONS.MINE;
        } else if (this.cell.adjacentMines > 0) {
          this.element.classList.add(`cell--${this.cell.adjacentMines}`);
          this.element.textContent = NUMBERS[this.cell.adjacentMines];
        }
        break;

      case CELL_STATE.FLAGGED:
        this.element.classList.add('cell--flagged');
        this.element.textContent = ICONS.FLAG;
        break;

      case CELL_STATE.EXPLODED:
        this.element.classList.add('cell--revealed', 'cell--mine', 'cell--exploded');
        this.element.textContent = ICONS.EXPLODED;
        break;

      case CELL_STATE.HIDDEN:
      default:
        this.element.textContent = '';
        break;
    }
  }

  reveal() {
    this.update();
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
