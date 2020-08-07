class FloatingKeyboard {
  el: any
  zodiacCharacterSelected: string = ""
  letterSelectedHandlers: Array<any> = []
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
    document.addEventListener('click', (e: any) => {
      if (e.target.classList.contains('english-letter')) {
        this.runLetterSelectedHandlers(this.zodiacCharacterSelected, e.target.dataset.letter)
      }
      this.close()
    });
  }
  runLetterSelectedHandlers(zodiacCharacterSelected: string, englishLetter: string) {
    for (let i = 0; i < this.letterSelectedHandlers.length; i++) {
      this.letterSelectedHandlers[i](zodiacCharacterSelected, englishLetter)
    }
  }
  open(zodiacCharacterSelected: string) {
    let zodiacCharClickedOnLabel: any = document.getElementById("zodiacCharClickedOn")
    zodiacCharClickedOnLabel.innerHTML = zodiacCharacterSelected
    this.el.style.visibility = "visible"
    this.zodiacCharacterSelected = zodiacCharacterSelected
  }
  close() {
    this.el.style.visibility = "hidden"
    this.zodiacCharacterSelected = ""
  }
}

export { FloatingKeyboard };
