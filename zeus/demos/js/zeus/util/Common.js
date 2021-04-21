function Modal(id){
	let modal = document.querySelector('#' + id);
	if(modal){
		this.modal = modal;
		this.modalBody = this.modal.querySelector('.modal-body');
	}
}
Modal.prototype = {
	show: function(){
		$(this.modal).modal('show');
	},
	hide: function(){
		$(this.modal).modal('hide');
	},
	clear: function(){
		this.modalBody.innerHTML = '';
	},
	getMessage: function(){
		return this.modalBody.innerHTML;
	},
	setMessage: function(msg){
		this.modalBody.innerHTML = msg;
		this.show();
	},
	appendMessage: function(msg){
		let divMsg = document.createElement('div');
		divMsg.innerHTML = msg;
		this.modalBody.appendChild(divMsg);
	}
};

function Fmt(){}
Fmt.prototype = {
	getReplaced: function(template, params){
		for(let i = 0, l = params.length; i < l; i++){
			template = template.replace('{' + i + '}', params[i]);
		}
		return template;
	}	
};

function SetNameSelect(sltName, hddName){
	function onSelect(){
		_this.hdd.value = this.selectedIndex == 0? '': this.options[this.selectedIndex].text;
	}	
	let _this = this;
	this.slt = document.querySelector('[name="' + sltName + '"]');
	this.hdd = document.querySelector('[name="' + hddName + '"]');
	if(this.slt != null){
		this.slt.onchange = onSelect;
		trigger(this.slt, 'onchange');
	}
}

function SetNameCheckbox(checkName, option){
	let _this = this;
	function onCheck(){
		if(_this.checkAll != null){
			_this.checkAll.checked = _this.getLength('visible') === _this.getLength('checked');
		}
		
		let arrChecked = [];
		let arrCheckedText = [];
		if(_this.hddValue != null){
			for(let i = 0, l = _this.checks.length; i < l; i++){
				if(_this.checks[i].checked){
					arrChecked.push(_this.checks[i].value);
					arrCheckedText.push(_this.checks[i].nextElementSibling.innerText.trim());
				}
			}
			_this.hddValue.value = arrChecked.join();
		}
		if(_this.hddText != null){
			_this.hddText.value = arrCheckedText.join();
		}
	}
	function onCheckAll(){
		_this.setCheckedAll(this.checked);
		trigger(_this.checks[0], 'onchange');
	}
	this.checks = document.querySelectorAll('[name="' + checkName + '"]');
	let elName = option == null || option.all == null? checkName + 'All': option.all;
	this.checkAll = document.querySelector('[name="' + elName + '"]');
	elName = option == null || option.str == null? checkName + 'Str': option.str;
	this.hddValue = document.querySelector('[name="' + elName + '"]');
	elName = option == null || option.names == null? checkName + 'Names': option.names;
	this.hddText = document.querySelector('[name="' + elName + '"]');
	
	if(this.checkAll != null){
		this.checkAll.onchange = onCheckAll;
	}
	if(this.checks.length > 0){
		for(let i = 0, l = this.checks.length; i < l; i++){
			this.checks[i].onchange = onCheck;
		}
		trigger(this.checks[0], 'onchange');
	}
}
SetNameCheckbox.prototype = {
	setCheckedAll: function(checked){
		if(this.checks.length > 0){
			let styleClass;
			for(let i = 0, l = this.checks.length; i < l; i++){
				styleClass = this.checks[i].getAttribute('class');
				if(styleClass === 'visible-y') this.checks[i].checked = checked;
			}
		}
	},
	getLength: function(which){
		let len = 0, styleClass;
		for(let i = 0, l = this.checks.length; i < l; i++){
			styleClass = this.checks[i].getAttribute('class');
			if(styleClass === 'visible-y'){
				if(which === 'visible') len++;
				else{
					if(this.checks[i].checked) len++;
				}
			}
		}
		return len;
	},
	setChecked: function(ids){
		if(this.checks.length > 0){
			this.setCheckedAll(false);
			for(let i = 0, l = this.checks.length; i < l; i++){
				if(ids.indexOf(this.checks[i].value) >= 0){
					this.checks[i].checked = true;
				}
			}
			trigger(this.checks[0], 'onchange');
		}
	},
	getCheckedIds: function(){
		if(this.hddValue != null){
			return this.hddValue.value == null? '': this.hddValue.value;
		}
		return '';
	},
	getCheckedNames: function(){
		if(this.hddText != null){
			return this.hddText.value == null? '': this.hddText.value;
		}
		return '';
	}
}

function FormGroup(formGroupId) {
	this.formGroup = document.querySelector('#' + formGroupId);
	this.inputItem = this.formGroup.querySelector('.input-item');
	this.errorItem = this.formGroup.querySelector('.error-item');
}
FormGroup.prototype.clearError = function(){
	zeus.removeClass(this.formGroup, 'has-error');
	this.errorItem.innerHTML = '';
};
FormGroup.prototype.setError = function(msg){
	zeus.addClass(this.formGroup, 'has-error');
	this.errorItem.innerHTML = msg;
}

function Zeus(){};
Zeus.prototype = {
	ajaxConfig: {
		type: 'POST',
		async: true,
		cache: false,
		error: function(){
			popupError.setMessage('エラーが発生しました。');
		}
	},
	ajax: function(config){
		let ajaxConfig = {};
		Object.assign(ajaxConfig, this.ajaxConfig, config);
		$.ajax(ajaxConfig);
	},
	bootstrapTable: {
		fn: {
			table: {
				headerStyle: function(column){
					return {
						classes: 'text-center'
					}
				},
			},
			column: {
				cellStyleDatetime: function(){
					return {
						classes: 'bg-zeus text-center'
					}
				},
				cellStyle: function(){
					return {
						classes: 'text-right'
					}
				}
			}
		}
	},
	setNumberOptionsByElement: function(el, start, end, hasBlank, format){
		let option, value;
		if(hasBlank){
			option = document.createElement('option');
			option.innerText = '${fmtPlsChoose}';
			el.appendChild(option);
		}
		for(var i = start; i <= end; i++){
			value = format == '00'? this.getFormattedNumber(i): i;
			option = document.createElement('option');
			option.value = value;
			option.innerText = value;
			el.appendChild(option);
		}
	},
	setNumberOptions: function(id, start, end, hasBlank, format) {
		let item = document.querySelector('#' + id);
		this.setNumberOptionsByElement(item, start, end, hasBlank, format);
	},
	setNumberOptionsByName: function(name, start, end, hasBlank, format) {
		let items = document.querySelectorAll('[name="' + name + '"]');
		for(let i = 0, l = items.length; i < l; i++){
			this.setNumberOptionsByElement(items[i], start, end, hasBlank, format);
		}
	},
	getFormattedNumber: function(number) {
		if(number < 10){
			return '0' + number;
		}
		return number;
	},
	setDivVerticalMiddle: function(id) {
		let loginDiv = $('#' + id);
		let loginDivHeight = loginDiv.height();
		let marginTopHeight = (document.documentElement.clientHeight - loginDivHeight) / 2;
		loginDiv.css('margin-top', marginTopHeight + 'px');
	},
	getBootstrapTableLocale: function(sysLanguage) {
		
		if(sysLanguage){
			
			if(sysLanguage.indexOf('en') > 0){
				return 'en-US';
			}else if(sysLanguage.indexOf('ko') > 0){
				return 'ko-KR';
			}else if(sysLanguage.indexOf('cn') > 0){
				return 'zh-CN';
			}else if(sysLanguage.indexOf('tw') > 0){
				return 'zh-TW';
			}
		}
		return 'ja-JP';
	},
	exportCSV: function(csvStr, fileName) {
		csvStr = csvStr.replace('\ufeff', '');
		var encode = 'utf-8';
		if(systemEncode == 'Shift_JIS'){
			encode = 'Shift_JIS';
		}
		// Unicodeコードポイントの配列に変換する
		var unicodeArr = [];
		for(var i = 0; i < csvStr.length; i++){
			unicodeArr.push(csvStr.charCodeAt(i));
		}
		// システム言語コードポイントの配列に変換
		var encodeArray = Encoding.convert( 
			unicodeArr, // ※文字列を直接渡すのではない点に注意
			systemEncode,  // to
			'UNICODE' // from
		);
		// 文字コード配列をTypedArrayに変換する
		let uint8Arr = new Uint8Array(encodeArray);
		
		let blob = new Blob([uint8Arr], {type: 'text/csv'});
		let a  = document.createElement('a');
		a.download = fileName;
		// ie
	    if(window.navigator.msSaveOrOpenBlob){
	    	window.navigator.msSaveOrOpenBlob(blob, fileName);
	    }else if(window.URL && window.URL.createObjectURL){// firefox
	    	a.href = window.URL.createObjectURL(blob);
	    	document.body.appendChild(a);
	    	a.click();
	    	document.body.removeChild(a);
	    }else if(window.webkitURL && window.webkitURL.createObject){// chrome
	    	a.href = window.webkitURL.createObjectURL(blob);
	    	a.click();
	    }else{ // safari
			window.open('data:text/csv;base64,' + window.Base64.encode(csvStr), '_blank');
		}
	},
	getFile: function(path){
		let form = $("<form></form>").attr("action", '/zeuschart/GetFile.do').attr("method", "post");
		let input = $('<input>').attr('type', 'hidden').attr('name', 'path').attr('value', path);
		input.appendTo(form);
	    form.appendTo('body').submit().remove();
	},
	/* param:
	 * {
	 * 	action: the url for request file,
	 * 	attrList: [{name: attribute name, value: attributeValue}..] attributes needed for downloading
	 * 	method: get, post... optional
	 * }
	 */
	downloadFile: function(param){
		let form = document.createElement('form');
		form.setAttribute('action', param.action);
		form.setAttribute('method', param.method == null? 'post': param.method);
		let input = null;
		let attr = null;
		for(let i = 0; i < param.attrList.length; i++){
			attr = param.attrList[i];
			input = document.createElement('input');
			input.setAttribute('type', 'hidden');
			input.setAttribute('name', attr.name);
			input.setAttribute('value', attr.value);
			form.appendChild(input);
		}
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	urlHref: function(item){
		document.location.href = $(item).attr('data-url');
	},
	setFormAction: function(item, formId){
		let action = item.getAttribute('data-url');
		document.querySelector('#' + formId).action = action;
	},
	setHelpMarkStatus: function(menu, status){
		let param = {};
		param.menu = menu;
		param.status = status;
		
		$.ajax({
			url: contextPath + 'Ajax/Common/SetHelpMarkStatus.action',
			type: 'POST',
			async: true,
			cache: false,
			data: param,
			success: function(){
				console.log('set help mark status success');
			},
			error: function(){
				console.log('set help mark status failed');
			}
		});
	},
	clockObj: {
		obj: null,
		objId: '#fieldclock',
		format: 'YYYY/MM/DD (dd) HH:mm:ss',
		init: function(){
			this.obj = $(this.objId);
			this.clock();
			setInterval(this.clock, 1000);
		},
		clock: function(){
			let now = moment().format(zeus.clockObj.format);
			zeus.clockObj.obj.text(now);
			if(document.f != null && document.f.fieldclock != null && "value" in document.f.fieldclock){
				document.f.fieldclock.value = now;
			}
		}
	},
	initVariables: function(){
		modalImg = $('#modal-img');
		divHddFile = $('#div-hdd-file');
		hddOperation = $('[name="operation"]');
		hddAttr = $('[name="attr"]');
		menuForm = $('#menuForm');
		menuIdHidden = $('#menuIdHidden');
	},
	hideElement: function(el){
		if(el != null){
			let list;
			if(el instanceof NodeList || el instanceof Array){
				list = el;
			}else {
				list = [el];
			}
			let cssClass;
			for(let i = 0, l = list.length; i < l; i++){
				cssClass = list[i].getAttribute('class');
				if(cssClass == null){
					cssClass = '';
				}
				if(cssClass.indexOf('d-none') < 0){
					if(cssClass.length > 0){
						cssClass += ' ';
					}
					cssClass += 'd-none';
				}
				list[i].setAttribute('class', cssClass);
			}
		}
	},
	showElement: function(el){
		if(el != null){
			let list;
			if(el instanceof NodeList || el instanceof Array){
				list = el;
			}else {
				list = [el];
			}
			let cssClass;
			for(let i = 0, l = list.length; i < l; i++){
				cssClass = list[i].getAttribute('class');
				if(cssClass == null){
					cssClass = '';
				}
				cssClass = cssClass.replace(' d-none', '').replace('d-none', '');
				list[i].setAttribute('class', cssClass);
			}
		}
	},
	onYearInput: function(){
		let val = this.value.trim();
		if(val !== ''){
			val = val.replace(/\D/g, '');
			val = val.replace(/^0+/, '');
			if(val.length > 4){
				val = val.slice(0, 4);
			}
		}
		this.value = val;
	},
	onMonthInput: function(){
		let val = this.value.trim();
		if(val !== '') {
			val = val.replace(/\D/g, '');
			val = val.replace(/^0+/, '');
			if(val.length > 2){
				val = val.slice(0, 2);
			}
			if(val < 1){
				val = 1;
			}else if(val > 12){
				val = 12;
			}
		}
		this.value = val;
	},
	onDayInput: function(){
		let val = this.value.trim();
		if(val !== ''){
			val = val.replace(/\D/g, '');
			val = val.replace(/^0+/, '');
			if(val.length > 2){
				val = val.slice(0, 2);
			}
		}
		this.value = val === ''? 1: val;
	},
	onNumberInput: function(){
		this.value = this.value.trim().replace(/\D/g, '');
	},
	createElement: function(elName, options){
		let el = document.createElement(elName);
		if(options != null){
			if(options.type != null){
				el.type = options.type;
			}
			if(options.id != null){
				el.id = options.id;
			}
			if(options.name != null){
				el.name = options.name;
			}
			if(options.value != null){
				el.value = options.value;
			}
			if(options.styleClass != null){
				el.setAttribute('class', options.styleClass);
			}
			if(options.maxLength != null){
				el.maxLength = options.maxLength;
			}
			if(options.innerText != null){
				el.innerText = options.innerText;
			}
			if(options.href != null){
				el.href = options.href;
			}
			if(options.data != null){
				for(let key in options.data){
					el.setAttribute('data-' + key, options.data[key]);
				}
			}
		}
		return el;
	},
	msgRequiredObj: {
		objClass: '.span-msg-required',
		init: function(){
			let obj = $(this.objClass);
			obj.addClass('word-red1');
			obj.html('※' + fmtMsgRequired);
		}
	},
	json: {
		searchKey: function(obj, val){
			for(let key in obj){
				if(obj[key] === val){
					return key;
				}
			}
			return null;
		}
	},
	addClass: function(el, newClass){
		if(newClass !== null && newClass.trim() !== ''){
			let originClass = el.getAttribute('class');
			if(originClass === null || originClass.trim() === ''){
				el.setAttribute('class', newClass);
			}else{
				if(originClass.indexOf(newClass) < 0){
					el.setAttribute('class', [originClass, newClass].join(' '));
				}
			}
		}
	},
	removeClass: function(el, targetClass){
		let elClass = el.getAttribute('class');
		if(elClass !== null && elClass.trim() !== ''){
			if(elClass.indexOf(' ' + targetClass) >= 0){
				el.setAttribute('class', elClass.replace(' ' + targetClass, ''));
			}else if(elClass.indexOf(targetClass) >= 0){
				el.setAttribute('class', elClass.replace(targetClass, ''));
			}
		}
	},
	getMaxDay: function(year, month){
		return moment(year + '-' + this.getFormattedNumber(month)).daysInMonth();
	},
	getNextElement: function(element, tagName){
		let next = element;
		while(true){
			next = next.nextElementSibling;
			if(next == null){
				break;
			}else{
				if(tagName == null || next.tagName === tagName){
					return next;
				}
			}
		}
		return null;
	}
};

function ZeusStringUtils(){}
ZeusStringUtils.prototype = {
	trim: function(val){
		if(val != null){
			return val.trim();
		}
		return null;
	},
	isEmpty: function(val){
		if(val == null){
			return true;
		}
		if(val.trim() === ''){
			return true;
		}
		return false;
	},
	replaceAll: function(str, strOld, strNew){
		let reg = new RegExp(strOld, 'g');
		if(str != null && strOld != null && strNew != null){
			return str.replace(reg, strNew);
		}
		return str;
	}
}

function ZeusNumberUtils(){}
ZeusNumberUtils.prototype = {
	toThousands: function (num) {
		num = (num || 0).toString();
		let result = '';
		let arrNum = num.split('.');
		while (arrNum[0].length > 3) {
			result = ',' + arrNum[0].slice(-3) + result;
			arrNum[0] = arrNum[0].slice(0, arrNum[0].length - 3);
		}
		if (arrNum[0]) { 
			result = arrNum[0] + result;
		}
		arrNum[0] = result;
		return arrNum.join('.');
	}
};


let util_zeus = {
	fmt: new Fmt()
};

let modalImg;
let divHddFile;
let hddOperation;
let hddAttr;

let menuForm = $('#menuForm');
let menuIdHidden = $('#menuIdHidden');

var datePickerOptions = {
	language: 'ja',
	format: 'yyyy-mm-dd',
	minView: 2,
	autoclose: true,
	todayBtn: 'linked',
	todayHighlight: true,
	pickerPosition: 'top-right'
};

let popupError = new Modal('errorPopup');
let popupMessage = new Modal('modal-msg');

//-> event starts with 'on*'
function trigger(element, event){
	if (element.fireEvent) element.fireEvent(event);
	else{
	    let ev = document.createEvent("HTMLEvents");
	    // event not contain 'on'
	    // (eventType, canBubble, canelable)
	    ev.initEvent(event.replace('on', ''), false, true);  
	    element.dispatchEvent(ev);
	}
}
//-> join checkboxes' values
function chk_join(elements, seperator){
	let arr = [];
	for(let i = 0, l = elements.length; i < l; i++){
		arr.push(elements[i].value);
	}
	return arr.join(seperator);
}

function datetimeColumnStyle(){
	return {
		classes: 'td-with-bg',
		css: {
			'width': '140px',
			'min-width': '140px',
			'max-width': '140px'
		}
	};
}

function headColumnStyle() {
	return {
		css: {
			'width': '80px',
			'min-width': '80px',
			'max-width': '80px'
		}
	};
}

let STORE_KEY = {
	bootstrapTable: {
		language: 'bootstrapTableLanguage'
	}
}

var zeus = new Zeus();
sessionStorage.setItem(STORE_KEY.bootstrapTable.language, zeus.getBootstrapTableLocale(sessionStorage.getItem('sysLanguage')));

let trimFunction = function(){
	this.value = $.trim(this.value);
}

function goMenu(action, menuId){
	menuForm.attr('action', contextPath + action);
	menuIdHidden.val(menuId);
	menuForm.submit();
}

function openFileImportWindow(action){
	let settingInfoImportDiv = $('#settingInfoImportDiv');
	let settingInfoImportFrame = $('#settingInfoImportFrame');
	window.formAction = action;
	settingInfoImportFrame.prop('src', action + "?process=init");
	settingInfoImportDiv.modal('show');
}

function closeFileImportWindow(){
	let settingInfoImportDiv = $('#settingInfoImportDiv');
	settingInfoImportDiv.modal('hide');
}

//-> check sync server status component
function SyncServerChecker(){
	let isCheck = zeusStore.serverSync.serverSyncCheck == 1;
	let checkSwitch = document.querySelector('[name="syncSwitch"]');
	let iStatus = document.querySelector('#i-server-sync-status');
	let statusClass = {};
	statusClass.basic = 'fas fa-server';
	statusClass.ok = 'status-success';
	statusClass.ng = 'status-error';
	statusClass.def = 'text-muted';
	statusClass.getClass = function(status){
		if(this[status] == null){
			return this.basic + ' ' + this.def;
		}else{
			return this.basic + ' ' + this[status];
		}
	};
	
	checkSwitch.onchange = function(){
		$.ajax({
			url: contextPath + 'Ajax/Common/ServerSync/SetCheck.action',
			cache: false,
			sync: true,
			data: {check: this.checked? 1: 0},
			success: function(){
				console.log('set server sync check success');
			},
			error: function(){
				console.log('set server sync check failed');
			}
		});
		isCheck = this.checked;
		checkStatus();
	}
	
	function checkStatus(){
		if(isCheck){
			$.ajax({
				url: contextPath + 'Ajax/Common/ServerSync/CheckStatus.action',
				cache: false,
				sync: true,
				success: function(resp){
					let respObj = JSON.parse(resp);
					iStatus.setAttribute('class', statusClass.getClass(respObj.result));
					checkStatus();
				},
				error: function(){
					console.log('check sync server status failed')
					iStatus.setAttribute('class', statusClass.getClass('def'));
					checkStatus();
				}
			});
		}else{
			iStatus.setAttribute('class', statusClass.getClass('def'));
		}
	}
	if(isCheck){
		checkStatus();
	}
}
//-> for server sync check component
if(typeof zeusStore != 'undefined' && zeusStore.serverSync.hasComponent){
	new SyncServerChecker();
}
//<- for server sync check component
//<- check sync server status component

let zeusStringUtils = new ZeusStringUtils();
let zeusNumberUtils = new ZeusNumberUtils();