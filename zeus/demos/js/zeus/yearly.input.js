function ComponentYearlyDailySpan(){
	this.root = document.querySelector('#cp-yearly-daily-span');
	this.select = this.root.querySelector('#select');
	this.btnAdd = this.root.querySelector('#btn-add');
	this.areaDailySpan = this.root.querySelector('#area-daily-span');
	
	this.data = {
		arrDailySpan: []
	};
	// bind events
	this.btnAdd.onclick = this.onBtnAddClick.bind(this);
}
ComponentYearlyDailySpan.prototype = {
	// events
	onBtnAddClick: function(){
	
		if(this.select.value === ''){
			popupError.setMessage('デイリースパンを選択してください。');
		}else if(this.data.arrDailySpan.indexOf(this.select.value) >= 0){
			popupError.setMessage('既に追加されています。');
		}else{
			this.btnAdd.disabled = true;
			let arrDailySpan = this.data.arrDailySpan.slice();
			arrDailySpan.push(this.select.value);
			
			$.ajax({
				url: contextPath + 'Rest/Yearly/EditDailySpan.action',
				method: 'POST',
				traditional: true,
				async: true,
				cache: false,
				yearlyDailySpan: this,
				dailySpan: this.select.value,
				data: {
					dailySpanInfor: arrDailySpan
				}
			})
			.done(function(resp, status, jqxhr){
				let objResp = JSON.parse(resp);
				
				if(objResp.result === 'ng'){
					popupError.setMessage('エラーが発生しました。');
				}else{
					this.yearlyDailySpan.data.arrDailySpan.push(this.dailySpan);
					this.yearlyDailySpan.renderArea(objResp.data);
				}
				this.yearlyDailySpan.btnAdd.disabled = false;
			})
			.fail(function(jqxhr, status, error){
				popupError.setMessage('エラーが発生しました。');
				this.yearlyDailySpan.btnAdd.disabled = false;
			});
		}
	},
	onNoControlChange: function(){
		let index = this.getAttribute('data-index');
		let hidden = document.querySelector('#arr-yearly-daily-span-' + index);
		hidden.value = this.value;
	},
	onBtnDeleteClick: function(index){
		let hidden = document.querySelector('#arr-yearly-daily-span-' + index);
		let data = this.data.arrDailySpan.slice();
		data.splice(data.indexOf(hidden.value), 1);
		
		$.ajax({
			url: contextPath + 'Rest/Yearly/EditDailySpan.action',
			method: 'POST',
			traditional: true,
			async: true,
			cache: false,
			yearlyDailySpan: this,
			dailySpan: hidden.value,
			data: {
				dailySpanInfor: data
			}
		})
		.done(function(resp, status, jqxhr){
			let objResp = JSON.parse(resp);
			
			if(objResp.result === 'ng'){
				popupError.setMessage('エラーが発生しました。');
			}else{
				this.yearlyDailySpan.data.arrDailySpan.splice(this.yearlyDailySpan.data.arrDailySpan.indexOf(this.dailySpan), 1);
				this.yearlyDailySpan.renderArea(objResp.data);
			}
		})
		.fail(function(jqxhr, status, error){
			popupError.setMessage('エラーが発生しました。');
		});
	},
	// methods
	renderArea: function(arrYearlyDailySpan){
		this.areaDailySpan.innerHTML = '';
		
		let arrSetting;
		let row, col, select, option, label, button;
		let hiddenYearlyDailySpan;
		//- container
		let container = document.createElement('div');
		container.setAttribute('class', 'container');
		// hiddens and rows
		for(let i = 0, l = arrYearlyDailySpan.length; i < l; i++){
			arrSetting = arrYearlyDailySpan[i].split('-');
			//-- hidden
			hiddenYearlyDailySpan = document.createElement('input');
			hiddenYearlyDailySpan.type = 'hidden';
			hiddenYearlyDailySpan.id = 'arr-yearly-daily-span-' + i;
			hiddenYearlyDailySpan.name = 'dailySpanInfor';
			hiddenYearlyDailySpan.value = arrYearlyDailySpan[i];
			container.appendChild(hiddenYearlyDailySpan);
			//-- row
			row = document.createElement('div');
			row.setAttribute('class', 'row align-items-center');
			//--- col date
			col = document.createElement('div');
			col.setAttribute('class', 'col-3 p-0');
			col.innerText = arrSetting[0].substring(0, 2) + '/' + arrSetting[0].substring(2, 4) + ' - ' + arrSetting[1].substring(0, 2) + '/' + arrSetting[1].substring(2, 4);
			row.appendChild(col);
			//--- col daily span name
			col = document.createElement('div');
			col.setAttribute('class', 'col p-0 d-flex justify-content-between align-items-center');
			//---- name or select
			if(arrSetting.length === 3){
				select = document.createElement('select');
				select.setAttribute('class', 'custom-select');
				select.setAttribute('data-index', i);
				// option on
				option = document.createElement('option');
				option.value = arrSetting[0] + '-' + arrSetting[1] + '-' + '9999999999999999';
				option.text = 'ON';
				option.selected = arrSetting[2] === '9999999999999999';
				select.appendChild(option);
				// option off
				option = document.createElement('option');
				option.value = arrSetting[0] + '-' + arrSetting[1] + '-' + '0000000000000000';
				option.text = 'OFF';
				option.selected = arrSetting[2] === '0000000000000000';
				select.appendChild(option);
				// bind event
				select.onchange = this.onNoControlChange;
				col.appendChild(select);
			}else{
				label = document.createElement('label');
				label.innerText = arrSetting[3];
				col.appendChild(label);
				//---- delete button
				button = document.createElement('button');
				button.type = 'button';
				button.setAttribute('class', 'btn button-zeus m-0');
				button.innerText = '削除';
				button.onclick = this.onBtnDeleteClick.bind(this, i);
				col.appendChild(button);
			}
			row.appendChild(col);
			container.appendChild(row);
		}
		this.areaDailySpan.appendChild(container);
	}
};

function Yearly(){
	this.divErrors = {
		all: document.querySelector('#error-all'),
		yearlyName: document.querySelector('#error-yearlyName'),
		dailySpanInfor: document.querySelector('#error-dailySpanInfor')
	};
	this.cpYearlyDailySpan = new ComponentYearlyDailySpan();
	this.btnConfirm = document.querySelector('#btn-confirm');
	// bind events
	this.btnConfirm.onclick = this.onBtnConfirmClick.bind(this);
	// initialization
	this.cpYearlyDailySpan.renderArea(req.arrYearlyDailySpan);
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
		
			if(this.divErrors[key]){
				this.divErrors[key].innerText = '';
			}
		}
	},
	setErrors: function(errors){
		
		for(let key in errors){
			this.divErrors[key].innerText = errors[key];
		}
	},
	validate: function(){
		$.ajax({
			url: contextPath + 'Rest/Yearly/Validate.action',
			async: true,
			cache: false,
			method: 'POST',
			data: $(document.forms[formAttr.id]).serialize(),
			yearly: this
		})
		.done(function(resp, status, jqxhr){
			let objResp = JSON.parse(resp);
			
			if(objResp.result === 'ng'){
				this.yearly.setErrors(objResp.error);
				this.yearly.btnConfirm.disabled = false;
			}else{
				document.forms[formAttr.id].action = formAttr.action.confirm;
				document.forms[formAttr.id].submit();
			}
		})
		.fail(function(jqxhr, status, error){
			console.log(error);
			popupError.setMessage('エラーが発生しました。');
			this.yearly.btnConfirm.disabled = false;
		});
	}
}

function addSelectBox(optionvalue){
	
	if(optionvalue === ''){
		return;
	}
	document.forms[formAttr.id].action = formAttr.action.addSelect;
	document.forms[formAttr.id].submit();
}
// initialization
new Yearly();