import { SolutionKey } from "./SolutionKey"
import { CipherBoard } from "./CipherBoard"
import { SolutionBoard } from "./SolutionBoard"

class Game {
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
  setCipherBoard(cipherBoard: CipherBoard) {
    this.cipherBoard = cipherBoard
  }
  setSolutionBoard(solutionBoard: SolutionBoard) {
    this.solutionBoard = solutionBoard
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
  handleTranspositionApplied() {
    this.solutionBoard.rerender.call(
      this.solutionBoard,
      this.solutionKey,
      this.cipherBoard.getData()
    )
  }
  parseCipherText(rawInput: string) {
    let data: Array<Array<string>> = [];
    let lines: Array<string> = rawInput.split("\n")
    for (let i = 0; i < lines.length; i++) {
      let row: Array<string> = lines[i].split('')
      data.push(row)
    }
    return data
  }
  play(cipherText: string) {
    let data = this.parseCipherText(cipherText)
    this.cipherBoard.init(data)
    this.cipherBoard.listenForClicksOnCells()
    this.solutionBoard.init(this.cipherBoard.getHeight(), this.cipherBoard.getWidth())
    this.watchMouseHoverEvents()
  }
  watchMouseHoverEvents() {
    let that: any = this
    let tds: any = document.querySelectorAll(".board tbody td")
    tds.forEach(function(tdEl: any) {
      tdEl.addEventListener('mouseenter', (event: any) => {
        that.hoveringStarted(event)
      })
      tdEl.addEventListener('mouseleave', (event: any) => {
        that.hoveringEnded(event)
      })
    });
  }
  hoveringStarted(event: any) {
    let columnNumber: number = event.target.cellIndex
    let rowNumber: number = event.target.parentNode.rowIndex - 1

    let selectedZodiacChar: string = this.cipherBoard.resolveCharOnBoard(columnNumber, rowNumber)
    let zodiacCharLocations: Array<Array<number>> = this.cipherBoard.getAllLocationsOfZodiacChar(selectedZodiacChar)

    let solutionTbodyEl: any = document.getElementById("solution-board-tbody")
    let cipherBoardTbody: any = document.getElementById("cipher-board-tbody")
    for (let i: number = 0; i < zodiacCharLocations.length; i++) {
      cipherBoardTbody.rows[zodiacCharLocations[i][0]].cells[zodiacCharLocations[i][1]].classList.add('cell-hover')
      solutionTbodyEl.rows[zodiacCharLocations[i][0]].cells[zodiacCharLocations[i][1]].classList.add('cell-hover')
    }
  }
  hoveringEnded(event: any) {
    let el: any = document.getElementsByClassName("cell-hover")
    while (el.length > 0) {
      el[0].classList.remove("cell-hover");
    }
  }
}

export { Game };
