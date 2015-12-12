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

            console.log(defer.promise);
            
            return defer.promise; 

          },

          search: function() {
            
          }
         }; 
    })

    
    
    .controller('HomeCtrl', [ function() {
       
    }])

    .controller('CountryCtrl', [ 'countryData', '$scope', '$location', function(countryData, $scope, $location) {
         countryData.getCountries().then(function(data) {
            $scope.countries = data;
            console.log(data);
         });

         $scope.getDetails = function(code) {
            $location.path('/countries/' + code);
         };


    }])

    .controller('DetailCtrl', [ 'countryData', '$scope', '$routeParams', function(countryData, $scope, $routeParams) {
        $scope.countryCode = $routeParams.country;
        

    }]);

})();