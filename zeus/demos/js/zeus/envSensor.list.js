var sensorTables = $('.sensor-table');
var checkGroupAll = $('#checkGroupAll');
var checkGroup = $('.envGroup');
var alert = $('.alert');
var btnBatteryExchange = $('.batteryExchange');
var tdTypeTemp = $('.type-temp');

var tempIds = reqTempSensorIds;
var updateFrequency = 10000;
var checkedGroupIds = null;
var hasGroup = checkGroup.length > 0;

//******************** functions
//***** グループチェック動作
if(hasGroup){
	
	checkGroup.change(function() {
		
		var item = $(this);
		var groupItems = $('[data-groupId="' + item.val() + '"]');
		if(item.prop('checked'))
			groupItems.show();
		else
			groupItems.hide();
		
		var displayedTable = checkGroup.filter(':checked');
		if(displayedTable.length == 0)
			ListShowHide.hideAll();
		else
			ListShowHide.showAll();
		
		if(checkGroup.filter(':checked').length == checkGroup.length)
			checkGroupAll.prop('checked', true);
		else
			checkGroupAll.prop('checked', false);
	});
	
	checkGroupAll.change(function(){
		
		checkGroup.prop('checked', this.checked);
		
		checkGroup.each(function(){
			$(this).change();
		});
	});
}
//===== グループチェック動作

function getRealTimeData(){

	if(tempIds != ''){

		$.ajax({
			url: '/zeuschart/EnvSensor/Realtime.do',
		   	async: true,
		   	cache: false,
			data: {tempIds: tempIds},
		   	success: getRealTimeDataComplete,
		   	error: function(){
		   		setTimeout(getRealTimeData, updateFrequency);
		   	}
		});
	}
}

function getRealTimeDataComplete(response){

	var resObj = JSON.parse(response);

	for(var tempId in resObj){

		var currentValue = resObj[tempId].currentValue;
		var voltage = resObj[tempId].voltage;

		var innerText;
		if(currentValue != null)
			$('#' + tempId + '_current').html(currentValue.key + ': ' + (currentValue.value == null? '-': currentValue.value));

		if(voltage != null)
			$('#' + tempId + '_current_voltage').html(voltage.key + ': ' + (voltage.value == null? '-': voltage.value));
	}
	
	setTimeout(getRealTimeData, updateFrequency);
}

tdTypeTemp.popover({
	trigger: 'hover',
	placement: 'bottom',
	content: '温度 | 湿度 | 不快指数'
});

//********************電池交換日関連
//日付コンポーネントの初期化オプションパラメータ
btnBatteryExchange.datepicker(datePickerOptions);
btnBatteryExchange.datepicker().on('changeDate', function() {
	
  var element = $(this);
  var sensorId = element.prop('id');
  var datetime = element.datepicker('getFormattedDate');
  
  $('#sensorIdHidden').val(sensorId);
  $('#batteryExchangeDateConfirmSpan').html(datetime);
  
  $('#batteryExchangeInsertConfirmModal').modal('show');
});

function saveGroupChecked(){
	
	// グループのチェック状態を保存
	var currentCheckedGroupIds;
	var checkedGroup = $('.envGroup:checked');
	if(checkedGroup.length > 0){
		
		for(var i = 0; i < checkedGroup.length; i++){
			
			if(currentCheckedGroupIds == null)
				currentCheckedGroupIds = $(checkedGroup[i]).val();
			else
				currentCheckedGroupIds += ',' + $(checkedGroup[i]).val();
		}
	}
	
	var isChanged = false;
	if(checkedGroupIds == null){
		
		if(currentCheckedGroupIds != null)
			isChanged = true;
	}else{
		
		if(currentCheckedGroupIds == null)
			isChanged = true;
		else{
			
			if(checkedGroupIds != currentCheckedGroupIds)
				isChanged = true;
		}
	}
	
	if(isChanged){
		
		var param = {};
		if(currentCheckedGroupIds != null)
			param.checkedGroupIds = currentCheckedGroupIds;
		
		$.ajax({
			url: contextPath + 'Ajax/EnvSensor/UpdateUserCheckedGroup.action',
		   	async: true,
		   	cache: false,
			data: param,
			success: function(resp){
				
				let respObj = JSON.parse(resp);
				if(respObj.error != null)
					console.log('update failed: ' + respObj.error);
			},
		   	error: function(){
				console.log('update failed');		   		
		   	}
		});
		
		checkedGroupIds = currentCheckedGroupIds;
	}
}

function SetSensorOrder(){
	
	let btnSetOrder = document.querySelector('#btn-setSensorOrder');
	let ulSensor = document.querySelector('#ul-env-sensor');
	let btnSaveOrder = document.querySelector('#btn-saveSensorOrder');
	let modalSetOrder = $('#modal-setOrder');
	
	let orderData;
	
	btnSetOrder.onclick = function(){
		
		if(orderData == null){
			
			$.ajax({
				url: contextPath + 'Ajax/EnvSensor/GetSensorOrderAll.action',
				async: true,
				cache: false,
				success: function(resp){
					
					let respObj = JSON.parse(resp);
					if(respObj.data != null){
						
						orderData = respObj.data;
						
						let li, liHeader, liText, span, sensorName;
						
						for(var i in respObj.data){
							
							li = document.createElement('li');
							li.setAttribute('class', 'list-group-item');
							li.setAttribute('data-sensorId', respObj.data[i].sensorId);
							
							liHeader = document.createElement('div');
							liHeader.setAttribute('class', 'list-group-item-heading d-flex justify-content-between font-weight-bold');
							span = document.createElement('small');
							span.innerText = 'センサー名';
							liHeader.appendChild(span);
							span = document.createElement('small');
							span.innerText = 'センサータイプ';
							liHeader.appendChild(span);
							li.appendChild(liHeader);
							
							liText = document.createElement('div');
							liText.setAttribute('class', 'list-group-item-text d-flex justify-content-between');
							span = document.createElement('span');
							span.innerText = respObj.data[i].sensorName;
							liText.appendChild(span);
							span = document.createElement('span');
							if(respObj.data[i].sensorTypeName != null)
								span.innerText = respObj.data[i].sensorTypeName;
							liText.appendChild(span);
							li.appendChild(liText);
							
							ulSensor.appendChild(li);
						}
						
						$(ulSensor).sortable();
					}else
						alert('登録されている環境センサーがありません。');
					
					modalSetOrder.modal('show');
				},
				error: function(){
					alert('環境センサー情報が取得できませんでした。');
				}
			});
		}else
			modalSetOrder.modal('show');
	}
	
	btnSaveOrder.onclick = function(){
		
		let childs = ulSensor.children;
		if(childs.length > 0){
			
			let dataObj = {};
			for(let i = 0, l = childs.length; i < l; i++)
				dataObj[childs[i].getAttribute('data-sensorid')] = i;
			
			$.ajax({
				url: contextPath + 'Ajax/EnvSensor/SaveSensorOrderAll.action',
				async: true,
				cache: false,
				type: 'POST',
				data: {data: JSON.stringify(dataObj)},
				success: function(resp){
					
					let respObj = JSON.parse(resp);
					if(respObj.error != null)
						alert('同期サーバーに接続できないため，処理できませんでした。');
					else
						document.location.href = 'TemperatureSensorList.do'
				}
			});
		}else
			alert('登録されている環境センサーがありません。');
	}
}
//==================== functions

//******************** init
alert.hide();
if(reqCheckedGroup != '')
	checkedGroupIds = reqCheckedGroup;

if(hasGroup){
	
	//***** 表示センサーグループ分け作業
	if(tempIds != null) {
		
		sensorTables.each(function() {
			$('#' + $(this).attr('data-groupId')).append(this);
		});
	}
	//===== 表示センサーグループ分け作業
	
	//***** グループチェック動作初期処理
	checkGroup.each(function() {
		$(this).change();
	});
	//===== グループチェック動作初期処理
	setInterval(saveGroupChecked, 1000);
}

//==> get battery exchange log
if(tempIds != null && tempIds != '')
	getBatteryExchangeDateLogAll(tempIds);
//<== get battery exchange log

//***** リアルタイムデータ取得
if(tempIds != '')
	getRealTimeData();
//===== リアルタイムデータ取得

//==> set sensor order module initialization
new SetSensorOrder();
//==================== init