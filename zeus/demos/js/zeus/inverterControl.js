function InverterControl(){
	this.inverterId = document.querySelector('#inverterId');
	this.inverterName = document.querySelector('#inverterName');
	this.envSensorIds = new ZeusCheckbox({name: 'envSensorIds', checkedTextId: 'envSensorNames'});
	
	// events
	inverterId.onchange = function(){
		let inverterId = this.value;
		inverterName.value = inverterId === ''? '': this.options[this.selectedIndex].innerText;
		clearControlSettings();
		// インバーターが選択された場合
		if(inverterId != ''){
			updateControlSettings(inverterId);
		}
	};
}
InverterControl.prototype = {
	// methods
	setInverterName: function(){
		let selectedIndex = this.inverterId.selectedIndex;
		this.inverterName.value = selectedIndex == 0? '': this.inverterId.options[selectedIndex].innerText;
	}
};

let inverterControl = new InverterControl();
let nodeDispSensorTr = document.querySelector('#dispSensorTr');
let nodeControlSettingTr = document.querySelector('#controlSettingTr');
let nodeOperationModeTr = document.querySelector('#operationModeTr');
let hiddenControlSettings = document.querySelector('[name="controlSettings"]');

// すべての制御設定を削除
function clearControlSettings(){
	// 制御設定を削除
	let csTr = null;
	
	for(var i = 1; i <= controlSettingIndex; i++){
		csTr = $('#controlSettingTr' + i);
		
		if(csTr.length > 0){
			csTr.remove();
		}
	}
	controlSettingIndex = null;
}
// 制御設定の更新
function updateControlSettings(inverterId){
	$.ajax({
		url: contextPath + 'Ajax/InverterControl/GetSettings.action',
		async: true,
		cache: false,
		data: 'inverterId=' + inverterId,
		success: function(resp){
			getControlSettingsSuccess(resp);
		},
		error: function(req, error, errorObj){
			console.log(error);
			console.log(errorObj);
		}
	});
}

function getControlSettingsSuccess(resp){
	let cs = null;
	let csTr = null;
	let nodeName = null;
	let nodeRegisterAddress = null;
	let nodeSettingValue = null;
	let nodeUnitDisp = null;
	let nodeErr = null;
	let cssClass = null;
	
	let controlSettingArr = JSON.parse(resp);
	for(var i = 0; i < controlSettingArr.length; i++){
		cs = controlSettingArr[i];
		// 制御モードの場合
		if(cs.index == 1){
			csTr = nodeOperationModeTr.cloneNode(true);
		}else{
			csTr = nodeControlSettingTr.cloneNode(true);
		}
		csTr.setAttribute('id', 'controlSettingTr' + cs.index);
		
		nodeName = csTr.querySelector('#name');
		nodeName.setAttribute('id', 'name' + cs.index);
		nodeName.innerText = cs.name;
		
		nodeRegisterAddress = csTr.querySelector('#ra');
		nodeRegisterAddress.setAttribute('id', 'ra' + cs.index);
		nodeRegisterAddress.value = cs.registerAddress;
		// 制御モードの場合
		if(cs.index == 1){
			
			if(cs.settingValue != null && cs.settingValue != ''){
				csTr.querySelector('[name="omRadio"][value="' + cs.settingValue + '"]').checked = true;
			}
			
			// error div
			if(cs.error != null){
				nodeErr = csTr.querySelector('#omRadioError');
				nodeErr.innerText = cs.error;
				
				cssClass = nodeErr.getAttribute('class');
				if(cssClass.indexOf(' hide') < 0){
					cssClass.replace('hide', '');
				}else{
					cssClass.replace(' hide', '');
				}
				nodeErr.setAttribute('class', cssClass);
			}
		}else{
			nodeSettingValue = csTr.querySelector('#settingValue');
			
			if(cs.settingValue != null){
				nodeSettingValue.value = cs.settingValue;
			}
			nodeSettingValue.setAttribute('id', 'settingValue' + cs.index);
			
			nodeUnitDisp = csTr.querySelector('#unitDisp');
			
			if(cs.unitDisp != null){
				nodeUnitDisp.innerText = cs.unitDisp;
			}
			nodeUnitDisp.setAttribute('id', 'unitDisp' + cs.index);
			// error div
			if(cs.error != null){
				nodeErr = csTr.querySelector('#settingValueError');
				nodeErr.innerText = cs.error;
				
				cssClass = nodeErr.getAttribute('class');
				
				if(cssClass.indexOf(' hide') < 0){
					cssClass.replace('hide', '');
				}else{
					cssClass.replace(' hide', '');
				}
				nodeErr.setAttribute('class', cssClass);
			}
			csTr.querySelector('#settingValueError').setAttribute('id', 'settingValueError' + cs.index);
		}
		nodeDispSensorTr.parentNode.insertBefore(csTr, nodeDispSensorTr);
		controlSettingIndex = cs.index;
	}
}
//制御設定をJSONデータにする
function setControlSettingDataSet(){
	let nodeControlSetting = null;
	let nodeOmRadio = null;
	
	let controlSettingArr = [];
	let controlSettingObj = null;
	
	for(var i = 1; i <= controlSettingIndex; i++){
		nodeControlSetting = document.querySelector('#controlSettingTr' + i);
		// 存在する場合
		if(nodeControlSetting != null){
			controlSettingObj = {};
			controlSettingObj.index = i;
			controlSettingObj.name = document.querySelector('#name' + i).innerText;
			controlSettingObj.registerAddress = document.querySelector('#ra' + i).value;
			
			if(i == 1){
				nodeOmRadio = document.querySelector('[name="omRadio"]:checked');
				
				if(nodeOmRadio != null){
					controlSettingObj.settingValue = nodeOmRadio.value;
				}else{
					controlSettingObj.settingValue = '';
				}
			}else{
				controlSettingObj.settingValue = document.querySelector('#settingValue' + i).value;
				controlSettingObj.unitDisp = document.querySelector('#unitDisp' + i).innerText;
			}
			controlSettingArr.push(controlSettingObj);
		}
	}
	
	if(controlSettingArr.length > 0){
		hiddenControlSettings.value = JSON.stringify(controlSettingArr);
	}else{
		hiddenControlSettings.value = '';
	}
}

//----------------- init start
let controlSettingIndex = null;
// 確認画面から来た時
if(document.inverterControlForm.controlSettings.value != ''){
	getControlSettingsSuccess(document.inverterControlForm.controlSettings.value);
	// set inverter name
	inverterControl.setInverterName();
}
//----------------- init end