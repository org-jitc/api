function ModalConfirmDelete(){
	this.modal = document.querySelector('#modal-confirm-delete');
	this.btnDel = document.querySelector('#mcd-btn-delete');
	
	this.btnDel.onclick = this.onBtnDelClick.bind(this);
}
ModalConfirmDelete.prototype = {
	// events
	onBtnDelClick: function(){
		this.btnDel.disabled = true;
		document.location.href = this.href;
	},
	// methods
	show: function(href){
		this.href = href;
		$(this.modal).modal('show');
	}
};