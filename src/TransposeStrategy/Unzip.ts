class Unzip {
  construct() {

  }
  perform(currentBoard: Array<Array<string>>) {
    let newData: Array<Array<string>> = [];
    let longCipher: Array<string> = [];
    for (let i = 0; i < currentBoard.length; i++) {
      longCipher = longCipher.concat(currentBoard[i])
    }
    for (let i = 0; i < currentBoard.length; i++) {
      newData.push([])
    }
    for (let i = 0; i < longCipher.length; i++) {
      newData[i % currentBoard.length].push(longCipher[i])
    }
    return newData
  }
}

export { Unzip };
