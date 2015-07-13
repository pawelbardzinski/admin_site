angular.module('app').controller('SessionCtrl', ['$scope', function($scope) {

  Parse.initialize("jjQlIo5A3HWAMRMCkH8SnOfimVfCi6QlOV9ZNO2T", "EK0eXjOx2Ugs26mIUgCzQOMoLBlYbc5Lba9Q6Zba");

  var User = Parse.Object.extend("User");
  // var user = new User();

  $scope.user = {
    signedIn: false
  }
  $scope.disabledButton = false;
  $scope.facilities = []
  $scope.currentUser = Parse.User.current();


  $scope.signInUser = function() {
    $scope.disabledButton = true;
    Parse.User.logIn($scope.user.username, $scope.user.password, {
      success: function(user) {
        $scope.disabledButton = false;
        $scope.error = ""
        $scope.user.currentUser = user._serverData;
        $scope.success = "You are signed in as " + $scope.user.currentUser.username
        $scope.user.signedIn = true;
        $scope.getFacility();
        $scope.$apply();
      },
      error: function(user, error) {
        $scope.disabledButton = false;
        $scope.success = ""
        $scope.error = "Invalid username or password"
        $scope.$apply();
      }
    });

  }



  $scope.getFacility = function() {
    var Facility = Parse.Object.extend("Facility");
    var facility = new Facility();

    facility.fetch({
      success: function(myObject) {
        $scope.facilities = (myObject._serverData.results)
        $scope.$apply();
        // The object was refreshed successfully.
      },
      error: function(myObject, error) {
        // The object was not refreshed successfully.
        // error is a Parse.Error with an error code and message.
      }
    });
  }



  $scope.asLoggedIn = function() {
    $scope.getFacility();
  }

  if($scope.currentUser) {
    $scope.asLoggedIn();
  }

  //   var username = "test@test.com"
  //   var password = "lol1234"
  // var query = new Parse.Query(User);
  // user.get('oahPf3rd1p')

  // user.fetch({
  // success: function(myObject) {
  //   console.log(myObject._serverData.results)
  //   // The object was refreshed successfully.
  // },
  // error: function(myObject, error) {
  // debugger
  //   // The object was not refreshed successfully.
  //   // error is a Parse.Error with an error code and message.
  // }
  // });

}]);
