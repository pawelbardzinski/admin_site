angular.module('app').controller('ApplicationCtrl', ['$scope', '$state', function($scope, $state) {

  Parse.initialize("jjQlIo5A3HWAMRMCkH8SnOfimVfCi6QlOV9ZNO2T", "EK0eXjOx2Ugs26mIUgCzQOMoLBlYbc5Lba9Q6Zba");

  $scope.User = Parse.Object.extend("User");
  $scope.user = {
    currentUser: Parse.User.current()
  }
  $scope.alerts = {
    success: "",
    error: ""
  }

  $scope.logout = function() {
    Parse.User.logOut()
    $scope.user.currentUser = null;
    $state.forceReload();
    $scope.error = ""
    $scope.alerts.info = "You have been successfully logged out!"
  }

}]);
