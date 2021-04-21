//***** 調光グループ設定変更
function onIEditClick(iEdit){
	
	modalSetting.find('.has-error').removeClass('has-error');
	spanDlUpdateStatus.hide();
	spanSettingUpdateStatus.hide();
	
	var item = $(iEdit);
	var groupId = item.parent().parent().attr('id');
	//***** 設定変更用状態変数
	dimmingGroupUpdateStatus.groupId = groupId;
	dimmingGroupUpdateStatus.dimmingLevelStatus = 0;
	dimmingGroupUpdateStatus.settingStatus = 0;
	//_____ 設定変更用状態変数
	
	if(dimmingGroupData == null || dimmingGroupData[groupId] == null)
		return;
	else{
		
		var dgData = dimmingGroupData[groupId];
		var divNoSetting = modalSetting.find('#div-no-setting');
		divNoSetting.hide();
		//***** 調光レベルスライダー
		var divDl = modalSetting.find('#div-setting-dl');
		var amMode = dgData.mode.mode;
		if(amMode == 1)
			divDl.hide();
		else{
			
			divDl.show();
			var levelObj = dgData.level;
			var dimmingLevel = levelObj.level;
			divDLSlider.slider('value', dimmingLevel);
			divSliderHandle.html(dimmingLevel);
		}
		//_____ 調光レベルスライダー
		//********** 人感/照度センサー設定
		var divMo = modalSetting.find('#div-setting-mo');
		var divIl = modalSetting.find('#div-setting-il');
		var modeObj = dgData.mode;
		if(modeObj.sensorType == null){
			
			divMo.hide();
			divIl.hide();
		}else{
			
			var dgSetting = dgData.setting;
			if(modeObj.sensorType == 'il'){
				
				divIl.show();
				divMo.hide();
				
				if(dgSetting.targetIll == null)
					textTargetIll.val('');
				else
					textTargetIll.val(dgSetting.targetIll);
				textTargetIll.trigger('input');
			}else{
				
				divIl.hide();
				divMo.show();
				
				if(dgSetting.onPower == null)
					textOnPower.val('');
				else
					textOnPower.val(dgSetting.onPower);
				textOnPower.trigger('input');
				
				if(dgSetting.offPower == null)
					textOffPower.val('');
				else
					textOffPower.val(dgSetting.offPower);
				textOffPower.trigger('input');
			}
		}
		//__________ 人感/照度センサー設定
		
		var isDlVisible = divDl.css('display') != 'none';
		var isIlVisible = divIl.css('display') != 'none';
		var isMoVisible = divMo.css('display') != 'none';
		
		if(isDlVisible || isIlVisible || isMoVisible){
			
			divNoSetting.hide();
			if(isIlVisible || isMoVisible)
				btnSettingCommit.show();
			else
				btnSettingCommit.hide();
		}else{
			
			btnSettingCommit.hide();			
			divNoSetting.show();
		}
		modalSetting.modal('show');
	}
}
//_____ 調光グループ設定変更

//***** タブを切り替える時、タブ内容divの高さを図の高さに設定し，また図の大きさにより，調光グループの位置や大きさを調整する
//* jsで指定する理由は，タブ内容のdivの高さが0になっているため
aTab.on('shown.bs.tab', function(){
	resetPosition();
});
//_____　タブを切り替える時、タブ内容divの高さを図の高さに設定し，また図の大きさにより，調光グループの位置や大きさを調整する

//***** 調光グループ位置、大きさ再設定
function resetPosition(){
	
	var activeTabPane = divTabPane.filter('.active');
	var img = activeTabPane.find('img');
	activeTabPane.height(img.height());
	
	divDragResize.filter(':visible').each(function(){
		
		var item = $(this);
		var dgId = item.attr('id');
		var dgPosition = groupPosition[dgId];
		if(dgPosition != null){
			
			var width = item.parent().width();
			var height = item.parent().height();
			
			if(dgPosition.width != null){
				
				var dgWidth = width * dgPosition.width;
				if(dgWidth < 36)
					dgWidth = 36;
				item.css('width', dgWidth + 'px');
			}
			if(dgPosition.height != null){
				
				var dgHeight = height * dgPosition.height;
				if(dgHeight < 36)
					dgHeight = 36;
				item.css('height', dgHeight + 'px');
			}
			if(dgPosition.left != null)
				item.css('left', (width * dgPosition.left) + 'px');
			if(dgPosition.top != null)
				item.css('top', (height * dgPosition.top) + 'px');
		}
		
		var dgInfo = item.find('.div-info');
		dgInfo.each(function(){
			
			var dgi = $(this);
			dgi.css('font-size', parseInt(dgi.height() * 0.6) + 'px');
		});
	});	
}
//_____ グループ位置再設定

//***** 画面サイズが変わる場合に各グループの位置や大きさを再設定する
$(window).resize(function(){
	
	var item = $(this);
	// グループの大きさを変更する時も実行されるので，デバイスの画面サイズが変更された場合のみ位置を再設定する
	if(item.width() != windowWidth){
		
		resetPosition();
		windowWidth = item.width();
	}
});
//_____ 画面サイズが変わる場合に各グループの位置や大きさを再設定する

textTargetIll.bind('input propertychange', function(){
	
	var item = $(this);
	if(this.value == ''){
		
		item.parent().addClass('has-error');
		item.next().html(errMsgRequired);
	}else{
		
		var groupId = dimmingGroupUpdateStatus.groupId;
		var dgData = dimmingGroupData[groupId];
		var dgTarget = dgData.setting.targetIll;
		
		item.parent().removeClass('has-error');
		if(dgTarget == this.value)
			item.next().html(errMsgNotChange);
		else
			item.next().html('');
	}
});
textOnPower.bind('input propertychange', function(){
	
	var item = $(this);
	if(this.value == ''){
		
		item.parent().addClass('has-error');
		item.next().html(errMsgRequired);
	}else{
		
		var groupId = dimmingGroupUpdateStatus.groupId;
		var dgData = dimmingGroupData[groupId];
		var dgOnPower = dgData.setting.onPower;
		
		item.parent().removeClass('has-error');
		if(dgOnPower == this.value)
			item.next().html(errMsgNotChange);
		else
			item.next().html('');
	}
});
textOffPower.bind('input propertychange', function(){
	
	var item = $(this);
	if(this.value == ''){
		
		item.parent().addClass('has-error');
		item.next().html(errMsgRequired);
	}else{
		
		var groupId = dimmingGroupUpdateStatus.groupId;
		var dgData = dimmingGroupData[groupId];
		var dgOffPower = dgData.setting.offPower;
		
		item.parent().removeClass('has-error');
		if(dgOffPower == this.value)
			item.next().html(errMsgNotChange);
		else
			item.next().html('');
	}
});