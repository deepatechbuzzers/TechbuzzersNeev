(function () {
angular.module('starter').controller('drawProductVisualization', ['$scope', '$ionicModal', '$ionicPlatform', 'InventoryService', drawProductVisualization]);    
    //NeevApp.controller('drawVisualization', ['$scope', '$ionicModal', '$ionicPlatform', 'InventoryService', drawVisualization]);


    var vm = this;
    var products;
    //var chart = true;
    function drawProductVisualization($scope, $ionicModal, $ionicPlatform, inventoryService) {

        inventoryService.initDB();

        // Get all material records from the database.
        inventoryService.getAllProducts().then(function (materials) {

            vm.products = products;
             
            var datatext = '[';
            var datalen = vm.products.length - 1;
            var datavalues = '[';
            var dataprice = '[';
            var datapercent = '[';

            for (var i = 0, len = vm.products.length; i < len; i++)
            {
                //$scope.labels = vm.materials[i].MaterialNm;
                if (i == datalen) {
                    datatext = datatext + '"' + vm.products[i]._id + '"];';
                    datavalues = datavalues + vm.products[i].StockInHand + '];';
                    dataprice = dataprice + parseInt(vm.products[i].StockInHand) * parseFloat(vm.products[i].Price) + '];';
                    datapercent = datapercent + parseInt(vm.products[i].StockInHand) / 100 + '];';
                }

                else if (i < datalen)
                {
                    datatext = datatext + '"' + vm.products[i]._id + '",';
                    datavalues = datavalues + vm.products[i].StockInHand + ',';
                    dataprice = dataprice + parseInt(vm.products[i].StockInHand) * parseFloat(vm.products[i].Price) + ',';
                    datapercent = datapercent + parseInt(vm.products[i].StockInHand) / 100 + ',';
                }

            }


            $scope.labels = eval(datatext);
            $scope.data = eval(datavalues);
            $scope.price = eval(dataprice);
            $scope.percent = eval(datapercent);
            $scope.flgchart = true;
            $scope.flgprice = false;
            $scope.flgpercent = false;
            $scope.exportdataProducts = vm.products;     
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


