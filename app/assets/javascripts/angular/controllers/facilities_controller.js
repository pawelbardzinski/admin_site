angular.module('app').controller('facilitiesCtrl', ['$scope', '$filter', function($scope, $filter) {

  $scope.facilities = []
  $scope.facilitiesFetched = false;
  $scope.newFacility = {
    notifications: true
  }

  $scope.getFacility = function() {
    var Facility = Parse.Object.extend("Facility");
    var query = new Parse.Query("Facility");
    query.notEqualTo("archived", true);

    query.find({
      success: function(paramsFacilities) {
        $scope.facilities = paramsFacilities;

        var Unit = Parse.Object.extend("Unit");
        var query = new Parse.Query("Unit");
        query.include("facility");

        query.find({
          success: function(paramsUnits) {
            $scope.units = paramsUnits;
            $scope.facilitiesFetched = true;
            _.each($scope.facilities, function(value, key) {

              var facilityUnits = $filter('filter')($scope.units, function(object) {
                return object.get('facility') && object.get('facility').id === value.id
              });
              value.unitAttributes = _.map(facilityUnits, function(unit) {
                return {
                  unitId: unit.id,
                  unitName: unit.get('name')
                }
              })
            })

            $scope.$apply();
          },
          error: function(units, error) {
            $scope.facilitiesFetched = 'error';
          }
        })
      },
      error: function(facilities, error) {
        $scope.facilitiesFetched = 'error';
      }

    });
  }

  $scope.addNewFacility = function() {
    var Facility = Parse.Object.extend("Facility");
    var facility = new Facility();
    facility.set("name", $scope.newFacility.name)
    facility.set("varianceReasons", $scope.newFacility.varianceReasons)
    facility.set("varianceReasons", $scope.newFacility.varianceReasons)
    facility.set("negativeNotificationThreshold", $scope.newFacility.negativeNotificationThreshold)
    facility.set("positiveNotificationThreshold", $scope.newFacility.positiveNotificationThreshold)


    facility.save(null, {
      success: function(facility) {
        $scope.facilities.push(facility)
        $scope.alerts.info = "New Facility has been created"
        $scope.$apply();
      },
      error: function(facility, error) {
        $scope.alerts.error = error.message
      }
    });
  }

  $scope.unitNames = function(facility) {
    return _.pluck(facility.unitAttributes, "unitName").join(', ')
  }

  $scope.destroyFacility = function(facility) {
    facility.set("archived", true)
    facility.save().then(function(facilityResponse) {
      $scope.facilities.splice($scope.facilities.indexOf(facility), 1);
      $scope.alerts.info = "Facility has been deleted."
      $scope.$apply();
    }, function(error) {
      $scope.alerts.info = error.message
      $scope.$apply();
    })
  }


  $scope.$watch('user.currentUser', function(newVal, oldVal) {
    if ($scope.user.currentUser) {
      $scope.getFacility();
    }
  }, true);


}]);
