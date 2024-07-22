import {
  _decorator,
  Component,
  RigidBody2D,
  Collider2D,
  Vec2,
  Input,
  input,
  KeyCode,
  CCFloat,
  CCBoolean,
  Contact2DType,
  IPhysics2DContact,
  PhysicsSystem2D,
} from "cc";
import { ScriptableStats } from "./ScriptableStats";
import { FIXED_DELTA_TIME } from "../Constants";
import { numberMoveTowards, reflect } from "../Utils";
import { FrameInput } from "./FrameInput";
const { ccclass, property } = _decorator;

@ccclass("CharacterMovement")
export class CharacterMovement extends Component implements ICharacterMovement {
  // #region variables
  // player stats
  @property({ type: ScriptableStats, visible: true })
  protected _stats: ScriptableStats = null;

  // components
  protected _rb: RigidBody2D = null;
  protected _col: Collider2D = null;

  // inputs
  private _pressedKeys: Set<number> = new Set();
  @property({ type: FrameInput, visible: true })
  protected _frameInput: FrameInput = new FrameInput();
  @property({ type: Vec2, visible: true })
  protected _frameVelocity: Vec2 = new Vec2();
  @property({ type: CCFloat, visible: true })
  protected _timeDashWasPressed: number = -999;
  @property({ type: CCBoolean, visible: true })
  protected _dashConsume: boolean = false;
  @property({ type: Vec2, visible: true })
  public FrameMoveInput: Vec2 = this?._frameInput?.move;

  // time variables
  @property({ type: CCFloat, visible: true })
  protected _time: number = 0;
  @property({ type: CCFloat, visible: true })
  private _accumulator: number = 0;

  // dash
  protected _dashedCallbacks: Set<() => void> = null;
  public get DashedCallbacks(): Set<() => void> {
    if (this._dashedCallbacks == null)
      this._dashedCallbacks = new Set<() => void>();
    return this._dashedCallbacks;
  }

  // bounce
  protected _timeStartBounce: number = -999;
  //   protected _bounceDirection: Vec2 = new Vec2();
  // #endregion

  // #region main behaviour
  onLoad() {
    this._rb = this.getComponent(RigidBody2D);
    this._col = this.getComponent(Collider2D);
  }

  start() {
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

    const rigidBody = this.getComponent(RigidBody2D);
    rigidBody.bullet = true;

    const collider = this.getComponent(Collider2D);
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
      collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
      collider.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
      collider.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
    } else {
      console.error("Collider2D component not found on this node.");
    }

    // // Registering global contact callback functions
    // if (PhysicsSystem2D.instance) {
    //   PhysicsSystem2D.instance.on(
    //     Contact2DType.BEGIN_CONTACT,
    //     this.onBeginContact,
    //     this
    //   );
    //   PhysicsSystem2D.instance.on(
    //     Contact2DType.END_CONTACT,
    //     this.onEndContact,
    //     this
    //   );
    //   PhysicsSystem2D.instance.on(
    //     Contact2DType.PRE_SOLVE,
    //     this.onPreSolve,
    //     this
    //   );
    //   PhysicsSystem2D.instance.on(
    //     Contact2DType.POST_SOLVE,
    //     this.onPostSolve,
    //     this
    //   );
    // }
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact
  ) {
    console.log("Begin Contact with", otherCollider.node.name);
    // Lấy điểm va chạm
    const worldManifold = contact.getWorldManifold();
    const points = worldManifold.points;

    if (points.length > 0) {
      //   const collisionPoint = new Vec3(points[0].x, points[0].y, 0);
      //   console.log("Collision Point:", collisionPoint);

      // Lấy vector pháp tuyến
      const normal = worldManifold.normal;
      console.log("Collision Normal:", normal);

      // Tính toán vector phản lực
      this.calculateBounce(normal);
    }
  }

  onEndContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    // will be called once when the contact between two colliders just about to end.
    // console.log('onEndContact');
  }
  onPreSolve(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    // will be called every time collider contact should be resolved
    // console.log('onPreSolve');
  }
  onPostSolve(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    // will be called every time collider contact should be resolved
    // console.log('onPostSolve');
  }

  update(deltaTime: number) {
    this._time += deltaTime;

    this.updateFrameInput();

    this._accumulator += deltaTime;

    if (this._accumulator >= FIXED_DELTA_TIME) {
      this.fixedUpdate();
      this._accumulator -= FIXED_DELTA_TIME;
    }
  }

  private updateFrameInput() {
    this._frameInput.move.x = 0;
    this._frameInput.move.y = 0;
    this._frameInput.dash = false;

    if (
      this._pressedKeys.has(KeyCode.ARROW_LEFT) ||
      this._pressedKeys.has(KeyCode.KEY_A)
    ) {
      this._frameInput.move.x = -1;
    }
    if (
      this._pressedKeys.has(KeyCode.ARROW_RIGHT) ||
      this._pressedKeys.has(KeyCode.KEY_D)
    ) {
      this._frameInput.move.x = 1;
    }
    if (
      this._pressedKeys.has(KeyCode.ARROW_UP) ||
      this._pressedKeys.has(KeyCode.KEY_W)
    ) {
      this._frameInput.move.y = 1;
    }
    if (
      this._pressedKeys.has(KeyCode.ARROW_DOWN) ||
      this._pressedKeys.has(KeyCode.KEY_S)
    ) {
      this._frameInput.move.y = -1;
    }
    if (this._pressedKeys.has(KeyCode.SPACE)) {
      this._frameInput.dash = true;
    }
  }

  public onKeyDown(event: { keyCode: any }) {
    this._pressedKeys.add(event.keyCode);
  }

  public onKeyUp(event: { keyCode: any }) {
    this._pressedKeys.delete(event.keyCode);
  }

  private canInput = () => !this.hasBounceBuffer();

  fixedUpdate() {
    if (this.canInput()) {
      this.handleDash();
      this.handleDirection();
    }
    this.applyMovement();
  }

  // #endregion

  // #region dash
  private HasBufferedDash = (): boolean =>
    this._time < this._timeDashWasPressed + this._stats.dashBuffer;

  private handleDash() {
    if (this._frameInput.dash && !this.HasBufferedDash()) {
      this._timeDashWasPressed = this._time;
      this._dashConsume = true;
      this.executeDash();
    }
    // if (!this._dashConsume || !this.HasBufferedDash()) return;
  }

  private executeDash() {
    this._dashConsume = false;
    this._frameVelocity.x =
      Math.sign(this._frameVelocity.x) *
      this._stats.maxSpeed *
      this._stats.dashPower;
    this._frameVelocity.y =
      Math.sign(this._frameVelocity.y) *
      this._stats.maxSpeed *
      this._stats.dashPower;
    if (this.DashedCallbacks) this.DashedCallbacks.forEach((f) => f());
  }
  // #endregion

  // #region movement
  private handleDirection() {
    this.handleAxisDirection("x");
    this.handleAxisDirection("y");
  }

  private handleAxisDirection(axis: "x" | "y") {
    if (this.HasBufferedDash()) return;

    const moveAxis = this._frameInput.move[axis];
    const velocityAxis = this._frameVelocity[axis];
    const maxSpeed = this._stats.maxSpeed;

    if (moveAxis == 0) {
      const deceleration =
        this._stats.airDeceleration *
          FIXED_DELTA_TIME *
          Math.abs(velocityAxis) >
        maxSpeed
          ? 5
          : 1;
      this._frameVelocity[axis] = numberMoveTowards(
        velocityAxis,
        0,
        deceleration
      );
    } else {
      const acceleration =
        this._stats.acceleration * FIXED_DELTA_TIME * Math.abs(velocityAxis) >
        maxSpeed
          ? 5
          : 1;
      this._frameVelocity[axis] = numberMoveTowards(
        velocityAxis,
        maxSpeed * moveAxis,
        acceleration
      );
    }
  }

  private applyMovement() {
    this._rb.linearVelocity = this._frameVelocity;
  }
  // #endregion

  // #region bounce
  public bounceToDirection(direction: Vec2) {
    this._frameVelocity = direction.multiplyScalar(this._stats.bouncePower);
    this._timeStartBounce = this._time;
  }

  private hasBounceBuffer = () =>
    this._time < this._timeStartBounce + this._stats.bounceBuffer;

  private calculateBounce(normalVec: Vec2) {
    const bounceVelocity = reflect(this._rb.linearVelocity, normalVec);
    this.bounceToDirection(bounceVelocity.normalize());
  }
  // #endregion
}

export interface ICharacterMovement {
  DashedCallbacks: Set<() => void>;
  FrameMoveInput: Vec2;
}
