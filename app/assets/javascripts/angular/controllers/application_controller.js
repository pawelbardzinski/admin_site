angular.module('app').controller('ApplicationCtrl', ['$scope', '$state', function($scope, $state) {

  Parse.initialize("jjQlIo5A3HWAMRMCkH8SnOfimVfCi6QlOV9ZNO2T", "EK0eXjOx2Ugs26mIUgCzQOMoLBlYbc5Lba9Q6Zba");

  var adminRoleId = "2nJCTxpoyr";

  $scope.User = Parse.Object.extend("User");
  $scope.user = {
    currentUser: Parse.User.current()
  }
  $scope.alerts = {
    success: "",
    error: ""
  }


  $scope.isAdmin = function() {
    var currentUser = Parse.User.current()
    return currentUser && currentUser.attributes.roleInfo && currentUser.attributes.roleInfo.id == adminRoleId
  }


  $scope.logout = function() {
    Parse.User.logOut();
    $scope.user.currentUser = null;
    $scope.user.password = "";
    $state.forceReload();
    $scope.error = "";
    $scope.alerts.info = "You have been successfully logged out!"
  }

}]);
