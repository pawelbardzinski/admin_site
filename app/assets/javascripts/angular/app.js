var app;
app = angular.module('app', ['angularSpinner', 'ui.router', 'rails']);
app.config(["$httpProvider", function($httpProvider) {
  var authToken;
  authToken = $("meta[name=\"csrf-token\"]").attr("content");
  return $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = authToken;
}]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('users', {
      url: "/users",
      templateUrl: "templates/users.html",
      controller: "usersCtrl"
    })
    .state('index', {
      url: '/',
      templateUrl: function() {
        if (Parse.User.current()) {
          return 'templates/facility.html'
        } else {
          return 'templates/session.html'
        }
      },
      controllerProvider: function() {
        if (Parse.User.current()) {
          return 'facilityCtrl'
        } else {
          return 'sessionCtrl'
        }
      }
    });
})

app.config(function($provide) {
    $provide.decorator('$state', function($delegate, $stateParams) {
        $delegate.forceReload = function() {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });
});
