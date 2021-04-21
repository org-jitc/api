let tableDataHistory = function(){
	let tableConfig = {
		striped: false,
		height: 400,
		locale: sessionStorage.getItem(STORE_KEY.bootstrapTable.language),
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
	let jqTable = $('#tableDataHistory');

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

let tableNode = function(){
	let arrColumn = [
		{
			checkbox: true
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
		locale: sessionStorage.getItem(STORE_KEY.bootstrapTable.language),
		search: true,
		searchAlign: 'left'
	});
	if(arrNode.length > 0){
		jqTableNode.bootstrapTable('checkAll');
	}

	return {
		getCheckedNodeIds: function(){
			let arrRow = jqTableNode.bootstrapTable('getSelections');
			let arrNodeId = [];
			for(let row of arrRow){
				arrNodeId.push(row.nodeId);
			}
			return arrNodeId;
		},
		validCheck: function(){
			let arrNodeId = this.getCheckedNodeIds();
			if(arrNodeId.length > 0){
				return true;
			}else{
				popupError.setMessage(util_zeus.fmt.getReplaced(fmt.err.required.check, [fmt.node._]));
				return false;
			}
		}
	};
}();

let periodPicker = new ZeusPeriodPicker({
	r: {
		name: 'viewSpan',
		onchange: function(){
			periodPicker.refreshDivVisible('period');
			periodPicker.refreshDatepickerViewMode('period');
		},
		isCallOnChange: false
	},
	periodType: 'period',
	dateinput: {
		inputs: [
			{y: 'ys', m: 'ms', d: 'ds', h: 'hs'},
			{y: 'ye', m: 'me', d: 'de', h: 'he'}
		],
		onblur: function(){
			if(this.dateinput.isValid()){
				this.datepicker.update(this.dateinput.getDate());
			}
		}
	},
	datepicker: {
		pickers: ['datepicker-s', 'datepicker-e'],
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
			{left: 'arrow-left-s', right: 'arrow-right-s'},
			{left: 'arrow-left-e', right: 'arrow-right-e'}
		],
		onClick: function(period){
			if(period.dateinput.isValid()){
				let add = this.getAttribute('data-add');
				let mo = period.dateinput.getMoment();
				mo.add(add, periodPicker.getMomentAddField());
				period.datepicker.update(mo.toDate());
				period.dateinput.setTextDate(mo.year(), mo.month() + 1, mo.date());
			}
		}
	}
});
periodPicker.r.checkedElement().onchange();

let buttons = function(){
	function validateForm(){
		// check input value
		let isValid = periodPicker.isValidDateinput();
		// check period relation
		if(isValid){
			let viewSpan = periodPicker.r.getCheckedValue();
			let periodType = periodPicker.periodType;
			let moFrom = periodPicker.arrPeriod[0].dateinput.getMomentByViewSpanAndPeriodType(viewSpan, periodType);
			let moTo = periodPicker.arrPeriod[1].dateinput.getMomentByViewSpanAndPeriodType(viewSpan, periodType);
			if(moFrom.isAfter(moTo)){
				isValid = false;
				popupError.setMessage('期間が不正です。');
			}else{
				isValid = true;
			}
		}
		isValid = isValid && tableNode.validCheck();
		return isValid;
	}
	function getRequestParam(){
		if(validateForm()){
			let param = {};
			param.viewSpan = periodPicker.r.getCheckedValue();
			param.ys = periodPicker.arrPeriod[0].dateinput.y.value.trim();
			param.ms = periodPicker.arrPeriod[0].dateinput.m.value.trim();
			param.ds = periodPicker.arrPeriod[0].dateinput.d.value.trim();
			param.hs = periodPicker.arrPeriod[0].dateinput.h.value;
			param.ye = periodPicker.arrPeriod[1].dateinput.y.value.trim();
			param.me = periodPicker.arrPeriod[1].dateinput.m.value.trim();
			param.de = periodPicker.arrPeriod[1].dateinput.d.value.trim();
			param.he = periodPicker.arrPeriod[1].dateinput.h.value;
			param.nodeIds = tableNode.getCheckedNodeIds().join(',');
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
			tableDataHistory.destroy();
			zeus.ajax({
				url: '/zeuschart/rest/demand/control/history/table.do',
				data: param,
				success: function(resp){
					let objResp = JSON.parse(resp);
					if(objResp.result == 'ok'){
						tableDataHistory.updateTable(objResp.success);
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
				action: '/zeuschart/demand/control/history/csv.do',
				attrList: arrAttr
			});
		}
	}

	table.onclick();
}();