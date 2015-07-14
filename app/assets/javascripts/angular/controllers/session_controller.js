angular.module('app').controller('SessionCtrl', ['$scope', function($scope) {

  $scope.disabledButton = false;

  $scope.signInUser = function() {
    $scope.disabledButton = true;
    Parse.User.logIn($scope.user.username, $scope.user.password, {
      success: function(user) {
        $scope.disabledButton = false;
        $scope.error = ""
        $scope.user.currentUser = Parse.User.current();
        $scope.success = "You are signed in as " + $scope.user.currentUser
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
