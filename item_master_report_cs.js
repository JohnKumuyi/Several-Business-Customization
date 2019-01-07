function s2ab(s)
{
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

function printExcel()
{	
	if ($('#tbl_obj tr').length == 1) {
		alert("There is nothing data to save into Excel!");
		return;
	}
	
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth() + 1;
	var date = today.getDate();
	var file_name_suffix = "_" + year + "_" + month + "_" + date;

	var wb = XLSX.utils.table_to_book(document.getElementById('tbl_obj'), {sheet:"Sheet1"});
	var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
	saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'Item Master Report' + file_name_suffix + '.xlsx');	
}