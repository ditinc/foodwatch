/*globals Meteor, LUtil, Session */
(function () {
  "use strict";
	Meteor.startup(function(){
		LUtil.initLeaflet();
		// reset our session variable to false on client startup
		Session.set('LatestFoodRecallsIsReady', false);
	});
})();