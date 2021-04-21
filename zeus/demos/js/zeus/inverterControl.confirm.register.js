let controlSettingArr = JSON.parse(document.inverterControlForm.controlSettings.value);
let form = document.querySelector('#completeForm');

for(let i = 0; i < controlSettingArr.length; i++){
	let cs = controlSettingArr[i];
	let csTr = null;
	// 制御モードの場合
	if(cs.index == 1){
		csTr = $('#operationModeTr').clone();
	}else{
		csTr = $('#controlSettingTr').clone();
	}
	
	csTr.prop('id', 'controlSettingTr' + cs.index);
	csTr.find('#name').html(cs.name);
	// 制御モードの場合
	if(cs.index == 1){
		
		if(cs.settingValue == 0){
			csTr.find('#operationMode').html(fmtAuto);
		}else if(cs.settingValue == 1){
			csTr.find('#operationMode').html('PID' + fmtContorl + '(' + fmtAuto + ')');
		}else if(cs.settingValue == 2){
			csTr.find('#operationMode').html(fmtProportionalControl + '(' + fmtAuto + ')');
		}
	}else{
		csTr.find('#settingValue').html(cs.settingValue);
		
		if(cs.unitDisp != null){
			csTr.find('#unitDisp').html(cs.unitDisp);
		}
	}
	
	$('#dispSensorTr').before(csTr);
}

function setSettingValue(){
	$('#msgHeader').addClass('hide');
	$('#msgProgress').removeClass('hide');
	$('#msgDiv').html('');
	$('#msgModal').modal('show');
	
	let param = {};
	param.inverterId = document.inverterControlForm.inverterId.value;
	param.controlSettings = document.inverterControlForm.controlSettings.value;
	
	$.ajax({
		url: contextPath + 'Ajax/InverterControl/SetSettingValue.action',
		type: 'POST',
		async: true,
		cache: false,
		data: param,
		success: function(resp){
			$('#msgHeader').removeClass('hide');
			$('#msgProgress').addClass('hide');
			
		 	let respObj = JSON.parse(resp);
			if(respObj.error != null){
				$('#msgDiv').addClass('error');
				$('#msgDiv').html(fmtReqNotProcessed);
			}else{
				$('#msgModal').modal('hide');
				$('#completeForm').submit();
			}
		},
		error: function(){
			$('#msgHeader').removeClass('hide');
			$('#msgProgress').addClass('hide');
			$('#msgDiv').html(fmtReqNotProcessed);
		}
	});
}