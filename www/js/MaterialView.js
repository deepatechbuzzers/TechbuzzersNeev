{
   "_id": "_design/MaterialView",
   "_rev": "12-15b2bf795c4d62fb51c7b1df5cb73074",
   "type": "InventoryView",
   "language": "javascript",
   "views": {
       "all_materials_Count": {
           "map": "function(doc) { if (doc.type == 'Material')  emit(doc.id, doc.stockInHand) }",
           "reduce": "_count"
       },
       "total_materials_cost": {
           "map": "function(doc) { if (doc.type == 'Material')  emit('doc.id', ((doc.StockInHand)*(doc.Price))) }",
           "reduce": "_sum"
       },
       "all_products_Count": {
           "map": "function(doc) { if (doc.type == 'Product')  emit(doc.id, doc.stockInHand) }",
           "reduce": "_count"
       },
       "total_Product_cost": {
           "map": "function(doc) { if (doc.type == 'Product')  emit('doc.id', ((doc.StockInHand)*(doc.Price))) }",
           "reduce": "_sum"
       },
       "all_returns_count": {
           "map": "function(doc) { if (doc.type == 'Returned')  emit(doc.id, doc.stockInHand) }",
           "reduce": "_count"
       },
       "total_returns_cost": {
           "map": "function(doc) { if (doc.type == 'Returned')  emit('doc.id', ((doc.StockInHand)*(doc.Price))) }",
           "reduce": "_sum"
       },
       "all_materials_Count_By_Date": {
           "map": "function(doc, filterDt) { if (doc.type == 'Material' && Date == filterDt)  emit(doc.date, doc.stockInHand) }",
           "reduce": "_count"
       }
   }
}