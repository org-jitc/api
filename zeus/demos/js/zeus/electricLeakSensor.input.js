let formObj = {
	sensorName: document.querySelector('#electricLeakSensorName'),
	sensorNameEn: document.querySelector('#electricLeakSensorNameEn'),
	ipAddress: document.querySelector('#ipAddress'),
	controlId: document.querySelector('#controlId'),
	childId: document.querySelector('#childId'),
	alertLimitMinute: document.querySelector('#alertLimitMinute'),
	alertLimitCount: document.querySelector('#alertLimitCount'),
	trim: function(){
		
		this.sensorName.value = this.sensorName.value.trim();
		this.sensorNameEn.value = this.sensorNameEn.value.trim();
		this.controlId.value = this.controlId.value.trim();
		this.childId.value = this.childId.value.trim();
		this.alertLimitMinute.value = this.alertLimitMinute.value.trim();
		if(this.alertLimitMinute.value == '') this.alertLimitMinute.value = 0;
		this.alertLimitCount.value = this.alertLimitCount.value.trim();
		if(this.alertLimitCount.value == '') this.alertLimitCount.value = 1;
	}
};

let ipObj = {
	ip1: document.querySelector('#ip1'),
	ip2: document.querySelector('#ip2'),
	ip3: document.querySelector('#ip3'),
	ip4: document.querySelector('#ip4'),
	port: document.querySelector('#port'),
	setIpAddress: function(){
		
		if(this.ip1.value.replace(' ', '') != ''
			|| this.ip2.value.replace(' ', '') != ''
			|| this.ip3.value.replace(' ', '') != ''
			|| this.ip4.value.replace(' ', '') != ''
			|| this.port.value.replace(' ', '') != ''
		)
			formObj.ipAddress.value = [
				[
					this.ip1.value.replace(' ', ''),
					this.ip2.value.replace(' ', ''),
					this.ip3.value.replace(' ', ''),
					this.ip4.value.replace(' ', '')
				].join('.'),
				this.port.value.replace(' ', '')
			].join(':');
	},
	setSeperatedIp: function(ip){
		
		let ipPort = ip.split(':');
		//-> set port
		this.port.value = ipPort[1];
		//-> set ip
		let ipArr = ipPort[0].split('.');
		this.ip1.value = ipArr[0];
		this.ip2.value = ipArr[1];
		this.ip3.value = ipArr[2];
		this.ip4.value = ipArr[3];
	}
}

function onSubmit(){
	
	//-> trim and set ip address
	ipObj.setIpAddress();
	//-> trim other properties
	formObj.trim();
}

//-> init
//==> set ip address
if(formObj.ipAddress.value != '')
	ipObj.setSeperatedIp(formObj.ipAddress.value);