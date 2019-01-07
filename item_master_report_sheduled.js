function scheduled( type ) {
  try {
        var search = nlapiLoadSearch('item', 'customsearch_master_inv_report');

        var searchResults = search.runSearch();

        // resultIndex points to record starting current resultSet in the entire results array
        var resultIndex = 0;
        var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
        var resultSet; // temporary variable used to store the result set
        var itemMasterArr = [];
        var columns = [];
        columns.push( new nlobjSearchColumn('itemid', null, null) );
        columns.push( new nlobjSearchColumn('salesdescription', null, null) );
        columns.push( new nlobjSearchColumn('manufacturer', null, null) );
        columns.push( new nlobjSearchColumn('name', 'inventoryLocation', null) );
        columns.push( new nlobjSearchColumn('inventorylocation', null, null) );
        columns.push( new nlobjSearchColumn('custitemebay_store1', null, null) );
        columns.push( new nlobjSearchColumn('custitemebay_store2', null, null) );
        columns.push( new nlobjSearchColumn('custitemamz_us', null, null) );
        columns.push( new nlobjSearchColumn('custitemamz_cad', null, null) );
        columns.push( new nlobjSearchColumn('custitemamz_mx', null, null) );
        columns.push( new nlobjSearchColumn('custitemnewegg', null, null) );
        columns.push( new nlobjSearchColumn('locationquantityonhand', null, null) );
        columns.push( new nlobjSearchColumn('locationaveragecost', null, null) );
        columns.push( new nlobjSearchColumn('locationtotalvalue', null, null) );
        columns.push( new nlobjSearchColumn('custitemmin_sell_new', null, null) );
        columns.push( new nlobjSearchColumn('custitemmin_sell_nob', null, null) );
        columns.push( new nlobjSearchColumn('custitemmin_sell_ref', null, null) );
        columns.push( new nlobjSearchColumn('custitemmin_sell_used', null, null) );
        columns.push( new nlobjSearchColumn('custitemmax_qty_new', null, null) );
        columns.push( new nlobjSearchColumn('custitemmax_qty_ref', null, null) );
        columns.push( new nlobjSearchColumn('custitemmax_qty_used', null, null) );

        columns.push( new nlobjSearchColumn('custitemfba_sku_new', null, null) );  // FBA SKU NEW
        columns.push( new nlobjSearchColumn('custitem1', null, null) ); // FBA SKU REF
        columns.push( new nlobjSearchColumn('custitemfbm_sku_new', null, null) ); // FBM SKU NEW
        columns.push( new nlobjSearchColumn('custitemfbm_sku_nob', null, null) ); // FBM SKU NOB
        columns.push( new nlobjSearchColumn('custitemfbm_sku_ref', null, null) ); // FBM SKU REF
        columns.push( new nlobjSearchColumn('custitemfbm_sku_used', null, null) ); // FBM SKU USED

        // New Requirement 2018.11.23
        columns.push( new nlobjSearchColumn('class', null, null) ); // class
        columns.push( new nlobjSearchColumn('custitemtier', null, null) ); // tier
        
        var allCount = 0;
        do
        {
          resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
          
          for ( var i = 0; i < resultSet.length; i++ ) {
                var element = resultSet[i];
                var itemRecId = element.getId();
                var itemSku = element.getValue(columns[0]);
                var description = element.getValue(columns[1]);
                var manufacturer = element.getValue(columns[2]);
                var conditionWithParent = element.getValue(columns[3]);
                var condition = element.getText(columns[4]);
                var ebay1 = element.getValue(columns[5]);
                var ebay2 = element.getValue(columns[6]);
                var amz_us = element.getValue(columns[7]);
                var amz_cad = element.getValue(columns[8]);
                var amz_mx = element.getValue(columns[9]);
                var newegg = element.getValue(columns[10]);
                var quantity = element.getValue(columns[11]);
                var avgCost = element.getValue(columns[12]);
                var extCost = element.getValue(columns[13]);

                var min_sell_new = element.getValue(columns[14]);
                var min_sell_nob = element.getValue(columns[15]);
                var min_sell_ref = element.getValue(columns[16]);
                var min_sell_used = element.getValue(columns[17]);
                var max_qty_new = element.getValue(columns[18]);
                var max_qty_ref = element.getValue(columns[19]);
                var max_qty_used = element.getValue(columns[20]);

                var fba_sku_new = element.getValue(columns[21]);
                var fba_sku_ref = element.getValue(columns[22]);
                var fbm_sku_new = element.getValue(columns[23]);
                var fbm_sku_nob = element.getValue(columns[24]);
                var fbm_sku_ref = element.getValue(columns[25]);
                var fbm_sku_used = element.getValue(columns[26]);

                var itemClass = element.getText(columns[27]);
                var tier = element.getText(columns[28]);

                var parentCondition = conditionWithParent.split(':')[0].trim();
                var onlineInfo = '';
                if (ebay1 == 'T') {
                    onlineInfo += 'ebay1,';
                }
                if (ebay2 == 'T') {
                    onlineInfo += 'ebay2,';
                }
                if (amz_us == 'T') {
                    onlineInfo += 'amz_us,';
                }
                if (amz_cad == 'T') {
                    onlineInfo += 'amz_cad,';
                }
                if (amz_mx == 'T') {
                    onlineInfo += 'amz_mx,';
                }
                if (newegg == 'T') {
                    onlineInfo += 'newegg,';
                }
                if (onlineInfo != '') {
                    onlineInfo = onlineInfo.substr(0, onlineInfo.length - 1);
                }

                if (avgCost) {
                    avgCost = avgCost * 1;
                    avgCost = avgCost.toFixed(2);
                }

                if (extCost) {
                    extCost = extCost * 1;
                    extCost = extCost.toFixed(2);
                }

                var itemObj = new Object;
                itemObj.itemRecId = itemRecId;
                itemObj.itemSku = itemSku;
                itemObj.description = description;
                itemObj.manufacturer = manufacturer;
                itemObj.class = itemClass;
                itemObj.tier = tier;
                itemObj.onlineInfo = onlineInfo;
                itemObj.parentCondition = parentCondition;
                itemObj.condition = condition;
                itemObj.quantity = quantity;
                itemObj.avgCost = avgCost;
                itemObj.extCost = extCost;
                itemObj.min_sell_new = min_sell_new;
                itemObj.min_sell_nob = min_sell_nob;
                itemObj.min_sell_ref = min_sell_ref;
                itemObj.min_sell_used = min_sell_used;
                itemObj.max_qty_new = max_qty_new;
                itemObj.max_qty_ref = max_qty_ref;
                itemObj.max_qty_used = max_qty_used;
                itemObj.fba_sku_new = fba_sku_new; 
                itemObj.fba_sku_ref = fba_sku_ref;
                itemObj.fbm_sku_new = fbm_sku_new;
                itemObj.fbm_sku_nob = fbm_sku_nob;
                itemObj.fbm_sku_ref = fbm_sku_ref;
                itemObj.fbm_sku_used = fbm_sku_used;

                itemMasterArr.push(itemObj);

                if( (i % 5) == 0 ) {
                   setRecoveryPoint();
                }
                checkGovernance(); 
               
                allCount ++;
           }

          resultIndex = resultIndex + resultStep;

        } while (resultSet.length > 0);

        // We have to make a item object in order to improve search speed. That is, we don't do the array search.
        var itemMasterArr = sortByCondition(itemMasterArr);
        var conditionArr = [];
        var itemMasterArrObj = new Object;

        for (var i = 0; i < itemMasterArr.length; i ++) {
            
            if(i > 0 && itemMasterArr[i].itemRecId != itemMasterArr[i - 1].itemRecId){
                conditionArr = [];
            }    
            var conditionObj = new Object;
            conditionObj.parentCondition = itemMasterArr[i].parentCondition;
            conditionObj.condition = itemMasterArr[i].condition;
            conditionObj.quantity = itemMasterArr[i].quantity;
            conditionObj.avgCost = itemMasterArr[i].avgCost;
            conditionObj.extCost = itemMasterArr[i].extCost;
            conditionObj.daasPrice = '';
            conditionObj.lastSalePrice = '';
            conditionObj.lastSaleDate = '';
            conditionObj.unitsSold30 = '';
            conditionObj.unitsSold60 = '';
            conditionObj.unitsSold90 = '';
            conditionObj.unitsSold180 = '';
            conditionObj.unitsSold365 = '';
            conditionObj.revenue30Amt = '';
            conditionObj.revenue60Amt = '';
            conditionObj.revenue90Amt = '';
            conditionObj.revenue30Qty = '';
            conditionObj.revenue60Qty = '';
            conditionObj.revenue90Qty = '';
            conditionObj.cost30Amt = '';
            conditionObj.cost60Amt = '';
            conditionObj.cost90Amt = '';
            conditionObj.cost30Qty = '';
            conditionObj.cost60Qty = '';
            conditionObj.cost90Qty = '';
            conditionObj.poIntransit = '';
            conditionObj.poLanded = '';
            conditionObj.poBreakdown = '';
            conditionObj.poPendingReceipt = '';
            conditionObj.poTotalIncoming = '';
            conditionObj.poTotalAmount = '';
            conditionObj.amzsku = '';

            if (conditionObj.avgCost) {
                conditionObj.daasPrice = (conditionObj.avgCost * 1 / 0.85) * 1.16 / 24;
            }

            if (itemMasterArr[i].parentCondition == 'NEW') {
                conditionObj.minSellPrice = itemMasterArr[i].min_sell_new;
                conditionObj.maxQty = itemMasterArr[i].max_qty_new;
            } else if (itemMasterArr[i].parentCondition == 'NOB') {
                conditionObj.minSellPrice = itemMasterArr[i].min_sell_nob;
                conditionObj.maxQty = '';
            } else if (itemMasterArr[i].parentCondition == 'REF') {
                conditionObj.minSellPrice = itemMasterArr[i].min_sell_ref;
                conditionObj.maxQty = itemMasterArr[i].max_qty_ref;
            } else if (itemMasterArr[i].parentCondition == 'USED') {
                conditionObj.minSellPrice = itemMasterArr[i].min_sell_used;
                conditionObj.maxQty = itemMasterArr[i].max_qty_used;
            } else {
                conditionObj.minSellPrice = '';
                conditionObj.maxQty = '';
            }

            if (itemMasterArr[i].condition == 'AMZN') {
                conditionObj.amzsku = itemMasterArr[i].fba_sku_new;
            } else if (itemMasterArr[i].condition == 'AMZR') {
                conditionObj.amzsku = itemMasterArr[i].fba_sku_ref;
            } else if (itemMasterArr[i].condition == 'NEW-A') {
                conditionObj.amzsku = itemMasterArr[i].fbm_sku_new;
            } else if (itemMasterArr[i].condition == 'NOB-A') {
                conditionObj.amzsku = itemMasterArr[i].fbm_sku_nob;
            } else if (itemMasterArr[i].condition == 'REF-A') {
                conditionObj.amzsku = itemMasterArr[i].fbm_sku_ref;
            } else if (itemMasterArr[i].condition == 'USED-A') {
                conditionObj.amzsku = itemMasterArr[i].fbm_sku_used;
            }


            conditionArr.push(conditionObj);

            var itemObj = new Object;
            itemObj.itemSku = itemMasterArr[i].itemSku;
            itemObj.description = itemMasterArr[i].description;
            itemObj.manufacturer = itemMasterArr[i].manufacturer;
            itemObj.class = itemMasterArr[i].class;
            itemObj.tier = itemMasterArr[i].tier;
            itemObj.onlineInfo = itemMasterArr[i].onlineInfo;
            itemObj.conditionArr = conditionArr;
           
            itemMasterArrObj[itemMasterArr[i].itemRecId] = itemObj;
        }

        nlapiLogExecution('Debug', 'Step : 1', 'Item Master Search Done!');
        itemMasterArrObj = trackSO(itemMasterArrObj);
        if (itemMasterArrObj) {
            itemMasterArrObj = trackRevenue(itemMasterArrObj);
            if (itemMasterArrObj) {
                itemMasterArrObj = trackCost(itemMasterArrObj);
                if (itemMasterArrObj) {
                    itemMasterArrObj = trackPO(itemMasterArrObj);
                    if (itemMasterArrObj) {
                        saveItemMasterData(itemMasterArrObj);
                    }
                }
            }
        }
        

      //  var employeeId = 256500;
      //  var receipt = 'codemanstar3@outlook.com';
      //  nlapiSendEmail( employeeId, receipt, 'Track Item Master', JSON.stringify(itemMasterArrObj) ); 

  } catch ( error ) {

    if ( error.getDetails != undefined ) {
      nlapiLogExecution( "error", "Process Error - Main", error.getCode() + ":" + error.getDetails() );
    } else {
      nlapiLogExecution( "error", "Unexpected Error", error.toString() );
    }

  }
}

function trackSO(itemMasterArrObj)
{
    try {
        var search = nlapiLoadSearch('transaction', 'customsearch_so_master_inv_report');

        var searchResults = search.runSearch();

        // resultIndex points to record starting current resultSet in the entire results array
        var resultIndex = 0;
        var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
        var resultSet; // temporary variable used to store the result set
        var itemMasterArr = [];
        var columns = [];
        columns.push( new nlobjSearchColumn('item', null, null) );
        columns.push( new nlobjSearchColumn('trandate', null, null) );
        columns.push( new nlobjSearchColumn('grossamount', null, null) );
        columns.push( new nlobjSearchColumn('quantity', null, null) );
        columns.push( new nlobjSearchColumn('location', null, null) );
        columns.push( new nlobjSearchColumn('locationnohierarchy', null, null) );
        // columns.push( new nlobjSearchColumn('accounttype', null, null) );    
        
        var allCount = 0;
        do
        {
          resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
          
          for ( var i = 0; i < resultSet.length; i++ ) {

                var element = resultSet[i];
                var itemRecId = element.getValue(columns[0]);
                var saleDate = element.getValue(columns[1]);
                var amount = element.getValue(columns[2]) * 1;
                var quantity = element.getValue(columns[3]) * 1;
                var conditionWithParent = element.getText(columns[4]);
                var condition = element.getText(columns[5]);
                
                var parentCondition = conditionWithParent.split(':')[0].trim();
                var salePrice = '';    
                if (quantity > 0 && amount > 0) {
                    salePrice = amount / quantity;    
                    salePrice = salePrice.toFixed(2);
                }
                
                var itemObj = itemMasterArrObj[itemRecId];
                if (undefined == itemObj || itemObj == 'undefined') {
                    continue;
                }
                var conditionArr = itemObj.conditionArr;
                for (var k = 0; k < conditionArr.length; k ++) {
                    if (conditionArr[k].parentCondition == parentCondition && conditionArr[k].condition == condition) {
                        var tmpDate1 = new Date(saleDate);

                        // We get the date and the price last sold in here
                        if (conditionArr[k].lastSaleDate != '') {
                            var tmpDate2 = new Date(conditionArr[k].lastSaleDate);
                            if (tmpDate1 > tmpDate2) {
                                conditionArr[k].lastSaleDate = saleDate;
                                conditionArr[k].lastSalePrice = salePrice;
                            }
                        } else {
                            conditionArr[k].lastSaleDate = saleDate;
                            conditionArr[k].lastSalePrice = salePrice;
                        }

                        var today = new Date();
                        var ago30 = new Date();
                        var ago60 = new Date();
                        var ago90 = new Date();
                        var ago180 = new Date();
                        ago30.setDate(today.getDate() - 30);
                        ago60.setDate(today.getDate() - 60);
                        ago90.setDate(today.getDate() - 90);
                        ago180.setDate(today.getDate() - 180);

                        var _saleDate = new Date(saleDate);
                        if (_saleDate > ago30) {
                            var unitsSold30 = conditionArr[k].unitsSold30 * 1;
                            conditionArr[k].unitsSold30 = unitsSold30 + quantity;
                        }
                        if (_saleDate > ago60) {
                            var unitsSold60 = conditionArr[k].unitsSold60 * 1;
                            conditionArr[k].unitsSold60 = unitsSold60 + quantity;
                        }
                        if (_saleDate > ago90) {
                            var unitsSold90 = conditionArr[k].unitsSold90 * 1;
                            conditionArr[k].unitsSold90 = unitsSold90 + quantity;
                        }

                        if (_saleDate > ago180) {
                            var unitsSold180 = conditionArr[k].unitsSold180 * 1;
                            conditionArr[k].unitsSold180 = unitsSold180 + quantity;
                        }

                        var unitsSold365 = conditionArr[k].unitsSold365 * 1;
                        conditionArr[k].unitsSold365 = unitsSold365 + quantity;
                    }


                }
                itemObj.conditionArr = conditionArr;
                itemMasterArrObj[itemRecId] = itemObj;

                if( (i % 5) == 0 ) {
                   setRecoveryPoint();
                }
                checkGovernance();                    
                allCount ++;
           }

          resultIndex = resultIndex + resultStep;

        } while (resultSet.length > 0);
        nlapiLogExecution('Debug', 'Step : 2', 'Sales Order Search Done!');
        return itemMasterArrObj;
        
        // var employeeId = 256500;
        // var receipt = 'codemanstar3@outlook.com';
        // nlapiSendEmail( employeeId, receipt, 'itemMaster-test-555', JSON.stringify(itemMasterArrObj) ); 

      } catch ( error ) {

        if ( error.getDetails != undefined ) {
          nlapiLogExecution( "error", "Process Error - Track Sales Order", error.getCode() + ":" + error.getDetails() );
        } else {
          nlapiLogExecution( "error", "Unexpected Error", error.toString() );
        }

      }
}

function trackRevenue(itemMasterArrObj)
{
    try {
        var search = nlapiLoadSearch('transaction', 'customsearch_item_master_report_revenue');

        var searchResults = search.runSearch();

        // resultIndex points to record starting current resultSet in the entire results array
        var resultIndex = 0;
        var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
        var resultSet; // temporary variable used to store the result set
        var itemMasterArr = [];
        var columns = [];
        columns.push( new nlobjSearchColumn('item', null, null) );
        columns.push( new nlobjSearchColumn('trandate', null, null) );
        columns.push( new nlobjSearchColumn('amount', null, null) );
        columns.push( new nlobjSearchColumn('quantity', null, null) );
        columns.push( new nlobjSearchColumn('location', null, null) );
        columns.push( new nlobjSearchColumn('locationnohierarchy', null, null) );
        // columns.push( new nlobjSearchColumn('accounttype', null, null) );    
        
        var allCount = 0;
        do
        {
          resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
          
          for ( var i = 0; i < resultSet.length; i++ ) {

                var element = resultSet[i];
                var itemRecId = element.getValue(columns[0]) * 1;
                var saleDate = element.getValue(columns[1]);
                var amount = element.getValue(columns[2]) * 1;
                var quantity = element.getValue(columns[3]) * 1;
                var conditionWithParent = element.getText(columns[4]);
                var condition = element.getText(columns[5]);
                
                var parentCondition = conditionWithParent.split(':')[0].trim();
                var itemObj = itemMasterArrObj[itemRecId];
                if (undefined == itemObj || itemObj == 'undefined') {
                    continue;
                }
                
                var conditionArr = itemObj.conditionArr;
                for (var k = 0; k < conditionArr.length; k ++) {
                    if (conditionArr[k].parentCondition == parentCondition && conditionArr[k].condition == condition) {
                        var tmpDate1 = new Date(saleDate);

                        var today = new Date();
                        var ago30 = new Date();
                        var ago60 = new Date();
                        var ago90 = new Date();
                        ago30.setDate(today.getDate() - 30);
                        ago60.setDate(today.getDate() - 60);
                        ago90.setDate(today.getDate() - 90);
                        
                        var _saleDate = new Date(saleDate);
                        if (_saleDate > ago30) {
                            var revenue30Amt = conditionArr[k].revenue30Amt * 1;
                            conditionArr[k].revenue30Amt = revenue30Amt + amount;
                            var revenue30Qty = conditionArr[k].revenue30Qty * 1;
                            conditionArr[k].revenue30Qty = revenue30Qty + quantity;
                        }
                        if (_saleDate > ago60) {
                            var revenue60Amt = conditionArr[k].revenue60Amt * 1;
                            conditionArr[k].revenue60Amt = revenue60Amt + amount;
                            var revenue60Qty = conditionArr[k].revenue60Qty * 1;
                            conditionArr[k].revenue60Qty = revenue60Qty + quantity;
                   //         nlapiLogExecution('Debug', 'revenue60Amt', revenue60Amt);
                        }
                        if (_saleDate > ago90) {
                            var revenue90Amt = conditionArr[k].revenue90Amt * 1;
                            conditionArr[k].revenue90Amt = revenue90Amt + amount;
                            var revenue90Qty = conditionArr[k].revenue90Qty * 1;
                            conditionArr[k].revenue90Qty = revenue90Qty + quantity;
                       //     if (itemRecId == 4463) {
                                nlapiLogExecution('Debug', conditionArr[k].revenue90Amt, amount);
                       //     }
                        }
                    }
                }
                itemObj.conditionArr = conditionArr;
                itemMasterArrObj[itemRecId] = itemObj;

                if( (i % 5) == 0 ) {
                   setRecoveryPoint();
                }
                checkGovernance();                    
                allCount ++;
           }

          resultIndex = resultIndex + resultStep;

        } while (resultSet.length > 0);
        nlapiLogExecution('Debug', 'Step : 2', 'Revenue Search Done!');
        return itemMasterArrObj;
        
        // var employeeId = 256500;
        // var receipt = 'codemanstar3@outlook.com';
        // nlapiSendEmail( employeeId, receipt, 'itemMaster-test-555', JSON.stringify(itemMasterArrObj) ); 

      } catch ( error ) {

        if ( error.getDetails != undefined ) {
          nlapiLogExecution( "error", "Process Error - Track Sales Order", error.getCode() + ":" + error.getDetails() );
        } else {
          nlapiLogExecution( "error", "Unexpected Error", error.toString() );
        }

      }
}

function trackCost(itemMasterArrObj)
{
    try {
        var search = nlapiLoadSearch('transaction', 'customsearch_item_master_report_cost');

        var searchResults = search.runSearch();

        // resultIndex points to record starting current resultSet in the entire results array
        var resultIndex = 0;
        var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
        var resultSet; // temporary variable used to store the result set
        var itemMasterArr = [];
        var columns = [];
        columns.push( new nlobjSearchColumn('item', null, null) );
        columns.push( new nlobjSearchColumn('trandate', null, null) );
        columns.push( new nlobjSearchColumn('amount', null, null) );
        columns.push( new nlobjSearchColumn('quantity', null, null) );
        columns.push( new nlobjSearchColumn('location', null, null) );
        columns.push( new nlobjSearchColumn('locationnohierarchy', null, null) );
        // columns.push( new nlobjSearchColumn('accounttype', null, null) );    
        
        var allCount = 0;
        do
        {
          resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
          
          for ( var i = 0; i < resultSet.length; i++ ) {

                var element = resultSet[i];
                var itemRecId = element.getValue(columns[0]);
                var saleDate = element.getValue(columns[1]);
                var amount = element.getValue(columns[2]) * 1;
                var quantity = element.getValue(columns[3]) * 1;
                var conditionWithParent = element.getText(columns[4]);
                var condition = element.getText(columns[5]);
                
                var parentCondition = conditionWithParent.split(':')[0].trim();
                var itemObj = itemMasterArrObj[itemRecId];
                if (undefined == itemObj || itemObj == 'undefined') {
                    continue;
                }
                
                var conditionArr = itemObj.conditionArr;
                for (var k = 0; k < conditionArr.length; k ++) {
                    if (conditionArr[k].parentCondition == parentCondition && conditionArr[k].condition == condition) {
                        var tmpDate1 = new Date(saleDate);

                        var today = new Date();
                        var ago30 = new Date();
                        var ago60 = new Date();
                        var ago90 = new Date();
                        ago30.setDate(today.getDate() - 30);
                        ago60.setDate(today.getDate() - 60);
                        ago90.setDate(today.getDate() - 90);
                        
                        var _saleDate = new Date(saleDate);
                        if (_saleDate > ago30) {
                            var cost30Amt = conditionArr[k].cost30Amt * 1;
                            conditionArr[k].cost30Amt = cost30Amt + amount;
                            var cost30Qty = conditionArr[k].cost30Qty * 1;
                            conditionArr[k].cost30Qty = cost30Qty + quantity;
                        }
                        if (_saleDate > ago60) {
                            var cost60Amt = conditionArr[k].cost60Amt * 1;
                            conditionArr[k].cost60Amt = cost60Amt + amount;
                            var cost60Qty = conditionArr[k].cost60Qty * 1;
                            conditionArr[k].cost60Qty = cost60Qty + quantity;
                        }
                        if (_saleDate > ago90) {
                            var cost90Amt = conditionArr[k].cost90Amt * 1;
                            conditionArr[k].cost90Amt = cost90Amt + amount;
                            var cost90Qty = conditionArr[k].cost90Qty * 1;
                            conditionArr[k].cost90Qty = cost90Qty + quantity;
                        }
                    }
                }
                itemObj.conditionArr = conditionArr;
                itemMasterArrObj[itemRecId] = itemObj;

                if( (i % 5) == 0 ) {
                   setRecoveryPoint();
                }
                checkGovernance();                    
                allCount ++;
           }

          resultIndex = resultIndex + resultStep;

        } while (resultSet.length > 0);
        nlapiLogExecution('Debug', 'Step : 2', 'Cost Search Done!');
        return itemMasterArrObj;
        
        // var employeeId = 256500;
        // var receipt = 'codemanstar3@outlook.com';
        // nlapiSendEmail( employeeId, receipt, 'itemMaster-test-555', JSON.stringify(itemMasterArrObj) ); 

      } catch ( error ) {

        if ( error.getDetails != undefined ) {
          nlapiLogExecution( "error", "Process Error - Track Sales Order", error.getCode() + ":" + error.getDetails() );
        } else {
          nlapiLogExecution( "error", "Unexpected Error", error.toString() );
        }

      }
}

function trackPO(itemMasterArrObj)
{
   try {
        var search = nlapiLoadSearch('transaction', 'customsearch_po_master_inv_report');

        // var filters = search.getFilters()
        // for (var i = 0; i < filters.length; i++) {
        //     res.writeLine(filters[i]);
        // }

        // var results = search.getColumns()
        // for (var i = 0; i < results.length; i++) {
        //     nlapiLogExecution('Debug', i, results[i]);
        // }
        // return;

        var searchResults = search.runSearch();

        // resultIndex points to record starting current resultSet in the entire results array
        var resultIndex = 0;
        var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
        var resultSet; // temporary variable used to store the result set
        var itemMasterArr = [];
        var columns = [];
        columns.push( new nlobjSearchColumn('item', null, null) );
        columns.push( new nlobjSearchColumn('trandate', null, null) );
        columns.push( new nlobjSearchColumn('grossamount', null, null) );
        columns.push( new nlobjSearchColumn('quantity', null, null) );
        columns.push( new nlobjSearchColumn('location', null, null) );
        columns.push( new nlobjSearchColumn('locationnohierarchy', null, null) );
        columns.push( new nlobjSearchColumn('custbody_deal_status', null, null) );    
        
        var allCount = 0;
        do
        {
          resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
          
          for ( var i = 0; i < resultSet.length; i++ ) {

                var element = resultSet[i];
                var itemRecId = element.getValue(columns[0]);
                var saleDate = element.getValue(columns[1]);
                var amount = element.getValue(columns[2]) * 1;
                var quantity = element.getValue(columns[3]) * 1;
                var conditionWithParent = element.getText(columns[4]);
                var condition = element.getText(columns[5]);
                var dealStatus = element.getText(columns[6]);

                var parentCondition = conditionWithParent.split(':')[0].trim();
                               
                var itemObj = itemMasterArrObj[itemRecId];
                if (undefined == itemObj || itemObj == 'undefined') {
                    continue;
                }
                var conditionArr = itemObj.conditionArr;
                for (var k = 0; k < conditionArr.length; k ++) {
                    if (conditionArr[k].parentCondition == parentCondition && conditionArr[k].condition == condition) {
                        if (dealStatus == 'In Transit') {
                            var transit = conditionArr[k].poIntransit * 1;
                            conditionArr[k].poIntransit = transit + quantity;

                            var totalIncoming = conditionArr[k].poTotalIncoming * 1;
                            conditionArr[k].poTotalIncoming = totalIncoming + quantity;
                            var totalAmount = conditionArr[k].poTotalAmount * 1;
                            conditionArr[k].poTotalAmount = totalAmount + amount;
                        } else if (dealStatus == 'Landed Pre-Breakdown') {
                            var landed = conditionArr[k].poLanded * 1;
                            conditionArr[k].poLanded = landed + quantity;

                            var totalIncoming = conditionArr[k].poTotalIncoming * 1;
                            conditionArr[k].poTotalIncoming = totalIncoming + quantity;
                            var totalAmount = conditionArr[k].poTotalAmount * 1;
                            conditionArr[k].poTotalAmount = totalAmount + amount;
                        } else if (dealStatus == 'Pending Disposition') {
                            var breakDown = conditionArr[k].poBreakdown * 1;
                            conditionArr[k].poBreakdown = breakDown + quantity;

                            var totalIncoming = conditionArr[k].poTotalIncoming * 1;
                            conditionArr[k].poTotalIncoming = totalIncoming + quantity;
                            var totalAmount = conditionArr[k].poTotalAmount * 1;
                            conditionArr[k].poTotalAmount = totalAmount + amount;
                        } else if (dealStatus == 'Pending Receiving') {
                            var pendingReceipt = conditionArr[k].poPendingReceipt * 1;           
                            conditionArr[k].poPendingReceipt = pendingReceipt + quantity;

                            var totalIncoming = conditionArr[k].poTotalIncoming * 1;
                            conditionArr[k].poTotalIncoming = totalIncoming + quantity;
                            var totalAmount = conditionArr[k].poTotalAmount * 1;
                            conditionArr[k].poTotalAmount = totalAmount + amount;
                        }
                    }
                }
                itemObj.conditionArr = conditionArr;
                itemMasterArrObj[itemRecId] = itemObj;

                if( (i % 5) == 0 ) {
                   setRecoveryPoint();
                }
                checkGovernance();                    
                allCount ++;
           }

          resultIndex = resultIndex + resultStep;

        } while (resultSet.length > 0);
        nlapiLogExecution('Debug', 'Step : 3', 'Purchase Order Search Done!');
        return itemMasterArrObj;
        // var employeeId = 256500;
        // var receipt = 'codemanstar3@outlook.com';
        // nlapiSendEmail( employeeId, receipt, 'itemMaster-test-111', JSON.stringify(itemMasterArrObj) ); 

      } catch ( error ) {

        if ( error.getDetails != undefined ) {
          nlapiLogExecution( "error", "Process Error - Track Purchase Order", error.getCode() + ":" + error.getDetails() );
        } else {
          nlapiLogExecution( "error", "Unexpected Error", error.toString() );
        }

      }
}

function sortByCondition(itemMasterArr)
{
    var conditionSort = new Object;
    conditionSort['NEW'] = 0;
    conditionSort['NEW-A'] = 1;
    conditionSort['NEW-CA'] = 2;
    conditionSort['NEW-TO'] = 3;
    conditionSort['AMZN'] = 4;
    conditionSort['NOB'] = 5;
    conditionSort['NOB-A'] = 6;
    conditionSort['NOB-CA'] = 7;
    conditionSort['NOB-TO'] = 8;
    conditionSort['REF'] = 9;
    conditionSort['REF-A'] = 10;
    conditionSort['REF-B'] = 11;
    conditionSort['REF-C'] = 12;
    conditionSort['REF-CA'] = 13;
    conditionSort['REF-CB'] = 14;
    conditionSort['REF-CC'] = 15;
    conditionSort['REF-OEM'] = 16;
    conditionSort['REF-TO'] = 17;
    conditionSort['AMZR'] = 18;
    conditionSort['INGRAM'] = 19;
    conditionSort['INGR'] = 20;
    conditionSort['USED'] = 21;
    conditionSort['OOS-A'] = 22;
    conditionSort['OOS-B'] = 23;
    conditionSort['OOS-C'] = 24;
    conditionSort['OOS-CA'] = 25;
    conditionSort['OOS-CB'] = 26;
    conditionSort['OOS-CC'] = 27;
    conditionSort['LOCKED'] = 28;
    conditionSort['Bulk'] = 29;
    conditionSort['Bulk-A'] = 30;
    conditionSort['Bulk-B'] = 31;
    conditionSort['Bulk-C'] = 32;
    conditionSort['Bulk-CA'] = 33;
    conditionSort['Bulk-CB'] = 34;
    conditionSort['Bulk-CC'] = 35;
    conditionSort['RMA'] = 36;
    conditionSort['TEST'] = 37;
    conditionSort['TIER'] = 38;
    conditionSort['DEF'] = 39;
    conditionSort['BLANK'] = 40;
    conditionSort['JUXTO'] = 41;
    conditionSort['LOST'] = 42;
    conditionSort['DMG'] = 43;
    
    for (var i = 0; i < itemMasterArr.length - 1; i ++) {
        for (var j = i + 1; j < itemMasterArr.length ; j ++) {
            var itemRecId = itemMasterArr[i].itemRecId;
            var manufacturer = itemMasterArr[i].manufacturer;
            var sortOrder = conditionSort[itemMasterArr[i].condition] * 1;
            var _itemRecId = itemMasterArr[j].itemRecId;
            var _manufacturer = itemMasterArr[j].manufacturer;
            var _sortOrder = conditionSort[itemMasterArr[j].condition] * 1;
            if (itemRecId == _itemRecId && manufacturer == _manufacturer) {
                if (sortOrder > _sortOrder) {
                    var tmpObj = itemMasterArr[i];
                    itemMasterArr[i] = itemMasterArr[j];
                    itemMasterArr[j] = tmpObj;
                }
            }
        }
    }

    return itemMasterArr;
}

function saveItemMasterData(itemMasterArrObj)
{
    var json_data = JSON.stringify(itemMasterArrObj);
    var attachment = nlapiCreateFile('itemMasterData.json', 'PLAINTEXT', json_data);
    attachment.setFolder('-15');
    var fileid = nlapiSubmitFile(attachment);
}

function checkGovernance()
{
 var context = nlapiGetContext();
 if( context.getRemainingUsage() < 200 )
 {
    var state = nlapiYieldScript();
    if( state.status == 'FAILURE')
    {
        nlapiLogExecution("ERROR","Failed to yield script, exiting: Reason = "+state.reason + " / Size = "+ state.size);
        throw "Failed to yield script";
    } 
    else if ( state.status == 'RESUME' )
    {
         nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason+".  Size = "+ state.size);
    }
  // state.status will never be SUCCESS because a success would imply a yield has occurred.  The equivalent response would be yield
 }
}

function setRecoveryPoint()
{
 var state = nlapiSetRecoveryPoint(); //100 point governance
 if( state.status == 'SUCCESS' ) {
    nlapiLogExecution("Audit", "Recovery Point Success");
    return;  //we successfully create a new recovery point
 }
 if( state.status == 'RESUME' ) //a recovery point was previously set, we are resuming due to some unforeseen error
 {
    nlapiLogExecution("ERROR", "Resuming script because of " + state.reason+".  Size = "+ state.size);
 //   handleScriptRecovery();
 }
 else if ( state.status == 'FAILURE' )  //we failed to create a new recovery point
 {
     nlapiLogExecution("ERROR","Failed to create recovery point. Reason = "+state.reason + " / Size = "+ state.size);
     handleRecoveryFailure(state);
 }
}

function handleRecoverFailure(failure)
{
     if( failure.reason == 'SS_MAJOR_RELEASE' ) throw "Major Update of NetSuite in progress, shutting down all processes";
     if( failure.reason == 'SS_CANCELLED' ) throw "Script Cancelled due to UI interaction";
     if( failure.reason == 'SS_EXCESSIVE_MEMORY_FOOTPRINT' ) { cleanUpMemory(); setRecoveryPoint(); }//avoid infinite loop
     if( failure.reason == 'SS_DISALLOWED_OBJECT_REFERENCE' ) throw "Could not set recovery point because of a reference to a non-recoverable object: "+ failure.information; 
}

function cleanUpMemory(){
     nlapiLogExecution("Debug", "Cleanup_Memory", "Cleanup_Memory");
}