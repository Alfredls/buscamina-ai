export class TimerComponent {
  constructor() {
    this.seconds = 0;
    this.element = this.createElement();
    this.interval = null;
  }

  createElement() {
    const div = document.createElement('div');
    div.className = 'timer';
    this.updateDisplay();
    return div;
  }

  updateDisplay() {
    const display = Math.min(999, this.seconds);
    this.element.textContent = display.toString().padStart(3, '0');
  }

  start() {
    this.stop();
    this.seconds = 0;
    this.updateDisplay();
    this.interval = setInterval(() => {
      this.seconds++;
      this.updateDisplay();
    }, 1000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  setTime(seconds) {
    this.seconds = Math.max(0, Math.min(999, seconds));
    this.updateDisplay();
  }

  reset() {
    this.stop();
    this.seconds = 0;
    this.updateDisplay();
  }

  getTime() {
    return this.seconds;
  }

  getElement() {
    return this.element;
  }
}
