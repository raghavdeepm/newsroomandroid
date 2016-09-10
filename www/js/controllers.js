angular.module('starter.controllers', [])

.controller('HomeCtrl', function($state) {
  if (localStorage.getItem('getstarted') != "getstarted") {
    $state.go('getstarted');
  } else {
    $state.go('app.newslist', {
      'category': 'topstories'
    });
  }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  localStorage.setItem('getstarted', 'getstarted');
  $scope.toggleMenu = function() {
    $(".sideMenu").toggle('fast');
    $(".menuBackground").toggle("slide");
  };

  $scope.showSubMenu = function() {
    $(".subMenu").slideToggle();
    $(".newsMenu").toggleClass('orange');
    $(".newsMenu .icon").toggleClass('ion-chevron-down');
    $(".newsMenu .icon").toggleClass('ion-chevron-up');
  };
})

.controller('NewsListCtrl', function($scope, $http, $rootScope, $sce, $stateParams) {
  var page = 2;
  $scope.loadMoreData = true;
  $rootScope.allNews = [];
  $rootScope.newsType = 'NEWS ROOM';
  if ($stateParams.category == "topstories") {
    $rootScope.newsType = 'NEWS ROOM';
    $scope.category = 'topstory';
  } else if ($stateParams.category == "featured") {
    $rootScope.newsType = 'Featured';
    $scope.category = 'features';
  } else if ($stateParams.category == "watch") {
    $rootScope.newsType = 'Watch';
    $scope.category = 'uncategorized';
  } else if ($stateParams.category == "crime") {
    $rootScope.newsType = 'Crime';
    $scope.category = 'crime';
  } else if ($stateParams.category == "politics") {
    $rootScope.newsType = 'Politics';
    $scope.category = 'politics';
  } else if ($stateParams.category == "business") {
    $rootScope.newsType = 'Business';
    $scope.category = 'business';
  } else if ($stateParams.category == "entertainment") {
    $rootScope.newsType = 'Entertainment';
    $scope.category = 'entertainment';
  } else if ($stateParams.category == "sports") {
    $rootScope.newsType = 'Sports';
    $scope.category = 'sports';
  }

  $scope.toggleMenu = function() {
    $(".sideMenu").toggle('fast');
    $(".menuBackground").toggle("slide");
  };
  var _headers = {
    method: 'GET',
    url: 'http://newsroom.gy/api/get_category_posts/?slug=' + $scope.category,
    data: {},
    headers: {
      'Content-Type': 'application/json'
    }
  };
  $http(_headers).success(function(data, status, headers, config) {
    if (data.status === "ok") {
      $scope.news = data.posts;
      $scope.totalPage = data.pages;
      $rootScope.allNews = data.posts;

      for (var i = 0; i < data.posts.length; i++) {
        $scope.news[i].config = [];
        if (data.posts[i].attachments.length != 0) {
          for (var j = 0; j < data.posts[i].attachments.length; j++) {
            if (data.posts[i].attachments[j].mime_type == "video/mp4") {
              $scope.news[i].config = {
                sources: [{
                  src: $sce.trustAsResourceUrl(data.posts[i].attachments[j].url),
                  type: "video/mp4"
                }],
              };
            }
          }
        }
      }
      console.log($scope.news);
      $scope.loadMoreData = false;
    } else
      $scope.news = "No Data";
  }).error(function(data, status, headers, config) {
    console.log("error", data);
  });

  $scope.loadMore = function() {
    if (page >= $scope.totalPage) {
      $scope.loadMoreData = true;
    }
    var _headers = {
      method: 'GET',
      url: 'http://newsroom.gy/api/get_category_posts/?slug=' + $scope.category + '&page=' + page,
      data: {},
      headers: {
        'Content-Type': 'application/json'
      }
    };
    $http(_headers).success(function(data, status, headers, config) {
      page = page + 1;
      $scope.$broadcast('scroll.infiniteScrollComplete');
      if (data.status === "ok") {
        var i, k = $scope.news.length;
        $scope.news = $scope.news.concat(data.posts);
        $rootScope.allNews = $rootScope.allNews.concat(data.posts);

        for (i = 0; i < data.posts.length; i++, k++) {
          $scope.news[k].config = [];
          if (data.posts[i].attachments.length != 0) {
            for (var j = 0; j < data.posts[i].attachments.length; j++) {
              if (data.posts[i].attachments[j].mime_type == "video/mp4") {
                $scope.news[k].config = {
                  sources: [{
                    src: $sce.trustAsResourceUrl(data.posts[i].attachments[j].url),
                    type: "video/mp4"
                  }],
                };
              }
            }
          }
        }
        console.log($scope.news);
      } else
        $scope.news = "No Data";
    }).error(function(data, status, headers, config) {
      console.log("error", data);
    });
  }
})

.controller('NewsDetailCtrl', function($scope, $rootScope, $stateParams, $cordovaSocialSharing) {
  $scope.news = $rootScope.allNews[$stateParams.newsId];
  $scope.newsType = $rootScope.newsType;

  $scope.shareWith = function(title, url) {
    $cordovaSocialSharing
      .share(title + " : ", title, '', url) // Share via native share sheet
      .then(function(result) {
        // Success!
      }, function(err) {
        // An error occured. Show a message to the user
      });

  }
})

.controller('ContactUsCtrl', function($scope) {});
