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
      '  <input type="text" class="form-control cipherText">' +
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

class CipherManager {
  constructor(cipherText, el) {
    this.el = el
    this.zodiacCipherText = cipherText
    this.renderCipherTable()
  }
  renderCipherTable() {
    var linesSplit = this.zodiacCipherText.split(/\n/);
    for (var i=0; i<linesSplit[0].length; i++) {
      $("thead tr", this.el).append($('<th scope="row">').append(i));
    }
    for (var i=0; i<linesSplit.length; i++) {
      var row = $('<tr>');
      for (var j=0; j<linesSplit[i].length; j++) {
        row.append($('<td>').append(linesSplit[i][j]));
      }
      $("tbody", this.el).append(row);
    }
  }
}

class SolutionManager {
  constructor(cipherText, el) {
    this.el = el
    this.cipherText = cipherText
    this.renderSolutionTable()
  }
  renderSolutionTable() {
    var linesSplit = this.cipherText.split(/\n/);
    // $("thead tr", this.el).append($('<th scope="row">'));
    for (var i=0; i<linesSplit[0].length; i++) {
      $("thead tr", this.el).append($('<th scope="row">').append(i));
    }
    for (var i=0; i<linesSplit.length; i++) {
      var row = $('<tr>');
      //row.append($('<th scope="row">').append(i));
      for (var j=0; j<linesSplit[i].length; j++) {
        row.append($('<td>'));
      }
      $("tbody", this.el).append(row);
    }
  }
}

class HoverManager {
  constructor(cipherEl, solutionEl) {
    this.cipherEl = cipherEl
    this.solutionEl = solutionEl
    this.watchMouseHoverEvents()
  }
  watchMouseHoverEvents() {
    var that = this
    var hoveringStarted = (function() {
      var columnNumber = event.target.closest('td').cellIndex
      var rowNumber = event.target.closest('tr').rowIndex - 1
      var row = $("tbody tr", this.cipherEl)[rowNumber]
      var zodiacCharBelowMouse = $("td", row)[columnNumber].innerText
      var zodiacCells = $("td:contains('" + zodiacCharBelowMouse + "')", this.cipherEl)
      $(zodiacCells).addClass('cell-hover')
      for (var i=0; i<zodiacCells.length; i++) {
        columnNumber = zodiacCells[i].cellIndex
        rowNumber = zodiacCells[i].closest('tr').rowIndex
        row = $("tr", that.solutionEl)[rowNumber]

        console.log(rowNumber + "," +columnNumber)
        console.log($("td", row)[columnNumber])
        console.log("Make it hover")
      }
    })

    $( "td", this.cipherEl ).hover(hoveringStarted, this.hoveringEnded);
    $( "td", this.solutionEl ).hover(hoveringStarted, this.hoveringEnded);
  }
  hoveringEnded(event) {
    $(".cell-hover").removeClass('cell-hover')
  }
}
