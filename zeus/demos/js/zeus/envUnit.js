var tableEnvUnit = $("#table-envUnit");
var modalEnvUnit = $('#modal-env-unit');
var updateDataObj;

function EnvUnitModal(){
	var _this = this;
	this.textUnitId = $('#text-unitId');
	this.textUnitName = $('#text-unitName');
	this.textUnit = $('#text-unit');
	this.selectIsAny = $('#select-isAny');
	this.textOverallUp = $('#text-overallUp');
	this.textOverallDown = $('#text-overallDown');
	this.selectZmo = $('#select-zmo');
	this.textZmu = $('#text-zmu');
	this.textZmd = $('#text-zmd');
	this.textZou = $('#text-zou');
	this.textZod = $('#text-zod');
	this.trZmoMagnification = $('.zmo-magnification');
	this.trZmoOffset = $('.zmo-offset');
	var btnModalConfirm = $('#btn-modal-confirm');
	
	// init env unit modal select change event
	this.selectZmo.change(function(){
		
		_this.trZmoMagnification.hide();
		_this.trZmoOffset.hide();
		if(this.value == 'magnification'){
			
			_this.trZmoMagnification.show();
			_this.textZou.val('');
			_this.textZod.val('');
		}else{
			
			_this.trZmoOffset.show();
			_this.textZmu.val('');
			_this.textZmd.val('');
		}
	});
	
	btnModalConfirm.click(function(){
		var isValid = true;
		var dataValue;
		var helpBlock;
		var formGroupDiv;
		// unitId
		dataValue = $.trim(_this.textUnitId.val());
		helpBlock = _this.textUnitId.next();
		formGroupDiv = _this.textUnitId.parent();
		if(dataValue == ''){
			isValid = false;
			helpBlock.html('必須です。');
		}else{
			
			if($('[data-pk="' + dataValue + '"]').length > 0){
				isValid = false;
				helpBlock.html('既に存在している指数IDです。');
			}
		}
		setValidateStatus(isValid, formGroupDiv, helpBlock);
		// unitName
		isValid = true;
		dataValue = $.trim(_this.textUnitName.val());
		helpBlock = _this.textUnitName.next();
		formGroupDiv = _this.textUnitName.parent();
       	if(dataValue == ''){
       		
       		isValid = false;
       		helpBlock.html('必須です。');
       	}else if($('[data-name="unitName"][data-value="' + dataValue + '"]').length > 0){
			
       		isValid = false;
       		helpBlock.html('既に存在している指数名称です。');
       	}
       	setValidateStatus(isValid, formGroupDiv, helpBlock);
       	// overallUp
       	isValid = true;
		dataValue = $.trim(_this.textOverallUp.val());
		helpBlock = _this.textOverallUp.next();
		formGroupDiv = _this.textOverallUp.parent();
		
		if(dataValue == ''){
			isValid = false;
       		helpBlock.html('必須です。');
		}else{
			
			if(isNaN(dataValue)){
				isValid = false;
				helpBlock.html('数字を入力してください。');
			}
		}
		setValidateStatus(isValid, formGroupDiv, helpBlock);
		// overallDown
		isValid = true;
		dataValue = $.trim(_this.textOverallDown.val());
		helpBlock = _this.textOverallDown.next();
		formGroupDiv = _this.textOverallDown.parent();
		
		if(dataValue == ''){
			isValid = false;
       		helpBlock.html('必須です。');
		}else{
			
			if(isNaN(dataValue)){
				isValid = false;
				helpBlock.html('数字を入力してください。');
			}
		}
		setValidateStatus(isValid, formGroupDiv, helpBlock);
		
		if(_this.selectZmo.val() == 'magnification'){
			// zoomMagnificationUp
			isValid = true;
			dataValue = $.trim(_this.textZmu.val());
			helpBlock = _this.textZmu.next();
			formGroupDiv = _this.textZmu.parent();
			
			if(dataValue == ''){
				isValid = false;
	       		helpBlock.html('必須です。');
			}else{
				
				if(isNaN(dataValue)){
					isValid = false;
					helpBlock.html('数字を入力してください。');
				}
			}
			setValidateStatus(isValid, formGroupDiv, helpBlock);
			// zoomMagnificationDown
			isValid = true;
			dataValue = $.trim(_this.textZmd.val());
			helpBlock = _this.textZmd.next();
			formGroupDiv = _this.textZmd.parent();
			
			if(dataValue == ''){
				isValid = false;
	       		helpBlock.html('必須です。');
			}else{
				
				if(isNaN(dataValue)){
					isValid = false;
					helpBlock.html('数字を入力してください。');
				}
			}
			setValidateStatus(isValid, formGroupDiv, helpBlock);
		}else{
			// zoomOffsetUp
			isValid = true;
			dataValue = $.trim(_this.textZou.val());
			helpBlock = _this.textZou.next();
			formGroupDiv = _this.textZou.parent();
			
			if(dataValue == ''){
				isValid = false;
	       		helpBlock.html('必須です。');
			}else{
				
				if(isNaN(dataValue)){
					isValid = false;
					helpBlock.html('数字を入力してください。');
				}
			}
			setValidateStatus(isValid, formGroupDiv, helpBlock);
			// zoomOffsetDown
			isValid = true;
			dataValue = $.trim(_this.textZod.val());
			helpBlock = _this.textZod.next();
			formGroupDiv = _this.textZod.parent();
			
			if(dataValue == ''){
				isValid = false;
	       		helpBlock.html('必須です。');
			}else{
				
				if(isNaN(dataValue)){
					isValid = false;
					helpBlock.html('数字を入力してください。');
				}
			}
			setValidateStatus(isValid, formGroupDiv, helpBlock);
		}
		
		if($('.has-error').length == 0){
			var unitId = $.trim(_this.textUnitId.val());
			var data = {
				unitId: unitId, 
				unitName: $.trim(_this.textUnitName.val()), 
				unit: $.trim(_this.textUnit.val()), 
				isAny: _this.selectIsAny.val(), 
				overallUp: $.trim(_this.textOverallUp.val()), 
				overallDown: $.trim(_this.textOverallDown.val()), 
				zoomMagnificationOffset: _this.selectZmo.val(), 
				zoomMagnificationUp: $.trim(_this.textZmu.val()),
				zoomMagnificationDown: $.trim(_this.textZmd.val()),
				zoomOffsetUp: $.trim(_this.textZou.val()),
				zoomOffsetDown: $.trim(_this.textZod.val())
			}; //define a new row data，certainly it's empty
			
			var copiedData = $.extend({}, data);
			
			if(copiedData.zoomMagnificationOffset == 'magnification'){
				delete copiedData.zoomOffsetUp;
				delete copiedData.zoomOffsetDown;
			}else{
				delete copiedData.zoomMagnificationUp;
				delete copiedData.zoomMagnificationDown;
			}
			tableEnvUnit.bootstrapTable('append', data);
			
			//***** updateDataObj.insert
    		updateDataObj.insert[unitId] = copiedData;
    		updateDataObj.insertCount++;
	    	//_____ updateDataObj.insert
	    	
    		modalEnvUnit.modal('hide');
		}
	});
	
	function setValidateStatus(isValid, formGroupDiv, helpBlock){
		
		if(isValid){
			formGroupDiv.removeClass('has-error');
			helpBlock.addClass('hide');
		}else{
			formGroupDiv.addClass('has-error');
			helpBlock.removeClass('hide');
		}
	}
	
	this.init = function(){
		_this.textUnitId.val('');
		_this.textUnitName.val('');
		_this.textUnit.val('');
		_this.selectIsAny.val('1');
		_this.textOverallUp.val('');
		_this.textOverallDown.val('');
		_this.selectZmo.val('magnification');
		_this.textZmu.val('');
		_this.textZmd.val('');
		_this.textZou.val('');
		_this.textZod.val('');
		
		// init show/hide for zoom magnification offset
		_this.selectZmo.change();
	}
}

(function EnvUnit(){
	var originItem = {te: '', hu: '', di: '', il: '', co2: '', fr: '', pr: '', ch: '', cell_voltage: ''};
	var strReservation = '予約';
	var strAny = '任意';
	var strEmpty = '-';
	var strItemUnitId = '指数ID';
	var strItemUnitName = '指数名称';
	var strItemOverallUp = '全体上限';
	var strItemOverallDown = '全体下限';
	var strItemZMU = '加算分掛率[%]';
	var strItemZMD = '減算分掛率[%]';
	var strItemZOU = '加算値';
	var strItemZOD = '減算値';
	var strItemsComma = '、';
	var strValidateRequired = '指数#unitId#の#items#は必須です。'
	
	var btnSave = $('#btn-save');
	var divError = $('#div-error');
	
	var eum = new EnvUnitModal();
	
	function initUpdateDataObj(){
		updateDataObj = {};
		updateDataObj.insert = {};
		updateDataObj.insertCount = 0;
		updateDataObj.update = {};
		updateDataObj.updateCount = 0;
		updateDataObj.deleteIds = null;
		updateDataObj.deleteCount = 0;
	}
	
	function requiredNumberValidator(v){
		var trimValue = v.trim();
		
       	if(trimValue == '')
    		return '必須です。';
       	else{
       		
       		if(isNaN(trimValue)){
       			return '数字を入力してください。';
       		}
       	}
	}
	
	function numberValidator(v){
		var trimValue = v.trim();
		
       	if(trimValue != '' && isNaN(trimValue)){
       		return '数字を入力してください。';
       	}
	}
	
	tableEnvUnit.bootstrapTable({
	    toolbar: "#toolbar",
	    idField: 'unitId',
	    pagination: false,
	    showRefresh: false,
	    search: false,
	    clickToSelect: false,
	    showColumns: true,
	    columns: [
			{
				checkbox: true,
		        formatter: function(value, row, index){
		        	
		        	if(originItem[row.unitId] != null)
		        		return {checked: false, disabled: true};
		        }
			},
	    	{
		        field: "unitId",
		        title: strItemUnitId,
		        class: 'w100'
		    },{
		    	field: 'unitName',
		    	title: '指数名称',
		    	class: 'w80',
		    	editable: {
		        	type: 'text',
		        	emptytext: strEmpty,
		        	validate:  function (v) {
		        		
		        		var trimValue = $.trim(v);
                       	if(trimValue == '')
                    	   	return '必須です。';
                       	else if($('[data-name="unitName"][data-value="' + trimValue + '"]').length > 0)
                       		return '既に存在する指数名称です。';
                    }
		        }
		    },{
		    	field: 'unit',
		    	title: '単位',
		    	class: 'w40',
		    	editable: {
		        	type: 'text',
		        	emptytext: strEmpty,
		        }
		    },{
		    	field: 'isAny',
		    	title: '種類',
		    	class: 'w60',
		    	editable: {
		    		type: 'select',
		    		source: [{ value: 0, text: strReservation }, { value: 1, text: strAny }],
		    		noeditFormatter: function(value, row, index){
						
			    		if(originItem[row.unitId] != null){
			    			
				    		if(value == 0)
				    			return strReservation;
				    		else
				    			return strAny;
			    		}else
			    			return false;
			    	}
		    	}
		    },{
		    	field: 'overallUp',
		    	title: strItemOverallUp,
		    	class: 'w80',
		    	editable: {
		        	type: 'text',
		        	emptytext: strEmpty,
		        	validate: requiredNumberValidator
		        }
		    },{
		    	field: 'overallDown',
		    	title: strItemOverallDown,
		    	class: 'w80',
		    	editable: {
		        	type: 'text',
		        	emptytext: strEmpty,
		        	validate: requiredNumberValidator
		        }
		    },{
		    	field: 'zoomMagnificationOffset',
		    	title: '掛率/オフセット',
		    	class: 'w80',
		    	editable: {
	                type: 'select',
	                source: [{ value: 'magnification', text: '掛率' }, { value: 'offset', text: 'オフセット' }]
	            }
		    },{
		    	field: 'zoomMagnificationUp',
		    	title: strItemZMU,
		    	class: 'w40',
		    	editable: {
		        	type: 'text',
		        	emptytext: strEmpty,
		        	validate: numberValidator
		        }
		    },{
		    	field: 'zoomMagnificationDown',
		    	title: strItemZMD,
		    	class: 'w40',
		    	editable: {
		        	type: 'text',
		        	emptytext: strEmpty,
		        	validate: numberValidator
		        }
		    },{
		    	field: 'zoomOffsetUp',
		    	title: strItemZOU,
		    	class: 'w80',
		    	editable: {
		        	type: 'text',
		        	emptytext: strEmpty,
		        	validate: numberValidator
		        }
		    },{
		    	field: 'zoomOffsetDown',
		    	title: strItemZOD,
		    	class: 'w80',
		    	editable: {
		        	type: 'text',
		        	emptytext: strEmpty,
		        	validate: numberValidator
		        }
		    }
		],
	    onEditableSave: function (field, row, oldValue, $el) {
	    	
	    	var updateData = null;
	    	if(updateDataObj.insert[row.unitId] != null)
	    		updateData = updateDataObj.insert[row.unitId];
	    	else
	    		updateData = updateDataObj.update[row.unitId];
	    	
	    	if(updateData == null){
	    		
	    		updateData = {};
	    		updateData.unitId = row.unitId;
	    		
	    		if(updateDataObj.insert[row.unitId] == null)
    				updateDataObj.updateCount++;
	    	}
	    	updateData[field] = row[field];
	    	
	    	if(field == 'zoomMagnificationOffset'){
	    		
		    	if(row[field] == 'magnification'){
		    		
		    		$('[data-pk="' + row.unitId + '"][data-name="zoomOffsetUp"]').editable('setValue', '', false);
		    		$('[data-pk="' + row.unitId + '"][data-name="zoomOffsetDown"]').editable('setValue', '', false);
		    		updateData.zoomOffsetUp = '';
		    		updateData.zoomOffsetDown = '';
		    	}else{
		    		
		    		$('[data-pk="' + row.unitId + '"][data-name="zoomMagnificationUp"]').editable('setValue', '', false);
		    		$('[data-pk="' + row.unitId + '"][data-name="zoomMagnificationDown"]').editable('setValue', '', false);
		    		updateData.zoomMagnificationUp = '';
		    		updateData.zoomMagnificationDown = '';
		    	}
	    	}
	    	
    		// 新規したものでない
    		if(updateDataObj.insert[row.unitId] != null)
    			updateDataObj.insert[row.unitId] = updateData;
    		else
    			updateDataObj.update[row.unitId] = updateData;
	    }
	});
	
	$('#btn-add').click(function(){
		
		// init modal items
		eum.init();
		// show modal
		modalEnvUnit.modal('show');
	});
	
	$('#btn-delete').click(function(){

		// set error div empty
		divError.empty();
		
	    var ids = $.map(tableEnvUnit.bootstrapTable('getSelections'), function (row) {
	        return row.unitId;
	    });
	    if(ids.length > 0){
	    	
		    tableEnvUnit.bootstrapTable('remove', {
		        field: 'unitId',
		        values: ids
		    });
		    
	    	for(var i = 0, l = ids.length; i < l; i++){
	    		
	    		if(updateDataObj.deleteIds == null)
	    			updateDataObj.deleteIds = '';
	    		
	    		if(ids[i] != ''){
	    			
	    			if(updateDataObj.insert[ids[i]] == null){
	    				
	    				if(updateDataObj.deleteIds.indexOf(ids[i]) < 0){
	    					
			    			if(updateDataObj.deleteIds != '')
			    				updateDataObj.deleteIds += ',';
			    			updateDataObj.deleteIds += ids[i];
			    			updateDataObj.deleteCount++;
	    				}
	    			}else{
	    				
	    				if(updateDataObj.deleteIds.indexOf(',' + ids[i]) >= 0)
	    					updateDataObj.deleteIds = updateDataObj.deleteIds.replace(',' + ids[i], '');
	    				else
	    					updateDataObj.deleteIds = updateDataObj.deleteIds.replace(ids[i], '');
	    				
	    				delete updateDataObj.insert[ids[i]];
	    				updateDataObj.insertCount--;
	    			}
	    		}
	    	}
	    	
	    	if(updateDataObj.deleteIds == '')
	    		updateDataObj.deleteIds = null;
	    }else
	    	divError.append('削除したい指数を選択してください。');
	});
	
	btnSave.click(function(){
		
		// set error div empty
		divError.empty();
		if(updateDataObj.insertCount == updateDataObj.updateCount && updateDataObj.insertCount == updateDataObj.deleteCount && updateDataObj.insertCount == 0)
			divError.append('変更されていません。');
		else{

			var updateData = null;
			var items = null;
			var errMsg = '';
			if(updateDataObj.insertCount > 0){
				
				for(var key in updateDataObj.insert){
					
					updateData = updateDataObj.insert[key];
					items = '';
					// 指数名称
					if(updateData.unitName == null)
						items = strItemUnitName;
					// 全体上限
					if(updateData.overallUp == null){
						
						if(items != '')
							items += strItemsComma;
						items += strItemOverallUp;
					}
					// 全体下限
					if(updateData.overallDown == null){
						
						if(items != '')
							items += strItemsComma;
						items += strItemOverallDown;
					}
					if(updateData.zoomMagnificationOffset == 'magnification'){
						
						// 加算分掛率[%]
						if(updateData.zoomMagnificationUp == null){
							
							if(items != '')
								items += strItemsComma;
							items += strItemZMU;
						}
						// 減算分掛率[%]
						if(updateData.zoomMagnificationDown == null){
							
							if(items != '')
								items += strItemsComma;
							items += strItemZMD;
						}
					}else{
						
						// 加算値
						if(updateData.zoomOffsetUp == null){
							
							if(items != '')
								items += strItemsComma;
							items += strItemZOU;
						}
						// 減算値
						if(updateData.zoomOffsetDown == null){
							
							if(items != '')
								items += strItemsComma;
							items += strItemZOD;
						}
					}
					
					if(items != ''){
						
						divError.append('<div>');
						divError.append(strValidateRequired.replace('#unitId#', updateData.unitId).replace('#items#', items));
						divError.append('</div>');
					}
				}
			}
		}
		
		// エラーがなかったら
		if(divError.html() == ''){
			
			$.ajax({
				url: contextPath + 'Ajax/EnvUnit/Save.action',
				type: 'POST',
				cache: false,
				async: true,
				data: {data: JSON.stringify(updateDataObj)},
				success: function(response){
					
					alert('変更されました。');
					initUpdateDataObj();
					$.ajax({
						url: '/zeuschart/ResetGraphAxisRange.do',
						type: 'POST',
						cache: false,
						async: true,
						success: function(){
							console.log('reset graph axis range success!');
						},
						error: function(){
							console.log('reset graph axis range failed!');
						}
					});
				},
				error: function(){
					alert('変更できませんでした。');
				}
			});
		}
	});
	
	initUpdateDataObj();
})();