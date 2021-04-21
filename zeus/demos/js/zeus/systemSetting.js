function SystemSetting(){
	let _this = this;
	let datePickerOptions = {
		language: 'ja',
		format: 'yyyy-mm-dd',
		minView: 2,
		autoclose: true,
		todayBtn: 'linked',
		todayHighlight: true
	};
	this.validateItems = [
		'monthHeating',
		'monthCooling',
		'controlStatusDisplaySpan',
		'sensorErrorHistoryDisplaySpan',
		'messageCautionstart',
		'messageCautionend',
		'messageDemandstart',
		'messageDemandend',
		'messageLimitstart',
		'messageDemandstartIndividual',
		'messageDemandendIndividual',
		'messageCellvoltage',
		'messageCheckdisk',
		'messageElectricthreshold',
		'messageLightcontrollercomerror',
		'messageEcokeepercomerror',
		'messageDemandcomerror',
		'messageElectriccomerror',
		'messageLeakcomerror',
		'messageTempcomerror',
		'messageRelaycomerror',
		'messageDatapool',
		'messageJavarestart',
		'messageVpsrebootStart',
		'messageVpsreboot',
		'messageRebootStart',
		'messageReboot',
		'messageVirtualhub',
		'messageRelaychange',
		'messageCommunicationNg',
		'messageCommunicationControloff',
		'messageCommunicationControlon',
		'messageErrorlog',
		'messageNolog',
		'messageSystem',
		'messageShutdown',
		'messageSmarterror',
		'messageDbdumperror',
		'messageBackuperror',
		'messageServerrunning'
	];
	this.div = {errors: {}};
	
	for(let i = 0, l = this.validateItems.length; i < l; i++){
		this.div.errors[this.validateItems[i]] = document.querySelector('#div-error-' + this.validateItems[i]);
	}
	
	this.form = document.querySelector('#form-confirm');
	this.co2Coefficient = document.querySelector('#co2Coefficient');
	this.mierukaOtherDisp = new ZeusRadio({name: 'mierukaOtherDisp'});
	this.graphColorOther = document.querySelector('#graphColorOther');
	this.userDefinedColor = new ZeusRadio({name: 'userDefinedColor'});
	this.monthCooling = document.querySelector('#monthCooling');
	this.dayCooling = document.querySelector('#dayCooling');
	this.monthHeating = document.querySelector('#monthHeating');
	this.dayHeating = document.querySelector('#dayHeating');
	this.yearlyDisp = new ZeusRadio({name: 'yearlyDisp'});
	this.yearlyStartMonth = document.querySelector('#yearlyStartMonth');
	this.startDay = document.querySelector('#startDay');
	this.flowUnit = new ZeusRadio({name: 'flowUnit'});
	//>> admin
	this.dataDisplayTitleOrder = new ZeusRadio({name: 'dataDisplayTitleOrder'});
	this.electricUsageHeaderRgb = document.querySelector('#electricUsageHeaderRgb');
	this.electricUsageFooterRgb = document.querySelector('#electricUsageFooterRgb');
	this.demandAreaRgbChange = new ZeusRadio({name: 'demandAreaRgbChange'});
	this.demandTightAlarm = new ZeusRadio({name: 'demandTightAlarm'});
	this.editButtonDisplayUser = new SetNameCheckbox('editButtonDisplayUser');
	this.editButtonDisplayUserLight = new SetNameCheckbox('editButtonDisplayUserLight');
	//<< admin
	//>> systemadmin
	this.systemImportDate = document.querySelector('#systemImportDate');
	this.contractPowerBefore = document.querySelector('#contractPowerBefore');
	this.electricPrice = document.querySelector('#electricPrice');
	this.electricBillDisplay = new ZeusRadio({name: 'electricBillDisplay'});
	this.logoId = new ZeusSelect({id: 'logoId', textId: 'logoName'});
	this.loginPwdDisplay = new ZeusRadio({name: 'loginPwdDisplay'});
	this.copyrightDisplay = new ZeusRadio({name: 'copyrightDisplay'});
	this.systemLanguage = document.querySelector('#systemLanguage');
	this.displayLoginInfoCount = document.querySelector('#displayLoginInfoCount');
	this.displayUnit = new ZeusCheckbox({name: 'displayUnit', checkedValuesId: 'displayUnitStr', checkedTextId: 'displayUnitNames'});
	this.monitorOption = new ZeusCheckbox({name: 'monitorOption', checkedValuesId: 'monitorOptionStr', checkedTextId: 'monitorOptionNames'});
	this.controlStatusDisplaySpan = document.querySelector('#controlStatusDisplaySpan');
	this.sensorErrorHistoryDisplaySpan = document.querySelector('#sensorErrorHistoryDisplaySpan');
	this.resetNodeId = new ZeusSelect({id: 'resetNodeId', textId: 'resetNodeName'});
	this.messageCautionstart = document.querySelector('#messageCautionstart');
	this.messageCautionend = document.querySelector('#messageCautionend');
	this.messageDemandstart = document.querySelector('#messageDemandstart');
	this.messageDemandend = document.querySelector('#messageDemandend');
	this.messageLimitstart = document.querySelector('#messageLimitstart');
	this.messageDemandstartIndividual = document.querySelector('#messageDemandstartIndividual');
	this.messageDemandendIndividual = document.querySelector('#messageDemandendIndividual');
	this.messageCellvoltage = document.querySelector('#messageCellvoltage');
	this.messageCheckdisk = document.querySelector('#messageCheckdisk');
	this.messageElectricthreshold = document.querySelector('#messageElectricthreshold');
	this.messageLightcontrollercomerror = document.querySelector('#messageLightcontrollercomerror');
	this.messageEcokeepercomerror = document.querySelector('#messageEcokeepercomerror');
	this.messageDemandcomerror = document.querySelector('#messageDemandcomerror');
	this.messageElectriccomerror = document.querySelector('#messageElectriccomerror');
	this.messageLeakcomerror = document.querySelector('#messageLeakcomerror');
	this.messageTempcomerror = document.querySelector('#messageTempcomerror');
	this.messageRelaycomerror = document.querySelector('#messageRelaycomerror');
	this.messageDatapool = document.querySelector('#messageDatapool');
	this.messageJavarestart = document.querySelector('#messageJavarestart');
	this.messageVpsrebootStart = document.querySelector('#messageVpsrebootStart');
	this.messageVpsreboot = document.querySelector('#messageVpsreboot');
	this.messageRebootStart = document.querySelector('#messageRebootStart');
	this.messageReboot = document.querySelector('#messageReboot');
	this.messageVirtualhub = document.querySelector('#messageVirtualhub');
	this.messageRelaychange = document.querySelector('#messageRelaychange');
	this.messageCommunicationNg = document.querySelector('#messageCommunicationNg');
	this.messageCommunicationControloff = document.querySelector('#messageCommunicationControloff');
	this.messageCommunicationControlon = document.querySelector('#messageCommunicationControlon');
	this.messageErrorlog = document.querySelector('#messageErrorlog');
	this.messageNolog = document.querySelector('#messageNolog');
	this.messageSystem = document.querySelector('#messageSystem');
	this.messageShutdown = document.querySelector('#messageShutdown');
	this.messageSmarterror = document.querySelector('#messageSmarterror');
	this.messageDbdumperror = document.querySelector('#messageDbdumperror');
	this.messageBackuperror = document.querySelector('#messageBackuperror');
	this.messageServerrunning = document.querySelector('#messageServerrunning');
	//<< systemadmin
	//>> hidden
	this.coolingDate = document.querySelector('#coolingDate');
	this.heatingDate = document.querySelector('#heatingDate');
	//<< hidden
	
	// set attributes
	this.controlStatusDisplaySpan.setAttribute('placeholder', '例： 5,10,15,20,30');
	this.sensorErrorHistoryDisplaySpan.setAttribute('placeholder', '例: 5,10,15,20,30');
	// bind events
	this.form.onsubmit = function(ev){
		let isValid = _this.isChanged();
		if(isValid){
			isValid = _this.validateForm();
		}
		if(isValid){
			_this.coolingDate.value = _this.monthCooling.value + _this.dayCooling.value;
			_this.heatingDate.value = _this.monthHeating.value + _this.dayHeating.value;
		}else{
			ev = ev || window.event;
			if(ev.preventDefault) {
				ev.preventDefault();
			}else {
				window.event.returnValue = false;
			}
		}
	};
	this.co2Coefficient.onkeyup = this.onCo2CoefficientKeyup;
	this.co2Coefficient.onblur = this.onDoubleD2Blur;
	for(let i = 0, l = this.yearlyDisp.radios.length; i < l; i++){
		this.yearlyDisp.radios[i].onchange = this.onYearlyDispChange.bind(this);
	}
	this.contractPowerBefore.onkeyup = zeus.onNumberInput;
	this.electricPrice.onkeyup = this.onDoubleD2Input;
	this.electricPrice.onblur = this.onDoubleD2Blur;
	
	// initialize processes
	$(this.systemImportDate).datepicker(datePickerOptions);
	this.onYearlyDispChange.call(this);
}
SystemSetting.prototype = {
	// events
	onCo2CoefficientKeyup: function(){
		let matches = this.value.match(/\d.?(\d{1,6})?/);
		this.value = matches == null? '': matches[0];
	},
	onDoubleD2Input: function(){
		let matches = this.value.match(/\d+.?(\d{1,2})?/);
		this.value = matches == null? '': matches[0];
	},
	onDoubleD2Blur: function(){
		let val = this.value.trim();
		if(val.endsWith('.')){
		  	this.value = val.substring(0, val.length - 1);
		}
	},
	onYearlyDispChange: function(){
		this.yearlyStartMonth.disabled = this.yearlyDisp.getCheckedValue() == 0;
	},
	// methods
	toObject: function(isValidate){
		let obj = {};
		if(!isValidate){
			obj.co2Coefficient = this.co2Coefficient.value.trim();
			obj.mierukaOtherDisp = this.mierukaOtherDisp.getCheckedValue();
			obj.graphColorOther = this.graphColorOther.value.trim();
			obj.userDefinedColor = this.userDefinedColor.getCheckedValue();
		}
		obj.monthCooling = this.monthCooling.value;
		obj.dayCooling = this.dayCooling.value;
		obj.monthHeating = this.monthHeating.value;
		obj.dayHeating = this.dayHeating.value;
		if(!isValidate){
			obj.yearlyDisp = this.yearlyDisp.getCheckedValue();
			obj.yearlyStartMonth = this.yearlyStartMonth.value;
			obj.startDay = this.startDay.value;
			obj.flowUnit = this.flowUnit.getCheckedValue();
			//>> admin
			obj.dataDisplayTitleOrder = this.dataDisplayTitleOrder.getCheckedValue();
			obj.electricUsageHeaderRgb = this.electricUsageHeaderRgb.value.trim();
			obj.electricUsageFooterRgb = this.electricUsageFooterRgb.value.trim();
			obj.demandAreaRgbChange = this.demandAreaRgbChange.getCheckedValue();
			obj.demandTightAlarm = this.demandTightAlarm.getCheckedValue();
			obj.editButtonDisplayUserStr = this.editButtonDisplayUser.getCheckedIds();
			obj.editButtonDisplayUserLightStr = this.editButtonDisplayUserLight.getCheckedIds();
			//<< admin
			//>> systemadmin
			obj.systemImportDate = this.systemImportDate.value.trim();
			obj.contractPowerBefore = this.contractPowerBefore.value.trim();
			obj.electricPrice = this.electricPrice.value.trim();
			obj.electricBillDisplay = this.electricBillDisplay.getCheckedValue();
			obj.logoId = this.logoId.select.value;
			obj.loginPwdDisplay = this.loginPwdDisplay.getCheckedValue();
			obj.copyrightDisplay = this.copyrightDisplay.getCheckedValue();
			obj.systemLanguage = this.systemLanguage.value;
			obj.displayLoginInfoCount = this.displayLoginInfoCount.value.trim();
			obj.displayUnitStr = this.displayUnit.checkedValues();
			obj.monitorOptionStr = this.monitorOption.checkedValues();
		}
		obj.controlStatusDisplaySpan = this.controlStatusDisplaySpan.value.trim();
		obj.sensorErrorHistoryDisplaySpan = this.sensorErrorHistoryDisplaySpan.value.trim();
		if(!isValidate){
			obj.resetNodeId = this.resetNodeId.select.value;
		}
		obj.messageCautionstart = this.messageCautionstart.value.trim();
		obj.messageCautionend = this.messageCautionend.value.trim();
		obj.messageDemandstart = this.messageDemandstart.value.trim();
		obj.messageDemandend = this.messageDemandend.value.trim();
		obj.messageLimitstart = this.messageLimitstart.value.trim();
		obj.messageDemandstartIndividual = this.messageDemandstartIndividual.value.trim();
		obj.messageDemandendIndividual = this.messageDemandendIndividual.value.trim();
		obj.messageCellvoltage = this.messageCellvoltage.value.trim();
		obj.messageCheckdisk = this.messageCheckdisk.value.trim();
		obj.messageElectricthreshold = this.messageElectricthreshold.value.trim();
		obj.messageLightcontrollercomerror = this.messageLightcontrollercomerror.value.trim();
		obj.messageEcokeepercomerror = this.messageEcokeepercomerror.value.trim();
		obj.messageDemandcomerror = this.messageDemandcomerror.value.trim();
		obj.messageElectriccomerror = this.messageElectriccomerror.value.trim();
		obj.messageLeakcomerror = this.messageLeakcomerror.value.trim();
		obj.messageTempcomerror = this.messageTempcomerror.value.trim();
		obj.messageRelaycomerror = this.messageRelaycomerror.value.trim();
		obj.messageDatapool = this.messageDatapool.value.trim();
		obj.messageJavarestart = this.messageJavarestart.value.trim();
		obj.messageVpsrebootStart = this.messageVpsrebootStart.value.trim();
		obj.messageVpsreboot = this.messageVpsreboot.value.trim();
		obj.messageRebootStart = this.messageRebootStart.value.trim();
		obj.messageReboot = this.messageReboot.value.trim();
		obj.messageVirtualhub = this.messageVirtualhub.value.trim();
		obj.messageRelaychange = this.messageRelaychange.value.trim();
		obj.messageCommunicationNg = this.messageCommunicationNg.value.trim();
		obj.messageCommunicationControloff = this.messageCommunicationControloff.value.trim();
		obj.messageCommunicationControlon = this.messageCommunicationControlon.value.trim();
		obj.messageErrorlog = this.messageErrorlog.value.trim();
		obj.messageNolog = this.messageNolog.value.trim();
		obj.messageSystem = this.messageSystem.value.trim();
		obj.messageShutdown = this.messageShutdown.value.trim();
		obj.messageSmarterror = this.messageSmarterror.value.trim();
		obj.messageDbdumperror = this.messageDbdumperror.value.trim();
		obj.messageBackuperror = this.messageBackuperror.value.trim();
		obj.messageServerrunning = this.messageServerrunning.value.trim();
		return obj;
	},
	isChanged: function(){
		let isChanged = JSON.stringify(this.toObject(false)) != origin;
		if(!isChanged){
			popupError.setMessage('変更されていません。');
		}
		return isChanged;
	},
	validateForm: function(){
		let isValid = true;
		$.ajax({
			url: contextPath + 'Rest/SystemSetting/Validate.action',
			async: false,
			cache: false,
			method: 'POST',
			data: this.toObject(true),
			systemSetting: this
		})
		.done(function(resp, status, jqxhr){
			let objResp = JSON.parse(resp);
			isValid = objResp.result === 'ok';
			let item;
			for(let i = 0, l = this.systemSetting.validateItems.length; i < l; i++){
				item = this.systemSetting.validateItems[i];
				this.systemSetting.div.errors[item].innerHTML = objResp[item] == null? '': objResp[item].message;
			}
		})
		.fail(function(jqxhr, status, error){
			console.log(error);
			isValid = false;
			popupError.setMessage('エラーが発生しました。');
		});
		return isValid;
	}
};


//***** init
let systemSetting = new SystemSetting();
//===== init