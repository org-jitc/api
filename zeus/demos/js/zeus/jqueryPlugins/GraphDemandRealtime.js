;(function($){
	
	var graphs = {};
	var graphOption = {
		tooltip: {
			show: true,
			formatter: function (params, ticket, callback) {
				
		        var content = params.marker;
		        
		        if(params.name == null || params.name == '')
		        	content += params.seriesName;
		        else
		        	content += params.name;
		        
		        if(params.value != null){
		        	
		        	content += ': ';
		        	
		        	if(Array.isArray(params.value))
		        		content += parseFloat(params.value[1]).toFixed(1);
		        	else
		        		content += params.value;
		        }
		        	
	        	return content;
		    }
		},
		legend: {
			show: false,
			y: 'bottom'
		},
		grid: {
			left: 0,
			top: 20,
			right: 30,
			bottom: 0,
			containLabel: true
		},
	    xAxis: {
	        type: 'time',
	        name: '時刻',
	        nameLocation: 'end',
	        nameGap: 5,
	        axisLabel:{
	            formatter: function (value, index) {
	                return moment(value).format('HH:mm');
	            }
	        }
	    },
	    yAxis: {
	        type: 'value',
	        name: 'kW',
	        nameLocation: 'end',
	        nameRotate: 0,
	        nameGap: 5,
	        precision: 1
	    },
	    series: [
	    	{
		    	type: 'line',
		    	markLine: {
		    		symbol: 'none',
		    		label: {
		    			formatter: '{b}'
		    		},
		    		lineStyle: {
		    			type: 'solid'
		    		}
		    	}
	    	}
	    ]
	};
	var callBacks = {
		getReqParam: function(){
			return divGraphDemandRT.demandRealtimeGraph('getReqParam');	
		},
		update: function(gdrtObj){
			divGraphDemandRT.demandRealtimeGraph('update', gdrtObj);	
		}
	};
	
	var global_methods = {
		getReqParam: function(){
			
			var param = {};
			
			var now = new Date();
			param.reqtime = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-') + ' ' + [now.getHours(), now.getMinutes(), now.getSeconds()].join(':');
			
			var graphObj = graphs[this.id];
			if(graphObj != null && graphObj.data.length > 1)
				param.lasttime = graphObj.data[graphObj.data.length - 2][0];
			
			return param;
		},
		getIntervalCallBacks: function(){
			return callBacks;
		}
	};
	
	$.fn.demandRealtimeGraph = function(method, gdrtObj){
		
		var defaults = {};
		var result;
		
		if(global_methods[method] != null)
			return global_methods[method].apply(this, arguments);
		
		var endOptions;
		if(typeof method == 'object' || !method)
			endOptions = $.extend(defaults, method);
		else
			endOptions = defaults;
		
		var methods = {
			init: function(){
				
				var graphObj = {};
				// set chart obj
				graphObj.chart = echarts.init(this);
				graphObj.chart.setOption(graphOption);
				// set init data
				graphObj.data = [];
				
				// add graph obj to graphs
				graphs[this.id] = graphObj;
			},
			update: function(){
				
				var graphObj = graphs[this.id];
				
				if(gdrtObj.isInit != null)
					graphObj.data = gdrtObj.data;
				else{
					
					var dataArr;
					var lastArr;
					for(var i = 0; i < gdrtObj.data.length; i++){
						
						dataArr = gdrtObj.data[i];
						
						if(graphObj.data.length > 1){
							
							lastArr = graphObj.data[graphObj.data.length - 2];
							if(lastArr[1] != null)
								dataArr[1] = parseFloat(dataArr[1]) + parseFloat(lastArr[1]);
						}
						
						graphObj.data.splice(graphObj.data.length - 1, 0, dataArr);
					}
				}
				
				var optionObj = {};
				optionObj.series = [];
				// set legend
				if(gdrtObj.legend != null)
					optionObj.legend = gdrtObj.legend;
				// set yAxisMax
				optionObj.yAxis = {};
				if(gdrtObj.yMax == null)
					optionObj.yAxis.max = null;
				else
					optionObj.yAxis.max = gdrtObj.yMax;
				// set series
				var dataObj = {};
				// series name
				if(gdrtObj.seriesName != null)
					dataObj.name = gdrtObj.seriesName;
				// series data
				dataObj.data = graphObj.data;
				// series line style
				if(gdrtObj.lineStyle != null)
					dataObj.lineStyle = gdrtObj.lineStyle;
				// series item style
				if(gdrtObj.itemStyle != null)
					dataObj.itemStyle = gdrtObj.itemStyle;
				// series mark line
				if(gdrtObj.markLineData != null){

					dataObj.markLine = {};
					dataObj.markLine.data = gdrtObj.markLineData;
				}
				
				optionObj.series.push(dataObj);
				
				graphObj.chart.setOption(optionObj);
				graphObj.chart.resize();
			},
			resize: function(){
				
				var graphObj = graphs[this.id];
				if(graphObj != null)
					graphObj.chart.resize();
			}
		};
		
		this.each(function(){
			
			if(methods[method])
				result = methods[method].apply(this, arguments);
			else if(typeof method == 'object' || !method)
				methods.init.apply(this, arguments);
			else
				$.error('Method ' +  method + ' does not exist on jQuery.demandEvent');
		});
		
		return this;
	};
}(jQuery));