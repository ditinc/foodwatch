/*globals Meteor */
(function() {
  "use strict";
  if (typeof Meteor.settings === 'undefined') {
    Meteor.settings = {};
  }
  Meteor.settings.debug = true;
  Meteor.settings.INITIAL_DAYS_TO_LOAD = 60;
  Meteor.settings.POLL_TIMER_SECONDS = 60;
})();