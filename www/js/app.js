// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', "ngSanitize", "com.2fdevs.videogular", "com.2fdevs.videogular.plugins.controls", "com.2fdevs.videogular.plugins.buffering", "com.2fdevs.videogular.plugins.overlayplay"])

.run(function($ionicPlatform, $cordovaPushV5, $rootScope, $http) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    var options = {
      android: {
        senderID: "1047204224105"
      },
    };

    // initialize
    $cordovaPushV5.initialize(options).then(function() {
      // start listening for new notifications
      $cordovaPushV5.onNotification();
      // start listening for errors
      $cordovaPushV5.onError();

      // register to get registrationId
      $cordovaPushV5.register().then(function(datas) {
        // `data.registrationId` save it somewhere;
        if (localStorage.getItem('devicetoken') != "insert") {
          //   localStorage.setItem('devicetoken', "insert");
          var param_headers = {
            'Content-Type': 'application/json'
          };
          var _data = {
            action: 'my_action',
            device: "android",
            devicetoken: datas,
          }
          var _headers = {
            method: 'POST',
            url: 'http://newsroom.gy/wp-admin/admin-ajax.php',
            params: _data,
            headers: param_headers
          };
          $http(_headers).success(function(data, status, headers, config) {
            console.log(data);
          }).error(function(data, status, headers, config) {
            console.log(data);
          });
        }
      })
    });

    // triggered every time notification received
    $rootScope.$on('$cordovaPushV5:notificationReceived', function(event, data) {
      // data.message,
      // data.title,
      // data.count,
      // data.sound,
      // data.image,
      // data.additionalData
    });

    // triggered every time error occurs
    $rootScope.$on('$cordovaPushV5:errorOcurred', function(event, e) {
      // e.message
    });
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/home',
    controller: 'HomeCtrl'
  })

  .state('getstarted', {
    url: '/getstarted',
    templateUrl: 'templates/getstarted.html',
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })


  .state('app.newslist', {
    url: '/newslist/:category',
    views: {
      'menuContent': {
        templateUrl: 'templates/newslist.html'
      }
    }
  })

  .state('app.newsdetail', {
    url: '/newsdetail/:newsId',
    views: {
      'menuContent': {
        templateUrl: 'templates/newsdetail.html'
      }
    }
  })

  .state('app.contactus', {
    url: '/contactus',
    views: {
      'menuContent': {
        templateUrl: 'templates/contactus.html'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');

});
