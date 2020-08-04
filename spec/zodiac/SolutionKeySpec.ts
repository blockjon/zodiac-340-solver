import { SolutionKey, ZodiacCharAlreadyAssignedError } from "../../src/SolutionKey"
describe("SolutionKey Class Testing", function() {

  describe("Sanity checks", function() {
    it("Lack of resolved zodiac character returns null", function() {
      var solutionKey = new SolutionKey();
      expect(solutionKey.resolveZodiacChar('H')).toEqual('');
    });
    it("Alphabet letters are detected", function() {
      var solutionKey = new SolutionKey();
      expect(solutionKey.resolveZodiacChar('H')).toEqual('');
    });
    it("Binding zodiac H to English A works", function() {
      var solutionKey = new SolutionKey();
      solutionKey.bindZodiacCharToEnglishChar("H", "A")
      expect(solutionKey.resolveZodiacChar('H')).toEqual("A");
    });
    it("Exception thrown on double bind", function() {
      var solutionKey = new SolutionKey();
      solutionKey.bindZodiacCharToEnglishChar("H", "A")
      expect(function() { solutionKey.bindZodiacCharToEnglishChar("H", "B") }).toThrow(new ZodiacCharAlreadyAssignedError("Zodiac char H is already assigned to english char A"))
    });
  });

});
