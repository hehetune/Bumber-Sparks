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
  Layers,
} from "cc";
import { ScriptableStats } from "./ScriptableStats";
import { FIXED_DELTA_TIME } from "../Constants";
import { numberMoveTowards, reflect } from "../Utils/Utils";
import { FrameInput } from "./FrameInput";
import { BounceBar } from "../GameLogic/BounceBar";
import { CharacterHealth } from "./CharacterHealth";
const { ccclass, property } = _decorator;

@ccclass("CharacterMovement")
export class CharacterMovement extends Component implements ICharacterMovement {
  // #region variables
  // player stats
  @property({ type: ScriptableStats, visible: true })
  protected _stats: ScriptableStats = null;
  @property({ type: CharacterHealth, visible: true })
  protected _health: CharacterHealth = null;

  // components
  protected _rb: RigidBody2D = null;
  protected _col: Collider2D = null;

  // inputs
  @property({ type: FrameInput, visible: true })
  protected _frameInput: FrameInput = new FrameInput();
  @property({ type: Vec2, visible: true })
  protected _frameVelocity: Vec2 = new Vec2();
  @property({ type: CCFloat, visible: true })
  protected _timeDashWasPressed: number = -999;
  @property({ type: CCBoolean, visible: true })
  protected _dashConsume: boolean = false;
  //   @property({ type: Vec2, visible: true })
  public FrameInput() {
    return this._frameInput;
  }

  // time variables
  @property({ type: CCFloat, visible: true })
  protected _time: number = 0;
  @property({ type: CCFloat, visible: true })
  private _accumulator: number = 0;

  // dash
  protected _dashedCallbacks: Set<() => void> = new Set<() => void>();
  public get DashedCallbacks(): Set<() => void> {
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
    this._stats = this.getComponent(ScriptableStats);
    this._health = this.getComponent(CharacterHealth);
  }

  start() {
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
    let isPlayer =
      otherCollider.node.layer == Math.pow(2, Layers.nameToLayer("Player"));
    let isBounceBar =
      otherCollider.node.layer == Math.pow(2, Layers.nameToLayer("BounceBar"));
    let isDeathWall =
      otherCollider.node.layer == Math.pow(2, Layers.nameToLayer("DeathWall"));

    let bouncePower = 0;

    if (isPlayer) {
      let player = otherCollider.node.getComponent(CharacterMovement);
      if (player.HasBufferedDash())
        bouncePower = this._stats.bouncePowerWithPlayerEnhance;
      else bouncePower = this._stats.bouncePowerWithPlayer;
    }
    if (isBounceBar) {
      let bar = otherCollider.node.getComponent(BounceBar);
      bar.HideBar();
      bouncePower = this._stats.bouncePowerWithBounceBar;
    }
    if (isDeathWall) {
      bouncePower = this._stats.bouncePowerWithDeathWall;
      // receive damage
      this._health.takeDamage(1);
    }

    const worldManifold = contact.getWorldManifold();
    this.calculateBounce(worldManifold.normal, bouncePower);
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

    this._accumulator += deltaTime;

    if (this._accumulator >= FIXED_DELTA_TIME) {
      this.fixedUpdate();
      this._accumulator -= FIXED_DELTA_TIME;
    }
  }

  public updateFrameInput(x: number, y: number, dash: boolean) {
    this._frameInput.move.x = x;
    this._frameInput.move.y = y;
    this._frameInput.dash = dash;
  }

  private canInput = () => !this.HasBufferedBounce();

  fixedUpdate() {
    if (this.canInput()) {
      this.handleDash();
      this.handleDirection();
    }
    this.applyMovement();
  }

  // #endregion

  // #region dash
  public HasBufferedDash = (): boolean =>
    this._time < this._timeDashWasPressed + this._stats.dashBuffer;

  public HasDashCooldown = (): boolean =>
    this._time < this._timeDashWasPressed + this._stats.dashCooldown;

  private handleDash() {
    if (this._frameInput.dash && !this.HasDashCooldown()) {
      this._timeDashWasPressed = this._time;
      this._dashConsume = true;
      this.executeDash();
    }
  }

  private executeDash() {
    this._dashConsume = false;
    this._frameVelocity.x =
      Math.sign(this._frameVelocity.x) * this._stats.dashPower;
    this._frameVelocity.y =
      Math.sign(this._frameVelocity.y) * this._stats.dashPower;
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

  public forceUpdateVelocity(x: number, y: number)
  {
    this._frameVelocity.x = x;
    this._frameVelocity.y = y;
  }
  // #endregion

  // #region bounce
  public bounceToDirection(direction: Vec2, power: number) {
    this._frameVelocity = direction.multiplyScalar(power);
    this._timeStartBounce = this._time;
  }

  private HasBufferedBounce = () =>
    this._time < this._timeStartBounce + this._stats.bounceBuffer;

  private calculateBounce(normalVec: Vec2, power: number) {
    const bounceVelocity = reflect(this._rb.linearVelocity, normalVec);
    this.bounceToDirection(bounceVelocity.normalize(), power);
  }
  // #endregion
}

export interface ICharacterMovement {
  DashedCallbacks: Set<() => void>;
  FrameInput: () => FrameInput;
  HasBufferedDash: () => Boolean;
}
