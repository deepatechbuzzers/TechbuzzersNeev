(function () {
    app.controller('ProductController', ['$scope', '$ionicModal', '$ionicPlatform', 'InventoryService', ProductController]);

function ProductController($scope, $ionicModal, $ionicPlatform, inventoryService) {
        var vm = this;

        vm.GetAllProducts = function () {
            inventoryService.getAllProducts().then(function (products) {
                vm.products = products;
                                             
            });

        } 

         // Initialize the database.
        $ionicPlatform.ready(function () {
            //inventoryService.initDB();
            vm.GetAllProducts();
        });

        
         
        // Initialize the modal view.
        $ionicModal.fromTemplateUrl('add-or-edit-product.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        vm.showAddProductModal = function () {
          
            $scope.product = {};
            $scope.action = 'Add';
            $scope.isAdd = true;
            $scope.modal.show();
        };


        vm.showEditProductModal = function (product,trantype) {
            if (trantype == "Sales" || trantype=="Receive")
            {
                $scope.disabled = false;
                $scope.tran = {};
                $scope.product = product;            
                $scope.tran.ProductNm = product._id;  
                $scope.tran.Date=new Date(), 'MM/dd/yyyy';
                $scope.tran.StockInHand = product.StockInHand + $scope.tran.Quantity;
                $scope.tran.Quantity = product.Quantity;
                $scope.tran.Price = product.price;
                $scope.tran.User = sessionStorage.userName;   
                
            }
            else {
                $scope.product ={};
                $scope.product = product; 
                $scope.product._id = product._id;  
                $scope.product.ProductNm = product._id;  
                $scope.product.StockInHand = product.StockInHand;
                $scope.product.Price = product.Price; 
                $scope.product.productsize = product.productsize; 
                $scope.product.producttype = product.producttype; 
                $scope.product.User = sessionStorage.userName;   
                $scope.product.Date = new Date(), 'MM/dd/yyyy';
            }

            $scope.action = 'Edit';
            $scope.isAdd = false;
            $scope.modal.show();
        };


       vm.showTranModal = function (product, trantype) {
            $scope.tran = {};
            $scope.action = 'Edit';
           $scope.isAdd = false;
            $scope.tran.Quantity = product.Quantity;
            $scope.tran.Price = product.Price;
            $scope.tran.type = trantype;
            $scope.tran.ProductNm = product._id;            
            $scope.tran.Date = new Date(), 'MM/dd/yyyy';
            $scope.tran.User = sessionStorage.userName; 
            $scope.modal.show();
        };
        
        vm.cancel = function () {
            $scope.modal.hide();
        };


vm.showProdTranModal = function (product, type) {
            $scope.tran = {};
            if (type === 'Edit') 
            {
            $scope.action = 'Edit';
            $scope.isAdd = false;
            $scope.tran.Quantity = product.Quantity;
            $scope.tran.StockInHand = product.StockInHand + $scope.tran.Quantity;
           // $scope.tran.Price = material.Price;
            } 
            else 
            {
            $scope.action = 'Add';
            $scope.isAdd = true;
            $scope.tran.Quantity = 0;
            $scope.tran.Price = 0;
            }
            $scope.tran.type = type;
            $scope.tran.ProductNm = product._id;
            console.log("inventory controller showtranmodel");            
            $scope.tran.Date = new Date(), 'MM/dd/yyyy';
            $scope.modal.show();
        };
        
        vm.cancel = function () {
            $scope.modal.hide();
        };



        //$scope.items = [];

        $scope.saveProduct = function (product) {
            alert("in save");
            //if ((material.Quantity.length == 0) || (material.Quantity == 0)) {
                if ( (product.Quantity == 0)) {
                alert(product.ProductNm + " quanity is empty ");
                return;
            }
            else {
                if ($scope.isAdd) {

                    inventoryService.addProduct(product);
                } else {
                    inventoryService.updateProduct(product);
                }
            }
            vm.GetAllProductss();
            $scope.modal.hide();
        };

        $scope.saveProdTran = function (tran) {
            console.log("in saveTran");
               
            //material.type = "Order"
            //if ((tran.Quantity.length == 0) || (tran.Quantity == 0)) {
            if ((tran.StockInHand == 0)) {
                alert(tran.ProductNm + " quanity is empty ");
                return;
            }
            else {
                if ($scope.isAdd) {
                    inventoryService.addProdTran(tran).then(
                        function (success) {
                            vm.GetAllProducts();
                        },
                        function (error) {

                    })}else {
                    inventoryService.updateProduct(tran);

                }
            }
            
            $scope.modal.hide();
        };

        $scope.deleteProduct = function (product) {
            inventoryService.deleteProduct(product);
           $scope.modal.hide();
        };

        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });


        
        return vm;
    }
})();
