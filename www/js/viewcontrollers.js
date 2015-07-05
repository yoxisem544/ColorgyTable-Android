angular.module('colorgytable.controllers', [])

.controller('MenuCtrl', function($scope, $ionicModal) {

  // detect if user is logged in.
  if (!window.localStorage['isLogin']) {
    $ionicModal.fromTemplateUrl('views/login.html', {
      scope: $scope,
      backdropClickToClose: false
    }).then(function(modal) {
      $scope.modal = modal;
      // if modal is ready to show, show it.
      $scope.modal.show();
    });
  }

  // this region is login logic....
  $scope.closeButton = function() {
    console.log("click..");
    $scope.modal.hide();
  };

  $scope.doLogin = function() {
    console.log('do login');

  };

})