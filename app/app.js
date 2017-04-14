// create the module and name it phpro
// also include ngRoute for all our routing needs
var phpro = angular.module('admin', ['ngRoute']);

// configure our routes
phpro.config(function($routeProvider) {

$routeProvider
        // route for the index page
        .when('/', {
                templateUrl : 'templates/home.html',
                controller  : 'mainCtrl'
        })

        // route for the FAQ page
        .when('/sales', {
        templateUrl : 'templates/sales.html',
        controller  : 'faqCtrl'
        })

        // route for the contact page
        .when('/customers', {
                templateUrl : 'templates/customer.html',
                controller  : 'contactCtrl'
        })

        .when('/staff', {
                templateUrl : 'templates/staff.html',
                controller  : 'staffCtrl'
        });
});     

var access_token = location.search.split('access_token=')[1];
var base_url = '52.33.37.151:8080';
//var base_url = 'localhost:3000';
// create the controller and inject Angular's $scope
phpro.controller('mainCtrl', function($scope) {
       
});

phpro.controller('faqCtrl', function($scope) {

});

phpro.controller('contactCtrl', function($scope) {
      
});

phpro.controller('staffCtrl', function($scope,$http) {

        function getSum(result){
            var client = 0;
            var money = 0;
            for(i=0; i<result.length; i++) {
               client = client + result[i].clients;
               money = money + result[i].total; 
            };
            var stats = {client:client,money:money};
            return stats;
        }

        $http({
            method  : 'GET',
            url     : 'http://'+base_url+'/stats/getEmployeeSales',
            params  :{access_token:access_token}          
        }).then(function(response){ 
            $scope.list = response.data.list;
            $scope.stat = getSum(response.data.list); 
            console.log($scope.stat);
        }); 
});