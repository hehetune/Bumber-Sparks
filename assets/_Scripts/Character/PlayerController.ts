import { _decorator, Component, Input, input, KeyCode, log } from "cc";
import { CharacterMovement } from "./CharacterMovement";
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {
  @property({ type: CharacterMovement, visible: true })
  protected _characterMovement: CharacterMovement = null;

  // inputs
  private _pressedKeys: Set<number> = new Set();

  protected onLoad(): void {
    this._characterMovement = this.node.getComponent(CharacterMovement);
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  protected start(): void {}

  public onKeyDown(event: { keyCode: any }) {
    this._pressedKeys.add(event.keyCode);
  }

  public onKeyUp(event: { keyCode: any }) {
    this._pressedKeys.delete(event.keyCode);
  }

  protected update(dt: number): void {
    this.updateInput();
  }

  private updateInput() {
    let x = 0,
      y = 0,
      dash = false;
    if (
      this._pressedKeys.has(KeyCode.ARROW_LEFT) ||
      this._pressedKeys.has(KeyCode.KEY_A)
    ) {
      x = -1;
    }
    if (
      this._pressedKeys.has(KeyCode.ARROW_RIGHT) ||
      this._pressedKeys.has(KeyCode.KEY_D)
    ) {
      x = 1;
    }
    if (
      this._pressedKeys.has(KeyCode.ARROW_UP) ||
      this._pressedKeys.has(KeyCode.KEY_W)
    ) {
      y = 1;
    }
    if (
      this._pressedKeys.has(KeyCode.ARROW_DOWN) ||
      this._pressedKeys.has(KeyCode.KEY_S)
    ) {
      y = -1;
    }
    if (this._pressedKeys.has(KeyCode.SPACE)) {
      dash = true;
    }

    this._characterMovement.updateFrameInput(x, y, dash);
  }
}
