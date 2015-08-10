app.factory('FlashMessage', ['$rootScope', '$timeout', function($rootScope, $timeout) {
  $rootScope.alerts = {}

  return {
    clear: function() {
      $rootScope.alerts = {};
    },
    show: function(message, success) {
      if (success) {
        $rootScope.alerts.info = message
        $rootScope.alerts.error = ""
      } else {
        $rootScope.alerts.error = message
        $rootScope.alerts.info = ""
      }
      $timeout(function() {
        $rootScope.alerts = {}
      }, 3000);
      return message;
    }
  };
}]);
