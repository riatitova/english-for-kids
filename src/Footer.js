import createDOMElement from './createDOMElement';
import './css/footer.scss';
import logo from './img/rs_school_js.svg';

export default class Footer {
  constructor() {
    this.footer = createDOMElement('footer', 'footer', null, document.body);
    this.footerGithubLink = createDOMElement('a', 'footer__github', 'riatitova', this.footer, ['href', 'https://github.com/riatitova'], ['target', '_blank']);
    this.footerDate = createDOMElement('span', 'footer__date', '2020', this.footer);
    this.footerLogo = createDOMElement('img', 'footer__logo', null, this.footer, ['src', `${logo}`], ['alt', 'logo']);
    this.footerLink = createDOMElement('a', 'footer__link', 'RS School JS', this.footer, ['href', 'https://rs.school/js/'], ['target', '_blank']);
  }
}
