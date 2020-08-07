import { Game } from "../../src/Game"
describe("Game Class Testing", function() {

  describe("Sanity checks", function() {
    it("Test hello", function() {
      var game = new Game();
      expect(game.sayHello()).toEqual("hello");
    });
  });

});
