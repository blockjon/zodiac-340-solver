describe("SolutionBoard", function() {
  var Game = require('../../lib/zodiac/SolutionBoard');

  describe("Sanity checks", function() {
    it("Simple assertion", function() {
      game = new Game();
      expect(game.sayHello()).toEqual('hello');
    });
  });

});
