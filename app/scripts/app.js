'use strict';

/**
 * @ngdoc overview
 * @name scribeApp
 * @description
 * # scribeApp
 *
 * Main module of the application.
 */
angular
  .module('scribeApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'backand',
    'chart.js'
    ])


  .config(function ($routeProvider,BackandProvider,$locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/uploadform', {
        templateUrl: 'views/uploadform.html',
        controller: 'UploadformCtrl',
        controllerAs: 'uploadForm'
      })
      .when('/upload-collection', {
        templateUrl: 'views/uploadform.html',
        controller: 'UploadformCtrl',
        controllerAs: 'uploadForm'
      })
      .when('/upload-notebook', {
        templateUrl: 'views/uploadform.html',
        controller: 'UploadformCtrl',
        controllerAs: 'uploadForm'
      })
      .when('/swipe', {
        templateUrl: 'views/swipe.html',
        controller: 'SwipeCtrl',
        controllerAs: 'swipe'
      })

      .when('/finish', {
        templateUrl: 'views/finish.html',
        controller: 'FinishCtrl',
        controllerAs: 'finish'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl',
        controllerAs: 'admin'
      })
      .when('/newnotebook', {
        templateUrl: 'views/newnotebook.html',
        controller: 'NewnotebookCtrl',
        controllerAs: 'newnotebook'
      })
      .when('/stats', {
        templateUrl: 'views/stats.html',
        controller: 'StatsCtrl',
        controllerAs: 'stats'
      })
      .when('/loginAdmin', {
        templateUrl: 'views/loginadmin.html',
        controller: 'LoginadminCtrl',
        controllerAs: 'loginAdmin'
      })
      .when('/config', {
        templateUrl: 'views/config.html',
        controller: 'ConfigCtrl',
        controllerAs: 'config'
      })
      .otherwise({
        redirectTo: '/'
      });

      BackandProvider.setAppName('scribe');
      BackandProvider.setSignUpToken('1a6494b3-0874-4ca7-81e4-abebda17f6d1');
      BackandProvider.setAnonymousToken('a3cacd9a-831f-4aa8-8872-7d80470a000e');    

      $locationProvider.hashPrefix('');
 
  }).factory('Fact',function(){
       return {
         userGender: {
          gender: ""
         },
         userAge: {
          age: ""
         },
         userAdmin: {
          id: null
         },
         collectionDetail: {
          id: null
         }
       }
    });