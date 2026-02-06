export class CounterComponent {
  constructor(initialValue = 0) {
    this.value = initialValue;
    this.element = this.createElement();
    this.updateDisplay();
  }

  createElement() {
    const div = document.createElement('div');
    div.className = 'mine-counter';
    div.innerHTML = `
      <div class="mine-counter__label">BOMBAS</div>
      <div class="mine-counter__value">000</div>
    `;
    return div;
  }

  updateDisplay() {
    const display = Math.max(-99, Math.min(999, this.value));
    const text = display.toString().padStart(3, '0');
    this.element.querySelector('.mine-counter__value').textContent = text;
  }

  setValue(value) {
    this.value = value;
    this.updateDisplay();
  }

  increment() {
    this.value++;
    this.updateDisplay();
  }

  decrement() {
    this.value--;
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
