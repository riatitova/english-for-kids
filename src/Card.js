import createDOMElement from './createDOMElement';
import rotator from './img/rotation.svg';
import './css/card.scss';

export default class Card {
  constructor(name, wrapper, translation) {
    this.name = name;
    this.wrapper = wrapper;
    this.translation = translation;
  }

  renderCard(imageAddress, audioAddress) {
    this.card = createDOMElement('div', 'card', null, this.wrapper);
    this.face = createDOMElement('div', 'card__face', null, this.card);
    this.image = createDOMElement(
      'img',
      'card__image',
      null,
      this.face,
      ['src', imageAddress],
      ['alt', this.name],
    );
    this.face.appendChild(this.image);
    this.content = createDOMElement('div', 'card__content', null, this.face);
    this.title = createDOMElement('span', 'card__title', this.name, this.content);
    this.rotator = createDOMElement(
      'img',
      'card__rotator',
      null,
      this.content,
      ['src', rotator],
      ['alt', 'rotator'],
    );
    this.audio = new Audio(audioAddress);
    this.renderCardBack(imageAddress, this.translation);
    this.setHandlers();
  }

  renderCardBack(imageAddress, translation) {
    this.back = createDOMElement('div', 'card__back', null, this.card);
    this.imageBack = createDOMElement(
      'img',
      'card__imageBack',
      null,
      this.back,
      ['src', imageAddress],
      ['alt', translation],
    );
    this.contentBack = createDOMElement('div', 'card__contentBack', null, this.back);
    this.translation = createDOMElement(
      'span',
      'card__translation',
      translation.join(''),
      this.contentBack,
    );
  }

  setHandlers() {
    this.playSound = event => {
      const isCard = event.target.closest('.card') !== null;
      if (isCard) {
        this.audio.play();
      }
    };

    this.rotateBack = event => {
      const isCard = event.target.closest('.card') !== null;
      if (isCard) {
        this.face.classList.remove('card__face_hidden');
        this.back.classList.remove('card__back_visible');
        this.card.addEventListener('click', this.playSound);
      }
    };

    this.rotate = event => {
      const isRotator = event.target.closest('.card__rotator') !== null;
      if (isRotator) {
        this.face.classList.add('card__face_hidden');
        this.back.classList.add('card__back_visible');
        this.card.removeEventListener('click', this.playSound);
        this.card.addEventListener('mouseleave', this.rotateBack);
      }
    };
    this.card.addEventListener('click', this.playSound);
    this.rotator.addEventListener('click', this.rotate);
  }
}
