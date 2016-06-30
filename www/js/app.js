// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'onezone-datepicker', 'ui.gestureLock'])

  .run(function ($ionicPlatform, $cordovaSQLite, $rootScope) {
    $ionicPlatform.ready(function () {
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
      // 调出输入法的时候tab自动隐藏
      window.addEventListener('native.keyboardshow', function () {
        document.querySelector('div.tabs').style.display = 'none';
        angular.element(document.querySelector('ion-content.has-tabs')).css('bottom', 0);
      });
      window.addEventListener('native.keyboardhide', function () {
        var tabs = document.querySelectorAll('div.tabs');
        angular.element(tabs[0]).css('display', '');
      });
      window.addEventListener("backbutton", function (e) {
        e.preventDefault();
        console.log("hello");
      });

      // https://blog.nraboy.com/2014/11/use-sqlite-instead-local-storage-ionic-framework/
      db = $cordovaSQLite.openDB({name: "notepad.db", bgType: 1});
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS records (id integer primary key, title TEXT, content TEXT, year int, month int, day int, weekday TEXT, time TEXT,encoded TEXT,datetime Text)");

    });
    $ionicPlatform.registerBackButtonAction(function (e) {

      e.preventDefault();

      function showConfirm() {
        var confirmPopup = $ionicPopup.confirm({
          title: '<strong>退出应用?</strong>',
          template: '你确定要退出应用吗?',
          okText: '退出',
          cancelText: '取消'
        });

        confirmPopup.then(function (res) {
          if (res) {
            ionic.Platform.exitApp();
          } else {
            // Don't close
          }
        });
      }

      // Is there a page to go back to?
      if ($location.path() == '/home' ) {
        showConfirm();
      } else if ($rootScope.$viewHistory.backView ) {
        console.log('currentView:', $rootScope.$viewHistory.currentView);
        // Go back in history
        $rootScope.$viewHistory.backView.go();
      } else {
        // This is the last page: Show confirmation popup
        showConfirm();
      }

      return false;
    }, 101);
  })
  .config(function ($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');
    // note that you can also chain configs
    $ionicConfigProvider.backButton.disabled;
    //$ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');
  })
  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

      .state('set-pwd',{
        url: '/set-pwd',
        templateUrl: 'templates/pwd-set.html',
        controller: 'SetGestureLockCtrl'
      })


      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:
      .state('tab.personal', {
        url: '/personal',
        cache:'false',
        views: {
          'tab-personal': {
            templateUrl: 'templates/tab-personal.html',
            controller: 'PersonalCtrl'
          }
        }
      })
      .state('tab.allnotes', {
        url: '/allnotes',
        cache:'false',
        views: {
          'tab-allnotes': {
            templateUrl: 'templates/tab-allnotes.html',
            controller: 'AllNotesCtrl'
          }
        }
      })
      .state('tab.setting', {
        url: '/setting',
        views: {
          'tab-setting': {
            templateUrl: 'templates/tab-setting.html',
            controller: 'SettingCtrl'
          }
        }
      })



      .state('addnote',{
        url: '/addnote',
        cache:'false',
        templateUrl: 'templates/add-note.html',
        controller: 'AddnoteCtrl'
      })
      .state('reset-pwd',{
        url: '/reset-pwd',
        cache:'false',
        templateUrl: 'templates/pwd-reset.html',
        controller: 'ResetGestureLockCtrl'
      })
      .state('sign-in',{
        url: '/sign-in',
        cache:'false',
        templateUrl: 'templates/sign-in.html',
        controller: 'SignInGestureLockCtrl'
      })
      .state('question',{
        url: '/question',
        cache:'false',
        templateUrl: 'templates/question.html',
        controller: 'QuestionCtrl'
      })
      .state('about',{
        url: '/about',
        templateUrl: 'templates/about.html',
        controller: 'AboutCtrl'
      })
      .state('demo',{
        url: '/demo',
        templateUrl: 'templates/demo.html',
        controller: 'DemoCtrl'
      })
      .state('login',{
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/set-pwd');

  });
