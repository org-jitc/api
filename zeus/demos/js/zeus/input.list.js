var groupObj = {
	ul: $('#ul-group'),
	checkAll: $('#checkGroupAll'),
	check: $('[name="group"]'),
	tbl: $('.tbl-input'),
	showedTbl: null,
	hiddenTbl: null,
	checkLen: null,
	init: function(){
		
		this.showedTbl = this.tbl.filter(':visible');
		this.hiddenTbl = this.tbl.not(':visible');
		this.checkLen = this.check.length;
		// group check all
		this.checkAll.change(function(){
			
			groupObj.check.prop('checked', this.checked);
			groupObj.check.each(function(){
				$(this).change();
			});
		});
		
		this.check.change(function(){
			
			var filterClass = '[data-groupId="' + this.value + '"]';
			if(this.checked)
				groupObj.hiddenTbl.filter(filterClass).show();
			else
				groupObj.showedTbl.filter(filterClass).hide();
			
			groupObj.showedTbl = groupObj.tbl.filter(':visible');
			groupObj.hiddenTbl = groupObj.tbl.not(':visible');
			
			var checkedLen = groupObj.check.filter(':checked').length;
			if(groupObj.checkLen != 0 && groupObj.checkLen == checkedLen)
				groupObj.checkAll.prop('checked', true);
			else
				groupObj.checkAll.prop('checked', false);
			
			if(checkedLen == 0)
				ListShowHide.hideAll();
			else
				ListShowHide.showAll();
		});
		
		// init
		this.check.change();
	},
	getCheckedIds: function(){
		return this.check.filter(':checked').map(function(){
			return this.value;
		}).get().join(',');
	}
};
groupObj.init();