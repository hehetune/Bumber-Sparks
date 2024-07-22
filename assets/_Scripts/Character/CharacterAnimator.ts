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
  CCFloat,
} from "cc";
import { CharacterMovement, ICharacterMovement } from "./CharacterMovement";
import { FIXED_DELTA_TIME } from "../Constants";
import { numberMoveTowards } from "../Utils";
const { ccclass, property } = _decorator;

@ccclass("CharacterAnimator")
export class CharacterAnimator extends Component {
  @property({ type: Animation, visible: true })
  private _anim: Animation = null;

  @property({ type: CharacterMovement, visible: true })
  public _characterMovement: ICharacterMovement = null;
  //   private _rb: RigidBody2D = null;

  private static readonly GroundedKey = "Grounded";
  private static readonly IsMovingKey = "IsMoving";
  private static readonly VYKey = "vy";

  @property({ type: CCFloat, visible: true })
  private _maxTilt: number = 5;
  @property({ type: CCFloat, visible: true })
  private _tiltSpeed: number = 20;
  private _accumulator: number = 0;

  onLoad() {
    this._characterMovement = this.node.parent.getComponent(CharacterMovement);
    // this._rb = this.node.parent.getComponent(RigidBody2D);
  }

  onEnable() {
    this._characterMovement.DashedCallbacks.add(this.OnDashed);
  }

  onDisable() {
    this._characterMovement.DashedCallbacks.delete(this.OnDashed);
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
    let frameInput = this._characterMovement.FrameMoveInput;

    this.node.setRotationFromEuler(
      new Vec3(
        this.node.eulerAngles.x,
        frameInput.x > 0 ? 0 : frameInput.x < 0 ? 180 : this.node.eulerAngles.y,
        numberMoveTowards(
          this.node.eulerAngles.z,
          this._maxTilt * frameInput.y,
          120 * FIXED_DELTA_TIME
        )
      )
    );
  }

  private OnDashed() {
    // this._anim.setState(CharacterAnimator.JumpKey, true);
    // this._anim.setState(CharacterAnimator.GroundedKey, false);
  }
}
