import AnimalMonitor from "../AnimalMonitor";

export interface IObserver {
  attach(o: AnimalMonitor): void;
  detach(o: AnimalMonitor): void;
  notify(): void;
}
