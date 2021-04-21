// モニタリング/履歴表示の選択動作
radioGraphType.change(function(){
    setOptionVisibility();
    GRAPTH_OPTION_CONF.graphType = this.value;
    console.log(GRAPTH_OPTION_CONF);
});

//表示種別： デマンド/電力量・パルス等の選択動作
radioViewCategory.change(function() {
	
	// デマンド
	if(this.value == 1){
		
		var vsh = radioViewSpan.filter('[value="h"]');
		vsh.prop('disabled', true);
		
		if(vsh.prop('checked')){
			
			var vsd = radioViewSpan.filter('[value="d"]');
			vsd.prop('checked', true);
		}
		
		radioDispUnit.filter('[value="elect"]').prop('checked', true);
		radioDispUnit.not('[value="elect"]').prop('disabled', true);
	}else { // 電力量・パルス等
		
		radioViewSpan.filter('[value="h"]').prop('disabled', false);
		radioDispUnit.prop('disabled', false);
	}
	
	radioViewSpan.filter(':checked').change();
	
	trEnv.hide();
	trEnv.find('[type="checkbox"]').prop('disabled', true);
	
	setReduceButtonDisplay();
    setOptionVisibility();
    
    GRAPTH_OPTION_CONF.displayType = this.value;
    console.log(GRAPTH_OPTION_CONF);
});

radioGraphDisplay.change(function(){
    GRAPTH_OPTION_CONF.graphDisplay = this.value;
    console.log(GRAPTH_OPTION_CONF);
});

radioBgColor.change(function(){
    GRAPTH_OPTION_CONF.backgroundColor = this.value;
    console.log(GRAPTH_OPTION_CONF);
});

radioMonitorItem.change(function(){
    GRAPTH_OPTION_CONF.realtime.monitorItem = this.value;
    console.log(GRAPTH_OPTION_CONF);
});

selectDisplayTime.change(function(){
    GRAPTH_OPTION_CONF.realtime.displayTime = this.value;
    console.log(GRAPTH_OPTION_CONF);
});

checkLabelDisplayRt.change(function(){
    GRAPTH_OPTION_CONF.realtime.labelDisplay = this.checked? 1: 0;
});

monitorOptionRt.change(function(){

    GRAPTH_OPTION_CONF.realtime.envDisplayItem = monitorOptionRt.filter(':checked').map(function(){return this.value}).get().join(',');
    console.log(GRAPTH_OPTION_CONF);

	setSensorVisibility();
});

iPeriodDatepicker.on('changeDate', function(e){
	
	textYs.val(e.date.getFullYear());
	textMs.val(e.date.getMonth() + 1);
	textDs.val(e.date.getDate());
});

iCompareDatepicker.on('changeDate', function(e){
	
	if(e.date != null) {
		
		var index = $(this).attr('data-index');
		textYear.filter('[data-index="' + index + '"]').val(e.date.getFullYear());
		textMonth.filter('[data-index="' + index + '"]').val(e.date.getMonth() + 1);
		textDay.filter('[data-index="' + index + '"]').val(e.date.getDate());
	}
});

textYs.on('input', function(){

	if(this.value.length > 4) 
		this.value = this.value.slice(0, 4);

	validDate();
});

textMs.on('input', function(){

	if($.trim(this.value) != ''){

		if(this.value <= 0)
			this.value = 1;
		else if(this.value > 12)
			this.value = 12;
	}
	
	validDate();
});

textDs.on('input', function(){

	var year = $.trim(textYs.val());
	var month = $.trim(textMs.val());
	if(year != '' && month != '' && $.trim(this.value) != ''){

		var date = new Date(year, month, 0);
		var maxDay = date.getDate();

		if(this.value > maxDay)
			this.value = maxDay;
		else if(this.value < 1)
			this.value = 1;
	}

	validDate();
});

//表示スパンチェック動作
radioViewSpan.change(function(){
	
	// モニタリング/履歴表示
	var gt = radioGraphType.filter(':checked').val();
	// デマンド/電力量・パルス等
	var vc = radioViewCategory.filter(':checked').val();
	var item = $(this);
	
	//********************************** 表示タイプ：期間と比較の対象期間設定
	spanMonth.hide();
	spanDay.hide();
	spanHour.hide();
	
	var vs = this.value;
	if (vs == 'y') { // year span
		
		textMs.prop('disabled', true);
		textDs.prop('disabled', true);
		selectHs.prop('disabled', true);
		
		textMonth.prop('disabled', true);
		textDay.prop('disabled', true);
		selectHour.prop('disabled', true)
		
		mierukaDatePickerOptions.startView = 2;
		mierukaDatePickerOptions.minViewMode = 2;
		mierukaDatePickerOptions.maxViewMode = 2;
	}else if (vs == 'm') { // month span
		
		textMs.prop('disabled', false);
		textDs.prop('disabled', true);
		selectHs.prop('disabled', true);
		
		textMonth.prop('disabled', false);
		textDay.prop('disabled', true);
		selectHour.prop('disabled', true);
		
		spanMonth.show();
		
		mierukaDatePickerOptions.startView = 1;
		mierukaDatePickerOptions.minViewMode = 1;
		mierukaDatePickerOptions.maxViewMode = 2;
	}else if (vs == 'd') { // day span
		
		textMs.prop('disabled', false);
		textDs.prop('disabled', false);
		selectHs.prop('disabled', true);
		
		textMonth.prop('disabled', false);
		textDay.prop('disabled', false);
		selectHour.prop('disabled', true);
		
		spanMonth.show();
		spanDay.show();
		
		mierukaDatePickerOptions.startView = 0;
		mierukaDatePickerOptions.minViewMode = 0;
		mierukaDatePickerOptions.maxViewMode = 2;
	}else { // hour span
		
		textMs.prop('disabled', false);
		textDs.prop('disabled', false);
		selectHs.prop('disabled', false);
		
		textMonth.prop('disabled', false);
		textDay.prop('disabled', false);
		selectHour.prop('disabled', false);
		
		spanMonth.show();
		spanDay.show();
		spanHour.show();
		
		mierukaDatePickerOptions.startView = 0;
		mierukaDatePickerOptions.minViewMode = 0;
		mierukaDatePickerOptions.maxViewMode = 2;
	}
	
	var periodDate = iPeriodDatepicker.datepicker('getDate');
	iPeriodDatepicker.datepicker('destroy');
	iPeriodDatepicker.datepicker(mierukaDatePickerOptions);
	iPeriodDatepicker.datepicker('setDate', periodDate);
	
	iCompareDatepicker.each(function(){
		
		var item = $(this);
		var compareDate = item.datepicker('getDate');
		item.datepicker('destroy');
		item.datepicker(mierukaDatePickerOptions);
		item.datepicker('setDate', compareDate);
	});
	//_________________________________________ 表示タイプ：期間と比較の対象期間設定
	
	// 履歴表示の場合
	if(gt == 1){
		
		// デマンドの場合
		if(vc == 1){
			
			if(vs == 'h')
				radioViewSpan.filter('[value="d"]').prop('checked', true);
			
			radioViewSpan.filter('[value="h"]').prop('disabled', true);
			selectHour.prop('disabled', true);
			selectHs.prop('disabled', true);
			
			radioDispUnit.prop('disabled', true);
			radioDispUnit.filter('[value="elect"]').prop('disabled', false);
			radioDispUnit.filter('[value="elect"]').prop('checked', true);
		}else{ // 電力量・パルス等の場合
			
			var dispUnit = radioDispUnit.filter(':checked').val();
			if(dispUnit != 'crudeOil')
				radioViewSpan.filter('[value="h"]').prop('disabled', false);
		
			radioDispUnit.prop('disabled', false);
		}
    }
    
    GRAPTH_OPTION_CONF.history.displaySpan = this.value;
    console.log(GRAPTH_OPTION_CONF);
	
	setReduceButtonDisplay();
});

//表示タイプのチェック時動作
radioViewType.change(function(){
	
	compareDiv.css('display', 'none');
	periodDiv.css('display', 'none');
	spanCompare.hide();
	spanPeriod.hide();
	
	var item = $(this);
	if(item.val() == 0) {// 期間
		
		periodDiv.css('display', '');
		spanPeriod.show();
		
		checkReduceDisp.prop('disabled', false);
	}else { // 比較
		
		compareDiv.css('display', '');
		spanCompare.show();
		
		checkReduceDisp.prop('checked', false);
		checkReduceDisp.prop('disabled', true);
    }
    
    GRAPTH_OPTION_CONF.history.displayType = this.value;
    console.log(GRAPTH_OPTION_CONF);
	
	setReduceButtonDisplay();
});

//表示単位チェック動作
radioDispUnit.change(function(){

    GRAPTH_OPTION_CONF.history.displayUnit = this.value;
    console.log(GRAPTH_OPTION_CONF);

	setSensorVisibility();
});

checkReduceDisp.change(function(){
    GRAPTH_OPTION_CONF.history.reduceDisplay = this.checked? 1: 0;
    console.log(GRAPTH_OPTION_CONF);
});

checkGraphLabelDisp.change(function(){
	
    GRAPTH_OPTION_CONF.history.labelDisplay = this.checked? 1: 0;
    
    if(this.checked)
    	divGraphLegend.show();
    else
    	divGraphLegend.hide();
});

monitorOption.change(function(){

    GRAPTH_OPTION_CONF.history.envDisplayItem = monitorOption.filter(':checked').map(function(){return this.value}).get().join(',');
    console.log(GRAPTH_OPTION_CONF);

	setSensorVisibility();
});

checkValueOption.change(function(){

    var checkedItems = checkValueOption.filter(':checked');
    if(checkedItems.length == 0)
        checkValueOption[0].checked = true;

    GRAPTH_OPTION_CONF.history.envDisplayItemValue = checkValueOption.filter(':checked').map(function(){return this.value}).get().join(',');
    console.log(GRAPTH_OPTION_CONF);
});

//***** センサーチェック関連
checkSensorAll.change(function (){
	checkSensor.filter(':visible').prop('checked', this.checked);
});
checkSensor.change(function(){
	
	var visibleCheck = checkSensor.filter(':visible');
	if(visibleCheck.length == visibleCheck.filter(':checked').length)
		checkSensorAll.prop('checked', true);
	else
		checkSensorAll.prop('checked', false);
});
//_____ センサーチェック関連

//***** 各種条件によあらゆる項目の表示を設定
function setOptionVisibility(){
	
	var gt = radioGraphType.filter(':checked').val();
	var vc = radioViewCategory.filter(':checked').val();
	
	// モニタリング
	if(gt == 0) {
		
		// 電力・パルス等
		if(vc == 0)
			monitor.show()
		else // デマンド
			monitor.hide();
		historyTable.hide();
		
		monitorButtonDiv.show();
		historyButtonDiv.hide();
	}else { // 履歴表示
		
		historyTable.show();
		monitor.hide();
		// 期間・比較
		radioViewType.filter(':checked').change();
		
		historyButtonDiv.show();
		monitorButtonDiv.hide();
	}
	
	setSensorVisibility();
}

//***** 各種条件によりセンサー表示非表示を設定
function setSensorVisibility(){
	
	var gt = radioGraphType.filter(':checked').val();
	var vc = radioViewCategory.filter(':checked').val();
	var du = radioDispUnit.filter(':checked').val();
	var monitorOptionArr;
	// モニタリングの場合
	if(gt == 0)
		monitorOptionArr = monitorOptionRt;
	else // 履歴表示の場合
		monitorOptionArr = monitorOption;
	
	//***** 原油換算の場合
	if(du == 'crudeOil') {
		
		radioViewSpan.filter('[value="d"]').prop('disabled', true);
		radioViewSpan.filter('[value="h"]').prop('disabled', true);
		
		if(radioViewSpan.filter('[value="d"]').prop('checked') ||
				radioViewSpan.filter('[value="h"]').prop('checked')) {
			
			radioViewSpan.filter('[value="m"]').prop('checked', true);
			radioViewSpan.filter('[value="m"]').change();
		}
	}else {
		
		radioViewSpan.filter('[value="d"]').prop('disabled', false);
		if(vc == 0)
			radioViewSpan.filter('[value="h"]').prop('disabled', false);
	}
	//_____ 原油換算の場合
	
	if(hasGroup) {
		
		for(var i = 0; i < checkGroup.length; i++) {
			
			var energyTrKey = '.tr-gt-' + gt + '.tr-vc-' + vc;
			var energyCheckKey = '.check-gt-' + gt + '.check-vc-' + vc;
			// 履歴表示の場合
			if(gt == 1) {
				
				energyTrKey += '.tr-du-' + du;
				energyCheckKey += '.check-du-' + du;
			}
			var trEnergyGroup = trEnergy.filter('.tr-' + checkGroup[i].value);
			var checkEnergy = trEnergy.find('.check-' + checkGroup[i].value);
			
			if(checkGroup[i].checked){
				
				trEnergyGroup.filter(energyTrKey).show();
				trEnergyGroup.not(energyTrKey).hide();
				checkEnergy.filter(energyCheckKey).prop('disabled', false);
				checkEnergy.not(energyCheckKey).prop('disabled', true);
			}else{
				
				trEnergyGroup.filter(energyTrKey).hide();
				checkEnergy.filter(energyCheckKey).prop('disabled', true);
			}
			
			var checkEnv = trEnv.find('.check-' + checkGroup[i].value + '.check-gt-' + gt + '.check-vc-' + vc);
			var trEnvGroup = trEnv.filter('.tr-' + checkGroup[i].value + '.tr-gt-' + gt + '.tr-vc-' + vc);
			for(var j = 0; j < monitorOptionArr.length; j++) {
				
				var trKey = '.tr-mo-' + monitorOptionArr[j].value;
				var checkKey = '.check-mo-' + monitorOptionArr[j].value;
				var mov = monitorOptionArr[j].value;
				
				// モニタリング　デマンド
				if(gt == 0 && vc == 1){
					
					trEnv.hide();
					trEnv.filter('.check-' + checkGroup[i].value).prop('disabled', true);
				}else{
					
					if(checkGroup[i].checked){
						
						if(monitorOptionArr[j].checked) {
							
							trEnvGroup.filter(trKey).show();
							checkEnv.filter(checkKey).prop('disabled', false);
						}else {
							
							if(mov == 'te') {
								
								trEnvGroup.filter(trKey).not('.tr-mo-hu').hide();
								checkEnv.filter(checkKey).not('.check-mo-hu').prop('disabled', true);
							}else if(mov == 'hu') {
								
								if(!monitorOptionArr.filter('[value="te"]').prop('checked') &&
										!monitorOptionArr.filter('[value="di"]').prop('checked')){
									
									trEnvGroup.filter(trKey).hide();
									checkEnv.filter(checkKey).prop('disabled', true);
								}
							}else if(mov == 'di'){
							
								if(!monitorOptionArr.filter('[value="te"]').prop('checked') &&
										!monitorOptionArr.filter('[value="hu"]').prop('checked')){
									
									trEnvGroup.filter(trKey).hide();
									checkEnv.filter(checkKey).prop('disabled', true);
								}
							}else {
								
								trEnvGroup.filter(trKey).hide();
								checkEnv.filter(checkKey).prop('disabled', true);
							}
						}
					}else {
						
						trEnvGroup.filter(trKey).hide();
						checkEnv.filter(checkKey).prop('disabled', true);
					}
				}
			}
		}
		// グループがない熱回収システムについて
		trHr.hide();
		trHr.find('[type="checkbox"]').prop('disabled', true);
		var energySelector = '.tr-gt-' + gt + '.tr-vc-' + vc;
		var energyCheckSelector = '.check-gt-' + gt + '.check-vc-' + vc;
		// 履歴表示の場合
		if(gt == 1) {
			
			energySelector += '.tr-du-' + du;
			energyCheckSelector += '.check-du-' + du;
		}
		trHr.filter(energySelector).show();
		trHr.find(energyCheckSelector).prop('disabled', false);
	}else {
		
		var energySelector = '.tr-gt-' + gt + '.tr-vc-' + vc;
		var energyCheckSelector = '.check-gt-' + gt + '.check-vc-' + vc;
		// 履歴表示の場合
		if(gt == 1) {
			
			energySelector += '.tr-du-' + du;
			energyCheckSelector += '.check-du-' + du;
		}
		trEnergy.filter(energySelector).show();
		trEnergy.find(energyCheckSelector).prop('disabled', false);
		trEnergy.not(energySelector).hide();
		trEnergy.find('[type="checkbox"]').not(energyCheckSelector).prop('disabled', true);
		
		for(var i = 0; i < monitorOptionArr.length; i++) {
			
			var mov = monitorOptionArr[i].value;
				
			if(monitorOptionArr[i].checked){
				
				trEnv.filter('.tr-gt-' + gt + '.tr-vc-' + vc + '.tr-mo-' + mov).show();
				trEnv.find('.check-gt-' + gt).filter('.check-vc-' + vc + '.check-mo-' + mov).prop('disabled', false);
			}else {
				
				if(mov == 'te') {
					
					trEnv.filter('.tr-gt-' + gt + '.tr-vc-' + vc + '.tr-mo-' + mov).not('.tr-mo-hu').hide();
					trEnv.find('.check-gt-' + gt).not('.check-mo-hu').prop('disabled', true);
				}else if(mov == 'hu') {
					
					if(!monitorOptionArr.filter('[value="te"]').prop('checked') &&
							!monitorOptionArr.filter('[value="di"]').prop('checked')){
						
						trEnv.filter('.tr-gt-' + gt + '.tr-vc-' + vc + '.tr-mo-' + mov).hide();
						trEnv.find('.check-gt-' + gt).filter('.check-vc-' + vc + '.check-mo-' + mov).prop('disabled', true);
					}
				}else if(mov == 'di'){
				
					if(!monitorOptionArr.filter('[value="te"]').prop('checked') &&
							!monitorOptionArr.filter('[value="hu"]').prop('checked')){
						
						trEnv.filter('.tr-gt-' + gt + '.tr-vc-' + vc + '.tr-mo-' + mov).hide();
						trEnv.find('.check-gt-' + gt).filter('.check-vc-' + vc + '.check-mo-' + mov).prop('disabled', true);
					}
				}else {
					
					trEnv.filter('.tr-gt-' + gt + '.tr-vc-' + vc + '.tr-mo-' + mov).hide();
					trEnv.find('.check-gt-' + gt).filter('.check-vc-' + vc + '.check-mo-' + mov).prop('disabled', true);
				}
			}
		}
		
		// 熱回収システム
		trHr.hide();
		trHr.find('[type="checkbox"]').prop('disabled', true);
		var energySelector = '.tr-gt-' + gt + '.tr-vc-' + vc;
		var energyCheckSelector = '.check-gt-' + gt + '.check-vc-' + vc;
		// 履歴表示の場合
		if(gt == 1) {
			
			energySelector += '.tr-du-' + du;
			energyCheckSelector += '.check-du-' + du;
		}
		trHr.filter(energySelector).show();
		trHr.find(energyCheckSelector).prop('disabled', false);
	}
	
	var visibleSize = sensorBody.find('tr').filter(':visible').length;
	// モニタリングの場合
	if(gt == 0){
		
		if(visibleSize == 0)
			btnRt.prop('disabled', true);
		else
			btnRt.prop('disabled', false);
	}else {
		
		if(visibleSize == 0)
			btnHistory.prop('disabled', true);
		else
			btnHistory.prop('disabled', false);
		// デマンドの場合
		if(vc == 1)
			spanBtnGraphTotal.hide();
		else
			spanBtnGraphTotal.show();
	}
	//***** センサー全選択
	if(visibleSize == 0) {
		
		checkSensorAll.prop('checked', false);
		checkSensorAll.prop('disabled', true);
	}else {
		
		checkSensorAll.prop('disabled', false);
		
		if(visibleSize == checkSensor.filter(':visible:checked').length)
			checkSensorAll.prop('checked', true);
		else
			checkSensorAll.prop('checked', false);
	}
	//_____ センサー全選択
}

function setReduceButtonDisplay(){
	
	if (
		radioGraphType.filter('[value="1"]').prop('checked') && // 履歴表示
		radioViewSpan.filter('[value="d"]').prop('checked') && // 日
		radioViewType.filter('[value="0"]').prop('checked') && // 期間
		hostName == 'ecoCloud' // ecoCloudの場合だけ
	)
		divElectricButton.show();
	else
		divElectricButton.hide();
}

function changeMonitoringUpdateFrequency(selectElement){
    GRAPTH_OPTION_CONF.realtime.updateFrequency = selectElement.value;
}

function checkYear(){
	
	var ysElement = document.getElementById("ys");
	var ysValue = ysElement.value;
	ysValue = ysValue.replace(/(^s*)|(s*$)/g, "");
	
	// 年が入力されてない場合
	if(ysValue.length == 0){
		
		alert('年を入力してください。');
		return false;
		
	}else{
		
		// 年が数字でない場合
		if(isNaN(ysValue)){
			
			alert('年に不正な値が入力されています。');
			return false;
			
		}else{
			
			// 年が0または0以下の場合
			if(ysValue <= 0){
				
				alert('年に不正な値が入力されています。');
				return false;
			}
		}
	}

	return true;
}

function checkMonth(){
	
	var msElement = document.getElementById("ms");
	var msValue = msElement.value;
	msValue = msValue.replace(/(^s*)|(s*$)/g, "");
	
	// 月が入力されてない場合
	if(msValue.length == 0){
		
		alert('月を入力してください。');
		return false;
		
	}else{
		// 月が数字でない場合
		if(isNaN(msValue)){
			
			alert('月に不正な値が入力されています。');
			return false;
			
		}else{
			
			// 月が1以下または12以上の場合
			if(msValue < 1 || msValue > 12){
				
				alert('月に不正な値が入力されています。');
				return false;
			}
		}
	}

	return true;
}

function checkDay(){
	
	var dsElement = document.getElementById("ds");
	var dsValue = dsElement.value;
	
	dsValue = dsValue.replace(/(^s*)|(s*$)/g, "");
	
	// 日が入力されてない場合
	if(dsValue.length == 0){
		
		alert('日を入力してください。');
		return false;
		
	}else{
		
		// 日が数字でない場合
		if(isNaN(dsValue)){
			
			alert('日に不正な値が入力されています。');
			return false;
			
		}else{
			
			// 当月最後の日
			var today = new Date();
			today.setMonth(today.getMonth() + 1);
			today.setDate(0);
			
			// 日が1以下または当月の最後の日以上の場合
			if(dsValue < 1 || dsValue > today.getDate()){
				
				alert('日に不正な値が入力されています。');
				return false;
			}
		}
	}

	return true;
}

function checkDisplaySpanForElectricUsage(){
	
	var viewSpanElements = document.getElementsByName("viewspan");
	for(var i = 0; i < viewSpanElements.length; i++){
		
		if(viewSpanElements[i].checked){
			// 年
			if(viewSpanElements[i].value == 'y'){
				
				if(!checkYear())
					return false;
				else{
					
					viewSpan = viewSpanElements[i].value;
					ys = document.getElementById("ys").value.replace(/(^s*)|(s*$)/g, "");
				}
			}

			// 月
			if(viewSpanElements[i].value == 'm'){
				
				if(!checkYear() || !checkMonth())
					return false;
				else{
					
					viewSpan = viewSpanElements[i].value;
					ys = document.getElementById("ys").value.replace(/(^s*)|(s*$)/g, "");
					ms = document.getElementById("ms").value.replace(/(^s*)|(s*$)/g, "");
				}
			}

			// 日
			if(viewSpanElements[i].value == 'd'){
				
				if(!checkYear() || !checkMonth() || !checkDay())
					return false;
				else{
					
					viewSpan = viewSpanElements[i].value;
					ys = document.getElementById("ys").value.replace(/(^s*)|(s*$)/g, "");
					ms = document.getElementById("ms").value.replace(/(^s*)|(s*$)/g, "");
					ds = document.getElementById("ds").value.replace(/(^s*)|(s*$)/g, "");
				}
			}

			// 時
			if(viewSpanElements[i].value == 'h'){
				
				if(!checkYear() || !checkMonth() || !checkDay())
					return false;
				else{
					viewSpan = viewSpanElements[i].value;
					var hsElement = document.getElementsByName("hs")[0];
					var hsValue = hsElement.options[hsElement.selectedIndex].value;
					ys = document.getElementById("ys").value.replace(/(^s*)|(s*$)/g, "");
					ms = document.getElementById("ms").value.replace(/(^s*)|(s*$)/g, "");
					ds = document.getElementById("ds").value.replace(/(^s*)|(s*$)/g, "");
					hs = hsValue;
				}
			}
		}
	}

	return true;
}

//電力使用比率ボタン
function openElectUsagePage(){
	
	var checkedSensorElements = document.getElementsByName("checkGroup");
	if(checkedSensorElements.length > 0){
		
		if(checkDisplaySpanForElectricUsage()){
			
			var checkedSensorsStr = "";
			for(var i = 0; i < checkedSensorElements.length; i++){
				
				if(checkedSensorElements[i].checked){
					
					checkedSensorsStr = checkedSensorsStr + checkedSensorElements[i].value;
					if(i != checkedSensorElements.lenth - 1)
						checkedSensorsStr = checkedSensorsStr + ",";
				}
			}

			if(checkedSensorsStr == "")
				alert('センサーを選択してください。');
			else{
				
				checkedSensorIds = checkedSensorsStr;
				electricUsageWindow = window.open(contextPath + "Mieruka/ElectricUsageList.do", "", "charset=utf-8,width=1040,height=750,top=0,left=0,scrollbars=yes,toolbar=no,menubar=no, resizable=no,location=no, status=no");
			}
		}
	}
}

function closeElectUsagePage(){
	electricUsageWindow.close();
}

function validDate(){

	divErrorPeriod.empty();

	var year = $.trim(textYs.val());
	var month = $.trim(textMs.val());
	var day = $.trim(textDs.val());

	var displaySpan = GRAPTH_OPTION_CONF.history.displaySpan;
	var dsIndex = DISPLAY_SPAN_INDEX[displaySpan];
	// y
	var isYValid = true;
	if(dsIndex >= 0){

		if(year == ''){

			divErrorPeriod.append('年を入力してください。');
			isYValid = false;
		}
	}
	// m
	var isMValid = true;
	if(dsIndex >= 1){

		if(month == ''){

			divErrorPeriod.append('月を入力してください。');
			isMValid = false;
		}
	}
	// d
	var isDValid = true;
	if(dsIndex >= 2){

		if(day == ''){

			divErrorPeriod.append('日を入力してください。');
			isDValid = false;
		}
	}
}

// グラフ表示
btnGraph.click(function(){

	initBeforeGenerateGraph();
	
    var isValid = true;
    var graphType = GRAPTH_OPTION_CONF.graphType;
	console.log('0 モニタリング 1 履歴表示: ' + graphType);
    // 履歴表示の場合の期間検証
    if(graphType == 1){

        // 期間か比較か
        var hisotryDisplayType = GRAPTH_OPTION_CONF.history.displayType;
        console.log('0 期間 1 比較: ' + hisotryDisplayType);
        // 期間の場合
        if(hisotryDisplayType == 0){

			validDate();
			if(divErrorPeriod.html() != '')
				isValid = false;
        }else{// 比較の場合
        	
			divErrorPeriod.empty();
			
			var displaySpan = GRAPTH_OPTION_CONF.history.displaySpan;
			var displaySpanIndex = DISPLAY_SPAN_INDEX[displaySpan];
			
			var notEmptyCount = 0;
			for(var i = 0; i < textYear.length; i++){
				
				if(textYear[i].value != '')
					notEmptyCount += 1;
			}
			
			if(notEmptyCount < 2){

				divErrorPeriod.html('比較期間は少なくとも二つを入力してください。');
				isValid = false;
			}else{
				
				var isDateSame = true;
				var dateArr = [];
				// year
				if(displaySpanIndex >= 0){
					
					for(var i = 0; i < textYear.length; i++)
						dateArr.push(textYear[i].value);
				}
				// month
				if(displaySpanIndex >= 1){
					
					for(var i = 0; i < textMonth.length; i++)
						dateArr[i] = dateArr[i] + textMonth[i].value;
				}
				// day
				if(displaySpanIndex >= 2){
					
					for(var i = 0; i < textDay.length; i++)
						dateArr[i] = dateArr[i] + textDay[i].value;
				}
				// hour
				if(displaySpanIndex >= 3){
					
					for(var i = 0; i < selectHour.length; i++)
						dateArr[i] = dateArr[i] + selectHour[i].value;
				}
				
				var dateDict = {};
				for(var i = 0; i < dateArr.length; i++)
					dateDict[dateArr[i]] = i;
					
				if(Object.keys(dateDict).length == selectHour.length)
					isDateSame = false;
				
				if(isDateSame){

					divErrorPeriod.html('異なる比較期間を入力してください。');
					isValid = false;
				}
			}
        }
    }

    if(!isValid)
		return;
	else{
		
		if(nodeControlStatusData.intervalId != null){
			
			clearInterval(nodeControlStatusData.intervalId);
			delete nodeControlStatusData.intervalId;
			divGraphNodeControlStatus.addClass('hide');
		}

		var displayType = GRAPTH_OPTION_CONF.displayType;
		console.log('1 デマンド 0 電力量・パルス等: ' + displayType);
		if(graphType == 0){// モニタリング

			divZdaemon.show();
			
			if(displayType == 1){ // デマンド

				getMonitoringDemandChartData();
				addInterval('getMonitoringDemandChartData', null);
				updateRealtimeDemandContainer();
				addInterval('updateRealtimeDemandContainer', 3);
			}else{ // 電力量・パルス等

				getMonitoringElectChartData();
				addInterval('getMonitoringElectChartData', null);
				//***** ノード制御状況表示
				if(checkNodeControlStatusDisplay.prop('checked')){
					
					getNodeControlStatusGraph();
					var nsInterval = setInterval(getNodeControlStatusGraph, selectUpdateFrequency.val() * 1000);
					nodeControlStatusData.intervalId = nsInterval;
				}
				//_____ ノード制御状況表示
				// electric sensor
				var checkedElectricSensor = trEnergy.filter(':visible').find('[type="checkbox"]').filter(':checked').not('[value="D0001"]');
				if(checkedElectricSensor.length > 0){
					
					updateRealtimeElectContainer();
					addInterval('updateRealtimeElectContainer', 10);
				}
				// env sensor
				var checkedEnvSensor = trEnv.filter(':visible').find('[type="checkbox"]').filter(':checked');
				if(checkedEnvSensor.length > 0){
					
					updateRealtimeEnvContainer();
					addInterval('updateRealtimeEnvContainer', 10);
				}
			}
		}else{ // 履歴表示
			
			var param = {};
			param.displayType = displayType;
			var checkedSensor = checkSensor.filter(':visible:checked');
			var checkedSensorStr = checkedSensor.map(function(){return this.value;}).get().join(',');
			param.checkedSensor = checkedSensorStr;
			param.option = JSON.stringify(GRAPTH_OPTION_CONF.history);
			var displaySpanIndex = DISPLAY_SPAN_INDEX[GRAPTH_OPTION_CONF.history.displaySpan];
			// 個別か合計か
			param.graphType = this.name;
			// 期間の場合
			if(GRAPTH_OPTION_CONF.history.displayType == 0){
				
				// 年
				if(displaySpanIndex >= 0)
					param.y = textYs.val();
				// 月
				if(displaySpanIndex >= 1)
					param.m = textMs.val();
				// 日
				if(displaySpanIndex >= 2)
					param.d = textDs.val();
				// 時
				if(displaySpanIndex >= 3)
					param.h = selectHs.val();
			}else{ // 比較の場合
				
				var y, m, d, h;
				for(var i = 0; i < textYear.length; i++){
					
					// year
					if(displaySpanIndex >= 0){
						
						if(y == null)
							y = textYear[i].value;
						else
							y += ',' + textYear[i].value;
					}
					// 月
					if(displaySpanIndex >= 1){
						
						if(m == null)
							m = textMonth[i].value;
						else
							m += ',' + textMonth[i].value;
					}
					// 日
					if(displaySpanIndex >= 2){
						
						if(d == null)
							d = textDay[i].value;
						else
							d += ',' + textDay[i].value;
					}
					// hour
					if(displaySpanIndex >= 3){
						
						if(h == null)
							h = selectHour[i].value;
						else
							h += ',' + selectHour[i].value;
					}
				}
				
				// 年
				if(displaySpanIndex >= 0)
					param.y = y;
				// 月
				if(displaySpanIndex >= 1)
					param.m = m;
				// 日
				if(displaySpanIndex >= 2)
					param.d = d;
				// 時
				if(displaySpanIndex >= 3)
					param.h = h;
			}
			
			getHistoryChartData(param);
		}
		
		// グラフオプションの更新
		saveUserGraphOptions();
	}
});

function getMonitoringDemandChartData(){
	
	var param = {};
	var checkedSensor = checkSensor.filter(':visible:checked');
	var checkedSensorStr = checkedSensor.map(function(){return this.value;}).get().join(',');
	param.checkedSensor = checkedSensorStr;
	if(dataChart != null){

		if(dataChart.data.labels != null)
			param.zoneTime = dataChart.data.labels[0];
	}else
		param.init = true;

	$.ajax({
		url: '/zeuschart/Mieruka/Monitoring/Demand.do',
		async: true,
		cache: false,
		type: 'POST',
		data: param,
		success: function(response){

			var hasDemand = false;
			if(checkSensor.filter(':visible').filter('[value="D0001"]').filter(':checked').length > 0)
			hasDemand = true;

			var respObj = JSON.parse(response);
			if(dataChart == null){

				var ctx = document.getElementById('myChart').getContext('2d');
				realtimeDemandChartConfig.type = 'line';
				realtimeDemandChartConfig.data.labels = respObj.labels;
				realtimeDemandChartConfig.data.datasets = respObj.datasets;
				realtimeDemandChartConfig.options.title = respObj.title;
				realtimeDemandChartConfig.options.scales.xAxes[0].gridLines.display = false;
				realtimeDemandChartConfig.options.scales.yAxes = respObj.yAxes;
				realtimeDemandChartConfig.options.legend.display = true;
				realtimeDemandChartConfig.options.animation.duration = 1000;

				var demandData = respObj.demandData;
				if(hasDemand && demandData != null){

					var datasetsLen = realtimeDemandChartConfig.data.datasets.length;
					var datasetsData = realtimeDemandChartConfig.data.datasets[datasetsLen - 1].data;
					setRealtimeDemandData(datasetsData, demandData);
				}

				dataChart = new Chart(ctx, realtimeDemandChartConfig);
			}else{

				if(respObj.labels != null){

					var datasetsLen = dataChart.data.datasets.length;
					var datasetsData = dataChart.data.datasets[datasetsLen - 1].data;
					datasetsData.forEach(function(value, index, arr){
						value = null;
					});
					dataChart.data.labels = respObj.labels;
				}
				if(dataChart.options.animation.duration != 0)
					dataChart.options.animation.duration = 0;
				if(hasDemand && respObj.demandData != null){

					var datasetsLen = dataChart.data.datasets.length;
					var datasetsData = dataChart.data.datasets[datasetsLen - 1].data;
					
					setRealtimeDemandData(datasetsData, respObj.demandData);
				}
				dataChart.update();
			}
			if(divGraph.filter(':visible').length == 0)
				divGraph.show();
		},
		error: function(){
			console.log('get chart data error');
		}
	});
}

function setRealtimeDemandData(datasetsData, demandData){

	for(var index in demandData)
		datasetsData[index] = demandData[index];
}

function getMonitoringElectChartData(){

	var param = {};
	param.c = 0;
	param.rt = GRAPTH_OPTION_CONF.realtime.monitorItem;
	param.o = "r";
	var checkedSensor = checkSensor.filter(':visible:checked');
	var checkedSensorStr = checkedSensor.map(function(){return this.value;}).get().join(',');
	param.d = checkedSensorStr;
	param.bg = radioBgColor.filter(':checked').val();
	var date = new Date();
	param.ts = date.getTime();

	$.ajax({
		url: '/zeuschart/ChartViewer',
		async: true,
		cache: false,
		type: 'POST',
		data: param,
		success: function(response){
			
			console.log(response);
			var img = $(response).find('img');
			var a = $('<a></a>');
			a.attr('id', 'a-img')
			a.attr('href', '#');
			a.attr('data-src', img.attr('src').replace('realtimechart', 'realtimechart_large'));
			a.click(function(){

				var item = $(this);
				var largeWindow = window.open(contextPath + "large/mieruka/img_large.html");
			});
			a.append(img);
			divGraphRtElect.empty();
			divGraphRtElect.append(a);
			if(divGraphRtElect.filter(':visible').length == 0)
				divGraphRtElect.show();
		},
		error: function(){
			console.log('get realtime elect data error');
		}
	});
}

function removeInterval(){

	for(var i = 0; i < intervalItems.length; i++)
		clearInterval(intervalItems[i]);
	
	intervalItem = [];
}

function addInterval(functionName, selfUf){

	
	var uf = null;
	if(selfUf != null)
		uf = selfUf;
	else{
		
		uf = selectUpdateFrequency.val();
		if(uf == null || uf == '')
			uf = 30;
	}
	var functionInterval = setInterval(eval(functionName), uf * 1000);
	intervalItems.push(functionInterval);
}

// 履歴表示ー＞デマンド
function getHistoryChartData(param){
	
	$.ajax({
		url: '/zeuschart/Mieruka/history/chart.do',
		async: true,
		cache: false,
		type: 'POST',
		data: param,
		graphType: param.graphType,
		success: function(response){
			
			var respObj = JSON.parse(response);
			console.log(response);
			
			var ctx = document.getElementById('myChart').getContext('2d');
			if(this.graphType == 'stacked')
				realtimeDemandChartConfig.type = 'bar';
			else
				realtimeDemandChartConfig.type = 'line';
			realtimeDemandChartConfig.data.labels = respObj.labels;
			realtimeDemandChartConfig.data.datasets = respObj.datasets;
			realtimeDemandChartConfig.options.title = respObj.title;
			realtimeDemandChartConfig.options.scales.xAxes = respObj.xAxes;
			realtimeDemandChartConfig.options.scales.yAxes = respObj.yAxes;
			realtimeDemandChartConfig.options.legend.display = false;
			realtimeDemandChartConfig.options.animation.duration = 1000;

			dataChart = new Chart(ctx, realtimeDemandChartConfig);
			divGraphLegend.html(dataChart.generateLegend());
			divGraph.show()
		},
		error: function(){
			console.log('get history chart data error');
		}
	});
}

function initBeforeGenerateGraph(){

	divGraph.hide();
	divGraphRtElect.hide();
	divGraphLegend.empty();
	divZdaemon.hide();
	divCollapseZdaemon.collapse('show');
	divRealtimeDemand.empty();
	divRealtimeElect.empty();
	divRealtimeEnv.empty();

	removeInterval();
	if(dataChart != null){

		dataChart.destroy();
		dataChart = null;
		divGraph.hide();
	}
	
	textYear = $('[name="year"]');
	textMonth = $('[name="month"]');
	textDay = $('[name="day"]');
	selectHour = $('[name="hour"]');
}

function saveUserGraphOptions(){
	
	var param = {};
	// モニタリング、履歴
	param.graphType = 'graph_type=' + GRAPTH_OPTION_CONF.graphType;
	// 表示種別
	param.displayCategory = 'view_category=' + GRAPTH_OPTION_CONF.displayType;
	// グラフ表示
	param.graphDisplay = 'mieruka_ex=' + GRAPTH_OPTION_CONF.graphDisplay;
	// オプション表示項目：モニタリング
	param.monitorOptionRt = "monitor_option_rt='" + GRAPTH_OPTION_CONF.realtime.envDisplayItem + "'";
	// 表示単位
	param.displayUnit = "disp_unit='" + GRAPTH_OPTION_CONF.history.displayUnit + "'";
	// オプション表示項目：履歴
	param.monitorOption = "monitor_option='" + GRAPTH_OPTION_CONF.history.envDisplayItem + "'";
	// チックされたセンサー
	var checkedSensor = checkSensor.filter(':visible:checked');
	var sensorIds = checkedSensor.map(function(){
		return this.value;
	}).get().join(',');
	if(sensorIds == '')
		param.sensorIds = 'sensor_ids=null';
	else
		param.sensorIds = "sensor_ids='" + sensorIds + "'";
	// 削減量表示
	if(checkReduceDisp.prop('checked'))
		param.reduceDisp = 'mieruka_reduce_disp=1';
	else
		param.reduceDisp = 'mieruka_reduce_disp=null';
	
	$.ajax({
		url: contextPath + 'Ajax/User/UpdateOption.action',
		async: true,
		cache: false,
		type: 'POST',
		data: param,
		success: function(response){
			console.log('update user option success');
		},
		error: function(){
			console.log('update user option error');
		}
	});
}

//***** チェックしたグループを保存
function saveGroupChecked(){
	
	// グループのチェック状態を保存
	var currentCheckedGroupIds;
	var checkedGroup = checkGroup.filter(':checked');
	if(checkedGroup.length > 0){
		
		for(var i = 0; i < checkedGroup.length; i++){
			
			if(currentCheckedGroupIds == null)
				currentCheckedGroupIds = $(checkedGroup[i]).val();
			else
				currentCheckedGroupIds += ',' + $(checkedGroup[i]).val();
		}
	}
	
	var isChanged = false;
	if(checkedGroupIds == null){
		
		if(currentCheckedGroupIds != null)
			isChanged = true;
	}else{
		
		if(currentCheckedGroupIds == null)
			isChanged = true;
		else{
			
			if(checkedGroupIds != currentCheckedGroupIds)
				isChanged = true;
		}
	}
	
	if(isChanged){
		
		var param = {};
		if(currentCheckedGroupIds != null)
			param.checkedGroupIds = currentCheckedGroupIds;
		
		$.ajax({
			url: '/zeus/Ajax/UpdateMierukaUserCheckedGroup.do',
		   	async: true,
		   	cache: false,
			data: param,
		   	error: function(){
				console.log('checked group ids update error.');		   		
		   	}
		});
		
		checkedGroupIds = currentCheckedGroupIds;
	}
}
//_____ チェックしたグループを保存

//***** モニタリングー＞デマンド
function updateRealtimeDemandContainer(){
	
	var now = new Date();
	$.ajax({
		url: '/zdaemon/',
		async: true,
		cache: false,
		type: 'GET',
		data: {
			t: 'rd',
			viewspan: 'd',
			ys: now.getFullYear(),
			ms: now.getMonth() + 1,
			ds: now.getDay()
		},
		success: function(response){
			divRealtimeDemand.html(response);
		}
	});
}
//_____ モニタリングー＞デマンド

function updateRealtimeElectContainer(){
	
	var checkedElectricSensor = trEnergy.filter(':visible')
		.find('[type="checkbox"]')
		.filter(':checked')
		.not('[value="D0001"]');
	var sensorIds = checkedElectricSensor.map(function(){
		return this.value;
	}).get().join(',');
	
	$.ajax({
		url: '/zdaemon/',
		async: true,
		cache: false,
		type: 'GET',
		data: {electricSensor: 1, deviceList: sensorIds},
		success: function(response){
			divRealtimeElect.html(response);
		}
	});
}

function updateRealtimeEnvContainer(){
	
	var checkedEnvSensor = trEnv.filter(':visible').find('[type="checkbox"]').filter(':checked');
	var sensorIds = checkedEnvSensor.map(function(){
		return this.value;
	}).get().join(',');
	
	$.ajax({
		url: '/zdaemon/',
		async: true,
		cache: false,
		type: 'GET',
		data: {temperatureSensor: 1, deviceList: sensorIds},
		success: function(response){
			divRealtimeEnv.html(response);
		}
	});
}

//******************** data access
//***** 選択されているエネルギーセンサーを運転判断電力量センサーにするノードの運転状況グラフ
function getNodeControlStatusGraph(){
	
	var sensorIds = checkSensor.filter(':visible:checked').map(function(){
		return this.value;
	}).get().join(',');
	
	if(sensorIds != ''){
		
		var param = {};
		param.sensorIds = sensorIds;
		param.period = selectDisplayTime.val();
		param.bgcolor = radioBgColor.filter(':checked').val();
		param.labelDisp = checkLabelDisplayRt.prop('checked')? 1: 0;
		console.log(param);
		if(nodeControlStatusData.timeMili != null)
			param.timeMili = nodeControlStatusData.timeMili;
		
		$.ajax({
			url: '/zeuschart/NodeInformation/GetNodeControlStatusForMieruka.do',
			async: true,
			cache: false,
			type: 'POST',
			data: param,
			success: function(response){
				
				var respObj = JSON.parse(response);
				if(respObj.error != null){
					
					console.log(respObj.error.message);
					divGraphNodeControlStatus.find('img').attr('src', '');
				}else{
					
					if(nodeControlStatusData.timeMili == null)
						nodeControlStatusData.timeMili = respObj.timeMili;
					divGraphNodeControlStatus.removeClass('hide');
					divGraphNodeControlStatus.find('img').attr('src', '/zeuschart/nodecontrolstatuschart_' + nodeControlStatusData.timeMili + '.png?t=' + Math.random());
				}
			},
			error: function(){
				console.log('get node status graph data error');
				divGraphNodeControlStatus.addClass('hide');
			}
		});
		
	}else
		divGraphNodeControlStatus.addClass('hide');
}
//_____ 選択されているエネルギーセンサーを運転判断電力量センサーにするノードの運転状況グラフ
//____________________ data access