import {
  _decorator,
  Component,
  RigidBody2D,
  Collider2D,
  Vec2,
  Input,
  input,
  KeyCode,
} from "cc";
import { ScriptableStats } from "./ScriptableStats";
import { FIXED_DELTA_TIME } from "../Constants";
const { ccclass, property } = _decorator;

@ccclass("CharacterMovement")
export class CharacterMovement extends Component implements ICharacterMovement {
  @property(ScriptableStats)
  protected _stats: ScriptableStats = null;

  protected _rb: RigidBody2D = null;
  protected _col: Collider2D = null;
  protected _frameInput: FrameInput = new FrameInput();
  protected _frameVelocity: Vec2 = new Vec2();
  protected canInput: boolean = false;
  protected _time: number = 0;
  protected _jumpToConsume: boolean = false;
  protected _timeJumpWasPressed: number = 0;

  private _accumulator: number = 0;

  public FrameInput: Vec2 = this._frameInput.move;
  protected _dashedCallbacks: Set<() => void> = null;

  public get DashedCallbacks(): Set<() => void> {
    if (this._dashedCallbacks == null)
      this._dashedCallbacks = new Set<() => void>();
    return this._dashedCallbacks;
  }

  start() {
    this._rb = this.getComponent(RigidBody2D);
    this._col = this.getComponent(Collider2D);
  }

  update(deltaTime: number) {
    this._time += deltaTime;

    // Tích lũy thời gian trôi qua
    this._accumulator += deltaTime;

    if (this._accumulator >= FIXED_DELTA_TIME) {
      // Cập nhật logic vật lý với tần số cố định
      this.fixedUpdate();
      this._accumulator -= FIXED_DELTA_TIME;
    }
  }

  public onKeyDown(event: { keyCode: any }) {
    switch (event.keyCode) {
      case KeyCode.ARROW_LEFT:
      case KeyCode.KEY_A:
        if (this._frameInput.move.x == 0) this._frameInput.move.x = -1;
        break;
      case KeyCode.ARROW_RIGHT:
      case KeyCode.KEY_D:
        if (this._frameInput.move.x == 0) this._frameInput.move.x = 1;
        break;
      case KeyCode.ARROW_UP:
      case KeyCode.KEY_W:
        if (this._frameInput.move.y == 0) this._frameInput.move.y = 1;
        break;
      case KeyCode.ARROW_DOWN:
      case KeyCode.KEY_S:
        if (this._frameInput.move.y == 0) this._frameInput.move.y = -1;
        break;
      case KeyCode.SPACE:
        this._frameInput.dash = true;
        this._jumpToConsume = true;
        this._timeJumpWasPressed = this._time;
        break;
    }
  }

  public onKeyUp(event: { keyCode: any }) {
    switch (event.keyCode) {
      case KeyCode.ARROW_LEFT:
      case KeyCode.KEY_A:
        if (this._frameInput.move.x == -1) this._frameInput.move.x = 0;
        break;
      case KeyCode.ARROW_RIGHT:
      case KeyCode.KEY_D:
        if (this._frameInput.move.x == 1) this._frameInput.move.x = 0;
        break;
      case KeyCode.ARROW_UP:
      case KeyCode.KEY_W:
        if (this._frameInput.move.y == 1) this._frameInput.move.y = 0;
        break;
      case KeyCode.ARROW_DOWN:
      case KeyCode.KEY_S:
        if (this._frameInput.move.y == -1) this._frameInput.move.y = 0;
        break;
    }
  }

  fixedUpdate() {
    this.handleDash();
    this.handleDirection();
    this.applyMovement();
  }

  private HasBufferedJump = (): boolean =>
    this._time < this._timeJumpWasPressed + this._stats.dashBuffer;

  private handleDash() {
    if (!this._jumpToConsume && !this.HasBufferedJump()) return;

    this.executeDash();

    this._jumpToConsume = false;
  }

  private executeDash() {
    this._timeJumpWasPressed = 0;
    this._frameVelocity.y = this._stats.dashPower;
    if (this.DashedCallbacks) this.DashedCallbacks.forEach((f) => f());
  }

  private handleDirection() {
    if (this._frameInput.move.x === 0) {
      const deceleration = this._stats.airDeceleration;
      this._frameVelocity.x = this.moveTowards(
        this._frameVelocity.x,
        0,
        deceleration * FIXED_DELTA_TIME
      );
    } else {
      this._frameVelocity.x = this.moveTowards(
        this._frameVelocity.x,
        this._frameInput.move.x * this._stats.maxSpeed,
        this._stats.acceleration * FIXED_DELTA_TIME
      );
    }
  }

  private applyMovement() {
    this._rb.linearVelocity = this._frameVelocity;
  }

  private moveTowards(current: number, target: number, maxDelta: number) {
    if (Math.abs(target - current) <= maxDelta) {
      return target;
    }
    return current + Math.sign(target - current) * maxDelta;
  }
}

@ccclass("FrameInput")
export class FrameInput {
  dash: boolean = false;
  move: Vec2 = new Vec2();
}

export interface ICharacterMovement {
  DashedCallbacks: Set<() => void>;
  FrameInput: Vec2;
}
