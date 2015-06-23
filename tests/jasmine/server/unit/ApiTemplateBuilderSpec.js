(function() {
  "use strict";
  describe("ApiTemplateBuilder", function() {
    it("should build search template with invalid options", function() {
      var search = ApiTemplateBuilder.buildSearch({a:'',b:''});
      expect(search).toEqual('search=report_date:[+TO+]');      
    });
    it("should build search template with valid options", function() {
      var search = ApiTemplateBuilder.buildSearch({from:'20150101',to:'20150613'});
      expect(search).toEqual('search=report_date:[20150101+TO+20150613]');      
    });
  });
})();