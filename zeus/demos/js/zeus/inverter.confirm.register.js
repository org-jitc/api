var controlSettings = JSON.parse(document.inverterForm.controlSettings.value);
var lastTable = null;
for(var i = 0; i < controlSettings.length; i++){
	
	var cs = controlSettings[i];
	
	var settingTable = $('#controlSettingPrototype').clone();
	settingTable.removeClass('hide');
	settingTable.find('#name').html(cs.name);
	settingTable.find('#registerAddress').html(cs.registerAddress);
	settingTable.find('#unitDisp').html(cs.unitDisp);
	
	if(i == 0)
		lastTable = $('#inverterTable');
	
	lastTable.after(settingTable);
	lastTable = settingTable;
}