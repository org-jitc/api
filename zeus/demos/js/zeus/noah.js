class DatetimeDisplayer {
    weekNames = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
    constructor(containerId){
        this.container = document.querySelector(`#${containerId}`);

        this.refresh();
    }
    refresh(){
        let now = new Date();
        let dateString = now.toLocaleDateString('ja-JP', {year: '2-digit', month: '2-digit', day: '2-digit'});
        let timeString = now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

        this.container.innerHTML = `${dateString} ${this.weekNames[now.getDay()]} ${timeString}`;

        setTimeout(() => {
            this.refresh();
        }, 60000);
    }
}

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

        this.textElement.style.backgroundColor = newStatusObj.backgroundColor;
        this.textElement.style.color = newStatusObj.textColor;
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

        this.textElement.style.backgroundColor = newStatusObj.backgroundColor;
        this.textElement.style.color = newStatusObj.textColor;
        this.textElement.innerHTML = newStatusObj.text;

        setTimeout(() => {
            this.setVentilationStatus();
        }, 3000);
    }
}

class CSVDownload {
    constructor(datepickerId, displayDataButtonId, csvDownloadButtonId){
        this.datepicker = flatpickr(`#${datepickerId}`, {
            locale: 'ja'
        });
        this.displayDataButton = document.querySelector(`#${displayDataButtonId}`);
        this.csvDownloadButton = document.querySelector(`#${csvDownloadButtonId}`);

        this.displayDataButton.addEventListener('click', this.onDisplayButtonClick.bind(this));
    }
    setHistoryCreator(historyCreator){
        this.historyCreator = historyCreator;
    }
    onDisplayButtonClick(){
        let date = this.datepicker.formatDate(this.datepicker.selectedDates[0], 'y/n/j');

        this.historyCreator.createHistory(date);
    }
}

class TableBodyCreator {
    constructor(bodyId){
        this.tableBody = document.querySelector(`#${bodyId}`);
    }
    createHistory(date){
        this.tableBody.innerHTML = '';

        let tr, td;

        for(let hour = 0; hour < 24; hour++){

            for(let minute = 0; minute < 60; minute += 10){
                tr = document.createElement('tr');
                
                // date
                td = document.createElement('td');
                td.innerText = date;
                tr.appendChild(td);
                
                // time
                td = document.createElement('td');
                td.innerText = `${hour < 10? '0' + hour: hour}:${minute < 10? '0' + minute: minute}`;
                tr.appendChild(td);

                // outer temp
                td = document.createElement('td');
                td.innerText = getRandom(16, 20, 1);
                tr.appendChild(td);
                
                // outer humidity
                td = document.createElement('td');
                td.innerText = getRandom(50, 52, 1);
                tr.appendChild(td);

                // inner temp 1
                td = document.createElement('td');
                td.innerText = getRandom(23, 24, 1);
                tr.appendChild(td);
                
                // inner humidity 1
                td = document.createElement('td');
                td.innerText = getRandom(45, 47, 1);
                tr.appendChild(td);

                // inner temp 2
                td = document.createElement('td');
                td.innerText = getRandom(23, 24, 1);
                tr.appendChild(td);
                
                // inner humidity 2
                td = document.createElement('td');
                td.innerText = getRandom(45, 47, 1);
                tr.appendChild(td);
                
                // co2 1
                td = document.createElement('td');
                td.innerText = getRandom(530, 1020, 0);
                tr.appendChild(td);
                
                // co2 1
                td = document.createElement('td');
                td.innerText = getRandom(520, 1040, 0);
                tr.appendChild(td);
                
                // operation status
                td = document.createElement('td');
                td.innerText = getRandom(12000, 14010, 0);
                tr.appendChild(td);
                
                this.tableBody.appendChild(tr);
            }
        }
    }
}

class OperationButtons {
    switch_status = {far: 'far', hand: 'hand'};
    click_status = {click: 'btn-primary', unclick: 'btn-outline-primary'};
    current_states = {switch: this.switch_status.far};
    constructor(switchId, operationId, stopId){
        this.switch = document.querySelector(`#${switchId}`);
        this.operation = document.querySelector(`#${operationId}`);
        this.stop = document.querySelector(`#${stopId}`);

        this.switch.addEventListener('click', this.onSwitchClick.bind(this));
        this.operation.addEventListener('click', this.onOperationClick.bind(this));
        this.stop.addEventListener('click', this.onStopClick.bind(this));
    }
    onSwitchClick(){

        if(this.current_states.switch === this.switch_status.far){
            this.switch.innerText = '手元運転中';
            this.current_states.switch = this.switch_status.hand;
            return;
        }
        this.switch.innerText = '遠方運転中';
        this.current_states.switch = this.switch_status.far;
    }
    onOperationClick(){
        let cssClass = this.operation.getAttribute('class');

        if(this.isClicked(cssClass)){
            return;
        }
        cssClass = cssClass.replace(this.click_status.unclick, this.click_status.click);
        this.operation.setAttribute('class', cssClass);
        
        cssClass = this.stop.getAttribute('class');
        cssClass = cssClass.replace(this.click_status.click, this.click_status.unclick);
        this.stop.setAttribute('class', cssClass);
    }
    onStopClick(){
        let cssClass = this.stop.getAttribute('class');

        if(this.isClicked(cssClass)){
            return;
        }
        cssClass = cssClass.replace(this.click_status.unclick, this.click_status.click);
        this.stop.setAttribute('class', cssClass);

        cssClass = this.operation.getAttribute('class');
        cssClass = cssClass.replace(this.click_status.click, this.click_status.unclick);
        this.operation.setAttribute('class', cssClass);
    }
    isClicked(cssClass){
        return cssClass.indexOf(this.click_status.click) >= 0;
    }
}

function getRandom(min, max, fixedDiget) {
    return (Math.random() * (max - min) + min).toFixed(fixedDiget);
  }

new DatetimeDisplayer('currentDatetime');
new OverallStatus('overallStatus');
new VentilationStatus('ventilationStatus');
let csvDownload = new CSVDownload('csvDatePicker', 'displayDataButton', 'csvDownloadButton');
let historyCreator = new TableBodyCreator('historyBody');

csvDownload.setHistoryCreator(historyCreator);

new OperationButtons('switchButton', 'operationButton', 'stopButton');