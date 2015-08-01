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
  })
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "templates/home.html",
          controller: 'HomeTabCtrl'
        }
      }
    })
    .state('tabs.facts', {
      url: "/facts",
      views: {
        'home-tab': {
          templateUrl: "templates/facts.html"
        }
      }
    })
    .state('tabs.facts2', {
      url: "/facts2",
      views: {
        'home-tab': {
          templateUrl: "templates/facts2.html"
        }
      }
    })
    .state('tabs.about', {
      url: "/about",
      views: {
        'about-tab': {
          templateUrl: "templates/about.html"
        }
      }
    })
    .state('tabs.navstack', {
      url: "/navstack",
      views: {
        'about-tab': {
          templateUrl: "templates/nav-stack.html"
        }
      }
    })
    .state('tabs.main', {
      url: "/about",
      views: {
        'contact-tab': {
          templateUrl: "templates/main.html",
          controller: 'MainCtrl'
        }
      }
    });


   $urlRouterProvider.otherwise("/tab/home");
})
.controller('HomeTabCtrl', function($scope) {
  console.log('HomeTabCtrl');
});
