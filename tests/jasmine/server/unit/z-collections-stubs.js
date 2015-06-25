/*globals Meteor, Mongo */
(function() {
  "use strict";
  Mongo.Collection.prototype._ensureIndex = function(){};
  Meteor.http = {
    get: function() { }
  };
})();