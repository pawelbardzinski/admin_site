angular.module('app').controller('sessionCtrl', ['$scope', '$state', function($scope, $state) {

  $scope.disabledButton = false;

  $scope.signInUser = function() {
    $scope.disabledButton = true;
    Parse.User.logIn($scope.user.username, $scope.user.password, {
      success: function(user) {
        $scope.disabledButton = false;
        $scope.error = ""
        $scope.user.currentUser = Parse.User.current();
        $scope.success = "You are signed in as " + $scope.user.currentUser
        $state.forceReload();
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
}]);
