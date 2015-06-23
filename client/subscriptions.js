Meteor.subscribe("LatestFoodRecalls", {
  onError: function onError() {
    // TODO: error handling
  },
  onStop: function onStop() {
    // TODO: implement stopping
  },
  onReady: function onReady() {
    Session.set('LatestFoodRecallsIsReady', true);
    $("#latestFoodRecalls").select2({
		placeholder: 'Select a Recall'
	});	
	$("#latestFoodRecalls").select2('val', '');
	$(".recall-detail").hide();
  }
});