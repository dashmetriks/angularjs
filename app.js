var uid = 1;


//var phonecatAppx = angular.module('phonecatApp1', []);

//phonecatAppx.controller('PhoneListCtrl1', ['$scope', '$http', function($scope, $http) {
//  $http.get('http://127.0.0.1:7000/games/').success(function(data) {
//    $scope.phones = data;
//  });

//  $scope.orderProp = 'age';
//}]);



function ContactController($scope, $http) {
    
 $scope.initFirst=function(){
    $http.get('http://127.0.0.1:7000/games/').success(function(data) {
      $scope.contacts = data;
    });
 }
   // $scope.contacts = [
   //     {id:0, 'name': 'Viral', 'email':'hello@gmail.com', 'phone': '123-2343-44'}
   // ];
    
 $scope.saveContact = function() {
    var dataObj = {
				description : $scope.newcontact.name 
		};	
   // $http.post('http://127.0.0.1:7000/oauth2/access_token/', 'username=jameson&password=password&grant_type=password&client_id=jameson' ).success(function(data) {
    $http({
      method: 'POST',
      url: 'http://127.0.0.1:7000/oauth2/access_token/',
      data: 'username=jameson&password=password&grant_type=password&client_id=jameson',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data) {
      console.log( data.access_token );
      $scope.initFirst();
      $scope.newcontact = {};
     // $scope.contacts = data;
    });
 }
        
//        if($scope.newcontact.id == null) {
 //            $scope.newcontact.id = uid++;
//             $scope.contacts.push($scope.newcontact);
 //       } else {
            
//             for(i in $scope.contacts) {
 //                   if($scope.contacts[i].id == $scope.newcontact.id) {
  //                      $scope.contacts[i] = $scope.newcontact;
//                    }
 //            }                
//        }
//        $scope.newcontact = {};

    
    $scope.delete = function(id) {
        
        for(i in $scope.contacts) {
            if($scope.contacts[i].id == id) {
                $scope.contacts.splice(i,1);
                $scope.newcontact = {};
            }
        }
        
    }
    
    
    $scope.edit = function(id) {
        for(i in $scope.contacts) {
            if($scope.contacts[i].id == id) {
                $scope.newcontact = angular.copy($scope.contacts[i]);
            }
        }
    }
}
