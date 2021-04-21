//***** definitions
var divDragResize = $('.div-drag-resize');
var divTabPane = $('.tab-pane');
var divPanelHeaders = $('.card-header');
var divMsgUpdateStatus = $('#div-msg-update-status');
var divSettingEnv = $('.div-setting-env');
var divStatusSuccess = $('.div-status-success');
var divStatusError = $('.div-status-error');
var divAmWithScheduleUpdateStatus = $('#div-am-with-schedule-update-status');

var aTab = $('[data-toggle="tab"]');

var btnSavePosition = $('#btn-savePosition');
var btnAm = $('#btn-am');
var btnNc = $('#btn-nc');
var btnSettingSubmit = $('#btn-setting-submit');
var btnSettingCancel = $('#btn-setting-cancel');
var btnAmWithScheduleSubmit = $('.btn-am-with-schedule-submit');
var btnAmWithoutScheduleSubmit = $('.btn-am-without-schedule-submit');

var modalSetting = $('#modal-setting');
var modalNoSchedule = $('#modal-no-schedule');
var modalAmWithSchedule = $('#modal-am-with-schedule');
var modalAmWithoutSchedule = $('#modal-am-without-schedule');

var radioRecoverNY = $('[name="radioRecoverNY"]');

var onMinute = $('#onMinute');
var offMinute = $('#offMinute');
var etee = $('#etee');
var ttc = $('#ttc');
var ttcHelp = $('#ttcHelp');
var otc = $('#otc');
var otcHelp = $('#otcHelp');
var tth = $('#tth');
var tthHelp = $('#tthHelp');
var oth = $('#oth');
var othHelp = $('#othHelp');
var wttco = $('#wttco');
var wttck = $('#wttck');
var wttcks = $('#wttcks');
var wttc = $('#wttc');
var wttho = $('#wttho');
var wtthk = $('#wtthk');
var wtthks = $('#wtthks');
var wtth = $('#wtth');
var wttcd = $('#wttcd');
var wtthd = $('#wtthd');
var tcmcm = $('.tcm-cm');
var cmCo2 = $('.cm-co2');
var cmNotCo2 = $('.cm-notCo2');

var minBoxSize = 36;
var nodePosition = {};
var currentNode = {};
var nodeStatusData;
var editData;
var statusCount = 4;
var font_size_heading_percent = 0.8;
var font_size_i_percent = 0.8;
var nodeIds = divDragResize.map(function(){return $(this).attr('id');}).get().join(',');
var nodeIdsArr = nodeIds.split(',');
var iSuccessPrefix = '<i class="far fa-check-circle text-success mr"></i>';
var iDangerPrefix = '<i class="far fa-times-circle text-danger mr"></i>';
var iQuestionClass = '<i class="far fa-question-circle"></i>';
var modeAutoStr = '自動';
var modeManualStr = '手動';
var scheduleToStr = 'スケジュール制御を{0}にする';
var scheduleKeepStr = 'スケジュール制御を{0}のままにする';
var modeSuccessMsg = '{0}への変更が成功しました。';
var modeFailureMsg = '{0}への変更が失敗しました。';
var requestErrorMsg = 'リクエスト処理ができませんでした。';
var couldNotChangeErrMsg = '変更できませんでした。しばらくしてからリトライしてください。';
//_____ definitions