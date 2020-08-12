import { CipherBoard } from "./CipherBoard"

class SolutionKey {
  eToZ: { [key: string]: Array<string> } = {};
  zToE: { [key: string]: string } = {};
  rootElement: any = null;
  changeListeners: Array<any> = [];
  cipherBoard: any
  constructor() {
    this.eToZ = this.getDefaultEnglishToZodiacMap()
  }
  setCipherBoard(cipherBoard: CipherBoard) {
    this.cipherBoard = cipherBoard
  }
  uiKeyboardClicked(zodiacCharacter: string, englishCharacter: string, colNum: number, rowNum: number) {
    // If caesar mode is enabled, apply offset as needed.
    // console.log(`rowNum = ${rowNum} and colNum = ${colNum}`)
    let caesarShiftCheckboxEl: any = document.getElementById("caesar-shift-mode")
    if (caesarShiftCheckboxEl.checked) {
      let caesarBaseChar = ''
      // console.log("caesar mode requires consideration of offset")
      // console.log(`english character = ${englishCharacter}`)
      let englishCharOffset: number = (englishCharacter.toLowerCase().charCodeAt(0) - 97)
      // console.log(`english character offset = ${englishCharOffset}`)
      let numPlusses: number = this.cipherBoard.getPlusCountForCell(colNum, rowNum)
      // console.log(`numPlusses = ${numPlusses}`)
      englishCharOffset = (englishCharOffset + numPlusses) % 26
      caesarBaseChar = String.fromCharCode(englishCharOffset + 97).toUpperCase()
      // console.log(`caesarBaseChar = ${caesarBaseChar}`)
      englishCharacter = caesarBaseChar
    }

    let inputBox: any = document.querySelectorAll(`[data-english-letter=${englishCharacter}]`)[0];
    inputBox.value = inputBox.value + zodiacCharacter
    this.examineInputBoxForChanges(inputBox)
  }
  getDefaultEnglishToZodiacMap() {
    let result: any = {}
    for (let i = 65; i <= 90; i++) {
      result[String.fromCharCode(i).toUpperCase()] = []
    }
    return result
  }
  addChangeListener(listener: any) {
    this.changeListeners.push(listener)
  }
  bindZodiacCharToEnglishChar(zodiacChar: string, englishChar: string) {
    if (zodiacChar in this.zToE && this.zToE[zodiacChar] !== englishChar) {
      throw new ZodiacCharAlreadyAssignedError(`Zodiac char ${zodiacChar} is already assigned to english char ${this.zToE[zodiacChar]}`);
    }
    this.zToE[zodiacChar] = englishChar
    this.eToZ[englishChar].push(zodiacChar)
  }
  batchBindZodiacCharsToEnglishChar(zodiacChars: Array<string>, englishChar: string) {
    for (var i = 0; i < zodiacChars.length; i++) {
      let zodiacChar = zodiacChars[i]
      if (zodiacChar in this.zToE && this.resolveZodiacChar(zodiacChar) !== englishChar) {
        throw new ZodiacCharAlreadyAssignedError(`Zodiac char ${zodiacChar} is already assigned to english char ${this.zToE[zodiacChar]}`);
      }
      this.bindZodiacCharToEnglishChar(zodiacChar, englishChar)
    }
  }
  resolveZodiacChar(zodiacChar: string) {
    if (zodiacChar in this.zToE) {
      return this.zToE[zodiacChar]
    } else {
      return ''
    }
  }
  sayHello() {
    return 'hello'
  }
  setRootElement(rootElement: any) {
    this.rootElement = rootElement
  }
  registerUserInterface() {
    if (this.rootElement == null) {
      throw new Error("Missing root element property")
    }
    let columnDiv: any = document.createElement("DIV");
    columnDiv.classList.add("col")
    for (var i = 65; i <= 90; i++) {
      let letter = String.fromCharCode(i).toUpperCase()
      let html = '' +
        '<div class="input-group key-letter-wrapper">' +
        '  <div class="input-group-prepend">' +
        '    <span class="input-group-text">' + letter + '</span>' +
        '  </div>' +
        '  <input type="text" class="form-control cipherText zodiacCharactersForLetter" data-english-letter="' + letter + '">' +
        '</div>';
      let elements = this.htmlToElements(html)
      columnDiv.appendChild(elements[0])
      if (i == 77 || i == 90) {
        this.rootElement.appendChild(columnDiv)
        columnDiv = document.createElement("DIV");
        columnDiv.classList.add("col")
      }
    }
    let handleInputBoxModified = (event: any) => this.examineInputBoxForChanges(event.target)
    let zcharInputEls: any = document.querySelectorAll(".zodiacCharactersForLetter")
    zcharInputEls.forEach(function(zcharInputEl: any) {
      zcharInputEl.addEventListener('keyup', (event: any) => {
        handleInputBoxModified(event)
      })
    })
  }
  scrub(input: string) {
    let re = /[^#%&()*+./123456789:;<>@ABCDEFGHJKLMNOPRSTUVWXYZ^_bcdfjklpqtyz|-]/g;
    var str = input.replace(re, '');
    var uniql = "";
    for (let x = 0; x < str.length; x++) {
      if (uniql.indexOf(str.charAt(x)) == -1) {
        uniql += str[x];
      }
    }
    return uniql;
  }
  examineInputBoxForChanges(inputBox: any) {
    let zodiacCharsEntered = this.scrub(String(inputBox.value))
    if (zodiacCharsEntered != String(inputBox.value)) {
      inputBox.value = zodiacCharsEntered
      console.log("invalid or duplicate chars detected")
      return
    }
    for (let i = 0; i < zodiacCharsEntered.length; i++) {
      let zCharToCheck: string = zodiacCharsEntered[i]
      let englishLetter: string = String(inputBox.dataset.englishLetter)
      if (zCharToCheck in this.zToE && this.zToE[zCharToCheck] != englishLetter) {
        inputBox.value = this.eToZ[englishLetter].join('')
        alert(`The last zodiac character you entered was found to already be mapped to english character ${englishLetter}`)
        return
      }
    }

    let nexteToz = this.getDefaultEnglishToZodiacMap()
    let nextzToe: { [key: string]: string } = {}

    let zodiacInputs: any = document.querySelectorAll('.zodiacCharactersForLetter')
    zodiacInputs.forEach(function(el: any) {
      let englishLetter = el.dataset.englishLetter
      let zchars: Array<string> = el.value.split('')
      nexteToz[`${englishLetter}`] = zchars
      for (let i = 0; i < zchars.length; i++) {
        nextzToe[zchars[i]] = `${englishLetter}`
      }
    })
    this.eToZ = nexteToz
    this.zToE = nextzToe
    this.notifySolutionKeyUpdated()
  }
  notifySolutionKeyUpdated() {
    if (this.changeListeners.length) {
      for (let i = 0; i < this.changeListeners.length; i++) {
        this.changeListeners[i]()
      }
    }
  }
  htmlToElements(html: string) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
  }
}

class ZodiacCharAlreadyAssignedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ZodiacCharAlreadyAssignedError";
  }
}

export { SolutionKey, ZodiacCharAlreadyAssignedError };
