var x;
(function () {

    angular.module('starter').factory('InventoryService', ['$q','$http', InventoryService])

      .factory('Authentication', function($http, $rootScope){//, UiNotification
                    $rootScope.userProfile={};
                    return{
                    login: function(dataP, callback){                                              
                        $http.get('/js/user.json', {params : dataP}).success(function(dataR) {
                          $rootScope.authenticated = false;
                          angular.forEach(dataR, function(v,k){
                            if(v.name.toLowerCase() == dataP.userName.toLowerCase() && v.password.toLowerCase() == dataP.password.toLowerCase()){
                                                    $rootScope.authenticated = true; 
                            $rootScope.userProfile['userName'] = v.name;
                            $rootScope.userProfile['role'] = v.role;
                            /************Set user profile in rootscope*************/
                            sessionStorage.setItem('authenticated', true);
                            sessionStorage.setItem('userName', $rootScope.userProfile.userName);
                            sessionStorage.setItem('role', $rootScope.userProfile.role);
                            /************Set user profile in session storage*************/
                                    }
                          });                      
                          callback && callback();
                        }).error(function(data, status, headers, config) {
                                      //UiNotification.addAlert({type: 'danger', msg: 'Failed to login'});
                                          $rootScope.authenticated = false;
                                          callback && callback();
                        });
                    },
          isLoggedIn : function(){
                      return ($rootScope.authenticated)? $rootScope.authenticated : false;
          }
        }
      })/***************Authentication Service****************/ 



    function InventoryService($q,$http) {
        var _db;
        var _inventory;
        var remoteDB;
        var _tran;
        var _product;

        return {
            initDB: initDB,
            getAllProducts: getAllProducts,
            getAllMaterials: getAllMaterials,
            getInventory: getInventory,
            addMaterial: addMaterial,
            updateMaterial: updateMaterial,
            addProduct:addProduct,
            addProduct:addProduct,
            updateProduct: updateProduct,
            deleteMaterial: deleteMaterial,
            deleteProduct:deleteProduct,
            addTran: addTran,
            addProdTran: addProdTran,
            getAllTransactions: getAllTransactions //,
            //getCount : getCount
        };

function initDB() {
                _db = new PouchDB('inventory',{ adapter: 'websql' });
                remoteDB = new PouchDB('http://54.149.244.161:5984/inventory');
            new PouchDB('inventory').replicate.to(new PouchDB('http://54.149.244.161:5984/inventory')); 
                //_db = new PouchDB('inventory',{ adapter: 'websql' });
                //remoteDB = new PouchDB('http://54.149.244.161:5984/inventorynew');
                //new PouchDB('inventory').replicate.to(new PouchDB('http://54.149.244.161:5984/inventorynew')); 
                //remoteDB = new PouchDB('http://127.0.0.1:5984/inventory');
        };

        function UpdateStock(material) {
            _db.get(material.MaterialNm).then(function (doc1) {
                var stock = 0;
                if (material.type == 'Receive') {
                    var stock = parseInt(doc1.StockInHand) + parseInt(material.Quantity);
                }
                else if (material.type == 'Issue') {
                    var stock = parseInt(doc1.StockInHand) - parseInt(material.Quantity);
                }
                return _db.put({
                    type: "Material",
                    InitialStockLevel: doc1.InitialStockLevel,
                    ReorderLevel: doc1.ReorderLevel,
                    StockInHand: stock,
                    Price: doc1.Price,
                    OverridePrice: doc1.OverridePrice,
                    Unit: doc1.Unit
                    ,User: sessionStorage.userName
                }, doc1._id, doc1._rev)
            }).then(function (response) {
                // handle response
            }).catch(function (err) {
                console.log(err);
            })
        };

        function addTran(tran) {
          
            return $q.when(_db.post(tran), UpdateStock(tran));
        };
         function addProdTran(tran) {
          
            return $q.when(_db.post(tran), UpdateProductStock(tran));
        };
        
        function UpdateProductStock(product) {
            _db.get(product.ProductNm).then(function (doc1) {
                var stock = 0;
                if (product.type == 'Return') {
                    var stock = parseInt(doc1.StockInHand) + parseInt(product.Quantity);
                }
                else if (product.type == 'Sales') {
                    var stock = parseInt(doc1.StockInHand) - parseInt(product.Quantity);
                }
                return _db.put({
                    type: "Product",
                    StockInHand: stock,
                    Price: doc1.Price,
                    User: sessionStorage.userName
                }, doc1._id, doc1._rev)
            }).then(function (response) {
                // handle response
            }).catch(function (err) {
                console.log(err);
            })
        };


        function addMaterial(material) {
            var doc = {
                    type: "Material",
                    _id : material._id,
                    StockInHand : material.StockInHand,
                    Price : material.Price
                    ,User: sessionStorage.userName
                };
            return _db.put(doc).then(function (response) {
                // handle response
            }).catch(function (err) {
                console.log(err);
            })

        };
        function addProduct(product) {
            var doc = {
                    type: "Product",
                    _id : product._id,
                    StockInHand : product.StockInHand,
                    Price : product.Price
                    ,User: sessionStorage.userName
                };
            return _db.put(doc).then(function (response) {
                // handle response
            }).catch(function (err) {
                console.log(err);
            })

        };

        function updateMaterial(material) {
            debugger;
            return $q.when(_db.put(material), UpdateStock(material));
        };

        function deleteMaterial(material) {
            return $q.when(_db.remove(material), UpdateStock(material));
        };

        
         function updateProduct(product) {
           // debugger;
            return $q.when(_db.put(product));
        };
        function deleteProduct(product) {
            
            return $q.when(_db.remove(product),getAllProducts());
            
        };
        function getdata(doc) {
            // sort by last name, first name, and age
            emit([doc.Quantity, doc.MaterialNm, doc.Price]);
        };


        function getAllMaterials() {
          console.log(_db);
            return $q.when(_db.query(function (doc, emit) {emit(doc.type);}, 
                    { key: "Material", include_docs: true }))
                      .then(function (docs) {
                          // Listen for changes on the database.
                          _db.changes({ live: true, since: 'now', include_docs: true })
                             .on('change', onDatabaseChange);
                          return docs.rows.map(function (row) {                
                                           return row.doc;
                          });;
                      });
        };

    function getInventory(queryType) {              
            return _db.query('MaterialView/'+queryType).then(function (docs){
                          // Listen for changes on the database.
                          _db.changes({ live: true, since: 'now', include_docs: true })
                             .on('change', onDatabaseChange);
                          return docs.rows.map(function (row) {  
                          return docs.rows[0].value;
                          });;
                           } )        
          }; 


        function getAllTransactions() {
            return $q.when(_db.allDocs({ include_docs: true }))
                          .then(function (docs) {
                           _tran = docs.rows.map(function (row) {
                              if ((row.doc.type != undefined) && (row.doc.type == "Issue")) {
                                  return row.doc;
                              };
                          });
                          return _tran;
                      });
        };

       function getAllProducts() {    
           return $q.when(_db.query(function (doc, emit) {emit(doc.type);}, 
                    { key: "Product", include_docs: true }))
                      .then(function (docs) {
                          // Listen for changes on the database.
                          _db.changes({ live: true, since: 'now', include_docs: true })
                             .on('change', onDatabaseProductChange);
                          return docs.rows.map(function (row) {                
                                           return row.doc;
                          });;
                      });            
        };

        function onDatabaseProductChange(change) {
            console.log(_product);
            var index = findIndex(_product, change.id);
            var product = _product[index];
            if (change.deleted) {
                if (product) {
                    _product.splice(index, 1); // delete
                }
            } else {
                if (product && product._id === change.id) {
                    _product[index] = change.doc; // update
                } else {
                    _product.splice(index, 0, change.doc) // insert
                }
            }
            _db.sync(remoteDB);
        }

        
        function onDatabaseChange(change) {
            var index = findIndex(_inventory, change.id);
            var inventory = _inventory[index];

            if (change.deleted) {
                if (inventory) {
                    _inventory.splice(index, 1); // delete
                }
            } else {
                if (inventory && inventory._id === change.id) {
                    _inventory[index] = change.doc; // update
                } else {
                    _inventory.splice(index, 0, change.doc) // insert
                }
            }
            _db.sync(remoteDB);
        }

        function findIndex(array, id) {
            var low = 0, high = array.length, mid;
            while (low < high) {
                mid = (low + high) >>> 1;
                array[mid]._id < id ? low = mid + 1 : high = mid
            }
            return low;
        }
    }
})();
