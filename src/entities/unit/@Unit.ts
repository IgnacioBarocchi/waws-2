import { XYPosition } from "reactflow";
import Entity from "../engine/Entity";
import ObjectManager from "../../services/ObjectManager";

export default abstract class Unit extends Entity {
  abstract tick(deltaTime: number): void;
  abstract objectManager: ObjectManager;
  constructor(id: string, position: XYPosition) {
    super(id, position);
    this.id = id;
    this.position = position;
  }
}
