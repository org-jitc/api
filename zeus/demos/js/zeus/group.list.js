function onGroupDelClick(){
	modalConfirmDelete.show('DeleteComplete.action?groupId=' + this.getAttribute('data-group-id'));
}

let modalConfirmDelete = new ModalConfirmDelete();
var modalSetOrder = $('#modal-set-order');
var ulGroupOrder = $('#ul-group-order');
var btnSaveOrder = document.querySelector('#btn-save-order');
let nodeListBtnGroupDel = document.querySelectorAll('[data-btn-type-group="del"]');

for(let i = 0, l = nodeListBtnGroupDel.length; i < l; i++){
	nodeListBtnGroupDel[i].onclick = onGroupDelClick;
}

btnSaveOrder.addEventListener('click', function(){
	
	var param = {};
	param.group = {};
	var li = ulGroupOrder.children();
	
	if(li.length > 0){
		
		var sensorId;
		for(var i = 1, l = li.length; i <= l; i++){
			
			sensorId = li[i - 1].getAttribute('data-sensorId');
			param.group[sensorId] = i;
		}
		
		$.ajax({
			url: contextPath + 'Ajax/User/SaveSensorOrder.action',
			type: 'POST',
			async: true,
			cache: false,
			data: {data: JSON.stringify(param)},
			success: function(response){
				alert('グループの表示順が変更されました。');
				document.location.href = 'GroupList.action';
			},
			error: function(){
				alert('グループ表示順変更時にエラーが発生しました。');
			}
		});
	}
});

function loadSensorOrder(){
	
	if(ulGroupOrder.children().length == 0){
		
		$.ajax({
			url: contextPath + 'Ajax/User/GetSensorOrder.action',
			async: true,
			cache: false,
			success: function(response){
				
				var respObj = JSON.parse(response);
				if(respObj.group != null){
					
					var li;
					var sensorName;
					for(var i in respObj.group){
						
						li = $('<li>');
						li.attr('class', 'list-group-item');
						li.attr('data-sensorId', respObj.group[i].sensorId);
						
						sensorName = respObj.group[i].sensorName;
						
						li.html(sensorName);
						ulGroupOrder.append(li);
					}
					
					ulGroupOrder.sortable();
					modalSetOrder.modal('show');
				}
			},
			error: function(){
				alert('グループ情報が取得できませんでした。');
			}
		});
	}else
		modalSetOrder.modal('show');
}