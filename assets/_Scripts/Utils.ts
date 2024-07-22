import { Vec2, Vec3 } from "cc";

export function vec2MoveTowards(
  current: Vec2,
  target: Vec2,
  maxDelta: number
): Vec2 {
  const toVector = target.subtract(current);
  const distance = toVector.length();
  if (distance <= maxDelta || distance === 0) {
    return target;
  }
  return current.add(toVector.normalize().multiplyScalar(maxDelta));
}

export function numberMoveTowards(
  current: number,
  target: number,
  maxDelta: number
) {
  if (Math.abs(target - current) <= maxDelta) {
    return target;
  }
  return current + Math.sign(target - current) * maxDelta;
}

// Thêm phương pháp reflect vào prototype của Vec3
export function reflect(inVector: Vec2, normal: Vec2) {
  const dotProduct = inVector.dot(normal);
  return inVector.subtract(normal.multiplyScalar(2 * dotProduct));
}
