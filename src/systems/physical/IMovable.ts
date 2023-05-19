import Animal from "../../entities/unit/Animal";

export interface IMovable {
  follow(animal: Animal, deltaTime: number): void;
  scapeFrom(animal: Animal, deltaTime: number): void;
  avoid(animal: Animal, deltaTime: number): void;
  chase(animal: Animal, deltaTime: number): void;
  roam(deltaTime: number): void;
}
