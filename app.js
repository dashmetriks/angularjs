var interceptor = function ($q, $location) {
    return {
        request: function (config) {
            console.log(config);
            return config;
        },

        response: function (result) {
            console.log('Repos:');
        //    result.data.splice(0, 10).forEach(function (repo) {
         //       console.log(repo.name);
        //    })
            return result;
        },

        responseError: function (rejection) {
            console.log('Failed with', rejection.status, 'status');
            if (rejection.status == 403) {
                $location.url('/login');
            }

            return $q.reject(rejection);
        }
    }
};

//angular.module('app', [])
// feature master change

var phonecatAppx = angular.module('phonecatApp1', ['ngRoute']);
//    .config(function ($httpProvider) {
 //       $httpProvider.interceptors.push(interceptor);
//    });

phonecatAppx.config(function ($routeProvider) {
    $routeProvider
      .when('/games', {
        templateUrl: 'wtf.html',
        controller: 'ContactController'
      })
      .when('/gw/:game_id', {
        templateUrl: 'gw.html',
        controller: 'GameUsers'
      })
      .when('/register', {
          templateUrl: 'reg2.html',
        controller: 'ContactController'
      })
      .when('/login', {
          templateUrl: 'loginu.html',
        controller: 'ContactController'
      })
      .when('/fupload', {
          templateUrl: 'fupload.html',
        controller: 'myCtrl'
      })
      .when('/username/:user_id', {
          templateUrl: 'username.html',
        controller: 'myCtrl'
      })
      .when('/user/:user_id', {
          templateUrl: 'user_edit.html',
        controller: 'myCtrl'
      });

//    $locationProvider.html5Mode(true);
  });


//var phonecatAppx = angular.module('phonecatApp1', []);

//phonecatAppx.controller('PhoneListCtrl1', ['$scope', '$http', function($scope, $http) {
//  $http.get('http://127.0.0.1:7000/games/').success(function(data) {
//    $scope.phones = data;
//  });

//  $scope.orderProp = 'age';
//}]);



phonecatAppx.controller('GameUsers',['$scope','$http','$window', "$routeParams",
        function($scope,$http,$window,$routeParams) {

           $scope.gameweek=function(id){
             $http.get('http://localhost:7000/gameweek/' + $routeParams.game_id ).success(function(data) {
             $scope.contacts = data;
             $scope.game_id = $routeParams.game_id;
             $scope.usergameweek();
             });

             $http.get('http://localhost:7000/content/' + $routeParams.game_id ).success(function(data) {
             $scope.contents = data;
            //console.log( "woooooooot" );
             //$scope.game_id = $routeParams.game_id;
             //$scope.usergameweek();
             });


           }

           $scope.add_content = function(id,gstatus) {
             $http({
               method: 'POST',
               url: 'http://127.0.0.1:7000/content/',
               data: '{"game_id":' + $routeParams.game_id  + ',"verbiage":"' + $scope.addcontent.content +  '"}', 
               headers: {'Content-Type': 'application/json', 'Authorization': 'bearer ' + $window.sessionStorage.getItem('token') }
             }).success(function(data) {
               console.log( data );
               //$scope.voted = true;
              // $scope.notvoted = false;
               $scope.gameweek();
             });
           }

           $scope.gameStatus = function(id,gstatus) {
             $http({
               method: 'POST',
               url: 'http://127.0.0.1:7000/gameweek/',
               data: '{"game_id":' + id  + ',"gstatus":"' + gstatus +  '"}', 
               headers: {'Content-Type': 'application/json', 'Authorization': 'bearer ' + $window.sessionStorage.getItem('token') }
             }).success(function(data) {
               console.log( data );
               $scope.voted = true;
               $scope.notvoted = false;
               $scope.gameweek();
             });
           }

 $scope.gameStatusUpdate=function(id,game_id,gstatus,email_choice){
    $http({
      method: 'PUT',
      url: 'http://localhost:7000/gamestatus/' + id ,
      data: '{"id":' + id + ',"gstatus":"'+ gstatus + '","game_id":' + game_id + ',"email_choice":"' + email_choice + '"}',
      headers: {'Content-Type': 'application/json', 'Authorization': 'bearer ' + $window.sessionStorage.getItem('token') }
    }).success(function(data) {
            $scope.gameweek();
    });
 }


 $scope.usergameweek=function(id){
    $http({
      method: 'GET',
      url: 'http://localhost:7000/ugamestatus/' + $routeParams.game_id ,
      headers: {'Content-Type': 'application/json', 'Authorization': 'bearer ' + $window.sessionStorage.getItem('token') }
    }).success(function(data) {
            $scope.names = data;
            if (data.length == 0 ){
             $scope.notvoted = true;
            }else{
             $scope.voted = true;
             $scope.gstatus_id = data[0]['id'];
             $scope.gstatus = data[0]['gstatus'];
             $scope.email_choice = data[0]['email_choice'];
                if (data[0]['email_choice'] == 'YES'){
                   $scope.email_choice_change = 'NO';
                }else{
                   $scope.email_choice_change = 'YES';
                }
            }
            console.log( 'dfa' );
 
    });
 }

}]);


phonecatAppx.controller('ContactController', ['$scope', '$http', '$window', '$location', '$routeParams',
function($scope, $http, $window, $location, $routeParams) {

        // Submit form for registration
	$scope.submitForm = function() {
        	if ($scope.userForm.$valid) {
	    		$http({
				method: 'POST',
      				url: 'http://127.0.0.1:7000/register/',
      				data: 'username=' + $scope.user.username + '&password=' + $scope.user.password,
      				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    				}).success(function(data) {
        				$scope.login(); 
    				});
		}
	};


 $scope.saveuser=function(){
    $http({
      method: 'PUT',
      url: 'http://localhost:7000/user/' + $routeParams.user_id + '/',
      data: '{"first_name":"' + $scope.userdata.first_name + '","last_name":"' + $scope.userdata.last_name  + '","email":"' + $scope.userdata.email + '","username":"' + $scope.userdata.username + '","profile":{"city":"' + $scope.userdata.profile.city + '","phone_choice":"' + $scope.userdata.profile.phone_choice + '","email_choice":"' + $scope.userdata.profile.email_choice + '"}}',
      headers: {'Content-Type': 'application/json', 'Authorization': 'bearer ' + $window.sessionStorage.getItem('token') }
    }).success(function(data) {
            console.log( 'user changed' );
            $scope.getuser();
    });
 }
    
 $scope.getuser=function(){
    $http({
      method: 'GET',
      url: 'http://localhost:7000/user/' + $routeParams.user_id + '/',
      headers: {'Content-Type': 'application/json', 'Authorization': 'bearer ' + $window.sessionStorage.getItem('token') }
    }).success(function(data) {
            $scope.userdata = data;
            console.log( 'get user' );
            console.log( $window.sessionStorage.getItem('token') );
    });
 }

// if($window.sessionStorage.getItem('token') == null) {
//      console.log('logged out');
  //    console.log($window.sessionStorage.getItem('token'));
 //   $scope.visible = true;
 //   $scope.visible = !$scope.visible;
// }else{
//      console.log('logged in');
//      console.log($window.sessionStorage.getItem('token'));
 //   $scope.visible2 = true;
  //  $scope.visible2 = !$scope.visible2;
// }

 $scope.initFirst=function(){
    $http.get('http://127.0.0.1:7000/gameweek/').success(function(data) {
      $scope.contacts = data;
    });
 }

 $scope.gameweek=function(id){
             $http.get('http://localhost:7000/gameweek/' + $routeParams.game_id ).success(function(data) {
             $scope.contacts = data;
             $scope.game_id = $routeParams.game_id;
             $scope.usergameweek();
   // $http.get('http://localhost:7000/gameweek/' + id ).success(function(data) {
    //  $scope.contacts = data;
    });
 }

 $scope.register = function() {
    $http({
      method: 'POST',
      url: 'http://127.0.0.1:7000/register/',
      data: 'username=' + $scope.user.username + '&password=' + $scope.user.password,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data) {
     //   $window.sessionStorage.setItem('token', data.access_token);
        $scope.login(); 
    });
 }

 $scope.login = function() {
    $http({
      method: 'POST',
      url: 'http://127.0.0.1:7000/oauth2/access_token/',
      data: 'username=' + $scope.user.username + '&password=' + $scope.user.password + '&grant_type=password&client_id=' + $scope.user.username,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function(data) {
        $window.sessionStorage.setItem('token', data.access_token);
        $scope.getCurrentUser(); 
    });
 }
        
 $scope.getCurrentUser=function(){
    $http({
      method: 'GET',
      url: 'http://localhost:7000/currentuser/' ,
      headers: {'Content-Type': 'application/json', 'Authorization': 'bearer ' + $window.sessionStorage.getItem('token') }
    }).success(function(data) {
            console.log( 'get current user' );
            console.log( data );
            console.log( data.id );
            $location.path('/username/' + data.id);
    });
 }

 $scope.logout = function(){
    $http.get('http://127.0.0.1:7000/api-auth/logout/').success(function(data) {
      //$scope.contacts = data;
      $window.sessionStorage['token'] = null;
      console.log($window.sessionStorage.getItem('token'));
      $scope.visible = true;
      $scope.visible2 = !$scope.visible2;
    });
 }

 $scope.joinGame = function(id) {
    $http({
      method: 'POST',
      url: 'http://127.0.0.1:7000/mygames/',
      data: '{"game":"' + id  +  '"}', 
      headers: {'Content-Type': 'application/json', 'Authorization': 'bearer ' + $window.sessionStorage.getItem('token') }
    }).success(function(data) {
      console.log( data );
      //$window.sessionStorage.setItem('token', data.access_token);
      //$scope.initFirst();
      //$scope.newcontact = {};
    });
 }
        
 $scope.gameStatus = function(id,gstatus) {
    $http({
      method: 'POST',
      url: 'http://127.0.0.1:7000/gameweek/',
    //  data: '{"game_id":"' + id  +  '"gstatus":""' + gstatus '"}', 
      data: '{"game_id":' + id  + ',"gstatus":"' + gstatus +  '"}', 
      headers: {'Content-Type': 'application/json', 'Authorization': 'bearer ' + $window.sessionStorage.getItem('token') }
    }).success(function(data) {
      console.log( data );
      //$window.sessionStorage.setItem('token', data.access_token);
      $scope.gameweek();
      //$scope.newcontact = {};
    });
 }


 $scope.usergameweek=function(id){
    $http({
      method: 'GET',
      url: 'http://localhost:7000/ugamestatus/' + $routeParams.game_id ,
    //  data: '{"game":"' + id  +  '"}', 
      headers: {'Content-Type': 'application/json', 'Authorization': 'bearer ' + $window.sessionStorage.getItem('token') }
    }).success(function(data) {
             $scope.names = data;
            // $scope.gusers = data;
            console.log( 'woot' );
            console.log( data.id );
            console.log( 'dfa' );
    });
 }

 $scope.gameStatusUpdate=function(id,game_id,gstatus){
    $http({
      method: 'PUT',
      url: 'http://localhost:7000/gamestatus/' + id ,
      data: '{"id":' + id + ',"gstatus":"'+ gstatus + '","game_id":' + game_id + '}',
      headers: {'Content-Type': 'application/json', 'Authorization': 'bearer ' + $window.sessionStorage.getItem('token') }
    }).success(function(data) {
             $scope.names = data;
            // $scope.gusers = data;
            console.log( 'woot' );
            console.log( data );
            console.log( 'dfa' );
            $scope.usergameweek;
    });
 }

 $scope.saveContact = function() {
    var dataObj = { description : $scope.newcontact.name };	
    $http.post('http://127.0.0.1:7000/games/', dataObj ).success(function(data) {
      $scope.initFirst();
      $scope.newcontact = {};
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
//}
}]);



//var myApp = angular.module('myApp', []);

phonecatAppx.directive('ensureUnique', ['$http', function($http) {
return {
    require: 'ngModel',
    link: function(scope, ele, attrs, c) {  if (scope.registered) {return true};
        scope.$watch(attrs.ngModel, function() {
            $http({
                method: 'GET',
                url: 'http://localhost:7000/nicknamecheck/' + ele.val(),
               // params: {
                //    UserNameToVerify: ele.val(),
                 //   BuddyApplicationName:'xxx',
                  //  BuddyApplicationPassword:'yyy'
             //   }
            }).success(function(data, status, headers, cfg) {
                    //c.$setValidity('uniqueS', (data==='UserNameAvailble'));
                    c.$setValidity('unique', false);
                    console.log( "success" );
                    console.log( c );
                }).error(function(data, status, headers, cfg) {
                    c.$setValidity('unique', true);
                    console.log( "errro" );
                    console.log( c );
                });
           });
        }
    }
}]);

phonecatAppx.directive('ensureUniqueEmail', ['$http', function($http) {
return {
    require: 'ngModel',
    link: function(scope, ele, attrs, c) {  if (scope.registered) {return true};
        scope.$watch(attrs.ngModel, function() {
            $http({
                method: 'GET',
                url: 'http://localhost:7000/emailcheck/' + ele.val(),
               // params: {
                //    UserNameToVerify: ele.val(),
                 //   BuddyApplicationName:'xxx',
                  //  BuddyApplicationPassword:'yyy'
             //   }
            }).success(function(data, status, headers, cfg) {
                    //c.$setValidity('uniqueS', (data==='UserNameAvailble'));
                    c.$setValidity('unique', false);
                    console.log( "success" );
                    console.log( c );
                }).error(function(data, status, headers, cfg) {
                    c.$setValidity('unique', true);
                    console.log( "errro" );
                    console.log( c );
                });
           });
        }
    }
}]);

phonecatAppx.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

phonecatAppx.service('fileUpload', [ '$http','$window', function ($http,$window) {
    this.uploadFileToUrl = function(file, uploadUrl,verbiage){
        console.log ('auth token' + $window.sessionStorage.getItem('token'));
        var fd = new FormData();
        fd.append('verbiage', verbiage);
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined , 'Authorization': 'bearer ' + $window.sessionStorage.getItem('token')}
        })
        .success(function(){
//             $scope.getphotos();
        })
        .error(function(){
        });
    }
}]);

phonecatAppx.controller('myCtrl', ['$scope', 'fileUpload','$http','$window','$routeParams' , 
  function($scope, fileUpload , $http, $window, $routeParams){
    
	$scope.submitUserNameForm = function() {
        	if ($scope.userForm.$valid) {
                        alert('our form is amazing');
       			$http({
         			method: 'PUT',
         			url: 'http://localhost:7000/user/' + $routeParams.user_id + '/',
         			data: '{"username":"' + $scope.userdata.username + '","profile":{"nickname":"' + $scope.user.nickname  + '"}}',
         			headers: {'Content-Type': 'application/json', 'Authorization': 'bearer ' + $window.sessionStorage.getItem('token') }
       			}).success(function(data) {
            			console.log( 'user changed' );
            			$scope.getuser();
       			});
     	
		}
	};

    $scope.saveuser=function(){
       $http({
         method: 'PUT',
         url: 'http://localhost:7000/user/' + $routeParams.user_id + '/',
         data: '{"first_name":"' + $scope.userdata.first_name + '","last_name":"' + $scope.userdata.last_name  + '","email":"' + $scope.userdata.email + '","username":"' + $scope.userdata.username + '","profile":{"city":"' + $scope.userdata.profile.city + '","phone_choice":"' + $scope.userdata.profile.phone_choice + '","email_choice":"' + $scope.userdata.profile.email_choice + '"}}',
         headers: {'Content-Type': 'application/json', 'Authorization': 'bearer ' + $window.sessionStorage.getItem('token') }
       }).success(function(data) {
            console.log( 'user changed' );
            $scope.getuser();
       });
    }
    
    $scope.getuser=function(){
       $http({
         method: 'GET',
         url: 'http://localhost:7000/user/' + $routeParams.user_id + '/',
         headers: {'Content-Type': 'application/json', 'Authorization': 'bearer ' + $window.sessionStorage.getItem('token') }
       }).success(function(data) {
            $scope.userdata = data;
            console.log( 'get user' );
            console.log( $window.sessionStorage.getItem('token') );
       });
    }

    $scope.uploadProfilePic = function(){
        var file = $scope.myFile;
        var verbiage = "test";
       // console.log('verbiage ' + verbiage);
        console.log('file is ' + file);
//        var uploadUrl = "http://localhost:7000/profilepic/" + $routeParams.user_id + '/';
        var uploadUrl = "http://localhost:7000/profilepic/";
     //  var uploadUrl = "http://localhost:7000/imageUpload";
        fileUpload.uploadFileToUrl(file, uploadUrl, verbiage);
        $scope.getuser();
    };

    $scope.uploadFile = function(){
        var file = $scope.myFile;
        var verbiage = $scope.verbiage;
        console.log('verbiage ' + verbiage);
        console.log('file is ' + file);
        var uploadUrl = "http://localhost:7000/imageUpload";
        fileUpload.uploadFileToUrl(file, uploadUrl,verbiage);
        $scope.getphotos();
    };

   $scope.getphotos=function(){
    $http.get('http://127.0.0.1:7000/api/photo/').success(function(data) {
      $scope.photos = data;
      console.log('fasfda' + data[0]['image']);
    });
 }
    
}]);

