class Letter {
  constructor(englishLetter, appendCtx, alphabetManager) {
    this.alphabetManager = alphabetManager
    this.englishLetter = englishLetter.toUpperCase();
    this.el = this.injectHtml(appendCtx)
    this.registerListeners()
    this.zodiacLetters = ''
  }
  getEnglishLetter() {
    return this.englishLetter
  }
  getZodiacLetters() {
    return this.zodiacLetters
  }
  injectHtml(appendCtx) {
    var html = '' +
      '<div class="input-group key-letter-wrapper" id="letter-wrapper-' + this.englishLetter + '">' +
      '  <div class="input-group-prepend">' +
      '    <span class="input-group-text">' + this.englishLetter + '</span>' +
      '  </div>' +
      '  <input type="text" class="form-control zodiac-letter-input">' +
      '</div>';
      appendCtx.append(html)
      return $("#letter-wrapper-" + this.englishLetter)
  }
  registerListeners() {
    var that = this
    $( "input", this.el ).on('change keyup', function (event) {
      var zodiacLettersEntered = event.target.value
      zodiacLettersEntered = that.scrub(zodiacLettersEntered)
      console.log(zodiacLettersEntered)
      var validChars = ""
      for (var i=0; i<zodiacLettersEntered.split('').length; i++) {
        if (!that.alphabetManager.isLetterAlreadyInUse(that.englishLetter, zodiacLettersEntered[i])) {
          validChars += zodiacLettersEntered[i]
        }
      }
      that.zodiacLetters = validChars
      event.target.value = validChars
    });
  }
  toString() {
    return "Manager for English '" + this.getEnglishLetter() + "' UI"
  }
  scrub(input) {
    let re = /[^#%&()*+./123456789:;<>@ABCDEFGHJKLMNOPRSTUVWXYZ^_bcdfjklpqtyz|-]/g;
    var str = input.replace(re, '');
    var uniql = "";
    for (var x=0;x < str.length;x++) {
      if(uniql.indexOf(str.charAt(x))==-1) {
        uniql += str[x];
      }
    }
    return uniql;
  }
}

class AlphabetManager {
  constructor() {
    this.letters = {}
  }
  manageLetter(letter) {
    this.letters[letter.getEnglishLetter()] = letter
  }
  getLetters() {
    return this.letters
  }
  isLetterAlreadyInUse(englishLetter, zodiacLetter) {
    console.log("englishLetter = " + englishLetter)
    for (const [k, v] of Object.entries(this.letters)) {
      if (englishLetter != v.getEnglishLetter()) {
        if (v.getZodiacLetters().indexOf(zodiacLetter) > -1) {
          return true
        }
      }
    }
    return false
  }
}
