/*globals window */
(function() {
  "use strict";
  window.L = {
    Icon: {
      Default: {
        imagePath: null
      }
    },
    map: function() {
      return {
        setView: function(){
          return true;
        }
      };
    },
    addLayer: function() {},
    tileLayer: function() {},
    geoJson: function() {
      return { addTo: function() {} };
    },
    control: function() {
      return {
        addTo: function() {},
        onAdd: function() {}
      };
    },
    DomUtil: {
      create: function() {}
    }
  };
  window.fakeGeojson = {
    _layers: {
      100: {
        feature: {
          properties: {
            abbreviation: 'AL',
            name: 'Alabama'
          }
        },
        setStyle: function() {}
      },
      200: {
        feature: {
          properties: {
            abbreviation: 'AK',
            name: 'Alaska'
          }
        },
        setStyle: function() {}
      }
    }
  };
})();