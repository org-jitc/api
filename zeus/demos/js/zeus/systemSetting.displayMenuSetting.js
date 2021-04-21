let menuObj;
let displayMenuSettingObj = {
	btnSave: $('#btn-save-menu'),
	modal: $('#modal-display-menu-setting'),
	err: $('#div-err-menu'),
	tbl: $('#tbl-menu'),
	init: function(){
		this.btnSave.click(function(){
			displayMenuSettingObj.btnSave.button('loading');
			displayMenuSettingObj.err.empty();
			var changedArr = [];
			var menu, changed, id;
			var order = 1;
			var switchers = $('[name="isDisplay"]');
			for(var i = 0, l = switchers.length; i < l; i++){
				changed = null;
				id = $(switchers[i]).attr('data-menuId');
				menu = menuObj[id];
				if(menu.isNameChanged != null){
					if(changed == null){
						changed = {};
						changed.id = id;
					}
					changed.name = menu.newName;
				}
				if(menu.isDisplayPowerChanged != null){
					if(changed == null){
						changed = {};
						changed.id = id;
					}
					changed.displayPower = menu.newDisplayPower;
				}
				if(menu.isDisplayChanged != null){
					if(changed == null){
						changed = {};
						changed.id = id;
					}
					changed.isDisplay = menu.newIsDisplay;
				}
				if(menu.displayOrder != order){
					if(changed == null){
						changed = {};
						changed.id = id;
					}
					changed.displayOrder = order;
				}
				if(changed != null) changedArr.push(changed);
				order += 1;
			}
			if(changedArr.length == 0){
				displayMenuSettingObj.err.text('変更されていません。');
				displayMenuSettingObj.btnSave.button('reset');
			}else{
				$.ajax({
					url: contextPath + 'Ajax/SystemMenu/Save.action',
					async: true,
					cache: false,
					method: 'POST',
					data: {data: JSON.stringify(changedArr)},
					dataArr: changedArr,
					success: function(resp){
						let respObj = JSON.parse(resp);
						if(respObj.status == 'error')
							displayMenuSettingObj.err.text('リクエスト処理ができませんでした。しばらくしてからリトライしてください。');
						else{
							var obj, changed, id;
							for(var i = 0, l = this.dataArr.length; i < l; i++){
								changed = this.dataArr[i];
								id = changed.id;
								obj = menuObj[id];
								if(changed.name != null){
									obj.name = changed.name;
									delete obj.newName;
									delete obj.isNameChanged;
								}
								if(changed.displayPower != null){
									obj.displayPower = changed.displayPower;
									delete obj.newDisplayPower;
									delete obj.isDisplayPowerChanged;
								}
								if(changed.isDisplay != null){
									obj.isDisplay = changed.isDisplay;
									delete obj.newIsDisplay;
									delete obj.isDisplayChanged;
								}
								if(changed.displayOrder != null){
									obj.displayOrder = changed.displayOrder;
									delete obj.newDisplayOrder;
									delete obj.isDisplayOrderChanged;
								}
							}
							alert('保存されました。');
						}
						displayMenuSettingObj.btnSave.button('reset');
					},
					error: function(){
						displayMenuSettingObj.err.text('リクエスト処理ができませんでした。しばらくしてからリトライしてください。');
						displayMenuSettingObj.btnSave.button('reset');
					}
				});
			}
		});
		
		if(this.tbl.length > 0){
			menuObj = JSON.parse(reqSystemMenuObj);
			//_______________________________
			// construct bootstrap table data
			var data = [];
			var dataObj;
			for(var id in menuObj){
				dataObj = {};
				dataObj.id = id;
				dataObj.name = menuObj[id].name;
				dataObj.displayPower = menuObj[id].displayPower;
				dataObj.isDisplay = '<input name="isDisplay" type="checkbox" data-menuId="' + id + '" data-toggle="toggle" data-onstyle="success" data-style="ios" data-size="mini" data-on="表示" data-off="非表示" data-width="60" ' + (menuObj[id].isDisplay == 1? 'checked': '') + '>';
				data.push(dataObj);
			}
			// construct bootstrap table data
			//-------------------------------
			this.tbl.bootstrapTable({
				editable: true,
				columns: [{
					field: 'name',
					title: 'メニュー名',
					editable: {
						type: 'text'
					}
				},{
					field: 'displayPower',
					title: '表示権限',
					editable: {
						type: 'select',
						source: [
							{value: 'power-super', text: 'システム管理者'},
							{value: 'power-admin', text: '管理者'},
							{value: '', text: '一般'}
						]
					}
				},{
					field: 'isDisplay',
					title: '表示・非表示',
					align: 'center'
				}],
				data: data,
				onEditableSave: function(field, row, oldValue, $el){
					var menu = menuObj[row.id];
					if(field == 'name'){
						menu.newName = row.name;
						if(menu.name != row.name) menu.isNameChanged = true;
						else delete menu.isNameChanged;
					}else if(field == 'displayPower'){
						menu.newDisplayPower = row.displayPower;
						if(menu.displayPower != row.displayPower)
							menu.isDisplayPowerChanged = true;
						else delete menu.isDisplayPowerChanged;
					}
				}
			});
			
			$('[name="isDisplay"]').change(function(){
				var item = $(this);
				var menuId = item.attr('data-menuId');
				var menu = menuObj[menuId];
				if(this.checked) menu.newIsDisplay = 1;
				else menu.newIsDisplay = 0;
				if(menu.isDisplay != menu.newIsDisplay)
					menu.isDisplayChanged = true;
				else delete menu.isDisplayChanged;
			});
		}
	}
};
displayMenuSettingObj.init();
