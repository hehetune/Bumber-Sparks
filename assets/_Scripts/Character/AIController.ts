import { _decorator, CCFloat, Component, Node, Vec3 } from "cc";
import { CharacterMovement } from "./CharacterMovement";
import { getRandomBetween } from "../Utils";
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
    let minDistance = 999999;
    let targetPlayer: Node = null;
    GameManager.Instance.players.forEach((p) => {
      let distance = Vec3.distance(this.node.position, p.position);
      if (minDistance >= distance) {
        targetPlayer = p;
        minDistance = distance;
      }
    });

    let attackDir: Vec3 = new Vec3();
    console.log(targetPlayer.name);
    Vec3.subtract(attackDir, targetPlayer.position, this.node.position);
    console.log(targetPlayer.position);
    attackDir.normalize();

    this._characterMovement.updateFrameInput(attackDir.x, attackDir.y, true);

    this._currentActionCooldown = getRandomBetween(
      this._actionCooldown - this._actionCooldownDiff,
      this._actionCooldown + this._actionCooldownDiff
    );
    this._actionTimer = 0;
  }
}
