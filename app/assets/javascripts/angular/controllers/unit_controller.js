angular.module('app').controller('unitCtrl', ['$scope', '$filter', '$stateParams', function($scope, $filter, $stateParams) {

  $scope.unit = null;
  $scope.facility = Parse.User.current().get('facility')
  $scope.edit = {
    toggle: []
  }
  $scope.editStaffShifts = {
    shift: {}
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
        $scope.shiftTimes = unit.get('shiftTimes')
        return staffQuery.find({})
      }, function(error) {}).then(function(staffShifts) {
        $scope.staffShifts = staffShifts
        _.each($scope.staffShifts, function(staffShift) {
          $scope.editStaffShifts.shift[staffShift.id] = staffShift.get('index')
        })
        $scope.$apply();
      })
    }
  }

  $scope.updateUnit = function(data, name) {
    if (data == "shiftTimes") {
      $scope.unit.set("shiftTimes", $scope.editUnit.shiftTimes.map(Number))
      $scope.toggleData('shiftTimes')
    } else if (data == "varianceReasons") {
      $scope.unit.set("varianceReasons", $scope.editUnit.varianceReasons)
      $scope.toggleData('varianceReasons')
    } else if (data == "name") {
      if (name == '') {
        return "Unit name can't be blank.";
      } else if (name == $scope.unit.get('name')) {
        return "Unit name is the same as previous."
      } else {
        $scope.unit.set("name", name)
      }
    }
    $scope.unit.save().then(function(unit) {
      if (data == "shiftTimes") {
        $scope.shiftTimes = $scope.editUnit.shiftTimes
      }
      $scope.alerts.info = "Unit has been updated."
      $scope.$apply();
    }, function(error) {
      $scope.alerts.info = error.message
      $scope.$apply();
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

  $scope.updateStaffSifts = function() {
    _.each($scope.staffShifts, function(staffShift) {
      staffShift.set("index", $scope.editStaffShifts.shift[staffShift.id])
    })
    Parse.Object.saveAll($scope.staffShifts).then(function(staffShifts) {
      console.log(staffShifts)
    }, function(error) {
      console.log(error)
    })
  }

  $scope.toggleData = function(data) {
    $scope.edit.toggle[data] = $scope.edit.toggle[data] ? false : true;
  }

  $scope.dayOfWeekAsString = function(dayIndex) {
    return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][dayIndex];
  }

  $scope.dateParse = function(date) {
    return $filter('date')(parseInt(date) * 1000, 'HH:mm', 'Z')
  }

  $scope.getUnit();
}]);
