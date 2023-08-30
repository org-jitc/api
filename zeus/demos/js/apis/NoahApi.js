function returnMachineStatusServlet(successCallback, errorCallback){
    axios.get('/Noah/ReturnMachineStatusServlet')
    .then(xml => {
        successCallback(machineStatusResponseConverter(xml));
    })
    .catch(error => {
        console.error(error);
        errorCallback({
            code: error.response.status,
            message: error.message
        })
    });
}
function machineStatusResponseConverter(xml){
    let parser = new DOMParser();
    let doc = parser.parseFromString(xml, 'text/xml');

    let resp = {};

    let errorNode = doc.querySelector('error');
    
    if(errorNode){
        resp.error = {
            code: errorNode.querySelector('code')?.innerHTML,
            message: errorNode.querySelector('message')?.innerHTML
        };
        return resp;
    }
    let machineListNode = doc.querySelector('machine_status_list');

    if(machineListNode
        && machineListNode.childNodes.length > 0){
        resp.machineStatusList = Array.from(machineListNode.childNodes)
            .map(machineNode => {
                return {
                    machineId: machineNode.querySelector('machine_id')?.innerHTML,
                    machineName: machineNode.querySelector('machine_name')?.innerHTML,
                    status: machineNode.querySelector('status')?.innerHTML,
                    isAbnormal: machineNode.querySelector('is_abnormal')?.innerHTML
                };
            });
    }else{
        resp.machineStatusList = [];
    }
    return resp;
}