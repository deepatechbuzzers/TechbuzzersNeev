(function () {
angular.module('starter').controller('drawVisualization', ['$scope', '$ionicModal', '$ionicPlatform', 'InventoryService', drawVisualization]);    
    //NeevApp.controller('drawVisualization', ['$scope', '$ionicModal', '$ionicPlatform', 'InventoryService', drawVisualization]);


    var vm = this;
    var materials;
    //var chart = true;
    function drawVisualization($scope, $ionicModal, $ionicPlatform, inventoryService) {

        inventoryService.initDB();

        // Get all material records from the database.
        inventoryService.getAllMaterials().then(function (materials) {

            vm.materials = materials;
             
            var datatext = '[';
            var datalen = vm.materials.length - 1;
            var datavalues = '[';
            var dataprice = '[';
            var datapercent = '[';

            for (var i = 0, len = vm.materials.length; i < len; i++)
            {
                //$scope.labels = vm.materials[i].MaterialNm;
                if (i == datalen) {
                    datatext = datatext + '"' + vm.materials[i]._id + '"];';
                    datavalues = datavalues + vm.materials[i].StockInHand + '];';
                    dataprice = dataprice + parseInt(vm.materials[i].StockInHand) * parseFloat(vm.materials[i].Price) + '];';
                    datapercent = datapercent + parseInt(vm.materials[i].StockInHand) / 100 + '];';
                }

                else if (i < datalen)
                {
                    datatext = datatext + '"' + vm.materials[i]._id + '",';
                    datavalues = datavalues + vm.materials[i].StockInHand + ',';
                    dataprice = dataprice + parseInt(vm.materials[i].StockInHand) * parseFloat(vm.materials[i].Price) + ',';
                    datapercent = datapercent + parseInt(vm.materials[i].StockInHand) / 100 + ',';
                }

            }


            $scope.labels = eval(datatext);
            $scope.data = eval(datavalues);
            $scope.price = eval(dataprice);
            $scope.percent = eval(datapercent);
            $scope.flgchart = true;
            $scope.flgprice = false;
            $scope.flgpercent = false;
            $scope.exportdatas = vm.materials;     
        });



        vm.changeData = function (charttype) {
          
           // alert(charttype);
        if (charttype=='flgchart' || charttype=='')
            {          
                
                $scope.flgchart = true;
                $scope.flgprice = false;
                $scope.flgpercent = false;
            }
            else if (charttype=='flgprice')
            {
                $scope.flgprice = true;
                $scope.flgpercent = false;
                $scope.flgchart = false;
            }
            else if (charttype=='flgpercent')
            {
                $scope.flgpercent = true;
                $scope.flgchart = false;
                $scope.flgprice = false;
            }
         
        };
    }

})();
