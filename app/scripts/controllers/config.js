'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:ConfigCtrl
 * @description
 * # ConfigCtrl
 * Controller of the scribeApp
 */

/*
CHECAR FOOR -1 EN EL LENGTH*/

angular.module('scribeApp').controller('ConfigCtrl', function ($scope, Fact, $http, upload, $timeout) {
    this.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];

    $scope.urlUpload = "https://luisvardez.000webhostapp.com/upload.php";

    $scope.selection = 'edit-profile';
    $scope.password;
    //variable en la cual se guarda el resultado de la petición al guardar imagen en el servidor
    $scope.resUploadFile;

    $scope.selectionUser = Fact.userAdmin.id;
    console.log($scope.selectionUser);

    $scope.changeView = function (value, nav) {
        $scope.selection = value;
        if ($scope.selection == "edit-profile") {
            $scope.getDataUser();
            $scope.activeModule(nav);
        } else if ($scope.selection == "change-pass") {
            $scope.getDataUser();
            $scope.activeModule(nav);
        } else {
            $scope.activeModule(nav);
        }
    };

    $scope.activeModule = function (target) {
        var target = $(event.target);
        $(".menu2").removeClass("active");
        target.addClass("active");
    };

    $scope.checking = function (input) {
        $(input).closest("label").toggleClass("correct");
    };

    $scope.getDataUser = function () {
        console.log($scope.selectionUser);
        var starCountRef = firebase.database().ref('users/' + $scope.selectionUser);
        starCountRef.on('value', function (snapshot) {
            var knowArray = snapshot.val();
            $("#name").val(knowArray.name);
            $scope.changeName = knowArray.name;
            $scope.password = knowArray.password;
        });
    };

    $scope.getDataUser();

    $scope.removeDisabled = function () {
        var name = $("#name").val();
        var newPass = $("#new-pass").val();
        var confirmNew = $("#confirm-pass").val();
        var oldPass = $("#old-pass").val();
        if (newPass == "" || confirmNew == "" || oldPass == "") {
            $("#change-profile").prop("disabled", true);
            if (name == $scope.changeName) {
                $("#change-profile").prop("disabled", true);
            } else {
                $("#change-profile").prop("disabled", false);
            }
        } else {
            $("#change-profile").prop("disabled", false);
        }
    };

    $scope.changeProfile = function () {
        $scope.changeName = $("#name").val();
        var newPass = $("#new-pass").val();
        var confirmNew = $("#confirm-pass").val();
        var oldPass = $("#old-pass").val();
        if (newPass.length == 0 && confirmNew.length == 0 && oldPass.length == 0) {
            $(".full-overlay").removeClass("hidden");
            firebase.database().ref('users/' + $scope.selectionUser).update({
                name: $scope.changeName
            });
            $(".full-overlay").addClass("hidden");
            $("#submitCorrect").modal("show");
            $("#change-profile").prop("disabled", true);
            $timeout(function () {
                $("#submitCorrect").modal("hide");
            }, 2000);
        } else {
            if (newPass.length == 0 || confirmNew.length == 0 || oldPass.length == 0) {
                $(".enter").removeClass("hidden").text("Llenar todos los campos.");
            } else {
                if (oldPass == $scope.password) {
                    if (newPass == confirmNew) {
                        console.log($scope.selectionUser);
                        $(".full-overlay").removeClass("hidden");
                        firebase.database().ref('users/' + $scope.selectionUser).update({
                            name: $scope.changeName,
                            password: confirmNew
                        });
                        $(".full-overlay").addClass("hidden");
                        $("#submitCorrect").modal("show");
                        $("#change-profile").prop("disabled", true);
                        $("#new-pass, #confirm-pass, #old-pass").val("");
                        $(".enter").addClass("hidden").text("");
                        $timeout(function () {
                            $("#submitCorrect").modal("hide");
                        }, 2000);
                    } else {
                        $(".enter").removeClass("hidden").text("Contraseña nueva no coincide.");
                    }
                } else {
                    $(".enter").removeClass("hidden").text("Contraseña actual incorrecta.");
                }
            }
        }
    };
});