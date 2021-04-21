//********** functions
//***** タブを切り替える時、タブ内容divの高さを図の高さに設定し，また図の大きさにより，調光グループの位置や大きさを調整する
//* jsで指定する理由は，タブ内容のdivの高さが0になっているため
aTab.on('shown.bs.tab', function(){
	resetPosition();
});
//_____　タブを切り替える時、タブ内容divの高さを図の高さに設定し，また図の大きさにより，調光グループの位置や大きさを調整する

$(document).on('show.bs.modal', '.modal', function(){
	
	 var zIndex = 1040 + (10 * $('.modal:visible').length);
     $(this).css('z-index', zIndex);
     setTimeout(function() {
         $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
     }, 0);
});

//***** 設定ポップアップでのノード状態のフォント、イメージサイズ
modalSetting.on('shown.bs.modal', function(){
	
	divMsgUpdateStatus.html('');
	
	var item = $(this);
	var btnHeight = item.find('#btn-am').height();
	item.find('.div-info-i').css('font-size', btnHeight + 'px');
	var statusImg = item.find('#img-status-nc');
	statusImg.width(btnHeight);
	statusImg.height(btnHeight);
	
	modalSetting.find('.has-error').removeClass('has-error');
	
	var nodeId = currentNode.nodeId;
	var ns = nodeStatusData[nodeId];
	var nodeBox = divDragResize.filter('#' + nodeId);
	//***** nodeName
	var nodeName = nodeBox.find('a').html();
	var divNodeName = item.find('#div-node-name');
	divNodeName.html(nodeName);
	//_____ nodeName
	//********** 自動/手動　通常/制御　スケジュール
	//***** 自動/手動
	var am = nodeBox.find('#span-status-am').html();
	var spanAm = item.find('#span-status-am');
	spanAm.html(am);
	//_____ 自動/手動
	//***** 冷/暖
	var ch = nodeBox.find('#span-status-ch');
	var spanCh = item.find('#span-status-ch');
	spanCh.html(ch.html());
	spanCh.attr('data-fa-transform', ch.attr('data-fa-transform'));
	spanCh.parent().find('.fa-square').css('color', ch.parent().find('.fa-square').css('color'));
	//_____ 冷/暖
	//***** 通常/制御
	var ncSrc = nodeBox.find('#img-status-nc').attr('src');
	var imgNc = item.find('#img-status-nc');
	imgNc.attr('src', ncSrc);
	//_____ 通常/制御
	//***** スケジュール
	var scheClass = nodeBox.find('#i-status-sche').attr('class');
	var scheStyle = nodeBox.find('#i-status-sche').attr('style');
	var iSche = item.find('#i-status-sche');
	iSche.attr('class', scheClass);
	iSche.attr('style', scheStyle);
	item.find('.fa-ban').remove();
	if(nodeBox.find('.fa-ban').length > 0)
		iSche.after('<i class="fas fa-ban"></i>');
	//_____ スケジュール
	
	//***** 自動/手動　通常/制御 disable
	if(ns.status.status == 2){
		
		btnAm.prop('disabled', true);
		btnNc.prop('disabled', true);
	}else{
		
		btnAm.prop('disabled', false);
		btnNc.prop('disabled', false);
	}
	//_____ 自動/手動　通常/制御 disabled
	//__________ 自動/手動　通常/制御　スケジュール
	
	var ns = nodeStatusData[nodeId];
	// 制御モード	
	var cm = ns.controlMode;
	// 環境制御モード
	var tcm = ns.controlSetting.temperatureControlMode;
	//***** 表示非表示
	divSettingEnv.hide();
	$('.tcm-' + tcm + '.cm-' + cm).show();
	// co2
	if(tcm != null){
		
		if(tcm == 5){
			
			cmCo2.show();
			cmNotCo2.hide();
		}else{
			
			cmCo2.hide();
			cmNotCo2.show();
		}
	}
	//===== 表示非表示
	
	//***** データ設定
	editData = {};
	// 省エネ運転時間
	if(ns.operationSetting.onMinute != null){
		
		onMinute.val(ns.operationSetting.onMinute);
		editData.onMinute = ns.operationSetting.onMinute;
	}else {
		
		onMinute.val('');
		editData.onMinute = '';
	}
	// 通常運転時間
	if(ns.operationSetting.offMinute != null){
		
		offMinute.val(ns.operationSetting.offMinute);
		editData.offMinute = ns.operationSetting.offMinute;
	}else {
		
		offMinute.val('');
		editData.offMinute = '';
	}
	// 目標電力
	if(ns.etee != null){
		
		etee.val(ns.etee);
		editData.etee = ns.etee;
	}else{
		
		etee.val('');
		editData.etee = '';
	}
	// 設定温度、CO2、許容誤差温度、CO2
	if(tcm == 1 || tcm == 5){
		
		if(tcm == 5){
			
			ttcHelp.html('0から10000までの数字を入力してください。');
			tthHelp.html('0から10000までの数字を入力してください。');
			otcHelp.html('0から1000までの数字を入力してください。')
			othHelp.html('0から1000までの数字を入力してください。')
		}else{
			
			ttcHelp.html('-50から1000までの数字を入力してください。（小数点以降は1位まで）');
			tthHelp.html('-50から1000までの数字を入力してください。（小数点以降は1位まで）');
			otcHelp.html('0.1から100までの数字を入力してください。（小数点以降は1位まで）')
			othHelp.html('0.1から100までの数字を入力してください。（小数点以降は1位まで）')
		}
		
		// 冷
		if(cm == 0 || cm == 2){
			
			if(ns.controlSetting.ttc != null){
				
				ttc.val(ns.controlSetting.ttc);
				editData.ttc = ns.controlSetting.ttc;
			}else {
				
				ttc.val('');
				editData.ttc = '';
			}
			
			if(ns.controlSetting.otc != null){
				
				otc.val(ns.controlSetting.otc);
				editData.otc = ns.controlSetting.otc;
			}else{
				
				otc.val('');
				editData.otc = '';
			}
		}
		
		if(cm == 1 || cm == 2){// 暖
			
			if(ns.controlSetting.tth != null){
				
				tth.val(ns.controlSetting.tth);
				editData.tth = ns.controlSetting.tth;
			}else{
				
				tth.val('');
				editData.tth = '';
			}
			
			if(ns.controlSetting.oth != null){
				
				oth.val(ns.controlSetting.oth);
				editData.oth = ns.controlSetting.oth;
			}else {
				
				oth.val('');
				editData.oth = '';
			}
		}
	}else if(tcm == 2 || tcm == 4){// 閾値温度、閾値不快指数
		
		// 冷
		if(cm == 0 || cm == 2){
			
			if(ns.controlSetting.wttco != null){
				
				wttco.val(ns.controlSetting.wttco);
				editData.wttco = ns.controlSetting.wttco;
			}else {
				
				wttco.val('');
				editData.wttco = '';
			}
			
			if(ns.controlSetting.wttc != null){
				
				wttc.val(ns.controlSetting.wttc);
				editData.wttc = ns.controlSetting.wttc;
			}else{
				
				wttc.val('');
				editData.wttc = '';
			}
			
			if(ns.controlSetting.wttcd != null){
				
				wttcd.val(ns.controlSetting.wttcd);
				editData.wttcd = ns.controlSetting.wttcd;
			}else {
				
				wttcd.val('');
				editData.wttcd = '';
			}
		}
	
		if(cm == 1 || cm == 2){// 暖
			
			if(ns.controlSetting.wttho != null) {
				
				wttho.val(ns.controlSetting.wttho);
				editData.wttho = ns.controlSetting.wttho;
			}else{
				
				wttho.val('');
				editData.wttho = '';
			}
			
			if(ns.controlSetting.wtth != null){
				
				wtth.val(ns.controlSetting.wtth);
				editData.wtth = ns.controlSetting.wtth;
			}else{
				
				wtth.val('');
				editData.wtth = '';
			}
			
			if(ns.controlSetting.wtthd != null){
				
				wtthd.val(ns.controlSetting.wtthd);
				editData.wtthd = ns.controlSetting.wtthd;
			}else {
				
				wtthd.val('');
				editData.wtthd = '';
			}
		}
	}
	//_____ データ設定
});
//_____ 設定ポップアップでのノード状態のフォント、イメージサイズ

//***** 調光グループ位置、大きさ再設定
function resetPosition(){
	
	var activeTabPane = divTabPane.filter('.active');
	var img = activeTabPane.find('#img-bg');
	activeTabPane.height(img.height());
	
	divDragResize.filter(':visible').each(function(){
		
		var item = $(this);
		var nodeId = item.attr('id');
		var np = nodePosition[nodeId];
		if(np != null){
			
			var width = item.parent().width();
			var height = item.parent().height();
			
			if(np.width != null){
				
				var nodeWidth = width * np.width;
				if(nodeWidth < minBoxSize)
					nodeWidth = minBoxSize;
				item.css('width', nodeWidth + 'px');
			}
			if(np.height != null){
				
				var nodeHeight = height * np.height;
				if(nodeHeight < minBoxSize)
					nodeHeight = minBoxSize;
				item.css('height', nodeHeight + 'px');
			}
			if(np.left != null)
				item.css('left', (width * np.left) + 'px');
			if(np.top != null)
				item.css('top', (height * np.top) + 'px');
		}
		var panelBody = item.find('.card-body');
		var panelBodyHeight = panelBody.height();
		var panelBodyWidth = panelBody.width() / statusCount;
		var containerSize = panelBodyHeight;
		if(panelBodyWidth < panelBodyHeight)
			containerSize = panelBodyWidth;
		var iFontSize = parseInt(containerSize * font_size_i_percent);
		// heading
		var heading = item.find('.card-header');
		heading.css('font-size', parseInt(heading.height() * font_size_heading_percent));
		// i
		var nodeInfoI = item.find('.div-info-i').css('font-size', iFontSize + 'px');
		
		var nodeInfoImg = item.find('img');
		nodeInfoImg.width(iFontSize);
		nodeInfoImg.height(iFontSize);
	});	
}
//_____ グループ位置再設定

//***** ノードの設定情報を表示
function openSetting(titleLink){
	
	var link = $(titleLink);
	var nodeId = link.parent().parent().attr('id');
	currentNode.nodeId = nodeId;
	
	modalSetting.modal('show');
}
//_____ ノードの設定情報を表示

//***** 設定変更コミット
function onSettingSubmit(){
	
	divMsgUpdateStatus.html('');
	var errorCount = modalSetting.find('.has-error').length;
	if(errorCount > 0)
		return;
	
	//***** 変化チェック
	var isChanged = false;
	for(var key in editData){
		
		var newData = $('#' + key).val();
		var origin = editData[key];
		
		if(newData == ''){
			
			if(origin != '')
				isChanged = true;
		}else{
			
			if(origin == '')
				isChanged = true;
			else{
				
				var newF = parseFloat(newData);
				var originF = parseFloat(origin);
				if(newF != originF)
					isChanged = true;
			}
		}
	}
	if(!isChanged){
		
		divMsgUpdateStatus.attr('class', 'text-danger');
		divMsgUpdateStatus.html(iDangerPrefix + '変更されていません。');
		
		return;
	}
	//===== 変化チェック
	
	//***** update
	for(var key in editData)
		editData[key] = $('#' + key).val();
	
	btnSettingSubmit.button('loading');
	btnSettingCancel.prop('disabled', true);
	
	$.ajax({
		url: contextPath + '/Mobile/SimpleOperation/UpdateSetting.mo',
		async: true,
		cache: false,
		method: 'post',
		data: {editData: JSON.stringify(editData), nodeId: currentNode.nodeId},
		success: function(response){
			
			divMsgUpdateStatus.attr('class', 'text-success');
			divMsgUpdateStatus.html(iSuccessPrefix + '設定情報が変更されました。');
			
			btnSettingSubmit.button('reset');
			btnSettingCancel.prop('disabled', false);
		},
		error: function(){
			
			divMsgUpdateStatus.attr('class', 'text-danger');
			divMsgUpdateStatus.html(iDangerPrefix + '設定情報変更ができませんでした。');
			
			btnSettingSubmit.button('reset');
			btnSettingCancel.prop('disabled', false);
		}
	});
	//===== update
}
//_____ 設定変更コミット

//***** 自動/手動切替
btnAm.click(function(){
	
	var item = $(this);
	var nodeId = currentNode.nodeId;
	var ns = nodeStatusData[nodeId];
	var nodeBox = divDragResize.filter('#' + nodeId);
	var nodeName = nodeBox.find('a').html();
	
	//********** スケジュールあるないによる処理
	//***** スケジュールあり
	if(ns.schedule.status != null){
		
		// node name
		modalAmWithSchedule.find('#span-node-name').html(nodeName);
		// mode to
		var spanToMode = modalAmWithSchedule.find('#span-to-mode');
		if(ns.mode.mode == 0)
			spanToMode.html(modeAutoStr);
		else
			spanToMode.html(modeManualStr);
		//***** on off raido
		var radioChangeSchedule = modalAmWithSchedule.find('[name="radioChangeSchedule"]');
		var spanNotChange = modalAmWithSchedule.find('#span-not-change');
		var spanChange = modalAmWithSchedule.find('#span-change');
		radioChangeSchedule.filter('[value="notChange"]').prop('checked', true);
		// スケジュールONの場合
		if(ns.schedule.status == 1){
			
			spanNotChange.html(scheduleKeepStr.replace('{0}', 'ON'));
			spanChange.html(scheduleToStr.replace('{0}', 'OFF'));
		}else{// スケジュールOFFの場合
			
			spanNotChange.html(scheduleKeepStr.replace('{0}', 'OFF'));
			spanChange.html(scheduleToStr.replace('{0}', 'ON'));
		}
		//_____ on off raido
		modalAmWithSchedule.modal('show');
	}
	//=====　スケジュールあり
	//***** スケジュールなし
	if(ns.schedule.status == null) {
		
		var param = {};
		param.nodeId = nodeId;
		param.nodeControl = ns.mode.mode;
		param.controlMode = ns.status.status;
		
		divMsgUpdateStatus.html('');
		btnAm.button('loading');
		
		$.ajax({
			url: contextPath + '/SimpleOperationSchedule/SimpleOperationScheduleRecoverAddConfirm.do',
			async: true,
			cache: false,
			type: 'post',
			data: param,
			success: function(response){
				
				btnAm.button('reset');
				
				if(response == ''){
					
					divMsgUpdateStatus.attr('class', 'text-danger');
					divMsgUpdateStatus.html(iDangerPrefix + couldNotChangeErrMsg);
				}else{
					
					var dataArr = response.split(',');
					modalAmWithoutSchedule.find('#span-node-name').html(dataArr[1]);
					var divWithoutRecord = modalAmWithoutSchedule.find('#div-without-record');
					var divWithRecord = modalAmWithoutSchedule.find('#div-with-record');
					// has recover schedule or not
					if(dataArr[0] == 'n'){
						
						divWithoutRecord.show();
						divWithRecord.hide();
						
						modalAmWithoutSchedule.find('#span-recover-n').html(dataArr[2]);
						modalAmWithoutSchedule.find('#span-recover-y').html(dataArr[3]);
						
						var radioNC = modalAmWithoutSchedule.find('[name="radioNC"]');
						// 手動から自動にする場合だけ表示
						if(ns.mode.mode == 0)
							radioNC.filter('[value="0"]').prop('checked', true);
					}else{
						
						divWithoutRecord.hide();
						divWithRecord.show();
						
						modalAmWithoutSchedule.find('#span-will-be-deleted').html(dataArr[2]);
						modalAmWithoutSchedule.find('#span-recover-date').html(dataArr[3]);
					}
					
					var now = new Date();
					var month = now.getMonth();
					month += 1;
					modalAmWithoutSchedule.find('#mo').val(zeus.getFormattedNumber(month));
					modalAmWithoutSchedule.find('#d').val(zeus.getFormattedNumber(now.getDate()));
					modalAmWithoutSchedule.find('#h').val(zeus.getFormattedNumber(now.getHours()));
					modalAmWithoutSchedule.find('#mi').val(zeus.getFormattedNumber(now.getMinutes()));
					// 復旧しないにチェック
					radioRecoverNY.filter('[value="0"]').prop('checked', true);
					radioRecoverNY.filter('[value="0"]').change();
	
					modalAmWithoutSchedule.modal('show');
				}
			}
		});
	}
	//===== スケジュールなし
});
//_____ 自動/手動切替

//***** 復旧チェック
radioRecoverNY.change(function(){
	
	var item = $(this);
	// 復旧しない
	if(item.val() == 0){
		
		modalAmWithoutSchedule.find('#mo').prop('disabled', true);
		modalAmWithoutSchedule.find('#d').prop('disabled', true);
		modalAmWithoutSchedule.find('#h').prop('disabled', true);
		modalAmWithoutSchedule.find('#mi').prop('disabled', true);
	}else {// 復旧する
		
		modalAmWithoutSchedule.find('#mo').prop('disabled', false);
		modalAmWithoutSchedule.find('#d').prop('disabled', false);
		modalAmWithoutSchedule.find('#h').prop('disabled', false);
		modalAmWithoutSchedule.find('#mi').prop('disabled', false);
	}
});
//===== 復旧チェック
//____________________ functions