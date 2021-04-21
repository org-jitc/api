var btnUnlock = $('.unlock');
var btnSetOrder = $('#btn-setSensorOrder');
var btnSaveOrder = $('#btn-saveSensorOrder');

var modalSetOrder = $('#modal-setOrder');

var divTabPaneElect = $('#div-tabPane-elect');
var divTabPaneEnv = $('#div-tabPane-env');
var divTabPaneNode = $('#div-tabPane-node');
var divTabPaneGroup = $('#div-tabPane-group');

var btnNewObj = {
	btn: $('#btn-dropdown-new'),
	links: null,
	modal: $('#modal-new'),
	divErrGlobal: null,
	divErrMsg: null,
	userList: null,
	userId: null,
	userPwd: null,
	userPwdConfirm: null,
	btnCopySubmit: null,
	validationData:{
		userId: null,
		userPwd: null,
		copyUserId: null
	},
	errMsg: {
		global: {
			reuqest: 'リクエスト処理ができませんでした。',
			sync: '同期サーバーに接続できませんでした。'
		},
		userId: {
			empty: 'ユーザーIDは必須です。',
			length: 'ユーザーIDが32文字を超えました。',
			notMatch: '英字（大文字）、英字（小文字）数字以外が入力されています。',
			exist: '既に登録されているユーザーIDです。'
		},
		userPwd: {
			empty: 'パスワードは必須です。',
			length: 'パスワードが32文字を超えました。',
			diff: 'ご希望のパスワードと確認の内容が一致しません。',
			notMatch: '英字（大文字）、英字（小文字）数字以外が入力されています。'
		},
		userList: {
			empty: 'コピー元ユーザーIDは必須です。'
		}
	},
	init: function(){
		
		// set button links
		this.links = this.btn.find('a');
		// set sync error div
		this.divErrGlobal = this.modal.find('#div-err-global');
		// every error messge div
		this.divErrMsg = this.modal.find('.err-msg');
		// set user id text
		this.userId = this.modal.find('#txt-user-id');
		// set user pwd text
		this.userPwd = this.modal.find('#txt-user-pwd');
		// set user pwd confirm text
		this.userPwdConfirm = this.modal.find('#txt-user-pwd-confirm');
		// set user list select
		this.userList = this.modal.find('#select-user');
		// set copy submit button
		this.btnCopySubmit = this.modal.find('#btn-copy-submit');
		
		this.modal.on('show.bs.modal', function(e){
			
			btnNewObj.divErrGlobal.addClass('hide');
			btnNewObj.divErrMsg.addClass('hide');
			
			btnNewObj.userId.val('');
			btnNewObj.userPwd.val('');
			btnNewObj.userPwdConfirm.val('');
			btnNewObj.userList.val('');
		});
		
		// set create user button actions 
		this.links.click(function(){
			
			var item = $(this);
			var createType = item.attr('data-create-type');
			if(createType == 'new')
				document.location.href = contextPath + 'User/UserRegisterInput.do';
			else
				btnNewObj.modal.modal('show');
		});
		
		// set copy submit button action
		this.btnCopySubmit.click(function(){
			
			btnNewObj.divErrGlobal.addClass('hide');
			btnNewObj.divErrMsg.addClass('hide');
			
			var data;
			
			var param = {};
			// user id
			data = $.trim(btnNewObj.userId.val());
			if(data != '')
				param.userId = data;
			// pwd
			data = $.trim(btnNewObj.userPwd.val());
			if(data != '')
				param.pwd = data;
			// pwd confirm
			data = $.trim(btnNewObj.userPwdConfirm.val());
			if(data != '')
				param.pwdConfirm = data;
			// copy id
			data = $.trim(btnNewObj.userList.val());
			if(data != '')
				param.copyId = data;
			
			btnNewObj.btnCopySubmit.bootstrapBtn('loading');
			$.ajax({
				url: contextPath + 'Ajax/User/Copy.action',
				async: true,
				cache: false,
				data: param,
				success: function(resp){
					
					try{
						var respObj = JSON.parse(resp);
						if(respObj.result == 'ok')
							document.location.href = contextPath + 'User/UserList.do';
						else{
							
							if(respObj.type == 'sync'){
								
								btnNewObj.divErrGlobal.text(btnNewObj.errMsg.global.sync);
								btnNewObj.divErrGlobal.removeClass('hide');
							}else{
								
								let err;
								for(let key in respObj.data){
									
									err = btnNewObj[key].prev();
									err.text(btnNewObj.errMsg[key][respObj.data[key]]);
									err.removeClass('hide');
								}
							}
						}
					}catch(e){
						
						btnNewObj.divErrGlobal.text(btnNewObj.errMsg.global.sync);
						btnNewObj.divErrGlobal.removeClass('hide');
					}
					
					btnNewObj.btnCopySubmit.bootstrapBtn('reset');
				},
				error:function(){
					
					btnNewObj.divErrGlobal.text(btnNewObj.errMsg.global.request);
					btnNewObj.divErrGlobal.removeClass('hide');
					
					btnNewObj.btnCopySubmit.bootstrapBtn('reset');
				}
			});
		});
	}
};
btnNewObj.init();

var errMsgRequestFail = 'リクエスト処理ができませんでした。';

var sensorArr = ['energy', 'env'];
var sensorOrder;

//******************** functions
//***** 順番指定ボタン動作
btnSetOrder.click(function(){
	loadSensorOrder();
});
//_____ 順番指定ボタン動作

//***** センサー順番保存
btnSaveOrder.click(function(){
	
	var ulEnergy = $('#ul-energy');
	var ulEnv = $('#ul-env');
	var ulNode = $('#ul-node');
	var ulGroup = $('#ul-group');
	
	if(ulEnergy.length > 0 || ulEnv.length > 0 || ulNode.length > 0 || ulGroup.length > 0){
		
		var param = {};
		if(ulEnergy.length > 0){
			
			param.energy = {};
			var li = ulEnergy.find('li');
			var sensorId;
			for(var i = 1, l = li.length; i <= l; i++){
				
				sensorId = $(li[i - 1]).attr('data-sensorId');
				param.energy[sensorId] = i;
			}
		}
		if(ulEnv.length > 0){
			
			param.env = {};
			var li = ulEnv.find('li');
			var sensorId;
			for(var i = 1, l = li.length; i <= l; i++){
				
				sensorId = $(li[i - 1]).attr('data-sensorId');
				param.env[sensorId] = i;
			}
		}
		if(ulNode.length > 0){
			
			param.node = {};
			var li = ulNode.find('li');
			var sensorId;
			for(var i = 1, l = li.length; i <= l; i++){
				
				sensorId = $(li[i - 1]).attr('data-sensorId');
				param.node[sensorId] = i;
			}
		}
		if(ulGroup.length > 0){
			
			param.group = {};
			var li = ulGroup.find('li');
			var sensorId;
			for(var i = 1, l = li.length; i <= l; i++){
				
				sensorId = $(li[i - 1]).attr('data-sensorId');
				param.group[sensorId] = i;
			}
		}
		
		$.ajax({
			url: contextPath + 'Ajax/User/SaveSensorOrder.action',
			type: 'POST',
			async: true,
			cache: false,
			data: {data: JSON.stringify(param)},
			success: function(resp){
				
				let respObj = JSON.parse(resp);
				if(respObj.error == null)
					alert('センサーの表示順が変更されました。');
				else
					alert('同期サーバーに接続できないため，保存できませんでした。');
			},
			error: function(){
				alert('センサーの表示順変更時にエラーが発生しました。');
			}
		});
	}
});
//_____ センサー順番保存

$('#ul-tabs-sensors a').click(function(){
	$(this).tab('show');
});

if(btnUnlock.length > 0){
	
	btnUnlock.attr('data-loading-text', '解除中...');
	
	btnUnlock.click(function(){
		
		var item = $(this);
		var userId = item.attr('data-userId');
		item.bootstrapBtn('loading');
		
		$.ajax({
			url: contextPath + 'Ajax/User/Unlock.action',
			async: true,
			cache: false,
			data: {userId: userId},
			item: item,
			success: function(){
				
				item.bootstrapBtn('reset');
				item.hide();
				$('#span-lock-status-' + item.attr('data-userId')).hide();
			},
			error: function(){
				alert(errMsgRequestFail);
			}
		});
	});
}

//*****　順番をとってくる
function loadSensorOrder(){
	
	$.ajax({
		url: contextPath + 'Ajax/User/GetSensorOrder.action',
		async: true,
		cache: false,
		success: function(response){
			
			var respObj = JSON.parse(response);
			
			if(respObj.elect != null){
				
				var ul = $('<ul id="ul-energy">');
				ul.attr('class', 'ul-sortable list-group mt');
				var li;
				var sensorName;
				for(var i in respObj.elect){
					
					li = $('<li>');
					li.attr('class', 'list-group-item');
					li.attr('data-sensorId', respObj.elect[i].sensorId);
					
					sensorName = respObj.elect[i].sensorName;
					if(respObj.elect[i].sensorTypeName != null)
						sensorName += ': ' + respObj.elect[i].sensorTypeName;
					
					li.html(sensorName);
					ul.append(li);
				}
				
				divTabPaneElect.html(ul);
			}else
				divTabPaneElect.html('登録されているエネルギーセンサーがありません。');
			
			if(respObj.env != null){
				
				var ul = $('<ul id="ul-env">');
				ul.attr('class', 'ul-sortable list-group mt');
				var li;
				var sensorName;
				for(var i in respObj.env){
					
					li = $('<li>');
					li.attr('class', 'list-group-item');
					li.attr('data-sensorId', respObj.env[i].sensorId);
					
					sensorName = respObj.env[i].sensorName;
					if(respObj.env[i].sensorTypeName != null)
						sensorName += ': ' + respObj.env[i].sensorTypeName;
					
					li.html(sensorName);
					ul.append(li);
				}
				
				divTabPaneEnv.html(ul);
			}else
				divTabPaneEnv.html('登録されている環境センサーがありません。');
			
			if(respObj.node != null){
				
				var ul = $('<ul id="ul-node">');
				ul.attr('class', 'ul-sortable list-group mt');
				var li;
				var sensorName;
				for(var i in respObj.node){
					
					li = $('<li>');
					li.attr('class', 'list-group-item');
					li.attr('data-sensorId', respObj.node[i].sensorId);
					
					sensorName = respObj.node[i].sensorName;
					
					li.html(sensorName);
					ul.append(li);
				}
				
				divTabPaneNode.html(ul);
			}else
				divTabPaneNode.html('登録されている出力接点がありません。');
			
			if(respObj.group != null){
				
				var ul = $('<ul id="ul-group">');
				ul.attr('class', 'ul-sortable list-group mt');
				var li;
				var sensorName;
				for(var i in respObj.group){
					
					li = $('<li>');
					li.attr('class', 'list-group-item');
					li.attr('data-sensorId', respObj.group[i].sensorId);
					
					sensorName = respObj.group[i].sensorName;
					
					li.html(sensorName);
					ul.append(li);
				}
				
				divTabPaneGroup.html(ul);
			}else
				divTabPaneGroup.html('登録されているグループがありません。');
			
			$('.ul-sortable').sortable();
			
			modalSetOrder.modal('show');
		},
		error: function(){
			alert('センサー情報が取得できませんでした。');
		}
	});
}
//_____　順番をとってくる
//==================== functions

//******************** init
// システム管理者は削除できない
$('[name="Administrator-button-delete"]').prop('disabled', true);
// 自分のアカウントは削除できない
$('[name="' + userId + '-button-delete"]').prop('disabled', true);
//==================== init