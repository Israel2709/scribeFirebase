'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:SwipeCtrl
 * @description
 * # SwipeCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
    .directive('myRepeatDirective', function() {
        return function(scope, element, attrs) {
            if (scope.$last) {
                $("#swipe-wrapper").css("display", "block");
                $(".congrats").css("display", "none");
                setTimeout(function() {
                    scope.initJtinder();
                }, 400);
            }
        };
    })




.controller('SwipeCtrl', function($document, $scope, $http, Fact, $timeout) {
    this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
    ];

    //varible para mostrar las diferentes capas dependiendo del contendino
    $scope.selection;



    //arreglo donde se guardan los like y dislikes de las imagenes
    $scope.ObjectLike = {
        "like": [],
        "dislike": []
    };

    $scope.detailElement;

    var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();

    // Create a child reference
    var imagesRef = storageRef.child('images');
    // imagesRef now points to 'images'

    var database = firebase.database();

    $("#collection-modal").modal("show")
    $("#collection-modal").on("hidden.bs.modal", function(e) {
        $('#swipe-wrapper').unbind().removeData();
        $scope.initJtinder()
        console.log("closing modal")
    })

    //arreglo que guarda la lista de libretas
    $scope.collectionNotebooks = {};

    $("#collection-modal").modal("show")

    var selectedCollection;

    //función para inicializar el plug in de tinder.
    $scope.initJtinder = function() {
        $("#swipe-wrapper").jTinder({
            onDislike: function(item) {
                /*  console.log("item: "+ item);*/
                $('#status').html('Dislike image ' + (item.index() + 1));
                fillObject("dislike", item);
                $(item).addClass("disliked");

                //elimina del arreglo el elemento que ya fue evaluado, esto para que cuando cambiemos de pantalla y regresemos no se esten rpesentando los
                //todos aunque ya los hayamos evaluado
                /*$scope.collectionNotebooks.forEach(function(index, value) {
                    if ($scope.collectionNotebooks[value].id == item.data("id")) {
                        $scope.collectionNotebooks.splice(value, 1)
                    }
                }, this);*/
            },
            onLike: function(item) {
                $('#status').html('Like image ' + (item.index() + 1));
                fillObject("like", item);
                $(item).addClass("liked")

                /*$scope.collectionNotebooks.forEach(function(index, value) {
                    if ($scope.collectionNotebooks[value].id == item.data("id")) {
                        $scope.collectionNotebooks.splice(value, 1)
                    }
                }, this);*/
            },
            animationRevertSpeed: 200,
            animationSpeed: 400,
            threshold: 1,
            likeSelector: '.like',
            dislikeSelector: '.dislike'
        });

        $('.actions .like, .actions .dislike').click(function(event) {
            event.preventDefault();
            $("#swipe-wrapper").jTinder($(this).attr('class'));
        });
    }

    $scope.changeView = function(value, image) {
        $scope.selection = value;
        if ($scope.selection == "preferences") {
            setTimeout(function() {
                $scope.fillPreferencesList('like');
            }, 600);

        } else if ($scope.selection == "content") {
            //$("#collection-modal").modal("show")

            if ($scope.collectionNotebooks.length == 0) {
                $("#collection-modal").modal("show")
            }
        }
        /* else {
                $scope.detailElement = image;
                setTimeout(function() {
                    $("#img-detail").attr("src", "https://luisvardez.000webhostapp.com/" + image.notebooks.coverSource);
                    $(".title-note").text(image.notebooks.name);
                    $(".counterLikes").text(image.notebooks.like);
                    $(".descriptionNote").text(image.notebooks.descripcion)
                }, 200);
              }*/



    }


    $scope.getCollectionNotebooks = function(selectedCollection) {
        var starCountRef = firebase.database().ref('collections/' + selectedCollection + "/notebooks");
        starCountRef.on('value', function(snapshot) {
            var knowArray = snapshot.val()
            $scope.collectionNotebooks = []
            $.each(knowArray, function(indice, valor) {
                var seeNotebooksData = firebase.database().ref('notebooks/' + valor)
                seeNotebooksData.once('value').then(function(snapshot) {
                    var knowData = snapshot.val()
                    $timeout(function() {
                        $scope.collectionNotebooks.push({
                            id: valor,
                            coverSource: knowData.coverSource,
                            name: knowData.name,
                            key: indice,
                            likes: knowData.likes,
                            dislike: knowData.dislikes,
                            likedToFemale: knowData.likeFemale,
                            likedToMale: knowData.likeMale,
                            userAgeA: knowData.ageA,
                            userAgeB: knowData.ageB
                        })
                    });
                });
            });
        });
    }

    $scope.changeView('content');


    function fillObject(category, item) {
        if (category == "like") {
            eval("$scope.ObjectLike." + category + ".push({\"coleccion\":item.data(\"coleccion\"),\"nombre\":item.data(\"nombre\"),\"imagen\":item.data(\"imagen\"),\"likedToMale\":item.data(\"likedToMale\"),\"likedToFemale\":item.data(\"likedToFemale\"),\"like\":item.data(\"like\")})");
            $scope.getSelectedNotebook(item.data('id'), category);
        } else {
            eval("$scope.ObjectLike." + category + ".push({\"coleccion\":item.data(\"coleccion\"),\"nombre\":item.data(\"nombre\"),\"imagen\":item.data(\"imagen\"),\"likedToMale\":item.data(\"likedToMale\"),\"likedToFemale\":item.data(\"likedToFemale\"),\"dislike\":item.data(\"dislike\"),\"like\":item.data(\"like\")})");
            $scope.getSelectedNotebook(item.data('id'), category);
        }

    }

    //funciones manipulación de vista
    $scope.toggleHeaderBtn = function(btn) {
        $(".header .btn").addClass("hidden");
        $(btn).toggleClass("hidden");
    }

    $scope.changeContainer = function() {
        $(".img-logo").toggleClass("hidden");
        if ($(".main-container").hasClass("container")) {
            $(".main-container").removeClass("container");
            $(".main-container").addClass("container-fluid");
            $(".main-container .header").addClass("displayN")
        } else {
            $(".main-container").addClass("container");
            $(".main-container").removeClass("container-fluid");
            $(".main-container .header").removeClass("displayN")
        }
    }

    //NOTA: NO ESTA PASANDO LA REFERENCIA DEL ELEMENTO AL QUE SE ESTA DANDO CLICK, AL PARECER POR LA REFERENCIA DE NG-CLICK... VALIDAR
    $scope.togglePreferencesList = function(event) {
        var target = $(event.target)
        $(".preferences-control .btn").removeClass("active");
        target.addClass("active");
    }

    $scope.fillPreferencesList = function(listType) {
        var selectedList;
        switch (listType) {
            case "like":
                selectedList = $scope.ObjectLike.like;
                break;
            case "dislike":
                selectedList = $scope.ObjectLike.dislike;
                break;
        }
        $(".list-wrapper").empty();
        var selectedCard = "";
        var contador = 0;
        for (var i = 0; i < selectedList.length; i++) {
            /*var back = ["Aquamarine", "blue", "gray", "red", "yellow", "pink", "coral", "cyan", "DarkMagenta", "gold", "HoneyDew", "LightBlue"];*/
            /* var rand = back[Math.floor(Math.random() * back.length)];*/
            if (contador == 0) {
                selectedCard += "<div class='row'>";
            }
            selectedCard += "<div class='col-xs-6 col-sm-4'>" +
                "<div class='list-card'>" +
                "<div class='content-image'>" +
                "<img src='" + selectedList[i].imagen + "' alt=''></div>" +
                "<div class='detail-card'><p class='card-name'>" + selectedList[i].nombre + "</p>" +
                "<div class='like-count'>" +
                "<span class='counter'>" + selectedList[i].like + "</span>" +
                "<div class='like-btn'></div></div>" +
                "</div>" +
                "</div>" +
                "</div>";

            contador++;
            if ($(window).width() < 420) {
                if (contador == 2) {
                    selectedCard += "</div>";
                    contador = 0;
                }
            } else {
                if (contador === 3) {
                    selectedCard += "</div>";
                    contador = 0;
                }
            }
        }
        $(".list-wrapper").append(selectedCard);
    }

    $scope.collectionsList;
    $scope.pruebasArray = []

    $scope.getCollectionList = function() {
        $(".full-overlay").removeClass("hidden")
        $(".full-overlay img").addClass(".rotate")
        var contador = 0;
        var starCountRef = firebase.database().ref('collections/');
        starCountRef.once('value').then(function(snapshot) {
            var knowArray = snapshot.val()
            console.log(snapshot)
            $timeout(function() {
                $scope.pruebasArray = []
            });
            $.each(knowArray, function(indice, valor) {
                 if(valor.block == "N"){
                    contador = contador + 1;
                 }
            });
            $.each(knowArray, function(indice, valor) {
                if(valor.block == "N"){
                    $timeout(function() {
                        $scope.pruebasArray.push({
                            id_collection: indice,
                            coverUrl: valor.coverUrl,
                            name: valor.name
                        })
                        if(contador == $scope.pruebasArray.length){
                            $timeout(function() {
                                $(".porcent-upload").text("100%")
                            }, 500);
                            $timeout(function() {
                                $(".full-overlay").addClass("hidden")
                                $(".full-overlay img").removeClass(".rotate")
                                $(".porcent-upload").text("0%")
                            }, 800);  
                        }
                        else if($scope.pruebasArray.length != 0 && contador != $scope.pruebasArray.length){
                            $timeout(function() {
                                $(".porcent-upload").text("50%")
                            }, 300);
                        }
                    });
                }
            });
        });
    }

    $scope.getCollectionList();

    $scope.selectCollection = function(selected, target) {
        var target = $(event.target);
        $scope.getCollectionNotebooks(selected);
        target.css("opacity", "0.5");
        target.parent().unbind().removeData();
        $("#collection-modal").modal("hide");
    }




    $scope.selectionGender = Fact.userGender.gender
    $scope.selectionAges = Fact.userAge.age

    $scope.getSelectedNotebook = function(idNote, statusLikes) {
        var likes, dislikes, likedFemale, likedMale;
        var likedAgeA, likedAgeB;
        var currentNotebookId;

        currentNotebookId = idNote
        var seeNotebooksData = firebase.database().ref('notebooks/' + idNote)
        seeNotebooksData.once('value').then(function(snapshot) {
            var knowData = snapshot.val()
            likes = knowData.likes
            dislikes = knowData.dislikes
            likedFemale = knowData.likeFemale
            likedMale = knowData.likeMale
            likedAgeA = knowData.ageA
            likedAgeB = knowData.ageB
            switch (statusLikes) {
                case 'like':
                    likes = likes + 1;

                    if ($scope.selectionGender == "H") {
                        likedMale = likedMale + 1;
                    } else {
                        likedFemale = likedFemale + 1;
                    }
                    if ($scope.selectionAges < 20) {
                        likedAgeA = likedAgeA + 1
                    } else {
                        likedAgeB = likedAgeB + 1
                    }
                    break;
                case 'dislike':
                    dislikes = dislikes + 1
                    break;
            }
            $scope.updateLikes(currentNotebookId, likes, dislikes, likedFemale, likedMale, likedAgeA, likedAgeB);
        });

    }

    $scope.updateLikes = function(id, countL, countD, countF, countM, countAgeA, countAgeB) {
        /*HACER EL UPDATE*/
        var newInfo = {
            likes: countL,
            dislikes: countD,
            likeFemale: countF,
            likeMale: countM,
            ageA: countAgeA,
            ageB: countAgeB
        }

        firebase.database().ref('notebooks/' + id).update(newInfo)
    }

    $scope.reduceLikes = function() {
        var lastItem = $(".pane:hidden:eq(0)")
        var lastId = $(".pane:hidden:eq(0)").data("id")
        var lastLikes = $(".pane:hidden:eq(0)").data("like")
        var lastDislikes = $(".pane:hidden:eq(0)").data("dislike")
        var lastFemales = $(".pane:hidden:eq(0)").data("likedtofemale")
        var lastMales = $(".pane:hidden:eq(0)").data("likedtomale")
        var lastAgeA = $(".pane:hidden:eq(0)").data("useragea")
        var lastAgeB = $(".pane:hidden:eq(0)").data("userageb")

        var lastInfo = {
            likes: lastLikes,
            dislikes: lastDislikes,
            likeFemale: lastFemales,
            likeMale: lastMales,
            ageA: lastAgeA,
            ageB: lastAgeB
        }

        firebase.database().ref('notebooks/' + lastId).update(lastInfo)
    }

    $scope.showAction = function(action) {

        eval("$scope.ObjectLike." + action + ".push({\"coleccion\":$scope.detailElement.notebooks.collection,\"nombre\":$scope.detailElement.notebooks.name,\"imagen\":$scope.detailElement.notebooks.coverSource,\"like\":$scope.detailElement.notebooks.like})");

        $scope.getSelectedNotebook($scope.detailElement.notebooks.id);
        $scope.collectionNotebooks.forEach(function(index, value) {
            if ($scope.collectionNotebooks[value].id == $scope.detailElement.notebooks.id) {
                $scope.collectionNotebooks.splice(value, 1)
            }
        }, this);

        $(".detail-button a").unbind().removeData();

        $(".detail-button a").click(function(event) {
            event.preventDefault();
        });


        $(".detail-wrapper .card-text").css("opacity", "0");
        $(".detail-wrapper ." + action).css("opacity", "1").queue(function() {
            setTimeout(function() {
                angular.element('.btn-back-white').triggerHandler('click');
            }, 500);
        });

    }

    $scope.undoSelection = function() {
        $scope.cardsEvaluated = $(".pane:hidden").length
        if ($scope.cardsEvaluated == 0) {
            console.log("no disponible")
            return false
        } else {
            $scope.reduceLikes()
            $('#swipe-wrapper').jTinder('undo');
            //console.log("id "+currentNotebookId+" likes "+likes+" dislikes "+dislikes+ " liked Female "+likedFemale+" likedMale "+likedMale+" ageA "+ageA+" ageB "+ageB)
            //$scope.reduceLikes(currentNotebookId, likes, dislikes, likedFemale, likedMale, ageA, ageB)

        }
    }

    $scope.viewOtherCollection = function() {
        $("#swipe-wrapper, .reload-btn, .show-filter").show();
        $(".finish-step").addClass("hidden")
        $('#collection-modal').modal('show')
    }

});