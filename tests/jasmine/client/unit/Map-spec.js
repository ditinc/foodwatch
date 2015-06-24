/*globals Meteor, describe, it, spyOn, expect, _, window , console */
/*globals FoodRecalls, LUtil, L */
(function() {
  "use strict";
  describe("MapTests", function() {
    it("should have map property", function() {
      console.log('FoodRecalls.statesData: ', FoodRecalls.statesData);
      expect(_.has(window.LUtil, 'map')).toEqual(true);
    });
  });
})();