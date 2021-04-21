//--------------------------- init start
var addButtonDiv = $('#addButtonDiv');
var controlSettingIndex = 2;
if(reqControlSettingEmpty){
	
	var settingTable = $('#controlSettingPrototype').clone();
	settingTable.removeClass('hide');
	// table id
	settingTable.prop('id', 'controlSetting' + controlSettingIndex);
	// name
	settingTable.find('#nameError').prop('id', 'nameError' + controlSettingIndex);
	settingTable.find('#name').prop('id', 'name' + controlSettingIndex);
	// registerAddress
	settingTable.find('#registerAddressError').prop('id', 'registerAddressError' + controlSettingIndex);
	settingTable.find('#registerAddress').prop('id', 'registerAddress' + controlSettingIndex);
	// unitDisp
	settingTable.find('#unitDispError').prop('id', 'unitDispError' + controlSettingIndex);
	settingTable.find('#unitDisp').prop('id', 'unitDisp' + controlSettingIndex);
	// delete button
	settingTable.find('#csDel').addClass('csDelBut');
	settingTable.find('#csDel').prop('id', 'csDel' + controlSettingIndex);
	
	addButtonDiv.before(settingTable);
}else{
	
	var controlSettingArr = JSON.parse(document.inverterForm.controlSettings.value);
	for(var i = 0; i < controlSettingArr.length; i++){
		
		var controlSetting = controlSettingArr[i];
		var settingTable = $('#controlSettingPrototype').clone();
		settingTable.removeClass('hide');
		// table id
		settingTable.prop('id', 'controlSetting' + controlSetting.index);
		// name
		if(controlSetting.nameError != null){
			
			settingTable.find('#nameError').html(controlSetting.nameError);
			settingTable.find('#nameError').removeClass('hide');
		}
		settingTable.find('#nameError').prop('id', 'nameError' + controlSetting.index);
		
		settingTable.find('#name').val(controlSetting.name);
		settingTable.find('#name').prop('id', 'name' + controlSetting.index);
		// registerAddress
		if(controlSetting.registerAddressError != null){
			
			settingTable.find('#registerAddressError').html(controlSetting.registerAddressError);
			settingTable.find('#registerAddressError').removeClass('hide');
		}
		settingTable.find('#registerAddressError').prop('id', 'registerAddressError' + controlSetting.index);
		
		settingTable.find('#registerAddress').val(controlSetting.registerAddress);
		settingTable.find('#registerAddress').prop('id', 'registerAddress' + controlSetting.index);
		// unitDisp
		if(controlSetting.unitDispError != null){
			
			settingTable.find('#unitDispError').html(controlSetting.unitDispError);
			settingTable.find('#unitDispError').removeClass('hide');
		}
		settingTable.find('#unitDispError').prop('id', 'unitDispError' + controlSetting.index);
		
		settingTable.find('#unitDisp').val(controlSetting.unitDisp);
		settingTable.find('#unitDisp').prop('id', 'unitDisp' + controlSetting.index);
		// delete button
		settingTable.find('#csDel').addClass('csDelBut');
		settingTable.find('#csDel').prop('id', 'csDel' + controlSetting.index);
		
		addButtonDiv.before(settingTable);
		
		controlSettingIndex = controlSetting.index;
	}
}

if(controlSettingIndex == 2)
	$('.csDelBut').prop('disabled', true);
//----------------------- init end

// 制御設定追加ボタン
$('#addControlSetting').click(function(){
	
	// 制御設定indexに1をたす
	controlSettingIndex++;
	// 制御設定プロトタイプテーブルをクーロンする
	var settingTable = $('#controlSettingPrototype').clone();
	// クーロンしたテーブルが見えるようにする
	settingTable.removeClass('hide');
	// クーロンしたテーブルのIDを更新する
	settingTable.prop('id', 'controlSetting' + controlSettingIndex);
	// name
	settingTable.find('#nameError').prop('id', 'nameError' + controlSettingIndex);
	settingTable.find('#name').prop('id', 'name' + controlSettingIndex);
	// registerAddress
	settingTable.find('#registerAddressError').prop('id', 'registerAddressError' + controlSettingIndex);
	settingTable.find('#registerAddress').prop('id', 'registerAddress' + controlSettingIndex);
	// unitDisp
	settingTable.find('#unitDispError').prop('id', 'unitDispError' + controlSettingIndex);
	settingTable.find('#unitDisp').prop('id', 'unitDisp' + controlSettingIndex);
	// delete button
	settingTable.find('#csDel').addClass('csDelBut');
	settingTable.find('#csDel').prop('id', 'csDel' + controlSettingIndex);
	// クーロンしたテーブルを画面に追加
	addButtonDiv.before(settingTable);
	
	$('.csDelBut').prop('disabled', false);
});

//制御設定削除ボタンの動作
function controlSettingDelete(csDelBut){
	
	var delButtons = $('.csDelBut');
	if(delButtons.length > 1){
		
		var item = $(csDelBut);
		item.parent().parent().parent().remove();
	}
	
	if($('.csDelBut').length == 1)
		$('.csDelBut').prop('disabled', true);
}

// 制御設定をJSONデータにする
function setControlSettingDataSet(){
	
	var index = 2;
	var controlSettingArr = [];
	var controlSetting;
	for(var i = 2; i <= controlSettingIndex; i++){
		
		if($('#name' + i).length > 0){
			
			controlSetting = {};
			controlSetting.index = index;
			controlSetting.name = $('#name' + i).val();
			controlSetting.registerAddress = $('#registerAddress' + i).val();
			controlSetting.unitDisp = $('#unitDisp' + i).val();
			
			controlSettingArr.push(controlSetting);
			
			index++;
		}
	}
	
	$('[name="controlSettings"]').val(JSON.stringify(controlSettingArr));
}