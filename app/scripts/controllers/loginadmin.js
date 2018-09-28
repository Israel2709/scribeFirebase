'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:LoginadminCtrl
 * @description
 * # LoginadminCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
    .controller('LoginadminCtrl', function($scope, $http, Fact, $filter, $timeout) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.collectionsList;
        $scope.userMails = [];

        $scope.selection = "login";

        $scope.changeBG = function() {
            $(".header img").addClass("marginTAdmin")
            $("body").prepend("<div class='bgLogin'></div>")
        }

        $scope.checking = function() {
            $(".form-check-label").toggleClass("correct")
        }


        $scope.changeBG();

        $scope.changeView = function(value) {
            $scope.selection = value;
            if ($scope.selection == "login") {
                return false;
            } else if ($scope.selection == "forgot-password") {
                return false;
            } else {
                return false;
            }

        }

        $scope.returnLogin = function() {
            $scope.changeView('login')
            $timeout(function() {
                $(".forgot").addClass("hidden")
            }, 10);
        }

        $scope.sendPass = function() {
            $scope.email2 = $("#email2").val();
            var caract = new RegExp(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{3})+$/);
            var caractFalse = new RegExp(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z]{4,})+$/);
            if (caract.test($scope.email2) == true) {
                $scope.changeView('send');
            } else {
                $(".email-forgot").removeClass("hidden").text("Ingrese correo eléctronico")
                if (caractFalse.test($scope.email2) == true) {
                    $(".email-forgot").removeClass("hidden").text("Correo incorrecto")
                }
            }
        }

        $scope.getCollectionList = function() {
            var starCountRef = firebase.database().ref('users');
            starCountRef.on('value', function(snapshot) {
                var knowArray = snapshot.val()
                $scope.collectionNotebooks = []
                $.each(knowArray, function(indice, valor) {
                    $timeout(function() {
                        $scope.userMails.push({
                            id: indice,
                            email: valor.email,
                            password: valor.password
                        })
                    });
                });
            });
            console.log($scope.userMails)
        }

        $scope.getCollectionList();



        $scope.accessAdmin = function() {
            var i;
            $scope.email = $("#email").val();
            $scope.password = $("#password").val();

            $scope.readEmail = $filter('filter')($scope.userMails, {
                email: $scope.email
            })[0];
            if ($scope.readEmail) {
                if ($scope.password == $scope.readEmail.password) {
                    $(".bgLogin").remove()
                    $(".header img").removeClass("marginTAdmin")
                    $(".red-btn").removeClass("disabled")
                    $(".enter").addClass("hidden").text("")
                    window.location = "#/admin";
                    $scope.userEnter = Fact.userAdmin.id = $scope.readEmail.id;
                    console.log($scope.userEnter)
                } else {
                    $(".enter").removeClass("hidden").text("La contraseña es incorrecta")
                }
            } else {
                $(".enter").removeClass("hidden").text("El correo no existe")
            }
        }

    });