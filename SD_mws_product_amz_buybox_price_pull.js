function scheduled() {

    var allCount = 0;
    var allIndex = 0;
    var isLimit = false;
    try {
        var search = nlapiLoadSearch( 'item', 'customsearch347' );
        var searchResults = search.runSearch();
        var cols = search.getColumns();
        
        // resultIndex points to record starting current resultSet in the entire results array
        var resultIndex = 0;
        var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
        var resultSet; // temporary variable used to store the result set
        var inv_body = [];
        
        var mwsParamRec = nlapiLoadRecord('customrecord_mws_sync_key_parameter_set', 1);
        var syncedCount = mwsParamRec.getFieldValue('custrecord_buybox_pull_count') * 1;
        do
        {
            resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);

            for ( var i = 0; i < resultSet.length; i++ ) {
                if (allIndex < syncedCount) {
                    allIndex ++;
                    continue;
                }
                checkGovernance();
                var element = resultSet[i];
                var itemId = element.getId();
                var itemObj = getItemData(itemId);
                inv_body.push(itemObj);
                allCount ++;
                if (allCount >= 200) {
                    addSyncedCount(syncedCount, 200);
                    isLimit = true;
                    break;
                }
            }

            if (isLimit) { break; }

            resultIndex = resultIndex + resultStep;

        } while (resultSet.length > 0);
        
        if (allCount < 200) {
            addSyncedCount(0, 0);
        }
        if ( inv_body.length > 0 ) {
            postAllData(inv_body);
        }

    } catch ( error ) {

        if ( error.getDetails != undefined ) {
            nlapiLogExecution( "error", "Process Error", error.getCode() + ":" + error.getDetails() );
            
        } else {
            nlapiLogExecution( "error", "Unexpected Error", error.toString() );
        }

    }
}

function addSyncedCount(syncedCount, newCount)
{
    var count = syncedCount * 1 + newCount * 1;
    nlapiSubmitField('customrecord_mws_sync_key_parameter_set', 1, 'custrecord_buybox_pull_count', count);
}

function postAllData(all_inv_body)
{
    for (var i = 0; i < all_inv_body.length; i ++) {
        dLog(i + 1, new Date().getSeconds());
        var itemObj = all_inv_body[i];
        postPartData(itemObj);
        if( (i % 5) == 0 ) 
        {
            setRecoveryPoint();
        }
        checkGovernance();
        itemObj = null;
    }     
}

function postPartData(itemObj)
{
    var conditionList = ['New', 'Refurbished']; //'Used', 'Collectible', 'Club', 
    var post_param = new Object;
    post_param.asin = itemObj.asin;
    for (var i = 0; i < conditionList.length; i ++) {
         post_param.ItemCondition = conditionList[i];
         postBuyBoxPrice(itemObj, post_param);
    }
}

/************************************* BuyBox Price ********************************************/
function postBuyBoxPrice(itemObj, post_param)
{
    var url = 'http://netsuite.dragonstar.xyz/Juxto/MarketplaceWebServiceProducts/Samples/GetLowestPricedOffersForASINSample.php';
    var res = nlapiRequestURL( url, post_param, null, 'POST' );
    if( res.getCode() == "200" && res.getBody()) {
        dLog('res', res.getBody());
        var resObj = JSON.parse(res.getBody());
        if (resObj.status == 'SUCCESS') {
            var results = resObj.data.GetLowestPricedOffersForASINResponse.GetLowestPricedOffersForASINResult;
            processBuyBoxPriceRes(itemObj, results);    
        } else {
            dLog('response_parse_error', resObj.data);
        }
    } else {
       dLog('response_error_code', res.getCode());
       dLog('response_error_body', res.getBody());
    }
}

function processBuyBoxPriceRes(itemObj, itemList)
{
    if (itemList.constructor === Array) {
        for (var i = 0; i < itemList.length; i++) {
            var element = itemList[i];
            updateBuyBoxPrice(itemObj, element);
        }
    } else {
        updateBuyBoxPrice(itemObj, itemList);
    }
}

function updateBuyBoxPrice(itemObj, element)
{
    try {
        var asin = element['@ASIN'];
        var itemCondition = element['@ItemCondition'];
        var status = element['@status'];
        var bbPriceVal = 0;
        if (status == 'Success') {
            var recordType = itemObj.recordType;
            var itemId = itemObj.itemId;
            var BuyBoxPrices = element.Summary.BuyBoxPrices;
            if (BuyBoxPrices != undefined && BuyBoxPrices != 'undefined' && itemObj != undefined && itemObj != 'undefined') {
                if (BuyBoxPrices.constructor === Array) {
                    dLog('BuyBox Price - Array', JSON.stringify(BuyBoxPrices));
                    if (BuyBoxPrices.length > 0) {
                        BuyBoxPrice = BuyBoxPrices[0].BuyBoxPrice;    
                    }
                } else {
                    BuyBoxPrice = BuyBoxPrices.BuyBoxPrice;
                }
                if (BuyBoxPrice != undefined && BuyBoxPrice != 'undefined') {
                    if ((BuyBoxPrice.constructor === Array)) {
                        for (var j = 0; j < BuyBoxPrice.length; j ++) {
                            var BuyBoxPriceElement = BuyBoxPrice[j];
                            if (BuyBoxPriceElement['@condition'] == itemCondition) {
                                bbPriceVal = getBuyBoxPrice(BuyBoxPriceElement);
                                break;
                            }
                        }
                    } else {
                        if (BuyBoxPrice['@condition'] == itemCondition) {
                            bbPriceVal = getBuyBoxPrice(BuyBoxPrice);
                        }
                    }   
                }

          //      if (bbPriceVal) {
                if (!bbPriceVal) {bbPriceVal = null};
                if (itemCondition == 'New') {
                    nlapiSubmitField(recordType, itemId, 'custitemams_buybox', bbPriceVal);
                } else if (itemCondition == 'Refurbished') {
                    nlapiSubmitField(recordType, itemId, 'custitemamz_bb_ref', bbPriceVal);    
                }
                dLog('SUCCESS : ItemSKU - Condition - BuyBox Price', itemObj.itemSku + ' - ' + itemCondition + ' - ' + bbPriceVal);
          //      }
            } else {
                dLog('FAILED : BuyBoxPrices - Nothing', itemObj.itemSku);
            }
        } else {
            dLog('Not Success Response Status Error - BuyBox', itemObj.itemSku);
        }
    } catch (error) {
        if ( error.getDetails != undefined ) {
            nlapiLogExecution( "error", "updateBuyBoxPrice Error", error.getCode() + ":" + error.getDetails() );
        } else {
            nlapiLogExecution( "error", "updateBuyBoxPrice Unexpected Error", error.toString() );
        }   
    }
}

function getBuyBoxPrice(bbPriceObj)
{
    var priceAmt = 0;
    if (bbPriceObj != undefined && bbPriceObj != 'undefined') {
        var LandedPrice = bbPriceObj.LandedPrice;
        if (LandedPrice != undefined && LandedPrice != 'undefined') {
            priceAmt = LandedPrice.Amount;
        }
    }
    return priceAmt * 1;
}

/************************************** Gerneral Function *****************************************/
function getItemData(itemId)
{   
    var itemObj = new Object;
    var filters = [];
    filters.push(new nlobjSearchFilter('internalid', null, 'is', itemId));
    var searchResult = nlapiSearchRecord('item', null, filters, null);
    if (searchResult) {
        var element = searchResult[0];
        var recordType = element.getRecordType();
        var itemRec = nlapiLoadRecord(recordType, itemId);
        var itemSku = itemRec.getFieldValue('itemid'); 
        var asin = itemRec.getFieldValue('custitemasin');
        
        if (isEmpty(asin)) {
            return null;
        }
    
        itemObj.itemId = itemId;
        itemObj.recordType = recordType;
        itemObj.itemSku = itemSku;
        itemObj.asin = asin;
    }

    return itemObj;
}

function isEmpty(fldValue)
{
    if (fldValue == '') return true;
    if (fldValue == 'null') return true;
    if (fldValue == null) return true;
    if (fldValue == 'undefined') return true;
    if (fldValue == undefined) return true;
    if (fldValue.length < 1) return true;
    
    return false;
}

function dLog(title, details)
{
    nlapiLogExecution('Debug', title, details);
}

function checkGovernance()
{
 var context = nlapiGetContext();
 if( context.getRemainingUsage() < 300 )
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