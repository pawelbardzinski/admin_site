angular.module('app').controller('usersCtrl', ['$scope', function($scope) {
  $scope.usersFetched = false;

  $scope.getUsers = function() {

    var query = new Parse.Query('User');
    query.include("roleInfo");
    query.find({
      success: function(results) {
        $scope.users = results;
        $scope.usersFetched = true;
        $scope.$apply();
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });

  }

  // 
  // Parse.Cloud.define("destroyUser", function(request, response) {
  //   var userId = request.params.userId;
  //   var User = Parse.Object.extend("User");
  //   var query = new Parse.Query(User);
  //   Parse.Cloud.useMasterKey();
  //
  //   return query.get(userId, {
  //     success: function(user) {
  //     return user.destroy({
  //       success: function(user) {
  //         response.success('deleted');
  //       },
  //       error: function(user, error) {
  //         response.error('error remove');
  //       }
  //     }),
  //     error: function(object, error) {
  //       response.error(error);
  //     }
  //   });
  // })


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
      console.log(result);
    }, function(error) {
      console.log(error);
    })
  }


  $scope.getUsers = function() {

    var query = new Parse.Query('User');
    query.include("roleInfo");
    query.find({
      success: function(results) {
        $scope.users = results;
        $scope.usersFetched = true;
        $scope.$apply();
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
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


  $scope.getRoles();
  $scope.getUsers();

}]);
