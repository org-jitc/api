var colorPicker = $('.colorpicker-component');
var orderTab = $('[name="orderTab"]');
var orderGraph = $('[name="orderGraph"]');

//******************** init
colorPicker.colorpicker(btpColorPickerOption);
orderTab.attr('min', '1');
orderTab.stepper();
orderGraph.attr('min', '1');
orderGraph.stepper();
var stepper = $('.stepper');
stepper.css('margin', '0');
stepper.width(60);
//==================== init