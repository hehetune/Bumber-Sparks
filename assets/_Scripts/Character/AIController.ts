import {
  _decorator,
  CCFloat,
  Component,
  Node,
  RigidBody2D,
  Vec2,
  Vec3,
} from "cc";
import { CharacterMovement } from "./CharacterMovement";
import { getRandomBetween } from "../Utils/Utils";
import { GameManager } from "../GameManager";
const { ccclass, property } = _decorator;

@ccclass("AIController")
export class AIController extends Component {
  @property({ type: CharacterMovement, visible: true })
  protected _characterMovement: CharacterMovement = null;

  @property({ type: CCFloat, visible: true })
  protected _actionCooldown: number = 1;
  protected _currentActionCooldown: number = 0;
  protected _actionTimer: number = 0;

  @property({ type: CCFloat, visible: true })
  protected _actionCooldownDiff: number = 0.2;

  protected onLoad(): void {
    this._characterMovement = this.node.getComponent(CharacterMovement);
  }

  protected start(): void {
    this._currentActionCooldown = getRandomBetween(
      this._actionCooldown - this._actionCooldownDiff,
      this._actionCooldown + this._actionCooldownDiff
    );
  }

  protected update(dt: number): void {
    this._actionTimer += dt;
    if (this._actionTimer >= this._currentActionCooldown) {
      this.doAttack();
    }
  }

  protected doAttack() {
    let minDistance = Number.MAX_VALUE;
    let targetPlayer: Node = null;

    // Find the closest player
    GameManager.Instance.players.forEach((p) => {
      if (p.active && p !== this.node) {
        const distance = Vec3.distance(this.node.position, p.position);
        if (distance < minDistance) {
          minDistance = distance;
          targetPlayer = p;
        }
      }
    });

    if (!targetPlayer) {
      return; // No target found, exit the function
    }

    // Calculate attack direction
    const attackDir: Vec3 = new Vec3();
    const targetPoint: Vec3 = new Vec3(targetPlayer.position);
    const velocity: Vec2 = new Vec2(
      targetPlayer.getComponent(RigidBody2D).linearVelocity
    );
    if (velocity.x > 1 || velocity.y > 1) {
      velocity.normalize();
      velocity.multiplyScalar(75);
      targetPoint.x += velocity.x;
      targetPoint.y += velocity.y;
    }
    Vec3.subtract(attackDir, targetPoint, this.node.position);
    attackDir.normalize();

    // Perform the attack
    if (!this._characterMovement.HasDashCooldown()) {
      this._characterMovement.forceUpdateVelocity(attackDir.x, attackDir.y);
      this._characterMovement.updateFrameInput(attackDir.x, attackDir.y, true);
    } else
      this._characterMovement.updateFrameInput(attackDir.x, attackDir.y, false);

    // Set action cooldown
    this._currentActionCooldown = getRandomBetween(
      this._actionCooldown - this._actionCooldownDiff,
      this._actionCooldown + this._actionCooldownDiff
    );
    this._actionTimer = 0;
  }
}
