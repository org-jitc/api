/**
         * list-group
         * id:
         * editable:
         * datas:
         * 
         * */
class GroupTrees {
    constructor(config){
        this.data = {
            autoIncrement: 0,
            editable: config.editable??false,
            expandable: config.expandable??false,
            trees: config.datas??[],
            expandCallBack: config.expandCallBack
        };
        this.root = document.querySelector(`#${config.id}`);

        if(this.data.editable){
            this.editModal = new GroupTreeNodeEditModal(config.modalId);
        }
        this.reset();
    }

    /**
     * ノードの選択状態更新
     * */
    onNormalNodeClick(nodeId){
        let nodeData = this.findNodeData(nodeId, this.data.trees);
        nodeData.expanded = !nodeData.expanded;
        this.expandTree(nodeData, nodeData.expanded);

        if(this.data.expandCallBack){
            this.data.expandCallBack(this.getVisibleElementIds());
        }
    }
    /**
     * ノードの追加ボタンの動作
     * */
    onNodeAddClick(nodeId){
        this.editModal.add(nodeId, this);
    }
    onNodeDelClick(nodeId){

        if(window.confirm('削除しますか。')){

            if(nodeId === 'root'){
                this.data.trees = [];
            }else{
                this.deleteNodeData(this.data.trees, nodeId);
            }
            this.reset();
        }
    }
    onNormalNodeEditClick(nodeId){
        this.editModal.edit(this.findNodeData(nodeId, this.data.trees), this);
    }
    onNormalNodeSortUpClick(nodeId){
        let nodeArray = this.findNodeArray(nodeId, this.data.trees);
        let currentIndex = nodeArray.findIndex(node => node.id === nodeId);
        let removed = nodeArray.splice(currentIndex, 1);
        
        --currentIndex;

        if(currentIndex < 0){
            currentIndex = 0;
        }
        nodeArray.splice(currentIndex, 0, ...removed);
        this.reset();
    }
    onNormalNodeSortDownClick(nodeId){
        let nodeArray = this.findNodeArray(nodeId, this.data.trees);
        let currentIndex = nodeArray.findIndex(node => node.id === nodeId);
        let removed = nodeArray.splice(currentIndex, 1);

        ++currentIndex;

        if(currentIndex > nodeArray.length){
            currentIndex = nodeArray.length;
        }
        nodeArray.splice(currentIndex, 0, ...removed);
        this.reset();
    }

    rendering(datas){
        console.log(datas);
        let item;

        for(let data of datas){
            // initialize 'expanded' property
            if(this.expandable && data.expanded == null){
                data.expanded = false;
            }
            // check already rendered
            item = this.root.querySelector(`.list-group-item[data-node-id="${data.id}"]`);
            
            if(item == null){
                this.appendNodeDom(data);
            }
            if(data.nodes != null){
                this.rendering(data.nodes);
            }
            if(data.leafs != null){
                this.rendering(data.leafs);
            }
        }
    }
    reset(){
        this.root.innerHTML = '';

        if(this.data.editable){
            this.appendNodeDom({id: 'root'});
        }
        this.rendering(this.data.trees);

        if(this.data.expandable){
            this.data.trees.forEach(dataNode => this.expandTree(dataNode, dataNode.expanded));
        }
    }

    /**
     * Add a new node data to GroupTrees
     * */
    addNodeData(parentId, newNodeData){

        if(newNodeData.id == null){
            newNodeData.id = `GTtemp${++this.data.autoIncrement}`;
        }
        // add to root
        if(parentId === 'root'){
            this.data.trees.push(newNodeData);
        }else{
            let nodeData = this.findNodeData(parentId, this.data.trees);

            if(nodeData.nodes == null){
                nodeData.nodes = [];
            }
            newNodeData.level = parseInt(nodeData.level) + 1;
            nodeData.nodes.push(newNodeData);
        }
        this.reset();
    }
    /**
     * Delete node data from GroupTrees
     * 再帰削除
     * */
    deleteNodeData(datas, nodeId){

        for(let i = 0, l = datas.length; i < l; i++){

            if(datas[i].id === nodeId){
                datas.splice(i, 1);
                return;
            }
            if(datas[i].nodes != null){
                this.deleteNodeData(datas[i].nodes, nodeId);
            }
            if(datas[i].elements != null){
                this.deleteNodeData(datas[i].elements, nodeId);
            }
        }
    }

    appendNodeDom(data){
        this.root.append(this.createNodeDom(data));
    }
    createNodeDom(data){
        let li = document.createElement('li');
        li.setAttribute('class', 'list-group-item');

        if(data.id === 'root'){
            li.setAttribute('data-node-type', 'root');
        }else if(data.id.startsWith('GT')){
            li.setAttribute('data-node-type', 'node');
        }else{
            li.setAttribute('data-node-type', 'element');
        }
        li.setAttribute('data-node-id', data.id);
        li.setAttribute('data-parent-id', data.parentId??'root');

        if(data.id.startsWith('GT') && this.data.expandable){
            li.setAttribute('role', 'button');
            li.addEventListener('click', this.onNormalNodeClick.bind(this, data.id));
        }
        if(data.id !== 'root'){
            li.append(this.createNodeNameDom(data));
        }
        if(!this.data.editable){
            return li;
        }
        if(data.id === 'root'){
            li.append(this.createNodeActionDom(data.id, {
                add: true,
                del: true
            }));
        }else if(data.id.startsWith('GT')){
            li.append(this.createNodeActionDom(data.id, {
                add: true,
                del: true,
                edit: true,
                sortUp: true,
                sortDown: true
            }));
        }else{
            li.append(this.createNodeActionDom(data.id, {
                del: true
            }));
        }
        return li;
    }
    createNodeNameDom(data){
        let div = document.createElement('div');
        div.setAttribute('class', 'float-start');

        if(data.level != 0){
            div.style.marginLeft = `calc(${data.level} * var(--tree-space))`;
        }
        if(data.icon != null){
            let i = document.createElement('i');
            i.setAttribute('class', `${data.icon} me-2`);
            div.append(i);
        }
        div.append(data.name);
        return div;
    }
    createNodeActionButtonDom(nodeId, iconDom){
        let btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('class', 'btn btn-outline-primary');
        btn.innerHTML = iconDom;
        return btn;
    }
    createNodeAddButtonDom(nodeId){
        let btnDom = this.createNodeActionButtonDom(nodeId, '<i class="bi bi-plus-lg"></i>');
        btnDom.addEventListener('click', this.onNodeAddClick.bind(this, nodeId));
        return btnDom;
    }
    createNodeDelButtonDom(nodeId){
        let btnDom = this.createNodeActionButtonDom(nodeId, '<i class="bi bi-dash-lg"></i>');
        btnDom.addEventListener('click', this.onNodeDelClick.bind(this, nodeId));
        return btnDom;
    }
    createNodeEditButtonDom(nodeId){
        let btnDom = this.createNodeActionButtonDom(nodeId, '<i class="bi bi-pencil"></i>');
        btnDom.addEventListener('click', this.onNormalNodeEditClick.bind(this, nodeId));
        return btnDom;
    }
    createNodeSortUpButtonDom(nodeId){
        let btnDom = this.createNodeActionButtonDom(nodeId, '<i class="bi bi-sort-up"></i>');
        btnDom.addEventListener('click', this.onNormalNodeSortUpClick.bind(this, nodeId));
        return btnDom;
    }
    createNodeSortDownButtonDom(nodeId){
        let btnDom = this.createNodeActionButtonDom(nodeId, '<i class="bi bi-sort-down"></i>');
        btnDom.addEventListener('click', this.onNormalNodeSortDownClick.bind(this, nodeId));
        return btnDom;
    }
    createNodeActionDom(nodeId, config){
        let div = document.createElement('div');
        div.setAttribute('class', 'btn-group btn-group-sm float-end');

        if(config.add){
            div.append(this.createNodeAddButtonDom(nodeId));
        }
        if(config.del){
            div.append(this.createNodeDelButtonDom(nodeId));
        }
        if(config.edit){
            div.append(this.createNodeEditButtonDom(nodeId));
        }
        if(config.sortUp){
            div.append(this.createNodeSortUpButtonDom(nodeId));
        }
        if(config.sortDown){
            div.append(this.createNodeSortDownButtonDom(nodeId));
        }
        return div;
    }

    /**
     * Find a node data from GroupTrees
     * 再帰
     * */
    findNodeData(nodeId, datas){
        let targetData;

        for(let data of datas){
            
            if(data.id === nodeId){
                return data;
            }
            if(data.nodes != null){
                targetData = this.findNodeData(nodeId, data.nodes);
                
                if(targetData != null){
                    return targetData;
                }
            }
            if(data.elements != null){
                targetData = this.findNodeData(nodeId, data.elements);
                
                if(targetData != null){
                    return targetData;
                }
            }

        }
        return null;
    }
    findNodeArray(nodeId, datas){

        if(datas.find(data => data.id === nodeId) != null){
            return datas;
        }
        let array;

        for(let data of datas){

            if(data.nodes != null){
                array = this.findNodeArray(nodeId, data.nodes);

                if(array != null){
                    return array;
                }
            }
        }
    }
    /**
     * 該当ノードと子ノードから探す
     * */
    findElements(datas, nodeId, elements){

        for(let data of datas){

            if(data.id === nodeId){
                
                if(data.elements != null){
                    elements.push(...data.elements.map(el => el.id));
                }
                if(data.nodes != null){
                    this.findElements(data.nodes, nodeId, elements);
                }
            }
        }
    }
    calculateChildLevel(parentId){

        if(parentId === 'root'){
            return 0;
        }
        let parentNode = this.findNodeData(parentId, this.data.trees);
        return parseInt(parentNode.level) + 1;
    }
    expandTree(nodeData, expanded){
        let item;

        nodeData?.nodes?.forEach(node => {
            item = this.root.querySelector(`.list-group-item[data-node-id="${node.id}"]`);

            if(expanded){
                Zeus.showElement(item);
            }else{
                Zeus.hideElement(item);
            }
            if(node.nodes != null || node.elements != null){
                this.expandTree(node, node.expanded && expanded);
            }
        });
        nodeData?.elements?.forEach(element => {
            item = this.root.querySelector(`.list-group-item[data-node-id="${element.id}"]`);
            
            if(expanded){
                Zeus.showElement(item);
            }else{
                Zeus.hideElement(item);
            }
        });
    }

    /**
     * 
     * @returns []: show all, [with ids]: show id associated 
     */
    getVisibleElementIds(){
        return Array.from(this.root.querySelectorAll('.list-group-item:not(.d-none)[data-node-type="element"]'))
        .map(dom => dom.getAttribute('data-node-id'));
    }
}