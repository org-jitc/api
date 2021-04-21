;(function($){
	
	var lasttime;
	var callBacks = {
		getReqParam: function(){
			return tblDemandEvent.demandEvent('getReqParam');
		},
		update: function(eventsObj){
			tblDemandEvent.demandEvent('update', eventsObj);
		}
	};
	
	var global_methods = {
		getReqParam: function(){
			return lasttime;
		},
		getIntervalCallBacks: function(){
			return callBacks;
		}
	};
	
	$.fn.demandEvent = function(method, eventsObj){
		
		var defaults = {
			
		};
		
		var endOptions;
		if(typeof method == 'object' || !method)
			endOptions = $.extend(defaults, method);
		else
			endOptions = defaults;
		
		if(global_methods[method])
			return global_methods[method].apply(this, arguments);
		
		var methods = {
			init: function(){
			},
			update: function(){
				
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