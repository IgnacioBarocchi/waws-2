import Unit from "./@Unit";
import { XYPosition } from "reactflow";
import { IMortal } from "../../interfaces/IMortal";
import { IReproducible } from "../../interfaces/IReproducible";
import { ISpecies } from "../../interfaces/ISpecies";
import ObjectManager from "../../services/ObjectManager";
import AnimalMotorSystem from "../../systems/physical/AnimalMotorSystem";
import AnimalPerceptionSystem from "../../systems/intangible/AnimalPerceptionSystem";
import AnimalDecisionSystem from "../../systems/intangible/AnimalDecisionSystem";
import GeneratorService from "../../services/GeneratorService";
import AnimalReproductiveSystem from "../../systems/physical/AnimalReproductiveSystem";
import { Observer } from "../../compositions/AnimalGroup";

const generator = GeneratorService.getInstance([]);

export default class Animal
  extends Unit
  implements IReproducible, IMortal, ISpecies
{
  objectManager: ObjectManager;
  species: string;
  perceptionSystem: AnimalPerceptionSystem;
  decisionSystem: AnimalDecisionSystem;
  motorSystem: AnimalMotorSystem;
  DNASequence: string;
  reproductiveSystem: AnimalReproductiveSystem;
  age: number;
  damage: number;
  constructor(
    id: string | null,
    species: string,
    position: XYPosition,
    objectManager: ObjectManager
  ) {
    if (!id) id = `${species}-${generator.generateRandomID()}`;
    super(id, position);
    // * Dependency injection
    this.objectManager = objectManager;
    // * Internals
    this.motorSystem = new AnimalMotorSystem(this, 20);
    this.reproductiveSystem = new AnimalReproductiveSystem(this);
    this.perceptionSystem = new AnimalPerceptionSystem();

    this.decisionSystem = new AnimalDecisionSystem(
      this.perceptionSystem,
      this.motorSystem,
      this.reproductiveSystem
    );

    this.perceptionSystem.setDecisionSystem = this.decisionSystem;

    this.id = id;
    this.position = position;
    this.type = "Animal";
    this.data.label = "🦁";
    this.species = species;
    this.DNASequence = generator.generateRandomDNASequence();
    this.age = 5;
    this.damage = Math.random() * 5;
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
