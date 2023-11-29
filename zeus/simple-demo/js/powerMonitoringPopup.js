class ElectricityMonitoringPanel {
	#data
	#html
	#images
	#dataElements
	constructor(config){
		this.#data = {
			imgs: {
				arrows: {
					baseSrc: `${sessionStorage.getItem('contextPath')}/images/powerMonitoring/left-arrow-{speed}.gif`
				}
			},
			ratios: {
				panel: {
					x: 4,
					y: 3
				},
				font: 0.015
			},
			fetch: {
				interval: config.fetchInterval? config.fetchInterval * 1000: 60000
			},
			current: {
				panelSize: null
			},
			graphOption: {
				tooltip: {
					trigger: 'item',
			      	formatter: '{c} ({d}%)'
			    },
			    series: [
			      	{
			        	type: 'pie',
			        	radius: '90%',
			        	center: ['50%', '50%'],
			        	label: {
			            	position: 'inside',
			            	formatter: '{d}%'
			        	},
			        	emphasis: {
			          		label: {
			            		show: true
			          		}
			        	},
			        	data: [
							{name: '買電電力', value: null},
							{name: '発電電力', value: null}
						]
			     	},{
			        	type: 'pie',
			        	radius: '90%',
			        	center: ['50%', '50%'],
			        	label: {
			            	position: 'inside',
			            	formatter: '{d}%'
			        	},
			        	data: [
							{name: '買電電力', value: null},
							{name: '発電電力', value: null}
						]
			      	}
			    ]
		 	}
		};
		this.#html = document.getElementsByTagName('html')[0];
		this.#images = {
			arrows: Zeus.arrayFrom(document.querySelectorAll('.img-arrow'))
		};
		this.root = document.querySelector(`#${config.id}`);
		new ResizeByRatio({
			root: this.root.parentNode,
			ratios: this.#data.ratios.panel,
			callbacks: [this.onResize.bind(this)]
		});
		this.#dataElements = Zeus.arrayFrom(document.querySelectorAll('.data-element'));
		this.charts = {
			pieDay: echarts.init(document.querySelector('#pie-day')),
			pieMonth: echarts.init(document.querySelector('#pie-month'))
		};
		// initialization
		this.charts.pieDay.setOption(this.#getPieDayOption());
		this.charts.pieMonth.setOption(this.#getPieMonthOption());
		//this.#fetchData();
	}
	#setData(data){
		this.#dataElements
			.forEach(el => el.innerText = data[el.id]);
		// right arrow (purchased)
		this.#setArrow('img-arrow-left', data.purchasedPowerSupplyRate);
		// left arrow (generated)
		this.#setArrow('img-arrow-right', data.powerGenerationSupplyRate);
		// purchasedDay
		if(data.purchasedDay === '-'){
			this.#data.graphOption.series[0].data[0].value = null;
		}else{
			this.#data.graphOption.series[0].data[0].value = data.purchasedDay;
		}
		// purchasedMonth
		if(data.purchasedMonth === '-'){
			this.#data.graphOption.series[1].data[0].value = null;
		}else{
			this.#data.graphOption.series[1].data[0].value = data.purchasedMonth;
		}
		// generatedDay
		if(data.generatedDay === '-'){
			this.#data.graphOption.series[0].data[1].value = null;
		}else{
			this.#data.graphOption.series[0].data[1].value = data.generatedDay;
		}
		// generatedMonth
		if(data.generatedMonth === '-'){
			this.#data.graphOption.series[1].data[1].value = null;
		}else{
			this.#data.graphOption.series[1].data[1].value = data.generatedMonth;
		}
		this.charts.pieDay.setOption(this.#getPieDayOption());
		this.charts.pieMonth.setOption(this.#getPieMonthOption());
	}
	#setArrow(styleClass, supplyRate){
		let img = this.#images.arrows
				.find(img => img.getAttribute('class').indexOf(styleClass) > 0);
		
		if(img && supplyRate > 0){
			img.src = this.#data.imgs.arrows.baseSrc
				.replace('{speed}', this.#calculateSupplyRateStage(supplyRate));
			return;
		}
		img.src = '';
	}
	#calculateSupplyRateStage(supplyRate){
		if(supplyRate >= 90) return 300;
		if(supplyRate >= 80) return 400;
		if(supplyRate >= 70) return 500;
		if(supplyRate >= 60) return 600;
		if(supplyRate >= 50) return 700;
		if(supplyRate >= 40) return 800;
		if(supplyRate >= 30) return 900;
		if(supplyRate >= 20) return 1000;
		if(supplyRate >= 10) return 1100;
		return 1200;
	}
	onResize(newSize){
		this.#data.current.panelSize = newSize;
		// resize root div
		this.#resizeRoot();
		// resize font
		this.#resizeFont();
		// resize graph
		this.charts.pieDay.resize();
		this.charts.pieMonth.resize();
	}
	#resizeRoot(){
		this.root.style.width = `${this.#data.current.panelSize.width}px`;
		this.root.style.height = `${this.#data.current.panelSize.height}px`;
	}
	#resizeFont(){
		let fontSize = parseInt(this.#data.current.panelSize.width * this.#data.ratios.font);
		this.#html.style.fontSize = `${fontSize}px`;
	}
	#fetchData(){
		restApi.getApi(ApiPaths.powerMonitoring).get(PowerMonitoringApiPaths.get.getData)
		.then(resp => {
			this.#setData(resp.data);
			setTimeout(this.#fetchData.bind(this), this.#data.fetch.interval);
		})
		.catch(error => {
			console.error(error);
			setTimeout(this.#fetchData.bind(this), this.#data.fetch.interval);
		});
	}
	#getPieDayOption(){
		let option = {};
		option.tooltip = this.#data.graphOption.tooltip;
		option.series = [this.#data.graphOption.series[0]];
		return option;
	}
	#getPieMonthOption(){
		let option = {};
		option.tooltip = this.#data.graphOption.tooltip;
		option.series = [this.#data.graphOption.series[1]];
		return option;
	}
}

const panel = new ElectricityMonitoringPanel({
	id: 'panel',
	storageBattery: sessionStorage.getItem('storageBattery') === 'true',
	fetchInterval: 60 // seconds
});