function History(){
	
	//_____________
	// デマンド個別計測タブ
	var navLinkHistoryObj = {
		obj: $('.nav-link-history'),
		init: function(){
			
			this.obj.on('show.bs.tab', function (e) {
				
				var item = $(this);
				var type = item.attr('data-type');
				if(type == 'demand')
					divOptionEnergy.addClass('d-none');
				else
					divOptionEnergy.removeClass('d-none');
			});
			this.obj.on('shown.bs.tab', function (e) {
				groupSensorObj.set();
			});
		},
		showDefault: function(){
			$(this.obj[0]).tab('show');
		},
		val: function(){
			return this.obj.filter('.active').attr('data-type');
		}
	};
	navLinkHistoryObj.init();
	// デマンド個別計測タブ
	//-------------
	//________
	// 表示スパン
	var displaySpanObj = {
		obj: $('[name="displaySpan"]'),
		init: function(){
			
			this.obj.change(function(){
				
				divDatepickerObj.setViewMode(this.value);
				
				if(this.value == 'days'){
					
					var eo = rdoEnergyOptionObj.val();
					if(eo == 'crudeOil' || eo == 'co2')
						rdoEnergyOptionObj.set('elect');
				}
			});
		},
		val: function(){
			
			var displaySpan = this.obj.filter(':checked').val();
			if(displaySpan == 'years')
				return 'y';
			else if(displaySpan == 'months')
				return 'm';
			else if(displaySpan == 'days')
				return 'd';
			
			return null;
		},
		set: function(value){
			var item = this.obj.filter('[value="' + value + '"]');
			item.parent().button('toggle');
		}
	};
	displaySpanObj.init();
	// 表示スパン
	//--------
	//_____
	// 日付
	var divDatepickerObj = {
		obj: $('#div-datepicker'),
		option: {
			 showToday: true,
			 locale: moment.locale(),
			 format: 'YYYY-MM-DD',
			 icons: {
				 today: 'far fa-calendar-check'
			 },
			 buttons: {
				 showToday: true
			 },
			 ignoreReadonly: true,
			 tooltips: {
	             close: '閉じる',
	             selectMonth: '月を選択',
	             prevMonth: '前月',
	             nextMonth: '次月',
	             selectYear: '年を選択',
	             prevYear: '前年',
	             nextYear: '次年',
	             selectTime: '時間を選択',
	             selectDate: '日付を選択',
	             prevDecade: '前期間',
	             nextDecade: '次期間',
	             selectDecade: '期間を選択',
	             prevCentury: '前世紀',
	             nextCentury: '次世紀'
	         }        
		},
		setDefault: function(){
			
			this.obj.datetimepicker(this.option);
		    this.obj.datetimepicker('date', moment());
		},
		setViewMode: function(mode){
			
			var format = 'YYYY-MM-DD';
			if(mode == 'months')
				format = 'YYYY-MM';
			else if(mode == 'years')
				format = 'YYYY';
			
			this.obj.datetimepicker('format', format);
			this.obj.datetimepicker('viewMode', mode);
		}
	};
	// 日付
	//-----
	//_________
	// データタイプ
	var rdoDataTypeObj = {
		obj: $('[name="dataType"]'),
		init: function(){
			
			this.obj.change(function(){
				
				if(this.value == 'graph'){
					
					divHistoryBoard.append(divGHistory);
					divHidden.append(divDataHistory);
					
					myChart.resize();
				}else{
					
					divHistoryBoard.append(divDataHistory);
					divHidden.append(divGHistory);
				}
			});
		},
		changeDefault: function(){
			this.obj.filter('[value="graph"]').change();
		},
		val: function(){
			return this.obj.filter(':checked').val();
		}
	};
	rdoDataTypeObj.init();
	// データタイプ
	//---------
	// 削減量表示
	var rdoReduceDisplay = $('[name="reduceDisplay"]');
	// エネルギー
	var rdoEnergyOptionObj = {
		obj: $('[data-name="energyOption"]'),
		init: function(){
			
			this.obj.click(function(){

				var item = $(this);
				if(!item.hasClass(activeClass)){
					
					rdoEnergyOptionObj.obj.removeClass(activeClass);
					rdoEnergyOptionObj.obj.addClass(nonActiveClass);
					
					item.removeClass(nonActiveClass);
					item.addClass(activeClass);
					
					var value = item.attr('data-value');
					if(value == 'crudeOil' || value == 'co2'){
						
						if(displaySpanObj.val() == 'd')
							displaySpanObj.set('years');
					}
				}else{
					
					item.removeClass(activeClass);
					item.addClass(nonActiveClass);
				}
				
				groupSensorObj.set();
			});
		},
		val: function(){
			return this.obj.filter('.' + activeClass).attr('data-value');
		},
		set: function(value){
			
			var item = this.obj.filter('[data-value="' + value + '"]');
			item.click();
		}
	};
	rdoEnergyOptionObj.init();
	// 環境
	var rdoEnvOptionObj = {
		obj: $('[data-name="envOption"]'),
		init: function(){
			
			this.obj.click(function(){
				
				var item = $(this);
				if(item.hasClass(activeClass)){
					
					item.removeClass(activeClass);
					item.addClass(nonActiveClass)
				}else{
					
					item.removeClass(nonActiveClass)
					item.addClass(activeClass);
				}
				
				groupSensorObj.set();
			});
		}
	};
	rdoEnvOptionObj.init();
	// グループ
	var groupOptionObj = {
		obj: $('[data-name="groupOption"]'),
		init: function(){
			
			this.obj.click(function(){
				
				var item = $(this);
				
				if(item.hasClass(activeClass)){
					
					item.removeClass(activeClass);
					item.addClass(nonActiveClass);
				}else{
					
					item.removeClass(nonActiveClass);
					item.addClass(activeClass);
				}
				
				groupOptionObj.setByGroup(item.attr('data-value'));
			});
		},
		setByGroup: function(groupId){
			
			var item = groupOptionObj.obj.filter('[data-value="' + groupId + '"]');
			item.show();
			item.parent().parent().show();
			
			var filteredSensors = sensorsObj.obj.filter('[data-groupId="' + groupId + '"]');
			filteredSensors.hide();
			
			// set energy
			var marks_energy = sensorsObj.getEnergyMarks();
			// historyType
			var historyType = navLinkHistoryObj.val();
			if(historyType == 'demand' || (historyType == 'energy' && marks_energy.length > 1)){
				
				var energyFiltered;
				for(var i = 0, l = marks_energy.length; i < l; i++)
					energyFiltered = filteredSensors.filter('.' + marks_energy[i]);
				
				if(item.hasClass(activeClass)){
					
					energyFiltered.show();
					energyFiltered.removeClass(nonActiveClass);
					energyFiltered.addClass(activeClass);
				}
			}

			// env
			var marks_env = sensorsObj.getEnvMarks();
			if(marks_env.length > 0){
				
				var marks = '.' + marks_env.join(',.');
				var envFiltered = filteredSensors.filter(marks);
				// show sensor
				if(item.hasClass(activeClass)){
					
					envFiltered.show();
					envFiltered.removeClass(nonActiveClass);
					envFiltered.addClass(activeClass);
				}
			}
		},
		hasGroup: function(){
			return this.obj.length > 0;
		},
		hideGroups: function(){
			
			this.obj.hide();
			this.obj.parent().parent().hide();
		},
		showGroup: function(value){
			
			var filteredGroup = this.obj.filter('[data-value="' + value + '"]');
			filteredGroup.show();
			this.obj.parent().parent().show();
			this.setByGroup(filteredGroup[0]);
		}
	};
	groupOptionObj.init();
	var sensorsObj = {
		obj: $('[data-name="sensor"]'),
		div: $('.div-sensor'),
		init: function(){
			
			this.obj.click(function(){
				
				var item = $(this);
				
				if(item.hasClass(activeClass)){
					
					item.removeClass(activeClass);
					item.addClass(nonActiveClass);
				}else{
					
					item.removeClass(nonActiveClass);
					item.addClass(activeClass);
				}
			});
		},
		hideSensors: function(){
			
			this.obj.hide();
			this.div.hide();
		},
		getEnergyMarks: function(){
			
			var marks_energy = [];
			// historyType
			var historyType = navLinkHistoryObj.val();
			marks_energy.push(historyType);
			// energy
			if(historyType == 'energy'){
				
				var energy = rdoEnergyOptionObj.val();
				if(energy != null){

					if(energy == 'co2')
						marks_energy.push('ec-co2');
					else
						marks_energy.push(energy);
				}
			}
			
			return marks_energy;
		},
		getEnvMarks: function(){

			var historyType = navLinkHistoryObj.val();
			
			var marks_env = [];
			if(historyType == 'energy'){
				
				var envs = rdoEnvOptionObj.obj.filter('.' + activeClass);
				envs.each(function(){
					
					var item = $(this);
					var optionsArr = item.attr('data-value').split(',');
					for(var i = 0, l = optionsArr.length; i < l; i++)
						marks_env.push(optionsArr[i]);
				});
			}
			
			return marks_env;
		}
	};
	sensorsObj.init();
	// 
	var groupSensorObj = {
		set: function(){
			
			//__________________________
			// hide all visible elements
			groupOptionObj.hideGroups();
			sensorsObj.hideSensors();
			// hide all visible elements
			//--------------------------
			
			var show_groups = [];
			// historyType
			var historyType = navLinkHistoryObj.val();
			// set energy
			var marks_energy = sensorsObj.getEnergyMarks();
			if(historyType == 'demand' || (historyType == 'energy' && marks_energy.length > 1)){
				
				var energyFiltered;
				for(var i = 0, l = marks_energy.length; i < l; i++)
					energyFiltered = sensorsObj.obj.filter('.' + marks_energy[i]);
				
				energyFiltered.show();
				energyFiltered.each(function(){
					
					var item = $(this);
					// show sensor div
					item.parent().parent().show();
					// show group
					var groupId = item.attr('data-groupId');
					if(show_groups.indexOf(groupId) < 0)
						show_groups.push(groupId);
				});
			}

			// env
			var marks_env = sensorsObj.getEnvMarks();
			if(marks_env.length > 0){
				
				var marks = '.' + marks_env.join(',.');
				var envFiltered = sensorsObj.obj.filter(marks);
				// show sensor
				envFiltered.show();
				envFiltered.each(function(){
					
					var item = $(this);
					// show sensor div
					item.parent().parent().show();
					// show group
					var groupId = item.attr('data-groupId');
					if(show_groups.indexOf(groupId) < 0)
						show_groups.push(groupId);
				});
			}
			
			for(var i = 0, l = show_groups.length; i < l; i++)
				groupOptionObj.setByGroup(show_groups[i]);
		}
	};
	//________
	// データ取得
	var btnFinishObj = {
		obj: $('#btn-finish'),
		text: 'データ取得',
		loadingText: '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>',
		init: function(){
			
			this.obj.click(function(){
				
				popupMessage.clear();
				var reqObj = {};
				// display span
				reqObj.displaySpan = displaySpanObj.val();
				// date
				var dateM = divDatepickerObj.obj.datetimepicker('date');
				if(dateM != null){
					
					var format = divDatepickerObj.obj.datetimepicker('format');
					var date = dateM.format(format);
					reqObj.date = date;
				}else
					popupMessage.appendMessage('日付を選択してください。');
				// data type
				var dataType = rdoDataTypeObj.val();
				reqObj.dataType = dataType;
				// reduce display
				var reduceDisplay = rdoReduceDisplay.filter(':checked').val();
				if(reduceDisplay == 'y')
					reqObj.reduceDisplay = 'y';
				
				var historyType = navLinkHistoryObj.val();
				if(historyType == 'energy'){
					
					// energy
					var energy = rdoEnergyOptionObj.val();
					if(energy != '')
						reqObj.energy = energy;
					// env
					var env = rdoEnvOptionObj.obj.filter('.' + activeClass).map(function(){
						return $(this).attr('data-value');
					}).get().join(',');
					if(env != '')
						reqObj.env = env;
					
					if(energy == null && env == '')
						popupMessage.appendMessage('表示したい項目を選択してください。');
				}
				// sensorIds
				var filtered = sensorsObj.obj.filter(':visible').filter('.' + activeClass);
				var sensorIdArr = [];
				filtered.each(function(){
					sensorIdArr.push($(this).attr('data-value'));
				});
				if(sensorIdArr.length == 0)
					popupMessage.appendMessage('センサーを選択してください。');
				else
					reqObj.sensorIds = sensorIdArr.join(',');
				// graphFontSize
				reqObj.graphFontSize = GRAPH_FONT_SIZE;
				
				if(popupMessage.getMessage().length > 0)
					popupMessage.show();
				else{
					
					reqObj.userId = userId;
					var item = $(this);
					
					btnFinishObj.loading();
					$.ajax({
						url: '/zeuschart/Mieruka/Top/History.do',
						async: true,
						cache: false,
						type: 'POST',
						data: reqObj,
						success: function(resp){
							
							var respObj = JSON.parse(resp);
							if(rdoDataTypeObj.val() == 'graph'){
								
								// title
								option.title = respObj.title;
								// xAxis
								option.xAxis.axisLabel = respObj.xAxis.axisLabel;
								option.xAxis.data = respObj.xAxis.data;
								// yAxis
								option.yAxis = respObj.yAxis;
								var yAxisObj;
								for(var i = 0, l = option.yAxis.length; i < l; i++){
									
									yAxisObj = option.yAxis[i];
									if(yAxisObj.min != null){
										
										eval('yAxisObj.min = function(value){return (value.min - ' + yAxisObj.min + ').toFixed(2);};');
										eval('yAxisObj.max = function(value){return (value.max + ' + yAxisObj.max + ').toFixed(2);};');
									}
								}
								// series
								option.series = respObj.series;
								
								myChart.setOption(option, true);
							}else{
								
								tblHistoryObj.update(respObj);
							}
							btnFinishObj.reset();
						},
						error: function(){
							btnFinishObj.reset();
						}
					});
				}
			});
		},
		hide: function(){
			this.obj.addClass('d-none');
		},
		show: function(){
			this.obj.removeClass('d-none');
		},
		loading: function(){
			
			this.obj.prop('disabled', true);
			this.obj.html(this.loadingText);
		},
		reset: function(){
			
			this.obj.prop('disabled', false);
			this.obj.text(this.text);
		}
	}
	btnFinishObj.init();
	// データ取得
	//--------
	
	//
	var tblHistoryObj = {
		obj: $('#tbl-history'),
		option: {
			locale: 'ja-JP',
			showColumns: true,
			rowStyle: function(row, index){
				
				return {
					classes: 'text-nowrap'
				};
			}
		},
		init: function(){
			
			this.obj.on('column-switch.bs.table', function(){
			});
		},
		update: function(optionObj){
			
			this.option.columns = optionObj.columns;
			this.option.data = optionObj.data;
			this.option.height = divDataHistory.height();
			
			this.obj.bootstrapTable('destroy').bootstrapTable(this.option);
		}
	};
	tblHistoryObj.init();
	
	var divHistoryBoard = $('#div-history-board');
	var divGHistory = $('#div-g-history');
	var divDataHistory = $('#div-data-history');
	var divHidden = $('#hidden');
	var divOptionEnergy = $('#div-option-energy');
	// 表示スパン
	var rdoDisplaySpan = $('[name="displaySpan"]');
	
	var gHistoryDom = document.getElementById("div-g-history");
	
	var myChart = null;
	
	var myChart = echarts.init(gHistoryDom);
	var app = {};
	var dataMap = {};
    
    var option = {
    	legend: {
    		type: 'scroll',
    		y: 'bottom',
    		textStyle: {
    			fontSize: GRAPH_FONT_SIZE
    		}
    	},
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        containLabel: true
	    },
	    xAxis: {
            type : 'category',
            nameTextStyle: {
            	fontSize: GRAPH_FONT_SIZE
            }
        }
	};
	
    //******************** init
    // set demand as default tab
    navLinkHistoryObj.showDefault();
    // set graph as default type
    rdoDataTypeObj.changeDefault();
    // init datepicker
    divDatepickerObj.setDefault();
    //____________________ init
	
	return {
		resize: myChart.resize
	}
}