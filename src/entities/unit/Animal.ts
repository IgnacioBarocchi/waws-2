import Unit from "./@Unit";
import { XYPosition } from "reactflow";
import { IMortal } from "../../interfaces/IMortal";
import { IReproducible } from "../../interfaces/IReproducible";
import { ISpecies } from "../../interfaces/ISpecies";
import ObjectManager from "../../services/ObjectManager";
import IDGeneratorService from "../../services/IDGeneratorService";
import AnimalMotorSystem from "../../systems/physical/AnimalMotorSystem";
import { IObserver } from "../../services/interfaces/IObserver";
import AnimalPerceptionSystem from "../../systems/intangible/AnimalPerseptionSystem";
import AnimalDecisionSystem from "../../systems/intangible/AnimalDecisionSystem";
const idGenerator = IDGeneratorService.getInstance([]);

export default class Animal
  extends Unit
  implements IReproducible, IMortal, ISpecies, IObserver
{
  public objectManager: ObjectManager;
  public species: string;
  public perceptionSystem: AnimalPerceptionSystem;
  public decisionSystem: AnimalDecisionSystem;
  public motorSystem: AnimalMotorSystem;

  constructor(
    id: string | null,
    species: string,
    position: XYPosition,
    objectManager: ObjectManager
  ) {
    if (!id) id = `${species}-${idGenerator.generateRandomID()}`;
    super(id, position);
    // * Dependency injection
    this.objectManager = objectManager;
    // * Internals
    this.motorSystem = new AnimalMotorSystem(this, 5);
    this.decisionSystem = new AnimalDecisionSystem(this);
    this.perceptionSystem = new AnimalPerceptionSystem(this);
    this.id = id;
    this.position = position;
    this.type = "Animal";
    this.data.label = "🦁";
    this.species = species;
  }

  update(): void {
    throw new Error("Method not implemented.");
  }

  tick(deltaTime: number): void {
    if (this.active) {
      this.perceptionSystem.perceive(deltaTime);
    }
  }

  die(): void {
    this.objectManager.createCorpse(this);
    this.objectManager.deleteInstance(this);
  }

  reproduce(): void {}
}
