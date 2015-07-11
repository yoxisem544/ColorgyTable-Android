angular.module('colorgytable.controllers', [])

.controller('MenuCtrl', function($scope, $ionicModal, $http) {

  alert("something" + window.localStorage['isLogin']);
  // detect if user is logged in.
  if (!window.localStorage['isLogin']) {
    console.log("user login state: not yet logged in.");
    $ionicModal.fromTemplateUrl('views/login.html', {
      scope: $scope,
      backdropClickToClose: false
    }).then(function(modal) {
      $scope.modal = modal;
      // if modal is ready to show, show it.
      $scope.modal.show();
      // $scope.connecting_fb = true;
    });
  } else {
    console.log("user login state: user logged in.");
  }

  // test course
  $scope.coursedata = ['1', '1', '2'];

  // this region is login logic....
  $scope.logindata = {};
  $scope.closeButton = function() {
    console.log("close button clicked..");
    $scope.modal.hide();
  };

  $scope.doLogin = function() {
    console.log('do login');
    console.log('u: ' + $scope.logindata.username + ', p: ' + $scope.logindata.password);
  };

  // fb region
  $scope.fbLogin = function() {

    // lock button
    $scope.connecting_fb = true;

    // cordova fb login test
    if (!window.cordova) {
      // this part seems to be users that haven't install fb on their device.
      var appId = prompt("Enter FB Application ID", "");
      facebookConnectPlugin.browserInit(appId);
    }
    facebookConnectPlugin.login( ["email"], 
      function (response) { 
        // success
        var token = response.authResponse.accessToken;
        var postData = {
          grant_type: "password",
          // 應用程式ID application id, in colorgy server
          client_id: "ad2d3492de7f83f0708b5b1db0ac7041f9179f78a168171013a4458959085ba4",
          client_secret: "d9de77450d6365ca8bd6717bbf8502dfb4a088e50962258d5d94e7f7211596a3",
          username: "facebook:access_token",
          password: token,
          scope: "public account offline_access"
        };
        $scope.postAndGetAccessToken(postData);
      },
      function (response) { 
        // fail
        // alert(JSON.stringify(response));
        alert("error login to fb");
        // unlock button
        $scope.connecting_fb = false;
      });
                
    // ngFB.login({scope: 'email'}).then(
    //     function (response) {
    //         if (response.status === 'connected') {
    //             console.log('Facebook login succeeded');
    //             openFB.getLoginStatus(function(status) {
    //               console.log("callback..");
    //               console.log(status);
    //               $scope.logindata.username = status.authResponse.accessToken;
    //             });
    //             $scope.closeLogin();
    //         } else {
    //             alert('Facebook login failed');
    //         }
    //     });
  };

  $scope.postAndGetAccessToken = function(postData) {
    // get access token.
    $http.post('https://colorgy.io/oauth/token', postData)
    .success(function(data, status, headers, config) {
      // store access token
      alert("ok post");
      window.localStorage['ColorgyAccessToken'] = data.access_token;
      window.localStorage['ColorgyRefreshToken'] = data.refresh_token;
      // get personally information
      var token = window.localStorage['ColorgyAccessToken'];
      $scope.userSuccessfullyLoginToColorgyWithToken(token);
    })
    .error(function(data, status, headers, config) {
      alert("communicate with colorgy failed....");
      // unlock button
      $scope.connecting_fb = false;
    });
  };

  $scope.userSuccessfullyLoginToColorgyWithToken = function(access_token) {
    // get personally information
    var token = access_token;
    var url = "https://colorgy.io/api/v1/me?access_token=" + token;
    console.log("url is " + url);
    $http.get(url)
    .success(function(data, status, headers, config) {
      window.localStorage['userName'] = data.name;
      window.localStorage['userSchool'] = data.organization;
      window.localStorage['isLogin'] = true;
      window.localStorage['loginType'] = "fb";
      // login ok.
      alert("OK");
      $scope.modal.hide();
    })
    .error(function(data, status, headers, config) {
      alert("FK");
      // unlock button
      $scope.connecting_fb = false;
    });
  };

})

.controller('MainCtrl', function($scope, $http) {

  $scope.logout = function() {
    alert("main");
    alert(window.localStorage['isLogin']);
    window.localStorage.removeItem('userName');
    window.localStorage.removeItem('userSchool');
    window.localStorage.removeItem('isLogin');
    window.localStorage.removeItem('loginType');
    alert(window.localStorage['isLogin']);
  };

  $scope.download_course = function() {
    var front_url = "https://colorgy.io:443/api/";
    var middle_url = "/courses.json?per_page=1500&&&&&access_token=";
    var token = window.localStorage["ColorgyAccessToken"];
    var url = front_url + 'ntust' + middle_url + token;
    alert(JSON.stringify(url));
    $http.get(url)
    .success(function(data, status, headers, config) {
      alert("ok getting course");
      window.localStorage['CourseData'] = JSON.stringify(data);
      alert(data.length);
      alert(window.localStorage['CourseData'].length);
    })
    .error(function(data, status, headers, config) {
      alert("fail get course");
    });
  };

  $scope.chechLength = function() {
    var course = window.localStorage['CourseData'];
    alert(course.length);
  };
})

.controller('SearchCourseCtrl', function($scope) {
  var data = window.localStorage["CourseData"];
  // alert(data);
  var course = JSON.parse(data);
  alert(course.length);
  // $scope.data = course;
});