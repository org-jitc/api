function Period(){

	var divErrPeriod = $('#periodError');
	var ys = $('[name="ys"]');
	var ms = $('[name="ms"]');
	var ds = $('[name="ds"]');
	var hs = $('[name="hs"]');
	var ye = $('[name="ye"]');
	var me = $('[name="me"]');
	var de = $('[name="de"]');
	var he = $('[name="he"]');
	var startDatePicker = $('.start-date-picker');
	var endDatePicker = $('.end-date-picker');
	// 前日翌日リンク
	var aDateArrow = $('[data-toggle="date-arrow"]');
	
	var validDateFormat = 'YYYY MM DD HH';
	var periodDatePickerOptions = {
		startView: 0,
		maxViewMode: 0,
		minViewMode: 0,
		todayBtn: 'linked',
		language: 'ja',
		autoclose: true,
		todayHighlight: true
	};
	var errmsgDateArrow = '正しい期間を選択または入力してください。';
	
	startDatePicker.on('changeDate', function(e) {
		
		if(e.date != null){
			
			ys.val(e.date.getFullYear());
			ms.val(e.date.getMonth() + 1);
			ds.val(e.date.getDate());
		}
	});

	endDatePicker.on('changeDate', function(e) {
		
		if(e.date != null){
			
			ye.val(e.date.getFullYear());
			me.val(e.date.getMonth() + 1);
			de.val(e.date.getDate());
		}
	});
	
	ys.blur(isDateValid);
	ms.blur(isDateValid);
	ds.blur(isDateValid);
	hs.change(isDateValid);
	ye.blur(isDateValid);
	me.blur(isDateValid);
	de.blur(isDateValid);
	he.change(isDateValid);
	
	aDateArrow.click(function(){
		
		divErrPeriod.empty();
		
		var item = $(this);
		var index = item.attr('data-index');
		var arrow = item.attr('data-arrow');
		
		var isSuccess = dateArrows.list[index].setMoment();
		if(isSuccess){
			
			// set datepickers
			var dp = null;
			if(arrow == 'left')
				dp = item.prev();
			else
				dp = item.prev().prev();
			dp.datepicker('setDate', dateArrows.list[index].mo.toDate());
			
			isDateValid();
		}else
			divErrPeriod.append(errmsgDateArrow);
	});
	
	function isDateValid(){
		
		divErrPeriod.empty();
		//______________
		// correct month
		if(!isNaN(ms.val())){
			
			if(ms.val() < 1)
				ms.val(1);
			else if(ms.val() > 12)
				ms.val(12);
		}
		if(!isNaN(me.val())){
			
			if(me.val() < 1)
				me.val(1);
			else if(me.val() > 12)
				me.val(12);
		}
		// correct month
		//--------------
		//_____________
		// correct day
		var tempMo;
		var lastDay;
		if(!isNaN(ys.val()) && !isNaN(ms.val()) && !isNaN(ds.val())){
			
			tempMo = moment(ys.val() + '-' + ms.val() + '-1', 'YYYY-M-D');
			lastDay = tempMo.endOf('month').date();
			
			if(ds.val() < 1)
				ds.val(1);
			else if(ds.val() > lastDay)
				ds.val(lastDay);
		}
		if(!isNaN(ye.val()) && !isNaN(me.val()) && !isNaN(de.val())){
			
			tempMo = moment(ye.val() + '-' + me.val() + '-1', 'YYYY-M-D');
			lastDay = tempMo.endOf('month').date();
			
			if(de.val() < 1)
				de.val(1);
			else if(de.val() > lastDay)
				de.val(lastDay);
		}
		// correct day
		//-------------
		
		var startDate = ys.val() + ' ' + ms.val() + ' ' + ds.val() + ' ' + hs.val();
		var endDate = ye.val() + ' ' + me.val() + ' ' + de.val() + ' ' + he.val();
		var startMoment = moment(startDate, validDateFormat);
		var endMoment = moment(endDate, validDateFormat);
		
		if(!startMoment.isValid() || !endMoment.isValid())
			divErrPeriod.append(errmsgDateArrow);
		else{
			
			if(startMoment.isAfter(endMoment))
				divErrPeriod.append(errmsgDateArrow);
			else{
				startDatePicker.datepicker('setDate', startMoment.toDate());
				endDatePicker.datepicker('setDate', endMoment.toDate());
			}
		}
	}
	
	//******************** init
	startDatePicker.datepicker(periodDatePickerOptions);
	endDatePicker.datepicker(periodDatePickerOptions);
	
	return {
		startDatePicker: startDatePicker,
		endDatePicker: endDatePicker,
		getStartDate: function(){
			return ys.val() + '-' + ms.val() + '-' + ds.val() + ' ' + hs.val();
		},
		getEndDate: function(){
			return ye.val() + '-' + me.val() + '-' + de.val() + ' ' + he.val();
		}
	}
}

function DataRepair(){
	
	var gridOptions = null;
	var columnArr = null;
	var rowDataArr = null;
	var modifiedDataArr = null;
	var oldValue = null;
	var rValue = null;
	var dataTypeValue = null;
	// 浮点数
	var reg = /^(-?\d+)(\.\d+)?$/;
	
	var dataRepairForm = $('#dataRepairForm');
	var r = $('[name="r"]');
	var dataType = $('[name="dataType"]');
	var ys = $('[name="ys"]');
	var ms = $('[name="ms"]');
	var ds = $('[name="ds"]');
	var hs = $('[name="hs"]');
	var ys = $('[name="ye"]');
	var ms = $('[name="me"]');
	var ds = $('[name="de"]');
	var he = $('[name="he"]');
	var startDate = $('[name="startDate"]');
	var endDate = $('[name="endDate"]');
	var dataContent = $('#data-content');
	var csvDataContent = $('#csv-data-content');
	var buttonsDataModified = $('.data-modified');
	var msgModal = $('#msgModal');
	var msgWhenProcessing = $('.whenProcessing');
	var msgProgress = $('.progress');
	var msgDiv = $('#msgDiv');
	var sensorIds = $('[name="sensorIds"]');
	var checkedSensorIds = $('[name="checkedSensorIds"]');
	var csvSuccessAlert = $('#csvSuccessAlert');
	var checkSensorAll = $('#check-sensor-all');
	var checkSensorIds = $('[name="sensorIds"]');
	var btnDisplay = $('#btn-display');
	var btnCSV = $('#btn-csv');
	var btnUpdate = $('#btn-update');
	var btnUpdateFromCSV = $('#btn-update-from-csv');
	var groupObj = {
		all: $('#chk-group-all'),
		obj: $('[name="chk-group"]'),
		sensors: $('#tbl-sensors'),
		init: function(){
			
			this.all.change(function(){
				
				groupObj.obj.prop('checked', this.checked);
				groupObj.obj.each(function(){
					$(this).change();
				});
			});
			
			this.obj.change(function(){
				
				//___________________________________
				// set group check all check status
				var len = groupObj.obj.length;
				var checkedLen = groupObj.obj.filter(':checked').length;
				groupObj.all.prop('checked', len == checkedLen);
				// set group check all check status
				//-----------------------------------
				
				//_______________________
				// set tr visibility
				var filtered = groupObj.sensors.find('.tr-' + this.value);
				if(this.checked)
					filtered.show();
				else
					filtered.hide();
				// set tr visibility
				//-----------------------
				
				// set sensor visibility
				checkSensorIds.change();
			});
			
			this.all.prop('checked', true);
			this.all.change();
		}
	};
	groupObj.init();
	
	var dataRepairError = $('#dataRepairError');
	var periodError = $('#periodError');
	var sensorError = $('#sensorError');
	
	var period = new Period();
	
	var reqParam = {};
	
	//-------------------- modal setting start
	function initMsgModal(operation){
		
		if(operation == 'process'){
			
			msgWhenProcessing.hide();
			msgDiv.hide();
			msgProgress.show();
		}else{
			
			msgWhenProcessing.show();
			msgDiv.show();
			msgProgress.hide();
		}
		
		msgModal.modal('show');
	}
	//-------------------- modal setting end
	
	//------------------- 粒度チェック動作　start
	r.change(function(){
		
		var item = $(this);
		if(item.val() == 'h'){
			
			if(dataType.val() == 'demand')
				dataType.val('elect');
		}
	});
	//------------------- 粒度チェック動作　end
	
	//------------------- データ種別選択動作 start
	dataType.change(function(){
		
		var item = $(this);
		if(item.val() == 'demand'){
			
			if(r.filter(':checked').val() != '30m')
				r.filter('[value="30m"]').prop('checked', true);
		}
	});
	//------------------- データ種別選択動作 end
	
	btnUpdateFromCSV.click(function(){
		updateFromCSV('csvInput', 'csvInputForm', 'csvErrorDiv');
	});
	
	//------------------- csvファイルから更新 start
	function updateFromCSV(itemId, formId, errorDivId){
		
		var errorDiv = $('#' + errorDivId);
		errorDiv.html('');
		
		var fileInput = $('#' + itemId);
		if(fileInput.val() == '')
			errorDiv.html('ファイルを選択してください。');
		else{
			
			initMsgModal('process');
			
			var formData = new FormData($('#' + formId)[0]);
			$.ajax({  
		          url: '/zeuschart/DataRepair/UpdateCSVData.do',  
		          type: 'POST',
		          async: true,
		          cache: false,
		          contentType: false,
		          data: formData,
		          processData: false,
		          success: function (response) {
		        	  
		        	  var respObj = JSON.parse(response);
		        	  if(respObj.errors != null){
		        		  
		        		  console.log(respObj.errors);
		        		  
		        		  for(var i = 0; i < respObj.errors.length; i++){
		        			  
		        			  var em = reqCsvEmTemplate.replace('{0}', respObj.errors[i].row).replace('{1}', respObj.errors[i].col);
		        			  errorDiv.append('<p>' + respObj.errors[i].fileName + ': ' + em + '<p>');
		        		  }
		        	  }else{
		        		  
		        		  csvSuccessAlert.removeClass('hide');
		        		  setTimeout(function(){
		        			  csvSuccessAlert.addClass('hide');
		        		  }, 3000);
		        	  }
		        	  
		        	  msgModal.modal('hide');
		        	  reqParam.csvTimeMili = new Date().getTime();
		          },  
		          error: function (){
		        	  
		        	  errorDiv.html(reqMsgReqNotProcessed);
		        	  msgModal.modal('hide');
		          }
		     });
		}
	}
	//------------------- csvファイルから更新 end
	
	checkSensorIds.change(function() {
		
		var visible = checkSensorIds.filter(':visible');
		if(visible.length != 0){

			if(checkSensorAll.prop('disabled'))
				checkSensorAll.prop('disabled', false);
			
			if(visible.filter(':checked').length == visible.length)
				checkSensorAll.prop('checked', true);
			else
				checkSensorAll.prop('checked', false);
		}else{
			
			checkSensorAll.prop('checked', false);
			checkSensorAll.prop('disabled', true);
		}
	});
	//------------------- 全選択/解除 start
	checkSensorAll.change(function() {
		
		var visible = checkSensorIds.filter(':visible');
		visible.prop('checked', this.checked);
	});
	//------------------- 全選択/解除 end
	
	btnDisplay.click(function(){
		getData('display');
	});
	btnCSV.click(function(){
		getData('csv');
	});
	
	//------------------- データ表示 start
	function getData(type){
		
		sensorError.empty();
		// センサーチェック検査
		onDataRepairFormSubmit();
		if(checkedSensorIds.val() == '')
			sensorError.html('センサーを選択してください。')
		
		if(dataRepairError.html().length > 0 || periodError.html().length > 0 || sensorError.html().length > 0)
			return;
		
		var isParamChanged = false;
		// 期間
		var startDate = period.getStartDate();
		var endDate = period.getEndDate();
		if(reqParam.startDate == null || reqParam.endDate == null){
			
			isParamChanged = true;
			reqParam.startDate = startDate;
			reqParam.endDate = endDate;
		}else{
			
			if(reqParam.startDate != startDate || reqParam.endDate != endDate){
				
				isParamChanged = true;
				reqParam.startDate = startDate;
				reqParam.endDate = endDate;
			}
		}
		// 粒度
		rValue = r.filter(':checked').val();
		if(reqParam.r == null){
			
			isParamChanged = true;
			reqParam.r = rValue;
		}else{
			
			if(reqParam.r != rValue){
				
				isParamChanged = true;
				reqParam.r = rValue;
			}
		}
		// データ種別
		dataTypeValue = dataType.val();
		if(reqParam.dataType == null){
			
			isParamChanged = true;
			reqParam.dataType = dataTypeValue;
		}else{
			
			if(reqParam.dataType != dataTypeValue){
				
				isParamChanged = true;
				reqParam.dataType = dataTypeValue;
			}
		}
		// チェックされたセンサーIDを設定
		if(reqParam.sensorIds == null){
			
			isParamChanged = true;
			reqParam.sensorIds = checkedSensorIds.val();
		}else{
			
			if(reqParam.sensorIds != checkedSensorIds.val()){
				
				isParamChanged = true;
				reqParam.sensorIds = checkedSensorIds.val();
			}
		}
		
		if(reqParam.csvTimeMili != null){
			
			if(reqParam.optionTimeMili == null)
				isParamChanged = true;
			else{
				
				if(reqParam.optionTimeMili < reqParam.csvTimeMili)
					isParamChanged = true;
			}
		}
		
		// 修正したデータのマップを初期化
		if(isParamChanged){
			
			reqParam.optionTimeMili = new Date().getTime();
			
			if(type == 'csv')
				btnCSV.button('loading');
			else
				btnDisplay.button('loading');
			
			modifiedDataArr = null;
			dataRepairError.empty();
			// zeuschartからデータ取得
			$.ajax({
				url: '/zeuschart/DataRepair/GetDisplayData.do',
				async: true,
				cache: false,
				data: dataRepairForm.serialize(),
				displayType: type,
				success: function(response){
					
					var respObj = JSON.parse(response);
					if(respObj.error != null){
						
						dataRepairError.html(reqMsgReqNotProcessed);
						dataContent.addClass('hide');
					}else{
						
						columnArr = respObj.columnDefs;
						rowDataArr = respObj.rowData;
						// データ表示
						if(this.displayType == 'display'){
							
							dataContent.removeClass('hide');
							if(gridOptions == null)
								gridOptions = initAgGridOptions(dataContent[0], true);
							else{
								
								gridOptions.api.setColumnDefs(respObj.columnDefs);
							    gridOptions.api.setRowData(respObj.rowData);
							}
							btnDisplay.button('reset');
						}else{// csv
							
							downloadCsv();
							btnCSV.button('reset');
						}
					}
				},
				error: function(){
					
					if(this.displayType == 'display')
						btnDisplay.button('reset');
					else
						btnCSV.button('reset');
					
					dataRepairError.html(reqMsgReqNotProcessed);
					dataContent.addClass('hide');
				}
			});
		}else{
			
			if(type == 'csv')
				downloadCsv();
			else{
				
				dataContent.removeClass('hide');
				if(gridOptions == null)
					gridOptions = initAgGridOptions(dataContent[0], true);
				else{
					
					gridOptions.api.setColumnDefs(columnArr);
				    gridOptions.api.setRowData(rowDataArr);
				}
			}
		}
	}
	
	function initAgGridOptions(container, editable){
		
		var agGridOptions;
		if(editable) {
			
			agGridOptions = {
			    columnDefs: columnArr,
			    rowData: rowDataArr,
			    enableSorting: true,
			    onCellEditingStarted: function(event){
			    	oldValue = event.value;
			    },
			    onCellEditingStopped: function(event) {
		
			    	// 値が変わった場合
			    	if(event.value != oldValue){
			    		
				    	if(!reg.test(event.value)){
				    		
				    		event.node.setDataValue(event.colDef.field, oldValue);
				    		alert('数字を入力してください。');
				    	}else{
				    		
				    		if(modifiedDataArr == null)
				    			modifiedDataArr = {};
				    		
				    		var dataMap = modifiedDataArr[event.data.dateTime];
				    		if(dataMap == null){
				    			
				    			dataMap = {}
					    		dataMap[event.colDef.field] = event.value;
				    		}else
			    				dataMap[event.colDef.field] = event.value;
				    		
				    		modifiedDataArr[event.data.dateTime] = dataMap;
				    	}
			    	}
			    }
			};
		}else {
			
			agGridOptions = {
			    columnDefs: data.columnDefs,
			    rowData: data.rowData,
			    enableSorting: true,
			    editable: false
			};
		}
		
		new agGrid.Grid(container, agGridOptions);
		
		return agGridOptions;
	}
	//------------------- データ表示 end
	
	//------------------- csv start
	function downloadCsv(){
		
		// csv
		var str = '';
		// タイトル
		if(columnArr != null){
			
			for(var i = 0; i < columnArr.length; i++){
				
				if(i == 0)
					str = columnArr[i].csvHeaderName;
				else
					str += ',' + columnArr[i].csvHeaderName;
			}
			str += "\n";
		}
		// データ
		if(rowDataArr != null){
			
			for(var i = 0; i < rowDataArr.length; i++){
	
				str += rowDataArr[i].dateTime;
				for(var j = 1; j < columnArr.length; j++)
					str += ',' + rowDataArr[i][columnArr[j].field];
				
				str += "\n";
			}
		}
		// csvデータ変換
		str = '\ufeff' + str;
	    // csvファイル名
	    var fileName = period.getStartDate() + "-" + period.getEndDate() + '.csv';
	    
	    zeus.exportCSV(str, fileName);
	}
	//------------------- csv end
	
	//------------------- 修正データの更新 start
	btnUpdate.click(function(){
		
		if(modifiedDataArr == null || JSON.stringify(modifiedDataArr) == '{}'){
		
			msgWhenProcessing.removeClass('hide');
			msgProgress.addClass('hide');
			msgDiv.addClass('error');
			msgDiv.html('変更されたデータがありません。');
			msgModal.modal('show');
		}else{
			
			msgWhenProcessing.addClass('hide');
			msgProgress.removeClass('hide');
			msgModal.modal('show');
			$.ajax({
				url: '/zeuschart/DataRepair/UpdateData.do',
				type: 'POST',
				async: true,
				cache: false,
				data: 'r=' + rValue + '&dataType=' + dataTypeValue + '&data=' + JSON.stringify(modifiedDataArr),
				success: function(response){
					
					msgWhenProcessing.removeClass('hide');
					msgProgress.addClass('hide');
					
					var respObj = JSON.parse(response);
					if(respObj.error != null){
						
						msgDiv.addClass('error');
						msgDiv.html(reqMsgReqNotProcessed);
					}else{
						
						msgDiv.removeClass('error');
						msgDiv.html('データ更新処理が終了しました。');
					}
				},
				error: function(){
					
					msgWhenProcessing.removeClass('hide');
					msgProgress.addClass('hide');
					msgDiv.addClass('error');
					msgDiv.html(reqMsgReqNotProcessed);
				}
			});
		}
	});
	//------------------- 修正データの更新 end
	
	//------------------- データ表示/CSVボタンが押された時　選択されたセンサーIdをhiddenに設定 start
	function onDataRepairFormSubmit(){
		
		var checkedIds = sensorIds.filter(':visible:checked').map(function(){
			return this.value;
		}).get().join();
		
		checkedSensorIds.val(checkedIds);
	}
	//------------------- データ表示/CSVボタンが押された時　選択されたセンサーIdをhiddenに設定 end
	
	//******************* init
	// 期間：時間
	var sm = moment([document.dataRepairFormBean.ys.value, document.dataRepairFormBean.ms.value - 1, document.dataRepairFormBean.ds.value]);
	period.startDatePicker.datepicker('setDate', sm.toDate());
	var em = moment([document.dataRepairFormBean.ye.value, document.dataRepairFormBean.me.value - 1, document.dataRepairFormBean.de.value]);;
	period.endDatePicker.datepicker('setDate', em.toDate());
	// 粒度チェック
	r.filter(':checked').change();
	// 前日翌日初期化
	dateArrows.init('data-toggle', 'date-arrow');
	//___________________ init
}
var dataRepair = new DataRepair();