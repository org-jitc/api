$('#menuNameSelect').change(function(){
	
	let option = this.options[this.selectedIndex];
	
	$('#tableFieldContent').load('GetHelpMessageTableFields.do', {tableName: option.value, tableDataType: option.getAttribute('data-datatype')});
});