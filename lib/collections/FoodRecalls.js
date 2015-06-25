/*globals FoodRecalls:true, Mongo, Meteor */
FoodRecalls = new Mongo.Collection("FoodRecalls");
FoodRecalls.latest = function() {
  return FoodRecalls.find({}, {sort: {recall_date: -1}, limit: 10});
};
if (Meteor.isServer) {
  (function () {
    FoodRecalls._ensureIndex({recall_number: 1}, {unique: 1});
  })();
}
