var notEditedErrorMessage = '現在の状態が変更されていません。';
var invalideStatusErrorMessage = '0から100の間の数字を入力してください！';
var errorMessage = '状態変更が行えませんでした。';
var levelSuccessMessage = '状態変更が成功しました。';
var currentstatusLabel;
var levelPopup = $('#popupwindow');
var statusText = $('#statusText');

let intervalTime = 10000;

function openModifyWindow(statusId){
	
	currentstatusLabel = "currentstatus" + statusId;
	
	var curStatusValue = document.getElementById(currentstatusLabel).innerText;
	// firefox
	if(curStatusValue == undefined)
		curStatusValue = document.getElementById(currentstatusLabel).textContent;
	
	document.getElementById("statusText").value = curStatusValue;
	
	levelPopup.modal('show');
}

function closePopupWindow(){
	levelPopup.modal('hide');
}

function submit(){
	
	if(confirm("変更を確定しますか？")){
		
		var status = statusText.val();
		if(status.match(/^[0-9].*$/) && status >= 0 && status <= 100){
			
			var currentStatus = $('#' + currentstatusLabel).html();
			var groupId = currentstatusLabel.replace('currentstatus', '');
			var groupAlert = $('#alert' + groupId);
			
			if(currentStatus == status){
				
				groupAlert.html(notEditedErrorMessage);
				groupAlert.removeClass('alert-success');
				groupAlert.addClass('alert-danger');
				groupAlert.removeClass('hide');
				
				setTimeout(function(){
					$('#alert' + groupId).addClass('hide');
				}, 3000);
				
			}else{
				
				$('#currentLevelEditButton' + groupId).button('loading');
				$('#manualAutoSwitchButton' + groupId).prop('disabled', true);
				
				$.ajax({
					url: contextPath + 'Ajax/DimmingGroup/AutoManualSwitch.action',
					async: true,
					cache: false,
					data: {groupId: groupId, status: status},
					groupId: groupId,
					success: function(response){
						
						var respObj = JSON.parse(response);
						
						if(respObj.error == null){
							
							// グループの状態
							if(respObj.response.groupStatus == 'y'){
								
								groupAlert.html(levelSuccessMessage);
								groupAlert.addClass('alert-success');
								groupAlert.removeClass('alert-danger');
							}else{
								
								groupAlert.html(errorMessage);
								groupAlert.removeClass('alert-success');
								groupAlert.addClass('alert-danger');
							}						
							
							groupAlert.removeClass('hide');
							
							setTimeout(function(){
								$('#alert' + groupId).addClass('hide');
							}, 3000);
							
							// 各デバイスの状態
							for(var key in respObj.response.deviceStatus){
									
								if(respObj.response.deviceStatus[key] == 'n')
									$('#deviceStatusSpan' + this.groupId + key).removeClass('hide');
								else
									$('#deviceStatusSpan' + this.groupId + key).addClass('hide');
							}
						}else{
							
							groupAlert.html(errorMessage);
							groupAlert.removeClass('alert-success');
							groupAlert.addClass('alert-danger');
							groupAlert.removeClass('hide');
							
							setTimeout(function(){
								$('#alert' + groupId).addClass('hide');
							}, 3000);
						}
						
						$('#currentLevelEditButton' + this.groupId).button('reset');
						$('#manualAutoSwitchButton' + groupId).prop('disabled', false);
					},
					error: function(){
						
						$('#currentLevelEditButton' + this.groupId).button('reset');
						$('#manualAutoSwitchButton' + groupId).prop('disabled', false);
					}
				});
			}
		}else{
			
			groupAlert.html(invalideStatusErrorMessage);
			groupAlert.removeClass('alert-success');
			groupAlert.addClass('alert-danger');
			groupAlert.removeClass('hide');
			
			setTimeout(function(){
				$('#alert' + groupId).addClass('hide');
			}, 3000);
		}
	}
	
	levelPopup.modal('hide');
}

function manualAutoSwitch(groupId){
	
	$('#manualAutoSwitchButton' + groupId).button('loading');
	$('#currentLevelEditButton' + groupId).prop('disabled', true);
	
	$.ajax({
		url: contextPath + 'Ajax/DimmingGroup/AutoManualSwitch.action',
		data: {groupId: groupId},
		async: true,
		cache: false,
		groupId: groupId,
		success: function(response){
			
			var respObj = JSON.parse(response);
			var groupAlert = $('#alert' + groupId);
			
			if(respObj.error == null){
				
				// グループの状態
				if(respObj.response.groupStatus == 'y'){
					
					groupAlert.html(levelSuccessMessage);
					groupAlert.addClass('alert-success');
					groupAlert.removeClass('alert-danger');
				}else{
					
					groupAlert.html(errorMessage);
					groupAlert.removeClass('alert-success');
					groupAlert.addClass('alert-danger');
				}						
				
				groupAlert.removeClass('hide');
				
				setTimeout(function(){
					$('#alert' + groupId).addClass('hide');
				}, 3000);
				
				// 各デバイスの状態
				for(var key in respObj.response.deviceStatus){
						
					if(respObj.response.deviceStatus[key] == 'n')
						$('#deviceStatusSpan' + this.groupId + key).removeClass('hide');
					else
						$('#deviceStatusSpan' + this.groupId + key).addClass('hide');
				}
			}else{
				
				groupAlert.html(errorMessage);
				groupAlert.removeClass('alert-success');
				groupAlert.addClass('alert-danger');
				groupAlert.removeClass('hide');
				
				setTimeout(function(){
					$('#alert' + groupId).addClass('hide');
				}, 3000);
			}
			
			$('#manualAutoSwitchButton' + this.groupId).button('reset');
			$('#currentLevelEditButton' + this.groupId).prop('disabled', false);
		},
		error: function(){
			
			$('#manualAutoSwitchButton' + groupId).button('reset');
			$('#currentLevelEditButton' + groupId).prop('disabled', false);
		}
	});
}

if(reqGroupIds != ''){
	
	getGroupCurrentStatus();
	
	getGroupStatus();
}

function getGroupCurrentStatus(){
	
	$.ajax({
		url: contextPath + 'Ajax/DimmingGroup/GetCurrentStatus.action',
		async: true,
		type: 'post',
		cache: false,
		data: {groupIds: reqGroupIds},
		success: function(response){
			
			let respObj = JSON.parse(response);
			if(respObj.error != null)
				console.log('error: sync server unreachable..');
			else{
				
				let respJson = respObj.data;
				for(var i = 0; i < respJson.length; i++)
					$('#currentstatus' + respJson[i].id).html(respJson[i].currentstatus);
			}
			
			setTimeout(getGroupCurrentStatus, intervalTime);
		},
		error: function(){
			setTimeout(getGroupCurrentStatus, intervalTime);
		}
	});
}

function getGroupStatus(){
	
	$.ajax({
		url: contextPath + 'Ajax/DimmingGroup/GetAutoManualStatus.action',
		async: true,
		cache: false,
		type: 'post',
		data: {groupIds: reqGroupIds},
		success: function(response){
			
			var respObj = JSON.parse(response);
			if(respObj.error != null)
				console.log('error: sync server unreachable');
			else{
				
				for(var i = 0; i < respObj.data.length; i++){
					
					$('#status' + respObj.data[i].id).html(respObj.data[i].status);
					
					if(respObj.data[i].statusValue == 1)
						$('#currentLevelEditButton' + respObj.data[i].id).prop('disabled', true);
					else if(respObj.data[i].statusValue == 0)
						$('#currentLevelEditButton' + respObj.data[i].id).prop('disabled', false);
					else{
						
						$('#manualAutoSwitchButton' + respObj.data[i].id).prop('disabled', true);
						$('#currentLevelEditButton' + respObj.data[i].id).prop('disabled', true);
					}
				}
			}
			
			setTimeout(getGroupStatus, intervalTime);
		},
		error: function(){
			setTimeout(getGroupStatus, intervalTime);
		}
	});
}