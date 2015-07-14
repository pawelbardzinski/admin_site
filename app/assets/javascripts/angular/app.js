var app;
app = angular.module('app', ['angularSpinner', 'ngRoute', 'rails']);
app.config(["$httpProvider", function($httpProvider) {
  var authToken;
  authToken = $("meta[name=\"csrf-token\"]").attr("content");
  return $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = authToken;
}]);
app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.when('/', {
    templateUrl: '/templates/index.html'
  })
  $routeProvider.when('/users', {
    templateUrl: '/templates/users.html',
    controller: 'usersCtrl' 
  })
  .otherwise({
    redirectTo: '/'
  })
}]);
