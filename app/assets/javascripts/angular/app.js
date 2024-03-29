var app;
app = angular.module('app', ['angularSpinner', 'ui.router', 'rails', 'ngMessages', 'monospaced.elastic', 'ui.bootstrap', 'rt.select2', "xeditable", 'angular.filter']);
app.config(["$httpProvider", function($httpProvider) {
  var authToken;
  authToken = $("meta[name=\"csrf-token\"]").attr("content");
}]);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
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
    }).state('facility', {
      url: '/facility',
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
    }).state('facilities', {
      url: "/facilities",
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
    }).state('units', {
      url: "/units/:unitId",
      templateUrl: function() {
        if (Parse.User.current()) {
          return 'templates/unit.html'
        } else {
          return 'templates/session.html'
        }
      },
      controllerProvider: function() {
        if (Parse.User.current()) {
          return 'unitCtrl'
        } else {
          return 'sessionCtrl'
        }
      }
    }).state('stats', {
      url: "/stats",
      templateUrl: function() {
        if (Parse.User.current()) {
          return 'templates/stats.html'
        } else {
          return 'templates/session.html'
        }
      },
      controllerProvider: function() {
        if (Parse.User.current()) {
          return 'statsCtrl'
        } else {
          return 'sessionCtrl'
        }
      }
    })
}])

app.config(['$provide', function($provide) {
 $provide.decorator('$state', ['$delegate', function($delegate, $stateParams) {
    $delegate.forceReload = function() {
      return $delegate.go($delegate.current, $stateParams, {
        reload: true,
        inherit: false,
        notify: true
      });
    };
    return $delegate;
  }]);
}]);
