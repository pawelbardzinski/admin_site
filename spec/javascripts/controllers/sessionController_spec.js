describe('sessionCtrl', function() {
  beforeEach(module('app'));

  var $controller;

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  describe('afterSuccessSignIn', function() {
    beforeEach(function() {
      $scope = {};
      $scope.alerts = {}
      var controller = $controller('sessionCtrl', {
        $scope: $scope
      });
      $scope.afterSuccessSignIn('John');
    })
    it('sets valid notifications', function() {
      expect($scope.alerts.info).toEqual("You have been signed in as John");
    })
    it('clears error notifications', function() {
      expect($scope.alerts.error).toEqual("");
    })
    it('hides spinner', function() {
      expect($scope.disabledButton).toEqual(false)
    })
  });
});
