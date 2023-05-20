import Unit from "./@Unit";
import { XYPosition } from "reactflow";
import { IDecomposable } from "../../interfaces/IDecomposable";
import { IMicrobeEmitter } from "../../interfaces/IMicrobeEmitter";
import ObjectManager from "../../services/ObjectManager";
import GeneratorService from "../../services/GeneratorService";
const generator = GeneratorService.getInstance([]);

export default class Corpse
  extends Unit
  implements IDecomposable, IMicrobeEmitter
{
  public objectManager: ObjectManager;
  public species: string;
  private decompositionTimer: number;
  private static readonly DECOMPOSITION_TIME: number = 0.5; // Decomposition time
  private static readonly BASE_MICROBES_AMOUT: number = 5; // Decomposition time

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
    this.type = "Corpse";
    this.data.label = "🍖";
    this.species = species;
    this.decompositionTimer = 0;
  }

  tick(deltaTime: number): void {
    if (this.active) {
      this.decompositionTimer += deltaTime;

      if (Math.random() < 0.5) {
        this.emitMicrobes(Corpse.BASE_MICROBES_AMOUT);
      }

      if (this.decompositionTimer >= Corpse.DECOMPOSITION_TIME) {
        this.decompose();
      }
    }
  }

  decompose(): void {
    this.emitMicrobes(Corpse.BASE_MICROBES_AMOUT * 2);
    console.info(`${this.id} will decompose`);
    this.objectManager.deleteInstance(this);
  }

  emitMicrobes(numberOfMicrobes: number): void {
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
