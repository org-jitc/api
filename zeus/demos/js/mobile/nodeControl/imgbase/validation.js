//***** 省エネ運転時間
onMinute.bind('input propertychange', function(){
	
	var item = $(this);
	var groupDiv = item.parent().parent();
	var offMinuteGroupDiv = offMinute.parent().parent();
	if(this.value == ''){
		
		if(offMinute.val() == ''){
			
			groupDiv.removeClass('has-error');	
			offMinuteGroupDiv.removeClass('has-error');
		}else
			groupDiv.addClass('has-error');
	}else{
		
		if(this.value < 0 || this.value > 86400)
			groupDiv.addClass('has-error');
		else
			groupDiv.removeClass('has-error');
		
		if(offMinute.val() == '')
			offMinuteGroupDiv.addClass('has-error');
		else
			offMinuteGroupDiv.removeClass('has-error');
	}
});
onMinute.bind('keypress', function(event){
	
	if(event.key == '.'){
		
		event.preventDefault();
		return false;
	}
});
//_____ 省エネ運転時間
//***** 通常運転時間
offMinute.bind('input propertychange', function(){
	
	var item = $(this);
	var groupDiv = item.parent().parent();
	var onMinuteGroupDiv = onMinute.parent().parent();
	if(this.value == ''){
		
		if(onMinute.val() == ''){
			
			groupDiv.removeClass('has-error');	
			onMinuteGroupDiv.removeClass('has-error');
		}else
			groupDiv.addClass('has-error');
	}else{
		
		if(this.value < 0 || this.value > 86400)
			groupDiv.addClass('has-error');
		else
			groupDiv.removeClass('has-error');
		
		if(onMinute.val() == '')
			onMinuteGroupDiv.addClass('has-error');
		else
			onMinuteGroupDiv.removeClass('has-error');
	}
});
offMinute.bind('keypress', function(event){
	
	if(event.key == '.'){
		
		event.preventDefault();
		return false;
	}
});
//_____ 通常運転時間
//***** 目標電力
etee.bind('input propertychange', function(){
	
	var item = $(this);
	var groupDiv = item.parent().parent();
	if(this.value < 0)
		groupDiv.addClass('has-error');
	else
		groupDiv.removeClass('has-error');
});
etee.bind('keypress', function(event){
	
	if(event.key == '.'){
		
		event.preventDefault();
		return false;
	}
});
//_____ 目標電力
//***** 設定温度(冷)、設定CO2(下限オーバー)
ttc.bind('input propertychange', function(){
	
	var item = $(this);
	var groupDiv = item.parent().parent();
	
	var nodeId = currentNode.nodeId;
	var ns = nodeStatusData[nodeId];
	var tcm = ns.controlSetting.temperatureControlMode;
	
	if(isNaN(this.value))
		groupDiv.addClass('has-error');
	else{
		
		if(tcm == 1){
			
			if(this.value.indexOf('.') >= 0){
				
				var valueArr = this.value.split('.');
				if(valueArr[1].length != 1){
					
					groupDiv.addClass('has-error');
					return;
				}
			}
			if(this.value < -50 || this.value > 1000)
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}else{
			
			if(this.value < 0 || this.value > 10000)
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
		// otc
		var otcGroupDiv = otc.parent().parent();
		if(this.value == ''){
			
			if(!otcGroupDiv.hasClass('has-error'))
				otcGroupDiv.removeClass('has-error');
				
			if(!groupDiv.hasClass('has-error')){
				
				if(otc.val() != '')
					groupDiv.addClass('has-error');
				else
					groupDiv.removeClass('has-error');
			}
		}else{
			
			if(!otcGroupDiv.hasClass('has-error')){
				
				if(otc.val() != '')
					otcGroupDiv.removeClass('has-error');
				else
					otcGroupDiv.addClass('has-error');
			}
		}
	}
});
ttc.bind('keypress', function(event){
	
	var nodeId = currentNode.nodeId;
	var ns = nodeStatusData[nodeId];
	var tcm = ns.controlSetting.temperatureControlMode;
	
	// co2の場合は整数
	if(tcm == 5){
		
		if(event.key == '.'){
			
			event.preventDefault();
			return false;
		}
	}else{
		
		if(event.key == '.'){
			
			if(this.value == ''){
				
				event.preventDefault();
				return false;
			}else{
				
				if(this.value.indexOf('.') >= 0){
					
					event.preventDefault();
					return false;
				}
			}
		}
	}
});
//_____ 設定温度(冷)、設定CO2(下限オーバー)
//***** 許容誤差温度（冷）、許容誤差CO2濃度（下限オーバー）
otc.bind('input propertychange', function(){
	
	var item = $(this);
	var groupDiv = item.parent().parent();
	
	var nodeId = currentNode.nodeId;
	var ns = nodeStatusData[nodeId];
	var tcm = ns.controlSetting.temperatureControlMode;
	
	if(tcm == 1){
		
		if(this.value.indexOf('.') >= 0){
			
			var valueArr = this.value.split('.');
			if(valueArr[1].length != 1){
				
				groupDiv.addClass('has-error');
				return;
			}
		}
		
		if(this.value < 0.1 || this.value > 100)
			groupDiv.addClass('has-error');
		else
			groupDiv.removeClass('has-error');
	}else{
		
		if(this.value < 0 || this.value > 1000)
			groupDiv.addClass('has-error');
		else
			groupDiv.removeClass('has-error');
	}
	
	// ttc
	var ttcGroupDiv = ttc.parent().parent();
	if(this.value == ''){
		
		if(!ttcGroupDiv.hasClass('has-error'))
			ttcGroupDiv.removeClass('has-error');
		
		if(!groupDiv.hasClass('has-error')){
			
			if(ttc.val() != '')
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}else{
	
		if(!ttcGroupDiv.hasClass('has-error')){
			
			if(ttc.val() != '')
				ttcGroupDiv.removeClass('has-error');
			else
				ttcGroupDiv.addClass('has-error');
		}
	}
});
otc.bind('keypress', function(event){
	
	var nodeId = currentNode.nodeId;
	var ns = nodeStatusData[nodeId];
	var tcm = ns.controlSetting.temperatureControlMode;
	
	// co2の場合は整数
	if(tcm == 5){
		
		if(event.key == '.'){
			
			event.preventDefault();
			return false;
		}
	}else{
		
		if(event.key == '.'){
			
			if(this.value == ''){
				
				event.preventDefault();
				return false;
			}else{
				
				if(this.value.indexOf('.') >= 0){
					
					event.preventDefault();
					return false;
				}
			}
		}
	}
});
//_____ 許容誤差温度（冷）、許容誤差CO2濃度（下限オーバー）
//***** 設定温度（暖）/設定CO2濃度（上限オーバー）
tth.bind('input propertychange', function(){
	
	var item = $(this);
	var groupDiv = item.parent().parent();
	
	var nodeId = currentNode.nodeId;
	var ns = nodeStatusData[nodeId];
	var tcm = ns.controlSetting.temperatureControlMode;
	
	if(isNaN(this.value))
		groupDiv.addClass('has-error');
	else{
		
		if(tcm == 1){
			
			if(this.value.indexOf('.') >= 0){
				
				var valueArr = this.value.split('.');
				if(valueArr[1].length != 1){
					
					groupDiv.addClass('has-error');
					return;
				}
			}
			if(this.value < -50 || this.value > 1000)
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}else{
			
			if(this.value < 0 || this.value > 10000)
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
		// oth
		var othGroupDiv = oth.parent().parent();
		if(this.value == ''){
			
			if(!othGroupDiv.hasClass('has-error'));
				othGroupDiv.removeClass('has-error');
				
			if(!groupDiv.hasClass('has-error')){
				
				if(oth.val() != '')
					groupDiv.addClass('has-error');
				else
					groupDiv.removeClass('has-error');
			}
		}else{
		
			if(!othGroupDiv.hasClass('has-error')){
				
				if(oth.val() != '')
					othGroupDiv.removeClass('has-error');
				else
					othGroupDiv.addClass('has-error');
			}
		}
	}
});
tth.bind('keypress', function(event){
	
	var nodeId = currentNode.nodeId;
	var ns = nodeStatusData[nodeId];
	var tcm = ns.controlSetting.temperatureControlMode;
	
	// co2の場合は整数
	if(tcm == 5){
		
		if(event.key == '.'){
			
			event.preventDefault();
			return false;
		}
	}else{
		
		if(event.key == '.'){
			
			if(this.value == ''){
				
				event.preventDefault();
				return false;
			}else{
				
				if(this.value.indexOf('.') >= 0){
					
					event.preventDefault();
					return false;
				}
			}
		}
	}
});
//_____ 設定温度（暖）/設定CO2濃度（上限オーバー）
//***** 許容誤差温度（暖）/許容誤差CO2濃度（上限オーバー）
oth.bind('input propertychange', function(){
	
	var item = $(this);
	var groupDiv = item.parent().parent();
	
	var nodeId = currentNode.nodeId;
	var ns = nodeStatusData[nodeId];
	var tcm = ns.controlSetting.temperatureControlMode;
	
	if(tcm == 1){
		
		if(this.value.indexOf('.') >= 0){
			
			var valueArr = this.value.split('.');
			if(valueArr[1].length != 1){
				
				groupDiv.addClass('has-error');
				return;
			}
		}
		
		if(this.value < 0.1 || this.value > 100)
			groupDiv.addClass('has-error');
		else
			groupDiv.removeClass('has-error');
	}else{
		
		if(this.value < 0 || this.value > 1000)
			groupDiv.addClass('has-error');
		else
			groupDiv.removeClass('has-error');
	}
	// tth
	var tthGroupDiv = tth.parent().parent();
	if(this.value == ''){
		
		if(!tthGroupDiv.hasClass('has-error'))
			tthGroupDiv.removeClass('has-error');
			
		if(!groupDiv.hasClass('has-error')){
			
			if(tth.val() != '')
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}else{
	
		if(!tthGroupDiv.hasClass('has-error')){
			
			if(tth.val() != '')
				tthGroupDiv.removeClass('has-error');
			else
				tthGroupDiv.addClass('has-error');
		}
	}
});
oth.bind('keypress', function(event){
	
	var nodeId = currentNode.nodeId;
	var ns = nodeStatusData[nodeId];
	var tcm = ns.controlSetting.temperatureControlMode;
	
	// co2の場合は整数
	if(tcm == 5){
		
		if(event.key == '.'){
			
			event.preventDefault();
			return false;
		}
	}else{
		
		if(event.key == '.'){
			
			if(this.value == ''){
				
				event.preventDefault();
				return false;
			}else{
				
				if(this.value.indexOf('.') >= 0){
					
					event.preventDefault();
					return false;
				}
			}
		}
	}
});
//_____ 許容誤差温度（暖）/許容誤差CO2濃度（上限オーバー）
//***** 制御開始閾値温度 / 閾値不快指数（冷）
wttco.bind('input propertychange', function(){
	
	var item = $(this);
	var groupDiv = item.parent().parent();
	
	if(this.value == ''){
		
		if(wttc.val() != '')
			groupDiv.addClass('has-error');
		else
			groupDiv.removeClass('has-error');
	}else{
		
		if(isNaN(this.value))
			groupDiv.addClass('has-error');
		else{
			
			if(this.value.indexOf('.') >= 0){
				
				var valueArr = this.value.split('.');
				if(valueArr[1].length != 1){
					
					groupDiv.addClass('has-error');
					return;
				}
			}
			
			if(this.value <= -100 || this.value >= 100)
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}
	
	// wttc
	var wttcGroupDiv = wttc.parent().parent();
	if(this.value == ''){
		
		if(wttc.val() == '' && wttcGroupDiv.hasClass('has-error'))
			wttcGroupDiv.removeClass('has-error');
			
		if(!groupDiv.hasClass('has-error')){
			
			if(wttc.val() != '')
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}else{
	
		if(!wttcGroupDiv.hasClass('has-error')){
			
			if(wttc.val() != '')
				wttcGroupDiv.removeClass('has-error');
			else
				wttcGroupDiv.addClass('has-error');
		}
	}
});
wttco.bind('keypress', function(event){
	
	if(event.key == '.'){
		
		if(this.value == ''){
			
			event.preventDefault();
			return false;
		}else{
			
			if(this.value.indexOf('.') >= 0){
				
				event.preventDefault();
				return false;
			}
		}
	}
});
//_____ 制御開始閾値温度 / 閾値不快指数（冷）
//***** 制御開始維持閾値温度 / 閾値不快指数（冷）
wttck.bind('input propertychange', function(){
	
	var item = $(this);
	var groupDiv = item.parent().parent();
	
	if(this.value == ''){
		
		if(wttcks.val() != '')
			groupDiv.addClass('has-error');
		else
			groupDiv.removeClass('has-error');
	}else{
		
		if(isNaN(this.value))
			groupDiv.addClass('has-error');
		else{
			
			if(this.value.indexOf('.') >= 0){
				
				var valueArr = this.value.split('.');
				if(valueArr[1].length != 1){
					
					groupDiv.addClass('has-error');
					return;
				}
			}
			
			if(this.value <= -100 || this.value >= 100)
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}
	
	// wttc
	var wttcksGroupDiv = wttcks.parent().parent();
	if(this.value == ''){
		
		if(wttcks.val() == '' && wttcksGroupDiv.hasClass('has-error'))
			wttcksGroupDiv.removeClass('has-error');
			
		if(!groupDiv.hasClass('has-error')){
			
			if(wttcks.val() != '')
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}else{
	
		if(!wttcksGroupDiv.hasClass('has-error')){
			
			if(wttcks.val() != '')
				wttcksGroupDiv.removeClass('has-error');
			else
				wttcksGroupDiv.addClass('has-error');
		}
	}
});
wttck.bind('keypress', function(event){
	
	if(event.key == '.'){
		
		if(this.value == ''){
			
			event.preventDefault();
			return false;
		}else{
			
			if(this.value.indexOf('.') >= 0){
				
				event.preventDefault();
				return false;
			}
		}
	}
});
//_____ 制御開始維持閾値温度 / 閾値不快指数（冷）
//***** 制御開始維持閾値秒数（冷）
wttcks.bind('input propertychange', function(){
	
	var item = $(this);
	var groupDiv = item.parent().parent();
	
	if(this.value == ''){
		
		if(wttck.val() != '')
			groupDiv.addClass('has-error');
		else
			groupDiv.removeClass('has-error');
	}else{
		
		if(this.value < 0 || this.value > 32766)
			groupDiv.addClass('has-error');
		else
			groupDiv.removeClass('has-error');
	}
	// wttck
	var wttckGroupDiv = wttck.parent().parent();
	if(this.value == ''){
		
		if(wttck.val() == '' && wttckGroupDiv.hasClass('has-error'))
			wttckGroupDiv.removeClass('has-error');
			
		if(!groupDiv.hasClass('has-error')){
			
			if(wttck.val() != '')
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}else{
	
		if(!wttckGroupDiv.hasClass('has-error')){
			
			if(wttck.val() != '')
				wttckGroupDiv.removeClass('has-error');
			else
				wttckGroupDiv.addClass('has-error');
		}
	}
});
wttcks.bind('keypress', function(event){
	
	if(event.key == '.'){
		
		event.preventDefault();
		return false;
	}
});
//_____ 制御開始維持閾値秒数（冷）
//***** 制御解除閾値温度 / 閾値不快指数（冷）
wttc.bind('input propertychange', function(){
	
	var item = $(this);
	var groupDiv = item.parent().parent();
	
	if(this.value == ''){
		
		if(wttco.val() != '')
			groupDiv.addClass('has-error');
		else
			groupDiv.removeClass('has-error');
	}else{
		
		if(isNaN(this.value))
			groupDiv.addClass('has-error');
		else{
			
			if(this.value.indexOf('.') >= 0){
				
				var valueArr = this.value.split('.');
				if(valueArr[1].length != 1){
					
					groupDiv.addClass('has-error');
					return;
				}
			}
			
			if(this.value <= -100 || this.value >= 100)
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}
	// wttco
	var wttcoGroupDiv = wttco.parent().parent();
	if(this.value == ''){
		
		if(wttco.val() == '' && wttcoGroupDiv.hasClass('has-error'))
			wttcoGroupDiv.removeClass('has-error');
			
		if(!groupDiv.hasClass('has-error')){
			
			if(wttco.val() != '')
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}else{
	
		if(!wttcoGroupDiv.hasClass('has-error')){
			
			if(wttco.val() != '')
				wttcoGroupDiv.removeClass('has-error');
			else
				wttcoGroupDiv.addClass('has-error');
		}
	}
});
wttc.bind('keypress', function(event){
	
	if(event.key == '.'){
		
		if(this.value == ''){
			
			event.preventDefault();
			return false;
		}else{
			
			if(this.value.indexOf('.') >= 0){
				
				event.preventDefault();
				return false;
			}
		}
	}
});
//_____ 制御解除閾値温度 / 閾値不快指数（冷）
//***** 制御開始閾値温度 / 閾値不快指数（暖）
wttho.bind('input propertychange', function(){
	
	var item = $(this);
	var groupDiv = item.parent().parent();
	
	if(this.value == ''){
		
		if(wtth.val() != '')
			groupDiv.addClass('has-error');
		else
			groupDiv.removeClass('has-error');
	}else{
		
		if(isNaN(this.value))
			groupDiv.addClass('has-error');
		else{
			
			if(this.value.indexOf('.') >= 0){
				
				var valueArr = this.value.split('.');
				if(valueArr[1].length != 1){
					
					groupDiv.addClass('has-error');
					return;
				}
			}
			
			if(this.value <= -100 || this.value >= 100)
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}
	
	// wttc
	var wtthGroupDiv = wtth.parent().parent();
	if(this.value == ''){
		
		if(wtth.val() == '' && wtthGroupDiv.hasClass('has-error'))
			wtthGroupDiv.removeClass('has-error');
			
		if(!groupDiv.hasClass('has-error')){
			
			if(wtth.val() != '')
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}else{
	
		if(!wtthGroupDiv.hasClass('has-error')){
			
			if(wtth.val() != '')
				wtthGroupDiv.removeClass('has-error');
			else
				wtthGroupDiv.addClass('has-error');
		}
	}
});
wttho.bind('keypress', function(event){
	
	if(event.key == '.'){
		
		if(this.value == ''){
			
			event.preventDefault();
			return false;
		}else{
			
			if(this.value.indexOf('.') >= 0){
				
				event.preventDefault();
				return false;
			}
		}
	}
});
//_____ 制御開始閾値温度 / 閾値不快指数（暖）
//***** 制御開始維持閾値温度 / 閾値不快指数（暖）
wtthk.bind('input propertychange', function(){
	
	var item = $(this);
	var groupDiv = item.parent().parent();
	
	if(this.value == ''){
		
		if(wtthks.val() != '')
			groupDiv.addClass('has-error');
		else
			groupDiv.removeClass('has-error');
	}else{
		
		if(isNaN(this.value))
			groupDiv.addClass('has-error');
		else{
			
			if(this.value.indexOf('.') >= 0){
				
				var valueArr = this.value.split('.');
				if(valueArr[1].length != 1){
					
					groupDiv.addClass('has-error');
					return;
				}
			}
			
			if(this.value <= -100 || this.value >= 100)
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}
	// wtthks
	var wtthksGroupDiv = wtthks.parent().parent();
	if(this.value == ''){
		
		if(wtthks.val() == '' && wtthksGroupDiv.hasClass('has-error'))
			wtthksGroupDiv.removeClass('has-error');
			
		if(!groupDiv.hasClass('has-error')){
			
			if(wtthks.val() != '')
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}else{
	
		if(!wtthksGroupDiv.hasClass('has-error')){
			
			if(wtthks.val() != '')
				wtthksGroupDiv.removeClass('has-error');
			else
				wtthksGroupDiv.addClass('has-error');
		}
	}
});
wtthk.bind('keypress', function(event){
	
	if(event.key == '.'){
		
		if(this.value == ''){
			
			event.preventDefault();
			return false;
		}else{
			
			if(this.value.indexOf('.') >= 0){
				
				event.preventDefault();
				return false;
			}
		}
	}
});
//_____ 制御開始維持閾値温度 / 閾値不快指数（暖）
//***** 制御開始維持閾値秒数（暖）
wtthks.bind('input propertychange', function(){
	
	var item = $(this);
	var groupDiv = item.parent().parent();
	
	if(this.value == ''){
		
		if(wtthk.val() != '')
			groupDiv.addClass('has-error');
		else
			groupDiv.removeClass('has-error');
	}else{
		
		if(this.value < 0 || this.value > 32766)
			groupDiv.addClass('has-error');
		else
			groupDiv.removeClass('has-error');
	}
	// wttck
	var wtthkGroupDiv = wtthk.parent().parent();
	if(this.value == ''){
		
		if(wtthk.val() == '' && wtthkGroupDiv.hasClass('has-error'))
			wtthkGroupDiv.removeClass('has-error');
			
		if(!groupDiv.hasClass('has-error')){
			
			if(wtthk.val() != '')
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}else{
	
		if(!wtthkGroupDiv.hasClass('has-error')){
			
			if(wtthk.val() != '')
				wtthkGroupDiv.removeClass('has-error');
			else
				wtthkGroupDiv.addClass('has-error');
		}
	}
});
wtthks.bind('keypress', function(event){
	
	if(event.key == '.'){
		
		event.preventDefault();
		return false;
	}
});
//_____ 制御開始維持閾値秒数（暖）
//***** 制御解除閾値温度 / 閾値不快指数（暖）
wtth.bind('input propertychange', function(){
	
	var item = $(this);
	var groupDiv = item.parent().parent();
	
	if(this.value == ''){
		
		if(wttho.val() != '')
			groupDiv.addClass('has-error');
		else
			groupDiv.removeClass('has-error');
	}else{
		
		if(isNaN(this.value))
			groupDiv.addClass('has-error');
		else{
			
			if(this.value.indexOf('.') >= 0){
				
				var valueArr = this.value.split('.');
				if(valueArr[1].length != 1){
					
					groupDiv.addClass('has-error');
					return;
				}
			}
			
			if(this.value <= -100 || this.value >= 100)
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}
	// wttho
	var wtthoGroupDiv = wttho.parent().parent();
	if(this.value == ''){
		
		if(wttho.val() == '' && wtthoGroupDiv.hasClass('has-error'))
			wtthoGroupDiv.removeClass('has-error');
			
		if(!groupDiv.hasClass('has-error')){
			
			if(wttho.val() != '')
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}else{
	
		if(!wtthoGroupDiv.hasClass('has-error')){
			
			if(wttho.val() != '')
				wtthoGroupDiv.removeClass('has-error');
			else
				wtthoGroupDiv.addClass('has-error');
		}
	}
});
wtth.bind('keypress', function(event){
	
	if(event.key == '.'){
		
		if(this.value == ''){
			
			event.preventDefault();
			return false;
		}else{
			
			if(this.value.indexOf('.') >= 0){
				
				event.preventDefault();
				return false;
			}
		}
	}
});
//_____ 制御解除閾値温度 / 閾値不快指数（暖）
//***** デマンド制御時閾値温度/閾値不快指数（冷）
wttcd.bind('input propertychange', function(){
	
	var item = $(this);
	var groupDiv = item.parent().parent();
	
	if(this.value != ''){
		
		if(isNaN(this.value))
			groupDiv.addClass('has-error');
		else{
			
			if(this.value.indexOf('.') >= 0){
				
				var valueArr = this.value.split('.');
				if(valueArr[1].length != 1){
					
					groupDiv.addClass('has-error');
					return;
				}
			}
			
			if(this.value <= -100 || this.value >= 100)
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}else
		groupDiv.removeClass('has-error');
});
wttcd.bind('keypress', function(event){
	
	if(event.key == '.'){
		
		if(this.value == ''){
			
			event.preventDefault();
			return false;
		}else{
			
			if(this.value.indexOf('.') >= 0){
				
				event.preventDefault();
				return false;
			}
		}
	}
});
//_____ デマンド制御時閾値温度/閾値不快指数（冷）
//***** デマンド制御時閾値温度/閾値不快指数（暖）
wtthd.bind('input propertychange', function(){
	
	var item = $(this);
	var groupDiv = item.parent().parent();
	
	if(this.value != ''){
		
		if(isNaN(this.value))
			groupDiv.addClass('has-error');
		else{
			
			if(this.value.indexOf('.') >= 0){
				
				var valueArr = this.value.split('.');
				if(valueArr[1].length != 1){
					
					groupDiv.addClass('has-error');
					return;
				}
			}
			
			if(this.value <= -100 || this.value >= 100)
				groupDiv.addClass('has-error');
			else
				groupDiv.removeClass('has-error');
		}
	}else
		groupDiv.removeClass('has-error');
});
wtthd.bind('keypress', function(event){
	
	if(event.key == '.'){
		
		if(this.value == ''){
			
			event.preventDefault();
			return false;
		}else{
			
			if(this.value.indexOf('.') >= 0){
				
				event.preventDefault();
				return false;
			}
		}
	}
});
//_____ デマンド制御時閾値温度/閾値不快指数（暖）