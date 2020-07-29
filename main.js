function injectLetterInputBoxesToUi() {
  for (var i = 65; i <= 90; i++) {
    var letterInputHtml = '' +
      '<div class="input-group key-letter-wrapper">' +
      '  <div class="input-group-prepend">' +
      '    <span class="input-group-text" id="basic-addon1">' + String.fromCharCode(i) + '</span>' +
      '  </div>' +
      '  <input type="text" class="form-control" aria-label="Username" aria-describedby="basic-addon1">' +
      '</div>';
      $('#key-wrapper').append(letterInputHtml);
  }
}

$(function() {
  console.log($("#key-wrapper"))
  injectLetterInputBoxesToUi();
});
