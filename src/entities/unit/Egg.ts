import Unit from "./@Unit";
import { XYPosition } from "reactflow";
import { IDecomposable } from "../../interfaces/IDecomposable";
import { ISpecies } from "../../interfaces/ISpecies";
import { IMicrobeEmitter } from "../../interfaces/IMicrobeEmitter";
import ObjectManager from "../../services/ObjectManager";
import GeneratorService from "../../services/GeneratorService";
const generator = GeneratorService.getInstance([]);

export default class Egg
  extends Unit
  implements IDecomposable, IMicrobeEmitter, ISpecies
{
  public objectManager: ObjectManager;
  public species: string;
  private timer: number;
  private static readonly DECOMPOSITION_TIME: number = 0.5; // Decomposition time (5 ticks)
  private static readonly ECLOSION_CHANCE: number = 0.9; // Eclosion chance
  private static readonly ECLOSION_TIME: number = 10; // Decomposition time
  private shouldBorn: boolean;

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
    this.type = "Egg";
    this.data.label = "🥚";
    this.species = species;
    this.timer = 0;
    this.shouldBorn = Math.random() <= Egg.ECLOSION_CHANCE;
  }

  tick(deltaTime: number): void {
    if (this.active) {
      this.timer += deltaTime;

      if (this.shouldBorn && this.timer >= Egg.ECLOSION_TIME) {
        this.born();
      }

      if (!this.shouldBorn && this.timer >= Egg.DECOMPOSITION_TIME) {
        this.decompose();
      }
    }
  }

  born() {
    const newBorn = this.objectManager.createAnimal(
      null,
      this.species,
      this.position
    );

    // todo: set age to 1.
    // newBorn.age = 1;
    this.objectManager.deleteInstance(this);
  }

  decompose(): void {
    this.objectManager.deleteInstance(this);
    this.emitMicrobes();
  }

  emitMicrobes(): void {
    const numberOfMicrobes = 1; // Change the number of emitted microbes if desired
    const positions = this.getPositionOfRadialSpread(numberOfMicrobes);

    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      const microbe = this.objectManager.createMicrobe(this);
      microbe.position = position;
    }
  }

  private getPositionOfRadialSpread(numberOfMicrobes: number): XYPosition[] {
    const angleIncrement = (2 * Math.PI) / numberOfMicrobes;
    const coordinates: XYPosition[] = [];

    for (let i = 0; i < numberOfMicrobes; i++) {
      const angle = i * angleIncrement;
      const dynamicPosition = {
        x: this.position.x + 100 * Math.cos(angle),
        y: this.position.y + 100 * Math.sin(angle),
      };

      coordinates.push(dynamicPosition);
    }

    return coordinates;
  }
}
