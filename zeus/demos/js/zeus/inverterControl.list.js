var inverterId = null;
var dispOrder = null;
var operationMode = $('.operationMode');
let intervalTime = 10000;

//----------- 運転モードラジオボタン動作 start
operationMode.change(function(){
	let item = $(this);
	let invId = item.attr('name').replace('radio', '');
	inverterId = invId;
	dispOrder = 1;
	
	setSettingValue();
});
//----------- 運転モードラジオボタン動作 end

//----------- 環境センサーIDの取得 start
var sensorIds = null;
var currentSpans = $('.currentSpan');
if(currentSpans.length > 0){
	let sensorId;
	
	for(var i = 0; i < currentSpans.length; i++){
		sensorId = $(currentSpans[i]).prop('id');
		
		if(sensorIds == null){
			sensorIds = sensorId;
		}else{
			
			if(sensorIds.indexOf(sensorId) < 0){
				sensorIds = sensorIds + ',' + sensorId;
			}
		}
	}
}
//----------- 環境センサーIDの取得 end

//----------- ajax start
if(sensorIds != null){
	getCurrentValue();
}

function getCurrentValue(){
	$.ajax({
		url: contextPath + 'Ajax/InverterControl/GetCurrentEnvValues.action',
		async: true,
		cache: false,
		data: 'sensorIds=' + sensorIds,
		success: function(resp){
			let dataObj = JSON.parse(resp);
			let sensorIdArr = sensorIds.split(',');
			let sensorId;
			
			for(var i = 0; i < sensorIdArr.length; i++){
				sensorId = sensorIdArr[i];
				
				if(dataObj[sensorId] == null){
					$('[id="' + sensorId + '"]').html('-');
				}else{
					$('[id="' + sensorId + '"]').html(dataObj[sensorId]);
				}
			}
			
			setTimeout(getCurrentValue, intervalTime);
		},
		error: function(){
			setTimeout(getCurrentValue, intervalTime);
		}
	});
}
//----------- ajax end

function openMod(invId, order){
	inverterId = invId;
	dispOrder = order;
	
	$('#newSettingValue').val($('#sv' + inverterId + dispOrder).val());
	$('#modModal').modal('show');
}

// settingValue変更ajax
function setSettingValue(){
	$('#modModal').modal('hide');
	$('#msgHeader').addClass('hide');
	$('#msgProgress').removeClass('hide');
	$('#msgDiv').addClass('error');
	$('#msgDiv').html('');
	$('#msgModal').modal('show');
	
	let value = null;
	// 運転モードの場合
	if(dispOrder == 1){
		value = operationMode.filter('[name="radio' + inverterId + '"]:checked').val();
	}else{
		value = $('#newSettingValue').val();
	}
	
	if(value == null || (value != 0 && value == '')){
		$('#msgHeader').removeClass('hide');
		$('#msgProgress').addClass('hide');
		$('#error' + inverterId + dispOrder).html(fmtRequired.replace('{0}', $('#name' + inverterId + dispOrder).html()));
	}else{
		let inverterName = document.querySelector('#label-inverterName-' + inverterId).innerText.trim();
		let inverterControlName = document.querySelector('#name' + inverterId + dispOrder).value;
		
		$.ajax({
			url: contextPath + 'Ajax/InverterControl/SetSettingValue.action',
			async: true,
			cache: false,
			data: {
				inverterId: inverterId,
				inverterName: encodeURI(inverterName),
				inverterControlName: encodeURI(inverterControlName),
				dispOrder: dispOrder,
				settingValue: value
			},
			inverterId: inverterId,
			dispOrder: dispOrder,
			newValue: value,
			success: function(resp){
				$('#msgHeader').removeClass('hide');
				$('#msgProgress').addClass('hide');
				let respObj = JSON.parse(resp);
				
				if($.isEmptyObject(respObj)){
					$('#msgDiv').html(fmtReqNotProcessed);
				}else{
					
					if(respObj.error != null){
						
						if(this.dispOrder == 1){
							let omValue = parseInt($('#operationMode' + this.inverterId).val());
							operationMode.filter('[name="radio' + this.inverterId + '"]').filter('[value="' + omValue + '"]').prop('checked', true);
						}

						if(respObj.errorType == 'invalidValue' || respObj.errorType == 'required'){
							$('#msgDiv').html(respObj.error.replace('{0}', $('#name' + this.inverterId + this.dispOrder).val()));
						}else{
							$('#msgDiv').html(respObj.error);
						}
					}else{
						
						if(this.dispOrder == 1){
							$('#operationMode' + this.inverterId).val(this.newValue);
							if(this.newValue == 0){
								$('#' + this.inverterId + this.dispOrder).html(fmtManual);
							}else if(this.newValue == 1){
								$('#' + this.inverterId + this.dispOrder).html('PID' + fmtControl + '(' + fmtAuto + ')');
							}else if(this.newValue == 2){
								$('#' + this.inverterId + this.dispOrder).html(fmtProportionalControl + '(' + fmtAuto + ')');
							}
						}else{
							$('#sv' + this.inverterId + this.dispOrder).val(this.newValue);
							$('#' + this.inverterId + this.dispOrder).html(this.newValue);
						}
						$('#msgDiv').removeClass('error');
						$('#msgDiv').html(respObj.message);
					}
				}
			},
			error: function(){
				$('#msgHeader').removeClass('hide');
				$('#msgProgress').addClass('hide');
				$('#msgDiv').html(fmtReqNotProcessed);
			}
		});
	}
}