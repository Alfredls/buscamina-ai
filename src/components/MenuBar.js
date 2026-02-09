export class MenuBarComponent {
  constructor(onDifficultyChange, onHelpClick) {
    this.onDifficultyChange = onDifficultyChange;
    this.onHelpClick = onHelpClick;
    this.currentDifficulty = 'BEGINNER';
    this.openMenu = null;
    this.element = this.createElement();
    this.bindEvents();
  }

  createElement() {
    const nav = document.createElement('nav');
    nav.className = 'menu-bar';

    const juego = this.createMenuItem('Juego', 'juego');
    const juegoDropdown = this.createDropdown('juego', [
      { key: 'BEGINNER', label: 'Principiante' },
      { key: 'INTERMEDIATE', label: 'Intermedio' },
      { key: 'ADVANCED', label: 'Avanzado' }
    ]);
    nav.appendChild(juego);
    nav.appendChild(juegoDropdown);

    const ayuda = this.createMenuItem('Ayuda', 'ayuda');
    const ayudaDropdown = this.createDropdown('ayuda', [
      { key: 'help', label: 'Ayuda' }
    ]);
    nav.appendChild(ayuda);
    nav.appendChild(ayudaDropdown);

    return nav;
  }

  createMenuItem(label, name) {
    const item = document.createElement('button');
    item.className = 'menu-bar__item';
    item.dataset.menu = name;
    item.textContent = label;
    return item;
  }

  createDropdown(menuName, items) {
    const dropdown = document.createElement('div');
    dropdown.className = 'menu-bar__dropdown';
    dropdown.dataset.dropdown = menuName;

    items.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'menu-bar__option';
      btn.dataset.action = item.key;
      btn.textContent = item.label;
      if (item.key === this.currentDifficulty) {
        btn.classList.add('menu-bar__option--active');
      }
      dropdown.appendChild(btn);
    });

    return dropdown;
  }

  bindEvents() {
    this.element.addEventListener('click', (e) => {
      const menuItem = e.target.closest('.menu-bar__item');
      if (menuItem) {
        const menu = menuItem.dataset.menu;
        this.toggleMenu(menu);
      }

      const option = e.target.closest('.menu-bar__option');
      if (option) {
        const action = option.dataset.action;
        if (action === 'help') {
          this.onHelpClick();
        } else {
          this.setActiveDifficulty(action);
          this.onDifficultyChange(action);
        }
        this.closeAllMenus();
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.menu-bar')) {
        this.closeAllMenus();
      }
    });
  }

  toggleMenu(menu) {
    if (this.openMenu === menu) {
      this.closeAllMenus();
    } else {
      this.closeAllMenus();
      this.element.querySelector(`[data-dropdown="${menu}"]`).classList.add('menu-bar__dropdown--open');
      this.element.querySelector(`[data-menu="${menu}"]`).classList.add('menu-bar__item--active');
      this.openMenu = menu;
    }
  }

  closeAllMenus() {
    this.element.querySelectorAll('.menu-bar__dropdown').forEach(d => d.classList.remove('menu-bar__dropdown--open'));
    this.element.querySelectorAll('.menu-bar__item').forEach(i => i.classList.remove('menu-bar__item--active'));
    this.openMenu = null;
  }

  setActiveDifficulty(difficulty) {
    this.currentDifficulty = difficulty;
    this.element.querySelectorAll('.menu-bar__option').forEach(opt => {
      opt.classList.remove('menu-bar__option--active');
      if (opt.dataset.action === difficulty) {
        opt.classList.add('menu-bar__option--active');
      }
    });
  }

  setDifficulty(difficulty) {
    this.currentDifficulty = difficulty;
    this.setActiveDifficulty(difficulty);
  }

  getElement() {
    return this.element;
  }
}
