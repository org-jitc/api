var divHelpMark = $('.help-question-mark');
var divEsContent = $('.es_content');

function openMapWindow(mapName){
	window.open(contextPath + "images/facility/" + mapName, "", "charset=utf-8,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
}

function FacilityMap(){
	
	//-> error message div that for delete facility map
	let errDivUploaded = document.querySelector('#errUploadedMap');
	//-> div that show uploaded facility maps
	let divUploaded = document.querySelector('#divUploadedMap');
	//-> error div for facility map
	let errFacilityMap = document.querySelector('#errFacilityMap');
	//-> form for upload facility map
	let formFacilityMap = document.querySelector('#formFacilityMap');
	//-> input file
	let mapFile = document.querySelector('[name="facilityMap"]');
	//-> upload button
	let btnUploadMap = document.querySelector('#btnFacilityMapUpload');
	
	btnUploadMap.onclick = function(){
		
		btnUploadMap.disabled = true;
		errFacilityMap.innerText = '';
		
		if(mapFile.files.length == 0)
			errFacilityMap.innerText = 'ファイルを選択してください。';
		else{
			
			var formData = new FormData(formFacilityMap);
			$.ajax({
				url: contextPath + 'Ajax/FacilityInfo/UploadFacilityMap.action',
				type: 'POST',
				async: true,
				cache: false,
				data: formData,
				processData: false,
				contentType: false,
				success: function(resp){
					
					let respObj = JSON.parse(resp);
					btnUploadMap.disabled = false;
					
					if(respObj.error != null)
						errFacilityMap.innerText = '同期サーバーに接続できないためアップロードできませんでした。';
					else{
						
						if(respObj.status == 'NEW'){
							
							let nodeBtnGroup = document.createElement('div');
							nodeBtnGroup.setAttribute('class', 'btn-group');
							
							let nodeButton = document.createElement('button');
							nodeButton.type = 'button';
							nodeButton.setAttribute('class', 'btn btn-default btn-sm');
							nodeButton.innerText = mapFile.files[0].name;
							nodeButton.setAttribute('onclick', "openMapWindow('" + mapFile.files[0].name + "');");
							nodeBtnGroup.appendChild(nodeButton);
							
							nodeButton = document.createElement('button');
							nodeButton.type = 'button';
							nodeButton.setAttribute('class', 'btn btn-danger btn-sm dropdown-toggle');
							nodeButton.setAttribute('data-toggle', 'dropdown');
							let nodeSpan = document.createElement('span');
							nodeSpan.setAttribute('class', 'caret');
							nodeButton.appendChild(nodeSpan);
							nodeBtnGroup.appendChild(nodeButton);
							
							let nodeUl = document.createElement('ul');
							nodeUl.setAttribute('class', 'dropdown-menu');
							let nodeLi = document.createElement('li');
							let nodeA = document.createElement('a');
							nodeA.href = 'javascript:void(0);';
							nodeA.setAttribute('onclick', "facilityMap.deleteMap(this, '" + mapFile.files[0].name + "');");
							nodeA.innerText = '削除';
							nodeLi.appendChild(nodeA);
							nodeUl.appendChild(nodeLi);
							nodeBtnGroup.appendChild(nodeUl);
							
							divUploaded.appendChild(nodeBtnGroup);
						}
					}
				},
				error: function(){
					
					errFacilityMap.innerText = 'アップロードできませんでした。';
					btnUploadMap.disabled = false;
				}
			});
		}
	}
	
	this.deleteMap = function(el, mapName){
		
		errDivUploaded.innerText = '';
		$.ajax({
			url: contextPath + 'Ajax/FacilityInfo/DeleteFacilityMap.action',
			type: 'POST',
			async: true,
			cache: false,
			data: {mapName: mapName},
			success: function(resp){
				
				let respObj = JSON.parse(resp);
				
				if(respObj.error != null)
					errDivUploaded.innerText = '同期サーバーに接続できないため削除できませんでした。';
				else{
					
					let nodeBtnGroup = el.parentNode.parentNode.parentNode;
					nodeBtnGroup.parentNode.removeChild(nodeBtnGroup);
				}
			},
			error: function(){
				errDivUploaded.innerText = '削除できませんでした。';
			}
		});
	}
}

$('#helpOptionToggle').change(function(){
	
	var helpOption = $(this);

	if(helpOption.prop('checked'))
		$('.help-question-mark').css('display', '');
	else
		$('.help-question-mark').css('display', 'none');
});

if($('#helpOptionToggle').prop('checked'))
	divHelpMark.css('display', '');
else
	divHelpMark.css('display', 'none');

divHelpMark.find('span').each(function(){
	
	var item = $(this);
	var key = item.attr('class').replace('es_', '');
	item.popover({
		trigger: 'hover',
		html: true,
		content: divEsContent.filter('#' + key).html()
	});
});

let facilityMap = new FacilityMap();