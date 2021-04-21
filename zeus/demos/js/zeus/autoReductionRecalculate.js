function TuningMode(){
	this.radios = document.querySelectorAll('[name="mode"]');
	for(let i = 0, l = this.radios.length; i < l; i++){
		this.radios[i].onchange = this.onModeChange;
	}
}
TuningMode.prototype = {
	onModeChange: function(){
		if(this.value === 'graph'){
			zeus.hideElement(divRecalculate._this);
			zeus.showElement(divGraph._this);
		}else{
			zeus.hideElement(divGraph._this);
			zeus.showElement(divRecalculate._this);
			if(this.value === 'recalculateNode'){
				zeus.showElement(divRecalculate.divTableNode);
				zeus.hideElement(divRecalculate.divTableArs);
				zeus.hideElement(divRecalculate.divTableSensor);
			}else if(this.value === 'recalculateArs'){
				zeus.hideElement(divRecalculate.divTableNode);
				zeus.showElement(divRecalculate.divTableArs);
				zeus.hideElement(divRecalculate.divTableSensor);
			}else{
				zeus.hideElement(divRecalculate.divTableNode);
				zeus.hideElement(divRecalculate.divTableArs);
				zeus.showElement(divRecalculate.divTableSensor);
			}
		}
	},
	getCheckedValue: function(){
		for(let i = 0, l = this.radios.length; i < l; i++){
			if(this.radios[i].checked){
				return this.radios[i].value;
			}
		}
		return null;
	}
};

function TableNodeGraph(){
	this.divErr = document.querySelector('#divErrTableGraph');
	this.jqTable = $('#tableNodeGraph');
	
	this.jqTable.bootstrapTable({
		columns: [
			{
				radio: true
			}, {
				field: 'nodeId',
				title: fmt.node.id
			}, {
				field: 'nodeName',
				title: fmt.node.name
			}
		],
		data: arrNodeGraph,
		uniqueId: 'nodeId',
		locale: sessionStorage.getItem(STORE_KEY.bootstrapTable.language),
		search: true,
		searchAlign: 'left'
	});
	
	if(arrNodeGraph.length > 0){
		this.jqTable.bootstrapTable('check', 0);
	}
}
TableNodeGraph.prototype = {
	getChecked: function(){
		return this.jqTable.bootstrapTable('getSelections');
	},
	isValid: function(){
		this.divErr.innerHTML = '';
		if(this.getChecked().length === 0){
			this.divErr.innerHTML = fmt.fn.err.required.check.node();
			return false;
		}
		return true;
	}
};

function TableNodeRecalculate(){
	this.jqTable = $('#tableRecalculateNode');
	
	this.jqTable.bootstrapTable({
		columns: [
			{
				checkbox: true
			}, {
				field: 'nodeId',
				title: fmt.node.id
			}, {
				field: 'nodeName',
				title: fmt.node.name
			}
		],
		data: arrNodeRecalculate,
		uniqueId: 'nodeId',
		locale: sessionStorage.getItem(STORE_KEY.bootstrapTable.language),
		search: true,
		searchAlign: 'left'
	});
}
TableNodeRecalculate.prototype = {
	isChecked: function(){
		return this.jqTable.bootstrapTable('getSelections').length > 0;
	},
	isValid: function(){
		divErrTableRecalculate.innerHTML = '';
		if(this.isChecked()){
			return true;
		}else{
			divErrTableRecalculate.innerHTML = util_zeus.fmt.getReplaced(fmt.err.required.check, [fmt.node._]);
			return false;
		}
	},
	getArrCheckedId: function(){
		let arrChecked = [];
		let selections = this.jqTable.bootstrapTable('getSelections');
		for(let i = 0, l = selections.length; i < l; i++){
			arrChecked.push(selections[i].nodeId);
		}
		return arrChecked;
	}
};

let periodDatePickerOptions = {
	startView: 0,
	maxViewMode: 0,
	minViewMode: 0,
	todayBtn: 'linked',
	language: sessionStorage.getItem('sysLanguage'),
	autoclose: true,
	todayHighlight: true
};
let periods = new Periods('divPeriodRecalculate', periodDatePickerOptions);
let moToday = moment();

let formatDateMo = 'YYYY-M-D';

let divGraph = function(){
	let boards = function(){
		function getCharts(){
			let isValidDate = divPeriod.isDateValid();
			let isValidTable = tableNodeGraph.isValid();
			if(isValidDate && isValidTable){
				$(btnDisplayGraph._this).button('loading');
				let dataParam = {
					dateFrom: divPeriod.periods.arrPeriod[0].getFormattedDate(),
					timeFrom: divPeriod.periods.arrPeriod[0].getFormattedDateTime('HH:mm:00'),
					dateTo: divPeriod.periods.arrPeriod[1].getFormattedDate(),
					timeTo: divPeriod.periods.arrPeriod[1].getFormattedDateTime('HH:mm:00'),
					nodeId: tableNodeGraph.getChecked()[0].nodeId
				};
				$.ajax({
					url: '/zeuschart/Rest/AutoReduction/ECharts.do',
					async: true,
					cache: false,
					method: 'POST',
					data: dataParam,
					success: function(resp){
						let objResp = JSON.parse(resp);
						if(objResp.result === 'ng'){
							popupError.setMessage(objResp.error.message);
							zeus.hideElement(boards._this);
						}else{
							let reduction = objResp.success.reduction;
							if(reduction.legend.data != null){
								charts.reduction.option.legend.data = reduction.legend.data;
							}else{
								delete charts.reduction.option.legend.data;
							}
							if(reduction.legend.selected != null){
								charts.reduction.option.legend.selected = reduction.legend.selected;
							}else{
								delete charts.reduction.option.legend.selected;
							}
		     				charts.reduction.option.series = reduction.series;
		     				charts.setOption('reduction');
							let control = objResp.success.control;
							if(control.legend.data != null){
								charts.control.option.legend.data = control.legend.data;
							}else{
								delete charts.control.option.legend.data;
							}
							if(control.legend.selected != null){
								charts.control.option.legend.selected = control.legend.selected;
							}else{
								delete charts.control.option.legend.selected;
							}
		     				charts.control.option.series = control.series;
		     				charts.setOption('control');
		     				zeus.showElement(boards._this);
		     				charts.resize();
						}
						$(btnDisplayGraph._this).button('reset');
					},
					error: function(){
						popupError.setMessage(fmt.err.occurred);
						zeus.hideElement(boards._this);
						$(btnDisplayGraph._this).button('reset');
					}
				});
			}
		}
		let charts = {
			reduction: {
				option: {
					title: {
						text: '電力 + 削減区間'	
					},
					legend: {
						type: 'scroll',
						orient: 'vertical',
						x: 'right',
						y: 'middle'
					},
					xAxis: {
						type: 'time'
					},
					yAxis: {
						type: 'value'
					},
					dataZoom: [{
						type: 'inside',
						start: 0,
						end: 100
					}],
					tooltip: {
						trigger: 'axis'
					}
				},
				board: document.querySelector('#divGraphBoardReduction')
			},
			control: {
				option: {
					title: {
						text: '制御状況'	
					},
					legend: {
						x: 'middle',
						y: 'bottom'
					},
					xAxis: {
						type: 'time'
					},
					yAxis: {
						type: 'value'
					},
					dataZoom: [{
						type: 'inside',
						start: 0,
						end: 100
					}],
					tooltip: {
						trigger: 'axis'
					}
				},
				board: document.querySelector('#divGraphBoardControlStatus')
			},
			setOption: function(type){
				this[type].chart.setOption(this[type].option, true);
			},
			resize: function(){
				this.reduction.chart.resize();
				this.control.chart.resize();
			}
		};
		charts.reduction.chart = echarts.init(charts.reduction.board);
		charts.control.chart = echarts.init(charts.control.board);
		
		return {
			_this: document.querySelector('#divGraphBoard'),
			getCharts: getCharts
		};
	}();
	
	let divPeriod = function(){
		function divPeriodClearError(){
			zeus.removeClass(divPeriod, 'has-error');
			divErrPeriod.innerHTML = '';
		}
		function setDivPeriodErrorMessage(msg){
			zeus.addClass(divPeriod, 'has-error');
			divErrPeriod.innerHTML = msg;
		}
		function isDateValid(){
			divPeriods.clearErrorAll();
			return divPeriods.checkDateValid() && divPeriods.checkNotAfter();
		}
		
		let divPeriods = new Periods('divPeriodGraph', periodDatePickerOptions);
		divPeriods.arrPeriod[1].h.value = zeus.getFormattedNumber(moToday.hour());
		divPeriods.arrPeriod[1].mi.value = zeus.getFormattedNumber(moToday.minute());
		
		return {
			periods: divPeriods,
			isDateValid: isDateValid
		}
	}();
	
	let tableNodeGraph = new TableNodeGraph();
	let btnDisplayGraph = function(){
		let btn = document.querySelector('#btnDisplayGraph');
		btn.onclick = function(){
			boards.getCharts();
		};
		
		return {
			_this: btn
		}
	}();
	
	return {
		_this: document.querySelector('#divGraph'),
		tableNode: tableNodeGraph
	};
}();

let process_error_status = {};
function NodeAutoProcess(processId){
	this.processId = processId;
	this.labels = {
		status: document.querySelector('#label-status-' + processId),	
		datetime: document.querySelector('#label-datetime-' + processId)
	};
	this.datas = {
		status: this.labels.status.getAttribute('data-status')
	}
	this.buttons = {
		refresh: document.querySelector('#btn-refresh-' + processId),
		execute: document.querySelector('#btn-execute-' + processId)
	};
	this.buttons.refresh.onclick = this.refresh.bind(this, true);
	this.buttons.execute.onclick = this.execute.bind(this);
}
NodeAutoProcess.prototype = {
	refresh(isAsync){
		$(this.buttons.refresh).button('loading');
		zeus.ajax({
			url: contextPath + 'Rest/NodeAutoProcess/Refresh.action',
			async: isAsync,
			item: this,
			data: {
				processId: this.processId
			},
			success(resp){
				let objResp = JSON.parse(resp);
				if(objResp.result === 'ok'){
					if(this.async){
						popupMessage.setMessage('取得しました。');
					}
					this.item.labels.status.innerText = objResp.success.data.processStatusName;
					this.item.datas.status = objResp.success.data.status;
					this.item.labels.datetime.innerText = objResp.success.data.datetime;
					process_error_status[this.item.processId] = false;
					
					this.item.buttons.execute.disabled = objResp.success.data.status === 'CALCULATING';
				}else{
					popupError.setMessage(objResp.error.message);
					process_error_status[this.item.processId] = true;
				}
				$(this.item.buttons.refresh).button('reset');
			},
			error(){
				popupError.setMessage('エラーが発生しました。');
				$(this.item.buttons.refresh).button('reset');
				process_error_status[this.item.processId] = true;
			}
		});
	},
	execute(){
		this.refresh.call(this, false);
		if(!process_error_status[this.processId] && this.datas.status !== 'CALCULATING'){
			let params = divRecalculate.getRecalculateParam();
			if(params != null){
				params.processId = this.processId;
				$(this.buttons.execute).button('loading');
				zeus.ajax({
					url: contextPath + 'Rest/AutoReductionRecalculate/Recalculate.action',
					data: params,
					item: this,
					success: function(resp){
						let objResp = JSON.parse(resp);
						if(objResp.result === 'ok'){
							popupMessage.setMessage(objResp.success.message);
						}else{
							popupError.setMessage(objResp.error.message);
						}
						$(this.item.buttons.execute).button('reset');
					},
					error: function(){
						popupError.setMessage(fmt.err.occurred);
						$(this.item.buttons.execute).button('reset');
					}
				});
			}
		}
	}
}
function ListNodeAutoProcess(){
	this.processes = {};
	let nodeList = document.querySelectorAll('[data-toggle="node-auto-process"]');
	let processId;
	for(let i = 0, l = nodeList.length; i < l; i++){
		processId = nodeList[i].getAttribute('data-process-id');
		this.processes[processId] = new NodeAutoProcess(processId);
		process_error_status[processId] = false;
	}
}

let divRecalculate = function(){
	
	function isTableValid(){
		let mode = tuningMode.getCheckedValue();
		if(mode === 'recalculateNode'){
			return tableNodeRecalculate.isValid();
		}else if(mode === 'recalculateArs'){
			return tableArs.isValid();
		}else{
			return tableSensor.isValid();
		}
	}
	function getRecalculateParam(){
		let param = null;
		let isOk = periods.checkDateValid() && periods.checkNotAfter();
		isOk = isTableValid() && isOk;
		if(isOk){
			param = {};
			let arrDate = periods.getArrDateString();
			param.dateFrom = arrDate[0];
			param.dateTo = arrDate[1];
			let mode = tuningMode.getCheckedValue();
			if(mode === 'recalculateNode'){
				param.nodeIds = tableNodeRecalculate.getArrCheckedId().join();
			}else if(mode === 'recalculateArs'){
				param.arsIds = tableArs.getArrCheckedId().join();
			}else{
				param.sensorIds = tableSensor.getArrCheckedId().join();
			}
		}
		return param;
	}
	
	let divErrTableRecalculate = document.querySelector('#divErrTableRecalculate');
	let tableNodeRecalculate = new TableNodeRecalculate();
	let tableArs = function(){
		function isChecked(){
			return jqTableArs.bootstrapTable('getSelections').length > 0;
		}
		function isValid(){
			divErrTableRecalculate.innerHTML = '';
			if(isChecked()){
				return true;
			}else{
				divErrTableRecalculate.innerHTML = util_zeus.fmt.getReplaced(fmt.err.required.check, [fmt.setting._]);
				return false;
			}
		}
		function getArrCheckedId(){
			let arrChecked = [];
			let selections = jqTableArs.bootstrapTable('getSelections');
			for(let i = 0, l = selections.length; i < l; i++){
				arrChecked.push(selections[i].arsId);
			}
			return arrChecked;
		}
		
		let arrArs = JSON.parse(reqArrArs);
		let tableArs = document.querySelector('#tableRecalculateArs');
		let jqTableArs = $(tableArs).bootstrapTable({
			columns: [
				{
					checkbox: true
				}, {
					field: 'nodeId',
					title: fmt.node.id
				}, {
					field: 'arsId',
					title: fmt.setting.id
				}, {
					field: 'arsName',
					title: fmt.setting.name
				}
			],
			data: arrArs,
			uniqueId: 'arsId',
			locale: sessionStorage.getItem(STORE_KEY.bootstrapTable.language),
			search: true,
			searchAlign: 'left'
		});
		
		return {
			isChecked: isChecked,
			isValid: isValid,
			getArrCheckedId: getArrCheckedId
		}
	}();
	
	let tableSensor = function(){
		function isChecked(){
			return jqTableSensor.bootstrapTable('getSelections').length > 0;
		}
		function isValid(){
			divErrTableRecalculate.innerHTML = '';
			if(isChecked()){
				return true;
			}else{
				divErrTableRecalculate.innerHTML = util_zeus.fmt.getReplaced(fmt.err.required.check, [fmt.sensor.id]);
				return false;
			}
		}
		function getArrCheckedId(){
			let arrChecked = [];
			let selections = jqTableSensor.bootstrapTable('getSelections');
			for(let i = 0, l = selections.length; i < l; i++){
				arrChecked.push(selections[i].sensorId);
			}
			return arrChecked;
		}
		
		let tableSensor = document.querySelector('#tableRecalculateSensor');
		let jqTableSensor = $(tableSensor).bootstrapTable({
			columns: [
				{
					checkbox: true
				}, {
					field: 'sensorId',
					title: fmt.sensor.id
				}, {
					field: 'sensorName',
					title: fmt.sensor.name
				}
			],
			data: arrSensorRecalculate,
			uniqueId: 'sensorId',
			locale: sessionStorage.getItem(STORE_KEY.bootstrapTable.language),
			search: true,
			searchAlign: 'left'
		});
		
		return {
			isChecked: isChecked,
			isValid: isValid,
			getArrCheckedId: getArrCheckedId
		}
	}();
	
	return {
		_this: document.querySelector('#divRecalculate'),
		table: {
			node: tableNodeRecalculate
		},
		divTableNode: document.querySelector('#divTableRecalculateNode'),
		divTableArs: document.querySelector('#divTableRecalculateArs'),
		divTableSensor: document.querySelector('#divTableRecalculateSensor'),
		getRecalculateParam: getRecalculateParam
	};
}();

let tuningMode = new TuningMode();
let listNodeAutoProcess = new ListNodeAutoProcess();