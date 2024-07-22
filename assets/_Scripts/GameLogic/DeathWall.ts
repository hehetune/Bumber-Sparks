import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, RigidBody2D } from "cc";
const { ccclass, property } = _decorator;

@ccclass("DeathWall")
export class DeathWall extends Component {
  protected start(): void {
    const rigidBody = this.getComponent(RigidBody2D);
    rigidBody.bullet = true;

    const collider = this.getComponent(Collider2D);
    if (collider) {
      collider.sensor = true;
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
      // collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
      // collider.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
      // collider.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
    } else {
      console.error("Collider2D component not found on this node.");
    }
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact
  ) {
    console.log("Begin Contact with", otherCollider.node.name);
  }

  // onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
  //     console.log('End Contact with', otherCollider.node.name);
  // }

  // onPreSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
  //     console.log('Pre Solve with', otherCollider.node.name);
  // }

  // onPostSolve(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact) {
  //     console.log('Post Solve with', otherCollider.node.name);
  // }
}
