//******************** definitions
var modals = $('.modal');
var modal_dialog = $('.modal-dialog'); 
var processModal = $('#processModal');
var settingModal = $('#settingModal');
var sliders = $('.slider');
var modeButtons = $('.btn-mode');
var settingButtons = $('.btn-setting');
var updateSensorTypeDiv = $('.update-sensortype-div');
var targetIll = $('#targetIll');
var targetIllDiv = $('#targetIllDiv');
var onPower = $('#onPower');
var onPowerDiv = $('#onPowerDiv');
var offPower = $('#offPower');
var offPowerDiv = $('#offPowerDiv');
var btnCommitSetting = $('.btn-commitSetting');

var groupIds = null;
var groupIdsArr = null;
var dimLevelBefore = null;
var groupData = null;
var updateData = null;
var errorMessage = '状態変更が行えませんでした。';
var levelSuccessMessage = '状態変更が成功しました。';

var sensorPanels = $('.sensor-panel');
var groupChecks = $('.groupCheck');

let intervalTime = 10000;
//==================== definitions

//******************** functions
//***** modal adjusted width
modals.on('shown.bs.modal', function () {
	
	var screenWidth = document.body.clientWidth;
	// phone < 768
	if(screenWidth < 768)
		modal_dialog.css('width', '80%');
	else if(screenWidth < 992)
		modal_dialog.css('width', '60%');
	else if(screenWidth < 1200)
		modal_dialog.css('width', '50%');
	else
		modal_dialog.css('width', '40%');
});
//===== modal adjusted width

//***** 数字の検証
function validateNumber(element){
	
	var item = $(element);
	var itemDiv = $('#' + item.attr('id') + 'Div');
	itemDiv.removeClass('has-error');
	
	var value = parseInt(element.value);
	// 数字ではない
	if(isNaN(value)){
		
		itemDiv.addClass('has-error');
		
		return false;
	}
	
	return true;
}
//===== 数字の検証

//***** 失去焦点时验证输入的数字
targetIll.blur(function(){
	validateNumber(this);
});
onPower.blur(function(){
	validateNumber(this);
});
offPower.blur(function(){
	validateNumber(this);
});
//===== 失去焦点时验证输入的数字

//***** グループチェック動作
if(groupChecks.length > 0){
	
	groupChecks.change(function(){
		
		var item = $(this);
		var groupDiv = $('#' + item.val());
		if(item.prop('checked'))
			groupDiv.removeClass('d-none');
		else
			groupDiv.addClass('d-none');
	});
}
//===== グループチェック動作

//********** slider 動作
if(sliders.length > 0){
	
	sliders.slider({
		max: 100,
		min: 0,
		start: function(event, ui){
			dimLevelBefore = ui.value;
		},
		slide: function(event, ui) {
	    	$(this).find('.custom-handle').text(ui.value);
	    },
	    stop: function(event, ui){
			
			if(dimLevelBefore != ui.value){
				
				processModal.modal('show');
				processModal.find('.progress').removeClass('d-none');
				processModal.find('.modal-header').addClass('d-none');
				processModal.find('#processMessage').addClass('d-none');
				
				var item = $(this);
				var groupId = item.attr('data-groupId');
				$.ajax({
					url: contextPath + '/Ajax/DimmingGroup/AutoManualSwitch.action',
					async: true,
					cache: false,
					data: {groupId: groupId, status: ui.value},
					groupId: groupId,
					success: function(response){
						
						processModal.find('.progress').addClass('d-none');
						processModal.find('.modal-header').removeClass('d-none');
						processModal.find('#processMessage').attr('class', '');

						var respObj = JSON.parse(response);
						if(respObj.error == null && respObj.response.groupStatus == 'y')
							processModal.find('#processMessage').html(levelSuccessMessage);
						else{
							
							processModal.find('#processMessage').html(errorMessage);
							processModal.find('#processMessage').addClass('error');
							
							var sl = sliders.filter('[data-groupId="' + this.groupId + '"]');
							sl.slider('value', dimLevelBefore);
							sl.find('.custom-handle').text(dimLevelBefore);
						}
					},
					error: function(){
						
						processModal.find('.progress').addClass('d-none');
						processModal.find('.modal-header').removeClass('d-none');
						processModal.find('#processMessage').removeClass('d-none');
						
						processModal.find('#processMessage').html(errorMessage);
						processModal.find('#processMessage').addClass('error');
					}
				});
			}
	    }
	});
}
//========== slider 動作

//********** 自動手動切替ボタン
modeButtons.click(function(){
	
	var item = $(this);
	var groupId = item.attr('data-groupId');
	
	processModal.modal('show');
	processModal.find('.progress').removeClass('d-none');
	processModal.find('.modal-header').addClass('d-none');
	processModal.find('#processMessage').addClass('d-none');
	
	$.ajax({
		url: contextPath + '/Ajax/DimmingGroup/AutoManualSwitch.action',
		data: {groupId: groupId},
		async: true,
		cache: false,
		groupId: groupId,
		success: function(response){
			
			processModal.find('.progress').addClass('d-none');
			processModal.find('.modal-header').removeClass('d-none');
			processModal.find('#processMessage').attr('class', '');
			
			var respObj = JSON.parse(response);
			if(respObj.error == null){
				
				// グループの状態
				if(respObj.response.groupStatus == 'y')
					processModal.find('#processMessage').html(levelSuccessMessage);
				else{
					
					processModal.find('#processMessage').html(errorMessage);
					processModal.find('#processMessage').addClass('error');
				}						
			}else{
				
				processModal.find('#processMessage').html(errorMessage);
				processModal.find('#processMessage').addClass('error');
			}
		},
		error: function(){
			
			processModal.find('.progress').addClass('d-none');
			processModal.find('.modal-header').removeClass('d-none');
			processModal.find('#processMessage').attr('class', '');
			
			processModal.find('#processMessage').html(errorMessage);
			processModal.find('#processMessage').addClass('error');
		}
	});
});
//========== 自動手動切替ボタン

//********** 設定変更ボタン
settingButtons.click(function(){
	
	updateSensorTypeDiv.addClass('d-none');
	updateData = {};
	
	var item = $(this);
	var groupId = item.attr('data-groupId');
	var dataObj = groupData[groupId];
	var sensorType = dataObj.mode.sensorType;
	
	updateData.groupId = groupId;
	updateData.sensorType = sensorType;
	updateData.sensorId = dataObj.setting.sensorId;
	
	$('.' + sensorType).removeClass('d-none');
	
	if(sensorType == 'il'){
		
		targetIllDiv.removeClass('has-error');
		
		targetIll.val('');
		if(dataObj.setting.targetIll != null)
			targetIll.val(dataObj.setting.targetIll);
	}else{
		
		onPower.val('');
		offPower.val('');
		onPowerDiv.removeClass('has-error');
		offPowerDiv.removeClass('has-error');
		
		if(dataObj.setting.onPower != null)
			onPower.val(dataObj.setting.onPower);
		
		if(dataObj.setting.offPower != null)
			offPower.val(dataObj.setting.offPower);
	}
		
	settingModal.modal('show');
});
//========== 設定変更ボタン

//********** 提交修改值 
btnCommitSetting.click(function(){
	
	if($('.has-error').length > 0)
		return;
	
	var isChanged = false;
	var dataObj = groupData[updateData.groupId];
	if(updateData.sensorType == 'il'){
		
		if(dataObj.setting.targetIll != targetIll.val()){
			
			isChanged = true;
			updateData.targetIll = parseInt(targetIll.val());
		}
	}else{
		
		if(dataObj.setting.onPower != onPower.val()){
			
			isChanged = true;
			updateData.onPower = parseInt(onPower.val());
		}
		
		if(dataObj.setting.offPower != offPower.val()){
			
			isChanged = true;
			updateData.offPower = parseInt(offPower.val());
		}
	}
	
	settingModal.modal('hide');
	processModal.modal('show');
	
	if(!isChanged){
		
		processModal.find('.progress').addClass('d-none');
		processModal.find('.modal-header').removeClass('d-none');
		processModal.find('#processMessage').attr('class', '');
		
		processModal.find('#processMessage').html("変更されていません。");
		processModal.find('#processMessage').addClass('error');
		
		return;
	}
	
	// 自動手動
	updateData.mode = dataObj.mode.mode;
	
	processModal.find('.progress').removeClass('d-none');
	processModal.find('.modal-header').addClass('d-none');
	processModal.find('#processMessage').addClass('d-none');
	// 変更をコミットする
	$.ajax({
		url: contextPath + '/Mobile/Illumination/UpdateGroupSetting.mo',
		async: true,
		cache: false,
		data: updateData,
		success: function(response){
			
			processModal.find('.progress').addClass('d-none');
			processModal.find('.modal-header').removeClass('d-none');
			processModal.find('#processMessage').attr('class', '');
			
			var respObj = JSON.parse(response);
			if(respObj.error != null){
				
				processModal.find('#processMessage').html('リクエスト処理ができませんでした。');
				processModal.find('#processMessage').addClass('error');
			}else
				processModal.find('#processMessage').html('変更されました。');
		},
		error: function(){
			
			processModal.find('.progress').addClass('d-none');
			processModal.find('.modal-header').removeClass('d-none');
			processModal.find('#processMessage').attr('class', '');
			
			processModal.find('#processMessage').html('リクエスト処理ができませんでした。');
			processModal.find('#processMessage').addClass('error');
		}
	});
});

//========== 提交修改值 

//********** ajaxでリアルタイムデータ取得
function getRealTimeData(){
	
	$.ajax({
		url: contextPath + '/Mobile/Illumination/RealtimeData.mo',
		async: true,
		cache: false,
		method: 'post',
		data: 'groupIds=' + groupIds,
		success: function(response){
			
			var respObj = JSON.parse(response);
			groupData = respObj;
			
			var groupObj = null;
			var groupId = null;
			
			for(var i = 0; i < groupIdsArr.length; i++){
				
				groupId = groupIdsArr[i];
				groupObj = respObj[groupId];
				if(groupObj != null){
					
					//********** モード
					var modeObj = groupObj.mode;
					//***** モードテキスト
					$('#mode' + groupId).html(modeObj.status);
					//===== モードテキスト
					//***** センサータイプ
					if(modeObj.sensorTypeValue != null)
						$('#sensorType' + groupId).html('(' + modeObj.sensorTypeValue + ')');
					else
						$('#sensorType' + groupId).html('');
					//===== センサータイプ
					//***** 自動手動ボタン
					if(modeObj.sensorType != null)
						modeButtons.filter('[data-groupId="' + groupId + '"]').prop('disabled', false);
					else
						modeButtons.filter('[data-groupId="' + groupId + '"]').prop('disabled', true);
					//===== 自動手動ボタン
					//========== モード
					
					//********** 調光レベル
					var levelObj = groupObj.level;
					//***** レベル
					$('#dimLevel' + groupId).html(levelObj.level);
					var slider = sliders.filter('[data-groupId="' + groupId + '"]');
					slider.slider('value', levelObj.level);
					slider.find('.custom-handle').text(levelObj.level);
					//===== レベル
					//***** スライダー
					// 手動の場合スライダーを表示
					if(modeObj.mode == 0)
						sliders.filter('[data-groupId="' + groupId + '"]').slider('enable');
					else // 自動と不明の場合スライダーを非表示
						sliders.filter('[data-groupId="' + groupId + '"]').slider('disable');
					//===== スライダー
					//========== 調光レベル
					
					//********** 設定
					var settingObj = groupObj.setting;
					if(settingObj.key != null){
						
						$('#settingKey' + groupId).html(settingObj.key);
						
						if(settingObj.value != null)
							$('#settingValue' + groupId).html(': ' + settingObj.value);
						else
							$('#settingValue' + groupId).html(': -');
						
						if(settingObj.unit != null)
							$('#settingUnit' + groupId).html(' ' + settingObj.unit);
						else
							$('#settingUnit' + groupId).html('');
						
						settingButtons.filter('[data-groupId="' + groupId + '"]').prop('disabled', false);
					}else{
						
						$('#settingKey' + groupId).html('設定なし');
						$('#settingValue' + groupId).html('');
						$('#settingUnit' + groupId).html('');
						
						settingButtons.filter('[data-groupId="' + groupId + '"]').prop('disabled', true);
					}
					//========== 設定
				}
			}
			
			setTimeout(getRealTimeData, intervalTime);
		},
		error: function(request, textStatus, error){
			
			console.log(textStatus + ':' + error);
			setTimeout(getRealTimeData, intervalTime);
		}
	});
}
//===== ajaxでリアルタイムデータ取得
//==================== functions