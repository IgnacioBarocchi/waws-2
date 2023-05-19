import { XYPosition } from "reactflow";
import { IMovable } from "./IMovable";
import { MAX_DISTANCE } from "../../constants/config/game";
import Run from "../../strategies/movement/Run";
import Trot from "../../strategies/movement/Trot";
import Walk from "../../strategies/movement/Walk";
import Animal from "../../entities/unit/Animal";

enum MoveStyle {
  ZigZag = "zig-zag",
  Straight = "straight",
  Circular = "circular",
  Curve = "curve",
  Random = "random",
}

enum MoveActon {
  Roaming = "roaming",
  Following = "following",
  Scaping = "scaping",
  Avoiding = "avoiding",
  Chasing = "chasing",
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
export default class AnimalMotorSystem implements IMovable {
  private animal: Animal;
  private currentMoveStrategy: Walk | Run | Trot;
  // Timer to track elapsed time for current strategy
  private moveStrategyTimer: number = 0;
  // Duration for each move strategy in seconds
  private moveStrategyDuration: number = 5;
  private walkStrategy: Walk;
  private trotStrategy: Trot;
  private runStrategy: Run;
  public speed: number;
  public direction: number;
  public currentMoveStyle: MoveStyle;
  public currentAction: MoveActon;
  private turnAngle: number;
  constructor(animal: Animal, speed: number) {
    this.animal = animal;
    this.speed = speed;
    this.direction = Math.random() * Math.PI * 2;
    this.walkStrategy = new Walk(animal);
    this.trotStrategy = new Trot(animal);
    this.runStrategy = new Run(animal);
    this.currentMoveStyle = MoveStyle.Straight;
    this.currentAction = MoveActon.Roaming;
    this.currentMoveStrategy = this.walkStrategy;
    this.turnAngle = 0;
  }

  /**
  Move the animal in a roaming behavior.
  @param {number} deltaTime - The time elapsed since the last update.
  */
  roam(deltaTime: number) {
    this.currentMoveStrategy = this.walkStrategy;
    this.currentMoveStyle = MoveStyle.Random;
    this.move(deltaTime);
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
      return ((Math.random() - 0.5) * Math.PI) / 2;
    }

    if (this.currentMoveStyle === MoveStyle.Random) {
      // completely random turn angle for random pattern
      return Math.random() * 2 * Math.PI;
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
    this.moveStrategyTimer += deltaTime;

    // // Check if the current strategy duration has elapsed
    // if (this.moveStrategyTimer >= this.moveStrategyDuration) {
    //   // Switch to a new random move strategy
    //   this.currentMoveStrategy = this.getMoveStrategy();

    //   // Reset the timer for the new strategy
    //   this.moveStrategyTimer = 0;
    // }

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

  public get accessTurnAngle(): number {
    return 5;
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
//   Math.floor(Math.random() * 3)
// ] as MoveStrategiesType;
