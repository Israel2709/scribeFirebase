'use strict';

/**
 * @ngdoc function
 * @name scribeApp.controller:StatsCtrl
 * @description
 * # StatsCtrl
 * Controller of the scribeApp
 */



/*PONER EMPTY Y APPEND*/




angular.module('scribeApp')
    .controller('StatsCtrl', function($scope, $http, $timeout) {

        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.labels = ["Likes", "Dislikes"];
        $scope.black = [
            "panel1",
            "panel2"
        ]
        $scope.getCollectionList = function() {
            var starCountRef = firebase.database().ref('collections/');
            starCountRef.on('value', function(snapshot) {
                var knowArray = snapshot.val()
                $timeout(function() {
                    $scope.collectionsList = []
                });
                $.each(knowArray, function(indice, valor) {
                    $timeout(function() {
                        $scope.collectionsList.push({
                            id_collection: indice,
                            name: valor.name
                        })
                    });

                });
                $timeout(function() {
                    angular.element(".selectpicker option:eq(2)").prop("selected", true).trigger("change");
                }, 1);

            });
        }

        $scope.globalCollection

        $scope.getCollectionNotebooks = function(selectedCollection) {
            $scope.globalCollection = selectedCollection
            var starCountRef = firebase.database().ref('collections/' + selectedCollection + "/notebooks");
            $timeout(function() {
                    $scope.collectionNotebooks = []
                });
            starCountRef.on('value', function(snapshot) {
                var knowArray = snapshot.val()
                $.each(knowArray, function(indice, valor) {
                    var seeNotebooksData = firebase.database().ref('notebooks/' + valor)
                    seeNotebooksData.on('value', function(snapshot) {
                        var knowData = snapshot.val()
                        $timeout(function() {
                            $scope.collectionNotebooks.push({
                                id: valor,
                                coverSource: knowData.coverSource,
                                name: knowData.name,
                                key: indice,
                                likes: knowData.likes,
                                dislike: knowData.dislikes,
                                likedToMale: knowData.likeMale,
                                likedToFemale: knowData.likeFemale,
                                userAgeA: knowData.ageA,
                                userAgeB: knowData.ageB
                            })

                            for (var i = 0; i < $scope.collectionNotebooks.length; i++) {
                                $scope.dataLikes = [$scope.collectionNotebooks[i].likes, $scope.collectionNotebooks[i].dislike];
                                $scope.collectionNotebooks[i].dataLikes = $scope.dataLikes;
                                $scope.dataGender = [$scope.collectionNotebooks[i].likedToMale, $scope.collectionNotebooks[i].likedToFemale]
                                $scope.collectionNotebooks[i].dataGender = $scope.dataGender;
                                $scope.dataAges = [$scope.collectionNotebooks[i].userAgeA, $scope.collectionNotebooks[i].userAgeB];
                                $scope.collectionNotebooks[i].dataAges = $scope.dataAges;
                            }
                        });
                    })
                });
            });

        }

        $scope.quierover = firebase.database().ref('notebooks/')
        $scope.quierover.on('child_changed', function(snapshot) {
            $scope.getCollectionNotebooks($scope.globalCollection)
        });

        $scope.getCollectionList();

        $scope.setCollection = function(selection) {
            if (selection == "Elige la colección para ver las estadisticas") {
                $(".btn-red").addClass("black").attr("disabled", true)
                $(".list-black").removeClass("hidden")
                $(".list-stats").addClass("hidden")
                $(".text-stat").text("Selecciona tu colección para poder ver los valores de cada libreta.")
            } else {
                $(".list-black").addClass("hidden")
                $(".list-stats").removeClass("hidden")
                var selectedCollection = selection
                var titles = $(".selectpicker option:selected").text()
                $(".text-stat").text("Graficas de la Colección " + titles)
                $(".title").text(titles)
                $(".btn-red").removeClass("black").attr("disabled", false)
                $scope.getCollectionNotebooks(selectedCollection);
            }
        }

        $scope.openFileDialog = function(idBtn) {
            $(idBtn).trigger("click")
        }


         $scope.exportToPDF = function() {
 

                   html2canvas($("#Imprimeaqui"), {
                        background: "#ffffff",
                        onrendered: function(canvas) {
                            var myImage = canvas.toDataURL('image/jpeg', 1.0);
                            var imgWidth = (canvas.width * 25.4) / 240;
                            var imgHeight = (canvas.height * 25.4) / 240; 
                            var table = new jsPDF('p', 'mm', 'a4');
                            table.addImage(myImage, 'JPEG', 15, 2, imgWidth, imgHeight); // 2: 19
                            table.save('Statistiques.pdf');
                        }
                    });

       }

        $scope.exportToExcel = function(e) {
           /* $("#dvData").tableExport({
                headings: true,                    // (Boolean), display table headings (th/td elements) in the <thead>
                footers: true,                     // (Boolean), display table footers (th/td elements) in the <tfoot>
                formats: ["xls", "csv", "txt"],    // (String[]), filetypes for the export
                fileName: "Estadisticas",                    // (id, String), filename for the downloaded file
                bootstrap: true,                   // (Boolean), style buttons using bootstrap
                position: "well" ,                // (top, bottom), position of the caption element relative to table
                ignoreRows: null,                  // (Number, Number[]), row indices to exclude from the exported file
                ignoreCols: null,                 // (Number, Number[]), column indices to exclude from the exported file
                ignoreCSS: ".tableexport-ignore"   // (selector, selector[]), selector(s) to exclude from the exported file
            });*/
            var titles = $(".selectpicker option:selected").text()
            if (titles == "" || titles == "Elige la colección para ver las estadisticas") {
                alert("Seleccione una colección");
            } else {
                $("#dvData").table2excel({
                    name: "Table2Excel",
                    filename: "Estadisticas",
                    fileext: ".xls"
                });
            }
        }

    });