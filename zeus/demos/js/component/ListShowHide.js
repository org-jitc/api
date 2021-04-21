;(function(w){
	
	// 
	var showHideLink = $('.show-hide-link');
	var showHideItem = $('.show-hide-item');
	
	var displayNameObj = {
		showAll: fmtLinkDisplayAll? fmtLinkDisplayAll: '全体表示',
		showItem: fmtLabelsDetails? fmtLabelsDetails: '詳細',
		hideAll: fmtLinkNotDisplayAll? fmtLinkNotDisplayAll: '全体非表示',
		hideItem: fmtNotDisplay? fmtNotDisplay: '非表示',
		getName: function(isAll, status){
			
			if(status == 'open')
				return isAll? this.hideAll: this.hideItem;
			else
				return isAll? this.showAll: this.showItem;
		}
	};
	
	showHideLink.click(function(){
		
		var item = $(this);
		var key = item.attr('data-key');
		// 全体の場合はもう片方も選択
		if(key == 'all')
			item = showHideLink.filter('[data-key="all"]');
		
		var status = item.attr('data-status');
		if(status == 'open')
			status = 'close';
		else
			status = 'open';
		
		item.attr('data-status', status);
		// set display name
		item.text(displayNameObj.getName(key == 'all', status));
		
		var filtered;
		if(key == 'all'){
		
			var parent = showHideItem.parent().filter(':visible');
			filtered = parent.find('.show-hide-item');
			
			var filteredLink = parent.find('.show-hide-link');
			// set item status
			filteredLink.attr('data-status', status);
			// set item display name
			filteredLink.text(displayNameObj.getName(false, status));
		}else
			filtered = showHideItem.filter('[data-key="' + key + '"]');
		
		// set show hide
		if(status == 'open'){
			
			if(filtered.hasClass('hide'))
				filtered.removeClass('hide');
			else
				filtered.show();
		}else
			filtered.hide();
		
		// set to session
		var param = {};
		param.menu = reqMenu;
		param.key = key;
		param.currentStatus = status;
		
		$.ajax({
			url: '/zeus/ShowHideDetailedInfo',
			async: true,
			cache: false,
			type: 'post',
			data: param,
			error: function(){
				console.log('save list close open status error');
			}
		});
	});
	
	w.ListShowHide = {
		hideAll: function(){
			showHideLink.filter('[data-key="all"]').hide();
		},
		showAll: function(){
			
			var filtered = showHideLink.filter('[data-key="all"]');
			if(filtered.hasClass('hide'))
				filtered.removeClass('hide');
			else
				filtered.show();
		}
	};
	
}(window));