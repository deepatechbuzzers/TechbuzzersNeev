app.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    
$scope.shouldShowDelete = true;
    
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/Sign-in.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('SignInCtrl', function($scope, $state, Authentication, $rootScope) {
  
                  var authenticate = function(credentials, callback) {
                                  var dataP = (credentials) ? {userName: credentials.username , password:credentials.password}: {};
                                  
                                  if(dataP.userName && dataP.password)
                      Authentication.login(dataP, callback);
                  }/***********Authenticate***********/

                  authenticate();
                  $scope.user = {};
                
                  $scope.signIn = function() {
                      authenticate($scope.user, function() {
                        if ($rootScope.authenticated) {
                          $state.go('app.kpi');
                          $scope.error = false;
                        } else {
                                //$state.go('app.kpi');
                                $state.go('signin');
                            $scope.error = true;
                        }
                      });
                  };
  
})


.controller('kpiCtrl', function($scope) {
  $scope.kpilists = [
  { title: 'Inventory', id: 1, img:'img/inventory.jpg', val:13000},
 //{ title: 'Inventory', id: 1, img:'fa fa-cubes', val:13000},
    { title: 'Sales', id: 2, img:'img/salesimage.png',val:1230 },
    { title: 'In Transit', id: 3, img:'img/transit.jpg',val: 1400 },
    { title: 'Personnel', id: 4, img:'img/personnel.jpg',val : 24 },
    { title: 'Returned', id: 5, img:'img/returned.jpg',val : 5  }
  ];
})


.controller("MenuCtrl",function($scope, $rootScope) {
                 
                $scope.userRole = sessionStorage.getItem('role');

                $scope.logout = function(){
                                sessionStorage.clear();
                                $rootScope.authenticated = false;
                                window.location.reload();
                                window.location.href="#/app/sign-in.html";

                                
                }
})


.controller("ExampleController", function($scope) {
 
    $scope.labels = ["Cotton", "Ink", "Item X", "Item Y", "Item Z", "Item A", "Item B"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
 
})





