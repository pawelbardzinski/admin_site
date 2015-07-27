angular.module('app').controller('sessionCtrl', ['$scope', '$state', function($scope, $state) {

  $scope.disabledButton = false;
  $scope.showFormForPassword = false;

  $scope.signInUser = function() {
    $scope.info = "";
    $scope.disabledButton = true;
    Parse.User.logIn($scope.user.username, $scope.user.password, {
      success: function(user) {
        $scope.disabledButton = false;
        $scope.alerts.error = ""
        $scope.user.currentUser = Parse.User.current();
        $scope.user.roleInfo = Parse.User.current() && Parse.User.current().get("roleInfo");
        $scope.$emit('userChanged');
        $state.forceReload();
        $scope.alerts.info = "You have been signed in as " + $scope.user.currentUser.get('username')
        $scope.$apply();
      },
      error: function(user, error) {
        $scope.disabledButton = false;
        $scope.alerts.info = ""
        $scope.user.password = "";
        $scope.alerts.error = "Invalid username or password"
        $scope.$apply();
      }
    });
  }

  $scope.showFormForPassword = function() {
    $scope.formForPasswordIsShowed = true;
  }

  $scope.sendResetPasswordEmail = function() {
    Parse.User.requestPasswordReset($scope.userEmail).then(function(user) {
      $scope.alerts.info = "Check your email account for the Password Recovery email"
      $scope.$apply();
    }, function(error) {
      $scope.alerts.error = error.message
      $scope.$apply();
    })
  }


}]);
