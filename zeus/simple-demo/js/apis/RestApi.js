/**
 * 共通 Api
 */
class ApiPaths {
	static alert = 'alert';
	static autoReductionRecalculate = 'auto-reduction-recalculate';
	
	static batteryExchangeDate = 'battery-exchange-date';
	
	static childDeviceMonitoring = 'child-device-monitoring';
	static cyclic = 'cyclic';
	
	static daily = 'daily';
	static dailySpan = 'daily-span';
	static dimmingDailySchedule = 'dimming-daily-schedule';
	static dimmingDevice = 'dimming-device';
	static dimmingGroup = 'dimming-group';
	static dimmingSensor = 'dimming-sensor';
	static dimmingYearlySchedule = 'dimming-yearly-schedule';
	
	static ecoKeeper = 'eco-keeper';
	static electricLeakSensor = 'electric-leak-sensor';
	static electricUsage = 'electric-usage';
	static energyConversionFactor = 'energy-conversion-factor';
	static energySensor = 'energy-sensor';
	static enootSetting = 'enoot-setting';
	static enootTop = 'enoot/top';
	static enootTopAirCondition = 'enoot/top/air-condition';
	static enudgeBackServer = 'enudge-back-server';
	static enudgeCyclic = 'enudge-cyclic';
	static enudgeNodeMap = 'enudge-node-map';
	static enudgeSetting = 'enudge-setting';
	static envUnit = 'env-unit';
	static envSensor = 'env-sensor';
	static eventInformation = 'event-information';
	static eventMail = 'event-mail';
	static externalSystem = 'external-system';
	
	static facility = 'facility';
	static facilityDemand = 'facility/demand';
	
	static group = 'group';
	
	static heatRecoveryStatusMonitoring = 'heat-recovery-status-monitoring';
	static heatSystem = 'heat-system';
	
	static input = 'input';
	static inverter = 'inverter';
	static inverterControl = 'inverter-control';
	
	static listPageDetail = 'list-page-detail';
	
	static mailServer = 'mail-server';
	static mieruka = 'mieruka';
	static monitoring = 'monitoring';
	
	static node = 'node';
	static nodeAutoProcess = 'node-auto-process';
	
	static parentDevice = 'parent-device';
	static powerMonitoring = 'power-monitoring';
	
	static reductionCalculateSetting = 'reduction-calculate-setting';
	static reportDeliverySetting = 'report-delivery-setting';
	
	static sensorDataWatching = 'sensor-data-watching';
	static signageSetting = 'signage-setting';
	static simpleOperation = 'simple-operation';
	static simpleOperationSchedule = 'simple-operation-schedule';
	static subMachineMonitoringSchedule = 'sub-machine-monitoring-schedule';
	static system = 'system';
	static systemMenu = 'system-menu';
	static systemSetting = 'system-setting';
	
	static temperature = 'temperature';
	static temperatureControl = 'temperature';
	static timespan = 'timespan';
	
	static user = 'user';
	static userMailSchedule = 'user-mail-schedule';
	
	static wirelessState = 'wireless-state';
	
	static yearly = 'yearly';
	
	static sub = {
		validation: 'validation',
		status: 'status'
	};
	
	static create(...paths){
		let contextPath = sessionStorage.getItem('contextPath');
		
		if(paths.length > 0){
			return `${contextPath}rest/${paths.join('/')}`;
		}
		return contextPath;
	}
	static createZeuschart(...paths){
		let contextPath = '/zeuschart';
		
		if(paths.length > 0){
			return `${contextPath}/rest/${paths.join('/')}`;
		}
		return contextPath;
	}
}

class RestApi {
	getUrl(subPath){
		let contextPath = sessionStorage.getItem('contextPath');
		
		if(!contextPath.endsWith('/')){
			contextPath = contextPath + '/';
		}
		if(subPath && subPath !== ''){
			return `${contextPath}rest/${this.mainPath}/${subPath}`;
		}
		return `${contextPath}rest/${this.mainPath}`;
	}
	
	getApi(mainPath){
		this.mainPath = mainPath;
		return this;
	}
	
	getPostConfig(requestParam, requestHeaders){
		let config = {};
		
		if(requestParam){
			config.params = requestParam;
		}
		if(requestHeaders){
			config.headers = requestHeaders;
		}
		return config;
	}
	static getPostConfig(requestParam, requestHeaders){
		let config = {};
		
		if(requestParam){
			config.params = requestParam;
		}
		if(requestHeaders){
			config.headers = requestHeaders;
		}
		return config;
	}
	
	/**
		post method
		@param subPath api sub path
		@param requestBody send data by request body
		@param requestParam send data by request parameter
		@param requestHeaders set request headers
	 */
	post(subPath, requestBody, requestParam, requestHeaders){
		return axios.post(this.getUrl(subPath), requestBody, this.getPostConfig(requestParam, requestHeaders));
	}
	static post(url, requestBody, requestParam, requestHeaders){
		return axios.post(url, requestBody, this.getPostConfig(requestParam, requestHeaders));
	}
	
	/**
		get method
		@param subPath api sub path
		@param requestParam send data by request parameter
	 */
	get(subPath, requestParam){
		return axios.get(this.getUrl(subPath), {
			params: requestParam
		});
	}
	static get(url, requestParam){
		return axios.get(url, {
			params: requestParam
		});
	}
	
	/**
		delete method
		@param subPath api sub path
		@param requestParam send data by request parameter
	 */
	delete(subPath, requestParam){
		let url = this.getUrl(subPath);
	
		if(requestParam){
			return axios.delete(url, {
				params: requestParam
			});
		}
		return axios.delete(url);
	}
	static delete(url, requestParam){
		
		if(requestParam){
			return axios.delete(url, {
				params: requestParam
			});
		}
		return axios.delete(url);
	}
}
window.restApi = new RestApi();