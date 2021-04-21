var dateArrows = (function(){
	function DateArrow(dateArrow){
		this.init(dateArrow);
	}
	DateArrow.prototype = {
		init: function(dateArrow){
			let _this = this;
			let data = dateArrow.getAttribute('data-y');
			this.y = data == null? null: document.querySelector('#' + data);
			
			data = dateArrow.getAttribute('data-m');
			this.m = data == null? null: document.querySelector('#' + data);
			
			data = dateArrow.getAttribute('data-d');
			this.d = data == null? null: document.querySelector('#' + data);
			
			data = dateArrow.getAttribute('data-r');
			this.r = data == null? null: '[name="' + data + '"]';
			
			this.arrow = dateArrow.getAttribute('data-arrow');
		},
		setMoment: function(){
			let hasEmpty = false;
			if(
				this.y != null && this.y.value != '' && !isNaN(this.y.value) && 
				this.m != null && this.m.value != '' && !isNaN(this.m.value) && 
				this.d != null && this.d.value != '' && !isNaN(this.d.value)
			){
				if(this.mo == null){
					this.mo = moment();
				}
				this.mo.year(this.y.value);
				this.mo.month(this.m.value - 1);
				this.mo.date(this.d.value);
			}else{
				hasEmpty = true;
			}
			if(hasEmpty){
				return false;
			}

			let addValue = 1;
			if(this.arrow == 'left'){
				addValue = -1;
			}
			
			let addAttr = null;
			let r, elRList, elChecked;
			let elRLen = 0;
			if(this.r != null){
				elRList = document.querySelectorAll(this.r);
				elRLen = elRList.length;
				
				elChecked = document.querySelector(this.r + ':checked');
				r = elChecked.value;
			}
			// from menu: Monitoring, version: echarts
			else if(typeof mieruka != 'undefined' && mieruka != null){
				r = mieruka.viewSpanObj.activated;
			}
			
			if(r != null){
				if(r == 'y'){
					addAttr = 'years';
				}else if(r == 'M'){
					addAttr = 'months';
				}else if(r == 'd' || r == 'h' || r == '30m'){
					addAttr = 'days';
				}else if(r == 'm'){
					if(elRLen == 4 || (typeof mieruka != 'undefined' && mieruka != null)){
						addAttr = 'months';
					}else{
						addAttr = 'days';
					}
				}
			}else{
				addAttr = 'days';
			}
			
			this.mo.add(addValue, addAttr);
			
			if(r == 'y'){
				this.y.value = this.mo.year();
			}else if(r == 'm' || r == 'M'){
				this.y.value = this.mo.year();
				this.m.value = this.mo.month() + 1;
			}else if(r == 'd' || r == 'h' || r == '30m' || r == 'm'){
				this.y.value = this.mo.year();
				this.m.value = this.mo.month() + 1;
				this.d.value = this.mo.date();
			}
			return true;
		}
	}

	// date arrow list
	function DateArrows(){
		let _this = this;
		this.list = null;
		let _prop = null;
		let _propValue = null;
		
		function init(prop, value){
			if(prop != null){
				_prop = prop;
			}
			if(value != null){
				_propValue = value;
			}
			if(_this.list == null){
				_this.list = [];
			}
			
			let items = document.querySelectorAll('[' + _prop + '="' + _propValue + '"]');
			let _item;
			for(let i = 0, l = items.length; i < l; i++){
				_item = items[i];
				_item.setAttribute('data-index', _this.list.length);
				_this.list.push(new DateArrow(_item));
			}
		}
		
		function reset(){
			delete _this.list;
			init();
		}
		
		this.init = init;
		this.reset = reset;
	}
	
	return new DateArrows();
})();