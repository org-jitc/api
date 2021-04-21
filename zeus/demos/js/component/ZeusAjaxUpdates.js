function AjaxText(config){
	this.url = config.url;
	this.id = config.id;
	this.text = document.querySelector('#' + config.id);
	this.dataType = this.text.getAttribute('data-type');
	this.dataSync = this.text.getAttribute('data-sync');
	this.required = this.text.getAttribute('data-required');
	this.extraKeys = this.text.getAttribute('data-extra-keys');
	this.extraValues = this.text.getAttribute('data-extra-values');
	this.labelCurrent = document.querySelector('#current-' + config.id);
	this.button = document.querySelector('#btn-set-' + config.id);
}
AjaxText.prototype = {
	bindEvent: function(onclick){
		this.button.onclick = onclick;
	},
	getAjaxParameter: function(){
		let param = {
			column: this.id,
			dataType: this.dataType,
			dataValue: this.text.value.trim(),
			syncType: this.dataSync,
			required: zeusStringUtils.isEmpty(this.required)? false: true
		};
		if(this.extraKeys != null){
			let arrKey = this.extraKeys.split(',');
			let arrValue = this.extraValues.split(',');
			for(let i = 0, l = arrKey.length; i < l; i++){
				param[arrKey[i]] = arrValue[i];
			}
		}
		return param;
	},
	update: function(){
		this.labelCurrent.innerText = this.text.value.trim();
	},
	reset: function(){
	}
};

function AjaxRadio(config){
	this.url = config.url;
	this.name = config.name;
	this.radios = document.querySelectorAll('[name="' + config.name +  '"]');
	this.value = document.querySelector('[name="' + config.name + '"]:checked').value;
	this.dataType = this.radios[0].getAttribute('data-type');
	this.dataSync = this.radios[0].getAttribute('data-sync');
	this.required = this.radios[0].getAttribute('data-required');
}
AjaxRadio.prototype = {
	bindEvent: function(onchange){
		if(this.radios != null){
			for(let i = 0, l = this.radios.length; i < l; i++){
				this.radios[i].onchange = onchange;
			}
		}
	},
	update: function(){
		this.value = document.querySelector('[name="' + this.name + '"]:checked').value;
	},
	reset: function(){
		docuemnt.querySelector('[name="' + this.name + '"][value="' + this.value + '"]').checked = true;
	},
	getAjaxParameter: function(){
		return {
			column: this.name,
			dataType: this.dataType,
			dataValue: document.querySelector('[name="' + this.name + '"]:checked').value,
			syncType: this.dataSync,
			required: zeusStringUtils.isEmpty(this.required)? false: true
		}
	}
};

function AjaxSelect(config){
	this.url = config.url;
	this.id = config.id;
	this.select = document.querySelector('#' + config.id);
	this.button = document.querySelector('#btn-set-' + config.id);
	this.value = this.select.value;
	this.dataType = this.select.getAttribute('data-type');
	this.dataSync = this.select.getAttribute('data-sync');
	this.required = this.select.getAttribute('data-required');
}
AjaxSelect.prototype={
	bindEvent: function(onclick){
		this.button.onclick = onclick;
	},
	getAjaxParameter: function(){
		return {
			column: this.id,
			dataType: this.dataType,
			dataValue: this.select.value,
			syncType: this.dataSync,
			required: zeusStringUtils.isEmpty(this.required)? false: true
		}
	},
	update: function(){
		this.value = this.select.value;
	},
	reset: function(){
		this.select.value = this.value;
	}
}

function AjaxCheckbox(config){
	this.name = config.name;
	this.url = config.url;
	this.checkboxes = document.querySelectorAll('[name="' + this.name + '"][data-visible="y"]');
	this.checkboxAll = document.querySelector('#all-' + this.name);
	this.button = document.querySelector('#btn-set-' + this.name);
	this.dataType = this.checkboxes[0].getAttribute('data-type');
	this.dataSync = this.checkboxes[0].getAttribute('data-sync');
	this.required = this.checkboxes[0].getAttribute('data-required');
	this.values = this.getValues();

	if(this.checkboxAll != null){
		this.setAllChecked();
		this.checkboxAll.onchange = this.onAllChange.bind(this.checkboxAll, this);
	}

	for(let i = 0, l = this.checkboxes.length; i < l; i++){
		this.checkboxes[i].onchange = this.onchange.bind(this);
	}
}
AjaxCheckbox.prototype = {
	bindEvent: function(onclick){
		this.button.onclick = onclick;
	},
	onchange: function(){
		if(this.checkboxAll != null){
			this.setAllChecked();
		}
	},
	onAllChange: function(item){
		for(let i = 0, l = item.checkboxes.length; i < l; i++){
			item.checkboxes[i].checked = this.checked;
		}
	},
	getCheckedLength: function(){
		return this.checkboxes == null? null: document.querySelectorAll('[name="' + this.name + '"][data-visible="y"]:checked').length;
	},
	setAllChecked: function(){
		this.checkboxAll.checked = this.checkboxes.length == this.getCheckedLength();
	},
	getValues: function(){
		let all = document.querySelectorAll('[name="' + this.name + '"]:checked');
		let checked = [];
		for(let i = 0, l = all.length; i < l; i++){
			checked.push(all[i].value);
		}
		return checked.join(',');
	},
	update: function(){
		this.values = this.getValues();
	},
	reset: function(){
		let all = document.querySelectorAll('[name="' + this.name + '"]');
		for(let i = 0, l = all.length; i < l; i++){
			all[i].checked = this.values.indexOf(all[i].value) >= 0;
		}
	},
	getAjaxParameter: function(){
		return {
			column: this.name,
			dataType: this.dataType,
			dataValue: this.getValues(),
			syncType: this.dataSync,
			required: zeusStringUtils.isEmpty(this.required)? false: true
		}
	}
}

function AjaxUpdateItems(config){
	let items = document.querySelectorAll('[data-toggle="ajax-update"]');
	if(items != null){
		this.ajaxItems = {};
		let type, id, name, ajaxItem;
		for(let i = 0, l = items.length; i < l; i++){
			type = items[i].type;
			id = items[i].id;
			name = items[i].name;
			ajaxItem = this.ajaxItems[zeusStringUtils.isEmpty(id)? name: id];
			if(ajaxItem == null){

				if(type === 'text'){
					ajaxItem = new AjaxText({id: id, url: config.url});
					ajaxItem.bindEvent(this.onSet.bind(ajaxItem));
				}else if(type === 'radio'){
					ajaxItem = new AjaxRadio({name: name, url: config.url});
					ajaxItem.bindEvent(this.onSet.bind(ajaxItem));
				}else if(type === 'select-one'){
					ajaxItem = new AjaxSelect({id: id, url: config.url});
					ajaxItem.bindEvent(this.onSet.bind(ajaxItem));
				}else if(type === 'checkbox'){
					ajaxItem = new AjaxCheckbox({name: name, url: config.url});
					ajaxItem.bindEvent(this.onSet.bind(ajaxItem));
				}
				this.ajaxItems[zeusStringUtils.isEmpty(id)? name: id] = ajaxItem;
			}
		}
	}
}
AjaxUpdateItems.prototype = {
	onSet: function() {
		if(this.button != null){
			$(this.button).button('loading');
		}
		zeus.ajax({
			url: this.url,
			data: this.getAjaxParameter(),
			item: this,
			success: function(resp){
				let objResp = JSON.parse(resp);
				if(objResp.result === 'ok'){
					this.item.update();
					popupMessage.setMessage(objResp.success.message);
				}else{
					this.item.reset();
					popupError.setMessage(objResp.error.message);
				}
				if(this.item.button != null){
					$(this.item.button).button('reset');
				}
			},
			error: function(){
				if(this.item.button != null){
					$(this.item.button).button('reset');
				}
				popupError.setMessage('エラーが発生しました。');
			}
		});
	}
}