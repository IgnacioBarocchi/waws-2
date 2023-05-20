import { XYPosition } from "reactflow";
import Unit from "./@Unit";
import { IMortal } from "../../interfaces/IMortal";
import { IReproducible } from "../../interfaces/IReproducible";
import { ISpecies } from "../../interfaces/ISpecies";
import ObjectManager from "../../services/ObjectManager";
import GeneratorService from "../../services/GeneratorService";
import BinaryFissionReproductiveStrategy from "../../strategies/reproduction/BinaryFissionReproductiveStrategy";
const generator = GeneratorService.getInstance([]);

export default class Microbe
  extends Unit
  implements IReproducible, IMortal, ISpecies
{
  public objectManager: ObjectManager;
  public species: string;
  public elapsedTime: number;
  private static readonly LIFESPAN: number = 5; // Decomposition time

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
    this.type = "Microbe";
    this.data.label = "🦠";
    this.species = species;
    this.elapsedTime = 0;
  }

  tick(deltaTime: number): void {
    if (this.active) {
      this.elapsedTime += deltaTime;

      if (this.elapsedTime >= Microbe.LIFESPAN) {
        this.die();
      }

      if (Math.random() === 0) {
        this.reproduce();
      }
    }
  }

  die(): void {
    console.info(`${this.id} will die`);
    this.objectManager.deleteInstance(this);
  }

  reproduce(): void {
    BinaryFissionReproductiveStrategy.reproduce(this);
  }
}
