var divErrMsg = $('#div-errMsg');

var tableSensors = $('#table-sensors');

var trSensor = $('.tr-sensor');

var checkGroupIdsAll = $('#check-groupIds-all');
var checkGroupIds = $('[name="groupIds"]');
var checkSensorIdsAll = $('#check-sensorIds-all');
var checkSensorIds = $('[name="sensorIds"]');

var textStartDate = $('#text-startDate');

var imgGraph = $('#img-graph');

var updateParam = {};

function BatteryStatus(){
	
	var dateRangePicker = {
		language: sysLanguage,
		format: 'yyyy-mm-dd',
		autoclose: true,
		todayBtn: 'linked',
		todayHighlight: true
	};
	
	var btnGraph = $('#btn-graph');
	var divDateRange = $('.input-daterange');
	var textStartDate = $('#text-startDate');
	var textEndDate = $('#text-endDate');
	var linkBatteryExchangeDate = $('.a-battery-exchange-date');
	
	textStartDate.val(fbStartDate);
	textEndDate.val(fbEndDate);
	divDateRange.datepicker(dateRangePicker);
	
	linkBatteryExchangeDate.click(function(){
		
		var item = $(this);
		textStartDate.val(item.attr('data-date'));
		divDateRange.datepicker('destroy').datepicker(dateRangePicker);
	});
	
	btnGraph.click(function(){
		
		divErrMsg.html('');
		imgGraph.attr('src', '');
		// startDate
		var startDate = textStartDate.val();
		// endDate
		var endDate = textEndDate.val();
		// checked sensor ids
		var checkedIds = checkSensorIds.filter(':visible:checked').map(function(){
			return this.value;
		}).get().join(',');
		
		if(startDate == '' || endDate == '' || checkedIds == ''){
			
			if(startDate == '' || endDate == ''){
				
				var p = $('<div></div>');
				p.append('期間を選択してください。');
				divErrMsg.append(p);
			}
			
			if(checkedIds == ''){
				
				var p = $('<div></div>');
				p.append('センサーを選択してください。');
				divErrMsg.append(p);
			}
			
			return;
		}else{
			
			var startMoment = moment(startDate);
			var endMoment = moment(endDate);
			
			var diff = startMoment.diff(endMoment);
			if(diff > 0){
				
				var p = $('<div></div>');
				p.append('期間が不正です。');
				divErrMsg.append(p);
				
				return;
			}
		}
		
		updateParam.startDate = startDate;
		updateParam.endDate = endDate;
		updateParam.sensorIds = checkedIds;
		btnGraph.button('loading');
		
		$.ajax({
			url: '/zeuschart/BatteryStatus/graph/url.do',
			type: 'POST',
			async: true,
			cache: false,
			data: updateParam,
			success: function(response){
				
				imgGraph.show();
				imgGraph.attr('src', response);
				btnGraph.button('reset');
			},
			error: function(){
				console.log('get battery status graph error.');
				btnGraph.button('reset');
			}
		});
	});
}
var batteryStatus = new BatteryStatus();

//******************** events
checkGroupIdsAll.change(function(){
	
	checkGroupIds.prop('checked', this.checked);
	setSensorVisibility();
});

checkGroupIds.change(function(){
	
	setSensorVisibility();
	
	var checkedGroupLen = checkGroupIds.filter(':checked').length;
	
	if(checkedGroupLen == 0)
		checkGroupIdsAll.prop('checked', false);
	else{
		
		var groupLen = checkGroupIds.length;
		if(groupLen == checkedGroupLen)
			checkGroupIdsAll.prop('checked', true);
		else
			checkGroupIdsAll.prop('checked', false);
	}
});

checkSensorIdsAll.change(function(){
	checkSensorIds.filter(':visible').prop('checked', this.checked);
});

checkSensorIds.change(function(){
	
	var checkedSensorLen = checkSensorIds.filter(':visible:checked').length;
	
	if(checkedSensorLen == 0)
		checkSensorIdsAll.prop('checked', false);
	else{
		
		var sensorLen = checkSensorIds.filter(':visible').length;
		if(sensorLen == checkedSensorLen)
			checkSensorIdsAll.prop('checked', true);
		else
			checkSensorIdsAll.prop('checked', false);
	}
});
//____________________ events

//******************** functions
function setSensorVisibility(){
	
	var trShowArr = [];
	var checkShowArr = [];
	var trHideArr = [];
	var checkHideArr = [];

	if(checkGroupIds.length > 0){
		
		var trFilterStr, checkFilterStr;
		for(var i = 0; i < checkGroupIds.length; i++){
			
			trFilterStr = '.tr-' + checkGroupIds[i].value;
			checkFilterStr = '.check-' + checkGroupIds[i].value;
			
			if(checkGroupIds[i].checked){
				
				trShowArr.push(trFilterStr);
				checkShowArr.push(checkFilterStr);
			}else{
				
				trHideArr.push(trFilterStr);
				checkHideArr.push(checkFilterStr);
			}
		}
	}else{
		
		trShowArr.push('.tr-');
		checkShowArr.push('.check-');
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
//____________________ functions

//******************** data access

//____________________ data access

//******************** init
tableSensors.removeClass('hide');
setSensorVisibility();
//____________________ init