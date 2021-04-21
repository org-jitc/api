function ZeusDatePicker(config){
	this.picker = $('#' + config.picker);
	this.option = config.option;
	this.picker.datepicker(this.option);
	if(config.onChangeDate != null){
		if(config.period != null){
			this.picker.on('changeDate', config.onChangeDate.bind(config.period));
		}else{
			this.picker.on('changeDate', config.onChangeDate);
		}
	}
}
ZeusDatePicker.prototype = {
	setOption: function(option){
		let date = this.getDate();
		Object.assign(this.option, option);
		this.picker.datepicker('destroy');
		this.picker.datepicker(this.option);
		this.update(date);
	},
	update: function(date){
		this.picker.datepicker('update', date);
	},
	getDate: function(){
		return this.picker.datepicker('getDate');
	},
	getMoment: function(){
		return moment(this.getDate());
	}
};

function ZeusDateInput(config){
	this.config = config;
	this.div = {};
	if(config.y != null){
		this.div.y = document.querySelector('#div-' + config.y);
		this.y = document.querySelector('#' + config.y);
		this.y.oninput = zeus.onYearInput;
		if(config.onblur != null){
			if(config.period != null){
				this.y.onblur = config.onblur.bind(config.period);
			}else{
				this.y.onblur = config.onblur;
			}
		}
	}
	if(config.m != null){
		this.div.m = document.querySelector('#div-' + config.m);
		this.m = document.querySelector('#' + config.m);
		this.m.oninput = zeus.onMonthInput;
		if(config.onblur != null){
			if(config.period != null){
				this.m.onblur = config.onblur.bind(config.period);
			}else{
				this.m.onblur = config.onblur;
			}
		}
	}
	if(config.d != null){
		this.div.d = document.querySelector('#div-' + config.d);
		this.d = document.querySelector('#' + config.d);
		this.d.oninput = zeus.onDayInput;
		if(config.onblur != null){
			if(config.period != null){
				this.d.onblur = config.onblur.bind(config.period);
			}else{
				this.d.onblur = config.onblur;
			}
		}
	}
	if(config.h != null){
		this.div.h = document.querySelector('#div-' + config.h);
		this.h = document.querySelector('#' + config.h);
		if(config.onblur != null){
			if(config.period != null){
				this.h.onblur = config.onblur.bind(config.period);
			}else{
				this.h.onblur = config.onblur;
			}
		}
	}
}
ZeusDateInput.prototype = {
	getMoment: function(){
		let arrDate = [];
		arrDate.push(zeusStringUtils.trim(this.y.value));
		if(this.m != null){
			arrDate.push(zeusStringUtils.trim(this.m.value) - 1);
		}
		if(this.d != null){
			arrDate.push(zeusStringUtils.trim(this.d.value));
		}
		if(this.h != null){
			arrDate.push(this.h.value);
		}
		return moment(arrDate);
	},
	getMomentByViewSpanAndPeriodType: function(viewSpan, periodType){
		let arrDate = [];
		arrDate.push(zeusStringUtils.trim(this.y.value));
		if((viewSpan === 'y' && periodType === 'period') || viewSpan === 'M' || viewSpan === 'd'){
			arrDate.push(zeusStringUtils.trim(this.m.value) - 1);
		}
		if((viewSpan === 'M' && periodType === 'period') || viewSpan === 'd'){
			arrDate.push(zeusStringUtils.trim(this.d.value));
		}
		if(viewSpan === 'd' && periodType === 'period'){
			arrDate.push(this.h.value);
		}
		return moment(arrDate);
	},
	getDate: function(){
		return this.getMoment().toDate();
	},
	isValid: function(){
		let isValid = this.getMoment().isValid();
		if(!isValid){
			popupError.setMessage('期間が不正です。');
		}
		return isValid;
	},
	setTextDate: function(y, m, d){
		this.y.value = y;
		if(this.m != null){
			this.m.value = m;
		}
		if(this.d != null){
			this.d.value = d;
		}
	}
};