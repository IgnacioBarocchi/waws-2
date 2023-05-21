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
import LocalStorageService from "../../services/LocalStorageService";
import AnimalDigestiveSystem from "../../systems/physical/AnimalDigestiveSystem";
const recordTypes = LocalStorageService.getInstance().getAnimalRecordTypes();
const generator = GeneratorService.getInstance([]);

export default class Animal
  extends Unit
  implements IReproducible, IMortal, ISpecies
{
  species: string;
  DNASequence: string;
  objectManager: ObjectManager;
  perceptionSystem: AnimalPerceptionSystem;
  decisionSystem: AnimalDecisionSystem;
  motorSystem: AnimalMotorSystem;
  reproductiveSystem: AnimalReproductiveSystem;
  digestiveSystem: AnimalDigestiveSystem;
  age: number;
  damage: number;
  size: number;
  maxHealth: number;
  maxSpeed: number;
  lifespan: number;
  bodyStructure: string;

  constructor(
    id: string | null,
    species: string,
    position: XYPosition,
    objectManager: ObjectManager
  ) {
    if (!recordTypes || !recordTypes[species]) {
      throw new Error(`Did not find record type for ${species}`);
    }
    if (!id) id = `${species}-${generator.generateRandomID()}`;
    super(id, position);
    this.id = id;
    this.species = species;
    this.DNASequence = generator.generateRandomDNASequence();

    const RecordType = recordTypes[species];
    // * Dependency injection
    this.objectManager = objectManager;
    // * Internals
    this.motorSystem = new AnimalMotorSystem(this, RecordType.systems.motor);
    this.digestiveSystem = new AnimalDigestiveSystem(this);
    this.reproductiveSystem = new AnimalReproductiveSystem(
      this,
      RecordType.systems.reproduction
    );

    this.perceptionSystem = new AnimalPerceptionSystem(
      RecordType.systems.perception
    );

    this.decisionSystem = new AnimalDecisionSystem(
      this.perceptionSystem,
      this.motorSystem,
      this.reproductiveSystem,
      RecordType.systems.decision
    );
    this.perceptionSystem.setDecisionSystem = this.decisionSystem;

    // * Node
    this.position = position;
    this.type = "Animal";
    this.data.label = RecordType.stats.avatars.low;

    // * Stats
    const {
      stats: { size, maxHealth, maxSpeed, lifespan, bodyStructure },
    } = RecordType;

    this.age = 5;
    this.damage = Math.random() * 5;

    this.size = size;
    this.maxHealth = maxHealth;
    this.maxSpeed = maxSpeed;
    this.lifespan = lifespan;
    this.bodyStructure = bodyStructure;
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
