function AjaxUpdateOnOffSecond(element){
	this.nodeId = element.getAttribute('data-node-id');
	this.temperatureControlMode = element.getAttribute('data-temperature-control-mode');
	this.onSecond = element;
	this.btnOnSecond = document.querySelector('#btn-set-' + this.nodeId + '-on_second');
	this.labelOnSecond = document.querySelector('#current-' + this.nodeId + '-on_second');
	this.offSecond = document.querySelector('#' + this.nodeId + '-off_second');
	this.labelOffSecond = document.querySelector('#current-' + this.nodeId + '-off_second');
	this.btnOffSecond = document.querySelector('#btn-set-' + this.nodeId + '-off_second');
	
	this.btnOnSecond.onclick = this.onSet.bind(this);
	this.btnOffSecond.onclick = this.onSet.bind(this);
}
AjaxUpdateOnOffSecond.prototype={
	onSet: function(){
		let param = {nodeId: this.nodeId};
		if(!zeusStringUtils.isEmpty(this.onSecond.value)){
			param.onSecond = this.onSecond.value.trim();
		}
		if(!zeusStringUtils.isEmpty(this.offSecond.value)){
			param.offSecond = this.offSecond.value.trim();
		}
		if(!zeusStringUtils.isEmpty(this.temperatureControlMode)){
			param.temperatureControlMode = this.tempeartureControlMode;
		}
		$(this.btnOnSecond).button('loading');
		$(this.btnOffSecond).button('loading');
		zeus.ajax({
			url: contextPath + 'Rest/SimpleOperation/UpdateOnOffSecond.action',
			data: param,
			item: this,
			success: function(resp){
				let objResp = JSON.parse(resp);
				if(objResp.result === 'ok'){
					this.item.labelOnSecond.innerText = this.item.onSecond.value.trim();
					this.item.labelOffSecond.innerText = this.item.offSecond.value.trim();
					popupMessage.setMessage(objResp.success.message);
				}else{
					popupError.setMessage(objResp.error.message);
				}
				$(this.item.btnOnSecond).button('reset');
				$(this.item.btnOffSecond).button('reset');
			},
			error: function(){
				popupError.setMessage('エラーが発生しました。');
				$(this.item.btnOnSecond).button('reset');
				$(this.item.btnOffSecond).button('reset');
			}
		});
	}	
};
function ListAjaxUpdateOnOffSecond(){
	this.init = function(){
		let listElement = document.querySelectorAll('[data-toggle="ajax-update-on-off-second"]');
		this.list = [];
		for(let i = 0, l = listElement.length; i < l; i++){
			this.list.push(new AjaxUpdateOnOffSecond(listElement[i]));
		}
	};
	
	this.init();
}

function AjaxUpdateWatchingThresholdElectricEnergy(element){
	this.nodeId = element.getAttribute('data-node-id');
	this.electricEnergySensorId = element.getAttribute('data-electric-energy-sensor-id');
	this.on = element;
	this.btnOn = document.querySelector('#btn-set-' + this.nodeId + '-watching_threshold_electric_energy_on');
	this.labelOn = document.querySelector('#current-' + this.nodeId + '-watching_threshold_electric_energy_on');
	this.off = document.querySelector('#' + this.nodeId + '-watching_threshold_electric_energy_off');
	this.labelOff = document.querySelector('#current-' + this.nodeId + '-watching_threshold_electric_energy_off');
	this.btnOff = document.querySelector('#btn-set-' + this.nodeId + '-watching_threshold_electric_energy_off');
	
	this.btnOn.onclick = this.onSet.bind(this);
	this.btnOff.onclick = this.onSet.bind(this);
}
AjaxUpdateWatchingThresholdElectricEnergy.prototype={
		onSet: function(){
			let param = {nodeId: this.nodeId};
			if(!zeusStringUtils.isEmpty(this.on.value)){
				param.watchingThresholdElectricEnergyOn = this.on.value.trim();
			}
			if(!zeusStringUtils.isEmpty(this.off.value)){
				param.watchingThresholdElectricEnergyOff = this.off.value.trim();
			}
			if(!zeusStringUtils.isEmpty(this.electricEnergySensorId)){
				param.electricEnergySensorId = this.electricEnergySensorId;
			}
			$(this.btnOn).button('loading');
			$(this.btnOff).button('loading');
			zeus.ajax({
				url: contextPath + 'Rest/SimpleOperation/UpdateWatchingThresholdElectricEnergy.action',
				data: param,
				item: this,
				success: function(resp){
					let objResp = JSON.parse(resp);
					if(objResp.result === 'ok'){
						this.item.labelOn.innerText = this.item.on.value.trim();
						this.item.labelOff.innerText = this.item.off.value.trim();
						popupMessage.setMessage(objResp.success.message);
					}else{
						popupError.setMessage(objResp.error.message);
					}
					$(this.item.btnOn).button('reset');
					$(this.item.btnOff).button('reset');
				},
				error: function(){
					popupError.setMessage('エラーが発生しました。');
					$(this.item.btnOn).button('reset');
					$(this.item.btnOff).button('reset');
				}
			});
		}	
};
function ListAjaxUpdateWatchingThresholdElectricEnergy(){
	let listElement = document.querySelectorAll('[data-toggle="ajax-update-watching-threshold-electric-energy"]');
	this.list = [];
	for(let i = 0, l = listElement.length; i < l; i++){
		this.list.push(new AjaxUpdateWatchingThresholdElectricEnergy(listElement[i]));
	}
}

function ListAjaxUpdateAlarmLockTime(config){
	let listElement = document.querySelectorAll('[data-toggle="ajax-update-alarm-lock-time"]');
	this.objects = {};
	let id, ajaxItem;
	for(let i = 0, l = listElement.length; i < l; i++){
		id = listElement[i].id;
		ajaxItem = new AjaxText({id: id, url: config.url});
		ajaxItem.bindEvent(this.onSet.bind(ajaxItem));
	}
}
ListAjaxUpdateAlarmLockTime.prototype={
	onSet: function(){
		let param = this.getAjaxParameter();
		let nodeId = this.id.split('-')[0];
		let estimateThresholdElectricEnergy = ajaxUpdateItems.ajaxItems[nodeId + '-estimate_threshold_electric_energy'];
		let etsee = estimateThresholdElectricEnergy.labelCurrent.innerText;
		param.required = zeusStringUtils.isEmpty(etsee)? false: true;
		
		$(this.button).button('loading');
		zeus.ajax({
			url: this.url,
			data: param,
			item: this,
			success: function(resp){
				let objResp = JSON.parse(resp);
				if(objResp.result === 'ok'){
					this.item.update();
					popupMessage.setMessage(objResp.success.message);
				}else{
					popupError.setMessage(objResp.error.message);
				}
				$(this.item.button).button('reset');
			},
			error: function(){
				$(this.item.button).button('reset');
				popupError.setMessage('エラーが発生しました。');
			}
		});
	}
};

function AjaxUpdateThresholdTemperatureCooling(node){
	this.nodeId = node.id.split('-')[0];
	this.temperatureControlMode = node.getAttribute('data-temperature-control-mode');
	this.coolingOn = node;
	this.cooling = document.querySelector('#' + this.nodeId + '-threshold_temperature_cooling');
	this.labelCoolingOn = document.querySelector('#current-' + this.nodeId + '-threshold_temperature_cooling_on');
	this.labelCooling = document.querySelector('#current-' + this.nodeId + '-threshold_temperature_cooling');
	this.btnCoolingOn = document.querySelector('#btn-set-' + this.nodeId + '-threshold_temperature_cooling_on');
	this.btnCooling = document.querySelector('#btn-set-' + this.nodeId + '-threshold_temperature_cooling');
}
AjaxUpdateThresholdTemperatureCooling.prototype = {
	bindEvent: function(onclick){
		this.btnCoolingOn.onclick = onclick;
		this.btnCooling.onclick = onclick;
	},
	update: function(){
		this.labelCoolingOn.innerText = this.coolingOn.value.trim();
		this.labelCooling.innerText = this.cooling.value.trim();
	}
};
function ListAjaxUpdateThresholdTemperatureCooling(){
	let nodeList = document.querySelectorAll('[data-toggle="ajax-update-threshold-temperature-cooling"]');
	this.nodeList = [];
	let ajaxItem;
	for(let i = 0, l = nodeList.length; i < l; i++){
		ajaxItem = new AjaxUpdateThresholdTemperatureCooling(nodeList[i]);
		ajaxItem.bindEvent(this.onSet.bind(ajaxItem));
		this.nodeList.push(ajaxItem);
	}
}
ListAjaxUpdateThresholdTemperatureCooling.prototype = {
	onSet: function(){
		$(this.btnCoolingOn).button('loading');
		$(this.btnCooling).button('loading');
		let param = {
			nodeId: this.nodeId
		};
		if(!zeusStringUtils.isEmpty(this.temperatureControlMode)){
			param.temperatureControlMode = this.temperatureControlMode;
		}
		if(!zeusStringUtils.isEmpty(this.coolingOn.value)){
			param.thresholdTemperatureCoolingOn = this.coolingOn.value.trim();
		}
		if(!zeusStringUtils.isEmpty(this.cooling.value)){
			param.thresholdTemperatureCooling = this.cooling.value.trim();
		}
		zeus.ajax({
			url: contextPath + 'Rest/SimpleOperation/UpdateThresholdTemperatureCooling.action',
			data: param,
			item: this,
			success: function(resp){
				let objResp = JSON.parse(resp);
				if(objResp.result === 'ok'){
					this.item.update();
					popupMessage.setMessage(objResp.success.message);
				}else{
					popupError.setMessage(objResp.error.message);
				}
				$(this.item.btnCoolingOn).button('reset');
				$(this.item.btnCooling).button('reset');
			},
			error: function(){
				popupError.setMessage('エラーが発生しました。');
				$(this.item.btnCoolingOn).button('reset');
				$(this.item.btnCooling).button('reset');
			}
		});
	}	
};

function AjaxUpdateThresholdTemperatureCoolingKeep(node){
	this.nodeId = node.id.split('-')[0];
	this.temperatureControlMode = node.getAttribute('data-temperature-control-mode');
	this.coolingKeep = node;
	this.coolingKeepSec = document.querySelector('#' + this.nodeId + '-threshold_temperature_cooling_keep_sec');
	this.labelCoolingKeep = document.querySelector('#current-' + this.nodeId + '-threshold_temperature_cooling_keep');
	this.labelCoolingKeepSec = document.querySelector('#current-' + this.nodeId + '-threshold_temperature_cooling_keep_sec');
	this.btnCoolingKeep = document.querySelector('#btn-set-' + this.nodeId + '-threshold_temperature_cooling_keep');
	this.btnCoolingKeepSec = document.querySelector('#btn-set-' + this.nodeId + '-threshold_temperature_cooling_keep_sec');
}
AjaxUpdateThresholdTemperatureCoolingKeep.prototype = {
		bindEvent: function(onclick){
			this.btnCoolingKeep.onclick = onclick;
			this.btnCoolingKeepSec.onclick = onclick;
		},
		update: function(){
			this.labelCoolingKeep.innerText = this.coolingKeep.value.trim();
			this.labelCoolingKeepSec.innerText = this.coolingKeepSec.value.trim();
		}
};
function ListAjaxUpdateThresholdTemperatureCoolingKeep(){
	let nodeList = document.querySelectorAll('[data-toggle="ajax-update-threshold-temperature-cooling-keep"]');
	this.nodeList = [];
	let ajaxItem;
	for(let i = 0, l = nodeList.length; i < l; i++){
		ajaxItem = new AjaxUpdateThresholdTemperatureCoolingKeep(nodeList[i]);
		ajaxItem.bindEvent(this.onSet.bind(ajaxItem));
		this.nodeList.push(ajaxItem);
	}
}
ListAjaxUpdateThresholdTemperatureCoolingKeep.prototype = {
	onSet: function(){
		$(this.btnCoolingOn).button('loading');
		$(this.btnCooling).button('loading');
		let param = {
				nodeId: this.nodeId
		};
		if(!zeusStringUtils.isEmpty(this.temperatureControlMode)){
			param.temperatureControlMode = this.temperatureControlMode;
		}
		if(!zeusStringUtils.isEmpty(this.coolingKeep.value)){
			param.thresholdTemperatureCoolingKeep = this.coolingKeep.value.trim();
		}
		if(!zeusStringUtils.isEmpty(this.coolingKeepSec.value)){
			param.thresholdTemperatureCoolingKeepSec = this.coolingKeepSec.value.trim();
		}
		zeus.ajax({
			url: contextPath + 'Rest/SimpleOperation/UpdateThresholdTemperatureCoolingKeep.action',
			data: param,
			item: this,
			success: function(resp){
				let objResp = JSON.parse(resp);
				if(objResp.result === 'ok'){
					this.item.update();
					popupMessage.setMessage(objResp.success.message);
				}else{
					popupError.setMessage(objResp.error.message);
				}
				$(this.item.btnCoolingOn).button('reset');
				$(this.item.btnCooling).button('reset');
			},
			error: function(){
				popupError.setMessage('エラーが発生しました。');
				$(this.item.btnCoolingOn).button('reset');
				$(this.item.btnCooling).button('reset');
			}
		});
	}	
};

function AjaxUpdateThresholdTemperatureHeating(node){
	this.nodeId = node.id.split('-')[0];
	this.temperatureControlMode = node.getAttribute('data-temperature-control-mode');
	this.heatingOn = node;
	this.heating = document.querySelector('#' + this.nodeId + '-threshold_temperature_heating');
	this.labelHeatingOn = document.querySelector('#current-' + this.nodeId + '-threshold_temperature_heating_on');
	this.labelHeating = document.querySelector('#current-' + this.nodeId + '-threshold_temperature_heating');
	this.btnHeatingOn = document.querySelector('#btn-set-' + this.nodeId + '-threshold_temperature_heating_on');
	this.btnHeating = document.querySelector('#btn-set-' + this.nodeId + '-threshold_temperature_heating');
}
AjaxUpdateThresholdTemperatureHeating.prototype = {
	bindEvent: function(onclick){
		this.btnHeatingOn.onclick = onclick;
		this.btnHeating.onclick = onclick;
	},
	update: function(){
		this.labelHeatingOn.innerText = this.heatingOn.value.trim();
		this.labelHeating.innerText = this.heating.value.trim();
	}
};
function ListAjaxUpdateThresholdTemperatureHeating(){
	let nodeList = document.querySelectorAll('[data-toggle="ajax-update-threshold-temperature-heating"]');
	this.nodeList = [];
	let ajaxItem;
	for(let i = 0, l = nodeList.length; i < l; i++){
		ajaxItem = new AjaxUpdateThresholdTemperatureHeating(nodeList[i]);
		ajaxItem.bindEvent(this.onSet.bind(ajaxItem));
		this.nodeList.push(ajaxItem);
	}
}
ListAjaxUpdateThresholdTemperatureHeating.prototype = {
	onSet: function(){
		$(this.btnHeatingOn).button('loading');
		$(this.btnHeating).button('loading');
		let param = {
			nodeId: this.nodeId
		};
		if(!zeusStringUtils.isEmpty(this.temperatureControlMode)){
			param.temperatureControlMode = this.temperatureControlMode;
		}
		if(!zeusStringUtils.isEmpty(this.heatingOn.value)){
			param.thresholdTemperatureHeatingOn = this.heatingOn.value.trim();
		}
		if(!zeusStringUtils.isEmpty(this.heating.value)){
			param.thresholdTemperatureHeating = this.heating.value.trim();
		}
		zeus.ajax({
			url: contextPath + 'Rest/SimpleOperation/UpdateThresholdTemperatureHeating.action',
			data: param,
			item: this,
			success: function(resp){
				let objResp = JSON.parse(resp);
				if(objResp.result === 'ok'){
					this.item.update();
					popupMessage.setMessage(objResp.success.message);
				}else{
					popupError.setMessage(objResp.error.message);
				}
				$(this.item.btnHeatingOn).button('reset');
				$(this.item.btnHeating).button('reset');
			},
			error: function(){
				popupError.setMessage('エラーが発生しました。');
				$(this.item.btnHeatingOn).button('reset');
				$(this.item.btnHeating).button('reset');
			}
		});
	}	
};

function AjaxUpdateThresholdTemperatureHeatingKeep(node){
	this.nodeId = node.id.split('-')[0];
	this.temperatureControlMode = node.getAttribute('data-temperature-control-mode');
	this.heatingKeep = node;
	this.heatingKeepSec = document.querySelector('#' + this.nodeId + '-threshold_temperature_heating_keep_sec');
	this.labelHeatingKeep = document.querySelector('#current-' + this.nodeId + '-threshold_temperature_heating_keep');
	this.labelHeatingKeepSec = document.querySelector('#current-' + this.nodeId + '-threshold_temperature_heating_keep_sec');
	this.btnHeatingKeep = document.querySelector('#btn-set-' + this.nodeId + '-threshold_temperature_heating_keep');
	this.btnHeatingKeepSec = document.querySelector('#btn-set-' + this.nodeId + '-threshold_temperature_heating_keep_sec');
}
AjaxUpdateThresholdTemperatureHeatingKeep.prototype = {
		bindEvent: function(onclick){
			this.btnHeatingKeep.onclick = onclick;
			this.btnHeatingKeepSec.onclick = onclick;
		},
		update: function(){
			this.labelHeatingKeep.innerText = this.heatingKeep.value.trim();
			this.labelHeatingKeepSec.innerText = this.heatingKeepSec.value.trim();
		}
};
function ListAjaxUpdateThresholdTemperatureHeatingKeep(){
	let nodeList = document.querySelectorAll('[data-toggle="ajax-update-threshold-temperature-heating-keep"]');
	this.nodeList = [];
	let ajaxItem;
	for(let i = 0, l = nodeList.length; i < l; i++){
		ajaxItem = new AjaxUpdateThresholdTemperatureHeatingKeep(nodeList[i]);
		ajaxItem.bindEvent(this.onSet.bind(ajaxItem));
		this.nodeList.push(ajaxItem);
	}
}
ListAjaxUpdateThresholdTemperatureHeatingKeep.prototype = {
	onSet: function(){
		$(this.btnHeatingOn).button('loading');
		$(this.btnHeating).button('loading');
		let param = {
			nodeId: this.nodeId
		};
		if(!zeusStringUtils.isEmpty(this.temperatureControlMode)){
			param.temperatureControlMode = this.temperatureControlMode;
		}
		if(!zeusStringUtils.isEmpty(this.heatingKeep.value)){
			param.thresholdTemperatureHeatingKeep = this.heatingKeep.value.trim();
		}
		if(!zeusStringUtils.isEmpty(this.heatingKeepSec.value)){
			param.thresholdTemperatureHeatingKeepSec = this.heatingKeepSec.value.trim();
		}
		zeus.ajax({
			url: contextPath + 'Rest/SimpleOperation/UpdateThresholdTemperatureHeatingKeep.action',
			data: param,
			item: this,
			success: function(resp){
				let objResp = JSON.parse(resp);
				if(objResp.result === 'ok'){
					this.item.update();
					popupMessage.setMessage(objResp.success.message);
				}else{
					popupError.setMessage(objResp.error.message);
				}
				$(this.item.btnHeatingOn).button('reset');
				$(this.item.btnHeating).button('reset');
			},
			error: function(){
				popupError.setMessage('エラーが発生しました。');
				$(this.item.btnHeatingOn).button('reset');
				$(this.item.btnHeating).button('reset');
			}
		});
	}	
};

let intervalTime = 5000;
let objAutoThresholdAll = JSON.parse(reqObjAutoThresholdAll);

function SimpleOperation(){
	let nodeListBtnAutoThresholdUpdate = document.querySelectorAll('[data-type="update-auto-threshold"]');
	let popName = $('.pop-name');
	let popBtnAm = $('.pop-btn-am');
	let popStatusAm = $('.pop-status-am');
	let popSchedule = $('.pop-schedule');
	let popCurrentEnv = $('.pop-current-env');
	let popBtnNc = $('.pop-btn-nc');
	let popStatusNc = $('.pop-status-nc');
	let popStatusOp = $('.pop-status-op');
	let popSettingEnv = $('.pop-setting-env');
	let popOnSecond = $('.pop-onSecond');
	let popOffSecond = $('.pop-offSecond');
	
	for(let i = 0, l = nodeListBtnAutoThresholdUpdate.length; i < l; i++){
		nodeListBtnAutoThresholdUpdate[i].onclick = function(){
			let nodeId = this.getAttribute('data-parent');
			let objAutoThreshold = objAutoThresholdAll[nodeId];
			modalAutoThreshold.setValues(nodeId, objAutoThreshold);
			modalAutoThreshold.show();
		};
	}
	
	function init(){
		popName.popover({
			animation: true,
			content: '<div>設備の名称です。</div><div>制御モードにより、文字の色が変化します。</div><div>冷：青 暖：赤 自動：緑</div>',
			html: true,
			placement: 'auto',
			trigger: 'hover'
		});
		
		popBtnAm.popover({
			animation: true,
			content: '<div>制御状態の自動、手動を切り替えます。</div>',
			html: true,
			placement: 'auto',
			trigger: 'hover'
		});
		
		popStatusAm.popover({
			animation: true,
			content: '<div>自動、手動の現在の状態が表示されます。</div><div>自動：登録されている、電力、温度、不快指数等の条件を満たす際に、システムが自動で制御を実施します。</div><div>手動：システムによる自動制御を実施しない状態です。</div>',
			html: true,
			placement: 'auto',
			trigger: 'hover'
		});
		
		popSchedule.popover({
			animation: true,
			content: '<div>スケジュール制御が適用されている場合にのみ、「スケジュール中」と表示されます。</div>',
			html: true,
			placement: 'auto',
			trigger: 'hover'
		});
		
		popCurrentEnv.popover({
			animation: true,
			content: '<div>割り当てられているセンサーの現在値です。</div><div>左から、温度｜湿度｜不快指数が表示されます。</div>',
			html: true,
			placement: 'auto',
			trigger: 'hover'
		});
		
		popBtnNc.popover({
			animation: true,
			content: '<div>制御状態が手動の際に、通常、制御を切り替えます。</div>',
			html: true,
			placement: 'auto',
			trigger: 'hover'
		});
		
		popStatusNc.popover({
			animation: true,
			content: '<div>制御状態が表示されます。</div><div>通常：無制御の状態です。</div><div>制御：制御信号を出力しています。</div><div>デマンド：遮断警報発生時に、制御信号を出力している場合に表示されます。</div>',
			html: true,
			placement: 'auto',
			trigger: 'hover'
		});
		
		popStatusOp.popover({
			animation: true,
			content: '<div>設備の稼働状況です。稼働しているときは稼働率、稼働していない場合は停止と表示されます。</div>',
			html: true,
			placement: 'auto',
			trigger: 'hover'
		});
		
		popSettingEnv.popover({
			animation: true,
			content: '<div>設定されている温度、湿度、不快指数の閾値です。</div>',
			html: true,
			placement: 'auto',
			trigger: 'hover'
		});
		
		popOnSecond.popover({
			animation: true,
			content: '<div>サイクリック運転の際の１回あたりの制御時間（秒）です。</div>',
			html: true,
			placement: 'auto',
			trigger: 'hover'
		});
		
		popOffSecond.popover({
			animation: true,
			content: '<div>サイクリック運転の際の制御後の無制御時間（秒）です。</div>',
			html: true,
			placement: 'auto',
			trigger: 'hover'
		});
	}
	
	function destroy(){
		popName.popover('destroy');
		popBtnAm.popover('destroy');
		popStatusAm.popover('destroy');
		popSchedule.popover('destroy');
		popCurrentEnv.popover('destroy');
		popBtnNc.popover('destroy');
		popStatusNc.popover('destroy');
		popStatusOp.popover('destroy');
		popSettingEnv.popover('destroy');
		popOnSecond.popover('destroy');
		popOffSecond.popover('destroy');
	}
	
	return {
		init: init,
		destroy: destroy
	};
}

function DisplayAutoThreshold(nodeId){
	let dataParent = '[data-parent="' + nodeId + '"]';
	let dataType = '[data-type="display"]';
	this.mode = document.querySelector(dataParent + dataType + '[data-item="mode"]');
	this.updateFrequency = document.querySelector(dataParent + dataType + '[data-item="updateFrequency"]');
	this.lookupTime = document.querySelector(dataParent + dataType + '[data-item="lookupTime"]');
	this.maximum = document.querySelector(dataParent + dataType + '[data-item="maximum"]');
	this.minimum = document.querySelector(dataParent + dataType + '[data-item="minimum"]');
	this.percentage = document.querySelector(dataParent + dataType + '[data-item="percentage"]');
}
DisplayAutoThreshold.prototype = {
	setValues: function(autoThreshold){
		this.mode.innerText = selectOption.mode[autoThreshold.mode];
		this.updateFrequency.innerText = autoThreshold.updateFrequency;
		this.lookupTime.innerText = autoThreshold.lookupTime;
		this.maximum.innerText = autoThreshold.maximum == null? '-': autoThreshold.maximum;
		this.minimum.innerText = autoThreshold.minimum == null? '-': autoThreshold.minimum;
		this.percentage.innerText = autoThreshold.percentage;
	}	
};

function ModalAutoThreshold(id){
	let _this = this;
	this.nodeId = null;
	this._ = document.querySelector('#' + id);
	this.errAll = this._.querySelector('#errAll');
	this.formGroup = {
		updateFrequency: this._.querySelector('#formGroupUpdateFrequency'),
		lookupTime: this._.querySelector('#formGroupLookupTime'),
		maximum: this._.querySelector('#formGroupMaximum'),
		minimum: this._.querySelector('#formGroupMinimum'),
		percentage: this._.querySelector('#formGroupPercentage'),
		clear: function(){
			zeus.removeClass(this.updateFrequency, 'has-error');
			zeus.removeClass(this.lookupTime, 'has-error');
			zeus.removeClass(this.maximum, 'has-error');
			zeus.removeClass(this.minimum, 'has-error');
			zeus.removeClass(this.percentage, 'has-error');
		}
	};
	this.mode = this._.querySelectorAll('[name="mode"]');
	this.updateFrequency = this._.querySelector('#updateFrequency');
	this.lookupTime = this._.querySelector('#lookupTime');
	this.maximum = this._.querySelector('#maximum');
	this.minimum = this._.querySelector('#minimum');
	this.percentage = this._.querySelector('#percentage');
	this.btnSubmit = this._.querySelector('[data-type="btn-submit"]');
	
	this.btnSubmit.onclick = function(){
		$(this).button('loading');
		let isValid = _this.validateData();
		let isChanged = _this.isChanged();
		if(!isChanged) _this.errAll.innerHTML = fmtNotChanged;
		
		let dataObj = _this.toJSON();
		dataObj.nodeId = _this.nodeId;
		
		if(isValid && isChanged){
			$.ajax({
				url: contextPath + 'Rest/SimpleOperation/UpdateAutoThreshold.action',
				async: true,
				cache: false,
				type: 'POST',
				data: dataObj,
				success: function(resp){
					let objResp = JSON.parse(resp);
					if(objResp.result === 'ok'){
						let after = modalAutoThreshold.toJSON();
						objAutoThresholdAll[modalAutoThreshold.nodeId] = after;
						let displayAutoThreshold = new DisplayAutoThreshold(modalAutoThreshold.nodeId);
						displayAutoThreshold.setValues(after);
						modalAutoThreshold.hide();
						alert(fmtUpdateComplete);
					}else{
						alert(objResp.error.msg);
					}
					$(modalAutoThreshold.btnSubmit).button('reset');
				},
				error: function(){
					$(modalAutoThreshold.btnSubmit).button('reset');
					alert(fmtErrOccurred);
				}
			});
		}else{
			$(this).button('reset');
		}
	};
}
ModalAutoThreshold.prototype = {
	validateData: function(){
		this.formGroup.clear();
		let isValid = true;
		let val = this.updateFrequency.value.trim();
		if(val === '' || isNaN(val) || val <= 0){
			zeus.addClass(this.formGroup.updateFrequency, 'has-error');
			isValid = false;
		}
		val = this.lookupTime.value.trim();
		if(val === '' || isNaN(val) || val <= 0){
			zeus.addClass(this.formGroup.lookupTime, 'has-error');
			isValid = false;
		}
		let isMaximumValid = true;
		val = this.maximum.value.trim();
		if(val === ''){
			if(this.mode[1].checked){
				isMaximumValid = false;
			}
		}else{
			if(isNaN(val) || val <= 0){
				isMaximumValid = false;
			}
		}
		if(!isMaximumValid){
			zeus.addClass(this.formGroup.maximum, 'has-error');
			isValid = false;
		}
		let isMinimumValid = true;
		val = this.minimum.value.trim();
		if(val === ''){
			if(this.mode[1].checked){
				isMinimumValid = false; 
			}
		}else{
			if(isNaN(val) || val < 0){
				isMinimumValid = false;
			}
		}
		if(!isMinimumValid){
			zeus.addClass(this.formGroup.minimum, 'has-error');
			isValid = false;
		}
		if(isMaximumValid && isMinimumValid){
			
			if(this.maximum.value.trim() != '' && this.minimum.value.trim() != ''){
				let maximum = parseInt(this.maximum.value.trim());
				let minimum = parseInt(this.minimum.value.trim());
				
				if(maximum <= minimum){
					zeus.addClass(this.formGroup.maximum, 'has-error');
					zeus.addClass(this.formGroup.minimum, 'has-error');
					isValid = false;
				}
			}
		}
		val = this.percentage.value.trim();
		if(val === '' || isNaN(val) || val < 0){
			zeus.addClass(this.formGroup.percentage, 'has-error');
			isValid = false;
		}
		return isValid;
	},
	setValues: function(nodeId, autoThreshold){
		this.nodeId = nodeId;
		this.mode[autoThreshold.mode].checked = true;
		this.updateFrequency.value = autoThreshold.updateFrequency;
		this.lookupTime.value = autoThreshold.lookupTime;
		this.maximum.value = autoThreshold.maximum == null? '': autoThreshold.maximum;
		this.minimum.value = autoThreshold.minimum == null? '': autoThreshold.minimum;
		this.percentage.value = autoThreshold.percentage;
	},
	show: function(){
		this.formGroup.clear();
		$(this._).modal('show');
	},
	hide: function(){
		$(this._).modal('hide');
	},
	toJSON: function(){
		let json = {};
		json.mode = this.mode[0].checked? this.mode[0].value: this.mode[1].value;
		json.updateFrequency = this.updateFrequency.value.trim();
		json.lookupTime = this.lookupTime.value.trim();
		json.percentage = this.percentage.value.trim();
		if(this.maximum.value.trim() !== ''){
			json.maximum = this.maximum.value.trim();
		}
		if(this.minimum.value.trim() !== ''){
			json.minimum = this.minimum.value.trim();
		}
		return json;
	},
	isChanged: function(){
		this.errAll.innerHTML = '';
		let after = this.toJSON();
		let before = objAutoThresholdAll[this.nodeId];
		
		if(before.mode !== after.mode) return true;
		if(before.updateFrequency !== after.updateFrequency) return true;
		if(before.lookupTime !== after.lookupTime) return true;
		if(before.maximum == null){
			if(after.maximum != null) return true;
		}else{
			if(after.maximum == null) return true;
			else if(before.maximum !== after.maximum) return true;
		}
		if(before.minimum == null){
			if(after.minimum != null) return true;
		}else{
			if(after.minimum == null) return true;
			else if(before.minimum !== after.minimum) return true;
		}
		if(before.percentage !== after.percentage) return true;
		
		return false;
	}
};

let modalAutoThreshold = new ModalAutoThreshold('modalAutoThreshold');
let so = new SimpleOperation();

var moSelect = $('#mo');
var dSelect = $('#d');
var hSelect = $('#h');
var miSelect = $('#mi');
var hasRecordDiv = $('#hasRecord');
var recoverRadio = $('[name="autoRecover"]');
var onOffRadio = $('[name="onOffControl"]');
var dataBody = $('#data-body');
//***** recover
var noRecordDiv = $('#noRecord');
var nodeControlSpanN = $('#nodeControlSpanN');
var nodeControlSpanY = $('#nodeControlSpanY');
var onOffControlDiv = $('#onOffControlDiv');
var willBeDeletedSpan = $('#willBeDeleted');
var recoverDateSpan = $('#recoverDateSpan');
var nodeNameTd = $('#nodeNameTd');
var popupWindow = $('#popupwindow');
//===== recover
var helpOptionToggleCheck = $('#helpOptionToggle');
var divHelpQuestionMark = $('.help-question-mark');
var checkGroup = $('.so-group-check');
var checkGroupAll = $('#checkGroupAll');
var tableSo = $('.so-group-table');
var divHelpOptionToggle = $('#helpOptionToggleDiv');
var divAutoManualAll = $('#autoManualAllDiv');
var divHelpQuestionMark = $('.help-question-mark');
var selectAutoManualMultiple = $('#autoManualMS');
var selectAutoManualMultipleTo = $('#autoManualMS_to');
var divAlert = $('.alert');
var btnAutoManualAll = $('#autoManualAll');
var divHelp = $('.div-help');

//***** 一括自動手動
var autoAll = '';
var manualAll = '';
//===== 一括自動手動
var nodeIds;
var checkedGroupIds;
var hasGroup = checkGroup.length > 0;

// ページが開いて，資源ロードが終わってから実行
function getUpdatedStatus(){
	let nodeIds;
	let displayedSo = tableSo.filter(':visible');
	
	if(displayedSo.length > 0){
		
		for(var i = 0; i < displayedSo.length; i++){
			
			if(nodeIds == null){
				nodeIds = $(displayedSo[i]).prop('id');
			}else{
				nodeIds += ',' + $(displayedSo[i]).prop('id');
			}
		}
	}
	// 表示されているグループだけの情報を更新する
	if(nodeIds != null){
		$.ajax({
			url: contextPath + 'Ajax/SimpleOperation/GetUpdatedStatus.action',
			method: 'POST',
		   	async: true,
		   	cache: false,
			data: {nodeIds: nodeIds},
		   	success: getUpdatedStatusComplete,
		   	error: function(){
		   		setTimeout(getUpdatedStatus, intervalTime);
		   	}
		});
	}
}

function getUpdatedStatusComplete(response){

	if(response != null && response.length > 0){
		let responseObj = JSON.parse(response);
		
		if(responseObj.error == null){
			let ncStatus, maStatus;
			let commError;
			let currentEnv, settingEnv;
			let scheduleOnOff, operationStatus;
			let keyElement, hiddenElement, nodeControlSpan, nodeControlHidden;
			let controlTargetDiv;
			
			for(let nodeId in responseObj){
				ncStatus = responseObj[nodeId].nc_status;
				ncStatusName = responseObj[nodeId].nc_status_name;
				maStatus = responseObj[nodeId].ma_status;
				commError = responseObj[nodeId].sensor_status;
				currentEnv = responseObj[nodeId].current_env;
				settingEnv = responseObj[nodeId].setting_env;
				scheduleOnOff = responseObj[nodeId].schedule_on_off;
				operationStatus = responseObj[nodeId].operation_status;
				
				keyElement = document.getElementById("controlStatus" + nodeId);
				hiddenElement = document.getElementById("nocHidden" + nodeId);
				nodeControlSpan = document.getElementById('autoOrManual' + nodeId);
				nodeControlHidden = document.getElementById('nodeControl' + nodeId);
				controlTargetDiv = $('#controlTargetDiv' + nodeId);
				// 0: mst_node.control_status_offword, 1: mst_node.control_status_onword, 2: 不明（未接続）, 3: デマンド, 4: mst_node.control_status_onword_capacity
				if(keyElement != undefined){
					keyElement.innerHTML = ncStatusName;
					hiddenElement.value = ncStatus;
				}
				
				if(nodeControlSpan != undefined){
					
					if(maStatus == 0){
						nodeControlSpan.innerHTML = fmtManual;
					}else if(maStatus == 1){
						
						if(commError == 1){
							nodeControlSpan.innerHTML = '<font class="so-status-auto-error">' + fmtAuto + '</font>';
						}else{
							nodeControlSpan.innerHTML = '<font class="so-status-auto">' + fmtAuto + '</font>';
						}
					}
					nodeControlHidden.value = maStatus;
				}
				
				// 現在
				if(currentEnv != undefined){
					$('#' + nodeId + '_current_env').html(currentEnv);
				}else{
					$('#' + nodeId + '_current_env').html('');
				}
				// 設定
				if(settingEnv != undefined){
					$('#' + nodeId + '_setting_env').html(settingEnv);
				}else{
					$('#' + nodeId + '_setting_env').html('');
				}
				// スケジュールON/OFF
				if(scheduleOnOff == 0){
					controlTargetDiv.css('display', 'none');
				}else{
					controlTargetDiv.css('display', '');
				}
				// 稼働率
				$('#' + nodeId + '_operation_status').html(operationStatus);
			}
		}else{
			
			if(responseObj.error == 'sync'){
				console.log('error: local server unreachable..');
			}else{
				console.log('error: unknown..');
			}
		}
	}
	setTimeout(getUpdatedStatus, intervalTime);
}

function saveGroupChecked(){
	// グループのチェック状態を保存
	let currentCheckedGroupIds = null;
	let checkedGroup = checkGroup.filter(':checked');
	
	if(checkedGroup.length > 0){
		
		for(var i = 0; i < checkedGroup.length; i++){
			
			if(currentCheckedGroupIds == null){
				currentCheckedGroupIds = '';
			}else{
				currentCheckedGroupIds += ',';
			}
			currentCheckedGroupIds += checkedGroup[i].value;
		}
	}
	let isChanged = false;
	
	if(checkedGroupIds == null){
		
		if(currentCheckedGroupIds != null){
			isChanged = true;
		}
	}else{
		
		if(currentCheckedGroupIds == null){
			isChanged = true;
		}else{
			
			if(checkedGroupIds != currentCheckedGroupIds){
				isChanged = true;
			}
		}
	}
	
	if(isChanged){
		$.ajax({
			url: contextPath + 'Ajax/User/UpdateOption.action',
		   	async: true,
		   	cache: false,
			data: {checkedGroupIds: 'simple_operation_group_ids=' + (currentCheckedGroupIds == null? 'null': "'" + currentCheckedGroupIds + "'")},
		   	error: function(){
				console.log('checked group ids update error.');		   		
		   	}
		});
		checkedGroupIds = currentCheckedGroupIds;
	}
}

function updateNormalOrControl(nodeId){
	let nodeControlHidden = document.getElementById("nodeControl" + nodeId);
	let nodeAlert = $('#alert' + nodeId);

	if(nodeControlHidden.value == "1"){
		nodeAlert.html('自動運転中のため操作できません。');
		nodeAlert.removeClass('alert-success');
		nodeAlert.addClass('alert-danger');
		nodeAlert.show();
		
		setTimeout(function(){
			nodeAlert.hide();
		}, 3000);
		return;
	}

	let nocHidden = document.getElementById("nocHidden" + nodeId);
	let conditions = nocHidden.value;
	
	if(conditions == "2"){
		nodeAlert.html('未接続のため操作できません。');
		nodeAlert.removeClass('alert-success');
		nodeAlert.addClass('alert-danger');
		nodeAlert.show();
		
		setTimeout(function(){
			nodeAlert.hide();
		}, 3000);
		return;
	}
	
	$('#normalControlSwitchButton' + nodeId).button('loading');
	$('#normalControlSwitchButton' + nodeId).removeClass('nc-button');
	$('.nc-button').prop('disabled', true);
	
	$.ajax({
		url: contextPath + 'Ajax/SimpleOperation/NormalControlSwitch.action',
		async: true,
		cache: false,
		data: {nodeId: nodeId, conditions: conditions},
		nodeId: nodeId,
		conditions: conditions,
		success: function(response){
			$('#normalControlSwitchButton' + this.nodeId).button('reset');
			$('.nc-button').prop('disabled', false);
			$('#normalControlSwitchButton' + this.nodeId).addClass('nc-button');
			
			let alertDiv = $('#alert' + this.nodeId);
			let respObj = JSON.parse(response);
			
			if(respObj.error != null){
				
				if(respObj.errorType == 'failed'){
					
					if(this.conditions == 1){
						alertDiv.html('通常への切り替えが失敗しました。リトライしてください。');
					}else{
						alertDiv.html('制御への切り替えが失敗しました。リトライしてください。');
					}
				}else if(respObj.errorType == 'inThread'){
					alertDiv.html('通常への切り替え中のため操作できません。');
				}else{
					
					if(respObj.error == 'sync'){
						
						if(this.conditions == 1){
							alertDiv.html('同期サーバーに接続できないため通常への切り替えが失敗しました。');
						}else{
							alertDiv.html('同期サーバーに接続できないため制御への切り替えが失敗しました。');
						}
					}else{
						
						if(this.conditions == 1){
							alertDiv.html('通常への切り替えが成功しました。');
						}else{
							alertDiv.html('制御への切り替えが成功しました。');
						}
					}
				}
				alertDiv.removeClass('alert-success');
				alertDiv.addClass('alert-danger');
			}else{
				
				if(this.conditions == 1){
					alertDiv.html('通常への切り替えが成功しました。');
				}else{
					alertDiv.html('制御への切り替えが成功しました。');
				}
				alertDiv.removeClass('alert-danger');
				alertDiv.addClass('alert-success');
			}
			alertDiv.show();
			setTimeout(function(){
				alertDiv.hide();
			}, 3000);
		},
		error: function(){
			$('#normalControlSwitchButton' + this.nodeId).button('reset');
			$('.nc-button').prop('disabled', false);
			$('#normalControlSwitchButton' + this.nodeId).addClass('nc-button');
			
			let alertDiv = $('#alert' + this.nodeId);
			
			if(this.conditions == 1){
				alertDiv.html('通常への切り替えが失敗しました。リトライしてください。');
			}else{
				alertDiv.html('制御への切り替えが失敗しました。リトライしてください。');
			}
			alertDiv.removeClass('alert-success');
			alertDiv.addClass('alert-danger');
			alertDiv.show();
			setTimeout(function(){
				alertDiv.hide();
			}, 3000);
		}
	});
}

var nodeIdForAOM;
var controlModeForAOM;
function onAutoManualChange(nodeId, controlMode){
	nodeIdForAOM = nodeId;
	controlModeForAOM = controlMode;
	let nocHidden = $("#nocHidden" + nodeId);
	
	if(nocHidden.val() == 2){
		let nodeAlert = $('#alert' + nodeId);
		nodeAlert.html('未接続のため操作できません。');
		nodeAlert.removeClass('alert-success');
		nodeAlert.addClass('alert-danger');
		nodeAlert.show();
		setTimeout(function(){
			nodeAlert.hide();
		}, 3000);
		return;
	}
	// スケジュールがあるかどうか，あったらONかOFFか
	$.ajax({
		url: contextPath + 'Ajax/SimpleOperationSchedule/GetControlTarget.action',
		async: true,
		cache: false,
		data: {nodeId: nodeIdForAOM},
		success: function(response){
			let resultObj = JSON.parse(response);
			
			if(resultObj.error == null){
				// スケジュールなし
				if(resultObj.controlTarget == null){
					recoverAddConfirm();
				}else {// スケジュールあり
					scheduleNodeName.html($('#nodeName' + nodeIdForAOM).html());
					let amItem = $('#nodeControl' + nodeIdForAOM);
					// 現在自動
					if(amItem.val() == 1){
						scheduleStatusName.html(fmtManual);
					// 現在手動
					}else{
						scheduleStatusName.html(fmtAuto);
					}
					// スケジュールOFF
					if(resultObj.controlTarget == 0){
						// 現在自動
						if(amItem.val() == 1){
							atmScheduleOff.addClass('popup-content-active');
							atmScheduleOff.removeClass('popup-content-inactive');
							mtaScheduleOff.addClass('popup-content-inactive');
							mtaScheduleOff.removeClass('popup-content-active');
							$('[name="atmOffScheduleOnOff"][value="0"]').prop('checked', true);
						//現在手動
						}else{
							mtaScheduleOff.addClass('popup-content-active');
							mtaScheduleOff.removeClass('popup-content-inactive');
							atmScheduleOff.addClass('popup-content-inactive');
							atmScheduleOff.removeClass('popup-content-active');
							$('[name="mtaOffScheduleOnOff"][value="1"]').prop('checked', true);
						}
						atmScheduleOn.addClass('popup-content-inactive');
						atmScheduleOn.removeClass('popup-content-active');
						mtaScheduleOn.addClass('popup-content-inactive');
						mtaScheduleOn.removeClass('popup-content-active');
					}else {// スケジュールON
						//現在自動
						if(amItem.val() == 1){
							atmScheduleOn.addClass('popup-content-active');
							atmScheduleOn.removeClass('popup-content-inactive');
							mtaScheduleOn.addClass('popup-content-inactive');
							mtaScheduleOn.removeClass('popup-content-active');
							$('[name="atmOnScheduleOnOff"][value="0"]').prop('checked', true);
						//現在手動
						}else{
							mtaScheduleOn.addClass('popup-content-active');
							mtaScheduleOn.removeClass('popup-content-inactive');
							atmScheduleOn.addClass('popup-content-inactive');
							atmScheduleOn.removeClass('popup-content-active');
							$('[name="mtaOnScheduleOnOff"][value="1"]').prop('checked', true);
						}
						atmScheduleOff.addClass('popup-content-inactive');
						atmScheduleOff.removeClass('popup-content-active');
						mtaScheduleOff.addClass('popup-content-inactive');
						mtaScheduleOff.removeClass('popup-content-active');
					}
					schedulePopup.modal('show');
				}
			}else{
				popupError.setMessage(resultObj.error == 'sync'? '同期サーバに接続できませんでした。しばらくしてからリトライしてください。': '変更できませんでした。しばらくしてからリトライしてください。');
				setTimeout(function(){
					popupError.modal('hide');
				}, 3000);
			}
		}
	});
}

function recoverAddConfirm(){
	$.ajax({
		url: contextPath + 'SimpleOperationSchedule/SimpleOperationScheduleRecoverAddConfirm.do',
		async: true,
		cache: false,
		type: 'post',
		data: {nodeId: nodeIdForAOM, nodeControl: $("#nodeControl" + nodeIdForAOM).val(), controlMode: controlModeForAOM},
		success: function(response){
			
			if(response == ''){
				popupError.setMessage('変更できませんでした。しばらくしてからリトライしてください。');
				setTimeout(function(){
					popupError.hide();
				}, 3000);
			}else {
				let dataArr = response.split(',');
				// has recover schedule or not
				if(dataArr[0] == 'n'){
					noRecordDiv.show();
					hasRecordDiv.hide();
					nodeControlSpanN.html(dataArr[2]);
					nodeControlSpanY.html(dataArr[3]);
					// 手動から自動にする場合だけ表示
					let nodeControl = $('#nodeControl' + nodeIdForAOM).val();
					
					if(nodeControl == 0){
						onOffControlDiv.show();
					}else{
						onOffControlDiv.hide();
					}
				}else{
					noRecordDiv.hide();
					hasRecordDiv.show();
					willBeDeletedSpan.html(dataArr[2]);
					recoverDateSpan.html(dataArr[3]);
					onOffControlDiv.hide();
				}
				nodeNameTd.html(dataArr[1]);
				initPopupWindow();
				popupWindow.modal('show');
			}
		}
	}); 
}

function recoverScheduleAddComplete(){
	let nodeControl = $('#nodeControl' + nodeIdForAOM);
	// 復旧スケジュールが登録されてない場合
	if(hasRecordDiv.css('display') == 'none'){
		// 復旧しない
		if(moSelect.prop('disabled')){
			let nocHidden = document.getElementById("nocHidden" + nodeIdForAOM);
			let conditions = nocHidden.value;
			$.ajax({
				url: contextPath + 'Ajax/SimpleOperation/AutoManualSwitch.action',
				type: 'post',
				async: true,
				cache: false,
				data: {nodeId: nodeIdForAOM, nodeControl: nodeControl.val(), conditions: conditions},
				success: function(response){
					let respObj = JSON.parse(response);
					let nodeControlSpan = $('autoOrManual' + nodeIdForAOM);
					let nodeControlHidden = $('#nodeControl' + nodeIdForAOM);
					let nodeControl = respObj.nodeControl;
					let commError = respObj.commError;
					
					if(respObj.error != null){
						let nodeAlert = $('#alert' + nodeIdForAOM);
						
						if(respObj.error == 'sync'){
							nodeAlert.html('同期サーバーに接続できないため処理できませんでした。');
						}else{
							nodeAlert.html('通常への切り替え中のため操作できません。');
						}
						nodeAlert.removeClass('alert-success');
						nodeAlert.addClass('alert-danger');
						nodeAlert.show();
						setTimeout(function(){
							nodeAlert.hide();
						}, 3000);
					}else{
						
						if(nodeControl == "0"){
							nodeControlSpan.html(fmtManual);
							nodeControlHidden.val(nodeControl);
						}else if(nodeControl == "1"){
							
							if(commError = 1){
								nodeControlSpan.html("<font class='so-status-auto-error'>" + fmtAuto + "</font>");
							}else{
								nodeControlSpan.html("<font class='so-status-auto'>" + fmtAuto + "</font>");
							}
							nodeControlHidden.val(nodeControl);
						}
					}
				}
			});
		}else{// 復旧する
			let parameter = "nodeId=" + nodeIdForAOM + "&nodeControl=" + nodeControl.val() + '&mo=' + moSelect.val() +
							'&d=' + dSelect.val() + '&h=' + hSelect.val() +
							'&mi=' + miSelect.val();
			// 手動から自動の場合、通常/制御を選ぶ
			if(nodeControl.val() == 0){
				parameter = parameter + '&onOffControl=' + $('[name="onOffControl"]:checked').val();
			}
			// 復旧スケジュールの追加
			$.ajax({
				url: contextPath + 'SimpleOperationSchedule/SimpleOperationScheduleRecoverAddComplete.do',
				mehtod: 'post',
				async: true,
				cache: false,
				data: parameter,
				success: function(response){
					afterStatusChangedWithRecoverSchedule(response);
				}
			});
		}
	}else{
		$.ajax({
			url: contextPath + 'SimpleOperationSchedule/SimpleOperationScheduleRecoverDeleteByNode.do',
			type: 'post',
			async: true,
			data: {nodeId: nodeIdForAOM, nodeControl: nodeControl.val()},
			success: function(response){
				afterStatusChangedWithRecoverSchedule(response);
			}
		});
	}
	$('#popupwindow').modal('hide');
}

function afterStatusChangedWithRecoverSchedule(rep){
	let responseText = rep;
	
	if(responseText == ''){
		alert('failed');
	}else{
		let nodeControlSpan = document.getElementById("autoOrManual" + nodeIdForAOM);
		let nodeControlHidden = document.getElementById('nodeControl' + nodeIdForAOM);
		let repStrArr = responseText.split(',');
		let nodeControl = repStrArr[0];
		let commError = repStrArr[1];

		nodeControlHidden.value = nodeControl;

		if(nodeControl == "0"){
			nodeControlSpan.innerHTML = fmtManual;
		}else if(nodeControl == "1"){

			if(commError == 1){
				nodeControlSpan.innerHTML = "<font class='so-status-auto-error'>" + fmtAuto + "</font>";
			}else{
				nodeControlSpan.innerHTML = "<font class='so-status-auto'>" + fmtAuto + "</font>";
			}
		}
	}
}

function initPopupWindow(){
	$('[name="autoRecover"][value="0"]').prop('checked', true);
	$('[name="onOffControl"][value="0"]').prop('checked', true);
	$('#onOffControlDiv').css('display', 'none');
	// 現在のシステム時刻を選択
	let currentDate = new Date();
	$('#mo').val(currentDate.getMonth() + 1);
	$('#d').val(currentDate.getDate());
	$('#h').val(currentDate.getHours());
	$('#mi').val(currentDate.getMinutes());
	disableSelects();
}

function disableSelects(){
	moSelect.prop('disabled', true);
	dSelect.prop('disabled', true);
	hSelect.prop('disabled', true);
	miSelect.prop('disabled', true);
	onOffRadio.prop('disabled', true);
}

function enableSelects(){
	moSelect.prop('disabled', false);
	dSelect.prop('disabled', false);
	hSelect.prop('disabled', false);
	miSelect.prop('disabled', false);
	onOffRadio.prop('disabled', false);
}

function closeWindow(){
	popupWindow.modal('hide');
}

function scheduleOnOffCancel(){
	schedulePopup.modal('hide');
}

function scheduleOnOffSubmit(){
	let activeDivId = $('.popup-content-active').prop('id');
	let amStatus = 1;
	let onOffStatus = 1;
	
	if(activeDivId.indexOf('autoToManual') >= 0){
		amStatus = 0;
	}
	
	if(activeDivId.indexOf('schedule-off') >= 0){
		
		if(amStatus == 1){
			onOffStatus = $('[name="mtaOffScheduleOnOff"]:checked').val();
		}else{
			onOffStatus = $('[name="atmOffScheduleOnOff"]:checked').val();
		}
	}else{
		
		if(amStatus == 1){
			onOffStatus = $('[name="mtaOnScheduleOnOff"]:checked').val();
		}else{
			onOffStatus = $('[name="atmOnScheduleOnOff"]:checked').val();
		}
	}
	
	$.ajax({
		url: contextPath + 'Ajax/SimpleOperationSchedule/AutoManualScheduleOnOffSwitch.action',
		async: true,
		cache: false,
		data: {nodeId: nodeIdForAOM, amStatus: amStatus, onOffStatus: onOffStatus},
		success: function(response){
			let resultObj = JSON.parse(response);
			
			if(resultObj.error != null){
				
				if(resultObj.errorType != null){
					popupError.setMessage('通常への切り替え中のため操作できません。');
				}else{
					popupError.setMessage(resultObj.error == 'sync'? '同期サーバに接続できませんでした。しばらくしてからリトライしてください。': '変更できませんでした。しばらくしてからリトライしてください。');
				}
				setTimeout(function(){
					popupError.hide();
				}, 3000);
			}
			schedulePopup.modal('hide');
		}
	});
}

$('#normalControlSwitchButton').click(function(){
	let thisItem = $(this);
	thisItem.button('loading');
	setTimeout(function(){
		thisItem.button('reset');
	}, 10000);
});

if(hasGroup){
	checkGroup.change(function(){
		
		if(this.checked){
			$('.' + this.value).show();
		}else{
			$('.' + this.value).hide();
		}
		let displayedSo = tableSo.filter(':visible');
		
		if(displayedSo.length == 0) {
			ListShowHide.hideAll();
			divHelpOptionToggle.hide();
			divAutoManualAll.hide();
		}else {
			ListShowHide.showAll();
			divHelpOptionToggle.show();
			divAutoManualAll.show();
		}
		
		if(checkGroup.filter(':checked').length == checkGroup.length){
			checkGroupAll.prop('checked', true);
		}else{
			checkGroupAll.prop('checked', false);
		}
	});
	
	checkGroupAll.change(function(){
		checkGroup.prop('checked', this.checked);
		checkGroup.each(function(){
			
			if(this.checked){
				$('.' + this.value).show();
			}else{
				$('.' + this.value).hide();
			}
		});
		let displayedSo = tableSo.filter(':visible');
		
		if(displayedSo.length == 0) {
			ListShowHide.hideAll();
			divHelpOptionToggle.hide();
			divAutoManualAll.hide();
		}else {
			ListShowHide.showAll();
			divHelpOptionToggle.show();
			divAutoManualAll.show();
		}
	});
}

helpOptionToggleCheck.change(function(){
	let status = 'off';
	
	if(this.checked){
		divHelpQuestionMark.show();
		status = 'on';
		// 吹き出し
		so.init();
	}else{
		divHelpQuestionMark.hide();
		// 吹き出し
		so.destroy();
	}
	zeus.setHelpMarkStatus('simpleOperation', status);
});

//************************************** init start
tableSo.hide();
ListShowHide.hideAll();
divHelpOptionToggle.hide();
divAutoManualAll.hide();
divHelpQuestionMark.hide();
divAlert.removeClass('hide');
divAlert.hide();
//***** init table show hide according to checked group
if(hasGroup){
	checkedGroupIds = reqCheckedGroupIds;
	let checkedGroupIdsArr = checkedGroupIds.split(',');
	
	for(var i = 0; i < checkedGroupIdsArr.length; i++){
		tableSo.filter('.' + checkedGroupIdsArr[i]).show();
	}
	
	if(checkGroup.filter(':checked').length == checkGroup.length){
		checkGroupAll.prop('checked', true);
	}else{
		checkGroupAll.prop('checked', false);
	}
	ListShowHide.showAll();
	divHelpOptionToggle.show();
	divAutoManualAll.show();
}else {
	
	if(tableSo.length > 0) {
		tableSo.show();
		ListShowHide.showAll();
		divHelpOptionToggle.show();
		divAutoManualAll.show();
	}	
}
//_____ init table show hide according to checked group

// 一括自動手動
btnAutoManualAll.click(function(){
	autoAll = '';
	manualAll = '';
	selectAutoManualMultiple.empty();
	selectAutoManualMultipleTo.empty();
	let nodeId, amStatus;
	let nodeName, nodeOption;
	
	if(hasGroup) {
		let soGroupCheck = checkGroup.filter(':checked');
		
		if(soGroupCheck.length > 0){
			let groupId, groupName, groupSoTables;
			let hasAuto, hasManual;
			let optGroup, optionCount;
			
			for(var i = 0; i < soGroupCheck.length; i++){
				groupId = soGroupCheck[i].value;
				groupName = $(soGroupCheck[i]).prop('name');
				// 自動
				groupSoTables = tableSo.filter('.' + groupId);
				hasAuto = false;
				hasManual = false;
				
				for(var j = 0; j < groupSoTables.length; j++){
					nodeId = $(groupSoTables[j]).prop('id')
					amStatus = $('#nodeControl' + nodeId).val();
					
					if(!hasAuto && amStatus == 1){
						hasAuto = true;
					}
					
					if(!hasManual && amStatus == 0){
						hasManual = true;
					}
				}
				
				if(hasAuto){
					// グループが登録されている時のみグループ情報を追加
					optGroup = $('<optgroup label="' + groupName + '"></optgroup>');
					optionCount = 0;
					
					for(var j = 0; j < groupSoTables.length; j++){
						nodeId = $(groupSoTables[j]).prop('id')
						amStatus = $('#nodeControl' + nodeId).val();
						
						if(amStatus == 1){
							// 未接続でない場合
							if($('#nocHidden' + nodeId).val() != 2){
								optionCount++;
								nodeName = $('#nodeName' + nodeId).html();
								nodeOption = '<option value="' + nodeId + '">' + nodeName + '</option>';
								
								if(soGroupCheck.length > 1){
									optGroup.append(nodeOption);
								}else{
									selectAutoManualMultipleTo.append(nodeOption);
								}
								
								if(autoAll == ''){
									autoAll = nodeId;
								}else{
									autoAll += ',' + nodeId;
								}
							}
						}
					}
					
					if(optionCount > 0){
	
						if(soGroupCheck.length > 1){
							selectAutoManualMultipleTo.append(optGroup);
						}
					}
				}
				
				if(hasManual){
					// グループが登録されている時のみグループ情報を追加
					optGroup = $('<optgroup label="' + groupName + '"></optgroup>');
					optionCount = 0;
					
					for(var j = 0; j < groupSoTables.length; j++){
						nodeId = $(groupSoTables[j]).prop('id')
						amStatus = $('#nodeControl' + nodeId).val();
						
						if(amStatus == 0){
							// 未接続でない場合
							if($('#nocHidden' + nodeId).val() != 2){
								optionCount++;
								nodeName = $('#nodeName' + nodeId).html();
								nodeOption = '<option value="' + nodeId + '">' + nodeName + '</option>';
								
								if(soGroupCheck.length > 1){
									optGroup.append(nodeOption);
								}else{
									selectAutoManualMultiple.append(nodeOption);
								}
								
								if(manualAll == ''){
									manualAll = nodeId;
								}else{
									manualAll += ',' + nodeId;
								}
							}
						}
					}
					if(optionCount > 0){
	
						if(soGroupCheck.length > 1){
							selectAutoManualMultiple.append(optGroup);
						}
					}
				}
			}
		}
	}else {
		
		for(var j = 0; j < tableSo.length; j++){
			nodeId = $(tableSo[j]).prop('id')
			amStatus = $('#nodeControl' + nodeId).val();
			// 自動
			if(amStatus == 1) {
				// 未接続でない場合
				if($('#nocHidden' + nodeId).val() != 2){
					nodeName = $('#nodeName' + nodeId).html();
					nodeOption = '<option value="' + nodeId + '">' + nodeName + '</option>';
					selectAutoManualMultipleTo.append(nodeOption);
					
					if(autoAll != ''){
						autoAll += ',';
					}
					autoAll += nodeId;
				}
			}else { // 手動
				// 未接続でない場合
				if($('#nocHidden' + nodeId).val() != 2){
					nodeName = $('#nodeName' + nodeId).html();
					nodeOption = '<option value="' + nodeId + '">' + nodeName + '</option>';
					selectAutoManualMultiple.append(nodeOption);
					
					if(manualAll != ''){
						manualAll += ',';
					}
					manualAll += nodeId;
				}
			}
		}
	}
	selectAutoManualMultiple.multiselect();
	// show popup div
	$('#autoManualAllPopup').modal('toggle');
});

var scheduleAll = $('[name="amaSchedule"]:checked').val();
// 一括自動手動の確認ボタンの動作
function updateAutoManualAll(){
	// 自動
	let autoAllNew = selectAutoManualMultipleTo.find('option').map(function(){
		return $(this).val();
	}).get().join(',');
	// 手動
	let manualAllNew = selectAutoManualMultiple.find('option').map(function(){
		return $(this).val();
	}).get().join(',');
	// 自動の変化チェック
	let autoAllArr;
	
	if(autoAll != ''){
		autoAllArr = autoAll.split(',');
	}
	let autoAllNewArr;
	
	if(autoAllNew != ''){
		autoAllNewArr = autoAllNew.split(',');
	}
	let autoAllChanged = false;
	
	if(autoAllArr == null){
		
		if(autoAllNewArr != null){
			autoAllChanged = true;
		}
	}else{
		
		if(autoAllNewArr == null){
			autoAllChanged = true;
		}else{
			
			if(autoAllArr.length != autoAllNewArr.length){
				autoAllChanged = true;
			}else{
				
				for(var i = 0; i < autoAllArr.length; i++){
					
					if(!autoAllChanged && autoAllNew.indexOf(autoAllArr[i]) < 0){
						autoAllChanged = true;
					}
				}
			}
		}
	}
	//　手動の変化チェック
	let manualAllArr;
	
	if(manualAll != ''){
		manualAllArr = manualAll.split(',');
	}
	let manualAllNewArr;
	
	if(manualAllNew != ''){
		manualAllNewArr = manualAllNew.split(',');
	}
	let manualAllChanged = false;
	
	if(manualAllArr == null){
		
		if(manualAllNewArr != null){
			manualAllChanged = true;
		}
	}else{
		
		if(manualAllNewArr == null){
			manualAllChanged = true;
		}else{
			
			if(manualAllArr.length != manualAllNewArr.length){
				manualAllChanged = true;
			}else{
				
				for(var i = 0; i < manualAllArr.length; i++){
					
					if(!manualAllChanged && manualAllNew.indexOf(manualAllArr[i]) < 0){
						manualAllChanged = true;
					}
				}
			}
		}
	}
	// スケジュール変化チェック
	let scheduleAllChanged = false;
	let amaSchedule = $('[name="amaSchedule"]:checked').val();
	
	if(scheduleAll != amaSchedule){
		scheduleAllChanged = true;
		scheduleAll = amaSchedule;
	}
	
	if(autoAllChanged || manualAllChanged || scheduleAllChanged){
		let nodeNamesAuto = '';
		let autoAllNewArr = autoAllNew.split(',');
		let tdNodeControl;
		let tdNodeName;
		let nodeControl;
		
		for(var i = 0; i < autoAllNewArr.length; i++){
			tdNodeControl = $('#autoOrManual' + autoAllNewArr[i]);
			nodeControl = tdNodeControl.attr('data-nodeControl');
			
			if(nodeControl != 1){
				tdNodeName = $('#nodeName' + autoAllNewArr[i]);
				
				if(nodeNamesAuto != ''){
					nodeNamesAuto += ',';
				}
				nodeNamesAuto += $.trim(tdNodeName.html());
			}
		}
		
		let nodeNamesManual = '';
		let manualAllNewArr = manualAllNew.split(',');
		
		for(var i = 0; i < manualAllNewArr.length; i++){
			tdNodeControl = $('#autoOrManual' + manualAllNewArr[i]);
			nodeControl = tdNodeControl.attr('data-nodeControl');
			
			if(nodeControl != 0){
				tdNodeName = $('#nodeName' + manualAllNewArr[i]);
				
				if(nodeNamesManual != ''){
					nodeNamesManual += ',';
				}
				nodeNamesManual += $.trim(tdNodeName.html());
			}
		}
		
		let param = {};
		param['nodeIdsAuto'] = autoAllNew;
		param['nodeNamesAuto'] = nodeNamesAuto;
		param['nodeIdsManual'] = manualAllNew;
		param['nodeNamesManual'] = nodeNamesManual;
		
		if(autoAllChanged){
			param['autoAllChanged'] = 'y';
		}
		
		if(manualAllChanged){
			param['manualAllChanged'] = 'y';
		}
		param['schedule'] = $('[name="amaSchedule"]:checked').val();
		
		$.ajax({
			url: contextPath + 'Ajax/SimpleOperation/AutoManualSwitchAll.action',
			async: true,
			cache: false,
			data: param,
			success: function(response){
				let respObj = JSON.parse(response);
				
				if(respObj.error != null){
					
					if(respObj.errorType == 'inThread'){
						alert('通常への切り替え中のものがあるため操作できません。');
					}else if(respObj.errorType == 'sync'){
						alert('同期サーバに接続できませんでした。しばらくしてからリトライしてください。');
					}
				}
			},
			error: function(response){
				console.log('error: set auto/manual all failed.');
			}
		});
		$('#autoManualAllPopup').modal('toggle');
	}
}

//-----------popup time select options start
initSelectOption($('#mo'), 1, 12);
initSelectOption($('#d'), 1, 31);
initSelectOption($('#h'), 0, 23);
initSelectOption($('#mi'), 0, 59);
//-----------popup time select options end
//-------------------------------init end

var schedulePopup = $('#schedulePopup');
var scheduleNodeName = $('#schedule-nodeName-span');
var scheduleStatusName = $('#schedule-status-span');
//自動から手動　スケジュールON
var atmScheduleOn = $('#schedule-on-autoToManual');
//自動から手動　スケジュールOFF
var atmScheduleOff = $('#schedule-off-autoToManual');
//手動から自動　スケジュールON
var mtaScheduleOn = $('#schedule-on-manualToAuto');
//手動から自動　スケジュールOFF
var mtaScheduleOff = $('#schedule-off-manualToAuto');

function initSelectOption(selectEl, minValue, maxValue){

	for(var i = minValue; i <= maxValue; i++){
		selectEl.append('<option value="' + i + '">' + i + "</option>");
	}
}
getUpdatedStatus();
saveGroupChecked();
setInterval(saveGroupChecked, 1000);

//***** ヘルプメッセージ
divHelpQuestionMark.each(function(){
	let item = $(this);
	item.popover({
		trigger: 'manual',
		html: true,
		content: divHelp.filter('#' + item.attr('data-msg-div')).html()
	}).on("mouseenter", function () {
		$(this).popover('show');
	}).on("mouseleave", function () {
    	let popoverHovers = $(".popover:hover");
    	
    	if(popoverHovers.length > 0){
	    	popoverHovers.each(function(){
	    		$(this).on('mouseleave', function(){
	    			$(this).hide();
	    		});
	    	});
    	}else{
    		$(this).popover('hide');
    	}
	});
})

if(reqMaskStatus == 'on'){
	helpOptionToggleCheck.prop('checked', true);
}
helpOptionToggleCheck.change();

let listAjaxUpdateOnOffSecond = new ListAjaxUpdateOnOffSecond();
let listAjaxUpdateWatchingThresholdElectricEnergy = new ListAjaxUpdateWatchingThresholdElectricEnergy();
let ajaxUpdateItems = new AjaxUpdateItems({url: contextPath + 'Rest/SimpleOperation/UpdateOne.action'});
let listAjaxUpdateAlarmLockTime = new ListAjaxUpdateAlarmLockTime({url: contextPath + 'Rest/SimpleOperation/UpdateOne.action'});
let listAjaxUpdateThresholdTemperatureCooling = new ListAjaxUpdateThresholdTemperatureCooling();
let listAjaxUpdateThresholdTemperatureCoolingKeep = new ListAjaxUpdateThresholdTemperatureCoolingKeep();
let listAjaxUpdateThresholdTemperatureHeating = new ListAjaxUpdateThresholdTemperatureHeating();
let listAjaxUpdateThresholdTemperatureHeatingKeep = new ListAjaxUpdateThresholdTemperatureHeatingKeep();
//===== ヘルプメッセージ
//__________________________________________ init end