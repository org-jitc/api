function AlertNotification(config){
	this.error = document.querySelector('#error-' + config.name);
	this.radios = new ZeusRadio({
		name: config.name,
		textId: config.textId
	});
	this.divMinute = document.querySelector('#div-' + config.minuteId);
	this.minute = document.querySelector('#' + config.minuteId);
	// bind events
	this.radios.setOnchange(this.onRadioChange.bind(this));
	// initialization
	this.radios.checkedElement().onchange();
}
AlertNotification.prototype = {
	// attributes
	regExpInteger: REGULAR_EXPRESSIONS.integer(false, 5),
	// events
	onRadioChange: function(){
		let val = this.radios.getCheckedValue();
		
		if(val === 'onetime'){
			zeus.hideElement(this.divMinute);
		}else{
			zeus.showElement(this.divMinute);
		}
	},
	// methods
	validate: function(){
		let val = this.radios.getCheckedValue();
		let isvalid = true;
		
		if(val === 'repeat'){
			let minute = this.minute.value.trim();
			if(minute !== ''){
				let matched = minute.match(this.regExpInteger);
				isvalid = isvalid && matched != null;
				if(isvalid){
					isvalid = isvalid && minute >= 1 && minute <= 32767;
				}
				this.error.innerText = isvalid? '': ERROR_MESSAGES.invalid;
			}
		}
		return isvalid;
	}
};

function SensorDataWatching(){
	this.regExpDouble = REGULAR_EXPRESSIONS.double(true, 9, 2);
	this.regExpInteger = REGULAR_EXPRESSIONS.integer(false, 0);
	// form attribute
	this.form = document.querySelector('#formSensorDataWatching');
	this.dataWatchingId = document.querySelector('#dataWatchingId');
	this.sensorId = new ZeusSelect({
		id: 'sensorId',
		textId: 'sensorName'
	});
	this.sensorType = new ZeusSelect({
		id: 'sensorType',
		textId: 'sensorTypeName'
	});
	this.watchingType = new ZeusRadio({
		name: 'watchingType',
		textId: 'watchingTypeName'
	});
	this.threshold = document.querySelector('#threshold');
	this.thresholdUnit = document.querySelector('#threshold_unit');
	this.lesscheck = new ZeusRadio({
		name: 'lesscheck'
	});
	this.samecheck = new ZeusRadio({
		name: 'samecheck'
	});
	this.lessDurationSec = document.querySelector('#lessDurationSec');
	this.sameDurationSec = document.querySelector('#sameDurationSec');
	this.lessword = document.querySelector('#lessword');
	this.alertNotificationLess = new AlertNotification({
		name: 'alertNotificationLess',
		textId: 'alertNotificationLessName',
		minuteId: 'lessMailIntervalMin'
	});
	this.sameword = document.querySelector('#sameword');
	this.alertNotificationSame = new AlertNotification({
		name: 'alertNotificationSame',
		textId: 'alertNotificationSameName',
		minuteId: 'sameMailIntervalMin'
	});
	this.morecheck = new ZeusRadio({
		name: 'morecheck'
	});
	this.moreDurationSec = document.querySelector('#moreDurationSec');
	this.moreword = document.querySelector('#moreword');
	this.alertNotificationMore = new AlertNotification({
		name: 'alertNotificationMore',
		textId: 'alertNotificationMoreName',
		minuteId: 'moreMailIntervalMin'
	});
	this.abnormalStateJudgment = new ZeusSelect({
		id: 'abnormalStateJudgment',
		textId: 'abnormalStateJudgmentName'
	});
	this.unit = document.querySelector('#unit');
	this.errors = {
		errorAll: document.querySelector('#error-all'),
		sensorId: document.querySelector('#error-sensorId'),
		sensorType: document.querySelector('#error-sensorType'),
		threshold: document.querySelector('#error-threshold'),
		lessDurationSec: document.querySelector('#error-lessDurationSec'),
		alertNotificationLess: this.alertNotificationLess.error,
		sameDurationSec: document.querySelector('#error-sameDurationSec'),
		moreDurationSec: document.querySelector('#error-moreDurationSec'),
		alertNotificationSame: this.alertNotificationSame.error,
		alertNotificationMore: this.alertNotificationMore.error
	};
	this.btnSubmit = document.querySelector('#btn-submit');
	this.classThreshold = document.querySelectorAll('.threshold');
	this.classSame = document.querySelectorAll('.same');
	// add events
	this.sensorType.select.onchange = this.onSensorTypeChange.bind(this);
	this.watchingType.setOnchange(this.onWatchingTypeChange.bind(this));
	this.btnSubmit.onclick = this.onBtnSubmitClick.bind(this);
	// initialization
	this.sensorType.select.onchange();
	this.watchingType.checkedElement().onchange();
}
SensorDataWatching.prototype= {
	// events
	onSensorTypeChange: function(){
		let option = this.sensorType.select.options[this.sensorType.select.selectedIndex];
		let unit = option.getAttribute('class');
		
		if(!unit){
			let val = this.sensorType.select.value;
			
			if(val != ''){
				unit = TYPE_UNIT[val];
			}
		}
		this.sensorType.setText();
		
		if(unit == null){
			unit = '';
		}
		this.thresholdUnit.innerText = unit;
		this.unit.value = unit;
	},
	onWatchingTypeChange: function(){
		let val = this.watchingType.getCheckedValue();
		
		if(val === 'threshold'){
			zeus.showElement(this.classThreshold);
			zeus.hideElement(this.classSame);
		}else{
			zeus.showElement(this.classSame);
			zeus.hideElement(this.classThreshold);
		}
		this.watchingType.setText();
	},
	onBtnSubmitClick: function(){
		this.clearErrors();
		this.btnSubmit.disabled = true;
		
		if(this.validate()){
			$.ajax({
				url: contextPath + 'Rest/SensorDataWatching/Validate.action',
				async: false,
				cache: false,
				method: 'POST',
				sdw: this,
				data: this.validateData()
			})
			.done(function(resp, status, jqxhr){
				let objResp = JSON.parse(resp);
				
				if(objResp.result === 'ok'){
					this.sdw.form.submit();
				}else{
					this.sdw.btnSubmit.disabled = false;
					this.sdw.setValidationErrors(objResp.error);
				}
			})
			.fail(function(jqxhr, status, error){
				popupError.setMessage('エラーが発生しました。');
				this.sdw.btnSubmit.disabled = false;
			});
		}else{
			this.btnSubmit.disabled = false;
		}
	},
	// methods
	validateData: function(){
		let data = {};
		if(this.dataWatchingId){
			data.dataWatchingId = this.dataWatchingId.value;
		}
		data.sensorId = this.sensorId.select.value;
		data.sensorType = this.sensorType.select.value;
		data.watchingType = this.watchingType.getCheckedValue();
		if(data.watchingType === 'threshold'){
			data.threshold = this.threshold.value.trim();
			data.lesscheck = this.lesscheck.getCheckedValue();
			data.lessDurationSec = this.lessDurationSec.value.trim();
			data.lessword = this.lessword.value.trim();
			data.alertNotificationLess = this.alertNotificationLess.radios.getCheckedValue();
			if(data.alertNotificationLess === 'repeat'){
				data.lessMailIntervalMin = this.alertNotificationLess.minute.value.trim();
			}else{
				this.alertNotificationLess.minute.value = this.alertNotificationLess.minute.value.trim().replace(/\D/g, '');
			}
			data.morecheck = this.morecheck.getCheckedValue();
			data.moreDurationSec = this.moreDurationSec.value.trim();
			data.moreword = this.moreword.value.trim();
			data.alertNotificationMore = this.alertNotificationMore.radios.getCheckedValue();
			if(data.alertNotificationMore === 'repeat'){
				data.moreMailIntervalMin = this.alertNotificationMore.minute.value.trim();
			}else{
				this.alertNotificationMore.minute.value = this.alertNotificationMore.minute.value.trim().replace(/\D/g, '');
			}
			data.abnormalStateJudgment = this.abnormalStateJudgment.select.value;
		}else{
			data.samecheck = this.samecheck.getCheckedValue();
			data.sameDurationSec = this.sameDurationSec.value.trim();
			data.sameword = this.sameword.value.trim();
			data.alertNotificationSame = this.alertNotificationSame.radios.getCheckedValue();
			if(data.alertNotificationSame === 'repeat'){
				data.sameMailIntervalMin = this.alertNotificationSame.minute.value.trim();
			}else{
				this.alertNotificationSame.minute.value = this.alertNotificationSame.minute.value.trim().replace(/\D/g, '');
			}
		}
		return data;
	},
	validate: function(){
		let isvalid = true;
		let val, matched, isvalidOne;
		let watchingType = this.watchingType.getCheckedValue();
		// threshold
		val = this.threshold.value.trim();
		if(val !== ''){
			matched = val.match(this.regExpDouble);
			isvalidOne = matched != null;
			if(isvalidOne){
				isvalidOne = val > -10000000000 && val < 10000000000;
			}
			if(!isvalidOne){
				this.errors.threshold.innerText = ERROR_MESSAGES.invalid;
			}
			isvalid = isvalid && isvalidOne;
		}
		// lessDurationSec
		val = this.lessDurationSec.value.trim();
		if(val !== ''){
			matched = val.match(this.regExpInteger);
			isvalidOne = matched != null;
			if(!isvalidOne && watchingType === 'threshold'){
				this.errors.lessDurationSec.innerText = ERROR_MESSAGES.invalid;
			}
			isvalid = isvalid && isvalidOne;
		}
		// alertNotificationLess
		isvalid = isvalid && this.alertNotificationLess.validate();
		// sameDurationSec
		val = this.sameDurationSec.value.trim();
		if(val !== ''){
			matched = val.match(this.regExpInteger);
			isvalidOne = matched != null;
			if(!isvalidOne && watchingType === 'same'){
				this.errors.sameDurationSec.innerText = ERROR_MESSAGES.invalid;
			}
			isvalid = isvalid && isvalidOne;
		}
		// alertNotificationSame
		isvalid = isvalid && this.alertNotificationSame.validate();
		// moreDurationSec
		val = this.moreDurationSec.value.trim();
		if(val !== ''){
			matched = val.match(this.regExpInteger);
			isvalidOne = matched != null;
			if(!isvalidOne && watchingType === 'threshold'){
				this.errors.moreDurationSec.innerText = ERROR_MESSAGES.invalid;
			}
			isvalid = isvalid && isvalidOne;
		}
		// alertNotificationMore
		isvalid = isvalid && this.alertNotificationMore.validate();
		return isvalid;
	},
	clearErrors: function(){
		
		for(let key in this.errors){
			this.errors[key].innerText = '';
		}
	},
	setValidationErrors: function(objError){
		
		for(let key in objError){
			this.errors[key].innerText = objError[key];
		}
	}
};

let TYPE_UNIT = {
	ear: 'mA',
	eas: 'mA',
	eat: 'mA',
	evr: 'mV',
	evs: 'mV',
	evt: 'mV',
	ew: 'W',
	ehz: 'Hz',
	tfr: 'Hz',
	tt: '℃',
	th: '%',
	ti: 'lx',
	tco2: 'ppm',
	tpr: 'kPa'
};
let ERROR_MESSAGES = {
	invalid: '値が不正です。'
}

new SensorDataWatching();