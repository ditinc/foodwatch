/**
 *
 */
var ApiTemplateBuilder = {
  buildSearchTmpl: function(options) {
    // status is optional
    if (_.has(options, 'status')) {
      return _.template('search=report_date:[<%=obj.from%>+TO+<%=obj.to%>]+AND+status:<%=obj.status%>');
    } else {
      return _.template('search=report_date:[<%=obj.from%>+TO+<%=obj.to%>]');
    }
  },
  buildSearch: function(options) {
    return this.buildSearchTmpl(options)(options);
  },
  buildEndpointTmpl: function() {
    return _.template('https://' + 'api.' + 'fda.' + 'gov' + '/food' + '/enforcement.json' + '?<%=obj.search%>&limit=<%=obj.limit%>');
  },
  buildEndpoint: function(options) {
    return this.buildEndpointTmpl()(options);
  }
};

Meteor.methods({
  /**
   *
   */
  getInitialFoodRecalls: function() {
    if (FoodRecalls.find({}).count() > 0) {
      return;
    }
    var dateFormat = 'YYYYMMDD';    
    var daysAgo = moment().subtract(Meteor.settings.INITIAL_DAYS_TO_LOAD, 'days');
    var today = moment();
    var searchOptions = {
        from: daysAgo.format(dateFormat),
        to: today.format(dateFormat)
    };
    var search = ApiTemplateBuilder.buildSearch(searchOptions);
    var endpointOptions = {
      search: search,
      limit: 100
    };
    var endpoint = ApiTemplateBuilder.buildEndpoint(endpointOptions);
    if (Meteor.settings.debug) console.log('endpoint:', endpoint);
    return Meteor.call('fetchResponse', endpoint);
  },
  pollFoodRecalls: function() {    
    var dateFormat = 'YYYYMMDD';    
    var daysAgo = moment().subtract(1, 'days');
    var today = moment();
    var searchOptions = {
        from: daysAgo.format(dateFormat),
        to: today.format(dateFormat)
    };
    var search = ApiTemplateBuilder.buildSearch(searchOptions);
    var endpointOptions = {
      search: search,
      limit: 25
    };
    var endpoint = ApiTemplateBuilder.buildEndpoint(endpointOptions);
    if (Meteor.settings.debug) console.log('endpoint:', endpoint);
    return Meteor.call('fetchResponse', endpoint);
  },
  fetchResponse: function(endpoint) {
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
  saveResults: function(response) {
    var upserts = []
    if (response.data.results.length > 0) {
      _.each(response.data.results, function(foodRecall) {
        upserts.push(FoodRecalls.upsert({recall_number:foodRecall.recall_number}, foodRecall));
      });
    }
    return upserts;
  },
});

Meteor.startup(function(){
  Meteor.call('getInitialFoodRecalls');
  Meteor.setInterval(function() {
    var upserts = Meteor.call('pollFoodRecalls');
    if (Meteor.settings.debug) console.log('pollFoodRecalls.upserts:', upserts);
  }, Meteor.settings.POLL_TIMER_SECONDS * 1000);
});