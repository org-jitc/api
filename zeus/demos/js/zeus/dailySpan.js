function addSelectBox(optionvalue, action){
	
	if(optionvalue == '')
		return;
	
	document.dailyspanFormBean.action = action;
	document.dailyspanFormBean.submit();
}

//__________________________________________________________________________
// init
$('#selectMonth').val(reqMonth1);
$('#selectMonth2').val(reqMonth2);

zeus.setNumberOptions('selectDay', 1, 31, false, '00')
$('#selectDay').val(reqDay1);

zeus.setNumberOptions('selectDay2', 1, 31, false, '00')
$('#selectDay2').val(reqDay2);
// init
//---------------------------------------------------------------------------