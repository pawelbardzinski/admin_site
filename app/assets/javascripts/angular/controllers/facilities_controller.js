angular.module('app').controller('facilitiesCtrl', ['$scope', '$filter', 'FlashMessage', function($scope, $filter, FlashMessage) {

  $scope.facilities = []
  $scope.facilitiesFetched = false;
  $scope.newFacility = {
    notifications: true
  }

  $scope.newFacility.varianceReasons = ["Pending Admissions",
    "Pending Discharges", "1:1 Suicide Precautions", "1:1 Fall Risk",
    "Acuity High/Low - Specify", "Staffing Need Not Met - Specify"
  ]

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
        FlashMessage.show("New Facility has been created", true)
        $scope.$apply();
      },
      error: function(facility, error) {
        FlashMessage.show(error.message, false)
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
      FlashMessage.show("Facility has been deleted.", true)
      $scope.$apply();
    }, function(error) {
      FlashMessage.show(error.message, false)
      $scope.$apply();
    })
  }


  $scope.$watch('user.currentUser', function(newVal, oldVal) {
    if ($scope.user.currentUser) {
      $scope.getFacility();
    }
  }, true);


}]);
