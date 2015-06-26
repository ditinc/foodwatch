/*globals Meteor, FoodRecalls, console */
(function() {
  "use strict";
	Meteor.publish("LatestFoodRecalls", function(filter, limit) {
		if (Meteor.settings.debug) { console.log('filter: %j, limit: %j', filter, limit); }
		return FoodRecalls.latest(filter, limit);
	});
})();