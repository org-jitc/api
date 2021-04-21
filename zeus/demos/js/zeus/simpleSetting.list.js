function controlModeFormatter(value, row, index, field){
	if(value == 0){
		
		if(row.temperatureControlMode != 5){
			return fmt.controlModeCooling;
		}else{
			return fmt.controlModeLowerLimitOver;
		}
	}else if(value == 1){
		
		if(row.temperatureControlMode != 5){
			return fmt.controlModeHeating;
		}else{
			return fmt.controlModeUpperLimitOver;
		}
	}else{
		return fmt.controlModeAuto;
	}
}

function temperatureControlModeFormatter(value, row, index, field){
	
	if(value == 1){
		return fmt.temperatureControlModeZone;
	}else if(value == 2){
		return fmt.temperatureControlModeTempThreshold;
	}else if(value == 4){
		return fmt.temperatureControlModeDiThreshold;
	}else if(value == 5){
		return fmt.temperatureControlModeCo2;
	}
	return value;
}

function validateSecond(val){
	
	if(zeusStringUtils.isEmpty(val)){
		return '必須です。';
	}else{
		
		if(isNaN(val)){
			return '数字を入力してください。';
		}
	}
}

function isValidTemp(value){
	if(isNaN(value)){
		return false;
	}
	let afterDPLength = 0;
	let dpIndex = value.indexOf('.');
	if(dpIndex > -1){
		afterDPLength = value.length - dpIndex - 1;
	}
	if(afterDPLength > 1){
		return false;
	}
	if(value > 100 || value < -100){
		return false;
	}
	return true;
}

function isValidDI(value){
	if(isNaN(value)){
		return false;
	}
	let afterDPLength = 0;
	let dpIndex = value.indexOf('.');
	if(dpIndex > -1){
		afterDPLength = value.length - dpIndex - 1;
	}
	if(afterDPLength > 1){
		return false;
	}
	if(value > 100 || value < 50){
		return false;
	}
	return true;
}

function validateTempDI(value, row, isRequired, isSettable){
	
	if(!isSettable){
		return message.error.unsettable;
	}else{
		
		if(isRequired){
			if(zeusStringUtils.isEmpty(value)){
				return message.error.required; 
			}
		}
		
		if(row.temperatureControlMode == 2){
			
			if(!isValidTemp(value)){
				return message.error.gm100l100ddp1;
			}
		}else if(row.temperatureControlMode == 4){
			
			if(!isValidDI(value)){
				return message.error.g50l100ddp1;
			}
		}
	}
	return null;
}

function ModalMsgSimpleSetting(){
	this.modal = document.querySelector('#modal-msg-simple-setting');
	this.msg = document.querySelector('#div-msg');
	this.btnClose = document.querySelector('#btn-close');
	
	this.btnClose.onclick = this.onBtnCloseClick;
}
ModalMsgSimpleSetting.prototype = {
	show: function(msg, arrMsg){
		this.msg.innerHTML = '';
		if(msg != null){
			this.msg.innerHTML = msg;
		}
		if(arrMsg != null){
			let div;
			for(let i = 0, l = arrMsg.length; i < l; i++){
				div = document.createElement('div');
				div.innerHTML = arrMsg[i];
				this.msg.appendChild(div);
			}
		}
		$(this.modal).modal('show');
	},
	onBtnCloseClick: function(){
		window.close();
	}
};

function SimpleSetting(){
	let _this = this;
	this.btnSave = document.querySelector('#btn-save');
	this.error = document.querySelector('#div-error');
	this.table = document.querySelector('#table-simpleSetting');
	
	this.btnSave.onclick = this.onBtnSaveClick.bind(this);
	this.modalMsg = new ModalMsgSimpleSetting();
	
	$(this.table).bootstrapTable({
		idField: 'nodeId',
	    uniqueId: 'nodeId',
	    locale: sessionStorage.getItem(STORE_KEY.bootstrapTable.language),
	    fixedColumns: true,
	    fixedNumber: 4,
	    columns: [
	    	{
	    		field: 'nodeId',
	    		title: 'NodeID'
	    	},{
	    		field: 'nodeName',
	    		title: fmt.nodeName
	    	},{
	    		field: 'controlMode',
	    		title: fmt.controlMode,
	    		formatter: controlModeFormatter
	    	},{
	    		field: 'temperatureControlMode',
	    		title: fmt.temperatureControlMode,
	    		formatter: temperatureControlModeFormatter
	    	},{
	    		field: 'onSecond',
	    		title: fmt.onSecond,
	    		editable: {
	    			type: 'text',
		        	emptytext: '-',
		        	mode: 'inline',
		        	validate: function(value){
		        		value = value.trim();
		        		let nodeId = this.getAttribute('data-pk');
		        		let row = $(_this.table).bootstrapTable('getRowByUniqueId', nodeId);
		        		if(isNaN(value) || value.indexOf('.') >= 0){
	        				return message.error.f0t86400i;
	        			}else if(!zeusStringUtils.isEmpty(row.offSecond)){
	        				value = parseInt(value);
	        				let offSecond = parseInt(row.offSecond);
	        				
	        				if(value == offSecond && value == 0){
	        					return message.error.g0i;
	        				}else if(value + offSecond > 86400){
	        					return fmt.message.exceedSecond;
	        				}
	        			}
		        	}
	    		}
	    	},{
	    		field: 'offSecond',
	    		title: fmt.offSecond,
	    		editable: {
	    			type: 'text',
		        	emptytext: '-',
		        	mode: 'inline',
		        	validate: function(value){
		        		value = value.trim();
		        		let nodeId = this.getAttribute('data-pk');
		        		let row = $(_this.table).bootstrapTable('getRowByUniqueId', nodeId);
		        		if(isNaN(value) || value.indexOf('.') >= 0){
	        				return message.error.f0t86400i;
	        			}else if(!zeusStringUtils.isEmpty(row.onSecond)){
	        				value = parseInt(value);
	        				let onSecond = parseInt(row.onSecond);
	        				
	        				if(value == onSecond && value == 0){
	        					return message.error.g0i;
	        				}else if(value + onSecond > 86400){
	        					return fmt.message.exceedSecond;
	        				}
	        			}
		        	}
	    		}
	    	},{
	    		field: 'estimateThresholdElectricEnergy',
	    		title: fmt.estimateThresholdElectricEnergy,
	    		editable: {
	    			type: 'text',
		        	emptytext: '-',
		        	mode: 'inline',
		        	validate: function(value){
		        		value = value.trim();
		        		if(isNaN(value) || value.indexOf('.') >= 0 || value < 0){
	        				return message.error.g0i;
	        			}
		        	}
	    		}
	    	},{
	    		field: 'thresholdTemperatureCoolingOn',
	    		title: '制御開始閾値温度/不快指数(冷)',
	    		editable: {
	    			type: 'text',
		        	emptytext: '-',
		        	mode: 'inline',
		        	validate: function(value){
		        		value = value.trim();
		        		let nodeId = this.getAttribute('data-pk');
		        		let row = $(_this.table).bootstrapTable('getRowByUniqueId', nodeId);
		        		let isSettable = (row.controlMode == 0 || row.controlMode == 2) && (row.temperatureControlMode == 2 || row.temperatureControlMode == 4);
		        		let result = validateTempDI(value, row, true, isSettable);
		        		if(result == null && !zeusStringUtils.isEmpty(row.thresholdTemperatureCooling)){
		        			if(value > row.thresholdTemperatureCooling){
		        				return '制御解除閾値温度/不快指数(冷)を超えています。';
		        			}
		        		}else{
		        			return result;
		        		}
		        	}
	    		}
	    	},{
	    		field: 'thresholdTemperatureCooling',
	    		title: '制御解除閾値温度/不快指数(冷)',
	    		editable: {
	    			type: 'text',
		        	emptytext: '-',
		        	mode: 'inline',
		        	validate: function(value){
		        		value = value.trim();
		        		let nodeId = this.getAttribute('data-pk');
		        		let row = $(_this.table).bootstrapTable('getRowByUniqueId', nodeId);
		        		let isSettable = (row.controlMode == 0 || row.controlMode == 2) && (row.temperatureControlMode == 2 || row.temperatureControlMode == 4);
		        		let result = validateTempDI(value, row, true, isSettable);
		        		if(result == null && !zeusStringUtils.isEmpty(row.thresholdTemperatureCoolingOn)){
		        			if(row.thresholdTemperatureCoolingOn > value){
		        				return '制御開始閾値温度/不快指数(冷)より小さい値になっています。';
		        			}
		        		}else{
		        			return result;
		        		}
		        	}
	    		}
	    	},{
	    		field: 'thresholdTemperatureHeatingOn',
	    		title: '制御開始閾値温度/不快指数(暖)',
	    		editable: {
	    			type: 'text',
		        	emptytext: '-',
		        	mode: 'inline',
		        	validate: function(value){
		        		value = value.trim();
		        		let nodeId = this.getAttribute('data-pk');
		        		let row = $(_this.table).bootstrapTable('getRowByUniqueId', nodeId);
		        		let isSettable = (row.controlMode == 1 || row.controlMode == 2) && (row.temperatureControlMode == 2 || row.temperatureControlMode == 4);
		        		let result = validateTempDI(value, row, true, isSettable);
		        		if(result == null && !zeusStringUtils.isEmpty(row.thresholdTemperatureHeating)){
		        			if(value < row.thresholdTemperatureHeating){
		        				return '制御解除閾値温度/不快指数(暖)より小さい値になっています。';
		        			}
		        		}else{
		        			return result;
		        		}
		        	}
	    		}
	    	},{
	    		field: 'thresholdTemperatureHeating',
	    		title: '制御解除閾値温度/不快指数(暖)',
	    		editable: {
	    			type: 'text',
		        	emptytext: '-',
		        	mode: 'inline',
		        	validate: function(value){
		        		value = value.trim();
		        		let nodeId = this.getAttribute('data-pk');
		        		let row = $(_this.table).bootstrapTable('getRowByUniqueId', nodeId);
		        		let isSettable = (row.controlMode == 1 || row.controlMode == 2) && (row.temperatureControlMode == 2 || row.temperatureControlMode == 4);
		        		let result = validateTempDI(value, row, true, isSettable);
		        		if(result == null && !zeusStringUtils.isEmpty(row.thresholdTemperatureHeatingOn)){
		        			if(row.thresholdTemperatureHeatingOn < value){
		        				return '制御開始閾値温度/不快指数(暖)を超えています。';
		        			}
		        		}else{
		        			return result;
		        		}
		        	}
	    		}
	    	},{
	    		field: 'thresholdTemperatureCoolingDemand',
	    		title: 'デマンド制御時閾値温度/不快指数(冷)',
	    		editable: {
	    			type: 'text',
		        	emptytext: '-',
		        	mode: 'inline',
		        	validate: function(value){
		        		value = value.trim();
		        		let nodeId = this.getAttribute('data-pk');
		        		let row = $(_this.table).bootstrapTable('getRowByUniqueId', nodeId);
		        		let isSettable = (row.controlMode == 0 || row.controlMode == 2) && (row.temperatureControlMode == 2 || row.temperatureControlMode == 4);
		        		let result = validateTempDI(value, row, false, isSettable);
		        		if(result != null){
		        			return result;
		        		}
		        	}
	    		}
	    	},{
	    		field: 'thresholdTemperatureHeatingDemand',
	    		title: 'デマンド制御時閾値温度/不快指数(暖)',
	    		editable: {
	    			type: 'text',
		        	emptytext: '-',
		        	mode: 'inline',
		        	validate: function(value){
		        		value = value.trim();
		        		let nodeId = this.getAttribute('data-pk');
		        		let row = $(_this.table).bootstrapTable('getRowByUniqueId', nodeId);
		        		let isSettable = (row.controlMode == 1 || row.controlMode == 2) && (row.temperatureControlMode == 2 || row.temperatureControlMode == 4);
		        		let result = validateTempDI(value, row, false, isSettable);
		        		if(result != null){
		        			return result;
		        		}
		        	}
	    		}
	    	}
		],
		data: arrTableData,
	    onEditableSave: function (field, row, rowIndex, oldValue, $el) {
	    	let val = row[field].trim();
	    	row[field] = val;
	    	
    		if(origin[row.nodeId][field] == null){
    			
    			if(zeusStringUtils.isEmpty(val)){
    				
    				if(update[row.nodeId] != null){
    					delete update[row.nodeId][field];
    				}
    			}else{
    				if(update[row.nodeId] == null){
    					update[row.nodeId] = {};
    				}
    				update[row.nodeId][field] = val;
    			}
    		}else {
    			
    			if(origin[row.nodeId][field] === val){
    				
    				if(update[row.nodeId] != null){
    					delete update[row.nodeId][field];
    				}
    			}else{
    				if(update[row.nodeId] == null){
    					update[row.nodeId] = {};
    				}
    				update[row.nodeId][field] = val;
    			}
    		}
    		if(JSON.stringify(update[row.nodeId]) === '{}'){
    			delete update[row.nodeId];
    		}
	    },
	    onEditableShown: function(field, row, $el){
	    	let input = $el[0].nextElementSibling.childNodes[0].childNodes[1][0];
	    	if(input.value === '-'){
	    		input.value = '';
	    	}
	    }
	});
}
SimpleSetting.prototype = {
	// events
	onBtnSaveClick: function(){
		
		if(this.validate()){
			
			$(this.btnSave).button('loading');
			$.ajax({
				url: contextPath + 'Rest/SimpleOperation/SimpleUpdate.action',
				async: true,
				cache: false,
				method: 'POST',
				simpleSetting: this,
				data: {
					simpleOperation: JSON.stringify(update)
				}
			})
			.done(function(resp, textStatus, jqXHR){
				let objResp = JSON.parse(resp);
				
				if(objResp.result === 'ok'){
					// update origin
					let key, value;
					for(let nodeId in update){
						
						for(key in update[nodeId]){
							value = update[nodeId][key];
							if(value == ''){
								delete origin[nodeId][key];
							}else{
								origin[nodeId][key] = update[nodeId][key];
							}
						}
					}
					// reset update
					update = {};
					this.simpleSetting.modalMsg.show(objResp.success.message);
				}else{
					popupError.setMessage(objResp.error.message);
				}
				$(this.simpleSetting.btnSave).button('reset');
			})
			.fail(function(jqXHR, textStatus, errorThrown){
				console.log(errorThrown);
				popupError.setMessage('エラーが発生しました。');
				$(this.simpleSetting.btnSave).button('reset');
			});
		}
	},
	// methods
	validate: function(){
		this.error.innerHTML = '';
		// setp 1: is changed
		if(JSON.stringify(update) === '{}'){
			popupError.setMessage('変更されていません。');
			return false;
		}
		// setp 2: is update data valid
		let row, div;
		for(let nodeId in update){
			row = $(this.table).bootstrapTable('getRowByUniqueId', nodeId);
			
			if(zeusStringUtils.isEmpty(row.onSecond)){
				
				if(row.temperatureControlMode == 2 || row.temperatureControlMode == 4 || !zeusStringUtils.isEmpty(row.offSecond)){
					div = document.createElement('div');
					div.innerHTML = row.nodeId + 'の' + fmt.onSecond + 'を入力してください。';
					this.error.appendChild(div);
				}
			}
			if(zeusStringUtils.isEmpty(row.offSecond)){
				
				if(row.temperatureControlMode == 2 || row.temperatureControlMode == 4 || !zeusStringUtils.isEmpty(row.onSecond)){
					div = document.createElement('div');
					div.innerHTML = row.nodeId + 'の' + fmt.offSecond + 'を入力してください。';
					this.error.appendChild(div);
				}
			}
			if(zeusStringUtils.isEmpty(row.thresholdTemperatureCoolingOn)){
				
				if((row.temperatureControlMode == 2 || row.temperatureControlMode == 4) && (row.controlMode == 0 || row.controlMode == 2)){
					div = document.createElement('div');
					div.innerHTML = row.nodeId + 'の制御開始閾値温度/不快指数(冷)を入力してください。';
					this.error.appendChild(div);
				}
			}
			if(zeusStringUtils.isEmpty(row.thresholdTemperatureCooling)){
				
				if((row.temperatureControlMode == 2 || row.temperatureControlMode == 4) && (row.controlMode == 0 || row.controlMode == 2)){
					div = document.createElement('div');
					div.innerHTML = row.nodeId + 'の制御解除閾値温度/不快指数(冷)を入力してください。';
					this.error.appendChild(div);
				}
			}
			if(zeusStringUtils.isEmpty(row.thresholdTemperatureHeatingOn)){
				
				if((row.temperatureControlMode == 2 || row.temperatureControlMode == 4) && (row.controlMode == 1 || row.controlMode == 2)){
					div = document.createElement('div');
					div.innerHTML = row.nodeId + 'の制御開始閾値温度/不快指数(暖)を入力してください。';
					this.error.appendChild(div);
				}
			}
			if(zeusStringUtils.isEmpty(row.thresholdTemperatureHeating)){
				
				if((row.temperatureControlMode == 2 || row.temperatureControlMode == 4) && (row.controlMode == 1 || row.controlMode == 2)){
					div = document.createElement('div');
					div.innerHTML = row.nodeId + 'の制御解除閾値温度/不快指数(暖)を入力してください。';
					this.error.appendChild(div);
				}
			}
		}
		if(this.error.innerHTML != ''){
			return false;
		}
		return true;
	}
};

let message = {error: {
	required: '入力してください。',
	f0t86400i: '0から86400までの整数を入力してください。',
	g0i: '0より大きい整数を入力してください。',
	gm100l100ddp1: '-100から100までの数字を入力してください。（少数の場合は1位まで）',
	g50l100ddp1: '50から100までの数字を入力してください。（少数の場合は1位まで）',
	unsettable: '設定できません。'
}}

let update = {};
let simpleSetting = new SimpleSetting();