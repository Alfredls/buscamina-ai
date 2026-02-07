import { BoardComponent } from './components/Board.js';
import { HeaderComponent } from './components/Header.js';
import { ControlsComponent } from './components/Controls.js';
import { CounterComponent } from './components/Counter.js';
import { TimerComponent } from './components/Timer.js';
import { GameStatusComponent } from './components/GameStatus.js';
import { HiddenCounterComponent } from './components/HiddenCounter.js';
import { ModalComponent } from './components/Modal.js';
import { Game } from './game/Game.js';
import { DIFFICULTY, CELL_STATE } from './utils/constants.js';

class App {
  constructor() {
    this.game = new Game();
    this.counter = new CounterComponent(0);
    this.timer = new TimerComponent(0);
    this.gameStatus = new GameStatusComponent(() => this.reset());
    this.hiddenCounter = new HiddenCounterComponent();
    this.modal = new ModalComponent(
      () => this.reset(),
      () => this.newGame()
    );
    this.header = new HeaderComponent(this.counter, this.timer, this.gameStatus, this.hiddenCounter);
    this.board = null;
    this.controls = new ControlsComponent((difficulty) => this.changeDifficulty(difficulty));
    this.appElement = document.getElementById('app');
    this.clockInterval = null;
    this.currentDifficulty = 'BEGINNER';
  }

  init() {
    this.bindGameEvents();
    this.game.init(DIFFICULTY.BEGINNER);
    this.render();
  }

  render() {
    this.appElement.innerHTML = '';
    this.appElement.className = 'app';

    this.createTaskbar();
    this.createDesktopIcons();

    const gameWindow = document.createElement('div');
    gameWindow.className = 'game-window';

    const titleBar = document.createElement('div');
    titleBar.className = 'game-window__title-bar';

    const title = document.createElement('span');
    title.className = 'game-window__title';
    title.innerHTML = '💣 Buscamina';

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'game-window__controls';

    const minimizeBtn = document.createElement('button');
    minimizeBtn.className = 'game-window__btn';
    minimizeBtn.textContent = '─';

    const maximizeBtn = document.createElement('button');
    maximizeBtn.className = 'game-window__btn';
    maximizeBtn.textContent = '□';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'game-window__btn';
    closeBtn.textContent = '✕';

    controlsDiv.appendChild(minimizeBtn);
    controlsDiv.appendChild(maximizeBtn);
    controlsDiv.appendChild(closeBtn);

    titleBar.appendChild(title);
    titleBar.appendChild(controlsDiv);

    gameWindow.appendChild(titleBar);
    gameWindow.appendChild(this.header.getElement());
    gameWindow.appendChild(this.controls.getElement());

    this.board = new BoardComponent(
      this.game.board,
      (row, col) => this.handleCellClick(row, col),
      (row, col) => this.handleCellRightClick(row, col)
    );
    this.board.render();
    gameWindow.appendChild(this.board.element);

    this.appElement.appendChild(gameWindow);

    this.counter.setValue(this.game.board.totalMines);
    this.hiddenCounter.setValue(this.game.board.rows * this.game.board.cols - this.game.board.totalMines);
    this.timer.reset();
    this.gameStatus.setStatus('playing');

    this.startClock();
  }

  createTaskbar() {
    const taskbar = document.createElement('div');
    taskbar.className = 'taskbar';

    const startBtn = document.createElement('button');
    startBtn.className = 'taskbar__start';
    startBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="254" height="208" fill="none" viewBox="0 0 254 208"><path fill="#3d87cf" d="m108.772 160.204 6.708-62.718c10.33-3.638 28.016-6.138 39.276-6.569l-6.896 64.526c-10.997.354-28.733 2.05-39.088 4.761"/><path fill="#fac705" d="m199.88 102.293-7.059 64.864c-9.427-4.278-33.771-10.542-44.956-11.71l6.896-64.525c11.279.79 36.27 5.786 45.119 11.371"/><path fill="#66c557" d="m207.633 41.855-7.803 60.464c-9.231-4.803-33.697-10.476-45.119-11.37l6.918-64.65c11.334.57 37.104 9.576 46.004 15.556"/><path fill="#f3632e" d="m115.481 97.523 6.839-63.486c10.363-3.415 28.27-6.767 39.355-7.732l-6.918 64.649c-11.217.068-28.921 3.333-39.276 6.57"/><path fill="#3d87cf" d="m45.504 140.407-10.832 2.937c.123-2.461.382-5.253.725-7.632l10.878-3.184c-.16 2.53-.426 5.296-.77 7.879m19.181 4.459-13.61 3.859 1.21-10.635c4.478-1.328 9.024-2.617 13.58-3.763zm21.919-8.9c-.557 4.194-.804 8.59-1.406 12.826l-15.344 4.245 1.403-12.736zm-58.717-2.793-7.858 2.219c.121-2.051.341-4.365.646-6.469 2.668-.804 5.3-1.741 8.004-2.409zm-17.391-7.747c-2.005.641-3.992 1.45-6.027 1.981l.626-5.499c1.99-.694 3.981-1.388 6-1.974zm37.146-5.387-10.844 2.999.733-7.604c3.701-.957 7.315-2.238 10.997-3.16zm19.151 4.62-13.498 3.854 1.068-10.536c4.53-1.344 9.06-2.687 13.629-3.892zm20.63 3.665-15.44 4.098 1.4-12.532 15.338-4.272zm-57.231-16.241c-2.645.68-5.288 1.68-7.981 2.285l.74-6.847 7.876-2.051c-.054 2.09-.292 4.44-.635 6.613m-17.442-7.656L6.73 106.32l.529-5.442c1.915-.76 4.04-1.376 6.086-1.97z"/><path fill="#f3632e" d="m52.123 78.2-10.855 3.06.748-7.755c3.662-1.002 7.292-2.114 10.987-3.098zm5.72 8.514L58.88 76.07l13.509-3.918-1.038 10.644zm34.094-.914-15.374 4.34 1.33-12.686 15.334-4.387zM34.7 70.088c-2.534.88-5.273 1.529-7.88 2.345l.552-6.705c2.512-.962 5.328-1.429 7.903-2.262zM17.175 62.38c-2.005.641-3.966 1.443-6.034 1.954l.652-5.507 5.926-2.04zm37.175-5.022a256 256 0 0 1-10.92 2.933l.812-7.627c3.661-1.002 7.27-2.196 10.946-3.145zm19.152 4.619c-4.512 1.308-9.028 2.705-13.603 3.885l1.184-10.628c4.523-1.372 9.057-2.597 13.602-3.885zm20.535 3.843-15.284 4.257 1.317-12.741 15.374-4.342zM36.864 49.266l-7.922 2.297.662-6.824c2.712-.64 5.299-1.537 7.992-2.143zM19.445 41.45l-6.011 2.037.54-5.504c1.953-.83 4.029-1.314 6.012-2.036z"/><path fill="#000" d="M43.862 161.525a302 302 0 0 1-12.909 3.627l.932-8.743c4.302-1.248 8.667-2.368 13.006-3.684zm74.819-115.641L99.439 51.61l2.044-19.322c6.352-2.66 12.763-5.308 19.405-7zM22.19 21.433l-7.273 2.284.6-6.222c2.45-.77 4.887-1.592 7.352-2.307zM39.783 28.3c-3.282.835-6.528 1.806-9.843 2.621l.802-7.245c3.309-.842 6.543-1.957 9.88-2.69zm57.631 17.169-18.252 5.205 1.578-15.212 18.3-5.133zm-36.787.347 1.146-11.494 16.087-4.635-1.203 11.598zM57.24 36.55l-12.934 3.634.868-8.667c4.302-1.247 8.586-2.665 12.984-3.765zm59.312 29.475a963 963 0 0 1-19.25 5.904l1.925-17.884 19.205-5.657zm-2.237 20.542-19.206 5.862-.12-.025 1.874-17.87 19.355-5.934zM8.287 85.9l.615-6.167 7.35-2.424-.623 6.346zm84.606 26.851 1.863-17.808 19.239-5.842-1.803 17.819zM33.042 91.137l-9.82 2.702.802-7.245c3.308-.842 6.516-1.95 9.854-2.682zm57.642 16.943-18.267 5.151 1.548-15.116 18.326-5.14zm-20.727-4.011L54.02 108.63l-.146-.017 1.258-11.497 16.06-4.628zm-19.438-4.61-12.917 3.6.843-8.66a431 431 0 0 1 13.103-3.74zm59.462 28.156-.027.212-19.24 5.843 1.85-18.271 19.351-5.846zm-2.22 20.614-19.225 6.101-.146-.017 1.998-18.14 19.228-5.78zM8.85 146.548c-2.46.626-4.834 1.577-7.317 2.122l.665-5.978c2.433-.939 4.94-1.607 7.429-2.447zm96.552 23.61c-6.497 1.709-12.938 3.518-19.27 5.939l2.04-19.233 19.341-5.989zM26.39 154.026l-9.848 2.916.679-7.18c3.331-.966 6.58-2.025 9.934-2.911zm57.62 16.351-18.225 4.993 1.633-15.111 18.203-5.075zm-36.693.394 1.221-11.632 16.004-4.524-1.215 11.659zM198.438 47.736c-8.9-5.98-19.796-8.896-31.123-9.44l-4.945 46.108c11.404.93 21.997 3.672 31.221 8.447zm-6.338 60.127c-8.849-5.585-20.039-8.125-31.293-8.922l-4.964 47.078c11.159 1.175 21.894 3.292 31.322 7.57zm25.644-70.926-15.697 146.494c-18.464-14.922-44.905-20.052-69.447-17.784-8.439.811-16.801 2.009-24.916 4.011l2.085-19.07c10.363-2.684 21.01-4.428 32.015-4.756l5.055-47.367c-11.259.431-21.866 3.157-32.196 6.795l1.602-15.54c10.329-3.229 20.926-5.572 32.142-5.64l4.905-45.629c-11.093.938-21.817 3.23-32.18 6.644l2.147-20.607c23.841-7.03 53.333-8.162 77.35 2.52 6.063 2.624 11.849 5.794 17.135 9.93"/></svg>
      Inicio
    `;

    const divider = document.createElement('div');
    divider.className = 'taskbar__divider';

    const appButton = document.createElement('button');
    appButton.className = 'taskbar__app-button taskbar__button--active';
    appButton.innerHTML = `
      <span>💣</span>
      <span>Buscamina</span>
    `;

    const tray = document.createElement('div');
    tray.className = 'taskbar__tray';
    tray.id = 'taskbar-clock';

    taskbar.appendChild(startBtn);
    taskbar.appendChild(divider);
    taskbar.appendChild(appButton);
    taskbar.appendChild(tray);

    document.body.appendChild(taskbar);
  }

  createDesktopIcons() {
    const icons = document.createElement('div');
    icons.className = 'desktop-icons';
    icons.innerHTML = `
      <div class="desktop-icon">
        <img src="/assets/my-computer.png" alt="Mi PC" class="desktop-icon__image" class="desktop-icon__image"/>
        <span class="desktop-icon__label">Mi PC</span>
      </div>
      <div class="desktop-icon">
        <img src="/assets/recycle.png" alt="Reciclar" class="desktop-icon__image" class="desktop-icon__image"/>
        <span class="desktop-icon__label">Reciclar</span>
      </div>
      <div class="desktop-icon">
        <img src="/assets/network.png" alt="Mi red" class="desktop-icon__image" class="desktop-icon__image"/>
        <span class="desktop-icon__label">Red</span>
      </div>
    `;
    document.body.appendChild(icons);
  }

  startClock() {
    const updateClock = () => {
      const clock = document.getElementById('taskbar-clock');
      if (clock) {
        const now = new Date();
        const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        const date = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        clock.textContent = `${date} ${time}`;
      }
    };

    updateClock();
    if (this.clockInterval) clearInterval(this.clockInterval);
    this.clockInterval = setInterval(updateClock, 1000);
  }

  bindGameEvents() {
    this.game.on('init', (stats) => {
      this.counter.setValue(stats.totalMines);
      this.hiddenCounter.setValue(stats.rows * stats.cols - stats.totalMines);
      this.timer.reset();
      this.gameStatus.setStatus('playing');
    });

    this.game.on('click', (result) => {
      if (result.type === 'reveal') {
        this.board.revealCells(result.revealed);
        const stats = this.game.board.getStats();
        const hiddenNonMines = stats.hiddenCount - (this.game.board.totalMines - stats.flaggedCount);
        this.hiddenCounter.setValue(Math.max(0, hiddenNonMines));
      }
    });

    this.game.on('flag', (result) => {
      if (result.type === 'flag') {
        this.board.updateCell(result.cell.row, result.cell.col);
        const remainingMines = this.game.board.totalMines - result.flaggedCount;
        this.counter.setValue(remainingMines);
      }
    });

    this.game.on('gameover', (result) => {
      if (result.won) {
        this.gameStatus.setStatus('won');
        const revealResult = this.game.board.revealAllMines();
        this.board.revealCells(revealResult.safeCells);
        this.hiddenCounter.setValue(0);
        setTimeout(() => {
          this.modal.show(true, '¡Felicidades! Encontraste todas las minas.');
        }, 500);
      } else {
        this.gameStatus.setStatus('lost');
        const revealResult = this.game.board.revealAllMines();
        this.board.revealCells(revealResult.mines);
        this.board.revealCells(revealResult.safeCells);
        this.board.revealCells(revealResult.wrongFlags);
        setTimeout(() => {
          let message = '¡Boom! Encontraste una mina.';
          if (result.explodedCell && result.explodedCell.type === 'lose' && result.wrongFlags) {
            message = '¡Perdiste! Tenías banderas en lugares incorrectos.';
          }
          this.modal.show(false, message);
        }, 500);
      }
    });

    this.game.on('timer', (seconds) => {
      this.timer.setTime(seconds);
    });

    this.game.on('reset', () => {
      this.board.destroy();
      this.board = new BoardComponent(
        this.game.board,
        (row, col) => this.handleCellClick(row, col),
        (row, col) => this.handleCellRightClick(row, col)
      );
      this.board.render();
      const gameWindow = this.appElement.querySelector('.game-window');
      gameWindow.appendChild(this.board.element);
    });
  }

  handleCellClick(row, col) {
    const stats = this.game.board.getStats();
    
    if (stats.status === 'ready') {
      this.game.board.placeMines(row, col);
      this.game.startTimer();
    }
    
    if (!this.game.board.gameOver) {
      this.game.click(row, col);
    }
  }

  handleCellRightClick(row, col) {
    if (!this.game.board.gameOver) {
      this.game.flag(row, col);
    }
  }

  reset() {
    this.game.reset();
  }

  newGame() {
    this.changeDifficulty(this.currentDifficulty);
  }

  changeDifficulty(difficulty) {
    this.currentDifficulty = difficulty;
    const difficultyMap = {
      'BEGINNER': DIFFICULTY.BEGINNER,
      'INTERMEDIATE': DIFFICULTY.INTERMEDIATE,
      'ADVANCED': DIFFICULTY.ADVANCED
    };

    this.game.changeDifficulty(difficultyMap[difficulty]);
    this.controls.setDifficulty(difficulty);

    this.board.destroy();
    this.board = new BoardComponent(
      this.game.board,
      (row, col) => this.handleCellClick(row, col),
      (row, col) => this.handleCellRightClick(row, col)
    );
    this.board.render();

    const gameWindow = this.appElement.querySelector('.game-window');
    const oldBoard = gameWindow.querySelector('.board');
    if (oldBoard) {
      oldBoard.remove();
    }
    gameWindow.appendChild(this.board.element);
  }

  revealAllCells() {
    for (let r = 0; r < this.game.board.rows; r++) {
      for (let c = 0; c < this.game.board.cols; c++) {
        const cell = this.game.board.getCell(r, c);
        if (cell.state === CELL_STATE.HIDDEN && cell.hasMine) {
          this.board.updateCell(r, c);
        }
      }
    }
  }
}

const app = new App();
app.init();
