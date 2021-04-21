function SimpleOperationSchedule(){
	let _this = this;
	this.nodeId = new ZeusSelect({id: 'nodeId', textId: 'nodeNameStr', onchange: this.onNodeIdChange.bind(this)});
	this.operationRate = document.querySelector('#operationRate');
	this.operationRateDelete = document.querySelector('#operationRateDelete');
	this.operationRateJudgeSec = document.querySelector('#operationRateJudgeSec');
	this.operationRateJudgeSecDelete = document.querySelector('#operationRateJudgeSecDelete');
	this.operationRateJudgeMode = document.querySelector('#operationRateJudgeMode');
	this.operationRateJudgeModeDelete = document.querySelector('#operationRateJudgeModeDelete');
	this.channelType = document.querySelector('#channelType');
	//> ↓ control linkage output
	//>   2019-08-09
	this.controlLinkageOutput = {
		el: {
			mode: document.querySelector('[name="controlLinkNodePriority"]'),
			modeDel: document.querySelector('[name="controlLinkNodePriorityDelete"]'),
			condition: document.querySelector('[name="controlLinkNodeCondition"]'),
			conditionDel: document.querySelector('[name="controlLinkNodeConditionDelete"]'),
			nodeIds: document.querySelectorAll('[name="controlLinkNodeIds"]'),
			nodeIdsDel: document.querySelector('[name="controlLinkNodeIdsDelete"]'),
			nodeNames: document.querySelector('[name="controlLinkNodeNames"]')
		},
		fn: {
			onDelChange: function(){
				_this.controlLinkageOutput.el.modeDel.checked = this.checked;
				_this.controlLinkageOutput.el.conditionDel.checked = this.checked;
				_this.controlLinkageOutput.el.nodeIdsDel.checked = this.checked;
				
				//> ↓ set mode disable
				_this.controlLinkageOutput.el.mode.disabled = this.checked;
				_this.controlLinkageOutput.el.condition.disabled = this.checked;
				//> ↓ set node disable
				_this.controlLinkageOutput.fn.setNodeDisable(this.checked);
			},
			isDelChecked: function(){
				return _this.controlLinkageOutput.el.modeDel.checked || _this.controlLinkageOutput.el.conditionDel.checked || _this.controlLinkageOutput.el.nodeIdsDel.checked;
			},
			setNodeDisable: function(isDisable){
				for(let i = 0, l = _this.controlLinkageOutput.el.nodeIds.length; i < l; i++){
					_this.controlLinkageOutput.el.nodeIds[i].disabled = isDisable;
				}
			},
			setCheckedNodeNames: function(){
				let names = [];
				let delChecked = _this.controlLinkageOutput.fn.isDelChecked();
				
				if(!delChecked){
					let el, nameLabel;
					for(let i = 0, l = _this.controlLinkageOutput.el.nodeIds.length; i < l; i++){
						el = _this.controlLinkageOutput.el.nodeIds[i];
						if(el.checked && !el.disabled){
							nameLabel = el.nextElementSibling;
							names.push(nameLabel.innerText);
						}
					}
				}
				_this.controlLinkageOutput.el.nodeNames.value = names.length > 0? names.join(): '';
			},
			getNodeCheckedLength: function(){
				let len = 0;
				for(let i = 0, l = _this.controlLinkageOutput.el.nodeIds.length; i < l; i++){
					el = _this.controlLinkageOutput.el.nodeIds[i];
					if(el.checked && !el.disabled){
						len++;
					}
				}
				return len;
			},
			reset: function(){
				//> ↓ is initialization
				//>   if true, execute at the very first time
				//>   if false, execute at every time nodeId changes
				//< ↑ is initialization
				let delChecked = _this.controlLinkageOutput.fn.isDelChecked();
				//> ↓ reset mode value
				if(!store.data.isInit){
					_this.controlLinkageOutput.el.mode.value = '';
					_this.controlLinkageOutput.el.condition.value = '';
				}else{
					_this.controlLinkageOutput.el.mode.disabled = delChecked;
					_this.controlLinkageOutput.el.condition.disabled = delChecked;
				}
				_this.controlLinkageOutput.fn.resetNodeVisibility();
			},
			resetNodeVisibility: function(){
				//> ↓ reset node visibility and disable
				if(_this.controlLinkageOutput.el.nodeIds != null) {
					let nodeId = _this.nodeId.select.value;
					let delChecked = _this.controlLinkageOutput.fn.isDelChecked();
					let el, parent, styleClass;
					for(let i = 0, l = _this.controlLinkageOutput.el.nodeIds.length; i < l; i++){
						el = _this.controlLinkageOutput.el.nodeIds[i];
						parent = el.parentNode;
						styleClass = parent.getAttribute('class');
						//>> ↓↓ has d-none
						if(styleClass != null && styleClass.indexOf('d-none') >= 0){
							
							if(nodeId === '' || el.value !== nodeId){
								parent.setAttribute('class', '');
								//>>> ↓↓↓ only when the delete checkbox not checked
								if(!delChecked){
									el.disabled = false;
								}
							}
						//>> ↓↓ no d-none
						}else{
							if(nodeId === el.value){
								parent.setAttribute('class', 'd-none');
								el.disabled = true;
							}else{
								//>>> ↓↓↓ only when the delete checkbox not checked
								if(delChecked){
									el.disabled = true;
								}
							}
						}
						//>> ↓↓ set to unchecked
						//>>    if not initialize
						if(!store.data.isInit){
							el.checked = false;
						}
					}
				}
			},
			isEmpty: function(){
				let lenNodeChecked = _this.controlLinkageOutput.fn.getNodeCheckedLength();
				return _this.controlLinkageOutput.el.mode.value === '' && _this.controlLinkageOutput.el.condition.value === '' && lenNodeChecked === 0;
			},
			init: function(){
				//> ↓ attach delete checkbox change event
				_this.controlLinkageOutput.el.modeDel.onchange = _this.controlLinkageOutput.fn.onDelChange;
				_this.controlLinkageOutput.el.conditionDel.onchange = _this.controlLinkageOutput.fn.onDelChange;
				_this.controlLinkageOutput.el.nodeIdsDel.onchange = _this.controlLinkageOutput.fn.onDelChange;
			}
		}
	};
	this.controlLinkageOutput.fn.init();
	
	this.buttons = {
		getSoSetting: document.querySelector('#btn-getSoSetting')
	};
	
	this.operationRate.onkeyup = zeus.onNumberInput;
	this.operationRateDelete.onchange = this.onOperationRateDeleteChange.bind(this);
	this.operationRateJudgeSec.onkeyup = zeus.onNumberInput;
	this.operationRateJudgeSecDelete.onchange = this.onOperationRateJudgeSecDeleteChange.bind(this);
	this.operationRateJudgeModeDelete.onchange = this.onOperationRateJudgeModeDeleteChange.bind(this);
	this.buttons.getSoSetting.onclick = this.onGetSettingClick.bind(this);
	
	this.onNodeIdChange.call(this);
}
SimpleOperationSchedule.prototype = {
	// events
	onNodeIdChange: function(){
		this.nodeId.text.value = this.nodeId.selectedText();
		
		//***** set get setting button
		if(this.nodeId.select.value == ''){
			zeus.hideElement(this.buttons.getSoSetting);
			this.channelType.value = '';
		}else{
			zeus.showElement(this.buttons.getSoSetting);
			this.getChannelType();
		}
		//_____ set get setting button
		//> ↓ reset controlLinkageOutput
		this.controlLinkageOutput.fn.reset();
	},
	onGetSettingClick: function(){
		zeus.ajax({
			url: contextPath + 'Ajax/SimpleOperation/GetSetting.action',
			data: {nodeId: this.nodeId.select.value},
			success: function(resp){
				let respObj = JSON.parse(resp);
				if(respObj.error != null){
					console.log('error: sync server unreachable..');
				}else{
					var respArr = respObj.data;
					var obj;
					var filteredObj;
					var arr;
					
					for(var i = 0, l = respArr.length; i < l; i++){
						obj = respArr[i];
						filteredObj = $(obj.filter);
						
						if(obj.type === 'radio'){
							
							if(obj.value == null){
								
								for(var vi = 0, vl = filteredObj.lenth; vi < vl; vi++){
									filteredObj[vi].checked = false;
								}
							}else{
								filteredObj.filter('[value="' + obj.value + '"]').prop('checked', true);
							}
						}else if(obj.type === 'checkbox'){
							filteredObj.prop('checked', false);
							
							if(obj.value != null){
								arr = obj.value.split(',');
								
								for(var vi = 0, vl = arr.length; vi < vl; vi++){
									filteredObj.filter('[value="' + arr[vi] + '"]').prop('checked', true);
								}
							}
						}else { // except raido, checkbox
							
							if(obj.value == null){
								filteredObj.val('');
							}else{
								filteredObj.val(obj.value);
							}
						}
					}
					
					init();
				}
			},
			error: function(){
			}
		});
	},
	onOperationRateDeleteChange: function(){
		this.operationRate.disabled = this.operationRateDelete.checked;
	},
	onOperationRateJudgeSecDeleteChange: function(){
		this.operationRateJudgeSec.disabled = this.operationRateJudgeSecDelete.checked;
	},
	onOperationRateJudgeModeDeleteChange: function(){
		this.operationRateJudgeMode.disabled = this.operationRateJudgeModeDelete.checked;
	},
	// methods
	getChannelType: function(){
		// 併用型用: 手動　または　自動時制御設定がクリックされていない
		let isdisable = nodeControlSelect.val() == 0 && controlSettingWhileAutoFlag.val() != 'y';
		
		if(this.nodeId.select.value !== ''){
			zeus.ajax({
				url: contextPath + 'Rest/Node/GetColumn.action',
				async: false,
				data: {nodeId: this.nodeId.select.value, column: 'channelType'},
				sos: this,
				success: function(resp){
					let objResp = JSON.parse(resp);
					if(objResp.result === 'ok'){
						this.sos.channelType.value = objResp.success;
						// 出力管理の制御ポートが併用型の場合
						isdisable = isdisable || this.sos.channelType.value == 1;
					}else{
						this.sos.channelType.value = '';
					}
				},
				error: function(){
					console.log('error occurred when get node\'s channelType');
					this.sos.channelType.value = '';
					isdisable = true;
				}
			});
		}
		console.log(isdisable);
		// ↓ 併用型の場合 ↓
		this.operationRateDelete.disabled = isdisable;
		this.operationRateJudgeSecDelete.disabled = isdisable;
		this.operationRateJudgeModeDelete.disabled = isdisable;
		// ↑ 併用型の場合 ↑
	}
}

let store = {
	data: {
		isInit: true
	}
};
//月
var monthRadio = $('[name="allMonthRadio"]');
var monthCheck = $('.month-check');
//日
var dayRadio = $('[name="allDayRadio"]');
var dayCheck = $('.day-check');
//時
var hourRadio = $('[name="allHourRadio"]');
var hourCheck = $('.hour-check');
//分
var minuteRadio = $('[name="allMinuteRadio"]');
var minuteCheck = $('.minute-check');
//曜日
var weekRadio = $('[name="allWeekRadio"]');
var weekCheck = $('.week-check');
//手動 / 自動 
var nodeControlSelect = $('[name="nodeControl"]');
//通常 / 制御
var onOffControlSelect = $('[name="onOffControl"]');
//制御モード
var controlModeRadio = $('[name="controlMode"]');
// 省エネ運転時間
var onSecondText = $('[name="onSecond"]');
var onSecondDeleteCheck = $('[name="onSecondDelete"]');
//通常運転時間		
var offSecondText = $('[name="offSecond"]');
var offSecondDeleteCheck = $('[name="offSecondDelete"]');
//設定温度(冷)
var targetTemperatureCoolingText = $('[name="targetTemperatureCooling"]');
//許容誤差温度(冷)
var offsetTemperatureCoolingText = $('[name="offsetTemperatureCooling"]');
//設定温度(暖)
var targetTemperatureHeatingText = $('[name="targetTemperatureHeating"]');
//許容誤差温度(暖)
var offsetTemperatureHeatingText = $('[name="offsetTemperatureHeating"]');
//温度センサー
var temperatureSensorIdsCheck = $('[name="temperatureSensorIds"]');
var temperatureSensorIdsDeleteCheck = $('[name="temperatureSensorIdsDelete"]');
//電力量センサー
var electricEnergySensorIdSelect = $('[name="electricEnergySensorId"]');
var electricEnergySensorIdDeleteCheck = $('[name="electricEnergySensorIdDelete"]');
//制御開始負荷電力
var watchingThresholdElectricEnergyOnText = $('[name="watchingThresholdElectricEnergyOn"]');
var watchingThresholdElectricEnergyOnDeleteCheck = $('[name="watchingThresholdElectricEnergyOnDelete"]');
//制御解除負荷電力
var watchingThresholdElectricEnergyOffText = $('[name="watchingThresholdElectricEnergyOff"]');
var watchingThresholdElectricEnergyOffDeleteCheck = $('[name="watchingThresholdElectricEnergyOffDelete"]');
//最低通常時間
var watchingTimeText = $('[name="watchingTime"]');
var watchingTimeDeleteCheck = $('[name="watchingTimeDelete"]');
//目標電力
var estimateThresholdElectricEnergyText = $('[name="estimateThresholdElectricEnergy"]');
var estimateThresholdElectricEnergyDeleteCheck = $('[name="estimateThresholdElectricEnergyDelete"]');
// デマンド制御ロック時間
let alarmLockTime = $('[name="alarmLockTime"]');
let alarmLockTimeDelete = $('[name="alarmLockTimeDelete"]');
//デマンド警報メール
var demandMailSelect = $('[name="demandMail"]');
var demandMailDeleteCheck = $('[name="demandMailDelete"]');
//モード切替温度差
var offsetTemperatureModeChangeText = $('[name="offsetTemperatureModeChange"]');
var offsetTemperatureModeChangeDeleteCheck = $('[name="offsetTemperatureModeChangeDelete"]');
var offsetTemperatureModeChangeHeatingText = $('[name="offsetTemperatureModeChangeHeating"]');
var offsetTemperatureModeChangeHeatingDeleteCheck = $('[name="offsetTemperatureModeChangeHeatingDelete"]');
//閾値温度 / 閾値不快指数(冷)
var watchingThresholdTemperatureCoolingOnText = $('[name="watchingThresholdTemperatureCoolingOn"]');
var watchingThresholdTemperatureCoolingText = $('[name="watchingThresholdTemperatureCooling"]');
//閾値温度 / 閾値不快指数(暖)
var watchingThresholdTemperatureHeatingOnText = $('[name="watchingThresholdTemperatureHeatingOn"]');
var watchingThresholdTemperatureHeatingText = $('[name="watchingThresholdTemperatureHeating"]');
//デマンド制御時閾値温度 / 閾値不快指数(冷)
var watchingThresholdTemperatureCoolingDemandText = $('[name="watchingThresholdTemperatureCoolingDemand"]');
var watchingThresholdTemperatureCoolingDemandDelete = $('[name="watchingThresholdTemperatureCoolingDemandDelete"]');
//デマンド制御時閾値温度 / 閾値不快指数(暖)
var watchingThresholdTemperatureHeatingDemandText = $('[name="watchingThresholdTemperatureHeatingDemand"]');
var watchingThresholdTemperatureHeatingDemandDelete = $('[name="watchingThresholdTemperatureHeatingDemandDelete"]');
// 制御開始維持閾値温度 / 閾値不快指数（冷）
var textWatchingThresholdTemperatureCoolingKeep = $('[name="watchingThresholdTemperatureCoolingKeep"]');
var checkWatchingThresholdTemperatureCoolingKeepDelete = $('[name="watchingThresholdTemperatureCoolingKeepDelete"]');
// 制御開始維持閾値秒数（冷）
var textWatchingThresholdTemperatureCoolingKeepSec = $('[name="watchingThresholdTemperatureCoolingKeepSec"]');
var checkWatchingThresholdTemperatureCoolingKeepSecDelete = $('[name="watchingThresholdTemperatureCoolingKeepSecDelete"]');
// 制御開始維持閾値温度 / 閾値不快指数（暖）
var textWatchingThresholdTemperatureHeatingKeep = $('[name="watchingThresholdTemperatureHeatingKeep"]');
var checkWatchingThresholdTemperatureHeatingKeepDelete = $('[name="watchingThresholdTemperatureHeatingKeepDelete"]');
// 制御開始維持閾値秒数（暖）
var textWatchingThresholdTemperatureHeatingKeepSec = $('[name="watchingThresholdTemperatureHeatingKeepSec"]');
var checkWatchingThresholdTemperatureHeatingKeepSecDelete = $('[name="watchingThresholdTemperatureHeatingKeepSecDelete"]');
//閾値湿度(下限)
var watchingThresholdHumidityLowerText = $('[name="watchingThresholdHumidityLower"]');
var watchingThresholdHumidityLowerDeleteCheck = $('[name="watchingThresholdHumidityLowerDelete"]');
//閾値湿度(上限)
var watchingThresholdHumidityUpperText = $('[name="watchingThresholdHumidityUpper"]');
var watchingThresholdHumidityUpperDeleteCheck = $('[name="watchingThresholdHumidityUpperDelete"]');
//温度演算方法(冷)
var temperatureOperationMethodCoolingSelect = $('[name="temperatureOperationMethodCooling"]');
//温度演算方法(暖)
var temperatureOperationMethodHeatingSelect = $('[name="temperatureOperationMethodHeating"]');
//温度制御モード
var temperatureControlModeSelect = $('[name="temperatureControlMode"]');
var temperatureControlModeDeleteCheck = $('[name="temperatureControlModeDelete"]');
var zoneTr = $('.zoneTr');
var zoneCoolingTr = $('.zoneCoolingTr');
var zoneHeatingTr = $('.zoneHeatingTr');
var thresholdTr = $('.thresholdTr');
var thresholdCoolingTr = $('.thresholdCoolingTr');
var thresholdHeatingTr = $('.thresholdHeatingTr');
var methodTr = $('.methodTr');
var methodCoolingTr = $('.methodCoolingTr');
var methodHeatingTr = $('.methodHeatingTr');
var tempModeTr = $('.tempModeTr');
var tempSensorDiv = $('.sensor-temp-div');
var tempSensorCheck = $('.check-temp');
var co2SensorDiv = $('.sensor-co2-div');
var co2SensorCheck = $('.check-co2');
var tempSpan = $('.span-temp');
var co2Span = $('.span-co2');
var tcm2 = $('.tcm-2');
var tcm4 = $('.tcm-4');

let envSensorIds = function(){
	let list = document.querySelectorAll('[name="temperatureSensorIds"]');
	let envNames = document.querySelector('[name="envSensorNames"]');
	
	function setCheckedNames(){
		let arrName = [], item;
		for(let i = 0, l = list.length; i < l; i++){
			item = list[i];
			if(!item.disabled && item.checked){
				arrName.push(item.nextElementSibling.innerText);
			}
		}
		envNames.value = arrName.join();
	}
	
	return {
		setCheckedNames: setCheckedNames
	};
}();

let validator = {
	controlLinkNodePriority: {
		elErr: document.querySelector('#errControlLinkNodePriority'),
		errMsg: errMsg.controlLinkNodePriority,
		validate: function(){
			validator.controlLinkNodePriority.elErr.innerHTML = '';
			let isValid = true;
			
			if(!sos.controlLinkageOutput.el.mode.disabled){
				
				if(!sos.controlLinkageOutput.fn.isEmpty()){
					let div;
					if(sos.controlLinkageOutput.el.mode.value === ''){
						div = document.createElement('div');
						div.innerHTML = errMsg.controlLinkNodePriority;
						validator.controlLinkNodePriority.elErr.appendChild(div);
						isValid = false;
					}
					if(sos.controlLinkageOutput.el.condition.value === ''){
						div = document.createElement('div');
						div.innerHTML = errMsg.controlLinkNodeCondition;
						validator.controlLinkNodePriority.elErr.appendChild(div);
						isValid = false;
					}
					let nodeCheckedLen = sos.controlLinkageOutput.fn.getNodeCheckedLength();
					if(nodeCheckedLen === 0){
						div = document.createElement('div');
						div.innerHTML = errMsg.controlLinkNodeIds;
						validator.controlLinkNodePriority.elErr.appendChild(div);
						isValid = false;
					}
				}
			}
			return isValid;
		}
	},
	validate: function(){
		return this.controlLinkNodePriority.validate();
	}
};

monthRadio.change(function(){
	monthCheck.prop('checked', this.value == 'all');
});

dayRadio.change(function(){
	dayCheck.prop('checked', this.value == 'all');
});

hourRadio.change(function(){
	hourCheck.prop('checked', this.value == 'all');
});

minuteRadio.change(function(){
	minuteCheck.prop('checked', this.value == 'all');
});

weekRadio.change(function(){
	weekCheck.prop('checked', this.value == 'all');
});

controlModeRadio.change(function(){
	if(temperatureControlModeDeleteCheck.prop('checked')){
		temperatureControlModeDeleteCheck.change();
	}else{
		temperatureControlModeSelect.change();
	}
});

//***** 環境制御モード
var tempModeDelCheck = $('.tempModeDelCheck');
temperatureControlModeSelect.change(function(){
	var value = this.value;
	var controlModeValue = controlModeRadio.filter(':checked').val();
	var isTSIsChecked = temperatureSensorIdsDeleteCheck.prop('checked');
	
	zoneTr.addClass('hide');
	thresholdTr.addClass('hide');
	methodTr.addClass('hide');
	tempSensorDiv.addClass('hide');
	co2SensorDiv.addClass('hide');
	
	co2Span.addClass('hide');
	tempSpan.removeClass('hide');
	tempSensorCheck.prop('disabled', true);
	co2SensorCheck.prop('disabled', true);
	
	tcm2.hide();
	tcm4.hide();
	$('.tcm-' + this.value).show();
	
	//***** co2の場合自動がないため冷をデフォルトにする
	if(value == 5 && controlModeValue == 2){
		controlModeRadio.filter('[value="0"]').prop('checked', true);
		controlModeValue = 0;
	}
	//_____ co2の場合自動がないため冷をデフォルトにする
	
	if(controlModeValue == 2 && (this.value == 1 || this.value == 2 || this.value == 4)){
		tempModeTr.removeClass('hide');
		offsetTemperatureModeChangeDeleteCheck.prop('checked', false);
		offsetTemperatureModeChangeDeleteCheck.change();
		offsetTemperatureModeChangeHeatingDeleteCheck.prop('checked', false);
		offsetTemperatureModeChangeHeatingDeleteCheck.change();
	}else{
		tempModeTr.addClass('hide');
		offsetTemperatureModeChangeDeleteCheck.prop('checked', true);
		offsetTemperatureModeChangeDeleteCheck.change();
		offsetTemperatureModeChangeHeatingDeleteCheck.prop('checked', true);
		offsetTemperatureModeChangeHeatingDeleteCheck.change();
	}
	
	if(value == '' || controlModeValue == null){
		tempSensorDiv.removeClass('hide');
		
		if(!isTSIsChecked){
			tempSensorCheck.prop('disabled', false);
			setTemperatureControlModeItemDisable(true);
		}
	}else{
		methodTr.removeClass('hide');
		// 閾値制御
		if(value == 2 || value == 4){
			thresholdTr.removeClass('hide');
			if(!isTSIsChecked){
				setZoneItemDisable(true);
			}
			// 冷	
			if(controlModeValue == 0){
				thresholdCoolingTr.css('display', '');
				thresholdHeatingTr.css('display', 'none');
				
				methodCoolingTr.css('display', '');
				methodHeatingTr.css('display', 'none');
				
				if(!isTSIsChecked){
					setThresholdCoolingItemDisable(false);
					setThresholdHeatingItemDisable(true);
					
					temperatureOperationMethodCoolingSelect.prop('disabled', false);
					temperatureOperationMethodHeatingSelect.prop('disabled', true);
				}
			}else if(controlModeValue == 1){ // 暖
				thresholdHeatingTr.css('display', '');
				thresholdCoolingTr.css('display', 'none');
				
				methodHeatingTr.css('display', '');
				methodCoolingTr.css('display', 'none');
				
				if(!isTSIsChecked){
					setThresholdHeatingItemDisable(false);
					setThresholdCoolingItemDisable(true);
					
					temperatureOperationMethodHeatingSelect.prop('disabled', false);
					temperatureOperationMethodCoolingSelect.prop('disabled', true);
				}
			}else if(controlModeValue == 2){ // 自動
				thresholdTr.css('display', '');
				methodTr.css('display', '');
				
				if(!isTSIsChecked){
					setThresholdItemDisable(false);
					
					temperatureOperationMethodCoolingSelect.prop('disabled', false);
					temperatureOperationMethodHeatingSelect.prop('disabled', false);
				}
			}
		}else if(value == 1 || value == 5){// 温度帯制御
			zoneTr.removeClass('hide');
			if(!isTSIsChecked){
				setThresholdItemDisable(true);
			}
			// 冷
			if(controlModeValue == 0){
				zoneCoolingTr.css('display', '');
				zoneHeatingTr.css('display', 'none');
				
				methodCoolingTr.css('display', '');
				methodHeatingTr.css('display', 'none');

				if(!isTSIsChecked){
					setZoneCoolingItemDisable(false);
					setZoneHeatingItemDisable(true);
					
					temperatureOperationMethodCoolingSelect.prop('disabled', false);
					temperatureOperationMethodHeatingSelect.prop('disabled', true);
				}
			}else if(controlModeValue == 1){ // 暖
				zoneHeatingTr.css('display', '');
				zoneCoolingTr.css('display', 'none');
				
				methodHeatingTr.css('display', '');
				methodCoolingTr.css('display', 'none');
				
				if(!isTSIsChecked){
					setZoneHeatingItemDisable(false);
					setZoneCoolingItemDisable(true);
					
					temperatureOperationMethodHeatingSelect.prop('disabled', false);
					temperatureOperationMethodCoolingSelect.prop('disabled', true);
				}
			}else if(controlModeValue == 2){ // 自動
				zoneTr.css('display', '');
				methodTr.css('display', '');
				
				if(!isTSIsChecked){
					setZoneItemDisable(false);
					
					temperatureOperationMethodHeatingSelect.prop('disabled', false);
					temperatureOperationMethodCoolingSelect.prop('disabled', false);
				}
			}
		}
		
		if(value == 5){// co2濃度帯制御
			tempSpan.addClass('hide');
			tempSensorDiv.addClass('hide');
			tempSensorCheck.prop('disabled', true);
			
			co2Span.removeClass('hide');
			co2SensorDiv.removeClass('hide');
			co2SensorCheck.prop('disabled', false);
			
			if($('[name="controlMode"][value="2"]').prop('checked')){
				$('[name="controlMode"][value="2"]').prop('checked', false);
			}
			
			watchingThresholdHumidityUpperDeleteCheck.prop('checked', true);
			watchingThresholdHumidityUpperDeleteCheck.change();
		}else{
			co2SensorDiv.addClass('hide');
			co2SensorCheck.prop('disabled', true);
			
			tempSensorDiv.removeClass('hide');
			tempSensorCheck.prop('disabled', false);
			
			watchingThresholdHumidityUpperDeleteCheck.prop('checked', false);
			watchingThresholdHumidityUpperDeleteCheck.change();
		}
	}
});
//_____ 環境制御モード

var tempSensorIdsDeleteCheckItems = [
	watchingThresholdHumidityLowerDeleteCheck,
	watchingThresholdHumidityUpperDeleteCheck,
	offsetTemperatureModeChangeDeleteCheck,
	temperatureControlModeDeleteCheck
];
temperatureSensorIdsDeleteCheck.change(function(){
	var item = $(this);
	var flag = this.checked;
	// チェックする時は，チェックを入れる前に処理をする
	//　チックを外す時は，先にチェックを外す
	item.prop('checked', false);
	
	for(var i = 0; i < tempSensorIdsDeleteCheckItems.length; i++){
		tempSensorIdsDeleteCheckItems[i].prop('checked', flag);
		tempSensorIdsDeleteCheckItems[i].change();
	}
	
	item.prop('checked', flag);
	temperatureSensorIdsCheck.prop('disabled', flag);
});

var thresholdCheckItems = [
	[targetTemperatureCoolingText],
	[offsetTemperatureCoolingText],
	[targetTemperatureHeatingText],
	[offsetTemperatureHeatingText],
	[watchingThresholdTemperatureCoolingOnText],
	[watchingThresholdTemperatureCoolingText],
	[watchingThresholdTemperatureHeatingOnText],
	[watchingThresholdTemperatureHeatingText],
	[watchingThresholdTemperatureCoolingDemandText],
	[watchingThresholdTemperatureHeatingDemandText]
];

temperatureControlModeDeleteCheck.change(function(){
	if(!this.checked){
		if(temperatureSensorIdsDeleteCheck.prop('checked')){
			this.checked = true;
		}
	}
	
	if(this.checked){
		temperatureControlModeSelect.prop('selectedIndex', 0);
		
		temperatureOperationMethodCoolingSelect.prop('disabled', true);
		temperatureOperationMethodHeatingSelect.prop('disabled', true);
		
		setTemperatureControlModeItemDisable(true);
	}else{
		setTemperatureControlModeItemDisable(false);
	}
	
	temperatureControlModeSelect.prop('disabled', this.checked);
	temperatureControlModeSelect.change();
});

electricEnergySensorIdDeleteCheck.change(function(){
	if(this.checked){
		electricEnergySensorIdSelect.prop('selectedIndex', 0);
		demandMailSelect.val('');
	}
	
	electricEnergySensorIdSelect.prop('disabled', this.checked);
	
	watchingThresholdElectricEnergyOnText.prop('disabled', this.checked);
	watchingThresholdElectricEnergyOnDeleteCheck.prop('checked', this.checked);
	watchingThresholdElectricEnergyOffText.prop('disabled', this.checked);
	watchingThresholdElectricEnergyOffDeleteCheck.prop('checked', this.checked);
	
	watchingTimeText.prop('disabled', this.checked);
	watchingTimeDeleteCheck.prop('checked', this.checked);
});

onSecondDeleteCheck.change(function(){
	onSecondText.prop('disabled', this.checked);
	offSecondText.prop('disabled', this.checked);
	offSecondDeleteCheck.prop('checked', this.checked);
});

offSecondDeleteCheck.change(function(){
	offSecondText.prop('disabled', this.checked);
	onSecondText.prop('disabled', this.checked);
	onSecondDeleteCheck.prop('checked', this.checked);
});

watchingThresholdElectricEnergyOnDeleteCheck.change(function(){
	
	var item = $(this);
	if(electricEnergySensorIdDeleteCheck.prop('checked'))
		item.prop('checked', true);
	else{
		
		commonOnCheckBoxChange(item, watchingThresholdElectricEnergyOnText);
		
		watchingThresholdElectricEnergyOffDeleteCheck.prop('checked', item.prop('checked'));
		commonOnCheckBoxChange(watchingThresholdElectricEnergyOffDeleteCheck, watchingThresholdElectricEnergyOffText);
		
		watchingTimeDeleteCheck.prop('checked', item.prop('checked'));
		commonOnCheckBoxChange(watchingTimeDeleteCheck, watchingTimeText);
	}
});

watchingThresholdElectricEnergyOffDeleteCheck.change(function(){
	
	var item = $(this);
	if(electricEnergySensorIdDeleteCheck.prop('checked'))
		item.prop('checked', true);
	else
		commonOnCheckBoxChange(item, watchingThresholdElectricEnergyOffText);
});

watchingTimeDeleteCheck.change(function(){
	
	var item = $(this);
	if(electricEnergySensorIdDeleteCheck.prop('checked'))
		item.prop('checked', true);
	else{
		
		commonOnCheckBoxChange(item, watchingTimeText);
		
		watchingThresholdElectricEnergyOnDeleteCheck.prop('checked', item.prop('checked'));
		commonOnCheckBoxChange(watchingThresholdElectricEnergyOnDeleteCheck, watchingThresholdElectricEnergyOnText);
		
		watchingThresholdElectricEnergyOffDeleteCheck.prop('checked', item.prop('checked'));
		commonOnCheckBoxChange(watchingThresholdElectricEnergyOffDeleteCheck, watchingThresholdElectricEnergyOffText);
	}
});

estimateThresholdElectricEnergyDeleteCheck.change(function(){
	estimateThresholdElectricEnergyText.prop('disabled', this.checked);
	demandMailSelect.prop('disabled', this.checked);
	demandMailDeleteCheck.prop('checked', this.checked);
});

alarmLockTimeDelete.change(function(){
	alarmLockTime.prop('disabled', this.checked);
});

//***** デマンド警報メール設定削除チェック動作
demandMailDeleteCheck.change(function(){
	
	var item = $(this);
	var flag = item.prop('checked');
	
	demandMailSelect.prop('disabled', flag);		
	
	estimateThresholdElectricEnergyText.prop('disabled', flag);
	estimateThresholdElectricEnergyDeleteCheck.prop('checked', flag);
});
//_____ デマンド警報メール設定削除チェック動作

//***** 設定削除のチェック状態により設定をdisableまたは非disable
function commonOnCheckBoxChange(deleteItem, item){
	if(deleteItem.prop('checked')){
		item.prop('disabled', true);
	}else{
		item.prop('disabled', false);
	}
}
//_____ 設定削除のチェック状態により設定をdisableまたは非disable

offsetTemperatureModeChangeDeleteCheck.change(function(){
	var item = $(this);
	if(!this.checked){
		if(temperatureSensorIdsDeleteCheck.prop('checked')){
			item.prop('checked', true);
		}
	}
	commonOnCheckBoxChange(item, offsetTemperatureModeChangeText);
});

offsetTemperatureModeChangeHeatingDeleteCheck.change(function(){
	commonOnCheckBoxChange($(this), offsetTemperatureModeChangeHeatingText);
});

watchingThresholdHumidityLowerDeleteCheck.change(function(){
	var item = $(this);
	if(!this.checked){
		if(temperatureSensorIdsDeleteCheck.prop('checked')){
			item.prop('checked', true);
		}
	}
	commonOnCheckBoxChange(item, watchingThresholdHumidityLowerText);
	
	watchingThresholdHumidityUpperDeleteCheck.prop('checked', this.checked);
	commonOnCheckBoxChange(watchingThresholdHumidityUpperDeleteCheck, watchingThresholdHumidityUpperText);
});

watchingThresholdHumidityUpperDeleteCheck.change(function(){
	var item = $(this);
	if(!this.checked){
		if(temperatureSensorIdsDeleteCheck.prop('checked')){
			item.prop('checked', true);
		}
	}
	commonOnCheckBoxChange(item, watchingThresholdHumidityUpperText);
		
	watchingThresholdHumidityLowerDeleteCheck.prop('checked', item.prop('checked'));
	commonOnCheckBoxChange(watchingThresholdHumidityLowerDeleteCheck, watchingThresholdHumidityLowerText);
});

var controlSettingWhileAutoSpan = $('#controlSettingWhileAuto');
var hideWhileManualTr = $('#hide_while_manual');
var controlSettingWhileAutoFlag = $('[name="controlSettingWhileAutoFlag"]');
var controlSettingWhileAutoHref = $('#controlSettingWhileAutoHref');

//***** 手動 / 自動　select　動作
nodeControlSelect.change(function(){
	// 手動
	if(this.value == 0){
		enOrDisableAll(true);

		controlSettingWhileAutoSpan.css('display', '');
		hideWhileManualTr.css('display', 'none');
	}else{ // 自動
		enOrDisableAll(false);

		controlSettingWhileAutoSpan.css('display', 'none');
		hideWhileManualTr.css('display', '');
		controlSettingWhileAutoFlag.val('');
	}
});
//_____ 手動 / 自動　select　動作

monthCheck.change(function(){
	if($('.month-check:checked').length == 12){ // all
		$('[name="allMonthRadio"][value="all"]').prop('checked', true);
	}else{ // specify
		$('[name="allMonthRadio"][value="not"]').prop('checked', true);
	}
});

dayCheck.change(function(){
	if($('.day-check:checked').length == 31) // all
		$('[name="allDayRadio"][value="all"]').prop('checked', true);
	else // specify
		$('[name="allDayRadio"][value="not"]').prop('checked', true);
});

hourCheck.change(function(){
	if($('.hour-check:checked').length == 24) // all
		$('[name="allHourRadio"][value="all"]').prop('checked', true);
	else // specify
		$('[name="allHourRadio"][value="not"]').prop('checked', true);
});

minuteCheck.change(function(){
	if($('.minute-check:checked').length == 60) // all
		$('[name="allMinuteRadio"][value="all"]').prop('checked', true);
	else // specify
		$('[name="allMinuteRadio"][value="not"]').prop('checked', true);
});

weekCheck.change(function(){
	if($('.week-check:checked').length == 7)// all
		$('[name="allWeekRadio"][value="all"]').prop('checked', true);
	else// specify
		$('[name="allWeekRadio"][value="not"]').prop('checked', true);
});

//***** 制御開始維持閾値温度 / 閾値不快指数（冷）設定削除チェック動作
checkWatchingThresholdTemperatureCoolingKeepDelete.change(function(){
	
	textWatchingThresholdTemperatureCoolingKeep.prop('disabled', this.checked);
	checkWatchingThresholdTemperatureCoolingKeepSecDelete.prop('checked', this.checked);
	commonOnCheckBoxChange(checkWatchingThresholdTemperatureCoolingKeepSecDelete, textWatchingThresholdTemperatureCoolingKeepSec);
});
//_____ 制御開始維持閾値温度 / 閾値不快指数（冷）設定削除チェック動作

//***** 制御開始維持秒数（冷）設定削除チェック動作
checkWatchingThresholdTemperatureCoolingKeepSecDelete.change(function(){
	textWatchingThresholdTemperatureCoolingKeepSec.prop('disabled', this.checked);
	checkWatchingThresholdTemperatureCoolingKeepDelete.prop('checked', this.checked);
	commonOnCheckBoxChange(checkWatchingThresholdTemperatureCoolingKeepDelete, textWatchingThresholdTemperatureCoolingKeep);
});
//_____ 制御開始維持秒数（冷）設定削除チェック動作

//***** 制御開始維持閾値温度 / 閾値不快指数（暖）設定削除チェック動作
checkWatchingThresholdTemperatureHeatingKeepDelete.change(function(){
	textWatchingThresholdTemperatureHeatingKeep.prop('disabled', this.checked);
	checkWatchingThresholdTemperatureHeatingKeepSecDelete.prop('checked', this.checked);
	commonOnCheckBoxChange(checkWatchingThresholdTemperatureHeatingKeepSecDelete, textWatchingThresholdTemperatureHeatingKeepSec);
});
//_____ 制御開始維持閾値温度 / 閾値不快指数（暖）設定削除チェック動作

//***** 制御開始維持秒数（暖）設定削除チェック動作
checkWatchingThresholdTemperatureHeatingKeepSecDelete.change(function(){
	textWatchingThresholdTemperatureHeatingKeepSec.prop('disabled', this.checked);
	checkWatchingThresholdTemperatureHeatingKeepDelete.prop('checked', this.checked);
	commonOnCheckBoxChange(checkWatchingThresholdTemperatureHeatingKeepDelete, textWatchingThresholdTemperatureHeatingKeep);
});
//_____ 制御開始維持秒数（暖）設定削除チェック動作

//***** デマンド制御時閾値温度 / 閾値不快指数（冷）設定削除チェック動作
watchingThresholdTemperatureCoolingDemandDelete.change(function(){
	var isChecked = $(this).prop('checked');
	watchingThresholdTemperatureCoolingDemandText.prop('disabled', isChecked);
	
	var controlModeValue = $('[name="controlMode"]:checked').val();
	// 制御モード自動
	if(controlModeValue == 2){
		watchingThresholdTemperatureHeatingDemandDelete.prop('checked', isChecked);
		watchingThresholdTemperatureHeatingDemandText.prop('disabled', isChecked);
	}
});
//_____ デマンド制御時閾値温度 / 閾値不快指数（冷）設定削除チェック動作

watchingThresholdTemperatureHeatingDemandDelete.change(function(){
	var isChecked = $(this).prop('checked');
	watchingThresholdTemperatureHeatingDemandText.prop('disabled', isChecked);
	
	var controlModeValue = $('[name="controlMode"]:checked').val();
	if(controlModeValue == 2 || controlModeValue == 4){
		watchingThresholdTemperatureCoolingDemandDelete.prop('checked', isChecked);
		watchingThresholdTemperatureCoolingDemandText.prop('disabled', isChecked);
	}
});

//***** 自動時制御設定リンククリック動作
controlSettingWhileAutoHref.click(function(){
	enOrDisableAll(false);
	onOffControlSelect.prop('disabled', false);
	hideWhileManualTr.css('display', '');
	controlSettingWhileAutoFlag.val('y');
});
//_____ 自動時制御設定リンククリック動作

var allItems = [
	[onSecondText, onSecondDeleteCheck],
	[offSecondText, offSecondDeleteCheck],
	[targetTemperatureCoolingText],
	[offsetTemperatureCoolingText],
	[targetTemperatureHeatingText],
	[offsetTemperatureHeatingText],
	[temperatureSensorIdsCheck, temperatureSensorIdsDeleteCheck],
	[electricEnergySensorIdSelect, electricEnergySensorIdDeleteCheck],
	[watchingThresholdElectricEnergyOnText, watchingThresholdElectricEnergyOnDeleteCheck],
	[watchingThresholdElectricEnergyOffText, watchingThresholdElectricEnergyOffDeleteCheck],
	[watchingTimeText, watchingTimeDeleteCheck],
	[estimateThresholdElectricEnergyText, estimateThresholdElectricEnergyDeleteCheck],
	[alarmLockTime, alarmLockTimeDelete],
	[demandMailSelect, demandMailDeleteCheck],
	[offsetTemperatureModeChangeText, offsetTemperatureModeChangeDeleteCheck],
	[offsetTemperatureModeChangeHeatingText, offsetTemperatureModeChangeHeatingDeleteCheck],
	[watchingThresholdTemperatureCoolingOnText],
	[watchingThresholdTemperatureCoolingText],
	[textWatchingThresholdTemperatureCoolingKeep, checkWatchingThresholdTemperatureCoolingKeepDelete],
	[textWatchingThresholdTemperatureCoolingKeepSec, checkWatchingThresholdTemperatureCoolingKeepSecDelete],
	[watchingThresholdTemperatureHeatingOnText],
	[watchingThresholdTemperatureHeatingText],
	[textWatchingThresholdTemperatureHeatingKeep, checkWatchingThresholdTemperatureHeatingKeepDelete],
	[textWatchingThresholdTemperatureHeatingKeepSec, checkWatchingThresholdTemperatureHeatingKeepSecDelete],
	[watchingThresholdTemperatureCoolingDemandText],
	[watchingThresholdTemperatureHeatingDemandText],
	[watchingThresholdHumidityLowerText, watchingThresholdHumidityLowerDeleteCheck],
	[watchingThresholdHumidityUpperText, watchingThresholdHumidityUpperDeleteCheck],
	[temperatureControlModeSelect, temperatureControlModeDeleteCheck]
];

function enOrDisableAll(flag){
	onOffControlSelect.prop('disabled', !flag);
	controlModeRadio.prop('disabled', flag);

	temperatureOperationMethodCoolingSelect.prop('disabled', flag);
	temperatureOperationMethodHeatingSelect.prop('disabled', flag);
	
	var itemArr = null;
	for(var i = 0; i < allItems.length; i++){
		itemArr = allItems[i];
		
		for(var j = 0; j < itemArr.length; j++){
			itemArr[j].prop('disabled', flag);
		}
	}
	sos.operationRate.disabled = flag;
	sos.operationRateJudgeSec.disabled = flag;
	sos.operationRateJudgeMode.disabled = flag;
	if(!flag){
		sos.operationRateDelete.disabled = sos.channelType.value == 1;
		sos.operationRateJudgeSecDelete.disabled = sos.channelType.value == 1;
		sos.operationRateJudgeModeDelete.disabled = sos.channelType.value == 1;
	}
	// 温度センサー削除
	temperatureSensorIdsDeleteCheck.change();
	if(!flag){
		onSecondDeleteCheck.change();
		offSecondDeleteCheck.change();
		// 電力監視閾値の設定削除にチェックをいれたら、最低通常時間の設定削除のみ入力不可にしてチェックをいれる
		watchingThresholdElectricEnergyOnDeleteCheck.change();
		if(!watchingTimeDeleteCheck.prop('disabled')){
			watchingTimeDeleteCheck.change();
		}
		// 最低通常時間の設定削除にチェックをいれたら、電力監視閾値の設定削除のみ入力不可にしてチェックをいれる
		estimateThresholdElectricEnergyDeleteCheck.change();
		if(!demandMailDeleteCheck.prop('disabled')){
			demandMailDeleteCheck.change();
		}
		// 電力量センサー削除
		if(electricEnergySensorIdDeleteCheck.prop('checked')){
			electricEnergySensorIdDeleteCheck.change();
		}
		sos.onOperationRateDeleteChange.call(sos);
		sos.onOperationRateJudgeSecDeleteChange.call(sos);
		sos.onOperationRateJudgeModeDeleteChange.call(sos);
	}
}

var temperatureControlModeItems = [
	targetTemperatureCoolingText, offsetTemperatureCoolingText,
	targetTemperatureHeatingText, offsetTemperatureHeatingText,
	watchingThresholdTemperatureCoolingOnText, watchingThresholdTemperatureCoolingText,
	watchingThresholdTemperatureHeatingOnText, watchingThresholdTemperatureHeatingText,
	watchingThresholdTemperatureCoolingDemandText, watchingThresholdTemperatureHeatingDemandText,
	temperatureOperationMethodCoolingSelect, temperatureOperationMethodHeatingSelect
];
function setTemperatureControlModeItemDisable(flag){
	
	for(var i = 0; i < temperatureControlModeItems.length; i++){
		temperatureControlModeItems[i].prop('disabled', flag);
	}
	
	watchingThresholdTemperatureCoolingDemandDelete.prop('checked', flag);
	watchingThresholdTemperatureHeatingDemandDelete.prop('checked', flag);
	
	if(flag){
		textWatchingThresholdTemperatureCoolingKeep.prop('disabled', true);
		textWatchingThresholdTemperatureCoolingKeepSec.prop('disabled', true);
		textWatchingThresholdTemperatureHeatingKeep.prop('disabled', true);
		textWatchingThresholdTemperatureHeatingKeepSec.prop('disabled', true);
		
		checkWatchingThresholdTemperatureCoolingKeepDelete.prop('checked', flag);
		checkWatchingThresholdTemperatureCoolingKeepSecDelete.prop('checked', flag);
		checkWatchingThresholdTemperatureHeatingKeepDelete.prop('checked', flag);
		checkWatchingThresholdTemperatureHeatingKeepSecDelete.prop('checked', flag);
	}else{
		checkWatchingThresholdTemperatureCoolingKeepDelete.change();
		checkWatchingThresholdTemperatureCoolingKeepSecDelete.change();
		checkWatchingThresholdTemperatureHeatingKeepDelete.change();
		checkWatchingThresholdTemperatureHeatingKeepSecDelete.change();
	}
}

var zoneItems = [
	targetTemperatureCoolingText, offsetTemperatureCoolingText,
	targetTemperatureHeatingText, offsetTemperatureHeatingText
];
function setZoneItemDisable(flag){
	
	for(var i = 0; i < zoneItems.length; i++){
		zoneItems[i].prop('disabled', flag);
	}
}

var zoneCoolingItems = [targetTemperatureCoolingText, offsetTemperatureCoolingText];
function setZoneCoolingItemDisable(flag){
	
	for(var i = 0; i < zoneCoolingItems.length; i++){
		zoneCoolingItems[i].prop('disabled', flag);
	}
}


var zoneHeatingItems = [targetTemperatureHeatingText, offsetTemperatureHeatingText];
function setZoneHeatingItemDisable(flag){
	
	for(var i = 0; i < zoneHeatingItems.length; i++){
		zoneHeatingItems[i].prop('disabled', flag);
	}
}

var thresholdItems = [
	watchingThresholdTemperatureCoolingOnText, watchingThresholdTemperatureCoolingText,
	watchingThresholdTemperatureHeatingOnText, watchingThresholdTemperatureHeatingText,
	watchingThresholdTemperatureCoolingDemandText, watchingThresholdTemperatureHeatingDemandText
];
function setThresholdItemDisable(flag){
	
	for(var i = 0; i < thresholdItems.length; i++){
		thresholdItems[i].prop('disabled', flag);
	}
	
	watchingThresholdTemperatureCoolingDemandDelete.prop('checked', flag);
	watchingThresholdTemperatureHeatingDemandDelete.prop('checked', flag);
	
	if(flag){
		textWatchingThresholdTemperatureCoolingKeep.prop('disabled', true);
		textWatchingThresholdTemperatureCoolingKeepSec.prop('disabled', true);
		textWatchingThresholdTemperatureHeatingKeep.prop('disabled', true);
		textWatchingThresholdTemperatureHeatingKeepSec.prop('disabled', true);
		checkWatchingThresholdTemperatureCoolingKeepDelete.prop('checked', flag);
		checkWatchingThresholdTemperatureCoolingKeepSecDelete.prop('checked', flag);
		checkWatchingThresholdTemperatureHeatingKeepDelete.prop('checked', flag);
		checkWatchingThresholdTemperatureHeatingKeepSecDelete.prop('checked', flag);
	}else{
		checkWatchingThresholdTemperatureCoolingKeepDelete.change();
		checkWatchingThresholdTemperatureCoolingKeepSecDelete.change();
		checkWatchingThresholdTemperatureHeatingKeepDelete.change();
		checkWatchingThresholdTemperatureHeatingKeepSecDelete.change();
	}
}

var thresholdCoolingItems = [
	watchingThresholdTemperatureCoolingOnText,
	watchingThresholdTemperatureCoolingText,
	watchingThresholdTemperatureCoolingDemandText
];
function setThresholdCoolingItemDisable(flag){
	
	for(var i = 0; i < thresholdCoolingItems.length; i++){
		thresholdCoolingItems[i].prop('disabled', flag);
	}
	
	watchingThresholdTemperatureCoolingDemandDelete.prop('checked', flag);
	
	if(flag){
		textWatchingThresholdTemperatureCoolingKeep.prop('disabled', true);
		textWatchingThresholdTemperatureCoolingKeepSec.prop('disabled', true);
		checkWatchingThresholdTemperatureCoolingKeepDelete.prop('checked', flag);
		checkWatchingThresholdTemperatureCoolingKeepSecDelete.prop('checked', flag);
	}else{
		checkWatchingThresholdTemperatureCoolingKeepDelete.change();
		checkWatchingThresholdTemperatureCoolingKeepSecDelete.change();
	}
}

var thresholdHeatingItems = [
	watchingThresholdTemperatureHeatingOnText,
	watchingThresholdTemperatureHeatingText,
	watchingThresholdTemperatureHeatingDemandText
];
function setThresholdHeatingItemDisable(flag){
	
	for(var i = 0; i < thresholdHeatingItems.length; i++){
		thresholdHeatingItems[i].prop('disabled', flag);
	}
	
	watchingThresholdTemperatureHeatingDemandDelete.prop('checked', flag);
	
	if(flag){
		textWatchingThresholdTemperatureHeatingKeep.prop('disabled', true);
		textWatchingThresholdTemperatureHeatingKeepSec.prop('disabled', true);
		checkWatchingThresholdTemperatureHeatingKeepDelete.prop('checked', flag);
		checkWatchingThresholdTemperatureHeatingKeepSecDelete.prop('checked', flag);
	}else{
		checkWatchingThresholdTemperatureHeatingKeepDelete.change();
		checkWatchingThresholdTemperatureHeatingKeepSecDelete.change();
	}
}

//> ↓　form onsubmit
document.simpleOperationScheduleFormBean.onsubmit = function(ev){
	//>> ↓↓ check controlLinkage
	//       mode, condition, node
	//>>     if one has value, the other must have value
	let isValid = validator.validate();
	//<< ↑↑ check controlLinkage
	if(isValid){
		//>>> ↓↓↓ set checked node names
		sos.controlLinkageOutput.fn.setCheckedNodeNames();
		envSensorIds.setCheckedNames();
		// set energy sensor name
		let elEsId = electricEnergySensorIdSelect[0];
		let elEsName = document.querySelector('[name="energySensorName"]');
		elEsName.value = electricEnergySensorIdSelect.val() == ''? '': elEsId.options[elEsId.selectedIndex].innerText;
	}else{
		ev = ev || window.event;
	    if(ev.preventDefault){
	    	ev.preventDefault();
	    }else{
	    	window.event.returnValue = false;
	    }
	}
};
//< ↑　form onsubmit

//*********************************************init
function init(){
	
	if(nodeControlSelect.val() == 1 || (nodeControlSelect.val() == 0 && controlSettingWhileAutoFlag.val() != '')){
		
		if(nodeControlSelect.val() == 1){
			controlSettingWhileAutoSpan.css('display', 'none');
			onOffControlSelect.prop('disabled', true);
		}
		// 省エネ運転時間、通常運転時間削除
		if(onSecondDeleteCheck.prop('checked')){
			onSecondDeleteCheck.change();
		}
		// 温度センサー削除
		if(temperatureSensorIdsDeleteCheck.prop('checked')){
			temperatureSensorIdsDeleteCheck.change();
		}else{
			// 冷暖モード切替温度削除
			offsetTemperatureModeChangeDeleteCheck.change();
			// 閾値湿度(下限)削除
			watchingThresholdHumidityLowerDeleteCheck.change();
			// 閾値湿度(上限)削除
			watchingThresholdHumidityUpperDeleteCheck.change();
			// 温度制御モード削除
			temperatureControlModeDeleteCheck.change();
		}
		// モード切替温度（暖房⇒冷房）削除
		offsetTemperatureModeChangeHeatingDeleteCheck.change();
		// 電力量センサー削除
		if(electricEnergySensorIdDeleteCheck.prop('checked')){
			electricEnergySensorIdDeleteCheck.change();
		}else{ // 電力監視閾値、最低通常時間削除

			if(watchingThresholdElectricEnergyOnDeleteCheck.prop('checked')){
				watchingThresholdElectricEnergyOnDeleteCheck.change();
			}
		}
		// 制御解除負荷電力
		watchingThresholdElectricEnergyOffDeleteCheck.change();
		// 目標電力、デマンド警報メール削除
		estimateThresholdElectricEnergyDeleteCheck.change();
		sos.onOperationRateDeleteChange.call(sos);
		sos.onOperationRateJudgeSecDeleteChange.call(sos);
		sos.onOperationRateJudgeModeDeleteChange.call(sos);
	}else {//手動の場合だけ「通常/制御」が選択できる様にする
		nodeControlSelect.change();
	}
}

let sos = new SimpleOperationSchedule();
init();
store.data.isInit = false;
//_____________________________________________________________________init