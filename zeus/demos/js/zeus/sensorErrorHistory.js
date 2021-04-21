var tableSeh = $('#table-seh');
var tableSensors = $('#table-sensors');
var tableSensorErrorHistory = $('#table-seh');

var trSensor = $('.tr-sensor');

var btnCSV = $('#btn-csv');

var checkGroupIds = $('[name="groupIds"]');
var checkGroupIdsAll = $('#check-groupIds-all');
var checkEnergySensorType = $('[name="energySensorType"]');
var checkEnvSensorType = $('[name="envSensorType"]');
var checkSensorIdsAll = $('#check-sensorIds-all');
var checkSensorIds = $('[name="sensorIds"]');
var checkSensorIdsEnergyAll = $('.check-energy');
var checkSensorIdsEnvAll = $('.check-env');

var selectDisplaySpan = $('[name="displaySpan"]');

var textRangeDate = $('#rangeDate');


var startDate = fbStartDate;
var endDate = fbEndDate;

var updateOptions = {};
var tableColumns;
var tableData;

//***** behavior
checkGroupIdsAll.change(function(){
	
	checkGroupIds.prop('checked', this.checked);
	setSensorVisibility();
});

checkGroupIds.change(function(){
	
	var checkedLen = checkGroupIds.filter(':checked').length;
	if(checkedLen == checkGroupIds.length)
		checkGroupIdsAll.prop('checked', true);
	else
		checkGroupIdsAll.prop('checked', false);
	
	setSensorVisibility();
});

checkEnergySensorType.change(setSensorVisibility);

checkEnvSensorType.change(setSensorVisibility);

checkSensorIdsAll.change(function(){
	checkSensorIds.filter(':visible').prop('checked', this.checked);
});

checkSensorIds.change(function(){

	var visibleSensorLen = checkSensorIds.filter(':visible').length;
	var checkedSensorLen = checkSensorIds.filter(':visible:checked').length;
	
	if(visibleSensorLen == checkedSensorLen)
		checkSensorIdsAll.prop('checked', true);
	else
		checkSensorIdsAll.prop('checked', false);
});

btnCSV.click(function(){
	
	if(updateOptions.sensorIds != null){
		
		var url = "/zeuschart/SensorErrorHistory/GetSensorErrorHistoryCSV.do";
	    var form = $("<form></form>").attr("action", url).attr("method", "post");
	    form.append($("<input></input>").attr("type", "hidden").attr("name", "startDate").attr("value", updateOptions.startDate));
	    form.append($("<input></input>").attr("type", "hidden").attr("name", "endDate").attr("value", updateOptions.endDate));
	    form.append($("<input></input>").attr("type", "hidden").attr("name", "sensorIds").attr("value", updateOptions.sensorIds));
	    form.appendTo('body').submit().remove();
	}
});

tableSeh.click(function(){
	window.open(contextPath + 'large/sensorErrorHistory/Large.jsp');
});
//_____ behavior

//******************** functions
//***** グループとセンサータイプチェックにより、センサー表示/非表示を設定
function setSensorVisibility(){
	
	var trShowArr = [];
	var checkShowArr = [];
	var trHideArr = [];
	var checkHideArr = [];

	if(checkGroupIds.length > 0){
		
		var trFilterStr, checkFilterStr;
		for(var i = 0; i < checkGroupIds.length; i++){
			
			for(var j = 0; j < checkEnergySensorType.length; j++){
				
				trFilterStr = '.tr-' + checkGroupIds[i].value + '.tr-energy-' + checkEnergySensorType[j].value;
				checkFilterStr = '.check-' + checkGroupIds[i].value + '.check-energy-' + checkEnergySensorType[j].value;
				if(checkGroupIds[i].checked && checkEnergySensorType[j].checked){
					
					trShowArr.push(trFilterStr);
					checkShowArr.push(checkFilterStr);
				}else{
					
					trHideArr.push(trFilterStr);
					checkHideArr.push(checkFilterStr);
				}
			}
			
			for(var j = 0; j < checkEnvSensorType.length; j++){
				
				trFilterStr = '.tr-' + checkGroupIds[i].value + '.tr-env-' + checkEnvSensorType[j].value;
				checkFilterStr = '.check-' + checkGroupIds[i].value + '.check-env-' + checkEnvSensorType[j].value;
				if(checkGroupIds[i].checked && checkEnvSensorType[j].checked){
					
					trShowArr.push(trFilterStr);
					checkShowArr.push(checkFilterStr);
				}else{
					
					trHideArr.push(trFilterStr);
					checkHideArr.push(checkFilterStr);
				}
			}
		}
	}else{
		
		for(var j = 0; j < checkEnergySensorType.length; j++){
			
			trFilterStr = '.tr-energy-' + checkEnergySensorType[j].value;
			checkFilterStr = '.check-energy-' + checkEnergySensorType[j].value;
			if(checkEnergySensorType[j].checked){
				
				trShowArr.push(trFilterStr);
				checkShowArr.push(checkFilterStr);
			}else{
				
				trHideArr.push(trFilterStr);
				checkHideArr.push(checkFilterStr);
			}
		}
		
		for(var j = 0; j < checkEnvSensorType.length; j++){
			
			trFilterStr = '.tr-env-' + checkEnvSensorType[j].value;
			checkFilterStr = '.check-env-' + checkEnvSensorType[j].value;
			if(checkEnvSensorType[j].checked){
				
				trShowArr.push(trFilterStr);
				checkShowArr.push(checkFilterStr);
			}else{
				
				trHideArr.push(trFilterStr);
				checkHideArr.push(checkFilterStr);
			}
		}
	}
	
	for(var i = 0; i < checkShowArr.length; i++)
		checkSensorIds.filter(checkShowArr[i]).prop('disabled', false);
	for(var i = 0; i < trShowArr.length; i++)
		trSensor.filter(trShowArr[i]).show();
	
	for(var i = 0; i < trHideArr.length; i++)
		trSensor.filter(trHideArr[i]).hide();
	for(var i = 0; i < checkHideArr.length; i++)
		checkSensorIds.filter(checkHideArr[i]).prop('disabled', true);
	
	var visibleSensorLen = trSensor.filter(':visible').length;
	if(visibleSensorLen == 0){
		
		checkSensorIdsAll.prop('checked', false);
		checkSensorIdsAll.prop('disabled', true);
	}else{
		
		checkSensorIdsAll.prop('disabled', false);
		
		var checkedSensorLen = checkSensorIds.filter(':visible:checked').length;
		if(checkedSensorLen == visibleSensorLen)
			checkSensorIdsAll.prop('checked', true);
		else
			checkSensorIdsAll.prop('checked', false);
	}
}
//_____ グループとセンサータイプチェックにより、センサー表示/非表示を設定

//***** 一定期間を設けてデータを更新
function updateData(){
	
	$.ajax({
		url: '/zeuschart/SensorErrorHistory/GetSensorErrorHistoryRealtime.do',
		type: 'POST',
		async: true,
		cache: false,
		data: updateOptions,
		success: function(response){
			
			var respObj = JSON.parse(response);
			if(respObj.columns != null){
				
				tableColumns = respObj.columns;
				tableData = respObj.data;
				
				// データテーブル
				tableSeh.bootstrapTable('destroy').bootstrapTable({
					fixedColumns: true,
					fixedNumber: 1,
					striped: false,
					height: 500,
					columns: tableColumns,
					data: tableData
				});
				
				$('.fixed-table-header-columns').find('th').height(tableSeh.find('th').height());
				
				if(updateOptions.optionChangeInterval == null)
					updateOptions.optionChangeInterval = setInterval(optionChangeListener, 10000);
				
				updateOptions.init = false;
			}else{
				
				tableData.pop();
				tableData.unshift(respObj.data);
				
				tableSeh.bootstrapTable('load', tableData);
			}
		},
		error: function(){
			
			console.log('refresh json error');
			tableSeh.bootstrapTable('destroy');
		}
	});
}
//_____ 一定期間を設けてデータを更新

function optionChangeListener() {
	
	var updateUserOptions = {};
	var changed = false;
	// display span
	if(updateOptions.displaySpan != selectDisplaySpan.val()){
		
		updateUserOptions.displaySpan = 'sensor_error_history_display_span=' + selectDisplaySpan.val();
		updateOptions.displaySpan = selectDisplaySpan.val();
		changed = true;
	}
	// 期間
	if(updateOptions.startDate != startDate || updateOptions.endDate != endDate){
		
		changed = true;
		updateOptions.startDate = startDate;
		updateOptions.endDate = endDate;
	}
	// グループ
	if(checkGroupIds.length > 0){
		
		var checkedGroupStr;
		var checkedGroup = checkGroupIds.filter(':checked');
		if(checkedGroup.length > 0)
			checkedGroupStr = checkedGroup.map(function(){
				return this.value;
			}).get().join(',');
		if(updateOptions.groupIds != checkedGroupStr){
			
			changed = true;
			updateUserOptions.groupIds = 'sensor_error_history_group_ids=' + (checkedGroupStr == null? 'null': "'" + checkedGroupStr + "'");
			updateOptions.groupIds = checkedGroupStr;
		}
	}
	// エネルギーセンサータイプ
	var checkedEnergySensorTypeStr;
	var checkedEnergySensorType = checkEnergySensorType.filter(':checked');
	if(checkedEnergySensorType.length > 0)
		checkedEnergySensorTypeStr = checkedEnergySensorType.map(function(){
			return this.value;
		}).get().join(',');
	if(updateOptions.energySensorType != checkedEnergySensorTypeStr){
		
		changed = true;
		updateUserOptions.energySensorType = 'sensor_error_history_energy_sensor_type=' + (checkedEnergySensorTypeStr == null? 'null': "'" + checkedEnergySensorTypeStr + "'");
		updateOptions.energySensorType = checkedEnergySensorTypeStr;
	}
	// 環境センサータイプ
	var checkedEnvSensorTypeStr;
	var checkedEnvSensorType = checkEnvSensorType.filter(':checked');
	if(checkedEnvSensorType.length > 0)
		checkedEnvSensorTypeStr = checkedEnvSensorType.map(function(){
			return this.value;
		}).get().join(',');
	if(updateOptions.envSensorType != checkedEnvSensorTypeStr){
		
		changed = true;
		updateUserOptions.envSensorType = 'sensor_error_history_env_sensor_type=' + (checkedEnvSensorTypeStr == null? 'null': "'" + checkedEnvSensorTypeStr + "'");
		updateOptions.envSensorType = checkedEnvSensorTypeStr;
	}
	// sensorIdsAll
	var checkedAllStr;
	var checkedAll = checkSensorIds.filter(':checked');
	if(checkedAll.length > 0)
		checkedAllStr = checkedAll.map(function(){
			return this.value;
		}).get().join(',');
	if(updateOptions.sensorIdsAll != checkedAllStr){
		
		updateUserOptions.sensorIds = 'sensor_error_history_sensor_ids=' + (checkedAllStr == null? 'null': "'" + checkedAllStr + "'");
		updateOptions.sensorIdsAll = checkedAllStr;
	}
	// sensorIds
	var visibleCheckedStr;
	var visibleChecked = checkSensorIds.filter(':visible:checked');
	if(visibleChecked.length > 0)
		visibleCheckedStr = visibleChecked.map(function(){
			return this.value;
		}).get().join(',');
	if(updateOptions.sensorIds != visibleCheckedStr){
		
		changed = true;
		updateOptions.sensorIds = visibleCheckedStr;
	}

	if(JSON.stringify(updateUserOptions) != '{}'){
		
		$.ajax({
			url: contextPath + 'Ajax/User/UpdateOption.action',
			type: 'POST',
			async: true,
			cache: false,
			data: updateUserOptions,
			success: function(response){
				console.log('update user options success');
			},
			error: function(){
				console.log('update user options failed');
			}
		});
	}
	
	if(changed)
		updateOptions.init = true;
	
	if(updateOptions.sensorIds == null) {
		
		clearInterval(updateOptions.updateDataInterval);
		tableSeh.bootstrapTable('destroy');
	}else{
	
		if(updateOptions.init){
			
			clearInterval(updateOptions.updateDataInterval);
			clearInterval(updateOptions.optionChangeInterval);
			delete updateOptions.optionChangeInterval;
			delete updateOptions.maxDate;
			
			if(updateOptions.sensorIds != null){
				
				updateData();
				updateOptions.updateDataInterval = setInterval(updateData, updateOptions.updateFrequency);
			}
		}else{

			if(!updateOptions.init)
				updateOptions.maxDate = tableData[0].datetime;
		}
	}
}

function datetimeColumnStyle(){
	
	return {
		classes: 'td-with-bg',
		css: {'min-width': '140px'}
	};
}

function headColumnStyle() {
	
	return {
		css: {'min-width': '80px'}
	};
}
//____________________ functions

//******************** init
//***** 更新パラメーター初期化
// 表示期間
updateOptions.displaySpan = selectDisplaySpan.val();
// グループ
if(checkGroupIds.length > 0){
	
	var checkedGroup = checkGroupIds.filter(':checked');
	if(checkedGroup.length > 0)
		updateOptions.groupIds = checkedGroup.map(function(){
			return this.value;
		}).get().join(',');
	
	if(checkedGroup.length == checkGroupIds.length)
		checkGroupIdsAll.prop('checked', true);
	else
		checkGroupIdsAll.prop('checked', false);
}
// エネルギーセンサータイプ
var checkedEnergySensorType = checkEnergySensorType.filter(':checked');
if(checkedEnergySensorType.length > 0)
	updateOptions.energySensorType = checkedEnergySensorType.map(function(){
		return this.value;
	}).get().join(',');
// 環境センサータイプ
var checkedEnvSensorType = checkEnvSensorType.filter(':checked');
if(checkedEnvSensorType.length > 0)
	updateOptions.envSensorType = checkedEnvSensorType.map(function(){
		return this.value;
	}).get().join(',');
// チェックされたセンサー
var checkedSensorIds = checkSensorIds.filter(':checked');
if(checkedSensorIds.length > 0){
	
	updateOptions.sensorIdsAll = checkedSensorIds.map(function(){
		return this.value;
	}).get().join(',');
}
// 更新頻度
updateOptions.updateFrequency = 60 * 1000;
updateOptions.startDate = startDate;
updateOptions.endDate = endDate;
updateOptions.init = true;
//_____ 更新パラメーター初期化

//***** 期間初期化
textRangeDate.daterangepicker(
	{
		timePicker: true,
		timePicker24Hour: true,
		startDate: startDate,
		endDate: endDate,
		opens: 'center',
		autoUpdateInput: true,
		locale: {
			format: 'YYYY-MM-DD HH:mm',
			applyLabel: "確定",
			cancelLabel: 'キャンセル'
		}
    },
    function (start, end, label) {
    	
    	startDate = start.format('YYYY-MM-DD HH:mm');
    	endDate = end.format('YYYY-MM-DD HH:mm');
    }
);
//_____ 期間初期化

//***** センサーテーブル初期化
tableSensors.removeClass('hide');
setSensorVisibility();
//_____ センサーテーブル初期化

var visibleCheckedSensor = checkSensorIds.filter(':visible:checked');
if(visibleCheckedSensor.length > 0)
	updateOptions.sensorIds = visibleCheckedSensor.map(function(){
		return this.value;
	}).get().join(',');

optionChangeListener();
updateOptions.optionChangeInterval = setInterval(optionChangeListener, 10000);
//_________________________ init