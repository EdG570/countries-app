(function() {
var app = angular.module('ccApp', ['ngRoute', 'ngAnimate']);

    app.config(function($routeProvider) {
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
    });
    
    app.controller('HomeCtrl', [function() {
        
    }]);

    app.controller('CountryCtrl', [function() {

    }]);

    app.controller('DetailCtrl', [function() {

    }]);

})();