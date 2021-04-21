//**********************電池交換日履歴関連
function createBatteryExchangeDateDiv(sensorId, date){
	let label = document.createElement('label');
	label.setAttribute('class', 'mr-2');
	label.innerText = date;
	
	let a = document.createElement('a');
	a.href = 'avascript:void(0);';
	a.onclick = batteryExchangeConfirmDelete.bind(a, sensorId, date);
	a.innerHTML = '削除';
	
	let div = document.createElement('div');
	div.appendChild(label);
	div.appendChild(a);
	
	return div;
}

function getBatteryExchangeDateLog(sensorId){
	$.ajax({
		url: contextPath + 'Ajax/Common/GetBatteryExchangeDateLog.action',
		async: true,
		cache: false,
		data: {sensorId: sensorId},
		sensorId: sensorId,
		success: function(response){
			let divDate = document.querySelector('#batteryExchangeLog' + this.sensorId);
			divDate.innerHTML = '';
			
			let respArr = JSON.parse(response);
			for(var i in respArr){
				divDate.appendChild(createBatteryExchangeDateDiv(this.sensorId, respArr[i].exchangeDate));
			}
		}
	});
}

function getBatteryExchangeDateLogAll(sensorIds){
	$.ajax({
		url: contextPath + 'Ajax/Common/GetBatteryExchangeDateLogAll.action',
		async: true,
		cache: false,
		data: {sensorIds: sensorIds},
		success: function(resp){
			let respObj = JSON.parse(resp);
			let logDateArr;
			let divDate;
			for(var key in respObj){
				divDate = document.querySelector('#batteryExchangeLog' + key);
				divDate.innerHTML ='';
				
				logDateArr = respObj[key];
				for(let i = 0, l = logDateArr.length; i < l; i++){
					divDate.appendChild(createBatteryExchangeDateDiv(key, logDateArr[i]));
				}
			}
		},
		error: function(){
			console.log('get battery exchange log failed');
		}
	});
}

function insertBatteryExchangeDate(){
	let sensorId = $('#sensorIdHidden').val();
	let datetime = $('#batteryExchangeDateConfirmSpan').html();
	$('#batteryExchangeInsertConfirmModal').modal('hide');
	$.ajax({
    	url: contextPath + 'Ajax/Common/InsertBatteryExchangeDate.action',
    	async: true,
    	cache: false,
    	sensorId: sensorId,
    	data: {sensorId: sensorId, datetime: datetime},
    	success: function(response){
    		let beAlert = $('#batteryExchangeAlert' + this.sensorId);
    		if(response != '{}' && response != null){
    			let respObj = JSON.parse(response);
    			if(respObj.result == 'c'){
    				beAlert.html('電池交換日が登録されました。');
    	    		beAlert.removeClass('alert-danger');
    	    		beAlert.addClass('alert-success');
    	    		getBatteryExchangeDateLog(this.sensorId);
    			}else if(respObj.result == 'se'){
    				beAlert.html('同期サーバと接続できません。');
    	    		beAlert.removeClass('alert-success');
    	    		beAlert.addClass('alert-danger');    
    			}else if(respObj.result == 'du'){
    				beAlert.html('その日は既に登録されています。');
    	    		beAlert.removeClass('alert-success');
    	    		beAlert.addClass('alert-danger');    
    			}else{
    				beAlert.html('電池交換日が登録できませんでした。リトライしてください。');
    	    		beAlert.removeClass('alert-success');
    	    		beAlert.addClass('alert-danger');    				
    			}
    		}else{
	    		beAlert.html('電池交換日が登録できませんでした。リトライしてください。');
	    		beAlert.removeClass('alert-success');
	    		beAlert.addClass('alert-danger');
    		}
    		beAlert.show();
   			setTimeout(function(){
   				beAlert.hide();
   			}, 3000);
    	},
    	error: function(){
    		let beAlert = $('#batteryExchangeAlert' + this.sensorId);
    		beAlert.html('電池交換日が登録できませんでした。リトライしてください。');
    		beAlert.removeClass('alert-success');
    		beAlert.addClass('alert-danger');
			beAlert.show();
   			setTimeout(function(){
   				beAlert.hide();
   			}, 3000);
    	}
	});
}

function batteryExchangeConfirmDelete(sensorId, exchangeDate){
	$('#batteryExchangeDateDeleteConfirmSpan').html(exchangeDate);
	$('#sensorIdDeleteHidden').val(sensorId);
	$('#batteryExchangeDeleteConfirmModal').modal('show');
}

function deleteBatteryExchangeDate(){
	let sensorId = $('#sensorIdDeleteHidden').val();
	let exchangeDate = $('#batteryExchangeDateDeleteConfirmSpan').html();
	$('#batteryExchangeDeleteConfirmModal').modal('hide');
	$.ajax({
		url: contextPath + 'Ajax/Common/DeleteBatteryExchangeDate.action',
		data: {sensorId: sensorId, deleteDate: exchangeDate},
		async: true,
		cache: false,
		sensorId: sensorId,
		success: function(response){
			let respObj = JSON.parse(response);
			let beAlert = $('#batteryExchangeAlert' + this.sensorId);
			if(respObj.result == 'se'){
				beAlert.html('同期サーバと接続できません。');
	    		beAlert.removeClass('alert-success');
	    		beAlert.addClass('alert-danger');
			}else if(respObj.result == 'c'){
				beAlert.html('電池交換日が削除されました。');
	    		beAlert.removeClass('alert-danger');
	    		beAlert.addClass('alert-success');
	    		getBatteryExchangeDateLog(this.sensorId);
			}else{
				beAlert.html('電池交換日が削除できませんでした。リトライしてください。');
	    		beAlert.removeClass('alert-success');
	    		beAlert.addClass('alert-danger');
			}
			beAlert.show();
   			setTimeout(function(){
   				beAlert.hide();
   			}, 3000);
		},
		error: function(){
			let beAlert = $('#batteryExchangeAlert' + this.sensorId);
    		beAlert.html('電池交換日が削除できませんでした。リトライしてください。');
    		beAlert.removeClass('alert-success');
    		beAlert.addClass('alert-danger');
			beAlert.show();
   			setTimeout(function(){
   				beAlert.hide();
   			}, 3000);
		}
	})
}
//＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿電池交換日履歴関連