//-> ↓　define basic date picker option 
mierukaStore.datePickerOptions = {
	startView: 0,
	minViewMode: 0,
	maxViewMode: 2,
	todayBtn: 'linked',
	language: sysLanguage,
	autoclose: true,
	todayHighlight: true
};
//<- ↑　define basic date picker option

//-> ↓　define error messages
mierukaStore.messages = {
	param: {
		date: fmtMsgParamDate,
		ym: fmtMsgParamYm,
		year: fmtMsgParamYear,
		getByViewSpan: function(viewSpan){
			
			if(viewSpan === 'y')
				return mierukaStore.messages.param.year;
			else if(viewSpan === 'm')
				return mierukaStore.messages.param.ym;
			else
				return mierukaStore.messages.param.date;
		}
	},
	err: {
		date: fmtErrDate,
		dateMulti: fmtErrDateMulti
	}
};
//<- ↑　define error messages

//-> ↓ define bootstrap table locale
mierukaStore.locale = {
	bootstrapTable: {
		ja: 'ja-JP',
		en: 'en-US',
		zh_CN: 'zh-CN',
		zh_TW: 'zh-TW',
		ko: 'ko-KR',
		getLocale: function(){
			
			let locale = mierukaStore.locale.bootstrapTable[sysLanguage];
			if(locale == null)
				locale = mierukaStore.locale.bootstrapTable['ja'];
			
			return locale;
		}
	}	
};
//-> ↑ define bootstrap table locale

function Mieruka(){
	
	function onDateArrowClick(){
		
		let item = $(this);
		let index = item.attr('data-index');
		let arrow = item.attr('data-arrow');
		
		let isSuccess = dateArrows.list[index].setMoment();
		if(isSuccess){
			
			// set datepickers
			let dp = null;
			if(arrow == 'left')
				dp = item.prev();
			else
				dp = item.prev().prev();
			dp.datepicker('setDate', dateArrows.list[index].mo.toDate());
		}
	}
	
	let _this = this;
	// define replacement of graph type values
	this.graphTypeIds = {
		0: 'monitoring',
		1: 'history'
	};
	// define replacement of view category values
	this.viewCategoryIds = {
		0: 'electricity',
		1: 'demand'
	};
	// define replacement of ex values
	this.exIds = {
		0: 'all',
		1: 'zoom'
	};
	// define replacement of view type value
	this.viewTypeIds = {
		0: 'period',
		1: 'compare'
	};
	
	//-> ↓ graph type object
	this.graphTypeObj = {
		tabs: $('[data-id="graphType"]'),
		activated: null,
		init: function(){
			
			this.tabs.on('show.bs.tab', function(){
				
				let href = this.getAttribute('href');
				_this.graphTypeObj.activated = href.replace('#', '');
				
				_this.sensorObj.filtering();
				
				if(_this.graphTypeObj.activated === 'monitoring')
					_this.timers.start();
				else
					_this.timers.stop();
			});
		}
	}
	this.graphTypeObj.init();
	//-> ↑ graph type object
	
	//-> ↓ view category obj
	this.viewCategoryObj = {
		monitoring: {
			tabs: $('[data-id="monitoringViewCategory"]'),
			activated: null,
			init: function(){
				
				_this.viewCategoryObj.monitoring.tabs.on('show.bs.tab', function(){
					
					let href = this.getAttribute('href');
					_this.viewCategoryObj.monitoring.activated = href.replace('#monitoring-', '');
					
					_this.sensorObj.filtering();
				});
			}
		},
		history: {
			tabs: $('[data-id="historyViewCategory"]'),
			elControlItem: document.querySelector('#liViewSpanH'),
			activated: null,
			init: function(){
				
				this.tabs.on('show.bs.tab', function(e){
					
					let href = this.getAttribute('href');
					let activatedId = href.replace('#history-', '');
					_this.viewCategoryObj.history.activated = activatedId;
					
					if(activatedId == 'demand'){
						
						let activatedViewSpan = _this.viewSpanObj.activated;
						if(activatedViewSpan == 'h')
							_this.viewSpanObj.tabs.filter('[href="#d"]').tab('show');
						
						zeus.hideElement(_this.viewCategoryObj.history.elControlItem);
						
						//-> hide graph sum button
						zeus.hideElement(_this.buttonObj.history.graph.sum);
						
						//-> ↓ 1. select elect tab
						//-> ↓ 2. hide other tab
						_this.dispUnitObj.activate('elect');
						_this.dispUnitObj.showOnly('elect');
						//-> ↑ select elect tab, hide other tab
					}else{
						
						zeus.showElement(_this.viewCategoryObj.history.elControlItem);
						
						//-> show graph sum button
						zeus.showElement(_this.buttonObj.history.graph.sum);
						
						//-> show all diplay unit
						_this.dispUnitObj.showAll();
					}
					
					_this.sensorObj.filtering();
				});
			}
		},
		init: function(){
			
			this.monitoring.init();
			this.history.init();
		}
	};
	this.viewCategoryObj.init();
	//<- ↑ view category object
	
	//-> ↓ graph y axis range type object
	this.graphYRangeType = {
		monitoring: {
			tabs: $('[data-id="monitoringGraphYRange"]'),
			activated: null,
			init: function(){
				
				_this.graphYRangeType.monitoring.tabs.on('show.bs.tab', function(){
					
					let href = this.getAttribute('href');
					_this.graphYRangeType.monitoring.activated = href.replace('#monitoring-');
				});
			}
		},
		history: {
			tabs: $('[data-id="historyGraphYRange"]'),
			activated: null,
			init: function(){
				
				_this.graphYRangeType.history.tabs.on('show.bs.tab', function(){
					
					let href = this.getAttribute('href');
					_this.graphYRangeType.history.activated = href.replace('#history-');
				});
			}
		},
		init: function(){
			
			this.monitoring.init();
			this.history.init();
		}
	};
	this.graphYRangeType.init();
	//-> ↑ graph y axis range object
	
	//-> ↓ monitoring update frequency
	this.monitoringUpdateFrequency = {
		el: document.querySelector('#monitoringUpdateFrequency'),
		data: {
			frequency: null
		},
		fn: {
			getCurrent: function(){
				return _this.monitoringUpdateFrequency.data.frequency * 1000;
			},
			init: function(){
				
				_this.monitoringUpdateFrequency.data.frequency = _this.monitoringUpdateFrequency.el.value;
				
				_this.monitoringUpdateFrequency.el.onchange = function(){
					
					_this.monitoringUpdateFrequency.data.frequency = this.value;
					_this.timers.graph.demand.resetTickTock();
				};
			}
		}
	};
	this.monitoringUpdateFrequency.fn.init();
	//-> ↑ monitoring update frequency
	
	//-> ↓ monitoring item object
	this.monitoringItem = {
		tabs: $('[data-id="monitoringItem"]'),
		activated: null,
		init: function(){
			
			this.tabs.on('show.bs.tab', function(){
				
				let href = this.getAttribute('href');
				_this.monitoringItem.activated = href.replace('#', '');
			});
		}
	};
	this.monitoringItem.init();
	//<- ↑ monitoring item object
	
	//-> ↓ electricity unit object
	this.electricityUnit = {
		tabs: $('[data-id="electricityUnit"]'),
		activated: null,
		init: function(){
			
			this.tabs.on('show.bs.tab', function(){
				
				let href = this.getAttribute('href');
				_this.electricityUnit.activated = href.replace('#electricityUnit-', '');
			});
		}
	}
	//<- ↑ electricity unit object
	
	//-> ↓ graph label display object
	this.graphLabelDisplay = {
		monitoring: {
			tabs: $('[data-id="monitoringGraphLabelDisplay"]'),
			activated: null,
			init: function(){
				
				_this.graphLabelDisplay.monitoring.tabs.on('show.bs.tab', function(){
					
					let href = this.getAttribute('href');
					_this.graphLabelDisplay.monitoring.activated = href.replace('#monitoring-label-', '');
				});
			}
		},
		history: {
			tabs: $('[data-id="historyGraphLabelDisplay"]'),
			activated: null,
			init: function(){
				
				_this.graphLabelDisplay.history.tabs.on('show.bs.tab', function(){
					
					let href = this.getAttribute('href');
					_this.graphLabelDisplay.history.activated = href.replace('#history-label-', '');
				});
			}
		},
		init: function(){
			
			this.monitoring.init();
			this.history.init();
		}
	}
	this.graphLabelDisplay.init();
	//<- ↑ graph label display object
	
	//-> view type object
	this.viewTypeObj = {
		tabs: $('[data-id="viewType"]'),
		elLabels: {
			period: document.querySelector('#span-period'),
			compare: document.querySelector('#span-compare')
		},
		activated: null,
		init: function(){
			
			this.tabs.on('show.bs.tab', function(e){
				
				let href = this.getAttribute('href');
				let activatedId = href.replace('#', '');
				_this.viewTypeObj.activated = activatedId;
				
				if(href == '#period'){
					
					zeus.showElement(_this.viewTypeObj.elLabels['period']);
					zeus.hideElement(_this.viewTypeObj.elLabels['compare']);
				}else{
					
					zeus.hideElement(_this.viewTypeObj.elLabels['period']);
					zeus.showElement(_this.viewTypeObj.elLabels['compare']);
				}
			});
		}
	};
	this.viewTypeObj.init();
	//<- view type object
	
	//-> view span object
	this.viewSpanObj = {
		tabs: $('[data-id="viewSpan"]'),
		activated: null,
		elControlItems: {
			months: document.querySelectorAll('.span-month'),
			days: document.querySelectorAll('.span-day'),
			hours: document.querySelectorAll('.span-hour')
		},
		initElControlItems: function(){
			
			this.elControlItems.months = document.querySelectorAll('.span-month');
			this.elControlItems.days = document.querySelectorAll('.span-day');
			this.elControlItems.hours = document.querySelectorAll('.span-hour');
		},
		init: function(){
			
			this.tabs.on('show.bs.tab', function(e){
				
				let href = this.getAttribute('href');
				let activatedId = href.replace('#', '');
				
				//-> set activated tab's id
				_this.viewSpanObj.activated = activatedId;
				
				if('m,d,h'.indexOf(activatedId) >= 0)
					zeus.showElement(_this.viewSpanObj.elControlItems['months']);
				else
					zeus.hideElement(_this.viewSpanObj.elControlItems['months']);
				
				if('d,h'.indexOf(activatedId) >= 0)
					zeus.showElement(_this.viewSpanObj.elControlItems['days']);
				else
					zeus.hideElement(_this.viewSpanObj.elControlItems['days']);
				
				if('h' == activatedId)
					zeus.showElement(_this.viewSpanObj.elControlItems['hours']);
				else
					zeus.hideElement(_this.viewSpanObj.elControlItems['hours']);
				
				//-> ↓ set datepicker mode
				if(activatedId == 'y'){
					
					mierukaStore.datePickerOptions.startView = 2;
					mierukaStore.datePickerOptions.minViewMode = 2;
				}else if(activatedId == 'm'){
					
					mierukaStore.datePickerOptions.startView = 1;
					mierukaStore.datePickerOptions.minViewMode = 1;
				}else{
					
					mierukaStore.datePickerOptions.startView = 0;
					mierukaStore.datePickerOptions.minViewMode = 0;
				}
				
				_this.datePicker.fn.initDatePicker();
				//<- ↑ set datepicker mode
			});
		}
	};
	this.viewSpanObj.init();
	//-> view span object
	
	//-> ↓ dispUnit object
	this.dispUnitObj = {
		tabs: {
			li: document.querySelectorAll('[data-id="liDispUnit"]'),
			a: $('[data-id="aDispUnit"]')
		},
		activated: null,
		init: function(){
			
			this.tabs.a.on('show.bs.tab', function(e){
				
				let href = this.getAttribute('href');
				_this.dispUnitObj.activated = href.replace('#', '');
				
				_this.sensorObj.filtering();
			});
		},
		activate: function(id){
			
			if(this.activated != id)
				this.tabs.a.filter('[href="#' + id + '"]').tab('show');
		},
		showOnly: function(id){
			
			let elShow, elLi, href;
			let elHideArr = [];
			
			for(let i = 0, l = this.tabs.li.length; i < l; i++){
				
				elLi = this.tabs.li[i];
				href = this.tabs.a[i].getAttribute('href');
				
				if(href == '#' + id)
					elShow = elLi;
				else
					elHideArr.push(elLi);
			}
			
			zeus.showElement(elShow);
			zeus.hideElement(elHideArr);
		},
		showAll: function(){
			zeus.showElement(this.tabs.li);
		}
	};
	this.dispUnitObj.init();
	//<- ↑ dispUnit object
	
	//-> ↓ environment options
	this.envOptionsObj = {
		monitoring: {
			options: document.querySelectorAll('[name="monitorOptionRt"]'),
			checked: [],
			init: function(){
				
				let option;
				for(let i = 0, l = _this.envOptionsObj.monitoring.options.length; i < l; i++){
					
					option = _this.envOptionsObj.monitoring.options[i];
					//-> ↓ initialize checked
					if(option.checked)
						_this.envOptionsObj.monitoring.checked.push(option.value);
					//<- ↑ initialize checked
					
					//-> ↓ attach onchange event
					option.onchange = function(){
						
						if(this.checked)
							_this.envOptionsObj.monitoring.checked.push(this.value);
						else
							_this.envOptionsObj.monitoring.checked.splice(_this.envOptionsObj.monitoring.checked.indexOf(this.value), 1);
						
						_this.sensorObj.filtering();
					};
					//<- ↑ attach onchange event
				}
			}
		},
		history: {
			options: document.querySelectorAll('[name="monitorOption"]'),
			valueOptions: document.querySelectorAll('[name="valueOption"]'),
			checkedOptions: [],
			checkedValueOptions: [],
			init: function(){
				
				let option;
				//-> ↓ options
				for(let i = 0, l = _this.envOptionsObj.history.options.length; i < l; i++){
					
					option = _this.envOptionsObj.history.options[i];
					//--> ↓↓ initialize checked
					if(option.checked)
						_this.envOptionsObj.history.checkedOptions.push(option.value);
					//<-- ↑↑ initialize checked
					
					//--> ↓↓ attach onchange event
					option.onchange = function(){
						
						if(this.checked)
							_this.envOptionsObj.history.checkedOptions.push(this.value);
						else
							_this.envOptionsObj.history.checkedOptions.splice(_this.envOptionsObj.history.checkedOptions.indexOf(this.value), 1);
						
						_this.sensorObj.filtering();
					};
					//<-- ↑↑ attach onchange event
				}
				//<- ↑ options
				
				//-> ↓ value options
				for(let i = 0, l = _this.envOptionsObj.history.valueOptions.length; i < l; i++){
					
					option = _this.envOptionsObj.history.valueOptions[i];
					//--> ↓↓ initialize checked
					if(option.checked)
						_this.envOptionsObj.history.checkedValueOptions.push(option.value);
					//<-- ↑↑ initialize checked
					
					//--> ↓↓ attach onchange event
					option.onchange = function(){
						
						if(this.checked)
							_this.envOptionsObj.history.checkedValueOptions.push(this.value);
						else
							_this.envOptionsObj.history.checkedValueOptions.splice(_this.envOptionsObj.history.checkedValueOptions.indexOf(this.value), 1);
						
						if(_this.envOptionsObj.history.checkedValueOptions.length == 0){
							
							let avg = document.querySelector('[name="valueOption"][value="av"]');
							avg.checked = true;
							_this.envOptionsObj.history.checkedValueOptions.push('av');
						}
					};
					//<-- ↑↑ attach onchange event
				}
				//-> ↑ value options
			}
		},
		init: function(){
			
			this.monitoring.init();
			this.history.init();
		}
	}
	this.envOptionsObj.init();
	//-> ↑ environment options
	
	//-> ↓　group object
	this.groupObj = {
		elAll: document.querySelector('#checkGroupAll'),
		elGroups: document.querySelectorAll('.group'),
		checked: mierukaStore.group == null? []: mierukaStore.group.checkedIds.split(','),
		onAllChange: function(){
			
			let elGroup, groupId, checkedIndex;
			for(let i = 0, l = _this.groupObj.elGroups.length; i < l; i++){
				
				elGroup = _this.groupObj.elGroups[i];
				elGroup.checked = this.checked;
				
				if(this.checked){
					
					groupId = elGroup.value;
					checkedIndex = _this.groupObj.checked.indexOf(groupId);
					
					if(checkedIndex < 0)
						_this.groupObj.checked.push(groupId);
				}
			}
			
			if(!this.checked)
				_this.groupObj.checked = [];
			
			_this.sensorObj.filtering();
		},
		onChange: function(){
			
			if(this.checked){
				
				_this.groupObj.checked.push(this.value);
			}else{
				
				let checkedIndex = _this.groupObj.checked.indexOf(this.value);
				if(checkedIndex >= 0)
					_this.groupObj.checked.splice(checkedIndex, 1);
			}
			
			let checkedLen = _this.groupObj.checked.length;
			if(checkedLen != _this.groupObj.elGroups.length){
				
				if(_this.groupObj.elAll.checked)
					_this.groupObj.elAll.checked = false;
			}else
				_this.groupObj.elAll.checked = true;
			
			_this.sensorObj.filtering();
		},
		init: function(){
			
			this.elAll.onchange = this.onAllChange;
			for(let i = 0, l = this.elGroups.length; i < l; i++)
				this.elGroups[i].onchange = this.onChange;
		}
	};
	if(this.groupObj.elAll != null)
		this.groupObj.init();
	//-> ↑　group object
	
	//-> datepicker datearrrow
	this.datePicker = {
		data: {
			compare: {
				index: null
			}
		},
		el: {
			datePicker: null,
			dateArrows: null,
			period: {
				err: document.querySelector('#div-error-period'),
				text: {
					ys: document.querySelector('#ys'),
					ms: document.querySelector('#ms'),
					ds: document.querySelector('#ds')
				}
			},
			compare: {
				err: document.querySelector('#div-error-compare'),
				text: {
					years: null,
					months: null,
					days: null
				},
				btnAddCompareDate: document.querySelector('#btnAddCompareDate'),
			}
		},
		fn: {
			period: {
				onDateChange: function() {
					
					let isValid = _this.datePicker.fn.period.check();
					
					let y = _this.datePicker.el.period.text.ys.value.trim();
					let m = _this.datePicker.el.period.text.ms.value.trim();
					let d = _this.datePicker.el.period.text.ds.value.trim();
					
					let date;
					
					if(!isValid){
						
						date = new Date();
						
						if(y === ''){
							
							y = date.getFullYear();
							_this.datePicker.el.period.text.ys.value = y;
						}
						if(m === ''){
							
							m = date.getMonth() + 1;
							_this.datePicker.el.period.text.ms.value = m;
						}
						if(d === ''){
							
							d = date.getDate();
							_this.datePicker.el.period.text.ds.value = d;
						}else{
							
							let mo = moment([y, m - 1]);
							mo.endOf('month');
							let lastDay = mo.toDate().getDate();
							if(d < 1){
								
								d = 1;
								_this.datePicker.el.period.text.ds.value = 1;
							}else if(d > lastDay){
								
								d = lastDay;
								_this.datePicker.el.period.text.ds.value = lastDay;
							}
						}
					}
					
					//-> ↓ check again to remove error
					_this.datePicker.fn.period.check()
						
					let iPickerPeriod = document.querySelector('.i-datepicker');
					date = $(iPickerPeriod).datepicker('getDate');
					if(date == null)
						date = new Date();
					
					date.setFullYear(y);
					date.setMonth(m - 1);
					date.setDate(d);
					
					$(iPickerPeriod).datepicker('setDate', date);
				},
				isValid: function(){
					
					let y = _this.datePicker.el.period.text.ys.value.trim();
					let m = _this.datePicker.el.period.text.ms.value.trim();
					let d = _this.datePicker.el.period.text.ds.value.trim();
					
					let isValid = y !== '' && m !== '' && d !== '';
					
					if(isValid)
						isValid = moment([y, m - 1, d]).isValid();
					
					return isValid;
				},
				check: function(){
					
					_this.datePicker.fn.period.err.clear();
					
					let isValid = _this.datePicker.fn.period.isValid();
					if(!isValid){
						
						let viewSpan = _this.viewSpanObj.activated;
						let msgParam = mierukaStore.messages.param.getByViewSpan(viewSpan);
						
						_this.datePicker.fn.period.err.add(mierukaStore.messages.err.date.replace('{0}', msgParam));
					}
					
					return isValid;
				},
				val: function(id){
					return _this.datePicker.el.period.text[id].value.trim();
				},
				setVal: function(id, val){
					_this.datePicker.el.period.text[id].value = val;
				},
				err: {
					clear: function(){
						_this.datePicker.el.period.err.innerHTML = '';
					},
					add: function(msg){
						
						let div = zeus.createElement('div', {
							innerText: msg
						});
						_this.datePicker.el.period.err.appendChild(div);
					}
				},
				init: function(){
					
					_this.datePicker.el.period.text.ys.onkeyup = zeus.onYearInput;
					_this.datePicker.el.period.text.ms.onkeyup = zeus.onMonthInput;
					_this.datePicker.el.period.text.ds.onkeyup = zeus.onDayInput;
					
					_this.datePicker.el.period.text.ys.onchange = _this.datePicker.fn.period.onDateChange;
					_this.datePicker.el.period.text.ms.onchange = _this.datePicker.fn.period.onDateChange;
					_this.datePicker.el.period.text.ds.onchange = _this.datePicker.fn.period.onDateChange;
				}
			},
			compare: {
				onDateChange: function(){
					_this.datePicker.fn.compare.checkAll();
				},
				onDelClick: function(){
					
					this.parentNode.parentNode.removeChild(this.parentNode);
					
					_this.datePicker.fn.compare.reset();
				},
				val: {
					getVal: function(id){
						return document.querySelector('#' + id).value.trim();
					},
					getValSet: function(index){
						return {
							y: _this.datePicker.fn.compare.val.getVal('year' + index),
							m: _this.datePicker.fn.compare.val.getVal('month' + index),
							d: _this.datePicker.fn.compare.val.getVal('day' + index),
						}
					},
					setVal: function(id, val){
						document.querySelector('#' + id).value = val;
					}
				},
				err: {
					add: function(msg){
						
						let div = zeus.createElement('div', {
							innerText: msg
						});
						_this.datePicker.el.compare.err.appendChild(div);
					},
					clear: function(){
						_this.datePicker.el.compare.err.innerHTML = '';
					}
				},
				isValid: function(index){
					
					let y = document.querySelector('#year' + index).value.trim();
					let m = document.querySelector('#month' + index).value.trim();
					let d = document.querySelector('#day' + index).value.trim();
					
					let isValid = y !== '' && m !== '' && d !== '';
					
					if(isValid)
						isValid = moment([y, m, d]).isValid();
					
					return isValid;
				},
				checkAll: function(){
					
					let elCompare = _this.datePicker.el.compare;
					let fnCompare = _this.datePicker.fn.compare;
					let item, index, isValid, valSet, date, mo, lastDay, iPicker;
					
					for(let i = 0, l = elCompare.text.years.length; i < l; i++){
						
						item = elCompare.text.years[i];
						index = item.getAttribute('data-index');
						isValid = fnCompare.isValid(index);
						
						valSet = fnCompare.val.getValSet(index);
						if(!isValid){
							
							date = new Date();
							if(valSet.y === ''){
								
								valSet.y = date.getFullYear();
								fnCompare.val.setVal('year' + index, valSet.y);
							}
							if(valSet.m === ''){
								
								valSet.m = date.getMonth() + 1;
								fnCompare.val.setVal('month' + index, valSet.m);
							}
							if(valSet.d === ''){
								
								valSet.d = date.getDate();
								fnCompare.val.setVal('day' + index, valSet.d);
							}else{
								
								mo = moment([valSet.y, valSet.m - 1]);
								mo.endOf('month');
								lastDay = mo.toDate().getDate();
								if(valSet.d < 1){
									
									valSet.d = 1;
									fnCompare.val.setVal('day' + index, valSet.d);
								}else if(valSet.d > lastDay){
									
									valSet.d = lastDay;
									fnCompare.val.setVal('day' + index, valSet.d);
								}
							}
						}
						
						iPicker = document.querySelector('.i-datepicker[data-index="' + index + '"]');
						date = $(iPicker).datepicker('getDate');
						if(date == null)
							date = new Date();
						
						date.setFullYear(valSet.y);
						date.setMonth(valSet.m - 1);
						date.setDate(valSet.d);
						
						$(iPicker).datepicker('setDate', date);
					}
				},
				addDatePicker: function(index){
					
					let i = document.querySelector('.i-datepicker[data-index="' + index + '"]');
					let date = new Date();
					
					$(i).datepicker(mierukaStore.datePickerOptions);
					
					$(i).on('changeDate', function(e){
						
						let index = this.getAttribute('data-index');
						_this.datePicker.fn.compare.val.setVal('year' + index, e.date.getFullYear());
						_this.datePicker.fn.compare.val.setVal('month' + index, e.date.getMonth() + 1);
						_this.datePicker.fn.compare.val.setVal('day' + index, e.date.getDate());
					});
					
					$(i).datepicker('setDate', date);
					
					_this.datePicker.fn.compare.reset();
				},
				init: function(){
					
					_this.datePicker.el.compare.text.years = document.querySelectorAll('[name="year"]');
					_this.datePicker.el.compare.text.months = document.querySelectorAll('[name="month"]');
					_this.datePicker.el.compare.text.days = document.querySelectorAll('[name="day"]');
					
					let year, month, day;
					for(let i = 0, l = _this.datePicker.el.compare.text.years.length; i < l; i++){
						
						year = _this.datePicker.el.compare.text.years[i];
						if(year.onkeyup == null)
							year.onkeyup = zeus.onYearInput;
						if(year.onchange == null)
							year.onchange = _this.datePicker.fn.compare.onDateChange;
						
						month = _this.datePicker.el.compare.text.months[i];
						if(month.onkeyup == null)
							month.onkeyup = zeus.onMonthInput;
						if(month.onchange == null)
							month.onchange = _this.datePicker.fn.compare.onDateChange;
						
						day = _this.datePicker.el.compare.text.days[i];
						if(day.onkeyup == null)
							day.onkeyup = zeus.onDayInput;
						if(day.onchange == null)
							day.onchange = _this.datePicker.fn.compare.onDateChange;
					}
				},
				reset: function(){
					
					_this.datePicker.el.compare.text.years = document.querySelectorAll('[name="year"]');
					_this.datePicker.el.compare.text.months = document.querySelectorAll('[name="month"]');
					_this.datePicker.el.compare.text.days = document.querySelectorAll('[name="day"]');
				}
			},
			initDatePicker: function(){
				
				let el = _this.datePicker.el;
				let fnPeriod = _this.datePicker.fn.period;
				let fnCompare = _this.datePicker.fn.compare;
				
				el.datePicker = document.querySelectorAll('.i-datepicker');
				
				let picker, date, index, y, m, d;
				for(let i = 0, l = el.datePicker.length; i < l; i++){
					
					picker = el.datePicker[i];
					
					date = $(picker).datepicker('getDate');
					if(date == null){
						
						date = new Date();
						index = picker.getAttribute('data-index');
						// ↓ period
						if(index == null){
						
							if(fnPeriod.isValid()){
								
								date.setFullYear(fnPeriod.val('ys'));
								date.setMonth(fnPeriod.val('ms') - 1);
								date.setDate(fnPeriod.val('ds'));
							}
						// ↓ compare
						}else {
							
							if(fnCompare.isValid(index)){
								
								date.setFullYear(fnCompare.val.getVal('year' + index));
								date.setMonth(fnCompare.val.getVal('month' + index) - 1);
								date.setDate(fnCompare.val.getVal('day' + index));
							}
						}
					}
					
					$(picker).datepicker('destroy');
					$(picker).datepicker(mierukaStore.datePickerOptions);
					
					$(picker).on('changeDate', function(e){
						
						let index = this.getAttribute('data-index');
						
						if(index == null){
							
							fnPeriod.setVal('ys', e.date.getFullYear());
							fnPeriod.setVal('ms', e.date.getMonth() + 1);
							fnPeriod.setVal('ds', e.date.getDate());
						}else{
							
							fnCompare.val.setVal('year' + index, e.date.getFullYear());
							fnCompare.val.setVal('month' + index, e.date.getMonth() + 1);
							fnCompare.val.setVal('day' + index, e.date.getDate());
						}
					});
					
					$(picker).datepicker('setDate', date);
				}
			},
			resetDateArrows: function(){
				dateArrows.reset();
			},
			init: function(){
				
				//-> ↓ initialize period: attach onkeyup, onchange events
				_this.datePicker.fn.period.init();
				
				//-> ↓ initialize compare: initialize objects and attach onkeyup, onchange events
				_this.datePicker.fn.compare.init();
				
				//-> ↓ initialize date picker
				_this.datePicker.fn.initDatePicker();
				
				//-> ↓ initialize date arrows
				dateArrows.init('data-toggle', 'date-arrow');
				_this.datePicker.el.dateArrows = $('[data-toggle="date-arrow"]');
				_this.datePicker.el.dateArrows.click(onDateArrowClick);
				//-> ↑ initialize date arrows
				
				//-> ↓ compare
				//--> ↓↓ initialize index
				_this.datePicker.data.compare.index = _this.datePicker.el.compare.text.years.length - 1;
				
				//--> ↓↓ attach event to button
				_this.datePicker.el.compare.btnAddCompareDate.onclick = function(){
					
					let index = ++_this.datePicker.data.compare.index;
					
					//-> ↓
					let div = zeus.createElement('div', {
						styleClass: 'd-flex align-items-center mt-2'
					});
					
					//--> ↓↓ year input
					let input = zeus.createElement('input', {
						type: 'number',
						id: 'year' + index,
						name: 'year',
						styleClass: 'w-55-pi',
						maxLength: 4,
						data: {
							index: index
						}
					});
					input.onkeyup = zeus.onYearInput;
					input.onchange = _this.datePicker.fn.compare.onDateChange;
					div.appendChild(input);
					//<-- ↑↑ year input
					
					//--> ↓↓ year label
					let label = zeus.createElement('label', {
						innerText: fmtLabelYear,
						styleClass: 'ml-1'
					});
					div.appendChild(label);
					//<-- ↑↑ year label
					
					//--> ↓↓ month span
					let styleClass = 'span-month ml-2';
					if(_this.viewSpanObj.activeted === 'y')
						styleClass += ' d-none';
					let span = zeus.createElement('span', {
						styleClass: styleClass
					});
					let spanDiv = zeus.createElement('div', {
						styleClass: 'd-flex align-items-center'
					});
					//---> ↓↓↓ month input
					input = zeus.createElement('input', {
						type: 'number',
						id: 'month' + index,
						name: 'month',
						styleClass: 'w-45-pi',
						maxLength: 2,
						data: {
							index: index
						}
					});
					input.onkeyup = zeus.onMonthInput;
					input.onchange = _this.datePicker.fn.compare.onDateChange;
					spanDiv.appendChild(input);
					//<--- ↑↑↑ month input
					//---> ↓↓↓ month label
					label = zeus.createElement('label', {
						innerText: fmtLabelMonth,
						styleClass: 'ml-1'
					});
					spanDiv.appendChild(label);
					//<--- ↑↑↑ month label
					span.appendChild(spanDiv);
					div.appendChild(span);
					//<-- ↑↑ month span
					
					//--> ↓↓ day span
					styleClass = 'span-day ml-2';
					if('y,m'.indexOf(_this.viewSpanObj.activated) >= 0)
						styleClass += ' d-none';
					span = zeus.createElement('span', {
						styleClass: styleClass
					});
					spanDiv = zeus.createElement('div', {
						styleClass: 'd-flex align-items-center'
					});
					//---> ↓↓↓ day input
					input = zeus.createElement('input', {
						type: 'number',
						id: 'day' + index,
						name: 'day',
						styleClass: 'w-45-pi',
						maxLength: 2,
						data: {
							index: index
						}
					});
					input.onkeyup = zeus.onDayInput;
					input.onchange = _this.datePicker.fn.compare.onDateChange;
					spanDiv.appendChild(input);
					//<--- ↑↑↑ day input
					//---> ↓↓↓ day label
					label = zeus.createElement('label', {
						innerText: fmtLabelDay,
						styleClass: 'ml-1'
					});
					spanDiv.appendChild(label);
					//<--- ↑↑↑ day label
					span.appendChild(spanDiv);
					div.appendChild(span);
					//<-- ↑↑ day span
					
					//--> ↓↓ hour span
					styleClass = 'span-hour ml-2';
					if(_this.viewSpanObj.activated !== 'h')
						styleClass += ' d-none';
					span = zeus.createElement('span', {
						styleClass: styleClass
					});
					spanDiv = zeus.createElement('div', {
						styleClass: 'd-flex align-items-center'
					});
					//---> ↓↓↓ hour select
					let select = zeus.createElement('select', {
						id: 'hour' + index,
						styleClass: 'select-text',
						data: {
							index: index
						}
					});
					spanDiv.appendChild(select);
					//<--- ↑↑↑ hour select
					//---> ↓↓↓ hour label
					label = zeus.createElement('label', {
						innerText: fmtLabelHour,
						styleClass: 'ml-1'
					});
					spanDiv.appendChild(label);
					//<--- ↑↑↑ hour label
					span.appendChild(spanDiv);
					div.appendChild(span);
					//<-- ↑↑ hour span
					
					//--> ↓↓ i calendar
					let i = zeus.createElement('i', {
						styleClass: 'fas fa-calendar-alt i-datepicker cursor-pointer ml-2',
						data: {
							index: index
						}
					});
					div.appendChild(i);
					//<-- ↑↑ i calendar
					
					//--> ↓↓ a left arrow
					let a = zeus.createElement('a', {
						href: 'javascript:void(0)',
						styleClass: 'td-none ml-1',
						data: {
							toggle: 'date-arrow',
							y: 'year' + index,
							m: 'month' + index,
							d: 'day' + index,
							arrow: 'left'
						}
					});
					a.onclick = onDateArrowClick;
					//--> ↓↓↓ i left arrow
					i = zeus.createElement('i', {
						styleClass: 'fas fa-arrow-alt-circle-left fa-2x'
					});
					a.appendChild(i);
					//--> ↑↑↑ i left arrow
					div.appendChild(a);
					//--> ↑↑ a left arrow
					
					//--> ↓↓ a right arrow
					a = zeus.createElement('a', {
						href: 'javascript:void(0)',
						styleClass: 'td-none ml-1',
						data: {
							toggle: 'date-arrow',
							y: 'year' + index,
							m: 'month' + index,
							d: 'day' + index,
							arrow: 'right'
						}
					});
					a.onclick = onDateArrowClick;
					//--> ↓↓↓ i right arrow
					i = zeus.createElement('i', {
						styleClass: 'fas fa-arrow-alt-circle-right fa-2x'
					});
					a.appendChild(i);
					//--> ↑↑↑ i right arrow
					div.appendChild(a);
					//--> ↑↑ a right arrow
					
					//--> ↓↓ i delete
					i = zeus.createElement('i', {
						styleClass: 'fas fa-minus-square fa-2x cursor-pointer text-danger ml-1'
					});
					i.onclick = _this.datePicker.fn.compare.onDelClick;
					div.append(i);
					//--> ↑↑ i delete
					
					this.parentNode.before(div);
					//<- ↑
					
					//-> ↓ add data to hour select
					zeus.setNumberOptions('hour' + index, 0, 23, false, '00');
					
					//-> ↓ set new datepicker and reset cpmare text elements
					_this.datePicker.fn.compare.addDatePicker(index);
					
					//-> ↓ reset data arrows
					_this.datePicker.fn.resetDateArrows();
					
					//-> ↓ reset viewSpan control items
					_this.viewSpanObj.initElControlItems();
				};
				//--> ↑↑ attach event to button
				//-> ↑ compare
			}
		}
	};
	this.datePicker.fn.init();
	//<- datepicker datearrrow
	
	//-> ↓ buttons object
	this.buttonObj = {
		history: {
			graph: {
				individual: document.querySelector('#btnGraphIndividual'),
				sum: document.querySelector('#btnGraphSum')
			},
			dataTable: document.querySelector('#btnDataTable'),
			csv: document.querySelector('#btnCSV'),
			electUsage: document.querySelector('#btnElectUsage')
		}
	};
	//-> ↑ buttons object
	
	//-> ↓ sensor object
	this.sensorObj = {
		table: $('#tableSensor'),
		filtering: function(){
			
			this.table.bootstrapTable('filterBy', {id: null}, {
				filterAlgorithm: function(row, filters){

					//-> ↓ check option visibility
					let isShowOption = true;
					//--> ↓↓ demand sensor
					if(row.sensorId.startsWith('D')){
						
						if(_this.graphTypeObj.activated == 'history' && row.displayTypeOptions.indexOf(_this.dispUnitObj.activated) < 0)
							isShowOption = false;
					}
					//<-- ↑↑ demand sensor
					
					//--> ↓↓ energy sensor
					if(row.sensorId.startsWith('E')){
						
						if(_this.graphTypeObj.activated == 'monitoring'){
							
							if(_this.viewCategoryObj.monitoring.activated == 'demand')
								isShowOption = false;
							else{
								
								if(row.displayTypeOptions.indexOf('elect') < 0)
									isShowOption = false;
							}
						}else{
							
							if(row.displayTypeOptions.indexOf(_this.dispUnitObj.activated) < 0)
								isShowOption = false;
						}
					}
					//<-- ↑↑ energy sensor
					
					//--> ↓↓ heat recovery sensor
					if(row.sensorId.startsWith('H')){
						
						if(_this.graphTypeObj.activated == 'monitoring')
							isShowOption = false;
						else{
							
							if(_this.viewCategoryObj.history.activated == 'demand' || row.displayTypeOptions.indexOf(_this.dispUnitObj.activated) < 0)
								isShowOption = false;
						}
					}
					//<-- ↑↑ heat recovery sensor
					
					//--> ↓↓　environment sensor
					if(row.sensorId.startsWith('T')){
						
						if(_this.graphTypeObj.activated == 'monitoring'){
							
							if(_this.viewCategoryObj.monitoring.activated == 'demand')
								isShowOption = false;
							else{
								
								let index;
								let dtoArr = row.displayTypeOptions.split(',');
								for(let i = 0, l = dtoArr.length; i < l; i++){
									
									index = _this.envOptionsObj.monitoring.checked.indexOf(dtoArr[i]);
									if(index >= 0)
										break;
								}
								
								if(index < 0)
									isShowOption = false;
							}
						}else{
							
							if(_this.viewCategoryObj.history.activated == 'demand')
								isShowOption = false;
							else{
								
								let index;
								let dtoArr = row.displayTypeOptions.split(',');
								for(let i = 0, l = dtoArr.length; i < l; i++){
									
									index = _this.envOptionsObj.history.checkedOptions.indexOf(dtoArr[i]);
									if(index >= 0)
										break;
								}
								
								if(index < 0)
									isShowOption = false;
							}
						}
					}
					//--> ↑↑　environment sensor
					//-> ↑ check option visibility
					
					let isShowGroup = true;
					//-> filtering with group
					if(mierukaStore.group != null){
						
						if(_this.groupObj.checked.indexOf(row.groupId) < 0)
							isShowGroup = false;
					}
					//<- filtering with group
					
					return isShowOption && isShowGroup;
				}
			});
		},
		getChecked: function(){
			
			let checked = this.table.bootstrapTable('getSelections');
			let respArr = [];
			
			for(let i in checked)
				respArr.push(checked[i].sensorId);
			
			return respArr;
		},
		getCheckedAll: function(){
			
			let checked = this.table.bootstrapTable('getAllSelections');
			let respArr = [];
			
			for(let i in checked)
				respArr.push(checked[i].sensorId);
			
			return respArr;
		},
		initTable: function(){
			
			let param = {};
			if(mierukaStore.group != null)
				param.hasGroup = 't';
			
			$.ajax({
				url: contextPath + 'Ajax/Mieruka/GetUserSensors/BootstrapTable.action',
				async: true,
				cache: false,
				data: param,
				success: function(resp){
					
					let respObj = JSON.parse(resp);
					
					_this.sensorObj.table.bootstrapTable('destroy').bootstrapTable({
						locale: mierukaStore.locale.bootstrapTable.getLocale(),
						uniqueId: 'sensorId',
						columns: [
							{
								field: 'id',
								checkbox: true,
								width: '10',
								widthUnit: '%',
								formatter: function(value, row, index){
									
									if(mierukaStore.checkedSensorIds.indexOf(row.sensorId) >= 0)
										return true;
									
									return false;
								}
							},{
								field: 'sensorType',
								title: fmtTitleSensorType,
								width: '30',
								widthUnit: '%'
							}, {
								field: 'sensorName',
								title: fmtTitleSensorName,
								width: '60',
								widthUnit: '%'
							}, {
								field: 'sensorId',
								visible: false
							}, {
								field: 'groupId',
								visible: false
							}
						],
						data: respObj.data
					});
					
					_this.sensorObj.filtering();
					
					_this.init();
				},
				error: function(){
					_this.init();
				}
			});
		}
	};
	//-> ↑ sensor object
	
	//-> ↓ charts
	this.charts = {
		el: {
			chart: {
				chart1: document.querySelector('#chart1'),
				chart2: document.querySelector('#chart2')
			}
		},
		instances: {
			chart1: null,
			chart2: null
		},
		data: {
			monitoring: {
				demand: {
					timeZone: null,
					marklineMax: null,
					init: true,
					option: {
						title: {
							text: '電力の使用状況',
							left: 'center'
						},
						tooltip: {
							trigger: 'axis'
						},
						xAxis: {
							type: 'time',
							axisLabel: {
								formatter: function(value, index){
									return moment(value).format('HH:mm');
								}
							}
						},
						yAxis: {
							splitLine: {
								show: false
							},
							min: 0,
							max: 100
						}
					}
				},
				electricity: {
					optionSettingMap: null,
					get option(){
						
						let option = {
							title: 'モニタリング',
							tooltip: {
								trigger: 'axis'
							},
							xAxis: {
								type: 'time'
							} 
						};
						
						if(_this.envOptionsObj.monitoring.options != null){
							
							option.yAxis = [];
							
							let op, label, y;
							let showSize = 0;
							for(let i = 0, l = _this.envOptionsObj.monitoring.options.length; i < l; i++){
								
								op = _this.envOptionsObj.monitoring.options[i];
								label = op.nextElementSibling;
								
								y = {};
								//> id
								y.id = op.value;
								//> show
								y.show = op.checked;
								if(op.checked)
									showSize++;
								//> position
								if(i > 0)
									y.position = 'right';
								//> offset
								if(i > 1)
									y.offset = (i - 1) * 40;
								//> name
								y.name = label.innerText();
								//> nameRotate
								y.nameRotate = -90;
								
								option.yAxis.push(y);
							}
							
							showSize++;
							
							option.grid = {
								right: showSize * 40
							};
						}
					}
				}
			},
			history: {
				
			}
		},
		fn: {
			monitoring: {
				demand: {
					setInit: function(){
						
						let dataDemand = _this.charts.data.monitoring.demand;
						
						let mo = moment();
						let h = mo.hour();
						let m = mo.minute();
						m = m < 30? 0: 30;
						mo.seconds(0);
						
						let isInit = false;
						
						if(dataDemand.timeZone == null){
							
							dataDemand.timeZone = {
								h: h,
								m: m
							};
							
							isInit = true;
						}else{
							
							if(dataDemand.timeZone.h == h){
								
								if(dataDemand.timeZone.m != m)
									isInit = true;
							}else
								isInit = true;
						}
						
						if(isInit){
							
							dataDemand.timeZone = {
								h: h,
								m: m
							};

							//-> set graph xAxis max and min
							mo.hours(h);
							mo.minutes(m);
							_this.charts.fn.monitoring.demand.setXAxisRange(mo);
						}
						
						dataDemand.init = isInit;
					},
					setXAxisRange: function(mo){
						
						_this.charts.data.monitoring.demand.option.xAxis.min = mo.format('YYYY-MM-DD HH:mm:ss');
						
						mo.add(30, 'm');
						_this.charts.data.monitoring.demand.option.xAxis.max = mo.format('YYYY-MM-DD HH:mm:ss');
					},
					getLastData: function(){
						
						console.log(_this.charts.data.monitoring.demand.init);
						if(!_this.charts.data.monitoring.demand.init){
							
							let chart = _this.charts.fn.getChartInstance('chart1');
							let option = chart.getOption();
							let seriesArr = option.series;
							if(seriesArr != null && seriesArr.length > 0){
								
								let serieObj = seriesArr[0];
								let dataArr = serieObj.data;
								if(dataArr != null && dataArr.length > 0)
									return dataArr[dataArr.length - 1];
							}
						}
						
						return null;
					}
				}
			},
			//>> charts > fn > getChartInstance
			getChartInstance: function(name){
				
				if(_this.charts.instances[name] == null || _this.charts.instances[name].isDisposed())
					_this.charts.instances[name] = echarts.init(_this.charts.el.chart[name]);
				
				return _this.charts.instances[name];
			}
		}
	};
	//-> ↑ charts
	
	this.timers = {
		//> timers > graph
		graph: {
			//>> timers > graph > demand
			demand: {
				ticktock: null,
				resetTickTock: function(){
					
					let demand = _this.timers.graph.demand;
					if(demand.ticktock != null)
						clearTimeout(demand.ticktock);
					
					demand.start();
				},
				nextTickTock: function(){
					_this.timers.graph.demand.ticktock = setTimeout(_this.timers.graph.demand.start, _this.monitoringUpdateFrequency.data.frequency * 1000);
				},
				start: function(){
					
					let checked = _this.sensorObj.getChecked();
					if(checked.length > 0){
						
						let dataDemand = _this.charts.data.monitoring.demand;
						let fnDemand = _this.charts.fn.monitoring.demand;
						//-> check is initialize
						fnDemand.setInit();
						
						let param = {};
						if(dataDemand.init)
							param.init = dataDemand.init;
						else{
							
							let lastData = fnDemand.getLastData();
							if(lastData != null){
								
								param.lastDateTime = moment(lastData[0]).format('YYYYMMDDHHmmss');
								param.lastData = lastData[1];
							}
						}
						
						$.ajax({
							url: '/zeuschart/Ajax/Mieruka/Chart/Demand.do',
							aysnc: true,
							cahe: false,
							data: param,
							success: function(resp){
								
								console.log(resp);
								let respObj = JSON.parse(resp);
								
								//-> ↓ show chart
								zeus.showElement(_this.charts.el.chart.chart1);
								
								let chart = _this.charts.fn.getChartInstance('chart1');
								if(_this.charts.data.monitoring.demand.init){
									
									//> ↓ combine base option and option from response
									let option = {};
									Object.assign(option, _this.charts.data.monitoring.demand.option);
									Object.assign(option, respObj.option);
									//> ↑ combine base option and option from response
									
									//> ↓ set y axis max
									if(respObj.yMax != null)
										option.yAxis.max = respObj.yMax;
									
									chart.setOption(option, true, false);
								}else if(respObj.option.series[0].data.length > 0){
									
									let option = chart.getOption();
									respObj.option.series[0].data = option.series[0].data.concat(respObj.option.series[0].data);
									
									chart.setOption(respObj.option, false, false);
								}
								
								_this.timers.graph.demand.nextTickTock();
							},
							error: function(){
								
								//-> ↓ hide chart
								zeus.showElement(_this.charts.el.chart.chart1);
								
								_this.timers.graph.demand.nextTickTock();
							}
						});
					}else
						_this.timers.graph.demand.nextTickTock();
				},
				stop: function(){
					
					//-> ↓ stop timer
					if(_this.timers.graph.demand.ticktock != null){
						
						clearTimeout(_this.timers.graph.demand.ticktock);
						_this.timers.graph.demand.ticktock = null;
					}
					
					//-> ↓ destroy chart instance
					if(_this.charts.instances.chart1 != null)
						_this.charts.instances.chart1.dispose();
					
					//-> ↓ hide chart
					zeus.hideElement(_this.charts.el.chart.chart1);
				},
				isStop: function(){
					return _this.charts.instances.chart1 == null || _this.charts.instances.chart1.isDispose();
				}
			},
			//>> timers > graph > electricity
			//>> two main parts: electricity, control status
			electricity: {
				//>>> timers > graph > electricity > electricity
				//>>> include real time electricity, environment data such as temperature, humidity...
				electricity: {
					ticktock: null,
					nextTickTock: function(){
						_this.timers.graph.electricity.electricity.ticktock = setTimeout(_this.timers.graph.electricity.electricity.start, _this.monitoringUpdateFrequency.data.frequency * 1000);
					},
					start: function(){
						
						let checkedIds = _this.sensorObj.getChecked();
						if(checkedIds.length > 0){
							
							//> energy sensor
							let energyIds = checkedIds.filter(function(id){
								return id.startsWith('D') || id.startsWith('E');
							});
							//> environment sensor
							let envIds = checkedIds.filter(function(id){
								return id.startsWith('T');
							});
							//> environment monitoring option
							let envOption = _this.envOptionsObj.monitoring.checked;
							
							let param = {};
							if(energyIds.length > 0){
								
								param.energyIds = energyIds.join();
								
								
							}
							if(envIds.length > 0)
								param.envIds = envIds.join();
							if(envOption.length > 0){
								param.envOption = envOption.join();
							}
							
							let chart = _this.charts.fn.getChartInstance();
							chart.setOption(_this.charts.data.electricity.option);
							
							_this.timers.graph.electricity.electricity.nextTickTock();
						}else
							_this.timers.graph.electricity.electricity.nextTickTock();
					},
					stop: function(){
						
						if(_this.timers.graph.electricity.electricity.ticktock != null){
							
							clearTimeout(_this.timers.graph.electricity.electricity.ticktock);
							_this.timers.graph.electricity.electricity.ticktock = null;
						}
					}
				},
				//>>> timers > graph > electricity > controlStatus
				//>>> node control status
				controlStatus: {
					ticktock: null,
					start: function(){
						
					},
					stop: function(){
						
						if(_this.timers.graph.controlStatus.ticktock != null){
							
							clearTimeout(_this.timers.graph.controlStatus.ticktock);
							_this.timers.graph.controlStatus.ticktock = null;
						}
					}
				},
				//>>> timers > graph > electricity > start
				start: function(){
					
					_this.timers.graph.electricity.electricity.start();
					_this.timers.graph.electricity.controlStatus.start();
				},
				//>>> timers > graph > electricity > stop
				stop: function(){
					
					_this.timers.graph.electricity.electricity.stop();
					_this.timers.graph.electricity.controlStatus.stop();
				}
			},
			//>> timers > graph > start
			start: function(){
				
				let viewCategory = _this.viewCategoryObj.monitoring.activated;
				_this.timers.graph[viewCategory].start();
			},
			//>> timers > graph > stop
			stop: function(){
				
				let graph = _this.timers.graph;
				graph.demand.stop();
				graph.electricity.stop();
				graph.controlStatus.stop();
			}
		},
		//> timers > zdaemon
		zdaemon: {
			demand: {
				ticktock: null,
				frequency: 3000,
				area: document.querySelector('zdaemonArea1'),
				start: function(){
					
					let checked = _this.sensorObj.getChecked();
					if(checked.length > 0){
						
						$.ajax({
							url: '/zdaemon/',
							async: true,
							cache: false,
							type: 'get',
							data: {
								t: 'rd',
								viewspan: _this.viewSpanObj.activated,
								ys: mierukaStore.history.viewtype.period.y,
								ms: mierukaStore.history.viewtype.period.m,
								ds: mierukaStore.history.viewtype.period.d
							},
							success: function(response){
								
								let demand = _this.timers.zdaemon.demand;
								demand.area.innerHTML = response;
								demand.ticktock = setTimeout(demand.start, demand.frequency);
							},
							error: function(){
								
								let demand = _this.timers.zdaemon.demand;
								demand.ticktock = setTimeout(demand.start, demand.frequency);
							}
						});
					}else{
						
						let demand = _this.timers.zdaemon.demand;
						demand.ticktock = setTimeout(demand.start, demand.frequency);
					}
				},
				stop: function(){
					
					if(_this.timers.zdaemon.demand.ticktock != null){
						
						clearTimeout(_this.timers.zdaemon.demand.ticktock);
						_this.timers.zdaemon.demand.ticktock = null;
					}
				}
			},
			energy: {
				ticktock: null,
				frequency: 10000,
				area: document.querySelector('zdaemonArea1'),
				start: function(){
					
					let checked = _this.sensorObj.getChecked();
					let esIdArr = checked.filter(function(id){
						return id.startsWith('E');
					});
					
					if(esIdArr.length > 0){
						
						$.ajax({
							url: '/zdaemon/',
							async: true,
							cache: false,
							type: 'get',
							data: {
								electricSensor: 1,
								deviceList: esIdArr.join(),
								userId: mierukaStore.userId,
								unit: _this.electricityUnit.activated === 'k'? 'kw': 'w'
							},
							success: function(response){
								
								let energy = _this.timers.zdaemon.energy;
								energy.area.innerHTML = response;
								energy.ticktock = setTimeout(energy.start, energy.frequency);
							},
							error: function(){
								
								let energy = _this.timers.zdaemon.energy;
								energy.ticktock = setTimeout(energy.start, energy.frequency);
							}
						});
					}else{
						
						let energy = _this.timers.zdaemon.energy;
						energy.ticktock = setTimeout(energy.start, energy.frequency);
					}
				},
				stop: function(){
					
					if(_this.timers.zdaemon.energy.ticktock != null){
						
						clearTimeout(_this.timers.zdaemon.energy.ticktock);
						_this.timers.zdaemon.energy.ticktock = null;
					}
				}
			},
			env: {
				ticktock: null,
				frequency: 10000,
				area: document.querySelector('zdaemonArea2'),
				start: function(){
					
					let checked = _this.sensorObj.getChecked();
					let esIdArr = checked.filter(function(id){
						return id.startsWith('T');
					});
					
					if(esIdArr.length > 0){
						
						$.ajax({
							url: '/zdaemon/',
							async: true,
							cache: false,
							type: 'get',
							data: {
								temperatureSensor: 1,
								deviceList: esIdArr.join(),
								userId: mierukaStore.userId
							},
							success: function(response){
								
								let env = _this.timers.zdaemon.env;
								env.area.innerHTML = response;
								env.ticktock = setTimeout(env.start, env.frequency);
							},
							error: function(){
								
								let env = _this.timers.zdaemon.env;
								env.ticktock = setTimeout(env.start, env.frequency);
							}
						});
					}else{
						
						let env = _this.timers.zdaemon.env;
						env.ticktock = setTimeout(env.start, env.frequency);
					}
				},
				stop: function(){
					
					if(_this.timers.zdaemon.env.ticktock != null){
						
						clearTimeout(_this.timers.zdaemon.env.ticktock);
						_this.timers.zdaemon.env.ticktock = null;
					}
				}
			},
			start: function(){
				
				if(_this.viewCategoryObj.monitoring.activated === 'demand')
					_this.timers.zdaemon.demand.start();
				else{
					
					_this.timers.zdaemon.energy.start();
					_this.timers.zdaemon.env.start();
				}
			},
			stop: function(){
				
				_this.timers.zdaemon.demand.stop();
				_this.timers.zdaemon.energy.stop();
				_this.timers.zdaemon.env.stop();
			}
		},
		start: function(){
			
			this.graph.start();
			this.zdaemon.start();
		},
		stop: function(){
			
			this.graph.stop();
			this.zdaemon.stop();
		},
		onViewCategorySwitch: function(){
			
			this.stop();
			this.start();
		}
	};
	
	//-> ↓ bootstrapTable: sensor table
	_this.sensorObj.initTable();
	//<- ↑ bootstrapTable: sensor table
	
	this.init = function(){
		
		//-> set for graph type monitoring
		//-> show monitoring option tables if the view category is 0 (electricity)
		
		//--> view category
		$('[href="#monitoring-' + _this.viewCategoryIds[mierukaStore.monitoring.viewCategory] + '"]').tab('show');
		
		//--> ex
		$('[href="#monitoring-' + _this.exIds[mierukaStore.monitoring.ex] + '"]').tab('show');
		
		//--> electricity monitoring items
		$('[href="#' + mierukaStore.monitoring.realtime + '"]').tab('show');
		
		//--> electricity unit
		$('[href="#electricityUnit-' + mierukaStore.monitoring.electUnit + '"]').tab('show');
		
		//--> label display
		if(mierukaStore.monitoring.graphLabelDisp == 1)
			$('[href="#monitoring-label-display"]').tab('show');
		else
			$('[href="#monitoring-label-nodisplay"]').tab('show');
		
		//--> control status display
		if(mierukaStore.monitoring.nodeControlStatusDisplay == 1)
			$('[href="#monitoring-controlStatus-display"]').tab('show');
		else
			$('[href="#monitoring-controlStatus-nodisplay"]').tab('show');
		//<- set for graph type monitoring
		
		//-> set for graph type history
		//--> view category
		$('[href="#history-' + _this.viewCategoryIds[mierukaStore.history.viewCategory] + '"]').tab('show');
		
		//--> ex
		$('[href="#history-' + _this.exIds[mierukaStore.history.ex] + '"]').tab('show');
		
		//--> view span
		$('[href="#' + mierukaStore.history.viewspan + '"]').tab('show');
		
		//--> view type
		$('[href="#' + _this.viewTypeIds[mierukaStore.history.viewtype.type] + '"]').tab('show');
		
		//--> electricity display item
		$('[href="#' + mierukaStore.history.dispUnit + '"]').tab('show');
		
		//--> reduction display
		if(mierukaStore.history.reduceDisp == 1)
			$('[href="#reduction-display"]').tab('show');
		else
			$('[href="#reduction-nodisplay"]').tab('show');
		
		//--> graph label display
		if(mierukaStore.history.graphLabelDisp == 1)
			$('[href="#history-label-display"]').tab('show');
		else
			$('[href="#history-label-nodisplay"]').tab('show');
		//<- set for graph type history
		
		//-> show graph type tab
		$('[href="#' + _this.graphTypeIds[mierukaStore.graphType] + '"]').tab('show');
	}
}

let mieruka = new Mieruka();