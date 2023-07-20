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
            console.log(1);
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

window.addEventListener('resize', () => realtimeCharts.resize());

new OverallStatus('overallStatus');
new VentilationStatus('ventilationStatus');
new OperationRadios();
new VentilationModeRadios();
let realtimeCharts = new RealtimeCharts();
new DataDisplayTabs();