class GroupTreeElement {
    constructor(root){
        this.data = {
            display: true
        };
        this.root = root;
        this.id = this.root.getAttribute('data-leaf-id');
        this.name = this.root.getAttribute('data-leaf-name');
        this.menu = this.root.getAttribute('data-menu');

        if(this.id !== 'empty'){
            this.element = this.root.querySelector('[type="checkbox"]');
            return;
        }
        this.data.display = false;
    }

    get checked(){

        if(this.element == null){
            return false;
        }
        return this.element.checked;
    }
    set checked(val){

        if(this.element != null){
            this.element.checked = val;
        }
    }
    get display(){
        return this.data.display;
    }
    set display(val){
        this.data.display = val;

        if(val){
            Zeus.showElement(this.root);
            return;
        }
        Zeus.hideElement(this.root);
    }
}

class GroupTreeNodeEditModal {
    constructor(){
        this.data = {
            mode: null,
            targetNodeId: null,
            groupTrees: null,
            targetNodeData: null
        };
        this.root = document.querySelector('#GroupTreeNodeEdit');
        this.form = this.root.getElementsByTagName('form')[0];
        this.modal = new bootstrap.Modal('#GroupTreeNodeEdit');
        this.name = this.root.querySelector('#name');

        this.nodeIcon = document.querySelector('#nodeIcon');
        this.nodeIconDisplay = document.querySelector('#nodeIconDisplay');

        this.emptyElement = new GroupTreeElement(this.root.querySelector('[data-element-type="elementContainer"][data-leaf-id="empty"]'));
        // energySensor, simpleOperation leafs' container array
        this.leafContainers = Array.from(this.root.querySelectorAll('[data-element-type="elementContainer"]'))
        .filter(el => el.getAttribute('data-leaf-id') !== 'empty')
        .map(el => new GroupTreeElement(el));

        this.energySensorIcon = this.root.querySelector('#energySensorIcon');
        this.energySensorIconDisplay = this.root.querySelector('#energySensorIconDisplay');
        this.simpleOperationIcon = this.root.querySelector('#simpleOperationIcon');
        this.simpleOperationIconDisplay = this.root.querySelector('#simpleOperationIconDisplay');

        this.btnConfirm = this.root.querySelector('#confirm');

        this.modal._element.addEventListener('shown.bs.modal', this.onModalShown.bind(this));
        this.nodeIcon.addEventListener('keyup', this.onIconInput.bind(this, this.nodeIcon, this.nodeIconDisplay));
        this.nodeIcon.addEventListener('change', this.onIconInput.bind(this, this.nodeIcon, this.nodeIconDisplay));
        this.energySensorIcon.addEventListener('keyup', this.onIconInput.bind(this, this.energySensorIcon, this.energySensorIconDisplay));
        this.simpleOperationIcon.addEventListener('keyup', this.onIconInput.bind(this, this.simpleOperationIcon, this.simpleOperationIconDisplay));
        this.btnConfirm.addEventListener('click', this.onBtnConfirmClick.bind(this));
    }

    onIconInput(iconInput, idisplay){
        idisplay.setAttribute('class', `${iconInput.value.trim()} text-primary`);
    }
    onBtnConfirmClick(){

        if(!this.form.reportValidity()){
            return;
        }
        if(this.data.targetNodeData == null){
            this.data.targetNodeData = {};
        }
        this.data.targetNodeData.name = this.name.value.trim();

        if(this.nodeIcon.value.trim() !== ''){
            this.data.targetNodeData.icon = this.nodeIcon.value.trim();
        }else{
            delete this.data.targetNodeData.icon;
        }
        if(this.data.targetNodeData.level == null){
            this.data.targetNodeData.level = this.data.groupTrees.calculateChildLevel(this.data.targetNodeData.id??this.data.targetNodeId);
        }
        let elements = this.leafContainers.filter(element => element.display && element.checked);

        if(elements.length > 0){
            let elementLevel = parseInt(this.data.targetNodeData.level) + 1;

            this.data.targetNodeData.leafs = elements.map(element => {
                let nodeData = {
                    id: element.id,
                    name: element.name,
                    menu: element.menu
                };
                nodeData.level = elementLevel;

                if(element.menu === 'energySensor' && this.energySensorIcon.value.trim() !== ''){
                    nodeData.icon = this.energySensorIcon.value.trim();
                }else if(element.menu == 'simpleOperation' && this.simpleOperationIcon.value.trim() !== ''){
                    nodeData.icon = this.simpleOperationIcon.value.trim();
                }
                return nodeData;
            })
        }else{
            delete this.data.targetNodeData.leafs;
        }
        console.log(this.data.targetNodeData);
        if(this.data.mode === 'add'){
            this.data.groupTrees.addNodeData(this.data.targetNodeId, this.data.targetNodeData);
        }else{
            this.data.groupTrees.reset();
        }
        this.modal.hide();
    }
    onModalShown(){
        this.name.focus();
    }

    show(){
        this.modal.show();
    }
    clearNodeIcon(){
        this.nodeIcon.value = '';
        this.nodeIconDisplay.setAttribute('class', '');
    }
    /**
     * @param nodeId 新しいノードが追加される親ノードid
     * @param groupTrees GroupTrees ツリー構造データ全部
     **/
    add(nodeId, groupTrees){
        this.data.mode = 'add';
        this.data.targetNodeId = nodeId;
        this.data.groupTrees = groupTrees;
        this.data.targetNodeData = null;

        this.name.value = '';

        this.clearNodeIcon();

        this.leafContainers.forEach(element => {
            element.checked = false;

            let el = groupTrees.root.querySelector(`.list-group-item[data-node-id="${element.id}"]`);

            element.display = el == null;
        });
        this.emptyElement.display = this.leafContainers.every(element => element.display === false);

        this.energySensorIconDisplay.value = '';
        this.energySensorIconDisplay.setAttribute('class', '');
        this.simpleOperationIconDisplay.value = '';
        this.simpleOperationIconDisplay.setAttribute('class', '');

        this.modal.show();
    }
    edit(nodeData, groupTrees){
        console.log(nodeData, groupTrees);
        this.data.mode = 'edit';
        this.data.targetNodeId = null;
        this.data.groupTrees = groupTrees;
        this.data.targetNodeData = nodeData;

        this.name.value = nodeData.name;

        if(nodeData.icon != null){
            this.nodeIcon.value = nodeData.icon;
            this.nodeIconDisplay.setAttribute('class', nodeData.icon);
        }else{
            this.clearNodeIcon();
        }
        this.leafContainers.forEach(element => {
            element.checked = nodeData.elements?.find(elNode => elNode.id === element.id) != null;

            let el = groupTrees.root.querySelector(`.list-group-item[data-node-id="${element.id}"]`);
            element.display = el == null || element.checked;
        });
        this.emptyElement.display = this.leafContainers.every(element => element.display === false);

        if(nodeData.elementsIcon != null){
            this.elementsIcon.value = nodeData.elementsIcon;
            this.elementsIconDisplay.setAttribute('class', nodeData.elementsIcon);
        }else{
            this.elementsIcon.value = '';
            this.elementsIconDisplay.setAttribute('class', '');
        }
        this.modal.show();
    }
}