//--------------- variables start
//store schedule information
var oldKey;
var scheduleTableMap = {};
// 画面のテーブル
var scheduleTable = $('#scheduleTable');
// センサー付きグループ
var groupsWithSensor = $('.withSensor');
var groupsWithSensorModify = $('.withSensor-modify');
// センサーないグループ
var groupsWithoutSensor = $('.withoutSensor');
var groupsWithoutSensorModify = $('.withoutSensor-modify');
var popGroups = $('[name="daily_group_modify"]');
// hour
var hour = $('#scheduleTimeHourSelect');
var hourModify = $('#timeHourSelectModify');
// minute
var min = $('#scheduleTimeMinSelect')
var minModify = $('#timeMinSelectModify');
// all checkbox modify
var checkModify = $('.check-modify');
// auto: checkbox
var autoCheck = $('#auto_check');
var autoCheckModify = $('#auto_check_modify');
// process: textbox
var processText = $('#process_text');
var processTextModify = $('#process_text_modify');
var popupWindow = $('#popupwindow');
// スケジュールデータをJSON形式で保存するためのフィールド
var schedules = $('[name="schedules"]');

//----- エラーメッセージ定義 start
var errorMessage = $('#errorMessage');
var errorMessageModify = $('#errorMessageModify');
var errorMessageWithoutSensor = $('#errorMessageWithoutSensor');
var errorMessageWithoutSensorModify = $('#errorMessageWithoutSensorModify');
//----- エラーメッセージ定義 end

//----- 共用 start
var reg = new RegExp(" ", "g");
var emsgNoGroupChecked = 'グループをチェックしてください。';
var emsgGroupWithoutSensorChecked = '登録できません。';
//----- 共用 end
//--------------- variables end

//--------------- functions start
// 追加されるスケジュールの検証
function checkDailyDetail(){
	
	errorMessage.addClass('hide');
	errorMessageWithoutSensor.addClass('hide');
	// 動作が自動でない場合
	if(!autoCheck.prop('checked')){
		
		//----- 入力された動作は必ず0<=動作<=100 start
		// is numeric
		var processValue = processText.val().replace(reg, "");

		var processOk = true;
		if(processValue == '' || isNaN(processValue))
			processOk = false;
		else{
			
			if(processValue < 0 || processValue > 100)
				processOk = false;
		}

		if(!processOk){
			
			errorMessage.html('動作に0から100の間の数字を入力してください。');
			errorMessage.removeClass('hide');
			
			processText.focus();
			
			return false;
		}
		//----- 入力された動作は必ず0<=動作<=100 end
	}else{// 動作が自動の場合
		
		if(groupsWithoutSensor.filter(':checked').length > 0){
			

			errorMessageWithoutSensor.html(emsgGroupWithoutSensorChecked);
			errorMessageWithoutSensor.removeClass('hide');
			
			return false;
		}
	}

	//----- 少なくとも一つのグループがチェックされなければならない start
	// are groups checked
	if(!groupsWithSensor.filter(':checked').length > 0 && !groupsWithoutSensor.filter(':checked').length > 0){

		errorMessage.html(emsgNoGroupChecked);
		errorMessage.removeClass('hide');
		
		return false;
	}
	//----- 少なくとも一つのグループがチェックされなければならない end

	return true;
}

//check if scheduleTable is empty
function isEmptyObject(dic){
	
	for(var key in dic)
		return false;
	
	return true;
}

//スケジュールマップにスケジュールを時間順に入れる
function addItemToScheduleTable(timeStr, scheduleItem){
	
	var scheduleTableTemp = {};
	var isInsert = false;
	
	for(var key in scheduleTableMap){
		
		if(timeStr < key){
			
			if(!isInsert){
				
				scheduleTableTemp[timeStr] = scheduleItem;
				isInsert = true;
			}
		}
		
		scheduleTableTemp[key] = scheduleTableMap[key];
	}
	
	if(!isInsert)
		scheduleTableTemp[timeStr] = scheduleItem;
	
	scheduleTableMap = scheduleTableTemp;
}

//display scheduleTable data as a table
function displayScheduleTable(){
	
	scheduleTable.html('');

	if(!isEmptyObject(scheduleTableMap)){
		
		var newRow = scheduleTable[0].insertRow();
		var newCell = newRow.insertCell();
		newCell.innerHTML = "時間";
		newCell.setAttribute("class", "td-with-bg");
		newCell.setAttribute("width", "150");

		newCell = newRow.insertCell();
		newCell.innerHTML = "動作";
		newCell.setAttribute("class", "td-with-bg");
		newCell.setAttribute("width", "150");

		newCell = newRow.insertCell();
		newCell.innerHTML = "グループ";
		newCell.setAttribute("class", "td-with-bg");
		newCell.setAttribute("width", "300");

		newCell = newRow.insertCell();
		newCell.innerHTML = "操作";
		newCell.setAttribute("class", "td-with-bg content-center");

		for(var key in scheduleTableMap){
			
			newRow = scheduleTable[0].insertRow();
			
			newCell = newRow.insertCell();
			newCell.innerHTML = key;

			newCell = newRow.insertCell();
			newCell.innerHTML = scheduleTableMap[key]["process"];

			newCell = newRow.insertCell();
			
			var groupIds = "";
			var groupIdNameArr = scheduleTableMap[key]["groups"].split(",");
			
			for(var i = 0; i < groupIdNameArr.length; i++){
				
				var groupArr = groupIdNameArr[i].split(":");
				
				if(groupArr.length > 1)
					groupIds = groupIds + groupArr[1] + ", ";
			}
			
			groupIds = groupIds.substring(0, groupIds.length - 2);
			newCell.innerHTML = groupIds;

			newCell = newRow.insertCell();
			newCell.align = 'center';
			newCell.innerHTML = "<div class='btn-group'><input type='button' onclick=\"modifySchedule('" + key + "');\" value='" + buttonEditStr + "' class='btn button-zeus m-none'><input type='button' onclick=\"deleteScheduleItem('" + key +"');\" class='btn button-zeus m-none' value='" + buttonDeleteStr + "'></div>";
		}
	}
}

// add schedule to scheduleTable
function addSchedule(){
	
	// check inputed data is correct before add to scheduleTable
	if(checkDailyDetail()){
		
		var scheduleItem = {};
		// 時間		
		var timeStr = hour.val() + ":" + min.val();
		// 動作
		if(autoCheck.prop('checked'))
			scheduleItem["process"] = autoCheck.val();
		else
			scheduleItem["process"] = processText.val();
		// グループ
		var groupsWS = null;
		if(groupsWithSensor.filter(':checked').length > 0)
			groupsWS = groupsWithSensor.filter(':checked').map(function(){
				return $(this).val();
			}).get().join(',');
		
		var groupsWOS = null;
		if(groupsWithoutSensor.filter(':checked').length > 0)
			groupsWOS = groupsWithoutSensor.filter(':checked').map(function(){
				return $(this).val();
			}).get().join(',');

		var groups = groupsWS;
		if(groups == null)
			groups = groupsWOS;
		else{
			
			if(groupsWOS != null)
				groups += ',' + groupsWOS;
		}
		scheduleItem.groups = groups;

		if(scheduleTable[timeStr] == null){
			
			if(isEmptyObject(scheduleTable))
				scheduleTable[timeStr] = scheduleItem;
			else
				addItemToScheduleTable(timeStr, scheduleItem);
		}

		displayScheduleTable();
	}
}

//when pressed modify in the table
function modifySchedule(key){
	
	popupWindow.modal('show');
	checkModify.prop('checked', false);
	
	var timeArr = key.split(":");
	// set hour
	hourModify.val(timeArr[0]);
	// set minute
	minModify.val(timeArr[1]);
	// set auto checkbox or process textbox
	if(scheduleTableMap[key].process == 'AUTO'){
		
		autoCheckModify.prop('checked', true);
		
		processTextModify.prop('disabled', true);
	}else{
		
		processTextModify.val(scheduleTableMap[key].process);
		processTextModify.prop('disabled', false);
		
		autoCheckModify.prop('checked', false);
	}
	// set group checked
	var groupsArr = scheduleTableMap[key].groups.split(',');
	for(var i = 0; i < groupsArr.length; i++)
		checkModify.filter('[value="' + groupsArr[i] + '"]').prop('checked', true);

	oldKey = key;
}

// スケジュール個別修正ポップアップの検証
function checkDailyDetailModify(){
	
	errorMessageModify.addClass('hide');
	errorMessageWithoutSensorModify.addClass('hide');
	// 自動がチェックされてない場合
	if(!autoCheckModify.prop('checked')){
		
		// is numeric
		var processValue = processTextModify.val().replace(reg, "");

		var processOk = true;
		if(processValue == "" || isNaN(processValue))
			processOk = false;
		else{

			if(processValue < 0 || processValue > 100)
				processOk = false;
		}

		if(!processOk){

			errorMessageModify.html('動作に0から100の間の数字を入力してください。');
			errorMessageModify.removeClass('hide');
			processTextModify.focus();
			
			return false;
		}
	}else{
		
		if(groupsWithoutSensorModify.filter(':checked').length > 0){
			
			errorMessageWithoutSensorModify.html(emsgGroupWithoutSensorChecked);
			errorMessageWithoutSensorModify.removeClass('hide');
			
			return false;
		}
	}

	// are groups checked
	if(!groupsWithSensorModify.filter(':checked').length > 0 && !groupsWithoutSensorModify.filter(':checked').length > 0){
		
		errorMessageModify.html(emsgNoGroupChecked);
		errorMessageModify.removeClass('hide');
		
		return false;
	}

	return true;
}

//modify scheduleTable
function modifyScheduleTable(){
	
	if(checkDailyDetailModify()){
		
		var timeStr = hourModify.val() + ':' + minModify.val();
		
		var newProcess;
		if(autoCheckModify.prop('checked'))
			newProcess = "AUTO";
		else
			newProcess = processTextModify.val();

		var newScheduleItem = {};
		newScheduleItem.process = newProcess;
		// グループ
		var groupsWS = null;
		if(groupsWithSensorModify.filter(':checked').length > 0)
			groupsWS = groupsWithSensorModify.filter(':checked').map(function(){
				return $(this).val();
			}).get().join(',');
		
		var groupsWOS = null;
		if(groupsWithoutSensorModify.filter(':checked').length > 0)
			groupsWOS = groupsWithoutSensorModify.filter(':checked').map(function(){
				return $(this).val();
			}).get().join(',');

		var groups = groupsWS;
		if(groups == null)
			groups = groupsWOS;
		else{
			
			if(groupsWOS != null)
				groups += ',' + groupsWOS;
		}
		newScheduleItem.groups = groups;

		if(timeStr != oldKey){
			
			delete scheduleTableMap[oldKey];
			addItemToScheduleTable(timeStr, newScheduleItem);
		}else
			scheduleTableMap[timeStr] = newScheduleItem;

		closePopupWindow();
		displayScheduleTable();
	}
}

// delete one item from scheduleTable
function deleteScheduleItem(key){
	
	delete scheduleTableMap[key];
	displayScheduleTable();
}

// close popup window
function closePopupWindow(){
	popupWindow.modal('hide');
}

function submitForm(){
	schedules.val(JSON.stringify(scheduleTableMap));
}

// parent page
function autoChanged(autoCheck){
	
	if(autoCheck.checked){
		
		processText.prop('disabled', true);
		processText.val('');
	}else{
		
		processText.prop('disabled', false)
		processText.focus();
	}
}

// popup page when moidfy was pressed
function autoChangedModify(autoCheckModify){
	
	if(autoCheckModify.checked){
		
		processTextModify.prop('disabled', true);
		processTextModify.val('');
	}else{
		
		processTextModify.prop('disabled', false)
		processTextModify.focus();
	}
}
//--------------- functions end

//--------------- init start
zeus.setNumberOptions('timeHourSelectModify', 0, 23, false, '00');
zeus.setNumberOptions('timeMinSelectModify', 0, 59, false, '00');
zeus.setNumberOptions('scheduleTimeHourSelect', 0, 23, false, '00');
zeus.setNumberOptions('scheduleTimeMinSelect', 0, 59, false, '00');

if(reqSchedules != '')
	scheduleTableMap = JSON.parse(reqSchedules);
displayScheduleTable();
//--------------- init end