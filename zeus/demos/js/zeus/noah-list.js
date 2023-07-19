class OverallStatus {
    overallStatuses = [{
        backgroundColor: 'lightpink',
        textColor: 'white',
        text: 'システム停止中'
    },{
        backgroundColor: 'lightpink',
        textColor: 'purple',
        text: 'ウォーキングアップ中'
    },{
        backgroundColor: 'lightpink',
        textColor: 'purple',
        text: 'アフタ換気中'
    },{
        backgroundColor: 'lightpink',
        textColor: 'purple',
        text: '２４時間換気中'
    },{
        backgroundColor: 'lightgray',
        textColor: 'blue',
        text: '湿度抑制中　弱'
    },{
        backgroundColor: 'lightgray',
        textColor: 'blue',
        text: '湿度上昇　微弱'
    },{
        backgroundColor: 'lightgray',
        textColor: 'blue',
        text: '外気冷房中'
    },{
        backgroundColor: 'blue',
        textColor: 'white',
        text: 'ＮＯＡＨシステム稼働中'
    },{
        backgroundColor: 'lightyellow',
        textColor: 'red',
        text: '手動モード運転中'
    },{
        backgroundColor: 'lightyellow',
        textColor: 'red',
        text: '微弱固定運転中'
    },{
        backgroundColor: 'lightyellow',
        textColor: 'red',
        text: '換気強制停止中'
    },{
        backgroundColor: 'lightyellow',
        textColor: 'red',
        text: 'システム盤現場操作中'
    },{
        backgroundColor: 'lightgray',
        textColor: 'blue',
        text: '外気湿度上昇　弱'
    },{
        backgroundColor: 'lightyellow',
        textColor: 'red',
        text: '外気湿度上昇　微弱'
    },{
        backgroundColor: 'gainsboro',
        textColor: 'darkblue',
        text: '極寒モード　微弱'
    },{
        backgroundColor: 'red',
        textColor: 'white',
        text: '猛暑モード　微弱'
    }];
    overallStatusIndex = 0;
    constructor(elementId){
        this.textElement = document.querySelector(`#${elementId}`);

        this.setOverallStatus();
    }
    setOverallStatus(newStatusObj){
        newStatusObj = this.overallStatuses[this.overallStatusIndex];
        this.overallStatusIndex++;

        if(this.overallStatusIndex >= this.overallStatuses.length){
            this.overallStatusIndex = 0;
        }

        this.textElement.innerHTML = newStatusObj.text;

        setTimeout(() => {
            this.setOverallStatus();
        }, 3000);
    }
}

class VentilationStatus {
    statuses = [{
        backgroundColor: 'deeppink',
        textColor: 'white',
        text: '強'
    },{
        backgroundColor: 'deeppink',
        textColor: 'white',
        text: '中'
    },{
        backgroundColor: 'deeppink',
        textColor: 'white',
        text: '弱'
    },{
        backgroundColor: 'deeppink',
        textColor: 'white',
        text: '微'
    }];
    statusIndex = 0;
    constructor(elementId){
        this.textElement = document.querySelector(`#${elementId}`);

        this.setVentilationStatus();
    }
    setVentilationStatus(newStatusObj){
        newStatusObj = this.statuses[this.statusIndex];
        this.statusIndex++;

        if(this.statusIndex >= this.statuses.length){
            this.statusIndex = 0;
        }
        this.textElement.innerHTML = newStatusObj.text;

        setTimeout(() => {
            this.setVentilationStatus();
        }, 3000);
    }
}

class OperationRadios {
    constructor(){
        this.farHands = Array.from(document.querySelectorAll('[name="farHand"]'));
        this.handOnOff = Array.from(document.querySelectorAll('[name="handOnOff"]'));

        console.log(this.farHands.find(check => check.checked));
        this.onFarHandChange(this.farHands.find(check => check.checked));

        this.farHands.forEach(check => check.addEventListener('change', this.onFarHandChange.bind(this, check)));
    }
    onFarHandChange(target){
        this.handOnOff.forEach(check => check.disabled = target.value === 'far');
    }
}

class VentilationModeRadios {
    constructor(){
        this.modes = Array.from(document.querySelectorAll('[name="ventilationMode"]'));
        this.manualModes = Array.from(document.querySelectorAll('[name="manualVentilationMode"]'));

        this.onModeChange(this.modes.find(radio => radio.checked));

        this.modes.forEach(radio => radio.addEventListener('change', this.onModeChange.bind(this, radio)));
    }
    onModeChange(target){
        this.manualModes.forEach(radio => radio.disabled = target.value === 'auto');
    }
}

new OverallStatus('overallStatus');
new VentilationStatus('ventilationStatus');
new OperationRadios();
new VentilationModeRadios();