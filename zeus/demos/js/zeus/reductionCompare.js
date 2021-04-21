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

let tableDataCompare = function(){
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

let tableNode = function(){
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
		locale: sessionStorage.getItem(STORE_KEY.bootstrapTable.language),
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