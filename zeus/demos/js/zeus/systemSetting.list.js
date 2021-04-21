//-> synchronization checking time input and buttons
function SyncCheckTime(){
	let _this = this;
	_this.dom = document.querySelector('#syncCheckTime');
	let currDom = document.querySelector('#currSyncCheckTime');
	let errDom = document.querySelector('#errSyncCheckTime');
	let setBtn = document.querySelector('#btnSetSyncCheckTime');
	let current = null;
	
	if(setBtn != null){
		setBtn.onclick = function(){
			errDom.innerText = '';
			let isValid = true;
			let val = _this.dom.value.trim();
			//-> check length
			if(val == ''){
				val = 5;
			}
			//-> check number
			if(isValid){
				if(isNaN(val)){
					isValid = false;
					errDom.innerText = '半角数字を入力してください。';
				}
			}
			//-> value >= 5
			if(isValid){
				if(val < 5){
					isValid = false;
					errDom.innerText = '最小値は5です。';
				}
			}
			//-> check if same
			if(isValid){
				if(current == val) isValid = false;
			}
			if(isValid){
				setBtn.disabled = true;
				$.ajax({
					url: contextPath + 'Rest/SystemSetting/UpdateSyncCheckTime.action',
					async: true,
					cache: false,
					method: 'POST',
					data: {syncCheckTime: val},
					success: function(resp){
						currDom.innerText = val;
						current = val;
						setBtn.disabled = false;
					},
					error: function(){
						errDom.innerText = '設定できませんでした。';
						setBtn.disabled = false;
					}
				});
			}
		};
	}
	
	this.getSyncCheckTime = function(){
		errDom.innerText = '';
		$.ajax({
			url: contextPath + 'Rest/SystemSetting/GetSyncCheckTime.action',
			async: true,
			cache: false,
			method: 'POST',
			success: function(resp){
				let respObj = JSON.parse(resp);
				if(respObj.syncCheckTime != null){
					_this.dom.disabled = false;
					setBtn.disabled = false;
					currDom.innerText = respObj.syncCheckTime;
					current = respObj.syncCheckTime;
				}else{
					_this.dom.disabled = true;
					setBtn.disabled = true;
					currDom.innerText = '';
					errDom.innerText = '同期サーバー接続確認時間を取得できませんでした。';
				}
			},
			error: function(){
				_this.dom.disabled = true;
				setBtn.disabled = false;
				currDom.innerText = '';
				errDom.innerText = '同期サーバー接続確認時間を取得できませんでした。';
			}
		});
	};
}

//-> server type setting selection
function ServerType(){
	let slt = document.querySelector('[name="serverType"]');
	if(slt != null){
		let current = slt.value;
		slt.onchange = function(){
			this.disabled = true;
			$.ajax({
				url: contextPath + 'Rest/SystemSetting/UpdateColumnOne.action',
				async: true,
				cache: false,
				data: {column: 'server_type', dataType: 'string', dataValue: this.value, syncType: 'single'},
				success: function(resp){
					let respObj = JSON.parse(resp);
					if(respObj.result === 'ng'){
						popupError.setMessage(respObj.error.message);
						slt.value = current;
					}else{
						current = slt.value;
						let href = contextPath + 'User/Logout.do';
						popupMessage.setMessage('変更されました。<br><a href="' + href + '">再ログイン</a>してください。');
					}
					slt.disabled = false;
				},
				error: function(){
					popupError.setMessage('エラーが発生しました。');
					slt.value = current;
					slt.disabled = false;
				}
			});
		}
	}
}

//-> data synchronization setting radio
function DataSyncRadio(){
	let yRdo = document.querySelector('[name="dataSync"][value="1"]');
	let nRdo = document.querySelector('[name="dataSync"][value="0"]');
	if(yRdo != null && nRdo != null){
		let current = yRdo.checked? 1: 0;
		function onDataSyncChange(){
			yRdo.disabled = true;
			nRdo.disabled = true;
			$.ajax({
				url: contextPath + 'Rest/SystemSetting/UpdateColumnOne.action',
				async: true,
				cache: false,
				data: {column: 'data_sync', dataType: 'integer', dataValue: this.value, syncType: 'single'},
				success: function(resp){
					let respObj = JSON.parse(resp);
					if(respObj.result === 'ng'){
						popupError.setMessage(respObj.error.message);
						current == 1? yRdo.checked = true: nRdo.checked = true;
					}else{
						current = yRdo.checked? 1: 0;
						popupMessage.setMessage('変更されました。');
					}
					yRdo.disabled = false;
					nRdo.disabled = false;
				},
				error: function(){
					popupError.setMessage('エラーが発生しました。');
					current == 1? yRdo.checked = true: nRdo.checked = true;
					yRdo.disabled = false;
					nRdo.disabled = false;
				}
			});
		}
		yRdo.onchange = onDataSyncChange;
		nRdo.onchange = onDataSyncChange;
	}
}

//-> ↓ class: PlcConnectionTimeout
function PlcConnectionTimeout(){
	let _ = this;
	this.el = {
		curr: document.querySelector('#currPlcConnectionTimeout'),
		text: document.querySelector('#plcConnectionTimeout'),
		btn: {
			setValue: document.querySelector('#btnSetPlcConnectionTimeout') 
		}
	};
	this.fn = {
		check: function(){
			let val = this.val();
			//-> if the input value is '', than return true
			if(val === '') return true;
			//-> if the input value is as same as current value, return false
			if(val === this.currVal()){
				popupError.setMessage('変更されていません。');
				return false;
			}
			return true;
		},
		val: function(){
			return _.el.text.value.trim();
		},
		currVal: function(){
			return _.el.curr.innerText.trim();
		}
	}
	
	if(this.el.text != null){
		this.el.text.onkeyup = function(){
			let val = this.value.trim();
			if(val !== '') val.replace(/\D/g, '');
			this.value = val;
		};
		this.el.text.onchange = function(){
			let val = this.value;
			if(val !== ''){
				val.replace(/^0+/, '');
				if(val < 30) val = 30;
				this.value = val;
			}
		}
	}
	
	if(this.el.btn.setValue != null){
		this.el.btn.setValue.onclick = function(){
			let isValid = _.fn.check();
			if(isValid && _.fn.val() !== ''){
				_.el.btn.setValue.disabled = true;
				$.ajax({
					url: contextPath + 'Rest/SystemSetting/UpdateColumnOne.action',
					async: true,
					cache: false,
					method: 'POST',
					data: {column: 'plc_connection_timeout', dataType: 'integer', dataValue: _.fn.val(), syncType: 'single'},
					success: function(resp){
						let respObj = JSON.parse(resp);
						if(respObj.result === 'ng')
							popupError.setMessage(respObj.error.message);
						else _.el.curr.innerText = _.fn.val();
						_.el.btn.setValue.disabled = false;
					},
					error: function(){
						popupError.setMessage('エラーが発生しました。');
						_.el.btn.setValue.disabled = false;
					}
				});
			}
		};
	}
}
//-> ↑ class: PlcConnectionTimeout

//-> items only for local db
function ItemsNotSync(){
	//-> server type
	let serverType = new ServerType();
	//-> data synchronization
	let dataSyncRadio = new DataSyncRadio();
	//-> synchronization checking time
	let syncCheckTime = new SyncCheckTime();
	//-> initialize synchronization checking time
	if(syncCheckTime.dom != null) {
		syncCheckTime.getSyncCheckTime();
	}
	//<- initialize synchronization checking time
	//-> ↓ plc connection timeout instance
	let plcConnectionTimeout = new PlcConnectionTimeout();
}

function ComPermissionTimeSharing(){
	this.root = document.querySelector('[data-root="comPermissionTimeSharing"]');
	this.timeSharing = this.root.querySelector('#comPermissionTimeSharing');
	this.error = this.root.querySelector('#comPermissionTimeSharingError');
}
ComPermissionTimeSharing.prototype = {
	// methods
	value: function(){
		return this.timeSharing.value.trim();
	},
	show: function(){
		zeus.showElement(this.root);
	},
	hide: function(){
		zeus.hideElement(this.root);
	},
	showError: function(msg){
		
		if(msg){
			this.error.innerText = msg;
		}
		zeus.showElement(this.error);
	},
	hideError: function(){
		this.error.innerText = '';
		zeus.hideElement(this.error);
	},
	isEmpty: function(){
		
		if(this.timeSharing.value.trim() === ''){
			return true;
		}
		return false;
	},
	clear: function(){
		this.timeSharing.value = '';
	}
}
function ComPermissionProtocol(){
	this.root = document.querySelector('[data-root="comPermissionProtocol"]');
	this.protocol = this.root.querySelector('#comPermissionProtocol');
	this.ipAddress = new ZeusIpAddress({root: 'comPermissionIpAddress'});
	this.timeSharing = new ComPermissionTimeSharing();
	this.btnSet = this.root.querySelector('#btnSetComPermissionProtocol');
	// events
	this.protocol.onchange = this.onprotocolchange.bind(this);
	this.btnSet.onclick = this.onbtnsetclick.bind(this);
}
ComPermissionProtocol.prototype = {
	// events
	onprotocolchange: function(){
		let protocol = this.protocol.value;
		
		if(protocol === ''){
			this.ipAddress.hide();
			this.timeSharing.hide();
		}else if(protocol == 1){
			this.ipAddress.hide();
			this.timeSharing.show();
		}else if(protocol == 2){
			this.ipAddress.show();
			this.timeSharing.hide();
		}
	},
	onbtnsetclick: function(){
		this.ipAddress.hideError();
		this.timeSharing.hideError();
		let isvalid = this.validate();
		
		if(isvalid){
			this.btnSet.disabled = true;
			let protocol = this.protocol.value;
			let param = {};
			
			if(protocol == 1){
				param.comPermissionProtocol = 1;
				param.comPermissionTimeSharing = this.timeSharing.value();
			}else if(protocol == 2){
				param.comPermissionProtocol = 2;
				param.comPermissionIpAddress = this.ipAddress.getFullAddress();
			}
			$.ajax({
				url: contextPath + 'Rest/SystemSetting/UpdateComPermissionProtocol.action',
				async: true,
				cache: false,
				method: 'POST',
				data: param,
				cpp: this,
				protocol: protocol
			})
			.done(function(resp, status, jqXHR){
				let objResp = JSON.parse(resp);
				
				if(objResp.result === 'ok'){
					popupMessage.setMessage(objResp.success.message);
					
					if(this.protocol == 1){
						this.cpp.ipAddress.clear();
					}else if(this.protocol == 2){
						this.cpp.timeSharing.clear();
					}else{
						this.cpp.ipAddress.clear();
						this.cpp.timeSharing.clear();
					}
				}else if(objResp.error.message){
					popupError.setMessage(objResp.error.message);
				}else if(objResp.error.comPermissionTimeSharing){
					this.cpp.timeSharing.showError(objResp.error.comPermissionTimeSharing);
				}else if(objResp.error.comPermissionIpAddress){
					this.cpp.ipAddress.showError(objResp.error.comPermissionIpAddress);
				}
				this.cpp.btnSet.disabled = false;
			})
			.fail(function(jqXHR, status, error){
				console.log(error);
				popupError.setMessage('エラーが発生しました。');
				this.cpp.btnSet.disabled = false;
			});
		}
	},
	// methods
	validate: function(){
		let protocol = this.protocol.value;
		
		if(protocol == 1 && this.timeSharing.isEmpty()){
			this.timeSharing.showError('入力してください。');
			return false;
		}else if(protocol == 2 && this.ipAddress.isEmpty()){
			this.ipAddress.showError('入力してください。');
			return false;
		}else{
			return true;
		}
	}
};

function SystemSetting(){
	var supportedType = 'mp3, MP3';
	var msgChooseMp3File = 'mp3形式の音声ファイルを選択してください。';
	var dtsDir = '/zeus/sound/demand/';
	// demand tight sound upload button
	var btnDTSUpload = $('#btn-dts-upload');
	// demand tight sound file error message div
	var errorDTS = $('#error-dts');
	// audio tag for demand tight sound
	var audioDTS = document.querySelector('#audio-dts');
	// listen icon for demand tight sound
	var iListen = $('#i-listen');
	var spanDTSName = $('#span-dts-name');
	var classDTSDelete = $('.dts-delete');
	var btnDeleteDTS = $('#btn-delete-dts');
	//***** listen icon clicked
	iListen.click(function(){
		if(audioDTS.src == '')
			audioDTS.src = dtsDir + reqDemandTightSoundSaveName;
		audioDTS.play();
	});
	//_____ listen icon clicked
	
	//***** delete demand tight sound
	btnDeleteDTS.click(function(){
		btnDeleteDTS.button('loading');
		$.ajax({
			url: contextPath + 'Rest/SystemSetting/DemandTightSound/Delete.action',
			type: 'POST',
			async: true,
			cache: false,
			success: function(resp){
				classDTSDelete.addClass('hide');
				spanDTSName.html('-');
				btnDeleteDTS.button('reset');
			},
			error: function(){
				btnDeleteDTS.button('reset');
			}
		});		
	});
	//_____ delete demand tight sound
	
	//***** upload button click action
	btnDTSUpload.click(function(){
		errorDTS.empty();
		var fileName;
		// check if file was selected
		var isFileValid = true;
		var fileDTS = document.querySelector('#demandTightSound');
		var files = fileDTS.files;
		if(files.length == 0) isFileValid = false;
		else{
			fileName = files[0].name;
			var fileNameArr = fileName.split('.');
			if(fileNameArr.length == 1) isFileValid = false;
			else{
				var fileType = fileNameArr[fileNameArr.length - 1];
				if(supportedType.indexOf(fileType) < 0)
					isFileValid = false;
			}
		}
		if(!isFileValid){
			errorDTS.append(msgChooseMp3File);
			return;
		}
		btnDTSUpload.button('loading');
		var formData = new FormData(document.querySelector('#form-demandTightSound-upload'));
		var now = new Date();
		var timeMili = now.getTime();
		formData.append('timeMili', timeMili);
		$.ajax({
			url: contextPath + 'Rest/SystemSetting/DemandTightSound/Upload.action',
			type: 'POST',
			async: true,
			cache: false,
			data: formData,
			processData: false,
			contentType: false,
			fileName: fileName,
			saveName: timeMili + '.mp3',
			success: function(response){
				spanDTSName.html(this.fileName);
				// set new src for audio
				audioDTS.src = dtsDir + this.saveName;
				classDTSDelete.removeClass('hide')
				btnDTSUpload.button('reset');
			},
			error: function(){
				btnDTSUpload.button('reset');
			}
		});
	});
	//_____ upload button click action

	//********** init
	// show demand tight sound delete span if has sound
	if(reqDemandTightSoundName != '') {
		classDTSDelete.removeClass('hide');
	}
	//__________ init
}

let ajaxHeatingCoolingDate = function(){
	function onSet(type){
		let param = {
			heatingMonth: this.selects.month.heating.value,
			heatingDay: this.selects.day.heating.value,
			coolingMonth: this.selects.month.cooling.value,
			coolingDay: this.selects.day.cooling.value
		};
		$(this.buttons[type]).button('loading');
		zeus.ajax({
			url: contextPath + 'Rest/SystemSetting/UpdateHeatingCoolingDate.action',
			data: param,
			item: this,
			buttonType: type,
			success: function(resp){
				let objResp = JSON.parse(resp);
				if(objResp.result === 'ok'){
					this.item.update();
					popupMessage.setMessage(objResp.success.message);
				}else{
					this.item.reset();
					popupError.setMessage(objResp.error.message);
				}
				$(this.item.buttons[this.buttonType]).button('reset');
			},
			error: function(){
				this.item.reset();
				popupError.setMessage('エラーが発生しました。');
				$(this.item.buttons[this.buttonType]).button('reset');
			}
		});
	}

	this.selects = {
		month: {
			heating: document.querySelector('#monthHeating'),
			cooling: document.querySelector('#monthCooling')
		},
		day: {
			heating: document.querySelector('#dayHeating'),
			cooling: document.querySelector('#dayCooling')
		}
	};
	this.values = {
		month: {
			heating: this.selects.month.heating.value,
			cooling: this.selects.month.cooling.value
		},
		day: {
			heating: this.selects.day.heating.value,
			cooling: this.selects.day.cooling.value
		}
	};
	this.buttons = {
		heating: document.querySelector('#btn-set-heating-date'),
		cooling: document.querySelector('#btn-set-cooling-date')
	};

	this.reset = function(){
		this.selects.month.heating.value = this.values.month.heating;
		this.selects.day.heating.value = this.values.day.heating;
		this.selects.month.cooling.value = this.values.month.cooling;
		this.selects.day.cooling.value = this.values.day.cooling;
	}.bind(this);

	this.update = function(){
		this.values.month.heating = this.selects.month.heating.value;
		this.values.day.heating = this.selects.day.heating.value;
		this.values.month.cooling = this.selects.month.cooling.value;
		this.values.day.cooling = this.selects.day.cooling.value;
	}.bind(this);

	this.buttons.heating.onclick = onSet.bind(this, 'heating');
	this.buttons.cooling.onclick = onSet.bind(this, 'cooling');
}();

let ajaxYearlyDisp = function(){
	function onRadioChange(value){
		this.select.disabled = value == 0;
		if(value == 0){
			this.select.value = 1;
		}
	}

	this.name = 'yearlyDisp';
	this.radios = document.querySelectorAll('[name="yearlyDisp"]');
	this.getCheckedValue = function(){
		return document.querySelector('[name="yearlyDisp"]:checked').value;
	};
	this.select = document.querySelector('#yearlyStartMonth');
	this.values = {
		yearlyDisp: this.getCheckedValue(),
		yearlyStartMonth: this.select.value
	};
	this.button = document.querySelector('#btn-set-yearly-disp');
	this.update = function(){
		this.values.yearlyDisp = this.getCheckedValue();
		this.values.yearlyStartMonth = this.select.value;
	};
	this.reset = function(){
		let checkedItem = document.querySelector('[name="yearlyDisp"][value="' + this.values.yearlyDisp + '"]');
		checkedItem.checked = true;
		checkedItem.onchange.call();
		this.select.value = this.values.yearlyStartMonth;
	};
	

	for(let i = 0, l = this.radios.length; i < l; i++){
		this.radios[i].onchange = onRadioChange.bind(this, this.radios[i].value);
	}
	this.button.onclick = function(){
		let param = {
			yearlyDisp: this.getCheckedValue(),
			yearlyStartMonth: this.select.value 
		};
		$(this.button).button('loading');
		zeus.ajax({
			url: contextPath + 'Rest/SystemSetting/UpdateYearlyDisp.action',
			data: param,
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
				$(this.item.button).button('reset');
			},
			error: function(){
				this.item.reset();
				$(this.item.button).button('reset');
				popupError.setMessage('エラーが発生しました。');
			}
		});
	}.bind(this);
}();

let systemImportDate = function(){
	this.text = document.querySelector('#system_import_date');
	this.labelCurrent = document.querySelector('#current-system_import_date');
	this.button = document.querySelector('#btn-set-system_import_date');
	this.value = this.text.value;

	this.update = function(){
		this.labelCurrent.innerText = this.text.value;
		this.value = this.text.value;
	};
	
	this.button.onclick = function(){
		$(this.button).button('loading');
		zeus.ajax({
			url: contextPath + 'Rest/SystemSetting/UpdateColumnOne.action',
			data: {
				column: 'system_import_date',
				dataType: 'string',
				dataValue: this.text.value,
				syncType: 'sync',
				required: false
			},
			item: this,
			success: function(resp){
				let objResp = JSON.parse(resp);
				if(objResp.result === 'ok'){
					this.item.update();
					popupMessage.setMessage(objResp.success.message);
				}else{
					popupMessage.setMessage(objResp.error.message);
				}
				$(this.item.button).button('reset');
			},
			error: function(){
				$(this.item.button).button('reset');
				popupMessage.setMessage('エラーが発生しました。');
			}
		});
	}.bind(this);

	$(this.text).datepicker({
		format: 'yyyy-mm-dd',
		todayBtn: 'linked',
		language: sessionStorage.getItem('sysLanguage'),
		autoclose: true,
		todayHighlight: true
	});
}();

let itemsNotSync = new ItemsNotSync();
let sysSetting = new SystemSetting();
new ComPermissionProtocol();
new AjaxUpdateItems({
	url: contextPath + 'Rest/SystemSetting/UpdateColumnOne.action'
});

function InitialDataClear(){
	this.textDateFrom = document.querySelector('#data-clear-date-from');
	this.textDateTo = document.querySelector('#data-clear-date-to');
	this.containerDateRange = document.querySelector('.input-daterange');
	this.btnDataClear = document.querySelector('#btn-data-clear');
	
	// binding events
	this.btnDataClear.onclick = this.onDataClearClick.bind(this);
	
	$(this.containerDateRange).datepicker({
		format: 'yyyy-mm-dd',
		todayBtn: 'linked',
		language: sessionStorage.getItem('sysLanguage'),
		autoclose: true,
		todayHighlight: true
	});
}
InitialDataClear.prototype = {
	// events
	onDataClearClick: function(){
		if(this.isDateValid()){
			popupError.clear();
			popupError.appendMessage('期間を入力してください。');
			popupError.appendMessage('終了期間は必須です。');
			popupError.show();
		}else{
			$(this.btnDataClear).button('loading');
			
			setTimeout(this.onDataClearSuccess.bind(this), 3000);
		}
	},
	onDataClearSuccess: function(){
		$(this.btnDataClear).button('reset');
		
		popupMessage.setMessage('データがクリアされました。');
	},
	// methods
	isDateValid: function(){
		return this.textDateTo.value.trim() === '';
	}
}
let initialDataClear = new InitialDataClear();