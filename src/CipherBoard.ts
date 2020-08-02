import $ from "jquery";

class CipherBoard {
  rootElement: any = null;
  originalCipherText: string = '';
  columnOrder: Array<number> = [];
  data: Array<Array<string>> = [];
  constructor() {

  }
  sayHello() {
    return 'hello'
  }
  setRootElement(element: any) {
    this.rootElement = element
  }
  getHeight() {
    return this.data[0].length;
  }
  getWidth() {
    return this.data.length;
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
      let row = tbody.append($('<tr>'));
      for (let j = 0; j < this.data[i].length; j++) {
        $(row).append($("<td>").append(this.data[i][j]))
      }
    }
  }
}

export { CipherBoard };
