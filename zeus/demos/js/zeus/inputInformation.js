var tableColumns = null;
var tableData = null;

let intervalTime = 10000;

function datetimeColumnStyle(){
	return {
		classes: 'td-with-bg',
		css: {'min-width': '140px'}
	};
}

function headColumnStyle() {
	return {
		css: {'min-width': '80px'}
	};
}

function InputInfo(){
	
	function initializeDownloadStatus(){
		$.ajax({
			url: contextPath + 'Ajax/Common/DownloadStatus/Initialize.action',
			async: true,
			cache: false,
			data: {
				menu: 'inputInformation'
			}
		});
	}
	
	function getFileDownloadStatus(){
		$.ajax({
			url: contextPath + 'Ajax/Common/DownloadStatus/Get.action',
			async: true,
			cache: false,
			data: {
				menu: 'inputInformation'
			}
		})
		.done(function(resp, textStatus, jqXHR){
			let objResp = JSON.parse(resp);
			if(objResp.result === 'done'){
				$(btnCSV).button('reset');
			}else{
				setTimeout(getFileDownloadStatus, 1000);
			}
		})
		.fail(function(jqXHR, textStatus, errorThrown){
			popupError.setMessage('ファイルダウンロード状態取得時にエラーが発生しました。');
		})
	}
	
	let _this = this;
	let btnCSVLastClickTime;
	//****************************** object attribute
	var periodDatePickerOptions = {
		startView: 0,
		maxViewMode: 2,
		minViewMode: 0,
		todayBtn: 'linked',
		language: 'ja',
		autoclose: true,
		todayHighlight: true
	};
	var errmsgDateArrow = '期間を選択または入力してください。';
	var errmsgPeriodInvalid = '正しい期間を選択または入力してください。';
	
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
	
	var startDatePicker = $('.start-date-picker');
	var endDatePicker = $('.end-date-picker');
	
	var inputInfoForm = $('#form-inputInfo');
	var divErrorPeriod = $('#div-error-period');
	var divErrInput = $('#div-err-input');
	var btnCSV = $('#btn-csv');
	
	var checkInputAll = $('#check-input-all');
	var checkInputIds = $('[name="inputIds"]');
	var selectDisplaySpan = $('[name="displaySpan"]');
	// 前日翌日リンク
	var aDateArrow = $('[data-toggle="date-arrow"]');
	
	var isFirstAccess = true;
	var dataInterval = null;
	var checkedInputIds = '';
	var displaySpan = null;
	var tableInputInfo = $('#table-inputInfo');
	//______________________________ object attribute
	
	startDatePicker.on('changeDate', function(e) {
		ys.val(e.date.getFullYear());
		ms.val(e.date.getMonth() + 1);
		ds.val(e.date.getDate());
	});

	endDatePicker.on('changeDate', function(e) {
		ye.val(e.date.getFullYear());
		me.val(e.date.getMonth() + 1);
		de.val(e.date.getDate());
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
			if(arrow == 'left'){
				dp = item.prev();
			}else{
				dp = item.prev().prev();
			}
			dp.datepicker('setDate', dateArrows.list[index].mo.toDate());
		}else{
			divErrorPeriod.append(errmsgDateArrow);
		}
	});
	//_____ 前日翌日リンククリック時アクション
	
	btnCSV.click(function(){
		
		if(btnCSVLastClickTime != null){
			let now = moment().valueOf();
			if(now - btnCSVLastClickTime <= 5){
				return;
			}
		}else{
			btnCSVLastClickTime = moment().valueOf();
			setTimeout(btnCSVLastClickTime = null, 5000);
		}
		
		//***** period check
		divErrorPeriod.html('');
		
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
		
		var isStartValid = moment(ysVal + ' ' + msVal + ' ' + dsVal, 'YYYY M D', true).isValid();
		var isEndValid = moment(yeVal + ' ' + meVal + ' ' + deVal, 'YYYY M D', true).isValid();
		
		if(!(isStartValid && isEndValid))
			divErrorPeriod.append('<div>' + errmsgPeriodInvalid + '</div>');
		
		var mStart = moment([ys.val(), ms.val() - 1, ds.val(), hs.val(), mis.val(), 0, 0]);
		var mEnd = moment([ye.val(), me.val() - 1, de.val(), he.val(), mie.val(), 0, 0]);
		if(mEnd.diff(mStart) < 0)
			divErrorPeriod.html(errmsgPeriodInvalid);
		
		var diffDays = mEnd.diff(mStart, 'days');
		if(diffDays < 0 || diffDays > 30)
			divErrorPeriod.html('指定できる期間は最大31日間までです。');
		//_____ period check
		
		//***** checked input check
		divErrInput.empty();
		
		var checkedLen = checkInputIds.filter(':checked').length;
		if(checkedLen == 0)
			divErrInput.append('入力接点をチェックしてください。');
		//_____ checked input check
		
		if(divErrorPeriod.html() != '' || checkedLen == 0)
			return;
		
		// set button loading
		$(this).button('loading');
		// initialize download status
		initializeDownloadStatus();
		// submit download form
		inputInfoForm.submit();
		// monitoring download status
		getFileDownloadStatus();
	});
	
	checkInputAll.change(function(){
		checkInputIds.prop('checked', this.checked);
	});
	
	checkInputIds.change(function(){
		
		var checkedLen = checkInputIds.filter(':checked').length;
		checkInputAll.prop('checked', checkedLen == checkInputIds.length);
	});
	
	//***** large table
	tableInputInfo.click(function(){
		window.open(contextPath + 'large/inputInfo/Large.jsp');
	});
	//===== large table
	
	function updateData(){
		
		// update param
		var updateParam = {};
		
		//***** update checked options
		var optionParam = null;
		// input ids
		var currentCheckChecked = checkInputIds.filter(':checked');
		var currentCheckedInputIds = currentCheckChecked.map(function(){
			return this.value;
		}).get().join(',');
		if(checkedInputIds != currentCheckedInputIds){
			
			optionParam = {};
			checkedInputIds = currentCheckedInputIds;
			if(checkedInputIds == '')
				optionParam.inputIds = "input_info_input_ids=null";
			else
				optionParam.inputIds = "input_info_input_ids='" + checkedInputIds + "'";
		}
		// display span
		if(displaySpan != selectDisplaySpan.val()){
			
			if(optionParam == null)
				optionParam = {};
			displaySpan = selectDisplaySpan.val();
			optionParam.displaySpan = 'input_info_display_span=' + displaySpan;
		}
		
		if(optionParam != null){
			
			updateParam.init = true;
			
			$.ajax({
				url: contextPath + 'Ajax/User/UpdateOption.action',
				async: true,
				cache: false,
				data: optionParam,
				success: function(response){
					console.log('update nodeInformation success');
					displaySpan = selectDisplaySpan.val();
				},
				error: function(){
					console.log('update nodeInformation failed.');
				}
			});
		}else
			updateParam.init = false;
		//_____ update checked options
		
		//***** update data table
		if(displaySpan != '' && checkedInputIds != ''){
			
			/* // オプションが変わりもしくはデータテーブルが初期化されてない時
			updateParam.init = updateParam.init || _this.tableColumns == null;
			// currentMaxTime
			if(!updateParam.init){
				
				if(_this.tableData != null && _this.tableData.length > 0)
					updateParam.currentMaxTime = _this.tableData[0].datetime;
				else
					updateParam.init = true;
			} */
			// データが入るタイミングにずれがあり毎回全部のデータをとらなくてはならない
			updateParam.init = true;
			updateParam.displaySpan = displaySpan;
			updateParam.inputIds = checkedInputIds;
			
			$.ajax({
				url: '/zeuschart/InputInfo/Realtime.do',
				async: true,
				cache: false,
				data: updateParam,
				success: function(response){
					
					var respObj = JSON.parse(response);
					if(respObj.columns != null){
						
						tableColumns = respObj.columns;
						tableData = respObj.data;
						
						// データテーブル
						tableInputInfo.bootstrapTable('destroy').bootstrapTable({
							fixedColumns: true,
							fixedNumber: 1,
							striped: false,
							height: 500,
							locale: zeus.getBootstrapTableLocale('ja'),
							columns: tableColumns,
							data: tableData
						});
						
						$('.fixed-table-header-columns').find('th').height(tableInputInfo.find('th').height());
					}else{
						
						if(respObj.data != null){
							
							tableData.pop();
							tableData.unshift(respObj.data);
							
							tableInputInfo.bootstrapTable('load', tableData);
						}
					}
					
					setTimeout(updateData, intervalTime);
				},
				error: function(){
					console.log('refresh json error');
					tableInputInfo.bootstrapTable('destroy');
					tableColumns = null;
					tableData = null;
					
					setTimeout(updateData, intervalTime);
				}
			});
		}else{
			
			tableInputInfo.bootstrapTable('destroy');
			tableColumns = null;
			tableData = null;
			
			setTimeout(updateData, intervalTime);
		}
		//_____ update data table
	}
	
	//************************** init
	zeus.setNumberOptionsByName('mis', 0, 59, false, '00');
	mis.val(fbMis);
	zeus.setNumberOptionsByName('mie', 0, 59, false, '00');
	mie.val(fbMie);
	
	startDatePicker.datepicker(periodDatePickerOptions);
	endDatePicker.datepicker(periodDatePickerOptions);
	//***** inputIds init
	var checkChecked = checkInputIds.filter(':checked');
	if(checkInputIds.length == 0){
		
		checkInputAll.prop('checked', false);
		checkInputAll.prop('disabled', true);
	}else{
		
		checkInputAll.prop('disabled', false);
		checkInputAll.prop('checked', checkInputIds.length == checkChecked.length);
	}
	// checkedInputIds
	if(checkChecked.length > 0){
		
		checkedInputIds = checkChecked.map(function(){
			return this.value;
		}).get().join(',');
	}
	//_____ inputIds init
	//***** display span
	displaySpan = selectDisplaySpan.val();
	//_____ display span
	//***** update data interval
	updateData();
	//_____ update data interval
	// 前日翌日初期化
	dateArrows.init('data-toggle', 'date-arrow');
}
var inputInfo = new InputInfo();