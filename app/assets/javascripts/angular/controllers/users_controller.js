angular.module('app').controller('usersCtrl', ['$scope', function($scope) {
$scope.usersFetched = false;

  $scope.getUsers = function() {
    var User = Parse.Object.extend("User");
    var user = new User();

    user.fetch({
      success: function(myObject) {
        $scope.users = (myObject._serverData.results)
        $scope.usersFetched = true;
        $scope.$apply();
        // The object was refreshed successfully.
      },
      error: function(myObject, error) {
        $scope.usersFetched = 'error';
        // The object was not refreshed successfully.
        // error is a Parse.Error with an error code and message.
      }
    });
  }

  $scope.getUsers();

}]);
