import { _decorator, Component, Vec3, CCFloat, animation } from "cc";
import { CharacterMovement, ICharacterMovement } from "./CharacterMovement";
import { FIXED_DELTA_TIME } from "../Constants";
import { numberMoveTowards } from "../Utils/Utils";
import { CharacterHealth } from "./CharacterHealth";
const { ccclass, property } = _decorator;

@ccclass("CharacterAnimator")
export class CharacterAnimator extends Component {
  @property({ type: animation.AnimationController, visible: true })
  private _anim: animation.AnimationController = null;

  @property({ type: CharacterMovement, visible: true })
  private _characterMovement: ICharacterMovement = null;

  @property({ type: CharacterHealth, visible: true })
  private _characterHealth: CharacterHealth = null;

  private static readonly IdleKey = "Idle";
  private static readonly BoostKey = "Boost";
  private static readonly HitKey = "Hit";

  @property({ type: CCFloat, visible: true })
  private _maxTilt: number = 5;

  @property({ type: CCFloat, visible: true })
  private _tiltSpeed: number = 20;

  private _accumulator: number = 0;

  onLoad() {
    this._characterMovement = this.node.parent.getComponent(CharacterMovement);
    this._characterHealth = this.node.parent.getComponent(CharacterHealth);
    this._anim = this.node.getComponent(animation.AnimationController);
  }

  onEnable() {
    // this._characterMovement.DashedCallbacks.add(this.OnDashed);
    // Assuming there's a method to handle being hit
    this._characterHealth.HitCallbacks.add(this.OnHit);
  }

  onDisable() {
    // this._characterMovement.DashedCallbacks.delete(this.OnDashed);
    this._characterHealth.HitCallbacks.delete(this.OnHit);
  }

  update(deltaTime: number) {
    if (this._characterMovement == null) return;

    this._accumulator += deltaTime;

    if (this._accumulator >= FIXED_DELTA_TIME) {
      this.fixedUpdate();
      this._accumulator -= FIXED_DELTA_TIME;
    }
  }

  fixedUpdate() {
    this.HandleCharacterState();
    this.HandleCharacterTilt();
  }

  private HandleCharacterState() {
    if (this._characterMovement.HasBufferedDash()) {
      this._anim.setValue("Boost", true);
    } else {
      this._anim.setValue("Boost", false);
    }
  }

  private HandleCharacterTilt() {
    let frameInput = this._characterMovement.FrameInput();
    this.node.setRotationFromEuler(
      new Vec3(
        this.node.eulerAngles.x,
        frameInput.move.x > 0
          ? 0
          : frameInput.move.x < 0
          ? 180
          : this.node.eulerAngles.y,
        numberMoveTowards(
          this.node.eulerAngles.z,
          this._maxTilt * frameInput.move.y,
          120 * FIXED_DELTA_TIME
        )
      )
    );
  }

  // private OnDashed() {
  //   this._anim.play(CharacterAnimator.BoostKey);
  // }

  private OnHit() {
    this._anim.setValue("Hit", true);
  }
}
