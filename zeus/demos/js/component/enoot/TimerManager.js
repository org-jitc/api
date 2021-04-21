function TimerManager(){
	this.timers = {};
}
TimerManager.prototype = {
	register: function(name, fun, milli){
		
		if(this.timers[name] != null){
			this.destroy(name);
		}
		this.timers[name] = setInterval(fun, milli);
	},
	destroy: function(name){
		
		if(this.timers[name] != null){
			clearInterval(this.timers[name]);
			delete this.timers[name];
		}else{
			console.warn('No timer "' + name + '" to destroy.');
		}
	},
	destroyAll: function(){
		
		for(let key in this.timers){
			clearInterval(this.timers[key]);
		}
	}
};