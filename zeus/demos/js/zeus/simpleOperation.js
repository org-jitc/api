// 省エネ運転時間
var textOnSecond = $('[name="onSecond"]');
// 通常運転時間
var textOffSecond = $('[name="offSecond"]');
// 設定温度(冷)
var textTargetTemperatureCooling = $('[name="targetTemperatureCooling"]');
// 許容誤差温度(冷)
var textOffsetTemperatureCooling = $('[name="offsetTemperatureCooling"]');
// 設定温度(暖)
var textTargetTemperatureHeating = $('[name="targetTemperatureHeating"]');
// 許容誤差温度(暖)
var textOffsetTemperatureHeating = $('[name="offsetTemperatureHeating"]');
// モード切替温度（冷房⇒暖房）
var textOffsetTemperatureModeChange = $('[name="offsetTemperatureModeChange"]');
// モード切替温度（暖房⇒冷房）
var textOffsetTemperatureModeChangeHeating = $('[name="offsetTemperatureModeChangeHeating"]');
// 制御開始閾値温度 / 閾値不快指数（冷）
var textThresholdTemperatureCoolingOn = $('[name="thresholdTemperatureCoolingOn"]');
// 制御開始維持閾値温度 / 閾値不快指数（冷）
var textWatchingThresholdTemperatureCoolingKeep = $('[name="watchingThresholdTemperatureCoolingKeep"]');
// 制御開始維持閾値秒数（冷）
var textWatchingThresholdTemperatureCoolingKeepSec = $('[name="watchingThresholdTemperatureCoolingKeepSec"]');
// 制御解除閾値温度 / 閾値不快指数（冷）
var textThresholdTemperatureCooling = $('[name="thresholdTemperatureCooling"]');
// 制御開始閾値温度 / 閾値不快指数（暖）
var textThresholdTemperatureHeatingOn = $('[name="thresholdTemperatureHeatingOn"]');
// 制御開始維持閾値温度 / 閾値不快指数（暖）
var textWatchingThresholdTemperatureHeatingKeep = $('[name="watchingThresholdTemperatureHeatingKeep"]');
// 制御開始維持閾値秒数（暖）
var textWatchingThresholdTemperatureHeatingKeepSec = $('[name="watchingThresholdTemperatureHeatingKeepSec"]');
// 制御解除閾値温度 / 閾値不快指数（暖）
var textThresholdTemperatureHeating = $('[name="thresholdTemperatureHeating"]');
// デマンド制御時閾値温度 / 閾値不快指数(冷)
var textThresholdTemperatureCoolingDemand = $('[name="thresholdTemperatureCoolingDemand"]');
// デマンド制御時閾値温度 / 閾値不快指数(暖)
var textThresholdTemperatureHeatingDemand = $('[name="thresholdTemperatureHeatingDemand"]');
// 閾値湿度 (下限)
var textThresholdHumidityLower = $('[name="thresholdHumidityLower"]');
// 閾値湿度 (上限)
var textThresholdHumidityUpper = $('[name="thresholdHumidityUpper"]');
// 制御開始負荷電力
var textWatchingThresholdElectricEnergyOn = $('[name="watchingThresholdElectricEnergyOn"]');
// 制御解除負荷電力
var textWatchingThresholdElectricEnergyOff = $('[name="watchingThresholdElectricEnergyOff"]');
// 最低通常時間
var textWatchingTime = $('[name="watchingTime"]');
// 目標電力
var textEstimateThresholdElectricEnergy = $('[name="estimateThresholdElectricEnergy"]');
// ノード：省エネ運転最低時間
var textOnMinMitute = $('[name="onMinMitute"]');
// ノード：通常運転最低時間
var textOffMinMitute = $('[name="offMinMitute"]');
// ノード：運転判断閾値電力
var textThresholdEnergy = $('[name="thresholdEnergy"]');
// ノード：削減電力グループ
var textReduceEnergyGroupId = $('[name="reduceEnergyGroupId"]');
// ノード：削減電力グループ内順位
var textReduceEnergyGroupPriority = $('[name="reduceEnergyGroupPriority"]');
var divHelpQuestionMark = $('.help-question-mark');
var divHelp = $('.div-help');
var formSo = $('#form-so');

var controlMode = $('[name="controlMode"]');
var temperatureControlMode = $('[name="temperatureControlMode"]');
var temperatureOperationMethodCooling = $('[name="temperatureOperationMethodCooling"]');
var temperatureOperationMethodHeating = $('[name="temperatureOperationMethodHeating"]');
var nodeId = $('[name="nodeId"]');
var eesIdForNode = $('[name="eesIdForNode"]');
var inputWatchingTarget = $('[name="inputWatchingTarget"]');
var inputWatchingProcess = $('[name="inputWatchingProcess"]');

var thresholdCoolingTr = $('.thresholdCoolingTr');
var thresholdHeatingTr = $('.thresholdHeatingTr');
var zoneCoolingTr = $('.zoneCoolingTr');
var zoneHeatingTr = $('.zoneHeatingTr');
// すべての制御モードのｔｒ
var zoneTr = $('.zoneTr');
var thresholdTr = $('.thresholdTr');
var methodCoolTr = $('.methodCoolTr');
var methodHeatTr = $('.methodHeatTr');
var modeChangeTr = $('.modeChangeTr');
// 温度センサー
var tempSensorTr = $('.sensor-temp');
var tempSensorCheck = $('[name="tempeartureSensorIds"]');
// co2センサー
var co2SensorTr = $('.sensor-co2');
var co2SensorCheck = $('[name="co2SensorIds"]');
// 制御モード：　環境制御モードがCO2の場合
var controlModeCo2 = $('.controlMode-co2');
// 制御モード：　環境制御モードがCO2でない場合
var controlModeNotCo2 = $('.controlMode-notCo2');
// temp threshold mode
var tcm2 = $('.tcm-2');
// di threshold mode
var tcm4 = $('.tcm-4');

let envSensorIds = function(){
	
	let listEnv = document.querySelectorAll('[name="temperatureSensorIds"]');
	let listCo2 = document.querySelectorAll('[name="co2SensorIds"]');
	let envNames = document.querySelector('[name="envSensorNames"]');
	
	function setCheckedNames(){
		let arrName = [], item;
		for(let i = 0, l = listEnv.length; i < l; i++){
			item = listEnv[i];
			if(!item.disabled && item.checked){
				arrName.push(item.nextElementSibling.innerText);
			}
		}
		for(let i = 0, l = listCo2.length; i < l; i++){
			item = listCo2[i];
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

textOnSecond.on('input propertychange', trimFunction);
textOffSecond.on('input propertychange', trimFunction);

textTargetTemperatureCooling.on('input propertychange', trimFunction);
textOffsetTemperatureCooling.on('input propertychange', trimFunction);
textTargetTemperatureHeating.on('input propertychange', trimFunction);
textOffsetTemperatureHeating.on('input propertychange', trimFunction);

textOffsetTemperatureModeChange.on('input propertychange', trimFunction);
textOffsetTemperatureModeChangeHeating.on('input propertychange', trimFunction);

textThresholdTemperatureCoolingOn.on('input propertychange', trimFunction);
textWatchingThresholdTemperatureCoolingKeep.on('input propertychange', trimFunction);
textWatchingThresholdTemperatureCoolingKeepSec.on('input propertychange', trimFunction);
textThresholdTemperatureCooling.on('input propertychange', trimFunction);

textThresholdTemperatureHeatingOn.on('input propertychange', trimFunction);
textWatchingThresholdTemperatureHeatingKeep.on('input propertychange', trimFunction);
textWatchingThresholdTemperatureHeatingKeepSec.on('input propertychange', trimFunction);
textThresholdTemperatureHeating.on('input propertychange', trimFunction);

textThresholdTemperatureCoolingDemand.on('input propertychange', trimFunction);
textThresholdTemperatureHeatingDemand.on('input propertychange', trimFunction);

textThresholdHumidityLower.on('input propertychange', trimFunction);
textThresholdHumidityUpper.on('input propertychange', trimFunction);

textWatchingThresholdElectricEnergyOn.on('input propertychange', trimFunction);
textWatchingThresholdElectricEnergyOff.on('input propertychange', trimFunction);
textWatchingTime.on('input propertychange', trimFunction);
textEstimateThresholdElectricEnergy.on('input propertychange', trimFunction);

textOnMinMitute.on('input propertychange', trimFunction);
textOffMinMitute.on('input propertychange', trimFunction);
textThresholdEnergy.on('input propertychange', trimFunction);
textReduceEnergyGroupId.on('input propertychange', trimFunction);
textReduceEnergyGroupPriority.on('input propertychange', trimFunction);

// 制御モード
controlMode.change(function(){
	
	var item = $(this);
	var tempModeValue = temperatureControlMode.val();
	modeChangeTr.addClass('hide');
	
	if(tempModeValue != ''){
		
		// 冷
		if(item.val() == 0){
			
			// 閾値制御
			if(tempModeValue == 2 || tempModeValue == 4){
				
				thresholdCoolingTr.css('display', '');
				thresholdHeatingTr.css('display', 'none');
				
				textThresholdTemperatureCoolingOn.prop('disabled', false);
				textThresholdTemperatureCooling.prop('disabled', false);
				textThresholdTemperatureCoolingDemand.prop('disabled', false);
				textWatchingThresholdTemperatureCoolingKeep.prop('disabled', false);
				textWatchingThresholdTemperatureCoolingKeepSec.prop('disabled', false);
				
				textThresholdTemperatureHeatingOn.prop('disabled', true);
				textThresholdTemperatureHeating.prop('disabled', true);
				textThresholdTemperatureHeatingDemand.prop('disabled', true);
				textWatchingThresholdTemperatureHeatingKeep.prop('disabled', true);
				textWatchingThresholdTemperatureHeatingKeepSec.prop('disabled', true);
				
				textTargetTemperatureCooling.prop('disabled', true);
				textOffsetTemperatureCooling.prop('disabled', true);
				textTargetTemperatureHeating.prop('disabled', true);
				textOffsetTemperatureHeating.prop('disabled', true);
			}else{// 温度帯制御、CO2濃度帯制御
				
				zoneCoolingTr.css('display', '');
				zoneHeatingTr.css('display', 'none');
				
				textTargetTemperatureCooling.prop('disabled', false);
				textOffsetTemperatureCooling.prop('disabled', false);
				textTargetTemperatureHeating.prop('disabled', true);
				textOffsetTemperatureHeating.prop('disabled', true);
				
				textThresholdTemperatureHeatingOn.prop('disabled', true);
				textThresholdTemperatureHeating.prop('disabled', true);
				textThresholdTemperatureHeatingDemand.prop('disabled', true);
				
				textThresholdTemperatureCoolingOn.prop('disabled', true);
				textThresholdTemperatureCooling.prop('disabled', true);
				textThresholdTemperatureCoolingDemand.prop('disabled', true);
			}
			
			methodCoolTr.css('display', '');
			methodHeatTr.css('display', 'none');
			
			temperatureOperationMethodCooling.prop('disabled', false);
			temperatureOperationMethodHeating.prop('disabled', true);
		}else if(item.val() == 1){// 暖
			
			// 閾値制御
			if(tempModeValue == 2 || tempModeValue == 4){
				
				thresholdCoolingTr.css('display', 'none');
				thresholdHeatingTr.css('display', '');
				
				textThresholdTemperatureHeatingOn.prop('disabled', false);
				textThresholdTemperatureHeating.prop('disabled', false);
				textThresholdTemperatureHeatingDemand.prop('disabled', false);
				textWatchingThresholdTemperatureHeatingKeep.prop('disabled', false);
				textWatchingThresholdTemperatureHeatingKeepSec.prop('disabled', false);
				
				textThresholdTemperatureCoolingOn.prop('disabled', true);
				textThresholdTemperatureCooling.prop('disabled', true);
				textThresholdTemperatureCoolingDemand.prop('disabled', true);
				textWatchingThresholdTemperatureCoolingKeep.prop('disabled', true);
				textWatchingThresholdTemperatureCoolingKeepSec.prop('disabled', true);
				
				textTargetTemperatureCooling.prop('disabled', true);
				textOffsetTemperatureCooling.prop('disabled', true);
				textTargetTemperatureHeating.prop('disabled', true);
				textOffsetTemperatureHeating.prop('disabled', true);
			}else{// 温度帯制御、CO2濃度帯制御
				
				zoneCoolingTr.css('display', 'none');
				zoneHeatingTr.css('display', '')
				
				textTargetTemperatureCooling.prop('disabled', true);
				textOffsetTemperatureCooling.prop('disabled', true);
				textTargetTemperatureHeating.prop('disabled', false);
				textOffsetTemperatureHeating.prop('disabled', false);
				
				textThresholdTemperatureHeatingOn.prop('disabled', true);
				textThresholdTemperatureHeating.prop('disabled', true);
				textThresholdTemperatureHeatingDemand.prop('disabled', true);
				
				textThresholdTemperatureCoolingOn.prop('disabled', true);
				textThresholdTemperatureCooling.prop('disabled', true);
				textThresholdTemperatureCoolingDemand.prop('disabled', true);
			}
			
			methodCoolTr.css('display', 'none');
			methodHeatTr.css('display', '');
			
			temperatureOperationMethodCooling.prop('disabled', true);
			temperatureOperationMethodHeating.prop('disabled', false);
		}else{// 自動
			
			// 閾値制御
			if(tempModeValue == 2 || tempModeValue == 4){
				
				thresholdCoolingTr.css('display', '');
				thresholdHeatingTr.css('display', '');
				
				textThresholdTemperatureHeatingOn.prop('disabled', false);
				textThresholdTemperatureHeating.prop('disabled', false);
				textThresholdTemperatureHeatingDemand.prop('disabled', false);
				textWatchingThresholdTemperatureHeatingKeep.prop('disabled', false);
				textWatchingThresholdTemperatureHeatingKeepSec.prop('disabled', false);
				
				textThresholdTemperatureCoolingOn.prop('disabled', false);
				textThresholdTemperatureCooling.prop('disabled', false);
				textThresholdTemperatureCoolingDemand.prop('disabled', false);
				textWatchingThresholdTemperatureCoolingKeep.prop('disabled', false);
				textWatchingThresholdTemperatureCoolingKeepSec.prop('disabled', false);
				
				textTargetTemperatureCooling.prop('disabled', true);
				textOffsetTemperatureCooling.prop('disabled', true);
				textTargetTemperatureHeating.prop('disabled', true);
				textOffsetTemperatureHeating.prop('disabled', true);
				
				modeChangeTr.removeClass('hide');
			}else if(tempModeValue == 1){// 温度帯制御
				
				zoneCoolingTr.css('display', '');
				zoneHeatingTr.css('display', '');
				
				textTargetTemperatureCooling.prop('disabled', false);
				textOffsetTemperatureCooling.prop('disabled', false);
				textTargetTemperatureHeating.prop('disabled', false);
				textOffsetTemperatureHeating.prop('disabled', false);
				
				textThresholdTemperatureHeatingOn.prop('disabled', true);
				textThresholdTemperatureHeating.prop('disabled', true);
				textThresholdTemperatureHeatingDemand.prop('disabled', true);
				
				textThresholdTemperatureCoolingOn.prop('disabled', true);
				textThresholdTemperatureCooling.prop('disabled', true);
				textThresholdTemperatureCoolingDemand.prop('disabled', true);
				
				modeChangeTr.removeClass('hide');
			}
			
			methodCoolTr.css('display', '');
			methodHeatTr.css('display', '');
			
			temperatureOperationMethodCooling.prop('disabled', false);
			temperatureOperationMethodHeating.prop('disabled', false);
		}
	}
	
	// モード切替温度
	if(item.val() == 2){
		
		textOffsetTemperatureModeChange.prop('disabled', false);
		textOffsetTemperatureModeChangeHeating.prop('disabled', false);
	}else{
		
		textOffsetTemperatureModeChange.prop('disabled', true);
		textOffsetTemperatureModeChangeHeating.prop('disabled', true);
	}
});

temperatureControlMode.change(function(){
	
	zoneTr.addClass('hide');
	thresholdTr.addClass('hide');
	methodCoolTr.addClass('hide');
	methodHeatTr.addClass('hide');
	co2SensorTr.addClass('hide');
	tempSensorTr.addClass('hide');
	controlModeCo2.addClass('hide');
	controlModeNotCo2.addClass('hide');
	tcm2.addClass('hide');
	tcm4.addClass('hide');
	// 温度帯制御
	textTargetTemperatureCooling.prop('disabled', true);
	textOffsetTemperatureCooling.prop('disabled', true);
	textTargetTemperatureHeating.prop('disabled', true);
	textOffsetTemperatureHeating.prop('disabled', true);
	// 閾値制御
	textThresholdTemperatureCoolingOn.prop('disabled', true);
	textThresholdTemperatureCooling.prop('disabled', true);
	textThresholdTemperatureHeatingOn.prop('disabled', true);
	textThresholdTemperatureHeating.prop('disabled', true);
	textThresholdTemperatureCoolingDemand.prop('disabled', true);
	textThresholdTemperatureHeatingDemand.prop('disabled', true);
	textWatchingThresholdTemperatureCoolingKeep.prop('disabled', true);
	textWatchingThresholdTemperatureCoolingKeepSec.prop('disabled', true);
	textWatchingThresholdTemperatureHeatingKeep.prop('disabled', true);
	textWatchingThresholdTemperatureHeatingKeepSec.prop('disabled', true);
	// 温度制御モード
	temperatureOperationMethodCooling.prop('disabled', true);
	temperatureOperationMethodHeating.prop('disabled', true);
	
	controlModeCo2.addClass('hide');
	
	tempSensorCheck.prop('disabled', true);
	co2SensorCheck.prop('disabled', true);
	
	var value = temperatureControlMode.val();
	if(value == ''){
		
		tempSensorTr.removeClass('hide');
		tempSensorCheck.prop('disabled', false);
		
		controlModeNotCo2.removeClass('hide');
	}else{
		
		methodCoolTr.removeClass('hide');
		methodHeatTr.removeClass('hide');
		
		textThresholdTemperatureCoolingDemand.prop('disabled', false);
		textThresholdTemperatureHeatingDemand.prop('disabled', false);
		
		// 温度制御モード
		temperatureOperationMethodCooling.prop('disabled', false);
		temperatureOperationMethodHeating.prop('disabled', false);
		
		// 温度閾値制御または不快指数閾値制御
		if(value == 2 || value == 4){
			
			if(value == 2)
				tcm2.removeClass('hide');
			else
				tcm4.removeClass('hide');
			
			// 温度帯制御非表示
			//　閾値制御表示
			thresholdTr.removeClass('hide');
			
			// 温度帯制御disable true
			textTargetTemperatureCooling.prop('disabled', true);
			textOffsetTemperatureCooling.prop('disabled', true);
			textTargetTemperatureHeating.prop('disabled', true);
			textOffsetTemperatureHeating.prop('disabled', true);
			
			// 閾値制御disable false
			textThresholdTemperatureCoolingOn.prop('disabled', false);
			textThresholdTemperatureCooling.prop('disabled', false);
			textThresholdTemperatureHeatingOn.prop('disabled', false);
			textThresholdTemperatureHeating.prop('disabled', false);
			textWatchingThresholdTemperatureCoolingKeep.prop('disabled', false);
			textWatchingThresholdTemperatureCoolingKeepSec.prop('disabled', false);
			textWatchingThresholdTemperatureHeatingKeep.prop('disabled', false);
			textWatchingThresholdTemperatureHeatingKeepSec.prop('disabled', false);
		}else if(value == 1){// 温度帯制御
			
			// 温度帯制御表示
			zoneTr.removeClass('hide');
			
			// 閾値制御非表示
			
			// 温度帯制御disable false 
			textTargetTemperatureCooling.prop('disabled', false);
			textOffsetTemperatureCooling.prop('disabled', false);
			textTargetTemperatureHeating.prop('disabled', false);
			textOffsetTemperatureHeating.prop('disabled', false);
			
			// 閾値制御disable true
			textThresholdTemperatureCoolingOn.prop('disabled', true);
			textThresholdTemperatureCooling.prop('disabled', true);
			textThresholdTemperatureHeatingOn.prop('disabled', true);
			textThresholdTemperatureHeating.prop('disabled', true);
		}
		
		if(value == 5){// co2濃度帯制御の場合は，co2センサーを表示、温度センサーを非表示
			
			zoneTr.removeClass('hide');
			
			co2SensorCheck.prop('disabled', false);
			co2SensorTr.removeClass('hide');
			co2SensorCheck.prop('disabled', false);
			
			controlModeCo2.removeClass('hide');
			
			co2SensorCheck.prop('disabled', false);
			if($('[name="controlMode"]:checked').val() == 2)
				$('[name="controlMode"][value="0"]').prop('checked', true);
		}else{// co2濃度帯制御以外の場合は，CO2センサーを非表示，温度センサーを表示
			
			tempSensorCheck.prop('disabled', false);
			tempSensorTr.removeClass('hide');
			tempSensorCheck.prop('disabled', false);
			
			controlModeNotCo2.removeClass('hide');
		}
	}
	
	$('[name="controlMode"]:checked').change();
});

function clearNodeInformation(){
	
	// demandControl
	$('[name="demandControl"][value="1"]').prop('checked', true);
	// omMinMitute
	textOnMinMitute.val('');
	// offMinMitute
	textOffMinMitute.val('');
	// eesIdForNode
	eesIdForNode.val('');
	// thresholdEenrgy
	textThresholdEnergy.val('');
	// inputWatchingTarget
	inputWatchingTarget.val('');
	// inputWatchingProcess
	inputWatchingProcess.val('');
	// reduceEnergyGroupId
	textReduceEnergyGroupId.val('');
	// reduceEnergyGroupPriority
	textReduceEnergyGroupPriority.val('');
}

function SimpleOperation(){
	this.helpOptionToggleCheck = $('#helpOptionToggle');
	let form = document.querySelector('#form-so');
	var selectNodeId = $('[name="nodeId"]');
	var selectEesIdForNode = $('[name="eesIdForNode"]');
	var selectElectricEenergySensorId = $('[name="electricEnergySensorId"]');
	var hiddenElectricEnergySensorName = $('[name="electricEnergySensorName"]');
	var selectInputWatchingTarget = $('[name="inputWatchingTarget"]');
	var hiddenInputWatchingTargetName = $('[name="inputWatchingTargetName"]');
	let controlLinkageOutput = {
		el: {
			mode: document.querySelector('[name="controlLinkNodePriority"]'),
			nodeIds: document.querySelectorAll('[name="controlLinkNodeIds"]'),
			nodeNames: document.querySelector('[name="controlLinkNodeNames"]')
		},
		fn: {
			setCheckedNodeNames: function(){
				let names = [];
				let el, nameLabel;
				for(let i = 0, l = controlLinkageOutput.el.nodeIds.length; i < l; i++){
					el = controlLinkageOutput.el.nodeIds[i];
					
					if(el.checked && !el.disabled){
						nameLabel = el.nextElementSibling;
						names.push(nameLabel.innerText);
					}
				}
				controlLinkageOutput.el.nodeNames.value = names.length > 0? names.join(): '';
			},
			reset: function(init){
				let isInit = init != null && init;
				let nodeId = selectNodeId.val();
				//> ↓ reset mode
				if(!isInit){
					controlLinkageOutput.el.mode.value = '';
				}
				//> ↓ reset nodes
				let el, parent, styleClass;
				for(let i = 0, l = controlLinkageOutput.el.nodeIds.length; i < l; i++){
					el = controlLinkageOutput.el.nodeIds[i];
					parent = el.parentNode;
					styleClass = parent.getAttribute('class');
					//>> ↓↓ has d-none
					if(styleClass != null && styleClass.indexOf('d-none') >= 0){
						
						if(nodeId === '' || el.value !== nodeId){
							parent.setAttribute('class', '');
							el.disabled = false;
						}
					//>> ↓↓ no d-none
					}else{
						
						if(nodeId === el.value){
							parent.setAttribute('class', 'd-none');
							el.disabled = true;
						}
					}
					//>> ↓↓ set to unchecked
					//>>    if not initialize
					if(!isInit){
						el.checked = false;
					}
				}
			}
		}
	};
	this.operationRate = document.querySelector('#operationRate');
	this.operationRateJudgeSec = document.querySelector('#operationRateJudgeSec');
	this.operationRateJudgeMode = document.querySelector('#operationRateJudgeMode');
	var node = new Node();
	
	this.operationRate.onkeyup = zeus.onNumberInput;
	this.operationRateJudgeSec = zeus.onNumberInput;
	
	selectElectricEenergySensorId.change(function(){
		hiddenElectricEnergySensorName.val(this.value == '' ? '': selectElectricEenergySensorId.find('option:selected').text());
	});
	
	selectInputWatchingTarget.change(function(){
		hiddenInputWatchingTargetName.val(this.value == ''? '': selectInputWatchingTarget.find('option:selected').text());
	});
	
	selectNodeId.change(function(){
		
		if(this.value != ''){
			zeus.ajax({
				url: contextPath + 'Rest/Node/Get.action',
				data: {nodeId: this.value},
				node: node,
				success: function(resp){
					let respObj = JSON.parse(resp);
					
					let element = null;
					if(respObj.channelType != null){
						this.node.channelType.value = respObj.channelType;
					}
					// demandControl
					if(respObj.demandControl != null){
						element = document.querySelector('[name="demandControl"][value="' + respObj.demandControl + '"]');
						element.checked = true;
					}
					// onMinMitute
					if(respObj.onMinMitute != null){
						element = document.querySelector('[name="onMinMitute"]');
						element.value = respObj.onMinMitute;
					}
					// offMinMitute
					if(respObj.offMinMitute != null){
						element = document.querySelector('[name="offMinMitute"]');
						element.value = respObj.offMinMitute;
					}
					// energy sensor id for node
					if(respObj.essIdForNode != null){
						eesIdForNode.val(respObj.essIdForNode);
						eesIdForNode.change();
					}
					// thresholdEnergy
					if(respObj.thresholdEnergy != null){
						element = document.querySelector('[name="thresholdEnergy"]');
						element.value = respObj.thresholdEnergy;
					}
					// inputWatchingTarget
					if(respObj.inputWatchingTarget != null){
						element = document.querySelector('[name="inputWatchingTarget"]');
						element.value = respObj.inputWatchingTarget;
					}
					// inputWatchingProcess
					if(respObj.inputWatchingProcess != null){
						element = document.querySelector('[name="inputWatchingProcess"]');
						element.value = respObj.inputWatchingProcess;
					}
					// reduceEnergyGroupId
					if(respObj.reduceEnergyGroupId != null){
						element = document.querySelector('[name="reduceEnergyGroupId"]');
						element.value = respObj.reduceEnergyGroupId;
					}
					// reduceEnergyGroupPriority
					if(respObj.reduceEnergyGroupPriority != null){
						element = document.querySelector('[name="reduceEnergyGroupPriority"]');
						element.value = respObj.reduceEnergyGroupPriority;
					}
				}
			});
		}else{
			node.clear();
		}
		//> ↓ reset controlLinkageOutput
		controlLinkageOutput.fn.reset();
	});
	
	this.helpOptionToggleCheck.change(function(){

		var status = 'off';
		if(this.checked){
			
			divHelpQuestionMark.show();
			status = 'on';
		}else
			divHelpQuestionMark.hide();
		
		zeus.setHelpMarkStatus('simpleOperation', status);
	});
	
	form.onsubmit = function(ev){
		
		//> ↓ set checked node names for control linkage output
		//>   only in update page
		controlLinkageOutput.fn.setCheckedNodeNames();
		//> ↑ set checked node names for control linkage output
		envSensorIds.setCheckedNames();
	}
	
	//> ↓ initialization
	//>> ↓↓ nodeId = null, init = true
	controlLinkageOutput.fn.reset(true);
	//< ↑ initialization
}

function EnergySensor(){

	var textMaker = $('[name="maker"]');
	var textModelNo = $('[name="modelNo"]');
	var checkCoolingHeatingFlag = $('[name="coolingHeatingFlag"]');
	var textRatedOutputCooling = $('[name="ratedOutputCooling"]');
	var textRatedOutputHeating = $('[name="ratedOutputHeating"]');
	var hiddenControlMethod = $('[name="controlMethod"]');
	var divControlMethod = $('#div-control-method')
	var spanCoolingHeating = $('.span-cooling-heating');
	var soForm = $('#form-so');
	var selectNodeId = $('[name="nodeId"]');
	var hiddenNodeNameStr = $('[name="nodeNameStr"]');
	var selectEesIdForNode = $('[name="eesIdForNode"]');
	var hiddenEesNameForNode = $('[name="eesNameForNode"]');
	var selectInputWatchingTarget = $('[name="inputWatchingTarget"]');
	var hiddenInputWatchingTargetName = $('[name="inputWatchingTargetName"]');
	
	this.maker = textMaker.val();
	this.modelNo = textModelNo.val();
	this.coolingHeatingFlag = checkCoolingHeatingFlag.prop('checked');
	this.ratedOutputCooling = textRatedOutputCooling.val();
	this.ratedOutputHeating = textRatedOutputHeating.val();
	this.controlMethod = hiddenControlMethod.val();
	divControlMethod.html(hiddenControlMethod.val());
	
	checkCoolingHeatingFlag.change(function(){
		
		if(this.checked){
			
			spanCoolingHeating.show();
			textRatedOutputHeating.prop('disabled', false);
		}else{
			
			spanCoolingHeating.hide();
			textRatedOutputHeating.prop('disabled', true);
		}
	});
	
	checkCoolingHeatingFlag.change();
	
	soForm.submit(function(){
		
		var textInputs = $(this).find('[type="text"]');
		var textInputsLen = textInputs.length;
		var item;
		for(var i = 0; i < textInputsLen; i++){
			
			item = $(textInputs[i]);
			item.val($.trim(item.val()));
		}
		
		hiddenControlMethod.val($.trim(divControlMethod.html()));
		if(selectNodeId.attr('type') != 'hidden'){
			
			if(selectNodeId.val() != '')
				hiddenNodeNameStr.val(selectNodeId.find('option:selected').text());
			else
				hiddenNodeNameStr.val('');
		}
		if(selectEesIdForNode.val() != '')
			hiddenEesNameForNode.val(selectEesIdForNode.find('option:selected').text());
		else
			hiddenEesNameForNode.val('');
		if(selectInputWatchingTarget.val() != '')
			hiddenInputWatchingTargetName.val(selectInputWatchingTarget.find('option:selected').text());
		else
			hiddenInputWatchingTargetName.val('');
	});
	
	this.clear = function(){
		
		this.maker = '';
		this.modelNo = '';
		this.coolingHeatingFlag = false;
		this.ratedOutputCooling = '';
		this.ratedOuputHeating = '';
		this.controlMethod = '';
		
		this.update();
	};
	
	this.update = function(){
	
		textMaker.val(this.maker);
		textModelNo.val(this.modelNo);
		checkCoolingHeatingFlag.prop('checked', this.coolingHeatingFlag);
		textRatedOutputCooling.val(this.ratedOutputCooling);
		textRatedOutputHeating.val(this.ratedOutputHeating);
		divControlMethod.html(this.controlMethod);
		hiddenControlMethod.val(this.controlMethod);
		
		checkCoolingHeatingFlag.change();
	};
}

function Node(){
	this.channelType = document.querySelector('#channelType');
	var radioDemandControl = $('[name="demandControl"]');
	var textOnMinMinute = $('[name="onMinMitute"]');
	var textOffMinMinute = $('[name="offMinMitute"]');
	var textThresholdEnergy = $('[name="thresholdEnergy"]');
	var selectInputWatchingTarget = $('[name="inputWatchingTarget"]');
	var selectInputWatchingProcess = $('[name="inputWatchingProcess"]');
	var textReduceEnergyGroupId = $('[name="reduceEnergyGroupId"]');
	var textReduceEnergyGroupPriority = $('[name="reduceEnergyGroupPriority"]');
	var hiddenEesNameForNode = $('[name="eesNameForNode"]');
	var hiddenFrom = $('[name="from"]');
	var errorEesIdForNode = $('#div-error-eesIdForNode');
	
	this.selectEesIdForNode = $('[name="eesIdForNode"]');
	this.demandControl = 1;
	this.onMinMinute = '';
	this.offMinMinute = '';
	this.eesIdForNode = '';
	this.thresholdEnergy = '';
	this.inputWatchingTarget = '';
	this.inputWatchingProcess = '';
	this.reduceEnergyGroupId = '';
	this.reduceEnergyGroupPriority = '';
	
	var _this = this;
	var energySensor = new EnergySensor();
	
	this.selectEesIdForNode.change(function(){
		hiddenEesNameForNode.val(this.value == ''? '': _this.selectEesIdForNode.find('option:selected').text());
		
		if(this.value == ''){
			energySensor.clear();
		}else{
			errorEesIdForNode.html('');
			zeus.ajax({
				url: contextPath + 'Ajax/EnergySensor/GetEnergySensorForSimpleOperation.action',
				type: 'POST',
				data: {sensorId: this.value},
				success: function(response){
					let respObj = JSON.parse(response);
					
					energySensor.maker = respObj.maker;
					energySensor.modelNo = respObj.modelNo;
					energySensor.coolingHeatingFlag = respObj.coolingHeatingFlag == null? false: true;
					energySensor.ratedOutputCooling = respObj.ratedOutputCooling;
					energySensor.ratedOutputHeating = respObj.ratedOutputHeating;
					energySensor.controlMethod = respObj.controlMethod;
					
					energySensor.update();
				},
				error: function(){
					errorEesIdForNode.html('');
				}
			});
		}
	});
	
	this.clear = function(){
		
		radioDemandControl.filter('[value="' + _this.demandControl + '"]').prop('checked', true);
		textOnMinMinute.val(_this.onMinMinute);
		textOffMinMinute.val(_this.offMinMinute);
		_this.selectEesIdForNode.val(_this.eesIdForNode);
		textThresholdEnergy.val(_this.thresholdEnergy);
		selectInputWatchingTarget.val(_this.inputWatchingTarget);
		selectInputWatchingProcess.val(_this.inputWatchingProcess);
		textReduceEnergyGroupId.val(_this.reduceEnergyGroupId);
		textReduceEnergyGroupPriority.val(_this.reduceEnergyGroupPriority);
		
		energySensor.clear();
	};
}

var simpleOperation = new SimpleOperation();

temperatureControlMode.change();
divHelpQuestionMark.each(function(){
	
	var item = $(this);
	item.popover({
		trigger: 'manual',
		html: true,
		content: divHelp.filter('#' + item.attr('data-msg-div')).html()
	}).on("mouseenter", function () {
		$(this).popover('show');
	}).on("mouseleave", function () {
	
		var popoverHovers = $(".popover:hover");
    	if(popoverHovers.length > 0){
    		
	    	popoverHovers.each(function(){
	    		
	    		$(this).on('mouseleave', function(){
	    			$(this).hide();
	    		});
	    	});
    	}else
    		$(this).popover('hide');
	});
});
//===== ヘルプメッセージ

// set initial help mark status from session
if(s_help_mark_status == 'on')
	simpleOperation.helpOptionToggleCheck.prop('checked', true);
simpleOperation.helpOptionToggleCheck.change();