abstract class AbstractStrategy {
  public static shortName: string = ''
  description: string = ''
  onTranspositionHappenedListeners: Array<any> = [];
  cipherBoardCtx: any;
  constructor(cipherBoardCtx: any) {
    this.cipherBoardCtx = cipherBoardCtx
    document.addEventListener('click', (e: any) => {
      if (["cancel-transposition", "apply-transposition"].includes(e.target.id)) {
        if (this.getShortName() == e.target.dataset.transposeSelected) {
          if (e.target.id == "apply-transposition") {
            this.cipherBoardCtx.init(this.perform())
            this.notifyTranspositionHappened()
          }
          this.closeTranspositionConfirmation()
          let dropdownEl: any = document.getElementById("select-transpose")
          dropdownEl.selectedIndex = 0
        }
      }
    });
  }
  addTranspositionHappenedListener(handler: any) {
    this.onTranspositionHappenedListeners.push(handler)
  }
  notifyTranspositionHappened() {
    for (let i = 0; i < this.onTranspositionHappenedListeners.length; i++) {
      this.onTranspositionHappenedListeners[i]()
    }
  }
  openTranspositionDialog() {
    this.openTranspositionConfirmation()
  }
  postDialogModalOpen() {

  }
  getShortName() {
    throw new Error("You must implememt getShortName")
  }
  openTranspositionConfirmation() {
    let transpositionModal: any = document.getElementById("transpose-overlay")
    let titleEl: any = document.getElementById("transposition-title")
    titleEl.innerHTML = this.getShortName()
    let descEl: any = document.getElementById("transposition-description")
    descEl.innerHTML = this.description
    transpositionModal.style.visibility = "visible"
    let applyButtonEl: any = document.getElementById("apply-transposition")
    applyButtonEl.dataset.transposeSelected = this.getShortName()
    let cancelButtonEl: any = document.getElementById("cancel-transposition")
    cancelButtonEl.dataset.transposeSelected = this.getShortName()

    this.postDialogModalOpen()
  }
  closeTranspositionConfirmation() {
    let transpositionModal: any = document.getElementById("transpose-overlay")
    let descEl: any = document.getElementById("transposition-description")
    descEl.innerHTML = ""
    transpositionModal.style.visibility = "hidden"
  }
  perform() {

  }
}
export { AbstractStrategy };
