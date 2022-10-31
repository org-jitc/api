/**
	電力使用状況
 */
class AudioDTS {
    constructor() {
        this.audio = null;
        this.audioBaseSrc = '/zeus/sound/demand/';
        this.fileName = null;
        this.readyToPlay = false;
        this.playTimes = 0;
        this.lastDemandStatus = 0;
    }
    // events
    canplay() {
        console.info('audio loaded...');
        this.readyToPlay = true;
    }
    // methods
    stop() {
        this.audio && this.audio.pause();

        if (this.audio && this.readyToPlay) {
            this.audio.currentTime = 0;
        }
    }
    play() {
        this.audio && this.audio.play();
    }
    setAudio(config) {

        if (config) {

            if (this.fileName !== config.fileName) {
                this.readyToPlay = false;

                if (!this.audio) {
                    this.audio = document.createElement('AUDIO');
                    this.audio.onloadedmetadata = this.canplay.bind(this);
                    document.body.appendChild(this.audio);
                }
                this.audio.src = this.audioBaseSrc + config.fileName;
                this.fileName = config.fileName;
            }

            if (this.playTimes != config.times) {
                this.playTimes = config.times;
                this.audio.loop = this.playTimes == 2;
            }
        } else {
            if (this.audio) {
                document.body.removeChild(this.audio);
                this.audio = null;
            }
            this.fileName = null;
            this.readyToPlay = false;
            this.playTimes = 0;
        }
    }
    update(audioConfig, demandStatus) {
        this.setAudio(audioConfig);
        // play sound processing
        if (this.readyToPlay) {

            if (this.playTimes == 0 || !demandStatus || demandStatus <= 85) {
                this.stop();
            } else {

                if (!this.lastDemandStatus || this.lastDemandStatus <= 85) {
                    this.play();
                }
            }
            this.lastDemandStatus = demandStatus;
        }
    }
}
	
function ElectricUsage(){
	var divSaineji = $('.saineji');
	var divCurrentTime = $('#ymdwhmi');
	var labelRemainMinute = $('#remainMinute');
	var electricUsedMonthLabel = $('#electricUsedMonth');
	var electricUsedMonthUnderControlLabel = $('#electricUsedMonthUnderControl');
	var electricReducedMonthLabel = $('#electricReducedMonth');
	var electricReducedMonthUnderControlLabel = $('#electricReducedMonthUnderControl');
	var reduceRateLabel = $('#reduceRate');
	var reduceRateUnderControlLabel = $('#reduceRateUnderControl');
	var audioDTS = new AudioDTS();
	let demandStatus = new DemandStatus(req.demandStatusArr);
	
	let intervalTime = 10000;
	var minWidth = 950;
	var minHeight = 600;
	var windowWidth;
	var windowHeight;
	var width;
	var height;
	var ratioX = 38;
	var ratioY = 25;
	var g;
	let fontRatio = 0.012;
	var ALARM_STATUS = 0;
	var FILE_NAME;
	var HEADER_RGB;
	var FOOTER_RGB;
	var DTS_TIMES;
		
	function onResize(){
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
		width = windowWidth;
		height = parseInt(width * ratioY / ratioX);
		
		if(height > windowHeight){
			height = parseInt(windowHeight);
			width = parseInt(height * ratioX / ratioY);
		}
		
		divSaineji.width(width);
		divSaineji.height(height);
		
		let fontSize = parseInt(width * fontRatio);
		let html = document.getElementsByTagName('html')[0];
		html.style.fontSize = `${fontSize < 12? 12: fontSize}px`;
	}
	
	function customValue(val) {
		
	    if (val <= 65){
	        return '余裕';
	    }
	    if (val > 65 && val <= 85){
	        return '注意';
	    }
	    // > 85
        return '危険';
	}
	
	function updateDateInfo(){
		divCurrentTime.html(getCurrentYMDWHMI());
		labelRemainMinute.html(getRemainMinute());
	}
	
	function getCurrentYMDWHMI(){
		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		var wd = date.getDay();
		var w = "日月火水木金土".split("")[wd];
		var h = date.getHours();
		var mi = date.getMinutes();
		return y + "年" + m + "月" + d + "日（" + w + "）" + h + "時" + mi + "分";
	}
	
	function getRemainMinute(){
		var date = new Date();
		var m = date.getMinutes();
		var remainMinute = (60 - m) % 30;
		return remainMinute;
	}
		
	function getNewElectricData(){
		// デマンド状況設定によってデマンドデータを表示する　↓
		demandStatus.fetchData();
		
		axios.get(`${sessionStorage.getItem('contextPath')}/rest/usage/electric/latest_data`, {
			params: {
				userId: req.userId
			}
		})
			.then(dataObj => {
				var status = dataObj.status;
				var electricUsedMonth = dataObj.electricUsedMonth;
				var electricUsedMonthUnderControl = dataObj.electricUsedMonthUnderControl;
				var electricReducedMonth = dataObj.electricReducedMonth;
				var electricReducedDay = dataObj.electricReducedDay;
				var reduceRate = dataObj.reduceRate;
				var reduceRateUnderControl = dataObj.reduceRateUnderControl;
				
				electricUsedMonth && electricUsedMonthLabel.html(electricUsedMonth);
				electricUsedMonthUnderControl && electricUsedMonthUnderControlLabel.html(electricUsedMonthUnderControl);
				electricReducedMonth && electricReducedMonthLabel.html(electricReducedMonth);
				electricReducedDay && electricReducedMonthUnderControlLabel.html(electricReducedDay);
				reduceRate && reduceRateLabel.html(reduceRate);
				reduceRateUnderControl && reduceRateUnderControlLabel.html(reduceRateUnderControl);
				
				if(HEADER_RGB != dataObj.electricUsageHeaderRgb){
					divSaineji.find('.saineji-head').css('background-color', '#' + dataObj.electricUsageHeaderRgb);
					HEADER_RGB = dataObj.electricUsageHeaderRgb;
				}
				
				if(FOOTER_RGB != dataObj.electricUsageFooterRgb){
					divSaineji.find('.saineji-foot').css('background-color', '#' + dataObj.electricUsageFooterRgb);
					FOOTER_RGB = dataObj.electricUsageFooterRgb;
				}
				
				if(dataObj.demandAreaRgbChange == 1){
					
					if(status != null){
						
						if (status <= 65){
					    	divSaineji.find('.saineji-body').css('background-color', '#008040');
						}else if (status > 65 && status <= 85){
					    	divSaineji.find('.saineji-body').css('background-color', '#d9d900');
						}else if (status > 85){
					    	divSaineji.find('.saineji-body').css('background-color', '#ae0000');
						}
					}else{
						divSaineji.find('.saineji-body').css('background-color', '#' + FOOTER_RGB);
					}
				}else{
					divSaineji.find('.saineji-body').css('background-color', '#' + FOOTER_RGB);
				}
				
				if(status != null){
					g.refresh(status);
				}
				//********** デマンド逼迫時通知音
				audioDTS.update(dataObj.dts, status);
				//__________ デマンド逼迫時通知音
				setTimeout(getNewElectricData, intervalTime);
			})
			.catch(error => {
				console.error(error);
				setTimeout(getNewElectricData, intervalTime);
			})
	}
	
	function toThousands(num) {
	    var num = (num || 0).toString(), result = '';
	    	
	    while (num.length > 3) {
	        result = ',' + num.slice(-3) + result;
	        num = num.slice(0, num.length - 3);
	    }
	    
	    if (num) { result = num + result; }
	    return result;
	}
	
	$(window).resize(function(){
		onResize();
	});
	
	//******************** init
	onResize();
	
	g = new JustGage({
	    id: "demandStatus",
	    value: -1,
	    min: 0,
	    max: 100,
	    hideMinMax: true,
	    pointer: true,
	    relativeGaugeSize: true,
	    titleFontFamily: "Meiryo UI",
	    valueFontFamily: "Meiryo UI",
	    textRenderer: customValue,
	    title: "デマンド状況",
	    customSectors: [{
	        color : "#008040",
	        lo : 0,
	        hi : 65
	      },{
	        color : "#d9d900",
	        lo : 65,
	        hi : 85
	      },{
	        color : "#ae0000",
	        lo : 85,
	        hi : 100
	      }]
	  });
	// 図の更新
	//getNewElectricData();
	// 時間の更新
	updateDateInfo();
	window.setInterval(updateDateInfo, 1000);
	//==================== init
}
new ElectricUsage();