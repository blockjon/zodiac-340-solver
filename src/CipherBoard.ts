import { FloatingKeyboard } from "./FloatingKeyboard";

class CipherBoard {
  rootElement: any = null;
  columnOrder: Array<number> = [];
  data: Array<Array<string>> = [];
  zodiacCharLocations: { [key: string]: Array<Array<number>> } = {};
  cipherStats: any = {};
  floatingKeyboard: FloatingKeyboard
  transpositionModal: any
  transpositionStrategySelected: string = ''
  transpositionListeners: Array<any> = [];
  constructor() {
    this.floatingKeyboard = new FloatingKeyboard()
    this.transpositionModal = document.getElementById("transpose-overlay")
  }
  listenForTransposeSelectorChange() {
    let that: any = this
    document.addEventListener('change', (event: any) => {
      if (event.target.id == "select-transpose") {
        let strategy = event.target[event.target.selectedIndex].value
        if (strategy == 'zip') {
          that.openTranspositionConfirmation(
            strategy,
            `The ciphertext first is converted into a string left to right top down. Next, the zodiac letters are inserted back onto the board one column at a time starting with column 1 top to bottom and then on to column 2 top to bottom etc.`
          )
        }
      }
    })
    document.addEventListener('click', (e: any) => {
      if (["cancel-transposition", "apply-transposition"].includes(e.target.id)) {
        if (e.target.id == "apply-transposition") {
          if (this.transpositionStrategySelected == 'zip') {
            this.transposeZip()
          }
          this.notifyTranspositionHappened()
        }
        this.closeTranspositionConfirmation()
        let dropdownEl: any = document.getElementById("select-transpose")
        dropdownEl.selectedIndex = 0
      }
    });
  }
  openTranspositionConfirmation(strategy: string, description: string) {
    let titleEl: any = document.getElementById("transposition-title")
    titleEl.innerHTML = strategy
    let descEl: any = document.getElementById("transposition-description")
    descEl.innerHTML = description
    this.transpositionModal.style.visibility = "visible"
    this.transpositionStrategySelected = strategy
  }
  closeTranspositionConfirmation() {
    this.transpositionModal.style.visibility = "hidden"
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
  init(data: Array<Array<string>>) {
    this.columnOrder = []
    this.data = data
    for (let i = 0; i < data[0].length; i++) {
      this.columnOrder.push(i)
    }

    // Render the headers.
    const thead: any = document.getElementById("cipher-thead")
    while (thead.firstChild) {
      thead.removeChild(thead.lastChild)
    }
    let theadTr: any = document.createElement('tr');
    thead.appendChild(theadTr)
    for (let x = 0; x < this.columnOrder.length; x++) {
      let th = document.createElement('th');
      let newText = document.createTextNode(String(x))
      th.appendChild(newText)
      theadTr.appendChild(th);
    }
    const tbody: any = document.getElementById("cipher-board-tbody")
    while (tbody.firstChild) {
      tbody.removeChild(tbody.lastChild)
    }
    for (let i = 0; i < this.data.length; i++) {
      let row: any = tbody.insertRow();
      for (let j = 0; j < this.data[i].length; j++) {
        let cell = row.insertCell(j)
        cell.classList.add("solver-cell");
        let newText = document.createTextNode(this.data[i][j])
        cell.appendChild(newText)
      }
    }
    this.cacheZodiacCharLocations()
    this.cipherStats = this.detectStats()

    let ubgEl: any = document.getElementById("unique-bigrams")
    ubgEl.textContent = this.cipherStats.uniqueBigrams

    let cipherBoardTbody: any = document.getElementById("cipher-board-tbody")
    for (let key of Object.keys(this.cipherStats.bigrams)) {
      let value = this.cipherStats.bigrams[key]
      for (let i = 0; i < value.length; i++) {
        let column = value[i][0]
        let row = value[i][1]
        cipherBoardTbody.rows[row].cells[column].classList.add("bigram-cell");
      }
    }
  }
  listenForClicksOnCells() {
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
  transposeZip() {
    let newData: Array<Array<string>> = [];
    let longCipher: Array<string> = [];
    for (let i = 0; i < this.data.length; i++) {
      longCipher = longCipher.concat(this.data[i])
    }
    for (let i = 0; i < this.data.length; i++) {
      newData.push([])
    }
    for (let i = 0; i < longCipher.length; i++) {
      newData[i % this.data.length].push(longCipher[i])
    }
    this.init(newData)
  }
  addTranspositionListener(listener: any) {
    this.transpositionListeners.push(listener)
  }
  notifyTranspositionHappened() {
    if (this.transpositionListeners.length) {
      for (let i = 0; i < this.transpositionListeners.length; i++) {
        this.transpositionListeners[i]()
      }
    }
  }
}

export { CipherBoard };
