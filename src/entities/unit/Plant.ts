import { XYPosition } from "reactflow";
import Unit from "./@Unit";
import { IMortal } from "../../interfaces/IMortal";
import { IReproducible } from "../../interfaces/IReproducible";
import { ISpecies } from "../../interfaces/ISpecies";
import ObjectManager from "../../services/ObjectManager";
import GeneratorService from "../../services/GeneratorService";
const generator = GeneratorService.getInstance([]);

export default class Plant
  extends Unit
  implements IReproducible, IMortal, ISpecies
{
  public objectManager: ObjectManager;
  public species: string;
  constructor(
    id: string | null,
    species: string,
    position: XYPosition,
    objectManager: ObjectManager
  ) {
    if (!id) id = `${species}-${generator.generateRandomID()}`;
    super(id, position);
    this.objectManager = objectManager;

    this.objectManager = objectManager;
    this.id = id;
    this.position = position;
    this.type = "Plant";
    this.data.label = "🌱";
    this.species = species;
  }

  tick(deltaTime: number): void {}
  die(): void {}
  reproduce(): void {}
}
