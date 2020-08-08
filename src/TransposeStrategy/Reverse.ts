class Reverse {
  construct() {

  }
  perform(currentBoard: Array<Array<string>>) {
    let newData: Array<Array<string>> = [];
    let longCipher: Array<string> = [];
    for (let i = 0; i < currentBoard.length; i++) {
      longCipher = longCipher.concat(currentBoard[i])
    }
    let rowNum: number = 0
    let pointer: number = longCipher.length - 1
    let newRow: Array<string> = []
    while (pointer > -1) {
      let zchar = longCipher[pointer]
      newRow.push(zchar)
      if (newRow.length == 17) {
        newData.push(newRow)
        newRow = []
      }
      pointer--
    }
    return newData
  }
}

export { Reverse };
