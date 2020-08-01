describe("SolutionKey", function() {
  var Game = require('../../lib/zodiac/SolutionKey');

  describe("Sanity checks", function() {
    it("Simple assertion", function() {
      game = new Game();
      expect(game.sayHello()).toEqual('hello');
    });
  });

});
