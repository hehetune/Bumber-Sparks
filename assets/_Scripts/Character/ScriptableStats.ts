import { _decorator } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('ScriptableStats')
export class ScriptableStats {
    @property
    public dashPower: number = 0;

    @property
    public maxSpeed: number = 0;

    @property
    public acceleration: number = 0;

    @property
    public airDeceleration: number = 0;

    @property
    public dashBuffer: number = 0;

    // @property
    // public fallAcceleration: number = 0;

    // @property
    // public groundingForce: number = 0;

    // @property
    // public jumpBuffer: number = 0;

    @property
    public horizontalDeadZoneThreshold: number = 0;

    @property
    public verticalDeadZoneThreshold: number = 0;
}