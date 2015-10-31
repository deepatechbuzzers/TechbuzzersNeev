(function () {
    app.controller('OverviewController', ['$scope', '$ionicModal',  '$ionicPlatform', '$ionicPopup', '$filter','InventoryService', OverviewController]);


    function OverviewController($scope, $ionicModal, $ionicPlatform, $ionicPopup, $filter,  inventoryService) {
        var vm = this;
        $scope.FromDate = new Date(), 'MM/dd/yyyy';;
        $scope.ToDate = new Date(), 'MM/dd/yyyy';;

        vm.GetAllMaterials = function () {
            inventoryService.getAllMaterials().then(function (materials) {
                vm.materials = materials;
                //$scope.price = getPrice(materials, "type", "Material");
                //$scope.stock = sumByKey(materials, "type", "Material", "StockInHand");
                //return $scope.price, $scope.stock;
            });
        }

    
       vm.GetInventory = function () {            
            inventoryService.getInventory('all_materials_Count').then(function (materials) {
                if (materials == '')
                    materials = 0;
                $scope.stock = materials;
            });
            inventoryService.getInventory('total_materials_cost').then(function (materials) {
                if (materials == '')
                    materials = 0;
                $scope.price = materials;
            });
            inventoryService.getInventory('all_products_Count').then(function (materials) {
                if (materials == '')
                    materials = 0;
                $scope.Salesstock = materials;
            });
            inventoryService.getInventory('total_Product_cost').then(function (materials) {
                if (materials == '')
                    materials = 0;
                $scope.Salesprice = materials;
            });
            inventoryService.getInventory('all_returns_count').then(function (materials) {
                if (materials == '')
                    materials = 0;
                $scope.Returnsstock = materials;
            });
            inventoryService.getInventory('total_returns_cost').then(function (materials) {
                if (materials == '')
                    materials = 0;
                $scope.Returnsprice = materials;
            });
            return  $scope.stock,$scope.price,$scope.Salesstock,$scope.Salesprice,$scope.Returnsstock,$scope.Returnsprice;
        }


        vm.Init = function(){
                            vm.GetInventory();
                            vm.GetAllMaterials();
                            };

        vm.Init();      

        // Initialize the database.
        $ionicPlatform.ready(function () {});

               

        vm.getTransactions = function (FromDate, ToDate) {
            inventoryService.getAllTransactions().then(function (transactions) {
                vm.transactions = transactions;
                $scope.price = getPriceInDateRange(transactions, FromDate, ToDate);
                $scope.stock = sumByKeyInDateRange(transactions, FromDate, ToDate);
                return $scope.price, $scope.stock;
            });
        };


        var sumByKeyInDateRange = function (array, fromDate, toDate) {
            var issues = 0;
            var receives = 0;
            var sum = 0;
            for (var i = 0, len = array.length; i < len; i++) {
                if (array[i] != undefined) {
                    if ((array[i]["type"] == 'Issue') && ((array[i]["Date"] >= fromDate) && (array[i]["Date"] <= toDate))) {
                        issues += parseFloat(array[i]["Quantity"])
                    }
                }
            }
            for (var i = 0, len = array.length; i < len; i++) {
                if (array[i] != undefined) {
                    if ((array[i]["type"] == 'Receive') && ((array[i]["Date"] >= fromDate) && (array[i]["Date"] <= toDate))) {
                        receives += parseFloat(array[i]["Quantity"])
                    }
                }
            }
            return sum = issues - receives;
        }

        var getPriceInDateRange = function (array, fromDate, toDate) {
            var issues = 0;
            var receives = 0;
            var total = 0;
            for (var i = 0, len = array.length; i < len; i++) {
                if (array[i] != undefined) {
                    if ((array[i]["type"] == 'Issue') && ((array[i]["Date"] >= fromDate) && (array[i]["Date"] <= toDate))) {
                        issues += parseFloat(array[i]["Price"] * array[i]["Quantity"])
                    }
                }
            }
            for (var i = 0, len = array.length; i < len; i++) {
                if (array[i] != undefined) {
                    if ((array[i]["type"] == 'Receive') && ((array[i]["Date"] >= fromDate) && (array[i]["Date"] <= toDate))) {
                        receives += parseFloat(array[i]["Price"] * array[i]["Quantity"])
                    }
                }
            }
            return total = issues - receives;
        }


        var sumByKey = function (array, keyField, keyValue, valueField) {
            var sum = 0;
            for (var i = 0, len = array.length; i < len; i++) {
                if (array[i] != undefined) {
                    if ((array[i][keyField] == keyValue)) {
                        sum += parseFloat(array[i][valueField])
                    }
                }
            }
            return sum;
        }


        var getPrice = function (array, keyField, keyValue) {
            var total = 0;
            for (var i = 0, len = array.length; i < len; i++) {
                if (array[i] != undefined) {
                    if ((array[i][keyField] == keyValue)) {
                        total += parseFloat(array[i]["Price"] * array[i]["StockInHand"])
                    }
                }
            }
            return total;
        }



        // Initialize the modal view.
        $ionicModal.fromTemplateUrl('add-or-edit-material.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        vm.showAddMaterialModal = function () {
            $scope.material = {};
            $scope.action = 'Add';
            $scope.isAdd = true;
            $scope.modal.show();
        };

        
        vm.showEditMaterialModal = function (material,trantype) {
            if (trantype == "transaction")
            {
                $scope.disabled = false;
                $scope.tran = {};
                $scope.material = material;            
                $scope.tran.MaterialNm = material._id;          
                $scope.tran.Date = new Date(), 'MM/dd/yyyy';
                $scope.tran.Quantity = material.Quantity;
                $scope.tran.StockInHand = material.StockInHand + $scope.tran.Quantity;
                $scope.tran.Price = material.Price; 
                $scope.tran.ROL = material.ROL; 
                $scope.tran.User = sessionStorage.userName;
            }
            else {
                $scope.material ={};
                $scope.material = material; 
                $scope.material._id = material._id;  
                $scope.material.StockInHand = material.StockInHand;
                $scope.material.Price = material.Price; 
                $scope.material.ROL = material.ROL; 
                $scope.material.User = sessionStorage.userName;   
                $scope.material.Date = new Date(), 'MM/dd/yyyy';
            }

            $scope.action = 'Edit';
            $scope.isAdd = false;
            $scope.modal.show();
        };


vm.showTranModal = function (material, type) {
            $scope.tran = {};
            $scope.tran.Quantity = material.Quantity;
            $scope.tran.StockInHand = material.StockInHand + $scope.tran.Quantity;
            $scope.tran.Price = material.Price;
            $scope.tran.User = sessionStorage.userName;
            $scope.isAdd = false;
    
            if (type == 'Edit') 
            {
            $scope.action = 'Edit';
           
            } 
            else if (type=='Issue')
            {
                    $scope.action='Issue';
            }
            else if (type=='Receive')
            {
                 $scope.action ='Receive';
            }
            else 
            {
            $scope.action = 'Add';
            $scope.isAdd = true;
            $scope.tran.Quantity = 0;
            $scope.tran.Price = 0;
            }
            $scope.tran.type = type;
            $scope.tran.MaterialNm = material._id;
            console.log("inventory controller showtranmodel");            
            $scope.tran.Date = new Date(), 'MM/dd/yyyy';
            $scope.modal.show();
        };




        //$scope.items = [];

        $scope.saveMaterial = function (material) {
            //if ((material.Quantity.length == 0) || (material.Quantity == 0)) {
                if ( (material.Quantity == 0)) {
                alert(material.MaterialNm + " quanity is empty ");
                return;
            }
            else {
                if ($scope.isAdd) {

                    inventoryService.addMaterial(material);
                } else {
                    inventoryService.updateMaterial(material);
                }
            }
           vm.GetAllMaterials();
            $scope.modal.hide();
           // location.reload();
        };

       

        $scope.saveTran = function (tran) {
            debugger;
            if ((tran.StockInHand == 0)) {
                alert(tran.MaterialNm + " quantity is empty ");
                return;
            }
            else {
                if ($scope.isAdd) {debugger;
                    inventoryService.addTran(tran).then(
                        function (success) {
                           vm.GetAllMaterials();
                        },
                        function (error) {

                    })}else {
                    inventoryService.addTran(tran);
                    inventoryService.updateMaterial(tran);
                   //location.reload();
                }
            }

            vm.GetAllMaterials();
            $scope.modal.hide();
           
        };

        $scope.getCount = function (material) {
            inventoryService.getCount(material);
        };

        $scope.deleteMaterial = function (material) {
            inventoryService.deleteMaterial(material).then(
                        function (success) {
                            vm.GetAllMaterials();
                        },
                        function (error) {

                    });
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });


        //DATE SELECTION---------------------------------------------------------------------------


// Triggered on a button click, or some other target

  //$scope.getDate = function () {
           
    //        vm.GetAllMaterials();
           
      //  };


 $scope.showAddDateModal = function() {

  $scope.data  = {};

   // An elaborate, custom popup
   var myPopup = $ionicPopup.show({
     template: '<div><label class=item-input><span class=input-label>From</span><input class=form-control type=date ng-model="data.From"></label><label class=item-input><span class=input-label>To</span><input class=form-control type=date ng-model=data.To></label></div>',
     
     title: 'Custom Date',
     subTitle: 'Please select dates below',
     scope: $scope,
     buttons: [
       { text: 'Cancel' },
       {
         text: '<b>Save</b>',
         type: 'button-positive',
         onTap: function(e) {
           if ((!$scope.data.From) || (!$scope.data.To)) {
             //don't allow the user to close unless he enters wifi password
            // $scope.errMessage = '**Select a value for From Date and To Date';
             alert("**Select a value for From Date and To Date");
             e.preventDefault();
           } else {
                $scope.FromDate = $filter('date')($scope.data.From, "MM/dd/yyyy");
                $scope.ToDate =$filter('date')( $scope.data.To, "MM/dd/yyyy");
                console.log ($scope.FromDate);
                console.log ($scope.ToDate);
                vm.getTransactions ($scope.FromDate,$scope.ToDate);
                //$scope.$ionicPopup.hide();
             //return;
           }
         }
       },
     ]
   });
    
  };



        $scope.saveDate = function () {

            $scope.From = From.value;
            $scope.To = To.value;

            //var f = From.value;
            //var t = To.value;
            if (!$scope.From || !$scope.To) {
                $scope.errMessage = '**Select a value for From Date and To Date';
                return false;
            }
            if ($scope.From > $scope.To) {
                $scope.errMessage = '**End Date should be greater than Start Date';
                return false;
            }

            // alert($scope.From);
            // alert($scope.To);
            return $scope.From, $scope.To;

            $scope.modal.hide();
        };
        vm.cancel = function () {
            $scope.modal.hide();
        };
        // ---------------------------------------



        return vm;
    }
})();