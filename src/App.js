import CardsInformationService from './CardsInformationService';
import Header from './Header';
import MainPage from './MainPage';
import 'normalize.css';
import './css/app.scss';
import Footer from './Footer';
import Card from './Card';
import Game from './Game';
import * as storage from './storage';
import win from './img/win.svg';
import lose from './img/game-over.svg';
import createDOMElement from './createDOMElement';
import Menu from './Menu';

export default class App {
  constructor() {
    this.controlMain = this.controlMain.bind(this);
    this.controlHeader = this.controlHeader.bind(this);
    this.controlGame = this.controlGame.bind(this);
    this.controlMenu = this.controlMenu.bind(this);
  }

  init() {
    this.cards = new CardsInformationService();
    this.categories = this.cards.getCategoriesNames();
    this.header = new Header(this.controlHeader);
    this.header.renderHeader();
    this.menu = new Menu(this.controlMenu, this.header.menuButton, this.header.rotateBurger);
    this.menu.renderMenu(this.categories);
    this.mainContent = new MainPage(this.controlMain);
    this.mainContent.renderMain();
    this.footer = new Footer();
    this.wonSound = new Audio('./audio/win.wav');
    this.loseSound = new Audio('./audio/lose.wav');
    storage.set('efkMode', 'train');
    this.renderCategories();
  }

  controlHeader(target) {
    switch (target) {
      case 'main page':
        this.switchToMain();
        break;
      case 'play':
        this.startGame();
        break;
      default:
        this.train();
    }
    return target;
  }

  controlMenu(target) {
    switch (target) {
      case 'main page':
        this.switchToMain();
        break;
      default:
        this.switchToCategory(target);
    }
    return target;
  }

  controlMain(newCategoryName) {
    this.mainContent.removeCards();
    const currentPage = this.renderPage(newCategoryName);

    return currentPage;
  }

  controlGame(state) {
    switch (state) {
      case 'win':
        this.win();
        break;
      default:
        this.lose(state);
    }
  }

  renderCardsWords(categoryName) {
    const words = this.cards.getCategoryWords(categoryName, 'en');
    return words;
  }

  renderCardsImages(words, categoryName) {
    const images = [];
    words.map(value => images.push(this.cards.getImageForWord(categoryName, 'en', value)));
    return images;
  }

  renderCardsSounds(words, categoryName) {
    const sounds = [];
    words.map(value => sounds.push(this.cards.getAudioForWord(categoryName, 'en', value)));
    return sounds;
  }

  renderCardsTranslations(words, categoryName) {
    const translations = [];
    words.map(value => translations.push(this.cards.getTranslation(categoryName, value)));
    return translations;
  }

  renderPage(categoryName) {
    const isPlayMode = storage.get('efkMode') === 'play';

    if (isPlayMode) {
      storage.set('efkCurrentCategory', categoryName);
      return this.startGame();
    }
    const currentCards = [];
    const words = this.renderCardsWords(categoryName);
    const images = this.renderCardsImages(words, categoryName);
    const sounds = this.renderCardsSounds(words, categoryName);
    const translations = this.renderCardsTranslations(words, categoryName);

    words.map((value, index) => currentCards.push(
      new Card(value, this.mainContent.wrapper, translations[index]).renderCard(
        images[index],
        sounds[index],
      ),
    ));
    storage.set('efkCurrentCategory', categoryName);
    return currentCards;
  }

  renderCategories() {
    const categoriesImages = [];

    this.categories.map(value => categoriesImages.push(this.cards.getCategoryImage(value)));
    this.mainContent.setCards(this.categories, categoriesImages);
    storage.set('efkCurrentCategory', 'categories');
    return this.mainContent;
  }

  switchToMain() {
    this.mainContent.removeCards();

    return this.renderCategories();
  }

  switchToCategory(category) {
    this.mainContent.removeCards();
    const isPlayMode = storage.get('efkMode') === 'play';
    if (isPlayMode) {
      storage.set('efkCurrentCategory', category);
      return this.startGame();
    }
    return this.renderPage(category);
  }

  startGame() {
    const currentCategory = storage.get('efkCurrentCategory');
    const isCategoriesPage = currentCategory === 'categories';
    storage.set('efkMode', 'play');

    if (!isCategoriesPage) {
      this.mainContent.removeCards();
      const game = {};
      game.words = this.renderCardsWords(currentCategory);
      game.images = this.renderCardsImages(game.words, currentCategory);
      game.audios = this.renderCardsSounds(game.words, currentCategory);

      this.game = new Game(this.mainContent.wrapper, game, this.controlGame);
      this.game.renderGamePage();

      return this.game;
    }

    return currentCategory;
  }

  train() {
    const isPlayMode = storage.get('efkMode') === 'play';
    const currentCategory = storage.get('efkCurrentCategory');
    const isCategoriesPage = currentCategory === 'categories';

    if (isPlayMode) {
      storage.set('efkMode', 'train');
      return isCategoriesPage ? this.switchToMain() : this.switchToCategory(currentCategory);
    }
    return currentCategory;
  }

  win() {
    this.mainContent.removeCards();
    createDOMElement('span', 'win', 'You won', this.mainContent.wrapper);
    createDOMElement('img', 'win-img', null, this.mainContent.wrapper, ['src', `${win}`]);
    this.wonSound.play();
    setTimeout(() => {
      this.switchToMain();
    }, 4000);
  }

  lose(mistakes) {
    this.mainContent.removeCards();
    createDOMElement('span', 'lose', `You have ${mistakes} mistakes`, this.mainContent.wrapper);
    createDOMElement('img', 'lose-img', null, this.mainContent.wrapper, ['src', `${lose}`]);
    this.loseSound.play();
    setTimeout(() => {
      this.switchToMain();
    }, 4000);
  }
}
