class SolutionBoard {
  height: number = 0;
  width: number = 0;
  rootElement: any = null;
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
    let tbody = $("tbody", this.rootElement)
    for (let i = 0; i < this.height; i++) {
      let row = tbody.append($('<tr>'));
      for (let j = 0; j < this.width; j++) {
        $(row).append($("<td>").append(''))
      }
    }
  }
}

export {
  SolutionBoard
};
