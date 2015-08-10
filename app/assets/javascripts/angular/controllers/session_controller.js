angular.module('app').controller('sessionCtrl', ['$scope', '$state', 'FlashMessage', function($scope, $state, FlashMessage) {

  $scope.disabledButton = false;
  $scope.passwordFormVisible = false;


  $scope.afterSuccessSignIn = function(username){
    $scope.disabledButton = false;
    FlashMessage.show("You have been signed in as " + username, true)
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
        $scope.user.password = "";
        FlashMessage.show("Invalid username or password", false)
        $scope.$apply();
      }
    });
  }

  $scope.passwordFormVisible = function() {
    $scope.isPasswordFormVisible = true;
  }

  $scope.sendResetPasswordEmail = function() {
    Parse.User.requestPasswordReset($scope.userEmail).then(function(user) {
      FlashMessage.show("Check your email box for the password reset email", true)
      $scope.$apply();
    }, function(error) {
      FlashMessage.show(error.message, false)
      $scope.$apply();
    })
  }


}]);
