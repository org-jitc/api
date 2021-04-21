function Group(){
	
	var form = $('#form-group');
	var selectCategoryNo = $('[name="category_no"]');
	var selectIllSensor = $('[name="illumination_sensor_id"]');
	var checkMotionSensorIds = $('[name="motionSensorIds"]');
	var checkDeviceIds = $('[name="deviceIds"]');
	
	var hiddenCategoryNoName = $('[name="categoryNoName"]');
	var hiddenIllSensorName = $('[name="illSensorName"]');
	var hiddenMotionSensorIdsStr = $('[name="motionSensorIdsStr"]');
	var hiddenMotionSensorNames = $('[name="motionSensorNames"]');
	var hiddenDeviceIdsStr = $('[name="deviceIdsStr"]');
	var hiddenDeviceNames = $('[name="deviceNames"]');
	
	selectCategoryNo.change(function(){
		
		selectIllSensor.prop('disabled', this.value == '' || this.value == 1);
		checkMotionSensorIds.prop('disabled', this.value == '' || this.value == 2);
	});
	
	form.submit(function(){

		var names = '';
		var ids = '';
		var checkedChecks;
		var checkedCheck;
		// set category no name
		if(selectCategoryNo.val() != ''){
			
			if(selectCategoryNo.val() == 1)
				hiddenCategoryNoName.val('モーション');
			else if(selectCategoryNo.val() == 2)
				hiddenCategoryNoName.val('照度');
			else
				hiddenCategoryNoName.val('');
		}
		// set ill sensor name
		if(selectIllSensor.length > 0 && !selectIllSensor.prop('disabled'))
			hiddenIllSensorName.val(selectIllSensor.find('option:selected').text());
		else
			hiddenIllSensorName.val('');
		// set motion sensor ids & names
		if(checkMotionSensorIds.length > 0 && !checkMotionSensorIds.prop('disabled')){
			
			checkedChecks = checkMotionSensorIds.filter(':checked');
			if(checkedChecks.length > 0){
				
				ids = '';
				names = '';
				for(var i = 0; i < checkedChecks.length; i++){
					
					checkedCheck = checkedChecks[i];
					
					if(ids != '')
						ids = ids + ',';
					ids = ids + checkedCheck.value;
					
					if(names != '')
						names = names + ', ';
					names = names + $(checkedCheck).next().text();
				}
				hiddenMotionSensorIdsStr.val(ids);
				hiddenMotionSensorNames.val(names);
			}
		}else
			hiddenMotionSensorNames.val('');
		// set device ids & names
		if(checkDeviceIds.length > 0){
			
			var checkedChecks = checkDeviceIds.filter(':checked');
			if(checkedChecks.length > 0){
				
				ids = '';
				names = '';
				for(var i = 0; i < checkedChecks.length; i++){
					
					checkedCheck = checkedChecks[i];
					
					if(ids != '')
						ids = ids + ',';
					ids = ids + checkedCheck.value;
					
					if(names != '')
						names = names + ', ';
					names = names + $(checkedCheck).next().text();
				}
				hiddenDeviceIdsStr.val(ids);
				hiddenDeviceNames.val(names);
			}
		}else
			hiddenDeviceNames.val('');
	});
	
	selectCategoryNo.change();
}

new Group();