angular.module('app').controller('usersCtrl', ['$scope', '$filter', '$http', function($scope, $filter, $http) {

  $scope.usersFetched = false;
  $scope.editUser = {
    isHidePassword: {},
    role: {},
    password: {}
  }
  $scope.newUser = {}

  $scope.getUsers = function() {

    var query = new Parse.Query('Facility');
    if (Parse.User.current().get('facility')) {
      query.get(Parse.User.current().get('facility').id).then(function(result) {
        $scope.facility = result;
        var roleQuery = new Parse.Query('_Role');
        roleQuery.include("info");
        return roleQuery.find({
          "facility": $scope.facility
        });
      }, function(error) {
        $scope.users = [];
        $scope.usersFetched = true;
        $scope.$apply();
      }).then(function(results) {
          $scope.roles = results;
          var userQuery = new Parse.Query('User');
          userQuery.include("roleInfo");
          return userQuery.find({
            facility: $scope.facility
          });
        },
        function(error) {
          console.log(error)
          $scope.users = [];
          $scope.usersFetched = true;
          $scope.$apply();
        }
      )
      .then(function(results) {
          if (results) {
            _.each(results, function(value, key) {
              value.roleName = $.isEmptyObject(value.get('roleInfo')) ? "" : value.get('roleInfo').get('name')
              value.facilityName = $scope.facility.get('name');
            })
            $scope.users = results;
          }
          $scope.usersFetched = true;
          $scope.$apply();
        },
        function(error) {})
    } else {
      $scope.users = [];
    }

  }

  $scope.getRoleName = function(user) {
    if ($.isEmptyObject(user.get('roleInfo'))) {
      return ""
    }
    return user.get('roleInfo').get('name')
  }


  $scope.destroyUser = function(user) {
    Parse.Cloud.run("deleteUser", {
      username: user.get('username')
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

  $scope.showInputForPassword = function(user) {
    user.inputForPasswordIsShow = true;
  }

  $scope.showInputForRole = function(user) {
    user.inputForRoleIsShow = true;
  }

  $scope.updatePassword = function(user) {
    Parse.Cloud.run("updateUser", {
      username: user.get('username'),
      password: $scope.editUser.password[user.id]
    }).then(function(result) {
      $scope.alerts.info = "User " + user.get('username') + " password has been changed"
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
      username: user.get('username'),
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

  $scope.addNewUser = function() {
    Parse.Cloud.run("createUser", {
      username: $scope.newUser.username,
      password: $scope.newUser.password,
      facilityId: $scope.facility.id,
      roleName: $scope.newUser.role,
      assignedUnits: []
    }).then(function(user) {
      $scope.alerts.info = "User " + user.get('username') + " has been created"
      if ($scope.newUser.role) {
        user.roleName = $scope.newUser.role;
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

  $scope.getUsers();
}]);
