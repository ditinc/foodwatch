Meteor.subscribe("LatestFoodRecalls", {
  onError: function onError() {
    // TODO: error handling
  },
  onStop: function onStop() {
    // TODO: implemnt stopping
  },
  onReady: function onReady() {
    Session.set('LatestFoodRecallsIsReady', true);
    $('select').select2();
  }
});