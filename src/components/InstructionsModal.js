export class InstructionsModalComponent {
  constructor(onClose) {
    this.onClose = onClose;
    this.element = null;
  }

  show() {
    this.remove();

    const overlay = document.createElement('div');
    overlay.className = 'instructions-modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'instructions-modal-window';

    const titleBar = document.createElement('div');
    titleBar.className = 'instructions-modal__title-bar';

    const icon = document.createElement('span');
    icon.className = 'instructions-modal__icon';
    icon.textContent = '❓';

    const title = document.createElement('span');
    title.className = 'instructions-modal__title';
    title.textContent = 'Cómo jugar';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'instructions-modal__close';
    closeBtn.textContent = '✕';

    titleBar.appendChild(icon);
    titleBar.appendChild(title);
    titleBar.appendChild(closeBtn);

    const content = document.createElement('div');
    content.className = 'instructions-modal__content';

    const intro = document.createElement('p');
    intro.className = 'instructions-modal__text';
    intro.textContent = 'El objetivo del juego es descubrir todas las casillas que no contienen minas.';
    content.appendChild(intro);

    const section1 = document.createElement('div');
    section1.className = 'instructions-modal__section';
    const h3_1 = document.createElement('h3');
    h3_1.textContent = 'Objetivo';
    section1.appendChild(h3_1);
    const p1 = document.createElement('p');
    p1.className = 'instructions-modal__text';
    p1.textContent = 'Encuentra todas las minas sin hacer clic en ellas. Ganas cuando todas las casillas seguras están reveladas.';
    section1.appendChild(p1);
    content.appendChild(section1);

    const section2 = document.createElement('div');
    section2.className = 'instructions-modal__section';
    const h3_2 = document.createElement('h3');
    h3_2.textContent = 'Controles';
    section2.appendChild(h3_2);
    const ul2 = document.createElement('ul');
    ul2.className = 'instructions-modal__list';
    const li1 = document.createElement('li');
    li1.innerHTML = '<strong>Clic izquierdo:</strong> Revelar una casilla';
    ul2.appendChild(li1);
    const li2 = document.createElement('li');
    li2.innerHTML = '<strong>Clic derecho:</strong> Colocar/Quitar bandera';
    ul2.appendChild(li2);
    section2.appendChild(ul2);
    content.appendChild(section2);

    const section3 = document.createElement('div');
    section3.className = 'instructions-modal__section';
    const h3_3 = document.createElement('h3');
    h3_3.textContent = 'Números';
    section3.appendChild(h3_3);
    const p3 = document.createElement('p');
    p3.className = 'instructions-modal__text';
    p3.textContent = 'Los números indican cuántas minas hay en las 8 casillas adyacentes. Úsalos para deducir dónde están las minas.';
    section3.appendChild(p3);
    content.appendChild(section3);

    const section4 = document.createElement('div');
    section4.className = 'instructions-modal__section';
    const h3_4 = document.createElement('h3');
    h3_4.textContent = 'Ayuda';
    section4.appendChild(h3_4);
    const p4 = document.createElement('p');
    p4.className = 'instructions-modal__text';
    p4.textContent = 'Usa el menú Ayuda para revelar una mina automáticamente. ¡Úsala sabiamente!';
    section4.appendChild(p4);
    content.appendChild(section4);

    const okBtn = document.createElement('button');
    okBtn.className = 'instructions-modal__ok';
    okBtn.textContent = 'Aceptar';
    content.appendChild(okBtn);

    modal.appendChild(titleBar);
    modal.appendChild(content);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    this.element = overlay;

    const close = () => {
      this.remove();
      this.onClose();
    };

    closeBtn.addEventListener('click', close);
    okBtn.addEventListener('click', close);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        close();
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
