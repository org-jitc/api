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

class RealtimeChart {
    constructor(config){
        this.data = {
            series: config.option.series.map(serie => {return {data: serie.data}})
        };
        this.option = config.option;
        this.instance = echarts.init(document.querySelector(`#${config.id}`));

        this.instance.setOption(this.option);
    }
    setOption(option){
        this.instance.setOption(option);
    }
    resize(){
        this.instance.resize();
    }
}
class RealtimeCharts {
    static MAX_DATA_LENGTH = 30;
    constructor(){
        let serieData = DatasetCreator.createEmptySerieData();

        this.tempInstance = new RealtimeChart({
            id: 'tempRealtimeChart',
            option: {
                title: {
                text: '温度'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    type: 'scroll'
                },
                xAxis: {
                    type: 'time'
                },
                yAxis: [{
                    type: 'value',
                    max: 100
                }],
                series: [{
                    name: '設定温度',
                    type: 'line',
                    markLine: {
                        data: [
                            {
                                "name": "設定温度：70℃",
                                "yAxis": 70,
                                "label": {
                                    "formatter": "{b}",
                                    "position": "insideEndTop"
                                }
                            }
                        ]
                    }
                },{
                    name: '0',
                    type: 'line',
                    data: [...serieData]
                },{
                    name: '1',
                    type: 'line',
                    data: [...serieData]
                },{
                    name: '2',
                    type: 'line',
                    data: [...serieData]
                },{
                    name: '平均温度',
                    type: 'line',
                    data: [...serieData]
                }]
            }
        });
        this.humidityInstance = new RealtimeChart({
            id: 'humidityRealtimeChart',
            option: {
                title: {
                text: '湿度'
                },
                tooltip: {},
                legend: {
                    type: 'scroll'
                },
                xAxis: {
                    type: 'time'
                },
                yAxis: [{
                    type: 'value',
                    max: 100
                }],
                series: [{
                    name: '設定温度',
                    type: 'line',
                    markLine: {
                        data: [
                            {
                                "name": "警報温度：70%",
                                "yAxis": 70,
                                "label": {
                                    "formatter": "{b}",
                                    "position": "insideEndTop"
                                }
                            }
                        ]
                    }
                },{
                    name: '0',
                    type: 'line',
                    data: [...serieData]
                },{
                    name: '1',
                    type: 'line',
                    data: [...serieData]
                },{
                    name: '2',
                    type: 'line',
                    data: [...serieData]
                },{
                    name: '平均湿度',
                    type: 'line',
                    data: [...serieData]
                }]
            }
        });
        this.co2Instance = new RealtimeChart({
            id: 'co2RealtimeChart',
            option: {
                title: {
                text: 'CO2'
                },
                tooltip: {},
                legend: {
                    type: 'scroll'
                },
                xAxis: {
                    type: 'time'
                },
                yAxis: [{
                    type: 'value'
                }],
                series: [{
                    name: '1',
                    type: 'line',
                    data: [...serieData],
                    markLine: {
                        data: [
                            {
                                "name": "警報CO2：70ppm",
                                "yAxis": 70,
                                "label": {
                                    "formatter": "{b}",
                                    "position": "insideEndTop"
                                }
                            }
                        ]
                    }
                },{
                    name: '2',
                    type: 'line',
                    data: [...serieData]
                }]
            }
        });

        this.ticktock();
    }
    /*
        温度：室外、室内[1,2...]、平均、設定
        湿度：室外、室内[1,2...]、平均、設定
        CO2: 室内[1,2...]、警報
    */
    ticktock(){
        let now = new Date();

        this.tempInstance.data.series.forEach(serie => {

            if(!serie.data){
                return;
            }
            serie.data.push(DatasetCreator.createDataset(now));

            if(serie.data.length > RealtimeCharts.MAX_DATA_LENGTH){
                serie.data.shift();
            }
        });
        this.tempInstance.setOption({
            series: this.tempInstance.data.series
        });

        this.humidityInstance.data.series.forEach(serie => {

            if(!serie.data){
                return;
            }
            serie.data.push(DatasetCreator.createDataset(now));

            if(serie.data.length > RealtimeCharts.MAX_DATA_LENGTH){
                serie.data.shift();
            }
        });
        this.humidityInstance.setOption({
            series: this.humidityInstance.data.series
        });

        this.co2Instance.data.series.forEach(serie => {

            if(!serie.data){
                return;
            }
            serie.data.push(DatasetCreator.createDataset(now));

            if(serie.data.length > RealtimeCharts.MAX_DATA_LENGTH){
                serie.data.shift();
            }
        });
        this.co2Instance.setOption({
            series: this.co2Instance.data.series
        });

        setTimeout(this.ticktock.bind(this), 10000);
    }
    resize(){
        this.tempInstance.resize();
        this.humidityInstance.resize();
        this.co2Instance.resize();
    }
}

class DatasetCreator {
    static createDataset(now){
        let timestamp = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

        return {
            name: now.toLocaleTimeString(),
            value: [timestamp, Math.round(Math.random() * 100)]
        };
    }
    static createEmptySerieData(){
        let now = new Date();
        let before = new Date(now - 5 * 60 * 1000);

        let data = [];

        for(let i = 0; i < RealtimeCharts.MAX_DATA_LENGTH; i++){
            data.push({
                name: before.toLocaleTimeString(),
                value: [before.toLocaleDateString() + ' ' + before.toLocaleTimeString()]
            });
            before = new Date(before + 10 * 1000);
        }
        return data;
    }
}

class DataDisplayTabs{
    constructor(){
        this.radios = Array.from(document.querySelectorAll('[name="dataDisplayType"]'));
        this.chartTabTriggerEl = document.querySelector('#chartTabTrigger');
        this.chartTabTrigger = new bootstrap.Tab(this.chartTabTriggerEl);
        this.tableTabTrigger = new bootstrap.Tab(document.querySelector('#tableTabTrigger'));

        this.radios.forEach(radio => radio.addEventListener('change', this.onChange.bind(this, radio)));

        console.log(document.querySelector('button[data-bs-toggle="tab"]'));
        this.chartTabTriggerEl.addEventListener('shown.bs.tab', event => {
            realtimeCharts.resize();
        });

        // trigger selected at the first time
        this.onChange(this.radios.find(radio => radio.checked));
    }
    showByTriggerId(triggerId){
        let trigger;

        if(triggerId === 'chartTab'){
            trigger = this.chartTabTrigger;
        }else{
            trigger = this.tableTabTrigger;
        }
        trigger.show();
    }
    onChange(target){
        this.showByTriggerId(`${target.value}Tab`);
    }
}

class Toasts {
    static base_css = 'toast';
    constructor(){
        this.toastEls = Array.from(document.querySelectorAll('.toast'));
        this.toasts = this.toastEls.map(el => {
            return {id: el.getAttribute('data-id'), instance: new bootstrap.Toast(el)};
        });
    }
    findElement(toastId){
        return this.toastEls.find(el => el.getAttribute('data-id') === toastId);;
    }
    show(toastId){
        this.toasts.find(obj => obj.id === toastId).instance.show();
    }
    showSuccess(toastId, msg){
        console.log(toastId);
        let el = this.findElement(toastId);
        el.setAttribute('class', `${Toasts.base_css} text-bg-success`);

        let body = el.querySelector('.toast-body');
        body.innerText = msg;

        this.show(toastId);
    }
    showError(toastId, msg){
        let el = this.findElement(toastId);
        el.setAttribute('class', `${Toasts.base_css} text-bg-danger`);

        let body = el.querySelector('.toast-body');
        body.innerText = msg;

        this.show(toastId);
    }
}

class SettingButtons {
    constructor(){
        this.afterTimer = document.querySelector('#afterTimerSettingButton');

        this.afterTimer.addEventListener('click', this.onClick);
    }
    onClick(){
        toasts.settingToast.show();
    }
}

class OperationButtons {
    constructor(){
        this.btns = Array.from(document.querySelectorAll('.operation-btn'));
        this.btns.forEach(btn => btn.addEventListener('click', this.onClick));
    }
    onClick(){
        let id = this.getAttribute('data-id');
        toasts.showSuccess(id, 'ok');

        setTimeout(() => {
            toasts.showError(id, 'ng');
        }, 3000);
    }
}

class VentilationVariableModeSwitch {
    static STATUS_LABEL = {
        on: '切',
        off: '&nbsp;'
    };
    constructor(name, labelForId){
        this.name = name;
        this.switch = document.querySelector(`[name="${name}"]`);
        this.label = document.querySelector(`[for="${labelForId}"]`);

        this.switch.addEventListener('change', this.onSwitchChange.bind(this));
    }
    onSwitchChange(){

        if(this.switch.checked){
            this.label.innerHTML = VentilationVariableModeSwitch.STATUS_LABEL.on;
            return;
        }
        this.label.innerHTML = VentilationVariableModeSwitch.STATUS_LABEL.off;
    }
    enable(){
        this.switch.disabled = false;
    }
    disable(){
        this.switch.disabled = true;
    }
}
class VentilationVariableModeChecks {
    constructor(){
        this.modeChecks = Array.from(document.querySelectorAll('[name="ventilationVariableMode"]'));
        this.switchChecks = [
            new VentilationVariableModeSwitch('afterVentilationSwitch', 'afterVentilationSwitch'),
            new VentilationVariableModeSwitch('forceVentilationSwitch', 'forceVentilationSwitch'),
            new VentilationVariableModeSwitch('warmingUpSwitch', 'warmingUpSwitch')
        ];

        this.modeChecks.forEach(mc => mc.addEventListener('change', this.onModeCheckChange.bind(this, mc)));
    }
    onModeCheckChange(modeCheck){
        let switchName = modeCheck.getAttribute('data-switch-name');
        let modeSwitch = this.switchChecks.find(ms => ms.name === switchName);

        if(modeSwitch){
            modeCheck.checked? modeSwitch.enable(): modeSwitch.disable();
        }
    }
}

window.addEventListener('resize', () => realtimeCharts.resize());

const noahStore = {
    status: {
        header: {
            system: null,
            ventilation: null
        },
        fan: {

        },
        btn: {
            distance: {
                status: null,
                subStatus: null
            },
            ventilation: {
                status: null,
                subStatus: null
            },
            modes: null,
            humidityFirstRelease: null
        }
    },
    data: {
        setting: {
            temp: null,
            humi: null,
            co2: null,
            timer: {
                afterTimer: null,
                forceVentilationTime: null,
                warmingUp: null,
                logginSpan: null
            },
            env: {
                indoorForceStrongTemp: null,
                outdoorOutCoolRangeTemp: null,
                demandControlOuterTempUp: null,
                demandControlOuterTempDown: null,
                demandControlAlertHumi: null,
                forceStrongOuterTempRangeFrom: null,
                forceStrongOuterTempRangeTo: null,
                outerAlertHumidity: null,
                humiAlertReleaseGap: null
            }
        },
        avg: {
            temp: null,
            humi: null
        },
        // last updated
        realtime: {
            temp: [],
            humi: [],
            co2: [],
            sensorStatus: [],
            sensorVoltage: []
        }
    }
};

new OverallStatus('overallStatus');
new VentilationStatus('ventilationStatus');
new VentilationModeRadios();
let realtimeCharts = new RealtimeCharts();
new DataDisplayTabs();
let toasts = new Toasts();
new OperationRadios();
new SettingButtons();
new OperationButtons();
new VentilationVariableModeChecks();