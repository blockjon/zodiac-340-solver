import { SolutionKey } from "./SolutionKey"

class SolutionBoard {
  height: number = 0;
  width: number = 0;
  rootElement: any = null;
  clearTextData: Array<Array<string>> = [];
  solutionKey: SolutionKey;
  constructor() {
    this.rootElement = null
    this.solutionKey = new SolutionKey()
  }
  sayHello() {
    return 'hello'
  }
  setSolutionKey(solutionKey: SolutionKey) {
    this.solutionKey = solutionKey
  }
  setRootElement(element: any) {
    this.rootElement = element
  }
  init(height: number, width: number) {
    this.height = height
    this.width = width
    const thead: any = document.getElementById("solution-thead")
    let theadTr: any = document.createElement('tr');
    thead.appendChild(theadTr)
    while (theadTr.firstChild) {
      theadTr.removeChild(theadTr.lastChild)
    }
    for (let x = 0; x < this.width; x++) {
      let th = document.createElement('th');
      let newText = document.createTextNode(String(x))
      th.appendChild(newText)
      theadTr.appendChild(th);
    }
    for (let i = 0; i < this.height; i++) {
      let row: Array<string> = []
      for (let j = 0; j < this.width; j++) {
        row.push('')
      }
      this.clearTextData.push(row)
    }
    this.render()
  }
  render() {
    const tbody: any = document.getElementById("solution-board-tbody")
    for (let i = 0; i < this.clearTextData.length; i++) {
      let row: any = tbody.insertRow();
      for (let j = 0; j < this.clearTextData[i].length; j++) {
        let cell = row.insertCell(j)
        cell.classList.add("solver-cell");
        let newText = document.createTextNode(this.clearTextData[i][j])
        cell.appendChild(newText)
      }
    }
  }
  rerender(solutionKey: any, updatedCipherData: any) {
    let solutionTbodyEl: any = document.getElementById("solution-board-tbody")
    for (let row = 0; row < this.height; row++) {
      for (let column = 0; column < this.width; column++) {
        let englishChar = solutionKey.resolveZodiacChar(updatedCipherData[row][column])
        let currentClearTextChar = this.clearTextData[row][column]
        if (englishChar != currentClearTextChar) {
          solutionTbodyEl.rows[row].cells[column].innerText = englishChar
          this.clearTextData[row][column] = englishChar
        }
      }
    }
  }
}

export {
  SolutionBoard
};
