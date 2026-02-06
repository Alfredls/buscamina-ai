import { ICONS } from '../utils/constants.js';

export class GameStatusComponent {
  constructor(onReset) {
    this.onReset = onReset;
    this.element = this.createElement();
    this.bindEvents();
  }

  createElement() {
    const div = document.createElement('div');
    div.className = 'game-status game-status--playing';
    div.textContent = ICONS.HAPPY;
    return div;
  }

  bindEvents() {
    this.element.addEventListener('click', () => {
      this.onReset();
    });
  }

  setStatus(status) {
    this.element.className = 'game-status';
    
    switch (status) {
      case 'playing':
        this.element.classList.add('game-status--playing');
        this.element.textContent = ICONS.HAPPY;
        break;
      case 'won':
        this.element.classList.add('game-status--won');
        this.element.textContent = ICONS.COOL;
        break;
      case 'lost':
        this.element.classList.add('game-status--lost');
        this.element.textContent = ICONS.DEAD;
        break;
      default:
        this.element.textContent = ICONS.HAPPY;
    }
  }

  getElement() {
    return this.element;
  }
}
