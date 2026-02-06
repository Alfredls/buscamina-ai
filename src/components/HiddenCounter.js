export class HiddenCounterComponent {
  constructor() {
    this.value = 0;
    this.element = this.createElement();
    this.updateDisplay();
  }

  createElement() {
    const div = document.createElement('div');
    div.className = 'hidden-counter';
    div.innerHTML = `
      <div class="hidden-counter__label">OCULTAS</div>
      <div class="hidden-counter__value">000</div>
    `;
    return div;
  }

  updateDisplay() {
    const display = Math.max(0, this.value).toString().padStart(3, '0');
    this.element.querySelector('.hidden-counter__value').textContent = display;
  }

  setValue(value) {
    this.value = value;
    this.updateDisplay();
  }

  decrement() {
    this.value = Math.max(0, this.value - 1);
    this.updateDisplay();
  }

  reset() {
    this.value = 0;
    this.updateDisplay();
  }

  getElement() {
    return this.element;
  }
}
