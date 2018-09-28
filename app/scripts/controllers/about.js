'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')

  .controller('AboutCtrl', function ($scope, $http, Fact) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


    $scope.edad;
    $scope.genero;
    $scope.mapa_lat;
    $scope.mapa_long;
   
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        $scope.$apply(function(){
          $scope.mapa_lat = position.coords.latitude;
          $scope.mapa_long = position.coords.longitude;

        });
      });
    }
    
    $(".genero img").click(function () {
      $scope.genero = $(this).data("genero");

      if($scope.genero == "H"){
        $(this).attr("src","images/card-men_selected.svg");
        $(".genero img[data-genero='M']").attr("src","images/card-woman.svg");
        $scope.selectedEvent = Fact.userGender.gender = "H";
      }else{
         $(this).attr("src","images/card-woman_selected.svg");
         $(".genero img[data-genero='H']").attr("src","images/card-men.svg");
        $scope.selectedEvent = Fact.userGender.gender = "M";
      }

      $(".genero img").css("transform", "scale(1)");
      
      $(this).css({
        transform: "scale(1.25)"
      });
    });

    $scope.readAge = function(input){
      $scope.selectedAges = Fact.userAge.age =  input;
    }

    $scope.sendDataUser =  function(button){
      var ages = $(".age-input").val()
      if(ages.length != 0 && $scope.userGender != ""){
         window.location = "#/swipe";
          /*$http({
            method:'POST',
            url: 'https://api.backand.com:443/1/objects/user',
            data:{
              age:$scope.edad,
              gender:$scope.genero,
              latitud:$scope.mapa_lat,
              longitud:$scope.mapa_long
            },
            headers: {
              AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
            }
          }).then(
            function (response) {
              console.log(response.data);
            },
            function (response) {
              alert("error")
            });*/
      }
      else{
        return false;
      }
    }

  });
