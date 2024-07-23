import { _decorator, Component, Node } from "cc";
import { CharacterMovement } from "./Character/CharacterMovement";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  public static Instance: GameManager = null;

  @property({ type: Node, visible: true })
  public players: Array<Node> = new Array<Node>();

  protected onLoad(): void {
    if (GameManager.Instance != null) this.node.destroy();
    GameManager.Instance = this;
  }

  protected start(): void {
    this.loadPlayers();
  }

  protected loadPlayers() {
    this.node.parent.children.forEach((c) => {
      if (c.getComponent(CharacterMovement)) {
        console.log(c.name);
        this.players.push(c);
      }
    });
  }
}
