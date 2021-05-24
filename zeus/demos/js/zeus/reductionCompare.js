let arrRowMax = [];
function tableDataCompareGetRowMax(row, index){
	if(arrRowMax[index]){
		return arrRowMax[index];
	}else{
		let arrData = [];
		for(let key in row){
			if(key !== 'datetime'){
				if(row[key] != null){
					arrData.push(parseFloat(zeusStringUtils.replaceAll(row[key], ',', '')));
				}
			}
		}
		if(arrData.length > 0){
			arrRowMax[index] = zeusNumberUtils.toThousands(Math.max.apply(null, arrData));
			console.log(arrRowMax[index]);
			return arrRowMax[index];
		}
		return null;
	}
}
function tableDataCompareCellStyle(value, row, index){
	if(value != null){
		let max = tableDataCompareGetRowMax(row, index);
		if(value == max){
			return {
				classes: 'text-danger'
			}
		}
	}
	return {};
}

function TableNodeTotal(){
	this.arrColumn = [
		{
			checkbox: true
		},{
			field: 'nodeId',
			title: fmt.node.id
		},{
			field: 'nodeName',
			title: fmt.node.name
		},{
			field: 'arsIdBefore',
			title: '算出設定（ビフォー）',
			formatter: this.arsIdBeforeFormatter
		},{
			field: 'arsIdAfter',
			title: '算出設定（アフター）',
			formatter: this.arsIdAfterFormatter
		}
	];
	this.jqTable = $('#tableNodeTotal');
	// initialization
	this.jqTable.bootstrapTable({
		columns: this.arrColumn,
		data: [{
			nodeId: 'N0001',
			nodeName: 'ノード1',
			arrArsId: [{
				arsId: 'ARS0001',
				arsName: '設定1'
			},{
				arsId: 'ARS0002',
				arsName: '設定2'
			}]
		},{
			nodeId: 'N0002',
			nodeName: 'ノード2',
			arrArsId: [{
				arsId: 'ARS0001',
				arsName: '設定1'
			},{
				arsId: 'ARS0002',
				arsName: '設定2'
			}]
		}],
		uniqueId: 'nodeId',
		locale: 'ja-jp'
	});
}
TableNodeTotal.prototype = {
	// methods
	getChecked: function(){
		return this.jqTable.bootstrapTable('getSelections');
	},
	arsIdBeforeFormatter: function(value, row){
		let div = document.createElement('div');
		
		if(row.arrArsId !== null){
			let option;
			let select = document.createElement('select');
			select.setAttribute('class', 'form-control input-sm');
			
			for(let index in row.arrArsId){
				option = document.createElement('option');
				option.value = row.arrArsId[index].arsId;
				option.text = row.arrArsId[index].arsName;
				select.appendChild(option);
			}
			div.appendChild(select);
		}else{
			return null;
		}
		return div.innerHTML;
	},
	arsIdAfterFormatter: function(value, row){
		let div = document.createElement('div');
		
		if(row.arrArsId !== null){
			let option;
			let select = document.createElement('select');
			select.setAttribute('class', 'form-control input-sm');
			
			for(let index in row.arrArsId){
				option = document.createElement('option');
				option.value = row.arrArsId[index].arsId;
				option.text = row.arrArsId[index].arsName;
				select.appendChild(option);
			}
			div.appendChild(select);
		}else{
			return null;
		}
		return div.innerHTML;
	}
};

function TableDataTotal(){
	this.tableConfig = {
		columns: [{
			field: 'datetime',
			title: '時刻',
			'class': 'bg-zeus text-center'
		},{
			field: 'before',
			title: 'ビフォー'
		},{
			field: 'after',
			title: 'アフター'
		}],
		data: [{
			datetime: '2021-05-24 00:00'
		},{
			datetime: '2021-05-24 00:30'
		},{
			datetime: '...'
		},{
			datetime: '2021-05-24 23:30'
		},{
			datetime: '合計'
		}],
		striped: false,
		height: 400,
		locale: 'ja-JP',
		undefinedText: '',
		showColumns: true,
		showToggle: true,
		headerStyle: function(column){
			
			if(column.field === 'datetime'){
				return {
					css: {
						'width': '120px',
						'min-width': '120px',
						'max-width': '120px'
					},
					classes: 'text-center'
				};
			}else{
				return {
					css: {
						'width': '120px',
						'min-width': '120px',
						'max-width': '120px'
					},
					classes: 'text-center'
				};
			}
		}
	};
	this.jqTable = $('#table-data-total');
}
TableDataTotal.prototype = {
	// methods
	init: function(){
		this.jqTable.bootstrapTable(this.tableConfig);
	}
};

function TabTotal(){
	// data table
	this.tableDataTotal = new TableDataTotal();
	// period form
	this.periodPickerTotal = new ZeusPeriodPicker({
		r: {
			name: 'viewSpanTotal',
			isCallOnChange: false,
			onchange: function(){
				periodPickerTotal.refreshDivVisible();
				periodPickerTotal.refreshDatepickerViewMode();
			}
		},
		periodType: 'list',
		dateinput: {
			inputs: [
				{y: 'yTotal', m: 'mTotal', d: 'dTotal'}
			],
			onblur: function(){
				if(this.dateinput.isValid()){
					this.datepicker.update(this.dateinput.getMoment().toDate());
				}
			}
		},
		datepicker: {
			pickers: ['zeus-datepicker-total'],
			option: {
				startView: 'days',
				minViewMode: 'days',
				maxViewMode: 'years',
				todayBtn: 'linked',
				language: sessionStorage.getItem('sysLanguage'),
				autoclose: true,
				todayHighlight: true
			},
			onChangeDate: function(e){
				if(e.date != null) {
					this.dateinput.setTextDate(e.date.getFullYear(), e.date.getMonth() + 1, e.date.getDate());
				}
			}
		},
		arrow: {
			arrows: [
				{left: 'zeus-arrow-left-total', right: 'zeus-arrow-right-total'}
			],
			onClick: function(period){
				if(period.dateinput.isValid()){
					let add = this.getAttribute('data-add');
					let mo = period.dateinput.getMoment();
					mo.add(add, periodPicker.r.getCheckedValue());
					period.datepicker.update(mo.toDate());
					period.dateinput.setTextDate(mo.year(), mo.month() + 1, mo.date());
				}
			}
		}
	});
	// buttons
	this.btnTableTotal = document.querySelector('#btn-table-total');
	this.btnCSVTotal = document.querySelector('#btn-csv-total');
	// node table
	this.tableNodeTotal = new TableNodeTotal();
	
	// binding events
	this.btnTableTotal.onclick = this.onBtnTableTotalClick;
}
TabTotal.prototype = {
	onBtnTableTotalClick: function(){
		tabTotal.tableDataTotal.init();
	}
};

let tableDataCompare = function(){
	let tableConfig = {
		striped: false,
		height: 400,
		locale: 'ja-JP',
		undefinedText: '',
		showColumns: true,
		showToggle: true,
		headerStyle: function(column){
			if(column.field === 'datetime'){
				return {
					css: {
						'width': '120px',
						'min-width': '120px',
						'max-width': '120px'
					},
					classes: 'text-center'
				}
			}else{
				return {
					css: {
						'width': '120px',
						'min-width': '120px',
						'max-width': '120px'
					},
					classes: 'text-center'
				}
			}
		}
	};
	let jqTable = $('#tableDataCompare');

	return {
		updateTable: function(newConfig){
			let config = {};
			Object.assign(config, tableConfig, newConfig);
			jqTable.bootstrapTable(config);
		},
		destroy: function(){
			jqTable.bootstrapTable('destroy');
		}
	}
}();

let tableNodeIndividual = function(){
	let arrColumn = [
		{
			radio: true
		}, {
			field: 'nodeId',
			title: fmt.node.id
		}, {
			field: 'nodeName',
			title: fmt.node.name
		}
	];
	let arrNode = JSON.parse(req.arrNode);
	let jqTableNode = $('#tableNode');
	jqTableNode.bootstrapTable({
		columns: arrColumn,
		data: arrNode,
		uniqueId: 'nodeId',
		locale: 'ja-JP',
		search: true,
		searchAlign: 'left'
	});
	if(arrNode.length > 0){
		jqTableNode.bootstrapTable('check', 0);
	}

	return {
		getChecked: function(){
			return jqTableNode.bootstrapTable('getSelections');
		}
	};
}();

let periodPicker = new ZeusPeriodPicker({
	r: {
		name: 'viewSpan',
		isCallOnChange: false,
		onchange: function(){
			periodPicker.refreshDivVisible();
			periodPicker.refreshDatepickerViewMode();
		}
	},
	periodType: 'list',
	dateinput: {
		inputs: [
			{y: 'y', m: 'm', d: 'd'}
		],
		onblur: function(){
			if(this.dateinput.isValid()){
				this.datepicker.update(this.dateinput.getMoment().toDate());
			}
		}
	},
	datepicker: {
		pickers: ['zeus-datepicker'],
		option: {
			startView: 'days',
			minViewMode: 'days',
			maxViewMode: 'years',
			todayBtn: 'linked',
			language: sessionStorage.getItem('sysLanguage'),
			autoclose: true,
			todayHighlight: true
		},
		onChangeDate: function(e){
			if(e.date != null) {
				this.dateinput.setTextDate(e.date.getFullYear(), e.date.getMonth() + 1, e.date.getDate());
			}
		}
	},
	arrow: {
		arrows: [
			{left: 'zeus-arrow-left', right: 'zeus-arrow-right'}
		],
		onClick: function(period){
			if(period.dateinput.isValid()){
				let add = this.getAttribute('data-add');
				let mo = period.dateinput.getMoment();
				mo.add(add, periodPicker.r.getCheckedValue());
				period.datepicker.update(mo.toDate());
				period.dateinput.setTextDate(mo.year(), mo.month() + 1, mo.date());
			}
		}
	}
});

let buttons = function(){
	function validateForm(){
		let isValid = periodPicker.isValidDateinput();
		let arrNode = tableNode.getChecked();
		if(isValid && arrNode.length > 0){
			return true;
		}
		return false;
	}
	function getRequestParam(){
		if(validateForm()){
			let param = {};
			param.viewSpan = periodPicker.r.getCheckedValue();
			param.y = periodPicker.arrPeriod[0].dateinput.y.value.trim();
			param.m = periodPicker.arrPeriod[0].dateinput.m.value.trim();
			param.d = periodPicker.arrPeriod[0].dateinput.d.value.trim();
			param.nodeId = tableNode.getChecked()[0].nodeId;
			return param;
		}
		return null;
	}

	let table = document.querySelector('#btn-table');
	let csv = document.querySelector('#btn-csv');

	table.onclick = function(){
		let param = getRequestParam();
		if(param != null){
			$(this).button('loading');
			arrRowMax = [];
			tableDataCompare.destroy();
			zeus.ajax({
				url: '/zeuschart/rest/reduction/compare/table.do',
				data: param,
				success: function(resp){
					let objResp = JSON.parse(resp);
					if(objResp.result == 'ok'){
						tableDataCompare.updateTable(objResp.success);
					}else{
						console.log(objResp.error.message);
						popupError.setMessage('エラーが発生しました。');
					}
					$(table).button('reset');
				},
				error: function(){
					$(table).button('reset');
					popupError.setMessage('エラーが発生しました。');
				}
			});
		}
	};

	csv.onclick = function(){
		let param = getRequestParam();
		if(param != null){
			let arrAttr = [];
			for(let key in param){
				arrAttr.push({name: key, value: param[key]});
			}
			zeus.downloadFile({
				action: '/zeuschart/reduction/compare/csv.do',
				attrList: arrAttr
			});
		}
	}
}();

let tabTotal = new TabTotal();