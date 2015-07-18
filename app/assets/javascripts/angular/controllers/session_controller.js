angular.module('app').controller('sessionCtrl', ['$scope', '$state', function($scope, $state) {

  $scope.disabledButton = false;

  $scope.signInUser = function() {
    $scope.success = "";
    $scope.disabledButton = true;
    Parse.User.logIn($scope.user.username, $scope.user.password, {
      success: function(user) {
        $scope.disabledButton = false;
        $scope.alerts.error = ""
        $scope.user.currentUser = Parse.User.current();
        $state.forceReload();
        $scope.alerts.success = "You have been signed in as " + $scope.user.currentUser.attributes.username
        $scope.$apply();
      },
      error: function(user, error) {
        $scope.disabledButton = false;
        $scope.alerts.success = ""
        $scope.alerts.error = "Invalid username or password"
        $scope.$apply();
      }
    });
  }
}]);
