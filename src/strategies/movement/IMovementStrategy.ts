import { XYPosition } from "reactflow";
import Animal from "../../entities/unit/Animal";

export interface IMovementStrategy {
  goTo(position: XYPosition, deltaTime: number): void;
  animal: Animal;
  displacementMultiplier: number;
  energyCostPerTick: number;
}
