var categoryChecked = $('[name="categoryChecked"]');
var startDate = $('[name="startDate"]');
var hs = $('[name="hs"]');
var mis = $('[name="mis"]');
var endDate = $('[name="endDate"]');
var he = $('[name="he"]');
var mie = $('[name="mie"]');
var categoryCheckedError = $('#categoryCheckedError');
var eventTable = $('#eventTable');
var divErrorPeriod = $('#div-error-period');
var fromEventInfo = $('#form-eventInfo');

var eventDataUrl = contextPath + 'Ajax/EventInformation/GetEventPage.action';
var eventTableObj = null;
var isTableInit = true;

// イベント情報 bootstrap table
function valueFormatter(value, row, index, field){

	if(row != null){
		
		if(row.importance == importance_middle)
			return '<font color="#FF8C00">' + value + '</font>';
		else if(row.importance == importance_heigh)
			return '<font color="#FF0000">' + value + '</font>';
	}
	
	return value;
}

var tableColumns = [
    {
        title: title_datetime,
        field: 'datetime',
        width: '20%',
        align: 'center',
        valign: 'middle',
        formatter: valueFormatter
    },
    {
        title: title_importance,
        field:'importance',
        width: '6%',
        align: 'center',
        valign: 'middle',
        formatter: valueFormatter
    },
    {
        title: title_category,
        field:'category',
        width: '12%',
        align: 'center',
        valign: 'middle',
        formatter: valueFormatter
    },
    {
        title: title_content,
        field: 'content',
        width: '40%',
        align: 'center',
        valign: 'middle',
        formatter: valueFormatter
    },
    {
        title: title_operateUser,
        field: 'operateUser',
        width: '14%',
        align: 'center',
        valign: 'middle'
    },
    {
        title: title_data,
        field: 'data',
        width: '8%',
        align: 'center',
        valign: 'middle',
        formatter: function(value, row, index, field){
        	
        	return '<div class="div-text-overflow" style="height: 18px;">' + value + '</div>';
        }
    }
];

//******************** functions
//カテゴリチェックの検査
function isCategoryChecked() {
	
	var checked = categoryChecked.not(':disabled').filter(':checked');
	if(checked.length > 0)
		return true;
	else
		return false;
}

//期間とカテゴリの検査
function validateConditions() {
	
	categoryCheckedError.html('');
	divErrorPeriod.html('');
	var categoryOk = false;
	// カテゴリ
	if(isCategoryChecked())
		categoryOk = true;
	else
		categoryCheckedError.append('<p>' + fmtCategoryNotChecked + '</p>');
	// 期間
	var periodOk = eventInfo.isPeriodOk();
	if(!periodOk)
		divErrorPeriod.append('<p>' + fmtInvalidPeriod + '</p>');
	
	return categoryOk && periodOk;
}

//イベント表示
function eventDisplay() {
	
	if(validateConditions()){
		
		isTableInit = false;
		
		eventTable.bootstrapTable('refreshOptions', {pageNumber : 1});
		eventTableObj = eventTable.bootstrapTable('refresh', {url : eventDataUrl, queryParams: queryParams});
	}
}

function csvExport() {
	
	if(validateConditions()){
		
		fromEventInfo.attr('action', contextPath + 'EventInfomation/EventInfomationCSVExport.do');
		fromEventInfo.submit();
	}
}

//デマンド警報
$('#category-demand-selectAll').click(function(){
	selectAllClicked('.category-demand');
});

//閾値監視
$('#category-threshold-selectAll').click(function(){
	selectAllClicked('.category-threshold');
});

//システム（通信エラー）
$('#category-commError-selectAll').click(function(){
	selectAllClicked('.category-commError');
});

//システム（通信エラー）
$('#category-restart-selectAll').click(function(){
	selectAllClicked('.category-restart');
});

//システム（ログ監視）
$('#category-log-selectAll').click(function(){
	selectAllClicked('.category-log');
});
//システム（基盤監視）
$('#category-system-selectAll').click(function(){
	selectAllClicked('.category-system');
});

//システム（メンテナンス関連）
$('#category-maintain-selectAll').click(function(){
	selectAllClicked('.category-maintain');
});

//制御（自動・手動）スケジュール制御
$('#category-control-selectAll').click(function(){
	selectAllClicked('.category-control');
});

//よくつかわれていないのは隠す
var notUsedCount = 0;
notUsedCount += $('.category-threshold:checked').length;
notUsedCount += $('.category-commError:checked').length;
notUsedCount += $('.category-restart:checked').length;
notUsedCount += $('.category-log:checked').length;
notUsedCount += $('.category-system:checked').length;
notUsedCount += $('.category-maintain:checked').length;

if(notUsedCount == 0){
	
	$('.notused').css('display', 'none');
	notUsedItemDisable(true);
}else{
	
	var arrow = $('#notused-arrow');
	
	arrow.removeClass('fa-chevron-circle-down');
	arrow.addClass('fa-chevron-circle-up');
}

function selectAllClicked(className){
	
	var totalItem = $(className);
	var checkedItem = $(className + ':checked');
	
	var totalLen = totalItem.length;
	var checkedLen = checkedItem.length;
	
	if(checkedLen > totalLen / 2)
		totalItem.prop('checked', false);
	else
		totalItem.prop('checked', true);
}

function onArrowClicked() {
	
	var notUsed = $('.notused');
	var arrow = $('#notused-arrow');
	
	if(notUsed.css('display') == 'none'){
		
		notUsed.css('display', '');
		
		arrow.removeClass('fa-chevron-circle-down');
		arrow.addClass('fa-chevron-circle-up');
		
		notUsedItemDisable(false);
	}else{
		
		notUsed.css('display', 'none');
		
		arrow.removeClass('fa-chevron-circle-up');
		arrow.addClass('fa-chevron-circle-down');
		
		notUsedItemDisable(true);
	}
}

function notUsedItemDisable(flag) {
	
	$('.category-threshold').prop('disabled', flag);
	$('.category-commError').prop('disabled', flag);
	$('.category-restart').prop('disabled', flag);
	$('.category-log').prop('disabled', flag);
	$('.category-maintain').prop('disabled', flag);
	$('.category-system').prop('disabled', flag);
}

//******************************************* 分页Table
//请求服务数据时所传参数
function queryParams(params){
	
	var reqParam = {};
	if(isCategoryChecked()){
		
		// checked categories
		var checked = $('[name="categoryChecked"]').not(':disabled').filter(':checked');
		var checkedCategories = checked.map(function(){
			return this.value;
		}).get().join();
		// start date time
		
		reqParam.limit = params.limit;
		reqParam.offset = params.offset;
		reqParam.checkedCategories = checkedCategories;
		reqParam.startDateTime = eventInfo.startDatePicker.datepicker('getFormattedDate') + ' ' + hs.val() + ':' + mis.val() + ':00';
		reqParam.endDateTime = eventInfo.endDatePicker.datepicker('getFormattedDate') + ' ' + he.val() + ':' + mie.val() + ':59';
		// 最初は7日前までのデータを取得
		if(isTableInit)
			reqParam.init = 'init';
	}
	
	return reqParam;
}
//==================================================== 分页Table

function EventInfo(){
	
	var errmsgDateArrow = '正しい期間を選択または入力してください。';
	var periodDatePickerOptions = {
		format: 'yyyy-mm-dd',
		startView: 0,
		maxViewMode: 2,
		minViewMode: 0,
		todayBtn: 'linked',
		language: 'ja',
		autoclose: true,
		todayHighlight: true
	};
	
	var ys = $('[name="ys"]');
	var ye = $('[name="ye"]');
	var ms = $('[name="ms"]');
	var me = $('[name="me"]');
	var ds = $('[name="ds"]');
	var de = $('[name="de"]');
	var hs = $('[name="hs"]');
	var he = $('[name="he"]');
	var mis = $('[name="mis"]');
	var mie = $('[name="mie"]');
	var _this = this;
	// 前日翌日リンク
	var aDateArrow = $('[data-toggle="date-arrow"]');
	
	this.startDatePicker = $('.start-date-picker');
	this.endDatePicker = $('.end-date-picker');
	
	this.startDatePicker.on('changeDate', function(e) {
		
		ys.val(e.date.getFullYear());
		ms.val(e.date.getMonth() + 1);
		ds.val(e.date.getDate());
	});

	this.endDatePicker.on('changeDate', function(e) {
		
		ye.val(e.date.getFullYear());
		me.val(e.date.getMonth() + 1);
		de.val(e.date.getDate());
	});
	
	$('[name="ys"],[name="ms"],[name="ds"]').blur(function(){

		var year = ys.val();
		var month = ms.val();
		if(month > 12)
			ms.val(12);
		else if(month < 1)
			ms.val(1);
		var day = ds.val();

		var maxDayDate = new Date(year, month, 0);
		var maxDay = maxDayDate.getDate();

		if(day > maxDay)
			ds.val(maxDay);
		else if(day < 1)
			ds.val(1);
		
		var fixedDate = new Date(ys.val(), ms.val() - 1, ds.val());
		_this.startDatePicker.datepicker('setDate', fixedDate);
	});

	$('[name="ye"],[name="me"],[name="de"]').blur(function(){

		var year = ye.val();
		var month = me.val();
		if(month > 12)
			me.val(12)
		else if(month < 1)
			me.val(1);
		var day = de.val();

		var maxDayDate = new Date(year, month, 0);
		var maxDay = maxDayDate.getDate();

		if(day > maxDay)
			de.val(maxDay);
		
		var fixedDate = new Date(ye.val(), me.val() - 1, de.val());
		_this.endDatePicker.datepicker('setDate', fixedDate);
	});
	
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
	
	this.isPeriodOk = function(){

		var reg = new RegExp('^\\d+$');

		var ysVal = $.trim(ys.val());
		var msVal = $.trim(ms.val());
		var dsVal = $.trim(ds.val());
		var hsVal = hs.val();
		var misVal = mis.val();

		var yeVal = $.trim(ye.val());
		var meVal = $.trim(me.val());
		var deVal = $.trim(de.val());
		var heVal = he.val();
		var mieVal = mie.val();
		
		if(
			ysVal == '' || yeVal == '' ||
			msVal == '' || meVal == '' ||
			dsVal == '' || deVal == ''
		)
			return false;
		else{
			
			if(
				!reg.test(ysVal) || !reg.test(yeVal) ||
				!reg.test(msVal) || !reg.test(meVal) ||
				!reg.test(dsVal) || !reg.test(deVal)
			)
				return false;
				
			var momentS = moment([ysVal, msVal - 1, dsVal, hsVal, misVal, 0, 0]);
			var momentE = moment([yeVal, meVal - 1, deVal, heVal, mieVal, 0, 0]);
			var diffMi = momentE.diff(momentS, 'minutes');
			if(diffMi < 0)
				return false;
		}
		
		return true;
	}
	
	zeus.setNumberOptionsByName('mis', 0, 59, false, '00');
	mis.val(fbMis);
	zeus.setNumberOptionsByName('mie', 0, 59, false, '00');
	mie.val(fbMie);
	
	this.startDatePicker.datepicker(periodDatePickerOptions);
	this.startDatePicker.datepicker('setDate', new Date(ys.val(), ms.val() -1, ds.val()));
	this.endDatePicker.datepicker(periodDatePickerOptions);
	this.endDatePicker.datepicker('setDate', new Date(ye.val(), me.val() - 1, de.val()));
	// 前日翌日初期化
	dateArrows.init('data-toggle', 'date-arrow');
}
var eventInfo = new EventInfo();

//******************** init
//data table init
eventTableObj = eventTable.bootstrapTable({
 method: 'post',
 contentType: "application/x-www-form-urlencoded",//必须要有！！！！
 url: eventDataUrl,//要请求数据的文件路径
 cache: false,
 toolbar: '#toolbar',//指定工具栏
 striped: true, //是否显示行间隔色
 dataField: "respData",//bootstrap table 可以前端分页也可以后端分页，这里
 pageNumber: 1, //初始化加载第一页，默认第一页
 pagination:true,//是否分页
 queryParamsType:'limit',//查询参数组织方式
 queryParams: queryParams,//请求服务器时所传的参数
 sidePagination:'server',//指定服务器端分页
 pageSize: 100,//单页记录数
 pageList: [25,50,100],
 detailView: true,
 detailFormatter: function(index, row, element){
 	
 	if(row.data == '')
 		return row.data;
 	else{
 		
    	var data = row.data.split('<br>');
 		var value = null;
    	var table = '<table class="table table-bordered" style="width: 100%;">';
    	for(var i = 0; i < data.length; i++){
    		
    		value = data[i].split(':::');
    		if(value.length < 2)
    			continue;
    		
    		table += '<tr>';
    		table += '<td width="30%">' + value[0] + '</td>';
    		table += '<td style="word-break:break-all;">' + value[1] + '</td>';
    		table += '</tr>';
    	}
    	table += '</table>';
	    	
    	return table;
 	}
 },
 showRefresh: false,//刷新按钮
 showColumns: true,
 search: false,
 searchText: '',
 trimOnSearch: true,
 toolbarAlign:'right',//工具栏对齐方式
 buttonsAlign:'right',//按钮对齐方式
 locale: zeus.getBootstrapTableLocale(sysLanguage),//中文支持,
 columns: tableColumns,
 responseHandler:function(res){
     //在ajax获取到数据，渲染表格之前，修改数据源
     return res;
 }
});
//==================== init