function Yearly(){
	this.divErrors = {
		noControSelect: document.querySelector('#error-noControSelect')
	};
	this.btnConfirm = document.querySelector('#btn-confirm');
	// bind events
	this.btnConfirm.onclick = this.onBtnConfirmClick.bind(this);
}
Yearly.prototype = {
	// events
	onBtnConfirmClick: function(){
		this.clearErrors();
		this.btnConfirm.disabled = true;
		this.validate();
	},
	// methods
	clearErrors: function(){
		
		for(let key in this.divErrors){
			this.divErrors[key].innerText = '';
		}
	},
	setErrors: function(errors){
		
		for(let key in errors){
			this.divErrors[key].innerText = errors[key];
		}
	},
	validate: function(){
		$.ajax({
			url: contextPath + 'Rest/Yearly/Validate2.action',
			async: true,
			cache: false,
			method: 'POST',
			data: $(document.forms.formRegisterInput2).serialize(),
			yearly: this
		})
		.done(function(resp, status, jqxhr){
			let objResp = JSON.parse(resp);
			
			if(objResp.result === 'ng'){
				this.yearly.setErrors(objResp.error);
				this.yearly.btnConfirm.disabled = false;
			}else{
				document.forms.formRegisterInput2.action = 'RegisterConfirm2.action';
				document.forms.formRegisterInput2.submit();
			}
		})
		.fail(function(jqxhr, status, error){
			console.log(error);
			popupError.setMessage('エラーが発生しました。');
			this.yearly.btnConfirm.disabled = false;
		});
	}
}
// initialization
new Yearly();