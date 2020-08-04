import $ from "jquery";

class CipherBoard {
  rootElement: any = null;
  originalCipherText: string = '';
  columnOrder: Array<number> = [];
  data: Array<Array<string>> = [];
  zodiacCharLocations: { [key: string]: Array<Array<number>> } = {};
  constructor() {

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
        row.append($("<td>").append(this.data[i][j]))
      }
      row = tbody.append(row);
    }
    this.cacheZodiacCharLocations()
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
