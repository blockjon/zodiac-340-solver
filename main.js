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
  aManager = initAlphabetManager();
});
