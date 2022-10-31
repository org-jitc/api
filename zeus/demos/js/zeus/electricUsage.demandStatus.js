/**
 * デマンド状況データ取得
 */
function DemandStatus(demandStatusArr) {
	this.isFirstFetch = true;
	this.demandStatusArr = demandStatusArr;
}
DemandStatus.prototype.fetchData = function(){
	let date = new Date();
		
	if(this.isFirstFetch){
		
		axios.get('/zdaemon/', {
		params: {
			t: 'rd',
			viewspan: 'd',
			ys: date.getFullYear(),
			ms: date.getMonth() + 1,
			ds: date.getDate()
		}
	})
		.then(() => {
			this.isFirstFetch = false;
			this.fetchData()
		})
		.catch(error => console.error(error));
	}else{
		axios.get('/zdaemon/', {
			params: {
				t: 'rd',
				viewspan: 'd',
				ys: date.getFullYear(),
				ms: date.getMonth() + 1,
				ds: date.getDate()
			}
		})
			.then(resp => {
				let div = document.createElement('div');
				div.innerHTML = resp;
				let table  = div.children[0];
				
				this.demandStatusArr
					.forEach(status => {
						let label = document.querySelector(`#${status.itemId}[data-target="signage"]`);
						
						if(label){
							let tr = table.getElementsByTagName('tr')[parseInt(status.dataIndexTr)];
							let td = tr.children[parseInt(status.dataIndexTd)];
							let data = td.innerText.trim();
							
							label.innerText = data === '-'? '': data.replace('kWh', '').replace('kW', '').trim();
						}
					});
			})
			.catch(error => console.error(error));
	}
}