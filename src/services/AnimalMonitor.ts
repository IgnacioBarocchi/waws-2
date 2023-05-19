import { IObserver } from "./interfaces/IObserver";

export default class AnimalMonitor implements IObserver {
  private sufferingSensor: number;

  constructor() {
    this.sufferingSensor = 0;
  }
  update(): void {
    throw new Error("Method not implemented.");
  }

  public get accessAnimalSensor(): number {
    return this.sufferingSensor;
  }

  public set setAnimalSensor(v: number) {
    this.sufferingSensor = v;
  }
}
