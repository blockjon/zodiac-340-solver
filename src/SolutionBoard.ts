import $ from "jquery";

class SolutionBoard {
  height: number = 0;
  width: number = 0;
  rootElement: any = null;
  data: Array<Array<string>> = [];
  constructor() {
    this.rootElement = null
  }
  sayHello() {
    return 'hello'
  }
  setRootElement(element: any) {
    this.rootElement = element
  }
  init(height: number, width: number) {
    this.height = height
    this.width = width
    let tHeadTr = $("thead tr", this.rootElement)
    for (let x = 0; x < this.width; x++) {
      $("thead tr", this.rootElement).append($('<th scope="row">').append(`${x}`));
    }
    for (let i = 0; i < this.height; i++) {
      let row: Array<string> = []
      for (let j = 0; j < this.width; j++) {
        row.push('')
      }
      this.data.push(row)
    }
    this.render()
  }
  render() {
    let tbody = $("tbody", this.rootElement)
    for (let i = 0; i < this.data.length; i++) {
      let row = tbody.append($('<tr>'));
      for (let j = 0; j < this.data[i].length; j++) {
        $(row).append($("<td>").append(''))
      }
    }
  }
  rerender(solutionKey: any, updatedCipherData: any) {
    console.log(this.height)
    // let tbody = $("tbody", this.rootElement)
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        console.log(`updatedCipherData[${i}][${j}] = '${updatedCipherData[i][j]}'`)
        console.log(`this.data[${i}][${j}] = '${this.data[i][j]}'`)
        // if (updatedCipherData[i][j] != this.data[i][j]) {
        //   console.log(`${i}, ${j} should be updated`)
        // }
        // $(row).append($("<td>").append(''))
      }
    }
    // this.data = updatedCipherData
  }
}

export {
  SolutionBoard
};
