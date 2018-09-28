'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the scribeApp
 */

angular.module('scribeApp').controller('AdminCtrl', function ($scope, $http, $timeout, upload, Fact) {
    this.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];

    //Esto es lo que ya tenia

    $scope.selections = "see-collections";

    $scope.collection = {};
    $scope.collectionsList;
    $scope.collectionsNames = [];
    $scope.notebookObject = {};

    $scope.collectionSelected;

    $scope.selectedCollection = Fact.collectionDetail.id = null;

    $scope.resUploadFile;
    $scope.newIdCollect;

    //Nuevas variables

    $scope.pruebasArray = [];

    //Pruebas con firebase

    // Initialize Firebase


    var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();

    // Create a child reference
    var imagesRef = storageRef.child('images');
    // imagesRef now points to 'images'

    var database = firebase.database();

    $scope.changeView = function (select) {
        if (select == 'see-collections') {
            $scope.selections = "see-collections";
            $scope.selectedCollection = Fact.collectionDetail.id = null;
        } else if (select == 'new-collections') {
            $scope.selections = 'new-collections';
            $scope.collection = {};
            /* $scope.collectionsList;*/
            $scope.collectionsNames = [];
            $scope.notebookObject = {};
            $scope.getCollectionList();

            $scope.collectionSelected;

            $scope.selectedCollection = Fact.collectionDetail.id = null;

            $scope.resUploadFile;
            $scope.newIdCollect;
            $(".collectModal").removeClass("hidden");
            $(".notesModal").addClass("hidden");
        } else {
            $scope.selections = 'data-collections';
            $scope.getCollectionList();
            $(".collectModal").addClass("hidden");
            $(".notesModal").removeClass("hidden");
            $timeout(function () {
                $scope.views($scope.viewNotes);
            }, 300);
            $("#return-data").on("click", function () {
                $scope.changeView('see-collections');
            });
        }
    };

    $scope.getCollectionList = function () {
        $(".full-overlay").removeClass("hidden");
        $(".full-overlay img").addClass(".rotate");
        var starCountRef = firebase.database().ref('collections/');
        starCountRef.on('value', function (snapshot) {
            var knowArray = snapshot.val();
            var lengthArray = snapshot.numChildren();
            $timeout(function () {
                $scope.pruebasArray = [];
            });
            $.each(knowArray, function (indice, valor) {
                $timeout(function () {
                    $scope.pruebasArray.push({
                        id_collection: indice,
                        coverUrl: valor.coverUrl,
                        name: valor.name,
                        blocked: valor.block
                    });
                    if (lengthArray == $scope.pruebasArray.length) {
                        $timeout(function () {
                            $(".porcent-upload").text("100%");
                        }, 500);
                        $timeout(function () {
                            $(".full-overlay").addClass("hidden");
                            $(".full-overlay img").removeClass(".rotate");
                            $(".porcent-upload").text("0%");
                        }, 800);
                    } else if ($scope.pruebasArray.length != 0 && lengthArray != $scope.pruebasArray.length) {
                        $timeout(function () {
                            $(".porcent-upload").text("50%");
                        }, 300);
                    }
                });
            });
            $scope.listCollectionNames();
        });
    };

    $scope.removeDisabled = function () {
        var submitImage = $(".view-image").attr("src");
        $scope.addNotebook = $("#news-notes").find("input.listo");
        if ($scope.collection.name == "" || submitImage == "#" || $scope.collection.name == undefined || $scope.addNotebook.length != $scope.longMultiple) {
            $("#submit-button").prop("disabled", true);
        } else {
            $("#submit-button").prop("disabled", false);
        }
    };

    $scope.listCollectionNames = function () {
        var i;
        $scope.collectionsNames = [];
        for (i = 0; i < $scope.pruebasArray.length; i++) {
            $scope.collectionsNames.push($scope.pruebasArray[i].name);
        }
    };

    $scope.getCollectionList();

    $scope.openFileDialog = function (idBtn) {
        $(idBtn).trigger("click");
    };

    $scope.idNewCollection;

    $scope.uploadCollection = function () {
        if ($.inArray($scope.collection.name, $scope.collectionsNames) > -1) {
            alert("la coleccion ya existe");
            return false;
        } else {
            $(".full-overlay").removeClass("hidden");
            $(".full-overlay img").addClass(".rotate");
            $(".action-upload").text("Creando colección");
            var esperoFuncione = $scope.collection.name;
            var collectionImg = $("#picture").prop("files")[0];
            console.log(collectionImg.name);
            var imageRefName = storageRef.child(collectionImg.name);
            var imagesRefName = storageRef.child('collectionCovers/' + collectionImg.name);
            var uploadTask = imagesRefName.put(collectionImg);
            uploadTask.on('state_changed', function (snapshot) {
                var progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                $timeout(function () {
                    $(".porcent-upload").text(progress + "%");
                }, 500);
            }, function (error) {
                $(".full-overlay").addClass("hidden");
                $(".full-overlay img").removeClass(".rotate");
                $(".porcent-upload").text("0%");
                console.log(error);
            }, function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    console.log(downloadURL);
                    var collectionCover = downloadURL;
                    var collectionObject = {
                        name: esperoFuncione,
                        coverUrl: collectionCover,
                        block: "N"
                    };
                    var collectionId = firebase.database().ref('collections/').push(collectionObject).key;
                    $scope.globalCollection = collectionId;
                    for (var i = 0; i < $scope.longMultiple; i++) {
                        $scope.transformImages('pictures', i);
                    }
                    $(".list-box").each(function (index) {
                        $scope.uploadNotebook(collectionId, this, index);
                    });
                    $scope.collection.name = "";
                    $scope.getCollectionList();
                    $("#picture").val("");
                    $(".view-image").attr("src", "#").addClass("hidden");
                    $("#submit-button").prop("disabled", true);
                    $(".full-overlay").addClass("hidden");
                    $(".full-overlay img").removeClass(".rotate");
                    $(".porcent-upload").text("0%");
                    $(".action-upload").text("Cargando");
                    $("#submitCorrect").modal("show");
                    $scope.pruebasAdd = [];
                    $scope.nameOriginal = [];
                    $scope.namesNotes = [];
                    $scope.arrayImages = [];
                    $timeout(function () {
                        $("#submitCorrect").modal("hide");
                        $("#return-new").trigger("click");
                    }, 2000);
                });
            });
        }
    };

    $scope.uploadNotebook = function (collectionId, currentWrapper, wrapperIndex) {
        var j;
        $scope.idUpload;
        var knowIdforthis = $(currentWrapper).find("img").attr("name");
        for (j = 0; j < $scope.arrayImages.length; j++) {
            if (knowIdforthis == $scope.arrayImages[j].names) {
                $scope.idUpload = j;
            }
        }
        var notebookNames = $(currentWrapper).find("input").val();
        var notebookImg = $scope.arrayImages[$scope.idUpload].realName;
        var objectImg = $scope.arrayImages[$scope.idUpload].objectUrl;
        var imagesRefName = storageRef.child('notebooksCovers' + notebookImg);
        var uploadTask = imagesRefName.put(objectImg);
        uploadTask.on('state_changed', function (snapshot) {
            var progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
            console.log('upload is ' + progress + '% done');
        }, function (error) {
            console.log(error);
        }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                console.log(downloadURL);
                var notebookCover = downloadURL;
                var notebookObjectss = {
                    name: notebookNames,
                    coverSource: notebookCover,
                    likes: 0,
                    dislikes: 0,
                    likeFemale: 0,
                    likeMale: 0,
                    ageA: 0,
                    ageB: 0
                };
                var notebookId = firebase.database().ref('notebooks/').push(notebookObjectss).key;
                firebase.database().ref('collections/' + collectionId + '/notebooks').push(notebookId);
            });
        });
    };

    $scope.pruebaImagen;

    $scope.transformImages = function (id, indice) {
        var inputFileImage = $("#" + id)[0].files[indice];
        var nameFile = $("#" + id)[0].files[indice].size;
        var nameRealFile = $("#" + id)[0].files[indice].name;

        $scope.arrayImages.push({
            objectUrl: inputFileImage,
            names: nameFile,
            realName: nameRealFile
        });
        $scope.count.push(nameFile);
    };

    $scope.readURL = function (input, images) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $(images).attr('src', e.target.result);
                $(images).removeClass("hidden");
                if (images == '#img_prev') {
                    $scope.removeDisabledData();
                } else {
                    $scope.removeDisabled();
                }
            };
            reader.readAsDataURL(input.files[0]);
        }
    };

    $scope.nameOriginal = [];
    $scope.longMultiple;
    /* $scope.arrayPrueba = [];*/

    $scope.readURL2 = function (input) {
        var i;
        var reader;
        $scope.longMultiple = input.files.length;
        if (input.files && input.files[0]) {
            for (i = 0; i < input.files.length; i++) {
                reader = new FileReader();
                reader.onload = function (e) {
                    var images = "<div class=' col-md-2 col-sm-4 list-box addNotes' ><img name='" + e.total + "' class='addNotes' src='" + e.target.result + "' />" + "<input type='text' class='general-input' onfocusout='angular.element(this).scope().addNotebookPrueba(this); angular.element(this).scope().removeDisabled()'  placeholder='Nombre de libreta'>" + "<p class='text-danger hidden notes-exist'>Nombre existente</p></div>";
                    $("#news-notes").append(images);
                    $scope.removeDisabled();
                };
                reader.readAsDataURL(input.files[i]);
            }
        }
    };

    $scope.pruebasAdd = [];
    $scope.namesNotes = [];

    $scope.addNotebookPrueba = function (notebooks) {
        $scope.pruebas1 = $(notebooks).val();
        $scope.indexPrubeas1 = $(notebooks).closest(".list-box").index();
        $scope.pruebas2 = $(notebooks).siblings("img").attr("src");
        $scope.nameInput = $(notebooks).siblings("img").attr("name");
        $scope.suma = $scope.newIdCollect + 1;
        var i, j;
        var k = null;
        for (j = 0; j < $scope.namesNotes.length; j++) {
            if ($scope.pruebas1 == $scope.namesNotes[j].names) {
                k = j;
            }
        }
        if (k != null) {
            if ($scope.pruebas1 == $scope.namesNotes[k].names && $scope.indexPrubeas1 != $scope.namesNotes[k].id) {
                $(notebooks).next().removeClass("hidden").text("Nombre de libreta existente");
                $(notebooks).unbind("onfocusout");
                return false;
            } else {
                $(notebooks).next().addClass("hidden");
                $(notebooks).addClass("listo");
                return false;
            }
        } else if ($scope.pruebas1.length == 0) {
            $(notebooks).next().removeClass("hidden").text("Ingrese nombre");
            $(notebooks).unbind("onfocusout");
        } else if ($(notebooks).hasClass("listo")) {
            for (var i = 0; i < $scope.pruebasAdd.length; i++) {
                if ($scope.pruebasAdd.length == 0) {
                    return false;
                } else if ($scope.pruebasAdd[i].name2 == $scope.nameInput) {
                    $scope.pruebasAdd[i].name = $scope.pruebas1;
                    $(notebooks).next().addClass("hidden");
                }
            }
        } else {
            $(notebooks).next().addClass("hidden");
            $(notebooks).addClass("listo");
            /*        $(notebooks).prop("disabled", true)*/
            $scope.pruebasAdd.push({
                collection: $scope.suma,
                name: $scope.pruebas1,
                coverSource: $scope.pruebas2,
                name2: $scope.nameInput
            });

            $scope.namesNotes.push({
                names: $scope.pruebas1,
                id: $scope.indexPrubeas1
            });
        }
    };

    $scope.eventSelect = null;

    $scope.collectionOptions = function (element) {
        $scope.eventSelect = $(element).siblings("img").attr("value");
        var knowBlock = $(element).siblings("img").data("blocked");
        if (knowBlock == "S") {
            console.log("Se remueve el bloqueo");
        } else {
            $scope.selectedCollection = Fact.collectionDetail.id = $scope.eventSelect;
            $scope.viewNotes = $scope.eventSelect;
            $scope.changeView('data-collections');
        }
    };

    $scope.collectionDelete = function () {
        var element = $scope.viewNotes;
        $(".collectModal").removeClass("hidden");
        $(".notesModal").addClass("hidden");
        $scope.eventSelect = null;
        var collection = $("#" + element).find("h1").text().toUpperCase();
        $(".title").text(collection);
        $scope.eventSelect = $("#" + element).find("img").attr("value");
        $scope.eventSelect = $("#" + element).find("img").attr("value");
        $("#options").modal("show");
        $(".no-collect").on("click", function () {
            $(".collectModal").addClass("hidden");
            $(".notesModal").removeClass("hidden");
        });
    };

    $scope.deleteCollection = function () {
        var deleteId = $scope.viewNotes;
        console.log("key a eliminar" + deleteId);
        console.log($scope.collectionNotebooks);
        for (var i = 0; i < $scope.collectionNotebooks.length; i++) {
            var idDelete = $scope.collectionNotebooks[i].id;
            console.log(idDelete);
            firebase.database().ref('notebooks/' + idDelete).remove();
        }
        firebase.database().ref('collections/' + deleteId).remove();
        $("#options").modal("hide");
        $("#delete").modal("show");
        $timeout(function () {
            $("#delete").modal("hide");
            $scope.changeView('see-collections');
            $scope.getCollectionList();
            $scope.collectionNotebooks = [];

            /*aqui volver a llamar a la funcion del click con id*/
        }, 2000);
    };

    $scope.arrayImages = [];
    $scope.count = [];

    $scope.views = function (id) {
        console.log(id);
        if ($scope.viewNotes == null) {
            angular.element(".selectpicker option:eq(2)").prop("selected", true).trigger("change");
        } else {
            angular.element(".selectpicker option#" + id).prop("selected", true).trigger("change");
        }
    };

    //Funciones Cargar solo una libreta

    $scope.removeDisabledData = function () {
        var images = $("#img_prev").attr("src");
        var title = $(".selectpicker option:selected").text();
        if (title == "" || title == "Colecciones" || $scope.notebookObject.name == "" || $scope.notebookObject.name == undefined || images == "#") {
            $("#submit-notes").prop("disabled", true);
        } else {
            $("#submit-notes").prop("disabled", false);
        }
    };

    $scope.globalCollection;

    $scope.getNotebooks = function (selectedCollection) {
        $scope.collectionNotebooks = [];
        $timeout(function () {
            $scope.collectionNotebooks = [];
        });
        $scope.globalCollection = selectedCollection;
        var seeNotebooksFrom = firebase.database().ref('collections/' + selectedCollection + '/notebooks');
        seeNotebooksFrom.once('value').then(function (snapshot) {
            var knowNotes = snapshot.val();
            $scope.collectionNotebooks = [];
            $.each(knowNotes, function (indice, valor) {
                var seeNotebooksData = firebase.database().ref('notebooks/' + valor);
                seeNotebooksData.once('value').then(function (snapshot) {
                    var knowData = snapshot.val();
                    $timeout(function () {
                        $scope.collectionNotebooks.push({
                            id: valor,
                            coverSource: knowData.coverSource,
                            name: knowData.name,
                            key: indice
                        });
                    });
                });
            });
        });
    };

    var idSelection;

    $scope.setCollectionData = function (selection) {
        var minuevacadena = selection.substring(1);
        if (selection == "Colecciones") {
            $(".btn-red").addClass("disabled").off("click");
        } else {
            var title = $(".selectpicker option:selected").text();
            $scope.notebookObject.name = '';
            $("#img_prev").attr("src", "#").addClass("hidden");
            $("#fileupload").val("");
            $(".note-selected, .title-data-collect").text(" Colección " + title);
            $(".titles-modal").text(title);
            $(".btn-red").removeClass("disabled").on("click");
            /* console.log(idSelection)*/
            $scope.getNotebooks(minuevacadena);

            $scope.notebookObject.collection = $scope.viewNotes;

            $scope.pruebasArray.forEach(function (value, key) {
                if (value.id_collection == $scope.viewNotes) {
                    $scope.collectionSelected = value.name;
                }
            }, this);
        }
    };

    //carga de libretas
    $scope.uploadNotebookData = function () {
        $(".full-overlay").removeClass("hidden");
        $(".full-overlay img").addClass(".rotate");
        $(".action-upload").text("Creando libreta");
        var inputFileImage = $("#fileupload")[0].files[0];
        var imagesRefName = storageRef.child('notebooksCovers/' + inputFileImage.name);
        var uploadTask = imagesRefName.put(inputFileImage);
        uploadTask.on('state_changed', function (snapshot) {
            var progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
            console.log('upload is ' + progress + '% done');
            $timeout(function () {
                $(".porcent-upload").text(progress + "%");
            }, 500);
        }, function (error) {
            $(".full-overlay").addClass("hidden");
            $(".full-overlay img").removeClass(".rotate");
            $(".porcent-upload").text("0%");
            console.log(error);
        }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                var notebookCover = downloadURL;
                var notebookObjects = {
                    name: $scope.notebookObject.name,
                    coverSource: notebookCover,
                    likes: 0,
                    dislikes: 0,
                    likeFemale: 0,
                    likeMale: 0,
                    ageA: 0,
                    ageB: 0
                };
                var notebookId = firebase.database().ref('notebooks/').push(notebookObjects).key;
                firebase.database().ref('collections/' + $scope.globalCollection + '/notebooks').push(notebookId);
                $(".full-overlay").addClass("hidden");
                $(".full-overlay img").removeClass(".rotate");
                $(".action-upload").text("Cargando");
                $(".porcent-upload").text("0%");
                $("#submitCorrect").modal("show");
                $scope.notebookObject = {};
                $scope.selectedCollections = {};
                $("#fileupload").val("");
                $(".view-image").attr("src", "#").addClass("hidden");
                $("#submit-notes").prop("disabled", true);
                $timeout(function () {
                    $scope.views($scope.globalCollection);
                    $("#submitCorrect").modal("hide");
                }, 2000);
            });
        });
    };

    $scope.optionNotes = function (element) {
        $scope.valueId = null;
        $scope.valueId = $(element).attr("value");
        $("#options").modal("show");
    };

    $scope.deleteNotebooks = function () {
        var idNoteDelete = $scope.valueId;
        console.log(idNoteDelete);
        var keyFromNotes;
        for (var i = 0; i < $scope.collectionNotebooks.length; i++) {
            if ($scope.collectionNotebooks[i].id == idNoteDelete) {
                keyFromNotes = $scope.collectionNotebooks[i].key;
            }
        }
        var desertRefa = firebase.database().ref('collections/' + $scope.globalCollection + '/notebooks/' + keyFromNotes);

        // Delete the file
        desertRefa.remove().then(function () {
            firebase.database().ref('notebooks/' + idNoteDelete).remove();
            $("#options").modal("hide");
            $("#delete").modal("show");
            $timeout(function () {
                $scope.valueId = null;
                $scope.views($scope.globalCollection);
                $("#delete").modal("hide");
            }, 700);
        }).catch(function (error) {
            alert("error");
        });
    };

    $scope.ocultarCandado = function (element) {
        var isBlocked = $(element).siblings(".block-div").data("blocked");
        if (isBlocked == "S") {
            return false;
        } else {
            $(element).closest(".list-box").addClass("ocultate-siempre");
        }
    };

    $scope.mostrarCandado = function (element) {
        var isBlocked = $(element).siblings(".block-div").data("blocked");
        if (isBlocked == "S") {
            return false;
        } else {
            $(element).closest(".list-box").removeClass("ocultate-siempre");
        }
    };

    $scope.toggleBloqueo = function (collection) {
        $scope.idBlock = $(collection).siblings("img").attr("value");
        $scope.actualStatus = $(collection).data("blocked");
        if ($scope.actualStatus == "N") {
            firebase.database().ref('collections/' + $scope.idBlock).update({
                block: "S"
            });
        } else {
            firebase.database().ref('collections/' + $scope.idBlock).update({
                block: "N"
            });
        }
    };
}).service('upload', ['$http', function ($http) {
    this.upload = function (id, nameCollection, toUrl, typeImage) {

        /* return $http({
             method: "POST",
             url: toUrl,
             data: dataImage,
             headers: {
                 'Content-Type': undefined
             }
         })*/
    };
}]);