/*globals Template*/
Template.mapSplashModal.events({
  'click #gotit' : function(){   
    $('#mapSplashModal').modal('hide');
  }
});
Template.mapSplashModal.rendered = function() {
  $('#mapSplashModal').modal('show');  
};
