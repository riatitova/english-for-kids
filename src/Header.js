import createDOMElement from './createDOMElement';
import './css/header.scss';
import * as storage from './storage';

export default class Header {
  constructor(controlHeader) {
    this.controlHeader = controlHeader;
  }

  renderHeader() {
    this.header = createDOMElement('header', 'header', null, document.body);
    this.menuButton = createDOMElement('div', 'header__menu-button', null, this.header);
    this.title = createDOMElement('h1', 'header__title', 'English for kids', this.header);
    this.trainButton = createDOMElement('button', 'header__train-button', 'Let\'s play', this.header);
    this.statisticsButton = createDOMElement('button', 'header__statistics-button', 'statistics', this.header);

    this.firstBurgerLine = createDOMElement('div', 'burgerFirst', null, this.menuButton);
    this.secondBurgerLine = createDOMElement('div', 'burgerSecond', null, this.menuButton);
    this.thirdBurgerLine = createDOMElement('div', 'burgerThird', null, this.menuButton);

    this.setHandlers();
  }

  setHandlers() {
    this.switchTrainPlay = event => {
      const gameMode = storage.get('efkMode');
      const isTrainButton = event.target.closest('.header__train-button') !== null;
      const isTrainMode = gameMode === 'train';

      if (isTrainButton && !isTrainMode) {
        this.controlTrainButton('play');
        this.controlHeader('train');
      } else if (isTrainButton && isTrainMode) {
        this.controlTrainButton('train');
        this.controlHeader('play');
      }
    };

    this.rotateBurger = () => {
      this.toggleBurger();
    };

    this.getMainFromHeader = event => {
      const isTitle = event.target.closest('.header__title') !== null;
      if (isTitle) {
        this.controlHeader('main page');
      }
    };

    this.trainButton.addEventListener('click', this.switchTrainPlay);
    this.header.addEventListener('click', this.getMainFromHeader);
  }

  controlTrainButton(mode) {
    if (mode === 'train') {
      this.trainButton.classList.add('header__play-button');
      this.trainButton.innerText = 'Let\'s train';
    } else {
      this.trainButton.classList.remove('header__play-button');
      this.trainButton.innerText = 'Let\'s play';
    }
  }

  toggleBurger() {
    this.firstBurgerLine.classList.toggle('changed');
    this.secondBurgerLine.classList.toggle('changed');
    this.thirdBurgerLine.classList.toggle('changed');
  }
}
