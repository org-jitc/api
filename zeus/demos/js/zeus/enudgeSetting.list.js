function BackServerDomain(){
	// variables
	this.ajaxParam = {
		column: 'back_server_domain',
		dataType: 'string',
		syncType: 'sync',
		required: true
	};
	// elements
	this.label = document.querySelector('#current-backServerDomain');
	this.selectScheme = document.querySelector('#select-scheme');
	this.inputDomain = document.querySelector('#input-domain');
	this.btnSet = document.querySelector('#btn-set-backServerDomain');
	// bind events
	this.btnSet.onclick = this.onBtnSetClick.bind(this);
	// initialization
	if(!zeusStringUtils.isEmpty(backServerDomain)){
		let spliter = '://';
		let arr = backServerDomain.split(spliter);
		this.selectScheme.value = arr[0] + spliter;
		this.inputDomain.value = arr[1];
	}
}
BackServerDomain.prototype = {
	// events
	onBtnSetClick: function(){
		this.ajaxParam.dataValue = this.selectScheme.value + this.inputDomain.value;
		$(this.btnSet).button('loading');
		$.ajax({
			url: contextPath + 'Rest/EnudgeSetting/UpdateColumnOne.action',
			data: this.ajaxParam,
			backServerDomain: this
		})
		.done(function(resp, status, xhr){
			let objResp = JSON.parse(resp);
			if(objResp.result === 'ok'){
				this.backServerDomain.label.innerText = this.backServerDomain.selectScheme.value + this.backServerDomain.inputDomain.value;
				popupMessage.setMessage(objResp.success.message);
			}else{
				popupError.setMessage(objResp.error.message);
			}
			$(this.backServerDomain.btnSet).button('reset');
		})
		.fail(function(xhr, status, error){
			$(this.backServerDomain.btnSet).button('reset');
			popupError.setMessage('エラーが発生しました。');
		});
	}
};

function EnudgeSetting(){
	// variables
	// elements
	this.backServerDomain = new BackServerDomain();
	this.ajaxUpdateItems = new AjaxUpdateItems({
		url: contextPath + 'Rest/EnudgeSetting/UpdateColumnOne.action'
	});
	this.btnGetLocalServerId = document.querySelector('#btn-get-localServerId');
	this.btnGetBackServerArea = document.querySelector('#btn-get-backServerArea');
	this.labelBackServerArea = document.querySelector('#label-backServerArea');
	this.btnUpdateBackServerArea = document.querySelector('#btn-update-backServerArea');
	this.btnUpdateAreaNode = document.querySelector('#btn-update-areaNode');
	this.tableAreaNode = document.querySelector('#table-areaNode');
	
	// bind events
	this.btnGetLocalServerId.onclick = this.onBtnGetLocalServerIdClick.bind(this);
	this.btnGetBackServerArea.onclick = this.onBtnGetBackServerAreaClick.bind(this);
	this.btnUpdateBackServerArea.onclick = this.onBtnUpdateBackServerArea.bind(this);
	this.btnUpdateAreaNode.onclick = this.onBtnUpdateAreaNodeClick.bind(this);
	
	// initialization
	$(this.tableAreaNode).bootstrapTable({
		idField: 'areaId',
		locale: sessionStorage.getItem(STORE_KEY.bootstrapTable.language),
		columns: [
			{
	    		field: 'areaId',
	    		title: 'AreaID',
	    		editable: {
	    			type: 'text',
		        	emptytext: '-'
	    		}
	    	},{
	    		field: 'nodeId',
	    		title: 'NodeID',
	    	}
		],
		data: arrTableData,
		onEditableSave: function (field, row, rowIndex, oldValue, $el) {
			let val = row[field].trim();
			row[field] = val;
	    		
    		if(origin[row.nodeId] == null){
    			
    			if(zeusStringUtils.isEmpty(val) || val === '-'){
    				delete update[row.nodeId];
    			}else{
    				update[row.nodeId] = val;
    			}
    		}else {
    			
    			if(origin[row.nodeId] === val){
    				delete update[row.nodeId];
    			}else{
    				update[row.nodeId] = val;
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
EnudgeSetting.prototype = {
	onBtnGetLocalServerIdClick: function(){
		$(this.btnGetLocalServerId).button('loading');
		$.ajax({
			url: contextPath + 'Rest/EnudgeBackServer/LocalServerId.action',
			async: true,
			cache: false,
			enudgeSetting: this
		})
		.done(function(resp, status, xhr){
			let objResp = JSON.parse(resp);
			if(objResp.result === 'ok'){
				popupMessage.setMessage('取得しました。');
				this.enudgeSetting.ajaxUpdateItems.ajaxItems['local_server_id'].text.value = objResp.success;
			}else{
				popupError.setMessage(objResp.error.message);
			}
			$(this.enudgeSetting.btnGetLocalServerId).button('reset');
		})
		.fail(function(xhr, status, error){
			console.log(error);
			$(this.enudgeSetting.btnGetLocalServerId).button('reset');
			popupError.setMessage('エラーが発生しました。');
		});
	},
	onBtnGetBackServerAreaClick: function(){
		$(this.btnGetBackServerArea).button('loading');
		$.ajax({
			url: contextPath + 'Rest/EnudgeBackServer/Area.action',
			async: true,
			cache: false,
			enudgeSetting: this
		})
		.done(function(resp, status, xhr){
			let objResp = JSON.parse(resp);
			if(objResp.result === 'ok'){
				popupMessage.setMessage('取得しました。');
				if(objResp.success.length == 0){
					this.enudgeSetting.labelBackServerArea.innerText = "-";
				}else{
					this.enudgeSetting.labelBackServerArea.innerText = objResp.success.join(', ');
				}
			}else{
				this.enudgeSetting.labelBackServerArea.innerText = '-';
				popupError.setMessage(objResp.error.message);
			}
			$(this.enudgeSetting.btnGetBackServerArea).button('reset');
		})
		.fail(function(xhr, status, error){
			console.log(error);
			this.enudgeSetting.labelBackServerArea.innerText = '-';
			$(this.enudgeSetting.btnGetBackServerArea).button('reset');
			popupError.setMessage('エラーが発生しました。');
		});
	},
	onBtnUpdateBackServerArea: function(){
		$(this.btnUpdateBackServerArea).button('loading');
		$.ajax({
			url: contextPath + 'Rest/EnudgeBackServer/UpdateArea.action',
			async: true,
			cache: false,
			enudgeSetting: this
		})
		.done(function(resp, status, xhr){
			let objResp = JSON.parse(resp);
			if(objResp.result === 'ok'){
				popupMessage.setMessage('適応しました。');
			}else{
				popupError.setMessage(objResp.error.message);
			}
			$(this.enudgeSetting.btnUpdateBackServerArea).button('reset');
		})
		.fail(function(xhr, status, error){
			console.log(error);
			$(this.enudgeSetting.btnUpdateBackServerArea).button('reset');
			popupError.setMessage('エラーが発生しました。');
		});
	},
	onBtnUpdateAreaNodeClick: function(){
		
		if(this.validateArea()){
			let strNodeArea = JSON.stringify(update);
			$(this.btnSaveArea).button('loading');
			$.ajax({
				url: contextPath + 'Rest/EnudgeNodeMap/Update.action',
				async: true,
				cache: false,
				method: 'POST',
				enudgeSetting: this,
				data: {
					nodeArea: strNodeArea
				}
			})
			.done(function(resp, textStatus, jqXHR){
				let objResp = JSON.parse(resp);
				
				if(objResp.result === 'ok'){
					let areaId;
					
					for(let nodeId in update){
						areaId = update[nodeId];
						
						if(zeusStringUtils.isEmpty(areaId)){
							delete origin[nodeId];
						}else{
							origin[nodeId] = areaId;
						}
					}
					update = {};
					popupMessage.setMessage(objResp.success.message);
				}else{
					popupError.setMessage(objResp.error.message);
				}
				$(this.enudgeSetting.btnUpdateAreaNode).button('reset');
			})
			.fail(function(jqXHR, textStatus, errorThrown){
				console.log(errorThrown);
				popupError.setMessage('エラーが発生しました。');
				$(this.enudgeSetting.btnUpdateAreaNode).button('reset');
			});
		}
	},
	// methods
	validateArea: function(){
		
		if(JSON.stringify(update) !== '{}'){
			let areaId, arrFiltered;
			
			for(let nodeId in update){
				areaId = update[nodeId];
				
				if(!zeusStringUtils.isEmpty(areaId)){
					arrFiltered = document.querySelectorAll('[data-name="areaId"][data-value="' + areaId + '"]');
					
					if(arrFiltered.length > 1){
						popupError.setMessage('AreaID: ' + areaId + 'が複数存在します。');
						return false;
					}
				}
			}
		}else{
			popupError.setMessage('変更されていません。');
			return false;
		}
		return true;
	}
};

let update = {};
let enudgeSetting = new EnudgeSetting();