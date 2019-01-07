function main( request, response )
{
    var internalId = request.getParameter('internalId');
    var fieldType = request.getParameter('fieldType');
    var fieldValue = request.getParameter('fieldValue');
    var conditionName = request.getParameter('conditionName');
    dLog('internalId', internalId);
  	dLog('fieldType', fieldType);
  	dLog('fieldValue', fieldValue);
  	dLog('conditionName', conditionName);
	
  	if (updateItemRecord(internalId, fieldType, fieldValue, conditionName))  {
    	response.write('1');
    } else {
    	response.write('');
    }
}

function updateItemRecord(internalId, fieldType, fieldValue, conditionName)
{
	if (fieldType == 'asin') {
		nlapiSubmitField('inventoryitem', internalId, 'custitemasin', fieldValue);
	} else if (fieldType == 'amzsku') {
		if (conditionName == 'AMZN') {
			nlapiSubmitField('inventoryitem', internalId, 'custitemfba_sku_new', fieldValue);
        } else if (conditionName == 'AMZR') {
        	nlapiSubmitField('inventoryitem', internalId, 'custitem1', fieldValue);
        } else if (conditionName == 'NEW-A') {
        	nlapiSubmitField('inventoryitem', internalId, 'custitemfbm_sku_new', fieldValue);
        } else if (conditionName == 'NOB-A') {
        	nlapiSubmitField('inventoryitem', internalId, 'custitemfbm_sku_nob', fieldValue);
        } else if (conditionName == 'REF-A') {
        	nlapiSubmitField('inventoryitem', internalId, 'custitemfbm_sku_ref', fieldValue);
        } else if (conditionName == 'USED-A') {
        	nlapiSubmitField('inventoryitem', internalId, 'custitemfbm_sku_used', fieldValue);
        }
	} else if (fieldType == 'minprice') {

	} else if (fieldType == 'maxprice') {

	} else if (fieldType == 'amzstore') {

	}

	return true;
}

function dLog(title, detail)
{
    nlapiLogExecution('Debug', title, detail);
}