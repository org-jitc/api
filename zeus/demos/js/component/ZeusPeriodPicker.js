function ZeusPeriodPicker(config){
	if(config.r != null){
		this.r = new ZeusRadio(config.r);
	}

	this.periodType = config.periodType;
	
	let lenPeriod;
	if(config.dateinput != null){
		lenPeriod = config.dateinput.inputs.length;
	}
	if(lenPeriod == null && config.datepicker != null){
		lenPeriod = config.datepicker.pickers.length;
	}
	if(lenPeriod == null && config.arrow != null){
		lenPeriod = config.arrow.arrows.length;
	}

	if(lenPeriod != null){
		this.arrPeriod = [];
		let configPeriod;
		let configSub;
		for(let i = 0; i < lenPeriod; i++){
			configPeriod = {};
			if(config.dateinput != null){
				configSub = {};
				Object.assign(configSub, config.dateinput.inputs[i]);
				if(config.dateinput.onblur != null){
					configSub.onblur = config.dateinput.onblur;
				}
				configPeriod.dateinput = configSub;
			}
			if(config.datepicker != null){
				configSub = {};
				configSub.picker = config.datepicker.pickers[i];
				configSub.option = config.datepicker.option;
				if(config.datepicker.onChangeDate != null){
					configSub.onChangeDate = config.datepicker.onChangeDate;
				}
				configPeriod.datepicker = configSub;
			}
			if(config.arrow != null){
				configSub = {};
				Object.assign(configSub, config.arrow.arrows[i]);
				if(config.arrow.onClick != null){
					configSub.onClick = config.arrow.onClick;
				}
				configPeriod.arrow = configSub;
			}
			this.arrPeriod.push(new ZeusPeriod(configPeriod));
		}
	}
}
ZeusPeriodPicker.prototype = {
	setDatepickerOption: function(option){
		for(let period of this.arrPeriod){
			period.datepicker.setOption(option);
		}
	},
	isValidDateinput: function(){
		let valid = true;
		for(let period of this.arrPeriod){
			valid = valid && period.dateinput.isValid();
		}
		return valid;
	},
	refreshDivVisible: function(){
		let viewSpan = this.r.getCheckedValue();
		for(let period of this.arrPeriod){
			if(viewSpan === 'y'){
				if(this.periodType === 'list'){
					zeus.hideElement([period.dateinput.div.m, period.dateinput.div.d]);
				}else{
					zeus.hideElement(period.dateinput.div.d);
					if(period.dateinput.div.h != null){
						zeus.hideElement(period.dateinput.div.h);
					}
				}
			}else if(viewSpan === 'M'){
				if(this.periodType === 'list'){
					zeus.showElement(period.dateinput.div.m);
					zeus.hideElement(period.dateinput.div.d);
				}else{
					zeus.showElement(period.dateinput.div.d);
					if(period.dateinput.div.h != null){
						zeus.hideElement(period.dateinput.div.h);
					}
				}
			}else{
				if(this.periodType === 'list'){
					zeus.showElement([period.dateinput.div.m, period.dateinput.div.d]);
				}else{
					zeus.showElement(period.dateinput.div.d);
					if(period.dateinput.div.h != null){
						zeus.showElement(period.dateinput.div.h);
					}
				}
			}
		}
	},
	refreshDatepickerViewMode: function(){
		let datepickerOption = {};
		let viewSpan = this.r.getCheckedValue();
		if(viewSpan === 'y' && this.periodType === 'list'){
			datepickerOption.startView = 'years';
			datepickerOption.minViewMode = 'years';
		}
		if((viewSpan === 'y' && this.periodType === 'period') || viewSpan === 'M'){
			datepickerOption.startView = 'months';
			datepickerOption.minViewMode = 'months';
		}
		if((viewSpan === 'M' && this.periodType === 'period') || viewSpan === 'd'){
			datepickerOption.startView = 'days';
			datepickerOption.minViewMode = 'days';
		}
		this.setDatepickerOption(datepickerOption);
	},
	getMomentAddField: function(){
		let viewSpan = this.r.getCheckedValue();
		let field;
		if(viewSpan === 'y' && this.periodType === 'list'){
			field = 'y';
		}
		if((viewSpan === 'y' && this.periodType === 'period') || viewSpan === 'M'){
			field = 'M';
		}
		if((viewSpan === 'M' && this.periodType === 'period') || viewSpan === 'd'){
			field = 'd';
		}
		return field;
	}
};