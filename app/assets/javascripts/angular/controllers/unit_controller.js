angular.module('app').controller('unitCtrl', ['$scope', '$filter', '$stateParams', 'FlashMessage', function ($scope, $filter, $stateParams, FlashMessage) {

    $scope.unit = null;
    $scope.facility = Parse.User.current().get('facility')
    $scope.edit = {
        toggle: []
    }

    $scope.dayOfTheWeeks = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    $scope.editStaffShifts = {
        selectedDay: 0,
        selectedTime: 1,
        staffShifts: {},
        bigTotalItems: 10,
        currentPage: 0,
        currentLimit: 10
    }

    findActualStaffShifts = function () {
        return $filter('staffShiftFilter')($scope.editStaffShifts.staffShifts,
            $scope.editStaffShifts.selectedDay, $scope.editStaffShifts.selectedTime)
    }

    $scope.rangeOfStaffShifts = function () {
        return _.range($scope.editStaffShifts.bigTotalItems / 10);
    }

    $scope.rangeLimit = function (value) {
        return value < $scope.editStaffShifts.bigTotalItems ? value : $scope.editStaffShifts.bigTotalItems
    }

    $scope.splitStaffShifts = function (value) {
        values = angular.copy(value).splice($scope.editStaffShifts.currentPage * 10, 10);
        $scope.editStaffShifts.currentLimit = values.length;
        return values
    }

    $scope.setPage = function (pageNo) {
        $scope.editStaffShifts.currentPage = pageNo;
    };


    $scope.pageChanged = function () {
        $log.log('Page changed to: ' + $scope.editStaffShifts.currentPage);
    };

    $scope.countRange = function () {
        staffShifts = findActualStaffShifts()
        _.each(staffShifts, function (staffShift) {
            _.each(staffShift.get('grids'), function (grid) {
                if ($scope.editStaffShifts.bigTotalItems < grid.length) {
                    $scope.editStaffShifts.bigTotalItems = grid.length;
                }
            })
        })
    }

    $scope.getUnit = function () {
        var Unit = Parse.Object.extend("Unit");
        var query = new Parse.Query("Unit");
        if ($scope.facility) {
            query.notEqualTo("archived", true);
            query.equalTo("facility", $scope.facility);
            query.include('facility');
            query.get($stateParams.unitId).then(function (unit) {
                $scope.unit = unit;
                $scope.editUnit = angular.copy(unit.attributes)
                $scope.editUnit.shiftTimes = $filter('timestampToHHMMFilter')(unit.get('shiftTimes'))
                var StaffShifts = Parse.Object.extend("StaffShift");
                var staffQuery = new Parse.Query("StaffShift");
                staffQuery.equalTo("unit", $scope.unit);
                $scope.shiftTimes = unit.get('shiftTimes')
                return staffQuery.find({})
            }, function (error) {
            }).then(function (staffShifts) {
                $scope.staffShifts = staffShifts
                _.each($scope.staffShifts, function (staffShift) {
                    $scope.editStaffShifts.staffShifts[staffShift.id] = angular.copy(staffShift)
                })
                $scope.countRange()
                $scope.$apply();
            })
        }
    };

    $scope.updateShiftTimes = function() {
        $scope.toggleData('shiftTimes');

        // Parse the shift times from the list of friendly times
        var newShiftTimes = _.filter(_.map($scope.editUnit.shiftTimes, function (timeString) {
            var time = parseTime(timeString);
            return time != null ? shiftTimeFromDate(time) : -1;
        }), function(shiftTime) {
            return shiftTime != -1;
        });

        var info = {
            "unitId": $scope.unit.id,
            "shiftTimes": newShiftTimes
        };

        Parse.Cloud.run('updateUnit', info, {
            success: function() {
                $scope.shiftTimes = newShiftTimes;
                FlashMessage.show("Shift times has been updated.", true);
                $scope.$apply();
            },
            error: function(error) {
                console.log(error);
                FlashMessage.show(error.message, false);
                $scope.$apply();
            }
        });
    };

    $scope.updateUnit = function (data, name) {
        if (data == "varianceReasons") {
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
        $scope.unit.save().then(function (unit) {
            FlashMessage.show("Unit has been updated.", true)
            $scope.$apply();
        }, function (error) {
            FlashMessage.show(error.message, false)
            $scope.$apply();
        })
    }

    $scope.destroyUnit = function (id) {
        unit = _.detect($scope.units, function (value) {
            if (value.id == id) {
                return value
            }
        })
        unit.set("archived", true)
        unit.save().then(function (unitResponse) {
            $scope.units.splice($scope.units.indexOf(unit), 1);
            FlashMessage.show("Unit has been deleted.", true)
            $scope.$apply();
        }, function (error) {
            FlashMessage.show(error.message, false)
            $scope.$apply();
        })
    }

    $scope.toggleData = function (data) {
        $scope.edit.toggle[data] = $scope.edit.toggle[data] ? false : true;
    }

    $scope.dayOfWeekAsString = function (dayIndex) {
        return $scope.daysOfTheWeek[dayIndex];
    }

    $scope.dateParse = function (date) {
        return $filter('date')(parseInt(date) * 1000, 'HH:mm', 'Z')
    }

    $scope.updateGrid = function () {
        $scope.editStaffShifts.disabled = true;
        staffShiftsToUpdate = findActualStaffShifts();
        Parse.Object.saveAll(staffShiftsToUpdate).then(function (staffShift) {
            FlashMessage.show("Grid has been updated.", true)
            $scope.editStaffShifts.disabled = false;
            $scope.$apply();
        }, function (error) {
            FlashMessage.show(error.message, false)
            $scope.editStaffShifts.disabled = false;
            $scope.$apply();
        })
    }

    $scope.shiftTimeParser = function (shiftTime) {
        return $filter('timestampToHHMMFilter')([shiftTime]).join()
    }

    // Taken from http://stackoverflow.com/a/2188651/1917313
    function parseTime(timeString) {
        if (timeString == '') return null;

        var time = timeString.match(/(\d+)(:(\d\d))?\s*(p?)/i);
        if (time == null) return null;

        var hours = parseInt(time[1],10);
        if (hours == 12 && !time[4]) {
            hours = 0;
        }
        else {
            hours += (hours < 12 && time[4])? 12 : 0;
        }
        var d = new Date();
        d.setHours(hours);
        d.setMinutes(parseInt(time[3],10) || 0);
        d.setSeconds(0, 0);
        return d;
    }

    function shiftTimeFromDate(date) {
        return date.getHours() * 60 * 60 + date.getMinutes() * 60;
    }

    $scope.getUnit();
}]);
