//******************** definitions
var tableHistory = $('#table-history');
var tableGroupDevice = $('#table-group-device');
var tbodyGroupDevice = tableGroupDevice.find('tbody');

var divErrorPeriod = $('#div-error-period');

var radioHistoryType = $('[name="historyType"]');

var selectSpan = $('.select-span');
var selectSpanControl = $('#select-span-control');
var selectSpanLevel = $('#select-span-level');

var textRangeDate = $('#rangeDate');

var btnCSV = $('#btn-csv');
//前日翌日リンク
var aDateArrow = $('[data-toggle="date-arrow"]');

var updateInterval;
var updateParamRT= {};
var updateParamCSV = {};
var tableColumns;
var tableData;
var errMsgPeriod = '期間の範囲が不正です。';
var errmsgDateArrow = '期間を選択または入力してください。';
var errmsgPeriodInvalid = '正しい期間を選択または入力してください。';
//_____________________ definitions

//********************* events
radioHistoryType.change(function(){
	
	selectSpanControl.hide();
	selectSpanLevel.hide();
	if(this.value == 'control')
		selectSpanControl.show();
	else
		selectSpanLevel.show();
	
	if(updateInterval != null)
		clearInterval(updateInterval);
	
	getUpdateData();
	updateInterval = setInterval(getUpdateData, 10000);
});

//***** large table
tableHistory.click(function(){
	window.open(contextPath + 'large/dimmingHistory/Large.jsp');
});
//===== large table

//***** 前日翌日リンククリック時アクション
	aDateArrow.click(function(){
		
		divErrorPeriod.empty();
		
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
			divErrorPeriod.append(errmsgDateArrow);
	});
	//_____ 前日翌日リンククリック時アクション
//_____________________ events

//********************* functions
function dhHeadColumnStyle() {
		
	return {
		css: {
			'width': '96px !important',
			'min-width': '96px !important',
			'max-width': '96px !important'
		}
	};
}
	
function dhLevelHeadColumnStyle() {
	
	return {
		classes: 'data-table-td',
		css: {
			'width': '96px !important',
			'min-width': '96px !important',
			'max-width': '96px !important'
		}
	};
}
//_____________________ functions

//********************* data access
function getUpdateData(){
	
	var historyType = radioHistoryType.filter(':checked').val();
	// 表示期間
	updateParamRT.displaySpan = selectSpan.filter('.' + historyType).val();
	
	$.ajax({
		url: '/zeuschart/Dimming/history/realtime/' + historyType + '.do',
		type: 'POST',
		async: true,
		cache: false,
		data: updateParamRT,
		historyType: historyType,
		success: function(response){
			
			var respObj = JSON.parse(response);
			// 制御履歴の場合
			if(this.historyType == 'control'){
				
				tableColumns = respObj.controlObj.columns;
				tableData = respObj.controlObj.data;
				
				//***** グループと調光機関係テーブル
				var groupDeviceObj = respObj.groupDeviceObj;
				if(groupDeviceObj == null)
					tbodyGroupDevice.html('<tr><td>-</td><td>-</td></tr>');
				else{
					
					tbodyGroupDevice.html('');
					var tr = null;

					for(var groupName in groupDeviceObj){
						
						tr = $('<tr></tr>');
						$('<td></td>').html(groupName).appendTo(tr);
						$('<td></td>').html(groupDeviceObj[groupName]).appendTo(tr);
						tr.appendTo(tbodyGroupDevice);
					}
				}
				tableGroupDevice.show();
				//_____ グループと調光機関係テーブル
			}else{
				
				tableColumns = respObj.columns;
				tableData = respObj.data;
				// グループと調光機関係テーブル
				tableGroupDevice.hide();
			}
			
			// データテーブル
			tableHistory.bootstrapTable('destroy').bootstrapTable({
				fixedColumns: true,
				fixedNumber: 1,
				striped: false,
				height: 500,
				columns: tableColumns,
				data: tableData,
				locale: zeus.getBootstrapTableLocale(sysLanguage)
			});
			$('.fixed-table-header-columns').find('th').height(tableHistory.find('th').height());
		},
		error: function(){
			
			tableHistory.bootstrapTable('destroy');
			console.log('update realtime data error');
		}
	});
}

btnCSV.click(function(){
	
	divErrorPeriod.html('');
	if(dimmingHistory.isPeriodOk()){
		
		var historyType = radioHistoryType.filter(':checked').val();
		
		var mos = moment([dimmingHistory.ys.val(), dimmingHistory.ms.val() - 1, dimmingHistory.ds.val(), dimmingHistory.hs.val(), dimmingHistory.mis.val()]);
		var moe = moment([dimmingHistory.ye.val(), dimmingHistory.me.val() - 1, dimmingHistory.de.val(), dimmingHistory.he.val(), dimmingHistory.mie.val()]);
		
		updateParamCSV.startDate = mos.format('YYYYMMDDHHmm');
		updateParamCSV.endDate = moe.format('YYYYMMDDHHmm');
		
		btnCSV.button('loading');
		$.ajax({
			url: '/zeuschart/Dimming/history/csv/' + historyType + '.do',
			type: 'POST',
			async: true,
			cache: false,
			data: updateParamCSV,
			success: function(response){
				
				zeus.getFile(response);
				btnCSV.button('reset');
			},
			error: function(){
				
				btnCSV.button('reset');
				console.log('get csv error');
			}
		});
	}else
		divErrorPeriod.html(errMsgPeriod);
});
//_____________________ data access

function DimmingHistory(){
	
	var _this = this;
	var periodDatePickerOptions = {
		startView: 0,
		maxViewMode: 2,
		minViewMode: 0,
		todayBtn: 'linked',
		language: 'ja',
		autoclose: true,
		todayHighlight: true
	};
	
	var btnCSV = $('#btn-csv');
	this.ys = $('[name="ys"]');
	this.ms = $('[name="ms"]');
	this.ds = $('[name="ds"]');
	this.hs = $('[name="hs"]');
	this.mis = $('[name="mis"]');
	this.ye = $('[name="ye"]');
	this.me = $('[name="me"]');
	this.de = $('[name="de"]');
	this.he = $('[name="he"]');
	this.mie = $('[name="mie"]');
	var startDatePicker = $('.start-date-picker');
	var endDatePicker = $('.end-date-picker');
	
	startDatePicker.on('changeDate', function(e) {
		
		_this.ys.val(e.date.getFullYear());
		_this.ms.val(e.date.getMonth() + 1);
		_this.ds.val(e.date.getDate());
	});

	endDatePicker.on('changeDate', function(e) {
		
		_this.ye.val(e.date.getFullYear());
		_this.me.val(e.date.getMonth() + 1);
		_this.de.val(e.date.getDate());
	});
	
	this.isPeriodOk = function(){
		
		var ysVal = $.trim(_this.ys.val());
		var msVal = $.trim(_this.ms.val());
		var dsVal = $.trim(_this.ds.val());
		var hsVal = _this.hs.val();
		var misVal = _this.mis.val();

		var yeVal = $.trim(_this.ye.val());
		var meVal = $.trim(_this.me.val());
		var deVal = $.trim(_this.de.val());
		var heVal = _this.he.val();
		var mieVal = _this.mie.val();
		
		var isStartValid = moment(ysVal + ' ' + msVal + ' ' + dsVal, ['YYYY M D', 'YYYY MM DD'], true).isValid();
		var isEndValid = moment(yeVal + ' ' + meVal + ' ' + deVal, ['YYYY M D', 'YYYY MM DD'], true).isValid();
		
		if(isStartValid && isEndValid){
			
			var momentS = moment([ysVal, msVal - 1, dsVal, hsVal, misVal, 0, 0]);
			var momentE = moment([yeVal, meVal - 1, deVal, heVal, mieVal, 0, 0]);
			var diffMi = momentE.diff(momentS, 'minutes');
			if(diffMi < 0)
				return false;
		}else
			return false;
		
		return true;
	}
	
	//***** 期間初期化
	zeus.setNumberOptionsByName('mis', 0, 59, false, '00');
	this.mis.val(document.dimmingHistoryBean.mis.value);
	zeus.setNumberOptionsByName('mie', 0, 59, false, '00');
	this.mie.val(document.dimmingHistoryBean.mie.value);
	//_____ 期間初期化
	
	startDatePicker.datepicker(periodDatePickerOptions);
	startDatePicker.datepicker('setDate', new Date(this.ys.val(), this.ms.val() - 1, this.ds.val()));
	endDatePicker.datepicker(periodDatePickerOptions);
	endDatePicker.datepicker('setDate', new Date(this.ye.val(), this.me.val() - 1, this.de.val()));
}
var dimmingHistory = new DimmingHistory();

//********************* init
//***** 表示期間（制御/レベル）の表示非表示
var historyType = radioHistoryType.filter(':checked').val();
selectSpan.filter('.' + historyType).show();
selectSpan.not('.' + historyType).hide();
//_____ 表示期間（制御/レベル）の表示非表示

//***** データ取得
radioHistoryType.change();
//_____ データ取得
// 前日翌日初期化
dateArrows.init('data-toggle', 'date-arrow');
//____________________ init