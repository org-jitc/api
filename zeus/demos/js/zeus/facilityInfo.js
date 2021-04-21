//-> 業種データモデル定義
let chkIndustryId = document.querySelectorAll('[name="industryId"]');
let	hddIndustryName = document.querySelector('[name="industryNameStr"]');
//<- 業種データモデル定義
let tdfkName = document.querySelector('#tdfkName');

//-> formをsubmitする前に選択された業種により，選択された業種の名前を設定
function beforeSubmit(){
	let nameSpan, chk;
	let industryNames = '';
	
	for(let i = 0, l = chkIndustryId.length; i < l; i++){
		chk = chkIndustryId[i];
		
		if(chk.checked){
			nameSpan = chk.nextElementSibling;
			
			if(industryNames != ''){
				industryNames = industryNames + ',';
			}
			industryNames = industryNames + nameSpan.innerText;
		}
	}
	hddIndustryName.value = industryNames;
}
//<- formをsubmitする前に選択された業種により，選択された業種の名前を設定

$('#tdfkChoose').click(function(){
	$('#tdfkPopup').modal('toggle');
});

$('area').click(function(){
	let value_tdfkName = $(this).attr('alt');
	$('#tdfkText').html(value_tdfkName);
	tdfkName.value = value_tdfkName;
	$('[name="tdfkId"]').val($(this).attr('id'));
	$('#tdfkPopup').modal('toggle');
});

//*************** init
if(fbTDFKId != ''){
	let value_tdfkName = $('#' + fbTDFKId).attr('alt');
	$('#tdfkText').html(value_tdfkName);
	tdfkName.value = value_tdfkName;
}
//_______________ init