import { Game } from "./Game"
import { CipherBoard } from "./CipherBoard"
import { SolutionBoard } from "./SolutionBoard"
import { SolutionKey } from "./SolutionKey"
import { FloatingKeyboard } from "./FloatingKeyboard"

let cipherText = `HER>pl^VPk|1LTG2d
Np+B(#O%DWY.<*Kf)
By:cM+UZGW()L#zHJ
Spp7^l8*V3pO++RK2
_9M+ztjd|5FP+&4k/
p8R^FlO-*dCkF>2D(
#5+Kq%;2UcXGV.zL|
(G2Jfj#O+_NYz+@L9
d<M+b+ZR2FBcyA64K
-zlUV+^J+Op7<FBy-
U+R/5tE|DYBpbTMKO
2<clRJ|*5T4M.+&BF
z69Sy#+N|5FBc(;8R
lGFN^f524b.cV4t++
yBX1*:49CE>VUZ5-+
|c.3zBK(Op^.fMqG2
RcT+L16C<+FlWB|)L
++)WCzWcPOSHT/()p
|FkdW<7tB_YOB*-Cc
>MDHNpkSzZO8A|K;+`

function main() {

  let solutionKey = new SolutionKey();
  solutionKey.setRootElement(document.getElementById("solution-key-wrapper"))
  solutionKey.registerUserInterface()

  let solutionBoard = new SolutionBoard();
  solutionBoard.setRootElement(document.getElementById("solution-board"))
  solutionBoard.setSolutionKey(solutionKey)

  let cipherBoard = new CipherBoard();

  let floatingKeyboard = new FloatingKeyboard();
  floatingKeyboard.init()
  floatingKeyboard.addLetterSelectedHandler((zodiacCharacter: string, englishCharacter: string) => {
    solutionKey.uiKeyboardClicked.call(solutionKey, zodiacCharacter, englishCharacter)
  })
  cipherBoard.setRootElement(document.getElementById("cipher-board"))
  cipherBoard.setFloatingKeyboard(floatingKeyboard)
  cipherBoard.addTranspositionListener(() => game.handleTranspositionApplied.call(game))

  let game = new Game();
  solutionKey.addChangeListener(() => game.handleSolutionKeyUpdated.call(game))
  game.setCipherBoard(cipherBoard)
  game.setSolutionBoard(solutionBoard)
  game.setSolutionKey(solutionKey)
  game.play(cipherText);
}

main();
