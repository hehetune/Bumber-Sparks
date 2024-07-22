import { _decorator, Component, Input, input, log } from "cc";
import { CharacterMovement } from "./CharacterMovement";
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {
  @property({ type: CharacterMovement, visible: true })
  protected _characterMovement: CharacterMovement = null;

  protected start(): void {
    // this._characterMovement = this.getComponent(CharacterMovement);
    // // input.on(Input.EventType.KEY_DOWN, this._characterMovement.onKeyDown, this);
    // // input.on(Input.EventType.KEY_UP, this._characterMovement.onKeyUp, this);
    // this._characterMovement.hehe();

    // if (this._characterMovement) {
    //   input.on(
    //     Input.EventType.KEY_DOWN,
    //     this._characterMovement.onKeyDown,
    //     this
    //   );
    //   input.on(
    //     Input.EventType.KEY_UP,
    //     this._characterMovement.onKeyUp,
    //     this
    //   );
    // } else {
    //   log("CharacterMovement component not found on the node.");
    //   window.alert("CharacterMovement component not found on the node.");
    // }
  }
}
