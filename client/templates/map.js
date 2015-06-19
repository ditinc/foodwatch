LUtil = {  
  // reference to the single 'map' object to control
  map: null,
  // location of marker images
  imagePath : 'packages/mrt_leaflet-0.6.4/images',
  // init function to be called ONCE on startup
  initLeaflet: function(){    
    $(window).resize(function() {
      $('#map').css('height', window.innerHeight - 82 - 45);
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
    view.zoom = view.zoom || 4;
    view.latlong = view.latlong || [ 37.8, -96 ];
    var baseLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v3/cwhong.map-hziyh867/{z}/{x}/{y}.png',{
      attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>",
      maxZoom: 18
    });  
    this.map = L.map(element, { 
        scrollWheelZoom : false,
        doubleClickZoom : false,
        boxZoom         : false,
        touchZoom       : false,
        layers: [baseLayer]
    })
    .setView(
      view.latlong , 
      view.zoom
    );
    
    Tracker.autorun(function() {
      if (!Session.get('LatestFoodRecallsIsReady')) return;
      var latestFoodRecallsCursor = FoodRecalls.find({});        
      self.latestFoodRecalls = latestFoodRecallsCursor.fetch();
      if (Meteor.settings.debug) console.log('latestFoodRecalls: ', self.latestFoodRecalls);
      // TODO: do something with the data
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
  }
};
Template.map.events({
  'change select' : function(event, template){    
    var val = $(event.currentTarget).val();
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
  // Add any additional layers 
  /*LUtil.addTileLayer('http://a{s}.acetate.geoiq.com/tiles/acetate-labels/{z}/{x}/{y}.png', {
    attribution: '&copy;2012 Esri & Stamen, Data from OSM and Natural Earth',
    subdomains: '0123',
    minZoom: 2,
    maxZoom: 18
  });*/
};