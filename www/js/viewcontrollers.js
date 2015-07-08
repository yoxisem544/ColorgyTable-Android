angular.module('colorgytable.controllers', ['ngOpenFB'])

.controller('MenuCtrl', function($scope, $ionicModal, ngFB, $http) {

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
    });
  } else {
    console.log("user login state: user logged in.");
  }

  // test api
  // ngFB.api({
  //       path: '/me',
  //       params: {fields: 'id,name'}
  //   }).then(
  //       function (user) {
  //           $scope.user = user;
  //       },
  //       function (error) {
  //           alert('Facebook error: ' + error.error_description);
  //       });

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

    // cordova fb login test
    if (!window.cordova) {
      var appId = prompt("Enter FB Application ID", "");
      facebookConnectPlugin.browserInit(appId);
    }
    facebookConnectPlugin.login( ["email"], 
      function (response) { 
        // success
        alert(JSON.stringify(response)) 
        var token = response.authResponse.accessToken;
        alert(token);
        var postData = {
          grant_type: "password",
          // 應用程式ID application id, in colorgy server
          client_id: "ad2d3492de7f83f0708b5b1db0ac7041f9179f78a168171013a4458959085ba4",
          client_secret: "d9de77450d6365ca8bd6717bbf8502dfb4a088e50962258d5d94e7f7211596a3",
          username: "facebook:access_token",
          password: token,
          scope: "public account offline_access"
        };
        $http.post('https://colorgy.io/oauth/token', postData)
        .success(function(data, status, headers, config) {
          alert("success post");
          alert(data);
        })
        .error(function(data, status, headers, config) {
          alert("fuck post");
        });
      },
      function (response) { 
        // fail
        alert(JSON.stringify(response)) 
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

})