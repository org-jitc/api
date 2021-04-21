;(function($){
	
	var unitKW = 'kW';
	var unitKWH = 'kWh';
	var unitPercent = '%';
	
	var dataProps = {
		'current-power': {
			name: 'currentPower',
			unit: unitKW
		},
		'max-demand': {
			name: 'maxDemand',
			unit: unitKW
		},
		'max-demand-day': {
			name: 'maxDemandDay',
			unit: unitKW
		},
		'elect-use': {
			name: 'electUse',
			unit: unitKWH
		},
		'elect-reduce': {
			name: 'electReduce',
			unit: unitKWH
		},
		'reduce-rate': {
			name: 'reduceRate',
			unit: unitPercent
		}
	};
	var callBacks = {
		update: function(sainejiObj){
			divSaineji.saineji('update', sainejiObj);
		}
	};
	
	var global_methods = {
		getIntervalCallBacks: function(){
			return callBacks;
		}
	};
	
	$.fn.saineji = function(method, sainejiObj){
		
		var defaults = {};
		
		var endOptions;
		if(typeof method == 'object' || !method)
			endOptions = $.extend(defaults, method);
		else
			endOptions = defaults;
		
		if(global_methods[method])
			return global_methods[method].apply(this, arguments);
		
		var methods = {
			init: function(){
				
				var valueItem;
				var item = $(this);
				for(var propClass in dataProps){
					
					valueItem = item.find('.' + propClass);
					valueItem.html('&nbsp;');
				}
			},
			update: function(){
				
				var valueItem;
				var propObj;
				var resValue;
				var item = $(this);
				for(var propClass in dataProps){
					
					valueItem = item.find('.' + propClass);
					propObj = dataProps[propClass];
					resValue = sainejiObj[propObj.name]; 
					if(resValue != null)
						valueItem.text(resValue + ' ' + propObj.unit);
					else
						valueItem.html('&nbsp;');
				}
			}
		};
		
		this.each(function(){
			
			if(methods[method])
				return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			else if(typeof method == 'object' || !method)
				return methods.init.apply(this, arguments);
			else
				$.error('Method ' +  method + ' does not exist on jQuery.demandEvent');
		});
	};
}(jQuery));