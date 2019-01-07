function main( request, response )
{
    makeReport(response);
}

function makeReport(response)
{
    var caseList = loadData();
    var reportHtml = processData(caseList);
    var form = makeForm(reportHtml);
    response.writePage(form);
}

function loadData()
{
    try {
    // resultIndex points to record starting current resultSet in the entire results array
        var search = nlapiLoadSearch( 'supportcase', 'customsearch_case_status_report' );
        var searchResults = search.runSearch();
        var cols = search.getColumns();
        // resultIndex points to record starting current resultSet in the entire results array
        var resultIndex = 0;
        var resultStep = 100; // Number of records returned in one step (maximum is 1000)
        var resultSet; // temporary variable used to store the result set
        var oldCaseId = 0;
        var caseList = new Object;
        var caseObj = new Object;

        do
        {
          
          resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);
        
          for ( var i = 0; i < resultSet.length; i++ ) {
	            var element = resultSet[i];
	            var caseId = element.getId();
	            var caseNumber = element.getValue(cols[0]);
	            var subject = element.getValue(cols[1]);
	            var customerId = element.getValue(cols[2]);
	            var customerName = element.getText(cols[2]);
	            var dateCreated = element.getValue(cols[3]);
	            var employeeId = element.getValue(cols[4]);
	            var employeeName = element.getText(cols[4]);
	            var noteDate = element.getValue(cols[5]);
	            var noteOldVal = element.getValue(cols[6]);
	            var noteNewVal = element.getValue(cols[7]);
                var currentStatus = element.getText(cols[8]);
				if (caseId != oldCaseId) {
	            	caseObj = {};
	            	caseObj.caseId = caseId;
	            	caseObj.caseNumber = caseNumber;
                    caseObj.currentStatus = currentStatus;
	            	caseObj.subject = subject;
	            	caseObj.customerId = customerId;
	            	caseObj.customerName = customerName;
	            	caseObj.dateCreated = dateCreated;
	            	caseObj.employeeId = employeeId;
	            	caseObj.employeeName = employeeName;
	            	caseObj.statusTrack = noteOldVal + ' : ' + dateCreated;
	            	caseObj.statusTrack += ' => ' + noteNewVal + ' : ' + noteDate;
	            } else {
	            	caseObj.statusTrack += ' => ' + noteNewVal + ' : ' + noteDate;
	            }
	            caseList[caseId] = caseObj;
	            oldCaseId = caseId;
		  }

         resultIndex = resultIndex + resultStep;
       
        } while (resultSet.length > 0);

        return caseList;
    } catch ( error ) {

      if ( error.getDetails != undefined ) {
        nlapiLogExecution( "error", "Process Error", error.getCode() + ":" + error.getDetails() );
      } else {
        nlapiLogExecution( "error", "Unexpected Error", error.toString() );
      }

    }
}

function processData(caseList)
{
    var html = "<html>";
    html += "<head>";
    html += "<style>";
    html += ".report_head_cell{font-weight: normal; background-color: #e0e6ef; border-right: solid 1px rgb(199, 199, 199);  border-bottom: solid 1px rgb(199, 199, 199); font-size: 10pt; font-weight: bold}";
    html += ".report_bold_cell{font-weight: bold;}";
    html += ".menu_col{white-space: nowrap; border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); font-size: 10pt; }";
    html += ".data_col{border-right: solid 1px rgb(199, 199, 199);  border-bottom: solid 1px rgb(199, 199, 199); font-size: 10pt; padding-left: 5px; min-width: 70px}";
	html += ".data_link{cursor:pointer; display:inline-block}";
    html += ".data_link:hover {color: blue; text-decoration: underline}";
    html += "</style>";
    html += "</head>";
	html += "<div style='width:1800px; height: 100%; overflow-x:auto; margin-top: -10px'>";
    html += "<table id='tbl_obj' style='border-collapse: collapse; border: solid 1px rgb(199, 199, 199)'>";
    html += "<tr>";
    html += "<td class='report_head_cell' style='border-top: solid 3px white; border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; width: 60px; font-size: 10pt;'>Case #</td>";
    html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white'>Subject</td>";
    html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white'>Company</td>";
    html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white'>Assigned To</td>";
    html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white'>Current Status</td>";
    html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white'>Status History</td>";
    html += "<td  class='report_head_cell' style='text-align:center; border-top: solid 3px white; width: 90px'>Edit | View</td>";
    html += "</tr>";
    
    for (var caseId in caseList) {
        var element = caseList[caseId];
    	html += "<tr>";
        html += "<td class='report_head_cell' style='border-right: solid 1px rgb(199, 199, 199); border-bottom: solid 1px rgb(199, 199, 199); padding-left: 3px; font-size: 10pt;'>" + element.caseNumber + "</td>";
        html += "<td class='data_col'>" + element.subject + "</td>";
        html += "<td class='data_col'>" + element.customerName + "</td>";
        html += "<td class='data_col'>" + element.employeeName + "</td>";
        html += "<td class='data_col'><div>" + element.currentStatus + "</div></td>";
        html += "<td class='data_col'><div>" + element.statusTrack + "</div></td>";
        var edit_link = "https://system.na2.netsuite.com/app/crm/support/supportcase.nl?id=" + element.caseId + "&e=T";
        var view_link = "https://system.na2.netsuite.com/app/crm/support/supportcase.nl?id=" + element.caseId;
        html += "<td class='data_col' style='text-align:center; padding-left: 0px'><div class='data_link' link='" + edit_link + "'>Edit</div>&nbsp;|&nbsp;<div class='data_link' link='" + view_link + "'>View</div></td>";
        html += "</tr>";
    }

    return html;
}

function makeForm(reportHtml)
{
    var form = nlapiCreateForm('Case Status Track Report');
    form.setScript('customscript_cs_case_status_track');
    
    var filterGroup = form.addFieldGroup( 'filter_group', 'Report Filters');
 /*   var fromDateFldLbl = form.addField('from_date_label','inlinehtml', 'From', null, 'filter_group');
    fromDateFldLbl.setLayoutType('outsidebelow','startcol')
    fromDateFldLbl.setDefaultValue( '<div style="display: inline-flex;padding-left: 5px; font-size: 10pt;padding-right: 5px;align-items:  center;color: rgb(100,100,100);">From</div>' );
    var fromDateFld = form.addField('from_date','select', '', null, 'filter_group');
    fromDateFld.setLayoutType('outsidebelow','startcol')
    fromDateFld.addSelectOption(0, "");*/
/*
    var toDateFldLbl = form.addField('to_date_label','inlinehtml', 'From', null, 'filter_group');
    toDateFldLbl.setLayoutType('outsidebelow','startcol')
    toDateFldLbl.setDefaultValue( '<div style="display: inline-flex;padding-left: 30px; font-size: 10pt;padding-right: 5px;align-items:  center; color: rgb(100,100,100);">To</div>' );
    var toDateFld = form.addField('to_date','select', '', null, 'filter_group');
    toDateFld.setLayoutType('outsidebelow','startcol')
    toDateFld.addSelectOption(0, "");

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