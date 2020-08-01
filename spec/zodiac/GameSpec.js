describe("Game", function() {
  var Game = require('../../lib/zodiac/Game');

  describe("Sanity checks", function() {
    it("Simple assertion", function() {
      game = new Game();
      expect(game.sayHello()).toEqual('hello');
    });
  });

});
