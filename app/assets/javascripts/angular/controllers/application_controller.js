angular.module('app').controller('ApplicationCtrl', ['$scope', '$state', 'FlashMessage', function($scope, $state, FlashMessage) {

  Parse.initialize(window.appId, window.javascriptKey);

  var adminRoleName = "Admin";

  $scope.User = Parse.User;
  $scope.user = {
    currentUser: Parse.User.current(),
    roleInfo: Parse.User.current() && Parse.User.current().get("roleInfo"),
  }

  $scope.checkRole = function() {
    if ($scope.user.roleInfo) {
      var query = new Parse.Query("RoleInfo");
      query.equalTo("objectId", $scope.user.roleInfo.id)
      return query.first().then(function(roleInfo) {
        $scope.user.isAdmin = roleInfo.get('name') == adminRoleName
        $scope.user.canEditFacility = roleInfo.get('editFacility')
      })
    } else {
      $scope.user.isAdmin = false;
      $scope.user.canEditFacility = false;
    }
  }

  $scope.checkRole();

  $scope.$on('userChanged', function(event, mass) {
    $scope.checkRole();
  })


  $scope.isAdmin = function() {
    return $scope.user.currentUser && $scope.user.isAdmin
  }

  $scope.canEditFacility = function() {
    return $scope.user.currentUser && $scope.user.canEditFacility
  }


  $scope.logout = function() {
    Parse.User.logOut();
    $scope.user.currentUser = null;
    $scope.user.password = "";
    $state.forceReload();
    $scope.error = "";
    FlashMessage.show("You have been successfully logged out", true)
  }

}]);
