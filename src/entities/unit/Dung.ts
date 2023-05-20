import Unit from "./@Unit";
import { XYPosition } from "reactflow";
import { IDecomposable } from "../../interfaces/IDecomposable";
import { IMicrobeEmitter } from "../../interfaces/IMicrobeEmitter";
import { ISpecies } from "../../interfaces/ISpecies";
import ObjectManager from "../../services/ObjectManager";
import GeneratorService from "../../services/GeneratorService";
const generator = GeneratorService.getInstance([]);

export default class Dung
  extends Unit
  implements IDecomposable, IMicrobeEmitter, ISpecies
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

    this.id = id;
    this.position = position;
    this.type = "Dung";
    this.data.label = "💩";
    this.species = species;
  }

  tick(deltaTime: number): void {}
  decompose(): void {}
  emitMicrobes(): void {}
}
