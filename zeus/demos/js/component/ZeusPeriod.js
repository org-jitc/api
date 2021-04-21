function ZeusPeriod(config){
	if(config.dateinput != null){
		config.dateinput.period = this;
		this.dateinput = new ZeusDateInput(config.dateinput);
	}
	if(config.datepicker != null){
		config.datepicker.period = this;
		this.datepicker = new ZeusDatePicker(config.datepicker);
		this.datepicker.update(this.dateinput == null? moment().toDate(): this.dateinput.getDate());
	}
	if(config.arrow != null){
		this.arrow = {};
		if(config.arrow.left != null){
			this.arrow.left = document.querySelector('#' + config.arrow.left);
			if(config.arrow.onClick != null){
				this.arrow.left.onclick = config.arrow.onClick.bind(this.arrow.left, this);
			}
		}
		if(config.arrow.right != null){
			this.arrow.right = document.querySelector('#' + config.arrow.right);
			if(config.arrow.onClick != null){
				this.arrow.right.onclick = config.arrow.onClick.bind(this.arrow.right, this);
			}
		}
	}
}