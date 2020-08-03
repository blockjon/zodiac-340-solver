import $ from "jquery";

class SolutionKey {
  eToZ: { [key: string]: Array<string> } = {};
  zToE: { [key: string]: string } = {};
  rootElement: any = null;
  changeListeners: Array<any> = [];
  constructor() {
    this.eToZ = this.getDefaultEnglishToZodiacMap()
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
  examineInputBoxForChanges(event: any) {
    let zodiacCharsEntered = this.scrub(String($(event.target).val()))
    if (zodiacCharsEntered != String($(event.target).val())) {
      $(event.target).val(zodiacCharsEntered)
      console.log("invalid or duplicate chars detected")
      return
    }
    for (let i = 0; i < zodiacCharsEntered.length; i++) {
      let zCharToCheck: string = zodiacCharsEntered[i]
      let englishLetter: string = String($(event.target).attr('data-english-letter'))
      if (zCharToCheck in this.zToE && this.zToE[zCharToCheck] != englishLetter) {
        $(event.target).val(this.eToZ[englishLetter].join(''))
        console.log("char already in use")
        return
      }
    }


    let nexteToz = this.getDefaultEnglishToZodiacMap()
    let nextzToe: { [key: string]: string } = {}
    $(".zodiacCharactersForLetter").each(function() {
      let englishLetter = $(this).attr("data-english-letter")
      let zchars: Array<string> = String($(this).val()).split('')
      nexteToz[`${englishLetter}`] = zchars
      for (let i = 0; i < zchars.length; i++) {
        nextzToe[zchars[i]] = `${englishLetter}`
      }
    });
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
}

class ZodiacCharAlreadyAssignedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ZodiacCharAlreadyAssignedError";
  }
}

export { SolutionKey, ZodiacCharAlreadyAssignedError };
