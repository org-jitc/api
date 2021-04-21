if(fbStartH != '')
	$('[name="startTime_hh"]').val(fbStartH);

zeus.setNumberOptionsByName('startTime_mm', 0, 59, false, '00');
if(fbStartM != '')
	$('[name="startTime_mm"]').val(fbStartM);
	
if(fbEndH != '')
	$('[name="endTime_hh"]').val(fbEndH);
	
zeus.setNumberOptionsByName('endTime_mm', 0, 59, false, '00');
if(fbEndM != '')
	$('[name="endTime_mm"]').val(fbEndM);