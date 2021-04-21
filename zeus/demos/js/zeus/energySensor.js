function ComponentDisplayControl(config){
	this.controlSuffix = config.controlSuffix;
	this.all = document.querySelectorAll('.display-' + config.controlSuffix);
}
ComponentDisplayControl.prototype = {
	// methods
	setDisplay: function(val){
		let classes;
	
		for(let i = 0, l = this.all.length; i < l; i++){
			classes = this.all[i].getAttribute('class');
			
			if(classes.split(' ').indexOf(this.controlSuffix + '-' + val) >= 0){
				zeus.showElement(this.all[i]);
			}else{
				zeus.hideElement(this.all[i]);
			}
		}
	}
};

function ComponentDisableControl(config){
	this.controlSuffix = config.controlSuffix;
	this.all = document.querySelectorAll('.disable-' + config.controlSuffix);
}
ComponentDisableControl.prototype = {
	// methods
	setDisable: function(val){
		let classes;
		
		for(let i = 0, l = this.all.length; i < l; i++){
			classes = this.all[i].getAttribute('class');
			
			if(classes == null){
				this.all[i].disabled = true;
			}else{
				this.all[i].disabled = classes.split(' ').indexOf(this.controlSuffix + '-' + val) < 0;
			}
		}
	}
};

function ComponentSensorType(root){
	this.root = root;
	this.select = new ZeusSelect({id: 'sensorType'});
	this.displayControl = new ComponentDisplayControl({controlSuffix: 'sensortype'});
	this.disableControl = new ComponentDisableControl({controlSuffix: 'sensortype'});
	// attatch events
	this.select.select.onchange = this.onchange.bind(this);
}
ComponentSensorType.prototype = {
	// events
	onchange: function(){
		let val = this.select.select.value;
		this.displayControl.setDisplay(val);
		this.disableControl.setDisable(val);
		
		energyTypeSelect.empty();
		energyTypeSelect.append('<option value="">' + fmt.optionPleaseChoose + '</option>');
	
		// 電力
		if(val == 1){
			energyTypeSelect.append('<option value="27">昼間買電</option>');
			
			onDeviceTypeSelectChange();
		}else if(val == 2) {// ガス
			energyTypeSelect.append('<option value="11">液化石油ガス（LPG）</option>');
			energyTypeSelect.append('<option value="30">都市ガス（13A）</option>');
		}else if(val == 3){//重油センサー
			energyTypeSelect.append('<option value="7">Ａ重油</option>');
			energyTypeSelect.append('<option value="8">Ｂ・Ｃ重油</option>');
		}else if(val == 4) {
			energyTypeSelect.append('<option value="25">温水</option>');
			energyTypeSelect.append('<option value="26">冷水</option>');
		} else if(val == 6) {// エネルギー削減量
			energyTypeSelect.append('<option value="27">昼間買電</option>');
			energyTypeSelect.append('<option value="7">Ａ重油</option>');
			energyTypeSelect.append('<option value="8">Ｂ・Ｃ重油</option>');
			energyTypeSelect.append('<option value="11">液化石油ガス（LPG）</option>');
			energyTypeSelect.append('<option value="30">都市ガス（13A）</option>');
			energyTypeSelect.append('<option value="25">温水</option>');
			energyTypeSelect.append('<option value="26">冷水</option>');
		}
	}
};

function ComponentComselect(root){
	this.root = root;
	this.select = new ZeusSelect({id: 'comselect'});
	this.displayControl = new ComponentDisplayControl({controlSuffix: 'comselect'});
	this.disableControl = new ComponentDisableControl({controlSuffix: 'comselect'});
	// attach events
	this.select.select.onchange = this.onchange.bind(this);
}
ComponentComselect.prototype = {
	// events
	onchange: function(){
		let val = this.select.select.value;
		this.displayControl.setDisplay(val);
		this.disableControl.setDisable(val);
		//↓ プロトコル連携 virtual		
		if(val == 3){
		
			if(this.root.protocol.select.select.value != 18){
				this.root.protocol.setValue(18);
			}
		}else{
		
			if(this.root.protocol.select.select.value == 18){
				this.root.protocol.setValue(0);
			}
		}
		//↑ プロトコル連携 virtual		
	},
	// methods
	setValue: function(val){
		this.select.select.value = val;
		this.select.select.onchange();
	}
};

function ComponentProtocol(root){
	this.root = root;
	this.select = new ZeusSelect({id: 'protocol'});
	this.linkPowerWriting = document.querySelector('#link-power-writing');
	this.plcIpAddress = new ComponentPlcIpAddress(this);
	this.plcRegisterAddress = new ComponentPlcRegisterAddress();
	this.displayControl = new ComponentDisplayControl({controlSuffix: 'protocol'});
	this.disableControl = new ComponentDisableControl({controlSuffix: 'protocol'});
	// attach events
	this.select.select.onchange = this.onchange.bind(this);
	this.linkPowerWriting.onclick = this.onLinkPowerWritingClick.bind(this);
}
ComponentProtocol.prototype = {
	// events
	onchange: function(){
		let protocol = this.select.select.value;
		this.displayControl.setDisplay(protocol);
		this.disableControl.setDisable(protocol);
		//*******************通信方式連携　virtual
		//プロトコル：18仮想の場合
		if(protocol == 18) {
			// comselect: 3 virtual
			if(this.root.comselect.select.select.value != 3){
				this.root.comselect.setValue(3);
			}
		}else { //プロトコル：18仮想の以外の場合
			//通信方式：仮想が選択された場合
			if(this.root.comselect.select.select.value == 3){
				this.root.comselect.setValue(0);
			}
			zeus.hideElement(this.plcIpAddress.tr);
			zeus.hideElement(this.plcRegisterAddress.tr);
		}
		//__________________通信方式連携　virtual
	},
	onLinkPowerWritingClick: function(){
		zeus.showElement(this.plcIpAddress.tr);
		zeus.showElement(this.plcRegisterAddress.tr);
	},
	// methods
	setValue: function(val){
		this.select.select.value = val;
		this.select.select.onchange();
	}
};
// 電力値書込IPアドレス : ポート番号
function ComponentPlcIpAddress(root){
	this.root = root;
	this.name = 'plcIpAddress';
	this.tr = document.querySelector('#tr-' + this.name);
	this.error = document.querySelector('#error-' + this.name);
	this.plcIpAddress1 = document.querySelector('#' + this.name + '1');
	this.plcIpAddress2 = document.querySelector('#' + this.name + '2');
	this.plcIpAddress3 = document.querySelector('#' + this.name + '3');
	this.plcIpAddress4 = document.querySelector('#' + this.name + '4');
	this.plcIpAddressPort = document.querySelector('#' + this.name + 'Port');
	this.plcIpAddress = document.querySelector('#' + this.name);
	// attach events
	this.plcIpAddress1.onkeyup = zeus.onNumberInput;
	this.plcIpAddress2.onkeyup = zeus.onNumberInput;
	this.plcIpAddress3.onkeyup = zeus.onNumberInput;
	this.plcIpAddress4.onkeyup = zeus.onNumberInput;
	this.plcIpAddressPort.onkeyup = zeus.onNumberInput;
}
ComponentPlcIpAddress.prototype = {
	// methods
	setError: function(msg){
		this.error.innerText = msg == null? '': msg;
	},
	setIpAddress: function(){
		
		if(this.root.select.select.value != 18){
			this.plcIpAddress.value = '';
		}else{
			
			if(this.plcIpAddress1.value != ''){
				this.plcIpAddress.value = [
					[
						this.plcIpAddress1.value, 
						this.plcIpAddress2.value,
						this.plcIpAddress3.value,
						this.plcIpAddress4.value
					].join('.'),
					this.plcIpAddressPort.value
				].join(':');
			}else{
				this.plcIpAddress.value = '';
			}
		}
	}
};
// 電力値書込レジスタアドレス
function ComponentPlcRegisterAddress(){
	this.name = 'plcRegisterAddress';
	this.tr = document.querySelector('#tr-' + this.name);
	this.error = document.querySelector('#error-' + this.name);
	this.plcRegisterAddress = document.querySelector('#' + this.name);
	// attach events
	this.plcRegisterAddress.onkeyup = zeus.onNumberInput;
}
ComponentPlcRegisterAddress.prototype = {
	// methods
	setError: function(msg){
		this.error.innerText = msg == null? '': msg;
	}
};

function ComponentEnergySensor(){
	this.form = document.forms.formInput;
	this.sensorType = new ComponentSensorType(this);
	this.comselect = new ComponentComselect(this);
	this.protocol = new ComponentProtocol(this);
	this.btnFormSubmit = document.querySelector('#btn-form-submit');
	// attach events
	this.btnFormSubmit.onclick = this.onBtnSubmitClick.bind(this);
	// initialization
	this.sensorType.select.select.onchange();
	this.comselect.select.select.onchange();
	this.protocol.select.select.onchange();
}
ComponentEnergySensor.prototype = {
	// events
	onBtnSubmitClick: function(){
		// disable submit button
		this.btnFormSubmit.disabled = true;
		let isvalid = this.validate();
		this.btnFormSubmit.disabled = false;
		
		if(isvalid){
			// set plcIpAddress
			this.protocol.plcIpAddress.setIpAddress();
			//
			let physicalIds = '';
			let checkedPlusItems = checkPhysicalSensor.filter(':checked').not(':disabled');
			if(checkedPlusItems.length > 0 && this.comselect.select.select.value == 3) {
				for(var i = 0; i < checkedPlusItems.length; i++){
					if(physicalIds != '') physicalIds += ',';
					physicalIds += checkedPlusItems[i].value;
				}
			}
			hiddenPhysicalElectricId.val(physicalIds);
			
			var sensorIds = '';
			var checkedMinusItems = checkPhysicalSensorSubtraction.filter(':checked').not(':disabled');
			if(checkedMinusItems.length > 0 && this.comselect.select.select.value == 3) {
				for(var i = 0; i < checkedMinusItems.length; i++) {
					if(sensorIds != '') sensorIds += ',';
					sensorIds += checkedMinusItems[i].value;
				}
			}
			hiddenPhysicalElectricIdSubtraction.val(sensorIds);
		
			if(controlMethodDiv.prop('contenteditable')){
				controlMethodHidden.val(controlMethodDiv.html());
			}
			// set group name
			groupSelectObj.setHddName();
			connectionMode.setCheckedName();
			this.form.submit();
		}
	},
	// methods
	validate: function(){
		let isvalid = true;
		// clear error
		this.protocol.plcIpAddress.setError();
		this.protocol.plcRegisterAddress.setError();
		// construct request parameter
		let protocol = this.protocol.select.select.value;
		let param = {};
		if(protocol == 18){
			if(this.protocol.plcIpAddress.plcIpAddress1.value != ''){
				param.plcIpAddress1 = this.protocol.plcIpAddress.plcIpAddress1.value;
			}
			if(this.protocol.plcIpAddress.plcIpAddress2.value != ''){
				param.plcIpAddress2 = this.protocol.plcIpAddress.plcIpAddress2.value;
			}
			if(this.protocol.plcIpAddress.plcIpAddress3.value != ''){
				param.plcIpAddress3 = this.protocol.plcIpAddress.plcIpAddress3.value;
			}
			if(this.protocol.plcIpAddress.plcIpAddress4.value != ''){
				param.plcIpAddress4 = this.protocol.plcIpAddress.plcIpAddress4.value;
			}
			if(this.protocol.plcIpAddress.plcIpAddressPort.value != ''){
				param.plcIpAddressPort = this.protocol.plcIpAddress.plcIpAddressPort.value;
			}
			if(this.protocol.plcRegisterAddress.value != ''){
				param.plcRegisterAddress = this.protocol.plcRegisterAddress.plcRegisterAddress.value;
			}
		}
		// ajax request
		$.ajax({
			url: contextPath + 'Rest/EnergySensor/Validate.action',
			method: 'POST',
			async: false,
			cache: false,
			energySensor: this,
			data: param
		})
		.done(function(resp, status, jqxhr){
			let objResp = JSON.parse(resp);
			
			if(objResp.result === 'ng'){
				isvalid = false;
			
				if(objResp.error.plcIpAddress != null){
					this.energySensor.protocol.plcIpAddress.setError(objResp.error.plcIpAddress);
				}
				if(objResp.error.plcRegisterAddress != null){
					this.energySensor.protocol.plcRegisterAddress.setError(objResp.error.plcRegisterAddress);
				}
			}
		})
		.fail(function(jqxhr, status, error){
			isvalid = false;
			console.log(error);
			popupError.setMessage('エラーが発生しました。');
		});
		return isvalid;
	}
};

var checkPhysicalSensor = $('[name="physicalSensor"]');
var checkPhysicalSensorSubtraction = $('[name="physicalSensorSubtraction"]');
var hiddenPhysicalElectricId = $('[name="physicalElectricId"]');
var hiddenPhysicalElectricIdSubtraction = $('[name="physicalElectricIdSubtraction"]');
// 備考（制御方法等）
var controlMethodDiv = $('#controlMethod');
var controlMethodHidden = $('[name="controlMethod"]');
var energyTypeNightDiv = $('#energyTypeNightDiv');
var deviceIdSelect = $('[name="deviceId"]');
var macAddressText = $('[name="macAddress"]');
// 1パルスあたりの量
var whperpulseText = $('[name="whperpulse"]');
var protocolItems = $('.protocol-item');
// 遮断制御
var cutstatusRadio = $('[name="cutstatus"]');
var facilitiesText = $('[name="facilities"]');
var sensorTypeSelect = $('[name="sensorType"]');
var measureTypeRadio = $('[name="measuretype"]');
var sensorTypeTrs = $('.sensortype');
var sensorTypeElectTrs = $('.sensortype-elect');
var sensorTypeGasTrs = $('.sensortype-gas');
var sensorTypeItems = $('.sensortype-item');
var sensorTypeElectItems = $('.sensortype-elect-item');
var sensorTypeGasItems = $('.sensortype-gas-item');
var measureTypeTr = $('.measuretype-tr');
var cutstatusTr = $('.cutstatus-tr');
var cutstatusItems = $('.cutstatus-item');
var coolingHeatingFlagCheck = $('[name="coolingHeatingFlag"]');
var ratedOutputHeatingText = $('[name="ratedOutputHeating"]');
var roCoolingLabelSpan = $('#roCoolingLabel');
var roHeatingLabelSpan = $('#roHeatingLabel');
var ratedPowerText = $('[name="ratedPower"]');
var ratedPowerTr = $('.ratedPower-tr');
var reductionThresholdEnergyText = $('[name="reductionThresholdEnergy"]');
var reductionThresholdEnergyTr = $('.reductionThresholdEnergy-tr');
var deviceTypeTrs = $('.devicetype-tr');
var deviceTypeItems = $('.devicetype-item');
var deviceTypePowerTrs = $('.devicetype-power');
var deviceTypePowerItems = $('.devicetype-power-item');
var deviceTypeLightTrs = $('.devicetype-light');
var deviceTypeLightItems = $('.devicetype-light-item');
var commTypeTrs = $('.commtype');
var commTypeIpTr = $('.commtype-ip');
var commTypeSerialTr = $('.commtype-serial');
var commTypeMacTr = $('.commtype-mac');
var commTypeItems = $('.commtype-item');
var commTypeIpTexts = $('.commtype-ip-text');
var energyTypeSelect = $('[name="energyType"]');
var maker = $('[name="maker"]');
var modelNo = $('[name="modelNo"]');
var ratedOutputCooling = $('[name="ratedOutputCooling"]');
var ratedOutputHeating = $('[name="ratedOutputHeating"]');
var dimmingGroupId = new ZeusSelect({id: 'dimmingGroupId', textId: 'dimmingGroupName'});
var deviceTypeSelect = $('[name="deviceTypeId"]');
var nodeSelect = $('[name="nodeId"]');
var colorPickers = $('.colorpicker-component');
// group select
var groupSelectObj = {
	select: $('[name="groupId"]'),
	hddName: $('[name="groupName"]'),
	setHddName: function(){
		let selected = this.select.find('option:selected');
		if(selected.val() == '')
			this.hddName.val(selected.val());
		else
			this.hddName.val(this.select.find('option:selected').text());
	}
};
let connectionMode = {
	_: document.querySelectorAll('[name="connectionMode"]'),
	name: document.querySelector('[name="connectionModeName"]'),
	setCheckedName: function(){
		this.name.value = this._[0].checked? this._[0].nextElementSibling.innerText.trim(): this._[1].nextElementSibling.innerText.trim();
	}
};

// 遮断制御の状態変更
function setInputCutStatus() {
	
	if(measureTypeRadio.prop('disabled')){
		
		measureTypeTr.hide();
		cutstatusRadio.prop('disabled', true);
		// = cutstatus.onchange
		setInputThresholdStatus();
	}else {
		
		// 1: デマンド　 0: 通常
		var measureType = measureTypeRadio.filter(':checked').val();
		// 通常
		if (measureType == 0) {
	
			measureTypeTr.hide();
			cutstatusRadio.prop('disabled', true);
			
			ratedPowerTr.show();
			reductionThresholdEnergyTr.show();
			if(!reqHasNode){
				
				ratedPowerText.prop('disabled', false);
				reductionThresholdEnergyText.prop('disabled', false);
			}
		}else { // デマンド
			
			measureTypeTr.show();
			cutstatusRadio.prop('disabled', false);
	
			ratedPowerTr.hide();
			ratedPowerText.prop('disabled', true);
			reductionThresholdEnergyTr.hide();
			reductionThresholdEnergyText.prop('disabled', true);
		}
		// = cutstatus.onchange
		setInputThresholdStatus();
	}
}

// 遮断制御の動作
function setInputThresholdStatus() {
	
	// 遮断制御がdiabled
	if(cutstatusRadio.prop('disabled')){
		
		cutstatusTr.hide();
		cutstatusItems.prop('disabled', true);
	}else{ // 遮断制御がnot disabled
		
		// 0: off 1: on
		var cutstatus = $('[name="cutstatus"]:checked').val();
		// off
		if(cutstatus == 0){
			
			cutstatusTr.hide();
			cutstatusItems.prop('disabled', true);
		}else{
			
			cutstatusTr.show();
			cutstatusItems.prop('disabled', false);
		}
	}
}

function sensorTypeChange() {
	sensorTypeTrs.hide();
	sensorTypeItems.prop('disabled', true);
	
	var sensorType = sensorTypeSelect.val();

	var elecDisplay = false;
	var gasDisplay = false;
	var oilDisplay = false;
	var waterDisplay = false;
	
	energyTypeNightDiv.hide();

	energyTypeSelect.empty();
	energyTypeSelect.append('<option value="">' + fmt.optionPleaseChoose + '</option>');

	// 電力
	if(sensorType == 1){

		// 電力量センサー関連項目を表示する
		sensorTypeElectTrs.show();
		sensorTypeElectItems.prop('disabled', false);
		elecDisplay = true;
		energyTypeSelect.append('<option value="27">昼間買電</option>');
		energyTypeNightDiv.show();
		
		onDeviceTypeSelectChange();
	}else if(sensorType == 2) {// ガス

		sensorTypeGasTrs.show();
		sensorTypeGasItems.prop('disabled', false);

		gasDisplay = true;

		energyTypeSelect.append('<option value="11">液化石油ガス（LPG）</option>');
		energyTypeSelect.append('<option value="30">都市ガス（13A）</option>');
	}else if(sensorType == 3){//重油センサー

		sensorTypeGasTrs.show();
		sensorTypeGasItems.prop('disabled', false);

		gasDisplay = true;

		energyTypeSelect.append('<option value="7">Ａ重油</option>');
		energyTypeSelect.append('<option value="8">Ｂ・Ｃ重油</option>');
	}else if(sensorType == 4) {
		
		waterDisplay = true;
		
		energyTypeSelect.append('<option value="25">温水</option>');
		energyTypeSelect.append('<option value="26">冷水</option>');
	} else if(sensorType == 6) {// エネルギー削減量
		
		energyTypeSelect.append('<option value="27">昼間買電</option>');
		energyTypeSelect.append('<option value="7">Ａ重油</option>');
		energyTypeSelect.append('<option value="8">Ｂ・Ｃ重油</option>');
		energyTypeSelect.append('<option value="11">液化石油ガス（LPG）</option>');
		energyTypeSelect.append('<option value="30">都市ガス（13A）</option>');
		energyTypeSelect.append('<option value="25">温水</option>');
		energyTypeSelect.append('<option value="26">冷水</option>');
	}
	
	pulseUnit.hide();
	if(elecDisplay)
		unitWh.show();
	
	if(gasDisplay || oilDisplay || waterDisplay)
		unitL.show();
}

// エネルギー種別
energyTypeSelect.change(function(){
	
	if(this.value == 27){
		energyTypeNightDiv.show();
	}else{
		energyTypeNightDiv.hide();
	}
});

//----------------------------冷暖別チェック時の処理 start
function coolingHeatingFlagChange(){

	if(coolingHeatingFlagCheck.prop('checked')){

		roCoolingLabelSpan.show();
		roHeatingLabelSpan.show();
		ratedOutputHeatingText.prop("disabled", false);
	}else{

		roCoolingLabelSpan.hide();
		roHeatingLabelSpan.hide();
		ratedOutputHeatingText.prop("disabled", true);
	}
}
//----------------------------冷暖別チェック時の処理 end

//----------------------------デバイスタイプ変更時の処理：照明->メーカー等を入力不可にする　動力：調光グループを入力不可にする start
deviceTypeSelect.change(onDeviceTypeSelectChange);
function onDeviceTypeSelectChange(){
	
	deviceTypeTrs.hide();
	deviceTypeItems.prop('disabled', true);

	// 照明
	if(deviceTypeSelect.val() == 1){
		
		deviceTypeLightTrs.show();
		deviceTypeLightItems.prop('disabled', false);
	// 動力
	}else if(deviceTypeSelect.val() == 2){
		
		deviceTypePowerTrs.show();
		deviceTypePowerItems.prop('disabled', false);
	}
}
//----------------------------デバイスタイプ変更時の処理：照明->メーカー等を入力不可にする　動力：調光グループを入力不可にする end

//***** 構成センサ加算チェック動作
checkPhysicalSensor.change(function(){
	
	if(this.value == 'D0001') {
		
		if(this.checked) {
			
			checkPhysicalSensor.not('[value="D0001"]').prop('disabled', true);
			checkPhysicalSensorSubtraction.filter(':disabled').prop('disabled', false);
		}else {
			
			checkPhysicalSensor.not('[value="D0001"]').prop('disabled', false);
			// チェックされた加算センサー
			var checkedPhysiclePlus = checkPhysicalSensor.filter(':checked');
			for(var i = 0; i < checkedPhysiclePlus.length; i++)
				$(checkedPhysiclePlus[i]).change();
			// チェックされた減算センサー
			var checkedPhysicalMinus = checkPhysicalSensorSubtraction.filter(':checked').not(':disabled');
			for(var i = 0; i < checkedPhysicalMinus.length; i++)
				$(checkedPhysicalMinus[i]).change();
		}
	}else {
		
		if(this.checked){
			
			checkPhysicalSensor.filter('[value="D0001"]').prop('disabled', true);
			checkPhysicalSensorSubtraction.filter('[value="' + this.value + '"]').prop('disabled', true);
		}else {

			if(checkPhysicalSensor.filter(':checked').not(':disabled').not('[value="D0001"]').length == 0)
				checkPhysicalSensor.filter('[value="D0001"]').prop('disabled', false);
			checkPhysicalSensorSubtraction.filter('[value="' + this.value + '"]').prop('disabled', false);
		}
	}
});
//_____ 構成センサ加算チェック動作
//***** 構成センサ減算チェック動作
checkPhysicalSensorSubtraction.change(function(){
	
	var checkPhysicalDemand = checkPhysicalSensor.filter('[value="D0001"]');
	// 加算にデマンドがありデマンドがチェックされた場合
	if(!(checkPhysicalDemand.length > 0 && checkPhysicalDemand.prop('checked'))) {
		
		if(this.checked)
			checkPhysicalSensor.filter('[value="' + this.value + '"]').prop('disabled', true);
		else
			checkPhysicalSensor.filter('[value="' + this.value + '"]').prop('disabled', false);
	}
});
//_____ 構成センサ減算チェック動作

//構成センサ加減初期化
function setPhysicalSensorCheck(){

	var checkedPhysicals = checkedPhysicalStr.split(',');
	if(checkedPhysicals.length > 0) {
		
		if(checkedPhysicals.length == 1) {
			
			if(checkedPhysicals[0] == 'D0001'){
				
				checkPhysicalSensor.filter('[value="D0001"]').prop('checked', true);
				checkPhysicalSensor.not('[value="D0001"]').prop('disabled', true);
			}else {
				var item = checkPhysicalSensor.filter('[value="' + checkedPhysicals[0] + '"]');
				item.prop('checked', true);
				item.change();
				checkPhysicalSensor.filter('[value="D0001"]').prop('disabled', true);
			}
		}else {
			
			for(var i = 0; i < checkedPhysicals.length; i++) {
				
				var item = checkPhysicalSensor.filter('[value="' + checkedPhysicals[i] + '"]');
				item.prop('checked', true);
				item.change();
			}
		}
	}
	
	var checkedPhysicalSubtraction = checkedPhysicalSubtractionStr.split(',');
	for(var i = 0; i < checkedPhysicalSubtraction.length; i++) {
		
		var item = checkPhysicalSensorSubtraction.filter('[value="' + checkedPhysicalSubtraction[i] + '"]');
		item.prop('checked', true);
		var demandItem = checkPhysicalSensor.filter('[value="D0001"]');
		if(!(demandItem.length > 0 && demandItem.prop('checked')))
			item.change();
	}
}

//*****************************init
new ComponentEnergySensor();
$('#controlMethod').html(controlMethodHidden.val());

//***** エネルギー種別初期化
if(fbEnergyType != null){
	energyTypeSelect.val(fbEnergyType);
}
//_____ エネルギー種別初期化
setPhysicalSensorCheck();
setInputCutStatus();
setInputThresholdStatus();

coolingHeatingFlagChange(document.getElementsByName("coolingHeatingFlag")[0]);

onDeviceTypeSelectChange();

colorPickers.colorpicker(btpColorPickerOption);

if(reqHasNode){
	ratedPowerText.prop('disabled', true);
	reductionThresholdEnergyText.prop('disabled', true);
}
//_____________________________init