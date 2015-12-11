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
        .when('/countries/:country/capital', {
          templateUrl: '/country-detail.html',
          controller: 'DetailCtrl as detail'
        })
        .otherwise('/error', {
          template: '<h3>Error - Page Not Found</h3>'
        });
    })

    .factory('countryData', function($http) {
        return function() {
            
            var request = {
              username: 'cole570',
              type: 'json'
            };

            return $http({
                      url: 'http://api.geonames.org/countryInfo',
                      method: 'GET',
                      params: request
                    });
                    
        };
    })
    
    .controller('HomeCtrl', [ function() {
       
    }])

    .controller('CountryCtrl', [ 'countryData', '$scope', function(countryData, $scope) {
         countryData().then(function(results){
          $scope.countries = results.data.geonames;
        });
    }])

    .controller('DetailCtrl', [function() {

    }]);

})();