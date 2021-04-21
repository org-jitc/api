//******************** data access
//***** 位置情報保存ボタン動作 
btnSavePosition.click(function(){
	
	if(nodePosition != null){
		
		var np = JSON.stringify(nodePosition);
		var param = {};
		param.nodePosition = np;
		
		$.ajax({
			url: contextPath + '/Mobile/SimpleOperation/SaveNodePosition.mo',
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

//***** ajaxでリアルタイムデータ取得
function getRealTimeData(){
	
	$.ajax({
		url: contextPath + '/Mobile/SimpleOperation/RealtimeData.mo',
		async: true,
		cache: false,
		method: 'post',
		data: 'nodeIds=' + nodeIds,
		success: function(response){
			
			divStatusSuccess.removeClass('d-none');
			divStatusSuccess.addClass('d-flex');
			divStatusError.addClass('d-none');
			divStatusError.removeClass('d-flex');
			divPanelHeaders.removeClass('panel-header-error');
			
			var respObj = JSON.parse(response);
			nodeStatusData = respObj;
			/* modeObj:自動手動 
			 * scheduleObj:スケジュール状態
			 * statusObj:通常制御 
			 * currentObj:現在
			 * controlSettingObj:環境制御モードによる設定
			 */ 
			// operationSettingObj:通常省エネ運転設定
			var nodeId, nodeObj;
			
			for(var i = 0; i < nodeIdsArr.length; i++){
				
				nodeId = nodeIdsArr[i];
				nodeObj = respObj[nodeId];
				nodeObj.nodeId = nodeId;
				// 自動/手動
				status_obj.am = nodeObj;
				// 冷/暖
				status_obj.ch = nodeObj;
				// スケジュール
				status_obj.schedule = nodeObj;
				// デマンド
				status_obj.demand = nodeObj;
			}
		},
		error: function(request, textStatus, error){
			
			console.log('get realtime data error');
			
			divStatusSuccess.addClass('d-none');
			divStatusSuccess.removeClass('d-flex');
			divStatusError.removeClass('d-none');
			divStatusError.addClass('d-flex');
		}
	});
}
//_____ ajaxでリアルタイムデータ取得

//***** 自動/手動 スケジュールがある場合の切り替え
btnAmWithScheduleSubmit.click(function(){
	
	var nodeId = currentNode.nodeId;
	var ns = nodeStatusData[nodeId];
	var mode = ns.mode.mode;
	var scheduleStatus = ns.schedule.status;
	
	var radioChangeSchedule = modalAmWithSchedule.find('[name="radioChangeSchedule"]');
	var scheduleChangeStatus = radioChangeSchedule.filter(':checked').val();
	if(scheduleChangeStatus == 'change')
		scheduleStatus = scheduleStatus == 1? 0: 1;
	
	var param = {};
	param.nodeId = currentNode.nodeId;
	param.amStatus = mode == 0? 1: 0;
	param.onOffStatus = scheduleStatus;
	
	divMsgUpdateStatus.html('');
	btnAm.button('loading');
	
	$.ajax({
		url: contextPath + 'Ajax/SimpleOperationSchedule/AutoManualScheduleOnOffSwitch.action',
		async: true,
		cache: false,
		data: param,
		mode: mode,
		success: function(response){
			
			btnAm.button('reset');
			
			var resultObj = JSON.parse(response);
			if(resultObj.error != null){
				
				divMsgUpdateStatus.attr('class', 'text-danger');
				var errMsg = iDangerPrefix;
				
				if(resultObj.errorType != null)
					errMsg += '通常への切り替え中のため操作できません。';
				else{
					
					if(resultObj.error == 'sync')
						errMsg += '同期サーバに接続できませんでした。しばらくしてからリトライしてください。';
					else
						errMsg += '変更できませんでした。しばらくしてからリトライしてください。';
				}
				divMsgUpdateStatus.html(errMsg);
			}else{
				
				divMsgUpdateStatus.attr('class', 'text-success');
				var successMsg = iSuccessPrefix;
				if(this.mode == 0)
					successMsg += modeSuccessMsg.replace('{0}', '自動');
				else
					successMsg += modeSuccessMsg.replace('{0}', '手動');
				divMsgUpdateStatus.html(successMsg);
			}
			
			modalAmWithSchedule.modal('hide');
		},
		error: function(){
			
			btnAm.button('reset');
			
			divMsgUpdateStatus.attr('class', 'text-danger');
			divMsgUpdateStatus.html(iDangerPrefix + requestErrorMsg);
			
			modalAmWithSchedule.modal('hide');
		}
	});
});
//_____ 自動/手動 スケジュールがある場合の切り替え

//***** 自動/手動 スケジュールがない場合の切り替え
btnAmWithoutScheduleSubmit.click(function(){
	
	var nodeId = currentNode.nodeId;
	var ns = nodeStatusData[nodeId];
	var mode = ns.mode.mode;
	var status = ns.status.status;
	var onOffStatus = radioRecoverNY.filter(':checked').val();
	
	btnAm.button('loading');
	divMsgUpdateStatus.html('');
	modalAmWithoutSchedule.modal('hide');
	// スケジュールなし
	if(modalAmWithoutSchedule.find('#div-with-record').css('display') == 'none'){
		
		// 復旧しない
		if(onOffStatus == 0){
			
			var param = {};
			param.nodeId = nodeId;
			param.nodeControl = mode;
			param.conditions = status;
			
			$.ajax({
				url: contextPath + '/SimpleOperation/SimpleOperationList.do',
				type: 'post',
				async: true,
				cache: false,
				data: param,
				mode: mode,
				success: function(response){
					
					btnAm.button('reset');
					
					var respObj = JSON.parse(response);
					if(respObj.error != null){
						
						divMsgUpdateStatus.attr('class', 'text-danger');
						divMsgUpdateStatus.html(iDangerPrefix + '通常への切り替え中のため操作できません。');
					}else{
						
						divMsgUpdateStatus.attr('class', 'text-success');
						var msgSuccess = iSuccessPrefix;
						if(this.mode == 0)
							msgSuccess += modeSuccessMsg.replace('{0}', '自動');
						else
							msgSuccess += modeSuccessMsg.replace('{0}', '手動');
						divMsgUpdateStatus.html(msgSuccess);
					}
				},
				error: function(){
					
					btnAm.button('reset');
					divMsgUpdateStatus.attr('class', 'text-danger');
					divMsgUpdateStatus.html(iDangerPrefix + requestErrorMsg);
				}
			});
		}else{ // 復旧する
			
			var param = {};
			param.nodeId = nodeId;
			param.nodeControl = mode;
			param.mo = parseInt(modalAmWithoutSchedule.find('#mo').val());
			param.d = parseInt(modalAmWithoutSchedule.find('#d').val());
			param.h = parseInt(modalAmWithoutSchedule.find('#h').val());
			param.mi = parseInt(modalAmWithoutSchedule.find('#mi').val());
			// 手動から自動の場合、通常/制御を選ぶ
			if(mode == 0)
				param.onOffControl = 0;
			// 復旧スケジュールの追加
			$.ajax({
				url: contextPath + '/SimpleOperationSchedule/SimpleOperationScheduleRecoverAddComplete.do',
				mehtod: 'post',
				async: true,
				cache: false,
				data: param,
				mode: mode,
				success: function(response){
					
					btnAm.button('reset');
					
					if(response == ''){
						
						divMsgUpdateStatus.attr('class', 'text-danger');
						divMsgUpdateStatus.html(iDangerPrefix + requestErrorMsg);
					}else{
						
						divMsgUpdateStatus.attr('class', 'text-success');
						if(this.mode == 0)
							divMsgUpdateStatus.html(iSuccessPrefix + modeSuccessMsg.replace('{0}', '自動'));
						else
							divMsgUpdateStatus.html(iSuccessPrefix + modeSuccessMsg.replace('{0}', '手動'));
					}
				},
				error: function(){
					
					btnAm.button('reset');
					divMsgUpdateStatus.attr('class', 'text-danger');
					divMsgUpdateStatus.html(iDangerPrefix + requestErrorMsg);
				}
			});
		}
	}else{ // スケジュールあり
		
		var param = {};
		param.nodeId = nodeId;
		param.nodeControl = mode;
		
		$.ajax({
			url: contextPath + '/SimpleOperationSchedule/SimpleOperationScheduleRecoverDeleteByNode.do',
			type: 'post',
			async: true,
			data: param,
			mode: mode,
			success: function(response){
				
				btnAm.button('reset');
				if(response == ''){
					
					divMsgUpdateStatus.attr('class', 'text-danger');
					divMsgUpdateStatus.html(iDangerPrefix + requestErrorMsg);
				}else{
					
					divMsgUpdateStatus.attr('class', 'text-success');
					if(this.mode == 0)
						divMsgUpdateStatus.html(iSuccessPrefix + modeSuccessMsg.replace('{0}', '自動'));
					else
						divMsgUpdateStatus.html(iSuccessPrefix + modeSuccessMsg.replace('{0}', '手動'));
				}
			},
			error: function(){
				
				btnAm.button('reset');
				divMsgUpdateStatus.attr('class', 'text-danger');
				divMsgUpdateStatus.html(iDangerPrefix + requestErrorMsg);
			}
		});
	} 
});
//_____ 自動/手動 スケジュールがない場合の切り替え

//***** 通常/制御切り替え
btnNc.click(function(){
	
	var nodeId = currentNode.nodeId;
	var ns = nodeStatusData[nodeId];
	
	btnNc.button('loading');
	divMsgUpdateStatus.html('');
	
	var param = {};
	param.nodeId = nodeId;
	param.conditions = ns.status.status;
	
	$.ajax({
		url: contextPath + '/Ajax/SimpleOperation/NormalControlSwitch.action',
		async: true,
		cache: false,
		data: param,
		nodeId: nodeId,
		conditions: param.conditions,
		success: function(response){
			
			btnNc.button('reset');
			
			var respObj = JSON.parse(response);
			if(respObj.error != null){

				divMsgUpdateStatus.attr('class', 'text-danger');
    			if(this.conditions == 1)
    				divMsgUpdateStatus.html(iDangerPrefix + modeFailureMsg.replace('{0}', '通常'));
    			else
    				divMsgUpdateStatus.html(iDangerPrefix + modeFailureMsg.replace('{0}', '制御'));
    		}else{
    			
    			divMsgUpdateStatus.attr('class', 'text-success');
    			if(this.conditions == 1)
    				divMsgUpdateStatus.html(iSuccessPrefix + modeSuccessMsg.replace('{0}', '通常'));
    			else
    				divMsgUpdateStatus.html(iSuccessPrefix + modeSuccessMsg.replace('{0}', '制御'));
    		}
		},
		error: function(){
			
			btnNc.button('reset');
			divMsgUpdateStatus.attr('class', 'text-danger');
			if(this.conditions == 1)
				divMsgUpdateStatus.html(iDangerPrefix + modeFailureMsg.replace('{0}', '通常'));
			else
				divMsgUpdateStatus.html(iDangerPrefix + modeFailureMsg.replace('{0}', '制御'));
		}
	});
});
//_____ 通常/制御切り替え
//____________________ data access