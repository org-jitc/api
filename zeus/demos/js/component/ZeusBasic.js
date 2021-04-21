function ZeusRadio(config){
	this.name = config.name;
	this.radios = document.querySelectorAll('[name="' + config.name + '"]');
	
	if(config.textId != null){
		this.text = document.querySelector('#' + config.textId);
	}
	
	if(config.onchange != null){
		let isCall = config.isCallOnChange == null? true: config.isCallOnChange;
		
		for(let i = 0, l = this.radios.length; i < l; i++){
			this.radios[i].onchange = config.onchange;
			
			if(this.radios[i].checked && isCall){
				this.radios[i].onchange();
			}
		}
	}else{
		
		if(this.text){
			let binded = this.onChange.bind(this);
			
			for(let i = 0, l = this.radios.length; i < l; i++){
				this.radios[i].onchange = binded;
				
				if(this.radios[i].checked){
					this.radios[i].onchange();
				}
			}
		}
	}
}
ZeusRadio.prototype = {
	// events
	onChange: function(){
		
		if(this.text){
			this.setText();
		}
	},
	// methods
	checkedElement: function(){
		return document.querySelector('[name="' + this.name + '"]:checked');
	},
	getCheckedValue: function(){
		return this.checkedElement().value;
	},
	disabled: function(disabled){
		for(let i = 0, l = this.radios.length; i < l; i++){
			this.radios[i].disabled = disabled;
		}
	},
	setChecked: function(val){
		for(let i = 0, l = this.radios.length; i < l; i++){
			if(this.radios[i].value == val){
				this.radios[i].checked = true;
				break;
			}
		}
	},
	setOnchange: function(onchange){
		
		for(let i = 0, l = this.radios.length; i < l; i++){
			this.radios[i].onchange = onchange; 
		}
	},
	setText: function(){
		this.text.value = this.checkedElement().nextElementSibling.innerText.trim();
	}
};

// name: required
// checkedValuesId: option
// checkedTextId: option
// onallchange: option
// onchange: option
function ZeusCheckbox(config){
	this.name = config.name;
	this.all = document.querySelector('#all-' + config.name);
	this.checkboxes = document.querySelectorAll('[name="' + config.name + '"]');
	if(config.checkedValuesId != null){
		this.values = document.querySelector('#' + config.checkedValuesId);
	}
	if(config.checkedTextId != null){
		this.texts = document.querySelector('#' + config.checkedTextId);
	}
	
	if(this.all != null){
		if(config.onallchange != null){
			this.all.onchange = config.onallchange;
		}else{
			this.all.onchange = this.onAllChange.bind(this);
		}
	}
	for(let i = 0, l = this.checkboxes.length; i < l; i++){
		if(config.onchange != null){
			this.checkboxes[i].onchange = config.onchange;
		}else{
			this.checkboxes[i].onchange = this.onOneChange.bind(this);
		}
	}
	
	//>> initialization process
	if(this.values != null){
		this.setCheckedValues();
	}
	if(this.texts != null){
		this.setCheckedTexts();
	}
	//<< initialization process
}
ZeusCheckbox.prototype = {
	// events
	onAllChange: function(){
		this.setChecked();
		if(this.values != null){
			this.setCheckedValues();
		}
		if(this.texts != null){
			this.setCheckedTexts();
		}
	},
	onOneChange: function(){
		if(this.all != null){
			this.setAllChecked();
		}
		if(this.values != null){
			this.setCheckedValues();
		}
		if(this.texts != null){
			this.setCheckedTexts();
		}
	},
	// methods
	checkedElements: function(){
		return document.querySelectorAll('[name="' + this.name + '"]:checked');
	},
	checkedLength: function(){
		return this.checkedElements().length;
	},
	checkedValues: function(){
		let checkedElements = this.checkedElements();
		let checkedValues = [];
		for(let i = 0, l = checkedElements.length; i < l; i++){
			checkedValues.push(checkedElements[i].value);
		}
		return checkedValues.length > 0? checkedValues.join(','): '';
	},
	checkedTexts: function(){
		let checkedElements = this.checkedElements();
		let checkedTexts = [];
		let label;
		for(let i = 0, l = checkedElements.length; i < l; i++){
			label = zeus.getNextElement(checkedElements[i], 'LABEL');
			checkedTexts.push(label.innerText.trim());
		}
		return checkedTexts.length > 0? checkedTexts.join(','): '';
	},
	setChecked: function(checked){
		for(let i = 0, l = this.checkboxes.length; i < l; i++){
			this.checkboxes[i].checked = this.all != null? this.all.checked: checked;
		}
	},
	setAllChecked: function(){
		this.all.checked = this.checkboxes.length != 0 && this.checkboxes.length == this.checkedLength();
	},
	setCheckedValues: function(){
		this.values.value = this.checkedValues();
	},
	setCheckedTexts: function(){
		this.texts.value = this.checkedTexts();
	}
};

function ZeusSelect(config){
	this.id = config.id;
	this.select = document.querySelector('#' + this.id);
	
	if(config.textId){
		this.text = document.querySelector('#' + config.textId);
	}
	
	if(this.select != null){
	
		if(config.onchange){
			this.select.onchange = config.onchange;
		}else{
			this.select.onchange = this.onChange.bind(this);
			this.onChange.call(this);
		}
	}
}
ZeusSelect.prototype = {
	// events
	onChange: function(){
		
		if(this.text){
			this.setText();
		}
	},
	// methods
	selectedText: function(){
		return this.select.options[this.select.selectedIndex].text;
	},
	setText: function(){
		
		if(this.select.value === ''){
			this.text.value = '';
		}else{
			this.text.value = this.selectedText();
		}
	}
}