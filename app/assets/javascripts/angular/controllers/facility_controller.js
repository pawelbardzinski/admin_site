angular.module('app').controller('facilityCtrl', ['$scope', function($scope) {

  $scope.facilities = []
  $scope.facilitiesFetched = false;


  $scope.getFacility = function() {
    var Facility = Parse.Object.extend("Facility");
    var facility = new Facility();

    facility.fetch({
      success: function(myObject) {
        $scope.facilities = (myObject._serverData.results)
        $scope.facilitiesFetched = true;
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


  $scope.$watch('user.currentUser', function(newVal, oldVal) {
    if ($scope.user.currentUser) {
      $scope.getFacility();
    }
  }, true);


}]);
