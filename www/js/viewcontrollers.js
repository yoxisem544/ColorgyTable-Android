angular.module('colorgytable.controllers', ['ngCordova'])

.controller('MenuCtrl', function($scope, $ionicModal, $http) {

  // detect if user is logged in.
  if (!window.localStorage['isLogin']) {
    console.log("user login state: not yet logged in.");
    $ionicModal.fromTemplateUrl('templates/login.html', {
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
        // alert(JSON.stringify(response, null, '  '));
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
      window.localStorage['userId'] = data.id;
      window.localStorage['userOrg'] = data.organization_code;
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

.controller('MainCtrl', function($scope, $http, $cordovaNetwork) {

  $scope.logout = function() {
    window.localStorage.removeItem('userName');
    window.localStorage.removeItem('userSchool');
    window.localStorage.removeItem('isLogin');
    window.localStorage.removeItem('loginType');
  };

  $scope.download_course = function() {
    var front_url = "https://colorgy.io:443/api/";
    var middle_url = "/courses.json?per_page=3000&&filter%5Byear%5D=2015&filter%5Bterm%5D=1&&&access_token=";
    var token = window.localStorage["ColorgyAccessToken"];
    var url = front_url + 'ntust' + middle_url + token;
    alert(JSON.stringify(url, null, '  '));
    $http.get(url)
    .success(function(data, status, headers, config) {
      alert("ok getting course");
      window.localStorage['CourseData'] = JSON.stringify(data, null, '  ');
      alert(data.length);
      alert(window.localStorage['CourseData'].length);
    })
    .error(function(data, status, headers, config) {
      alert("fail get course");
    });
  };

  $scope.checkLength = function() {
    var course = window.localStorage['CourseData'];
    alert(course.length);
  };

// init test object that can save testing ng-models
  $scope.test = {};
  $scope.saveAccesstoken = function() {
    window.localStorage["ColorgyAccessToken"] = $scope.test.accesstoken;
  };
  $scope.me = function() {
    var front_url = "https://colorgy.io:443/api/v1/me.json?access_token=";
    var accessToken = window.localStorage["ColorgyAccessToken"];
    if (accessToken) {
      $http.get(front_url + accessToken)
      .success(function(data, status, headers, config) {
        $scope.test.display_result = JSON.stringify(data, null, '  ');
        console.log(data.organization_code);
        window.localStorage["UserName"] = data.name;
        window.localStorage["UserId"] = data.id;
        window.localStorage["userOrg"] = data.organization_code;
        window.localStorage['userId'] = data.id;
        console.log(window.localStorage['userId']);
      })
      .error(function(data, status, headers, config) {
        console.error("error");
        console.error(data);
      });
    } else {
      console.error("no access token");
    }
  };
  $scope.getCourseInfo = function() {
    var front_url = "https://colorgy.io:443/api/v1/";
    var school = $scope.test.school;
    var code = $scope.test.course_code;
    var middle_url = "/courses.json?filter%5Bcode%5D=" + code + "&&&&&&&access_token=";
    var accessToken = window.localStorage["ColorgyAccessToken"];
    var url = front_url + school + middle_url + accessToken;
    if (typeof accessToken === 'undefined') {
      console.error("no token");
      return;
    }

    if (typeof school === 'undefined') {
      console.error("school error");
      return;
    }

    $http.get(url)
    .success(function(data, status, headers, config) {
      $scope.test.display_result = JSON.stringify(data, null, '  ');
    })
    .error(function(data, status, headers, config) {
      console.error("error");
      console.error(data);
    });
  };
  $scope.getUserAvatar = function() {
    var front_url = "https://colorgy.io:443/api/v1/users.json?filter%5Bid%5D=";
    var id = $scope.test.userid;
    var middle_url = "&&&&&&&&&&&&&access_token=";
    var accessToken = window.localStorage["ColorgyAccessToken"];
    var url = front_url + id + middle_url + accessToken;
    console.log(url);
    if (typeof accessToken === 'undefined') {
      console.error("no token");
      return;
    }
    if (id === "" || typeof id === 'undefined') {
      console.error("you should specify a id, or all users will be dump out");
      return;
    }

    $http.get(url)
    .success(function(data, status, headers, config) {
      $scope.test.display_result = JSON.stringify(data, null, '  ');
    })
    .error(function(data, status, headers, config) {
      console.error("error");
      console.error(data);
    });

  };

  $scope.getUserCourses = function() {
    var front_url = "https://colorgy.io:443/api/v1/user_courses.json?filter%5Buser_id%5D=";
    var id = $scope.test.userid;
    var middle_url = "&&&&&&&&&&&&&access_token=";
    var accessToken = window.localStorage["ColorgyAccessToken"];
    var url = front_url + id + middle_url + accessToken;
    console.log(url);
    if (typeof accessToken === 'undefined') {
      console.error("no token");
      return;
    }
    if (id === "" || typeof id === 'undefined') {
      console.error("you need a id");
      return;
    }

    $http.get(url)
    .success(function(data, status, headers, config) {
      $scope.test.display_result = JSON.stringify(data, null, '  ');
    })
    .error(function(data, status, headers, config) {
      console.error("error");
      console.error(data);
    });

  };

  $scope.getCourseClassmates = function() {
    var front_url = "https://colorgy.io/api/v1/user_courses.json?filter%5Bcourse_code%5D=";
    var course_code = $scope.test.course_code;
    var middle_url = "&&&&&&&&&access_token=";
    var url = front_url + course_code + middle_url;
    if (course_code === "" | typeof course_code === 'undefined') {
      console.error("no course code");
      return;
    }

    $http.get(url)
    .success(function(data, status, headers, config) {
      //$scope.test.display_result = JSON.stringify(data, null, '  ');
      console.log(data);
    })
    .error(function(data, status, headers, config) {
      console.error("error");
      console.error(data);
    });

  };

  $scope.putCourse = function(course_code,course_org,year,term) {
    if (!course_code) {
      console.error("no course code");
      return;
    }
    if (!course_org) {
      console.error("no course org");
      return;
    }
    if (!year) {
      console.error("no course year");
      return;
    }
    if (!term) {
      console.error("no course term");
      return;
    }
    var uuid = window.localStorage["UserId"] + window.localStorage["UserName"] + course_code;

    if (!uuid) {
      console.error("no uuid");
      return;
    }
    var front_url = "https://colorgy.io:443/api/v1/me/user_courses/" + uuid + ".json?access_token=";
    var accessToken = window.localStorage["ColorgyAccessToken"];
    var url = front_url + accessToken;
    var params = {
      'user_courses': {
        'course_code': course_code,
        'course_organization_code': course_org,
        'year': parseInt(year),
        'term': parseInt(term)
      }
      // 'user_courses[course_code]': $scope.test.user.course_code,
      // 'user_courses[course_organization_code]': $scope.test.user.course_org,
      // 'user_courses[year]': parseInt($scope.test.user.year),
      // 'user_courses[term]': parseInt($scope.test.user.term)
    };
    console.log(params);
    // $http.put(url, params, {"Content-Type": "application/x-www-form-urlencoded"})
    // .success(function(data, status, headers, config) {
    //   console.log("PUT: " + $scope.user.course_code);
    // })
    // .error(function(data, status, headers, config) {
    //   console.error("error");
    //   console.error(data);
    // });
    $http({
      url: url,
      method: "PUT",
      data: params
    })
    .then(function(res) {
      console.log("ok");
      console.log(res);
    }, function(res) {
      console.error(res);
    });
  };

  $scope.deleteCourse = function() {
    if (!$scope.test.user.course_code) {
      console.error("no course code");
      return;
    }
    var front_url = "https://colorgy.io:443/api/v1/me/user_courses.json?filter%5Bcourse_code%5D=";
    var code = $scope.test.user.course_code;
    var middle_url = "&&&&&&&&access_token=";
    var accessToken = window.localStorage["ColorgyAccessToken"];
    var url = front_url + code + middle_url + accessToken;

    $http.delete(url)
    .success(function(data, status, headers, config) {
      console.log("DELETE: " + $scope.test.user.course_code);
    })
    .error(function(data, status, headers, config) {
      console.error("error");
      console.error(data);
    });
  };

  document.addEventListener("deviceready", function () {
    console.log('deviceready');
    $scope.$on('$cordovaNetwork:online', function(event, networkStatus) {
      console.log(event);
      console.log(networkStatus);
    });
    $scope.$on('$cordovaNetwork:offline', function(event, networkStatus) {
      console.log(event);
      console.log(networkStatus);
    });
  }, false);

  $scope.checkNetworkAvailability = function() {
    console.log(true);
    console.log($cordovaNetwork.getNetwork());
    alert("ok");
    alert("isOnline ?");
    alert($cordovaNetwork.isOnline());
  };
})

.controller('SearchCourseCtrl', function($scope, $timeout, $ionicScrollDelegate, $http) {
  var data = window.localStorage["CourseData"];
  // alert(data);
  console.log(data);
  $scope.course = JSON.parse(data);
  //alert($scope.course.length);
  // $scope.data = $scope.course;
  $scope.data = undefined;

  $scope.searchCourseText = {};
  var searchTimeout;

  // initial max display size, set to 30
  $scope.totalDisplayedCourses = 30;
  // card height
  $scope.cardHeight = 70;

  $scope.$watch('searchCourseText', function(val) {
    console.log(val);
  });

  $scope.searchTextChanged = function() {
    // everytime search text changed.
    console.log($scope.searchCourseText.text);
    if ($scope.searchCourseText.text === "") {
      console.log("yoss");
      // empty data.
      $scope.data = undefined;
    } else {
      console.log("yo");
      // cancel last requset if user fire another request.
      if (searchTimeout) $timeout.cancel(searchTimeout);
      searchTimeout = $timeout(function() {
        // set delayed text to real filter.
        $scope.searchCourseText.delaytext = $scope.searchCourseText.text;
        // set max display size to 30 everytime user search.
        $scope.totalDisplayedCourses = 30;
        if ($scope.data === undefined && $scope.searchCourseText.text !== "") {
          // when data is empty and user did input something, set data.
          $scope.data = $scope.course;
        }
        // set text after 1 second delay.
      }, 1000);
    }
  };

  $scope.list_click = function(value) {
    //alert(JSON.stringify(value, null, '  '));
    var course_term = value.term
    var course_code = value.code;
    var course_year = value.year;
    var course_org = window.localStorage['userOrg'];
    console.log(course_org);


    $scope.putCourse(course_code,course_org,course_year,course_term);
  };

  $scope.onScroll = function() {
    // you must set delegate by $getByHandle, or nothing will happen.
    var top = $ionicScrollDelegate.$getByHandle('course_scroll').getScrollPosition().top;
    if (top >= (($scope.totalDisplayedCourses - 15) * $scope.cardHeight)) {
      $scope.totalDisplayedCourses += 30;
    }

  };
  $scope.putCourse = function(course_code,course_org,year,term) {
    if (!course_code) {
      console.error("no course code");
      return;
    }
    if (!course_org) {
      console.error("no course org");
      return;
    }
    if (!year) {
      console.error("no course year");
      return;
    }
    if (!term) {
      console.error("no course term");
      return;
    }
    var uuid = window.localStorage["UserId"] + window.localStorage["UserName"] + course_code;

    if (!uuid) {
      console.error("no uuid");
      return;
    }
    console.log(course_code);
    console.log(course_org);
    console.log(year);
    console.log(term);
    console.log(uuid);
    var front_url = "https://colorgy.io:443/api/v1/me/user_courses/" + uuid + ".json?access_token=";
    var accessToken = window.localStorage["ColorgyAccessToken"];
    var url = front_url + accessToken;
    var params = {
      'user_courses': {
        'course_code': course_code,
        'course_organization_code': course_org,
        'year': parseInt(year),
        'term': parseInt(term),
        'uuid': uuid
      }
      // 'user_courses[course_code]': $scope.test.user.course_code,
      // 'user_courses[course_organization_code]': $scope.test.user.course_org,
      // 'user_courses[year]': parseInt($scope.test.user.year),
      // 'user_courses[term]': parseInt($scope.test.user.term)
    };
    console.log(params);
    // $http.put(url, params, {"Content-Type": "application/x-www-form-urlencoded"})
    // .success(function(data, status, headers, config) {
    //   console.log("PUT: " + $scope.user.course_code);
    // })
    // .error(function(data, status, headers, config) {
    //   console.error("error");
    //   console.error(data);
    // });
    $http({
      url: url,
      method: "PUT",
      data: params
    })
    .then(function(res) {
      console.log("ok");
      console.log(res);
      var course_name = res.name;
      var course_general_code = res.general_code;
      var course_general_code = res.general_code;

    }, function(res) {
      console.error(res);
    });
  };
})

.controller('HomeTabCtrl', function($scope, $ionicModal, $http) {
  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-right'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function($event) {
    console.log($event.currentTarget);
    var course_code = $event.currentTarget.attributes['course-code'].value;
    $scope.getCourseClassmates(course_code);
    $scope.addModalInfo(course_code);
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
  $scope.getCourseClassmates = function(course_code) {
    var front_url = "https://colorgy.io/api/v1/user_courses.json?filter%5Bcourse_code%5D=";
    var course_code = course_code;
    var middle_url = "&&&&&&&&&access_token=";
    var url = front_url + course_code + middle_url + window.localStorage["ColorgyAccessToken"];
    if (course_code === "" | typeof course_code === 'undefined') {
      console.error("no course code");
      return;
    }

    $http.get(url)
    .success(function(data, status, headers, config) {
      $scope.test.display_result = JSON.stringify(data, null, '  ');
    })
    .error(function(data, status, headers, config) {
      console.error("error");
      console.error(data);
    });

  };
  $scope.getCourseInfo = function(course_code) {
    var front_url = "https://colorgy.io:443/api/v1/";
    var school = window.localStorage['userOrg'].toLowerCase();
    var code = course_code;
    var middle_url = "/courses.json?filter%5Bcode%5D=" + code + "&&&&&&&access_token=";
    var accessToken = window.localStorage["ColorgyAccessToken"];
    var url = front_url + school + middle_url + accessToken;
    if (typeof accessToken === 'undefined') {
      console.error("no token");
      return;
    }

    if (typeof school === 'undefined') {
      console.error("school error");
      return;
    }

    $http.get(url)
    .success(function(data, status, headers, config) {
      return data;
    })
    .error(function(data, status, headers, config) {
      console.error("error");
      console.error(data);
    });
  };

  $scope.getUserCourses = function() {
    var front_url = "https://colorgy.io:443/api/v1/user_courses.json?filter%5Buser_id%5D=";
    var id = window.localStorage['userId'];
    var middle_url = "&&&&&&&&&&&&&access_token=";
    var accessToken = window.localStorage["ColorgyAccessToken"];
    var url = front_url + id + middle_url + accessToken;
    console.log(url);
    if (typeof accessToken === 'undefined') {
      console.error("no token");
      return;
    }
    if (id === "" || typeof id === 'undefined') {
      console.error("you need a id");
      return;
    }

    $http.get(url)
    .success(function(data, status, headers, config) {
      window.localStorage['userCourses'] = JSON.stringify(data, null, '  ');
    })
    .error(function(data, status, headers, config) {
      console.error("error");
      console.error(data);
    });

  };

  $scope.appendCourses = function(){
    var front_url = "https://colorgy.io:443/api/v1/";
    var school = window.localStorage['userOrg'].toLowerCase();
    var code;
    var middle_url = "/courses.json?filter%5Bcode%5D=" + code + "&&&&&&&access_token=";
    var accessToken = window.localStorage["ColorgyAccessToken"];
    var url = front_url + school + middle_url + accessToken;
    var userCourses = JSON.parse(window.localStorage['userCourses']);
    var $course_table_element;
    var course;
    var course_code;
    var getCourseUri;
    var item_id;

    console.log(userCourses.length);
    //console.log(userCourses);

    for(i=0 ; i <= userCourses.length - 1 ; i++){
      //console.log(userCourses[i]);
      course = userCourses[i];
      course_code = course.course_code;
      //console.log(course_code);
      getCourseUri = 'https://colorgy.io/api/v1/'+ school +'/courses.json?' +
        'filter[code]=' + course_code;
      item_id = course.id;

      $http.get(getCourseUri)
      .success(function(data, status, headers, config) {

        //console.log(data);
        var course = data[0];
        var course_name = course.name;
        var course_lecturer = course.lecturer;
        var course_general_code = course.general_code;
        var course_code = course.code;
        var credits = course.credits;
        for (var i = 1; i <= 9; i++) {
          var thisCourse_day = course['day_' + i];
          var thisCourse_period = course['period_' + i];
          var thisCourse_location = course['location_' + i];
          $course_table_element = angular.element(document.querySelector('.day'+ thisCourse_day + '.period' + thisCourse_period));
          $course_table_element.append('<div class="simulator-table-course active" ng-click="isClickable && openModal($event)" item-id="' + item_id +'" course-code="' + course_code + '">' + course_name + '</div>');

        };
        $scope.CourseConflictTest();


      })
      .error(function(data, status, headers, config) {
        console.error("error");
        console.error(data);
      });
    }

  }
  $scope.getCourseClassmates = function(course_code) {
    var front_url = "https://colorgy.io/api/v1/user_courses.json?filter%5Bcourse_code%5D=";
    var middle_url = "&&&&&&&&&access_token=";
    var url = front_url + course_code + middle_url;
    if (course_code === "" | typeof course_code === 'undefined') {
      console.error("no course code");
      return;
    }

    $http.get(url)
    .success(function(data, status, headers, config) {
      //$scope.test.display_result = JSON.stringify(data, null, '  ');
      console.log(data);
    })
    .error(function(data, status, headers, config) {
      console.error("error");
      console.error(data);
    });

  };
  $scope.addModalInfo = function(course_code){
    var front_url = "https://colorgy.io:443/api/v1/";
    var school = window.localStorage['userOrg'].toLowerCase();
    var code = course_code;
    var middle_url = "/courses.json?filter%5Bcode%5D=" + code + "&&&&&&&access_token=";
    var accessToken = window.localStorage["ColorgyAccessToken"];
    var url = front_url + school + middle_url + accessToken;
    if (typeof accessToken === 'undefined') {
      console.error("no token");
      return;
    }

    if (typeof school === 'undefined') {
      console.error("school error");
      return;
    }

    $http.get(url)
    .success(function(data, status, headers, config) {
      var course = data[0];
      var course_name = course.name;
      var course_lecturer = course.lecturer;
      var course_general_code = course.general_code;
      var course_credits = course.credits;
      var course_url = course.url;

      var $course_name_element = angular.element(document.querySelector('.content-header .course-name'));
      var $course_lecturer_element = angular.element(document.querySelector('.content-header .course-lecturer'));
      var $course_general_code_element = angular.element(document.querySelector('.modal-content .info .modal-course-general-code'));
      var $course_credits_element = angular.element(document.querySelector('.modal-content .info .modal-course-credits'));
      var $course_url_element = angular.element(document.querySelector('.modal-content .info .modal-course-link'));

      $course_name_element.html(course_name);
      $course_lecturer_element.html(course_lecturer);
      $course_general_code_element.html(course_general_code);
      $course_credits_element.html(course_credits);
      $course_url_element.html('<a href="' + course_url + '" target="_blank">前往課程網站</a>');

    })
    .error(function(data, status, headers, config) {
      console.error("error");
      console.error(data);
    });
  }
  $scope.CourseConflictTest = function(){
    var $tableBody = angular.element(document.querySelector('tbody'));
    var $tableBlock = $tableBody.find('td');
    console.log($tableBlock.length);

    for(i = 0 ; i <= 69 ; i++){
      var $courseBlock = $tableBlock[i];
      var coursecount = angular.element($courseBlock).children('.simulator-table-course').length;
      angular.element($courseBlock).clone().children('.simulator-table-course:nth-child(1)').removeClass('course-conflict-pack').css({
          'transform' : '',
          '-moz-transform' : '',
          '-o-transform' : '',
          '-ms-transform' : '',
          '-webkit-transform' : '',
          'top' : '0'
        });

      if(coursecount >= 2){
        console.log('it is bigger than 2!');
        angular.element($courseBlock).children('.simulator-table-course').addClass('course-conflict');

      }
    }

  }
  $scope.getUserCourses();
  $scope.appendCourses();

});;
