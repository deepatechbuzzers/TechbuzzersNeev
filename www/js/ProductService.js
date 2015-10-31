var x;
(function () {

    angular.module('starter').factory('ProductService', ['$q','$http', ProductService]);

    function ProductService($q,$http) {
        var _db;
        var _product;
        var remoteDB;
        var _tran;
        var _product;

        return {
            initDB: initDB,
            getAllProducts: getAllProducts,
            TestQueries: TestQueries,
            getAllMaterials: getAllMaterials,
            addMaterial: addMaterial,
            updateMaterial: updateMaterial,
            deleteMaterial: deleteMaterial,
            addTran: addTran,
            getAllTransactions: getAllTransactions //,
            //getCount : getCount
        };

        function initDB() {
  
             console.log("initialising db")
            // Creates the database or opens if it already exists            
            _db = new PouchDB('inventory',{ adapter: 'websql' });
            //remoteDB = new PouchDB('http://54.149.244.161:5984/inventorynew');
            //remoteDB = new PouchDB('http://127.0.0.1:5984/inventory');
            //remoteDB = new PouchDB('http://127.0.0.1:5984/inventory');
            remoteDB = new PouchDB('http://54.149.244.161:5984/inventorynew');
            
            
            console.log("connected to remote DB aws");

            console.log(_db);
            console.log(remoteDB);
            _db.replicate.from(remoteDB);

            //$.when(function(){_db.replicate.from(remoteDB)}).then(function(dataR){_db.replicate.to(remoteDB,{live:true},function(err){console.log('error in synchronizing');})}) 
            //_db.replicate.to(remoteDB,{live:true},function(err){console.log('error in synchronizing');});
            console.log('done with synchronizing');

            
        };

        function UpdateStock(material) {

            _db.get(material.MaterialNm).then(function (doc1) {
                var stock = 0;
                if (material.type === 'Receive') {
                    var stock = parseInt(doc1.StockInHand) + parseInt(material.Quantity);
                }
                else if (material.type === 'Issue') {
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


        function addMaterial(material) {
            return $q.when(_db.post(material), UpdateStock(material));
        };


        function updateMaterial(material) {
            return $q.when(_db.put(material), UpdateStock(material));
        };

        function deleteMaterial(material) {
            return $q.when(_db.remove(material), UpdateStock(material));
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

        function getAllTransactions() {

            //if (!_inventory) {
            return $q.when(_db.allDocs({ include_docs: true }))
           //db.query(function(doc) {emit(doc.hp)}, {startkey: horsePower, include_docs: true});

                      .then(function (docs) {


                          _tran = docs.rows.map(function (row) {
                              // if ((row.doc.type!=undefined) && ((row.doc.type == "Issue") || (row.doc.type == "Receive")))
                              //{
                              // Dates are not automatically converted from a string.
                              //row.doc.Date = new Date(row.doc.Date);
                              if ((row.doc.type != undefined) && (row.doc.type == "Issue")) {
                                  // Dates are not automatically converted from a string.
                                  //row.doc.Date = new Date(row.doc.Date);
                                  return row.doc;
                              };
                              //return row.doc;
                              //};
                          });
                          // Listen for changes on the database.
                          //remotedb.changes({ live: true, since: 'now', include_docs: true})
                          //  .on('change', onDatabaseTranChange);

                          return _tran;
                      });
            //} else {
            // Return cached data as a promise
            //    return $q.when(_inventory);
            //}
        };

        function getAllProducts() {      

            var rows = _db.query(function (doc, emit) {
                emit(doc.type);
            }, { key: "Product", include_docs: true })
            .then(function (result) {
                 console.log(result.rows);
                 }).catch(function (err) {
                // handle any errors
                  return result.rows;
            }).catch(function (err) {
                // handle any errors
            });
            return rows;
            
        };

        function onDatabaseProductChange(change) {
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

        function TestQueries() {
            _db.query(function (doc, emit) {
                emit(doc.type);
            }, { Type : "Material", include_docs: true }).then(function (result) {
                // found docs with name === 'foo'


                console.log(result.rows);
            }).catch(function (err) {
                // handle any errors
            });
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
