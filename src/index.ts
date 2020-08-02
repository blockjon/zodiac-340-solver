import { Game } from "../src/Game"
import { CipherBoard } from "../src/CipherBoard"
import { SolutionBoard } from "../src/SolutionBoard"
import { SolutionKey } from "../src/SolutionKey"
import $ from "jquery";

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
  solutionKey.setRootElement($("#solution-key-wrapper"))
  solutionKey.registerUserInterface()

  let solutionBoard = new SolutionBoard();

  let cipherBoard = new CipherBoard();
  cipherBoard.setTableElement($("#cipher-board"))

  let game = new Game();
  solutionKey.addChangeListener(game.handleSolutionKeyUpdated)
  game.setCipherText(cipherText);
  game.setCipherBoard(cipherBoard)
  game.setSolutionBoard(solutionBoard)
  game.setSolutionKey(solutionKey)
  game.play();
}

$(function() {
  $("#bloop").text("abcdefg");
  main();
});
