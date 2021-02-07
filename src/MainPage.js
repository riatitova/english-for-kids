import createDOMElement from './createDOMElement';
import './css/mainPage.scss';

export default class MainPage {
  constructor(controller) {
    this.controller = controller;
  }

  renderMain() {
    this.main = createDOMElement('main', 'main', null, document.body);
    this.wrapper = createDOMElement('div', 'wrapper', null, this.main);
  }

  setCards(cardsNames, cardsImages) {
    this.cards = [];
    cardsImages.map(() => this.cards.push(createDOMElement('div', 'category', null, this.wrapper)));
    this.cards.map((value, index) => createDOMElement(
      'img',
      'category__image',
      null,
      value,
      ['src', cardsImages[index]],
      ['alt', 'category__image'],
    ));
    this.cards.map((value, index) => createDOMElement('span', 'category__title', cardsNames[index], value));
    this.setHandlers();
  }

  removeCards() {
    this.wrapper.replaceChildren();
  }

  setHandlers() {
    this.getNewCategory = event => {
      const category = event.target.closest('.category');
      if (category !== null) {
        this.controller(category.lastElementChild.innerText);
        this.wrapper.removeEventListener('click', this.getNewCategory);
      }
    };
    this.wrapper.addEventListener('click', this.getNewCategory);
  }
}
