import { XYPosition } from "reactflow";
import Entity from "../engine/Entity";

export default abstract class Construction extends Entity {
  abstract tick(deltaTime: number): void;

  constructor(id: string, position: XYPosition) {
    super(id, position);
    this.id = id;
    this.position = position;
  }
}
