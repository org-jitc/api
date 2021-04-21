function ZeusIpAddress(config){
	this.root = null;
	if(config.root){
		this.root = document.querySelector('[data-root="' + config.root + '"]');
	}
	this.error = this.root? this.root.querySelector('.ip-error'): null;
	this.ips = this.root? this.root.querySelectorAll('.ip-address'): null;
	this.port = this.root? this.root.querySelector('.ip-port'): null;
	this.fullAddress = null;
	if(config.fullAddressName){
		this.fullAddress = this.root? this.root.querySelector('[name="' + config.fullAddressName + '"]'): null;
	}
	// events
	if(this.ips.length > 0){
		
		for(let i = 0, l = this.ips.length; i < l; i++){
			this.ips[i].onkeyup = this.onipkeyup;
		}
	}
	if(this.port){
		this.port.onkeyup = zeus.onportkeyup;
	}
}
ZeusIpAddress.prototype = {
	// events
	onipkeyup: function(){
		let value = this.value.trim().replace(/\D/g, '');
		
		if(value !== ''){
			
			if(value < 0){
				this.value = 0;
			}else if(value > 255){
				this.value = 255;
			}else{
				this.value = value;
			}
		}else{
			this.value = value;
		}
	},
	onportkeyup: function(){
		let value = this.value.trim().replace(/\D/g, '');
		
		if(value !== ''){
			
			if(value < 0){
				this.value = 0;
			}else if(value > 65535){
				this.value = 65535;
			}else{
				this.value = value;
			}
		}else{
			this.value = value;
		}
	},
	// methods
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
		
		for(let i = 0, l = this.ips.length; i < l; i++){
			
			if(this.ips[i].value.trim() === ''){
				return true;
			}
		}
		return false;
	},
	clear: function(){
		
		if(this.ips.length > 0){
			
			for(let i = 0, l = this.ips.length; i < l; i++){
				this.ips[i].value = '';
			}
		}
		
		if(this.port){
			this.port.value = '';
		}
	},
	getFullAddress: function(){
		let addr;
		let arrIp = [];
		
		if(this.ips.length > 0){
			
			for(let i = 0, l = this.ips.length; i < l; i++){
				arrIp.push(this.ips[i].value.trim());
			}
			addr = arrIp.join('.');
		}
		
		if(this.port){
			addr = addr? addr + ':' + this.port.value.trim() : this.port.value.trim();
		}
		return addr;
	},
	setFullAddress: function(){
		
		if(this.fullAddress){
			this.fullAddress.value = this.fullAddress();
		}
	}
};