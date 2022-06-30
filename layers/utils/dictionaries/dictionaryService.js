class DictionaryService {
  constructor(dictionary) {
    dictionary = dictionary
      .split('-')
      .map(
        (m) => m.substring(0, 1).toUpperCase() + m.substring(1).toLowerCase()
      )
      .join('');

    this.dictionary = require(`./${'dictionary' + dictionary}.json`);
  }

  getValue(key) {
    return this.dictionary[key];
  }

  getKey(value) {
    let keyResponse = undefined;

    Object.keys(this.dictionary).some((key) => {
      if (this.dictionary[key] === value) {
        keyResponse = key;
        return true;
      }
    });

    return keyResponse;
  }
}

module.exports = DictionaryService;
