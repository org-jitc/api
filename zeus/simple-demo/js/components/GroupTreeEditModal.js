class GroupTreeElement {
    constructor(root){
        this.data = {
            display: true
        };
        this.root = root;
        this.id = this.root.getAttribute('data-element-id');
        this.name = this.root.getAttribute('data-element-name');

        if(this.id !== 'empty'){
            this.element = this.root.querySelector('[type="checkbox"]');
        }else{
            this.data.display = false;
        }
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

        this.emptyElement = new GroupTreeElement(this.root.querySelector('[data-element-type="elementContainer"][data-element-id="empty"]'));
        // Array of GroupTreeElement
        this.elements = Array.from(this.root.querySelectorAll('[data-element-type="elementContainer"]'))
        .filter(el => el.getAttribute('data-element-id') !== 'empty')
        .map(el => new GroupTreeElement(el));

        this.elementsIcon = this.root.querySelector('#elementsIcon');
        this.elementsIconDisplay = this.root.querySelector('#elementsIconDisplay');

        this.icons = new Icons();

        this.btnConfirm = this.root.querySelector('#confirm');

        this.modal._element.addEventListener('shown.bs.modal', this.onModalShown.bind(this));
        this.nodeIcon.addEventListener('keyup', this.onIconInput.bind(this, this.nodeIcon, this.nodeIconDisplay));
        this.nodeIcon.addEventListener('change', this.onIconInput.bind(this, this.nodeIcon, this.nodeIconDisplay));
        this.elementsIcon.addEventListener('keyup', this.onIconInput.bind(this, this.elementsIcon, this.elementsIconDisplay));
        this.btnConfirm.addEventListener('click', this.onBtnConfirmClick.bind(this));
    }

    onIconInput(iconInput, idisplay){
        idisplay.setAttribute('class', `${iconInput.value.trim()} text-primary`);
    }
    onBtnConfirmClick(){

        if(this.form.reportValidity()){

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
            let elements = this.elements.filter(element => element.display && element.checked);

            if(elements.length > 0){
                let elementLevel = parseInt(this.data.targetNodeData.level) + 1;

                this.data.targetNodeData.elements = elements.map(element => {
                    let elementNodeData = {
                        id: element.id,
                        name: element.name
                    };
                    elementNodeData.level = elementLevel;
                    if(this.elementsIcon.value.trim() !== ''){
                        elementNodeData.icon = this.elementsIcon.value.trim();
                    }
                    return elementNodeData;
                })
            }else{
                delete this.data.targetNodeData.elements;
            }
            if(this.data.mode === 'add'){
                this.data.groupTrees.addNodeData(this.data.targetNodeId, this.data.targetNodeData);
            }else{
                this.data.groupTrees.reset();
            }
            this.modal.hide();
        }
    }
    onModalShown(){
        this.name.focus();
        this.icons.iconFilter.value = '';
        this.icons.onIconFilterKeyUp();
    }

    show(){
        this.modal.show();
    }
    clearNodeIcon(){
        this.nodeIcon.value = '';
        this.nodeIconDisplay.setAttribute('class', '');
    }
    /**
     * elements: ツリーに追加されたelementは非表示にする
     * targetTreeId: どのノードに追加するか
     * 
     * @param node 新しいノードが追加される親ノード
     * @param groupTrees GroupTrees ツリー構造データ全部
     **/
    add(nodeId, groupTrees){
        this.data.mode = 'add';
        this.data.targetNodeId = nodeId;
        this.data.groupTrees = groupTrees;
        this.data.targetNodeData = null;

        this.name.value = '';

        this.clearNodeIcon();

        this.elements.forEach(element => {
            element.checked = false;

            let el = groupTrees.root.querySelector(`.list-group-item[data-node-id="${element.id}"]`);

            element.display = el == null;
        });
        this.emptyElement.display = this.elements.every(element => element.display === false);

        this.elementsIcon.value = '';
        this.elementsIconDisplay.setAttribute('class', '');

        this.modal.show();
    }
    edit(nodeData, groupTrees){
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

        this.elements.forEach(element => {
            element.checked = nodeData.elements?.find(elNode => elNode.id === element.id) != null;

            let el = groupTrees.root.querySelector(`.list-group-item[data-node-id="${element.id}"]`);
            element.display = el == null || element.checked;
        });
        this.emptyElement.display = this.elements.every(element => element.display === false);

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