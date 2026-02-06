import { DIFFICULTY } from '../utils/constants.js';

export class ControlsComponent {
  constructor(onDifficultyChange) {
    this.onDifficultyChange = onDifficultyChange;
    this.currentDifficulty = 'BEGINNER';
    this.element = this.createElement();
    this.bindEvents();
  }

  createElement() {
    const div = document.createElement('div');
    div.className = 'controls';
    
    const difficulties = [
      { key: 'BEGINNER', label: 'principiante' },
      { key: 'INTERMEDIATE', label: 'intermedio' },
      { key: 'ADVANCED', label: 'avanzado' }
    ];
    
    difficulties.forEach(({ key, label }) => {
      const btn = document.createElement('button');
      btn.className = 'controls__btn';
      btn.dataset.difficulty = key;
      btn.textContent = label;
      if (key === this.currentDifficulty) {
        btn.classList.add('controls__btn--active');
      }
      div.appendChild(btn);
    });
    
    return div;
  }

  bindEvents() {
    this.element.addEventListener('click', (e) => {
      if (e.target.classList.contains('controls__btn')) {
        const difficulty = e.target.dataset.difficulty;
        this.setActiveButton(difficulty);
        this.onDifficultyChange(difficulty);
      }
    });
  }

  setActiveButton(difficulty) {
    this.element.querySelectorAll('.controls__btn').forEach(btn => {
      btn.classList.remove('controls__btn--active');
      if (btn.dataset.difficulty === difficulty) {
        btn.classList.add('controls__btn--active');
      }
    });
    this.currentDifficulty = difficulty;
  }

  setDifficulty(difficulty) {
    this.currentDifficulty = difficulty;
    this.setActiveButton(difficulty);
  }

  getElement() {
    return this.element;
  }
}
