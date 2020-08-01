import {
  SolutionBoard
} from "../../src/SolutionBoard"
describe("CipherBoard Class Testing", function() {

  describe("Sanity checks", function() {
    it("Hello test", function() {
      var solutionBoard = new SolutionBoard();
      expect(solutionBoard.sayHello()).toEqual("hello")
    });
  });

});
