function Alert(){
	this.validationItems = ['comMethod', 'ipAddress', 'deviceId', 'protocol', 'wirelessId', 'channel2', 'channel3', 'channel4'];
	this.origin = {};
	this.div = {errors: {}};
	this.buttons = {};
	
	this.div.errors.error = document.querySelector('#divError');
	for(let item of this.validationItems){
		this.div.errors[item] = document.querySelector('#div-error-' + item);
	}
	
	this.form = document.querySelector('#alert');
	this.alert2 = new ZeusRadio({name: 'alert2'});
	this.origin.alert2 = this.alert2.getCheckedValue();
	this.alert3 = new ZeusRadio({name: 'alert3'});
	this.origin.alert3 = this.alert3.getCheckedValue();
	this.alert4 = new ZeusRadio({name: 'alert4'});
	this.origin.alert4 = this.alert4.getCheckedValue();
	
	this.comMethod = document.querySelector('#comMethod');
	this.origin.comMethod = this.comMethod.value;
	
	this.ipaddr01 = document.querySelector('#ipaddr01');
	this.ipaddr01.onkeyup = zeus.onNumberInput;
	this.origin.ipaddr01 = this.ipaddr01.value;
	this.ipaddr02 = document.querySelector('#ipaddr02');
	this.ipaddr02.onkeyup = zeus.onNumberInput;
	this.origin.ipaddr02 = this.ipaddr02.value;
	this.ipaddr03 = document.querySelector('#ipaddr03');
	this.ipaddr03.onkeyup = zeus.onNumberInput;
	this.origin.ipaddr03 = this.ipaddr03.value;
	this.ipaddr04 = document.querySelector('#ipaddr04');
	this.ipaddr04.onkeyup = zeus.onNumberInput;
	this.origin.ipaddr04 = this.ipaddr04.value;
	this.portNumber = document.querySelector('#portNumber');
	this.portNumber.onkeyup = zeus.onNumberInput;
	this.origin.portNumber = this.portNumber.value;
	
	this.deviceId = document.querySelector('#deviceId');
	this.origin.deviceId = this.deviceId.value;
	
	this.protocol = document.querySelector('#protocol');
	this.origin.protocol = this.protocol.value;
	
	this.wirelessId = document.querySelector('#wirelessId');
	this.wirelessId.onkeyup = zeus.onNumberInput;
	this.origin.wirelessId = this.wirelessId.value;
	
	this.channel2 = document.querySelector('#channel2');
	this.channel2.onkeyup = zeus.onNumberInput;
	this.origin.channel2 = this.channel2.value;
	
	this.channel3 = document.querySelector('#channel3');
	this.channel3.onkeyup = zeus.onNumberInput;
	this.origin.channel3 = this.channel3.value;
	
	this.channel4 = document.querySelector('#channel4');
	this.channel4.onkeyup = zeus.onNumberInput;
	this.origin.channel4 = this.channel4.value;
	
	this.buttons.commit = document.querySelector('#btnCommit');
	
	this.form.onsubmit = this.onFormSubmit;
	this.alert2.radios[0].onchange = this.onAlertChange.bind(this);
	this.alert2.radios[1].onchange = this.onAlertChange.bind(this);
	this.alert3.radios[0].onchange = this.onAlertChange.bind(this);
	this.alert3.radios[1].onchange = this.onAlertChange.bind(this);
	this.alert4.radios[0].onchange = this.onAlertChange.bind(this);
	this.alert4.radios[1].onchange = this.onAlertChange.bind(this);
	this.comMethod.onchange = this.onComMethodChange.bind(this);
	
	this.onAlertChange.call(this);
};
Alert.prototype = {
	isAlertOff(){
		return this.alert2.getCheckedValue() === '0' && this.alert3.getCheckedValue() === '0' && this.alert4.getCheckedValue() === '0';
	},
	setInvalid(objResp){
		let objErr;
		for(let item of this.validationItems){
			objErr = objResp[item];
			if(objErr == null){
				zeus.hideElement(this.div.errors[item]);
			}else{
				this.div.errors[item].innerHTML = objErr.message;
				zeus.showElement(this.div.errors[item]);
			}
		}
	},
	setComDisabled(ipDisabled, deviceDisabled){
		this.ipaddr01.disabled = ipDisabled;
		this.ipaddr02.disabled = ipDisabled;
		this.ipaddr03.disabled = ipDisabled;
		this.ipaddr04.disabled = ipDisabled;
		this.portNumber.disabled = ipDisabled;
		this.deviceId.disabled = deviceDisabled;
	},
	onAlertChange(){
		let disabled = this.isAlertOff();
		let ipDisabled = disabled || this.comMethod.value !== 'http';
		let deviceDisabled = disabled || this.comMethod.value !== 'serial';
		this.comMethod.disabled = disabled;
		this.protocol.disabled = disabled;
		this.wirelessId.disabled = disabled;
		this.channel2.disabled = disabled;
		this.channel3.disabled = disabled;
		this.channel4.disabled = disabled;
		this.setComDisabled(ipDisabled, deviceDisabled);
	},
	onComMethodChange(){
		let value = this.comMethod.value;
		let ipDisabled = value !== 'http';
		let deviceDisabled = value !== 'serial';
		this.setComDisabled(ipDisabled, deviceDisabled);
	},
	toObject(){
		let obj = {};
		obj.alert2 = this.alert2.getCheckedValue();
		obj.alert3 = this.alert3.getCheckedValue();
		obj.alert4 = this.alert4.getCheckedValue();
		obj.comMethod = this.comMethod.value;
		obj.ipaddr01 = this.ipaddr01.disabled? '': this.ipaddr01.value;
		obj.ipaddr02 = this.ipaddr02.disabled? '': this.ipaddr02.value;
		obj.ipaddr03 = this.ipaddr03.disabled? '': this.ipaddr03.value;
		obj.ipaddr04 = this.ipaddr04.disabled? '': this.ipaddr04.value;
		obj.portNumber = this.portNumber.disabled? '': this.portNumber.value;
		obj.deviceId = this.deviceId.disabled? '': this.deviceId.value;
		obj.protocol = this.protocol.disabled? '0': this.protocol.value;
		obj.wirelessId = this.wirelessId.disabled? '0': this.wirelessId.value;
		obj.channel2 = this.channel2.disabled? '0': this.channel2.value;
		obj.channel3 = this.channel3.disabled? '0': this.channel3.value;
		obj.channel4 = this.channel4.disabled? '0': this.channel4.value;
		return obj;
	},
	toString(){
		return JSON.stringify(this.toObject());
	},
	isChanged(){
		zeus.hideElement(this.div.errors.error);
		let isChanged = JSON.stringify(this.origin) !== this.toString();
		if(!isChanged){
			zeus.showElement(this.div.errors.error);
		}
		return isChanged;
	},
	validation(){
		this.buttons.commit.disabled = true;
		$(this.buttons.commit).button('loading');
		let valid = true;
		zeus.ajax({
			url: contextPath + 'Rest/Alert/Validation.action',
			async: false,
			data: this.toObject(),
			alert: this,
			success: function(resp){
				let objResp = JSON.parse(resp);
				if(objResp.result === 'ng'){
					valid = false;
					this.alert.setInvalid(objResp);
				}			
			},
			error: function(){
				valid = false;
				popupError.setMessage('エラーが発生しました。');
			}
		});
		this.buttons.commit.disabled = false;
		$(this.buttons.commit).button('reset');
		return valid;
	},
	onFormSubmit(ev){
		let isValid = alert.isChanged() && alert.validation();
		if(!isValid){
			ev = ev || window.event;
		    if(ev.preventDefault) {
		    	ev.preventDefault();
		    }else {
		    	window.event.returnValue = false;
		    }
		}
	},
};

let alert = new Alert();