var tabModifyForm = $('#tabModifyForm');
var id = $('[name="id"]');
var tabName = $('[name="tabName"]');
var graphLabelName = $('[name="graphLabelName"]');
var graphLabelReduce = $('[name="graphLabelReduce"]');
var graphColor = $('[name="graphColor"]');
var graphColorReduce = $('[name="graphColorReduce"]');
var orderTab = $('[name="orderTab"]');
var orderGraph = $('[name="orderGraph"]');

function modify(data){
	
	id.val(data.id);
	tabName.val(data.tabName);
	graphLabelName.val(data.graphLabelName);
	graphLabelReduce.val(data.graphLabelReduce);
	graphColor.val(data.graphColor);
	graphColorReduce.val(data.graphColorReduce);
	orderTab.val(data.orderTab);
	orderGraph.val(data.orderGraph);
	
	tabModifyForm.submit();
}