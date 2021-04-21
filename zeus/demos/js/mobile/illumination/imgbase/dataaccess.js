//***** 位置情報保存ボタン動作 
btnSavePosition.click(function(){
	
	if(groupPosition != null){
		
		var gp = JSON.stringify(groupPosition);
		var param = {};
		param.groupPosition = gp;
		
		$.ajax({
			url: contextPath + '/Mobile/Illumination/SaveDimmingGroupPosition.mo',
			async: true,
			cache: false,
			data: param,
			success: function(){
				console.log('save dimming group position success.');
			},
			error: function(){
				console.log('save dimming group position error.');
			}
		});
	}
});
//_____ 位置情報保存ボタン動作

//***** 調光グループデータ取得
function getRealTimeData(){
	
	var param = {};
	param.groupIds = groupIds;
	
	$.ajax({
		url: contextPath + '/Mobile/Illumination/RealtimeData.mo',
		async: true,
		cache: false,
		method: 'POST',
		data: param,
		success: function(response){
			
			var respObj = JSON.parse(response);
			dimmingGroupData = respObj;
			
			var groupIdsArr = groupIds.split(',');
			for(var i = 0; i < groupIdsArr.length; i++){
				
				var groupId = groupIdsArr[i];
				var groupObj = respObj[groupId];
				if(groupObj != null){
					
					var dg = divDragResize.filter('#' + groupId);
					var amSwitch = dg.find('#i-am-switch');
					var dgSensorType = dg.find('#div-sensor-type');
					var dl = dg.find('#div-dimming-level');
					var iSetting = dg.find('#i-setting');
					
					var modeObj = groupObj.mode;
					//*************** 自動手動
					//***** 動く/動かない
					if(amSwitch.attr('class').indexOf('fa-spinner') < 0){
						
						if(modeObj.mode != null && modeObj.mode == 1){
	
							amSwitch.css('color', 'green');
							amSwitch.addClass('fa-spin');
						}else{
							
							amSwitch.css('color', 'gray');
							amSwitch.removeClass('fa-spin');
						}
					}
					//_____ 動く/動かない
					//***** 押せる/押せない
					if(modeObj.sensorType != null){
						
						amSwitch.css('cursor', 'pointer');
						amSwitch.attr('onclick', 'onIAmSwitchClick(this);');
					}else{
						
						amSwitch.css('cursor', 'auto');
						amSwitch.removeAttr('onclick');
					}
					//***** 押せる/押せない
					//_______________ 自動手動
					
					//*************** 人感/照度
					if(modeObj.sensorType == null)
						dgSensorType.empty();
					else{
						
						if(modeObj.sensorType == 'il')
							dgSensorType.html(iModeIll);
						else
							dgSensorType.html(iModeMotion);
					}
					//_______________ 人感/照度
					
					//********** 調光レベル
					var levelObj = groupObj.level;
					dl.html(levelObj.level + '%');
					//========== 調光レベル
				}
			}
		},
		error: function(request, textStatus, error){
			console.log(textStatus + ':' + error);
		}
	});
}
//_____ 調光グループデータ取得

//***** 自動/手動切替
function onIAmSwitchClick(iAm){
	
	var item = $(iAm);
	var iAmClass = item.attr('class');
	item.attr('class', iSpinnerClass);
	var iAmColor = item.css('color');
	var dgId = item.parent().parent().parent().parent().attr('id');
	
	var param = {};
	param.groupId = dgId;
	
	$.ajax({
		url: contextPath + '/Ajax/DimmingGroup/AutoManualSwitch.action',
		data: param,
		async: true,
		cache: false,
		groupId: dgId,
		iAmClass: iAmClass,
		iAmColor: iAmColor,
		success: function(response){
			
			var amSwitch = divDragResize.filter('[id="' + this.groupId + '"]').find('#i-am-switch');
			amSwitch.attr('class', this.iAmClass);
			amSwitch.css('color', this.iAmColor);
			
			var respObj = JSON.parse(response);
			if(respObj.error == null){
				
				// グループの状態
				if(respObj.response.groupStatus == 'y'){
					
					if(this.iAmClass.indexOf('fa-spin') >= 0){
						
						amSwitch.removeClass('fa-spin');
						amSwitch.css('color', 'green');
					}else{
						
						amSwitch.addClass('fa-spin');
						amSwitch.css('color', 'gray');
					}
				}					
			}
		},
		error: function(){
			
			var amSwitch = divDragResize.filter('[id="' + this.groupId + '"]').find('#i-am-switch');
			amSwitch.attr('class', this.iAmClass);
			amSwitch.css('color', this.iAmColor);
		}
	});
}
//_____ 自動/手動切替

//***** 設定変更ボタン動作
btnSettingCommit.click(function(){
	
	spanSettingUpdateStatus.hide();
	var errorSize = modalSetting.find('.has-error').length;
	if(errorSize > 0)
		return;
	
	var param = {};
	var groupId = dimmingGroupUpdateStatus.groupId;
	var dgData = dimmingGroupData[groupId];
	var amMode = dgData.mode.mode;
	// 設定変更
	var divIl = modalSetting.find('#div-setting-il');
	var divMo = modalSetting.find('#div-setting-mo');
	
	var isVisibleIl = divIl.css('display') != 'none';
	var isVisibleMo = divMo.css('display') != 'none';
	if(isVisibleIl || isVisibleMo){
		
		// 照度センサーの場合
		if(isVisibleIl){
			
			var currentTarget = dgData.setting.targetIll;
			var editTarget = $.trim(textTargetIll.val());
			if(currentTarget != editTarget){
				
				param.targetIll = editTarget;
				param.sensorId = dgData.setting.sensorId;
			}
		}else{
			
			var currentOnPower = dgData.setting.onPower;
			var editOnPower = $.trim(textOnPower.val());
			if(currentOnPower != editOnPower)
				param.onPower = editOnPower;
			
			var currentOffPower = dgData.setting.offPower;
			var editOffPower = $.trim(textOffPower.val());
			if(currentOffPower != editOffPower)
				param.offPower = editOffPower;
			
			if(Object.keys(param).length > 0)
				param.sensorId = dgData.setting.sesnorId;
		}
	}else
		dimmingGroupUpdateStatus.settingStatus = 1;
	
	if( Object.keys(param).length > 0){
		
		param.mode = dgData.mode.mode;
		param.groupId = groupId;
		
		var divIEdit = divDragResize.filter('#' + groupId).find('#div-i-edit');
		var iEdit = divIEdit.html();
		divIEdit.html(iSpinner);
		btnSettingCommit.button('loading');
		btnSettingCancel.prop('disabled', true);
		
		$.ajax({
			url: contextPath + '/Mobile/Illumination/UpdateGroupSetting.mo',
			async: true,
			cache: false,
			data: param,
			iEdit: iEdit,
			groupId: groupId,
			success: function(response){
				
				spanSettingUpdateStatus.show();
				var respObj = JSON.parse(response);
				if(respObj.error != null){
					
					spanSettingUpdateStatus.find('#failed').show();
					spanSettingUpdateStatus.find('#success').hide();
				}else{
					
					spanSettingUpdateStatus.find('#success').show();
					spanSettingUpdateStatus.find('#failed').hide();
				}
				
				var divIEdit = divDragResize.filter('#' + this.groupId).find('#div-i-edit');
				divIEdit.html(this.iEdit);
				
				btnSettingCommit.button('reset');
				btnSettingCancel.prop('disabled', false);
			},
			error: function(){
				
				var divIEdit = divDragResize.filter('#' + this.groupId).find('#div-i-edit');
				divIEdit.html(this.iEdit);
				
				btnSettingCommit.button('reset');
				btnSettingCancel.prop('disabled', false);
				
				spanSettingUpdateStatus.show();
				spanSettingUpdateStatus.find('#failed').show();
				spanSettingUpdateStatus.find('#success').hide();
			}
		});
	}
});
//_____ 設定変更ボタン動作