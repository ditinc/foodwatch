/*LUtil is inspired by leaflet-demo (https://github.com/MeteorHudsonValley/leaflet-demo) */
/*globals window, L, $, Template, Meteor, console, _, ReactiveVar, moment*/
/*globals FoodRecalls, StatesData */
(function () {
  "use strict";
  window.LUtil = {  
    // reference to the single 'map' object to control
    map: null,
    geojson: null,  
    details: null,
    currentOrigin: null,
    lines: [],
    currentDestinations: [],
    originMarker: null,
    detMinMax: 1,
    filMinMax:1,
    // location of marker images
    imagePath : 'packages/bevanhunt_leaflet/images',
    // init function to be called ONCE on startup
    initLeaflet: function(){  
      $(window).resize(function() {
        $('#map').css('height', window.innerHeight);
      });
      $(window).resize(); // trigger resize event
    },
    // (element=div to populate, view=latlong for center)
    initMap: function(element, view){
      var self = this;
      L.Icon.Default.imagePath = self.imagePath;
      // sensible defaults if nothing specified
      element = element || 'map';
      view = view || {};
      view.zoom = view.zoom || 5;
      view.latlong = view.latlong || [37.8, -92];
      var baseLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png',{
        attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>",
        maxZoom: 18,id: 'examples.map-20v6611k'
      });
    
      this.map = L.map(element, {
      zoomControl:false,		
          layers: [baseLayer]
      })
      .setView(
        view.latlong , 
        view.zoom
      );
      
      self.geojson = L.geoJson(StatesData, {
        style:this.styleDefault,
        onEachFeature: this.onEachFeature
      }).addTo(this.map);
      
      this.addControls();
    },	
    highlightOrigin: function(state){
      var self = this;
      for (var key in self.geojson._layers) {
        if (self.geojson._layers.hasOwnProperty(key)) {
          //var props = self.geojson._layers[key].feature.properties;
          if(self.geojson._layers[key].feature.properties.abbreviation === state) {          
            self.currentOrigin = self.geojson._layers[key];            
            self.geojson._layers[key].setStyle({
              weight: 2,
              opacity: 1,
              color: 'black',
              dashArray: '',
              fillOpacity: 0.6,
              fillColor: 'blue'
            });
            
          }			
        }
      }
    },
    resetMap: function(){
  	  $('.recall-detail').hide();
    	var self = this;
    	if(self.currentDestinations.length!==0){
            for(var state in self.currentDestinations){
              if(self.currentOrigin !== self.currentDestinations[state]){
                self.geojson.resetStyle(self.currentDestinations[state]);	
              }
            }
          }
          
          _.each(self.lines, function(line) {
            self.map.removeLayer(self.lines[line]);
          });
          
          self.lines = [];
          
          self.currentDestinations = [];
          
        if(self.originMarker!==null){
        	self.map.removeLayer(self.originMarker); 
  		}
        
        if(self.currentOrigin !== null){
            self.geojson.resetStyle(self.currentOrigin);					
        }
        
        window.LUtil.detMinMax = 1;		
		$("#detMinMaxSpan").removeClass("glyphicon glyphicon-plus")
		$("#detMinMaxSpan").addClass("glyphicon glyphicon-minus")
		$(".recall-detail").css({"height":"250px"});
    	
    },    
    markOrigin: function(city, state, mfg){
    	var self = this;    	
    	if(city === null || state === null){
    		return;    		
    	}
    	 
    	var search = $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + city + " "+state+" USA ", function(data){
    		var latlon = [data[0].lat, data[0].lon];
    		var tempData = data;    		  		   		
    		self.originMarker = L.marker(latlon).addTo(self.map);
    		self.originMarker.bindPopup("<b>"+mfg+"</b><br />"+city+", "+state).openPopup();
    	});       
    },
    highlightDestination: function(states){
      var self = this;      
      states = this.parseStates(states);
      for(var st = 0; st<states.length; st++){
        for (var key in self.geojson._layers) {
          if (self.geojson._layers.hasOwnProperty(key)) {
          //var props = self.geojson._layers[key].feature.properties;
          if(self.geojson._layers[key].feature.properties.abbreviation === states[st]) {
        	self.currentDestinations.push(self.geojson._layers[key]);
            var fillColor = "red";
            var fillOpacity = 0.2;
            if(self.currentOrigin === self.geojson._layers[key]){
              fillColor = "purple";
              fillOpacity = 0.4;
            }
            self.geojson._layers[key].setStyle({
              weight: 2,
              opacity: 1,
              color: 'black',						
              fillOpacity: fillOpacity,
              fillColor: fillColor
            });						
          }			
          }
        }
      }
    },
    
    getStateName : function(stateAbbr){
    	for(var j = 0; j<StatesData.features.length; j++){
   	        if (StatesData.features[j].properties.abbreviation === stateAbbr){       	    	   
   	    		 return StatesData.features[j].properties.name; 	    	  
   	        }
    	}
    	return null;
           
    },
    
    parseStates : function(states){
      var parsedStates = [];
      var acceptedDelimiters = [" ", ",", "", "(", ")","&","."];
      var nationwide = false;
      
      //TODO accept "US"
      if(states.toLowerCase().indexOf("nationwide") >= 0){
        nationwide = true;
      }
      
      for(var j = 0; j<StatesData.features.length; j++){
        if(nationwide || states.indexOf(StatesData.features[j].properties.name) >= 0) {
          parsedStates.push(StatesData.features[j].properties.abbreviation);
          continue;
        }
        for(var k = 0; k<states.length; k++){
          var parsingAbbr = states.substring(k, k+2);
          if (StatesData.features[j].properties.abbreviation === parsingAbbr) {
            if (acceptedDelimiters.indexOf(states.substring(k-1, k))>=0 &&
                acceptedDelimiters.indexOf(states.substring(k+2, k+3))>=0){
              parsedStates.push(StatesData.features[j].properties.abbreviation);
            }
          }
        }   
      }     
      return parsedStates;
    },
    onEachFeature: function(feature, layer) {
    	layer.on({		
			click: function(){				
				$("#stateSelector").select2('val', feature.properties.abbreviation);				
			}
		});	
	},
    styleDefault: function() {
      return {
        weight: 2,
        opacity: 5,
        color: 'black',
        dashArray: '',
        fillOpacity: 0.1,
        fillColor: 'white'
      };
    },
    // register event handlers
    handleEvent: function(event, callback){
      if (!event || !callback) {
        return;
      }
      // TODO: validate event and callback
      this.map.on(event, callback);
    },
    // remove layer
    removeLayer: function(layer){
      this.map.removeLayer(layer);
    },
    addLayer: function(layer) {
      this.map.addLayer(layer);
    },
    addTileLayer: function(_layer, _obj) {
      _obj = _obj || "";
      L.tileLayer( _layer, _obj)
        .addTo(this.map);
    },
    onAddHandler: function(selector, html) {
      return function() {
        this._div = L.DomUtil.create('div', selector);
        this._div.innerHTML = html;
        L.DomEvent.disableClickPropagation(this._div);
        return this._div;
      };
    },    
    onAddHandlerWithTemplate: function(selector, template) {
      return function() {
        this._div = L.DomUtil.create('div', selector);
        Blaze.render(template, this._div);
        L.DomEvent.disableClickPropagation(this._div);
        return this._div;
      };
    },
    addControls: function() {
      var self = this;
      var recallSelector = L.control({position: 'topright'});
      recallSelector.onAdd = self.onAddHandler('info', '<b>  Recall Filtering </b><a href="#" id="filMinMax" class="pull-left"><span id="filMinMaxSpan" class="glyphicon glyphicon-minus"></span></a> <div id="recallSelector"></div>');
      recallSelector.addTo(this.map);
      $("#latestFoodRecallForm").appendTo("#recallSelector").show();
      
      self.details = L.control({position: 'bottomright'});
      self.details.onAdd = self.onAddHandler('info recall-detail', '');
      
      self.details.update = function (props) {
          props ? 
            this._div.innerHTML = (props ?
              '<div class="recallDetailsHeader"><div><a href="#" id="detMinMax" class="pull-left"><span id="detMinMaxSpan" class="glyphicon glyphicon-minus"></span></a></div><div> Recall Details </div></div>' +
              '<br><div id = "recallDetails">'+              
              '<div><b>Date Reported : </b>' + props.report_date + '</div>' +
              '<div><b>Status : </b>' + props.status + '</div>' +
              '<div><b>Recalling Firm : </b>' + props.recalling_firm + '</div>' +
              '<div><b>Product Description : </b>' + props.product_description + '</div>' +              
              '<div><b>Reason for Recall : </b>' + props.reason_for_recall + '</div>' +
              '<div><b>Product Quantity : </b>' + props.product_quantity + '</div>' +
              '<div><b>Code Information : </b>' + props.code_info + '</div>' +
              '<div><b>Product Type : </b>' + props.product_type + '</div>' +
              '<div><b>Recall # : </b>' + props.recall_number + '</div>' +              
              '<div><b>Date Initiated : </b>' + props.recall_initiation_date + '</div>' + 
              '<div><b>Classification : </b>' + props.classification + '</div>' +              
              '<div><b>State : </b>' + props.state + '</div>' +
              '<div><b>City : </b>' + props.city + '</div>' +
              '<div><b>Distribution Pattern : </b>' + props.distribution_pattern + '</div>'
              : 'Select a Recall') : this.hide();
              $('.recall-detail').show();
        };
      self.details.addTo(self.map);	
      
      var logo = L.control({position: 'topleft'});
      logo.onAdd = self.onAddHandlerWithTemplate('logo', Template.mapLabel);
      logo.addTo(self.map);	
      
    },
    getCrit: function(state, reasonFilter){
    	var self = this;
    	var stateName = this.getStateName(state);
    	return {$and:[
                      {$or:[		
	  					    {state:state},
						    {state:stateName},
						    {distribution_pattern:{$regex : ".*"+state+".*"}},
						    {distribution_pattern:{$regex : ".*"+stateName+".*"}},
						    {distribution_pattern:{$regex : ".*nationwide.*"}}
						    ]},
						    {reason_for_recall: { $regex: reasonFilter, $options: 'i' }}]}
    }
    
  };  

  Template.map.events({
     'change #stateSelector' : function(event, template){   	 
    	 window.LUtil.resetMap();    	 
    	 var state = $(event.currentTarget).val();
    	 var self = Template.instance();
    	 var reasonFilter = $('#latestFoodRecallReasonFilter').val();
    	 if (state === null) {      		 
    		self.filter.set({reason_for_recall: { $regex: reasonFilter, $options: 'i' }});
    		return FoodRecalls.latest(self.filter.get(),self.limit.get());
 		}   	    	
				
		var limit = parseInt($('#latestFoodRecallLimit').val(), 10);		
		    	    
		self.filter.set(window.LUtil.getCrit(state, reasonFilter));
	    	    	    
	    var recallsByState = FoodRecalls.find({}, 
					{sort: {recall_date: -1}, limit: self.limit.get()}).fetch();
	    
	    //TODO: check recallsByState and verify elements meet inclusion criteria req.
	    
	    self.subscription = self.subscribe('LatestFoodRecalls', self.filter.get(), self.limit.get());
	    
	    $("#latestFoodRecalls").select2('data', {id: "", text: "select a recall"}); 
	        
	    return FoodRecalls.latest(self.filter.get(), self.limit.get());  
	  	    
	},	
    'change #latestFoodRecalls': function(event, template) {
      window.LUtil.resetMap();
      var val = $('#latestFoodRecalls').select2('val');
      if (Meteor.settings.debug) { console.log('change select val:', val); }
      
      if (_.isUndefined(val) || _.isEmpty(val)) {
        return;
      }
      
      var self = Template.instance();      
      var fr = self.latestFoodRecalls().fetch();
      var originState = null;
      var originCity = null;
	  var mfg = null;
      var destinationStates = null;
      
      for(var i = 0; i<fr.length; i++){
        if(fr[i].recall_number === val){			
          window.LUtil.details.update(fr[i]);	
          originState = fr[i].state;
          originCity = fr[i].city;
	      mfg = fr[i].recalling_firm;
          destinationStates = fr[i].distribution_pattern;
        }
      }
      
      window.LUtil.markOrigin(originCity,originState,mfg); 
           
      for(var j = 0; j<StatesData.features.length; j++){
        if(StatesData.features[j].properties.abbreviation === originState){				
            window.LUtil.highlightOrigin(originState);
            window.LUtil.highlightDestination(destinationStates);
        }     
      }
      $('.recall-detail').show();
    },
    'change #latestFoodRecallLimit': function(event, template){
    	var reasonFilter = $('#latestFoodRecallReasonFilter').val();
        var limit = parseInt($('#latestFoodRecallLimit').val(), 10);
    	template.limit.set(limit, 10);
    	var state = $("#stateSelector").val();
        
        if(state === null){
      	  template.filter.set({reason_for_recall: { $regex: reasonFilter, $options: 'i' }});
        }else{      	  
      	  template.filter.set(window.LUtil.getCrit(state, reasonFilter));
        }
    }, 'click #affordanceOpen': function(){   
      $("#mapSplashModal").modal('show');
    },
    'click #filMinMax' : function(){
    	if(window.LUtil.filMinMax === 0){
    		window.LUtil.filMinMax = 1;    		
    		$("#latestFoodRecallForm").show();
    		$("#filMinMaxSpan").removeClass("glyphicon glyphicon-plus")
    		$("#filMinMaxSpan").addClass("glyphicon glyphicon-minus")    		
    	}else if(window.LUtil.filMinMax === 1){
    		window.LUtil.filMinMax = 0;    		
    		$("#latestFoodRecallForm").hide();
    		$("#filMinMaxSpan").removeClass("glyphicon glyphicon-minus")
	    	$("#filMinMaxSpan").addClass("glyphicon glyphicon-plus")    		
    	}	
    },
    'click #detMinMax' : function(){    	  	
    	if(window.LUtil.detMinMax === 0){
    		window.LUtil.detMinMax = 1;    		
    		$("#recallDetails").show();
    		$("#detMinMaxSpan").removeClass("glyphicon glyphicon-plus")
    		$("#detMinMaxSpan").addClass("glyphicon glyphicon-minus")
    		$(".recall-detail").css({"height":"250px"});
    	}else if(window.LUtil.detMinMax === 1){
    		window.LUtil.detMinMax = 0;    		
    		$("#recallDetails").hide();
    		$("#detMinMaxSpan").removeClass("glyphicon glyphicon-minus")
	    	$("#detMinMaxSpan").addClass("glyphicon glyphicon-plus")	
    		$(".recall-detail").css({"height":"38px"});
    	}       	
    },
    'click #applyFilter': function(event, template) {    
      var reasonFilter = $('#latestFoodRecallReasonFilter').val();
      var limit = parseInt($('#latestFoodRecallLimit').val(), 10);
      console.log('limitval: ', limit);
      if (Meteor.settings.debug) { console.log('reasonFilter:', reasonFilter); }
      // set the reactive var with updated filter, this.autorun within the
      // create method will re-run the subscription with the new value every
      // time this changes.
      var state = $("#stateSelector").val();
      
      if(state === null){
    	  template.filter.set({reason_for_recall: { $regex: reasonFilter, $options: 'i' }});
      }else{    	  
    	  template.filter.set(window.LUtil.getCrit(state, reasonFilter));
      }      
      
      template.limit.set(limit); 
    }
  });
  
  Template.map.helpers({
    latestFoodRecalls: function() {
      var self = Template.instance();
      return self.latestFoodRecalls();
    },
    StatesData: function(){    	  	
    	return Object.keys(StatesData).map(function(k) { return StatesData[k]})[1];
    },
    formatDate: function(report_date) {
      if (Meteor.settings.debug) { console.log('report_date: ', report_date); }
      return moment(report_date, 'YYYYMMDD').format('M/DD/YYYY');
    }
  });
  
  Template.map.created = function() {
    var self = Template.instance();
    self.filter = new ReactiveVar({});
    self.limit = new ReactiveVar(10);    
    this.autorun(function () {
      // TODO: show loading indicator.
      if (Meteor.settings.debug) { console.log("filter: " + self.filter.get()); }
      if (Meteor.settings.debug) { console.log("limit: " + self.limit.get()); }
      self.subscription = self.subscribe('LatestFoodRecalls', self.filter.get(), self.limit.get());
      if (self.subscription.ready()) {
        // reset the select2 interface and hide the details    
    	$('#latestFoodRecalls').select2({
    	 	placeholder: 'Select a Recall',
    	    allowClear: true
    	});  	    
    	    
        $('.recall-detail').hide();

      }
    });
    self.latestFoodRecalls = function() {
      if (self.subscription.ready()) {
        return FoodRecalls.latest(self.filter.get(), self.limit.get());
      } else {
        return false;
      } 
    };
    
  };
  
  Template.map.rendered = function(){    
    window.LUtil.initMap();
    $('#stateSelector').val('');
    $('#latestFoodRecalls').val('');
    $('#latestFoodRecalls').select2({
    	placeholder: 'Select a Recall',
        allowClear: true
    });
    $('.recall-detail').hide();    
    $("#stateSelector").select2({
        placeholder: 'Filter by State',
        allowClear: true
      });
   
    $("#latestFoodRecallLimit").select2();
    
    Blaze.render(Template.mapSplashModal, $('<div>').appendTo('body').get(0));    
  };
})();