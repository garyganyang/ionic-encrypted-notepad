angular.module('starter.controllers', [])

  .controller('PersonalCtrl', function ($scope, $rootScope, $state, $cordovaSQLite, $cordovaToast, $ionicHistory, $ionicLoading, $timeout, $gestureLock, $window, GestureLockService) {
    var idForDelete = [];
    $scope.isShow = true;
    $scope.showPWD = true;
    //$scope.$on('$ionicView.afterEnter', function (e) {
    console.log('PersonalCtrl.afterEnter');
    $scope.isShow = true;
    $scope.showPWD = true;
    var idForDelete = [];
    $scope.title = "输入密码";
    var password = GestureLockService.getPassword();
    var gestureLockCanvas = document.getElementById("gestureLock2");
    gestureLockCanvas.width = window.innerWidth < (window.innerHeight - 250) ? window.innerWidth : (window.innerHeight - 250);
    gestureLockCanvas.height = gestureLockCanvas.width;
    var gestureLock = new $gestureLock(gestureLockCanvas, {
      matrix: 3
    });
    gestureLock.gestureStart = function (e) {
      return;
    };
    gestureLock.gestureEnd = function (e) {
      var validateResult = gestureLock.validatePassword(password, gestureLock.getGesturePassword());
      if (validateResult) {
        gestureLock.viewStatus("success", {ring: true});
        $timeout(function () {
          //gestureLock.reset();
          $scope.showPWD = false;
          var idForDelete = [];
          console.log("PersonalCtrl.afterEnter");
          //$ionicLoading.show({
          //  template: '<ion-spinner icon="lines" class="spinner-balanced"></ion-spinner>'
          //});
          // encoded = True
          $timeout(function () {
            var queryResult = "select * from records where encoded = 'T'order by datetime desc";
            console.log(queryResult);
            $cordovaSQLite.execute(db, queryResult, []).then(function (res) {
              $scope.rows = [];
              if (res.rows.length > 0) {
                var data = [];
                var dataItem = {year: '', day: '', other: []};
                for (var i = 0; i < res.rows.length; i++) {
                  var otherItem = {};
                  otherItem.id = res.rows.item(i).id;
                  otherItem.day = res.rows.item(i).day;
                  otherItem.weekday = res.rows.item(i).weekday;
                  otherItem.time = res.rows.item(i).time;
                  otherItem.title = res.rows.item(i).title;
                  otherItem.content = res.rows.item(i).content;
                  otherItem.encoded = res.rows.item(i).encoded;
                  if (data.length == 0) {
                    dataItem.other.push(otherItem);
                    dataItem.year = res.rows.item(i).year;
                    dataItem.month = res.rows.item(i).month;
                    data.push(dataItem);
                  } else if (data.length > 0) {
                    var count = data.length - 1;
                    if (data[count].year == res.rows.item(i).year && data[count].month == res.rows.item(i).month) {
                      data[count].other.push(otherItem);
                    } else if (data[count].year != res.rows.item(i).year || data[count].month != res.rows.item(i).month) {
                      var dataItem = {year: '', month: '', other: []};
                      dataItem.other.push(otherItem);
                      dataItem.year = res.rows.item(i).year;
                      dataItem.month = res.rows.item(i).month;
                      data.push(dataItem);
                    }
                  }
                }
              }
              $scope.records = data;
              $ionicLoading.hide();
            }, function (err) {
              $ionicLoading.hide();
              $cordovaToast.showShortBottom(err);
            });
          }, 500);
        }, 500);
      } else {
        $scope.title = "密码错误,请重新输入";
        gestureLock.viewStatus("error", {ring: true});
        $timeout(function () {
          gestureLock.reset();
        }, 500);
      }
    };
    gestureLock.init();
    angular.element($window).bind('resize', function () {
      gestureLockCanvas.width = window.innerWidth < (window.innerHeight - 250) ? window.innerWidth : (window.innerHeight - 250);
      gestureLockCanvas.height = gestureLockCanvas.width;
      gestureLock.init();
    });

    //});
    $scope.addNote = function () {
      $state.go('addnote');
    }
    $scope.clickCheckBox = function (id) {
      if (0 == idForDelete.length) {
        idForDelete.push(id);
        return;
      }
      for (var i = 0; i < idForDelete.length; i++) {
        if (idForDelete[i] === id) {
          idForDelete.splice(i, 1);
          return;
        }
      }
      idForDelete.push(id);

    };
    $scope.delete = function () {
      $scope.isShow = false;
    };
    $scope.cancelDelete = function () {
      $scope.isShow = true;
      $timeout(function () {
        var queryResult = "select * from records where encoded = 'T'order by datetime desc";
        console.log(queryResult);
        $cordovaSQLite.execute(db, queryResult, []).then(function (res) {
          $scope.rows = [];
          if (res.rows.length > 0) {
            var data = [];
            var dataItem = {year: '', day: '', other: []};
            for (var i = 0; i < res.rows.length; i++) {
              var otherItem = {id: '', day: '', weekday: '', time: '', title: '', content: '', encoded: ''};
              otherItem.id = res.rows.item(i).id;
              otherItem.day = res.rows.item(i).day;
              otherItem.weekday = res.rows.item(i).weekday;
              otherItem.time = res.rows.item(i).time;
              otherItem.title = res.rows.item(i).title;
              otherItem.content = res.rows.item(i).content;
              otherItem.encoded = res.rows.item(i).encoded;
              if (data.length == 0) {
                dataItem.other.push(otherItem);
                dataItem.year = res.rows.item(i).year;
                dataItem.month = res.rows.item(i).month;
                data.push(dataItem);
              } else if (data.length > 0) {
                var count = data.length - 1;
                if (data[count].year == res.rows.item(i).year && data[count].month == res.rows.item(i).month) {
                  data[count].other.push(otherItem);
                } else if (data[count].year != res.rows.item(i).year || data[count].month != res.rows.item(i).month) {
                  var dataItem = {year: '', month: '', other: []};
                  dataItem.other.push(otherItem);
                  dataItem.year = res.rows.item(i).year;
                  dataItem.month = res.rows.item(i).month;
                  data.push(dataItem);
                }
              }
            }
          }
          $scope.records = data;
          $ionicLoading.hide();
        }, function (err) {
          $ionicLoading.hide();
          $cordovaToast.showShortBottom(err);
        });
      }, 500);
    };
    $scope.deleteBatchConfirm = function () {
      if (idForDelete.length > 0) {
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-balanced"></ion-spinner>'
        });
        var aaa = idForDelete[0];
        for (var i = 1; i < idForDelete.length; i++) {
          aaa = aaa + ',' + idForDelete[i];
        }
        var query = "delete from records where id in (" + aaa + ")";
        console.log(query);
        $cordovaSQLite.execute(db, query, []).then(function (res) {
          //$cordovaToast.showShortBottom("insertId: " + res.insertId);
          //$state.go('tab.allnotes');
        }, function (err) {
          $cordovaToast.showShortBottom(err);
        });
        $timeout(function () {
          var queryResult = "select * from records where encoded = 'T' order by datetime desc";
          console.log(queryResult);
          $cordovaSQLite.execute(db, queryResult, []).then(function (res) {
            $scope.rows = [];
            if (res.rows.length > 0) {
              var data = [];
              var dataItem = {year: '', day: '', other: []};
              for (var i = 0; i < res.rows.length; i++) {
                var otherItem = {id: '', day: '', weekday: '', time: '', title: '', content: '', encoded: ''};
                otherItem.id = res.rows.item(i).id;
                otherItem.day = res.rows.item(i).day;
                otherItem.weekday = res.rows.item(i).weekday;
                otherItem.time = res.rows.item(i).time;
                otherItem.title = res.rows.item(i).title;
                otherItem.content = res.rows.item(i).content;
                otherItem.encoded = res.rows.item(i).encoded;
                if (data.length == 0) {
                  dataItem.other.push(otherItem);
                  dataItem.year = res.rows.item(i).year;
                  dataItem.month = res.rows.item(i).month;
                  data.push(dataItem);
                } else if (data.length > 0) {
                  var count = data.length - 1;
                  if (data[count].year == res.rows.item(i).year && data[count].month == res.rows.item(i).month) {
                    data[count].other.push(otherItem);
                  } else if (data[count].year != res.rows.item(i).year || data[count].month != res.rows.item(i).month) {
                    var dataItem = {year: '', month: '', other: []};
                    dataItem.other.push(otherItem);
                    dataItem.year = res.rows.item(i).year;
                    dataItem.month = res.rows.item(i).month;
                    data.push(dataItem);
                  }
                }
              }
            }
            $scope.records = data;
            $ionicLoading.hide();
          }, function (err) {
            $ionicLoading.hide();
            $cordovaToast.showShortBottom(err);
          });
        }, 500);
      }
      $scope.isShow = true;
      idForDelete = [];
    };
    $scope.deleteSingle = function (id) {

      var query = "delete from records where id = " + id;
      console.log(query);
      $cordovaSQLite.execute(db, query, []).then(function (res) {
        //$cordovaToast.showShortBottom("insertId: " + res.insertId);
        //$state.go('tab.allnotes');
      }, function (err) {
        $cordovaToast.showShortBottom(err);
      });
      $timeout(function () {
        var queryResult = "select * from records where encoded = 'T'order by datetime desc";
        console.log(queryResult);
        $cordovaSQLite.execute(db, queryResult, []).then(function (res) {
          $scope.rows = [];
          if (res.rows.length > 0) {
            var data = [];
            var dataItem = {year: '', day: '', other: []};
            for (var i = 0; i < res.rows.length; i++) {
              var otherItem = {id: '', day: '', weekday: '', time: '', title: '', content: '', encoded: ''};
              otherItem.id = res.rows.item(i).id;
              otherItem.day = res.rows.item(i).day;
              otherItem.weekday = res.rows.item(i).weekday;
              otherItem.time = res.rows.item(i).time;
              otherItem.title = res.rows.item(i).title;
              otherItem.content = res.rows.item(i).content;
              otherItem.encoded = res.rows.item(i).encoded;
              if (data.length == 0) {
                dataItem.other.push(otherItem);
                dataItem.year = res.rows.item(i).year;
                dataItem.month = res.rows.item(i).month;
                data.push(dataItem);
              } else if (data.length > 0) {
                var count = data.length - 1;
                if (data[count].year == res.rows.item(i).year && data[count].month == res.rows.item(i).month) {
                  data[count].other.push(otherItem);
                } else if (data[count].year != res.rows.item(i).year || data[count].month != res.rows.item(i).month) {
                  var dataItem = {year: '', month: '', other: []};
                  dataItem.other.push(otherItem);
                  dataItem.year = res.rows.item(i).year;
                  dataItem.month = res.rows.item(i).month;
                  data.push(dataItem);
                }
              }
            }
          }
          $scope.records = data;
          $ionicLoading.hide();
        }, function (err) {
          $ionicLoading.hide();
          $cordovaToast.showShortBottom(err);
        });
      }, 500);

    };
    $scope.showDetail = function (detail) {
      if ($scope.isShow) {
        $rootScope.detail = detail;
        //$rootScope.detail =  {id:detail,title:'title1',content:'content1'};
        $state.go('addnote');
      }

    };
    $scope.goBack = function () {
      $ionicHistory.goBack();
    }
    $scope.$on('$ionicView.afterLeave', function (e) {
      console.log("AllNotesCtrl.afterLeave");
      var idForDelete = [];
    });
  })

  .controller('AllNotesCtrl', function ($scope, $rootScope, $state, $cordovaSQLite, $cordovaToast, $ionicLoading, $gestureLock, $timeout) {
    var idForDelete = [];
    $scope.isShow = true;
    $scope.$on('$ionicView.afterLeave', function (e) {
      console.log("AllNotesCtrl.afterLeave");
      var idForDelete = [];
    });
    $scope.$on('$ionicView.enter', function (e) {
      $scope.isShow = true;
      var idForDelete = [];
      console.log("AllNotesCtrl.afterEnter");
      //$ionicLoading.show({
      //  template: '<ion-spinner icon="lines" class="spinner-balanced"></ion-spinner>'
      //});
      $timeout(function () {
        var queryResult = "select * from records where encoded = 'F' order by datetime desc";
        console.log(queryResult);
        $cordovaSQLite.execute(db, queryResult, []).then(function (res) {
          $scope.rows = [];
          if (res.rows.length > 0) {
            var data = [];
            var dataItem = {year: '', day: '', other: []};
            for (var i = 0; i < res.rows.length; i++) {
              var otherItem = {id: '', day: '', weekday: '', time: '', title: '', content: '', encoded: ''};
              otherItem.id = res.rows.item(i).id;
              otherItem.day = res.rows.item(i).day;
              otherItem.weekday = res.rows.item(i).weekday;
              otherItem.time = res.rows.item(i).time;
              otherItem.title = res.rows.item(i).title;
              otherItem.content = res.rows.item(i).content;
              otherItem.encoded = res.rows.item(i).encoded;
              if (data.length == 0) {
                dataItem.other.push(otherItem);
                dataItem.year = res.rows.item(i).year;
                dataItem.month = res.rows.item(i).month;
                data.push(dataItem);
              } else if (data.length > 0) {
                var count = data.length - 1;
                if (data[count].year == res.rows.item(i).year && data[count].month == res.rows.item(i).month) {
                  data[count].other.push(otherItem);
                } else if (data[count].year != res.rows.item(i).year || data[count].month != res.rows.item(i).month) {
                  var dataItem = {year: '', month: '', other: []};
                  dataItem.other.push(otherItem);
                  dataItem.year = res.rows.item(i).year;
                  dataItem.month = res.rows.item(i).month;
                  data.push(dataItem);
                }
              }
            }
          }
          $scope.records = data;
          $ionicLoading.hide();
        }, function (err) {
          $ionicLoading.hide();
          $cordovaToast.showShortBottom(err);
        });
      }, 1000);

    });
    $scope.setting = function () {
      $state.go('setting');
    }
    $scope.clickCheckBox = function (id) {
      if (0 == idForDelete.length) {
        idForDelete.push(id);
        return;
      }
      for (var i = 0; i < idForDelete.length; i++) {
        if (idForDelete[i] === id) {
          idForDelete.splice(i, 1);
          return;
        }
      }
      idForDelete.push(id);
    };
    $scope.delete = function () {
      $scope.isShow = false;
    };
    $scope.cancelDelete = function () {
      $scope.isShow = true;
      $timeout(function () {
        var queryResult = "select * from records where encoded = 'F'order by datetime desc";
        console.log(queryResult);
        $cordovaSQLite.execute(db, queryResult, []).then(function (res) {
          $scope.rows = [];
          if (res.rows.length > 0) {
            var data = [];
            var dataItem = {year: '', day: '', other: []};
            for (var i = 0; i < res.rows.length; i++) {
              var otherItem = {id: '', day: '', weekday: '', time: '', title: '', content: '', encoded: ''};
              otherItem.id = res.rows.item(i).id;
              otherItem.day = res.rows.item(i).day;
              otherItem.weekday = res.rows.item(i).weekday;
              otherItem.time = res.rows.item(i).time;
              otherItem.title = res.rows.item(i).title;
              otherItem.content = res.rows.item(i).content;
              otherItem.encoded = res.rows.item(i).encoded;
              if (data.length == 0) {
                dataItem.other.push(otherItem);
                dataItem.year = res.rows.item(i).year;
                dataItem.month = res.rows.item(i).month;
                data.push(dataItem);
              } else if (data.length > 0) {
                var count = data.length - 1;
                if (data[count].year == res.rows.item(i).year && data[count].month == res.rows.item(i).month) {
                  data[count].other.push(otherItem);
                } else if (data[count].year != res.rows.item(i).year || data[count].month != res.rows.item(i).month) {
                  var dataItem = {year: '', month: '', other: []};
                  dataItem.other.push(otherItem);
                  dataItem.year = res.rows.item(i).year;
                  dataItem.month = res.rows.item(i).month;
                  data.push(dataItem);
                }
              }
            }
          }
          $scope.records = data;
          $ionicLoading.hide();
        }, function (err) {
          $ionicLoading.hide();
          $cordovaToast.showShortBottom(err);
        });
      }, 1000);
    };
    $scope.deleteBatchConfirm = function () {
      if (idForDelete.length > 0) {
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-balanced"></ion-spinner>'
        });
        var aaa = idForDelete[0];
        for (var i = 1; i < idForDelete.length; i++) {
          aaa = aaa + ',' + idForDelete[i];
        }
        var query = "delete from records where id in (" + aaa + ")";
        console.log(query);
        $cordovaSQLite.execute(db, query, []).then(function (res) {
          //$cordovaToast.showShortBottom("insertId: " + res.insertId);
          //$state.go('tab.allnotes');
        }, function (err) {
          $cordovaToast.showShortBottom(err);
        });
        $timeout(function () {
          var queryResult = "select * from records where encoded = 'F'order by datetime desc";
          console.log(queryResult);
          $cordovaSQLite.execute(db, queryResult, []).then(function (res) {
            $scope.rows = [];
            if (res.rows.length > 0) {
              var data = [];
              var dataItem = {year: '', day: '', other: []};
              for (var i = 0; i < res.rows.length; i++) {
                var otherItem = {id: '', day: '', weekday: '', time: '', title: '', content: '', encoded: ''};
                otherItem.id = res.rows.item(i).id;
                otherItem.day = res.rows.item(i).day;
                otherItem.weekday = res.rows.item(i).weekday;
                otherItem.time = res.rows.item(i).time;
                otherItem.title = res.rows.item(i).title;
                otherItem.content = res.rows.item(i).content;
                otherItem.encoded = res.rows.item(i).encoded;
                if (data.length == 0) {
                  dataItem.other.push(otherItem);
                  dataItem.year = res.rows.item(i).year;
                  dataItem.month = res.rows.item(i).month;
                  data.push(dataItem);
                } else if (data.length > 0) {
                  var count = data.length - 1;
                  if (data[count].year == res.rows.item(i).year && data[count].month == res.rows.item(i).month) {
                    data[count].other.push(otherItem);
                  } else if (data[count].year != res.rows.item(i).year || data[count].month != res.rows.item(i).month) {
                    var dataItem = {year: '', month: '', other: []};
                    dataItem.other.push(otherItem);
                    dataItem.year = res.rows.item(i).year;
                    dataItem.month = res.rows.item(i).month;
                    data.push(dataItem);
                  }
                }
              }
            }
            $scope.records = data;
            $ionicLoading.hide();
          }, function (err) {
            $ionicLoading.hide();
            $cordovaToast.showShortBottom(err);
          });
        }, 1000);
      }
      $scope.isShow = true;
      idForDelete = [];
    };
    $scope.deleteSingle = function (id) {

      var query = "delete from records where id = " + id;
      console.log(query);
      $cordovaSQLite.execute(db, query, []).then(function (res) {
        //$cordovaToast.showShortBottom("insertId: " + res.insertId);
        //$state.go('tab.allnotes');
      }, function (err) {
        $cordovaToast.showShortBottom(err);
      });
      $timeout(function () {
        var queryResult = "select * from records where encoded = 'F'order by datetime desc";
        console.log(queryResult);
        $cordovaSQLite.execute(db, queryResult, []).then(function (res) {
          $scope.rows = [];
          if (res.rows.length > 0) {
            var data = [];
            var dataItem = {year: '', day: '', other: []};
            for (var i = 0; i < res.rows.length; i++) {
              var otherItem = {id: '', day: '', weekday: '', time: '', title: '', content: '', encoded: ''};
              otherItem.id = res.rows.item(i).id;
              otherItem.day = res.rows.item(i).day;
              otherItem.weekday = res.rows.item(i).weekday;
              otherItem.time = res.rows.item(i).time;
              otherItem.title = res.rows.item(i).title;
              otherItem.content = res.rows.item(i).content;
              otherItem.encoded = res.rows.item(i).encoded;
              if (data.length == 0) {
                dataItem.other.push(otherItem);
                dataItem.year = res.rows.item(i).year;
                dataItem.month = res.rows.item(i).month;
                data.push(dataItem);
              } else if (data.length > 0) {
                var count = data.length - 1;
                if (data[count].year == res.rows.item(i).year && data[count].month == res.rows.item(i).month) {
                  data[count].other.push(otherItem);
                } else if (data[count].year != res.rows.item(i).year || data[count].month != res.rows.item(i).month) {
                  var dataItem = {year: '', month: '', other: []};
                  dataItem.other.push(otherItem);
                  dataItem.year = res.rows.item(i).year;
                  dataItem.month = res.rows.item(i).month;
                  data.push(dataItem);
                }
              }
            }
          }
          $scope.records = data;
          $ionicLoading.hide();
        }, function (err) {
          $ionicLoading.hide();
          $cordovaToast.showShortBottom(err);
        });
      }, 500);

    };
    $scope.addNote = function () {
      $state.go('addnote');
    }
    $scope.showDetail = function (detail) {
      if ($scope.isShow) {
        $rootScope.detail = detail;
        //$rootScope.detail =  {id:detail,title:'title1',content:'content1'};
        $state.go('addnote');
      }
    };
    $scope.onSwipeLeft = function () {
      $scope.showDel = true;
    }
  })

  .controller('SettingCtrl', function ($scope, $state, $ionicPopup, $cordovaToast, $cordovaAppRate, $ionicPopover, $cordovaSocialSharing) {
    $scope.changePwd = function () {
      $state.go('reset-pwd');
    }
    $scope.feedback = function () {
      var myPopup = $ionicPopup.show({
        template: '<textarea placeholder="请输入你的宝贵意见" style="min-height:100px;">',
        title: '欢迎使用意见反馈',
        scope: $scope,
        buttons: [
          {
            text: '<b>提交</b>',
            type: 'popup-button footer-bar-button',
            onTap: function (e) {
              myPopup.close();
              $cordovaToast.showShortCenter("已提交,谢谢");
            }
          },
        ]
      });
    }
    $scope.rate = function () {
      AppRate.preferences.displayAppName = '加密记事本';
      AppRate.preferences.useLanguage = 'zh-Hans';
      $cordovaAppRate.promptForRating(true).then(function (result) {
      });
    };

    $ionicPopover.fromTemplateUrl('my-popover.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });

    $scope.share = function () {
      // Share via native share sheet
      $cordovaSocialSharing
        .share('分享加密记事本', '加密记事本主题', 'file', 'http://www.nyist.net/')
        .then(function (result) {
          // Success!
          $cordovaToast.showShortCenter('分享成功');
        }, function (err) {
          // An error occured. Show a message to the user
        });
    };
  })

  .controller('AddnoteCtrl', function ($scope, $rootScope, $state, $filter, $cordovaSQLite, $cordovaToast, $ionicHistory, $ionicLoading) {

    var daysOfTheWeek = ["日", "一", "二", "三", "四", "五", "六"];

    $scope.$on('$ionicView.beforeEnter', function (e) {

      var dateForDisplay = new Date();
      $scope.displayDate = $filter('date')(dateForDisplay, 'yyyy-MM-dd') + " 星期" + daysOfTheWeek[dateForDisplay.getDay()];
      $scope.isEncoded = false;
      if (undefined == $rootScope.detail || "" == $rootScope.detail.id || null == $rootScope.detail.id) {
        $scope.note = {id: '', title: '', content: '', isEncoded: 'F'};
      } else {
        console.log("$ionicView.enter:" + $rootScope.detail.id);
        $scope.note = {
          id: $rootScope.detail.id,
          title: $rootScope.detail.title,
          content: $rootScope.detail.content,
          isEncoded: $rootScope.detail.encoded
        };
        if ($scope.note.isEncoded == 'T') {
          $scope.isEncoded = true;
        }
      }
    });
    $scope.$on('$ionicView.beforeLeave', function (e) {
      console.log(e + "AddnoteCtrl.$ionicView.afterLeave");
      $rootScope.detail = [];
    });
    $scope.encoded = function () {
      if ($scope.isEncoded) {
        $scope.isEncoded = false;
        $scope.note.isEncoded = 'F';
      } else {
        $scope.isEncoded = true;
        $scope.note.isEncoded = 'T';
      }
    };
    $scope.goBack = function () {
      $ionicHistory.goBack();
    }
    $scope.addNote = function (note) {
      if (note.title != '') {
        $ionicLoading.show({
          template: '<ion-spinner icon="lines" class="spinner-balanced"></ion-spinner>'
        });
        var dateForDB = new Date();
        var year = $filter('date')(dateForDB, 'yyyy');
        var month = $filter('date')(dateForDB, 'MM');
        var day = $filter('date')(dateForDB, 'dd');
        var time = $filter('date')(dateForDB, 'HH:mm');
        var weekday = "星期" + daysOfTheWeek[dateForDB.getDay()];
        var datetime = $filter('date')(dateForDB, 'yyyy-MM-dd HH:mm:ss');

        if ($scope.note.id === '') {
          var query = "INSERT INTO records (title,content, year, month, day, weekday, time, encoded, datetime) VALUES (?,?,?,?,?,?,?,?,?)";
          console.log(query);
          $cordovaSQLite.execute(db, query, [$scope.note.title, $scope.note.content, year, month, day, weekday, time, $scope.note.isEncoded, datetime]).then(function (res) {
            $ionicLoading.hide();
            //$cordovaToast.showShortBottom("insertId: " + res.insertId);
            $state.go('tab.allnotes');
          }, function (err) {
            $ionicLoading.hide();
            $cordovaToast.showShortBottom(err);
          });
        } else {
          var query = "update records set title=?, content=?, year=?, month=?, day=?, weekday=?, time=?, encoded=?, datetime=? where id = ?";
          console.log(query);
          $cordovaSQLite.execute(db, query, [$scope.note.title, $scope.note.content, year, month, day, weekday, time, $scope.note.isEncoded, datetime, $scope.note.id]).then(function (res) {
            $state.go('tab.allnotes');
          }, function (err) {
            $cordovaToast.showShortBottom(err);
          });
        }
      } else {
        $cordovaToast.showShortBottom("亲,笔记不能没有标题哦~")
      }
    }
  })

  .controller('ResetGestureLockCtrl', function ($scope, $state, $gestureLock, $timeout, GestureLockService, $window, $ionicHistory, $cordovaToast) {
    var oldPassword = GestureLockService.getPassword();
    var isValidate = false;
    $scope.title = "绘制图案设置锁";
    var passwords = [2];
    var count = 1;
    var gestureLockCanvas = document.getElementById("gestureLock3");
    gestureLockCanvas.width = window.innerWidth < (window.innerHeight - 250) ? window.innerWidth : (window.innerHeight - 250);
    gestureLockCanvas.height = gestureLockCanvas.width;
    var gestureLock = new $gestureLock(gestureLockCanvas, {matrix: 3});
    if (!isValidate) {
      $scope.title = "请输入原密码";
    }
    gestureLock.gestureEnd = function (e) {
      if (!isValidate) {
        if (gestureLock.validatePassword(oldPassword, gestureLock.getGesturePassword())) {

          gestureLock.viewStatus("success", {ring: true});
          $scope.title = "绘制图案设置锁";

          $timeout(function () {
            isValidate = true;
            gestureLock.reset();
          }, 500);
        } else {
          gestureLock.viewStatus("error", {ring: true});
          $scope.title = "密码输入错误,请重新输入";

          $timeout(function () {
            gestureLock.reset();
          }, 500);
        }
      } else {

        passwords[count % 2] = gestureLock.getGesturePassword();

        // 输入单次了
        if (count % 2 === 1) {
          gestureLock.viewStatus("success", {ring: true});
          $scope.title = "请在输入一次";
          $timeout(function () {
            gestureLock.reset();
          }, 500);
        } else if (count % 2 === 0) {
          if (gestureLock.validatePassword(passwords[0], passwords[1])) {
            gestureLock.viewStatus("success", {ring: true});
            GestureLockService.setPassword(passwords[0]);

            $scope.title = "设置成功";
            $timeout(function () {
              //gestureLock.reset();
              $cordovaToast.showShortCenter("手势修改成功");
              $ionicHistory.goBack();
            }, 500);

          } else {
            $scope.title = "两次设置不一致，请重新设置";
            gestureLock.viewStatus("error", {ring: true});
            $timeout(function () {
              gestureLock.reset();
            }, 500);
          }
        }
        ++count;
      }
    };
    gestureLock.init();
    angular.element($window).bind('resize', function () {
      gestureLockCanvas.width = window.innerWidth < (window.innerHeight - 200) ? window.innerWidth : (window.innerHeight - 200);
      gestureLockCanvas.height = gestureLockCanvas.width;
      gestureLock.init();
    });
    var oldPassword = GestureLockService.getPassword();
    $scope.goBack = function () {
      $ionicHistory.goBack();
    }
  })

  .controller('SignInGestureLockCtrl', function ($scope, $state, $gestureLock, $timeout, GestureLockService, $window) {

    $scope.title = "输入密码";

    var password = GestureLockService.getPassword();

    var gestureLockCanvas = document.getElementById("gestureLock0");
    gestureLockCanvas.width = window.innerWidth < (window.innerHeight - 250) ? window.innerWidth : (window.innerHeight - 250);
    gestureLockCanvas.height = gestureLockCanvas.width;

    var gestureLock = new $gestureLock(gestureLockCanvas, {
      matrix: 3
    });

    gestureLock.gestureStart = function (e) {
      return;
    };

    gestureLock.gestureEnd = function (e) {

      var validateResult = gestureLock.validatePassword(password, gestureLock.getGesturePassword());

      if (validateResult) {
        gestureLock.viewStatus("success", {ring: true});
        $timeout(function () {
          gestureLock.reset();
        }, 500);
      } else {
        gestureLock.viewStatus("error", {ring: true});
        $timeout(function () {
          gestureLock.reset();
        }, 500);
      }
    };

    gestureLock.init();

    angular.element($window).bind('resize', function () {
      gestureLockCanvas.width = window.innerWidth < (window.innerHeight - 200) ? window.innerWidth : (window.innerHeight - 200);
      gestureLockCanvas.height = gestureLockCanvas.width;
      gestureLock.init();
    });

  })

  .controller('SetGestureLockCtrl', function ($scope, $state, $gestureLock, $timeout, GestureLockService, $window) {
    if (null == window.localStorage.getItem('GestureLockPassword')) {
      $scope.title = "设置密码";
      var passwords = [2];
      var count = 1;
      var gestureLockCanvas = document.getElementById("gestureLock");

      function getWidth() {
        if (window.innerWidth < window.innerHeight) {
          return window.innerWidth;
        } else {
          return window.innerHeight - 200;
        }
      }

      gestureLockCanvas.width = window.innerWidth < (window.innerHeight - 250) ? window.innerWidth : (window.innerHeight - 250);
      gestureLockCanvas.height = gestureLockCanvas.width;
      var gestureLock = new $gestureLock(gestureLockCanvas, {
        matrix: 3
      });
      gestureLock.gestureEnd = function (e) {
        passwords[count % 2] = gestureLock.getGesturePassword();

        // 输入单次了
        if (count % 2 === 1) {
          gestureLock.viewStatus("success", {ring: true});
          $scope.title = "请在输入一次";
          $timeout(function () {
            gestureLock.reset();
          }, 500);
        } else if (count % 2 === 0) {
          if (gestureLock.validatePassword(passwords[0], passwords[1])) {
            gestureLock.viewStatus("success", {ring: true});
            GestureLockService.setPassword(passwords[0]);

            $scope.title = "设置成功";
            $timeout(function () {
              //gestureLock.reset();
              $state.go('tab.allnotes');
            }, 500);
          } else {
            $scope.title = "两次设置不一致，请重新设置";
            gestureLock.viewStatus("error", {ring: true});
            $timeout(function () {
              gestureLock.reset();
            }, 500);
          }
        }
        ++count;
      };
      $timeout(function () {
        gestureLock.init();
      }, 500);
      angular.element($window).bind('resize', function () {
        gestureLockCanvas.width = window.innerWidth < (window.innerHeight - 250) ? window.innerWidth : (window.innerHeight - 250);
        gestureLockCanvas.height = gestureLockCanvas.width;
        gestureLock.init();
      });
    } else {
      $state.go('tab.allnotes');
    }
  })

  .controller('AboutCtrl', function ($scope, $ionicHistory) {
    $scope.logo = 'img/icon.png';
    $scope.goBack = function () {
      $ionicHistory.goBack();
    };
  })

  .controller('QuestionCtrl', function ($scope) {
    $scope.remove = function () {

    };
  })

  .controller('HomeCtrl', function ($scope, $ionicPopup) {
    $scope.homeImg = 'img/homeImg.png';
    $scope.yyzx = 'img/1-1.png';
    $scope.ycwz = 'img/1-2.png';
    $scope.dzbl = 'img/2-1-1.png';
    $scope.fjyd = 'img/2-2-1.png';
    $scope.ypzs = 'img/2-1-2-1.png';
    $scope.zjzx = 'img/2-1-2-2.png';
    $scope.showAlert = function ($msg) {
      var alertPopup = $ionicPopup.alert({
        title: $msg
      });
    }
  })

  .controller('DemoCtrl', function ($scope, $state) {
    $scope.img1 = "img/demo.png"
    var count = 0;
    $scope.slide = function () {
      if (count == 1) {
        $scope.img1 = "img/demo.png";
        count = 0;
        $state.go('tab.setting');
      } else {
        $scope.img1 = "img/demo2.png"
        count++;
      }
    }

  });
