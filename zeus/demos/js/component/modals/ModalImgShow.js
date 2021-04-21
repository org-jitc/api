function ModalImgShow(){
	this.modal = document.querySelector('#modal-img-show');
	this.img = document.querySelector('#mis-img');
}
ModalImgShow.prototype = {
	// events
	// methods
	show: function(src){
		this.img.src = src;
		$(this.modal).modal('show');
	}
};
let modalImgShow = new ModalImgShow();