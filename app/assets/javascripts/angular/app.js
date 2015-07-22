var app;
app = angular.module('app', ['angularSpinner', 'ui.router', 'rails', 'monospaced.elastic', 'ui.bootstrap', 'rt.select2']);
app.config(["$httpProvider", function($httpProvider) {
  var authToken;
  authToken = $("meta[name=\"csrf-token\"]").attr("content");
}]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('users', {
      url: "/users",
      templateUrl: function() {
        if (Parse.User.current()) {
          return 'templates/users.html'
        } else {
          return 'templates/session.html'
        }
      },
      controllerProvider: function() {
        if (Parse.User.current()) {
          return 'usersCtrl'
        } else {
          return 'sessionCtrl'
        }
      }
    })
    .state('index', {
      url: '/',
      templateUrl: function() {
        if (Parse.User.current()) {
          return 'templates/facilities.html'
        } else {
          return 'templates/session.html'
        }
      },
      controllerProvider: function() {
        if (Parse.User.current()) {
          return 'facilitiesCtrl'
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
