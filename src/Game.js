import createDOMElement from './createDOMElement';
import './css/game.scss';
import playButton from './img/play.svg';
import repeatButton from './img/replay.svg';
import star from './img/star.svg';
import noStar from './img/noStar.svg';

export default class Game {
  constructor(wrapper, gameData, controlGame) {
    this.wrapper = wrapper;
    this.gameData = gameData;
    this.controlGame = controlGame;
    this.mistakes = 0;
    this.correctSound = new Audio('./audio/correct.wav');
    this.errorSound = new Audio('./audio/error.wav');
  }

  renderGamePage() {
    this.gameContainer = createDOMElement('div', 'game', null, this.wrapper);
    this.starsContainer = createDOMElement('div', 'game__stars', null, this.gameContainer);
    this.playButton = createDOMElement('button', 'game__play-button', null, this.gameContainer);
    this.playButtonImg = createDOMElement(
      'img',
      'game__play-button-img',
      null,
      this.playButton,
      ['src', `${playButton}`],
      ['alt', 'playButton'],
    );
    this.repeatButton = createDOMElement('button', 'game__repeat-button', null, this.gameContainer);
    this.repeatButtonImg = createDOMElement(
      'img',
      'game__play-button-img',
      null,
      this.repeatButton,
      ['src', `${repeatButton}`],
      ['alt', 'repeatButton'],
    );
    this.imagesWrapper = createDOMElement('div', 'game__content', null, this.gameContainer);
    this.sounds = [];
    this.images = [];

    this.imagesAddress = this.shuffleArray(this.gameData.images);
    this.soundsSrc = this.shuffleArray(this.gameData.audios);
    this.soundsSrc.map(value => this.sounds.push(new Audio(value)));
    this.imagesAddress.map((value, index) => {
      const nameStartsPosition = 6;
      const nameEnds = value.length - 4;
      const name = value.substring(nameStartsPosition, nameEnds);
      this.images.push(
        createDOMElement(
          'img',
          'game__image',
          null,
          this.imagesWrapper,
          ['src', this.imagesAddress[index]],
          ['alt', value],
          ['name', name],
        ),
      );
      return this.images;
    });
    this.setHandlers();
  }

  shuffleArray(array) {
    [...this.mixedArray] = array;
    for (let i = this.mixedArray.length - 1; i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const temporary = this.mixedArray[i];
      this.mixedArray[i] = this.mixedArray[randomIndex];
      this.mixedArray[randomIndex] = temporary;
    }
    return this.mixedArray;
  }

  start() {
    this.playButton.classList.add('game__play-button_inactive');
    this.lastSound = this.sounds.pop();
    this.lastSound.play();
    this.imagesWrapper.addEventListener('click', this.move);
  }

  checkAnswer(chosenCard) {
    const isCorrect = this.lastSound.src.includes(chosenCard.dataset.name);

    if (isCorrect) {
      const isWin = this.sounds.length === 0 && this.mistakes === 0;
      const isLose = this.sounds.length === 0 && this.mistakes !== 0;

      if (isWin) {
        return this.controlGame('win');
      }
      if (isLose) {
        return this.controlGame(this.mistakes);
      }
      chosenCard.classList.add('game__image_inactive');
      this.correctSound.play();
      this.starsContainer.prepend(createDOMElement('img', 'game__star', null, null, ['src', `${star}`]));
      setTimeout(() => this.start(), 1500);
    } else {
      this.mistakes += 1;
      this.errorSound.play();
      this.starsContainer.prepend(createDOMElement('img', 'game__noStar', null, this.starsContainer, ['src', `${noStar}`]));
    }
    return isCorrect;
  }

  setHandlers() {
    this.startGame = event => {
      const isPlayButton = event.target.closest('.game__play-button') !== null;
      if (isPlayButton) {
        this.start();
      }
    };

    this.repeatSound = event => {
      const isRepeatButton = event.target.closest('.game__repeat-button') !== null;
      if (isRepeatButton) {
        this.lastSound.play();
        this.imagesWrapper.addEventListener('click', this.move);
      }
    };

    this.move = event => {
      const chosenCard = event.target.closest('.game__image');
      if (chosenCard !== null) {
        this.checkAnswer(chosenCard);
      }
    };

    this.playButton.addEventListener('click', this.startGame);
    this.repeatButton.addEventListener('click', this.repeatSound);
  }
}
