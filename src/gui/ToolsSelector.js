export default class ToolsSelector{
    constructor(tools){
        this.domElement = document.createElement("ul");
        this.domElement.classList.add("toolsSelector");
        this.tools = tools;
        this.onClickBind = this.onClick.bind(this);
        this.setCurrentTool(this.tools[0]);
    }

    enable(){
        this.domElement.addEventListener("click", this.onClickBind);
    }

    disable(){
        this.domElement.removeEventListener("click", this.onClickBind);
    }

    buildList(){
        this.tools.forEach((tool, i) => {
            const container = document.createElement("li");
            container.classList.add("tool");
            this.domElement.appendChild(container);
            const element = document.createElement("button");
            element.innerHTML = tool.description;
            element.dataset.id = i;
            container.appendChild(element);
        });
    }

    onClick(evt){
        let id = parseInt(evt.target.dataset.id);
        this.setCurrentTool(this.tools[id]);
    }

    setCurrentTool(tool){
        if(this.currentTool !== undefined){
            this.currentTool.disable();
        }
        this.currentTool = tool;
        this.currentTool.enable();
    }
}
