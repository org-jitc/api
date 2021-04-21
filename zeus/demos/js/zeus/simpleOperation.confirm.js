var controlMode = $('[name="controlMode"]');
var temperatureControlMode = $('[name="temperatureControlMode"]');
var zoneTr = $('.zoneTr');
var zoneCoolingTr = $('.zoneCoolingTr');
var zoneHeatingTr = $('.zoneHeatingTr');
var thresholdTr = $('.thresholdTr');
var thresholdCoolingTr = $('.thresholdCoolingTr');
var thresholdHeatingTr = $('.thresholdHeatingTr');
var methodTr = $('.methodTr');
var methodCoolingTr = $('.methodCoolingTr');
var methodHeatingTr = $('.methodHeatingTr');
var modeChangeTr = $('.modeChangeTr');
var controlModeNotCo2 = $('.controlMode-notCo2');
//temp threshold mode
var tcm2 = $('.tcm-2');
// di threshold mode
var tcm4 = $('.tcm-4');

//帯制御非表示
zoneTr.addClass('hide');
// 閾値制御非表示
thresholdTr.addClass('hide');
// 演算方法非表示
methodTr.addClass('hide');
// 制御モード非表示
modeChangeTr.addClass('hide');
controlModeNotCo2.addClass('hide');
tcm2.hide();
tcm4.hide();

// 環境制御モードが選択されていない
var tcm = temperatureControlMode.val();
if(temperatureControlMode.val() == ''){
	
	controlModeNotCo2.removeClass('hide');
	
	// 自動
	if(controlMode.val() == 2)
		modeChangeTr.removeClass('hide');
}else if(temperatureControlMode.val() == 2 || temperatureControlMode.val() == 4){// 閾値制御
	
	controlModeNotCo2.removeClass('hide');
	
	if(tcm == 2)
		tcm2.show();
	else
		tcm4.show();
	
	// 制御モード　冷
	if(controlMode.val() == 0){
		
		thresholdCoolingTr.removeClass('hide');
		methodCoolingTr.removeClass('hide');
	// 制御モード　暖
	}else if(controlMode.val() == 1){
		
		thresholdHeatingTr.removeClass('hide');
		methodHeatingTr.removeClass('hide');
	}else{

		thresholdCoolingTr.removeClass('hide');
		methodCoolingTr.removeClass('hide');
		thresholdHeatingTr.removeClass('hide');
		methodHeatingTr.removeClass('hide');
		modeChangeTr.removeClass('hide');
		
		if(temperatureControlMode.val() == 2)
			modeChangeTr.removeClass('hide');
	}
}else if(temperatureControlMode.val() == 1){// 温度帯制御
	
	controlModeNotCo2.removeClass('hide');
	
	// 制御モード　冷
	if(controlMode.val() == 0){
		
		zoneCoolingTr.removeClass('hide');
		methodCoolingTr.removeClass('hide');
	// 制御モード　暖
	}else if(controlMode.val() == 1){
		
		zoneHeatingTr.removeClass('hide');
		methodHeatingTr.removeClass('hide');
	}else{
		
		zoneCoolingTr.removeClass('hide');
		methodCoolingTr.removeClass('hide');
		zoneHeatingTr.removeClass('hide');
		methodHeatingTr.removeClass('hide');
		modeChangeTr.removeClass('hide');
	}
}else if(temperatureControlMode.val() == 5){// CO2濃度制御
	
	// 制御モード　下限オーバー
	if(controlMode.val() == 0){
		
		zoneCoolingTr.removeClass('hide');
		methodCoolingTr.removeClass('hide');
	}else if(controlMode.val() == 1){// 制御モード　上限オーバー
		
		zoneHeatingTr.removeClass('hide');
		methodHeatingTr.removeClass('hide');
	}
}