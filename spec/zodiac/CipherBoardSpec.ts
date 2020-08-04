import {
  CipherBoard
} from "../../src/CipherBoard"
describe("CipherBoard Class Testing", function() {

  describe("Sanity checks", function() {
    it("Hello test", function() {
      var cipherBoard = new CipherBoard();
      expect(cipherBoard.sayHello()).toEqual("hello")
    });
  });

});
