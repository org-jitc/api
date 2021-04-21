var mobileMenuIdsCheck = $('[name="mobileMenuIds"]');
var checkElectAll = $('#check-elect-all');
var checkGasAll = $('#check-gas-all');
var checkHeavyOilAll = $('#check-heavyOil-all');
var checkFlowAll = $('#check-flow-all');
var checkHrAll = $('#check-hr-all');
var checkInputAll = $('#check-input-all');
var checkNodeAll = $('#check-node-all');
var checkEnvAll = $('#check-env-all');
var checkInverterAll = $('#check-inverter-all');
var checkSensorIds = $('[name="sensorIds"]');

//******************** functions
mobileMenuIdsCheck.change(function(){
	
	var item = $(this);
	var isChecked = item.prop('checked');
	var parentId = item.attr('class');
	
	// 親メニュー
	if(parentId == null)
		$('.' + item.val()).prop('checked', isChecked);
	else{
		
		var parentMenu = $('[value="' + parentId + '"]');
		
		if(isChecked){
			
			if(!parentMenu.prop('checked'))
				parentMenu.prop('checked', true);
		}else{
			
			if($('.' + parentId).filter(':checked').length == 0)
				parentMenu.prop('checked', false);
		}
	}
});

$('#categorySelectAll').click(function(){
	setAllSelect('menuCheckCategory');
});

$('#flatSelectAll').click(function(){
	setAllSelect('menuCheckFlat');
});

checkElectAll.change(function(){
	checkSensorIds.filter('.elect').prop('checked', this.checked);
});
checkGasAll.change(function(){
	checkSensorIds.filter('.gas').prop('checked', this.checked);
});
checkHeavyOilAll.change(function(){
	checkSensorIds.filter('.heavyOil').prop('checked', this.checked);
});
checkFlowAll.change(function(){
	checkSensorIds.filter('.flow').prop('checked', this.checked);
});
checkHrAll.change(function(){
	checkSensorIds.filter('.hr').prop('checked', this.checked);
});
checkInputAll.change(function(){
	checkSensorIds.filter('.input').prop('checked', this.checked);
});
checkNodeAll.change(function(){
	checkSensorIds.filter('.node').prop('checked', this.checked);
});
checkEnvAll.change(function(){
	checkSensorIds.filter('.env').prop('checked', this.checked);
});
checkInverterAll.change(function(){
	checkSensorIds.filter('.inverter').prop('checked', this.checked);
});

checkSensorIds.change(function(){
	
	var item = $(this);
	var className = item.prop('class');
	if(className != '') {
		
		var fliteredSensorIds = checkSensorIds.filter('.' + className);
		if(fliteredSensorIds.filter(':checked').length == fliteredSensorIds.length)
			$('#check-' + className + '-all').prop('checked', true);
		else
			$('#check-' + className + '-all').prop('checked', false);
	}
});

function setAllSelect(checkName){
	
	var totalItem = $('[name="' + checkName + '"]');
	var checkedItem = $('[name="' + checkName + '"]:checked');
	
	var totalItemLen = totalItem.length;
	var checkedItemLen = checkedItem.length;
	
	if(checkedItemLen > totalItemLen / 2)
		totalItem.prop('checked', false);
	else
		totalItem.prop('checked', true);
}

function setMenuIds(){
	
	var menuElementsCategory = '';
	var menuElementsFlat = '';
	
	// flat
	$('[name="menuCheckFlat"]:checked').each(function(){
		
		var item = $(this);
		
		if(!item.prop('disabled')){
			
			if(menuElementsFlat.length == 0)
				menuElementsFlat = item.val();
			else
				menuElementsFlat = menuElementsFlat + ',' + item.val();
		}
	});
	
	$('[name="menuIdsFlat"]').val(menuElementsFlat);
	
	// category
	$('[name="menuCheckCategory"]:checked').each(function(){
		
		var item = $(this);
		
		if(!item.prop('disabled')){
			
			if(menuElementsCategory.length == 0)
				menuElementsCategory = item.val();
			else
				menuElementsCategory = menuElementsCategory + ',' + item.val();
		}
	});
	
	$('[name="menuIdsCategory"]').val(menuElementsCategory);
}

// チェックされたメニューに対して
function menuChangeCategory(checkId, checkFlag){
	
	// 自分を含まない自分の子供に対して
	for(var i = 0; i < menuElementsCategory.length; i++){
		
		if(menuElementsCategory[i].id != checkId && menuElementsCategory[i].id.indexOf(checkId) == 0)
			menuElementsCategory[i].checked = checkFlag;
	}
	
	// 親メニューに対して
	menuChangeCategoryParent(checkId, checkFlag);
}

// 親メニューに対して
function menuChangeCategoryParent(checkId, checkFlag){
	
	var checkIdArr = checkId.split(':');
	
	var parentId;
	
	if(checkIdArr.length > 1){
		
		for(var i = 0; i < checkIdArr.length - 1; i++){
			
			if(parentId == undefined)
				parentId = checkIdArr[i];
			else
				parentId = parentId + checkIdArr[i];
			
			if(i != checkIdArr.length - 2)
				parentId = parentId + ":";
		}
	}

	if(parentId == undefined)
		return;
	else{
		
		if(checkFlag)
			document.getElementById(parentId).checked = checkFlag;
		else{
			
			var checkedElements = new Array();
			
			for(var i = 0; i < menuElementsCategory.length; i++){
				
				if(menuElementsCategory[i].id != parentId && menuElementsCategory[i].id.indexOf(parentId) == 0){
					
					if(menuElementsCategory[i].checked)
						checkedElements[checkedElements.length] = menuElementsCategory[i].id;
				}
			}

			if(checkedElements.length == 0)
				document.getElementById(parentId).checked = checkFlag;
		}
	}

	menuChangeCategoryParent(parentId, checkFlag);
}

function initMenuDiv(){
	
	var categoryDiv = document.getElementById("categoryDiv");
	var flatDiv = document.getElementById("flatDiv");

	if(fbMenuType == '' || fbMenuType == 0){
		categoryDiv.style.display = "";
		flatDiv.style.display = "none";
	}else{
		categoryDiv.style.display = "none";
		flatDiv.style.display = "";
	}
}

window.onload = function(){
	
	// init menu
	menuElementsCategory = document.getElementsByName("menuCheckCategory");
	menuElementsFlat = document.getElementsByName("menuCheckFlat");
	initMenuDiv();

	// init power
	userPowerChange($('[name="power"]:checked')[0]);
}

function menuTypeChange(menuType){
	
	var categoryDiv = document.getElementById("categoryDiv");
	var flatDiv = document.getElementById("flatDiv");
	
	// カテゴリ
	if(menuType == 0){
		
		categoryDiv.style.display = "";
		flatDiv.style.display = "none";
	}

	// フラット
	if(menuType == 1){
		
		categoryDiv.style.display = "none";
		flatDiv.style.display = "";
	}
}

function userPowerChange(powerRadio){
	
	// スーパーユーザー
	if(powerRadio.value == "1"){
		
		$('.power-super').css('display', '');
		$('.power-admin').css('display', '');
		
		$('.power-super-check').prop('disabled', false);
		$('.power-admin-check').prop('disabled', false);
	
	// 管理者
	}else if(powerRadio.value == 2){
		
		$('.power-super').css('display', 'none');
		$('.power-admin').css('display', '');
		
		$('.power-super-check').prop('disabled', true);
		$('.power-admin-check').prop('disabled', false);
	
	// 一般ユーザー
	}else{
		
		$('.power-super').css('display', 'none');
		$('.power-admin').css('display', 'none');
		
		$('.power-super-check').prop('disabled', true);
		$('.power-admin-check').prop('disabled', true);
	}
}

//*************** init
//***** check all checkbox
var sensorCatigories = ['elect', 'gas', 'heavyOil', 'flow', 'hr', 'input', 'node', 'env'];
for(var i = 0; i < sensorCatigories.length; i++) {
	
	var ctg = sensorCatigories[i];
	var checkCtg = checkSensorIds.filter('.' + ctg);
	
	if(checkCtg.length > 0) {
		
		if(checkCtg.filter(':checked').length == checkCtg.length)
			$('#check-' + ctg + '-all').prop('checked', true);
		else
			$('#check-' + ctg + '-all').prop('checked', false);
	}
}
//_____ check all checkbox
//_______________ init