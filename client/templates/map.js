LUtil = {  
  // reference to the single 'map' object to control
  map: null,
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
      if (Meteor.settings.debug) console.log('latestFoodRecalls: ', self.latestFoodRecalls);
      
      // TODO: do something with the data
      
    });
	
	/*geojson = L.geoJson(statesData, {
		style:styleDefault,
		onEachFeature: onEachFeature
	}).addTo(map);*/
    
    this.addControls();
  },
  styleDefault: function(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'black',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: 'white'
		};
	},
	onEachFeature: function (feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: unHighlightFeature,
				click: zoomToFeature
			});
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
	
	var details = L.control({position: 'bottomright'});
	details.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend');
		div.innerHTML = '<b>Details</b>';
		return div;
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
	alert(val);
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