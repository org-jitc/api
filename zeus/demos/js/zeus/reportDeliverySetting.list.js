let btnSave = document.querySelector('#btn-save');
let divErrAll = document.querySelector('#div-err-all');
let trUser = document.querySelectorAll('.tr-user');
let rdoDeliver = document.querySelectorAll('.report-deliver');
let chkReportType = document.querySelectorAll('.report-type');

//-> report type change event
function chkReportTypeChange(){
	
	let name = this.getAttribute('name');
	let userId = name.replace('chkReportType-', '');
	
	//==> extra demand graph
	let chkExtra = document.querySelectorAll('[name="' + (this.value === 'd'? 'chkExtraDaily-': 'chkExtraMonthly-') + userId + '"]');
	for(let i = 0, l = chkExtra.length; i < l; i++)
		chkExtra[i].disabled = this.disabled || !this.checked;
	//<== extra demand graph
	
	//==> extra yearly for monthly report
	if(this.value === 'm'){
		
		chkExtra = document.querySelector('[name="chkExtraYearly-' + userId + '"]');
		chkExtra.disabled = this.disabled || !this.checked;
	}
	//<== extra yearly for monthly report
}

//-> report deliver change event
function rdoDeliverChange(){
	
	let name = this.getAttribute('name');
	let userId = name.replace('rdoReportDeliver-', '');
	
	let chkReportType = document.querySelectorAll('[name="chkReportType-' + userId + '"]');
	for(let i = 0, l = chkReportType.length; i < l; i++){
		
		chkReportType[i].disabled = this.value == 0;
		trigger(chkReportType[i], 'onchange');
	}
}

//-> check if has error
function checkError(){
	
	divErrAll.innerText = '';
	
	let userId, deliver, type, err;
	let isError = false;
	for(let i = 0, l = trUser.length; i < l; i++){
		
		//-> user id
		userId = trUser[i].id;
		
		//-> error div
		err = document.querySelector('#div-err-' + userId);
		err.innerText = '';
		
		//-> is deliver
		deliver = document.querySelector('[name="rdoReportDeliver-' + userId + '"]:checked');
		if(deliver.value == 1){
			
			//==> check report type
			//===> at least one report type checked
			type = document.querySelectorAll('[name="chkReportType-' + userId + '"]:checked');
			if(type.length == 0){

				isError = true;
				err.innerText = 'レポート種類を選択してください。';
			}
		}		
	}
	
	if(isError)
		divErrAll.innerText = '不正な入力がございます。各項目で確認してください。';
	
	return isError;
}

//-> get changed obj
function getChanges(){
	
	let changedObj = {};
	let originUserObj, userObj, extraObj, userId, deliver, type, typeStr, extra, extraStr, originExtraStr;
	let isChanged = false;
	for(let i = 0, l = trUser.length; i < l; i++){
		
		//-> initialization
		isChanged = false;
		
		//-> user id
		userId = trUser[i].id;
	
		//-> get origin settings
		originUserObj = origin[userId];
		
		//-> is deliver
		deliver = document.querySelector('[name="rdoReportDeliver-' + userId + '"]:checked');
		if(originUserObj.isDeliver != deliver.value)
			isChanged = true;
		
		//-> check report type && monthly extra yearly && extra options
		//==> check only when the is deliver value is 1 and report type not changed
		if(!isChanged && deliver.value == 1){
			
			//-> check report type
			//===> at least one report type checked
			type = document.querySelectorAll('[name="chkReportType-' + userId + '"]:checked');
			typeStr = chk_join(type, ',');
			if(originUserObj.reportType != typeStr)
				isChanged = true;
			
			//-> check monthly extra yearly
			extra = document.querySelector('[name="chkExtraYearly-' + userId + '"]');
			extraStr = !extra.disabled && extra.checked? 1: 0;
			if(originUserObj.monthlyExtraYearly != extraStr)
				isChanged = true;
			
			//-> check extra options
			if(!isChanged){
				
				//-> daily
				originExtraStr = originUserObj.extra == null? null: originUserObj.extra.d;
				extra = document.querySelectorAll('[name="chkExtraDaily-' + userId + '"]:checked');
				extraStr = chk_join(extra, ',');
				if(originExtraStr != extraStr)
					isChanged = true;
				
				//-> monthly
				originExtraStr = originUserObj.extra == null? null: originUserObj.extra.m;
				extra = document.querySelectorAll('[name="chkExtraMonthly-' + userId + '"]:checked');
				extraStr = chk_join(extra, ',');
				if(originExtraStr != extraStr)
					isChanged = true;
			}
		}
		
		if(isChanged){
			
			userObj = {};
			//-> set is deliver
			userObj.isDeliver = deliver.value;
			
			if(deliver.value == 1){
				
				//-> set report type
				type = document.querySelectorAll('[name="chkReportType-' + userId + '"]:checked');
				typeStr = chk_join(type, ',');
				userObj.reportType = typeStr;
				
				//-> set monthly extra yearly
				type = document.querySelector('[name="chkExtraYearly-' + userId + '"]');
				typeStr = !type.disabled && type.checked? 1: 0;
				userObj.monthlyExtraYearly = typeStr;
				
				//-> set extra option
				//==> get extra daily
				extra = document.querySelectorAll('[name="chkExtraDaily-' + userId + '"]:checked');
				extraStr = chk_join(extra, ',');
				
				//==> get extra monthly
				extra = document.querySelectorAll('[name="chkExtraMonthly-' + userId + '"]:checked');
				originExtraStr = chk_join(extra, ',');
				
				if(extraStr != null || originExtraStr != null){
					
					extraObj = {};
					//==> set extra daily
					if(extraStr != null)
						extraObj.d = extraStr;
					
					//==> set extra monthly
					if(originExtraStr != null)
						extraObj.m = originExtraStr;
					
					//==> put extra options
					userObj.extra = extraObj;
				}
			}
			
			//<- set extra option
			changedObj[userId] = userObj;
		}
	}
	
	return changedObj;
}

function ReportCreator(){
	
	function onReportTypeChange(){
		
		if(this.value == 'd'){
			
			datePickerOption.minViewMode = 0;
			datePickerOption.format = 'yyyy-mm-dd';
		}else{
			
			datePickerOption.minViewMode = 1;
			datePickerOption.format = 'yyyy-mm';
		}
		
		$(divDateComp).datepicker('destroy').datepicker(datePickerOption);
		$(divDateComp).datepicker('update', '');
	}
	
	function isInputValid(){
		
		errReportCreator.innerHTML = '';
		let errSpan = null;
		//-> report date
		let reportDate = divDateComp.querySelector('.form-control').value.trim();
		if(reportDate == ''){
			
			errSpan = document.createElement('div');
			errSpan.innerText = '作成日付を選択してください。';
			errReportCreator.appendChild(errSpan);
		}else{
			
			let isValidDate;
			if(reportTypeDay.checked)
				isValidDate = moment(reportDate, 'YYYY-MM-DD', true).isValid();
			else
				isValidDate = moment(reportDate, 'YYYY-MM', true).isValid();
			
			if(!isValidDate){
				
				errSpan = document.createElement('div');
				errSpan.innerText = '作成日付はYYYY-MM-DDまたはYYYY-MM形式の日付を選択または入力してください。';
				errReportCreator.appendChild(errSpan);
			}
		}
		
		//-> report user
		if(reportUser.value == ''){
			
			errSpan = document.createElement('div');
			errSpan.innerText = 'ユーザーを選択してください。';
			errReportCreator.appendChild(errSpan);
		}else{
			
			//-> is send report
			let isSendReport = document.querySelector('[name="rdoReportDeliver-' + reportUser.value + '"]:checked').value;
			//-> if not set to send report
			if(isSendReport == 0){
				
				errSpan = document.createElement('div');
				errSpan.innerText = '選択されたユーザーはレポートを送信しない設定になっているため操作できません。';
				errReportCreator.appendChild(errSpan);
			}else{
				
				let reportType = reportTypeDay.checked? 'd': 'm';
				let isReportTypeChecked = document.querySelector('[name="chkReportType-' + reportUser.value + '"][value="' + reportType + '"]').checked;
				//-> if not current report type checked
				if(!isReportTypeChecked){
					
					errSpan = document.createElement('div');
					let reportTypeName = reportTypeDay.checked? '日次レポート': '月次レポート';
					errSpan.innerText = '選択されたユーザーの' + reportTypeName + 'がチェックされていないため操作できません。';
					errReportCreator.appendChild(errSpan);
				}
			}
		}
		
		return errSpan == null;
	}
	
	function createReport(type){
		
		let reportParam = {};
		reportParam.reportType = reportTypeDay.checked? 'd': 'm';
		reportParam.date =  divDateComp.querySelector('.form-control').value.trim();
		reportParam.userId = reportUser.value;
		reportParam.type = type;
		
		btnDownload.disabled = true;
		btnSendMail.disabled = true;
		
		$.ajax({
			url: contextPath + 'Ajax/ReportDeliverySetting/CreateReport.action',
			async: true,
			cache: false,
			method: 'POST',
			data: reportParam,
			success: function(resp){
				
				let respObj = JSON.parse(resp);
				if(respObj.error != null){
					popupError.setMessage(resp.error == 'sync'? '同期サーバーに接続できないため処理できませんでした。': 'エラーが発生しました。');
				}else{
					
					if(respObj.url != null){
						
						let downloadParam = {};
						downloadParam.action = contextPath + 'Ajax/ReportDeliverySetting/GetReport.action';
						let attrList = [];
						let attr = {};
						attr.name = "path";
						attr.value = respObj.url;
						attrList.push(attr);
						downloadParam.attrList = attrList;
						
						zeus.downloadFile(downloadParam);
					}else{
						popupMessage.setMessage('レポートを送りました。メールが届くまで少し時間がかかる場合があります。');
					}
				}
				
				btnDownload.disabled = false;
				btnSendMail.disabled = false;
			},
			error: function(){
				
				btnDownload.disabled = false;
				btnSendMail.disabled = false;
				popupError.setMessage('エラーが発生しました。');
			}
		});
	}
	
	let datePickerOption = {
		language: sysLanguage,
		format: 'yyyy-mm-dd',
		minViewMode: 0,
	    maxViewMode: 2,
		autoclose: true,
		todayBtn: 'linked',
		todayHighlight: true
	};
	
	//-> error div
	let errReportCreator = document.querySelector('#errReportCreator');
	//-> radio
	let reportTypeDay = document.querySelector('[name="reportType"][value="d"]');
	let reportTypeMonth = document.querySelector('[name="reportType"][value="m"]');
	//<- radio
	//-> date picker
	let divDateComp = document.querySelector('.input-group.date');
	//-> select
	let reportUser = document.querySelector('#reportUser');
	//-> button
	let btnDownload = document.querySelector('#btnDownload');
	let btnSendMail = document.querySelector('#btnSendMail');
	//<- button
	
	reportTypeDay.onchange = onReportTypeChange;
	reportTypeMonth.onchange = onReportTypeChange;
	
	btnDownload.onclick = function(){
		
		if(isInputValid())
			createReport('download');
	};
	btnSendMail.onclick = function(){
		
		if(isInputValid()){
			
			let mailOption = document.querySelector('option[value="' + reportUser.value + '"]');
			let mail = mailOption.getAttribute('data-mail');
			if(mail == ''){
				
				let errSpan = document.createElement('div');
				errSpan.innerText = '選択されたユーザーはメールアドレスが設定されていないためメール送信できません。';
				errReportCreator.appendChild(errSpan);
				errSpan = document.createElement('div');
				errSpan.innerText = 'ダウンロードボタンでダウンロードすることは可能です。';
				errReportCreator.appendChild(errSpan);
				
				return;
			}
			
			createReport('mail');
		}
	};
	
	//-> init
	$(divDateComp).datepicker(datePickerOption);
}

function init(){
	
	//-> add change event to report type checkbox
	//==> when report type checkbox change event triggered
	//===> checked: set extra option checkbox disabled as false
	//===> unchecked: set extra option checkbox disabled as true
	for(let i = 0, l = chkReportType.length; i < l; i++)
		chkReportType[i].addEventListener('change', chkReportTypeChange);
		
	//-> add change event to deliver radio
	//==> when deliver radio change event triggered
	//===> deliver: set report type checkbox disabled value as false
	//===> not deliver: set report type checkbox disabled value as true
	for(let i = 0, l = rdoDeliver.length; i < l; i++)
		rdoDeliver[i].addEventListener('change', rdoDeliverChange);
	
	//-> save button click event
	btnSave.addEventListener('click', function(){
		
		btnSave.disabled = true;
		
		let isError = checkError();
		console.log(isError);
		if(!isError){
			
			divErrAll.innerText = '';
			
			let changedObj = getChanges();
			if(JSON.stringify(changedObj) === '{}'){
				
				divErrAll.innerText = '変更されていません。';
				btnSave.disabled = false;
			}else{
				
				$.ajax({
					url: contextPath + 'Ajax/ReportDeliverySetting/Update.action',
					async: true,
					cache: false,
					data: {changed: JSON.stringify(changedObj)},
					success: function(resp){
						
						let respObj = JSON.parse(resp);
						if(respObj.error == null){
							
							alert('保存されました。');
							document.location.href = 'ReportDeliverySettingList.action';
						}else
							divErrAll.innerText = respObj.error;
						
						btnSave.disabled = false;
					},
					error: function(){
						
						divErrAll.innerText = 'リクエスト処理ができませんでした。';
						btnSave.disabled = false;
					}
				});
			}
		}else
			btnSave.disabled = false;
	});
	
	//-> report creator module initialization
	new ReportCreator();
}

//-> init
init();