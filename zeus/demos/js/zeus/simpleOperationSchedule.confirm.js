if(document.simpleOperationScheduleFormBean.temperatureControlMode.value == 5){
	
	$('.span-temp').addClass('hide');
	$('.span-co2').removeClass('hide');
}else{
	
	$('.span-co2').addClass('hide');
	$('.span-temp').removeClass('hide');
}