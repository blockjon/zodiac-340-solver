import { FloatingKeyboard } from "./FloatingKeyboard";
import $ from "jquery";

class CipherBoard {
  rootElement: any = null;
  originalCipherText: string = '';
  columnOrder: Array<number> = [];
  data: Array<Array<string>> = [];
  zodiacCharLocations: { [key: string]: Array<Array<number>> } = {};
  cipherStats: any = {};
  floatingKeyboard: FloatingKeyboard
  constructor() {
    this.floatingKeyboard = new FloatingKeyboard()
  }
  setFloatingKeyboard(floatingKeyboard: FloatingKeyboard) {
    this.floatingKeyboard = floatingKeyboard
  }
  sayHello() {
    return 'hello'
  }
  setRootElement(element: any) {
    this.rootElement = element
  }
  getHeight() {
    return this.data.length;
  }
  getWidth() {
    return this.data[0].length;
  }
  getData() {
    return this.data
  }
  init(cipherText: string) {
    this.originalCipherText = cipherText;
    for (let i = 0; i < this.originalCipherText.split("\n")[0].length; i++) {
      this.columnOrder.push(i)
    }
    let lines: Array<string> = this.originalCipherText.split("\n")
    for (let i = 0; i < lines.length; i++) {
      let row: Array<string> = lines[i].split('')
      this.data.push(row)
    }
    // Render the headers.
    let tHeadTr = $("thead tr", this.rootElement)
    for (let x = 0; x < this.columnOrder.length; x++) {
      $("thead tr", this.rootElement).append($('<th class="handle" scope="row">').append(`${x}`));
    }
    let tbody = $("tbody", this.rootElement)
    for (let i = 0; i < this.data.length; i++) {
      let row: any = $('<tr>');
      for (let j = 0; j < this.data[i].length; j++) {
        row.append($("<td class=\"solver-cell\">").append(this.data[i][j]))
      }
      row = tbody.append(row);
    }
    this.cacheZodiacCharLocations()
    this.cipherStats = this.detectStats()

    $("#unique-bigrams").text(this.cipherStats.uniqueBigrams)
    $("#bigram-count").text(this.cipherStats.bigramCount)
    for (let key of Object.keys(this.cipherStats.bigrams)) {
      let value = this.cipherStats.bigrams[key]
      for (let i = 0; i < value.length; i++) {
        let column = value[i][0]
        let row = value[i][1]
        $("#cipher-board tbody tr").eq(row).find('td').eq(column).addClass('bigram-cell')
      }
    }
    document.addEventListener('click', (e: any) => {
      if (e.target.classList.contains('solver-cell')) {
        let x = e.target.cellIndex
        let y = e.target.parentNode.rowIndex - 1
        this.floatingKeyboard.open(this.data[y][x])
      }
    });
  }
  detectStats() {
    let bigrams: { [key: string]: Array<Array<number>> } = {};
    let cipherString = ''
    let uniqueBigrams = 0
    let bigramCount = 0
    for (let i = 0; i < this.data.length; i++) {
      cipherString += this.data[i].join('')
    }
    cipherString = cipherString.trim()
    let cipherWidth: number = this.data[0].length
    for (let i = 0; i < cipherString.length; i++) {
      if (i + 1 == cipherString.length) {
        break
      }
      let char = String(cipherString[i])
      let nextChar = String(cipherString[i + 1])
      let bigram = char + nextChar
      if (bigram in bigrams) {
        continue
      }
      let numOccurances = this.occurrences(cipherString, bigram)
      if (numOccurances > 1) {
        if (bigram in bigrams == false) {
          bigrams[bigram] = []
        }
        uniqueBigrams++
        let startSearchFrom = -1
        while (true) {
          let nextLocation: number = cipherString.indexOf(bigram, startSearchFrom)
          if (nextLocation == -1) {
            break
          }
          bigramCount++
          // console.log(`nextLocation = ${nextLocation}`)
          let firstCharCoords: any = this.cipherOffsetToCoords(nextLocation)
          bigrams[bigram].push([firstCharCoords.column, firstCharCoords.row])
          let secondCharCoords: any = this.cipherOffsetToCoords(nextLocation + 1)
          bigrams[bigram].push([secondCharCoords.column, secondCharCoords.row])
          startSearchFrom = nextLocation + 2
        }
      }
    }
    return {
      bigrams: bigrams,
      uniqueBigrams: uniqueBigrams,
      bigramCount: bigramCount
    }
  }
  cipherOffsetToCoords(offset: number) {
    let cipherWidth: number = this.data[0].length
    let row = Math.floor(offset / cipherWidth)
    let column = offset % cipherWidth
    return { column: column, row: row }
  }
  /** Function that count occurrences of a substring in a string;
   * @param {String} string               The string
   * @param {String} subString            The sub string to search for
   * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
   *
   * @author Vitim.us https://gist.github.com/victornpb/7736865
   * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
   * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
   */
  occurrences(input: string, subString: string) {

    input += "";
    subString += "";
    if (subString.length <= 0) return (input.length + 1);

    var n = 0,
      pos = 0,
      step = subString.length;

    while (true) {
      pos = input.indexOf(subString, pos);
      if (pos >= 0) {
        ++n;
        pos += step;
      } else break;
    }
    return n;
  }
  cacheZodiacCharLocations() {
    this.zodiacCharLocations = {}
    for (let row = 0; row < this.data.length; row++) {
      for (let column = 0; column < this.data[row].length; column++) {
        let zodiacChar = this.resolveCharOnBoard(column, row)
        if (zodiacChar in this.zodiacCharLocations == false) {
          this.zodiacCharLocations[zodiacChar] = []
        }
        this.zodiacCharLocations[zodiacChar].push([row, column])
      }
    }
  }
  resolveCharOnBoard(columnIndex: number, rowIndex: number) {
    if (rowIndex < -1 || rowIndex >= this.data.length) {
      throw new Error("rowIndex out of bounds")
    }
    if (columnIndex < -1 || columnIndex >= this.data[0].length) {
      throw new Error("columnIndex out of bounds")
    }
    return this.data[rowIndex][columnIndex]
  }
  getAllLocationsOfZodiacChar(zodiacChar: string) {
    return this.zodiacCharLocations[zodiacChar]
  }
}

export { CipherBoard };
