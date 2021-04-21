var checkGroupAll = $('#checkGroupAll');
var checkNodeGroup = $('.node-group');
var tableNode = $('.table-node');

var checkedGroupIds = null;
var hasGroup = checkNodeGroup.length > 0;

let intervalTime = 1000;

//******************** functions
checkNodeGroup.change(function() {
	
	var groupItems = $('[data-groupId="' + this.value + '"]');
	if(this.checked)
		groupItems.show();
	else
		groupItems.hide();
	
	if(tableNode.filter(':visible').length == 0)
		ListShowHide.hideAll();
	else
		ListShowHide.showAll();
	
	if(checkNodeGroup.filter(':checked').length == checkNodeGroup.length)
		checkGroupAll.prop('checked', true);
	else
		checkGroupAll.prop('checked', false);
});

checkGroupAll.change(function(){
	
	checkNodeGroup.prop('checked', this.checked);
	
	checkNodeGroup.each(function(){
		$(this).change();
	});
});

function saveGroupChecked(){
	
	// グループのチェック状態を保存
	var currentCheckedGroupIds;
	var checkedGroup = checkNodeGroup.filter(':checked');
	if(checkedGroup.length > 0){
		
		for(var i = 0; i < checkedGroup.length; i++){
			
			if(currentCheckedGroupIds == null)
				currentCheckedGroupIds = $(checkedGroup[i]).val();
			else
				currentCheckedGroupIds += ',' + $(checkedGroup[i]).val();
		}
	}
	
	var isChanged = false;
	if(checkedGroupIds == null){
		
		if(currentCheckedGroupIds != null)
			isChanged = true;
	}else{
		
		if(currentCheckedGroupIds == null)
			isChanged = true;
		else{
			
			if(checkedGroupIds != currentCheckedGroupIds)
				isChanged = true;
		}
	}
	
	if(isChanged){
		
		var param = {};
		if(currentCheckedGroupIds != null)
			param.checkedGroupIds = currentCheckedGroupIds;
		
		$.ajax({
			url: contextPath + 'Rest/Node/UpdateNodeUserCheckedGroup.action',
		   	async: true,
		   	cache: false,
			data: param,
			success: function(resp){
				
				let respObj = JSON.parse(resp);
				if(respObj.error == 'sync')
					console.log('request failed: can not access to synchronization server');
				
				setTimeout(saveGroupChecked, intervalTime);
			},
		   	error: function(){
				console.log('checked group ids update error.');
				setTimeout(saveGroupChecked, intervalTime);
		   	}
		});
		
		checkedGroupIds = currentCheckedGroupIds;
	}else{
		setTimeout(saveGroupChecked, intervalTime);
	}
}

function SetSensorOrder(){
	
	let btnSetOrder = document.querySelector('#btn-setSensorOrder');
	let ulSensor = document.querySelector('#ul-node-order');
	let btnSaveOrder = document.querySelector('#btn-saveSensorOrder');
	let modalSetOrder = $('#modal-setOrder');
	
	let orderData;
	
	btnSetOrder.onclick = function(){
		
		if(orderData == null){
			
			$.ajax({
				url: contextPath + 'Rest/Node/GetSensorOrderAll.action',
				async: true,
				cache: false,
				success: function(resp){
					
					let respObj = JSON.parse(resp);
					if(respObj.data != null){
						
						orderData = respObj.data;
						
						let li, liHeader, liText, span, sensorName;
						
						for(var i in respObj.data){
							
							li = document.createElement('li');
							li.setAttribute('class', 'list-group-item');
							li.setAttribute('data-sensorId', respObj.data[i].nodeId);
							
							liHeader = document.createElement('div');
							liHeader.setAttribute('class', 'list-group-item-heading d-flex justify-content-between font-weight-bold');
							span = document.createElement('small');
							span.innerText = 'ノード名';
							liHeader.appendChild(span);
							span = document.createElement('small');
							span.innerText = 'ノードタイプ';
							liHeader.appendChild(span);
							li.appendChild(liHeader);
							
							liText = document.createElement('div');
							liText.setAttribute('class', 'list-group-item-text d-flex justify-content-between');
							span = document.createElement('span');
							span.innerText = respObj.data[i].nodeName;
							liText.appendChild(span);
							span = document.createElement('span');
							if(respObj.data[i].nodeTypeName != null)
								span.innerText = respObj.data[i].nodeTypeName;
							liText.appendChild(span);
							li.appendChild(liText);
							
							ulSensor.appendChild(li);
						}
						
						$(ulSensor).sortable();
					}else
						alert('登録されているノードがありません。');
					
					modalSetOrder.modal('show');
				},
				error: function(){
					alert('ノード情報が取得できませんでした。');
				}
			});
		}else
			modalSetOrder.modal('show');
	}
	
	btnSaveOrder.onclick = function(){
		
		let childs = ulSensor.children;
		if(childs.length > 0){
			
			let dataObj = {};
			for(let i = 0, l = childs.length; i < l; i++)
				dataObj[childs[i].getAttribute('data-sensorid')] = i;
			
			$.ajax({
				url: contextPath + 'Rest/Node/SaveSensorOrderAll.action',
				async: true,
				cache: false,
				type: 'POST',
				data: {data: JSON.stringify(dataObj)}
			})
			.done(function(resp, status, jqXHR){
				let respObj = JSON.parse(resp);
				
				if(respObj.error != null){
					alert('同期サーバーに接続できないため，処理できませんでした。');
				}else{
					document.location.href = 'NodeList.action'
				}
			});
		}else{
			alert('登録されているノードがありません。');
		}
	}
}

//******************** init
if(hasGroup) {
	checkedGroupIds = reqCheckedGroupIds;
	
	if(checkNodeGroup.filter(':checked').length == checkNodeGroup.length){
		checkGroupAll.prop('checked', true);
	}else{
		checkGroupAll.prop('checked', false);
	}
	
	checkNodeGroup.each(function() {
		$(this).change();
	});
	
	saveGroupChecked();
}

//==> set node order module initialization
new SetSensorOrder();
zeusSettingImport.settingImport('Rest/Node/SettingImport.action');
zeusSettingExport.settingExport('Node/SettingExport.action');
//==================== init