import { _decorator, Component, Input, input } from "cc";
import { CharacterMovement } from "./CharacterMovement";
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {
  @property(CharacterMovement)
  protected _characterMovement: CharacterMovement = null;

  protected onLoad(): void {
    this._characterMovement = this.getComponent(CharacterMovement);
    input.on(Input.EventType.KEY_DOWN, this._characterMovement.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this._characterMovement.onKeyUp, this);
  }
}
