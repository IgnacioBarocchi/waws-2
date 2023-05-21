import { XYPosition } from "reactflow";
import Animal from "../../entities/unit/Animal";
import { IMovementStrategy } from "./IMovementStrategy";

export default class Walk implements IMovementStrategy {
  public animal: Animal;
  public displacementMultiplier: number;
  public energyCostPerTick: number;
  constructor(animal: Animal) {
    this.animal = animal;
    this.displacementMultiplier = 1;
    this.energyCostPerTick = 1;
  }
  goTo(position: XYPosition, deltaTime: number) {
    this.animal.position = position;
    this.animal.motorSystem.currentStamina =
      this.animal.motorSystem.currentStamina - this.energyCostPerTick;
  }
}
