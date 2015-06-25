/*globals Meteor, FoodRecalls */
(function() {
  "use strict";
	Meteor.publish("LatestFoodRecalls", function() {
		return FoodRecalls.latest();	
	});
})();