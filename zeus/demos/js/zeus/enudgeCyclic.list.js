function EnudgeCyclic(){
	this.btnSaveArea = document.querySelector('#btn-save-area');
	this.btnSaveCyclic = document.querySelector('#btn-save-cyclic');
	this.table = document.querySelector('#table-enudgeCyclic');
	
	if(this.btnSaveArea != null){
		this.btnSaveArea.onclick = this.onBtnSaveAreaClick.bind(this);
	}
	this.btnSaveCyclic.onclick = this.onBtnSaveCyclicClick.bind(this);
	
	$(this.table).bootstrapTable({
	    idField: 'nodeId',
	    locale: sessionStorage.getItem(STORE_KEY.bootstrapTable.language),
	    columns: [
	    	[{
	    		field: 'areaId',
	    		title: 'AreaID',
	    		rowspan: 3,
	    		visible: editableAreaId,
	    		editable: editableAreaId && {
	    			type: 'text',
		        	emptytext: '-'
	    		}
	    	},{
	    		field: 'nodeId',
	    		title: 'NodeID',
	    		rowspan: 3
	    	},{
	    		field: 'nodeName',
	    		title: '系統名',
	    		rowspan: 3
	    	},{
	    		title: '推奨（強）',
	    		colspan: 4
	    	},{
	    		title: '弱（中）',
	    		colspan: 4
	    	},{
	    		title: '最弱（弱）',
	    		colspan: 4
	    	}],
	    	[{
	    		title: '通<br>常<br>時',
	    		colspan: 2
	    	},{
	    		title: 'デ<br>マ<br>ン<br>ド<br>時',
	    		colspan: 2
	    	},{
	    		title: '通<br>常<br>時',
	    		colspan: 2
	    	},{
	    		title: 'デ<br>マ<br>ン<br>ド<br>時',
	    		colspan: 2
	    	},{
	    		title: '通<br>常<br>時',
	    		colspan: 2
	    	},{
	    		title: 'デ<br>マ<br>ン<br>ド<br>時',
	    		colspan: 2
	    	}],
	    	[{
	    		field: 'off_sec_0_61',
	    		title: '通<br>常<br>時<br>間<br>︹<br>秒<br>︺',
	    		editable: {
	    			type: 'text',
		        	emptytext: '-',
		        	validate: validateSecond
	    		}
	    	},{
	    		field: 'on_sec_0_61',
	    		title: '制<br>御<br>時<br>間<br>︹<br>秒<br>︺',
	    		editable: {
	    			type: 'text',
	    			emptytext: '-',
	    			validate: validateSecond
	    		}
	    	},{
	    		field: 'off_sec_1_61',
	    		title: '通<br>常<br>時<br>間<br>︹<br>秒<br>︺',
	    		editable: {
	    			type: 'text',
	    			emptytext: '-',
	    			validate: validateSecond
	    		}
	    	},{
	    		field: 'on_sec_1_61',
	    		title: '制<br>御<br>時<br>間<br>︹<br>秒<br>︺',
	    		editable: {
	    			type: 'text',
	    			emptytext: '-',
	    			validate: validateSecond
	    		}
	    	},{
	    		field: 'off_sec_0_31',
	    		title: '通<br>常<br>時<br>間<br>︹<br>秒<br>︺',
	    		editable: {
	    			type: 'text',
	    			emptytext: '-',
	    			validate: validateSecond
	    		}
	    	},{
	    		field: 'on_sec_0_31',
	    		title: '制<br>御<br>時<br>間<br>︹<br>秒<br>︺',
	    		editable: {
	    			type: 'text',
	    			emptytext: '-',
	    			validate: validateSecond
	    		}
	    	},{
	    		field: 'off_sec_1_31',
	    		title: '通<br>常<br>時<br>間<br>︹<br>秒<br>︺',
	    		editable: {
	    			type: 'text',
	    			emptytext: '-',
	    			validate: validateSecond
	    		}
	    	},{
	    		field: 'on_sec_1_31',
	    		title: '制<br>御<br>時<br>間<br>︹<br>秒<br>︺',
	    		editable: {
	    			type: 'text',
	    			emptytext: '-',
	    			validate: validateSecond
	    		}
	    	},{
	    		field: 'off_sec_0_1',
	    		title: '通<br>常<br>時<br>間<br>︹<br>秒<br>︺',
	    		editable: {
	    			type: 'text',
	    			emptytext: '-',
	    			validate: validateSecond
	    		}
	    	},{
	    		field: 'on_sec_0_1',
	    		title: '制<br>御<br>時<br>間<br>︹<br>秒<br>︺',
	    		editable: {
	    			type: 'text',
	    			emptytext: '-',
	    			validate: validateSecond
	    		}
	    	},{
	    		field: 'off_sec_1_1',
	    		title: '通<br>常<br>時<br>間<br>︹<br>秒<br>︺',
	    		editable: {
	    			type: 'text',
	    			emptytext: '-',
	    			validate: validateSecond
	    		}
	    	},{
	    		field: 'on_sec_1_1',
	    		title: '制<br>御<br>時<br>間<br>︹<br>秒<br>︺',
	    		editable: {
	    			type: 'text',
	    			emptytext: '-',
	    			validate: validateSecond
	    		}
	    	}]
		],
		data: arrTableData,
	    onEditableSave: function (field, row, rowIndex, oldValue, $el) {
	    	let val = row[field].trim();
	    	row[field] = val;
	    	
	    	if(field === 'areaId'){
	    		
	    		if(origin.area[row.nodeId] == null){
	    			
	    			if(zeusStringUtils.isEmpty(val) || val === '-'){
	    				delete update.area[row.nodeId];
	    			}else{
	    				update.area[row.nodeId] = val;
	    			}
	    		}else {
	    			
	    			if(origin.area[row.nodeId] === val){
	    				delete update.area[row.nodeId];
	    			}else{
	    				update.area[row.nodeId] = val;
	    			}
	    		}
	    	}else {
	    		let key = row.nodeId + '_' + field;
	    		
	    		if(origin.cyclic[key] === val){
	    			delete update.cyclic[key];
	    		}else{
	    			update.cyclic[key] = val;
	    		}
	    	}
	    },
	    onEditableShown: function(field, row, $el){
	    	let input = $el[0].nextElementSibling.childNodes[2].childNodes[1].childNodes[1][0];
	    	if(input.value === '-'){
	    		input.value = '';
	    	}
	    }
	});
}
EnudgeCyclic.prototype = {
	// events
	onBtnSaveAreaClick: function(){
		
		if(this.validateArea()){
			let strNodeArea = JSON.stringify(update.area);
			
			if(strNodeArea !== '{}'){
				$(this.btnSaveArea).button('loading');
				$.ajax({
					url: contextPath + 'Rest/EnudgeNodeMap/Update.action',
					async: true,
					cache: false,
					method: 'POST',
					enudgeCyclic: this,
					data: {
						nodeArea: strNodeArea
					}
				})
				.done(function(resp, textStatus, jqXHR){
					let objResp = JSON.parse(resp);
					
					if(objResp.result === 'ok'){
						let areaId;
						
						for(let nodeId in update.area){
							areaId = update.area[nodeId];
							
							if(zeusStringUtils.isEmpty(areaId)){
								delete origin.area[nodeId];
							}else{
								origin.area[nodeId] = areaId;
							}
						}
						update.area = {};
						popupMessage.setMessage(objResp.success.message);
					}else{
						popupError.setMessage(objResp.error.message);
					}
					$(this.enudgeCyclic.btnSaveArea).button('reset');
				})
				.fail(function(jqXHR, textStatus, errorThrown){
					console.log(errorThrown);
					popupError.setMessage('エラーが発生しました。');
					$(this.enudgeCyclic.btnSaveArea).button('reset');
				});
			}
		}
	},
	onBtnSaveCyclicClick: function(){
		
		if(this.validateCyclic() && JSON.stringify(update.cyclic)  !== '{}'){
			$(this.btnSaveCyclic).button('loading');
			let strCyclic = JSON.stringify(update.cyclic);
			$.ajax({
				url: contextPath + 'Rest/EnudgeCyclic/Update.action',
				async: true,
				cache: false,
				method: 'POST',
				enudgeCyclic: this,
				data: {
					cyclic: strCyclic
				}
			})
			.done(function(resp, textStatus, jqXHR){
				let objResp = JSON.parse(resp);
				
				if(objResp.result === 'ok'){
					
					for(let key in update.cyclic){
						origin.cyclic[key] = update.cyclic[key];
					}
					update.cyclic = {};
					popupMessage.setMessage(objResp.success.message);
				}else{
					popupError.setMessage(objResp.error.message);
				}
				$(this.enudgeCyclic.btnSaveCyclic).button('reset');
			})
			.fail(function(jqXHR, textStatus, errorThrown){
				console.log(errorThrown);
				popupError.setMessage('エラーが発生しました。');
				$(this.enudgeCyclic.btnSaveCyclic).button('reset');
			});
		}
	},
	// methods
	validateArea: function(){
		
		if(JSON.stringify(update.area) !== '{}'){
			let areaId, arrFiltered;
			
			for(let nodeId in update.area){
				areaId = update.area[nodeId];
				
				if(!zeusStringUtils.isEmpty(areaId)){
					arrFiltered = document.querySelectorAll('[data-name="areaId"][data-value="' + areaId + '"]');
					
					if(arrFiltered.length > 1){
						popupError.setMessage('AreaID: ' + areaId + 'が複数存在します。');
						return false;
					}
				}
			}
		}
		return true;
	},
	validateCyclic: function(){
		
		if(JSON.stringify(update.cyclic) !== '{}'){
			let arrKey, keyOther, clName, esName, secNameOther;
			
			for(let key in update.cyclic){
				arrKey = key.split('_');
				if(arrKey[4] == 61){
					clName = '推奨（強）';
				}else if(arrKey[4] == 31){
					clName = '弱（中）';
				}else{
					clName = '最弱（弱）';
				}
				
				if(arrKey[3] == 0){
					esName = '通常時';
				}else{
					esName = 'デマンド時';
				}
				
				if(key.indexOf('on') > 0){
					keyOther = key.replace('on', 'off');
					secNameOther = '通常時間';
				}else{
					keyOther = key.replace('off', 'on');
					secNameOther = '制御時間';
				}
				
				if(update.cyclic[keyOther] == null && origin.cyclic[keyOther] == null){
					popupError.setMessage('NodeID: ' + arrKey[0] + 'の' + clName+ 'の' + esName + 'の' + secNameOther + 'を入力してください。');
					return false;
				}
			}
		}else{
			popupError.setMessage('変更されていません。');
		}
		return true;
	}
};

function ModalCyclicInit(){
	let arrExcessStatus = [0, 1];
	let arrControlLevel = [61, 31, 1];
	this.arrElementKey = [];
	let es, cl, key;
	for(let esi = 0, esl = arrExcessStatus.length; esi < esl; esi++){
		es = arrExcessStatus[esi];
		
		for(let cli = 0, cll = arrControlLevel.length; cli < cll; cli++){
			cl = arrControlLevel[cli];
			key = 'off_sec_' + es + '_' + cl;
			this.arrElementKey.push(key);
			
			key = 'on_sec_' + es + '_' + cl;
			this.arrElementKey.push(key);
		}
	}
	
	this.btnCyclicInit = document.querySelector('#btn-cyclic-init');
	this.modal = document.querySelector('#modal-cyclic-init');
	this.form = document.querySelector('#form-cyclic-init');
	this.error = document.querySelector('#error-cyclic-init');
	this.overwrite = document.querySelector('#overwrite');
	
	for(let i = 0, l = this.arrElementKey.length; i < l; i++){
		key = this.arrElementKey[i];
		this[key] = document.querySelector('[name="' + key + '"]');
		this[key].onkeyup = zeus.onNumberInput;
	}
	this.btnCyclicInitCommit = document.querySelector('#btn-cyclic-init-commit');
	
	this.btnCyclicInit.onclick = this.onBtnCyclicInitClick.bind(this);
	this.btnCyclicInitCommit.onclick = this.onBtnCyclicInitCommitClick.bind(this);
}
ModalCyclicInit.prototype = {
	// events
	onBtnCyclicInitClick: function(){
		this.error.innerHTML = '';
		this.overwrite.checked = false;
		$(this.modal).modal('show');
	},
	onBtnCyclicInitCommitClick: function(){
		
		if(this.validateCyclicInit()){
			this.form.submit();
		}
	},
	// methods
	validateCyclicInit: function(){
		this.error.innerHTML = '';
		let keyOff, keyOn, valueOff, valueOn, isEmptyOff, isEmptyOn, isEmpty = true;
		
		for(let i = 0, l = this.arrElementKey.length; i < l; i = i + 2){
			keyOff = this.arrElementKey[i];
			keyOn = this.arrElementKey[i + 1];
			valueOff = this[keyOff].value;
			valueOn = this[keyOn].value;
			isEmptyOff = zeusStringUtils.isEmpty(valueOff);
			isEmptyOn = zeusStringUtils.isEmpty(valueOn);
			isEmpty = isEmpty && isEmptyOff && isEmptyOn;
			
			if((isEmptyOff && !isEmptyOn)
					|| (!isEmptyOff && isEmptyOn)){
				this.error.innerHTML = '通常時間が入力された場合は制御時間が必須です。<br>制御時間が入力された場合は通常時間が必須です。';
				return false;
			}
		}
		if(isEmpty){
			this.error.innerHTML = '入力されていません。';
			return false;
		}
		return true;
	}
};

function validateSecond(val){
	
	if(zeusStringUtils.isEmpty(val)){
		return '必須です。';
	}else{
		
		if(isNaN(val)){
			return '数字を入力してください。';
		}
	}
}

let update = {
	area: {},
	cyclic: {}
};
let enudgeCyclic = new EnudgeCyclic();
if(editableAreaId){
	let modalCyclicInit = new ModalCyclicInit();
}