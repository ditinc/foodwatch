LUtil = {  
  // reference to the single 'map' object to control
  map: null,
  geojson: null,
  recallData: null,
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
        scrollWheelZoom : false,
        doubleClickZoom : false,
		dragging		: false,
        boxZoom         : false,
        touchZoom       : false,
		zoomControl		: false,
        layers: [baseLayer]
    })
    .setView(
      view.latlong , 
      view.zoom
    );
    
    Tracker.autorun(function() {
      var latestFoodRecallsCursor = FoodRecalls.find({});        
      self.latestFoodRecalls = latestFoodRecallsCursor.fetch();
      if (Meteor.settings.debug) {
		  console.log('latestFoodRecalls: ', self.latestFoodRecalls);
		  recallData = self.latestFoodRecalls;
	  }
      
      // TODO: do something with the data
      
    });
	
	geojson = L.geoJson(FoodRecalls.statesData, {
		style:this.styleDefault		
	}).addTo(this.map);
    
    this.addControls();
  },
	
  highlightOrigin: function(state){
	  for (var key in geojson._layers) {
		  if (geojson._layers.hasOwnProperty(key)) {
			var props = geojson._layers[key].feature.properties;
			if(geojson._layers[key].feature.properties.abbreviation==state){
				
				if(LUtil.currentOrigin!=null){
					geojson.resetStyle(LUtil.currentOrigin);					
				}
				
				LUtil.currentOrigin = geojson._layers[key]
				
				geojson._layers[key].setStyle({
					weight: 2,
					opacity: 1,
					color: 'black',
					dashArray: '',
					fillOpacity: 0.2,
					fillColor: 'red'
				});
				
			}			
		  }
		}
  },
  highlightDestination: function(states){
	  
	  if(LUtil.currentDestinations.length!=0){
		for(state in LUtil.currentDestinations)
			if(LUtil.currentOrigin != LUtil.currentDestinations[state]){
				geojson.resetStyle(LUtil.currentDestinations[state]);	
			}			
	  }
	  
	  for(line in LUtil.lines){
		  
			  this.map.removeLayer(LUtil.lines[line]);
		   
	  }
	  
	  LUtil.lines = [];
	  
	  LUtil.currentDestinations = [];
		
	  states = this.parseStates(states);
	  for(var st = 0; st<states.length; st++){
		  for (var key in geojson._layers) {
			  if (geojson._layers.hasOwnProperty(key)) {
				var props = geojson._layers[key].feature.properties;
				if(geojson._layers[key].feature.properties.abbreviation==states[st]){					
					LUtil.currentDestinations.push(geojson._layers[key]);
					var fillColor = "yellow";
					if(LUtil.currentOrigin == geojson._layers[key]){
						fillColor = "orange";
					}
					geojson._layers[key].setStyle({
						weight: 2,
						opacity: 1,
						color: 'black',						
						fillOpacity: 0.2,
						fillColor: fillColor
					});						
				}			
			  }
			}
		}
  },
  
  parseStates : function(states){
	var parsedStates = []
	for (var key in geojson._layers) {
	  if (geojson._layers.hasOwnProperty(key)) {
		var props = geojson._layers[key].feature.properties;
		if(states.includes(geojson._layers[key].feature.properties.name) || states.includes(geojson._layers[key].feature.properties.abbreviation)){
			parsedStates.push(geojson._layers[key].feature.properties.abbreviation);
		}			
	  }
	} 
	return parsedStates;
  },
  
  styleDefault: function(feature) {
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
    if (!event || !callback) 
      return;
    // TODO: validate event and callback
    this.map.on(event, callback);
  },
  // add marker to specified point (uses default marker image)
  addMarker: function(latlng){
    return L.marker(latlng).addTo(this.map);
  },
  // remove marker from map
  removeMarker: function(marker){
    this.map.removeLayer(marker);
  },
  // remove layer
  removeLayer: function(layer){
    this.map.removeLayer(layer);
  },
  addLayer: function(layer) {
    this.map.addLayer(layer);
  },
  addTileLayer: function(_layer, _obj){
    _obj = _obj || "";
    L.tileLayer( _layer, _obj)
      .addTo(this.map);
  },
  addControls: function(){
	var recallSelector = L.control({position: 'topright'});
	recallSelector.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend');
		div.innerHTML = '<b>Select a Recall:</b> <br> <div id="recallSelector"></div>';
		return div;
	};
	recallSelector.addTo(this.map);	
	
	$("#latestFoodRecalls").appendTo("#recallSelector");
	$("#latestFoodRecalls").select2();
	
	details = L.control({position: 'bottomright'});
	details.onAdd = function (map) {		
		this._div = L.DomUtil.create('div', 'info legend col-md-3');		
		this.update();		
		return this._div;
	};
	
	details.hide = function(){
		//alert("hidden");
	}
	
	details.update = function (props) {
			props ? 
				this._div.innerHTML = (props ?
					'<div><h3>Recall Details</h3>' +
					'<div><b>Classification : </b>' + props.classification + '</div>' +
					'<div><b>Code Information : </b>' + props.code_info + '</div>' +
					'<div><b>State : </b>' + props.state + '</div>' +
					'<div><b>Distribution Pattern : </b>' + props.distribution_pattern + '</div>' +
					'<div><b>Product Quantity : </b>' + props.product_quantity + '</div>' +
					'<div><b>Product Type : </b>' + props.product_type + '</div>' +
					'<div><b>Reason for Recall : </b>' + props.reason_for_recall + '</div></div>'				
					: 'Select a Recall') : this.hide();
		};
	details.addTo(this.map);	
	
	var logo = L.control({position: 'bottomleft'});
	logo.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend');
		div.innerHTML = '<b>FoodWatch</b>';
		return div;
	};
	logo.addTo(this.map);	
	
  }
};
Template.map.events({
  'change select' : function(event, template){    
    var val = $(event.currentTarget).val();	
	var fr = FoodRecalls.find({}).fetch()
	var originState = null;
	var destinationStates = null;
	for(var i = 0; i<fr.length; i++){
		if(fr[i].recall_number==val){			
			details.update(fr[i]);	
			originState = fr[i].state;
			destinationStates = fr[i].distribution_pattern;
		}
	}
	
	for(var i = 0; i<FoodRecalls.statesData.features.length; i++){
		if(FoodRecalls.statesData.features[i].properties.abbreviation==originState){				
			LUtil.highlightOrigin(originState);
			LUtil.highlightDestination(destinationStates);	
		}
	}
	
    if (Meteor.settings.debug) console.log('change select val:', val);
  }
});

Template.map.helpers({
  latestFoodRecalls: function() {    
    return FoodRecalls.latest();
  }
});

Template.map.created = function(){};

Template.map.rendered = function(){
  // Initialize the map view
  LUtil.initMap();  
};