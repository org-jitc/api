function addSelectBox(optionvalue, action){
		
	if(optionvalue=="")
		return;
	
	document.dailyFormBean.action = action;
	document.dailyFormBean.status.value = 10;
	document.dailyFormBean.submit();
}