angular.module('app').controller('facilityCtrl', ['$scope', '$filter', function($scope, $filter) {
  $scope.newFacility = {
    notifications: true
  }
  $scope.newUnit = {
    shifTimes: [25200, 54000, 68400, 82800],
    varianceReasons: ["Pending Admissions", "Pending Discharges", "1:1 Suicide Precautions", "1:1 Fall Risk", "Acuity High/Low - Specify", "Staffing Need Not Met - Specify", "Other"],
    maxCensus: 35
  }
  $scope.edit = {
    toggle: []
  }
  $scope.facility = null;

  $scope.getFacility = function() {
    var Facility = Parse.Object.extend("Facility");
    var query = new Parse.Query("Facility");
    if (Parse.User.current().get('facility')) {

      query.get(Parse.User.current().get('facility').id).then(function(facility) {
        $scope.facility = facility;
        $scope.editFacility = angular.copy(facility.attributes)

        var Unit = Parse.Object.extend("Unit");
        var query = new Parse.Query("Unit");
        query.include("facility");
        return query.find({
          facility: $scope.facilities
        })
      }, function(error) {
        $scope.facilitiyFetched = 'error';
      }).then(function(paramsUnits) {
        $scope.units = paramsUnits;
        var facilityUnits = $filter('filter')($scope.units, function(object) {
          return object.get('facility').id === $scope.facility.id
        });
        $scope.facility.unitAttributes = _.map(facilityUnits, function(unit) {
          return {
            unitId: unit.id,
            unitName: unit.get('name')
          }
        })
        var roleQuery = new Parse.Query(Parse.Role);
        return roleQuery.find({
          facility: $scope.facility
        })
      }, function(units, error) {
        $scope.facilityFetched = 'error';
      }).then(function(roles) {
        $scope.roles = roles;
        $scope.facilityFetched = true;
        $scope.$apply();
      })
    } else {
      $scope.facility = null;
      $scope.$apply();
    }
  }

  $scope.$watch('user.currentUser', function(newVal, oldVal) {
    if ($scope.user.currentUser) {
      $scope.getFacility();
    }
  }, true);

  $scope.toggleData = function(data) {
    $scope.edit.toggle[data] = $scope.edit.toggle[data] ? false : true;
  }

  $scope.updateFacility = function(type) {
    $scope.facility.set(type, $scope.editFacility[type])
    $scope.facility.save().then(function(value) {
      $scope.edit.toggle[type] = false;
      $scope.alerts.info = "Facility has been updated."
      $scope.$apply();
    }, function(error) {
      $scope.alerts.error = error.message
      $scope.$apply();
    })
  }

  $scope.unitNames = function(facility) {
    if (facility) {
      return _.pluck(facility.unitAttributes, "unitName")
    }
  }

  $scope.createUnit = function() {
    var Unit = Parse.Object.extend("Unit");
    var unit = new Unit();
    unit.set("name", $scope.newUnit.name)
    unit.set("shifTimes", $scope.newUnit.shifTimes)
    unit.set("varianceReasons", $scope.newUnit.varianceReasons)
    unit.set("maxCensus", $scope.newUnit.maxCensus)
    unit.set("facility", $scope.facility)

    unit.save(null, {
      success: function(unit) {
        debugger
      },
      error: function(unit) {
        debugger
      }
    });
  }


}]);
