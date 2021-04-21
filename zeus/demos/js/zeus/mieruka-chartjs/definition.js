var radioGraphType = $('[name="graphType"]');
var radioDispUnit = $('[name="dispUnit"]');
var radioViewCategory = $('[name="viewcategory"]');
var radioViewType = $('[name="viewtype"]');
var radioViewSpan = $('[name="viewspan"]');
var radioGraphDisplay = $('[name="ex"]');
var radioBgColor = $('[name="bgcolor"]');
var radioMonitorItem = $('[name="realTime"]');

var selectDisplayTime = $('[name="dt"]');
var selectUpdateFrequency = $('[name="monitoringUpdateFrequency"]');

var checkGroup = $('.group');
var checkSensorAll = $('#check-sensor-all');
var checkSensor = $('.check-sensor');
var checkLabelDisplayRt = $('[name="graphLabelDispReal"]');
var checkGraphLabelDisp = $('[name="graphLabelDisp"]');
var checkReduceDisp = $('[name="reduceDisp"]');
var checkValueOption = $('[name="valueOption"]');
var checkNodeControlStatusDisplay = $('[name="nodeControlStatusDisplay"]');

var trEnergy = $('.tr-energy');
var trEnv = $('.tr-env');
var trHr = $('.tr-hr');

var textYs = $('[name="ys"]');
var textMs = $('[name="ms"]');
var textDs = $('[name="ds"]');
var textYear = $('[name="year"]');
var textMonth = $('[name="month"]');
var textDay = $('[name="day"]');

var selectHs = $('[name="hs"]');
var selectHour = $('[name="hour"]');

var spanCompare = $('#span-compare');
var spanPeriod = $('#span-period');
var spanBtnGraphTotal = $('#spanBtnGraphTotal');
var spanMonth = $('.span-month');
var spanDay = $('.span-day');
var spanHour = $('.span-hour');

var iCompareDatepicker = $('.i-compare-datepicker');
var iPeriodDatepicker = $('#i-period-datepicker');

var divCompareAddBtn = $('#div-compare-add-btn');
var divElectricButton = $('#electricbutton');
var divErrorPeriod = $('#div-error-period');
var divGraph = $('#div-graph');
var divGraphRtElect = $('#div-graph-rt-elect');
var divGraphLegend = $('#div-graph-legend');
var divZdaemon = $('#div-zdaemon');
var divCollapseZdaemon = $('#div-collapse-zdaemon');
var divRealtimeDemand = $('#div-realtime-demand');
var divRealtimeElect = $('#div-realtime-elect');
var divRealtimeEnv = $('#div-realtime-env');
var divGraphNodeControlStatus = $('#div-graph-node-control-status');

var imgRtElect = $('#imgRtElect');

var btnHistory = $('.btn-history');
var btnRt = $('#btnRt');
var btnGraph = $('.btn-graph');

var periodDiv = $('#period');
var compareDiv = $('#compare');
var historyTable = $('#history');
var monitor = $('#monitor');
var historyButtonDiv = $('#historybutton');
var monitorButtonDiv = $('#monitorbutton');
var monitorOption = $('[name="monitorOption"]');
var monitorOptionRt = $('[name="monitorOptionRt"]');
var sensorBody = $('#sensor-body');
var monitorOptionRt = $('[name="monitorOptionRt"]');

const DISPLAY_SPAN_INDEX = {
    'y': 0, 'm': 1, 'd': 2, 'h': 3
}

var checkedGroupIds;
var hasGroup = checkGroup.length > 0;
var dataChart;
var intervalItems = [];
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
var realtimeDemandChartConfig = {
	type: 'line',
	data: {
		//labels: xAxesLable,
		//datasets: [{}],
	},
	options: {
		responsive: true,
		maintainAspectRatio: true,
		title: {
			//display: true,
			//text: '電力の利用状況'
		},
		tooltips: {
			mode: 'index',
			intersect: false,
		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		layout: {
			padding: {
				//right: 0
			}
		},
		animation: {
			duration: 1000
		},
		scales: {
			xAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: '時刻'
				},
				gridLines: {
					display: false
				},
				ticks: {
					maxRotation: 90
				}
			}],
			//yAxes: [{}]
		},
		legend: {
			display: false,
			position: 'bottom'
		}
	}
};