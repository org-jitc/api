var _zeus = {
	jsLoader: $LAB.setGlobalDefaults({AlwaysPreserveOrder:true}),
	head: document.getElementsByTagName('head')[0],
	mainJS: [
		contextPath + 'js/moment-with-locales.min.js?ver=' + js_ver,
		contextPath + 'js/zeus/util/encoding.js?ver=' + js_ver,
		contextPath + 'js/jquery/jquery-3.5.1.min.js?ver=' + js_ver,
		contextPath + 'js/bootstrap/bootstrap.js?ver=' + js_ver,
		contextPath + 'js/zeus/util/Common.js?ver=' + js_ver
	],
	subCSS: [],
	subJS: [],
	loadCSS: function(url){
		
        var link = document.createElement('link');
        link.type='text/css';
        link.rel = 'stylesheet';
        link.href = url;
        
        this.head.appendChild(link);
	},
	loadSubCSS: function(){
		
		// css
		for(var i = 0, l = this.subCSS.length; i < l; i++)
			this.loadCSS(this.subCSS[i]);
		
		this.loadCSS(contextPath + 'css/override.css?ver=' + js_ver);
	},
	loadJS: function(){
		
		let jsLoader = this.jsLoader;
		//> ↓ import polyfill to support es5 grammer
		if(document.documentMode != null && document.documentMode <= 11)
			this.mainJS.unshift(contextPath + 'js/polyfill.min.js?ver=' + js_ver);
		
		this.mainJS.forEach(function(js){
			jsLoader = jsLoader.script(js).wait();
		});
		jsLoader = jsLoader.wait(function(){
			
			moment.locale("ja");
			zeus.initVariables();
			zeus.msgRequiredObj.init();
			
			//> ↓ initialize clock object
			zeus.clockObj.init();
		});
		
		this.subJS.forEach(function(js){
			jsLoader = jsLoader.script(js).wait();
		});
		
		this.loadSubCSS();
	},
	addSubCSS: function(url){
		this.subCSS.push(contextPath + url + '?ver=' + js_ver);
	},
	addSubJS: function(url){
		this.subJS.push(contextPath + url + '?ver=' + js_ver);
	}
};