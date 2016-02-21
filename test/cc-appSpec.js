var countriesList = {
  "geonames": [
      {
        "continent": "EU",
        "capital": "Andorra la Vella",
        "languages": "ca",
        "geonameId": 3041565,
        "south": 42.42849259876837,
        "isoAlpha3": "AND",
        "countryCode": "AD",
        "countryName": "Andorra",
        "continentName": "Europe",
        
      },

      {
        "continent": "AS",
        "capital": "Abu Dhabi",
        "languages": "ar-AE,fa,en,hi,ur",
        "geonameId": 290557,
        "isoAlpha3": "ARE",
        "fipsCode": "AE",
        "population": "4975593",
        "countryCode": "AE",
        "countryName": "United Arab Emirates",
        "continentName": "Asia",
        "currencyCode": "AED"
      }
  ]};

var neighborsList = {
  "totalResultsCount": 3,
  "geonames": [
    {
      "population": 33679000,
      "countryCode": "CA",
      "name": "Canada",
      "fclName": "country, state, region,...",
      "countryName": "Canada",
    },
    {
      "population": 11423000,
      "countryCode": "CU",
      "name": "Cuba",
      "fclName": "country, state, region,...",
      "countryName": "Cuba",
    },
    {
      "population": 112468855,
      "countryCode": "MX",
      "name": "Mexico",
      "fclName": "country, state, region,...",
      "countryName": "Mexico",
    }
  ]
};

describe('Testing countries & capitals app', function() {
  beforeEach(module('ccApp'));

    var scope, ctrl, httpBackend, rootScope;
         
    beforeEach(inject(function($controller, $rootScope, $httpBackend, $location) {
        scope = $rootScope.$new();
        httpBackend = $httpBackend;
        rootScope = $rootScope;
        location = $location;
        
     }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingRequest();
    });

  describe('Testing countryData factory', function() {
    
    it('Should perform http request then store the geonames data in country array', inject(function(countryData) {
            var countries = [];
            
            httpBackend.expect('GET', 'http://api.geonames.org/countryInfo?type=json&username=cole570').respond(countriesList);
            countryData.getCountries().then(function(response) {
                countries = response;
            });
            rootScope.$digest();
            httpBackend.flush();

            expect(countries.length).toBe(2);        
    }));


    it('Should find specific country that matches country code in an array of countries', inject(function(countryData) {
            var countryArray = countriesList;

            expect(countryData.search("AD")).toBe(countryArray[0]);
            expect(countryData.search("AE")).toBe(countryArray[1]);
            expect(countryData.search("AA")).toBe(countryArray[-1]);         
    }));
  });

  describe('Testing neighborData factory', function() {

    it('should find neighboring countries to selected country', inject(function(neighborData) {
          var neighbors = [];
          
          httpBackend.expect('GET', 'http://api.geonames.org/neighbours?country=US&type=json&username=cole570').respond(neighborsList);
          neighborData.getNeighbors("US").then(function(response) {
            neighbors = response;
            console.log(neighbors);
          });
          rootScope.$digest();
          httpBackend.flush();

          expect(neighbors.length).toBe(3);
          expect(neighbors[0].countryCode).toBe("CA");
          expect(neighbors[1].name).toBe('Cuba');
          expect(neighbors[2].countryName).toBe('Mexico');
    }));

  });

  // describe('Testing capitalData factory', function() {

  //   it('should get data for country capital', inject(function(capitalData) {
  //         var capital = "AD";
          
  //         httpBackend.expect('GET', 'http://api.geonames.org/search?q=US&type=json&username=cole570').respond(neighborsList);
  //         neighborData.getNeighbors(capital).then(function(response) {
  //           capital = response;
  //           console.log(capital);
  //         });
  //         rootScope.$digest();
  //         httpBackend.flush();

          
  //   }));

  // });

  describe('Testing country controller', function() {

    beforeEach(inject(function($controller, $location) {
      ctrl = $controller('CountryCtrl', {$scope: scope});
      location = $location;
    }));

    it('should limit countries results to 25 per page and not exceed 225', function() {
        
        scope.pageStart = 0;

        scope.nextPage();

        expect(scope.pageStart).not.toBe(0);
        expect(scope.pageStart).toBe(25);

        scope.nextPage();

        expect(scope.pageStart).toBe(50);

        scope.nextPage();

        expect(scope.pageStart).toBe(75);

        scope.pageStart = 225;

        scope.nextPage();

        expect(scope.pageStart).toBe(225);

    });

    it('should decrease page results by 25 but not be less than 0', function() {
        scope.pageStart = 0;

        scope.prevPage();

        expect(scope.pageStart).toBe(0);

        scope.pageStart = 225;

        scope.prevPage();
        scope.prevPage();
        scope.prevPage();

        expect(scope.pageStart).toBe(150);

    });

    // it('should add the selected countrys country code to the location.path', function() {

    //     var mockCountry = {
    //       geonames: [
    //         {
    //           countryCode: 'US',
    //           countryName: 'United States'
    //         }
    //       ]
    //     };

    //     var code = mockCountry.geonames[0].countryCode;

    //     location.path('/countries/');
    //     rootScope.$apply();
    //     expect(location.path()).toBe('/countries/');

    //     expect(scope.getDetails(code)).toBe('/countries/US');


    // });

  });


});