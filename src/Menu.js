import createDOMElement from './createDOMElement';
import './css/menu.scss';

export default class Menu {
  constructor(controlMenu, menuButton, rotateBurger) {
    this.menu = createDOMElement('div', 'menu', null, document.body);
    this.controlMenu = controlMenu;
    this.menuButton = menuButton;
    this.rotateBurger = rotateBurger;
  }

  renderMenu(categories) {
    this.menuList = createDOMElement('ul', 'list', null, this.menu);
    const amountOfItems = 9;

    for (let i = 0; i < amountOfItems; i += 1) {
      const listItem = createDOMElement('li', 'list__item', null, this.menuList);
      createDOMElement('a', 'list__anchor', categories[i], listItem);
      if (i === amountOfItems - 1) {
        createDOMElement('a', 'list__anchor', 'main page', listItem);
      }
    }

    this.setHandlers();
  }

  setHandlers() {
    this.getCategoryEvent = event => {
      const anchor = event.target.closest('.list__anchor');
      if (anchor !== null) {
        const chosenCategory = anchor.innerText;
        this.controlMenu(chosenCategory);
        this.closeMenu();
      }
    };

    this.closeMenuByButtonEvent = event => {
      const isMenuButton = event.target.className === 'header__menu-button';
      const isBurgerTarget = event.target.closest('.header__menu-button') !== null;
      if (isMenuButton || isBurgerTarget) {
        this.closeMenu();
        event.stopPropagation();
      }
    };

    this.openMenuByButtonEvent = event => {
      const isMenuButton = event.target.className === 'header__menu-button';
      const isBurgerTarget = event.target.closest('.header__menu-button') !== null;
      if (isBurgerTarget || isMenuButton) {
        this.openMenu();
        event.stopPropagation();
      }
    };

    this.closeMenuOutsideEvent = event => {
      const isNotMenu = event.target.closest('.menu') === null;
      if (isNotMenu) {
        this.closeMenu();
      }
    };

    this.menuButton.addEventListener('click', this.openMenuByButtonEvent);
    this.menuList.addEventListener('click', this.getCategoryEvent);
  }

  openMenu() {
    this.menu.classList.add('menu_visible');
    this.menuButton.removeEventListener('click', this.openMenuByButtonEvent);
    this.menuButton.addEventListener('click', this.closeMenuByButtonEvent);
    document.addEventListener('click', this.closeMenuOutsideEvent);
    this.rotateBurger();
  }

  closeMenu() {
    this.menu.classList.remove('menu_visible');
    document.removeEventListener('click', this.closeMenuOutsideEvent);
    this.menuButton.removeEventListener('click', this.closeMenuByButtonEvent);
    this.menuButton.addEventListener('click', this.openMenuByButtonEvent);
    this.rotateBurger();
  }
}
