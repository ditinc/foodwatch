/*globals Template*/
Template.mapRecallDetails.events({
  'click #detMinMax' : function(){
    if(window.LUtil.detMinMax === 0){
      window.LUtil.detMinMax = 1;
      $("#recallDetails").show();
      $("#detMinMaxSpan").removeClass("glyphicon glyphicon-plus");
      $("#detMinMaxSpan").addClass("glyphicon glyphicon-minus");
      $(".recall-detail").css({"height":"250px"});
    }else if(window.LUtil.detMinMax === 1){
      window.LUtil.detMinMax = 0;
      $("#recallDetails").hide();
      $("#detMinMaxSpan").removeClass("glyphicon glyphicon-minus");
      $("#detMinMaxSpan").addClass("glyphicon glyphicon-plus");
      $(".recall-detail").css({"height":"38px"});
    }
  }
});
Template.mapRecallDetails.rendered = function() {};