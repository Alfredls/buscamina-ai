import { DIFFICULTY } from '../utils/constants.js';

export class ControlsComponent {
  constructor(onDifficultyChange, onHelpClick) {
    this.onDifficultyChange = onDifficultyChange;
    this.onHelpClick = onHelpClick;
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

    const helpBtn = document.createElement('button');
    helpBtn.className = 'controls__btn controls__btn--help';
    helpBtn.innerHTML = '💡 <span class="controls__help-text">Ayuda</span>';
    helpBtn.dataset.action = 'help';
    div.appendChild(helpBtn);

    return div;
  }

  bindEvents() {
    this.element.addEventListener('click', (e) => {
      if (e.target.classList.contains('controls__btn')) {
        if (e.target.dataset.difficulty) {
          const difficulty = e.target.dataset.difficulty;
          this.setActiveButton(difficulty);
          this.onDifficultyChange(difficulty);
        } else if (e.target.dataset.action === 'help' || e.target.closest('[data-action="help"]')) {
          this.onHelpClick();
        }
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
