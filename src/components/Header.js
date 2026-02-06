export class HeaderComponent {
  constructor(counter, timer, gameStatus) {
    this.counter = counter;
    this.timer = timer;
    this.gameStatus = gameStatus;
    this.element = this.createElement();
  }

  createElement() {
    const header = document.createElement('header');
    header.className = 'header';
    
    const leftSection = document.createElement('div');
    leftSection.className = 'header__section';
    leftSection.appendChild(this.counter.getElement());
    
    const centerSection = document.createElement('div');
    centerSection.className = 'header__section';
    centerSection.appendChild(this.gameStatus.getElement());
    
    const rightSection = document.createElement('div');
    rightSection.className = 'header__section';
    rightSection.appendChild(this.timer.getElement());
    
    header.appendChild(leftSection);
    header.appendChild(centerSection);
    header.appendChild(rightSection);
    
    return header;
  }

  getElement() {
    return this.element;
  }
}
