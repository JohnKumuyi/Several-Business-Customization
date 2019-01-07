/*Serial Number Script
Owner: CJ Carter
Type: 


*/

function setSerialNumber(type, name) 
{
    if (type != 'delete')
    {
        var rec_type = nlapiGetRecordType();
        var inv_id = nlapiGetRecordId();
        var linecount = nlapiGetLineItemCount('item');
        nlapiLogExecution('DEBUG', 'linecount', linecount);

        var record = nlapiLoadRecord(rec_type, inv_id);
        var tranId = record.getFieldValue('tranid');
        var serial_numbers = '';
        for (var i = 1; i <= linecount; i++) 
        {
            var itemname = nlapiGetLineItemValue('item', 'itemname', i);
            var itemType = nlapiGetLineItemValue('item', 'itemtype', i);
            var itemFields = nlapiLookupField('item', nlapiGetLineItemValue('item','item',i), ['isserialitem', 'islotitem']);
    //      var inv_detail = nlapiViewLineItemSubrecord('item', 'inventorydetail', i);
            record.selectLineItem('item', i);
            var inv_detail = record.editCurrentLineItemSubrecord('item', 'inventorydetail');
            if (inv_detail != null) 
            {    
                var sublinecount = inv_detail.getLineItemCount('inventoryassignment');
                var line_data = '';
                for (var x = 1; x <= sublinecount; x++) 
                {
                    var lot = inv_detail.getLineItemValue('inventoryassignment', 'receiptinventorynumber', x);
                    var lot1 = lot + ',';
                    if (lot == null || lot == '' && itemFields['isserialitem'] == 'T') 
                    {
                        lot = inv_detail.getLineItemText('inventoryassignment', 'issueinventorynumber', x);
                        nlapiLogExecution('DEBUG', 'Lot', lot);
                        lot1 = lot + ',';
                        var data = lot1 + ' ';
                    }
                    line_data += data;
                }
                serial_numbers += line_data + ' ';
                nlapiLogExecution('DEBUG', 'Serial Numbers - ' + tranId, serial_numbers);
            }
        }
        var str_length = serial_numbers.length;
        var new_length = parseFloat(str_length) - parseFloat(3);
        var new_string = serial_numbers.substring(0, new_length);
        if (!isNullOrEmpty(new_string) && new_string != "undefin")
        {
        nlapiSubmitField(rec_type, inv_id, 'custbody_serial_numbers', new_string);
        }
    }
}

function isNullOrEmpty(val) {
if (val == null || val == '') {
return true;
} else {
return false;
}
}

