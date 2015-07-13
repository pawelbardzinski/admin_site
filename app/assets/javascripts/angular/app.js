// var app;
// app = angular.module('app', ['angularSpinner', 'ngRoute']);
// // app.config(["$httpProvider", function($httpProvider) {
//   // var authToken;
//   // authToken = $("meta[name=\"csrf-token\"]").attr("content");
//   // return $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = authToken;
// // }]);
// // app.config(['$httpProvider', function($httpProvider) {
// // var authToken;
// // authToken = $("meta[name=\"csrf-token\"]").attr("content");
// // return $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = authToken;
// // }]);
//
// app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
//   // $locationProvider.html5Mode(true);
//   $routeProvider
//
//   // route for the about page
//   .when('/users', {
//     templateUrl: '../../templates/users.html'
//     // ,controller: 'usersCtrl'
//   })
//   .otherwise('/users', {
//     templateUrl: '../../templates/users.html'
//     // ,controller: 'usersCtrl'
//   })
// }]);
//
// // app.config([
// // '$stateProvider',
// // '$urlRouterProvider',
// // function($stateProvider, $urlRouterProvider) {
// //
// //   $stateProvider
// //     .state('/users', {
// //       url: '/users',
// //       templateUrl: '/users.html',
// //       controller: 'UsersCtrl'
// //     });
// //
// //   $urlRouterProvider.otherwise('users');
// // }]);


var app;
app = angular.module('app', ['angularSpinner', 'ngRoute']);
app.config(["$httpProvider", function($httpProvider) {
  var authToken;
  authToken = $("meta[name=\"csrf-token\"]").attr("content");
  return $httpProvider.defaults.headers.common["X-CSRF-TOKEN"] = authToken;
}]);
app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider.when('/', {
    templateUrl: '/templates/home.html'
  })
  $routeProvider.when('/users', {
    templateUrl: '/templates/users.html'
  })
  .otherwise({
    redirectTo: '/'
  })
}]);
