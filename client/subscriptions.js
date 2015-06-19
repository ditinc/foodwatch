Meteor.subscribe("LatestFoodRecalls", {
  onError: function onError() {
    // TODO: error handling
  },
  onStop: function onStop() {
    // TODO: implemnt stopping
  },
  onReady: function onReady() {
    // NOTE: optionally run when ready
  }
});