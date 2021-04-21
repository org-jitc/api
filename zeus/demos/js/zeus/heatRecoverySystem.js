// 熱回収システムグループ名（英）
var textHeatRecoveryNameEn = $('[name="heatRecoveryNameEn"]');
// 熱生産方式
var selectHeatRecoveryType = $('[name="heatRecoveryType"]');
// 熱回収システム消費電力量センサー
var selectElectSensorUsed = $('[name="electSensorUsed"]');
var hiddenElectSensorUsedName = $('[name="electSensorUsedName"]');
// 入口流量センサー
var selectFlowSensorIn = $('[name="flowSensorIn"]');
var hiddenFlowSensorInName = $('[name="flowSensorInName"]');
// 出口流量センサー
var selectFlowSensorOut = $('[name="flowSensorOut"]');
var hiddenFlowSensorOutName = $('[name="flowSensorOutName"]');
// 入口温度センサー
var selectTempSensorIn = $('[name="tempSensorIn"]');
var hiddenTempSensorInName = $('[name="tempSensorInName"]');
// 出口温度センサー
var selectTempSensorOut = $('[name="tempSensorOut"]');
var hiddenTempSensorOutName = $('[name="tempSensorOutName"]');
// 既存装置消費電力量センサー
var trElectSensorExist = $('.tr-electSensorExist');
var selectElectSensorExist = $('[name="electSensorExist"]');
var hiddenElectSensorExistName = $('[name="electSensorExistName"]');
// 既存装置温度センサー
var trTempSensorExist = $('.tr-tempSensorExist');
var selectTempSensorExist = $('[name="tempSensorExist"]');
var hiddenTempSensorExistName = $('[name="tempSensorExistName"]');
// 固定温度
var trFixedTemp = $('.tr-fixedTemp');
var textFixedTemp = $('[name="fixedTemp"]');
// ボイラー効率
var trBoilEfficiency = $('.tr-boilEfficiency');
var textBoilerEfficiency = $('[name="boilerEfficiency"]');
// 単位あたりの発熱量
var trHeatOutputPerUnit = $('.tr-heatOutputPerUnit');
var textHeatOutputPerUnit = $('[name="heatOutputPerUnit"]');
var colorPickers = $('.colorpicker-component');

//******************** functions
selectHeatRecoveryType.change(function(){
	
	trElectSensorExist.addClass('hide');
	selectElectSensorExist.prop('disabled', true);
	trTempSensorExist.addClass('hide');
	selectTempSensorExist.prop('disabled', true);
	trBoilEfficiency.addClass('hide');
	textBoilerEfficiency.prop('disabled', true);
	trHeatOutputPerUnit.addClass('hide');
	textHeatOutputPerUnit.prop('disabled', true);
	// ヒートポンプ
	if(this.value == 1){
		
		trElectSensorExist.removeClass('hide');
		selectElectSensorExist.prop('disabled', false);
		trTempSensorExist.removeClass('hide');
		selectTempSensorExist.prop('disabled', false);
	}else{// 2. 重油ボイラー　3．ガスボイラー（LPG） 4.ガスボイラー（都市ガス）
		
		if(this.value != ''){
			
			trBoilEfficiency.removeClass('hide');
			textBoilerEfficiency.prop('disabled', false);
			// ガスボイラー（都市ガス）
			if(this.value == 4){
				
				trHeatOutputPerUnit.removeClass('hide');
				textHeatOutputPerUnit.prop('disabled', false);
			}
		}
	}
});

selectTempSensorExist.change(function(){

	trFixedTemp.addClass('hide');
	textFixedTemp.prop('disabled', true);
	
	if(this.value == 'fixedTemp') {
		
		trFixedTemp.removeClass('hide');
		textFixedTemp.prop('disabled', false);
	}
});

function onConfirmFormSubmit(){
	
	// 入口温度センサー
	hiddenTempSensorInName.val(selectTempSensorIn.find('option:selected').text());
	// 出口温度センサー
	hiddenTempSensorOutName.val(selectTempSensorOut.find('option:selected').text());
	// 入口流量センサー
	hiddenFlowSensorInName.val(selectFlowSensorIn.find('option:selected').text());
	// 出口流量センサー
	hiddenFlowSensorOutName.val(selectFlowSensorOut.find('option:selected').text());
	// 熱回収システム消費電力量センサー
	hiddenElectSensorUsedName.val(selectElectSensorUsed.find('option:selected').text());
	// 既存装置消費電力量センサー
	if(!selectElectSensorExist.prop('disabled'))
		hiddenElectSensorExistName.val(selectElectSensorExist.find('option:selected').text());
	// 既存装置温度センサー
	if(!selectTempSensorExist.prop('disabled'))
		hiddenTempSensorExistName.val(selectTempSensorExist.find('option:selected').text());
}
//____________________ functions

//********************* init
textHeatRecoveryNameEn.tooltip({
	title: '英数字・アンダーバー',
	placement: 'left',
	trigger: 'focus'
});
textHeatOutputPerUnit.tooltip({
	title: '0.00～9999.99（小数の場合は二位まで）',
	placement: 'left',
	trigger: 'focus'
});
textBoilerEfficiency.tooltip({
	title: '0.0～100.0（少数の場合は一位まで）',
	placement: 'left',
	trigger: 'focus'
});
textFixedTemp.tooltip({
	title: '-99.9～9999.9（少数の場合一位まで）',
	placement: 'left',
	trigger: 'focus'
});


selectHeatRecoveryType.change();
selectTempSensorExist.change();

colorPickers.colorpicker(btpColorPickerOption);
//_____________________ init