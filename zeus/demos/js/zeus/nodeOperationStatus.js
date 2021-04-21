function headColumnStyle() {
	return {
		css: {
			'min-width': '90px',
			'max-width': '90px',
			'width': '90px',
			'text-align': 'right !important',
			'padding' : '0',
			'padding-right': '3px',
			'vertical-align': 'middle !important'
		}
	};
}

function datetimeColumnStyle(){
	return {
		classes: 'td-with-bg',
		css: {
			'min-width': '140px',
			'max-width': '140px',
			'width': '140px'
		}
	};
}

function NodeOperationStatus(){
	var _this = this;
	// error message
	var errmsgDateArrow = '正しい期間を選択または入力してください。';
	var errmsgPeriodInvalid = '正しい期間を選択または入力してください。';
	var errmsgDisplayItemEmpty = '表示項目をチェックしてください。';
	var errmsgNodeEmpty = '出力をチェックしてください。';
	//
	this.tableColumns = null;
	this.tableData = null;
	// table node operating status
	var tableNOS = $('#table-nos');
	// date picker options
	var periodDatePickerOptions = {
		startView: 0,
		maxViewMode: 2,
		minViewMode: 0,
		todayBtn: 'linked',
		language: 'ja',
		autoclose: true,
		todayHighlight: true
	};
	//***** period
	var txtYs = $('#ys');
	var txtYe = $('#ye');
	var txtMs = $('#ms');
	var txtMe = $('#me');
	var txtDs = $('#ds');
	var txtDe = $('#de');
	var sltHs = $('[name="hs"]');
	var sltHe = $('[name="he"]');
	var spanD = $('.span-d');
	var spanH = $('.span-h');
	var startDatePicker = $('.start-date-picker');
	var endDatePicker = $('.end-date-picker');
	var aDateArrow = $('[data-toggle="date-arrow"]');
	var divErrorPeriod = $('#div-error-period')
	//_____ period
	//* 粒度
	var rdoGranularity = $('[name="granularity"]');
	var divErrorDisplayItem = $('#div-error-display-item');
	//_ 粒度
	//
	var rdoDisplayItem = $('[name="displayItem"]');
	//***** group
	var chkGroupAll = $('#check-group-all');
	var chkGroupIds = $('[name="groupIds"]');
	//_____ group
	//***** node
	var chkNodeAll = $('#check-node-all');
	var chkNodeIds = $('[name="nodeIds"]');
	var divErrorNodeIds = $('#div-error-node-ids');
	//_____ node
	//***** button
	var btnCSV = $('#btn-csv');
	var btnDisplay = $('#btn-display');
	//_____ button
	
	//********** define functions
	//* set group check all
	var setGroupCheckAll = function(){
		var checkedLen = chkGroupIds.filter(':checked').length;
		chkGroupAll.prop('checked', chkGroupIds.length == checkedLen);
	};
	//_ set group check all
	//* set node check all
	var setNodeCheckAll = function(){
		var visibleNode = chkNodeIds.filter(':visible');
		var checkedLen = visibleNode.filter(':checked').length;
		chkNodeAll.prop('disabled', visibleNode.length == 0);
		if(visibleNode.length == 0)
			chkNodeAll.prop('checked', false);
		else
			chkNodeAll.prop('checked', visibleNode.length == checkedLen);
	};
	//_ set node check all
	//* get checked display item
	var getCheckedDisplayItems = function(){
		var displayItems = '';
		rdoDisplayItem.filter(':checked').each(function(){
			if(displayItems != '') displayItems += ',';
			displayItems += this.value;
		});
		return displayItems;
	};
	//_ get checked display item
	
	//* get checked group ids
	var getCheckedGroupIds = function(){
		var groupIds = '';
		chkGroupIds.filter(':checked').each(function(){
			if(groupIds != '') groupIds = ',';
			groupIds += this.value;
		});
		return groupIds;
	};
	//_ get checked group ids
	//* get checked node ids
	var getCheckedNodeIds = function(){
		var nodeIds = '';
		chkNodeIds.filter(':visible:checked').each(function(){
			if(nodeIds != '') nodeIds += ',';
			nodeIds += this.value;
		});
		return nodeIds;
	};
	//_ get checked node ids
	//* save checked options
	var saveCheckedOptions = function(){
		var param = {};
		// display items
		var displayItems = getCheckedDisplayItems();
		if(displayItems == '')
			param.displayItems = "node_operation_status_display_items=null";
		else param.displayItems = "node_operation_status_display_items='" + displayItems + "'";
		// group ids
		var groupIds = getCheckedGroupIds();
		if(groupIds == '')
			param.groupIds = "node_operation_status_group_ids=null";
		else param.groupIds = "node_operation_status_group_ids='" + groupIds + "'";
		// node ids
		var nodeIds = getCheckedNodeIds();
		if(nodeIds == '')
			param.nodeIds = "node_operation_status_node_ids=null";
		else param.nodeIds = "node_operation_status_node_ids='" + nodeIds + "'";
		
		$.ajax({
			url: contextPath + 'Ajax/User/UpdateOption.action',
			async: true,
			cache: false,
			data: param,
			success: function(response){
				console.log('update user options success');
			},
			error: function(){
				console.log('update user options failed.');
			}
		});
	};
	//_ save checked options
	
	//* validate period
	var validatePeriod = function(){
		var ys = $.trim(txtYs.val()), ms = $.trim(txtMs.val()), ds = $.trim(txtDs.val()), hs = $.trim(sltHs.val());
		var ye = $.trim(txtYe.val()), me = $.trim(txtMe.val()), de = $.trim(txtDe.val()), he = $.trim(sltHe.val());
		var isValid = true;
		var gra = rdoGranularity.filter(':checked').val();
		//* validate empty
		if(ys == '' || isNaN(ys) || ye == '' || isNaN(ye) || ms == '' || isNaN(ms) || me == '' || isNaN(me))
			isValid = false;
		if(gra != 'd'){
			if(ds == '' || isNaN(ds) || de == '' || isNaN(de))
				isValid = false;
		}
		if(!isValid){
			divErrorPeriod.append('<div>' + errmsgDateArrow + '</div>');
			return false;
		}
		//_ validate empty
		//* validate validation
		var isStartValid = true;
		var isEndValid = true;
		if(gra == 'M'){
			isStartValid = moment(ys + ' ' + ms, 'YYYY M', true).isValid();
			isEndValid = moment(ye + ' ' + me, 'YYYY M', true).isValid();
		}else{
			isStartValid = moment(ys + ' ' + ms + ' ' + ds, 'YYYY M D', true).isValid();
			isEndValid = moment(ye + ' ' + me + ' ' + de, 'YYYY M D', true).isValid();
		}
		isValid = isStartValid && isEndValid;
		if(!isValid){
			divErrorPeriod.append('<div>' + errmsgDateArrow + '</div>');
			return false;
		}
		//_ validate validation
		
		//* validate start end relation
		var mStart = moment([ys, ms - 1, ds, parseInt(hs), 0, 0, 0]);
		var mEnd = moment([ye, me - 1, de, parseInt(he), 0, 0, 0]);
		if(mEnd.diff(mStart) < 0){
			divErrorPeriod.append('<div>' + errmsgPeriodInvalid + '</div>');
			return false;
		}
		//_ validate start end relation
		return true;
	};
	//_ validate period
	
	//* get data
	var getData = function(type){
		divErrorPeriod.empty();
		divErrorDisplayItem.empty();
		divErrorNodeIds.empty();
		// validate date
		var isDateValid = validatePeriod();
		// checked display items
		var displayItems = getCheckedDisplayItems();
		if(displayItems == '') divErrorDisplayItem.append(errmsgDisplayItemEmpty);
		// checked nodeIds
		var nodeIds = getCheckedNodeIds();
		if(nodeIds == '') divErrorNodeIds.append(errmsgNodeEmpty);
		
		if(isDateValid && displayItems != '' && nodeIds != ''){
			var param = {};
			var gra = rdoGranularity.filter(':checked').val();
			//* set period
			param.ys = txtYs.val();
			param.ye = txtYe.val();
			param.ms = txtMs.val();
			param.me = txtMe.val();
			if(gra == 'd' || gra == 'h' || gra == '30m'){
				param.ds = txtDs.val();
				param.de = txtDe.val();
			}
			if(gra == 'h' || gra == '30m'){
				param.hs = parseInt(sltHs.val());
				param.he = parseInt(sltHe.val());
			}
			//_ set period
			// set granularity
			param.granularity = gra;
			// set display items
			param.displayItems = displayItems;
			// set node ids
			param.nodeIds = nodeIds;
			// set type
			param.type = type;
			
			if(type == 'csv') btnCSV.button('loading');
			else btnDisplay.button('loading');
			
			var dataUrl = '/zeuschart/Rest/NodeOperationStatus/GetData.do';
			$.ajax({
				url: dataUrl,
				async: true,
				cache: false,
				data: param,
				outputType: type,
				success: function(response){
					if(this.outputType == 'data'){
						var respObj = JSON.parse(response);
						_this.tableColumns = respObj.columns;
						_this.tableData = respObj.data;
						// データテーブル
						tableNOS.bootstrapTable('destroy').bootstrapTable({
							fixedColumns: true,
							fixedNumber: 1,
							striped: false,
							height: 500,
							columns: _this.tableColumns,
							data: _this.tableData
						});
						var tableThHeight = tableNOS.find('th').height();
						$('.fixed-table-header').find('th').height(tableThHeight);
						$('.fixed-table-header-columns').find('th').height(tableThHeight);
						btnDisplay.button('reset');
					}else {
						zeus.getFile(response);
					    btnCSV.button('reset');
					}
				},
				error: function(){
					tableNOS.bootstrapTable('destroy');
					if(this.outputType == 'data')
						btnDisplay.button('reset');
					else btnCSV.button('reset');
				}
			});
			saveCheckedOptions();
		}
	};
	//_ get data
	//__________ define functions
	
	//********** define events
	//***** start date picker change event
	startDatePicker.on('changeDate', function(e) {
		txtYs.val(e.date.getFullYear());
		txtMs.val(e.date.getMonth() + 1);
		txtDs.val(e.date.getDate());
	});
	//_____ start date picker change event

	//***** set end date picker change event
	endDatePicker.on('changeDate', function(e) {
		txtYe.val(e.date.getFullYear());
		txtMe.val(e.date.getMonth() + 1);
		txtDe.val(e.date.getDate());
	});
	//***** set end date picker change event
	
	//***** set date arrow click event
	aDateArrow.click(function(){
		divErrorPeriod.empty();
		var item = $(this);
		var index = item.attr('data-index');
		var arrow = item.attr('data-arrow');
		var isSuccess = dateArrows.list[index].setMoment();
		if(isSuccess){
			// set datepickers
			var dp = null;
			if(arrow == 'left') dp = item.prev();
			else dp = item.prev().prev();
			dp.datepicker('setDate', dateArrows.list[index].mo.toDate());
		}else divErrorPeriod.append(errmsgDateArrow);
	});
	//_____ set date arrow click event
	
	//***** granularity change event
	rdoGranularity.change(function(){
		spanD.hide();
		spanH.hide();
		// 日
		if(this.value == 'd') spanD.show();
		// 時　30分
		else if(this.value == 'h' || this.value == '30m'){
			spanD.show();
			spanH.show();
		}
		
		//***** reset date picker
		if(this.value == 'M') {
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
		//_____ reset date picker
	});
	//_____ granularity change event
	
	//***** group check all event
	chkGroupAll.change(function(){
		chkGroupIds.prop('checked', this.checked);
		chkGroupIds.each(function(){
			$(this).change();
		});
		setNodeCheckAll();
	});
	//_____ group check all event
	
	//***** group check event
	chkGroupIds.change(function(){
		if(this.checked)
			$('.tr-node-' + this.value).show();
		else
			$('.tr-node-' + this.value).hide();
		setGroupCheckAll();
		setNodeCheckAll();
	});
	//_____ group check event
	
	//***** node check all event
	chkNodeAll.change(function(){
		chkNodeIds.filter(':visible').prop('checked', this.checked);
	});
	//_____ node check all event
	
	//***** node check event
	chkNodeIds.change(function(){
		setNodeCheckAll();
	});
	//_____ node check event
	
	//***** csv button event
	btnCSV.click(function(){
		getData('csv');
	});
	//_____ csv button event
	
	//***** display button event
	btnDisplay.click(function(){
		getData('data');
	});
	//_____ display button event
	//__________ define events
	
	//********** init
	//* period
	// set start date
	startDatePicker.datepicker(periodDatePickerOptions);
	startDatePicker.datepicker('setDate', new Date(txtYs.val(), txtMs.val() - 1, txtDs.val()));
	// set end date
	endDatePicker.datepicker(periodDatePickerOptions);
	endDatePicker.datepicker('setDate', new Date(txtYe.val(), txtMe.val() - 1, txtDe.val()));
	// date arrows
	dateArrows.init('data-toggle', 'date-arrow');
	//_ period
	
	rdoGranularity.filter(':checked').change();
	
	setGroupCheckAll();
	//__________ init
}

new NodeOperationStatus();