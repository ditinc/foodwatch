/*LUtil is inspired by leaflet-demo (https://github.com/MeteorHudsonValley/leaflet-demo) */
/*globals window, L, $, Tracker, Template, Meteor, console, Session, _, ReactiveVar, ReactiveDict*/
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
    // location of marker images
    imagePath : 'packages/mrt_leaflet-0.6.4/images',
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
        style:this.styleDefault		
      }).addTo(this.map);
      
      this.addControls();
    },	
    highlightOrigin: function(state){
      var self = this;
      for (var key in self.geojson._layers) {
        if (self.geojson._layers.hasOwnProperty(key)) {
          //var props = self.geojson._layers[key].feature.properties;
          if(self.geojson._layers[key].feature.properties.abbreviation === state) {
            
            if(self.currentOrigin !== null){
              self.geojson.resetStyle(self.currentOrigin);					
            }
            
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
    highlightDestination: function(states){
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
    
    parseStates : function(states){
      var parsedStates = [];
      var acceptedDelimiters = [" ", ",", "", "(", ")","&","."];
      var nationwide = false;
      
      if(states.indexOf("nationwide") >= 0){
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
    addControls: function() {
      var self = this;
      var recallSelector = L.control({position: 'topright'});
      recallSelector.onAdd = self.onAddHandler('info recall-selector', '<b>Recall:</b> <div id="recallSelector"></div>');
      recallSelector.addTo(this.map);      
      $("#latestFoodRecallForm").appendTo("#recallSelector").show();
        
      self.details = L.control({position: 'bottomright'});
      self.details.onAdd = self.onAddHandler('info recall-detail', '');
      
      self.details.update = function (props) {
          props ? 
            this._div.innerHTML = (props ?
              '<h3>Recall Details</h3>' +
              '<div><b>Recall # : </b>' + props.recall_number + '</div>' +
              '<div><b>Date Reported : </b>' + props.report_date + '</div>' +
              '<div><b>Date Initiated : </b>' + props.recall_initiation_date + '</div>' +
              '<div><b>Recalling Firm : </b>' + props.recalling_firm + '</div>' +										
              '<div><b>Status : </b>' + props.status + '</div>' +
              '<div><b>Classification : </b>' + props.classification + '</div>' +
              '<div><b>Code Information : </b>' + props.code_info + '</div>' +
              '<div><b>State : </b>' + props.state + '</div>' +
              '<div><b>City : </b>' + props.city + '</div>' +
              '<div><b>Distribution Pattern : </b>' + props.distribution_pattern + '</div>' +
              '<div><b>Product Description : </b>' + props.product_description + '</div>' +
              '<div><b>Product Quantity : </b>' + props.product_quantity + '</div>' +
              '<div><b>Product Type : </b>' + props.product_type + '</div>' +
              '<div><b>Reason for Recall : </b>' + props.reason_for_recall + '</div>'				
              : 'Select a Recall') : this.hide();
              $('.recall-detail').show();
        };
      self.details.addTo(self.map);	
      
      var logo = L.control({position: 'topleft'});
      logo.onAdd = self.onAddHandler('logo', '<b>Foodwatch</b><div id="affordanceOpen"><a href="#" > ?</a></div>');        
      logo.addTo(self.map);	
      
      var legend = L.control({position: 'bottomleft'});
      var legendHtml = '<b>Legend</b><br><br><div><span class="legendBlock origin"></span> Origin</div>'+
                  '<br><div><span class="legendBlock destination"></span> Destination</div>'+
                  '<br><div><span class="legendBlock originDestination"></span> Origin & Destination</div>';
      legend.onAdd = self.onAddHandler('info', legendHtml);      
      legend.addTo(self.map);	
      
      var splash = L.control({position: 'topleft'});
      var splashHtml = '<b>Welcome to Foodwatch!</b> <br><br> Select a recall event in the drop down to see the source '+
        'state of the food item recall and the states to which the product was shipped.  The top 10 most recent '+
        'recall items are shown from open.fda.gov'+		
        '<div id="gotit"><a href="#" >Got it!</a></div>';
      splash.onAdd = self.onAddHandler('splash', splashHtml);   
      splash.addTo(self.map);
    }
  };
  
  Template.map.events({
    'change #latestFoodRecalls': function() {
      var val = $('#latestFoodRecalls').select2('val');
      if (Meteor.settings.debug) { console.log('change select val:', val); }
      
      if (_.isUndefined(val) || _.isEmpty(val)) {
        // TODO: reset the map
        return;
      }
      
      var self = Template.instance();      
      var fr = self.latestFoodRecalls().fetch();
      var originState = null;
      var destinationStates = null;
      
      for(var i = 0; i<fr.length; i++){
        if(fr[i].recall_number === val){			
          window.LUtil.details.update(fr[i]);	
          originState = fr[i].state;
          destinationStates = fr[i].distribution_pattern;
        }
      }
      
      for(var j = 0; j<StatesData.features.length; j++){
        if(StatesData.features[j].properties.abbreviation === originState){				
            window.LUtil.highlightOrigin(originState);
            window.LUtil.highlightDestination(destinationStates);
        }     
      }
    }, 'click #gotit' : function(){   
      $(".splash").hide();
    }, 'click #affordanceOpen': function(){   
      $(".splash").show();
    }, 'click #applyFilter': function(event, template) {
      // we could build a more complicated filter, but only grabbing the
      // latestFoodRecallReasonFilter from the DOM.
      var reasonFilter = $('#latestFoodRecallReasonFilter').val();
      var limit = parseInt($('#latestFoodRecallLimit').val(), 10);
      console.log('limitval: ', limit);
      if (Meteor.settings.debug) { console.log('reasonFilter:', reasonFilter); }
      // set the reactive var with updated filter, this.autorun within the
      // create method will re-run the subscription with the new value every
      // time this changes.
      template.filter.set({reason_for_recall: { $regex: reasonFilter, $options: 'i' }});
      template.limit.set(limit);
    }
  });
  
  Template.map.helpers({
    latestFoodRecalls: function() {
      var self = Template.instance();
      return self.latestFoodRecalls();
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
        $('#latestFoodRecalls').val('');
        $('#latestFoodRecalls').select2();
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
    console.log('rendered');
    $('#latestFoodRecalls').select2({
      placeholder: 'Select a Recall'
    });
    $('.recall-detail').hide();        
  };
})();