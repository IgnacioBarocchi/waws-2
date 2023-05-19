import { XYPosition } from "reactflow";
import Construction from "./@Construction";
import ObjectManager from "../../services/ObjectManager";

export default class PlantFactory extends Construction {
  public objectManager: ObjectManager;
  constructor(id: string, position: XYPosition, objectManager: ObjectManager) {
    super(id, position);
    this.objectManager = objectManager;

    this.objectManager = objectManager;
    this.type = "PlantFactory";
    this.data.label = "🏭";
  }

  public tick(): void {}
}
