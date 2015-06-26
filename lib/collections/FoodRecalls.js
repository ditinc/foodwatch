/*globals FoodRecalls:true, Mongo, Meteor */
FoodRecalls = new Mongo.Collection("FoodRecalls");
// shared client and server methods  
FoodRecalls.latest = function(filter, limit) {
  return FoodRecalls.find(filter, {sort: {report_date: -1}, limit: limit});
};
if (Meteor.isServer) {
  (function () {
    FoodRecalls._ensureIndex({recall_number: 1}, {unique: 1});
  })();
}
