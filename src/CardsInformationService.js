import cardsData from './CardsData';

export default class CardsInformationService {
  constructor() {
    this._cardsData = cardsData;
  }

  getCategoriesNames() {
    return this._cardsData.map(value => value.categoryName);
  }

  getCategoryImage(categoryName) {
    return this._cardsData
      .filter(name => name.categoryName === categoryName)
      .map(value => value.image)
      .join('');
  }

  getCategoryWords(categoryName, language) {
    return this._cardsData
      .filter(name => name.categoryName === categoryName)
      .map(value => value.words.map(element => element[language]))
      .flat();
  }

  getTranslation(categoryName, englishWord) {
    return this._cardsData
      .filter(name => name.categoryName === categoryName)
      .map(value => value.words.filter(element => element.en === englishWord))
      .flat()
      .map(translation => translation.ru);
  }

  getImageForWord(categoryName, language, word) {
    return this._cardsData
      .filter(name => name.categoryName === categoryName)
      .map(value => value.words
        .filter(element => element[language] === word)
        .map(img => img.image))
      .flat()
      .join();
  }

  getAudioForWord(categoryName, language, word) {
    return this._cardsData
      .filter(name => name.categoryName === categoryName)
      .map(value => value.words
        .filter(element => element[language] === word)
        .map(audio => audio.audio))
      .flat()
      .join();
  }
}
