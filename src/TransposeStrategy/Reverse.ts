import { AbstractStrategy } from "./AbstractStrategy"

class Reverse extends AbstractStrategy {
  public static shortName: string = 'reverse'
  description: string = 'Reverse the cipher text'
  perform() {
    let newData: Array<Array<string>> = [];
    let longCipher: Array<string> = [];
    for (let i = 0; i < this.cipherBoardCtx.data.length; i++) {
      longCipher = longCipher.concat(this.cipherBoardCtx.data[i])
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
  getShortName() {
    return Reverse.shortName
  }
}

export { Reverse };
