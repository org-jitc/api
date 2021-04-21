let selectMode = document.querySelector('#selectMode');

let maNum = function(){
	let maNum = new FormGroup('divFormGroupMaNum');
	maNum.validate = function(){
		this.clearError();
		let val = this.inputItem.value.trim();
		if(val === ''){
			this.setError(fmt.err.validation.required);
			return false;
		}else if(isNaN(val) || val < 2){
			this.setError(util_zeus.fmt.getReplaced(fmt.err.validation.gtoe.num, [2]));
			return false;
		}
		return true;
	};
	return maNum;
}();

let period = function(){
	let period = new FormGroup('divFormGroupPeriod');
	period.validate = function(){
		this.clearError();
		let val = this.inputItem.value.trim();
		if(val === ''){
			this.setError(fmt.err.validation.required);
			return false;
		}else if(isNaN(val) || val <= 0){
			this.setError(util_zeus.fmt.getReplaced(fmt.err.validation.gtoe.num, [0]));
			return false;
		}
		return true;
	};
	return period;
}();

let corrThreshold = function(){
	let corrThreshold = new FormGroup('divFormGroupCorrThreshold');
	corrThreshold.validate = function(){
		this.clearError();
		let val = this.inputItem.value.trim();
		if(val === ''){
			this.setError(fmt.err.validation.required);
			return false;
		}else if(isNaN(val) || val <= 0 || val > 1){
			this.setError(util_zeus.fmt.getReplaced(fmt.err.validation.gt.stoe.decimal, [0, 1]));
		}
		return true;
	};
	return corrThreshold;
}();

let corrWatchingPeriod = function(){
	let corrWatchingPeriod = new FormGroup('divFormGroupCorrWatchingPeriod');
	corrWatchingPeriod.validate = function(){
		this.clearError();
		let val = this.inputItem.value.trim();
		if(val === ''){
			this.setError(fmt.err.validation.required);
			return false;
		}else if(isNaN(val) || val <= 0){
			this.setError(util_zeus.fmt.getReplaced(fmt.err.validation.gtoe.num, [0]));
			return false;
		}
		return true;
	};
	return corrWatchingPeriod;
}();

let baseLookupTime = function(){
	let baseLookupTime = new FormGroup('divFormGroupBaseLookupTime');
	baseLookupTime.validate = function(){
		this.clearError();
		let val = this.inputItem.value.trim();
		if(val === ''){
			this.setError(fmt.err.validation.required);
			return false;
		}else if(isNaN(val) || val <= 0){
			this.setError(util_zeus.fmt.getReplaced(fmt.err.validation.gtoe.num, [0]));
			return false;
		}
		return true;
	};
	return baseLookupTime;
}();

let minMaLookupTime = function(){
	let minMaLookupTime = new FormGroup('divFormGroupMinMaLookupTime');
	minMaLookupTime.validate = function(){
		this.clearError();
		let val = this.inputItem.value.trim();
		if(val === ''){
			this.setError(fmt.err.validation.required);
			return false;
		}else if(isNaN(val) || val <= 0){
			this.setError(util_zeus.fmt.getReplaced(fmt.err.validation.gtoe.num, [0]));
			return false;
		}
		return true;
	};
	return minMaLookupTime;
}();

let nodeIds = new SetNameCheckbox('nodeIds', {names: 'nodeNames'});
let btnCommit = document.querySelector('#btnCommit');
let btnDel = document.querySelector('#btnDel');
let tableArp = document.querySelector('#tableArp');
let dataArpIdForUpdate = null;
let reqParamDataArp = null;
let jqTableArp = $(tableArp);
let jqTableData = JSON.parse(reqArrArpAll);
let jqTableColumns = [{
		checkbox: true
	},{
		title: fmt.setting.id,
		field: 'arpId'
	},{
		title: fmt.setting.name,
		field: 'arpName'
	},{
		title: fmt.ma.num,
		field: 'maNum'
	},{
		title: fmt.period,
		field: 'period'
	},{
		title: fmt.corr.threshold,
		field: 'corrThreshold'
	},{
		title: fmt.corr.watching.period,
		field: 'corrWatchingPeriod'
	},{
		title: fmt.base.lookup.time,
		field: 'baseLookupTime'
	},{
		title: fmt.min.ma.lookup.time,
		field: 'minMaLookupTime'
	}
];

jqTableArp.bootstrapTable({
	columns: jqTableColumns,
	data: jqTableData,
	uniqueId: 'arpId',
	locale: zeus.getBootstrapTableLocale(sessionStorage.getItem('sysLanguage')),
	toolbar: '.divToolbarArp',
	toolbarAlign: 'right',
	search: true,
    searchAlign: 'left',
    detailView: true,
	detailFormatter: function(index, row){
		if(row.nodeNames == null){
			return '-';
		}else{
			let arrNodeName = row.nodeNames.split(',');
			let resp = '';
			arrNodeName.forEach(function(nodeName){
				resp = resp + '<div>' + nodeName + '</div>'
			});
			return resp;
		}
    },
	onDblClickRow: function(row, el, field) {
        if (selectMode.value !== 'update') {
            selectMode.value = 'update';
        }
        dataArpIdForUpdate = row.arpId;
        maNum.inputItem.value = row.maNum;
        period.inputItem.value = row.period;
        corrThreshold.inputItem.value = row.corrThreshold;
        corrWatchingPeriod.inputItem.value = row.corrWatchingPeriod;
        baseLookupTime.inputItem.value = row.baseLookupTime;
        minMaLookupTime.inputItem.value = row.minMaLookupTime;
        nodeIds.setChecked(row.nodeIds);
    }
});

btnDel.onclick = function(){
	let _this = $(this);
	_this.button('loading');
	let arrDataSelected = jqTableArp.bootstrapTable('getSelections');
	if(arrDataSelected.length == 0){
		popupMessage.setMessage(fmt.err.select.id.del);
		_this.button('reset');
	}else{
		let arrIdSelected = [];
		arrDataSelected.forEach(function(data){
			arrIdSelected.push(data.arpId);
		});
		deleteArp(arrIdSelected);
	}
};

btnCommit.onclick = function(){
	if(validateAll()){
		$(btnCommit).button('loading');
		reqParamDataArp = {
			maNum: maNum.inputItem.value.trim(),
			period: period.inputItem.value.trim(),
			corrThreshold: corrThreshold.inputItem.value.trim(),
			corrWatchingPeriod: corrWatchingPeriod.inputItem.value.trim(),
			baseLookupTime: baseLookupTime.inputItem.value.trim(),
			minMaLookupTime: minMaLookupTime.inputItem.value.trim(),
			nodeIds: nodeIds.getCheckedIds()
		};
		reqParamDataArp.arpName = [
			reqParamDataArp.maNum,
			reqParamDataArp.period,
			reqParamDataArp.corrThreshold,
			reqParamDataArp.corrWatchingPeriod,
			reqParamDataArp.baseLookupTime,
			reqParamDataArp.minMaLookupTime
		].join('_');
		
		if(selectMode.value === 'new'){
			insertArp();
		}else{
			reqParamDataArp.arpId = dataArpIdForUpdate;
			updateArp();
		}
	}
};

function deleteArp(arrArpIds){
	$.ajax({
		url: contextPath + 'Rest/ReductionCalculateSetting/Delete.action',
		async: true,
		cache: false,
		type: 'POST',
		data: {
			arpIds: arrArpIds.join()
		},
		success: function(resp){
			let respObj = JSON.parse(resp);
			if(respObj.result === 'ng'){
				console.error(respObj.error.message);
				popupMessage.setMessage(fmt.err.occurred);
			}else{
				jqTableArp.bootstrapTable('remove', {
					field: 'arpId',
					values: arrArpIds
				});
				popupMessage.setMessage(fmt.msg.complete.del);
			}
			$(btnDel).button('reset');
		},
		error: function(){
			popupError.setMessage(fmt.err.occurred);
			$(btnDel).button('reset');
		}
	});
}

function isParamUnique(){
	let arpId = getArpIdByParameters();
	let isUnique = arpId == null || (selectMode.value == 'update' && arpId == dataArpIdForUpdate);
	if(!isUnique){
		popupError.setMessage(fmt.err.exist);
	}
	return isUnique;
}

function getArpIdByParameters(){
	let arrData = jqTableArp.bootstrapTable('getData', {
		useCurrentPage: true
	});
	let arrFiltered = arrData.filter(function(rowData){
		return rowData.maNum == maNum.inputItem.value.trim()
			&& rowData.period == period.inputItem.value.trim()
			&& rowData.corrThreshold == corrThreshold.inputItem.value.trim()
			&& rowData.corrWatchingPeriod == corrWatchingPeriod.inputItem.value.trim()
			&& rowData.baseLookupTime == baseLookupTime.inputItem.value.trim()
			&& rowData.minMaLookupTime == minMaLookupTime.inputItem.value.trim();
	});
	if(arrFiltered.length > 0) return arrFiltered[0].arpId;
	return null;
}

function validateAll(){
	let isValid = true;
	if(selectMode.value == 'update'){
		isValid = isArpChanged();
	}
	if(isValid){
		isValid = maNum.validate(); 
		isValid = period.validate() && isValid;
		isValid = corrThreshold.validate() && isValid;
		isValid = corrWatchingPeriod.validate() && isValid;
		isValid = baseLookupTime.validate() && isValid;
		isValid = minMaLookupTime.validate() && isValid;
		if(isValid){
			isValid = isParamUnique() && isValid;
		}
	}
	return isValid;
}

function isArpChanged(){
	let rowData = jqTableArp.bootstrapTable('getRowByUniqueId', dataArpIdForUpdate);
	let isChanged = rowData.maNum != maNum.inputItem.value.trim()
		|| rowData.period != period.inputItem.value.trim()
		|| rowData.corrThreshold != corrThreshold.inputItem.value.trim()
		|| rowData.corrWatchingPeriod != corrWatchingPeriod.inputItem.value.trim()
		|| rowData.baseLookupTime != baseLookupTime.inputItem.value.trim()
		|| rowData.minMaLookupTime != minMaLookupTime.inputItem.value.trim()
		|| rowData.nodeIds != nodeIds.getCheckedIds();
	if(!isChanged){
		popupError.setMessage(fmt.err.notChanged);
	}
	return isChanged;
}

function insertArp(){
	$.ajax({
		url: contextPath + 'Rest/ReductionCalculateSetting/Insert.action',
		async: true,
		cache: false,
		type: 'POST',
		data: reqParamDataArp,
		success: function(resp){
			let respObj = JSON.parse(resp);
			if(respObj.result === 'ok'){
				reqParamDataArp.nodeNames = nodeIds.getCheckedNames();
				reqParamDataArp.arpId = respObj.arpId;
				jqTableArp.bootstrapTable('insertRow', {
					index: 0,
					row: reqParamDataArp
				});
				popupMessage.setMessage(fmt.msg.complete.insert);
			}
			$(btnCommit).button('reset');
		},
		error: function(){
			popupError.setMessage(fmt.err.occurred);
			$(btnCommit).button('reset');
		}
	});
}

function updateArp(){
	$.ajax({
		url: contextPath + 'Rest/ReductionCalculateSetting/Update.action',
		async: true,
		cache: false,
		type: 'POST',
		data: reqParamDataArp,
		success: function(resp){
			let respObj = JSON.parse(resp);
			if(respObj.result === 'ok'){
				reqParamDataArp.nodeNames = nodeIds.getCheckedNames();
				jqTableArp.bootstrapTable('updateByUniqueId', {
					id: reqParamDataArp.arpId,
					row: reqParamDataArp
				});
				popupMessage.setMessage(fmt.msg.complete.update);
			}
			$(btnCommit).button('reset');
		},
		error: function(){
			popupError.setMessage(fmt.err.occurred);
			$(btnCommit).button('reset');
		}
	});
}