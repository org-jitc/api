function InverterControl(){
	this.envSensorIds = new ZeusCheckbox({name: 'envSensorIds', checkedTextId: 'envSensorNames'});
}

let inverterControl = new InverterControl();