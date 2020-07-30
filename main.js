function initAlphabetManager() {
  var alphabetManager = new AlphabetManager()
  var keyWrapper = $('.key-wrapper');
  var a2mDiv = $("<div>", {"class": "col"});
  keyWrapper.append(a2mDiv)
  var n2zDiv = $("<div>", {"class": "col"});
  keyWrapper.append(n2zDiv)
  for (var i = 65; i <= 90; i++) {
    var letter  = new Letter(String.fromCharCode(i), (i < 78 ? a2mDiv : n2zDiv), alphabetManager)
    alphabetManager.manageLetter(letter)
  }
  return alphabetManager
}

$(function() {
  var cipherText = `HER>pl^VPk|1LTG2d
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

  alphabetManager = initAlphabetManager();
  cipherManager = new CipherManager(cipherText, $("#cipher"), alphabetManager)
  solutionManager = new SolutionManager(
    cipherText,
    $("#solution"),
    cipherManager,
    alphabetManager
  )
  hoverManager = new HoverManager($("#cipher"), $("#solution"))

  // Activate column dragging
  $('#cipher').dragtable({persistState: function(table) {
      cipherManager.notifyColumnAdjusted()
    }
  });

});
