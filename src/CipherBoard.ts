import { FloatingKeyboard } from "./FloatingKeyboard";
import { Unzip } from "./TransposeStrategy/Unzip";
import { Reverse } from "./TransposeStrategy/Reverse";
import { TabularPassword } from "./TransposeStrategy/TabularPassword";

class CipherBoard {
  rootElement: any = null;
  columnOrder: Array<number> = [];
  data: Array<Array<string>> = [];
  zodiacCharLocations: { [key: string]: Array<Array<number>> } = {};
  cipherStats: any = {};
  floatingKeyboard: FloatingKeyboard
  transpositionStrategySelected: string = ''
  transpositionListeners: Array<any> = [];
  appliedTranspositions: Array<object> = []
  constructor() {
    this.floatingKeyboard = new FloatingKeyboard()
  }
  listenForTransposeSelectorChange() {
    let strategies: any = {}
    strategies[Unzip.shortName] = new Unzip(this)
    strategies[Reverse.shortName] = new Reverse(this)
    strategies[TabularPassword.shortName] = new TabularPassword(this)
    let dropdown: any = document.getElementById("select-transpose")
    let transpositionsAppliedEl: any = document.getElementById("list-of-transpositions")
    for (let strategy of Object.values(strategies)) {
      let thisStrategy: any = strategy
      let option = document.createElement("option");
      option.text = thisStrategy.getShortName();
      option.value = thisStrategy.getShortName()
      dropdown.add(option)
      thisStrategy.addTranspositionHappenedListener((shortName: string, shortDescription: string, originalTranspositionDescription: string) => {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(shortDescription));
        transpositionsAppliedEl.appendChild(li);
        let descEl: any = document.getElementById("transpositions-description")
        this.appliedTranspositions.push({
          'originalTranspositionDescription': originalTranspositionDescription
        })
        let whatZodiacDid = "The transpositions above assume the zodiac originally created a homophonic substitution cipher"
        for (let i = this.appliedTranspositions.length - 1; i > -1; i--) {
          let thisItem: any = this.appliedTranspositions[i]
          whatZodiacDid += " and then he " + thisItem.originalTranspositionDescription
        }
        whatZodiacDid += "."
        descEl.textContent = whatZodiacDid
        let strategyLabelEl: any = document.getElementById("transposition-strategy-label")
        strategyLabelEl.style.visibility = "visible"
        this.notifyTranspositionHappened()
      })
    }

    let that: any = this
    document.addEventListener('change', (event: any) => {
      if (event.target.id == "select-transpose") {
        let selectedStrategy = event.target[event.target.selectedIndex].value
        strategies[selectedStrategy].openTranspositionDialog()
      }
    })
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
  getPlusCountForCell(x: number, y: number) {
    let plusCount = 0
    for (let rowNum = 0; rowNum < this.data.length; rowNum++) {
      let row: Array<string> = this.data[rowNum]
      for (let colNum = 0; colNum < row.length; colNum++) {
        if (row[colNum] == "+") {
          plusCount++
        } else if (row[colNum] == "-") {
          plusCount--
        }
        if (colNum == x && rowNum == y) {
          return plusCount
        }
      }
    }
    throw new Error(`getPlusCountForCell out of bounds this should never happen. x = ${x} y = ${y}`)
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
        // console.log(`x = ${x} y = ${y}`)
        this.floatingKeyboard.open(this.data[y][x], x, y)
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
