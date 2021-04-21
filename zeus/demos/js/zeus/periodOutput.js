//******************** definitions
var errmsgDateArrow = '正しい期間を選択または入力してください。';

// データ表示のDIV
var divDataContent = $('#div-data-content'); 
// 期間エラー
var divPeriodError = $('#divPeriodError');

var tablePo = $('#table-po');

var btnData = $('#btn-data');
var btnCSV = $('#btn-csv');
//***** 期間
var ys = $('[name="ys"]');
var ms = $('[name="ms"]');
var ds = $('[name="ds"]');
var hs = $('[name="hs"]');
var mis = $('[name="mis"]');
var startDatePicker = $('.start-date-picker');
var ye = $('[name="ye"]');
var me = $('[name="me"]');
var de = $('[name="de"]');
var he = $('[name="he"]');
var mie = $('[name="mie"]');
var endDatePicker = $('.end-date-picker');
var spanDs = $('.span-ds');
var spanHs = $('.span-hs');
var spanMis = $('.span-mis');
var spanYe = $('.span-ye');
var spanMe = $('.span-me');
var spanDe = $('.span-de');
var spanHe = $('.span-he');
var spanMie = $('.span-mie');
var spanStartCalendar = $('.span-start-calendar');
var spanEndCalendar = $('.span-end-calendar');
//_____ 期間
var radioR = $('[name="r"]'); // 粒度
var radioEu = $('[name="eu"]') // 電力単位
// エネルギー換算
var radioEnergyConversion = $('[name="energyConversion"]');
//***** 表示単位
var checkDispUnit = $('[name="dispUnit"]');
//_____ 表示単位
//***** オプション項目
var checkOption = $('[name="option"]');
var checkValueOption = $('[name="valueOption"]');
//***** オプション項目
// デマンド表示
var checkDemandDisplay = $('[name="demandDisplay"]');
// 削減量表示
var checkReduceDisplay = $('[name="reduceDisplay"]');
//***** グループ
var checkGroupAll = $('#checkGroupAll');
var checkGroup = $('.group');
//***** グループ
//***** 熱回収システム
var trHr = $('.tr-hr');
var checkHr = $('.check-hr');
//_____ 熱回収システム
//***** sensor table
// センサーの全選択解除チェックボックス
var checkSensorAll = $('#check-sensor-all');
// 全部のセンサーチェックボックス
var checkSensorIds = $('[name="sensorIds"]');
//_____ sensor table
// 操作ボタンdiv
var divBtn = $('#div-button');
// データ表示までのローディング
var sensorTableBody = $('#sensor-table-body');
// 前日翌日リンク
var aDateArrow = $('[data-toggle="date-arrow"]');

var poObj = {};
var periodDatePickerOptions = {
	startView: 0,
	maxViewMode: 0,
	minViewMode: 0,
	todayBtn: 'linked',
	language: 'ja',
	autoclose: true,
	todayHighlight: true
};
var isPeriodInit = true;
var isPeriodOk = true;
var oldGroupIds;
var tableColumns;
var tableData;

var errMsgPeriod = '期間の範囲が不正です。';
//____________________ variable definition

//******************** functions
checkDispUnit.change(setByConditions);
checkOption.change(setByConditions);
radioEnergyConversion.change(function(){
	
	if(this.value == '')
		checkDispUnit.filter('[value="water"]').prop('disabled', false);
	else
		checkDispUnit.filter('[value="water"]').prop('disabled', true);
	
	setByConditions();
});
//粒度チェック動作
radioR.change(function(){
	
	poObj.r = this.value;
	setByConditions();
});

//個々のグループチェック動作
if(fbHasGroup) {
	
	checkGroup.change(function(){
		
		if(checkGroup.filter(':checked').length < checkGroup.length)
			checkGroupAll.prop('checked', false);
		else
			checkGroupAll.prop('checked', true);
		
		setByConditions();
	});
}
	
// グループ全体チェック動作
checkGroupAll.change(function(){
	
	if(this.checked)
		checkGroup.prop('checked', true);
	else
		checkGroup.prop('checked', false);
	
	setByConditions();
});

//センサーの全選択解除
checkSensorAll.change(function () {

	var visibleCheck = checkSensorIds.filter(':visible');
	if(this.checked)
		visibleCheck.prop('checked', true);
	else
		visibleCheck.prop('checked', false);
});

// センサーのチェック動作
checkSensorIds.change(function(){
	
	var visibleCheck = checkSensorIds.filter(':visible');
	if(visibleCheck == 0){
		
		checkSensorAll.prop('checked', false);
		checkSensorAll.prop('disabled', true);
	}else{
		
		checkSensorAll.prop('disabled', false);
		
		var checkedSize = visibleCheck.filter(':checked').length;
		if(visibleCheck.length == checkedSize)
			checkSensorAll.prop('checked', true);
		else
			checkSensorAll.prop('checked', false);
	}
});

// 平均、最高、最低チェック動作
// 少なくとも一つはチェックされる様にする
checkValueOption.change(function(){
	
	if(checkValueOption.filter(':checked').length == 0)
		checkValueOption[0].checked = true;
});

//***** large table
tablePo.click(function(){
	window.open(contextPath + 'large/periodOutput/Large.jsp');
});
//===== large table

startDatePicker.on('changeDate', function(e) {
	if(e.date != null){
		ys.val(e.date.getFullYear());
		ms.val(e.date.getMonth() + 1);
		ds.val(e.date.getDate());
	}
});

endDatePicker.on('changeDate', function(e) {
	if(e.date != null){
		ye.val(e.date.getFullYear());
		me.val(e.date.getMonth() + 1);
		de.val(e.date.getDate());
	}
});

$('[name="ys"],[name="ms"],[name="ds"]').blur(function(){
	divPeriodError.empty();
	var isValid = true;
	var data;
	// 年
	data = $.trim(ys.val());
	ys.val(data);
	if(data == '' || isNaN(data))
		isValid = false;
	// 月
	data = $.trim(ms.val());
	ms.val(data);
	if(data == '' || isNaN(data))
		isValid = false;
	else{
		
		if(data > 12)
			ms.val(12);
		else if(data < 1)
			ms.val(1);
	}
	// 日
	if(poObj.r != 'M'){
		
		data = $.trim(ds.val());
		ds.val(data);
		if(data == '' || isNaN(data))
			isValid = false;
		else{
			
			var maxDayDate = new Date(ys.val(), ms.val(), 0);
			var maxDay = maxDayDate.getDate();
			if(data > maxDay)
				ds.val(maxDay);
			else if(data < 1)
				ds.val(1);
		}
	}
	
	if(isValid){
		
		var fixedDate = new Date(ys.val(), ms.val() - 1, ds.val());
		startDatePicker.datepicker('setDate', fixedDate);
	}else
		divPeriodError.append(errmsgDateArrow);
});

$('[name="ye"],[name="me"],[name="de"]').blur(function(){

	divPeriodError.empty();
	var isValid = true;
	var data;
	// 年
	data = $.trim(ye.val());
	ye.val(data);
	if(data == '' || isNaN(data))
		isValid = false;
	// 月
	data = $.trim(me.val());
	me.val(data);
	if(data == '' || isNaN(data))
		isValid = false;
	else{
		
		if(data > 12)
			me.val(12);
		else if(data < 1)
			me.val(1);
	}
	// 日
	if(poObj.r != 'M'){
		
		data = $.trim(de.val());
		de.val(data);
		if(data == '' || isNaN(data))
			isValid = false;
		else{
			
			var maxDayDate = new Date(ye.val(), me.val(), 0);
			var maxDay = maxDayDate.getDate();
			if(data > maxDay)
				de.val(maxDay);
			else if(data < 1)
				de.val(1);
		}
	}
	
	if(isValid){
		
		var fixedDate = new Date(ye.val(), me.val() - 1, de.val());
		endDatePicker.datepicker('setDate', fixedDate);
	}else
		divPeriodError.append(errmsgDateArrow);		
});

aDateArrow.click(function(){
	
	divPeriodError.empty();
	
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
	}else
		divPeriodError.append(errmsgDateArrow);
});

// 期間のエラーチェック
function checkDate(outputType){
	
	isPeriodOk = true;
	divPeriodError.empty();
	
	//***** 入力チェック
	var datas, datae;
	// 年
	datas = $.trim(ys.val());
	ys.val(datas);
	datae = $.trim(ye.val());
	ye.val(datae);
	if(datas == '' || isNaN(datas) || datae == '' || isNaN(datae))
		isPeriodOk = false;
	// 月
	datas = $.trim(ms.val());
	ms.val(datas);
	datae = $.trim(me.val());
	me.val(datae);
	if(datas == '' || isNaN(datas) || datae == '' || isNaN(datae))
		isPeriodOk = false;
	// 日
	if(poObj.r != 'M'){
		
		datas = $.trim(ds.val());
		ds.val(datas);
		datae = $.trim(de.val());
		de.val(datae);
		if(datas == '' || isNaN(datas) || datae == '' || isNaN(datae))
			isPeriodOk = false;
	}
	
	if(!isPeriodOk){
		
		divPeriodError.append(errmsgDateArrow);
		return;
	}
	//_____ 入力チェック
	
	var startDate = startDatePicker.datepicker('getDate');
	var endDate = endDatePicker.datepicker('getDate');
	var startMoment;
	var endMoment;
	var diff;
	var diffErrMsg;
	
	startDate.setSeconds(0);
	endDate.setSeconds(0);
	startDate.setMilliseconds(0);
	endDate.setMilliseconds(0);
	
	// 粒度が月の場合
	if(poObj.r == 'M') {
		
		startDate.setDate(1);
		startDate.setHours(0);
		startDate.setMinutes(0);
		startMoment = moment(startDate);
		
		endDate.setDate(1);
		endDate.setHours(0);
		endDate.setMinutes(0);
		endMoment = moment(endDate);
	}else if(poObj.r == 'd') { // 粒度が日の場合
		
		startDate.setHours(0);
		startDate.setMinutes(0);
		startMoment = moment(startDate);
		
		endDate.setHours(0);
		endDate.setMinutes(0);
		endMoment = moment(endDate);
		
		diff = endMoment.diff(startMoment, 'years');
		// 最大1年間
		if(diff > 0){
			
			isPeriodOk = false;
			diffErrMsg = '指定できる期間は最大1年間までです。';
		}
	}else if(poObj.r == 'h' || poObj.r == '30m') { // 粒度が時か30分の場合
		
		startDate.setHours(parseInt(hs.val()));
		startDate.setMinutes(0);
		startMoment = moment(startDate);
		
		endDate.setHours(parseInt(he.val()));
		endDate.setMinutes(0);
		endMoment = moment(endDate);
		
		diff = endMoment.diff(startMoment, 'days');
		if(diff > 30){
			
			isPeriodOk = false;
			diffErrMsg = '指定できる期間は最大31日間までです。';
		}
	}else { // 粒度が分の場合
		
		startDate.setHours(parseInt(hs.val()));
		startDate.setMinutes(parseInt(mis.val()));
		startMoment = moment(startDate);
		
		endDate.setHours(parseInt(he.val()));
		endDate.setMinutes(parseInt(mie.val()));
		endMoment = moment(endDate);
		
		diff = endMoment.diff(startMoment, 'days');
		if(outputType == 'data'){
			
			// 最大一日間
			if(diff > 0){

				isPeriodOk = false;
				diffErrMsg = '指定できる期間は最大1日間までです。';
			}
		}else{

			if(diff > 30){

				isPeriodOk = false;
				diffErrMsg = '指定できる期間は最大31日間までです。';
			}
		}
	}
	
	// 開始日が終了日の後の場合は×
	if(startMoment.isAfter(endMoment)) {
		
		divPeriodError.html(errMsgPeriod);
		isPeriodOk = false;
		return;
	}else{
		
		if(!isPeriodOk){
			
			divPeriodError.html(diffErrMsg);
			return;
		}
	}
}

// グループチェック変化を検知し更新
function updateModifiedGroups(){
	if(fbHasGroup){
		var checkedGids;
		var gIds = [];
		checkGroup.filter(':checked').each(function(){
			gIds.push(this.value);
		});
		if(gIds.length > 0)
			checkedGids = gIds.join();
		
		var gChanged = false;
		if(oldGroupIds == null) {
			if(checkedGids != null)
				gChanged = true;
		}else {
			if(checkedGids == null)
				gChanged = true;
			else {
				if(oldGroupIds != checkedGids)
					gChanged = true;
			}
		}
		
		if(gChanged) {
			oldGroupIds = checkedGids;
			var param = {};
			if(checkedGids != null)
				param.groupIds = checkedGids;
			$.ajax({
				url: contextPath + 'Ajax/UpdateUserPeriodGroupIds.do',
				async: true,
				cache: false,
				data: param,
				success: function() {
					console.log('update checked group ids success');
				},
				error: function() {
					console.log('update checked group ids error');
				}
			});
		}
	}
}

function setByConditions(){
	radioR.prop('disabled', false);
	checkReduceDisplay.prop('disabled', false);
	
	//***** 粒度
	//***** 期間の年月日時disable
	// 原油換算かCO2がチェックされた場合
	var checkedEC = radioEnergyConversion.filter(':checked').val();
	if(checkedEC != '') {
		radioR.filter('[value="h"]').prop('disabled', true);
		radioR.filter('[value="30m"]').prop('disabled', true);
		radioR.filter('[value="m"]').prop('disabled', true);
		
		// 粒度が月と日以外
		if(poObj.r != 'M' && poObj.r != 'd'){
			
			radioR.filter('[value="M"]').prop('checked', true);
			poObj.r = 'M';
		}
	}
	
	//***** 期間の選択範囲設定
	if(poObj.r == 'M') {
		periodDatePickerOptions.startView = 1;
		periodDatePickerOptions.minViewMode = 1;
		periodDatePickerOptions.maxViewMode = 2;
	}else {
		periodDatePickerOptions.startView = 0;
		periodDatePickerOptions.minViewMode = 0;
		periodDatePickerOptions.maxViewMode = 2;
	}
	
	var startDate = startDatePicker.datepicker('getDate');
	startDatePicker.datepicker('destroy');
	startDatePicker.datepicker(periodDatePickerOptions);
	startDatePicker.datepicker('setDate', startDate);
	
	var endDate = endDatePicker.datepicker('getDate');
	endDatePicker.datepicker('destroy');
	endDatePicker.datepicker(periodDatePickerOptions);
	endDatePicker.datepicker('setDate', endDate);
	//_____ 期間の選択範囲設定
	
	if(poObj.r == 'M') {
		ds.prop('disabled', true);
		spanDs.hide();
		hs.prop('disabled', true);
		spanHs.hide();
		mis.prop('disabled', true);
		spanMis.hide();
		
		de.prop('disabled', true);
		spanDe.hide();
		he.prop('disabled', true);
		spanHe.hide();
		mie.prop('disabled', true);
		spanMie.hide();
	}else if(poObj.r == 'd') {
		ds.prop('disabled', false);
		spanDs.show();
		de.prop('disabled', false);
		spanDe.show();
		
		hs.prop('disabled', true);
		spanHs.hide();
		mis.prop('disabled', true);
		spanMis.hide();
		
		he.prop('disabled', true);
		spanHe.hide();
		mie.prop('disabled', true);
		spanMie.hide();
	}else if(poObj.r == 'h' || poObj.r == '30m') {
		ds.prop('disabled', false);
		spanDs.show();
		de.prop('disabled', false);
		spanDe.show();
		
		hs.prop('disabled', false);
		spanHs.show();
		he.prop('disabled', false);
		spanHe.show();
		
		mis.prop('disabled', true);
		spanMis.hide();
		mie.prop('disabled', true);
		spanMie.hide();
	}else {
		ds.prop('disabled', false);
		spanDs.show();
		de.prop('disabled', false);
		spanDe.show();
		
		hs.prop('disabled', false);
		spanHs.show();
		he.prop('disabled', false);
		spanHe.show();
		
		mis.prop('disabled', false);
		spanMis.show();
		mie.prop('disabled', false);
		spanMie.show();
		
		checkReduceDisplay.prop('disabled', true);
	}
	//_____ 期間の年月日時disable
	
	//***** オプション項目のdisable
	if(poObj.r == 'm'){
		checkValueOption.filter('[value="av"]').prop('checked', true);
		checkValueOption.not('[value="av"]').prop('checked', false);
		checkValueOption.prop('disabled', true);
	}else
		checkValueOption.prop('disabled', false);
	//_____ オプション項目のdisable
	//_____ 粒度
	
	//***** デマンド表示disable
	var electChecked = checkDispUnit.filter('[value="elect"]').prop('checked');
	var checkedEC = radioEnergyConversion.filter(':checked').val();
	// 原油換算またはco2の場合は「水量」を排除する
	if(!electChecked || !fbHasDemand || checkedEC != '' || poObj.r == 'm')
		checkDemandDisplay.prop('disabled', true);
	else
		checkDemandDisplay.prop('disabled', false);
	//_____ デマンド表示disable
	
	//***** グループチェックや表示単位、オプション表示項目によるセンサー表示、disable
	if(fbHasGroup) {
		for(var i = 0, gl = checkGroup.length; i < gl; i++) {
			if(checkGroup[i].checked) {
				var trClassDu;
				var checkClassDu;
				
				var trClassGroup = '.tr-' + checkGroup[i].value;
				var checkClassGroup = '.check-' + checkGroup[i].value;
				var jqTrGroup = $(trClassGroup);
				var jqCheckGroup = $(checkClassGroup);
				//***** エネルギーセンサーの表示とdisable
				// 表示単位
				for(var j = 0, dul = checkDispUnit.length; j < dul; j++) {
					trClassDu = '.tr-' + checkDispUnit[j].value;
					checkClassDu = '.check-' + checkDispUnit[j].value;
					
					if(checkDispUnit[j].checked && !checkDispUnit[j].disabled){
						jqTrGroup.filter(trClassDu).show();
						jqCheckGroup.filter(checkClassDu).prop('disabled', false);
					}else {
						jqTrGroup.filter(trClassDu).hide();
						jqCheckGroup.filter(checkClassDu).prop('disabled', true);
					}
				}
				//_____ エネルギーセンサーの表示とdisable
				// 環境センサー
				for(var j = 0; j < checkOption.length; j++) {
					var opValue = checkOption[j].value;
					var trClassOp = '.tr-' + opValue;
					var checkClassOp = '.check-' + opValue;
					
					if('te,hu,di'.indexOf(opValue) > 0) {
						var teChecked = checkOption.filter('[value="te"]').prop('checked');
						var huChecked = checkOption.filter('[value="hu"]').prop('checked');
						var diChecked = checkOption.filter('[value="di"]').prop('checked');
						
						if(teChecked || huChecked || diChecked) {
							jqTrGroup.filter('.tr-te').show();
							jqCheckGroup.filter('.check-te').prop('disabled', false);
						}else {
							jqTrGroup.filter(trClassOp).hide();
							jqCheckGroup.filter(checkClassOp).prop('disabled', true);
						}
					}else {
						if(checkOption[j].checked) {
							jqTrGroup.filter(trClassOp).show();
							jqCheckGroup.filter(checkClassOp).prop('disabled', false);
						}else {
							jqTrGroup.filter(trClassOp).hide();
							jqCheckGroup.filter(checkClassOp).prop('disabled', true);
						}
					}
				}
			}else { // グループがチェックされていない場合
				$('.tr-' + checkGroup[i].value).hide();
				$('.check-' + checkGroup[i].value).prop('disabled', true);
			}
		}
		//***** 熱回収システム
		// 表示単位
		if(poObj.r == '30m') {
			trHr.hide();
			checkHr.prop('disabled', true);
		}else {
			for(var j = 0; j < checkDispUnit.length; j++) {
				var trClassDu = '.tr-' + checkDispUnit[j].value;
				var checkClassDu = '.check-' + checkDispUnit[j].value;
				
				if("elect,calorie,gas,heavyOil".indexOf(checkDispUnit[j].value) > 0){
					if(checkDispUnit[j].value == 'elect' || checkDispUnit[j].value == 'calorie') {
						if(checkDispUnit.filter('[value="elect"]').prop('checked') || checkDispUnit.filter('[value="calorie"]').prop('checked')) {
							trHr.filter(trClassDu).show();
							checkHr.filter(checkClassDu).prop('disabled', false);
						}else {
							trHr.filter(trClassDu).hide();
							checkHr.filter(checkClassDu).prop('disabled', true);
						}
					}
					if(checkDispUnit[j].value == 'elect' || checkDispUnit[j].value == 'gas' || checkDispUnit[j].value == 'heavyOil') {
						if(checkDispUnit.filter('[value="elect"]').prop('checked') || checkDispUnit.filter('[value="gas"]').prop('checked') || checkDispUnit.filter('[value="gas"]').prop('heavyOil')) {
							trHr.filter(trClassDu).show();
							checkHr.filter(checkClassDu).prop('disabled', false);
						}else {
							trHr.filter(trClassDu).hide();
							checkHr.filter(checkClassDu).prop('disabled', true);
						}
					}
				}else{
					if(checkDispUnit[j].checked && !checkDispUnit[j].disabled){
						trHr.filter(trClassDu).show();
						checkHr.filter(checkClassDu).prop('disabled', false);
					}else {
						trHr.filter(trClassDu).hide();
						checkHr.filter(checkClassDu).prop('disabled', true);
					}
				}
			}
		}
		//_____ 熱回収システム
	}else {
		var trClassDu;
		var checkClassDu;
		//***** エネルギーセンサー
		for(var j = 0, dul = checkDispUnit.length; j < dul; j++) {
			trClassDu = '.tr-' + checkDispUnit[j].value;
			checkClassDu = '.check-' + checkDispUnit[j].value;
			
			if(checkDispUnit[j].checked && !checkDispUnit[j].disabled) {
				$(trClassDu).show();
				$(checkClassDu).prop('disabled', false);
			}else {
				$(trClassDu).hide();
				$(checkClassDu).prop('disabled', true);
			}
		}
		//_____ エネルギーセンサー
		//***** 熱回収システム
		// 表示単位
		if(poObj.r == '30m') {
			trHr.hide();
			checkHr.prop('disabled', true);
		}else {
			for(var j = 0; j < checkDispUnit.length; j++) {
				var trClassDu = '.tr-' + checkDispUnit[j].value;
				var checkClassDu = '.check-' + checkDispUnit[j].value;
				if("elect,calorie,gas,heavyOil".indexOf(checkDispUnit[j].value) > 0){
					if(checkDispUnit[j].value == 'elect' || checkDispUnit[j].value == 'calorie') {
						if(checkDispUnit.filter('[value="elect"]').prop('checked') || checkDispUnit.filter('[value="calorie"]').prop('checked')) {
							trHr.filter(trClassDu).show();
							checkHr.filter(checkClassDu).prop('disabled', false);
						}else {
							trHr.filter(trClassDu).hide();
							checkHr.filter(checkClassDu).prop('disabled', true);
						}
					}
					if(checkDispUnit[j].value == 'elect' || checkDispUnit[j].value == 'gas' || checkDispUnit[j].value == 'heavyOil') {
						if(checkDispUnit.filter('[value="elect"]').prop('checked') || checkDispUnit.filter('[value="gas"]').prop('checked') || checkDispUnit.filter('[value="gas"]').prop('heavyOil')) {
							trHr.filter(trClassDu).show();
							checkHr.filter(checkClassDu).prop('disabled', false);
						}else {
							trHr.filter(trClassDu).hide();
							checkHr.filter(checkClassDu).prop('disabled', true);
						}
					}
				}else{
					if(checkDispUnit[j].checked){
						trHr.filter(trClassDu).show();
						checkHr.filter(checkClassDu).prop('disabled', false);
					}else {
						trHr.filter(trClassDu).hide();
						checkHr.filter(checkClassDu).prop('disabled', true);
					}
				}
			}
		}
		//_____ 熱回収システム
		//***** 環境センサー
		for(var j = 0; j < checkOption.length; j++) {
			var opValue = checkOption[j].value;
			var trClassOp = '.tr-' + opValue;
			var checkClassOp = '.check-' + opValue;
			
			if('te,hu,di'.indexOf(opValue) > 0) {
				var teChecked = checkOption.filter('[value="te"]').prop('checked');
				var huChecked = checkOption.filter('[value="hu"]').prop('checked');
				var diChecked = checkOption.filter('[value="di"]').prop('checked');
				
				if(teChecked || huChecked || diChecked) {
					$('.tr-te').show();
					$('.check-te').prop('disabled', false);
				}else {
					$(trClassOp).hide();
					$(checkClassOp).prop('disabled', true);
				}
			}else {
				if(checkOption[j].checked) {
					$(trClassOp).show();
					$(checkClassOp).prop('disabled', false);
				}else {
					
					$(trClassOp).hide();
					$(checkClassOp).prop('disabled', true);
				}
			}
		}
		//_____ 環境センサー
	}
	//_____ グループチェックや表示単位、オプション表示項目によるセンサー表示、disable
	
	var visibleCheck = checkSensorIds.filter(':visible');
	var visibleCheckedSize = visibleCheck.filter(':checked').length;
	//***** 表示センサー数による全選択解除表示、disable
	if(visibleCheck.length == 0) {
		checkSensorAll.prop('checked', false);
		checkSensorAll.prop('disabled', true);
	}else {
		checkSensorAll.prop('disabled', false);
		
		if(visibleCheck.length == visibleCheckedSize)
			checkSensorAll.prop('checked', true);
		else
			checkSensorAll.prop('checked', false);
	}
	//_____ 表示センサー数による全選択解除表示、disable
	
	//***** 表示センサー数によるボタンのdisable
	if(visibleCheck.length == 0)
		divBtn.find('[type="button"]').prop('disabled', true);
	else
		divBtn.find('[type="button"]').prop('disabled', false);
	//_____ 表示センサー数によるボタンのdisable
}

function getData(outputType) {
	checkDate(outputType);
	//　期間が不正の場合
	if(!isPeriodOk)
		return;
	
	if(outputType == 'data')
		btnData.button('loading');
	else
		btnCSV.button('loading');
	
	//******************** データ取得
	//********** parameters
	var param = {};
	param.eu = radioEu.filter(':checked').val(); // 電力単位
	//***** 環境オプション
	var to = [];
	checkOption.filter(':checked').each(function(){
		to.push(this.value);
	});
	checkValueOption.filter(':checked').each(function(){
		to.push(this.value);
	});
	param.to = to.join();
	//_____ 環境オプション
	param.ys = ys.val(); // ys
	param.ms = ms.val(); // ms
	if(!ds.prop('disabled'))
		param.ds = ds.val(); // ds
	if(!hs.prop('disabled'))
		param.hs = hs.val(); // hs
	if(!mis.prop('disabled'))
		param.mis = mis.val(); // mis
	param.ye = ye.val(); // ye
	param.me = me.val(); // me
	if(!de.prop('disabled'))
		param.de = de.val(); // de
	if(!he.prop('disabled'))
		param.he = he.val(); // he
	if(!mie.prop('disabled'))
		param.mie = mie.val(); // mie
	param.r = radioR.filter(':checked').val(); // 粒度
	//***** チェックされたセンサー
	var d = [];
	checkSensorIds.filter(':visible:checked').each(function(){
		d.push(this.value);
	});
	if(d.length > 0)
		param.d = d.join(); // checked sensor ids
	//_____ チェックされたセンサー
	if(!checkDemandDisplay.prop('disabled') && checkDemandDisplay.prop('checked'))
		param.demanddisplay = checkDemandDisplay[0].value; // デマンド
	if(checkReduceDisplay.prop('checked'))
		param.reduceDisplay = checkReduceDisplay[0].value; // 削減量表示
	param.userId = userId;
	//***** 表示単位
	var dispUnit = [];
	checkDispUnit.not(':disabled').filter(':checked').each(function(){
		dispUnit.push(this.value);
	});
	if(dispUnit.length > 0)
		param.dispUnit = dispUnit.join(); // 表示単位
	//_____ 表示単位
	var checkedEC = radioEnergyConversion.filter(':checked').val();
	if(!radioEnergyConversion.prop('disabled') && checkedEC != '')
		param.energyConversion = checkedEC; // 原油換算表示
	if(outputType == 'data')
		param.o = 'd'; // データ表示
	else
		param.o = 'csv'; // CSV
	//__________ parameters
	
	//***** データ表示
	var dataUrl = '/zeuschart/PeriodOutput/GetData.do';
	
	$.ajax({
		url: dataUrl,
		async: true,
		cache: false,
		data: param,
		outputType: outputType,
		success: function(response){
			
			if(this.outputType == 'data'){
				
				var respObj = JSON.parse(response);
				
				tableColumns = respObj.columns;
				tableData = respObj.data;
				
				// データテーブル
				tablePo.bootstrapTable('destroy').bootstrapTable({
					fixedColumns: true,
					fixedNumber: 1,
					striped: false,
					height: 500,
					columns: tableColumns,
					data: tableData
				});
				
				var tablePoThHeight = tablePo.find('th').height();
				$('.fixed-table-header').find('th').height(tablePoThHeight);
				$('.fixed-table-header-columns').find('th').height(tablePoThHeight);
				
				btnData.button('reset');
			}else {
				zeus.getFile(response);
			    btnCSV.button('reset');
			}
		},
		error: function(){
			console.log('get data from zeuschart error');
			tablePo.bootstrapTable('destroy');
			
			if(this.outputType == 'data')
				btnData.button('reset');
			else
				btnCSV.button('reset');
		}
	});
	//_____ データ表示
	//***** 表示オプション更新：粒度、オプション表示項目、チェックされたセンサーID
	$.ajax({
		url: contextPath + 'Ajax/UpdateUserPeriodOutputOptions.do',
		async: true,
		cache: false,
		data: param,
		success: function(response){
			console.log('update period options success');
		},
		error: function(){
			console.log('update period options error');
		}
	});
	//_____ 表示オプション更新：粒度、オプション表示項目、チェックされたセンサーID
	//____________________ データ取得
}

function poHeadColumnStyle() {
	return {
		classes: 'data-table-td'
	};
}

function datetimeColumnStyle(){
	return {
		classes: 'td-with-bg',
		css: {'min-width': '140px'}
	};
}
//____________________ functions

//******************* init
//***** po obj init
poObj.r = radioR.filter(':checked').val();
//_____ po obj init
sensorTableBody.find('tr').hide();
checkSensorIds.prop('disabled', true);
//***** 期間初期化
zeus.setNumberOptionsByName('mis', 0, 59, false, '00');
mis.val(fbMis);
zeus.setNumberOptionsByName('mie', 0, 59, false, '00');
mie.val(fbMie);
//***** 粒度初期化
if(radioR.filter(':checked').length == 0)
	radioR.filter('[value="m"]').prop('checked', true);	
//_____ 粒度初期化

startDatePicker.datepicker(periodDatePickerOptions);
endDatePicker.datepicker(periodDatePickerOptions);

var format = 'YYYY-M-D';
var startM = moment(ys.val() + '-' + ms.val() + '-' + ds.val(), format);
startDatePicker.datepicker('setDate', startM.toDate());

var endM = moment(ye.val() + '-' + me.val() + '-' + de.val(), format);
endDatePicker.datepicker('setDate', endM.toDate());

isPeriodInit = false;
//***** 期間初期化

//***** グループ初期化
if(fbHasGroup) {
	
	if(checkGroup.filter(':checked').length < checkGroup.length)
		checkGroupAll.prop('checked', false);
	else
		checkGroupAll.prop('checked', true);
	
	var gIds = [];
	checkGroup.filter(':checked').each(function(){
		gIds.push(this.value);
	});
	if(gIds.length > 0)
		oldGroupIds = gIds.join();
}
//_____ グループ初期化
// あらゆる設定
setByConditions();
// グループチェック変化を検知し更新：1秒ごとに
if(fbHasGroup)
	setInterval(updateModifiedGroups, 1000);
// 前日翌日初期化
dateArrows.init('data-toggle', 'date-arrow');
//___________________ init