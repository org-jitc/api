// global message modal
let COMM_MSG_OBJ = {
	modal: $('#modal-comm-msg'),
	msg: $('#div-modal-comm-msg'),
	messages: {
		failed: 'リクエスト処理ができませんでした。'
	},
	classes: {
		info: 'text-dark',
		error: 'text-danger'
	},
	show: function(message, isDefault, statusClass){
		
		this.msg.text(isDefault? this.messages[message]: message);
		this.msg.attr('class', this.classes[statusClass]);
		this.modal.modal('show');
	}
};

//------------------------------------------------------------------------------------
// functions
// event starts with 'on*'
function trigger(element, event){
	
	if (element.fireEvent){
		element.fireEvent(event);
	}else{
	    let ev = document.createEvent("HTMLEvents");
	    // event not contain 'on'
	    // (eventType, canBubble, canelable)
	    ev.initEvent(event.replace('on', ''), false, true);  
	    element.dispatchEvent(ev);
	}
}

function ZeusAdmin(){}
ZeusAdmin.prototype = {
	toElementArray: function(el){
		let arr;
		if(el instanceof NodeList){
			arr = el;
		}else{
			arr = [el];
		}
		return arr;
	},
	addClass: function(el, newClass){
		if(newClass !== null && newClass.trim() !== ''){
			let originClass;
			let arr = this.toElementArray(el);
			for(let i = 0, l = arr.length; i < l; i++){
				originClass = arr[i].getAttribute('class');
				if(originClass === null || originClass.trim() === ''){
					arr[i].setAttribute('class', newClass);
				}else{
					if(originClass.indexOf(newClass) < 0){
						arr[i].setAttribute('class', [originClass, newClass].join(' '));
					}
				}
			}
		}
	},
	removeClass: function(el, targetClass){
		let elClass;
		let arr = this.toElementArray(el);
		for(let i = 0, l = arr.length; i < l; i++){
			elClass = arr[i].getAttribute('class')
			if(elClass !== null && elClass.trim() !== ''){
				if(elClass.indexOf(' ' + targetClass) >= 0){
					arr[i].setAttribute('class', elClass.replace(' ' + targetClass, ''));
				}else if(elClass.indexOf(targetClass) >= 0){
					arr[i].setAttribute('class', elClass.replace(targetClass, ''));
				}
			}
		}
	},
	hideElement: function(el){
		this.addClass(el, 'd-none');
	},
	showElement: function(el){
		this.removeClass(el, 'd-none');
	}
};

let zeusadmin = new ZeusAdmin();