export class HelpModalComponent {
  constructor(onUseHelp, onClose) {
    this.onUseHelp = onUseHelp;
    this.onClose = onClose;
    this.element = null;
  }

  show(helpStats) {
    this.remove();

    const overlay = document.createElement('div');
    overlay.className = 'help-modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'help-modal-window';

    const titleBar = document.createElement('div');
    titleBar.className = 'help-modal__title-bar';

    const icon = document.createElement('span');
    icon.className = 'help-modal__icon';
    icon.textContent = '💡';

    const title = document.createElement('span');
    title.className = 'help-modal__title';
    title.textContent = 'Ayuda - Pistas';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'help-modal__close';
    closeBtn.textContent = '✕';

    titleBar.appendChild(icon);
    titleBar.appendChild(title);
    titleBar.appendChild(closeBtn);

    const content = document.createElement('div');
    content.className = 'help-modal__content';

    const summary = document.createElement('p');
    summary.className = 'help-modal__summary';
    summary.textContent = `Pistas restantes: ${helpStats.remaining} de ${helpStats.total}`;

    const options = document.createElement('div');
    options.className = 'help-modal__options';

    const usedBombs = helpStats.used - (helpStats.bombs > 0 ? Math.max(0, helpStats.used - (helpStats.total - helpStats.bombs)) : 0);
    const usedSafe = helpStats.used - (helpStats.total - helpStats.bombs > 0 ? Math.max(0, helpStats.used - helpStats.bombs) : 0);

    const remainingBombs = Math.max(0, helpStats.bombs - usedBombs);
    const remainingSafe = Math.max(0, helpStats.safe - usedSafe);

    const bombBtn = document.createElement('button');
    bombBtn.className = 'help-modal__option';
    bombBtn.disabled = remainingBombs <= 0 || helpStats.remaining <= 0;
    bombBtn.innerHTML = `
      <span class="help-modal__option-icon">🚩</span>
      <span class="help-modal__option-text">Descubrir Mina</span>
      <span class="help-modal__option-count">${remainingBombs}</span>
    `;
    bombBtn.addEventListener('click', () => {
      this.remove();
      this.onUseHelp('bomb');
    });

    const safeBtn = document.createElement('button');
    safeBtn.className = 'help-modal__option';
    safeBtn.disabled = remainingSafe <= 0 || helpStats.remaining <= 0;
    safeBtn.innerHTML = `
      <span class="help-modal__option-icon">✅</span>
      <span class="help-modal__option-text">Celda Segura</span>
      <span class="help-modal__option-count">${remainingSafe}</span>
    `;
    safeBtn.addEventListener('click', () => {
      this.remove();
      this.onUseHelp('safe');
    });

    options.appendChild(bombBtn);
    options.appendChild(safeBtn);

    content.appendChild(summary);
    content.appendChild(options);

    modal.appendChild(titleBar);
    modal.appendChild(content);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    this.element = overlay;

    closeBtn.addEventListener('click', () => {
      this.remove();
      this.onClose();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.remove();
        this.onClose();
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
