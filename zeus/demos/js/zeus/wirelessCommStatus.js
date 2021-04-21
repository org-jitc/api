var networkGroup = $('.network-group');
var unitTypeGroup = $('.unitType-group');

var networkArr = JSON.parse(reqNetworkArr);
var networkMap = {};
var width = 720;
var height = 540;
var nodeR = 12;
var offsetX = null;
var offsetY = null;
var positionData = {};

let intervalTime = 10000;

//***** node tooltip
var nodeToolTip = d3.select("body")
    .append("div")
    .attr("class", "panel panel-default tooltip")
    .style("opacity", 0);
//===== node tooltip

//***** link tooltip
var linkToolTip = d3.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);
//===== link tooltip

//******************** functions
//***** ネットワークグループチェック
networkGroup.change(function(){
	
	if(this.checked)
		$('#' + this.value).removeClass('hide');
	else
		$('#' + this.value).addClass('hide');
});
//===== ネットワークグループチェック

//***** unit type group check
unitTypeGroup.change(function(){
	
	var checked = this.checked;
	if(checked){
		
		$('[data-nodeType="' + this.value + '"]').show();
		$('[text-nodeType="' + this.value + '"]').show();
	}else{
		
		$('[data-nodeType="' + this.value + '"]').hide();
		$('[text-nodeType="' + this.value + '"]').hide();
	}
	
	// link and link text
	$('[data-source-nodeType="' + this.value + '"]').each(function(){
		
		var item = $(this);
		var targetNodeType = item.attr('data-target-nodeType');
		var targetChecked = unitTypeGroup.filter('[value="' + targetNodeType + '"]').prop('checked');
		if(checked){
			
			if(targetChecked)
				item.show();
			else
				item.hide();
		}else
			item.hide();
	});
	
	// link and link text
	$('[data-target-nodeType="' + this.value + '"]').each(function(){
		
		var item = $(this);
		var sourceNodeType = item.attr('data-source-nodeType');
		var sourceChecked = unitTypeGroup.filter('[value="' + sourceNodeType + '"]').prop('checked');
		if(checked){
			
			if(sourceChecked)
				item.show();
			else
				item.hide();
		}else
			item.hide();
	});
});
//===== unit type group check

function tickActions() {
	
	for(var key in networkMap){
		
	  	//update link positions
	 	//simply tells one end of the line to follow one node around
	  	//and the other end of the line to follow the other node around
		d3.select('#svg' + networkMap[key].networkId).selectAll('line')
			.attr("x1", function(d) { 
					
				offsetX = parseInt(nodeR * (d.target.x - d.source.x) / Math.sqrt(Math.pow((d.target.x - d.source.x), 2) + Math.pow((d.target.y - d.source.y), 2)));
				return d.source.x + offsetX; 
			})
	     	.attr("y1", function(d) {
	     		
	     			offsetY = parseInt(nodeR * (d.target.y - d.source.y) / Math.sqrt(Math.pow((d.target.x - d.source.x), 2) + Math.pow((d.target.y - d.source.y), 2)));
	    			return d.source.y + offsetY; 
	     	})
	    	.attr("x2", function(d) {
	    		
	    			offsetX = parseInt(nodeR * (d.target.x - d.source.x) / Math.sqrt(Math.pow((d.target.x - d.source.x), 2) + Math.pow((d.target.y - d.source.y), 2)));
	    			return d.target.x - offsetX;
	    		}
	    	)
	  		.attr("y2", function(d) { 
	  				
	  				offsetY = parseInt(nodeR * (d.target.y - d.source.y) / Math.sqrt(Math.pow((d.target.x - d.source.x), 2) + Math.pow((d.target.y - d.source.y), 2)));
	  				return d.target.y - offsetY; 
	  			}
	  		);
	
		
		d3.select('#svg' + networkMap[key].networkId)
			.select('.link-text').selectAll('text')
			.attr('x', function(d){ return d.source.x + (d.target.x - d.source.x) / 2; })
          	.attr('y', function(d){ return d.source.y + (d.target.y - d.source.y) / 2; });
		
	  	//update circle positions to reflect node updates on each tick of the simulation
		d3.select('#svg' + networkMap[key].networkId).selectAll('circle')
			.attr("cx", function(d) {
			
				if(positionData[d.networkId] == null)
					positionData[d.networkId] = {};
				
				if(positionData[d.networkId][d.name] == null)
					positionData[d.networkId][d.name] = {};
				
				positionData[d.networkId][d.name].x = d.x;
				positionData[d.networkId][d.name].fx = d.x;
				
				return d.x; 
			})
	    	.attr("cy", function(d) {
	    		
	    		if(positionData[d.networkId] == null)
					positionData[d.networkId] = {};
	    		
	    		if(positionData[d.networkId][d.name] == null)
					positionData[d.networkId][d.name] = {};
	    		
	    		positionData[d.networkId][d.name].y = d.y;
	    		positionData[d.networkId][d.name].fy = d.y;
	    		
	    		return d.y; 
	    	});
	  	
		d3.select('#svg' + networkMap[key].networkId)
			.select('.node-text').selectAll('text')
			.attr('x', function(d){return d.x; })
	      	.attr('y', function(d){ return d.y - nodeR; });
	}
}

function drag_start(d) {
	
	for(var key in networkMap){
		
		if(networkMap[key].networkId == d.networkId){
			
			if (!d3.event.active) networkMap[key].simulation.alphaTarget(0.002).restart();
			break;
		}
	}
}

function drag_drag(d) {
	
	d.x = d3.event.x;
	d.y = d3.event.y;
}

function drag_end(d) {
	
	for(var key in networkMap){
		
		if(networkMap[key].networkId == d.networkId){
			
			if (!d3.event.active) networkMap[key].simulation.alphaTarget(0);
			break;
		}
	}
  	
  	d.fx = d.x;
 	d.fy = d.y;

 	if(positionData[d.networkId] == null)
		positionData[d.networkId] = {};
	
	if(positionData[d.networkId][d.name] == null)
		positionData[d.networkId][d.name] = {};
	
	positionData[d.networkId][d.name].x = d.x;
	positionData[d.networkId][d.name].y = d.y;
}

//Zoom functions
function zoom_actions(){
	d3.select(this).select('.zooming').attr("transform", d3.event.transform);
}

$('.node-group').change(function(){

  if(this.checked)
    $('.data-node-group-' + this.value).css('opacity', 1);
  else
    $('.data-node-group-' + this.value).css('opacity', 0);
});

//create tooltips to store the random git search results
// because this doesn't match up to the number of nodes,
function createNodeTooltip(d){
	
	nodeToolTip.transition()
	   .duration(200)
	   .style("opacity", .9);
	
	nodeToolTip.select('ul').remove();
	nodeToolTip
		.append('ul')
		.attr('class', 'list-group')
		.append('li')
		.attr('class', 'list-group-item')
		.html('ノードID: ' + d.name);
	
	nodeToolTip
	  .style("left", (d3.event.pageX) + "px")
	  .style("top", (d3.event.pageY - 28) + "px");
}

function createLinkTooltip(d){

  	linkToolTip.transition()
     	.duration(200)
     	.style("opacity", .9);
	
  	linkToolTip.select('ul').remove();
  	linkToolTip
		.append('ul')
		.attr('class', 'list-group')
		.append('li')
		.attr('class', 'list-group-item')
		.html('電波強度: ' + d.strength);
  	linkToolTip.select('ul')
  		.append('li')
		.attr('class', 'list-group-item')
		.html('電波品質: ' + d.quality);
  	linkToolTip.select('ul')
  		.append('li')
		.attr('class', 'list-group-item')
		.html('再送信回数: ' + d.retryCount);
  	linkToolTip.select('ul')
  		.append('li')
		.attr('class', 'list-group-item')
		.html('エラー回数: ' + d.errorCount);
  	
  	linkToolTip
    	.style("left", (d3.event.pageX) + "px")
    	.style("top", (d3.event.pageY - 28) + "px");
}

function updateData(){
	
	$.ajax({
		url: contextPath + '/Ajax/WirelessStatus/GetLatestStatus.action',
		async: true,
		cache: false,
		success: function(response){
			
			let respObj = JSON.parse(response);
			if(respObj.error != null)
				console.log('error: sync server unreachable..');
			else{
				
				var respArr = respObj.data;
				for(var i in respArr){
					
					var network = respArr[i];
					
					var ipAddress = network.ipAddress;
					var childId = network.childId;
					var networkMapKey = ipAddress + '_' + childId;
					
					networkMap[networkMapKey].nodes = network.nodes;
					networkMap[networkMapKey].links = network.links;
					
					var networkId = networkMap[networkMapKey].networkId;
					var simulation = networkMap[networkMapKey].simulation;
					var zoomingG = null;
					var link = null;
					var linkText = null;
					var node = null;
					var nodeText = null;
					
					var svg = d3.select('#svg' + networkId);
					if(svg.attr('width') == null)
						svg.attr('width', width);
					if(svg.attr('height') == null)
						svg.attr('height', height);
					
					// init zooming
					if(svg.select('.zooming').size() == 0){
						
						zoomingG = svg.append('g').attr('class', 'zooming');
						//add zoom capabilities
						svg.call(d3.zoom().on("zoom", zoom_actions));
					}else
						zoomingG = svg.select('zooming');
					
					// init link
					if(zoomingG.select('.links').size() == 0)
						zoomingG.append('g').attr('class', 'links');
					link = zoomingG.select('.links').selectAll('line');
					// init link text
					if(zoomingG.select('.link-text').size() == 0)
						zoomingG.append('g').attr('class', 'link-text');
					linkText = zoomingG.select('.link-text').selectAll('text');
					// init node
					if(zoomingG.select('.nodes').size() == 0)
						zoomingG.append('g').attr('class', 'nodes');
					node = zoomingG.select('.nodes').selectAll('circle');
					// init node text
					if(zoomingG.select('.node-text').size() == 0)
						zoomingG.append('g').attr('class', 'node-text');
					nodeText = zoomingG.select('.node-text').selectAll('text');
					
					//***** set node position
					var positionObj = positionData[networkId];
					if(positionObj != null){
						
						for(var i in networkMap[networkMapKey].nodes){
							
							var name = networkMap[networkMapKey].nodes[i].name;
							if(positionObj[name] != null){
								
								if(positionObj[name].x != null){
									
									networkMap[networkMapKey].nodes[i].x = positionObj[name].x;
									networkMap[networkMapKey].nodes[i].fx = positionObj[name].x;
								}
								
								if(positionObj[name].y != null){
									
									networkMap[networkMapKey].nodes[i].y = positionObj[name].y;
									networkMap[networkMapKey].nodes[i].fy = positionObj[name].y;
								}
							}
						}
					}
					//===== set node position
					
					//draw lines for the links
					link = link.data(networkMap[networkMapKey].links);
					link.exit().remove();
					link = link
					.enter()
					.append("line")
					.attr('data-source-nodeType', function(d){
						return networkMap[networkMapKey].nodes[d.source].unitType;
					})
					.attr('data-target-nodeType', function(d){
						return networkMap[networkMapKey].nodes[d.target].unitType;
					})
					.attr('marker-end','url(#arrowhead)')
					.merge(link);
					
					linkText.remove();
					linkText = zoomingG.select('.link-text').selectAll('text')
					.data(networkMap[networkMapKey].links)
					.enter()
					.append('text')
					.attr('data-source-nodeType', function(d){
						return networkMap[networkMapKey].nodes[d.source].unitType;
					})
					.attr('data-target-nodeType', function(d){
						return networkMap[networkMapKey].nodes[d.target].unitType;
					})
					.text(function(d){
						return d.strength;
					})
					.on("mouseover",(d,i) => createLinkTooltip(d))
					.on("mouseout",function(d){
						
						linkToolTip.transition()
						.duration(500)
						.style("opacity", 0);
					});
					
					//draw circles for the nodes
					node = node.data(networkMap[networkMapKey].nodes);
					node.exit().remove();
					node = node
					.enter()
					.append("circle")
					.attr('data-nodeType', function(d){
						return d.unitType;
					})
					.attr("r", nodeR)
					.attr("fill", function(d){
						return d.nodeRgb;
					})
					.on("mouseover",(d,i) => createNodeTooltip(d))
					.on("mouseout",function(d){
						nodeToolTip.transition()
						.duration(500)
						.style("opacity", 0);
					})
					.call(
							d3.drag()
							.on('start', drag_start)
							.on('drag', drag_drag)
							.on('end', drag_end)
					)
					.merge(node);
					// node text
					nodeText.remove();
					nodeText = zoomingG.select('.node-text').selectAll('text')
					.data(networkMap[networkMapKey].nodes)
					.enter()
					.append('text')
					.text(function(d){
						return d.unitName;
					})
					.attr('text-nodeType', function(d){
						return d.unitType;
					});
					
					//********** set up the simulation
					simulation
					.nodes(networkMap[networkMapKey].nodes)
					.force('link', d3.forceLink(networkMap[networkMapKey].links).distance(100).strength(1))
					.alpha(0.1)
					.restart();
					//========== set up the simulation
				}
				
				//***** unit type check
				unitTypeGroup.each(function(){
					$(this).change();
				});
				//===== unit type check
			}
			
			setTimeout(updateData, intervalTime);
		},
		error: function(){
			
			console.log('get graph data error');
			setTimeout(updateData, intervalTime);
		}
	});
}

function saveNodePosition(){
	
	$.ajax({
		url: contextPath + '/Ajax/WirelessStatus/SaveNodePosition.action',
		async: true,
		cache: false,
		type: 'POST',
		data: {positionData: JSON.stringify(positionData)},
		success: function(resp){
			
			let respObj = JSON.parse(resp);
			if(respObj.error != null)
				console.log('error: sync server unreachable..');
		},
		error: function() {
			console.log('save node position error.');
		}
	});
}
//==================== functions

//******************** init
if(reqNodePosition != '')
	positionData = JSON.parse(reqNodePosition);

// 線の末端の矢印定義
d3.select('body')
	.append('svg')
	.append('defs')
    .append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '-10 -5 10 10')// (x, y , width, height) x:左上角 y：右上角
    .attr('refx', 13)
    .attr('refy', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 13)
    .attr('markerHeight', 13)
    .attr('xoverflow', 'visible')
    .append('svg:path')
    .attr('d', 'M-10 -5 L0 0 L-10 5')
    .attr('fill', '#999')
    .style('stroke','none');
d3.forceCollide(50); // 接触力: グラフの vertex/node/頂点 が半径 radius の球のようにぶつかるようになる

for(var i in networkArr){

	var valueMap = {};
	valueMap.networkId = i;
	
	var simulation = d3.forceSimulation();
	simulation.force("charge", d3.forceManyBody().strength(-80)) // 万有引力 正数：互相吸引 负数：排斥
	.force("center", d3.forceCenter(width / 2, height / 2))
	.velocityDecay(0.3) // 摩擦力
	.alphaDecay(0.06)
	.on('tick', tickActions);
	valueMap.simulation = simulation;
	
	networkMap[networkArr[i].ipAddress + '_' + networkArr[i].childId] = valueMap;
}

updateData();
//==================== init