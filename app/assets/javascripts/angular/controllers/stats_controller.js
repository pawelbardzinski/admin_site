angular.module('app').controller('statsCtrl', ['$scope', 'FlashMessage', function($scope, FlashMessage) {

  $scope.adminCount = 0;

  $scope.fetchUsers = function() {
    query = new Parse.Query(Parse.User)
    query.find({}).then(function(users) {
      $scope.users = users;
      var roleQuery = new Parse.Query("RoleInfo");
      return roleQuery.find({})
    }, function(errors) {}).then(function(roleInfo) {
      _.each($scope.users, function(user) {
        if (user.get('roleInfo')) {
          roleFound = _.detect(roleInfo, function(role) {
            if (role.id == user.get('roleInfo').id) {
              return role
            }
          })
          if (roleFound && roleFound.get('editFacility')) {
            $scope.adminCount = $scope.adminCount + 1;
            user.attributes.admin = true
          }
        }
      })
      var Facility = Parse.Object.extend("Facility");
      var facilitiesQuery = new Parse.Query("Facility");
      facilitiesQuery.notEqualTo("archived", true);
      return facilitiesQuery.find({})
    }, function(errors) {}).then(function(facilities) {
      $scope.facilities = facilities;
      $scope.$apply();
    }, function(errors) {
      $scope.$apply();
    })
  }
  
  $scope.fetchUsers();
}]);
