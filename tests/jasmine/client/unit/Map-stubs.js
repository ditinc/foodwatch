/*globals window, L */
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
    }
  };
})();