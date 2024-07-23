import { _decorator, CCFloat, Component } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ScriptableStats')
export class ScriptableStats extends Component {
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
    public dashCooldown: number = 0;

    @property({ type: CCFloat, visible: true })
    public bounceBuffer: number = 0;

    @property({ type: CCFloat, visible: true })
    public bouncePowerWithPlayer: number = 0;

    @property({ type: CCFloat, visible: true })
    public bouncePowerWithPlayerEnhance: number = 0;

    @property({ type: CCFloat, visible: true })
    public bouncePowerWithBounceBar: number = 0;

    @property({ type: CCFloat, visible: true })
    public bouncePowerWithDeathWall: number = 0;
    
    @property({ type: CCFloat, visible: true })
    public health: number = 0;

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