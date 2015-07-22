angular.module('app').controller('ApplicationCtrl', ['$scope', '$state', function($scope, $state) {

  Parse.initialize("jjQlIo5A3HWAMRMCkH8SnOfimVfCi6QlOV9ZNO2T", "EK0eXjOx2Ugs26mIUgCzQOMoLBlYbc5Lba9Q6Zba");

  var adminRoleName = "Admin";
  var superAdminRoleName = "Super User";

  $scope.User = Parse.Object.extend("User");
  $scope.user = {
    currentUser: Parse.User.current(),
    roleInfo: Parse.User.current() && Parse.User.current().get("roleInfo"),
  }
  $scope.alerts = {
    success: "",
    error: ""
  }

  $scope.checkRole = function() {
    if ($scope.user.roleInfo) {
      var query = new Parse.Query("RoleInfo");
      query.equalTo("objectId", $scope.user.roleInfo.id)
      return query.find().then(function(object) {
        if (object[0].get('name') == adminRoleName) {
          $scope.user.isAdmin = true;
        } else if (object[0].get('name') == superAdminRoleName) {
          $scope.user.isSuperAdmin = true;
        }
      })
    } else {
      $scope.user.isAdmin = false;
      $scope.user.isSuperAdmin = false;
    }
  }

  $scope.checkRole();


  $scope.$on('userChanged', function(event, mass) {
    $scope.checkRole();
  })


  $scope.isSudo = function() {
    return $scope.user.currentUser && $scope.user.isSuperAdmin
  }

  $scope.isAdmin = function() {
    return $scope.user.currentUser && $scope.user.isAdmin
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
