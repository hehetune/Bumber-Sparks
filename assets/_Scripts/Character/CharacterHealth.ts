import { _decorator, Component, Quat, Prefab as CCPrefab, Prefab } from "cc";
import { ScriptableStats } from "./ScriptableStats";
// import { Prefab } from "../PoolingSystem/Prefab";
import { PoolManager } from "../PoolingSystem/PoolManager";
import { PoolObject } from "../PoolingSystem/PoolObject";
const { ccclass, property } = _decorator;

@ccclass("CharacterHealth")
export class CharacterHealth extends Component {
  private _isDestroyed: boolean = false;

  @property({ type: ScriptableStats, visible: true })
  protected _stats: ScriptableStats = null;

  @property({ type: CCPrefab, visible: true })
  public explodePrefab: Prefab;

  protected _hitCallbacks: Set<() => void> = new Set<() => void>();
  public get HitCallbacks(): Set<() => void> {
    return this._hitCallbacks;
  }

  private _health: number = 0;

  onLoad() {
    this._stats = this.getComponent(ScriptableStats);
    this._health = this._stats.health;
  }

  protected lateUpdate(dt: number): void {
    if (this._isDestroyed) this.node.active = false;
  }

  public takeDamage(damage: number) {
    this._health = Math.max(0, this._health - damage);
    if (this.isDead()) {
      this.onDead();
    }
  }

  onDead() {
    let explodeGO = PoolManager.get<PoolObject>(this.explodePrefab);
    explodeGO.node.position = this.node.position;
    explodeGO.node.rotation = Quat.IDENTITY;
    explodeGO.node.setParent(this.node.parent);
    explodeGO.returnToPoolByLifeTime(1);
    this._isDestroyed = true;
  }

  isDead = () => this._health <= 0;
}
