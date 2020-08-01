class SolutionKey {
  constructor() {
    this.eToZ = {}
    this.zToE = {}
    for (var i = 65; i <= 90; i++) {
      this.eToZ[String.fromCharCode(i).toUpperCase()] = []
    }
  }
  bindZodiacCharToEnglishChar(zodiacChar, englishChar) {
    if (zodiacChar in this.zToE && this.zToE[zodiacChar] !== englishChar) {
      throw new ZodiacCharAlreadyAssignedError(`Zodiac char ${zodiacChar} is already assigned to english char ${this.zToE[zodiacChar]}`);
    }
    this.zToE[zodiacChar] = englishChar
    this.eToZ[englishChar].push(zodiacChar)
  }
  batchBindZodiacCharsToEnglishChar(zodiacChars, englishChar) {
    if (zodiacChar in this.zToE && this.zToE[zodiacChar] !== englishChar) {
      throw new ZodiacCharAlreadyAssignedError(`Zodiac char ${zodiacChar} is already assigned to english char ${this.zToE[zodiacChar]}`);
    }
    this.zToE[zodiacChar] = englishChar
    this.eToZ[englishChar].push(zodiacChar)
  }
  sayHello() {
    return 'hello'
  }
}

class ZodiacCharAlreadyAssignedError extends Error {
  constructor(message) {
    super(message);
    this.name = "ZodiacCharAlreadyAssignedError";
  }
}

module.exports = SolutionKey
