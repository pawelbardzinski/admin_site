angular.module('app').controller('facilityCtrl', ['$scope', '$filter', function($scope, $filter) {

  $scope.newFacility = {
    notifications: true
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
        return query.find({})
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
        $scope.facilityFetched = true;
        $scope.$apply();
      }, function(units, error) {
        $scope.facilityFetched = 'error';
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


}]);
