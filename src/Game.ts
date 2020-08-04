import { SolutionKey } from "./SolutionKey"
import { CipherBoard } from "./CipherBoard"
import { SolutionBoard } from "./SolutionBoard"
import $ from "jquery";

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
    this.watchMouseHoverEvents()
    console.log("Lets play a game")
  }
  watchMouseHoverEvents() {
    let that: any = this
    $("table td").hover(function(e) {
      that.hoveringStarted(e)
    }, function(e) {
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
