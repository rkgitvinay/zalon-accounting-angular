var phpro = angular.module('account', ['ngRoute']);


phpro.config(function($routeProvider) {

$routeProvider

        .when('/', {
                templateUrl : 'templates/accounting/home.html',
                controller  : 'HomeCtrl'
        })


        .when('/info', {
            templateUrl : 'templates/accounting/info.html',
            controller  : 'InfoCtrl'
        })

        
        .when('/customers', {
                templateUrl : 'templates/accounting/customer.html',
                controller  : 'contactCtrl'
        });
});
var access_token = location.search.split('access_token=')[1];

phpro.controller('HomeCtrl', function($scope,$http,$window){  
    var selected_id;

    var url = 'http://localhost:3000/accounting/getPaymentMethods?access_token='+access_token;
    $http({
        method  : 'GET',
        url     : url           
    }).then(function(response){
        if(response.data.result.length > 0){
            $scope.accounts = response.data.result; 
            $scope.selected = response.data.result[0].id;
            selected_id     = response.data.result[0].id;
            $scope.acc_name = response.data.result[0].account_name;
            $scope.category = response.data.category; 
            $scope.category.unshift({id:0,category_name:'Select Category'});                         
            $scope.cat_id   = $scope.category[0].category_name;
            $scope.payment_log = response.data.payment_log;
        }
    });   
    
        
    $scope.accFormInfo = {};   
    $scope.saveData = function (){        
        var url = 'http://localhost:3000/accounting/setPaymentMethod';   
        $scope.accFormInfo['access_token']  = access_token;
        var data =  JSON.stringify($scope.accFormInfo);
        $http({
            method  : 'POST',
            url     : url,
            data    : {payload:data}
        }).then(function(response){
            if(response.data.status == 'success'){
                $scope.accounts.unshift(response.data.result[0]);                 
                $scope.accFormInfo = {};
                $scope.selected = response.data.result[0].id;  
                $scope.acc_name = response.data.result[0].account_name;             
            }                                                  
        });               
    }

    $scope.getAccountStats =  function(select){        
        $scope.selected = select.id;   
        $scope.acc_name = select.name;
        $http({
            method  : 'GET',
            url     : 'http://localhost:3000/accounting/getStatsByCategory',
            params  :{access_token:access_token,payment_type_id:select.id}          
        }).then(function(response){ 
            $scope.payment_log  = response.data.result;            
            //console.log(response.data.result);
        });   
    } 

    $scope.getSubCategory = function(cat){        
        if(cat== 'Vendor' || cat == 'Staff'){
            $scope.subCat = true;
            var url = 'http://localhost:3000/accounting/getSubCategory';
            $http({
                method  : 'GET',
                url     : url ,
                params  :{access_token:access_token,category:cat}          
            }).then(function(response){               
                if(response.data.result.length > 0){                    
                    $scope.subCategory = response.data.result; 
                    if(cat=='Vendor')
                        $scope.testOpt = 'select Vendor';          
                    else
                        $scope.testOpt = 'select Staff';          
                }
            });
        }else{
            $scope.subCat = false;
        }
    }

    $scope.payForm = {};
    $scope.addTransaction = function(){        
        if($scope.payment_id == undefined){
            var payment_type_id = $scope.selected;
        }else{
            var payment_type_id  = $scope.payment_id;
        }
        if($window.type==3){
            $scope.payForm['type_from'] = $scope.payment_id_from;
            $scope.payForm['type_to']   = $scope.payment_id_to;
        }
        $scope.payForm['type'] = $window.type; //1=> pay, 2=>receive, 3=> transfer  
        $scope.payForm['cat_id']  = $scope.cat_id;
        $scope.payForm['subCat_id']  = $scope.subCat_id;        
        $scope.payForm['access_token']  = access_token;
        $scope.payForm['payment_type_id'] = payment_type_id;
        var url = 'http://localhost:3000/accounting/addTransaction';   
        var data =  JSON.stringify($scope.payForm);
        $http({
            method  : 'POST',
            url     : url,
            data    : {payload:data}
        }).then(function(response){
            if(response.data.status == 'success' && payment_type_id == $scope.selected){

                // if($scope.selected == $scope.payment_id_from){
                //     $scope.payment_log.unshift(response.data.result[0]);                    
                // }else if($scope.selected == $scope.payment_id_to){
                //     $scope.payment_log.unshift(response.data.result[1]);
                // }

                $scope.payment_log.unshift(response.data.result[0]);

                $scope.accounts = response.data.account;  
                $scope.payForm = {}; 
            } 
            //console.log(response);
        }); 
    }
    $scope.dateForm = {};
    $scope.getTest = function(){
        
        console.log('test');
    }


});

phpro.controller('InfoCtrl', function($scope,$http,$window) {
    $scope.transaction_type = 'Billing'
    var url = 'http://localhost:3000/accounting/getInfoStats?access_token='+access_token;
    $http({
        method  : 'GET',
        url     : url,

    }).then(function(response){
        if(response.data.category.length > 0){
            $scope.category = response.data.category; 
            $scope.vendors   = response.data.vendors;
            $scope.staffs    = response.data.staff;           
            $scope.payment_log = response.data.log;
        }

    }); 

    function getSum(result){
        var pay = 0;
        var get = 0;
        for(i=0; i<result.length; i++) {
           pay = pay + result[i].substraction;
           get = get + result[i].addition; 
        };
        var stats = {receive:get,pay:pay,balance:pay-get};
        return stats;
    }

    $scope.getCategoryStats = function(cat){
        $scope.transaction_type = cat.category;
        $scope.sublist = 'zalon';
        var url = 'http://localhost:3000/accounting/getTransactionList';
        $http({
            method  : 'GET',
            url     : url ,
            params  :{access_token:access_token,id:cat.id,category:cat.category}          
        }).then(function(response){               
            if(response.data.result.length > 0){                    
               $scope.payment_log = response.data.result; 
               $scope.stats = getSum(response.data.result);
            }
            // console.log(response);
        });
    }  
});

phpro.controller('contactCtrl', function($scope) {
      
});