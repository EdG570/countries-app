(function() {
  angular.module('ccApp', ['ngRoute', 'ngAnimate'])

    //defines routes and assigns controller for each route
    .config(function($routeProvider) {
        $routeProvider.when('/', {
          templateUrl: 'countries-app/build/#/home.html',
          controller: 'HomeCtrl as home'
        })
        .when('/countries', {
          templateUrl: '/countries-list.html',
          controller: 'CountryCtrl as country'
        })
        .when('/countries/:country', {
          templateUrl: '/country-detail.html',
          controller: 'DetailCtrl as detail'
        })
        .otherwise('/error', {
          template: '<h3>Error - Page Not Found</h3>'
        });
    })

    .factory('countryData', function($http, $q, $location) {
        
        var countryArray = [];
        var defer = $q.defer();

        //http request for countries data
        return {
          getCountries: function() {
            
              var request = {
                username: 'cole570',
                type: 'json'
              };

              $http({
                  url: 'http://api.geonames.org/countryInfo',
                  method: 'GET',
                  params: request
              })
              .then(function(results){
                  countryArray = results.data.geonames;
                  console.log(results);
                  defer.resolve(countryArray);

              });
              
              return defer.promise; 

          },
          
          //searches country array for matching country code then returns the selected country
          search: function(code) {
               var i = 0;


               while(i < countryArray.length && countryArray[i].countryCode !== code) {

                  i = i + 1;
               }

               if(i < countryArray.length) {
                  return countryArray[i];
               } 

               else {
                  return null;
               }
          }
        };
    })
  
    .factory('neighborData', function($http, $q) {
          var neighbors = [];
          var d = $q.defer();

        //http request for neighboring countries
        return {

          getNeighbors: function(code) {
            
              var request = {
                username: 'cole570',
                type: 'json',
                country: code
              };

              $http({
                  url: 'http://api.geonames.org/neighbours',
                  method: 'GET',
                  params: request
              })
              .then(function(results){
                  neighbors = results.data.geonames;
                  d.resolve(neighbors); 
              });
              
              return d.promise;  

          }
        };
    })

    .factory('capitalData', function($http, $q) {
        
        var capObj = {};
        var d = $q.defer();

        //http request for capital data
        return {
          
          getCapital: function(capital) {
              
              var request = {
                username: 'cole570',
                q: capital,
                name_equals: capital,
                isNameRequired: true,
                type: 'JSON'
              };

              $http({
                  url: 'http://api.geonames.org/search',
                  method: 'GET',
                  params: request
              })
              .then(function(results){
                 capObj = results.data.geonames[0];
                 d.resolve(capObj);
                 
              });
          
              return d.promise;

          }
          
        }; 
    })

    .controller('HomeCtrl', [ function() {
       
    }])

    .controller('CountryCtrl', [ 'countryData', '$scope', '$location', function(countryData, $scope, $location) {
         
         //Sends http request for countries data
         countryData.getCountries().then(function(data) {
            $scope.countries = data;

            console.log($scope.countries);
            
         });

         $scope.nextPage = function() {
            if($scope.pageStart < 225) {
              $scope.pageStart += 25;
            }
            else {
              $scope.pageStart = $scope.pageStart;
            }
         };

         $scope.prevPage = function() {
            if($scope.pageStart < 25) {
              $scope.pageStart = $scope.pageStart;
            }
            else if($scope.pageStart >= 25 && $scope.pageStart <= 225) {
              $scope.pageStart -= 25;
            }
         };

         $scope.pageStart = 0;


         //Adds country code to url path
         $scope.getDetails = function(code) {
            $location.path('/countries/' + code);
         };
    }])

    .controller('DetailCtrl', [ 'countryData', 'capitalData', 'neighborData', '$scope', '$routeParams', '$location', function(countryData, capitalData, neighborData, $scope, $routeParams, $location) {
        
        $scope.countryCode = $routeParams.country;

        $scope.country = countryData.search($scope.countryCode);

        if($scope.country === null) {
          $location.path('/countries');
        } 
        else {

          //Gets country capital data
          capitalData.getCapital($scope.country.capital).then(function(cap) {
              $scope.capital = cap;     
          });

          //Gets neighboring countries
          neighborData.getNeighbors($scope.countryCode).then(function(neighbors) {
              $scope.neighbors = neighbors;     
          });

          //Constructs link for country image interpolation
          $scope.countryImg = 'http://www.geonames.org/img/country/250/' + $scope.countryCode + '.png';

          //Changes country code to lower case for flag link
          $scope.countryCodeLower = $scope.countryCode.toLowerCase();

          //Constructs link for respective country flag image
          $scope.flagUrl = 'http://www.geonames.org/flags/x/' + $scope.countryCodeLower + '.gif';

          $scope.getDetails = function(code) {
            $location.path('/countries/' + code);
         };
        }

    }]);
})();