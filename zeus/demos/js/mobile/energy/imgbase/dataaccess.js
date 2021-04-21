//***** 位置情報保存ボタン動作 
btnSavePosition.click(function(){
	
	if(energyPosition != null){
		
		var positionStr = JSON.stringify(energyPosition);
		var param = {};
		param.position = positionStr;
		param.column = 'energy_position';
		
		$.ajax({
			url: contextPath + '/Mobile/SystemSetting/SavePosition.mo',
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