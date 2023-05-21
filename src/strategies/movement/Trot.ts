import { XYPosition } from "reactflow";
import Animal from "../../entities/unit/Animal";
import { IMovementStrategy } from "./IMovementStrategy";

export default class Trot implements IMovementStrategy {
  public animal: Animal;
  public displacementMultiplier: number;
  energyCostPerTick: number;
  constructor(animal: Animal) {
    this.animal = animal;
    this.displacementMultiplier = 2;
    this.energyCostPerTick = 2;
  }
  goTo(position: XYPosition, deltaTime: number) {
    this.animal.position = position;
    this.animal.motorSystem.currentStamina =
      this.animal.motorSystem.currentStamina - this.energyCostPerTick;
  }
}
