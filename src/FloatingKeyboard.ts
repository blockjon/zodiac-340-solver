class FloatingKeyboard {
  el: any
  zodiacCharacterSelected: string = ""
  letterSelectedHandlers: Array<any> = []
  columnNumUsedToOpenKeyboard: number = -1
  rowNumUsedToOpenKeyboard: number = -1

  constructor() {
    this.el = document.getElementById("keyboard-overlay")
  }
  addLetterSelectedHandler(handler: any) {
    this.letterSelectedHandlers.push(handler)
  }
  init() {
    let btnWrapper: any = document.getElementById("keyboard-buttons");
    btnWrapper.innerHTML = '';
    for (let i = 65; i <= 90; i++) {
      let uppercaseLetter = String.fromCharCode(i).toUpperCase()
      let btn = document.createElement("BUTTON");
      btn.setAttribute('data-letter', uppercaseLetter);
      btn.setAttribute('class', 'english-letter');
      btn.innerHTML = uppercaseLetter
      btnWrapper.appendChild(btn)
    }
    document.addEventListener('click', (event: any) => {
      if (event.target.classList.contains('english-letter')) {
        console.log(event.target.tagName)
        this.runLetterSelectedHandlers(
          this.zodiacCharacterSelected,
          event.target.dataset.letter
        )
      }
      this.close()
    });
  }
  runLetterSelectedHandlers(zodiacCharacterSelected: string, englishLetter: string) {
    for (let i = 0; i < this.letterSelectedHandlers.length; i++) {
      this.letterSelectedHandlers[i](
        zodiacCharacterSelected,
        englishLetter,
        this.columnNumUsedToOpenKeyboard,
        this.rowNumUsedToOpenKeyboard
      )
    }
  }
  open(zodiacCharacterSelected: string, columnNumUsedToOpenKeyboard: number, rowNumUsedToOpenKeyboard: number) {
    this.columnNumUsedToOpenKeyboard = columnNumUsedToOpenKeyboard
    this.rowNumUsedToOpenKeyboard = rowNumUsedToOpenKeyboard
    let zodiacCharClickedOnLabel: any = document.getElementById("zodiacCharClickedOn")
    zodiacCharClickedOnLabel.innerHTML = zodiacCharacterSelected
    this.el.style.visibility = "visible"
    this.zodiacCharacterSelected = zodiacCharacterSelected
    let caesarShiftCheckboxEl: any = document.getElementById("caesar-shift-mode")
    let caesarDisclaimerEl: any = document.getElementById("caesar-disclaimer")
    caesarDisclaimerEl.style.visibility = caesarShiftCheckboxEl.checked ? "visible" : "hidden"
  }
  close() {
    this.el.style.visibility = "hidden"
    this.zodiacCharacterSelected = ""
    let caesarDisclaimerEl: any = document.getElementById("caesar-disclaimer")
    caesarDisclaimerEl.style.visibility = "hidden"
    this.columnNumUsedToOpenKeyboard = -1
    this.rowNumUsedToOpenKeyboard = -1
  }
}

export { FloatingKeyboard };
