let intervalTime_3 = 3000;
let intervalTime_10 = 10000;

//_______________
// モニタリング・履歴表示
var graphTypeObj = {
	rdo: $('[name="graphType"]'),
	rtUpdateFrequency: $('[name="monitoringUpdateFrequency"]'),
	init: function(){
		
		this.rdo.change(function(){
			
			mierukaObj.graphType = this.value;
			envObj.graphType = null;
			energyObj.graphType = null;
			setSensorAllCheck();
			
			setOptionVisibility();
		});
	},
	val: function(){
		return this.rdo.filter(':checked').val();
	}
};
graphTypeObj.init();
// モニタリング・履歴表示
//---------------
//______________________
var viewCategoryObj = {
	rdo: $('[name="viewcategory"]'),
	init: function(){
		
		this.rdo.change(function(){
			
			console.log('in view category change');
			
			mierukaObj.viewCategory = this.value;
			envObj.viewCategory = null;
			energyObj.viewCategory = null;
			setSensorAllCheck();
			
			// デマンド
			if(this.value == 1){
				
				viewSpanObj.setDisabled(['h'], true);
				
				var vsVal = viewSpanObj.val();
				if(vsVal == 'h')
					viewSpanObj.setChecked('d', false);
				
				dispUnitObj.setChecked('elect');
				dispUnitObj.setDisabled('elect', false);
				//
				exObj.setChecked(0);
				
				btnStacked.hide();
			}else { // 電力量・パルス等
				
				viewSpanObj.setDisabled(['h'], false);
				dispUnitObj.rdo.prop('disabled', false);
				//
				exObj.setChecked(1);
				
				btnStacked.show();
			}
			
			viewSpanObj.trigger();
			
			setReduceButtonDisplay();
			setOptionVisibility();
		});
	},
	val: function(){
		return this.rdo.filter(':checked').val();
	},
	trigger: function(){
		this.rdo.filter(':checked').change();
	},
	setChecked: function(value){
		this.rdo.filter('[value="' + value + '"]').prop('checked', true);
	},
	setDisabled: function(value, flag){
		this.rdo.filter('[value="' + value + '"]').prop('disabled', flag);
	}
};
viewCategoryObj.init();
//------------------------
//_________________________________________
var dispUnitObj = {
	rdo: $('[name="dispUnit"]'),
	init: function(){
		this.rdo.change(function(){
			console.log('in disp unit change');
			mierukaObj.dispUnit = this.value;
			energyObj.dispUnit = null;
			setSensorAllCheck();
			var filtered;
			var val;
			//***** 原油換算の場合
			if(this.value == 'crudeOil' || this.value == 'co2') {
				viewSpanObj.setDisabled(['d', 'h'], true);
				val = viewSpanObj.val();
				
				if(val == 'd' || val == 'h'){
					viewSpanObj.setChecked('m', true);
				}
			}else {
				viewSpanObj.setDisabled(['d'], false);
				viewSpanObj.setDisabled(['h'], mierukaObj.viewCategory != 0);
			}
			//_____ 原油換算の場合
		});
	},
	setChecked: function(value){
		this.rdo.filter('[value="' + value + '"]').prop('checked', true);
	},
	setDisabled: function(value, flag){
		this.rdo.filter('[value="' + value + '"]').prop('disabled', flag);
	},
	val: function(){
		return this.rdo.filter(':checked').val();
	},
	trigger: function(){
		this.rdo.filter(':checked').change();
	}
};
dispUnitObj.init();
//-----------------------------------------
//________________________________________________
var bgColorObj = {
	rdo: $('[name="bgcolor"]'),
	val: function(){
		return this.rdo.filter(':checked').val();
	}
};
//------------------------------------------------
//_________________________________________
var viewTypeObj = {
	rdo: $('[name="viewtype"]'),
	init: function(){
		this.rdo.change(function(){
			console.log('in view type change');
			mierukaObj.viewType = this.value;
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
			setReduceButtonDisplay();
		});
	},
	trigger: function(){
		this.rdo.filter(':checked').change();
	},
	val: function(){
		return this.rdo.filter(':checked').val();
	}
};
viewTypeObj.init();
//-----------------------------------------
//___________________________________________________________________________
var viewSpanObj = {
	rdo:  $('[name="viewspan"]'),
	init: function(){
		this.rdo.change(function(){
			console.log('in view span change');
			mierukaObj.viewSpan = this.value;
			// モニタリング/履歴表示
			var gt = graphTypeObj.val();
			// デマンド/電力量・パルス等
			var vc = viewCategoryObj.val();
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
			
			//-> 表示スパンenable/disable
			dispUnitObj.rdo.prop('disabled', vc == 1);
			// デマンドの場合
			if(vc == 1){
				
				if(vs == 'h'){
					viewSpanObj.setChecked('d', false);
				}
				
				viewSpanObj.setDisabled(['h'], true);
				selectHour.prop('disabled', true);
				selectHs.prop('disabled', true);
				
				dispUnitObj.rdo.prop('disabled', true);
				dispUnitObj.setDisabled('elect', false);
				dispUnitObj.setChecked('elect');
			}
			
			var dispUnit = dispUnitObj.val();
			viewSpanObj.setDisabled(['d'], dispUnit == 'crudeOil' || dispUnit == 'co2');
			viewSpanObj.setDisabled(['h'], vc == 1 || (dispUnit == 'crudeOil' || dispUnit == 'co2'));
			
			setReduceButtonDisplay();
		});
	},
	val: function(){
		return this.rdo.filter(':checked').val();
	},
	setChecked: function(value, isTrigger){
		
		var filtered = this.rdo.filter('[value="' + value + '"]');
		filtered.prop('checked', true);
		
		console.log(isTrigger);
		if(isTrigger)
			filtered.change();
	},
	setDisabled: function(valueArr, flag){
		
		var marksArr = [];
		for(var i = 0, l = valueArr.length; i < l; i++)
			marksArr.push('[value="' + valueArr[i] + '"]');
		var marks = marksArr.join(',');
		var filtered = this.rdo.filter(marks);
		filtered.prop('disabled', flag);
	},
	trigger: function(){
		
		var filtered = this.rdo.filter(':checked');
		filtered.change();
	}
};
viewSpanObj.init();
//-------------------------------------------------------------------------------
var ysObj = {
	txt: $('[name="ys"]'),
	val: function(){
		return $.trim(this.txt.val());
	}
};
var msObj = {
	txt: $('[name="ms"]'),
	val: function(){
		return $.trim(this.txt.val());
	}
};
var dsObj = {
	txt: $('[name="ds"]'),
	val: function(){
		return $.trim(this.txt.val());
	}
}
var hsObj = {
	slt: $('[name="hs"]'),
	val: function(){
		return this.slt.val();
	}
};
//________________________________
var exObj = {
	rdo: $('[name="ex"]'),
	setChecked: function(value){
		this.rdo.filter('[value="' + value + '"]').prop('checked', true);
	}
};
//--------------------------------
//______________________________________________
var envOptionObj = {
	chk: $('[name="monitorOption"]'),
	init: function(){
		this.chk.change(function(){
			envObj.option = null;
			setSensorAllCheck();
		});
	},
	getChecked: function(){
		return this.chk.filter(':checked');
	}
};
envOptionObj.init();
//----------------------------------------------
//__________________________________________________
var envOptionRtObj = {
	chk: $('[name="monitorOptionRt"]'),
	init: function(){
		this.chk.change(function(){
			envObj.optionRt = null;
			setSensorAllCheck();
		});
	},
	getChecked: function(){
		return this.chk.filter(':checked');
	}
};
envOptionRtObj.init();
//--------------------------------------------------
//________________________________
var btnDataObj = {
	btn: $('.btn-data'),
	init: function(){
		this.btn.click(function(){
			hddOutput.val(this.name);
			
			if(this.name != 'rt' && isDateValid()){
				formMieruka.submit();
			}
		});
	}
};
btnDataObj.init();
//---------------------------------

//-> electric unit object
let electUnitObj = {
	val: function(){
		return document.querySelector('[name="electUnit"]:checked').value;
	}
}
//<- electric unit object

var checkNodeControlStatusDisplay = $('[name="nodeControlStatusDisplay"]');
var checkGraphLabelDispReal = $('[name="graphLabelDispReal"]');

// モニタリング－＞電力量・パルス等－＞表示時間
var selectDt = $('[name="dt"]');

var divGraphNodeControlStatus = $('#div-graph-node-control-status');

var trEnergy = $('.tr-energy');
var trEnv = $('.tr-env');
var trHr = $('.tr-hr');
var historyTable = $('#history');
var monitor = $('#monitor');
var historyButtonDiv = $('#historybutton');
var monitorButtonDiv = $('#monitorbutton');
var spanBtnGraphTotal = $('#spanBtnGraphTotal');

//***** 期間・比較
var textYs = $('[name="ys"]');
var textMs = $('[name="ms"]');
var textDs = $('[name="ds"]');
var selectHs = $('[name="hs"]');
var textYear = $('[name="year"]');
var textMonth = $('[name="month"]');
var textDay = $('[name="day"]');
var selectHour = $('[name="hour"]');
var spanCompare = $('#span-compare');
var spanPeriod = $('#span-period');
var compareDiv = $('#compare');
var periodDiv = $('#period');
var iCompareDatepicker = $('.i-compare-datepicker');
var iPeriodDatepicker = $('#i-period-datepicker');
var divCompareAddBtn = $('#div-compare-add-btn');
//_____ 期間・比較
//***** ボタン
var btnHistory = $('.btn-history');
var btnStacked = $('[name="stacked"]');
var btnRt = $('#btnRt');
//_____ ボタン
var checkSensorAll = $('#check-sensor-all');
var checkSensor = $('.check-sensor');
var checkGroup = $('.group');
var checkGroupAll = $('#checkGroupAll');
var divElectricButton = $('#electricbutton');
var containerEcoKeeper = $('#containerEcoKeeper');
var spanMonth = $('.span-month');
var spanDay = $('.span-day');
var spanHour = $('.span-hour');
var checkReduceDisp = $('[name="reduceDisp"]');
var hddOutput = $('#hdd-output');

var divErrDateArrow = $('#div-err-date-arrow');
var divErrPeriod = $('#div-err-period');
var formMieruka = $('#form-mieruka');

var mierukaObj = {};
var envObj = {};
var energyObj = {};
var viewSpan;
var ys;
var ms;
var ds;
var hs;

var checkedGroupIds;
var hasGroup = checkGroup.length > 0;
var electricUsageWindow;
var nodeControlStatusData = {};
var mierukaDatePickerOptions = {
	startView: 0,
	maxViewMode: 0,
	minViewMode: 0,
	todayBtn: 'linked',
	language: 'ja',
	autoclose: true,
	todayHighlight: true
};

var errmsgDateArrow = '正しい期間を入力してください。';

function checkDisplaySpanForElectricUsage(){
	
	var vs = viewSpanObj.val();
	var format;
	var date;
	// 年
	if(vs == 'y'){
		
		format = 'YYYY';
		date = ysObj.val();
	}
	// 月
	if(vs == 'm'){
		
		format = 'YYYY M';
		date = ysObj.val() + ' ' + msObj.val();
	}
	// 日
	if(vs == 'd'){
		
		format = 'YYYY M D';
		date = ysObj.val() + ' ' + msObj.val() + ' ' + dsObj.val();
	}
	// 時
	if(vs == 'h'){
		
		format = 'YYYY M D HH';
		date = ysObj.val() + ' ' + msObj.val() + ' ' + dsObj.val() + ' ' + hsObj.val();
	}

	return moment(date, format, true).isValid();
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

//******************** functions
//***** 各種条件によあらゆる項目の表示を設定
function setOptionVisibility(){
	
	var gt = graphTypeObj.val();
	var vc = viewCategoryObj.val();
	
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
		viewTypeObj.trigger();
		
		historyButtonDiv.show();
		monitorButtonDiv.hide();
	}
}
//_____ 各種条件によあらゆる項目の表示を設定

//***** エネルギーセンサー表示非表示
function setEnergySensorVisibility(){
	
	var energySensorCheck = trEnergy.find('[type="checkbox"]');
	//
	trEnergy.hide();
	energySensorCheck.prop('disabled', true);
	var energyFilter;
	var filteredTr;
	// グループあり
	if(hasGroup){
		
		checkGroup.filter(':checked').each(function(){
			
			var groupFilter = '.tr-' + this.value + '.tr-gt-' + mierukaObj.graphType + '.tr-vc-' + mierukaObj.viewCategory;
			// モニタリングか履歴表示の表示種別がデマンドの場合
			if(mierukaObj.graphType == 0 || mierukaObj.viewCategory == 1)
				energyFilter = groupFilter + '.tr-du-elect';
			else
				energyFilter = groupFilter + '.tr-du-' + mierukaObj.dispUnit;
			
			filteredTr = trEnergy.filter(energyFilter);
			filteredTr.show();
			filteredTr.find('[type="checkbox"]').prop('disabled', false);
		});
	}else{ // グループなし
		
		energyFilter = '.tr-gt-' + mierukaObj.graphType + '.tr-vc-' + mierukaObj.viewCategory;
		if(mierukaObj.graphType == 0 || mierukaObj.viewCategory == 1)
			energyFilter += '.tr-du-elect';
		else
			energyFilter += '.tr-du-' + mierukaObj.dispUnit;
		
		filteredTr = trEnergy.filter(energyFilter);
		filteredTr.show();
		filteredTr.find('[type="checkbox"]').prop('disabled', false);
	}
}
//_____ エネルギーセンサー表示非表示

//***** 日付の検証
function isDateValid(){
	
	divErrPeriod.empty();
	divErrDateArrow.empty();
	
	// 履歴表示の場合
	if(mierukaObj.graphType == 1){
		
		var data;
		// 表示タイプが期間の場合
		if(mierukaObj.viewType == 0){
			
			// 年
			data = $.trim(textYs.val());
			if(data == '')
				divErrPeriod.append('<div>年を入力してください。</div>');
			else{
				
				if(isNaN(data))
					divErrPeriod.append('<div>年に半角数字を入力してください。</div>');
			}
			//　月
			if(mierukaObj.viewSpan != 'y'){
				
				data = $.trim(textMs.val());
				if(data == '')
					divErrPeriod.append('<div>月を入力してください。</div>');
				else{
					
					if(isNaN(data))
						divErrPeriod.append('<div>月に半角数字を入力してください。</div>');
				}
			}
			// 日
			if(mierukaObj.viewSpan == 'd' || mierukaObj.viewSpan == 'h'){
				
				data = $.trim(textDs.val());
				if(data == '')
					divErrPeriod.append('<div>日を入力してください。</div>');
				else{
					
					if(isNaN(data))
						divErrPeriod.append('<div>日に半角数字を入力してください。</div>');
				}
			}
		// 表示タイプが比較の場合
		}else{
			
			// 年
			for(var i = 0, l = textYear.length; i < l; i++){
				
				data = $.trim(textYear[i].value);
				if(data == '')
					divErrDateArrow.append('<div>日を入力してください。</div>');
				else{
					
					if(isNaN(data))
						divErrDateArrow.append('<div>日に半角数字を入力してください。</div>');
				}
			}
			// 月
			if(mierukaObj.viewSpan != 'y'){
				
				for(var i = 0, l = textMonth.length; i < l; i++){
					
					data = $.trim(textMonth[i].value);
					if(data == '')
						divErrDateArrow.append('<div>月を入力してください。</div>');
					else{
						
						if(isNaN(data))
							divErrDateArrow.append('<div>月に半角数字を入力してください。</div>');
					}
				}
			}
			// 日
			if(mierukaObj.viewSpan == 'd' || mierukaObj.viewSpan == 'h'){
				
				for(var i = 0, l = textDay.length; i < l; i++){
					
					data = $.trim(textDay[i].value);
					if(data == '')
						divErrDateArrow.append('<div>日を入力してください。</div>');
					else{
						
						if(isNaN(data))
							divErrDateArrow.append('<div>日に半角数字を入力してください。</div>');
					}
				}
			}
		}
	}
	
	if(divErrPeriod.html() != '' || divErrDateArrow.html() != '')
		return false;
		
	return true;
}
//_____ 日付の検証

function addSelectBox(optionvalue){

	var compareLength = textYear.length;
	
	var newCompareDiv = $('<div style="flex-ai-center"></div>');
	var yearText = $('<input type="text" id="year' + compareLength + '" class="input-text10" name="year" data-index="' + compareLength + '" readonly="readonly">');
	newCompareDiv.append(yearText);
	newCompareDiv.append('&nbsp;' + reqVarYear + '&nbsp;');
	var monthSpan = $('<span class="span-month"></span>');
	var monthText = $('<input type="text" id="month' + compareLength + '" class="input-text10" name="month" data-index="' + compareLength + '" readonly="readonly">');
	monthSpan.append(monthText);
	monthSpan.append('&nbsp;' + reqVarMonth + '&nbsp;');
	newCompareDiv.append(monthSpan);
	var daySpan = $('<span class="span-day"></span>');
	var dayText = $('<input type="text" id="day' + compareLength + '" class="input-text10" name="day" data-index="' + compareLength + '" readonly="readonly">');
	daySpan.append(dayText);
	daySpan.append('&nbsp;' + reqVarDay + '&nbsp;');
	newCompareDiv.append(daySpan);
	var hourSpan = $('<span class="span-hour"></span>');
	var hourSelect = $('<select id="hour' + compareLength + '" name="hour" class="select-text" data-index="' + compareLength + '"></select>');
	hourSpan.append(hourSelect);
	hourSpan.append('&nbsp;' + reqVarHour + '&nbsp;');
	newCompareDiv.append(hourSpan);
	var calendarI = $('<i class="fas fa-calendar-alt i-compare-datepicker" data-index="' + compareLength + '"></i>');
	newCompareDiv.append(calendarI);
	var leftA = $('<a href="javascript:void(0)" class="td-none" data-toggle="date-arrow" data-r="viewspan" data-arrow="left"></a>');
	leftA.attr('data-y', 'year' + compareLength);
	leftA.attr('data-m', 'month' + compareLength);
	leftA.attr('data-d', 'day' + compareLength);
	leftA.click(onIDateArrowClick);
	var leftI = $('<i class="fas fa-arrow-alt-circle-left fa-2x"></i>');
	leftA.append(leftI);
	newCompareDiv.append(leftA);
	var rightA = $('<a href="javascript:void(0)" class="td-none" data-toggle="date-arrow" data-r="viewspan" data-arrow="right"></a>');
	rightA.attr('data-y', 'year' + compareLength);
	rightA.attr('data-m', 'month' + compareLength);
	rightA.attr('data-d', 'day' + compareLength);
	rightA.click(onIDateArrowClick);
	var rightI = $('<i class="fas fa-arrow-alt-circle-right fa-2x"></i>');
	rightA.append(rightI);
	newCompareDiv.append(rightA);
	newCompareDiv.append('&nbsp;');
	var delI = $('<i class="far fa-minus-square fa-2x cursor-pointer" title="削除" style="color: red;" onclick="$(this).parent().remove();"></i>')
	newCompareDiv.append(delI);
	
	divCompareAddBtn.before(newCompareDiv);
	
	zeus.setNumberOptions('hour' + compareLength, 0, 23, false, '00');
	calendarI.datepicker(mierukaDatePickerOptions);
	calendarI.datepicker('setDate', new Date());
	calendarI.on('changeDate', function(e){
		
		var index = $(this).attr('data-index');
		textYear.filter('[data-index="' + index + '"]').val(e.date.getFullYear());
		textMonth.filter('[data-index="' + index + '"]').val(e.date.getMonth() + 1);
		textDay.filter('[data-index="' + index + '"]').val(e.date.getDate());
	});
	
	textYear = $('[name="year"]');
	textMonth = $('[name="month"]');
	textDay = $('[name="day"]');
	selectHour = $('[name="hour"]');
	iCompareDatepicker = $('.i-compare-datepicker');
	
	spanMonth = $('.span-month');
	spanDay = $('.span-day');
	spanHour = $('.span-hour');
	
	viewSpanObj.trigger();
	// reset date arrows
	dateArrows.reset();
}

//***** 前日翌日クリック
function onIDateArrowClick(){
	
	divErrPeriod.empty();
	divErrDateArrow.empty();
	
	var item = $(this);
	var index = item.attr('data-index');
	var arrow = item.attr('data-arrow');
	
	var isSuccess = dateArrows.list[index].setMoment();
	if(isSuccess){
		
		// set datepickers
		var dp = null;
		if(arrow == 'left')
			dp = item.prev();
		else
			dp = item.prev().prev();
		dp.datepicker('setDate', dateArrows.list[index].mo.toDate());
	}else{
		
		// 期間の場合
		if(mierukaObj.viewType == 0)
			divErrPeriod.append('<div>' + errmsgDateArrow + '</div>');
		else // 比較の場合
			divErrDateArrow.append(errmsgDateArrow);
	}
}
//_____ 前日翌日クリック

function setSensorAllCheck(){
	
	let visibleChk = checkSensor.filter(':visible');
	
	checkSensorAll.prop('disabled', visibleChk.length == 0);
	
	if(visibleChk.length == 0){
		checkSensorAll.prop('checked', false);
	}else{
		
		let visibleChecked = visibleChk.filter(':checked');
		checkSensorAll.prop('checked', visibleChk.length == visibleChecked.length);
	}
}

//***** 環境センサー表示非表示
function setEnvSensorVisibility(){
	
	var gt = graphTypeObj.val();
	var vc = viewCategoryObj.val();
	var envSensorCheck = trEnv.find('[type="checkbox"]');
	
	//***** 全部隠してdisableにする
	trEnv.hide();
	envSensorCheck.prop('disabled', true);
	//_____ 全部隠してdisableにする
	
	//***** 表示種別が電力量・パルス等の場合だけ環境センサーが見える
	if(vc == 0){
		
		var teHuTrFilter = '.tr-mo-te.tr-mo-hu.tr-mo-di';
		var teHuSensorTr = trEnv.filter(teHuTrFilter);
		var notTeHuSensorTr = trEnv.not(teHuTrFilter);
		
		var moNotTEHU = [];
		var moTEHU = [];
		var monitorOptions;
		// リアルタイム
		if(gt == 0)
			monitorOptions = envOptionRtObj.getChecked(); 
		else // 履歴
			monitorOptions = envOptionObj.getChecked();
		
		monitorOptions.each(function(){
			
			if(this.value == 'te' || this.value == 'hu' || this.value == 'di'){
				
				moTEHU.push(this.value)
				if(this.value == 'te')
					moNotTEHU.push(this.value);
			}else
				moNotTEHU.push(this.value);
		});
		
		//***** 温湿度センサー
		if(hasGroup){
			
			checkGroup.filter(':checked').each(function(){
				
				var groupFilter = '.tr-' + this.value;
				// 温湿度センサー
				if(moTEHU.length > 0){
					
					var filteredTr = teHuSensorTr.filter(groupFilter);
					filteredTr.show();
					filteredTr.find('[type="checkbox"]').prop('disabled', false);
				}
				// 温湿度センサー以外
				if(moNotTEHU.length > 0){
					
					var filter;
					var filteredTr;
					for(var i = 0, l = moNotTEHU.length; i < l; i++){
						
						filter = groupFilter + '.tr-mo-' + moNotTEHU[i];
						filteredTr = notTeHuSensorTr.filter(filter);
						filteredTr.show();
						filteredTr.find('[type="checkbox"]').prop('disabled', false);
					}
				}
			});
		}else{
			
			// 温湿度センサー
			if(moTEHU.length > 0){
				
				teHuSensorTr.show();
				teHuSensorTr.find('[type="checkbox"]').prop('disabled', false);
			}
			// 温湿度センサー以外
			if(moNotTEHU.length > 0){
				
				var filter;
				var filteredTr;
				for(var i = 0, l = moNotTEHU.length; i < l; i++){
					
					filter = '.tr-mo-' + moNotTEHU[i];
					filteredTr = notTeHuSensorTr.filter(filter);
					filteredTr.show();
					filteredTr.find('[type="checkbox"]').prop('disabled', false);
				}
			}
		}
		//_____ 温湿度センサー
	}
	//_____ 表示種別が電力量・パルス等の場合だけ環境センサーが見える
}
//_____ 環境センサー表示非表示

formMieruka.keydown(function(){
	
	if(event.keyCode == 13)
		return false;
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

iPeriodDatepicker.on('changeDate', function(e){
	
	if(e.date != null){
		textYs.val(e.date.getFullYear());
		textMs.val(e.date.getMonth() + 1);
		textDs.val(e.date.getDate());
	}
});
iCompareDatepicker.on('changeDate', function(e){
	
	if(e.date != null) {
		
		var index = $(this).attr('data-index');
		textYear.filter('[data-index="' + index + '"]').val(e.date.getFullYear());
		textMonth.filter('[data-index="' + index + '"]').val(e.date.getMonth() + 1);
		textDay.filter('[data-index="' + index + '"]').val(e.date.getDate());
	}
});

//電力使用比率ボタン
var euObj ={};
function openElectUsagePage(){
	
	var checkedSensorElements = document.getElementsByName("checkGroup");
	if(checkedSensorElements.length > 0){
		
		if(checkDisplaySpanForElectricUsage()){
			
			let checkedSensorsStr = null;
			let e;
			for(let i = 0, l = checkedSensorElements.length; i < l; i++){
				
				e = checkedSensorElements[i];
				if(!e.disabled && e.checked && (e.value.indexOf('E') == 0 || e.value.indexOf('D') == 0)){
					
					if(checkedSensorsStr == null)
						checkedSensorsStr = e.value;
					else
						checkedSensorsStr = checkedSensorsStr + "," + e.value;
				}
			}

			if(checkedSensorsStr === null)
				alert('センサーを選択してください。');
			else{
				
				let vs = viewSpanObj.val();
				euObj.viewSpan = vs;
				euObj.ys = ysObj.val();
				if('mdh'.indexOf(vs) >= 0)
					euObj.ms = msObj.val();
				else
					delete euObj.ms;
				if('dh'.indexOf(vs) >= 0)
					euObj.ds = dsObj.val();
				else
					delete euObj.ds;
				if('h' === vs)
					euObj.hs = hsObj.val();
				else
					delete euObj.hs;
				
				euObj.sensorIds = checkedSensorsStr;
				
				electricUsageWindow = window.open(contextPath + "Mieruka/ElectricUsageList.do", "", "charset=utf-8,width=1040,height=750,top=0,left=0,scrollbars=yes,toolbar=no,menubar=no, resizable=no,location=no, status=no");
			}
		}
	}
}

function closeElectUsagePage(){
	electricUsageWindow.close();
}

$('[name="ys"],[name="ms"],[name="ds"]').bind('input propertychange', function(){

	var year = textYs.val();
	var month = textMs.val();
	if(month > 12)
		textMs.val(12)
	else if(month < 1)
		textMs.val(1);
	
	var day = textDs.val();
	var maxDayDate = new Date(year, month, 0);
	var maxDay = maxDayDate.getDate();
	if(day > maxDay)
		textDs.val(maxDay);
	else if(day < 1)
		textDs.val(1);
});

//***** グループチェック動作
checkGroup.change(function(){
	
	envObj.group = null;
	energyObj.group = null;
	setSensorAllCheck();
	
	let groupCheckedLen = checkGroup.filter(':checked').length;
	if(groupCheckedLen == 0)
		checkGroupAll.prop('checked', false);
	else
		checkGroupAll.prop('checked', checkGroup.length == groupCheckedLen);
});
// グループ全体チェック動作
checkGroupAll.change(function(){
	
	// 1. check/uncheck all groups
	checkGroup.prop('checked', this.checked);
	// 2. set visibility to group sensors
	envObj.group = null;
	energyObj.group = null;
	// 3. set sensor check all
	setSensorAllCheck();
});
//_____ グループチェック動作

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

function changeMonitoringUpdateFrequency(selectElement){

	if(!isUpdateFrequencyEmpty)
		btnRt.click();
}

function setReduceButtonDisplay(){
	
	if (
		graphTypeObj.val() == 1 && // 履歴表示
		viewSpanObj.val() == 'd' && // 日
		viewTypeObj.val() == 0 && // 期間
		hostName == 'ecoCloud' // ecoCloudの場合だけ
	)
		divElectricButton.show();
	else
		divElectricButton.hide();
}

function showhide(){
	
	var disp;
	if (containerEcoKeeper.length > 0) {
		
		if(document.getElementById('containerEcoKeeper').style.display == "block"){
			
			disp = "none";
			document.getElementById('containerEcoKeeper').style.display = disp;
		}else{
			
			disp = "block";
			document.getElementById('containerEcoKeeper').style.display = disp;
		}
	}
	
	if (document.getElementById('containerElectricSensor') != null) {
		
		if(document.getElementById('containerElectricSensor').style.display == "block"){
			
			disp = "none";
			document.getElementById('containerElectricSensor').style.display = disp;
		}else{
			
			disp = "block";
			document.getElementById('containerElectricSensor').style.display = disp;
		}
	}
	
	if (document.getElementById('containerTemperatureSensor') != null) {
		
		if(document.getElementById('containerTemperatureSensor').style.display == "block"){
			
			disp = "none";
			document.getElementById('containerTemperatureSensor').style.display = disp;
		}else{
			
			disp = "block";
			document.getElementById('containerTemperatureSensor').style.display = disp;
		}
	}
	
	$.ajax({
		url: '/zdaemon/',
		async: true,
		cache: false,
		type: 'get',
		data: {dispAll: disp, userId: userId}
	});
}

function updateContainer(){
	
	$.ajax({
		url: '/zdaemon/',
		async: true,
		cache: false,
		type: 'get',
		data: {
			t: output,
			viewspan: fbViewSpan,
			ys: fbYs,
			ms: fbMs,
			ds: fbDs
		},
		success: function(response){
			
			$('#container').html(response);
			setTimeout(updateContainer, intervalTime_3);
		},
		error: function(){
			setTimeout(updateContainer, intervalTime_3);
		}
	});
}

function updateContainerEcoKeeper() {
	
	$.ajax({
		url: '/zdaemon/',
		async: true,
		type: 'get',
		data: {ecoKeeper: ecoKeeper, deviceList: deviceList},
		success: function(response){
			
			$('#containerEcoKeeper').html(response);
			setTimeout(updateContainerEcoKeeper, intervalTime_10);
		},
		error: function(){
			setTimeout(updateContainerEcoKeeper, intervalTime_10);
		}
	});
}

function updateContainerElectricSensor(){
	
	let param = {};
	param.electricSensor = electricSensor;
	param.deviceList = deviceList;
	param.userId = userId;
	param.unit = electUnitObj.val() === 'k'? 'kw': 'w';
	
	$.ajax({
		url: '/zdaemon/',
		async: true,
		cache: false,
		type: 'get',
		data: param,
		success: function(response){
			
			$('#containerElectricSensor').html(response);
			setTimeout(updateContainerElectricSensor, intervalTime_10);
		},
		error: function(){
			setTimeout(updateContainerElectricSensor, intervalTime_10);
		}
	});
}

//***** 選択されているエネルギーセンサーを運転判断電力量センサーにするノードの運転状況グラフ
function getNodeControlStatusGraph(){
	
	var sensorIds = checkSensor.filter(':visible:checked').map(function(){
		return this.value;
	}).get().join(',');
	
	if(sensorIds != ''){
		
		var param = {};
		param.sensorIds = sensorIds;
		param.period = selectDt.val();
		param.bgcolor = bgColorObj.val();
		param.labelDisp = checkGraphLabelDispReal.prop('checked')? 1: 0;
		if(nodeControlStatusData.timeMili != null)
			param.timeMili = nodeControlStatusData.timeMili;
		
		$.ajax({
			url: '/zeuschart/NodeInformation/GetNodeControlStatusForMieruka.do',
			async: true,
			cache: false,
			type: 'POST',
			data: param,
			success: function(response){
				let respObj = JSON.parse(response);
				if(respObj.error != null){
					console.log(respObj.error.message);
					divGraphNodeControlStatus.find('img').attr('src', '');
				}else{
					if(nodeControlStatusData.timeMili == null){
						nodeControlStatusData.timeMili = respObj.timeMili;
					}
					divGraphNodeControlStatus.removeClass('d-none');
					divGraphNodeControlStatus.find('img').attr('src', '/zeuschart/nodecontrolstatuschart_' + nodeControlStatusData.timeMili + '.png?t=' + Math.random());
				}
			},
			error: function(){
				console.log('get node status graph data error');
				divGraphNodeControlStatus.addClass('d-none');
			}
		});
	}else{
		divGraphNodeControlStatus.addClass('d-none');
	}
}
//_____ 選択されているエネルギーセンサーを運転判断電力量センサーにするノードの運転状況グラフ

function updateContainerTemperatureSensor(){
	
	if(!isCheckGroupStrEmpty){
		
		let param = {};
		param.temperatureSensor = temperatureSensor;
		param.deviceList = deviceList;
		param.userId = userId;
		
		$.ajax({
			url: '/zdaemon/',
			async: true,
			cache: false,
			type: 'get',
			data: param,
			success: function(response){
				
				$('#containerTemperatureSensor').html(response);
				setTimeout(updateContainerTemperatureSensor, intervalTime_10);
			},
			error: function(){
				setTimeout(updateContainerTemperatureSensor, intervalTime_10);
			}
		});
	}
}

//***** グラフの縦幅設定
function GraphSize(){
	this.div = {
		error: {
			heightGeneral: document.querySelector('#errGraphHeightGeneral'),
			heightLarge: document.querySelector('#errGraphHeightLarge')
		}
	};
	this.link = document.querySelector('#graphSizeLink');
	this.modal = document.querySelector('#graphSizeModal');
	this.mode = new ZeusRadio({name: 'modeGraphSize'});
	this.heightGeneral = document.querySelector('#graphHeightGeneral');
	this.heightLarge = document.querySelector('#graphHeightLarge');
	this.button = {
		reset: document.querySelector('#graphSizeReset'),
		submit: document.querySelector('#graphSizeSubmit')
	}
	// bind events
	this.link.onclick = this.onLinkClick.bind(this);
	for(let i = 0, l = this.mode.radios.length; i < l; i++){
		this.mode.radios[i].onchange = this.onModeChange.bind(this);
	}
	this.heightGeneral.onkeyup = zeus.onNumberInput;
	this.heightLarge.onkeyup = zeus.onNumberInput;
	this.button.reset.onclick = this.onBtnResetClick.bind(this);
	this.button.submit.onclick = this.onBtnSubmitClick.bind(this);
	// initialization
	this.onModeChange.call(this);
}
GraphSize.prototype = {
	// events
	onLinkClick: function(){
		$(this.modal).modal('show');
	},
	onBtnResetClick: function(){
		this.div.error.heightGeneral.innerHTML = '';
		this.div.error.heightLarge.innerHTML = '';
		this.mode.setChecked('auto');
		this.heightGeneral.value = 360;
		this.heightLarge.value = 620;
	},
	onBtnSubmitClick: function(){
		this.div.error.heightGeneral.innerHTML = '';
		this.div.error.heightLarge.innerHTML = '';
		
		let isValid = true;
		let ghg = this.heightGeneral.value.trim();
		let ghl = this.heightLarge.value.trim();
		
		if(ghg.length == 0){
			isValid = false;
			this.div.error.heightGeneral.innerHTML = fmtHeightGeneralRequired;
		}else{
			
			if(isNaN(ghg)){
				isValid = false;
				this.div.error.heightGeneral.innerHTML = fmtHeightGeneralNotNum;
			}
		}
		
		if(ghl.length == 0){
			isValid = false;
			this.div.error.heightLarge.innerHTML = fmtHeightLargeRequired;
		}else{
			
			if(isNaN(ghl)){
				isValid = false;
				this.div.error.heightLarge.innerHTML = fmtHeightLargeNotNum;
			}
		}
		
		if(isValid){
			let param = {};
			param.mode = graphSize.mode.getCheckedValue();
			param.generalHeight = ghg;
			param.largeHeight = ghl;
			
			$.ajax({
				url: contextPath + '/Ajax/SetMonitoringGraphSize.do',
				async: true,
				cache: false,
				data: 'param=' + JSON.stringify(param),
				graphSize: this,
				success: function(response){
					$(this.graphSize.modal).modal('hide');
				},
				error: function(){
					console.log('set graph size error');
					$(this.graphSize.modal).modal('hide');
				}
			});
		}
	},
	onModeChange: function(){
		let mode = this.mode.getCheckedValue();
		this.heightGeneral.disabled = mode === 'auto';
		this.heightLarge.disabled = mode === 'auto';
	}	
};
let graphSize = new GraphSize();
//_____ グラフの縦幅設定

Object.defineProperties(envObj, {
	graphType: {
		set: setEnvSensorVisibility
	},
	group: {
		set: setEnvSensorVisibility
	},
	viewCategory: {
		set: setEnvSensorVisibility
	},
	option: {
		set: setEnvSensorVisibility
	},
	optionRt: {
		set: setEnvSensorVisibility
	}
});

Object.defineProperties(energyObj, {
	graphType: {
		set: setEnergySensorVisibility
	},
	group: {
		set: setEnergySensorVisibility
	},
	viewCategory: {
		set: setEnergySensorVisibility
	},
	dispUnit: {
		set: setEnergySensorVisibility
	}
});

//******************** init
//***** init mieruka obj
mierukaObj.graphType = graphTypeObj.val();
mierukaObj.viewSpan = viewSpanObj.val();
mierukaObj.viewType = fbViewType;
mierukaObj.dispUnit = dispUnitObj.val();
mierukaObj.viewCategory = fbViewCategory;
//_____ init mieruka obj

zeus.setNumberOptions('hs', 0, 23, false, '00');
selectHs.val(isHsEmpty? '00': fbHs);

//***** 表示スパンdispUnit初期化
if(dispUnitObj.rdo.filter(':checked').length == 0) {
	
	if(dispUnitObj.rdo.length > 0)
		dispUnitObj.rdo[0].checked = true;
}
dispUnitObj.trigger();
//_____ 表示スパンdispUnit初期化

//***** 対象期間・各比較年月日の初期化
iCompareDatepicker.datepicker(mierukaDatePickerOptions);

if(is_target_span_empty) {
	$(iCompareDatepicker[0]).datepicker('setDate', new Date());
	selectHour.val('00');
}else {
	var d;
	
	for(var i = 0, l = textDay.length; i < l; i++){
		d = textDay[i].value;
			
		if(d != ''){
			iCompareDatepicker.filter('[data-index="' + i + '"]').datepicker('setDate', new Date(textYear[i].value, textMonth[i].value - 1, d));
		}
	}
}

iPeriodDatepicker.datepicker(mierukaDatePickerOptions);
iPeriodDatepicker.datepicker('setDate', new Date(textYs.val(), textMs.val() - 1, textDs.val()));
//_____ 対象期間・各比較年月日の初期化

//***** グループ初期化
if(hasGroup) {
	
	if(checkGroup.filter(':checked').length < checkGroup.length)
		checkGroupAll.prop('checked', false);
	else
		checkGroupAll.prop('checked', true);
	
	if(is_checked_group_empty)
		checkedGroupIds = checked_group_ids;
		
	setInterval(saveGroupChecked, 1000);
}
//_____ グループ初期化

//***** デマンド/電力量・パルス等設定
if(is_sensor_all_empty)
	viewCategoryObj.rdo.prop('disabled', true);
else {
	
	// デマンド以外のセンサーのみある場合
	if(is_demand_empty){

		viewCategoryObj.setDisabled(1, true);
		viewCategoryObj.setChecked(0);
	}else if(is_other_empty){ // デマンドセンサーのみある場合

		viewCategoryObj.setDisabled(0, true);
		viewCategoryObj.setChecked(1);
	}
}
viewCategoryObj.trigger();
//_____ デマンド/電力量・パルス等設定

//***** 前日翌日矢印の初期化
dateArrows.init('data-toggle', 'date-arrow');
var iDateArrow = $('[data-toggle="date-arrow"]');
iDateArrow.click(onIDateArrowClick);
//_____ 前日翌日矢印の初期化

if(graph == 'OK') {
	
	if(output == 'd') {
		
		$.ajax({
			url: data_url,
			async: true,
			cache: false,
			success: function(response){
				$('#dataDisplayDiv').html(response);
			}
		});
	}
	
	//= if it is monitoring
	if(mierukaObj.graphType == 0){
		
		if(fbViewCategory == 1 && (output == 'rd' || (output == 'g' && (fbViewSpan == 'm' || fbViewSpan == 'd') && fbViewType == 0)))
			updateContainer();
		
		if(fbViewCategory == 0 && output == 'r') {
			
			if(ecoKeeper == 1)
				updateContainerEcoKeeper();
			
			if(electricSensor == 1) {
				
				updateContainerElectricSensor();
				
				//***** ノード制御状況表示
				if(checkNodeControlStatusDisplay.prop('checked')){
					
					getNodeControlStatusGraph();
					var nsInterval = setInterval(getNodeControlStatusGraph, graphTypeObj.rtUpdateFrequency.val() * 1000);
					nodeControlStatusData.intervalId = nsInterval;
				}
				//_____ ノード制御状況表示
			}
			
			if(temperatureSensor == 1)
				updateContainerTemperatureSensor();
		}
	}
}
//グラフ表示を前の状態を維持させる
exObj.setChecked(fb_ex);
//_______________________ init