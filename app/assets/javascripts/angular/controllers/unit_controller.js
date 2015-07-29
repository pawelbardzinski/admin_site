angular.module('app').controller('unitCtrl', ['$scope', '$filter', '$stateParams', function($scope, $filter, $stateParams) {

  $scope.unit = null;
  $scope.facility = Parse.User.current().get('facility')
  $scope.edit = {
    toggle: []
  }

  $scope.getUnit = function() {
    var Unit = Parse.Object.extend("Unit");
    var query = new Parse.Query("Unit");
    if ($scope.facility) {
      query.notEqualTo("archived", true);
      query.equalTo("facility", $scope.facility);
      query.include('facility');
      query.get($stateParams.unitId).then(function(unit) {
        $scope.unit = unit;
        $scope.editUnit = angular.copy(unit.attributes)
        var StaffShifts = Parse.Object.extend("StaffShift");
        var staffQuery = new Parse.Query("StaffShift");
        staffQuery.equalTo("unit", $scope.unit);
        return staffQuery.find({})
      }, function(error) {}).then(function(staffShifts) {
        $scope.staffShifts = staffShifts
        $scope.$apply();
      })
    }
  }

  $scope.updateUnit = function(data) {
    if (data == "shiftTimes") {
      $scope.unit.set("shiftTimes", $scope.editUnit.shiftTimes)
    }
    $scope.unit.save().then(function(unit) {
      if (data == "shiftTimes") {
        $scope.shiftTimes = $scope.editUnit.shiftTimes
      }
      $scope.alerts.info = "Unit has been updated."
    }, function(error) {
      $scope.alerts.info = error.message
    })
  }

  $scope.destroyUnit = function(id) {
    unit = _.detect($scope.units, function(value) {
      if (value.id == id) {
        return value
      }
    })
    unit.set("archived", true)
    unit.save().then(function(unitResponse) {
      $scope.units.splice($scope.units.indexOf(unit), 1);
      $scope.alerts.info = "Unit has been deleted."
      $scope.$apply();
    }, function(error) {
      $scope.alerts.info = error.message
      $scope.$apply();
    })
  }

  $scope.toggleData = function(data) {
    $scope.edit.toggle[data] = $scope.edit.toggle[data] ? false : true;
  }

  $scope.getUnit();
}]);