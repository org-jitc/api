var wshTable = $('#wshTable');
var queryForm = $('#queryForm');
var checkUnitIds = $('[name="unitIds"]');
var checkUnitAll = $('#check-unit-all');
var startDate = $('[name="startDate"]');
var endDate = $('[name="endDate"]');
var btnDisplayData = $('#btn-display-data');
var btnCsv = $('#btn-csv');
var checkCSVMerge = $('[name="csvMerge"]');
var divErrUnit = $('#div-err-unit');

var dataTable;
var tableColumns;
var tableData;
var checkedUnitIds;

//***** unitIds check, uncheck behavior start
checkUnitIds.change(function(){
	
	var checkedNum = checkUnitIds.filter(':checked').length;
	if(checkedNum == checkUnitIds.length)
		checkUnitAll.prop('checked', true);
	else
		checkUnitAll.prop('checked', false);
});
//_____ unitIds check, uncheck behavior end

//***** unitIds all check behavior start
checkUnitAll.change(function(){
	checkUnitIds.prop('checked', this.checked);
});
//***** unitIds all check behavior end

//***** table click
wshTable.click(function(){
	window.open(contextPath + 'large/wirelessStateHistory/Large.jsp');
});
//_____ table click

//***** Ajax: get wireless state history data start
function getWirelessStateHistory(btn) {
	
	if(!checkConditions())
		return;
	
	// button id
	var btnId = $(btn).attr('id');
	
	var currentCheckedUnitIds = '';
	checkUnitIds.filter(':checked').each(function(){
		
		if(currentCheckedUnitIds != '')
			currentCheckedUnitIds += ',';
		currentCheckedUnitIds += this.value;
	});
	
	var paramData = {
		unitIds: currentCheckedUnitIds,
		startDate: startDate.val(),
		endDate: endDate.val()
	};
	
	if(btnId == 'btn-display-data' || checkCSVMerge.prop('checked')){
		
		$.ajax({
			url: '/zeuschart/WirelessStateHistory/History.do',
			async: true,
			cache: false,
			data: paramData,
			btnId: btnId,
			success: function(response){
				
				var respObj = JSON.parse(response);
				tableColumns = respObj.columns;
				tableData = respObj.data;
				
				// for csv
				if(this.btnId == 'btn-csv')
					getCSVFromTable();
				else{
					
					// データテーブル
					if(dataTable != null)
						dataTable.destroy();
					wshTable.empty();
					// データテーブル
					dataTable = wshTable.DataTable({
						paging: false,
						searching: false,
						ordering: false,
						info: false,
						scrollX: true,
						scrollY: 400,
						fixedColumns: true,
						columns: tableColumns,
						data: tableData
					});
					
					$('.table.table-bordered.table-striped.dataTable.no-footer').css('border-bottom', '1px solid');
				}
			},
			error: function(){
				
				isGetHistory = true;
				console.log('get history data error');
			}
		});
	}else
		getCSVZip(paramData);
	
	// 「チェックされたunitIds」の更新
	if(currentCheckedUnitIds != checkedUnitIds){

		$.ajax({
			url: contextPath + 'Ajax/WirelessStateHistory/UpdateUserOption.action',
			async: true,
			cache: false,
			type: 'post',
			data: {
				unitIds: currentCheckedUnitIds
			},
			success: function(resp){
				
				let respObj = JSON.parse(resp);
				if(respObj.error != null)
					console.log('error: cannot reach sync server');
			},
			error: function(){
				console.log('update checked unit ids error');
			}
		});
		
		checkedUnitIds = currentCheckedUnitIds;
	}
}
//_____ Ajax: get wireless state history data end

//***** データ表示ボタン動作
btnDisplayData.click(function(){
	getWirelessStateHistory(this);
});
//_____ データ表示ボタン動作

btnCsv.click(function(){
	getWirelessStateHistory(this);
});

//********** transfer table data to csv
function getCSVFromTable() {
	
	// csv
	var str = '';
	//********************** title
	if(tableColumns != null){
		
		//***** first line
		for(var i = 0; i < tableColumns.length; i++){
			
			if(i == 0)
				str += tableColumns[i].title;
			else{
				
				str += "," + tableColumns[i].title;
				for(var j = 0; j < fmtParamLength - 1; j++)
					str += ",";
			}
		}
		str += '\n';
		//_____ first line
		
		//***** second line
		for(var i = 1; i < tableColumns.length; i++){
			
			for(var key in fmtParam)
				str += ',' + fmtParam[key];
		}
		str += '\n';
		//_____ second line
	}
	//______________________ title
	//***** data
	if(tableData != null){
		
		let dataArr;
		let data;
		let valueArr;
		let div;
		let lis;
		for(var i = 0; i < tableData.length; i++){
			
			for(var j = 0; j < tableData[i].length; j++){
				
				if(j == 0)
					str += tableData[i][j];
				else{
					
					/* <ul style='margin: 0; padding-left: 15px; text-align: left; float: left;'>
					 * 	<li style='list-style-type:none;'>親ノード: 0</li>
					 * 	<li style='list-style-type:none;'>電波強度: -36</li>
					 * 	<li style='list-style-type:none;'>電波品質: 4</li>
					 * 	<li style='list-style-type:none;'>再送信回数: 10819</li>
					 * 	<li style='list-style-type:none;'>エラー回数: 452</li>
					 * </ul>
					 */
					if(tableData[i][j] == ''){
						
						for(var key in fmtParam)
							str += ",-";
					}else{
						
						div = document.createElement('div');
						div.innerHTML = tableData[i][j];
						lis = div.childNodes[0].childNodes;
						
						for(let k = 0, kl = lis.length; k < kl; k++){
							
							data = lis[k].innerText;
							valueArr = data.split(':');
							
							str += ',' + valueArr[1].trim();
						}
					}
				}
			}
			str += '\n';
		}
	}

	// csvデータ変換
	str = '\ufeff' + str;
	// csvファイル名
	var fileName = '';
	var startDateStr = startDate.val();
	var endDateStr = endDate.val();
	
	fileName += startDateStr;
	if(startDateStr != endDateStr)
		fileName += '_' + endDateStr;
	fileName += '.csv';
	
	zeus.exportCSV(str, fileName);
}
//____________________ transfer table data to csv

//******************** get csv zip file
function getCSVZip(paramData){
	
	paramData.userId = userId;
	
	$.ajax({
		url: '/zeuschart/WirelessStateHistory/GetCSVZip.do',
		async: true,
		cache: false,
		data: paramData,
		success: function(response){
			
			var respObj = JSON.parse(response);
			var form = $('<form method="GET"></form>');
			form.attr('action', '/zeuschart/' + respObj.zipUrl);
			form.appendTo($('body'));
			form.submit();
			form.remove();
		},
		error: function(){
			console.log('update checked unit ids error');
		}
	});
}
//____________________ get csv zip file

//******************** ボタン動作前のチェック
function checkConditions(){
	
	divErrUnit.html('');
	
	var checkedNum = checkUnitIds.filter(':checked').length;
	if(checkedNum == 0){
		
		divErrUnit.html(fmtErrParam.unitNotCheckErr);
		return false;
	}
	
	return true;
}
//____________________ ボタン動作前のチェック

//******************** init
$(".date-picker").datepicker({
    language: sysLanguage,
    autoclose: true,
    todayHighlight: true
});
//==================== init