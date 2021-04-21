function ZeusSettingImport(){
	this.form = document.querySelector('#form-settingInfoImport');
	this.error = document.querySelector('#div-error-settingInfoImport');
	this.modal = document.querySelector('#modal-settingInfoImport');
	this.file = document.querySelector('#file-settingInfoImport');
	this.btnImport = document.querySelector('#btn-settingImport');
	this.btnStart = document.querySelector('#btn-settingInfoUpload');
	
	this.btnImport.onclick = this.onBtnImportClick.bind(this);
	this.btnStart.onclick = this.onBtnStartClick.bind(this);
}
ZeusSettingImport.prototype = {
	// events
	onBtnImportClick: function(){
		this.error.innerHTML = '';
		this.file.value = '';
		$(this.modal).modal('show');
	},
	onBtnStartClick: function(){
		let isValid = this.validateFile();
		if(isValid){
			let formData = new FormData(this.form);
			$.ajax({
                url: contextPath + this.action,
                type: 'POST',
                async: true,
                cache: false,
                data: formData,
                processData: false,
                contentType: false,
                settingImport: this
            })
            .done(function(resp, textStatus, jqXHR) {
            	let objResp = JSON.parse(resp);
            	$(this.settingImport.modal).modal('hide');
            	if(objResp.result === 'ok'){
            		popupMessage.setMessage('データの入力が完了しました。');
            	}else{
            		popupError.setMessage(objResp.error.message);
            	}
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
            	$(this.settingImport.modal).modal('hide');
            	popupError.setMessage('エラーが発生しました。');
            });
		}
	},
	// methods
	settingImport: function(action){
		this.action = action;
	},
	validateFile: function(){
		let isEmpty = zeusStringUtils.isEmpty(this.file.value);
		this.error.innerHTML = isEmpty? 'CSVファイルを選択してください。': ''; 
		return !isEmpty;
	}
};

function ZeusSettingExport(){
	this.btnExport = document.querySelector('#btn-settingExport');
	
	this.btnExport.onclick = this.onBtnExportClick.bind(this);
}
ZeusSettingExport.prototype = {
	// events
	onBtnExportClick: function(){
		zeus.downloadFile({
			action: contextPath + this.action,
			method: 'GET',
			attrList: []
		});
	},
	// methods
	settingExport: function(action){
		this.action = action;
	}
}

let zeusSettingImport = new ZeusSettingImport();
let zeusSettingExport = new ZeusSettingExport();