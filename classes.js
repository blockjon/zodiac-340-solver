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
    $( "input", this.el ).on('keyup', function (event) {
      console.log("input event fired: " + event.type)
      var zodiacLettersEntered = event.target.value
      that.processZodiacLetterEntered(zodiacLettersEntered)
    });
  }
  uiKeyboardAssignment(zodiacLetterSelected) {
    var zodiacLettersEntered = this.zodiacLetters + zodiacLetterSelected
    this.processZodiacLetterEntered(zodiacLettersEntered)
  }
  processZodiacLetterEntered(zodiacLettersEntered) {
    zodiacLettersEntered = this.scrub(zodiacLettersEntered)
    $("#letter-wrapper-" + this.englishLetter + " input").val(zodiacLettersEntered)
    var validChars = ""
    for (var i=0; i<zodiacLettersEntered.split('').length; i++) {
      if (!this.alphabetManager.isLetterAlreadyInUse(this.englishLetter, zodiacLettersEntered[i])) {
        validChars += zodiacLettersEntered[i]
      }
    }
    this.zodiacLetters = validChars
    $("#letter-wrapper-" + this.englishLetter + " input").val(validChars)
    this.alphabetManager.notifyLetterUpdated(this)
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
    this.zodiacCharToEnglishCharMap = {
      // 'K': 'x'
    }
    this.onChangeCallback = null
  }
  manageLetter(letter) {
    this.letters[letter.getEnglishLetter()] = letter
  }
  getLetters() {
    return this.letters
  }
  uiKeyboardAssignment(zodiacLetter, englishLetter) {
    console.log("ui keyboard assignment detected")
    this.letters[englishLetter].uiKeyboardAssignment(zodiacLetter)
  }
  notifyLetterUpdated(letter) {
    var charMap = {}
    for (const [k, v] of Object.entries(this.letters)) {
      var zLetters = v.getZodiacLetters()
      for (var i=0; i<zLetters.length; i++) {
        charMap[zLetters[i]] = k
      }
    }
    this.zodiacCharToEnglishCharMap = charMap
    if (this.onChangeCallback) {
      this.onChangeCallback()
    }
    console.log(this.zodiacCharToEnglishCharMap)
    console.log(this.letters)
  }
  isLetterAlreadyInUse(englishLetter, zodiacLetter) {
    for (const [k, v] of Object.entries(this.letters)) {
      if (englishLetter != v.getEnglishLetter()) {
        if (v.getZodiacLetters().indexOf(zodiacLetter) > -1) {
          return true
        }
      }
    }
    return false
  }
  onChange(onChangeCallback) {
    this.onChangeCallback = onChangeCallback
  }
  resolveEnglishCharacter(zodiacCharacter) {
    if (zodiacCharacter in this.zodiacCharToEnglishCharMap) {
      return this.zodiacCharToEnglishCharMap[zodiacCharacter]
    } else {
      return ''
    }
  }
}

class CipherManager {
  constructor(cipherText, el, alphabetManager) {
    this.el = el
    this.alphabetManager = alphabetManager
    this.zodiacCipherText = cipherText
    this.renderCipherTable()
    this.onChangeCallback = null
    this.registerKeyboardListener()
  }
  registerKeyboardListener() {
    var that = this
    $(document).on( "click", "#cipher td", function(event) {
      var zodiacLetterSelected = event.target.innerText
      $("#dialog span").text(zodiacLetterSelected)
      var myModal = $( "#dialog" ).dialog({
        width: "auto",
        height: "auto",
        modal: true,
      });
      $(document).on( "click", "#dialog button", function(event) {
        var englishLetter = event.target.innerText
        that.alphabetManager.uiKeyboardAssignment(zodiacLetterSelected, englishLetter)
        myModal.dialog( "close" );
      });
    });
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
  notifyColumnAdjusted() {
    if (this.onChangeCallback) {
      this.onChangeCallback()
    }
  }
  onChange(onChangeCallback) {
    this.onChangeCallback = onChangeCallback
  }
  resolveZodiacCharacter(rowIndex, columnIndex) {
    return $("tbody tr", this.el).eq(rowIndex).find('td').eq(columnIndex).text()
  }
}

class SolutionManager {
  constructor(cipherText, el, cipherManager, alphabetManager) {
    this.el = el
    var that = this
    var listener = function () {(
      function (callback) {
        callback.call(that)
      }
    )(that.renderSolutionTable)}
    cipherManager.onChange(listener)
    alphabetManager.onChange(listener)

    this.cipherText = cipherText
    this.cipherManager = cipherManager
    this.alphabetManager = alphabetManager
    this.drawSolutionTable()
  }
  drawSolutionTable() {
    var linesSplit = this.cipherText.split(/\n/);
    for (var i=0; i<linesSplit[0].length; i++) {
      $("thead tr", this.el).append($('<th scope="row">').append(i));
    }
    for (var i=0; i<linesSplit.length; i++) {
      var row = $('<tr>');
      for (var j=0; j<linesSplit[i].length; j++) {
        row.append($('<td>'));
      }
      $("tbody", this.el).append(row);
    }
  }
  renderSolutionTable() {
    var linesSplit = this.cipherText.split(/\n/);
    for (var i=0; i<linesSplit[0].length; i++) {
      $("thead th", this.el).eq(i).text(
        $("thead th", this.cipherManager.el).eq(i).text()
      )
    }
    for (var i=0; i<linesSplit.length; i++) {
      for (var j=0; j<linesSplit[i].length; j++) {
        $("tbody tr", this.el).eq(i).find('td').eq(j).text(
          this.alphabetManager.resolveEnglishCharacter(
            this.cipherManager.resolveZodiacCharacter(i, j)
          )
        )
      }
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
        $("tbody tr", that.solutionEl).eq(rowNumber-1).find('td').eq(columnNumber).addClass('cell-hover')
      }
    })

    $( "td", this.cipherEl ).hover(hoveringStarted, this.hoveringEnded);
    $( "td", this.solutionEl ).hover(hoveringStarted, this.hoveringEnded);
  }
  hoveringEnded(event) {
    $(".cell-hover").removeClass('cell-hover')
  }
}
