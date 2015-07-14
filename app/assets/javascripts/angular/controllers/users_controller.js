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

  $scope.getRoleName = function(user) {
      if ($.isEmptyObject(user.get('roleInfo'))) {
        return ""
      }
      return user.get('roleInfo').attributes.name
    }
    //
    // $scope.getUsers = function() {
    //   var User = Parse.Object.extend("User");
    //   var user = new User();
    //   debugger
    //
    //   user.fetch({
    //     success: function(myObject) {
    //       $scope.users = (myObject._serverData.results)
    //       $scope.usersFetched = true;
    //       $scope.$apply();
    //       // The object was refreshed successfully.
    //     },
    //     error: function(myObject, error) {
    //       $scope.usersFetched = 'error';
    //       // The object was not refreshed successfully.
    //       // error is a Parse.Error with an error code and message.
    //     }
    //   });
    // }

  $scope.getUsers();

}]);
