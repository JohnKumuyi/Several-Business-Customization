function main( request, response )
{
    var classId = request.getParameter('classId');
    var salesRep = request.getParameter('salesRep');
    makeReport(classId, salesRep, response);
}

function makeReport(classId, salesRep, response)
{
    var allStageObj = loadTransaction(classId, salesRep);
    var reportHtml = processTransaction(allStageObj);
    var form = makeForm(classId, salesRep, reportHtml);

    response.writePage(form);
}

function loadTransaction(classId, salesRep)
{
    var search = nlapiLoadSearch('transaction', 'customsearch_thisperiod_mrr_report_3');
    var cols = search.getColumns();
    cols[0].setSort();
    cols[1].setSort();
    cols[2].setSort();
    cols[15].setSort(true);
 /*     cols[1].setSort();
    cols[15].setSort(true);*/

    var newSearch = nlapiCreateSearch(search.getSearchType(), search.getFilters(), cols);
    if (classId) {
        newSearch.addFilter(new nlobjSearchFilter('class', null, 'anyOf', classId));    
    }
    if (salesRep) {
        newSearch.addFilter(new nlobjSearchFilter('salesrep', null, 'anyOf', salesRep));    
    }
    
    var searchResults = newSearch.runSearch();
//    var searchResults = search.runSearch(); 
 
    // resultIndex points to record starting current resultSet in the entire results array
    var resultIndex = 0;
    var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
    var resultSet; // temporary variable used to store the result set

    var allCount = 0;
    var oldStageId = 0;
    var stageList = [];
    var allStageObj = new Object;
    do
    {
        resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);

        for ( var i = 0; i < resultSet.length; i++ ) {
            var element = resultSet[i];
            var stageId = element.getValue(cols[1]) * 1;
            var stageName = element.getText(cols[1]);
            var saleRepId = element.getValue(cols[2]);
            var saleRepName = element.getText(cols[2]);
            var customerId = element.getValue(cols[3]);
            var customerName = element.getText(cols[3]);
            var estMRR = element.getValue(cols[4]) * 1;
            var weightMRR = element.getValue(cols[15]) * 1;
            var className = element.getText(cols[5]);
            var users = element.getValue(cols[6]) * 1;
            var partner = element.getText(cols[8]);
            var rpu = 0;
            if (className != 'Parts') {
                if (users > 0) {
                    rpu = (estMRR / users * 1).toFixed(2);
                }
            }
            var nrr = element.getValue(cols[9]) * 1;
            var wNRR = element.getValue(cols[10]) * 1;
            var gp = element.getValue(cols[11]) * 1;
            var wGP = element.getValue(cols[12]) * 1;
            customerName = element.getValue(cols[13]);

            if (stageId != oldStageId) {
                stageList = [];
            }
            dLog(i, stageName);
            var oppObj = new Object;
            oppObj.stageId = stageId;
            oppObj.stageName = stageName;
            oppObj.saleRepId = saleRepId;
            oppObj.saleRepName = saleRepName;
            oppObj.customerId = customerId;
            oppObj.customerName = customerName;
            oppObj.estMRR = estMRR;
            oppObj.weightMRR = weightMRR;
            oppObj.className = className;
            oppObj.users = users;
            oppObj.rpu = rpu;
            oppObj.partner = partner;
            oppObj.nrr = nrr;
            oppObj.wNRR = wNRR;
            oppObj.gp = gp;
            oppObj.wGP = wGP;
            stageList.push(oppObj);

            allStageObj[stageId] = stageList;

            oldStageId = stageId;
        }

        resultIndex = resultIndex + resultStep;

    } while (resultSet.length > 0);

    return allStageObj;
}

function processTransaction(allStageObj)
{
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
  html += "<div style='width:1800px; height: 100%; overflow-x:auto; margin-top: -10px'>";
        html += "<table id='tbl_obj' style='border-collapse: collapse; border: solid 1px rgb(199, 199, 199)'>";
        html += "<tr><td class='report_head_cell' style='border-top: solid 3px white; border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'>No</td><td class='report_head_cell' style='border-top: solid 3px white; border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'>STAGE</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>CLASS</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white'>PARTNER</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white'>SALES REP</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white'>CUSTOMER NAME</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white'>MRR</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>WMRR</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>USERS</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>RPU $</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>NRR $</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>WNRR $</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>GP $</td>";
        html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white;'>WGP $</td>";
        html += "</tr>";
        var allCount = 0;
        var totalEst = 0;
        var totalWet = 0;
        var totalUsers = 0;
        var totalNRR = 0;
        var totalWNRR = 0;
        var totalGP = 0;
        var totalWGP = 0;
        for (var stageId in allStageObj) {
            var stageList = allStageObj[stageId];
            if (stageList != undefined && stageList != 'undefined' && stageList.length > 0) {
                var stageName = stageList[0].stageName;
                var stageEstTotal = 0;
                var stageWetTotal = 0;
                var stageUserTotal = 0;
                var stageNRRTotal = 0;
                var stageWNRRTotal = 0;
                var stageGPTotal = 0;
                var stageWGPTotal = 0;
                html += "<tr><td style='text-align:center; border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 12pt; font-weight:bold' colspan='14'>" + stageName + "</td></tr>";
                for (var i = 0; i < stageList.length; i ++) {
                    var element = stageList[i];
                    var stageName = element.stageName;
                    var saleRepId = element.saleRepId;
                    var saleRepName = element.saleRepName;
                    var customerId = element.customerId;
                    var customerName = element.customerName;
                    var estMRR = Math.round(element.estMRR * 1);
                    var weightMRR = Math.round(element.weightMRR * 1); 
                    var className = element.className;
                    var users = element.users * 1;
                    var rpu = element.rpu * 1;
                    var partner = element.partner;
                    var nrr = Math.round(element.nrr * 1);
                    var wNRR = Math.round(element.wNRR * 1); 
                    var gp = Math.round(element.gp * 1);
                    var wGP = Math.round(element.wGP * 1); 
                    var count = i + 1;
                    stageEstTotal += estMRR;
                    stageWetTotal += weightMRR;
                    stageUserTotal += users;
                    stageNRRTotal += nrr;
                    stageWNRRTotal += wNRR;
                    stageGPTotal += gp;
                    stageWGPTotal += wGP;
                    allCount ++;

                    html += "<tr>";
                    html += "<td class='report_head_cell' style='border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'>" + count + "</td>";
                    html += "<td class='menu_col'>" + stageName + "</td>";
                    html += "<td class='menu_col'>" + className + "</td>";
                    html += "<td class='menu_col'>" + partner + "</td>";
                    html += "<td class='menu_col'>" + saleRepName + "</td>";
                    html += "<td class='menu_col'>" + customerName + "</td>";
                    html += "<td class='data_col'><div>" + addCommas(parseFloat(estMRR)) + "</div></td>";
                    html += "<td class='data_col'><div>" + addCommas(parseFloat(weightMRR)) + "</div></td>";
                    html += "<td class='data_col'><div>" + addCommas(parseFloat(users)) + "</div></td>";
                    html += "<td class='data_col'><div>" + addCommas(parseFloat(rpu)) + "</div></td>";
                    html += "<td class='data_col'><div>" + addCommas(parseFloat(nrr)) + "</div></td>";
                    html += "<td class='data_col'><div>" + addCommas(parseFloat(wNRR)) + "</div></td>";
                    html += "<td class='data_col'><div>" + addCommas(parseFloat(gp)) + "</div></td>";
                    html += "<td class='data_col'><div>" + addCommas(parseFloat(wGP)) + "</div></td>";
                    html += "</tr>";
                }
                html += "<tr>";
                html += "<td class='report_head_cell' style='border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'></td><td class='report_head_cell' style='border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'>SUB TOTAL</td>";
                html += "<td  class='report_head_cell' style='text-align:center;'></td>";
                html += "<td  class='report_head_cell' style='text-align:center;'></td>";
                html += "<td  class='report_head_cell' style='text-align:center;'></td>";
                html += "<td  class='report_head_cell' style='text-align:center;'></td>";
                html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(stageEstTotal)) + "</td>";
                html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(stageWetTotal)) + "</td>";
                html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(stageUserTotal)) + "</td>";
                html += "<td  class='report_head_cell' style='text-align:center;'>";
                if (stageUserTotal > 0) {
                    html += addCommas(parseFloat((stageEstTotal / stageUserTotal).toFixed(2)));
                }
                html += "</td>";
                html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(stageNRRTotal)) + "</td>";
                html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(stageWNRRTotal)) + "</td>";
                html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(stageGPTotal)) + "</td>";
                html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(stageWGPTotal)) + "</td>";
                html += "</tr>";
                totalEst += stageEstTotal;
                totalWet += stageWetTotal;
                totalUsers += stageUserTotal;
                totalNRR += stageNRRTotal;
                totalWNRR += stageWNRRTotal;
                totalGP += stageGPTotal;
                totalWGP += stageWGPTotal;
            }     
        }

        html += "<tr>";
        html += "<td class='report_head_cell' style='border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'></td><td class='report_head_cell' style='border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'>TOTAL</td>";
        html += "<td class='report_head_cell' style='text-align:center;'></td>";
        html += "<td class='report_head_cell' style='text-align:center;'></td>";
        html += "<td  class='report_head_cell' style='text-align:center;'></td>";
        html += "<td  class='report_head_cell' style='text-align:center;'></td>";
        html += "<td class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(totalEst)) + "</td>";
        html += "<td class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(totalWet)) + "</td>";
        html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(totalUsers)) + "</td>";
        html += "<td  class='report_head_cell' style='text-align:center;'>";
        if (totalUsers > 0) {
            html += addCommas(parseFloat((totalEst / totalUsers).toFixed(2)));
        }
        html += "</td>";
        html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(totalNRR)) + "</td>";
        html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(totalWNRR)) + "</td>";
        html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(totalGP)) + "</td>";
        html += "<td  class='report_head_cell' style='text-align:center;'>" + addCommas(parseFloat(totalWGP)) + "</td>";
        html += "</tr>";

/**************************** Total **************************/    
  
        html += "</table>";
        html += "</div>";
        html += "</html>";
    
    return html;
}

function makeForm(classId, salesRep, reportHtml)
{
    var form = nlapiCreateForm('Forecast MRR Report');
    form.setScript('customscript83');
    
    var filterGroup = form.addFieldGroup( 'filter_group', 'Report Filters');

    var classFldLbl = form.addField('class_label','inlinehtml', 'CLASS', null, 'filter_group');
    classFldLbl.setLayoutType('outsidebelow','startcol')
    classFldLbl.setDefaultValue( '<div style="display: inline-flex;padding-left: 5px; font-size: 10pt;padding-right: 5px;align-items:  center;color: rgb(100,100,100);">CLASS</div>' );
    
    var classFld = form.addField('class', 'select', '', 'classification', 'filter_group');
    classFld.setLayoutType('outsidebelow','startcol')
    classFld.setDefaultValue(classId);

    var salesRepFldLbl = form.addField('sales_rep_label','inlinehtml', 'SALES REP', null, 'filter_group');
    salesRepFldLbl.setLayoutType('outsidebelow','startcol')
    salesRepFldLbl.setDefaultValue( '<div style="display: inline-flex;padding-left: 5px; font-size: 10pt;padding-right: 5px;align-items:  center;color: rgb(100,100,100);">SALES REP</div>' );
    
    var salesRepFld = form.addField('sales_rep', 'select', '', 'employee', 'filter_group');
    salesRepFld.setLayoutType('outsidebelow','startcol')
    salesRepFld.setDefaultValue(salesRep);

    var refreshBtn = form.addField('refresh_html','inlinehtml', 'Refresh', null, 'filter_group');
    refreshBtn.setLayoutType('outsidebelow','startcol')
    refreshBtn.setDefaultValue( '<div style="display: inline-flex;margin-left: 60px;padding-right: 5px;align-items:  center;color: rgb(100,100,100);"><button id="refresh_btn" style="cursor:pointer; font-size: 11pt;font-weight: bold;width: 110px;color: rgb(110, 110, 110);">Refresh</button></div>' );
  
    var excelExportBtn = form.addField('excel_export_html','inlinehtml', 'Excel Export', null, 'filter_group');
    excelExportBtn.setLayoutType('outsidebelow','startcol')
    excelExportBtn.setDefaultValue( '<div style="display: inline-flex;margin-left: 5px;padding-right: 5px;align-items:  center;color: rgb(100,100,100);"><button id="excel_export_btn" style="cursor:pointer; font-size: 11pt;font-weight: bold;width: 110px;color: rgb(110, 110, 110);">Excel Export</button></div>' );
    
    var mainGroup = form.addFieldGroup( 'main_group', 'Report Data');
    var reportData = form.addField('report_data', 'inlinehtml', 'REPORT DATA', null, 'main_group');
    reportData.setDefaultValue( reportHtml );
  
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