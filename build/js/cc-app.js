var ccApp=angular.module("ccApp",["ngRoute","ngAnimate"]);ccApp.config(function(t){t.when("/",{templateUrl:"home.html",controller:"HomeCtrl as home"}).when("/countries",{templateUrl:"countries-list.html",controller:"CountryCtrl as country"}).when("/countries/:country",{templateUrl:"country-detail.html",controller:"DetailCtrl as detail"}).otherwise("/error",{template:"<h3>Error - Page Not Found</h3>"})}),ccApp.factory("countryData",function(t,e,o){var r=[],n=e.defer();return{getCountries:function(){var e={username:"cole570",type:"json"};return t({url:"http://api.geonames.org/countryInfo",method:"GET",params:e}).then(function(t){r=t.data.geonames,console.log(t),n.resolve(r)}),n.promise},search:function(t){for(var e=0;e<r.length&&r[e].countryCode!==t;)e+=1;return e<r.length?r[e]:null}}}),ccApp.factory("neighborData",function(t,e){var o=[],r=e.defer();return{getNeighbors:function(e){var n={username:"cole570",type:"json",country:e};return t({url:"http://api.geonames.org/neighbours",method:"GET",params:n}).then(function(t){o=t.data.geonames,r.resolve(o)}),r.promise}}}),ccApp.factory("capitalData",function(t,e){var o={},r=e.defer();return{getCapital:function(e){var n={username:"cole570",q:e,name_equals:e,isNameRequired:!0,type:"JSON"};return t({url:"http://api.geonames.org/search",method:"GET",params:n}).then(function(t){o=t.data.geonames[0],r.resolve(o)}),r.promise}}}),ccApp.controller("HomeCtrl",[function(){}]),ccApp.controller("CountryCtrl",["countryData","$scope","$location",function(t,e,o){t.getCountries().then(function(t){e.countries=t,console.log(e.countries)}),e.pageStart=0,e.nextPage=function(){e.pageStart<225?e.pageStart+=25:e.pageStart=e.pageStart},e.prevPage=function(){e.pageStart<25?e.pageStart=e.pageStart:e.pageStart>=25&&e.pageStart<=225&&(e.pageStart-=25)},e.getDetails=function(t){o.path("/countries/"+t)}}]),ccApp.controller("DetailCtrl",["countryData","capitalData","neighborData","$scope","$routeParams","$location",function(t,e,o,r,n,a){r.countryCode=n.country,r.country=t.search(r.countryCode),null===r.country?a.path("/countries"):(e.getCapital(r.country.capital).then(function(t){r.capital=t}),o.getNeighbors(r.countryCode).then(function(t){r.neighbors=t}),r.countryImg="http://www.geonames.org/img/country/250/"+r.countryCode+".png",r.countryCodeLower=r.countryCode.toLowerCase(),r.flagUrl="http://www.geonames.org/flags/x/"+r.countryCodeLower+".gif",r.getDetails=function(t){a.path("/countries/"+t)})}]);               method: 'GET',
                  params: request
              })
              .then(function(results){
                  neighbors = results.data.geonames;
                  d.resolve(neighbors); 
              });
              
              return d.promise;  

          }
        };
    });

    ccApp.factory('capitalData', function($http, $q) {
        
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
    });

    ccApp.controller('HomeCtrl', [ function() {
       
    }]);

    ccApp.controller('CountryCtrl', [ 'countryData', '$scope', '$location', function(countryData, $scope, $location) {
         
         //Sends http request for countries data
         countryData.getCountries().then(function(data) {
            $scope.countries = data;

            console.log($scope.countries);
            
         });

         //Initializes var for managing number of and which results are displayed on page
         $scope.pageStart = 0;

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

         //Adds country code to url path
         $scope.getDetails = function(code) {
            $location.path('/countries/' + code);
         };
    }]);

    ccApp.controller('DetailCtrl', [ 'countryData', 'capitalData', 'neighborData', '$scope', '$routeParams', '$location', function(countryData, capitalData, neighborData, $scope, $routeParams, $location) {
        
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
