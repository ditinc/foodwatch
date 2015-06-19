Meteor.publish("LatestFoodRecalls", function() {
	return FoodRecalls.latest();	
});