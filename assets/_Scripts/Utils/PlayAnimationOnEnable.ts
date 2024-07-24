import { _decorator, Animation, Component } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayAnimationOnEnable")
export class PlayAnimationOnEnable extends Component {
  private _animation: Animation = null;

  protected onLoad(): void {
    this._animation = this.getComponent(Animation);
  }

  protected onEnable(): void {
    this._animation.play();
  }
}
