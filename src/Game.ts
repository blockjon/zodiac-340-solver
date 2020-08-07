import { SolutionKey } from "./SolutionKey"
import { CipherBoard } from "./CipherBoard"
import { SolutionBoard } from "./SolutionBoard"
import $ from "jquery";

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
    $("table tbody").on("mouseenter", "td", function(e: any) {
      that.hoveringStarted(e)
    }).on("mouseleave", "td", function(e: any) {
      that.hoveringEnded(e)
    });
  }
  hoveringStarted(event: any) {
    let columnNumber: number = event.target.cellIndex
    let rowNumber: number = $(event.target).closest('tr').index()

    $(event.target).addClass('cell-hover')
    let selectedZodiacChar: string = this.cipherBoard.resolveCharOnBoard(columnNumber, rowNumber)
    let zodiacCharLocations: Array<Array<number>> = this.cipherBoard.getAllLocationsOfZodiacChar(selectedZodiacChar)

    for (let i: number = 0; i < zodiacCharLocations.length; i++) {
      $("#cipher-board tbody tr").eq(zodiacCharLocations[i][0]).find('td').eq(zodiacCharLocations[i][1]).addClass('cell-hover')
      $("#solution-board tbody tr").eq(zodiacCharLocations[i][0]).find('td').eq(zodiacCharLocations[i][1]).addClass('cell-hover')
    }
  }
  hoveringEnded(event: any) {
    $(".cell-hover").removeClass('cell-hover')
  }
}

export { Game };
