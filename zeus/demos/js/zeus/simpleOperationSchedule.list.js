var chkGroupAll = $('#check-group-all');
var chkGroup = $('.sos-group-check');
var tableSOS = $('.table-sos');
var checkOnOff = $('.onOff-check');
var scheduleIdValue;
var checkedGroupIds;

chkGroupAll.change(function(){
	
	chkGroup.prop('checked', this.checked);
	chkGroup.each(function(){
		$(this).change();
	});
	
	if(this.checked)
		ListShowHide.showAll();
	else
		ListShowHide.hideAll();
});

chkGroup.change(function(){
	
	var checkedLen = chkGroup.filter(':checked').length;
	chkGroupAll.prop('checked', checkedLen == chkGroup.length);
	
	var filtered = tableSOS.filter('.table-' + this.value);
	if(this.checked)
		filtered.show();
	else
		filtered.hide();
	
	if(checkedLen != 0)
		ListShowHide.showAll();
	else
		ListShowHide.hideAll();
});

function saveCheckedGroup(){
	
	var groupIds;
	chkGroup.filter(':checked').each(function(){
		
		if(groupIds != null)
			groupIds += ',' + this.value;
		else
			groupIds = this.value;
	});
	
	if(groupIds != checkedGroupIds){
		
		var param = {};
		// group ids
		if(groupIds == null)
			param.groupIds = "sos_group_ids=null";
		else
			param.groupIds = "sos_group_ids='" + groupIds + "'";
		
		checkedGroupIds = groupIds;
		
		$.ajax({
			url: contextPath + 'Ajax/User/UpdateOption.action',
			async: true,
			cache: false,
			data: param,
			success: function(response){
				console.log('update user options success');
			},
			error: function(){
				console.log('update user options failed.');
			}
		});
	}
}

function recoverEditConfirm(scheduleId){
	
	scheduleIdValue = scheduleId;
	
	$.ajax({
		url: 'SimpleOperationScheduleRecoverUpdateConfirm.do',
		type: 'post',
		async: true,
		cache: false,
		data: {scheduleId: scheduleId},
		success: function(response){
			
			var responseText = response;
			
			if(responseText == ""){
				
				alert('failed');
				
				closeWindow();
				
			}else{
				
				var dataArr = responseText.split(',');
				
				document.getElementById('messageSpan').innerHTML = dataArr[0];
				document.getElementById('mo').options.selectedIndex = dataArr[1] - 1;
				document.getElementById('d').options.selectedIndex = dataArr[2] - 1;
				document.getElementById('h').options.selectedIndex = dataArr[3];
				document.getElementById('mi').options.selectedIndex = dataArr[4];
			}
		}
	});
	
	openWindow();
}

function recoverEditComplete(){
	
	var moSelect = document.getElementById('mo');
	var dSelect = document.getElementById('d');
	var hSelect = document.getElementById('h');
	var miSelect = document.getElementById('mi');

	$.ajax({
		url: 'SimpleOperationScheduleRecoverUpdateComplete.do',
		type: 'post',
		async: true,
		cache: false,
		data: {
			scheduleId: scheduleIdValue,
			mo: moSelect.options[moSelect.selectedIndex].value,
			d: dSelect.options[dSelect.selectedIndex].value,
			h: hSelect.options[hSelect.selectedIndex].value,
			mi: miSelect.options[miSelect.selectedIndex].value
		},
		success: function(response){
			
			var responseText = response;
			
			if(responseText == '')
				alert('failed');
			else{
				
				var recoverTd = document.getElementById('recover' + scheduleIdValue);
				var oldValue = recoverTd.innerText;
				var oldValueArr = oldValue.split(' ');
				var newValue = responseText + " " + oldValueArr[2];
				
				recoverTd.innerHTML = '<font color="#E46C0A">' + newValue + '</font>';
				
				closeWindow();
			}
		}
	});
}

var sosListCount;
var nodeIdValue;

function recoverDeleteConfirm(nodeId, scheduleId, listCount){
	
	scheduleIdValue = scheduleId;
	sosListCount = listCount;
	nodeIdValue = nodeId;

	$.ajax({
		url: 'SimpleOperationScheduleRecoverDeleteConfirm.do',
		type: 'post',
		async: true,
		cache: false,
		data: {scheduleId: scheduleId},
		success: function(response){
			
			var responseText = response;
			
			if(responseText == ''){
				
				alert('failed');
				
				closeDeleteWindow();
			}else
				document.getElementById('messageSpanDelete').innerHTML = responseText;
		}
	});

	openDeleteWindow();
}

function recoverDeleteComplete(){
	
	$.ajax({
		url: 'SimpleOperationScheduleRecoverDeleteComplete.do',
		type: 'post',
		async: true,
		cache: false,
		data: {scheduleId: scheduleIdValue},
		success: function(response){
			
			var responseText = response;

			// nodeの数と，各nodeのスケジュールのかずが0でない場合
			if(responseText > 0 && sosListCount > 0){
				var recoverTd = document.getElementById('recover' + scheduleIdValue);
				recoverTd.innerHTML = '';
				var recoverButtonTd = document.getElementById('recoverButton' + scheduleIdValue);
				recoverButtonTd.innerHTML = '';

			// nodeの数が0の場合
			}else if(responseText == 0){
				
				document.getElementById('displayAllTrTop').style.display = 'none';
				document.getElementById('displayAllTrBottom').style.display = 'none';
				document.getElementById('dataTable' + nodeIdValue).style.display = 'none';
				
			// nodeのスケジュールの数が0の場合
			}else
				document.getElementById('dataTable' + nodeIdValue).style.display = 'none';

			closeDeleteWindow();
		}
	})
}

function openWindow(){
	$('#popupwindow').modal('show');
}

function openDeleteWindow(){
	$('#popupwindowDelete').modal('show');
}

function closeWindow(){
	$('#popupwindow').modal('hide');
}

function closeDeleteWindow(){
	$('#popupwindowDelete').modal('hide');
}

checkOnOff.each(function(){
	
	$(this).click(function(){
		
		var item = $(this);
		
		var nodeId = item.prop('id').replace('onOffDiv', '');
		
		var checkItem = $('#onOffCheck' + nodeId);
		
		var status = 1;
		
		// チェックされる前の状態である
		if(checkItem.prop('checked')){
			
			status = 0;
			checkItem.bootstrapToggle('on');
			
		}else
			checkItem.bootstrapToggle('off');
		
		$.ajax({
			url: contextPath + 'Ajax/SimpleOperationSchedule/UpdateControlTarget.action',
			async: true,
			cache: false,
			data: {nodeId: nodeId, status: status},
			nodeId: nodeId,
			status: status,
			success: function(response){
				
				var resultObj = JSON.parse(response);
				
				if(resultObj.error == null){
					
					var checkItem = $('#onOffCheck' + nodeId);
					
					if(status == 0)
						checkItem.bootstrapToggle('off');
					else
						checkItem.bootstrapToggle('on');
				}else{
					
					popupError.setMessage(resultObj.error == 'sync'? '同期サーバに接続できませんでした。しばらくしてからリトライしてください。': '変更できませんでした。しばらくしてからリトライしてください。');
					
					setTimeout(function(){
						popupError.hide();
					}, 3000);
				}
			}
		});
	});	
});

//*****************************init
zeus.setNumberOptions('mo', 1, 12, false, '0');
zeus.setNumberOptions('d', 1, 31, false, '0');
zeus.setNumberOptions('h', 0, 23, false, '0');
zeus.setNumberOptions('mi', 0, 59, false, '0');

if(reqEditable)
	$('.button-zeus').prop('disabled', true);
	
// checkedGroupIds
if(reqCheckedGroupIdsNotEmpty)
	checkedGroupIds = reqCheckedGroupIds;
// set save checked group interval
if(chkGroup.length > 0)
	setInterval(saveCheckedGroup, 10000);
//_____________________________init