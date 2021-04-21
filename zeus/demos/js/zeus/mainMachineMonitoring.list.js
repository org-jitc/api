var toggles = $('[data-toggle="toggle"]');

let intervalTime = 5000;

function updateMainCommStatus(){
	
	$.ajax({
		url: contextPath + 'Ajax/MainMachineMonitoring/UpdateMainCommunicationStatus.do',
		async: true,
		cache: false,
		type: 'post',
		data: {mainIds: mainIds},
		success: function(response){
			
			var connStatus = response.split(',');
			
			for(var i = 0; i < connStatus.length; i++){
				
				var datas = connStatus[i].split(':');
				
				var commDiv = document.getElementById("mainCommStatus" + datas[0]);
				
				if(datas[1] == 1){
					
					commDiv.style.color = 'orange';
					commDiv.innerHTML = 'OK';
					
				}else{
					
					commDiv.style.color = '#808080';
					commDiv.innerHTML = 'NG';
				}
			}
			
			setTimeout(updateMainCommStatus, intervalTime);
		},
		error: function(){
			setTimeout(updateMainCommStatus, intervalTime);
		}
	});
}

function updateMainConnStatus(){
	
	$.ajax({
		url: contextPath + 'Ajax/MainMachineMonitoring/UpdateMainConnectionStatus.do',
		async: true,
		cache: false,
		type: 'post',
		data: {mainIds: mainIds},
		success: function(response){
			
			if(response != ''){
				
				var datas;
				var toggle;
				var connStatus = response.split(',');
				for(var i = 0; i < connStatus.length; i++){
					
					datas = connStatus[i].split(':');
					
					toggle = toggles.filter('[data-id="' + datas[0] + '"]');
					toggle.prop('checked', datas[1] == 1);
					/* toggle.bootstrapToggle(datas[1] == 1? 'on': 'off');
					 * above code ↑ will triggle change event which sends request
					 * therefore, changed to code below ↓
					 */
					toggle.data('bs.toggle').update(true);
				}
	        }
			
			setTimeout(updateMainConnStatus, intervalTime);
		},
		error: function(){
			setTimeout(updateMainConnStatus, intervalTime);
		}
	});
}

toggles.change(function(){

	var item = $(this);
	var mainId = item.attr('data-id');
	
	var status;
	if(this.checked)
		status = 'on';
	else
		status = 'off';
	
	$.ajax({
		url: contextPath + 'Ajax/MainMachineMonitoring/MainConnectionChange.do',
		async: true,
		cache: false,
		data: {mainId: mainId, status: status},
		type: 'post',
		error: function(response){
			console.log('update conn status error');
		}
	});
});

window.onload = function(){
	
	if(mainIds != ''){
		
		updateMainConnStatus();
		updateMainCommStatus();
	}
}