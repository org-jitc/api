;(function($){
	
	var tabContent = $('#tab-rt-content');
	var current = {};
	var graphOption = {
		tooltip : {
	        trigger: 'item',
	        formatter: "{b} : {c} ({d}%)"
	    },
	    legend: {
	    	type: 'scroll',
	        y: 'bottom'
	    }
	};
	var callBacks = {
		getReqParam: function(){
			return rtTab.realtimeTab('getReqParam');
		},
		update: function(resObj){
			rtTab.realtimeTab('update', resObj);
		}
	};
	var rtChart;
	var dataTable = {
		ver: 0
	};
	var tehudiOptionObj = {
		obj: $('[data-name="option-tehudi"]'),
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
				
				var filtered = tehudiOptionObj.obj.filter('.' + activeClass);
				if(filtered.length == 0){
					
					item.removeClass(nonActiveClass);
					item.addClass(activeClass);
				}else{
					
					var visibleSensor = sensorsObj.obj.filter(':visible');
					var groupMarks = groupObj.getMarks();
					if(groupMarks != null)
						visibleSensor = visibleSensor.filter(groupMarks);
					
					var optionMarks = tehudiOptionObj.getMarks();
						
					var filteredSensor = visibleSensor.filter(optionMarks);
					filteredSensor.removeClass(nonActiveClass);
					filteredSensor.addClass(activeClass);
					
					filteredSensor = visibleSensor.not(optionMarks);
					filteredSensor.removeClass(activeClass);
					filteredSensor.addClass(nonActiveClass);
				}
			});
		},
		valArr: function(){
			
			var filtered = this.obj.filter('.' + activeClass);
			var optionArr = [];
			filtered.each(function(){
				optionArr.push($(this).attr('data-value'));
			});
			
			return optionArr;
		},
		val: function(){
			
			var optionArr = this.valArr();
			if(optionArr.length > 0)
				return optionArr.join(',');
			else
				return null;
		},
		getMarks: function(){
			
			var optionArr = this.valArr();
			
			if(optionArr.length > 0)
				return '.' + optionArr.join(',.');
			else
				return null;
		}
	};
	tehudiOptionObj.init();
	var sensorsObj = {
		obj: $('[data-name="rt-sensor"]'),
		div: $('.div-sensor-rt'),
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
		showCurrentDiv: function(){
			
			this.div.hide();
			
			var arr = [];
			if(current.sensorType == null)
				arr.push(current.type);
			else{
				
				var typeArr = current.sensorType.split(',');
				arr.push(typeArr);
			}
			var marks = '.' + arr.join('.');
			this.div.filter(marks).show();
		},
		getFiltered: function(){
			
			var filtered;
			// 電力
			if(current.sensorType == null)
				filtered = sensorsObj.obj.filter('.' + current.type);
			else{
				
				var optionArr = current.sensorType.split(',');
				var marks = '.' + optionArr.join(',.');
				filtered = sensorsObj.obj.filter(marks);
			}
			
			return filtered;
		}
	};
	sensorsObj.init();
	var groupObj = {
		obj: $('[data-name="rtGroupOption"]'),
		init: function(){
			
			this.obj.click(function(){
				
				var item = $(this);
				var groupId = item.attr('data-value');
				
				if(item.hasClass(activeClass)){
					
					item.removeClass(activeClass);
					item.addClass(nonActiveClass);
				}else{
					
					item.removeClass(nonActiveClass);
					item.addClass(activeClass);
				}
				
				var filtered = sensorsObj.obj.filter(':visible').filter('[data-groupId="' + groupId + '"]');
				// 電力
				if(current.sensorType == null)
					filtered = filtered.filter('.' + current.type);
				else{
					
					var optionArr = current.sensorType.split(',');
					var marks = '.' + optionArr.join(',.');
					filtered = filtered.filter(marks);
				}
				
				if(tehudiOptionObj.obj.filter(':visible').length > 0){
					
					var optionMarks = tehudiOptionObj.getMarks();
					filtered = filtered.filter(optionMarks);
				}
				
				if(item.hasClass(activeClass)){
					
					filtered.removeClass(nonActiveClass);
					filtered.addClass(activeClass);
				}else{
					
					filtered.removeClass(activeClass);
					filtered.addClass(nonActiveClass);
				}
			});
		},
		hideGroups: function(){
			
			this.obj.hide();
			this.obj.parent().parent().hide();
		},
		getMarks: function(){
			
			var filtered = this.obj.filter(':visible').filter('.' + activeClass);
			
			var groupIdArr = [];
			filtered.each(function(){
				groupIdArr.push('[data-groupId="' + $(this).attr('data-value') + '"]');
			});
			
			if(groupIdArr.length > 0)
				return groupIdArr.join(',');
			else
				return null;
		}
	};
	groupObj.init();
	
	var global_methods = {
		init: function(){
			
			if(rtChart != null)
				echarts.dispose(rtChart);
			
			rtChart = echarts.init(tabContent.find('#div-graph-rt')[0]);
			
			if(dataTable.title != null)
				dataTable.title.empty();
			else
				dataTable.title = tabContent.find('#title');
			if(dataTable.body != null)
				dataTable.body.empty();
			else
				dataTable.body = tabContent.find('tbody');
		},
		setCurrent: function(){
			
			var item = $(this);
			current.type = item.attr('data-type');
			if(typeof(item.attr('data-sensor-type')) != 'undefined')
				current.sensorType = item.attr('data-sensor-type');
			else
				delete current.sensorType;
			
			// set group and sensor visibility
			sensorsObj.showCurrentDiv();
		},
		getCurrent: function(){
			return current;
		},
		getReqParam: function(){
			
			var param = {};
			var filtered = sensorsObj.getFiltered();
			var filtered = filtered.filter('.' + activeClass);
			
			var sensorIdArr = [];
			filtered.each(function(){
				sensorIdArr.push($(this).attr('data-value'));
			});
			if(sensorIdArr.length > 0)
				param.sensorIds = sensorIdArr.join(',');
			if(current.sensorType != null){
				
				param.sensorType = current.sensorType;
				if(current.sensorType == 'te,hu,di')
					param.options = tehudiOptionObj.val();
			}
			
			return param;
		},
		getIntervalCallBacks: function(){
			return callBacks;
		},
		resize: function(){
			
			if(rtChart != null)
				rtChart.resize();
		}
	};
	var rt_type_obj = {};
	
	$.fn.realtimeTab = function(method, resObj){
		
		if(global_methods[method])
			return global_methods[method].apply(this, arguments);
		
		var methods = {
			update: function(){
				
				var isInit = false;
				if(rt_type_obj.dataType != resObj.dataType){
					
					isInit = true;
					rt_type_obj.dataType = resObj.dataType;
					delete rt_type_obj.sensorType;
					delete rt_type_obj.options;
				}else{
					
					if(rt_type_obj.sensorType != resObj.sensorType){
						
						isInit = true;
						rt_type_obj.sensorType = resObj.sensorType;
						delete rt_type_obj.options;
					}else if(rt_type_obj.options != resObj.options){
						
						isInit = true;
						rt_type_obj.options = resObj.options;
					}
				}
				if(rt_type_obj.sensorIds != resObj.sensorIds){
					
					isInit = true;
					rt_type_obj.sensorIds = resObj.sensorIds;
				}
				
				//* update graph
				// chart
				if(rtChart == null)
					global_methods.init.apply(this, arguments);
				
				// grid
				if(resObj.graph.grid != null)
					graphOption.grid = resObj.graph.grid;
				else
					delete graphOption.grid;
				// xAxis
				if(resObj.graph.xAxis != null){
					
					graphOption.xAxis = resObj.graph.xAxis;
					graphOption.xAxis.axisLabel = {
			            formatter: function (value, index) {
			                return moment(value).format('HH:mm');
			            }
			        };
				}else
					delete graphOption.xAxis
				// yAxis
				if(resObj.graph.yAxis != null){
					
					graphOption.yAxis = resObj.graph.yAxis;
					var yAxisObj;
					for(var i = 0, l = graphOption.yAxis.length; i < l; i++){
						
						yAxisObj = graphOption.yAxis[i];
						if(yAxisObj.min != null){
							
							eval('yAxisObj.min = function(value){return (value.min - ' + yAxisObj.min + ').toFixed(3);};');
							eval('yAxisObj.max = function(value){return (value.max + ' + yAxisObj.max + ').toFixed(3);}');
						}
					}
				}else
					delete graphOption.yAxis;
				// legend show
				if(resObj.graph.legendShow != null)
					graphOption.legend.show = resObj.graph.legendShow;
				else
					graphOption.legend.show = true;
				// legend data
				graphOption.legend.data = resObj.graph.legendData;
				// series
				graphOption.series = resObj.graph.series;

				rtChart.setOption(graphOption, isInit);
				rtChart.resize();
				//_ update graph
				
				//* update table
				// title
				dataTable.title.text('(' + resObj.table.title + ')');
				var dataObj;
				var tr;
				var td;
				for(var i = 0; i < resObj.table.data.length; i++){
					
					dataObj = resObj.table.data[i];
					tr = dataTable.body.find('#' + dataObj.sensorId);
					if(tr.length > 0){
						
						tr.attr('data-ver', dataTable.ver + 1);
						td = tr.find('td')[1];
						$(td).text(dataObj.current);
					}else{
						
						tr = $('<tr></tr>');
						tr.attr('id', dataObj.sensorId);
						tr.attr('data-ver', dataTable.ver + 1);
						td = $('<td></td>');
						td.text(dataObj.sensorName);
						tr.append(td);
						td = $('<td></td>');
						td.text(dataObj.current);
						tr.append(td);
					}
					dataTable.body.append(tr);
				}
				dataTable.body.find('[data-ver="' + dataTable.ver + '"]').remove();
				dataTable.ver = dataTable.ver + 1;
				//_ update table
			}
		};
		
		if(methods[method])
			methods[method].apply(this.filter('[data-type="' + current.type + '"]')[0], arguments);
		else
			$.error('Method ' +  method + ' does not exist on jQuery.realtimeTab');
	};
}(jQuery));