function main( request, response )
{
 /*   var search = nlapiLoadSearch('transaction', 'customsearch_thisperiod_mrr_report_3');
    var filters = search.getFilters();
    var columns = search.getColumns();
    for (var i = 0; i < filters.length; i ++) {
         response.writeLine(filters[i]);
    }
 /*   for (var i = 0; i < columns.length; i ++) {
         response.writeLine(columns[i]);
    }*/

  //  return; 
    var fromDate = request.getParameter('from_date');
    var toDate = request.getParameter('to_date');
    
    if (fromDate && toDate) {
        makeReport(fromDate, toDate, response);
    } else {
        var nowDate = new Date();
        var pstDate = new Date( nowDate.getUTCFullYear(), nowDate.getUTCMonth(), nowDate.getUTCDate(), nowDate.getUTCHours()-7, nowDate.getUTCMinutes(), nowDate.getUTCSeconds() );
        var year = pstDate.getFullYear();
        var month = pstDate.getMonth() + 1;
        var date = pstDate.getDate();
        var nowStrDate = '' + month + '/' + date + '/' + year;
        makeReport(nowStrDate, nowStrDate, response);
    }
}

var monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function makeReport(fromDate, toDate, response)
{
    var monthList = getPeriodMonthList(fromDate, toDate);
    var transObj = loadTransaction(fromDate, toDate);
    var reportHtml = processTransaction(transObj, monthList);
    var form = makeForm(reportHtml, fromDate, toDate);

    response.writePage(form);
//    response.writePage(JSON.stringify(transObj.customerListObj));
}

function getPeriodMonthList(fromDate, toDate)
{   
    var fromDateArr = fromDate.split("/");
    var fromYear = fromDateArr[2] * 1;
    var fromMonth = fromDateArr[0] * 1;
    var fromDate = fromDateArr[1] * 1;

    var toDateArr = toDate.split("/");
    var toYear = toDateArr[2] * 1;
    var toMonth = toDateArr[0] * 1;
    var toDate = toDateArr[1] * 1;

    var year = fromYear;
    var month = fromMonth - 1;
    var lastMonth = toMonth - 1;
    var monthList = [];
    do{
        var strOpt = getOption(year, month);

        var periodKey = '' + year + '/' + (month + 1);
        var monthDay = new Date(year, month + 1, 0).getDate()
        var periodFromDate = '' + (month + 1) + '/1/' + year;
        var periodToDate = '' + (month + 1) + '/' + monthDay + '/' + year;
        var monthObj = {};
        monthObj.periodName = strOpt;
        monthObj.periodId = periodKey
        monthObj.periodFromDate = periodFromDate;
        monthObj.periodToDate = periodToDate;
        monthObj.periodTotal = 0;
        monthList.push(monthObj);

        month ++;
        if (month > 11) {
            month = 0;
            year ++;
        }
    }while(year < toYear || (year == toYear && month <= lastMonth))

    return monthList;
}

function loadTransaction(fromDate, toDate)
{
    var newFilters = [];
    newFilters.push(new Array('type', 'anyof', ['Opprtnty']));
    newFilters.push('AND');
    newFilters.push(new Array('projectedamount', 'greaterthan', ['0']));
    newFilters.push('AND');
    newFilters.push(new Array('status', 'noneof', ['Opprtnty:D', 'Opprtnty:C']));
    newFilters.push('AND');
    newFilters.push(new Array('trandate', 'within', [fromDate, toDate]));
    
    var cols = [];
    cols[0] = new nlobjSearchColumn('entity', null, 'GROUP');
    cols[1] = new nlobjSearchColumn('trandate', null, 'GROUP');
    cols[2] = new nlobjSearchColumn('stage', 'customer', 'GROUP');
    cols[3] = new nlobjSearchColumn('formulanumeric', null, 'SUM');
    cols[3].setFormula("{projectedamount}*{probability}");
    
    cols[0].setSort();
    cols[1].setSort();
    
    var newSearch = nlapiCreateSearch('transaction', newFilters, cols);
    var searchResults = newSearch.runSearch();
    // resultIndex points to record starting current resultSet in the entire results array
    var resultIndex = 0;
    var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
    var resultSet; // temporary variable used to store the result set

    var transactionList = [];
    var allCount = 0;
    var customerListObj = new Object;
    var prospectListObj = new Object;
    var customerObj = new Object;
    var oldCustomerId = 0;
    do
    {
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);

        for ( var i = 0; i < resultSet.length; i++ ) {
            var element = resultSet[i];
            var customerId = element.getValue(cols[0]);
            var customerName = element.getText(cols[0]);
            var tranDate = element.getValue(cols[1]);
            var stage = element.getText(cols[2]);
            var forcastMRR = element.getValue(cols[3]) * 1;   

            if (customerId != oldCustomerId) {
                customerObj = {};
            }

            var tranDateArr = tranDate.split("/");
            var year = tranDateArr[2];
            var month = tranDateArr[0];
            var date = tranDateArr[1];
            var key = '' + year + '/' + month;
            customerObj['customerName'] = customerName;
            if (customerObj[key] != undefined && customerObj[key] != 'undefined') {
                customerObj[key] += forcastMRR;
            } else {
                customerObj[key] = forcastMRR;    
            }
            dLog(key, forcastMRR);
            if (stage == 'Customer') {
                customerListObj[customerId] = customerObj;
            } else {
                prospectListObj[customerId] = customerObj;
            }
            
            oldCustomerId = customerId;
        }

        resultIndex = resultIndex + resultStep;

    } while (resultSet.length > 0);

    var retObj = new Object;
    retObj.customerListObj = customerListObj;
    retObj.prospectListObj = prospectListObj;

    return retObj;
}

function processTransaction(transObj, monthList)
{
    var customerListObj = transObj.customerListObj;
    var prospectListObj = transObj.prospectListObj;
    var colspanCount = monthList.length + 3;

    var monthList_P = [];
    for (var i = 0; i < monthList.length; i ++) {
         var element = monthList[i];
         var monthObj = {};
         monthObj.periodName = element.periodName;
         monthObj.periodFromDate = element.periodFromDate;
         monthObj.periodToDate = element.periodToDate;
         monthObj.periodId = element['periodId'];
         monthObj.periodTotal = 0;
         monthList_P.push(monthObj);    
    }
         
    var html = "<html>";
        html += "<head>";
        html += "<style>";
        html += ".report_head_cell{font-weight: normal; background-color: #e0e6ef; border-right: solid 1px rgb(199, 199, 199);  border-bottom: solid 1px rgb(199, 199, 199); font-size: 10pt; font-weight: bold}";
        html += ".report_bold_cell{font-weight: bold;}";
        html += ".menu_col{white-space: nowrap; border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); font-size: 10pt; }";
        html += ".data_col{border-right: solid 1px rgb(199, 199, 199);  border-bottom: solid 1px rgb(199, 199, 199); font-size: 10pt; padding-left: 30px; min-width: 70px}";
  html += ".data_link{cursor:pointer}";
        html += ".data_link:hover {color: blue; text-decoration: underline}";
        html += "</style>";
        html += "</head>";
        html += "<div style='width:1800px; height: 100%; overflow-x:auto'>";
        html += "<table id='tbl_obj' style='border-collapse: collapse; border: solid 1px rgb(199, 199, 199)'>";
        html += "<tr><td class='report_head_cell' style='border-top: solid 3px white; border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'>No</td><td class='report_head_cell' style='border-top: solid 3px white; border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'>Customer Name</td>";
        for (var i = 0; i < monthList.length; i ++) {
            var element = monthList[i];
            var periodName = element.periodName;
            html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white'>" + periodName + "</td>";
        }
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>TOTAL</td>";
        html += "</tr>";
/**************************** Customer **************************/        
        html += "<tr><td style='text-align:center; border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 12pt; font-weight:bold' colspan='" + colspanCount + "'>Customer Forcast MRR</td></tr>";
        var allCount = 0;
        var total_C = 0;
        for (var customerId in customerListObj) {
            allCount ++;
            var customerObj = customerListObj[customerId];
            var customerName = customerObj.customerName;
            var customerTotal = 0;
            html += "<tr><td class='report_head_cell' style='border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'>" + allCount + "</td><td class='menu_col'>" + customerName + "</td>";
                    for (var i = 0; i < monthList.length; i++) {
                        var element = monthList[i];
                        var periodId = element.periodId;
                        var fromDate = element.periodFromDate;
                        var toDate = element.periodToDate;
                        var amount = (customerObj[periodId] != undefined)?customerObj[periodId]:'0';
                        amount = Math.round(amount);
                        monthList[i].periodTotal += amount;
                        customerTotal += amount;
                        var link = "https://system.na2.netsuite.com/app/common/search/searchresults.nl?searchtype=Transaction&Transaction_TRANDATErange=CUSTOM&Transaction_TRANDATEfrom=" + fromDate + "&Transaction_TRANDATEfromrel_formattedValue=&Transaction_TRANDATEfromrel=&Transaction_TRANDATEfromreltype=DAGO&Transaction_TRANDATEto=" + toDate + "&Transaction_TRANDATEtorel_formattedValue=&Transaction_TRANDATEtorel=&Transaction_TRANDATEtoreltype=DAGO&Transaction_NAME=" + customerId + "&style=REPORT&Transaction_TRANDATEmodi=WITHIN&Transaction_TRANDATE=CUSTOM&report=T&grid=&searchid=343&sortcol=Transaction_TRANDATE_raw";
                        html += "<td class='data_col'><div class='data_link' link='" + link + "'>" + addCommas(parseFloat(amount)) + "</div></td>";
                    }
                    total_C += customerTotal;
                    html += "<td class='data_col'><div>" + addCommas(parseFloat(customerTotal)) + "</div></td>";
            html += "</tr>";
        }
        html += "<tr><td class='report_head_cell' style='border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'></td><td class='report_head_cell' style='border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'>SUB TOTAL - ( Customer Forcast MRR )</td>";
        for (var i = 0; i < monthList.length; i ++) {
            var element = monthList[i];
            var periodTotal = element.periodTotal;
            html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(periodTotal)) + "</td>";
        }
        html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(total_C)) + "</td>";
        html += "</tr>";

/**************************** Prospect **************************/    
        html += "<tr><td style='text-align:center; border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 12pt; font-weight:bold' colspan='" + colspanCount + "'>Prospect Forcast MRR</td></tr>";
        allCount = 0;
        var total_P = 0;
        for (var customerId in prospectListObj) {
            allCount ++;
            var customerObj = prospectListObj[customerId];
            var customerName = customerObj.customerName;
            var customerTotal = 0;
            html += "<tr><td class='report_head_cell' style='border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'>" + allCount + "</td><td class='menu_col'>" + customerName + "</td>";
                    for (var i = 0; i < monthList_P.length; i++) {
                        var element = monthList_P[i];
                        var fromDate = element.periodFromDate;
                        var toDate = element.periodToDate;
                        var periodId = element.periodId;
                        var amount = (customerObj[periodId] != undefined)?customerObj[periodId]:'0';
                        amount = Math.round(amount);
                        monthList_P[i].periodTotal += amount;
                        customerTotal += amount;
                        var link = "https://system.na2.netsuite.com/app/common/search/searchresults.nl?searchtype=Transaction&Transaction_TRANDATErange=CUSTOM&Transaction_TRANDATEfrom=" + fromDate + "&Transaction_TRANDATEfromrel_formattedValue=&Transaction_TRANDATEfromrel=&Transaction_TRANDATEfromreltype=DAGO&Transaction_TRANDATEto=" + toDate + "&Transaction_TRANDATEtorel_formattedValue=&Transaction_TRANDATEtorel=&Transaction_TRANDATEtoreltype=DAGO&Transaction_NAME=" + customerId + "&style=REPORT&Transaction_TRANDATEmodi=WITHIN&Transaction_TRANDATE=CUSTOM&report=T&grid=&searchid=343&sortcol=Transaction_TRANDATE_raw";
                        html += "<td class='data_col'><div class='data_link' link='" + link + "'>" + addCommas(amount) + "</div></td>";
                    }
                    total_P += customerTotal;
                    html += "<td class='data_col'><div>" + addCommas(parseFloat(customerTotal)) + "</div></td>";
            html += "</tr>";
        }
        html += "<tr><td class='report_head_cell' style='border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'></td><td class='report_head_cell' style='border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'>SUB TOTAL - ( Prospect Forcast MRR )</td>";
        for (var i = 0; i < monthList_P.length; i ++) {
            var element = monthList_P[i];
            var periodTotal = element.periodTotal;
            html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(periodTotal)) + "</td>";
        }
        html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(Math.round(total_P))) + "</td>";
        html += "</tr>";
        html += "<tr><td class='report_head_cell' style='border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'></td><td class='report_head_cell' style='border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'>TOTAL</td>";
        for (var i = 0; i < monthList.length; i ++) {
            var periodTotal = monthList[i].periodTotal + monthList_P[i].periodTotal;
            html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(Math.round(periodTotal))) + "</td>";
        }
        html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(Math.round(total_C + total_P))) + "</td>";
        html += "</tr>";

/**************************** Total **************************/    
  
        html += "</table>";
        html += "</div>";
        html += "</html>";
    
    return html;
}

function makeForm(reportHtml, fromDate, toDate)
{
    var form = nlapiCreateForm('Forcast MRR by Month Report');
    form.setScript('customscript_cs_forcast_mrr_report');
    
    var filterGroup = form.addFieldGroup( 'filter_group', 'Report Filters');
    var fromDateFldLbl = form.addField('from_date_label','inlinehtml', 'From', null, 'filter_group');
    fromDateFldLbl.setLayoutType('outsidebelow','startcol')
    fromDateFldLbl.setDefaultValue( '<div style="display: inline-flex;padding-left: 5px; font-size: 10pt;padding-right: 5px;align-items:  center;color: rgb(100,100,100);">From</div>' );
    var fromDateFld = form.addField('from_date','date', '', null, 'filter_group');
    fromDateFld.setLayoutType('outsidebelow','startcol')
    fromDateFld.setDefaultValue(fromDate);
    
    var toDateFldLbl = form.addField('to_date_label','inlinehtml', 'From', null, 'filter_group');
    toDateFldLbl.setLayoutType('outsidebelow','startcol')
    toDateFldLbl.setDefaultValue( '<div style="display: inline-flex;padding-left: 30px; font-size: 10pt;padding-right: 5px;align-items:  center; color: rgb(100,100,100);">To</div>' );
    var toDateFld = form.addField('to_date','date', '', null, 'filter_group');
    toDateFld.setLayoutType('outsidebelow','startcol')
    toDateFld.setDefaultValue(toDate);  
    
    var refreshBtn = form.addField('refresh_html','inlinehtml', 'Refresh', null, 'filter_group');
    refreshBtn.setLayoutType('outsidebelow','startcol')
    refreshBtn.setDefaultValue( '<div style="display: inline-flex;margin-left: 60px;padding-right: 5px;align-items:  center;color: rgb(100,100,100);"><button id="refresh_btn" style="cursor:pointer; font-size: 11pt;font-weight: bold;width: 110px;color: rgb(110, 110, 110);">Refresh</button></div>' );
    var excelExportBtn = form.addField('excel_export_html','inlinehtml', 'Excel Export', null, 'filter_group');
    excelExportBtn.setLayoutType('outsidebelow','startcol')
    excelExportBtn.setDefaultValue( '<div style="display: inline-flex;margin-left: 20px;padding-right: 5px;align-items:  center;color: rgb(100,100,100);"><button id="excel_export_btn" style="cursor:pointer; font-size: 11pt;font-weight: bold;width: 110px;color: rgb(110, 110, 110);">Excel Export</button></div>' );
    
    var mainGroup = form.addFieldGroup( 'main_group', 'Report Data');
    var reportData = form.addField('report_data', 'inlinehtml', 'REPORT DATA', null, 'main_group');
    reportData.setDefaultValue( reportHtml );
  
    return form;
}

function  getOption(year, month)
{
    var strPeriod = '';
    strPeriod = monthArr[month] + ' ' + year;
    return strPeriod;   
}

function monthCalcAcct(monthList, periodId, acctName, amount)
{
    for (var k = 0; k < monthList.length; k++) {
        var tmpPeriodId = monthList[k].periodId;
        if (tmpPeriodId == periodId) {
            monthList[k][acctName] += amount;
            break;
        }
    }

    return monthList;
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