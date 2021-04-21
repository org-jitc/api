function Input(){
	
	let formInput = $('#form-input');
	this.connectionMode = {
		_: document.querySelectorAll('[name="connectionMode"]'),
		name: document.querySelector('[name="connectionModeName"]'),
		setCheckedName: function(){
			this.name.value = this._[0].checked? this._[0].nextElementSibling.innerText.trim(): this._[1].nextElementSibling.innerText.trim();
		}
	};
	let hiddenIpAddress = $('[name="ipAddress"]');
	let hiddenProtocolName = $('[name="protocolName"]');
	let textIpaddr01 = $('[name="ipaddr01"]');
	let textIpaddr02 = $('[name="ipaddr02"]');
	let textIpaddr03 = $('[name="ipaddr03"]');
	let textIpaddr04 = $('[name="ipaddr04"]');
	let textPortNumber = $('[name="portNumber"]');
	let selectProtocol = $('[name="protocol"]');
	let groupObj = {
		select: $('[name="groupId"]'),
		hddName: $('[name="groupName"]'),
		setSelectedName: function(){
			var filtered = this.select.find('option:selected');
			var val = filtered.val();
			this.hddName.val(val == ''? val: filtered.text());
		}
	};
	
	let validator = {
		inputName: {
			elErr: document.querySelector('#errInputName'),
			errMsg: {
				get required(){
					return util_zeus.fmt.getReplaced(fmt.err.required, [fmt.input.name]);
				},
				get duplicated(){
					return fmt.err.exist;
				}
			},
			validate: function(){
				validator.inputName.elErr.innerHTML = '';
				let data = document.inputFormBean.inputName.value.trim();
				//> ↓ check required
				if(data === ''){
					validator.inputName.elErr.innerText = validator.inputName.errMsg.required;
					return false;
				//> ↓ check duplicate
				} else {
					let inputIdInMap = zeus.json.searchKey(INPUT_MAP_ALL, data);
					if(inputIdInMap !== null){
						let elInputId = document.inputFormBean.inputId;
						let updateInputId = elInputId == null? null: elInputId.value;
						//> update page && same input id -> true
						//> else -> false
						if(updateInputId === null || updateInputId !== inputIdInMap){
							validator.inputName.elErr.innerText = validator.inputName.errMsg.duplicated;
							return false;
						}
					}
				}
				return true;
			}
		},
		validate: function(){
			
			let valid = this.inputName.validate();
			
			return valid;
		}
	};
	
	//***** trim text value before submit form
	document.inputFormBean.onsubmit = function(ev){
		let isValid = validator.validate();
		if(isValid){
			// set ip address
			var textInput = $(this).find('[type="text"]').not(':disabled');
			var textInputLen = textInput.length;
			var item;
			for(var i = 0; i < textInputLen; i++){
				
				item = $(textInput[i]);
				item.val($.trim(item.val()));
			}
			hiddenIpAddress.val(textIpaddr01.val() + '.' + textIpaddr02.val() + '.' + textIpaddr03.val() + '.' + textIpaddr04.val() + ':' + textPortNumber.val());
			// set group name
			groupObj.setSelectedName();
			input.connectionMode.setCheckedName();
		}else{
			ev = ev || window.event;
		    if(ev.preventDefault) ev.preventDefault();
		    else window.event.returnValue = false;
		}
	};
	//_____ trim text value before submit form
	
	selectProtocol.change(function(){
		hiddenProtocolName.val($(this).find('option:selected').text());
	});
}

let input = new Input();