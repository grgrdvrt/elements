export default class ToolsSelector{
  constructor(tools){
    this.domElement = document.createElement("ul");
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
      let container = document.createElement("li");
      this.domElement.appendChild(container);
      let element = document.createElement("button");
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
