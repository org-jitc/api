//***** new
var newModal = $('#newModal');
var networkSelectNew = $('#networkSelectNew');
let newWuIpObj = {
	ip1: document.querySelector('[name="newWuIp1"]'),
	ip2: document.querySelector('[name="newWuIp2"]'),
	ip3: document.querySelector('[name="newWuIp3"]'),
	ip4: document.querySelector('[name="newWuIp4"]'),
	port: document.querySelector('[name="newWuIpPort"]'),
	hdd: document.querySelector('[name="newWuIpAddress"]'),
	err: document.querySelector('#errNewWuIp'),
	reIp: /^(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/,
	getFullAddress: function(){
		return [[this.ip1.value, this.ip2.value, this.ip3.value, this.ip4.value].join('.'), this.port.value].join(':');
	},
	clear: function(){
		
		this.ip1.value = '';
		this.ip2.value = '';
		this.ip3.value = '';
		this.ip4.value = '';
		this.port.value = '';
		
		this.clearError();
	},
	clearError: function(){
		this.err.innerText = '';
	},
	error: function(msg){
		this.err.innerText = msg;
	},
	isValid: function(){
		
		this.clearError();
		let valid = true;
		
		let ip1 = this.ip1.value;
		let ip2 = this.ip2.value;
		let ip3 = this.ip3.value;
		let ip4 = this.ip4.value;
		let port = this.port.value;
		
		if(ip1 == '' || ip2 == '' || ip3 == '' || ip4 == '' || port == ''){
			
			valid = false;
			this.error('IPアドレスを入力してください。');
		}else{
			
			valid = this.reIp.test(this.getFullAddress());
			if(!valid)
				this.error('IPアドレスが不正です。');
		}
			
		return valid;
	},
	setHidden: function(){
		this.hdd.value = this.getFullAddress();
	}
};
let newWuChildIdObj = {
	el: document.querySelector('[name="newWuChildId"]'),
	err: document.querySelector('#errNewWuChildId'),
	isValid: function(){
		
		this.clearError();
		let valid = true;
		
		let val = this.el.value;
		
		if(val == ''){
			
			valid = false;
			this.error('親機IDを入力してください。');
		}else{
			
			valid = !isNaN(val) && (val >= 0 || val <= 99);
			if(!valid)
				this.error('親機IDが不正です。');
		}
		
		return valid;
	},
	clear: function(){
		
		this.el.value = '';
		
		this.clearError();
	},
	clearError: function(){
		this.err.innerText = '';
	},
	error: function(msg){
		this.err.innerText = msg;
	},
	val: function(){
		return this.el.value;
	}
};
var unitIdNew = $('#unitIdNew');
var errUnitIdNew = $('#errUnitIdNew');
var unitNameNew = $('#unitNameNew');
var errUnitNameNew = $('#errUnitNameNew');
var unitTypeSelectNew = $('#unitTypeSelectNew');
var newSubmit = $('#newSumbit');
var newForm = $('#newForm');
//_____ new
//***** eidt
var editModal = $('#editModal');
var tdIpAddressEdit = $('#tdIpAddressEdit');
var tdChildIdEdit = $('#tdChildIdEdit');
var tdUnitIdEdit = $('#tdUnitIdEdit');
var unitNameEdit = $('#unitNameEdit');
var errUnitNameEdit = $('#errUnitNameEdit');
var unitTypeSelectEdit = $('#unitTypeSelectEdit');
var editSubmit = $('#editSubmit');
var editForm = $('#editForm');
var errNotChange = $('#errorNotChange');
//_____ edit
//***** delete 
var delModal = $('#delModal');
var networkSelectDel = $('#networkSelectDel');
var tdIpAddressDel = $('#tdIpAddressDel');
var tdChildIdDel = $('#tdChildIdDel');
var tdUnitIdDel = $('#tdUnitIdDel');
var tdUnitNameDel = $('#tdUnitNameDel');
var tdUnitTypeDel = $('#tdUnitTypeDel');
var delSubmit = $('#delSubmit');
var delForm = $('#delForm');
//_____ delete
// network new error
var divNetworkNewError = $('#div-network-new-error');
var ipAddress1 = $('[name="ipAddress1"]');
var ipAddress2 = $('[name="ipAddress2"]');
var ipAddress3 = $('[name="ipAddress3"]');
var ipAddress4 = $('[name="ipAddress4"]');
var port = $('[name="port"]');
var networkChildId = $('[name="networkChildId"]');
var networkNewForm = $('#networkNewForm');
var tdNetworkIpAddressDel = $('#td-network-ipAddress-del');
var tdNetworkChildIdDel = $('#td-network-childId-del');
var modalNetworkDel = $('#modalNetworkDel');
var btnNetworkDelSubmit = $('#btnNetworkDelSubmit');
var networkDelForm = $('#networkDelForm');
var networkDelIpAddress = $('[name="networkDelIpAddress"]');
var networkDelChildId = $('[name="networkDelChildId"]');

var editTr = null;
var delTr = null;

//******************** functions
//***** new
function newWirlessUnit(){
	
	initNewModal();
	newModal.modal('show');
}
function initNewModal(){
	
	//==> clear ip and port 
	newWuIpObj.clear();
	//==> clear child id
	newWuChildIdObj.clear();
	//==> clear unit id
	unitIdNew.val('');
	//==> set unit type selected index as 0
	unitTypeSelectNew.attr('selectedIndex', 0);
}
newSubmit.click(function(){
	
	//==> clear unit id error
	errUnitIdNew.html('');
	//==> clear unit name error
	errUnitNameNew.html('');
	
	let isValid = true;
	//==> ip address
	isValid = isValid && newWuIpObj.isValid();
	//==> child Id
	isValid = isValid && newWuChildIdObj.isValid();
	//==> unit 
	var unitId = unitIdNew.val();
	unitId = unitId.replace(' ', '');
	unitId = unitId.replace('	', '');
	// unit id
	if(unitId.length == 0) {
		
		errUnitIdNew.html(fmtUnitIdRequired);
		isValid = false;
	}else {
		
		let unitIdInt = parseInt(unitId);
		if(isNaN(unitIdInt)) {
			
			errUnitIdNew.html(fmtUnitIdNotNum);
			isValid = false;
		}else {
			
			if($('[data-id="' + newWuIpObj.getFullAddress() + '-' + newWuChildIdObj.val() + '-' + unitId + '"]').length > 0){
				
				errUnitIdNew.html(fmtUnitIdRegistered);
				isValid = false;
			}
		}
	}
	// unit name
	var unitName = unitNameNew.val();
	unitName = unitName.replace(' ', '');
	unitName = unitName.replace('	', '');
	if(unitName.length == 0){
		
		errUnitNameNew.html(fmtUnitNameRequired);
		isValid = false;
	}else {
		
		if($('[data-unitName="' + unitName + '"]').length > 0) {
			
			errUnitNameNew.html(fmtUnitNameRegistered);
			isValid = false;
		}
	}
	
	if(isValid){
		
		//==> set hidden ip address value
		newWuIpObj.setHidden();
		//==> submit form
		newForm.submit();
	}
});
//_____ new

//***** eidt
function editWirelessUnit(element) {
	
	var button = $(element);
	editTr = button.parent().parent().parent();
	
	var ipAddressTd = editTr.find('.td-ipAddress');
	var childIdTd = editTr.find('.td-childId');
	var unitNameTd = editTr.find('.td-unitName');
	var unitTypeTd = editTr.find('.td-unitType');
	
	tdIpAddressEdit.html(ipAddressTd.attr('data-ipAddress'));
	tdChildIdEdit.html(childIdTd.attr('data-childId'));
	tdUnitIdEdit.html(button.attr('data-unitId'));
	unitNameEdit.val(unitNameTd.attr('data-unitName'));
	unitTypeSelectEdit.val(unitTypeTd.attr('data-unitTypeId'));
	
	editModal.modal('show');
}
editSubmit.click(function() {
	
	errNotChange.html('');
	errUnitNameEdit.html('');
	
	var isValid = true;
	var isChanged = false;
	var unitName = unitNameEdit.val();
	unitName = unitName.replace(' ', '');
	unitName = unitName.replace('	', '');
	
	if(unitName.length == 0){
		
		errUnitNameEdit.html(fmtUnitNameRequired);
		isValid = false;
	}else{
		
		var curUnitName = editTr.find('.td-unitName').attr('data-unitName');
		var curUnitType = editTr.find('.td-unitType').attr('data-unitTypeId');
		
		if(curUnitName != unitName){
			
			isChanged = true;
			
			if($('[data-unitName="' + unitName + '"]').length > 0){
				
				isValid = false;
				errUnitNameEdit.html(fmtUnitNameRegistered);
			}
		}
		if(curUnitType != unitTypeSelectEdit.val())
			isChanged = true;
		
		if(!isChanged){
			
			errNotChange.html(fmtNotChanged);
			isValid = false;
		}
	}
	
	if(isValid){
		
		var ipAddress = editTr.find('.td-ipAddress').attr('data-ipAddress');
		var childId = editTr.find('.td-childId').attr('data-childId');
		
		editForm.find('[name="ipAddress"]').val(ipAddress);
		editForm.find('[name="childId"]').val(childId);
		editForm.find('[name="unitId"]').val(editTr.find('.td-unitId').attr('data-unitId'));
		
		editForm.submit();
	}
});
//_____ edit

//***** delete
function deleteWirelessUnit(element){
	
	var button = $(element);
	delTr = button.parent().parent().parent();
	
	tdIpAddressDel.html(delTr.find('.td-ipAddress').html());
	tdChildIdDel.html(delTr.find('.td-childId').html());
	tdUnitIdDel.html(button.attr('data-unitId'));
	tdUnitNameDel.html(delTr.find('.td-unitName').html());
	tdUnitTypeDel.html(delTr.find('.td-unitType').html());
	
	delModal.modal('show');
}
delSubmit.click(function(){
	
	delForm.find('[name="ipAddress"]').val(delTr.find('.td-ipAddress').attr('data-ipAddress'));
	delForm.find('[name="childId"]').val(delTr.find('.td-childId').attr('data-childId'));
	delForm.find('[name="unitId"]').val(delTr.find('.td-unitId').attr('data-unitId'));
	
	delForm.submit();
});
//_____ delete

//****** network new submit
function networkSubmitNew() {
	
	divNetworkNewError.html('');
	var ip1 = $.trim(ipAddress1.val());
	var ip2 = $.trim(ipAddress2.val());
	var ip3 = $.trim(ipAddress3.val());
	var ip4 = $.trim(ipAddress4.val());
	var p = $.trim(port.val());
	var childId = $.trim(networkChildId.val());
	
	if(ip1 == '' && ip2 == '' && ip3 == '' && ip4 == '' && p == '')
		divNetworkNewError.append('<div>IPアドレスを入力してください。</div>');
	else {
		
		if(ip1 == '' || ip2 == '' || ip3 == '' || ip4 == '' || p == '')
			divNetworkNewError.append('<div>入力されたIPアドレスが不正です。</div>');
		else {
			
			var isIp1Num = !isNaN(parseInt(ip1));
			var isIp2Num = !isNaN(parseInt(ip2));
			var isIp3Num = !isNaN(parseInt(ip3));
			var isIp4Num = !isNaN(parseInt(ip4));
			var isportNum = !isNaN(parseInt(p));
			
			if(!isIp1Num || !isIp2Num || !isIp3Num || !isIp4Num || !isportNum)
				divNetworkNewError.append('<div>入力されたIPアドレスが不正です。</div>');
		}
	}
	if(childId == '')
		divNetworkNewError.append('<div>親機IDを入力してください。</div>');
	
	if(divNetworkNewError.html() != '')
		return;
	else {

		var duplicateNum = $('[data-class="network-' + ip1 + "." + ip2 + "." + ip3 + "." + ip4 + ":" + p + '-' + childId + '"]').length;
		if(duplicateNum > 0) {
			
			divNetworkNewError.append('<div>入力されたネットワークは既に登録されています。</div>');
			return;
		}
	}
	
	networkNewForm.submit();
}
//______ network new submit

//***** network delete confirm
function networkDeleteConfirm(btnDel) {
	
	var trClass = $(btnDel).parent().parent().attr('data-class');
	var trClassArr = trClass.split('-');
	
	tdNetworkIpAddressDel.html(trClassArr[1]);
	tdNetworkChildIdDel.html(trClassArr[2]);
	
	modalNetworkDel.modal('show');
}
//_____ network delete confirm

//***** network delete submit
btnNetworkDelSubmit.click(function(){
	
	var ip = $.trim(tdNetworkIpAddressDel.html());
	var childId = $.trim(tdNetworkChildIdDel.html());
	
	networkDelIpAddress.val(ip);
	networkDelChildId.val(childId);
	
	networkDelForm.submit();
});
//_____ network delete submit