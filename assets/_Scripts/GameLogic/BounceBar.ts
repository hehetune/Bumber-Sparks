import { _decorator, Component } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BounceBar")
export class BounceBar extends Component {
  private _isDestroyed: boolean = false;

  public HideBar() {
    this._isDestroyed = true;
  }

  protected lateUpdate(dt: number): void {
    if (this._isDestroyed) this.node.active = false;
  }
}
