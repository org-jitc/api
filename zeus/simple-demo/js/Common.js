/**
	Enootのためfunctionで定義しなければならない
 */
if(typeof window.Modal === 'undefined'){
	window.Modal = class {
		constructor(id){
			let modal = document.querySelector('#' + id);
			
			if(modal){
				this.modal = modal;
				this.modalBody = this.modal.querySelector('.modal-body');
				// binding events
				$(this.modal).on('hide.bs.modal', this.onModalHide.bind(this));
			}
		}
		// events
		onModalHide(){
			this.clear();
		}
		
		// methods
		show() {
			$(this.modal).modal('show');
		}
		hide() {
			$(this.modal).modal('hide');
		}
		clear() {
			this.modalBody.innerHTML = '';
		}
		getMessage() {
			return this.modalBody.innerHTML;
		}
		setMessage(msg) {
			this.modalBody.innerHTML = msg;
			this.show();
		}
		/**
		 * isNew, isEnd指定しない場合はtrueとする
		 */
		appendMessage(msg, classes, isNew, isEnd) {
			
			if(isNew == null || isNew){
				this.clear();
			}
			let divMsg = document.createElement('div');
			
			divMsg.innerHTML = msg;
			
			if(classes){
				divMsg.setAttribute('class', classes);
			}
			this.modalBody.appendChild(divMsg);
			
			if(isEnd == null || isEnd) {
				this.show();
			}
		}
		/**
		 * isNew, isEnd指定しない場合はtrueとする
		 */
		appendSuccessMessage(msg, isNew, isEnd) {
			
			if(isNew == null || isNew){
				this.clear();
			}
			let divMsg = document.createElement('div');
			
			divMsg.innerHTML = msg;
			divMsg.setAttribute('class', 'text-success');
			this.modalBody.appendChild(divMsg);
			
			if(isEnd == null || isEnd) {
				this.show();
			}
		}
		/**
		 * isNew, isEnd指定しない場合はtrueとする
		 */
		appendDangerMessage(msg, isNew, isEnd) {
			
			if(isNew == null || isNew){
				this.clear();
			}
			let divMsg = document.createElement('div');
			
			divMsg.innerHTML = msg??'エラーが発生しました。';
			divMsg.setAttribute('class', 'text-danger');
			this.modalBody.appendChild(divMsg);
			
			if(isEnd == null || isEnd) {
				this.show();
			}
		}
		/**
		 * isNew, isEnd指定しない場合はtrueとする
		 */
		appendWarningMessage(msg, isNew, isEnd) {
			
			if(isNew == null || isNew){
				this.clear();
			}
			let divMsg = document.createElement('div');
			
			divMsg.innerHTML = msg;
			divMsg.setAttribute('class', 'text-warning');
			this.modalBody.appendChild(divMsg);
			
			if(isEnd == null || isEnd) {
				this.show();
			}
		}
		/**
		 * isNew, isEnd指定しない場合はtrueとする
		 */
		appendMessages(msgs, classes, isNew, isEnd){
			
			if(msgs != null && msgs.length > 0){
				msgs.forEach((msg, index) => {
					this.appendMessage(msg, classes, (isNew == null || isNew) && index === 0, (isEnd == null || isEnd) && index === msgs.length - 1);
				});
			}
		}
		/**
		 * isNew, isEnd指定しない場合はtrueとする
		 */
		appendSuccessMessages(msgs, isNew, isEnd){
			
			if(msgs != null && msgs.length > 0){
				msgs.forEach((msg, index) => {
					this.appendSuccessMessage(msg, (isNew == null || isNew) && index === 0, (isEnd == null || isEnd) && index === msgs.length - 1);
				});
			}
		}
		/**
		 * isNew, isEnd指定しない場合はtrueとする
		 */
		appendDangerMessages(msgs, isNew, isEnd){
			
			if(msgs != null && msgs.length > 0){
				msgs.forEach((msg, index) => {
					this.appendDangerMessage(msg, (isNew == null || isNew) && index === 0, (isEnd == null || isEnd) && index === msgs.length - 1);
				});
			}
		}
		/**
		 * isNew, isEnd指定しない場合はtrueとする
		 */
		appendWarningMessages(msgs, isNew, isEnd){
			
			if(msgs != null && msgs.length > 0){
				msgs.forEach((msg, index) => {
					this.appendWarningMessage(msg, (isNew == null || isNew) && index === 0, (isEnd == null || isEnd) && index === msgs.length - 1);
				});
			}
		}
	}
}

/**
	Enootのためfunctionで定義しなければならない
 */
if(typeof window.Fmt === 'undefined'){
	window.Fmt = class {
		constructor(){
		}
		getReplaced(template, params) {
			
			for(let i = 0, l = params.length; i < l; i++){
				template = template.replace('{' + i + '}', params[i]);
			}
			return template;
		}	
	}
}

if(typeof window.SetNameCheckbox === 'undefined'){
	window.SetNameCheckbox = class {
		constructor(checkName, option){
			this.checks = document.querySelectorAll('[name="' + checkName + '"]');

			let elName = option == null || option.all == null? checkName + 'All': option.all;
			this.checkAll = document.querySelector('[name="' + elName + '"]');
			
			elName = option == null || option.str == null? checkName + 'Str': option.str;
			this.hddValue = document.querySelector('[name="' + elName + '"]');

			elName = option == null || option.names == null? checkName + 'Names': option.names;
			this.hddText = document.querySelector('[name="' + elName + '"]');
			
			if(this.checkAll != null){
				this.checkAll.onchange = this.onCheckAll.bind(this);
			}
			if(this.checks.length > 0){
				
				for(let i = 0, l = this.checks.length; i < l; i++){
					this.checks[i].onchange = this.onCheck.bind(this);
				}
				this.onCheck();
			}
		}
		onCheck(){
			
			if(this.checkAll != null){
				this.checkAll.checked = this.getLength('visible') === this.getLength('checked');
			}
			let arrChecked = [];
			let arrCheckedText = [];
			
			if(this.hddValue != null){
				
				for(let i = 0, l = this.checks.length; i < l; i++){
					
					if(this.checks[i].checked){
						arrChecked.push(this.checks[i].value);
						arrCheckedText.push(this.checks[i].nextElementSibling.innerText.trim());
					}
				}
				this.hddValue.value = arrChecked.join();
			}
			if(this.hddText != null){
				this.hddText.value = arrCheckedText.join();
			}
		}
		onCheckAll(){
			this.setCheckedAll(this.checkAll.checked);
			this.onCheck();
		}
		setCheckedAll(checked){
			
			if(this.checks.length > 0){
				let styleClass;
			
				for(let i = 0, l = this.checks.length; i < l; i++){
					styleClass = this.checks[i].getAttribute('class');
					
					if(styleClass === 'visible-y') {
						this.checks[i].checked = checked;
					}
				}
			}
		}
		getLength(which){
			let len = 0, styleClass;
			
			for(let i = 0, l = this.checks.length; i < l; i++){
				styleClass = this.checks[i].getAttribute('class');
				
				if(styleClass === 'visible-y'
					&& (which === 'visible' || this.checks[i].checked)){
					len++;
				}
			}
			return len;
		}
		setChecked(ids){
			
			if(this.checks.length > 0){
				this.setCheckedAll(false);
				
				for(let i = 0, l = this.checks.length; i < l; i++){
					if(ids.indexOf(this.checks[i].value) >= 0){
						this.checks[i].checked = true;
					}
				}
				trigger(this.checks[0], 'onchange');
			}
		}
		getCheckedIds(){
			
			if(this.hddValue != null){
				return this.hddValue.value == null? '': this.hddValue.value;
			}
			return '';
		}
		getCheckedNames(){
			
			if(this.hddText != null){
				return this.hddText.value == null? '': this.hddText.value;
			}
			return '';
		}
	}
}

/**
	Enootのためfunctionで定義しなければならない
 */
if(typeof window.FormGroup === 'undefined'){
	window.FormGroup = class {
		constructor(formGroupId){
		    this.formGroup = document.querySelector('#' + formGroupId);
		    this.inputItem = this.formGroup.querySelector('.input-item');
		    this.errorItem = this.formGroup.querySelector('.error-item');
		}
	    clearError() {
	        zeus.removeClass(this.formGroup, 'has-error');
	        this.errorItem.innerHTML = '';
	    }
	    setError(msg) {
	        zeus.addClass(this.formGroup, 'has-error');
	        this.errorItem.innerHTML = msg;
	    }
	}
}

if(typeof window.PageClock == 'undefined'){
	window.PageClock = class {
		static clock_format = 'YYYY/MM/DD (dd) HH:mm:ss';
		constructor(){
			this.display_container = document.querySelector('#fieldclock');
			this.start();
		}
		start(){
			this.ticktock();
			setInterval(this.ticktock.bind(this), 1000);
		}
		ticktock(){
			let now = moment().format(PageClock.clock_format);
			this.display_container.innerText = now;
			
			if(document.f && document.f.fieldclock && "value" in document.f.fieldclock){
				document.f.fieldclock.value = now;
			}
		}
	}
}

if(typeof window.RequiredMessages == 'undefined'){
	window.RequiredMessages = class {
		static css_selector = '.span-msg-required';
		static css_class = {textDanger: 'word-red1'};
		static inner_message = `※${typeof fmtMsgRequired === 'undefined'? '必須': fmtMsgRequired}`;
		static init(){
			Zeus.arrayFrom(document.querySelectorAll(RequiredMessages.css_selector))
			.forEach(requiredMsg => {
				Zeus.addClass(requiredMsg, RequiredMessages.css_class.textDanger);
				requiredMsg.innerText = RequiredMessages.inner_message;
			});
		}
	}
}

if(typeof window.Zeus == 'undefined'){
	window.Zeus = class {
		static css_class = {
			displayNone: 'd-none'
		};
		
		constructor(){
			this.bootstrapTable = {
				fn: {
					column: {
						cellStyleDatetime: Zeus.getBootstrapTableDatetimeCellStyle
					}
				}
			};
			
			this.onYearInput = Zeus.onYearInput;
			this.onMonthInput = Zeus.onMonthInput;
			this.onDayInput = Zeus.onDayInput;
			this.onNumberInput = Zeus.onNumberInput;
			this.onblurN3P2 = Zeus.onblurN3P2;
			this.onblurN1P2 = Zeus.onblurN1P2;
			this.onblurInteger = Zeus.onblurInteger;
		}
		
		static getBootstrapTableDatetimeCellStyle(){
			return {
				classes: 'bg-zeus text-center'
			};
		}
		static getBootstrapTableCellStyle(){
			return {
				classes: 'text-right'
			};
		}
		static arrayFrom(obj){
			// check [null|undefined]
			if(!obj){
				return [];
			}
			
			if(obj instanceof Array){
				return obj;
			}
			
			if(obj instanceof NodeList
				|| obj instanceof HTMLCollection){
				return Array.from(obj);
			}
			return [obj];
		}
		static bootstrapTableHeaderStyle(){
			return {
				classes: 'text-center'
			};
		}
		static getBootstrapTableLocale(sysLanguage){
			
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
		}
		showElement(el){
			Zeus.showElement(el);
		}
		static showElement(el){
			this.arrayFrom(el)
			.forEach(item => {
				let cssClass = (item.getAttribute('class')??'')
					.replace(` ${this.css_class.displayNone}`, '')
					.replace(this.css_class.displayNone, '');
				item.setAttribute('class', cssClass);
			});
		}
		hideElement(el){
			Zeus.hideElement(el);
		}
		static hideElement(el){
			this.arrayFrom(el)
			.forEach(item => {
				let cssClass = item.getAttribute('class')??'';
				
				if(cssClass.indexOf(this.css_class.displayNone) < 0){
					
					if(cssClass.length > 0){
						cssClass += ' ';
					}
					cssClass += this.css_class.displayNone;
				}
				item.setAttribute('class', cssClass);
			});
		}
		setNumberOptionsByElement(el, start, end, hasBlank, format){
			Zeus.setNumberOptionsByElement(el, start, end, hasBlank, format);
		}
		static setNumberOptionsByElement(el, start, end, hasBlank, format){
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
		}
		setNumberOptions(id, start, end, hasBlank, format){
			Zeus.setNumberOptions(id, start, end, hasBlank, format);
		}
		static setNumberOptions(id, start, end, hasBlank, format) {
			let item = document.querySelector('#' + id);
			this.setNumberOptionsByElement(item, start, end, hasBlank, format);
		}
		setNumberOptionsByName(name, start, end, hasBlank, format){
			Zeus.setNumberOptionsByName(name, start, end, hasBlank, format);
		}
		static setNumberOptionsByName(name, start, end, hasBlank, format) {
			let items = document.querySelectorAll('[name="' + name + '"]');
			
			for(let i = 0, l = items.length; i < l; i++){
				this.setNumberOptionsByElement(items[i], start, end, hasBlank, format);
			}
		}
		getFormattedNumber(number){
			return Zeus.getFormattedNumber(number);
		}
		static getFormattedNumber(number) {
			
			if(number < 10){
				return '0' + number;
			}
			return number;
		}
		exportCSV(csvStr, fileName){
			Zeus.exportCSV(csvStr, fileName);
		}
		static exportCSV(csvStr, fileName){
			csvStr = csvStr.replace('\ufeff', '');
			
			// Unicodeコードポイントの配列に変換する
			let unicodeArr = [];
			
			for(var i = 0; i < csvStr.length; i++){
				unicodeArr.push(csvStr.charCodeAt(i));
			}
			
			// システム言語コードポイントの配列に変換
			let encodeArray = Encoding.convert( 
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
		}
		getFile(path){
			Zeus.getFile(path);
		}
		static getFile(path){
			let form = $("<form></form>").attr("action", '/zeuschart/common/GetFile.do').attr("method", "post");
			let input = $('<input>').attr('type', 'hidden').attr('name', 'path').attr('value', path);
			input.appendTo(form);
		    form.appendTo('body').submit().remove();
		}
		downloadFile(param){
			Zeus.downloadFile(param);
		}
		/* param:
		 * {
		 * 	action: the url for request file,
		 * 	attrList: [{name: attribute name, value: attributeValue}..] attributes needed for downloading
		 * 	method: get, post... optional
		 * }
		 */
		static downloadFile(param){
			let form = document.createElement('form');
			form.setAttribute('action', param.action);
			form.setAttribute('method', param.method == null? 'post': param.method);
			
			let input, attr;
			
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
		}
		urlHref(item){
			Zeus.urlHref(item);
		}
		static urlHref(item){
			document.location.href = item.getAttribute('data-url');
		}
		setFormAction(item, formId){
			Zeus.setFormAction(item, formId);
		}
		static setFormAction(item, formId){
			let action = item.getAttribute('data-url');
			document.querySelector(`#${formId}`).action = action;
		}
		initVariables(){
			Zeus.initVariables();
		}
		static initVariables(){
			modalImg = $('#modal-img');
			divHddFile = $('#div-hdd-file');
			hddOperation = $('[name="operation"]');
			hddAttr = $('[name="attr"]');
			menuForm = $('#menuForm');
			menuIdHidden = $('#menuIdHidden');
		}
		addClass(el, newClass){
			Zeus.addClass(el, newClass);
		}
		static addClass(el, newClass){
			
			if(newClass && newClass.trim() !== ''){
				let originClass = el.getAttribute('class');
				
				if(!originClass || originClass.trim() === ''){
					el.setAttribute('class', newClass);
				}else if(originClass.indexOf(newClass) < 0){
					el.setAttribute('class', [originClass, newClass].join(' '));
				}
			}
		}
		removeClass(el, targetClass){
			Zeus.removeClass(el, targetClass);
		}
		static removeClass(el, targetClass){
			let elClass = el.getAttribute('class');
			
			if(elClass && elClass.trim() !== ''){
				
				if(elClass.indexOf(' ' + targetClass) >= 0){
					el.setAttribute('class', elClass.replace(' ' + targetClass, ''));
				}else if(elClass.indexOf(targetClass) >= 0){
					el.setAttribute('class', elClass.replace(targetClass, ''));
				}
			}
		}
		display(el, isDisplay){
			Zeus.display(el, isDisplay);
		}
		static display(el, isDisplay){
			isDisplay? this.showElement(el): this.hideElement(el);
		}
		static onYearInput(){
			let val = this.value.trim();
			
			if(val !== ''){
				val = val.replace(/\D/g, '');
				val = val.replace(/^0+/, '');
				
				if(val.length > 4){
					val = val.slice(0, 4);
				}
			}
			this.value = val;
		}
		static onMonthInput(){
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
		}
		static onDayInput(){
			let val = this.value.trim();
			
			if(val !== ''){
				val = val.replace(/\D/g, '');
				val = val.replace(/^0+/, '');
				
				if(val.length > 2){
					val = val.slice(0, 2);
				}
			}
			this.value = val === ''? 1: val;
		}
		static onNumberInput(){
			this.value = this.value.trim().replace(/\D/g, '');
		}
		static onblurN3P2(){
			this.value = this.value.match(/^(0|[1-9]\d{0,2})(\.\d{1,2})?/g);
		}
		static onblurN1P2(){
			this.value = this.value.match(/^\d(\.\d{1,2})?/g);
		}
		static onblurInteger(){
			this.value = this.value.match(/^-?[1-9]\d*|0$/g);
		}
		createElement(elName, options){
			return Zeus.createElement(elName, options);
		}
		static createElement(elName, options){
			let el = document.createElement(elName);
			
			if(options){
				
				if(options.type){
					el.type = options.type;
				}
				
				if(options.id){
					el.id = options.id;
				}
				
				if(options.name){
					el.name = options.name;
				}
				
				if(options.value){
					el.value = options.value;
				}
				
				if(options.styleClass){
					el.setAttribute('class', options.styleClass);
				}
				
				if(options.maxLength){
					el.maxLength = options.maxLength;
				}
				
				if(options.innerText){
					el.innerText = options.innerText;
				}
				
				if(options.href){
					el.href = options.href;
				}
				
				if(options.data){
					
					for(let key in options.data){
						el.setAttribute(`data-${key}`, options.data[key]);
					}
				}
			}
			return el;
		}
		getNextElement(element, tagName){
			return Zeus.getNextElement(element, tagName);
		}
		static getNextElement(element, tagName){
			let next = element;
			
			while(true){
				next = next.nextElementSibling;
				
				if(!next){
					break;
				}else if(!tagName || next.tagName === tagName){
					return next;
				}
			}
			return null;
		}
	}
}

if(typeof window.ZeusStringUtils === 'undefined'){
	window.ZeusStringUtils = class {
		constructor(){
		}
		trim(val){
			if(val != null){
				return val.trim();
			}
			return null;
		}
		isEmpty(val){
			if(val == null){
				return true;
			}
			if(val.trim() === ''){
				return true;
			}
			return false;
		}
		replaceAll(str, strOld, strNew){
			let reg = new RegExp(strOld, 'g');
			if(str != null && strOld != null && strNew != null){
				return str.replace(reg, strNew);
			}
			return str;
		}
	}
}

if(typeof window.ZeusNumberUtils === 'undefined'){
	window.ZeusNumberUtils = class {
		constructor(){
		}
		toThousands(num) {
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
	}
}

window.util_zeus = {
	fmt: new Fmt()
};

var modalImg;
var divHddFile;
var hddOperation;
var hddAttr;

var menuForm = $('#menuForm');
var menuIdHidden = $('#menuIdHidden');

var datePickerOptions = {
	language: 'ja',
	format: 'yyyy-mm-dd',
	minView: 2,
	autoclose: true,
	todayBtn: 'linked',
	todayHighlight: true,
	pickerPosition: 'top-right'
};

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
		serverStatusApi.setSyncCheckStatus(this.checked? 1: 0)
		.then(resp => console.info(resp))
		.catch(error => console.error(error));
		
		isCheck = this.checked;
		checkStatus();
	}
	
	function checkStatus(){
		
		if(isCheck){
			serverStatusApi.getStatus()
			.then(resp => {
				iStatus.setAttribute('class', statusClass.getClass(resp.result));
				checkStatus();
			})
			.catch(error => {
				console.error(error);
				iStatus.setAttribute('class', statusClass.getClass('def'));
				checkStatus();
			})
		}else{
			iStatus.setAttribute('class', statusClass.getClass('def'));
		}
	}
	if(isCheck){
		checkStatus();
	}
}

/**
 * zeuschartの実行環境を取得する
 */
async function checkZeuschartEnv(){
	let resp;
	try{
		resp = await RestApi.get(ApiPaths.createZeuschart('runmode'));
	}catch(error){
		return;
	}
	if(resp.data === '開発'){
		Zeus.showElement(document.querySelector('#zcEnv'));
	}
}

//-> for server sync check component
if(typeof zeusStore != 'undefined' && zeusStore.serverSync.hasComponent){
	new SyncServerChecker();
}
//<- for server sync check component
//<- check sync server status component

window.STORE_KEY = {
	bootstrapTable: {
		language: 'bootstrapTableLanguage'
	}
};

window.zeusStringUtils = new ZeusStringUtils();
window.zeusNumberUtils = new ZeusNumberUtils();
window.popupMessage = new Modal('modal-msg');
window.zeus = new Zeus();
checkZeuschartEnv();

sessionStorage.setItem(STORE_KEY.bootstrapTable.language, Zeus.getBootstrapTableLocale(sessionStorage.getItem('sysLanguage')));