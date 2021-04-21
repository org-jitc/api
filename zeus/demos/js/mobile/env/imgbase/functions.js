//* センサー位置、大きさ再設定
function resetPosition(){
	
	var activeTabPane = divTabPane.filter('.active');
	var img = activeTabPane.find('img');
	activeTabPane.height(img.height());
	// 各センサーボックス
	divDragResize.filter(':visible').each(function(){
		
		var item = $(this);
		var id = item.attr('id');
		var position = envPosition[id];
		if(position != null){
			
			var width = item.parent().width();
			var height = item.parent().height();
			
			if(position.width != null){
				
				var boxWidth = width * position.width;
				if(boxWidth < 36)
					boxWidth = 36;
				item.css('width', boxWidth + 'px');
			}
			if(position.height != null){
				
				var boxHeight = height * position.height;
				if(boxHeight < 36)
					boxHeight = 36;
				item.css('height', boxHeight + 'px');
			}
			if(position.left != null)
				item.css('left', (width * position.left) + 'px');
			if(position.top != null)
				item.css('top', (height * position.top) + 'px');
		}
		
		var infos = item.find('.div-info');
		infos.each(function(){
			
			var item = $(this);
			item.css('font-size', parseInt(item.height() * 0.6) + 'px');
		});
	});	
}
//_ センサー位置再設定