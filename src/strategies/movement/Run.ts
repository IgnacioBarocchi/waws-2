import { XYPosition } from "reactflow";
import Animal from "../../entities/unit/Animal";
import { IMovementStrategy } from "./IMovementStrategy";

export default class Run implements IMovementStrategy {
  public animal: Animal;
  public displacementMultiplier: number;
  public energyCostPerTick: number;
  constructor(animal: Animal) {
    this.animal = animal;
    this.displacementMultiplier = 3;
    this.energyCostPerTick = 3;
  }

  goTo(position: XYPosition, deltaTime: number) {
    this.animal.position = position;
    this.animal.motorSystem.currentStamina =
      this.animal.motorSystem.currentStamina - this.energyCostPerTick;
  }
}
