angular.module('app').controller('unitCtrl', ['$scope', '$filter', '$stateParams', 'FlashMessage', function($scope, $filter, $stateParams, FlashMessage) {

  $scope.unit = null;
  $scope.facility = Parse.User.current().get('facility')
  $scope.edit = {
    toggle: []
  }

  $scope.dayOfTheWeeks = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  $scope.editStaffShifts = {
    selectedDay: 0,
    selectedTime: 1,
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
        $scope.editUnit.shiftTimes = $filter('timestampToHHMMFilter')(unit.get('shiftTimes'))
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
        $scope.editStaffShifts.staffShifts = angular.copy($scope.staffShifts)
        $scope.$apply();
      })
    }
  }

  $scope.updateUnit = function(data, name) {
    if (data == "shiftTimes") {
      var arrayOfTime = _.map($scope.editUnit.shiftTimes, function(time) {
        timeArray = time.split(':');
        hours = timeArray[0];
        minutes = timeArray[1];
        return hours * 3600 + minutes * 60;
      })
      $scope.unit.set("shiftTimes", arrayOfTime);
      $scope.toggleData('shiftTimes');
    } else if (data == "varianceReasons") {
      $scope.unit.set("varianceReasons", $scope.editUnit.varianceReasons);
      $scope.toggleData('varianceReasons');
    } else if (data == "name") {
      if (name == '') {
        return "Unit name can't be blank.";
      } else if (name == $scope.unit.get('name')) {
        return "Unit name is the same as previous.";
      } else {
        $scope.unit.set("name", name);
      }
    }
    $scope.unit.save().then(function(unit) {
      if (data == "shiftTimes") {
        $scope.shiftTimes = unit.get('shiftTimes');
      }
      FlashMessage.show("Unit has been updated.", true)
      $scope.$apply();
    }, function(error) {
      FlashMessage.show(error.message, false)
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
      FlashMessage.show("Unit has been deleted.", true)
      $scope.$apply();
    }, function(error) {
      FlashMessage.show(error.message, false)
      $scope.$apply();
    })
  }

  $scope.toggleData = function(data) {
    $scope.edit.toggle[data] = $scope.edit.toggle[data] ? false : true;
  }

  $scope.dayOfWeekAsString = function(dayIndex) {
    return $scope.daysOfTheWeek[dayIndex];
  }

  $scope.dateParse = function(date) {
    return $filter('date')(parseInt(date) * 1000, 'HH:mm', 'Z')
  }

  $scope.updateGrid = function() {
    debugger
    // value = parseInt(data)
    // if (isNaN(value)) {
    //   return "It's not a number";
    // }
    // staffShift.get('grids')[timeIndex][index] = value
    // staffShift.save().then(function(staffShift) {
    //   FlashMessage.show("Grid has been updated.", true)
    //   $scope.$apply();
    // }, function(error) {
    //   FlashMessage.show(error.message, false)
    //   $scope.$apply();
    // })
  }

  $scope.shiftTimeParser = function(shiftTime){
    return $filter('timestampToHHMMFilter')([shiftTime]).join()
  }

  $scope.getUnit();
}]);
