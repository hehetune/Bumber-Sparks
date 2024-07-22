import { _decorator, CCFloat } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ScriptableStats')
export class ScriptableStats {
    @property({ type: CCFloat, visible: true })
    public dashPower: number = 0;

    @property({ type: CCFloat, visible: true })
    public maxSpeed: number = 0;

    @property({ type: CCFloat, visible: true })
    public acceleration: number = 0;

    @property({ type: CCFloat, visible: true })
    public airDeceleration: number = 0;

    @property({ type: CCFloat, visible: true })
    public dashBuffer: number = 0;

    @property({ type: CCFloat, visible: true })
    public bounceBuffer: number = 0;

    @property({ type: CCFloat, visible: true })
    public bouncePower: number = 0;

    // @property({ type: CCFloat, visible: true })
    // public fallAcceleration: number = 0;

    // @property({ type: CCFloat, visible: true })
    // public groundingForce: number = 0;

    // @property({ type: CCFloat, visible: true })
    // public jumpBuffer: number = 0;

    // @property({ type: CCFloat, visible: true })
    // public horizontalDeadZoneThreshold: number = 0;

    // @property({ type: CCFloat, visible: true })
    // public verticalDeadZoneThreshold: number = 0;
}