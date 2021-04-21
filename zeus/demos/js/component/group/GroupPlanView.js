function GroupPlanView(config){
	this.suffix = config.suffix;
	this.modalImgUpload = config.modalImgUpload;
	this.modalImgShow = config.modalImgShow;
	
	this.divBtnAdd = document.querySelector('#div-btn-add-' + config.suffix);
	this.btnAdd = document.querySelector('#btn-img-add-' + config.suffix);
	this.divLink = document.querySelector('#div-link-img-' + config.suffix);
	this.link = document.querySelector('#link-img-' + config.suffix);
	this.btnDel = document.querySelector('#btn-img-del-' + config.suffix);
	
	this.btnAdd.onclick = this.onBtnAddClick.bind(this);
	this.link.onclick = this.onImgClick.bind(this);
	this.btnDel.onclick = this.onBtnDelClick.bind(this);
}
GroupPlanView.prototype = {
	// events
	onBtnAddClick: function(){
		this.modalImgUpload.attr.value = this.suffix;
		this.modalImgUpload.parent = this;
		this.modalImgUpload.show();
	},
	onImgClick: function(){
		this.modalImgShow.show(this.link.getAttribute('data-src'));
	},
	onBtnDelClick: function(){
		$(this.btnDel).button('loading');
		$.ajax({
			url: contextPath + 'Rest/TempImg/Delete.action',
			method: 'POST',
			async: true,
			cache: false,
			planView: this,
			data: {
				menu: this.modalImgUpload.menu.value,
				attr: this.suffix
			}
		})
		.done(function(resp, status, jqxhr){
			let objResp = JSON.parse(resp);
			
			if(objResp.result === 'ok'){
				zeus.hideElement(this.planView.divLink);
				zeus.showElement(this.planView.divBtnAdd);
			}
			$(this.planView.btnDel).button('reset');
		})
		.fail(function(jqxhr, status, error){
			console.log(error);
			popupError.setMessage('エラーが発生しました。');
			$(this.planView.btnDel).button('reset');
		});
	},
	onUploadSuccess: function(objResp){
		
		if (objResp.result === 'ok') {
			this.modalImgUpload.hide();
			zeus.showElement(this.divLink);
			zeus.hideElement(this.divBtnAdd);
			
			this.link.setAttribute('data-src', objResp.success.path);
			this.link.innerText = objResp.success.fileName;
		}
	}
	// methods
};