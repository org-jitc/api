function Node(){
	this.validationItems = [
		'nodeName', 
		'nodeType',
		'comMethod',
		'ipAddress',
		'deviceId',
		'wirelessId',
		'channelList',
		'capacityChannelList',
		'protocol',
		'childId',
		'onMinMitute',
		'offMinMitute',
		'electricEnergySensorId',
		'thresholdEnergy',
		'inputWatchingTarget',
		'inputWatchingProcess',
		'controlInputCondition',
		'controlInputIds',
		'reductionCalculationMethod',
		'reductionDispMode',
		'controlLockSec',
		'reduceEnergyGroupId',
		'reduceEnergyGroupPriority',
		'onWord',
		'offWord',
		'beforeSec',
		'afterSec'
	];
	
	this.div = {errors: {}, elements: {}};
	this.div.errors.error = document.querySelector('#div-error');
	for(let i = 0, l = this.validationItems.length; i < l; i++){
		this.div.errors[this.validationItems[i]] = document.querySelector('#div-error-' + this.validationItems[i]);
	}
	this.div.elements.arsId = document.querySelector('#divArs');
	
	this.form = document.querySelector('#formNode');
	this.nodeId = document.querySelector('#nodeId');
	
	this.groupId = new ZeusSelect({id: 'groupId', textId: 'groupName'});
	this.nodeName = document.querySelector('#nodeNameStr');
	this.nodeType = document.querySelector('#nodeType');
	this.comMethod = document.querySelector('#comMethod');
	this.ipaddr01 = document.querySelector('#ipaddr01');
	this.ipaddr02 = document.querySelector('#ipaddr02');
	this.ipaddr03 = document.querySelector('#ipaddr03');
	this.ipaddr04 = document.querySelector('#ipaddr04');
	this.portNumber = document.querySelector('#portNumber');
	this.ipAddress = document.querySelector('#ipAddress');
	this.deviceId = document.querySelector('#deviceId');
	this.connectionMode = new ZeusRadio({name: 'connectionMode', textId: 'connectionModeName'});
	this.wirelessId = document.querySelector('#wirelessId');
	this.channelType = new ZeusRadio({name: 'channelType', onchange: this.onChannelTypeChange});
	this.channelList = document.querySelector('#channelList');
	this.controlWaitTime = document.querySelector('#controlWaitTime');
	this.controlSwitchingOrder = new ZeusRadio({name: 'controlSwitchingOrder'});
	this.capacityChannelList = document.querySelector('#capacityChannelList');
	this.capacityWaitTime = document.querySelector('#capacityWaitTime');
	this.capacitySwitchingOrder = new ZeusRadio({name: 'capacitySwitchingOrder'});
	this.capacityDemandMode = new ZeusRadio({name: 'capacityDemandMode'});
	this.controlStatusOffword = document.querySelector('#controlStatusOffword');
	this.controlStatusOnword = document.querySelector('#controlStatusOnword');
	this.controlStatusOnwordCapacity = document.querySelector('#controlStatusOnwordCapacity');
	this.demandControl = new ZeusRadio({name: 'demandControl'});
	this.protocol = document.querySelector('#protocol');
	this.childId = document.querySelector("#childId");
	this.boxId = document.querySelector('#boxId');
	this.onMinMitute = document.querySelector('#onMinMitute');
	this.offMinMitute = document.querySelector('#offMinMitute');
	this.alertLimitMinute = document.querySelector('#alertLimitMinute');
	this.alertLimitCount = document.querySelector('#alertLimitCount');
	this.electricEnergySensorId = new ZeusSelect({id: 'electricEnergySensorId', textId: 'electricEnergySensorName'});
	this.thresholdEnergy = document.querySelector('#thresholdEnergy');
	this.inputWatchingTarget = new ZeusSelect({id: 'inputWatchingTarget', textId: 'inputWatchingTargetName'});
	this.inputWatchingProcess = document.querySelector('#inputWatchingProcess');
	this.inputWatchingOnword = document.querySelector('#inputWatchingOnword');
	this.controlInputCondition = document.querySelector('#controlInputCondition');
	this.controlInputIds = new ZeusCheckbox({name: 'controlInputIds', checkedValuesId: 'controlInputIdsStr', checkedTextId: 'controlInputNames'});
	this.inputId = new ZeusSelect({id: 'inputId', textId: 'inputName'});
	this.reductionCalculationMethod = new ZeusRadio({name: 'reductionCalculationMethod', onchange: this.onReductionCalculationMethodChange.bind(this), isCallOnChange: false});
	this.reductionDispMode = new ZeusRadio({name: 'reductionDispMode', onchange: this.onReductionDispModeChange.bind(this), isCallOnChange: false});
	this.arsId = new ZeusSelect({id: 'arsId', textId: 'arsName'});
	this.controlLockSec = document.querySelector('#controlLockSec');
	this.reduceEnergyGroupId = document.querySelector('#reduceEnergyGroupId');
	this.reduceEnergyGroupPriority = document.querySelector('#reduceEnergyGroupPriority');
	this.onCheck = new ZeusRadio({name: 'onCheck'});
	this.onWord = document.querySelector('#onWord');
	this.offCheck = new ZeusRadio({name: 'offCheck'});
	this.offWord = document.querySelector('#offWord');
	this.beforeSec = document.querySelector('#beforeSec');
	this.afterSec = document.querySelector('#afterSec');
	this.btnSubmit = document.querySelector('#btnSubmit');
	// set attribute
	this.channelList.placeholder = '「,」区切りで複数入力可';
	this.capacityChannelList.placeholder = '「,」区切で複数入力可';
	this.controlStatusOffword.placeholder = '通常';
	this.controlStatusOnword.placeholder = '制御または停止';
	this.controlStatusOnwordCapacity.placeholder = '容量';
	// attach events
	this.form.onsubmit = this.onSubmit;
	this.ipaddr01.onkeyup = zeus.onNumberInput;
	this.ipaddr02.onkeyup = zeus.onNumberInput;
	this.ipaddr03.onkeyup = zeus.onNumberInput;
	this.ipaddr04.onkeyup = zeus.onNumberInput;
	this.portNumber.onkeyup = zeus.onNumberInput;
	this.wirelessId.onkeyup = zeus.onNumberInput;
	this.channelList.onblur = this.onChannelListBlur;
	this.controlWaitTime.onkeyup = zeus.onNumberInput;
	this.capacityChannelList.onblur = this.onChannelListBlur;
	this.capacityWaitTime.onkeyup = zeus.onNumberInput;
	this.childId.onkeyup = zeus.onNumberInput;
	this.boxId.onkeyup = zeus.onNumberInput;
	this.onMinMitute.onkeyup = zeus.onNumberInput;
	this.offMinMitute.onkeyup = zeus.onNumberInput;
	this.alertLimitMinute.onkeyup = zeus.onNumberInput;
	this.alertLimitCount.onkeyup = zeus.onNumberInput;
	this.thresholdEnergy.onkeyup = zeus.onNumberInput;
	this.controlLockSec.onkeyup = zeus.onNumberInput;
	this.inputWatchingTarget.onchange = this.onInputWatchingTargetProcessChange.bind(this);
	this.inputWatchingProcess.onchange = this.onInputWatchingTargetProcessChange.bind(this);
	this.reduceEnergyGroupId.onkeyup = zeus.onNumberInput;
	this.reduceEnergyGroupPriority.onkeyup = zeus.onNumberInput;
	this.comMethod.onchange = this.onComMethodChange.bind(this);
	this.beforeSec.onkeyup = zeus.onNumberInput;
	this.afterSec.onkeyup = zeus.onNumberInput;
	// init
	this.onComMethodChange.call(this);
	if(this.channelType.radios[0].checked){
		this.onChannelTypeChange.call(this.channelType.radios[0]);
	}else{
		this.onChannelTypeChange.call(this.channelType.radios[1]);
	}
	this.onInputWatchingTargetProcessChange.call(this);
	this.reductionCalculationMethod.disabled(this.nodeId == null);
	this.onReductionCalculationMethodChange.call(this);
	this.onReductionDispModeChange.call(this);
	if(this.nodeId == null){
		this.reductionDispMode.radios[1].disabled = true;
	}
	this.controlInputIds.onOneChange.call(this.controlInputIds);
		
	if(this.nodeId != null){
		this.createOrigin();
	}
}
Node.prototype = {
	// events
	onComMethodChange: function(){
		let ipDisabled = this.comMethod.value !== 'http';
		let deviceDisabled = this.comMethod.value !== 'serial';
		this.ipaddr01.disabled = ipDisabled;
		this.ipaddr02.disabled = ipDisabled;
		this.ipaddr03.disabled = ipDisabled;
		this.ipaddr04.disabled = ipDisabled;
		this.portNumber.disabled = ipDisabled;
		this.deviceId.disabled = deviceDisabled;
	},
	onChannelTypeChange: function(){
		let items = document.querySelectorAll('[data-control-by="channelType"]');
		let controlValue;
		
		for(let i = 0, l = items.length; i < l; i++){
			controlValue = items[i].getAttribute('data-control-value');
			
			if(controlValue == this.value){
				zeus.showElement(items[i]);
			}else{
				zeus.hideElement(items[i]);
			}
		}
	},
	onChannelListBlur: function(){
		this.value = this.value.match(/^\d+(,\d+)*/g);
	},
	onInputWatchingTargetProcessChange: function(){
		/**
		 * disabled: true
		 * 	inputWatchingTarget === '' || inputWatchingProcess.value !== '1'
		 * disabled: false
		 * 	inputWatchingTarget !== '' || inputWatchingProcess.value === '1'
		 */
		this.inputWatchingOnword.disabled = this.inputWatchingTarget.value === '' || this.inputWatchingProcess.value !== '1';
	},
	onInputWatchingProcessChange: function(){
		
	},
	onReductionCalculationMethodChange: function(){
		this.controlLockSec.disabled = this.reductionCalculationMethod.getCheckedValue() == 0;
	},
	onReductionDispModeChange: function(){
		let value = this.reductionDispMode.getCheckedValue();
		if(value == 0){
			if(this.arsId.select){
				this.arsId.select.selectedIndex = 0;
			}
			zeus.hideElement(this.div.elements.arsId);
		}else{
			zeus.showElement(this.div.elements.arsId);
		}
	},
	onSubmit: function(ev){
		let isValid = node.isChanged() && node.validate();
		if(isValid){
			node.ipAddress.value = [node.ipaddr01.value.trim(), node.ipaddr02.value.trim(), node.ipaddr03.value.trim(), node.ipaddr04.value.trim()].join('.') + ':' + node.portNumber.value.trim();
		}else{
			ev = ev || window.event;
			if(ev.preventDefault) ev.preventDefault();
			else window.event.returnValue = false;
		}
	},
	// functions
	isChanged: function(){
		let isChanged = this.nodeId == null || this.origin != this.toString();
		if(this.nodeId != null){
			
			if(isChanged){
				zeus.hideElement(this.div.errors.error);
			}else{
				zeus.showElement(this.div.errors.error);
			}
		}
		return isChanged;
	},
	setValidationError: function(obj){
		let objError, item;
		
		for(let i = 0, l = this.validationItems.length; i < l; i++){
			item = this.validationItems[i];
			objError = obj[item];
			
			if(objError == null){
				zeus.hideElement(this.div.errors[item]);
			}else{
				this.div.errors[item].innerHTML = objError.message;
				zeus.showElement(this.div.errors[item]);
			}
		}
	},
	validate: function(){
		$(this.btnSubmit).button('loading');
		let isValid = true;
		zeus.ajax({
			url: contextPath + 'Rest/Node/Validate.action',
			async: false,
			data: this.toJSON(),
			success: function(resp){
				let objResp = JSON.parse(resp);
				if(objResp.result === 'ng'){
					isValid = false;
					node.setValidationError(objResp);
				}
			},
			error: function(){
				isValid = false;
				popupError.setMessage('エラーが発生しました。');
			}
		});
		$(this.btnSubmit).button('reset');
		return isValid;
	},
	toJSON: function(){
		let obj = {
			groupId: this.groupId.select.value,
			nodeNameStr: this.nodeName.value,
			nodeType: this.nodeType.value,
			comMethod: this.comMethod.value,
			ipaddr01: this.comMethod.value === 'http'? this.ipaddr01.value: '',
			ipaddr02: this.comMethod.value === 'http'? this.ipaddr02.value: '',
			ipaddr03: this.comMethod.value === 'http'? this.ipaddr03.value: '',
			ipaddr04: this.comMethod.value === 'http'? this.ipaddr04.value: '',
			portNumber: this.comMethod.value === 'http'? this.portNumber.value: '',
			deviceId: this.comMethod.value === 'serial'? this.deviceId.value: '',
			connectionMode: this.connectionMode.getCheckedValue(),
			wirelessId: this.wirelessId.value,
			channelType: this.channelType.getCheckedValue(),
			channelList: this.channelList.value,
			controlWaitTime: this.controlWaitTime.value,
			controlSwitchingOrder: this.controlSwitchingOrder.getCheckedValue(),
			capacityChannelList: this.capacityChannelList.value,
			capacityWaitTime: this.capacityWaitTime.value,
			capacitySwitchingOrder: this.capacitySwitchingOrder.getCheckedValue(),
			capacityDemandMode: this.capacityDemandMode.getCheckedValue(),
			controlStatusOffword: this.controlStatusOffword.value,
			controlStatusOnword: this.controlStatusOnword.value,
			controlStatusOnwordCapacity: this.controlStatusOnwordCapacity.value,
			demandControl: this.demandControl.getCheckedValue(),
			protocol: this.protocol.value,
			childId: this.childId.value,
			boxId: this.boxId.value,
			onMinMitute: this.onMinMitute.value,
			offMinMitute: this.offMinMitute.value,
			alertLimitMinute: this.alertLimitMinute.value,
			alertLimitCount: this.alertLimitCount.value,
			electricEnergySensorId: this.electricEnergySensorId.select.value,
			thresholdEnergy: this.thresholdEnergy.value,
			inputWatchingTarget: this.inputWatchingTarget.select.value,
			inputWatchingProcess: this.inputWatchingProcess.value,
			inputWatchingOnword: this.inputWatchingOnword.value,
			controlInputCondition: this.controlInputCondition.value,
			controlInputIds: this.controlInputIds.checkedValues(),
			inputId: this.inputId.select.value,
			reductionCalculationMethod: this.reductionCalculationMethod.getCheckedValue(),
			reductionDispMode: this.reductionDispMode.getCheckedValue(),
			controlLockSec: this.controlLockSec.value,
			reduceEnergyGroupId: this.reduceEnergyGroupId.value,
			reduceEnergyGroupPriority: this.reduceEnergyGroupPriority.value,
			onCheck: this.onCheck.getCheckedValue(),
			onWord: this.onWord.value,
			offCheck: this.offCheck.getCheckedValue(),
			offWord: this.offWord.value,
			beforeSec: this.beforeSec.value,
			afterSec: this.afterSec.value
		};
		if(this.nodeId != null){
			obj.nodeId = this.nodeId.value;
			obj.arsId = this.arsId.select.value;
		}
		return obj;
	},
	createOrigin: function(){
		this.origin = origin;
	},
	toString: function(){
		return JSON.stringify(this.toJSON());
	}
}

// node module initialization
let node = new Node();