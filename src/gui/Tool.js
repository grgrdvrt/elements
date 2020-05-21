import Signal from "../utils/Signal";

export class Tool{
  constructor(stage, mouse, commandClass, description, icon){
    this.stage = stage;
    this.mouse = mouse;
    this.commandClass = commandClass;
    this.description = description;
    this.icon = icon;
    this.commandCompleted = new Signal();
  }

  enable(){
    this.startCommand();
  }

  disable(){
    this.currentCommand.disable();
  }

  startCommand(){
    this.currentCommand = new this.commandClass(this.stage, this.mouse);
    this.currentCommand.completed.add(this.onCommandComplete, this);
    this.currentCommand.enable();
  }

  onCommandComplete(){
    this.currentCommand.completed.remove(this.onCommandComplete, this);
    this.commandCompleted.dispatch(this.currentCommand);
    this.currentCommand.disable();
    this.startCommand();
  }

  cancel(){
    this.currentCommand.cancel();
  }
}
