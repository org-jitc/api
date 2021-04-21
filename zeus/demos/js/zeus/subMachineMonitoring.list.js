var tblSet = $('.tbl-set');

let divNetworkStatus = document.querySelectorAll('.network-status');
var nodeIds = null;
var inputIds = null;
var electIds = null;
var tempIds = null;
var demandIds = null;
var boxIds = null;

function updateSubCommStatus(){
	let paramData = {};
	
	if(nodeIds != null){
		paramData.nodeIds = nodeIds;
	}
	if(inputIds != null){
		paramData.inputIds = inputIds;
	}
	if(electIds != null){
		paramData.electIds = electIds;
	}
	if(tempIds != null){
		paramData.tempIds = tempIds;
	}
	if(demandIds != null){
		paramData.demandIds = demandIds;
	}
	if(boxIds != null){
		paramData.boxIds = boxIds;
	}
	
	$.ajax({
		url: contextPath + 'Ajax/SubMachineMonitoring/GetDisplayStatusAll.action',
		async: true,
		cache: false,
		type: 'post',
		data: paramData,
		success: function(response){
			let respObj = JSON.parse(response);
			
			if(respObj.error != null){
				console.log('error: sync server unreachable..');
				
				let statusDiv = $('.comm-status');
				statusDiv.css('color', 'red');
				statusDiv.html('-');
				// network
				let nsvSpan = $('.value');
				nsvSpan.addClass('error');
				nsvSpan.html('-');
			}else{
				// node
				if(nodeIds != null){
					let nodeArr = nodeIds.split(',');
					let statusDiv;
					
					for(var index in nodeArr){
						statusDiv = $('#subCommStatus' + nodeArr[index]);
						
						if(respObj.comm[nodeArr[index]] == 1){
							statusDiv.css('color', 'orange');
							statusDiv.html('OK');
						}else{
							statusDiv.css('color', '#808080');
							statusDiv.html('NG');
						}
					}
				}
				// input
				if(inputIds != null){
					let inputArr = inputIds.split(',');
					let statusDiv;
					
					for(var index in inputArr){
						statusDiv = $('#subCommStatus' + inputArr[index]);
						
						if(respObj.comm[inputArr[index]] == 1){
							statusDiv.css('color', 'orange');
							statusDiv.html('OK');
						}else{
							statusDiv.css('color', '#808080');
							statusDiv.html('NG');
						}
					}
				}
				// elect
				if(electIds != null){
					let electArr = electIds.split(',');
					let statusDiv;
					
					for(let index in electArr){
						statusDiv = $('#subCommStatus' + electArr[index]);
						
						if(respObj.comm[electArr[index]] == 1){
							statusDiv.css('color', 'orange');
							statusDiv.html('OK');
						}else{
							statusDiv.css('color', '#808080');
							statusDiv.html('NG');
						}
					}
				}
				// temp
				if(tempIds != null){
					
					var tempArr = tempIds.split(',');
					for(var index in tempArr){
						
						var statusDiv = $('#subCommStatus' + tempArr[index]);
						if(respObj.comm[tempArr[index]] == 1){
							
							statusDiv.css('color', 'orange');
							statusDiv.html('OK');
						}else{
							
							statusDiv.css('color', '#808080');
							statusDiv.html('NG');
						}
					}
				}
				// demand
				if(demandIds != null){
					
					var demandArr = demandIds.split(',');
					for(var index in demandArr){
						
						var statusDiv = $('#subCommStatus' + demandArr[index]);
						if(respObj.comm[demandArr[index]] == 1){
							
							statusDiv.css('color', 'orange');
							statusDiv.html('OK');
						}else{
							
							statusDiv.css('color', '#808080');
							statusDiv.html('NG');
						}
					}
				}
				//-> network status
				var nsvSpan = $('.value');
				nsvSpan.removeClass('error');
				let statusObj = respObj.networkStatus;
				if(statusObj != null && divNetworkStatus != null) {// ネットワーク状況データがある場合
					
					let div = null;
					let valuesArr = null;
					let valDiv = null;
					let key = null;
					let statusDataObj = null;
					for(let i = 0, l = divNetworkStatus.length; i < l; i++){
						
						div = divNetworkStatus[i];
						key = div.getAttribute('id');
						statusDataObj = statusObj[key];
						if(statusDataObj == null){
							
							valuesArr = div.querySelectorAll('.value');
							for(let j = 0, jl = valuesArr.length; j < jl; j++)
								valuesArr[j].innerText = '-';
						}else{
							
							//==> parentId
							valDiv = div.querySelector('#parentId');
							valDiv.innerText = statusDataObj.parentId == null? '-': statusDataObj.parentId;
							//==> strength
							valDiv = div.querySelector('#strength');
							valDiv.innerText = statusDataObj.strength == null? '-': statusDataObj.strength;
							//==> quality
							valDiv = div.querySelector('#quality');
							valDiv.innerText = statusDataObj.quality == null? '-': statusDataObj.quality;
							//==> retryCount
							valDiv = div.querySelector('#retryCount');
							valDiv.innerText = statusDataObj.retryCount == null? '-': statusDataObj.retryCount;
							//==> errorCount
							valDiv = div.querySelector('#errorCount');
							valDiv.innerText = statusDataObj.errorCount == null? '-': statusDataObj.errorCount;
						}
					}
					// 各ネットワークのボックスのネットワーク状況を順番に更新
				}else
					$('.value').html('-');
			}
			
			setTimeout(updateSubCommStatus, 5000);
		},
		error: function(){
			
			var statusDiv = $('.comm-status');
			statusDiv.css('color', 'red');
			statusDiv.html('-');
			
			// network
			var nsvSpan = $('.value');
			nsvSpan.addClass('error');
			nsvSpan.html('-');
			
			setTimeout(updateSubCommStatus, 5000);
		}
	});
}

function onSubMailStatusChange(mailStatus){
	let sensorIds;
	let item = $(mailStatus);
	// 全体チェックの場合はチェック状態によってsensorIdを取得
	if(item.hasClass('mail-switch-all')){
		let setId = item.attr('data-setid');
		var tbl = tblSet.filter('[data-setid="' + setId + '"]');
		
		var filtered;
		if(mailStatus.checked){
			filtered = tbl.find('.mail-switch').not(':checked');
		}else{
			filtered = tbl.find('.mail-switch').filter(':checked');
		}
		
		filtered.each(function(){
			
			if(sensorIds != null)
				sensorIds += ',';
			else
				sensorIds = '';
			sensorIds += $(this).attr('data-sensorid');
		});
	// 個別
	}else{
		sensorIds = item.attr('data-sensorid');
	}

	var status = 0;
	if(mailStatus.checked){
		status = 1;
	}
	
	// まず本来の値にする
	mailStatus.checked = !mailStatus.checked;
	$(mailStatus).data('bs.toggle').update(true);
	// 設定requestが成功したら新しい値に変更
	$.ajax({
		url: contextPath + '/Ajax/SubMachineMonitoring/MailNotificationSwitch.action',
		async: true,
		cache: false,
		type: 'post',
		data: {sensorId: sensorIds, status: status},
		item: mailStatus,
		success: function(response){
			
			let respObj = JSON.parse(response);
			if(respObj.error != null)
				console.log('error: sync server unreachable..');
			else{
				
				var _item = $(this.item);
				// 押したチェックをアップデート
				this.item.checked = !this.item.checked;
				_item.data('bs.toggle').update(true);
				// 全体チェックの場合
				if(_item.hasClass('mail-switch-all')){
					
					var allItem = this.item;
					var setId = _item.attr('data-setid');
					var tbl = tblSet.filter('[data-setid="' + setId + '"]');
					var mails = tbl.find('.mail-switch');
					mails.prop('checked', this.item.checked);
					
					mails.each(function(){
						$(this).data('bs.toggle').update(true);
					});
					// 個別OFFの場合全体もOFFにする
				}else{
					
					var setId = _item.attr('data-setid');
					var tbl = tblSet.filter('[data-setid="' + setId + '"]');
					var allItem = tbl.find('.mail-switch-all');
					
					if(!this.item.checked)
						allItem.prop('checked', false);
					else{
						
						// メール通知
						var uncheckedLen = tbl.find('.mail-switch').not(':checked').length;
						allItem.prop('checked', uncheckedLen == 0);
					}
					allItem.data('bs.toggle').update(true);
				}
			}
		},
		error: function(){
			console.log('set mail status error');
		}
	});
}

function onSubConnStatusChange(connStatus){
	
	var sensorIds;
	var item = $(connStatus);
	// 全体チェックの場合はチェック状態によってsensorIdを取得
	if(item.hasClass('conn-switch-all')){
		
		var setId = item.attr('data-setid');
		var tbl = tblSet.filter('[data-setid="' + setId + '"]');
		
		var filtered;
		if(connStatus.checked)
			filtered = tbl.find('.conn-switch').not(':checked');
		else
			filtered = tbl.find('.conn-switch').filter(':checked');
		
		filtered.each(function(){
			
			if(sensorIds != null)
				sensorIds += ',';
			else
				sensorIds = '';
			sensorIds += $(this).attr('data-sensorid');
		});
	// 個別
	}else
		sensorIds = item.attr('data-sensorid');
	
	var status = 0;
	if(connStatus.checked)
		status = 1;

	// まず本来の値にする
	connStatus.checked = !connStatus.checked;
	$(connStatus).data('bs.toggle').update(true);
	$.ajax({
		url: contextPath + 'Ajax/SubMachineMonitoring/ConnectionMonitoringSwitch.action',
		async: true,
		cache: false,
		type: 'post',
		data: {sensorId: sensorIds, status: status},
		item: connStatus,
		success: function(response){
			
			let respObj = JSON.parse(response);
			if(respObj.error != null)
				console.log('error: sync server unreachable');
			else{
				
				var _item = $(this.item);
				// 押したチェックをアップデート
				this.item.checked = !this.item.checked;
				_item.data('bs.toggle').update(true);
				// 全体チェックの場合
				if(_item.hasClass('conn-switch-all')){
					
					var allItem = this.item;
					var setId = _item.attr('data-setid');
					var tbl = tblSet.filter('[data-setid="' + setId + '"]');
					var conns = tbl.find('.conn-switch');
					conns.prop('checked', this.item.checked);
					
					conns.each(function(){
						$(this).data('bs.toggle').update(true);
					});
					// 個別OFFの場合全体もOFFにする
				}else{
					
					var setId = _item.attr('data-setid');
					var tbl = tblSet.filter('[data-setid="' + setId + '"]');
					var allItem = tbl.find('.conn-switch-all');
					
					if(!this.item.checked)
						allItem.prop('checked', false);
					else{
						
						// 接続
						var uncheckedLen = tbl.find('.conn-switch').not(':checked').length;
						allItem.prop('checked', uncheckedLen == 0);
					}
					allItem.data('bs.toggle').update(true);
				}
			}
		},
		error: function(){
			console.log('set connection status error');
		}
	});
}

function ButtonAddSchedule(){
	this.buttons = document.querySelectorAll('[data-toggle="addSchedule"]');
	// events
	for(let i = 0, l = this.buttons.length; i < l; i++){
		this.buttons[i].onclick = this.onclick;
	}
}
ButtonAddSchedule.prototype = {
	onclick: function(){
		modalScheduleInput.open(this.getAttribute('data-id'));
	}	
};

function ButtonUpdateSchedule(){
	this.buttons = document.querySelectorAll('[data-toggle="updateSchedule"]');
	// events
	if(this.buttons != null){
		
		for(let i = 0, l = this.buttons.length; i < l; i++){
			this.buttons[i].onclick = this.onclick;
		}
	}
}
ButtonUpdateSchedule.prototype = {
	// events
	onclick: function(){
		let scheduleId = this.getAttribute('data-schedule-id');
		modalScheduleInput.open(this.getAttribute('data-id'), objSchedules[scheduleId]);
	}
	// methods
}

function ButtonDeleteSchedule(){
	this.buttons = document.querySelectorAll('[data-toggle="deleteSchedule"]');
	// events
	if(this.buttons != null){
		
		for(let i = 0, l = this.buttons.length; i < l; i++){
			this.buttons[i].onclick = this.onclick;
		}
	}
}
ButtonDeleteSchedule.prototype = {
	// events
	onclick: function(){
		modalScheduleDelete.open(this.getAttribute('data-schedule-id'));
	}
	// methods
}

function SubMachineSchedules(){
	this.toggles = document.querySelectorAll('[name="toggleSchedule"]');
	
	if(this.toggles != null){
		
		for(let i = 0, l = this.toggles.length; i < l; i++){
			this.toggles[i].onchange = this.onToggle;
		}
	}
}
SubMachineSchedules.prototype = {
	// events
	onToggle: function(){
		this.checked = !this.checked;
		$(this).data('bs.toggle').update(true);
		$(this).bootstrapToggle('disable');
		
		$.ajax({
			url: contextPath + 'Rest/SubMachineMonitoringSchedule/Switch.action',
			async: true,
			cache: false,
			method: 'POST',
			data: {
				scheduleId: this.getAttribute('data-schedule-id'),
				controlTarget: this.checked? 0: 1
			},
			toggle: this
		})
		.done(function(resp, status, xhr){
			$(this.toggle).bootstrapToggle('enable');
			let objResp = JSON.parse(resp);
			
			if(objResp.result === 'ok'){
				this.toggle.checked = !this.toggle.checked;
				$(this.toggle).data('bs.toggle').update(true);
			}else{
				popupError.setMessage(objResp.error.message);
			}
		})
		.fail(function(xhr, status, error){
			$(this.toggle).bootstrapToggle('enable');
			popupError.setMessage('エラーが発生しました。');
		})
	},
	// methods
}

function ModalScheduleInput(selector){
	this.modal = document.querySelector(selector);
	// sub machine id
	this.subMachineId = document.querySelector('#subMachineId');
	// schedule id
	this.scheduleId = document.querySelector('#scheduleId');
	// device setting
	this.divErrorSensor = document.querySelector('#divErrorSensor');
	this.allSensor = new ZeusRadio({name: 'allSensor', onchange: this.onAllSensorChange.bind(this), isCallOnChange: false});
	this.sensor = null;
	this.divSensorList = document.querySelector('#divSensorList');
	// month setting
	this.divErrorMonth = document.querySelector('#divErrorMonth');
	this.allMonth = new ZeusRadio({name: 'allMonth', onchange: this.onAllMonthChange.bind(this), isCallOnChange: false});
	this.month = new ZeusCheckbox({name: 'month', onchange: this.onMonthChange.bind(this)});
	// day setting
	this.divErrorDay = document.querySelector('#divErrorDay');
	this.allDay = new ZeusRadio({name: 'allDay', onchange: this.onAllDayChange.bind(this), isCallOnChange: false});
	this.day = new ZeusCheckbox({name: 'day', onchange: this.onDayChange.bind(this)});
	// hour setting
	this.divErrorHour = document.querySelector('#divErrorHour');
	this.allHour = new ZeusRadio({name: 'allHour', onchange: this.onAllHourChange.bind(this), isCallOnChange: false});
	this.hour = new ZeusCheckbox({name: 'hour', onchange: this.onHourChange.bind(this)});
	// minute setting
	this.divErrorMinute = document.querySelector('#divErrorMinute');
	this.allMinute = new ZeusRadio({name: 'allMinute', onchange: this.onAllMinuteChange.bind(this), isCallOnChange: false});
	this.minute = new ZeusCheckbox({name: 'minute', onchange: this.onMinuteChange.bind(this)});
	// week setting
	this.divErrorWeek = document.querySelector('#divErrorWeek');
	this.allWeek = new ZeusRadio({name: 'allWeek', onchange: this.onAllWeekChange.bind(this), isCallOnChange: false});
	this.week = new ZeusCheckbox({name: 'week', onchange: this.onWeekChange.bind(this)});
	// alert mail
	this.alertMail = document.querySelector('#alertMail');
	// monitoring
	this.monitoring = document.querySelector('#monitoring');
	// submit schedule button
	this.btnSubmitSchedule = document.querySelector('#btnSumbitSchedule');
	// events
	$(this.modal).on('hidden.bs.modal', this.onModalHidden.bind(this));
	this.btnSubmitSchedule.onclick = this.onBtnSubmitScheduleClick.bind(this);
}
ModalScheduleInput.prototype = {
	// events
	onModalHidden: function(){
		this.init();
	},
	onAllSensorChange: function(){
		this.sensor.setChecked(this.allSensor.getCheckedValue() === 'all');
	},
	onSensorChange: function(){
		
		if(this.sensor.checkboxes.length === this.sensor.checkedLength()){
			this.allSensor.setChecked('all');
		}else{
			this.allSensor.setChecked('select');
		}
		this.sensor.setCheckedTexts();
	},
	onAllMonthChange: function(){
		this.month.setChecked(this.allMonth.getCheckedValue() === 'all');
	},
	onMonthChange: function(){
		
		if(this.month.checkboxes.length === this.month.checkedLength()){
			this.allMonth.setChecked('all');
		}else{
			this.allMonth.setChecked('select');
		}
	},
	onAllDayChange: function(){
		this.day.setChecked(this.allDay.getCheckedValue() === 'all');
	},
	onDayChange: function(){
		
		if(this.day.checkboxes.length === this.day.checkedLength()){
			this.allDay.setChecked('all');
		}else{
			this.allDay.setChecked('select');
		}
	},
	onAllHourChange: function(){
		this.hour.setChecked(this.allHour.getCheckedValue() === 'all');
	},
	onHourChange: function(){
		
		if(this.hour.checkboxes.length === this.hour.checkedLength()){
			this.allHour.setChecked('all');
		}else{
			this.allHour.setChecked('select');
		}
	},
	onAllMinuteChange: function(){
		this.minute.setChecked(this.allMinute.getCheckedValue() === 'all');
	},
	onMinuteChange: function(){
		
		if(this.minute.checkboxes.length === this.minute.checkedLength()){
			this.allMinute.setChecked('all');
		}else{
			this.allMinute.setChecked('select');
		}
	},
	onAllWeekChange: function(){
		this.week.setChecked(this.allWeek.getCheckedValue() === 'all');
	},
	onWeekChange: function(){
		
		if(this.week.checkboxes.length === this.week.checkedLength()){
			this.allWeek.setChecked('all');
		}else{
			this.allWeek.setChecked('select');
		}
	},
	onBtnSubmitScheduleClick: function(){
		let isvalid = this.validate();
		
		if(isvalid){
			if(zeusStringUtils.isEmpty(this.scheduleId.value)){
				this.sendRequestAddSchedule();
			}else{
				this.sendRequestUpdateSchedule();
			}
		}
	},
	// methods
	toObject: function(){
		let obj = {};
		if(this.scheduleId.value !== ''){
			obj.scheduleId = this.scheduleId.value;
		}
		obj.sensorIdList = this.sensor.checkedValues();
		obj.sensorNameList = this.allSensor.getCheckedValue() === 'all'? '全対象': this.sensor.texts.value;
		obj.mo = this.month.checkedValues();
		obj.d = this.day.checkedValues();
		obj.h = this.hour.checkedValues();
		obj.mi = this.minute.checkedValues();
		obj.week = this.week.checkedValues();
		if(this.alertMail.value !== ''){
			obj.alertMail = this.alertMail.value;
		}
		if(this.monitoring.value !== ''){
			obj.monitoring = this.monitoring.value;
		}
		obj.boxId = this.subMachineId.value;
		return obj;
	},
	init: function(){
		this.subMachineId.value = '';
		this.scheduleId.value = '';
		// sensor setting initialization
		zeus.hideElement(this.divErrorSensor);
		this.allSensor.radios[0].checked = false;
		this.allSensor.radios[1].checked = false;
		this.divSensorList.innerHTML = '';
		// month initialization
		zeus.hideElement(this.divErrorMonth);
		this.allMonth.radios[0].checked = false;
		this.allMonth.radios[1].checked = false;
		this.month.setChecked(false);
		// day initialization
		zeus.hideElement(this.divErrorDay);
		this.allDay.radios[0].checked = false;
		this.allDay.radios[1].checked = false;
		this.day.setChecked(false);
		// hour initialization
		zeus.hideElement(this.divErrorHour);
		this.allHour.radios[0].checked = false;
		this.allHour.radios[1].checked = false;
		this.hour.setChecked(false);
		// minute initialization
		zeus.hideElement(this.divErrorMinute);
		this.allMinute.radios[0].checked = false;
		this.allMinute.radios[1].checked = false;
		this.minute.setChecked(false);
		// week initialization
		zeus.hideElement(this.divErrorWeek);
		this.allWeek.radios[0].checked = false;
		this.allWeek.radios[1].checked = false;
		this.week.setChecked(false);
		// alert mail initialization
		this.alertMail.value = '';
		// monitoring initialization
		this.monitoring.value = '';
	},
	initUpdate: function(subMachine){
		// sensor id list
		if(this.sensor.checkboxes != null){
			
			for(let i = 0, l = this.sensor.checkboxes.length; i < l; i++){
				
				if(subMachine.sensorIdList.indexOf(this.sensor.checkboxes[i].value) >= 0){
					this.sensor.checkboxes[i].checked = true;
				}
			}
		}
		this.allSensor.radios[this.sensor.checkboxes.length != 0 && this.sensor.checkboxes.length == this.sensor.checkedLength()? 0: 1].checked = true;
		// sensor name list
		this.sensor.setCheckedTexts();
		// month
		let key;
		for(let i = 1; i < 13; i++){
			key = 'mo' + i;
			
			if(subMachine[key] === 1){
				this.month.checkboxes[i - 1].checked = true;
			}
		}
		this.allMonth.radios[this.month.checkboxes.length != 0 && this.month.checkboxes.length == this.month.checkedLength()? 0: 1].checked = true;
		// day
		for(let i = 1; i < 32; i++){
			key = 'd' + i;
			
			if(subMachine[key] === 1){
				this.day.checkboxes[i - 1].checked = true;
			}
		}
		this.allDay.radios[this.day.checkboxes.length != 0 && this.day.checkboxes.length == this.day.checkedLength()? 0: 1].checked = true;
		// hour
		for(let i = 0; i < 24; i++){
			key = 'h' + i;
			
			if(subMachine[key] === 1){
				this.hour.checkboxes[i].checked = true;
			}
		}
		this.allHour.radios[this.hour.checkboxes.length != 0 && this.hour.checkboxes.length == this.hour.checkedLength()? 0: 1].checked = true;
		// minute
		for(let i = 0; i < 60; i++){
			key = 'mi' + i;
			
			if(subMachine[key] === 1){
				this.minute.checkboxes[i].checked = true;
			}
		}
		this.allMinute.radios[this.minute.checkboxes.length != 0 && this.minute.checkboxes.length == this.minute.checkedLength()? 0: 1].checked = true;
		// week
		let weekall = subMachine.mon === 1;
		if(subMachine.mon === 1){
			this.week.checkboxes[0].checked = true;
		}
		weekall = weekall && subMachine.tue === 1;
		if(subMachine.tue === 1){
			this.week.checkboxes[1].checked = true;
		}
		weekall = weekall && subMachine.wed === 1;
		if(subMachine.wed === 1){
			this.week.checkboxes[2].checked = true;
		}
		weekall = weekall && subMachine.thu === 1;
		if(subMachine.thu === 1){
			this.week.checkboxes[3].checked = true;
		}
		weekall = weekall && subMachine.fri === 1;
		if(subMachine.fri === 1){
			this.week.checkboxes[4].checked = true;
		}
		weekall = weekall && subMachine.sat === 1;
		if(subMachine.sat === 1){
			this.week.checkboxes[5].checked = true;
		}
		weekall = weekall && subMachine.sun === 1;
		if(subMachine.sun === 1){
			this.week.checkboxes[6].checked = true;
		}
		this.allWeek.radios[weekall? 0: 1].checked = true;
		// alert mail
		this.alertMail.value = subMachine.alertMail;
		// monitoring
		this.monitoring.value = subMachine.monitoring;
	},
	open: function(id, subMachine){
		this.subMachineId.value = id;
		this.scheduleId.value = subMachine == null? '': subMachine.scheduleId;
		// sensor setting initialization
		let arrSmd = objSubMachines[id].subMachineDeviceList;
		
		let div, input, label, smd;
		
		for(let i = 0, l = arrSmd.length; i < l; i++){
			smd = arrSmd[i];
			
			div = document.createElement('div');
			div.setAttribute('class', 'mr-3');
			
			input = document.createElement('input');
			input.type = 'checkbox';
			input.name = 'sensor';
			input.value = smd.id;
			div.appendChild(input);
			
			label = document.createElement('label');
			label.setAttribute('class', 'ml-1');
			label.innerText = smd.deviceName;
			div.appendChild(label);
			
			this.divSensorList.appendChild(div);
		}
		this.sensor = new ZeusCheckbox({name: 'sensor', checkedTextId: 'sensorNameList', onchange: this.onSensorChange.bind(this)});
		// input or udpate
		if(subMachine != null){
			this.initUpdate(subMachine);
		}
		$(this.modal).modal('show');
	},
	close: function(){
		$(this.modal).modal('hide');
	},
	validate: function(){
		let isvalid = true;
		if(this.sensor.checkedLength() === 0){
			isvalid = false;
			zeus.showElement(this.divErrorSensor);
		}else{
			zeus.hideElement(this.divErrorSensor);
		}
		if(this.month.checkedLength() === 0){
			isvalid = false;
			zeus.showElement(this.divErrorMonth);
		}else{
			zeus.hideElement(this.divErrorMonth);
		}
		if(this.day.checkedLength() === 0){
			isvalid = false;
			zeus.showElement(this.divErrorDay);
		}else{
			zeus.hideElement(this.divErrorDay);
		}
		if(this.hour.checkedLength() === 0){
			isvalid = false;
			zeus.showElement(this.divErrorHour);
		}else{
			zeus.hideElement(this.divErrorHour);
		}
		if(this.minute.checkedLength() === 0){
			isvalid = false;
			zeus.showElement(this.divErrorMinute);
		}else{
			zeus.hideElement(this.divErrorMinute);
		}
		if(this.week.checkedLength() === 0){
			isvalid = false;
			zeus.showElement(this.divErrorWeek);
		}else{
			zeus.hideElement(this.divErrorWeek);
		}
		return isvalid;
	},
	sendRequestAddSchedule: function(){
		$.ajax({
			url: contextPath + 'Rest/SubMachineMonitoringSchedule/Add.action',
			async: true,
			cache: false,
			method: 'POST',
			data: this.toObject()
		})
		.done(function(resp, textStatus, jqXHR){
			let objResp = JSON.parse(resp);
			modalScheduleInput.close();
			
			if(objResp.result === 'ok'){
				popupMessage.setMessage('登録しました。');
				document.location.href = contextPath + 'SubMachineMonitoring/SubMachineMonitoringList.action';
			}else{
				popupError.setMessage(objResp.error.message);
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown){
			modalScheduleInput.close();
			popupError.setMessage('エラーが発生しました。');
		});
	},
	sendRequestUpdateSchedule: function(){
		$.ajax({
			url: contextPath + 'Rest/SubMachineMonitoringSchedule/Update.action',
			async: true,
			cache: false,
			method: 'POST',
			data: this.toObject()
		})
		.done(function(resp, status, xhr){
			let objResp = JSON.parse(resp);
			modalScheduleInput.close();
			
			if(objResp.result === 'ok'){
				popupMessage.setMessage('更新しました。');
				document.location.href = contextPath + 'SubMachineMonitoring/SubMachineMonitoringList.action';
			}else{
				popupError.setMessage(objResp.error.message);
			}
		})
		.fail(function(xhr, status, error){
			modalScheduleInput.close();
			popupError.setMessage('エラーが発生しました。');
		});
	}
};

function ModalScheduleDelete(){
	this.modal = document.querySelector('#modalScheduleDelete');
	this.scheduleId = document.querySelector('#delScheduleId');
	this.tdId = document.querySelector('#tdId');
	this.tdTitle = document.querySelector('#tdTitle');
	this.tdSensor = document.querySelector('#tdSensor');
	this.tdContent = document.querySelector('#tdContent');
	this.btnDeleteSchedule = document.querySelector('#btnDeleteSchedule');
	// events
	$(this.modal).on('hidden.bs.modal', this.clear.bind(this));
	this.btnDeleteSchedule.onclick = this.sendRequestDeleteSchedule.bind(this);
}
ModalScheduleDelete.prototype = {
	// events
	// methods
	clear: function(){
		this.scheduleId.value = '';
		this.tdId.innerHTML = '';
		this.tdTitle.innerHTML = '';
		this.tdSensor.innerHTML = '';
		this.tdContent.innerHTML = '';
	},
	open: function(scheduleId){
		let sms = objSchedules[scheduleId];
		this.scheduleId.value = sms.scheduleId;
		this.tdId.innerHTML = sms.scheduleId;
		this.tdTitle.innerHTML = sms.scheduleTitle;
		this.tdSensor.innerHTML = sms.sensorNameList;
		
		let div, content;
		
		if(sms.alertMail !== ''){
			div = document.createElement('div');
			content = 'メール通知（';
			content += sms.alertMail === 1? 'On': 'Off';
			content += '）';
			div.innerHTML = content;
			this.tdContent.appendChild(div);
		}
		if(sms.monitoring !== ''){
			div = document.createElement('div');
			content = '接続（';
			content += sms.monitoring === 1? 'On': 'Off';
			content += '）';
			div.innerHTML = content;
			this.tdContent.appendChild(div);
		}
		$(this.modal).modal('show');
	},
	close: function(){
		$(this.modal).modal('hide');
	},
	sendRequestDeleteSchedule: function(){
		$.ajax({
			url: contextPath + 'Rest/SubMachineMonitoringSchedule/Delete.action',
			async: true,
			cache: false,
			method: 'POST',
			data: {scheduleId: this.scheduleId.value}
		})
		.done(function(resp, status, xhr){
			let objResp = JSON.parse(resp);
			modalScheduleDelete.close();
			
			if(objResp.result === 'ok'){
				popupMessage.setMessage('削除しました。');
				document.location.href = contextPath + 'SubMachineMonitoring/SubMachineMonitoringList.action';
			}else{
				popupError.setMessage(objResp.error.message);
			}
		})
		.fail(function(xhr, status, error){
			modalScheduleDelete.close();
			popupError.setMessage('エラーが発生しました。');
		});
	}
}

//******************** init
let subMachineSchedules = new SubMachineSchedules();
let buttonAddSchedule = new ButtonAddSchedule();
let buttonUpdateSchedule = new ButtonUpdateSchedule();
let buttonDeleteSchedule = new ButtonDeleteSchedule();
let modalScheduleInput = new ModalScheduleInput('#modalScheduleInput');
let modalScheduleDelete = new ModalScheduleDelete();

if(reqNodeIds != ''){
	nodeIds = reqNodeIds;
}
if(reqInputIds != ''){
	inputIds = reqInputIds;
}
if(reqElectIds != ''){
	electIds = reqElectIds;
}
if(reqTempIds != ''){
	tempIds = reqTempIds;
}
if(reqDemandIds != ''){
	demandIds = reqDemandIds;
}
if(reqBoxIds != ''){
	boxIds = reqBoxIds;
}

//* set mail, conn all check
tblSet.each(function(){
	let tbl = $(this);
	// メール通知
	let uncheckedLen = tbl.find('.mail-switch').not(':checked').length;
	tbl.find('.mail-switch-all').prop('checked', uncheckedLen == 0);
	// 接続
	uncheckedLen = tbl.find('.conn-switch').not(':checked').length;
	tbl.find('.conn-switch-all').prop('checked', uncheckedLen == 0);
});
//_ set mail, conn all check

if(nodeIds != null || inputIds != null || electIds != null || tempIds != null || demandIds != null){
	updateSubCommStatus();
}
//==================== init