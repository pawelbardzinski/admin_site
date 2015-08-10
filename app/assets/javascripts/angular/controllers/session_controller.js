angular.module('app').controller('sessionCtrl', ['$scope', '$state', function($scope, $state) {

  $scope.disabledButton = false;
  $scope.passwordFormVisible = false;


  $scope.afterSuccessSignIn = function(username){
    $scope.disabledButton = false;
    $scope.alerts.error = ""
    $scope.alerts.info = "You have been signed in as " + username
  }


  $scope.signInUser = function() {
    $scope.info = "";
    $scope.disabledButton = true;
    Parse.User.logIn($scope.user.username, $scope.user.password, {
      success: function(user) {
        $scope.user.currentUser = Parse.User.current();
        $scope.user.roleInfo = Parse.User.current() && Parse.User.current().get("roleInfo");
        $scope.$emit('userChanged');
        $state.forceReload();
        $scope.afterSuccessSignIn($scope.user.currentUser.get('username'));
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

  $scope.passwordFormVisible = function() {
    $scope.isPasswordFormVisible = true;
  }

  $scope.sendResetPasswordEmail = function() {
    Parse.User.requestPasswordReset($scope.userEmail).then(function(user) {
      $scope.alerts.info = "Check your email box for the password reset email"
      $scope.$apply();
    }, function(error) {
      $scope.alerts.error = error.message
      $scope.$apply();
    })
  }


}]);
