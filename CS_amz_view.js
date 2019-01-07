$ = jQuery;
$( document ).ready(function() {
    $("#fg_filter_group").hide();  
    $("#fg_main_group").hide();
   
    $("#excel_export_btn").unbind('click').bind('click', function(){
        exportExcel();
        return false;
    });

    $(".edit_col").unbind('click').bind('click', function(){
        var tdObj = $(this);
        if ( tdObj.children().length == 0 ) {
            makeInputElement(tdObj);
        }    
    });
  
    $(".select_col").unbind('click').bind('click', function(){
        var tdObj = $(this);
        if ( tdObj.children().length == 0 ) {
            makeSelectElement(tdObj);
        }    
    });
});

function makeInputElement(element)
{   
    var eleVal = element.html();
    var inputHtml = "<input type='text' class='glowing-border' value='" + eleVal + "'>";
    element.html(inputHtml);
    $(".glowing-border").focus();
    $(".glowing-border").unbind('blur').bind('blur', function(){
        var _eleVal = $(this).prop('value');
        var tdObj = $(this).parent();
        updateInputEleData(tdObj, _eleVal);
        tdObj.html(_eleVal);
    });

    $(".glowing-border").keypress(function(e) {
        if(e.which == 13) {
            var tdIdx = $(this).parent().index();
            $(this).parent().parent().next().children('td').eq(tdIdx).click();
            return false;
        }
    });
}

function updateInputEleData(tdObj, value)
{   
    var recordType = tdObj.parent().children('td').eq(0).attr('recordType');
    var internalId = tdObj.parent().children('td').eq(0).text() * 1;
    var conditionName = tdObj.parent().children('td').eq(3).text();
    var tdIdx = tdObj.index() * 1;
    var fieldType = '';
    if (tdIdx == 4) {
        fieldType = 'asin';
    } else if (tdIdx == 5) {
        fieldType = 'amzsku';
    } else if (tdIdx == 11) {
        fieldType = 'minprice';
    } else if (tdIdx == 12) {
        fieldType = 'maxprice';
    }
    
    var param = {recordType: recordType, internalId: internalId, fieldType: fieldType, fieldValue: value, conditionName: conditionName}; 
    var url = "https://system.na2.netsuite.com/app/site/hosting/scriptlet.nl?script=87&deploy=1";
    $.post(url, param, function(data){
        if (data) {
            var temp = 0;
        } else {
            alert("ERROR : Value can't be saved!");
        }
    });
}

function makeSelectElement(element)
{   
    var amzStoreList = [];
    var amzStoreTblObj = $("#tbl_amzStore tbody");
    var trObjArr = amzStoreTblObj.children('tr');
    for (var i = 0; i < trObjArr.length; i ++) {
        var trObj = trObjArr.eq(i);
        var storeVal = trObj.children('td').eq(0).html() * 1;
        var storeName = trObj.children('td').eq(1).html();
        var amzStoreObj = new Object;
        amzStoreObj.storeVal = storeVal;
        amzStoreObj.storeName = storeName;
        amzStoreList.push(amzStoreObj);
    }
    
    var storeId = element.prop('storeId') * 1;
    var tdStoreName = element.html();  
    var selectHtml = "<SELECT class='glowing-border-sel'>";
    selectHtml += "<OPTION value='0'></OPTION>";
    for (var i = 0; i < amzStoreList.length; i ++) {
        var storeVal =  amzStoreList[i].storeVal * 1;
        var storeName = amzStoreList[i].storeName;
        var selected = '';
        if (tdStoreName == storeName) {
            selected = 'SELECTED';
        }
        var optionHtml = "<OPTION value='" + storeVal + "' " + selected + ">" + storeName + "</OPTION>";
        selectHtml += optionHtml;
    }

    selectHtml += "</SELECT>";
    element.html(selectHtml);

    $(".glowing-border-sel").focus();
    $(".glowing-border-sel").unbind('blur').bind('blur', function(){
        var selectObj = $(this);
        var newStoreId = selectObj.prop('value') * 1;
        var newStoreName = '';
        for (var i = 0; i < selectObj.children('option').length; i ++) {
            var selectedVal = selectObj.children('option').eq(i).prop('value') * 1;
            if (newStoreId == selectedVal) {
                newStoreName = selectObj.children('option').eq(i).text();
            }
        }
      
        var tdObj = $(this).parent();

        updateSelectEleData(tdObj, newStoreId);

        tdObj.prop('storeId', newStoreId);
        tdObj.html(newStoreName);
    });

    $(".glowing-border-sel").keypress(function(e) {
        if(e.which == 13) {
            var tdIdx = $(this).parent().index();
            $(this).parent().parent().next().children('td').eq(tdIdx).click();
            return false;
        }
    });
}

function updateSelectEleData(tdObj, value)
{   
    var recordType = tdObj.parent().children('td').eq(0).attr('recordType');
    var internalId = tdObj.parent().children('td').eq(0).text() * 1;
    var fieldType = 'amzstore';
    
    var param = {recordType: recordType, internalId: internalId, fieldType: fieldType, fieldValue: value}; 
    var url = "https://system.na2.netsuite.com/app/site/hosting/scriptlet.nl?script=87&deploy=1";
    $.post(url, param, function(data){
        if (data) {
            var temp = 0;
        } else {
            alert("ERROR : Value can't be saved!");
        }
    });
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
        a.download = 'AMZ Inventory All_' + tag + '.xls';
        //triggering the function
        a.click();
      }
})()

function dLog(title, detail)
{
    nlapiLogExecution('Debug', title, detail);
}