describe('sessionCtrl', function() {
  beforeEach(module('app'));

  var $controller;

  beforeEach(inject(function(_$controller_, _$rootScope_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));

  describe('afterSuccessSignIn', function() {
    beforeEach(function() {
      $scope = {};
      $rootScope.alerts = {}
      var controller = $controller('sessionCtrl', {
        $scope: $scope,
        $rootScope: $rootScope
      });
      $scope.afterSuccessSignIn('John');
    })
    it('sets valid notifications', function() {
      expect($rootScope.alerts.info).toEqual("You have been signed in as John");
    })
    it('clears error notifications', function() {
      expect($rootScope.alerts.error).toEqual("");
    })
    it('hides spinner', function() {
      expect($scope.disabledButton).toEqual(false)
    })
  });
});
