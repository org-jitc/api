var niTable = $('#niTable');
var checkNodeGroup = $('.node-group');
var checkGroupAll = $('#checkGroupAll');
var checkNode = $('[name="checkGroup"]');
var checkNodeAll = $('#check-node-all');
var textYs = $('#ys');
var textMs = $('#ms');
var textDs = $('#ds');
var selectHs = $('#hs');
var selectMis = $('#mis');
var textYe = $('#ye');
var textMe = $('#me');
var textDe = $('#de');
var selectHe = $('#he');
var selectMie = $('#mie');

var niForm = $('#nodeInformationForm');

var hiddenStartYmd = $('[name="startYmd"]');
var hiddenStartHm = $('[name="startHm"]');
var hiddenEndYmd = $('[name="endYmd"]');
var hiddenEndHm = $('[name="endHm"]');
var hiddenNodeIds = $('[name="nodeIds"]');

var divErrorPeriod = $('#div-error-period');
var divErrorNode = $('#div-error-node');

var radioDisplayType = $('[name="displayType"]');

var selectDisplaySpan = $('[name="displaySpan"]');

var imgNi = $('#img-ni');

var divNiData = $('#div-ni-data');
var divNiGraph = $('#div-ni-graph');

var displayType = radioDisplayType.filter(':checked').val();
var updateInterval = {};
updateInterval.frequency = 10000;

var updateParam = {
	c: 2,
	o: 'd',
	fromDb: 'n',
	nodeIds: '',
	init: true
};

var EM_NOT_INPUT_YEAR = '年を入力してください。';
var EM_NOT_INPUT_MONTH = '月を入力してください。';
var EM_NOT_INPUT_DAY = '日を入力してください。';
var EM_NOT_CORRECT_YEAR = '年に有効な値を入力してください。';
var EM_NOT_CORRECT_MONTH = '月に有効な値を入力してください。';
var EM_NOT_CORRECT_DAY = '日に有効な値を入力してください。';
var EM_TO_BEFORE_FROME = '指定できる期間は最大31日間までです。';
var EM_NODE_REQUIRED = '機器を選択してください。';
var checkedNodeIdsAll = '';
var checkedNodeIdsActive = '';
var tableColumns = [];
var tableData = [];
var init = true;
var checkedGroupIds = null;
var hasGroup = checkNodeGroup.length > 0;
var respStr;

//-------------Initialize nodeids, displaySpan, allChecked start
function initCheckedNodeIdsAndDisplaySpan(){
	var currentCheckedNodeIdsAll = '';
	var currentCheckedNodeIdsActive = '';
	checkNode.each(function(){
		if(this.checked){
			if(this.disabled){
				if(checkedNodeIdsAll == '')
					checkedNodeIdsAll = checkedNodeIdsAll + $(this).val();
				else
					checkedNodeIdsAll = checkedNodeIdsAll + "," + $(this).val();
			}else{
				if(checkedNodeIdsAll == '')
					checkedNodeIdsAll = checkedNodeIdsAll + $(this).val();
				else
					checkedNodeIdsAll = checkedNodeIdsAll + "," + $(this).val();
				if(checkedNodeIdsActive == '')
					checkedNodeIdsActive = checkedNodeIdsActive + $(this).val();
				else
					checkedNodeIdsActive = checkedNodeIdsActive + "," + $(this).val();
			}
		}
	});

	checkedNodeIdsAll = currentCheckedNodeIdsAll;
	checkedNodeIdsActive = currentCheckedNodeIdsActive;

	var visibleNode = checkNode.filter(':visible');
	if(visibleNode.length == 0) {
		checkNodeAll.prop('checked', false);
		checkNodeAll.prop('disabled', true);
	}else {
		checkNodeAll.prop('disabled', false);
		if(visibleNode.filter(':checked').length == visibleNode.length)
			checkNodeAll.prop('checked', true);
		else
			checkNodeAll.prop('checked', false);
	}
}
//-------------Initialize nodeids, displaySpan, allChecked end

//-------------All check, uncheck behavior start
checkNode.change(function(){
	var visibleNode = checkNode.filter(':visible');
	if(visibleNode.filter(':checked').length == visibleNode.length)
		checkNodeAll.prop('checked', true);
	else
		checkNodeAll.prop('checked', false);
});

checkNodeAll.change(function() {
	if(this.checked)
		checkNode.filter(':visible').prop('checked', true);
	else
		checkNode.filter(':visible').prop('checked', false);
});
//-------------All check, uncheck behavior end

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

//***** large table
niTable.click(function(){
	window.open(contextPath + 'large/nodeInformation/Large.jsp');
});
//===== large table

checkNodeGroup.change(function(){
	// set group's all check checkbox
	setGroupCheckAll();
	
	var nodeGroupTr = $('.node-group-' + this.value);
	var checkInGroup = nodeGroupTr.find('[type="checkbox"]');
	if(this.checked){
		checkInGroup.attr('disabled', false);
		nodeGroupTr.show();
	}else{
		checkInGroup.attr('disabled', true);
		nodeGroupTr.hide();
	}
	var visibleNode = checkNode.filter(':visible');
	if(visibleNode.length == 0) {
		checkNodeAll.prop('checked', false);
		checkNodeAll.prop('disabled', true);
	}else {
		checkNodeAll.prop('disabled', false);
		if(visibleNode.filter(':checked').length == visibleNode.length)
			checkNodeAll.prop('checked', true);
		else
			checkNodeAll.prop('checked', false);
	}
});

checkGroupAll.change(function(){
	checkNodeGroup.prop('checked', this.checked);
	checkNodeGroup.each(function(){
		$(this).change();
	});
});

function saveGroupChecked(){
	// グループのチェック状態を保存
	var currentCheckedGroupIds;
	var checkedGroup = $('.node-group:checked');
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
			url: contextPath + '/Ajax/UpdateNodeInfoUserCheckedGroup.do',
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

radioDisplayType.change(function(){
	// グラフ表示
	if(this.value == 'g'){
		if(divNiGraph.hasClass('hide')){
			divNiGraph.removeClass('hide');
		}
		divNiGraph.show();
		divNiData.hide();
		clearInterval(updateInterval.data);
		delete updateInterval.data;
		if(updateInterval.graph != null){
			clearInterval(updateInterval.graph);
			delete updateInterval.graph;
		}
		getUpdatedGraph();
		updateInterval.graph = setInterval(getUpdatedGraph, updateInterval.frequency);
	}else{ // データ表示
		divNiData.show();
		divNiGraph.hide();
		clearInterval(updateInterval.graph);
		delete updateInterval.graph;
		if(updateInterval.data != null){
			clearInterval(updateInterval.data);
			delete updateInterval.data;
		}
		updateParam.init = true;
		updateNodeStatus();
		updateInterval.data = setInterval(updateNodeStatus, updateInterval.frequency);
	}
});

selectDisplaySpan.change(function(){
	radioDisplayType.filter(':checked').change();
});

function getUpdatedGraph(){
	if(beforeGetUpdate()){
		$.ajax({
			url: '/zeuschart/NodeInformation/GetNodeInformationRealtime/Graph.do',
			async: true,
			cache: false,
			data: updateParam,
			success: function(response){
				var respObj = JSON.parse(response);
				if(respObj.timeMili != null){
					updateParam.timeMili = respObj.timeMili;
				}
				imgNi.show();
				imgNi.attr('src', "/zeuschart/node_information_" + updateParam.timeMili + '.png?t=' + Math.random());
			},
			error: function(){
				console.log('get ni graph error');
			}
		});
	}
}

function beforeGetUpdate(){
	var nodeIdChanged = false;
	var currentCheckedNodeIds = checkNode.filter(':visible:checked').map(function(){
		return this.value;
	}).get().join(',');
	if(currentCheckedNodeIds != updateParam.nodeIds)
		nodeIdChanged = true;
	updateParam.nodeIds = currentCheckedNodeIds;
	
	var displayTimeChanged = false;
	var currentDisplayTime = selectDisplaySpan.val();
	if(updateParam.displayTime != currentDisplayTime)
		displayTimeChanged = true;
	updateParam.displayTime = currentDisplayTime;
	
	var displayTypeChanged = false;
	var currentDisplayType = radioDisplayType.filter(':checked').val();
	if(displayType != currentDisplayType){
		displayTypeChanged = true;
		displayType = currentDisplayType;
	}
	
	if(currentCheckedNodeIds == '' || currentDisplayTime == '')
		return false;
	else{
		//***** update user checked node ids and display time and display type
		if(nodeIdChanged || displayTimeChanged || displayTypeChanged){
			var userOptionParam = {};
			if(nodeIdChanged){
				var checkedNodeIdsAll = checkNode.filter(':checked').map(function(){
					return this.value;
				}).get().join(',');
				userOptionParam.nodeIds = checkedNodeIdsAll;
			}
			if(displayTimeChanged)
				userOptionParam.displayTime = currentDisplayTime;
			if(displayTypeChanged)
				userOptionParam.displayType = currentDisplayType;
			
			$.ajax({
				url: contextPath + '/Ajax/NodeInfomationUpdate.do',
				async: true,
				cache: false,
				type: 'post',
				data: userOptionParam
			});
		}
		//_____ update user checked node ids and display time
		
		//***** update updateParam
		// node ids
		updateParam.nodeIds = currentCheckedNodeIds;
		// display time
		updateParam.displayTime = currentDisplayTime;
		// init
		if(nodeIdChanged || displayTimeChanged)
			updateParam.init = true;
		// currentMaxTime
		if(displayType == 'd'){
			if(tableData.length > 0)
				updateParam.currentMaxTime = tableData[0].datetime;
			else
				delete updateParam.currentMaxTime;
		}
		//_____ update updateParam
		return true;
	}
}

//-------------Ajax: update node information start
function updateNodeStatus(){
	if(beforeGetUpdate()){
		$.ajax({
			url: '/zeuschart/NodeInformation/GetNodeInformationRealtime.do',
			async: true,
			cache: false,
			data: updateParam,
			success: function(response){
				var respObj = JSON.parse(response);
				if(respObj.columns != null){
					tableColumns = JSON.stringify(respObj.columns);
					tableData = respObj.data;
					// データテーブル
					niTable.bootstrapTable('destroy').bootstrapTable({
						fixedColumns: true,
						fixedNumber: 1,
						striped: false,
						height: 500,
						columns: JSON.parse(tableColumns),
						data: tableData
					});
					$('.fixed-table-header-columns').find('th').height(niTable.find('th').height());
				}else{
					tableData.pop();
					tableData.unshift(respObj.data);
					niTable.bootstrapTable('load', tableData);
				}
				updateParam.init = false;
			},
			error: function(){
				console.log('refresh json error');
			}
		});
	}else{
		niTable.bootstrapTable('destroy');
	}
}
//-------------Ajax: update node information end

function NodeInfo(){
	let objForm = function(){
		return {
			isValid: function(){
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
				
				divErrorPeriod.html('');
				divErrorNode.html('');
				
				var isStartValid = moment(ysVal + ' ' + msVal + ' ' + dsVal, 'YYYY M D', true).isValid();
				var isEndValid = moment(yeVal + ' ' + meVal + ' ' + deVal, 'YYYY M D', true).isValid();
				
				if(!(isStartValid && isEndValid)){
					divErrorPeriod.append('<div>' + errmsgPeriodInvalid + '</div>');
				}
				
				var momentS = moment([ysVal, msVal - 1, dsVal, hsVal, misVal, 0, 0]);
				var momentE = moment([yeVal, meVal - 1, deVal, heVal, mieVal, 0, 0]);
				var diffMi = momentE.diff(momentS, 'minutes');
				var diffD = momentE.diff(momentS, 'days');
				if(diffMi < 0 || diffD > 30){
					divErrorPeriod.append('<div>' + EM_TO_BEFORE_FROME + '</div>');
				}
					
				var nodeIds = checkNode.filter(':visible:checked').map(function(){
					return this.value;
				}).get().join(',');
				if(nodeIds == ''){
					divErrorNode.append(EM_NODE_REQUIRED);
				}
				
				if(divErrorPeriod.html() != '' || divErrorNode.html() != ''){
					return false;
				}
				return true;
			},
			getParamArray: () => {
				let arrParam = [];
				let param = {
					name: 'startYmd',
					value: [ys.val().trim(), zeus.getFormattedNumber(ms.val().trim()), zeus.getFormattedNumber(ds.val().trim())].join('-')
				};
				arrParam.push(param);
				param = {
					name: 'startHm',
					value: [hs.val(), mis.val()].join(':')
				};
				arrParam.push(param);
				param = {
					name: 'endYmd',
					value: [ye.val().trim(), zeus.getFormattedNumber(me.val().trim()), zeus.getFormattedNumber(de.val().trim())].join('-')
				};
				arrParam.push(param);
				param = {
					name: 'endHm',
					value: [he.val(), mie.val()].join(':')
				};
				arrParam.push(param);
				param = {
					name: 'nodeIds',
					value: checkNode.filter(':visible:checked').map(function(){
						return this.value;
					}).get().join(',')
				};
				arrParam.push(param);
				param = {
					name: 'isMerge',
					value: isMerge.checked? 1: 0
				}
				arrParam.push(param);
				return arrParam;
			}
		}
	}();
	var periodDatePickerOptions = {
		startView: 0,
		maxViewMode: 2,
		minViewMode: 0,
		todayBtn: 'linked',
		language: 'ja',
		autoclose: true,
		todayHighlight: true
	};
	var errmsgDateArrow = '正しい期間を選択または入力してください。';
	var errmsgPeriodInvalid = '正しい期間を選択または入力してください。';
	var btnCSV = $('#btn-csv');
	var ys = $('[name="ys"]');
	var ms = $('[name="ms"]');
	var ds = $('[name="ds"]');
	var hs = $('[name="hs"]');
	var mis = $('[name="mis"]');
	var ye = $('[name="ye"]');
	var me = $('[name="me"]');
	var de = $('[name="de"]');
	var he = $('[name="he"]');
	var mie = $('[name="mie"]');
	var startDatePicker = $('.start-date-picker');
	var endDatePicker = $('.end-date-picker');
	// 前日翌日リンク
	var aDateArrow = $('[data-toggle="date-arrow"]');
	let isMerge = document.querySelector('[name="isMerge"]');
	
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
	
	btnCSV.click(function(){
		if(objForm.isValid()){
			let arrParam = objForm.getParamArray();
			zeus.downloadFile({
				action: '/zeuschart/NodeInformation/CSV.do',
				attrList: arrParam
			});
		}
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
	
	//***** 期間初期化
	zeus.setNumberOptionsByName('mis', 0, 59, false, '00');
	mis.val(fbMis);
	zeus.setNumberOptionsByName('mie', 0, 59, false, '00');
	mie.val(fbMie);
	//_____ 期間初期化
	
	startDatePicker.datepicker(periodDatePickerOptions);
	startDatePicker.datepicker('setDate', new Date(ys.val(), ms.val() - 1, ds.val()));
	endDatePicker.datepicker(periodDatePickerOptions);
	endDatePicker.datepicker('setDate', new Date(ye.val(), me.val() - 1, de.val()));
	// 前日翌日初期化
	dateArrows.init('data-toggle', 'date-arrow');
}

function setGroupCheckAll(){
	var groupLen = checkNodeGroup.length;
	var checkedLen = checkNodeGroup.filter(':checked').length;
	checkGroupAll.prop('checked', groupLen == checkedLen);
}

//-------------init start
initCheckedNodeIdsAndDisplaySpan();

if(hasGroup) {
	setGroupCheckAll();
	checkNodeGroup.each(function(){
		$(this).change();
	});
	saveGroupChecked();
	setInterval(saveGroupChecked, 10000);
}

new NodeInfo();

// get data
radioDisplayType.filter(':checked').change();
//-------------init end