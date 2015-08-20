angular.module('app').controller('facilityCtrl', ['$scope', '$filter', 'FlashMessage', function($scope, $filter, FlashMessage) {
  $scope.newFacility = {
    notifications: true
  }
  $scope.newUnit = {
    varianceReasons: ["Pending Admissions", "Pending Discharges", "1:1 Suicide Precautions", "1:1 Fall Risk", "Acuity High/Low - Specify", "Staffing Need Not Met - Specify", "Other"],
    maxCensus: 35,
    rolesToSet: ['Chief Nursing Officer', 'House Supervisor', 'Staffing Coordinator'],
    staffShiftsToSet: ['SEC', 'Charge', 'Nurse', 'NA'],
    shiftTimes: [25200, 54000, 68400, 82800],
  }
  $scope.edit = {
    toggle: []
  }
  $scope.facility = null;

  var defaultGrid = function() {
    var grids = []
    _(4).times(function(n) {
      var grid = []
      _(35).times(function(n) {
        grid.push(0)
      })
      grids.push(grid)
    })
    return grids
  }

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
        query.equalTo("facility", $scope.facility);
        query.notEqualTo("archived", true);
        return query.find({})
      }, function(error) {
        $scope.facilitiyFetched = 'error';
      }).then(function(paramsUnits) {
        $scope.units = paramsUnits;
        var roleQuery = new Parse.Query(Parse.Role);
        roleQuery.include("info");
        roleQuery.equalTo("facility", $scope.facility);
        return roleQuery.find({})
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
      FlashMessage.show("Facility has been updated.", true)
      $scope.$apply();
    }, function(error) {
      FlashMessage.show(error.message, false)
      $scope.$apply();
    })
  }

  $scope.unitNames = function(facility) {
    if (facility) {
      return _.pluck(facility.unitAttributes, "unitName")
    }
  }

  $scope.createUnit = function() {
    var rolesNames = $filter('filter')($scope.roles, function(object) {
      var roleInfoName = object.get('info') && object.get('info').get("name")
      if (roleInfoName) {
        if ($scope.newUnit.rolesToSet.indexOf(roleInfoName) > -1) {
          return object.get('name')
        }
      }
    });

    var rolesToUpdate = _.map(rolesNames, function(object) {
      return object.get('name')
    });
    rolesToUpdate.push("admin");
    var Unit = Parse.Object.extend("Unit");
    var unit = new Unit();
    unit.set("name", $scope.newUnit.name)
    unit.set("varianceReasons", $scope.newUnit.varianceReasons)
    unit.set("maxCensus", $scope.newUnit.maxCensus)
    unit.set("facility", $scope.facility)
    unit.set("shiftTimes", $scope.newUnit.shiftTimes)

    var newACL = new Parse.ACL();
    _.each(rolesToUpdate, function(value) {
      newACL.setRoleWriteAccess(value, true);
      newACL.setRoleReadAccess(value, true);
    })
    unit.setACL(newACL)

    unit.save(null, {
      success: function(unit) {
        $scope.newUnit.name = ""
        $scope.units.push(unit);
        $scope.staffShiftsToSave = []
        var StaffShift = Parse.Object.extend("StaffShift");
        _.each($scope.newUnit.staffShiftsToSet, function(title, key) {
          _(7).times(function(indexOfTheDay) {
            var staffShift = new StaffShift();
            staffShift.set("required", true);
            staffShift.set("dayOfTheWeek", indexOfTheDay);
            staffShift.set("title", title);
            staffShift.set("unit", unit);
            staffShift.set("grids", defaultGrid())
            staffShift.set("index", key + 1)
            $scope.staffShiftsToSave.push(staffShift);
          })
        })
        return Parse.Object.saveAll($scope.staffShiftsToSave, function(staffShifts) {
          var unit = staffShifts[0].get('unit')
          var relationship = unit.relation("staffShifts")
          relationship.add(staffShifts);
          unit.save(null, {
            success: function() {
              FlashMessage.show("Unit has been created.", true)
              $scope.$apply();
            }
          })
        });
      },
      error: function(unit) {}
    })
  }


  $scope.updateUnit = function(data, id, unitName) {
    if (data == '') {
      return "Unit name can't be blank.";
    } else if (data == unitName) {
      return "Unit name is the same as previous."
    }
    unit = _.detect($scope.units, function(value) {
      if (value.id == id) {
        return value
      }
    })
    unit.set("name", data)
    unit.save().then(function(unit) {
      FlashMessage.show("Unit has been updated.", true)
    }, function(error) {
      FlashMessage.show(error.message, false)
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
      FlashMessage.show("Unit has been deleted.", false)
      $scope.$apply();
    }, function(error) {
      FlashMessage.show(error.message, false)
      $scope.$apply();
    })
  }
}]);
