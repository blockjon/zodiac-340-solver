import { AbstractStrategy } from "./AbstractStrategy"

class Unzip extends AbstractStrategy {
  public static shortName: string = 'unzip'
  description: string = 'This transposition assumes the current cipher text orientation is the result of the Zodiac having walked down each column of an earlier cipher text in a vertical orientation to create the current left-to-right cipher orientation. Click apply to restore the original pre-transposed cipher text.'
  perform() {
    let newData: Array<Array<string>> = [];
    let longCipher: Array<string> = [];
    for (let i = 0; i < this.cipherBoardCtx.data.length; i++) {
      longCipher = longCipher.concat(this.cipherBoardCtx.data[i])
    }
    for (let i = 0; i < this.cipherBoardCtx.data.length; i++) {
      newData.push([])
    }
    for (let i = 0; i < longCipher.length; i++) {
      newData[i % this.cipherBoardCtx.data.length].push(longCipher[i])
    }
    return newData
  }
  getShortName() {
    return Unzip.shortName
  }
  describeOriginalTransposition() {
    return "converted the characters in each column into rows"
  }
  describeAppliedTransposition() {
    return `${this.getShortName()} - converted rows back to columns`
  }
}

export { Unzip };
