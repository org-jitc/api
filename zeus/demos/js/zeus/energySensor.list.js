var sensorTables = $('.sensor-table');
var checkGroupAll = $('#checkGroupAll');
var checkGroup = $('.electricGroup');
var alertBattery = $('.alert');

var energySensorIds = reqEnergySensorIds;
var checkedGroupIds = null;
var updateFrequency = 10000;

//***** グループチェック動作
if(reqHasGroup) {
	
	checkGroup.change(function() {
		
		var item = $(this);
		var groupItems = $('[data-groupId="' + item.val() + '"]');
		if(item.prop('checked'))
			groupItems.show();
		else
			groupItems.hide();
		
		var displayedTable = sensorTables.filter(':visible');
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

function getElectRealTimeData(){

	if(energySensorIds != ''){

		$.ajax({
			url: contextPath + 'Ajax/EnergySensor/RealtimeData.action',
			data: {energySensorIds: energySensorIds},
		   	async: true,
		   	success: getElectRealTimeDataComplete,
		   	error: function(){
		   		setTimeout(getElectRealTimeData, updateFrequency);
		   	}
		});
	}
}

function getElectRealTimeDataComplete(response){

	var valueStr = null;
	var resObj = JSON.parse(response);
	for(var sensorId in resObj){
		
		var sensorObj = resObj[sensorId];
		// attr[i]
		for(var i = 1; i <= 5; i++){
			
			var attr = sensorObj['attr' + i];
			if(attr != null){
				
				valueStr = '';
				valueStr += attr.key + ': ';
				
				if(attr.value != null && attr.value != '-'){
					
					if(attr.valueBefore != null)
						valueStr += attr.valueBefore;
					valueStr += attr.value;
					if(attr.valueAfter != null)
						valueStr += attr.valueAfter;
					valueStr += ' ' + attr.unit;
				}else
					valueStr += '-';
			}else
				valueStr = "&nbsp;"
			$('#' + sensorId + '_attr' + i).html(valueStr);
		}
	}
	
	setTimeout(getElectRealTimeData, updateFrequency);
}

//********************電池交換日関連
//日付コンポーネントの初期化オプションパラメータ
$('.batteryExchange').datepicker(datePickerOptions);

$('.batteryExchange').datepicker().on('changeDate', function(){
	
    var element = $(this);
    var sensorId = element.prop('id');
    var datetime = element.datepicker('getFormattedDate');
    
    $('#sensorIdHidden').val(sensorId);
    $('#batteryExchangeDateConfirmSpan').html(datetime);
    $('#batteryExchangeInsertConfirmModal').modal('show');
});
//＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿電池交換日関連

function saveGroupChecked(){
	
	// グループのチェック状態を保存
	var currentCheckedGroupIds;
	var checkedGroup = $('.electricGroup:checked');
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
		
		var param = {
			checkedGroupIds: 'elect_group_ids='
		};
		if(currentCheckedGroupIds != null)
			param.checkedGroupIds += "'" + currentCheckedGroupIds + "'";
		else
			param.checkedGroupIds += 'null';
		
		$.ajax({
			url: contextPath + 'Ajax/User/UpdateOption.action',
		   	async: true,
		   	cache: false,
			data: param,
		   	error: function(){
				console.log('checked group ids update error.');		   		
		   	}
		});
		
		checkedGroupIds = currentCheckedGroupIds;
	}
}

function SetSensorOrder(){
	
	let btnSetOrder = document.querySelector('#btn-setSensorOrder');
	let ulEnergySensor = document.querySelector('#ul-energy-sensor');
	let btnSaveOrder = document.querySelector('#btn-saveSensorOrder');
	let modalSetOrder = $('#modal-setOrder');
	
	let orderData;
	
	btnSetOrder.onclick = function(){
		
		if(orderData == null){
			
			$.ajax({
				url: contextPath + 'Ajax/EnergySensor/GetSensorOrderAll.action',
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
							
							ulEnergySensor.appendChild(li);
						}
						
						$(ulEnergySensor).sortable();
					}else
						alert('登録されているエネルギーセンサーがありません。');
					
					modalSetOrder.modal('show');
				},
				error: function(){
					alert('センサー情報が取得できませんでした。');
				}
			});
		}else
			modalSetOrder.modal('show');
	}
	
	btnSaveOrder.onclick = function(){
		
		let childs = ulEnergySensor.children;
		if(childs.length > 0){
			
			let dataObj = {};
			for(let i = 0, l = childs.length; i < l; i++)
				dataObj[childs[i].getAttribute('data-sensorid')] = i;
			
			$.ajax({
				url: contextPath + 'Ajax/EnergySensor/SaveSensorOrder.action',
				async: true,
				cache: false,
				type: 'POST',
				data: {data: JSON.stringify(dataObj)},
				success: function(resp){
					
					let respObj = JSON.parse(resp);
					if(respObj.error != null)
						alert('同期サーバーに接続できないため，処理できませんでした。');
					else
						document.location.href = 'ElectricEnergySensorList.do'
				}
			});
		}else
			alert('登録されているセンサーがありません。');
	}
}

//******************** init
if(!reqCheckedGroupEmpty)
	checkedGroupIds = reqCheckedGroup;
	
alertBattery.hide();

//***** 表示センサーグループ分け作業
if(reqHasGroup) {
	
	if(energySensorIds != null) {
		
		var sensors = sensorTables.filter('[data-groupId!="GR0000"]');
		sensors.each(function(){
			$('#' + $(this).attr('data-groupId')).append(this);
		});
	}
	
	checkGroup.each(function() {
		$(this).change();
	});
	
	setInterval(saveGroupChecked, 1000);
}
//===== 表示センサーグループ分け作業

//==> get battery exchange log
if(energySensorIds != null && energySensorIds != '')
	getBatteryExchangeDateLogAll(energySensorIds);
//<== get battery exchange log

//==> get realtime data
if(energySensorIds != null && energySensorIds != '')
	getElectRealTimeData();
//<== get realtime data

//==> init set order modual
new SetSensorOrder();
//==================== init