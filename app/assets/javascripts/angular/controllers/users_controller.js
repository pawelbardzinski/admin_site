angular.module('app').controller('usersCtrl', ['$scope', '$filter', '$http', function($scope, $filter, $http) {

  $scope.usersFetched = false;
  $scope.editUser = {
    isHidePassword: {},
    role: {},
    password: {}
  }
  $scope.newUser = {}

  $scope.getUsers = function() {

    var query = new Parse.Query('User');
    query.include("roleInfo");
    query.find({
      success: function(results) {
        _.each(results, function(value, key) {
          value.roleName = $.isEmptyObject(value.get('roleInfo')) ? "" : value.get('roleInfo').attributes.name
        })
        $scope.users = results;

        var Facility = Parse.Object.extend("Facility");
        var query = new Parse.Query("Facility");

        query.find({
          success: function(paramsFacilities) {
            $scope.usersFetched = true;
            $scope.facilities = paramsFacilities;
            $scope.$apply();
          },
          error: function(units, error) {
            $scope.facilitiesFetched = 'error';
            $scope.$apply();
          }
        })
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
    Parse.Cloud.run("deleteUser", {
      username: user.attributes.username
    }).then(function(result) {
      singleObject = $filter('filter')($scope.users, function(object) {
        return object.id === result.id;
      })[0];
      $scope.users.splice($scope.users.indexOf(singleObject), 1);
      $scope.alerts.info = "User has been deleted"
      $scope.$apply();
    }, function(error) {
      $scope.alerts.error = error.message
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
    Parse.Cloud.run("updateUser", {
      username: user.attributes.username,
      password: $scope.editUser.password[user.id]
    }).then(function(result) {
      $scope.alerts.info = "User " + user.attributes.username + " password has been changed"
      user.inputForPasswordIsShow = false;
      $scope.editUser.password[user.id] = ""
      $scope.$apply();
    }, function(error) {
      $scope.alerts.error = error.message
      $scope.$apply();
    })
  }

  $scope.updateRole = function(user) {
    Parse.Cloud.run("updateUserRole", {
      username: user.attributes.username,
      role: $scope.editUser.role[user.id],
      assignedUnits: []
    }).then(function(result) {
      user.roleName = $scope.editUser.role[user.id];
      user.inputForRoleIsShow = false;
      $scope.alerts.info = "User " + user.get('username') + " role has been changed"
      $scope.$apply();
    }, function(error) {
      $scope.alerts.error = error.message
      $scope.$apply();
    })

  }


  $scope.togglePassword = function(user) {
    $scope.editUser.isHidePassword[user] = $scope.editUser.isHidePassword[user] ? false : true
  }

  $scope.toggleNewUserPassword = function(user) {
    $scope.newUser.isHidePassword = $scope.newUser.isHidePassword ? false : true
  }


  $scope.facilityName = function(user) {
    if (user.attributes.facility) {
      facilities = $filter('filter')($scope.facilities, function(object) {
        return object.id === user.get('facility').id
      })
      return facilities[0] ? facilities[0].get('name') : "";
    }
  }

  $scope.addNewUser = function() {
    Parse.Cloud.run("createUser", {
      username: $scope.newUser.username,
      password: $scope.newUser.password,
      facilityId: $scope.newUser.facility,
      roleName: $scope.newUser.role,
      assignedUnits: []
    }).then(function(user) {
      $scope.alerts.info = "User " + user.get('username') + " has been created"
      if ($scope.newUser.role) {
        user.roleName = $filter('filter')($scope.roles, {
          id: $scope.newUser.role
        })[0].get('name');
      }
      $scope.newUser.facility = null
      $scope.newUser.role = null
      $scope.newUser.username = ""
      $scope.newUser.password = ""

      $scope.users.push(user)
      $scope.$apply();
    }, function(error) {
      $scope.alerts.error = error.message
      $scope.$apply();
    })
  }

  $scope.getRoles();
  $scope.getUsers();

}]);
