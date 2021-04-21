//センサーデータ監視 bootstrap table
function detailFormatterThreshold(index, row, element){
	let table = '<table class="table table-bordered" style="margin: 0;">';
	
	table += '<tr>';
	table += '<td width="35%">' + fmtSensorDataWatching.undersec + '</td>';
	table += '<td>' + (row.lessDurationSec == null? '-': row.lessDurationSec) + '</td>';
	table += '</tr>';
	
	table += '<tr>';
	table += '<td>' + fmtSensorDataWatching.underword + '</td>';
	table += '<td>' + (row.lessword == null? '-': row.lessword) + '</td>';
	table += '</tr>';
	
	table += '<tr>';
	table += '<td>アラート通知(下)</td>';
	table += '<td>' + row.alertNotificationLess + '</td>';
	table += '</tr>';
	
	table += '<tr>';
	table += '<td>' + fmtSensorDataWatching.oversec + '</td>';
	table += '<td>' + (row.moreDurationSec == null? '-': row.moreDurationSec) + '</td>';
	table += '</tr>';
	
	table += '<tr>';
	table += '<td>' + fmtSensorDataWatching.overword + '</td>';
	table += '<td>' + (row.moreword == null? '-': row.moreword) + '</td>';
	table += '</tr>';
	
	table += '<tr>';
	table += '<td>アラート通知(上)</td>';
	table += '<td>' + row.alertNotificationMore + '</td>';
	table += '</tr>';
	
	table += '</table>';
	return table;
}
function detailFormatterSame(index, row, element){
	let table = '<table class="table table-bordered" style="margin: 0;">';
	table += '<tr>';
	table += '<td width="35%">下回り時アラート文言</td>';
	table += '<td>' + row.sameword + '</td>';
	table += '</tr>';
	table += '</table>';
	return table
}

function goAction(btnItem){
	var item = $(btnItem);
	var dataWatchingId = item.attr('data-wid');
	var action = item.attr('data-actiontype');
	
	if(action == 'm'){
		document.location.href = contextPath + 'SensorDataWatching/UpdateInput.action?dataWatchingId=' + dataWatchingId;
	}else{
		document.location.href = contextPath + 'SensorDataWatching/DeleteConfirm.action?dataWatchingId=' + dataWatchingId;
	}
}

let objTableData = JSON.parse(reqTableData);
let lanTable = zeus.getBootstrapTableLocale(sysLanguage);
let tableColumnsThreshold = [
    {
        title: fmtSensorDataWatching.sensorName,
        field: 'sensorName',
        align: 'center',
        valign: 'middle',
        formatter: function(value, row, index, field){
        	return value + '(' + row.sensorId + ')';
        }
    },
    {
        title: fmtSensorDataWatching.type,
        field:'sensorType',
        width: '8%',
        align: 'center',
        valign: 'middle'
    },
    {
        title: fmtSensorDataWatching.threshold,
        field:'threshold',
        width: '12%',
        align: 'center',
        valign: 'middle'
    },
    {
        title: fmtSensorDataWatching.undercheck,
        field: 'lesscheck',
        width: '9%',
        align: 'center',
        valign: 'middle'
    },
    {
        title: fmtSensorDataWatching.overcheck,
        field: 'morecheck',
        width: '9%',
        align: 'center',
        valign: 'middle'
    },
    {
    	title: fmtSensorDataWatching.abnormalStateJudgement,
    	field: 'abnormalStateJudgment',
    	align: 'center',
    	valign: 'middle',
    	formatter: function(value, row, index, field){
			return value == null? '-': value;
    	}	
    },{
    	title: fmtSensorDataWatching.action,
    	field: 'action',
    	width: '16%',
    	align: 'center',
    	valign: 'middle',
    	formatter: function(value, row, index, field){
    		return [
    			'<div class="btn-group">',
    			'<button type="button" class="btn button-zeus m-none" data-wid="' + row.dataWatchingId + '" data-actiontype="m" onclick="goAction(this);">' + fmtSensorDataWatching.modify + '</button>',
    			'&nbsp;',
    			'<button type="button" class="btn button-zeus m-none" data-wid="' + row.dataWatchingId + '" data-actiontype="d" onclick="goAction(this);">' + fmtSensorDataWatching.del + '</button>',
    			'</div>'
			].join('');
    	}	
    }
];
let tableColumnsSame = [
	{
        title: fmtSensorDataWatching.sensorName,
        field: 'sensorName',
        align: 'center',
        valign: 'middle',
        formatter: function(value, row, index, field){
        	return value + '(' + row.sensorId + ')';
        }
    },{
        title: fmtSensorDataWatching.type,
        field:'sensorTypeName',
        width: '16%',
        align: 'center',
        valign: 'middle'
    },{
    	title: '監視(同一)',
    	field: 'samecheck',
    	width: '10%',
    	align: 'center',
    	valign: 'middle'
    },{
    	title: '抑制秒(同一)',
    	field: 'sameDurationSec',
    	width: '12%',
    	align: 'center',
    	valign: 'middle'
    },{
    	title: 'アラート通知(同一)',
    	field: 'alertNotificationSame',
    	width: '16%',
		align: 'center',
		valign: 'middle'
    },{
    	title: fmtSensorDataWatching.action,
    	field: 'action',
    	width: '16%',
    	align: 'center',
    	valign: 'middle',
    	formatter: function(value, row, index, field){
    		return [
    			'<div class="btn-group">',
    			'<button type="button" class="btn button-zeus m-none" data-wid="' + row.dataWatchingId + '" data-actiontype="m" onclick="goAction(this);">' + fmtSensorDataWatching.modify + '</button>',
    			'&nbsp;',
    			'<button type="button" class="btn button-zeus m-none" data-wid="' + row.dataWatchingId + '" data-actiontype="d" onclick="goAction(this);">' + fmtSensorDataWatching.del + '</button>',
    			'</div>'
			].join('');
    	}	
    }
];

// attache events
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	$.ajax({
		url: contextPath + 'Rest/SensorDataWatching/SetListTab.action',
		async: true,
		cache: false,
		data: {
			tab: e.target.getAttribute('aria-controls')
		}
	});
});

// initialization
// tab
$('a[href="#' + (zeusStringUtils.isEmpty(sTab)? 'threshold': sTab) + '"]').tab('show');
// table threshold
$('#table-sensorThreshold').bootstrapTable({
    method: 'post',
    contentType: "application/x-www-form-urlencoded",//必须要有！！！！
    cache: false,
    toolbar: '#toolbar',//指定工具栏
    striped: false, //是否显示行间隔色
    detailView: true,
    detailFormatter: detailFormatterThreshold,
    showRefresh: false,//刷新按钮
    showColumns: false,
    toolbarAlign:'right',//工具栏对齐方式
    buttonsAlign:'right',//按钮对齐方式
    locale: lanTable,//中文支持,
    columns: tableColumnsThreshold,
    data: objTableData.threshold
});
// table same
$('#table-sensorSame').bootstrapTable({
	method: 'post',
	contentType: "application/x-www-form-urlencoded",//必须要有！！！！
	cache: false,
	toolbar: '#toolbar',//指定工具栏
	striped: false, //是否显示行间隔色
	detailView: true,
	detailFormatter: detailFormatterSame,
	showRefresh: false,//刷新按钮
	showColumns: false,
	toolbarAlign:'right',//工具栏对齐方式
	buttonsAlign:'right',//按钮对齐方式
	locale: lanTable,//中文支持,
	columns: tableColumnsSame,
	data: objTableData.same
});
