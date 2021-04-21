//***** elements
var divDragResize = $('.div-drag-resize');
var divTabPane = $('.tab-pane');
var divInfo = $('.div-info');

var aTab = $('[data-toggle="tab"]');

var iAmSwitch = $('[id="i-am-switch"]');
var iSetting = $('[id="i-setting"]');

var btnSavePosition = $('#btn-savePosition');
var btnSettingCommit = $('#btn-setting-commit');
var btnSettingCancel = $('#btn-setting-cancel');

var divDLSlider = $('#div-dimming-level-slider');
var divSliderHandle = $('#div-slider-handle');

var spanDlUpdateStatus = $('#span-dl-update-status');
var spanSettingUpdateStatus = $('#span-setting-update-status');

var textTargetIll = $('#targetIll');
var textOnPower = $('#onPower');
var textOffPower = $('#offPower');

var modalSetting = $('#modal-setting');
//_____ elements

//***** variables
var windowWidth = $(window).width();
var groupPosition = {};
var groupIds = divDragResize.map(function(){
	return $(this).attr('id');
}).get().join(',');
var dimmingGroupData;
//* 調光レベルと設定変更をそれぞれのajaxで行い，全部終わるまでは，設定変更ボタンをスピンにする
var dimmingGroupUpdateStatus = {};

var errMsgRequired = '数字を入力してください。';
var errMsgNotChange = '変更されていません。';

var iModeMotion = '<i class="fas fa-child" style="color: green;"></i>';
var iModeIll = '<i class="far fa-lightbulb" style="color: green;"></i>';
var iSpinner = '<i class="fas fa-spinner fa-spin"></i>';
var iSpinnerClass = 'fas fa-spinner fa-spin';
//_____ variables