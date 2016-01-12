describe('countryData', function() {
  beforeEach(module('ccApp'));

  it('Should perform http request then store the geonames data in country array', function() {
      inject(function(countryData, $rootScope, $httpBackend) {
          $httpBackend.expect('GET', 'http://api.geonames.org/countryInfo?type=json&username=cole570').respond(200, '{"data":{"geonames":[{"countrycode":"x"}]}}');
          var status = false;
          countryData.getCountries().then(function(response) {
              status = true;
          });
          $rootScope.$digest();
          $httpBackend.flush();
          expect(status).toBe(true);
          $httpBackend.verifyNoOutstandingRequest();
      });
  });

  it('Should find specific country that matches country code', function() {
      inject(function(countryData, $rootScope, $httpBackend) {
          $httpBackend.expect('GET', 'http://api.geonames.org/countryInfo?type=json&username=cole570').respond(200, '{"data":{"geonames":[{"countrycode":"x"}]}}');
          countryData.getCountries().then(function() {

          });
          $rootScope.$digest();
          $httpBackend.flush();
          expect(countryData.search('x')).toBe({"countrycode":"x"});
          expect(countryData.search('y')).toBe(null);
          $httpBackend.verifyNoOutstandingRequest();
      });
  });
});