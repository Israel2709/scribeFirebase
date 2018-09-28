'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:NewnotebookCtrl
 * @description
 * # NewnotebookCtrl
 * Controller of the scribeApp
 */
angular.module('scribeApp')
  .controller('NewnotebookCtrl', function ($scope, $http, $timeout,upload, Fact) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

  $scope.urlUpload = "https://luisvardez.000webhostapp.com/upload.php";

    $scope.collection = {};
    $scope.collectionsList;
    $scope.collectionsNames = []
    $scope.notebookObject = {};

    $scope.collectionSelected;

    $scope.viewNotes = Fact.collectionDetail.id;

    //variable en la cual se guarda el resultado de la petición al guardar imagen en el servidor
    $scope.resUploadFile;

    $scope.getCollectionList = function() {
        $http({
            method: 'GET',
            url: 'https://api.backand.com:443/1/objects/collection?pageSize=20&pageNumber=1',
            headers: {
                AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
            },
            params: {
                pageSize: 20,
                pageNumber: 1
            }
        }).then(
            function(response) {
                $scope.collectionsList = response.data.data;
                 $scope.listCollectionNames()
            },
            function(response) {
                alert("error")
            });
    }

    $scope.removeDisabled = function(){
      var images = $(".view-image").attr("src")
      var title = $(".selectpicker option:selected").text()
      if(title == "" || title == "Colecciones" || $scope.notebookObject.name == "" || $scope.notebookObject.name == undefined || images == "#"){
        $("#submit-notes").prop("disabled", true)
      }
      else{
         $("#submit-notes").prop("disabled", false)
      }
    }

    $scope.getNotebooks = function(selectedCollection) {
        $http({
            method: 'GET',
            url: 'https://mobile.anzen.digital:8083/scribe/collection/getCollections?query=1&parameter='+$scope.viewNotes,
        }).then(
            function(response) {
              console.log("libretas por coleccion"+response)
                /*$scope.collectionNotebooks = response.data.data;*/
            },
            function(response) {
                alert("error")
            }
        );
    }

  $scope.getCollectionNotebooks = function () {
      $http({
        method: 'GET',
        url: 'https://api.backand.com:443/1/objects/notebook?pageSize=20&pageNumber=1',
        headers: {
          AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
        },
        params: {
          pageSize: 20,
          pageNumber: 1,
          "filter": [{
            "fieldName": "collection",
            "operator": "in",
            "value": "50" /*aqui va el id de la colección a consultar*/
          }],
        }
      }).then(
        function (response) {
          console.log(response.data.data)
        },
        function (response) {
          alert("error")
        });
    }

    $scope.getCollectionList();

    var idSelection;

    $scope.setCollection = function(selection) {
        if (selection == "Colecciones") {
            $(".btn-red").addClass("disabled").off("click")
        } else {
          console.log(selection)
            idSelection = selection.toString();
            var title = $(".selectpicker option:selected").text()
            $(".note-selected, .title").text(" Colección " + title)
            $(".btn-red").removeClass("disabled").on("click")
            $scope.getNotebooks(idSelection);

            $scope.notebookObject.collection = $scope.selectedCollection;

            console.log($scope.collectionsList)
            $scope.collectionsList.forEach(function (value, key) {
              if (value.id == $scope.selectedCollection) {
                $scope.collectionSelected = value.name;
              }
            }, this);
              }
    }

    $scope.listCollectionNames = function () {
      var i;
      for (i = 0; i < $scope.collectionsList.length; i++) {
        $scope.collectionsNames.push($scope.collectionsList[i].name)
      }
      console.log($scope.collectionsNames)
    }

     $scope.getSingleCollection = function () {
      $http({
        method: 'GET',
        url: 'https://api.backand.com:443/1/objects/collection/50',
        /*el último número debe ser el id de la colección a consultar*/
        headers: {
          AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
        },
        params: {
          pageSize: 20,
          pageNumber: 1
        }
      }).then(
        function (response) {
          console.log(response.data)
          $scope.getCollectionNotebooks();
        },
        function (response) {
          alert("error")
        });
    }

    $scope.openFileDialog = function(idBtn) {
        $(idBtn).trigger("click")
    }

    //carga de libretas
    $scope.uploadNotebook = function () {

      //se manda llamar el servicio creado para la carga de las imagenes,
      //Parametros:  Id de input tipo file,nombre de la coleccion que se envía y el nombre del tipo de imagen
      //:notebook y detail
      $(".full-overlay").removeClass("hidden")
      upload.upload('fileupload',$scope.collectionSelected,'notebook').then(function(response){
        if(response.status == '200'){
           $scope.notebookObject.coverSource = response.data;
           $scope.notebookObject.collection = $scope.selectedCollection;
           console.log($scope.notebookObject)

      /*     upload.upload('fileupload2',$scope.collectionSelected,'detail').then(function(response){*/
           /*    $scope.notebookObject.listCoverSource = response.data;*/
              $http.post('https://api.backand.com:443/1/objects/notebook', $scope.notebookObject, {
                headers: {
                  AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
                }
              })
              .then(
                function (response) {
                  $(".full-overlay").addClass("hidden")
                  $("#submitCorrect").modal("show")
                  $scope.notebookObject = {};
                  $scope.selectedCollections = {};
                  $("#fileupload").val("");
                  $(".view-image").attr("src", "#").addClass("hidden")
                  $("#submit-notes").prop("disabled", true)
                  $scope.getNotebooks($scope.selectedCollection);
                  $timeout(function() {
                    $("#submitCorrect").modal("hide")
                  }, 2000);
                },
                function (response) {
                  $(".full-overlay").addClass("hidden")
                  alert("error")
                }
              );
           /*})*/
        }
      })//termina then de servicio
    }

    $scope.readURL = function(input) {
      if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function (e) {
              $("#img_prev").attr('src', e.target.result);
              $("#img_prev").removeClass("hidden");
              $scope.removeDisabled()
          };
          reader.readAsDataURL(input.files[0]);   
      }
  }

  $scope.export = function(e){
        var titles = $(".selectpicker option:selected").text()
        if(titles == ""){
            alert("Seleccione una colección");
        }
        else{
          $("#dvData").table2excel({  
                name: "Table2Excel",  
                filename: "Libretas",  
                fileext: ".xls"  
            }); 
            /* window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#dvData').html()));
            e.preventDefault();*/
        }
    }

     $scope.views = function(id){
      console.log($scope.viewNotes)
      if($scope.viewNotes == null){
        angular.element(".selectpicker option:eq(2)").prop("selected", true).trigger("change")
        /*$scope.setCollection("Colecciones");*/
      }
      else{
        angular.element(".selectpicker option#"+id).prop("selected", true).trigger("change")
      }
    }

    $scope.valueId = null;

    $scope.optionNotes = function(element){
      $scope.valueId = null;
      $scope.valueId = $(element).attr("value");
      $("#options").modal("show")
    }

     $scope.deleteNotebooks = function() {
       $http({
          method: 'DELETE',
          url: 'https://api.backand.com:443/1/objects/notebook/' + $scope.valueId,
          /*el último número debe ser el id de la colección a consultar*/
          headers: {
            AnonymousToken: "a3cacd9a-831f-4aa8-8872-7d80470a000e"
          },
          params: {
            pageSize: 20,
            pageNumber: 1
          }
        }).then(
          function (response) {
            $("#options").modal("hide")
            $("#delete").modal("show")
            $timeout(function() {
              $scope.valueId = null;
              $("#delete").modal("hide")
              $scope.getNotebooks($scope.selectedCollection);
            }, 700);
          },
          function (response) {
            alert("error")
          });
    }


     $timeout(function() {
        $scope.views($scope.viewNotes);
    }, 500);



  })

//servicio para la ejecución de peticion y guardado de imagenes
  //Prefix: modal,notebook,detail
/*  .service('upload',[
    '$http',
    function($http){
      this.upload =  function(id,selected,prefix){
      
      var inputFileImage = $("#" + id)[0].files[0];
      var dataImage = new FormData();

      dataImage.append("file", inputFileImage);
      dataImage.append('carpeta',selected);
      dataImage.append('prefix',prefix)

        return $http({
          method: "POST",
          url: "https://luisvardez.000webhostapp.com/upload.php",
          data: dataImage,
          headers: {
            'Content-Type': undefined
          }
        })
      }
    }
  ]);*/