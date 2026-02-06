export class CounterComponent {
  constructor(initialValue = 0) {
    this.value = initialValue;
    this.element = this.createElement();
  }

  createElement() {
    const div = document.createElement('div');
    div.className = 'counter';
    this.updateDisplay();
    return div;
  }

  updateDisplay() {
    const display = Math.max(-99, Math.min(999, this.value));
    const text = display.toString().padStart(3, '0');
    this.element.textContent = text.startsWith('-') ? text : text;
    
    if (this.value < 0) {
      this.element.classList.add('counter--negative');
    } else {
      this.element.classList.remove('counter--negative');
    }
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
