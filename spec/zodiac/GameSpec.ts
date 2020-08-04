import { Game } from "../../src/Game"
describe("Game Class Testing", function() {

  describe("Sanity checks", function() {
    it("Test hello", function() {
      var game = new Game();
      expect(game.sayHello()).toEqual("hello");
    });
    it("Cipher set and get", function() {
      var game = new Game();
      game.setCipherText("ABC")
      expect(game.getCipherText()).toEqual("ABC");
    });
  });

});
