// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('colorgytable', ['ionic', 'colorgytable.controllers', 'ngOpenFB'])

.run(function($ionicPlatform, ngFB) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    console.log('colorgy table starting...');

    ngFB.init({appId: '752440461479659', oauthRedirectURL: 'http://localhost:8100/'});

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
        templateUrl: "views/main.html"
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
        templateUrl: "views/search_course.html"
      }
    }
  });

  $urlRouterProvider.otherwise("/app/main");
})