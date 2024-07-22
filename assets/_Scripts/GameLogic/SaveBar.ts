import {
  _decorator,
  Collider2D,
  Component,
  Contact2DType,
  IPhysics2DContact,
  RigidBody2D,
  Vec2,
  Vec3,
} from "cc";
import { CharacterMovement } from "../Character/CharacterMovement";
import { reflect } from "../Utils";
const { ccclass, property } = _decorator;

@ccclass("SaveBar")
export class SaveBar extends Component {
//   protected start(): void {
//     const rigidBody = this.getComponent(RigidBody2D);
//     rigidBody.bullet = true;

//     const collider = this.getComponent(Collider2D);
//     if (collider) {
//       collider.sensor = true;
//       collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
//       // collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
//       // collider.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this);
//       // collider.on(Contact2DType.POST_SOLVE, this.onPostSolve, this);
//     } else {
//       console.error("Collider2D component not found on this node.");
//     }
//   }

//   onBeginContact(
//     selfCollider: Collider2D,
//     otherCollider: Collider2D,
//     contact: IPhysics2DContact
//   ) {
//     console.log("Begin Contact with", otherCollider.node.name);
//     // Lấy điểm va chạm
//     const worldManifold = contact.getWorldManifold();
//     const points = worldManifold.points;

//     if (points.length > 0) {
//       const collisionPoint = new Vec3(points[0].x, points[0].y, 0);
//       console.log("Collision Point:", collisionPoint);

//       // Lấy vector pháp tuyến
//       const normal = worldManifold.normal;
//       const normalVec = new Vec2(normal.x, normal.y);
//       console.log("Collision Normal:", normalVec);

//       // Tính toán vector phản lực
//       this.calculateBounce(otherCollider, normalVec);
//     }
//   }

//   calculateBounce(collider: Collider2D, normalVec: Vec2) {
//     const rigidBody = collider.getComponent(RigidBody2D);
//     if (rigidBody) {
//       // Vector vận tốc hiện tại của player
//       const velocity = new Vec2(
//         rigidBody.linearVelocity.x,
//         rigidBody.linearVelocity.y
//       );
//       console.log("Current Velocity:", velocity);

//       // Tính toán vector phản lực bằng cách phản chiếu vận tốc qua vector pháp tuyến

//       const bounceVelocity = reflect(velocity, normalVec);
//       console.log("Bounce Velocity:", bounceVelocity);

//       let player: CharacterMovement = collider.getComponent(CharacterMovement);

//       // Đặt lại vận tốc của player
//       rigidBody.linearVelocity = new Vec2(bounceVelocity.x, bounceVelocity.y);
//     }
//   }

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
