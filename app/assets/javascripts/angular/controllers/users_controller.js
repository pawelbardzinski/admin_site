angular.module('app').controller('usersCtrl', ['$scope', '$filter', function($scope, $filter) {
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
        singleObject = $filter('filter')($scope.users, function (object) {return object.id === result.id;})[0];
        $scope.users.splice( $scope.users.indexOf(singleObject), 1 );
        $scope.alerts.success = "User has been deleted"
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

  $scope.showInputForPassword = function(user){
    user.inputForPasswordIsShow = true;
  }

  $scope.updatePassword = function(user){
    var user = new editUser.password();
    debugger
    user.set("password", password);

    user.save(null, {
      success: function(user) {
      debugger


      }
    });
  }

  $scope.togglePassword = function(){
    $scope.isHidePassword = $scope.isHidePassword? false : true
  }


  $scope.getRoles();
  $scope.getUsers();

}]);
