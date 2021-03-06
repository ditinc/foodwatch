/*globals _, moment, Meteor, console, async */
/*globals FoodRecalls */
/*jshint curly:false */
(function() {
  "use strict";
  Meteor.methods({
    /**
     *  The search field is used to search records by report_date AND (optionally)
     *  status.
     *  @param options - The object that contains the search parameters.
     *  @param options.from string - YYMMDD the beginning date
     *  @param options.to string - YYMMDD the ending date
     *  @param options.status string - the current status, 'Ongoing', 'Completed',
     *  'Terminated', and 'Pending'
     */
    buildSearchTmpl: function(options) {
      // status is optional
      if (_.has(options, 'status')) {
        return _.template('search=report_date:[<%=obj.from%>+TO+<%=obj.to%>]+AND+status:<%=obj.status%>');
      } else {
        return _.template('search=report_date:[<%=obj.from%>+TO+<%=obj.to%>]');
      }
    },
    buildSearch: function(options) {
      return Meteor.call("buildSearchTmpl", options)(options);
    },
      /**
     *  The endpoint is built from the search template and the limit.  This is
     *  the actual URL sent to the remote API.
     *  @param options - The object that contains the url parameters.
     *  @param options.search string - the search template.
     *  @param options.limit string - the amount of records that the results will
     *  be limited.
     */
    buildEndpointTmpl: function() {
      return _.template('https://' + 'api.' + 'fda.' + 'gov' + '/food' + '/enforcement.json' + '?<%=obj.search%>&limit=<%=obj.limit%>');
    },
    buildEndpoint: function(options) {
      return Meteor.call("buildEndpointTmpl")(options);
    },
    /**
     * During server startup this method is called to check if the mongodb has any
     * existing records.  If not, call the remote API to fetch the last 100
     * records, searching by record_date.
     */
    getInitialFoodRecalls: function() {
      if (FoodRecalls.find({}).count() > 0) {
        return [];
      }
      var dateFormat = 'YYYYMMDD';    
      var daysAgo = moment().subtract(Meteor.settings.INITIAL_DAYS_TO_LOAD, 'days');
      var today = moment();
      var searchOptions = {
          from: daysAgo.format(dateFormat),
          to: today.format(dateFormat)
      };
      var search = Meteor.call("buildSearch", searchOptions);
      var endpointOptions = {
        search: search,
        limit: 100
      };
      var endpoint = Meteor.call("buildEndpoint", endpointOptions);
      if (Meteor.settings.debug) console.log('endpoint:', endpoint);
      return Meteor.call('fetchAsyncResponse', endpoint);
    },
    /**
     * After the server is running, periodically poll the remote API for new data. 
     */
    pollFoodRecalls: function() {    
      var dateFormat = 'YYYYMMDD';    
      var daysAgo = moment().subtract(1, 'days');
      var today = moment();
      var searchOptions = {
          from: daysAgo.format(dateFormat),
          to: today.format(dateFormat)
      };
      var search = Meteor.call("buildSearch", searchOptions);
      var endpointOptions = {
        search: search,
        limit: 25
      };
      var endpoint = Meteor.call("buildEndpoint", endpointOptions);
      if (Meteor.settings.debug) console.log('endpoint:', endpoint);
      return Meteor.call('fetchAsyncResponse', endpoint);
    },
    /**
     * Fetch the data asynchronously using HTTP GET.
     */
    fetchAsyncResponse: function(endpoint) {
      this.unblock();
      var response;
      try {
        response = Meteor.http.get(endpoint);
      } catch(err) {
        // no results found
        response = {data: { results: [] }};
      }
      return Meteor.call('saveResults', response);
    },
    /**
     * Upsert the JSON response documents into the mongodb
     */
    saveResults: function(response) {
      var upserts = [];
      if (response.data.results.length > 0) {
        _.each(response.data.results, function(foodRecall) {
          upserts.push(FoodRecalls.upsert({recall_number:foodRecall.recall_number}, foodRecall));
        });
      }
      return upserts;
    }
  });
  
  /**
   * Called upon initial server warm-up
   */
  Meteor.startup(function(){
    async.auto({
      getInitialFoodRecalls: function(callback, results) {
        var upserts = Meteor.call('getInitialFoodRecalls');
        callback(null, upserts);
      }
    }, function(err, results) {
      if (err) {
        console.log('err: ', err);
        return;
      }
      if (Meteor.settings.debug) { console.log('getInitialFoodRecalls.upserts.length: ', results.getInitialFoodRecalls.length); }
    });
    Meteor.setInterval(function() {
          var upserts = Meteor.call('pollFoodRecalls');
          if (Meteor.settings.debug) console.log('pollFoodRecalls.upserts.length:', upserts.length);
        }, Meteor.settings.POLL_TIMER_SECONDS * 1000);
  });
  
})();