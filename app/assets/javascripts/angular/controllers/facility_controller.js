angular.module('app').controller('facilityCtrl', ['$scope', function($scope) {

  $scope.facilities = []
  $scope.facilitiesFetched = false;


  $scope.getFacility = function() {
    var Facility = Parse.Object.extend("Facility");
    var query = new Parse.Query("Facility");

    query.find({
      success: function(paramsFacilities) {
        $scope.facilities = paramsFacilities;
        _.each($scope.facilities, function(value, key) {
          facilityQuery = value.relation('units').query()
          facilityQuery.find({
            success: function(results) {
              value.unitAttributes = _.map(results, function(unit) {
                return {
                  unitId: unit.id,
                  unitName: unit.attributes.name
                }
              })
              $scope.$apply();
            },
            error: function(error) {
              value.unitAttributes = []
            }
          });
        })
        $scope.facilitiesFetched = true;
        // The object was refreshed successfully.
      },
      error: function(facilities, error) {
        $scope.usersFetched = 'error';
        // The object was not refreshed successfully.
        // error is a Parse.Error with an error code and message.
      }

    });
  }

  $scope.addNewFacility = function() {
    var Facility = Parse.Object.extend("Facility");
    var facility = new Facility();
    facility.set("name", $scope.name)
    facility.set("varianceReasons", $scope.varianceReasons)
    facility.save(null, {
      success: function(facility) {
        $scope.facilities.push(facility)
        $scope.alerts.success = "New Facility has been created"
        $scope.$apply();
      },
      error: function(facility, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and message.
        $scope.alerts.error = error
      }
    });
  }

  $scope.unitNames = function(facility) {
    return _.pluck(facility.unitAttributes, "unitName").join(', ')
  }


  $scope.$watch('user.currentUser', function(newVal, oldVal) {
    if ($scope.user.currentUser) {
      // $scope.getFacility();
    }
  }, true);


}]);
