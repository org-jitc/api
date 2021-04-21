var factorObj;
var updateObj = {};
var msgNumber = '数字を入力してください。';
var msgRequired = '必須です。';

var divBtn = $('#div-btn');
var btnReset = $('#btn-reset');
var btnUpdate = $('#btn-update');

btnUpdate.click(function(){
	
	btnUpdate.button('loading');
	btnReset.button('loading');
	
	$.ajax({
		url: contextPath + 'Ajax/EnergyConvertionFacotr/UpdateFactor.action',
		type: 'POST',
		async: true,
		cache: false,
		data: {data: JSON.stringify(updateObj)},
		success: function(resp){
			
			let respObj = JSON.parse(resp);
			if(respObj.error != null){
				
				popupError.setMessage('同期サーバーと接続できないため，変更できませんでした。');
				btnReset.click();
			}else{
				
				popupMessage.setMessage('変更されました。');
				
				divBtn.hide();
				
				for(var key in updateObj){
					
					for(var factorType in updateObj[key])
						factorObj[key][factorType] = updateObj[key][factorType];					
				}
				updateObj = {};
			}
			
			btnUpdate.button('reset');
			btnReset.button('reset');
		},
		error: function(){
			
			popupError.setMessage('変更できませんでした。');
			btnReset.click();
			
			btnUpdate.button('reset');
			btnReset.button('reset');
		}
	});
});

btnReset.click(function(){
	
	var value;
	
	for(var key in updateObj){
		
		for(var factorType in updateObj[key]){
			
			value = factorObj[key][factorType];
			if(value == null)
				value = '';
			$('[data-pk="' + key + '"][data-factor-type="' + factorType + '"]').editable('setValue', value);
		}
	}
	
	updateObj = {};
	divBtn.hide();
});

//* init
divBtn.removeClass('hide');
divBtn.hide();
if(reqFactorObj != '')
	factorObj = JSON.parse(reqFactorObj);
	
$('.editable').editable({
	validate: function(value) {
		
		var newValue = $.trim(value);
		var item = $(this);
		var energyType = item.attr('data-pk');
		var factorType = item.attr('data-factor-type');
		
		var originValue = factorObj[energyType];
		if(originValue != null)
			originValue = originValue[factorType];
		
		//* check required: only oil
		if(factorType == 'oil'){
			
			if(newValue == '')
				return msgRequired;
		}
		//_ check required: only oil
		
		//* check empty and is number
    	if(newValue != '' && isNaN(newValue))
    		return msgNumber;
		//_ check empty and is number
		
		var isChanged = false;
		if(originValue == null){
			
			if(newValue != '')
				isChanged = true;
		}else{
			
			if(newValue == '')
				isChanged = true;
			else{
				
				if(originValue != value)
					isChanged = true;
			}
		}
		
		if(isChanged){
			
			var valueObj = updateObj[energyType];
			if(valueObj == null){
				
				valueObj = {};
				updateObj[energyType] = valueObj; 
			}
			
			valueObj[factorType] = newValue;
			
			divBtn.show();
		}
	}
});
//_ init