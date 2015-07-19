angular.module('app').controller('usersCtrl', ['$scope', '$filter', '$http', function($scope, $filter, $http) {

  $scope.usersFetched = false;
  $scope.editUser = {
    isHidePassword: {},
    role: {},
    password: {}
    }

  $scope.getUsers = function() {

    var query = new Parse.Query('User');
    query.include("roleInfo");
    query.find({
      success: function(results) {
        _.each(results, function(value, key){
          value.roleName = $.isEmptyObject(value.get('roleInfo')) ? "" : value.get('roleInfo').attributes.name
        })
        $scope.users = results;
        $scope.usersFetched = true;
        $scope.$apply();
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });

  }

  $scope.getRoleName = function(user) {
    if ($.isEmptyObject(user.get('roleInfo'))) {
      return ""
    }
    return user.get('roleInfo').attributes.name
  }


  $scope.destroyUser = function(user) {
    Parse.Cloud.run("destroyUser", {
      userId: user.id
    }).then(function(result) {
      singleObject = $filter('filter')($scope.users, function(object) {
        return object.id === result.id;
      })[0];
      $scope.users.splice($scope.users.indexOf(singleObject), 1);
      $scope.alerts.info = "User has been deleted"
      $scope.$apply();
    }, function(error) {
      $scope.alerts.error = error
      $scope.$apply();
    })
  }


  $scope.getRoles = function() {

    var query = new Parse.Query('RoleInfo');
    query.find({
      success: function(results) {
        $scope.roles = results;
        $scope.$apply();
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  }

  $scope.showInputForPassword = function(user) {
    user.inputForPasswordIsShow = true;
  }

  $scope.showInputForRole = function(user) {
    user.inputForRoleIsShow = true;
  }

  $scope.updatePassword = function(user) {
    Parse.Cloud.run("updatePasswordForUser", {
      userId: user.id,
      password: $scope.editUser.password[user.id]
    }).then(function(result) {
      $scope.alerts.info = "User" + user.attributes.username + "password has been changed"
      user.inputForPasswordIsShow = false;
      $scope.$apply();
    }, function(error) {
      $scope.alerts.error = error
      $scope.$apply();
    })
  }

  $scope.updateRole = function(user) {
    roleId = $scope.editUser.role[user.id]
    Parse.Cloud.run("updateRoleForUser", {
      userId: user.id,
      roleId: roleId
    }).then(function(result) {
      user.roleName = $filter('filter')($scope.roles, {id: roleId})[0].attributes.name;
      user.inputForRoleIsShow = false;
      $scope.alerts.info = "User" + user.email + "role has been changed"
      $scope.$apply();
    }, function(error) {
      $scope.alerts.error = error
      $scope.$apply();
    })
  }


  $scope.togglePassword = function(user) {
    $scope.editUser.isHidePassword[user] = $scope.editUser.isHidePassword[user] ? false : true
  }

  $scope.getRoles();
  $scope.getUsers();

}]);
