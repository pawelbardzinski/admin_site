angular.module('app').controller('facilityCtrl', ['$scope', function($scope) {

  $scope.facilities = []

  $scope.getFacility = function() {
    var Facility = Parse.Object.extend("Facility");
    var facility = new Facility();

    facility.fetch({
      success: function(myObject) {
        $scope.facilities = (myObject._serverData.results)
        $scope.$apply();
        // The object was refreshed successfully.
      },
      error: function(myObject, error) {
        // The object was not refreshed successfully.
        // error is a Parse.Error with an error code and message.
      }
    });
  }


  $scope.$watch('user.currentUser', function(newVal, oldVal) {
    if ($scope.user.currentUser) {
      $scope.getFacility();
    }
  }, true);


}]);
