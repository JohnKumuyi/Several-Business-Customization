function main(req, res)
{
   var itemMasterData = getItemMasterData();
   var itemMasterArrObj = JSON.parse(itemMasterData);

   var html = makeHtmlPage(itemMasterArrObj);
   res.write(html);
}

function getItemMasterData(){
  var ret = '';
  try {
     var attachment = nlapiLoadFile('169157');
     var ret = attachment.getValue();
  }
  catch(err) {
     nlapiLogExecution("Audit", "Error_Event", "An error occurred when trying to load the file.");
  }
  return ret;
}

function makePageHeader()
{
    var mainHtml = "<div style='margin-left: 8px; margin-top: 8px; padding-bottom: 5px'>";
    mainHtml += "<button style='margin-left: 0px' onclick='printExcel()'>Excel</button>";
    mainHtml += "</div>";

    return mainHtml;
}

function makeTable(itemMasterArrObj)
{
  //  var mainHtml = '<section class="">';
      var mainHtml = '<div class="container">';
  //    mainHtml += '<div class="container">';
        mainHtml += "<table id='tbl_obj' style='border-collapse:collapse;'>";
        mainHtml += makeTableHeader();
        mainHtml += makeTableBody(itemMasterArrObj);
        mainHtml += "</table>";
        mainHtml += "</div>";
  //    mainHtml += "</section>";

    return mainHtml;
}

function makeTableHeader()
{
    //style='background-color:rgb(230, 230, 230);
  var mainHtml =  "<thead>";
      mainHtml += "<tr class='header'>";
      mainHtml += "<td class='menu_td'>";
      mainHtml += "<div>No</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:40px' class='menu_td'>";
      mainHtml += "<div>Part Number</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:80px' class='menu_td'>";
      mainHtml += "<div>Description</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:80px' class='menu_td'>";
      mainHtml += "<div>Class</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:95px' class='menu_td'>";
      mainHtml += "<div>Manufacturer</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:80px' class='menu_td'>";
      mainHtml += "<div>Tier</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:135px' class='menu_td'>";
      mainHtml += "<div>Parent<BR>Condition</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:63px' class='menu_td'>";
      mainHtml += "<div>Condition</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:86px' class='menu_td'>";
      mainHtml += "<div>Online<BR>Information</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:86px' class='menu_td'>";
      mainHtml += "<div>AMZ SKU</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:82px' class='menu_td'>";
      mainHtml += "<div>Quantity</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:50px' class='menu_td'>";
      mainHtml += "<div>Avge<BR>Cost</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:105px' class='menu_td'>";
      mainHtml += "<div>Extended<BR>Cost</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:46px' class='menu_td'>";
      mainHtml += "<div>Min<BR>Sell<BR>Price</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:46px' class='menu_td'>";
      mainHtml += "<div>Avg<BR>Sell<BR>Price 30</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:46px' class='menu_td'>";
      mainHtml += "<div>Avg<BR>Sell<BR>Price 60</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:46px' class='menu_td'>";
      mainHtml += "<div>Avg<BR>Sell<BR>Price 90</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:46px' class='menu_td'>";
      mainHtml += "<div>Avg GP 30</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:46px' class='menu_td'>";
      mainHtml += "<div>Avg GP 60</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:46px' class='menu_td'>";
      mainHtml += "<div>Avg GP 90</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:80px' class='menu_td'>";
      mainHtml += "<div>DaaS<BR>Price</div>";
      mainHtml += "</td>"
      mainHtml += "<td style='text-align:center; width:80px' class='menu_td'>";
      mainHtml += "<div>Last<BR>Sale<BR>Price</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:135px' class='menu_td'>";
      mainHtml += "<div>Last<BR>Sale<BR>Date</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:60px' class='menu_td'>";
      mainHtml += "<div>Units<BR>Sold<BR>30 Days</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:60px' class='menu_td'>";
      mainHtml += "<div>Units<BR>Sold<BR>60 Days</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:60px' class='menu_td'>";
      mainHtml += "<div>Units<BR>Sold<BR>90 Days</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:72px' class='menu_td'>";
      mainHtml += "<div>Units<BR>Sold<BR>180 Days</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:79px' class='menu_td'>";
      mainHtml += "<div>Units<BR>Sold<BR>1 year</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:63px' class='menu_td'>";
      mainHtml += "<div>Max Qty</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:70px' class='menu_td'>";
      mainHtml += "<div>Sell Off<BR>Qty</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:53px' class='menu_td'>";
      mainHtml += "<div>Offer</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:68px' class='menu_td'>";
      mainHtml += "<div>Ext<BR>Offer</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:63px' class='menu_td'>";
      mainHtml += "<div>In<BR>transit</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:68px' class='menu_td'>";
      mainHtml += "<div>Landed</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:56px' class='menu_td'>";
      mainHtml += "<div>Break<BR>down</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:56px' class='menu_td'>";
      mainHtml += "<div>Pending<BR>Receipt</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:56px' class='menu_td'>";
      mainHtml += "<div>Total<BR>Incoming</div>";
      mainHtml += "</td>";
      mainHtml += "<td style='text-align:center; width:56px' class='menu_td'>";
      mainHtml += "<div>PO Unit<BR>Avge<BR>Price</div>";
      mainHtml += "</td>";
      mainHtml += "</tr>";
      mainHtml += "</thead>";

      return mainHtml;
}

function makeTableBody(itemMasterArrObj)
{
    var mainHtml = '<tbody>';
    var allCount = 1;
    for(var key in itemMasterArrObj){
        var itemObj = itemMasterArrObj[key];
        var conditionArr = itemObj.conditionArr;
        for (var k = 0; k < conditionArr.length; k ++) {
            mainHtml += "<tr>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:30px'>";
            mainHtml += allCount;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:96px'>";
            mainHtml += itemObj.itemSku;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:80px'>";
            mainHtml += itemObj.description;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:80px'>";
            mainHtml += itemObj.class;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:85px'>";
            mainHtml += itemObj.manufacturer;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:85px'>";
            mainHtml += itemObj.tier;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            mainHtml += conditionArr[k].parentCondition;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:80px'>";
            mainHtml += conditionArr[k].condition;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:80px'>";
            mainHtml += itemObj.onlineInfo;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:80px'>";
            mainHtml += conditionArr[k].amzsku;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:50px'>";
            mainHtml += conditionArr[k].quantity;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            mainHtml += conditionArr[k].avgCost;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            mainHtml += conditionArr[k].extCost;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            mainHtml += conditionArr[k].minSellPrice;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            if (conditionArr[k].revenue30Amt * 1 != 0 && conditionArr[k].unitsSold30 * 1 != 0) {
                mainHtml += (conditionArr[k].revenue30Amt * 1 / conditionArr[k].unitsSold30 * 1).toFixed(2);    
            }
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            if (conditionArr[k].revenue60Amt * 1 != 0 && conditionArr[k].unitsSold60 * 1 != 0) {
                mainHtml += (conditionArr[k].revenue60Amt * 1 / conditionArr[k].unitsSold60 * 1).toFixed(2);    
            }
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            if (conditionArr[k].revenue90Amt * 1 != 0 && conditionArr[k].unitsSold90 * 1 != 0) {
                mainHtml += (conditionArr[k].revenue90Amt * 1 / conditionArr[k].unitsSold90 * 1).toFixed(2);    
            }
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            if ((conditionArr[k].revenue30Amt * 1 != 0 || conditionArr[k].cost30Amt * 1 != 0) && conditionArr[k].unitsSold30 * 1 != 0) {
                mainHtml += ((conditionArr[k].revenue30Amt * 1 - conditionArr[k].cost30Amt * 1) / conditionArr[k].unitsSold30 * 1).toFixed(2);    
            }
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            if ((conditionArr[k].revenue60Amt * 1 != 0 || conditionArr[k].cost60Amt * 1 != 0) && conditionArr[k].unitsSold60 * 1 != 0) {
                mainHtml += ((conditionArr[k].revenue60Amt * 1 - conditionArr[k].cost60Amt * 1) / conditionArr[k].unitsSold60 * 1).toFixed(2);    
            }
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            if ((conditionArr[k].revenue90Amt * 1 != 0 || conditionArr[k].cost90Amt * 1 != 0) && conditionArr[k].unitsSold90 * 1 != 0) {
                mainHtml += ((conditionArr[k].revenue90Amt * 1 - conditionArr[k].cost90Amt * 1) / conditionArr[k].unitsSold90 * 1).toFixed(2);    
            }
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            if (conditionArr[k].daasPrice) {
                mainHtml += ((conditionArr[k].daasPrice) * 1).toFixed(3);
            }
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            mainHtml += conditionArr[k].lastSalePrice;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:80px'>";
            mainHtml += conditionArr[k].lastSaleDate;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:70px'>";
            mainHtml += conditionArr[k].unitsSold30;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:70px'>";
            mainHtml += conditionArr[k].unitsSold60;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:70px'>";
            mainHtml += conditionArr[k].unitsSold90;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:70px'>";
            mainHtml += conditionArr[k].unitsSold180;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:70px'>";
            mainHtml += conditionArr[k].unitsSold365;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            mainHtml += conditionArr[k].maxQty;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:70px'>";
            mainHtml += (conditionArr[k].quantity * 1 + conditionArr[k].poTotalIncoming * 1) - conditionArr[k].maxQty * 1;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            mainHtml += conditionArr[k].poIntransit;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            mainHtml += conditionArr[k].poLanded;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            mainHtml += conditionArr[k].poBreakdown;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            mainHtml += conditionArr[k].poPendingReceipt;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            mainHtml += conditionArr[k].poTotalIncoming;
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "<td>";
            mainHtml += "<div style='text-align:center; width:60px'>";
            if (conditionArr[k].poTotalIncoming * 1 > 0 && conditionArr[k].poTotalAmount * 1 > 0) {
                var poAvgCost = ( conditionArr[k].poTotalAmount / conditionArr[k].poTotalIncoming ) * 1;
                mainHtml += poAvgCost.toFixed(2);
              // mainHtml += conditionArr[k].poTotalAmount;
            }
            mainHtml += "</div>";
            mainHtml += "</td>";
            mainHtml += "</tr>";

            allCount ++;
        }
    }
    mainHtml += '</tbody>';
    return mainHtml;
}

function makeHtmlPage(itemMasterArrObj)
{
    var mainHtml = "<!doctype html>";
    mainHtml += "<html>"
    mainHtml += "<head>";
        mainHtml += "<title>";
        mainHtml += "Item Master Report";
        mainHtml += "</title>";
        mainHtml += "<style>table, th, td { border: 1px solid black;} .menu_td {background-color: rgb(155, 155, 156)}";
        mainHtml += '#load{width:100%; height:100%; position:fixed;z-index:9999; background:url("https://system.na2.netsuite.com/core/media/media.nl?id=161990&c=4452292&h=341758c4d77ebdcb9c70") no-repeat center center rgba(0,0,0,0.25)}';
        mainHtml += '</style>';
        mainHtml += '<link rel="stylesheet" type="text/css" href="https://system.na2.netsuite.com/core/media/media.nl?id=169259&c=4452292&h=deabeb245bc32d141ae9&_xt=.css">'; // css
        mainHtml += "<script src='https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'></script>";
        mainHtml += '<script src="https://system.na2.netsuite.com/core/media/media.nl?id=161988&c=4452292&h=b73e0ffe8651657d7f29&_xt=.js"></script>'; // FileSaver
        mainHtml += '<script src="https://system.na2.netsuite.com/core/media/media.nl?id=161989&c=4452292&h=9bcec0d582c15edb8682&_xt=.js"></script>'; // Excel
        mainHtml += '<script src="https://system.na2.netsuite.com/core/media/media.nl?id=169257&c=4452292&h=279788b3fa52011dfa9d&_xt=.js"></script>';
    mainHtml += "</head>";
    mainHtml += "<body style='margin: 0px'>";
    mainHtml += makeLoader();
    mainHtml += makePageHeader();
    mainHtml += makeTable(itemMasterArrObj);
    mainHtml += "</body>";
    mainHtml += "</html>";

    return mainHtml;
}

function makeLoader()
{
    var mainHtml = '<div id="load" style="display:none; margin: 0px; top: 0px"></div>';
    return mainHtml;
}