import { _decorator, CCBoolean, Vec2 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("FrameInput")
export class FrameInput {
  @property({ type: CCBoolean, visible: true })
  dash: boolean = false;
  @property({ type: Vec2, visible: true })
  move: Vec2 = new Vec2();
}
