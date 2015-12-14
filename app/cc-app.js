(function() {
  angular.module('ccApp', ['ngRoute', 'ngAnimate'])

    .config(function($routeProvider) {
        $routeProvider.when('/', {
          templateUrl: '/home.html',
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

    .factory('countryData', function($http, $q) {
        
        var countryArray = [];
        var defer = $q.defer();

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
                  defer.resolve(countryArray);
              });
              
              return defer.promise; 

          },
          
          search: function(code) {
               var i = 0;

               while(countryArray[i].countryCode !== code && i < countryArray.length) {
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
         countryData.getCountries().then(function(data) {
            $scope.countries = data;
            
         });

         $scope.getDetails = function(code) {
            $location.path('/countries/' + code);
         };
    }])

    .controller('DetailCtrl', [ 'countryData', 'capitalData', 'neighborData', '$scope', '$routeParams', '$location', function(countryData, capitalData, neighborData, $scope, $routeParams, $location) {
        
        $scope.countryCode = $routeParams.country;
        $scope.country = countryData.search($scope.countryCode);

        
        capitalData.getCapital($scope.country.capital).then(function(cap) {
            $scope.capital = cap;
            
        });

        neighborData.getNeighbors($scope.countryCode).then(function(neighbors) {
            $scope.neighbors = neighbors;
            
        });

        $scope.countryImg = 'http://www.geonames.org/img/country/250/' + $scope.countryCode + '.png';

        $scope.countryCodeLower = $scope.countryCode.toLowerCase();

        $scope.flagUrl = 'http://www.geonames.org/flags/x/' + $scope.countryCodeLower + '.gif';

        $scope.getDetails = function(code) {
            $location.path('/countries/' + code);
         };

    }]);
})();