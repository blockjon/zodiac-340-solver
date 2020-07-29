function initAlphabetManager() {
  var alphabetManager = new AlphabetManager()
  var keyWrapper = $('#key-wrapper')
  for (var i = 65; i <= 90; i++) {
    var letter  = new Letter(String.fromCharCode(i), keyWrapper, alphabetManager)
    alphabetManager.manageLetter(letter)
  }
  return alphabetManager
}

$(function() {
  aManager = initAlphabetManager();
});
