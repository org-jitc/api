function ComponentProtocol(){
	this.controls = document.querySelectorAll('.protocol-control');
	this.select = document.querySelector('#protocol');
	// bind events
	this.select.onchange = this.onchange.bind(this);
}
ComponentProtocol.prototype = {
	// events
	onchange: function(){
		zeus.hideElement(this.controls);
		
		if(this.select.value !== ''){
			zeus.showElement(document.querySelectorAll('.protocol' + this.select.value));		
		}
	}
}

var sensorTypeSelect = $('[name="sensorType"]');
var protocolSelect = new ComponentProtocol();
let registerAddress = document.querySelector('#registerAddress');
registerAddress.onkeyup = zeus.onNumberInput;
var selectUnitAny = $('[name="unitAny"]');
var selectCommType = $('[name="comselect"]');
var spanAnyUnit = $('.any-unit');
var textIpaddr01 = $('[name="ipaddr01"]');
var textIpaddr02 = $('[name="ipaddr02"]');
var textIpaddr03 = $('[name="ipaddr03"]');
var textIpaddr04 = $('[name="ipaddr04"]');
var textPort = $('[name="port"]');
var elType = document.querySelectorAll('.type');
var elCommType = $('.commType');
var elCommTypeItem = $('.commType-item');
var hddUnitAnyName = $('[name="unitAnyName"]');
var hddUnitAnyUnit = $('[name="unitAnyUnit"]');
var hddIpAddress = $('[name="ipAddress"]');
// group
var groupObj = {
	select: $('[name="groupId"]'),
	hddName: $('[name="sensorGroupName"]'),
	setSelectedText: function(){
		let selected = this.select.find('option:selected');
		if(selected.val() == '') this.hddName.val(selected.val());
		else this.hddName.val(this.select.find('option:selected').text());
	}
}
let connectionMode = {
	_: document.querySelectorAll('[name="connectionMode"]'),
	name: document.querySelector('[name="connectionModeName"]'),
	setCheckedName: function(){
		this.name.value = this._[0].checked? this._[0].nextElementSibling.innerText.trim(): this._[1].nextElementSibling.innerText.trim();
	}
};

sensorTypeSelect.change(function(){
	zeus.hideElement(elType);
	let trEnvSensorType = document.querySelectorAll('.type-' + this.value);
	zeus.showElement(trEnvSensorType);
	// 任意の場合はプロトコルを汎用にして
	if(this.value == 7){
		protocolSelect.select.value = 16;
		protocolSelect.select.onchange();
		selectUnitAny.show();
	}else{
		// 任意の単位を未選択にする
		selectUnitAny.get(0).selectedIndex = 0;
		selectUnitAny.hide();
	}
	selectUnitAny.change();
	protocolSelect.select.disabled = this.value == 7;
});

selectUnitAny.change(function(){
	var option = selectUnitAny.find(':selected');
	hddUnitAnyName.val(option.text());
	var unit = option.attr('class');
	if(unit == null) unit ='';
	spanAnyUnit.text(unit);
	hddUnitAnyUnit.val(unit);
	spanAnyUnit.show();
});

function releaseDisable(){
	var form=document.forms["temperatureSensorFormBean"];
	var lastRepeat=form.elements["lastRepeaterNo"];
	var repeaterRoute = form.elements["repeaterRoute"];
	var repeaterFrequency = form.elements["repeaterFrequency"];
	lastRepeat.disabled=false;
	repeaterRoute.disabled=false;
	repeaterFrequency.disabled=false;
	$(repeaterFrequency).removeClass('disabled-background-color');
}

function setDisable(){
	var form=document.forms["temperatureSensorFormBean"];
	var lastRepeat=form.elements["lastRepeaterNo"];
	var repeaterRoute = form.elements["repeaterRoute"];
	var repeaterFrequency = form.elements["repeaterFrequency"];
	lastRepeat.disabled="disabled";
	repeaterRoute.disabled="disabled";
	repeaterFrequency.disabled="disabled";
	$(repeaterFrequency).addClass('disabled-background-color');
}

selectCommType.change(function(){
	elCommType.hide();
	elCommTypeItem.prop('disabled', true);
	var itemClass = '.commType-' + this.value;
	elCommType.filter(itemClass).show();
	elCommTypeItem.filter(itemClass).prop('disabled', false);
});

function setInputIpStatus(flag) {
	document.temperatureSensorFormBean.ipaddr01.disabled = flag;
	document.temperatureSensorFormBean.ipaddr02.disabled = flag;
	document.temperatureSensorFormBean.ipaddr03.disabled = flag;
	document.temperatureSensorFormBean.ipaddr04.disabled = flag;
	document.temperatureSensorFormBean.port.disabled = flag;
}

function setSelectDeviceStatus(flag) {
	document.temperatureSensorFormBean.deviceId.disabled = flag;
}

function setInputMacStatus(flag) {
    document.temperatureSensorFormBean.macAddress.disabled = flag;
}

function onEnvFormSubmit(){
	// tcp/ip
	if(selectCommType.val() == 0){
		hddIpAddress.val(textIpaddr01.val() + '.' + textIpaddr02.val() + '.' + textIpaddr03.val() + '.' + textIpaddr04.val() + ':' + textPort.val());
	}else {
		hddIpAddress.empty();
	}
	// set group name
	groupObj.setSelectedText();
	connectionMode.setCheckedName();
}

//**************** init
selectCommType.change();
sensorTypeSelect.change();
protocolSelect.select.onchange();

var userRepeater = reqUseRepeater;
if(userRepeater == "nouse"){
	document.all("useRepeater")[0].checked=true;
	setDisable();
} else if(userRepeater=="use"){
	if(reqGroupName != ''){
		document.all("useRepeater")[1].checked=true;
		releaseDisable();
	}
}
//________________ init