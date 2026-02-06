export class ModalComponent {
  constructor(onRestart, onNewGame) {
    this.onRestart = onRestart;
    this.onNewGame = onNewGame;
    this.element = null;
  }

  show(won, message) {
    this.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal-window';

    const titleBar = document.createElement('div');
    titleBar.className = 'modal__title-bar';

    const icon = document.createElement('span');
    icon.className = 'modal__icon';
    icon.textContent = won ? '😊' : '😵';

    const title = document.createElement('span');
    title.className = 'modal__title';
    title.textContent = won ? '¡Victoria!' : '¡Perdiste!';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal__close';
    closeBtn.textContent = '✕';

    titleBar.appendChild(icon);
    titleBar.appendChild(title);
    titleBar.appendChild(closeBtn);

    const content = document.createElement('div');
    content.className = 'modal__content';

    const messageEl = document.createElement('p');
    messageEl.className = 'modal__message';
    messageEl.textContent = message;

    const iconLarge = document.createElement('div');
    iconLarge.className = 'modal__icon-large';
    iconLarge.textContent = won ? '😎' : '💥';

    content.appendChild(iconLarge);
    content.appendChild(messageEl);

    const buttons = document.createElement('div');
    buttons.className = 'modal__buttons';

    const restartBtn = document.createElement('button');
    restartBtn.className = 'modal__btn';
    restartBtn.textContent = 'Reiniciar';

    const newGameBtn = document.createElement('button');
    newGameBtn.className = 'modal__btn';
    newGameBtn.textContent = 'Nuevo Juego';

    buttons.appendChild(restartBtn);
    buttons.appendChild(newGameBtn);

    modal.appendChild(titleBar);
    modal.appendChild(content);
    modal.appendChild(buttons);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    this.element = overlay;

    restartBtn.addEventListener('click', () => {
      this.remove();
      this.onRestart();
    });

    newGameBtn.addEventListener('click', () => {
      this.remove();
      this.onNewGame();
    });

    closeBtn.addEventListener('click', () => {
      this.remove();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.remove();
      }
    });
  }

  remove() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
  }
}
