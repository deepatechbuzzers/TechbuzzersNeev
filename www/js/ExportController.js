(function () {


    angular.module('starter').controller('displayExportData', ['$scope', 'InventoryService', '$ionicModal', '$ionicPlatform', displayExportData]);
//    var materials;
//    var vm = this;


    function displayExportData($scope, inventoryService) {
        inventoryService.initDB();
//
//        // Get all material records from the database.
        inventoryService.getAllMaterials().then(function (materials) {
//            vm.materials = materials;
            $scope.exportdatas = materials;
        });

        $scope.init = function () {
            $scope.statusPDF = false;
            $scope.statusExcel = false;
            $scope.statusCSV = false;
           
        };

        $scope.changeStatusPDF = function () {
//            $scope.statusExcel = $scope.statusPDF;
//            $scope.statusCSV = $scope.statusPDF;
            $scope.statusPDF = !$scope.statusPDF;
            
        };
        $scope.changeStatusExcel = function () {
//            $scope.statusCSV = $scope.statusExcel;
//            $scope.statusPDF = $scope.statusExcel;
            $scope.statusExcel = !$scope.statusExcel;
           
        };
        $scope.changeStatusCSV = function () {
//            $scope.statusPDF = $scope.statusCSV;
//            $scope.statusExcel = $scope.statusCSV;
            $scope.statusCSV = !$scope.statusCSV;
          
        };
//        $scope.validateEmail=function(){
//            
//        };
//        $scope.sendFeedback= function() {
//        if(window.plugins && window.plugins.emailComposer) {
//            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
//                console.log("Response -> " + result);
//            }, 
//            "Neev Data", // Subject
//            "",                      // Body
//            ["bs.vajreshwari@gmail.com"],    // To
//            null,                    // CC
//            null,                    // BCC
//            false,                   // isHTML
//            null,                    // Attachments
//            null);                   // Attachment Data
//        }
//    };
       
    }
})();
//(function () {
//
//     angular
//        .module('starter', ['ionic'])
//        .directive('formValidateAfter', formValidateAfter);
//
//    function formValidateAfter() {
//        var directive = {
//            restrict: 'A',
//            require: 'ngModel',
//            link: link
//        };
//
//        return directive;
//
//        function link(scope, element, ctrl) {
//            var validateClass = 'form-validate';
//            ctrl.validate = false;
//            element.bind('focus', function (evt) {
//                if (ctrl.validate && ctrl.$invalid) // if we focus and the field was invalid, keep the validation
//                {
//                    element.addClass(validateClass);
//                    scope.$apply(function () { ctrl.validate = true; });
//                }
//                else {
//                    element.removeClass(validateClass);
//                    scope.$apply(function () { ctrl.validate = false; });
//                }
//
//            }).bind('blur', function () {
//                element.addClass(validateClass);
//                scope.$apply(function () { ctrl.validate = true; });
//            });
//        }
//    }
//
//}());

 

