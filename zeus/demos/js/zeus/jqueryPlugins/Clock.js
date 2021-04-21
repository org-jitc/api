;(function($){
	
	$.fn.clock = function(method){
		
		
		var _this = this;
		var defaults = {
			
		};
		
		var endOptions;
		if(typeof method == 'object' || !method)
			endOptions = $.extend(defaults, method);
		else
			endOptions = defaults;
		
		var now, y, mo, d, w, h, mi, s;
		
		function getNow(){
			
			now = new Date();
			
			y = now.getFullYear();
			mo = now.getMonth() + 1;
			d = now.getDate();
			w = weeks[now.getDay()];
			h = now.getHours();
			mi = now.getMinutes();
			s = now.getSeconds();
			
			if(mo < 10) mo = "0" + mo;
			if(d < 10) d = "0" + d;
			if(h < 10) h= "0" + h;
			if(mi < 10) mi = "0" + mi;
			if(s < 10) s = "0" + s;
			
			return y + " / " + mo + " / " + d + " (" + w + ") " + h + " : " + mi + " : " + s;
		}
		
		function setClock(){
			_this.text(getNow());
		}
		
		setClock();
		setInterval(setClock, 1000);
	};
}(jQuery));