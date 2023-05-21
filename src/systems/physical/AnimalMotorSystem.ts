import { XYPosition } from "reactflow";
import { IMovable } from "./IMovable";
import { MAX_DISTANCE } from "../../constants/config/game";
import Run from "../../strategies/movement/Run";
import Trot from "../../strategies/movement/Trot";
import Walk from "../../strategies/movement/Walk";
import Animal from "../../entities/unit/Animal";
import { IPhysicalSystem } from "./IPhysicalSystem";
import GeneratorService from "../../services/GeneratorService";
import AnimalRecordType from "../../data/interface/AnimalRecordType";
const generator = GeneratorService.getInstance([]);

enum MoveStyle {
  ZigZag = "zig-zag",
  Straight = "straight",
  Circular = "circular",
  Curve = "curve",
  Random = "random",
}

enum MoveAction {
  Roaming = "roaming",
  Following = "following",
  Scaping = "scaping",
  Avoiding = "avoiding",
  Chasing = "chasing",
  Obeying = "obeying",
}

/**
  @class AnimalMotorSystem
  @implements {IMovable}
  @classdesc The AnimalMotorSystem class represents the motor system of an animal, 
  responsible for executing various movement strategies based on different actions and styles. 
  It implements the IMovable interface and provides methods for different movement behaviors 
  such as roaming, following, escaping, avoiding, and chasing.
  @param {Animal} animal - The animal entity associated with the motor system.
  @param {number} speed - The speed of the animal's movement.
**/
export default class AnimalMotorSystem implements IMovable, IPhysicalSystem {
  private animal: Animal;
  private currentMoveStrategy: Walk | Run | Trot;
  // Timer to track elapsed time for current strategy
  private moveStyleTimer: number = 0;
  // Duration for each move style in seconds
  private moveStyleDuration: number = 5;
  private walkStrategy: Walk;
  private trotStrategy: Trot;
  private runStrategy: Run;
  public speed: number;
  public direction: number;
  public currentMoveStyle: MoveStyle;
  public currentMoveAction: MoveAction;
  private turnAngle: number;
  private animalSpatialMemory: XYPosition[];
  private currentSpatialMemoryIndex: number;
  // * Action controls
  private isSleeping: boolean;
  private sleepingTime: number;
  private isResting: boolean;
  private restingTime: number;
  maxStamina: number;
  currentStamina: number;

  constructor(
    animal: Animal,
    systemData: AnimalRecordType["systems"]["motor"]
  ) {
    this.animal = animal;
    this.speed = systemData.currentSpeed;
    this.maxStamina = systemData.stamina;
    this.currentStamina = systemData.stamina;
    this.direction = this.getSystemEntrophy() * Math.PI * 2;
    this.walkStrategy = new Walk(animal);
    this.trotStrategy = new Trot(animal);
    this.runStrategy = new Run(animal);
    this.currentMoveStyle = MoveStyle.Straight;
    this.currentMoveAction = MoveAction.Roaming;

    this.currentMoveStrategy = this.walkStrategy;
    this.animalSpatialMemory = [this.animal.position];
    this.turnAngle = 0;
    this.currentSpatialMemoryIndex = 0;
    this.isSleeping = false;
    this.sleepingTime = 0;
    this.isResting = false;
    this.restingTime = 0;
  }

  /**
  Move the animal in a roaming behavior.
  @param {number} deltaTime - The time elapsed since the last update.
  */
  roam(deltaTime: number) {
    if (this.moveStyleTimer >= this.moveStyleDuration) {
      this.currentMoveStyle = this.getRandomMoveSyle();
      this.moveStyleDuration = this.getMoveStyleDirection(); //moveStyleDurations[this.currentMoveStyle];
      this.moveStyleTimer = 0;

      // Reset memory when switching to random move style
      if (this.currentMoveStyle === MoveStyle.Random) {
        this.resetSpatialMemory();
      }
    }

    if (this.currentMoveStyle === MoveStyle.Random) {
      const newPosition = this.getNextPosition();
      this.animalSpatialMemory.push(newPosition);
      this.moveFrom(newPosition, deltaTime);
    } else {
      this.move(deltaTime);
    }
    this.currentMoveAction = MoveAction.Roaming;
  }

  /**
  Move the animal in a following behavior.
  @param {Animal} animal - The animal to follow.
  @param {number} deltaTime - The time elapsed since the last update.
  */
  follow(animal: Animal, deltaTime: number) {
    const targetPosition = { x: animal.position.x, y: animal.position.y };
    const dx = targetPosition.x - this.animal.position.x;
    const dy = targetPosition.y - this.animal.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > MAX_DISTANCE / 1.5) {
      this.currentMoveStrategy = this.runStrategy;
      this.currentMoveStyle = MoveStyle.Straight;

      this.moveTo(targetPosition, deltaTime);
    } else {
      this.currentMoveStrategy = this.walkStrategy;
      this.currentMoveStyle = MoveStyle.Circular;
      this.moveTo(targetPosition, deltaTime);
    }
    this.currentMoveAction = MoveAction.Following;
  }

  /**
  Move the animal in an escaping behavior.
  @param {Animal} animal - The animal to escape from.
  @param {number} deltaTime - The time elapsed since the last update.
  */
  scapeFrom(animal: Animal, deltaTime: number) {
    this.currentMoveStrategy = this.runStrategy;
    this.currentMoveStyle = MoveStyle.ZigZag;
    this.moveFrom({ x: animal.position.x, y: animal.position.y }, deltaTime);
    this.currentMoveAction = MoveAction.Scaping;
  }

  /**
  Move the animal in an avoiding behavior.
  @param {Animal} animal - The animal to avoid.
  @param {number} deltaTime - The time elapsed since the last update.
  */
  avoid(animal: Animal, deltaTime: number) {
    this.currentMoveStrategy = this.trotStrategy;
    this.currentMoveStrategy = this.trotStrategy;
    this.moveFrom({ x: animal.position.x, y: animal.position.y }, deltaTime);
    this.currentMoveAction = MoveAction.Avoiding;
  }

  /**
  Move the animal in a chasing behavior.
  @param {Animal} animal - The animal to chase.
  @param {number} deltaTime - The time elapsed since the last update.
  */
  chase(animal: Animal, deltaTime: number) {
    this.currentMoveStrategy = this.runStrategy;
    this.currentMoveStyle = MoveStyle.ZigZag;
    this.moveTo({ x: animal.position.x, y: animal.position.y }, deltaTime);
    this.currentMoveAction = MoveAction.Chasing;
  }

  /**
  Get the turn angle based on the current move style and elapsed time.
  @private
  @param {number} deltaTime - The time elapsed since the last update.
  @returns {number} - The turn angle in radians.
  */
  private computeTurnAngle(deltaTime: number): number {
    if (this.currentMoveStyle === MoveStyle.ZigZag) {
      // constant turn angle for zig-zag pattern
      return Math.PI / 4;
    }

    if (this.currentMoveStyle === MoveStyle.Straight) {
      // no turn for straight pattern

      return 0;
    }

    if (this.currentMoveStyle === MoveStyle.Circular) {
      // gradually increasing turn angle for circular pattern
      return (Math.PI / 2) * deltaTime;
    }

    if (this.currentMoveStyle === MoveStyle.Curve) {
      // random turn angle for curve pattern
      return ((this.getSystemEntrophy() - 0.5) * Math.PI) / 2;
    }

    if (this.currentMoveStyle === MoveStyle.Random) {
      // completely random turn angle for random pattern
      return this.getSystemEntrophy() * 2 * Math.PI;
    }

    return 0; // Valor predeterminado si la estrategia no es reconocida
  }

  /**
  Calculate the new position based on the current direction and speed.
  @private
  @param {number} deltaTime - The time elapsed since the last update.
  @returns {XYPosition} - The new position coordinates.
  */
  private calculateNewPosition(deltaTime: number): XYPosition {
    // calculate the turn angle based on the moving style
    this.turnAngle = this.computeTurnAngle(deltaTime);

    // update the direction by adding the turn angle
    this.direction += this.turnAngle;

    // calculate the new position based on the direction and speed
    const displacement =
      this.speed * deltaTime * this.currentMoveStrategy.displacementMultiplier;

    const newX =
      this.animal.position.x + Math.cos(this.direction) * displacement;
    const newY =
      this.animal.position.y + Math.sin(this.direction) * displacement;

    return { x: newX, y: newY };
  }

  /**
  Move the animal based on the current movement strategy.
  @private
  @param {number} deltaTime - The time elapsed since the last update.
  */
  private move(deltaTime: number): void {
    this.moveStyleTimer += deltaTime;
    this.currentMoveStrategy.goTo(
      this.calculateNewPosition(deltaTime),
      deltaTime
    );
  }

  /**
  Move the animal towards the specified coordinates.
  @private
  @param {XYPosition} coordinates - The target coordinates to move towards.
  @param {number} deltaTime - The time elapsed since the last update.
  */
  private moveTo(coordinates: XYPosition, deltaTime: number) {
    if (!coordinates) {
      return;
    }

    const deltaX = Math.max(Math.min(coordinates.x)) - this.animal.position.x;
    const deltaY = Math.max(Math.min(coordinates.y)) - this.animal.position.y;

    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const normalizedDeltaX = deltaX / distance;
    const normalizedDeltaY = deltaY / distance;
    const displacement = this.speed * deltaTime;

    const newPosition = {
      x: Math.max(
        Math.min(this.animal.position.x + normalizedDeltaX * displacement)
      ),
      y: Math.max(
        Math.min(this.animal.position.y + normalizedDeltaY * displacement)
      ),
    };

    this.currentMoveStrategy.goTo(newPosition, deltaTime);
  }

  /**
  Move the animal away from the specified coordinates.
  @private
  @param {XYPosition} coordinates - The target coordinates to move away from.
  @param {number} deltaTime - The time elapsed since the last update.
  */
  private moveFrom(coordinates: XYPosition, deltaTime: number) {
    if (!coordinates) {
      return;
    }

    const { x, y } = this.calculateNewPosition(deltaTime);
    const deltaX = x - Math.max(Math.min(coordinates.x));
    const deltaY = y - Math.max(Math.min(coordinates.y));

    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    const normalizedDeltaX = deltaX / distance;
    const normalizedDeltaY = deltaY / distance;
    const displacement = this.speed * deltaTime;

    const newPosition = {
      x: Math.max(Math.min(x + normalizedDeltaX * displacement)),
      y: Math.max(Math.min(y + normalizedDeltaY * displacement)),
    };

    this.currentMoveStrategy.goTo(newPosition, deltaTime);
  }

  private getRandomMoveSyle(): MoveStyle {
    const moveStyles: MoveStyle[] = [
      MoveStyle.ZigZag,
      MoveStyle.Straight,
      MoveStyle.Circular,
      MoveStyle.Curve,
      MoveStyle.Random,
    ];

    const filteredMoveStrategies = moveStyles.filter(
      (strategy) => strategy !== this.currentMoveStyle
    );

    const randomIndex = Math.floor(
      this.getSystemEntrophy() * filteredMoveStrategies.length
    );
    return moveStyles[randomIndex];
  }

  private getMoveStyleDirection(): number {
    const durationNoise = this.getSystemEntrophy();

    const moveStyleDurations: { [key in MoveStyle]: number } = {
      [MoveStyle.ZigZag]: 3 + durationNoise,
      [MoveStyle.Straight]: 7 + durationNoise,
      [MoveStyle.Circular]: 4 + durationNoise,
      [MoveStyle.Curve]: 2 + durationNoise,
      [MoveStyle.Random]: 2 + durationNoise,
    };

    return moveStyleDurations[this.currentMoveStyle];
  }

  public getSystemEntrophy(): number {
    const noiseSource = `${this.animal.position}_${this.animal.DNASequence}`;
    return generator.generateRandomNumber(noiseSource);
  }

  /**
   * Add a new position to the memory.
   * @param position The position to add.
   */
  addPosition(position: XYPosition) {
    this.animalSpatialMemory.push(position);

    // If the number of positions exceeds the maximum limit (5), remove the oldest position.
    if (this.animalSpatialMemory.length > 5) {
      this.animalSpatialMemory.shift();
    }
  }

  /**
   * Get the next position from the memory in a cyclic manner.
   * @returns The next position.
   */
  private getNextPosition(): XYPosition {
    if (this.animalSpatialMemory.length === 0) {
      return { x: 0, y: 0 }; // Return a default position if the memory is empty.
    }

    const position = this.animalSpatialMemory[this.currentSpatialMemoryIndex];
    this.currentSpatialMemoryIndex =
      (this.currentSpatialMemoryIndex + 1) % this.animalSpatialMemory.length;
    return position;
  }

  /**
   * Reset the spatial memory by clearing all stored positions and resetting the current index.
   */
  private resetSpatialMemory() {
    this.animalSpatialMemory = [];
    this.currentSpatialMemoryIndex = 0;
  }

  public get accessTurnAngle(): number {
    return this.turnAngle;
  }

  public set setTurnAngle(v: number) {
    this.turnAngle = v;
  }

  public get obeyMoveTo() {
    this.currentMoveAction = MoveAction.Obeying;
    return this.moveTo;
  }
}

// !implement scape while
// const distance = this.animal.perceiveDistance(animal);
// if (distance > MAX_DISTANCE) {
//   this.animal.startResting();
// }
// !implement avoid while
// const distance = this.animal.perceiveDistance(animal);
// if (distance > MAX_DISTANCE) {
//   this.animal.startResting();
// }

// todo: mirar el angulo de giro de otro animal para determinar el propio
// const randomPatter = ["straight", "zig-zag", "curve"][
//   Math.floor(this.getSystemEntrophy() * 3)
// ] as MoveStrategiesType;
// const moveStyleDurations: { [key in MoveStyle]: number } = {
//   [MoveStyle.ZigZag]: 3 + durationNoise,
//   [MoveStyle.Straight]: 5 + durationNoise,
//   [MoveStyle.Circular]: 7 + durationNoise,
//   [MoveStyle.Curve]: 4 + durationNoise,
//   [MoveStyle.Random]: 2 + durationNoise,
// };
