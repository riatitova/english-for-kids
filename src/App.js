import CardsInformationService from './CardsInformationService';
import Header from './Header';
import MainPage from './MainPage';
import 'normalize.css';
import './css/app.scss';
import Footer from './Footer';
import Card from './Card';
import Game from './Game';
import * as storage from './storage';
import winImage from './img/win.svg';
import loseImage from './img/game-over.svg';
import createDOMElement from './createDOMElement';
import Menu from './Menu';

const win = 'win';
const mainPage = 'main page';
const play = 'play';
const train = 'train';
const en = 'en';
const efkMode = 'efkMode';
const efkCurrentCategory = 'efkCurrentCategory';
const categories = 'categories';
const waitingTime = 4000;
const winImg = 'win-img';
const lose = 'lose';
const loseImg = 'lose-img';

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
    storage.set(efkMode, train);
    this.renderCategories();
  }

  controlHeader(target) {
    switch (target) {
      case mainPage:
        this.switchToMain();
        break;
      case play:
        this.startGame();
        break;
      default:
        this.train();
    }
    return target;
  }

  controlMenu(target) {
    switch (target) {
      case mainPage:
        this.switchToMain();
        break;
      default:
        this.switchToCategory(target);
    }
    return target;
  }

  controlMain(newCategoryName) {
    this.mainContent.removeCards();
    return this.renderPage(newCategoryName);
  }

  controlGame(state) {
    if (state === win) {
      this.win();
    } else {
      this.lose(state);
    }
  }

  renderCardsWords(categoryName) {
    return this.cards.getCategoryWords(categoryName, en);
  }

  renderCardsImages(words, categoryName) {
    return words.map(value => this.cards.getImageForWord(categoryName, en, value));
  }

  renderCardsSounds(words, categoryName) {
    return words.map(value => this.cards.getAudioForWord(categoryName, en, value));
  }

  renderCardsTranslations(words, categoryName) {
    return words.map(value => this.cards.getTranslation(categoryName, value));
  }

  renderPage(categoryName) {
    const isPlayMode = storage.get(efkMode) === play;

    if (isPlayMode) {
      storage.set(efkCurrentCategory, categoryName);
      return this.startGame();
    }
    const words = this.renderCardsWords(categoryName);
    const images = this.renderCardsImages(words, categoryName);
    const sounds = this.renderCardsSounds(words, categoryName);
    const translations = this.renderCardsTranslations(words, categoryName);

    storage.set(efkCurrentCategory, categoryName);
    return words.map((value, index) => new Card(
      value, this.mainContent.wrapper, translations[index],
    ).renderCard(
      images[index],
      sounds[index],
    ));
  }

  renderCategories() {
    this.mainContent.setCards(
      this.categories,
      this.categories.map(value => this.cards.getCategoryImage(value)),
    );
    storage.set(efkCurrentCategory, categories);
    return this.mainContent;
  }

  switchToMain() {
    this.mainContent.removeCards();

    return this.renderCategories();
  }

  switchToCategory(category) {
    this.mainContent.removeCards();
    const isPlayMode = storage.get(efkMode) === play;
    if (isPlayMode) {
      storage.set(efkCurrentCategory, category);
      return this.startGame();
    }
    return this.renderPage(category);
  }

  startGame() {
    const currentCategory = storage.get(efkCurrentCategory);
    const isCategoriesPage = currentCategory === categories;
    storage.set(efkMode, play);

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
    const isPlayMode = storage.get(efkMode) === play;
    const currentCategory = storage.get(efkCurrentCategory);
    const isCategoriesPage = currentCategory === categories;

    if (isPlayMode) {
      storage.set(efkMode, train);
      return isCategoriesPage ? this.switchToMain() : this.switchToCategory(currentCategory);
    }
    return currentCategory;
  }

  win() {
    this.mainContent.removeCards();
    createDOMElement('span', win, 'You won', this.mainContent.wrapper);
    createDOMElement('img', winImg, null, this.mainContent.wrapper, ['src', `${winImage}`]);
    this.wonSound.play();
    setTimeout(() => {
      this.switchToMain();
    }, waitingTime);
  }

  lose(mistakes) {
    this.mainContent.removeCards();
    createDOMElement('span', lose, `You have ${mistakes} mistakes`, this.mainContent.wrapper);
    createDOMElement('img', loseImg, null, this.mainContent.wrapper, ['src', `${loseImage}`]);
    this.loseSound.play();
    setTimeout(() => {
      this.switchToMain();
    }, waitingTime);
  }
}
