describe("CipherBoard", function() {
  var Game = require('../../lib/zodiac/CipherBoard');

  describe("Sanity checks", function() {
    it("Simple assertion", function() {
      game = new Game();
      expect(game.sayHello()).toEqual('hello');
    });
  });

});
