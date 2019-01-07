function main( request, response )
{
    makeReport(response);
}

function makeReport(response)
{   
    var amzStoreList = loadAMZStores();
    var amzStoreHtml = processAMZStores(amzStoreList);
    var itemList = loadItems();
    var reportHtml = processItems(itemList);
    var form = makeForm(reportHtml, amzStoreHtml);

    response.writePage(form);
}

function loadItems()
{
    var search = nlapiLoadSearch('item', 'customsearch_master_inv_report_2');
    var cols = search.getColumns();
 
    var searchResults = search.runSearch();
    // resultIndex points to record starting current resultSet in the entire results array
    var resultIndex = 0;
    var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
    var resultSet; // temporary variable used to store the result set

    var itemList = [];
    var allCount = 0;
    do
    {
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);

        for ( var i = 0; i < resultSet.length; i++ ) {
            var element = resultSet[i];
            var itemObj = new Object;
            itemObj.recordType = element.getRecordType();
            itemObj.internalId = element.getId();
            itemObj.itemId = element.getValue(cols[0]);
            itemObj.purchDescr = element.getValue(cols[1]);
            itemObj.conditionId = element.getValue(cols[2]);
            itemObj.conditionName = element.getText(cols[2]);
            itemObj.asin = element.getValue(cols[3]);
            itemObj.fba_sku_new = element.getValue(cols[4]);
            itemObj.fba_sku_ref = element.getValue(cols[5]);
            itemObj.fbm_sku_new = element.getValue(cols[6]);
            itemObj.fbm_sku_nob = element.getValue(cols[7]);
            itemObj.fbm_sku_ref = element.getValue(cols[8]);
            itemObj.fbm_sku_used = element.getValue(cols[9]);
            itemObj.qty = element.getValue(cols[10]);
            itemObj.cost = element.getValue(cols[11]);
            itemObj.extCost = element.getValue(cols[12]);
            itemObj.amzBB = element.getValue(cols[13]);
            itemObj.amzStoreId = element.getValue(cols[14]);
            itemObj.amzStoreName = element.getText(cols[14]);
            itemObj.amzSku = '';
            
            if (itemObj.cost) {
                itemObj.cost = (parseFloat(itemObj.cost)).toFixed(2);
            }
            if (itemObj.extCost) {
                itemObj.extCost = (parseFloat(itemObj.extCost)).toFixed(2);
            }
            if (itemObj.amzBB) {
                itemObj.amzBB = (parseFloat(itemObj.amzBB)).toFixed(2);
            }
          
            if (itemObj.conditionName == 'AMZN') {
                itemObj.amzSku = itemObj.fba_sku_new;
            } else if (itemObj.conditionName == 'AMZR') {
                itemObj.amzSku = itemObj.fba_sku_ref;
            } else if (itemObj.conditionName == 'NEW-A') {
                itemObj.amzSku = itemObj.fbm_sku_new;
            } else if (itemObj.conditionName == 'NOB-A') {
                itemObj.amzSku = itemObj.fbm_sku_nob;
            } else if (itemObj.conditionName == 'REF-A') {
                itemObj.amzSku = itemObj.fbm_sku_ref;
            } else if (itemObj.conditionName == 'USED-A') {
                itemObj.amzSku = itemObj.fbm_sku_used;
            }

            itemObj.breakEven = '';
            if (itemObj.conditionName == 'AMZN' || itemObj.conditionName == 'AMZR') {
                itemObj.breakEven = (itemObj.cost * 1.08 + 6).toFixed(2);
            } else {
                itemObj.breakEven = (itemObj.cost * 1.08 + 10).toFixed(2);
            }

            itemObj.minPrice = '';
            if (itemObj.breakEven) {
                itemObj.minPrice = (itemObj.breakEven * 1.1).toFixed(2);
            }

            itemObj.maxPrice = '';
            if (itemObj.amzBB) {
                itemObj.maxPrice = (itemObj.amzBB * 2).toFixed(2);
            }
            
            itemList.push(itemObj);
        }

        resultIndex = resultIndex + resultStep;

    } while (resultSet.length > 0);

    return itemList;
}

function loadAMZStores()
{
    var amzStoreList = [];
    var filters = [];
    filters.push(new Array('isinactive', 'is', 'F'));
    var col = new Array();
    col[0] = new nlobjSearchColumn('name');
    col[1] = new nlobjSearchColumn('internalId');
    col[1].setSort();
    var results = nlapiSearchRecord('customlistamazon', null, filters, col);
    for ( var i = 0; results != null && i < results.length; i++ )
    {
        var res = results[i];
        var listValue = res.getValue('name');
        var listID = res.getValue('internalId');
        var amzStoreObj = new Object;
        amzStoreObj.listID = listID;
        amzStoreObj.listValue = listValue;
        amzStoreList.push(amzStoreObj);
        nlapiLogExecution('DEBUG', (listValue + ", " + listID));
    } 
    return amzStoreList;
}

function processAMZStores(amzStoreList)
{
  var html = "<table id = 'tbl_amzStore' style='display:none'>";
    for (var i = 0; i < amzStoreList.length; i ++) {
         html += "<tr>";
         html += "<td>" + amzStoreList[i].listID + "</td>";
         html += "<td>" + amzStoreList[i].listValue + "</td>";
         html += "</tr>";
    }
    html += "</table>";
    return html;
}

function processItems(itemList)
{
    var html = "<html>";
        html += "<head>";
        html += "<style>";
        html += ".report_head_cell{font-weight: normal; background-color: #e0e6ef; border-right: solid 0px rgb(199, 199, 199);  border-bottom: solid 1px rgb(199, 199, 199); font-size: 10pt; font-weight: bold}";
        html += ".report_bold_cell{font-weight: bold;}";
        html += ".menu_col{white-space: nowrap; border-right: solid 0px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); font-size: 10pt; }";
        html += ".data_col{border-right: solid 0px rgb(199, 199, 199);  border-bottom: solid 1px rgb(199, 199, 199); font-size: 10pt;}";
        html += ".edit_col{border-right: solid 0px rgb(199, 199, 199);  border-bottom: solid 1px rgb(199, 199, 199); font-size: 10pt;}";
        html += ".select_col{border-right: solid 0px rgb(199, 199, 199);  border-bottom: solid 1px rgb(199, 199, 199); font-size: 10pt; text-align:left; padding-left: 3px; min-width:150px;}";
        html += ".string_col{text-align:left; min-width:120px; padding-left: 1px;}";
        html += ".number_col{text-align:right; min-width:50px; padding-right: 6px;}";
        html += ".condition_col{text-align:left; min-width:60px; padding-left: 6px;}";
        html += ".edit_col{cursor:pointer}";
        html += ".select_col{cursor:pointer}";
  //      html += ".edit_col:hover {color: blue; text-decoration: underline}";
        html += ".glowing-border {border: 0px solid #dadada; width: 100%; height: 18px; padding:0px !important }";
        html += ".glowing-border:focus { outline: none; border-color: #9ecaed; box-shadow: 0 0 1px #9ecaed;}";
        html += ".glowing-border-sel {border: 0px solid #dadada; height: 22px; width: 100%;  padding:0px !important}";
        html += ".glowing-border-sel:focus { outline: none; border-color: #9ecaed; box-shadow: 0 0 1px #9ecaed;}";
        html += ".amz-item-row {text-decoration: none}";
        html += ".amz-item-row:hover {background-color: #fff9cc63}";
        html += "</style>";
        html += "</head>";
        html += "<div style='width:1850px; height: 100%; overflow-x:auto; margin-top: -10px'>";
        html += "<table id='tbl_obj' style='border-collapse: collapse; border: solid 1px rgb(199, 199, 199)'>";
        html += "<tr>";
        html += "<td class='report_head_cell' style='border-top: solid 3px white; border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'>PN</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white'>Part #</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white'>Description</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>Condition</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>ASIN<img class='uir-dle-icon' src='/images/hover/icon_dle.png?v=2018.1.0' alt='This column is editable' border='0' style='vertical-align:middle; margin-left: 5px' title='This column is editable'></td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>AMZ SKU<img class='uir-dle-icon' src='/images/hover/icon_dle.png?v=2018.1.0' alt='This column is editable' border='0' style='vertical-align:middle; margin-left: 5px' title='This column is editable'></td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>Qty</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>Cost</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>Extended<BR>Cost</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>Buy<BR>Box</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>Break<BR>Even</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>Min<BR>Price<img class='uir-dle-icon' src='/images/hover/icon_dle.png?v=2018.1.0' alt='This column is editable' border='0' style='vertical-align:middle; margin-left: 5px' title='This column is editable'></td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>Max<BR>Price<img class='uir-dle-icon' src='/images/hover/icon_dle.png?v=2018.1.0' alt='This column is editable' border='0' style='vertical-align:middle; margin-left: 5px' title='This column is editable'></td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>AMZ<BR>Stores<img class='uir-dle-icon' src='/images/hover/icon_dle.png?v=2018.1.0' alt='This column is editable' border='0' style='vertical-align:middle; margin-left: 5px' title='This column is editable'></td>";
        html += "</tr>";

        var allCount = 0;
        for (var i = 0; i < itemList.length; i ++) {
            var element = itemList[i];
            var recordType = element.recordType;
            var internalId = element.internalId;
            var partNumber = element.itemId;
            var purchDescr = element.purchDescr;
            var conditionId = element.conditionId;
            var conditionName = element.conditionName;
            var asin = element.asin;
            var amzSku = element.amzSku;
            var qty = element.qty;
            var cost = element.cost;
            var extCost = element.extCost;
            var amzBB = element.amzBB;
            var breakEven = element.breakEven ;
            var minPrice = element.minPrice;
            var maxPrice = element.maxPrice;
            var amzStoreId = element.amzStoreId * 1;
            var amzStoreName = element.amzStoreName;

            allCount ++;
            
            html += "<tr class='amz-item-row'>";
            html += "<td class='report_head_cell' style='border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;' recordType='" + recordType + "'>" + internalId + "</td>";
            html += "<td class='menu_col'>" + partNumber + "</td>";
            html += "<td class='data_col string_col'>" + purchDescr + "</td>";
            html += "<td class='data_col condition_col' conditionId='" + conditionId + "'>" + conditionName + "</td>";
            html += "<td class='edit_col string_col'>" + asin + "</td>";
            html += "<td class='edit_col string_col'>" + amzSku + "</td>";
            html += "<td class='data_col number_col'><div>" + addCommas(parseFloat(qty)) + "</div></td>";
            html += "<td class='data_col number_col'><div>" + addCommas(parseFloat(cost)) + "</div></td>";
            html += "<td class='data_col number_col'><div>" + addCommas(parseFloat(extCost)) + "</div></td>";
            html += "<td class='data_col number_col'><div>" + addCommas(parseFloat(amzBB)) + "</div></td>";
            html += "<td class='data_col number_col'><div>" + addCommas(parseFloat(breakEven)) + "</div></td>";
            html += "<td class='edit_col number_col'>" + addCommas(parseFloat(minPrice)) + "</td>";
            html += "<td class='edit_col number_col'>" + addCommas(parseFloat(maxPrice)) + "</td>";
            html += "<td class='select_col' style='padding-left: 6px' storeId='" + amzStoreId + "'>" + amzStoreName + "</td>";
            html += "</tr>";
        }

        html += "</table>";
        html += "</div>";
        html += "</html>";
    
    return html;
}

function makeForm(reportHtml, amzStoreHtml)
{
    var form = nlapiCreateForm('Inventoy All Amazon Report');
    form.setScript('customscript_cs_amz_view');
    
    var filterGroup = form.addFieldGroup( 'filter_group', 'Report Filters');
  /*  
    var refreshBtn = form.addField('refresh_html','inlinehtml', 'Refresh', null, 'filter_group');
    refreshBtn.setLayoutType('outsidebelow','startcol')
    refreshBtn.setDefaultValue( '<div style="display: inline-flex;margin-left: 60px;padding-right: 5px;align-items:  center;color: rgb(100,100,100);"><button id="refresh_btn" style="cursor:pointer; font-size: 11pt;font-weight: bold;width: 110px;color: rgb(110, 110, 110);">Refresh</button></div>' );
  */
    var excelExportBtn = form.addField('excel_export_html','inlinehtml', 'Excel Export', null, 'filter_group');
    excelExportBtn.setLayoutType('outsidebelow','startcol')
    excelExportBtn.setDefaultValue( '<div style="display: inline-flex;margin-left: 5px;padding-right: 5px;align-items:  center;color: rgb(100,100,100);"><button id="excel_export_btn" style="cursor:pointer; font-size: 11pt;font-weight: bold;width: 110px;color: rgb(110, 110, 110);">Excel Export</button></div>' );
    
    var mainGroup = form.addFieldGroup( 'main_group', 'Report Data');
    var reportData = form.addField('report_data', 'inlinehtml', 'REPORT DATA', null, 'main_group');
    reportData.setDefaultValue( reportHtml );

    var amzStoreData = form.addField('amz_store_data', 'inlinehtml', 'AMZ STORE DATA', null, 'main_group');
    amzStoreData.setDefaultValue( amzStoreHtml );
  
    return form;
}

function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    
    if (isNaN(parseInt(x1 + x2)) == false) {
                    return x1 + x2;
                } else {
                    return 0.00;
                }
}

function dLog(title, detail)
{
    nlapiLogExecution('Debug', title, detail);
}