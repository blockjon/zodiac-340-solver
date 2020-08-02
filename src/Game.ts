import { SolutionKey } from "./SolutionKey"
import { CipherBoard } from "./CipherBoard"
import { SolutionBoard } from "../src/SolutionBoard"

class Game {
  cipherText: string = ''
  solutionKey: SolutionKey
  cipherBoard: CipherBoard
  solutionBoard: SolutionBoard
  constructor() {
    this.solutionKey = new SolutionKey()
    this.cipherBoard = new CipherBoard()
    this.solutionBoard = new SolutionBoard()
  }
  setSolutionKey(solutionKey: SolutionKey) {
    this.solutionKey = solutionKey
  }
  setCipherText(cipherText: string) {
    this.cipherText = cipherText
  }
  setCipherBoard(cipherBoard: CipherBoard) {
    this.cipherBoard = cipherBoard
  }
  setSolutionBoard(solutionBoard: SolutionBoard) {
    this.solutionBoard = solutionBoard
  }
  getCipherText() {
    return this.cipherText
  }
  sayHello() {
    return 'hello'
  }
  handleSolutionKeyUpdated(z2eMap: any) {
    console.log("bam")
  }
  play() {
    if (this.cipherText.length == 0) {
      throw new Error("Please provide a cipherText to Game")
    }
    console.log("Lets play a game")
  }
}

export { Game };
