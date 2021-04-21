var controlSettings = JSON.parse(document.inverterForm.controlSettings.value);
var preTable = null;
for(var i = 0; i < controlSettings.length; i++){
	
	var controlSetting = controlSettings[i];
	
	var settingTable = $('#controlSettingPrototype').clone();
	settingTable.removeClass('hide');
	settingTable.find('#name').html(controlSetting.name);
	settingTable.find('#registerAddress').html(controlSetting.registerAddress);
	settingTable.find('#unitDisp').html(controlSetting.unitDisp);
	
	if(preTable == null)
		$('#inverterTable').after(settingTable);
	else
		preTable.after(settingTable);
	
	preTable = settingTable;
}

function beforeSubmit(){
	
	if(_hasInverterControl == 'true')
		$('#csDelModal').modal('show');
	else
		$('#completeForm').submit();
}

function clearSettingControl(){
	$('#csDelModal').modal('hide');
	$('#msgHeader').addClass('hide');
	$('#msgProgress').removeClass('hide');
	$('#msgDiv').html('');
	$('#msgModal').modal('show');
	
	$.ajax({
		url: contextPath + 'Ajax/InverterControl/ClearControlSetting.action',
		async: true,
		cache: false,
		data: 'inverterId=' + document.inverterForm.inverterId.value,
		success: function(resp){
			$('#msgHeader').removeClass('hide');
			$('#msgProgress').addClass('hide');
			
			let respObj = JSON.parse(resp);
			if(respObj.error != null){
				$('#msgDiv').html(respObj.error);
			}else{
				$('#completeForm').submit();
			}
		},
		error: function(){
			$('#msgHeader').removeClass('hide');
			$('#msgProgress').addClass('hide');
			$('#msgDiv').html('<fmt:message key="errors.common.message.reqNotProcessed"/>');
		}
	});
}