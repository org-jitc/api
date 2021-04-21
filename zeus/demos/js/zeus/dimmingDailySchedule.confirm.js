var tableObj = $("#scheduleTable");

var newRow = tableObj[0].insertRow();
var newCell = newRow.insertCell();
newCell.innerHTML = "時間";
newCell.setAttribute("class", "td-with-bg");
newCell.setAttribute("width", "25%");

newCell = newRow.insertCell();
newCell.innerHTML = "動作";
newCell.setAttribute("class", "td-with-bg");
newCell.setAttribute("width", "25%");

newCell = newRow.insertCell();
newCell.innerHTML = "グループ";
newCell.setAttribute("class", "td-with-bg");
newCell.setAttribute("width", "50%");

var schedules = JSON.parse(fbSchedules);
for(var key in schedules){
	
	var schedule = schedules[key];
	
	newRow = tableObj[0].insertRow();
	newCell = newRow.insertCell();
	newCell.innerHTML = key;

	newCell = newRow.insertCell();
	newCell.innerHTML = schedule.process;

	newCell = newRow.insertCell();
	var groupNames = null;
	var groupsArr = schedule.groups.split(",");
	for(var i = 0; i < groupsArr.length; i++){
		
		var groupInfoArr = groupsArr[i].split(":");
		if(groupNames == null)
			groupNames = groupInfoArr[1];
		else
			groupNames += ', ' + groupInfoArr[1];
	}
	newCell.innerHTML = groupNames;
}