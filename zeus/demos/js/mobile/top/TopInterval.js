
/* function for all data update interval for top page
 * 
 * register a new timer:
 * 	register(timerName, cycle)
 * 		timerName: string
 * 		cycle: number
 * 
 * add data type to timer object
 * 	addDataType(timerName, dataType, timerObj)
 * 
 * remove data type from timer object
 * 	removeDataType(timerName, dataType)
 * 
*/
function TopInterval(){
	
	var _this = this;
	var timers = {
		'10s': {
			cycle: 10000,
			dataTypes: [],
			callBacks: {},
			timerFunc: new IntervalFunc('10s')
		},
		'1m': {
			cycle: 60000,
			dataTypes: [],
			callBacks: {},
			timerFunc: new IntervalFunc('1m')
		}
	};
	
	function IntervalFunc(intevalName){
		
		var _this = this;
		this.name = intevalName;
		
		this.intervalFunc = function(){
			
			var name = _this.name;
			var timerObj = timers[name];
			
			var param = {};
			param.type = timerObj.dataTypes.join(',');
			//
			var type;
			var callBacks;
			for(var i = 0; i < timerObj.dataTypes.length; i++){
				
				type = timerObj.dataTypes[i];
				callBacks = timerObj.callBacks[type];
				
				if(callBacks.getReqParam != null){

					var reqParam = callBacks.getReqParam();
					if(reqParam != null)
						param[type] = JSON.stringify(reqParam);
				}
			}
			
			$.ajax({
				url: ajaxOption.url,
				async: true,
				cache: false,
				type: 'POST',
				data: param,
				success: function(response){
					
					var respObj = JSON.parse(response);
					
					var type;
					for(var i = 0; i < timerObj.dataTypes.length; i++){
						
						type = timerObj.dataTypes[i];
						if(respObj[type] != null){
							
							if(timerObj.callBacks[type].update != null)
								timerObj.callBacks[type].update(respObj[type]);
						}
					}
				},
				error: function(){
					$.error(name + ': get data error');
				}
			});
		}
	}
	
	var ajaxOption = {
		url: contextPath + '/Mobile/GetTopRealtimeData.mo'
	};
	
	function registerTimer(name, cycle){
		
		if(_this.timers[name] == null && name != null && cycle != null){
			
			var timerObj = {};
			timerObj.cycle = cycle;
			timerObj.dataTypes = [];
			timerObj.callBacks = {};
			timerObj.timerFunc = new IntervalFunc(name);
			
			_this.timers[name] = timerObj;
		}
	}
	
	function addDataType(name, dataType, newTimerObj){
		
		var timerObj = timers[name];
		if(timerObj != null && dataType != null){
			
			if(timerObj.dataTypes.indexOf(dataType) < 0){
				
				timerObj.dataTypes.push(dataType);
				if(newTimerObj != null){

					timerObj.callBacks[dataType] = {};
					if(newTimerObj.getReqParam != null)
						timerObj.callBacks[dataType].getReqParam = newTimerObj.getReqParam;
					if(newTimerObj.update != null)
						timerObj.callBacks[dataType].update = newTimerObj.update;
				}
				timers[name] = timerObj;
			}
		}
	}
	
	function removeDataType(name, dataType){
		
		var timerObj = timers[name];
		if(timerObj != null && dataType != null){
			
			var index = timerObj.dataTypes.indexOf(dataType);
			if(index >= 0)
				timerObj.dataTypes.splice(index, 1);
		}
	}
	
	function start(name){
		
		var timerObj;
		if(name != null){
			
			timerObj = timers[name];
			if(timerObj.timer != null)
				clearInterval(timerObj.timer);
			
			if(timerObj.dataTypes.length > 0){
				
				timerObj.timerFunc.intervalFunc();
				timerObj.timer = setInterval("topInterval.timers()['" + name + "'].timerFunc.intervalFunc()", timerObj.cycle);
			}
		}else{
			
			for(var name in timers){
				
				timerObj = timers[name];
				if(timerObj.timer != null)
					clearInterval(timerObj.timer);
				
				if(timerObj.dataTypes.length > 0){
					
					timerObj.timerFunc.intervalFunc();
					timerObj.timer = setInterval("topInterval.timers()['" + name + "'].timerFunc.intervalFunc()", timerObj.cycle);
				}
			}
		}
	}
	
	function stop(name){
		
		var timerObj;
		if(name != null){
			
			timerObj = timers[name];
			if(timerObj.timer != null){
				
				clearInterval(timerObj.timer);
				delete timerObj.timer;
			}
		}else{
			
			for(var name in timers){
				
				timerObj = timers[name];
				if(timerObj.timer != null){
					
					clearInterval(timerObj.timer);
					delete timerObj.timer;
				}
			}
		}
	}
	
	function getTimers(){
		return timers;
	}
	
	return {
		timers: getTimers,
		registerInterval: registerTimer,
		addDataType: addDataType,
		removeDataType: removeDataType,
		start: start,
		stop: stop
	};
}
var topInterval = new TopInterval();