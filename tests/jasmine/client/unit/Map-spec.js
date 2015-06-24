/*globals Meteor, describe, it, spyOn, expect, _, window , console, beforeEach, mock, Blaze, document, Template, $*/
/*globals FoodRecalls, LUtil, L */
(function() {
  "use strict";
  var test_LUtil;
  beforeEach(function() {
    // lets make a copy of the object under test so that we have a clean slate
    test_LUtil = _.clone(window.LUtil);
  });
  describe("MapTests", function() {
    it("should have map property", function() {      
      expect(_.has(test_LUtil, 'map')).toEqual(true);
    });
    it("should init map", function() {
      test_LUtil.initMap();
      // Map-stubs.js for the method L.map.setView will return true
      // if our code executes properly.
      expect(test_LUtil.map).toEqual(true);
    });
    it("should highlight valid origin", function() {
      test_LUtil.geojson = window.fakeGeojson;
      test_LUtil.highlightOrigin('AL');
      expect(test_LUtil.currentOrigin).toEqual(window.fakeGeojson._layers[100]);
    });
    it("should not highlight invalid origin", function() {
      test_LUtil.geojson = window.fakeGeojson;
      test_LUtil.highlightOrigin('123');
      expect(test_LUtil.currentOrigin).toEqual(null);
    });
    it("should highlight destinations of valid states", function() {
      test_LUtil.geojson = window.fakeGeojson;
      test_LUtil.highlightDestination(["AL","AK"]);
      expect(test_LUtil.currentDestinations).toEqual([window.fakeGeojson._layers[100], window.fakeGeojson._layers[200]]);
    });
    it("should highlight destinations of invalid states", function() {
      test_LUtil.geojson = window.fakeGeojson;
      test_LUtil.highlightDestination(["ABC","123"]);
      expect(test_LUtil.currentDestinations).toEqual([]);
    });
    it("should show latestFoodRecalls select", function() {
      var div = document.createElement("DIV");
      Blaze.render(Template.map, div); 
      expect($(div).find("#latestFoodRecalls")[0]).toBeDefined();
    });
    it("should return an array of State abbreviations", function() {
    	window.LUtil.initMap();
      var mockStates = "PANYNJGeorgia";      
      var parsedStates = window.LUtil.parseStates(mockStates);
	  expect(parsedStates).toEqual(["GA","NJ","NY","PA"]);
	});
  });
})();