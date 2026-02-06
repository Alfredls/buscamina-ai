import { BoardComponent } from './components/Board.js';
import { HeaderComponent } from './components/Header.js';
import { ControlsComponent } from './components/Controls.js';
import { CounterComponent } from './components/Counter.js';
import { TimerComponent } from './components/Timer.js';
import { GameStatusComponent } from './components/GameStatus.js';
import { HiddenCounterComponent } from './components/HiddenCounter.js';
import { Game } from './game/Game.js';
import { DIFFICULTY, CELL_STATE } from './utils/constants.js';

class App {
  constructor() {
    this.game = new Game();
    this.counter = new CounterComponent(0);
    this.timer = new TimerComponent(0);
    this.gameStatus = new GameStatusComponent(() => this.reset());
    this.hiddenCounter = new HiddenCounterComponent();
    this.header = new HeaderComponent(this.counter, this.timer, this.gameStatus, this.hiddenCounter);
    this.board = null;
    this.controls = new ControlsComponent((difficulty) => this.changeDifficulty(difficulty));
    this.appElement = document.getElementById('app');
  }

  init() {
    this.bindGameEvents();
    this.game.init(DIFFICULTY.BEGINNER);
    this.render();
  }

  render() {
    this.appElement.innerHTML = '';
    this.appElement.className = 'app';

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
      } else {
        this.gameStatus.setStatus('lost');
        const revealResult = this.game.board.revealAllMines();
        this.board.revealCells(revealResult.mines);
        this.board.revealCells(revealResult.safeCells);
        this.board.revealCells(revealResult.wrongFlags);
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

  changeDifficulty(difficulty) {
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
