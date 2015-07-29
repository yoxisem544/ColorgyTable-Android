// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('colorgytable', ['ionic', 'colorgytable.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    console.log('colorgy table starting...');

    // fb redirect url, colorgy oauth here neson, pokai see here.
    // ngFB.init({appId: '752440461479659'});
    // ngFB.init({appId: '752440461479659', oauthRedirectURL: 'http://localhost:8100/'});
    // openFB.getLoginStatus(function(status) {
    //   console.log("callback..");
    //   console.log(status);
    // });

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


// config routings
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: "views/menu.html",
    controller: 'MenuCtrl'
  })
  .state('app.main', {
    url: '/main',
    views: {
      'menuContent': {
        templateUrl: "views/main.html",
        controller: "MainCtrl"
      }
    }
  })
  .state('app.timetable', {
    url: '/timetable',
    views: {
      'menuContent': {
        templateUrl: "views/timetable.html"
      }
    }
  })
  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: "views/profile.html"
      }
    }
  })
  .state('app.search_course', {
    url: '/search_course',
    views: {
      'menuContent': {
        templateUrl: "views/search_course.html",
        controller: "SearchCourseCtrl"
      }
    }
  });

  $urlRouterProvider.otherwise("/app/main");
})