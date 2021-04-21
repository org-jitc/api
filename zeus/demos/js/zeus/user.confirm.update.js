var powerAdminTrs = $('.power-admin-tr');
var powerSuperTrs = $('.power-super-tr');

if(reqUserPower == 0){
	
	powerAdminTrs.hide();
	powerSuperTrs.hide();
}else if(reqUserPower == 2)
	powerSuperTrs.hide();