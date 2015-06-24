/*globals Meteor, describe, it, spyOn, expect, _, window , console */
/*globals FoodRecalls, LUtil, L */
(function() {
  "use strict";
  describe("MapTests", function() {
    it("should have map property", function() {      
      expect(_.has(window.LUtil, 'map')).toEqual(true);
    });
    it("should init map", function() {
      window.LUtil.initMap();
      // Map-stubs.js for the method L.map.setView will return true
      // if our code executes properly.
      expect(window.LUtil.map).toEqual(true);
    });
  });
})();