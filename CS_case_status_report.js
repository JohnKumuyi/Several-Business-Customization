$ = jQuery;
$( document ).ready(function() {
/*
    $("#refresh_btn").unbind('click').bind('click', function(){
        refresh();
        return false;
    });
*/
    $("#excel_export_btn").unbind('click').bind('click', function(){
        exportExcel();
        return false;
    });
    
    $(".data_link").unbind('click').bind('click', function(){
        var link = $(this).attr('link');
        window.open(link);
    });
});

function refresh()
{
    var fromDate = nlapiGetFieldText('from_date');
    var toDate = nlapiGetFieldText('to_date');
    
    if(fromDate && toDate)
    {   
        var fromArr = fromDate.split(" ");
        var fromMonthName = fromArr[0];
        var fromMonth = getMonthNumber(fromMonthName);
        var fromYear = fromArr[1];

        var toArr = toDate.split(" ");
        var toMonthName = toArr[0];
        var toMonth = getMonthNumber(toMonthName);
        var toYear = toArr[1];

        window.ischanged = false;
        var param = '&from_year=' + fromYear;
        param += '&from_month=' + fromMonth;
        param += '&to_year=' + toYear;
        param += '&to_month=' + toMonth;
        
        window.location.href = 'https://system.na2.netsuite.com/app/site/hosting/scriptlet.nl?script=74&deploy=1' + param;
    } else {
        alert('Please select correct date range!');
    }
}

var exportExcel = (function() {
    var today = new Date();
    var year = "" + today.getFullYear();
    var month = "" + (today.getMonth() * 1 + 1);
    var day = "" + today.getDate();
    var hours = "" + today.getHours();
    var minutes = "" + today.getMinutes();
    var seconds = "" + today.getSeconds();

    if (month.length == 1) {
        month = '0' + month;
    }
    if (day.length == 1) {
        day = '0' + day;
    }
    if (hours.length == 1) {
        hours = '0' + hours;
    }
    if (minutes.length == 1) {
        minutes = '0' + minutes;
    }
    if (seconds.length == 1) {
        seconds = '0' + seconds;
    }

    var tag = month + day + year.substr(2, 2) + "_" + hours + minutes + seconds;      
    var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
      return function(table, name) {
        table = document.getElementById('tbl_obj')
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
      //  window.location.href = uri + base64(format(template, ctx))

        var a = document.createElement('a')
        a.href =uri + base64(format(template, ctx))
        a.download = 'Case Status History Report_' + tag + '.xls';
        //triggering the function
        a.click();
      }
})()

function dLog(title, detail)
{
    nlapiLogExecution('Debug', title, detail);
}