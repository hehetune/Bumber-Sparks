import {
  _decorator,
  Component,
  Sprite,
  Animation,
  RigidBody2D,
  Vec2,
  Vec3,
  macro,
  math,
} from "cc";
import { CharacterMovement, ICharacterMovement } from "./CharacterMovement";
import { FIXED_DELTA_TIME } from "../Constants";
const { ccclass, property } = _decorator;

@ccclass("CharacterAnimator")
export class CharacterAnimator extends Component {
  @property({ type: Animation })
  private _anim: Animation = null;

  @property
  public _characterMovement: ICharacterMovement = null;
  private _rb: RigidBody2D = null;
  private _grounded: boolean = false;

  private static readonly GroundedKey = "Grounded";
  private static readonly IsMovingKey = "IsMoving";
  private static readonly VYKey = "vy";

  private _maxIdleSpeed: number = 2;
  private _maxTilt: number = 5;
  private _tiltSpeed: number = 20;

  onLoad() {
    this._characterMovement = this.getComponent(CharacterMovement);
    this._rb = this.getComponent(RigidBody2D);
  }

  onEnable() {
    this._characterMovement = this.getComponent(CharacterMovement);
    this._characterMovement.DashedCallbacks.add(this.OnDashed);
  }

  onDisable() {
    this._characterMovement.DashedCallbacks.delete(this.OnDashed);
  }

  update(deltaTime: number) {
    if (this._characterMovement == null) return;

    // this.HandleSpriteFlip();
    this.HandleMovingHorizontal();
    this.HandleMovingVertical();
    this.HandleCharacterTilt();
  }

  //   private HandleSpriteFlip() {
  //     if (this._characterMovement.FrameInput.x !== 0) {
  //       this.node.eulerAngles = new Vec3(0, this._characterMovement.FrameInput.x < 0 ? 180 : 0, 0);
  //     }
  //   }

  private HandleMovingHorizontal() {
    // const inputStrength = Math.abs(this._characterMovement.FrameInput.x);
    // this._anim.play(CharacterAnimator.IsMovingKey)
    // this._anim.createState(CharacterAnimator.IsMovingKey, inputStrength !== 0);
  }

  private HandleMovingVertical() {
    // this._anim.setParameter(CharacterAnimator.VYKey, this._rb.linearVelocity.y);
  }

  private HandleCharacterTilt() {
    const runningTilt = this._grounded
      ? math.Quat.fromEuler(
          new math.Quat(),
          0,
          0,
          this._maxTilt * this._characterMovement.FrameInput.x
        )
      : math.Quat.IDENTITY;
    const up = new Vec3(0, 1, 0);
    math.Vec3.transformQuat(up, up, runningTilt);
    math.Vec3.rotateZ(
      this._anim.node.up,
      this._anim.node.up,
      up,
      this._tiltSpeed * FIXED_DELTA_TIME
    );
  }

  private OnDashed() {
    // this._anim.setState(CharacterAnimator.JumpKey, true);
    // this._anim.setState(CharacterAnimator.GroundedKey, false);
  }
}
