(function() {
  "use strict"; 
  describe("Meteor.methods", function() {
    it("should get initial food recalls without existing data", function() {
      var fakeRecallCount = { 
        count: function() {
          return 0;
        }
      };
      spyOn(FoodRecalls, "find").and.returnValue(fakeRecallCount);
      
      var fakeHttpResponse = {
        data: {
          results : [
            { recall_number: 'ABC123', status: 'Ongoing'},
            { recall_number: 'ABC124', status: 'Ongoing'}
          ]
        }
      };
      // NOTE: Meteor.http is being mocked within z-collections-stubs.js
      spyOn(Meteor.http, "get").and.returnValue(fakeHttpResponse);
      
      var fakeUpserts = [];
      spyOn(FoodRecalls, "upsert").and.callFake(function(search, obj) {      
        return obj;
      });
      
      var fakeResults = Meteor.methodMap.getInitialFoodRecalls.call({});
      expect(fakeResults).toEqual(fakeHttpResponse.data.results);
    });
    it("should get initial food recalls with existing data", function() {
      var fakeRecallCount = { 
        count: function() {
          return 1;
        }
      };
      spyOn(FoodRecalls, "find").and.returnValue(fakeRecallCount);
      
      var fakeResults = Meteor.methodMap.getInitialFoodRecalls.call({});
      expect(fakeResults).toEqual([]);
    });
  });
})();