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
    console.log(this.solutionBoard)
  }
  getCipherText() {
    return this.cipherText
  }
  sayHello() {
    return 'hello'
  }
  handleSolutionKeyUpdated() {
    this.solutionBoard.rerender.call(
      this.solutionBoard,
      this.solutionKey,
      this.cipherBoard.getData()
    )
  }
  play() {
    if (this.cipherText.length == 0) {
      throw new Error("Please provide a cipherText to Game")
    }
    this.cipherBoard.init(this.cipherText)
    this.solutionBoard.init(this.cipherBoard.getHeight(), this.cipherBoard.getWidth())
    console.log("Lets play a game")
  }
}

export { Game };
