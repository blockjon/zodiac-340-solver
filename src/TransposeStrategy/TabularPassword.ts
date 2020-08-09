import { AbstractStrategy } from "./AbstractStrategy"

class TabularPassword extends AbstractStrategy {
  public static shortName: string = 'tabularpassword'
  description: string = `This option assumes you are currently looking at a version of the cipher after the
  Zodiac scrambled the column order. There are trillions of combinations of ways to scramble the colummns.
  This option assumes the Zodiac used a password to consistently scramble the cipher text into the current
  column orientation from a previous orientation. Provide a password you think the Zodiac used to scramble
  the columns and the original column orientation will be recovered. This strategy is discussed
   in <a href="https://www.youtube.com/watch?v=sHsnH1u03e4" target="_blank">this video</a>.<br />
    password: <input id="tabularpassword" type="text" maxlength="17">
  `
  perform() {
    let newData: Array<Array<string>> = []
    let referenceArray: Array<object> = []
    let newColumnOrder: Array<number> = []
    let passwordEl: any = document.getElementById("tabularpassword")
    let password: string = passwordEl.value
    for (let i = 0; i < this.cipherBoardCtx.data[0].length; i++) {
      let letter: string = password.split('')[i % password.length]
      referenceArray.push({
        'letter': letter,
        'index': i,
        'charCodeAt': letter.charCodeAt(0)
      })
    }

    let sortedReferenceArray: Array<object> = []
    sortedReferenceArray = referenceArray.sort((a: any, b: any) => {
      return a.charCodeAt - b.charCodeAt
    })
    for (let i = 0; i < sortedReferenceArray.length; i++) {
      let item: any = sortedReferenceArray[i]
      newColumnOrder.push(item.index)
    }

    // Build an empty new data.
    for (let i = 0; i < this.cipherBoardCtx.data.length; i++) {
      let row: Array<string> = []
      for (let j = 0; j < this.cipherBoardCtx.data[0].length; j++) {
        row.push('')
      }
      newData.push(row)
    }

    // Loop over each column in the new order.
    for (let originalColumnNum = 0; originalColumnNum < newColumnOrder.length; originalColumnNum++) {
      let columnToPullFrom = newColumnOrder[originalColumnNum]
      for (let row = 0; row < this.cipherBoardCtx.data.length; row++) {
        newData[row][originalColumnNum] = this.cipherBoardCtx.data[row][columnToPullFrom]
      }
    }

    return newData
  }
  postDialogModalOpen() {
    let passwordEl: any = document.getElementById("tabularpassword")
    passwordEl.focus()
    passwordEl.addEventListener('keyup', (event: any) => {
      let tmpVal = event.target.value
      tmpVal = tmpVal.replace(/[^a-zA-Z]/gi, '')
      tmpVal = tmpVal.toUpperCase()
      event.target.value = tmpVal

    })
  }
  getShortName() {
    return TabularPassword.shortName
  }
}

export { TabularPassword };
