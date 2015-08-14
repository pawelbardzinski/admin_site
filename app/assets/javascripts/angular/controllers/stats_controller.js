angular.module('app').controller('statsCtrl', ['$scope', 'FlashMessage', function($scope, FlashMessage) {

  $scope.fetchUsers = function() {
    query = new Parse.Query(Parse.User)
    query.find({}).then(function(users) {
      $scope.users = users;
      var roleQuery = new Parse.Query("RoleInfo");
      return query.find({})
    }, function(errors) {}).then(function(roleInfo) {
      $scope.$apply();
    }, function(errors) {
      $scope.$apply();
    })
  }
  $scope.fetchUsers();

}]);
