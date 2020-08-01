class SolutionKey {
  eToZ: { [key: string]: any } = {};
  zToE: { [key: string]: any } = {};
  constructor() {
    for (var i = 65; i <= 90; i++) {
      this.eToZ[String.fromCharCode(i).toUpperCase()] = []
    }
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
      return null
    }
  }
  sayHello() {
    return 'hello'
  }
}

class ZodiacCharAlreadyAssignedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ZodiacCharAlreadyAssignedError";
  }
}

export { SolutionKey, ZodiacCharAlreadyAssignedError };
