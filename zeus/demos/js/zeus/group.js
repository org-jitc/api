function Group(){
	let _this = this;
	this.div = {errors: {}};
	this.validateItems = [
		'groupName'
	];

	let itemName;
	for(let i = 0, l = this.validateItems.length; i < l; i++){
		itemName = this.validateItems[i];
		this.div.errors[itemName] = document.querySelector('#div-error-' + itemName);
	}
	this.form = document.querySelector('#form-confirm');
	this.groupId = document.querySelector('#groupId');
	this.groupName = document.querySelector('#groupName');
	this.node = new ZeusCheckbox({name: 'node', checkedTextId: 'nodeNames'});
	this.input = new ZeusCheckbox({name: 'input', checkedTextId: 'inputNames'});
	this.dimmingGroup = new ZeusCheckbox({name: 'dimmingGroup', checkedValuesId: 'dimmingGroupStr', checkedTextId: 'dimmingGroupNames'});
	this.tempSensor = new ZeusCheckbox({name: 'tempSensor', checkedTextId: 'tempSensorNames'});
	this.electricSensorIds = new ZeusCheckbox({name: 'electricSensorIds', checkedTextId: 'electricSensorNames'});
	this.heatRecoveryIds = new ZeusCheckbox({name: 'heatRecoveryIds', checkedTextId: 'heatRecoveryNames'});
	
	this.form.onsubmit = function(ev){
		let valid = _this.validateForm();
		if(!valid){
			ev = ev || window.event;
		    if(ev.preventDefault) {
		    	ev.preventDefault();
		    }else {
		    	window.event.returnValue = false;
		    }
		}
	}
}
Group.prototype = {
	// events
	// methods
	validateForm: function(){
		let valid = true;
		$.ajax({
			url: contextPath + 'Rest/Group/Validate.action',
			method: 'POST',
			async: false,
			cache: false,
			data: this.toObject(),
			group: this
		})
		.done(function(resp, status, jqxhr){
			let objResp = JSON.parse(resp);
			let objResult, item;
			
			for(let i = 0, l = this.group.validateItems.length; i < l; i++){
				item = this.group.validateItems[i];
				objResult = objResp[item];
				this.group.div.errors[item].innerHTML = objResult == null? '': objResult.message;
				valid = valid && (objResult == null);
			}
		})
		.fail(function(jqxhr, status, error){
			console.log(error);
			valid = false;
			popupError.setMessage('エラーが発生しました。');
		});
		return valid;
	},
	toObject: function(){
		let obj = {
			groupName: this.groupName.value.trim()
		};
		
		if(this.groupId != null){
			obj.groupId = this.groupId.value;
		}
		return obj;
	}
};

let group = new Group();
let modalImgUpload = new ModalImgUpload({
	action: 'Rest/TempImg/Save.action',
	menu: 'group'
});
let groupPlanViewSo = new GroupPlanView({
	suffix: 'so',
	modalImgUpload: modalImgUpload,
	modalImgShow: modalImgShow
});
let groupPlanViewDimming = new GroupPlanView({
	suffix: 'dimming',
	modalImgUpload: modalImgUpload,
	modalImgShow: modalImgShow
});
let groupPlanViewEnergy = new GroupPlanView({
	suffix: 'energy',
	modalImgUpload: modalImgUpload,
	modalImgShow: modalImgShow
});
let groupPlanViewEnv = new GroupPlanView({
	suffix: 'env',
	modalImgUpload: modalImgUpload,
	modalImgShow: modalImgShow
});
//電力量センサーチェックボックスを含まれているspan
var electricCheckSpans = $('.electric-check-span');

//******************** init
//***** チェックボックスをタイプにより分類
if(electricCheckSpans.length > 0){
	electricCheckSpans.each(function(){
		let sensorType = this.getAttribute('data-electric-type');
		if(sensorType != null){
			document.querySelector('#electric-list-' + sensorType).appendChild(this);
		}
	});
}
//===== チェックボックスをタイプにより分類