/*globals Meteor, describe, it, spyOn, expect */
/*globals FoodRecalls */
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
    it("should poll food recalls", function() {      
      var fakeHttpResponse = {
        data: {
          results : [
            { recall_number: 'ABC123', status: 'Ongoing'}
          ]
        }
      };
      // NOTE: Meteor.http is being mocked within z-collections-stubs.js
      spyOn(Meteor.http, "get").and.returnValue(fakeHttpResponse);
      
      spyOn(FoodRecalls, "upsert").and.callFake(function(search, obj) {      
        return obj;
      });
      
      var fakeResults = Meteor.methodMap.pollFoodRecalls.call({});
      expect(fakeResults).toEqual(fakeHttpResponse.data.results);
    });
    it("should build search template with invalid options", function() {
      var search = Meteor.call('buildSearch', {a:'',b:''});
      expect(search).toEqual('search=report_date:[+TO+]');      
    });
    it("should build search template with valid options", function() {
      var search = Meteor.call('buildSearch', {from:'20150101',to:'20150613'});
      expect(search).toEqual('search=report_date:[20150101+TO+20150613]');      
    });
    it("should build endpoint template with valid options", function() {      
      var search = Meteor.call('buildSearch', {from:'20150101',to:'20150613'});
      var endpoint = Meteor.call('buildEndpoint', {search:search, limit:1});
      expect(endpoint).toEqual('https://'+'api.'+'fda.'+'gov'+'/food/enforcement.json?search=report_date:[20150101+TO+20150613]&limit=1');
    });
  });
})();