import { XYPosition } from "reactflow";
import Unit from "./@Unit";
import { IMortal } from "../../interfaces/IMortal";
import { IReproducible } from "../../interfaces/IReproducible";
import ObjectManager from "../../services/ObjectManager";
import GeneratorService from "../../services/GeneratorService";
const generator = GeneratorService.getInstance([]);

export default class Rock extends Unit implements IReproducible, IMortal {
  public objectManager: ObjectManager;
  constructor(
    id: string | null,
    position: XYPosition,
    objectManager: ObjectManager
  ) {
    if (!id) id = `rock-${generator.generateRandomID()}`;
    super(id, position);
    this.objectManager = objectManager;

    this.objectManager = objectManager;
    this.id = id;
    this.position = position;
    this.type = "Rock";
    this.data.label = "🪨";
  }

  tick(deltaTime: number): void {}
  die(): void {}
  reproduce(): void {}
}
