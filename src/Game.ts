import { SolutionKey } from "./SolutionKey"
class Game {
  cipherText: string = ''
  solutionKey: SolutionKey
  constructor() {
    this.solutionKey = new SolutionKey()
  }
  setSolutionKey(solutionKey: SolutionKey) {
    this.solutionKey = solutionKey
  }
  setCipherText(cipherText: string) {
    this.cipherText = cipherText
  }
  getCipherText() {
    return this.cipherText
  }
  sayHello() {
    return 'hello'
  }
}

export { Game };
