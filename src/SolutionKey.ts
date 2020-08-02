import $ from "jquery";

class SolutionKey {
  eToZ: { [key: string]: Array<string> } = {};
  zToE: { [key: string]: string } = {};
  rootElement: any = null;
  changeListeners: Array<any> = [];
  constructor() {
    for (var i = 65; i <= 90; i++) {
      this.eToZ[String.fromCharCode(i).toUpperCase()] = []
    }
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
    let columnDiv = $("<div>", {
      "class": "col"
    });
    for (var i = 65; i <= 90; i++) {
      let letter = String.fromCharCode(i).toUpperCase()
      let html = '' +
        '<div class="input-group key-letter-wrapper">' +
        '  <div class="input-group-prepend">' +
        '    <span class="input-group-text">' + letter + '</span>' +
        '  </div>' +
        '  <input type="text" class="form-control cipherText zodiacCharactersForLetter" data-english-letter="' + letter + '">' +
        '</div>';
      columnDiv.append(html)
      if (i == 77 || i == 90) {
        this.rootElement.append(columnDiv)
        columnDiv = $("<div>", {
          "class": "col"
        });
      }
    }
    let handleInputBoxModified = (event: any) => this.examineInputBoxForChanges(event)
    $(this.rootElement).on("keyup", ".zodiacCharactersForLetter", handleInputBoxModified);
  }
  examineInputBoxForChanges(event: any) {
    let zodiacChars: string = event.target.value
    let englishLetter: string = event.currentTarget.dataset.englishLetter
    for (let i = 0; i < zodiacChars.length; i++) {
      this.zToE[zodiacChars[i]] = englishLetter
    }
    this.eToZ[englishLetter] = zodiacChars.split('')
    this.notifySolutionKeyUpdated()
  }
  notifySolutionKeyUpdated() {
    if (this.changeListeners.length) {
      for (let i = 0; i < this.changeListeners.length; i++) {
        this.changeListeners[i]()
      }
    }
  }
}

class ZodiacCharAlreadyAssignedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ZodiacCharAlreadyAssignedError";
  }
}

export { SolutionKey, ZodiacCharAlreadyAssignedError };
