function Period(root, datepickerOption, parent){
	
	let _this = this;
	
	this.parent = parent;
	this.y = root.querySelector('[data-period-type="y"]');
	this.y.onkeyup = zeus.onYearInput;
	this.y.onblur = function(){
		_this.onDateBlur();
	};
	this.m = root.querySelector('[data-period-type="m"]');
	this.m.onkeyup = zeus.onMonthInput;
	this.m.onblur = function(){
		_this.onDateBlur();
	};
	this.d = root.querySelector('[data-period-type="d"]');
	this.d.onkeyup = zeus.onDayInput;
	this.d.onblur = function(){
		_this.onDateBlur();
	};
	let h = root.querySelector('[data-period-type="h"]');
	if(h){
		this.h = h;
		zeus.setNumberOptionsByElement(this.h, 0, 23, false, '00');
	}
	let mi = root.querySelector('[data-period-type="mi"]');
	if(mi){
		this.mi = mi;
		zeus.setNumberOptionsByElement(this.mi, 0, 59, false, '00')
	}
	
	this.datepicker = $(root.querySelector('[data-period-type="datepicker"]')).datepicker(datepickerOption);
	this.datepicker.on('changeDate', function(e) {
		
		if(e.date != null){
			
			_this.y.value = e.date.getFullYear();
			_this.m.value = e.date.getMonth() + 1;
			_this.d.value = e.date.getDate();
		}
	});
	let defaultDate = this.datepicker.attr('data-default-date');
	let mo = defaultDate? moment(defaultDate): moment();
	this.datepicker.datepicker('setDate', mo.toDate());
	
	let arrows = root.querySelectorAll('[data-period-type="arrow"]');
	if(arrows){
		
		for(let i = 0, l = arrows.length; i < l; i++){
			
			arrows[i].onclick = function(){
				
				if(_this.checkDateValid()){
					
					let arrowType = this.getAttribute('data-arrow-type');
					let mo = moment(_this.datepicker.datepicker('getDate'));
					if(arrowType == 'left'){
						mo.subtract(1, 'd');
					}else{
						mo.add(1, 'd');
					}
					_this.datepicker.datepicker('setDate', mo.toDate());
				}
			}
		}
	}
}
Period.prototype = {
	getDate: function(){
		return this.y.value + '-' + this.m.value + '-' + this.d.value;
	},
	getMoment: function(){
		
		let mo = moment(this.getDate());
		if(this.h != null){
			mo.hour(parseInt(this.h.value));
		}
		if(this.mi != null){
			mo.minute(parseInt(this.mi.value));
		}
		
		return mo;
	},
	getFormattedDate: function(){
		return this.getMoment().format('YYYY-MM-DD');
	},
	getFormattedDateTime: function(format){
		return this.getMoment().format(format);
	},
	isDateValid: function(){
		return moment(this.getDate(), 'YYYY-M-D', true).isValid();
	},
	checkDateValid: function(){
		
		if(this.isDateValid()){
			this.parent.clearErrorAll();
			return true;
		}else{
			this.parent.setErrorMessageAll(this.parent.fmtErrDate);
			return false;
		}
	},
	onDateBlur: function(){
		
		if(this.checkDateValid()){
			this.datepicker.datepicker('setDate', this.getMoment().toDate());
		}
	}
};

function Periods(id, datepickerOption){
	this.fmtErrDate = fmt.err.date;
	this.periods = document.querySelector('#' + id);
	this.errorAll = this.periods.querySelector('[data-periods-type="error-all"]');
	
	let listPeriod = this.periods.querySelectorAll('[data-periods-type="period"]');
	this.arrPeriod = [];
	for(let i = 0, l = listPeriod.length; i < l; i++){
		this.arrPeriod.push(new Period(listPeriod[i], datepickerOption, this));
	}
}
Periods.prototype = {
	getArrDateString: function(){
		
		let arrDate = [];
		for(let i = 0, l = this.arrPeriod.length; i < l; i++){
			arrDate.push(this.arrPeriod[i].getDate());
		}
		
		return arrDate;
	},
	clearErrorAll: function(){
		zeus.removeClass(this.periods, 'has-error');
		this.errorAll.innerHTML = '';
	},
	setErrorMessageAll: function(msg){
		zeus.addClass(this.periods, 'has-error');
		this.errorAll.innerHTML = msg;
	},
	checkNotAfter: function(){

		let isOk = true;
		for(let i = 0, l = this.arrPeriod.length - 1; i < l; i++){
			
			isOk = !moment(this.arrPeriod[i].getMoment()).isAfter(moment(this.arrPeriod[i + 1].getMoment()));
			if(!isOk){
				this.setErrorMessageAll(this.fmtErrDate);
				break;
			}
		}
		
		return isOk;
	},
	checkDateValid: function(){
		
		let isOk = true;
		for(let i = 0, l = this.arrPeriod.length; i < l; i++){
			isOk = this.arrPeriod[i].checkDateValid();
			if(!isOk){
				break;
			}
		}
		
		return isOk;
	}
}