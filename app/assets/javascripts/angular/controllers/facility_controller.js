angular.module('app').controller('FacilityCtrl', ['$scope', function($scope) {

  //   var username = "test@test.com"
  //   var password = "lol1234"
  // var query = new Parse.Query(User);
  // user.get('oahPf3rd1p')

  // user.fetch({
  // success: function(myObject) {
  //   console.log(myObject._serverData.results)
  //   // The object was refreshed successfully.
  // },
  // error: function(myObject, error) {
  // debugger
  //   // The object was not refreshed successfully.
  //   // error is a Parse.Error with an error code and message.
  // }
  // });
  // test@test.com

  $scope.getFacility = function() {

    var Facility = Parse.Object.extend("Facility");
    var facility = new Facility();

    facility.fetch({
      success: function(myObject) {
        console.log(myObject._serverData.results)
          // The object was refreshed successfully.
      },
      error: function(myObject, error) {
        // The object was not refreshed successfully.
        // error is a Parse.Error with an error code and message.
      }
    });
  }


}]);
