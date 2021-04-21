function ModalImgUpload(config){
	this.action = config.action;
	this.modal = document.querySelector('#modal-img-upload');
	this.form = document.querySelector('#miu-form');
	this.error = document.querySelector('#miu-div-error');
	this.menu = document.querySelector('#miu-menu');
	this.attr = document.querySelector('#miu-attr');
	this.file = document.querySelector('#miu-file');
	this.btnUpload = document.querySelector('#miu-btn-upload');
	
	this.btnUpload.onclick = this.onBtnUploadClick.bind(this);
	
	if(config.menu != null){
		this.menu.value = config.menu;
	}
}
ModalImgUpload.prototype = {
	// events
	onBtnUploadClick: function(){
		
		if(this.validateFile()){
			$(this.btnUpload).button('loading');
			$.ajax({
				url: contextPath + this.action,
				method: 'POST',
				async: true,
				cache: false,
				processData: false,
				contentType: false,
				modalImgUpload: this,
				data: new FormData(this.form)
			})
			.done(function(resp, textStatus, jqXHR){
				let objResp = JSON.parse(resp);
				this.modalImgUpload.parent.onUploadSuccess(objResp);
				$(this.modalImgUpload.btnUpload).button('reset');
			})
			.fail(function(jqXHR, textStatus, errorThrown){
				console.log(errorThrown);
				this.modalImgUpload.error.innerHTML = 'エラーが発生しました。';
				$(this.modalImgUpload.btnUpload).button('reset');
			});
		}
	},
	// methods
	validateFile: function(){
		
		if(zeusStringUtils.isEmpty(this.file.value)){
			this.error.innerHTML = 'ファイルを選択してください。';
			return false;
		}
		this.error.innerHTML = '';
		return true;
	},
	show: function(){
		this.error.innerHTML = '';
		this.file.value = '';
		$(this.modal).modal('show');
	},
	hide: function(){
		$(this.modal).modal('hide');
	}
};