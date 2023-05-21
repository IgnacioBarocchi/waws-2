import AnimalRecordType from "../data/interface/AnimalRecordType";
import GameEngine from "./@GameEngine";

class LocalStorageService {
  private static instance: LocalStorageService;

  private constructor() {}

  public static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }

    return LocalStorageService.instance;
  }

  public getGameEngine(): any | null {
    const item = localStorage.getItem("gameEngine");
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }

  public setGameEngine(gameEngine: GameEngine): any | null {
    localStorage.setItem("data", JSON.stringify(gameEngine));
  }

  public getAnimalRecordTypes(): { [key: string]: AnimalRecordType } | null {
    const item = localStorage.getItem("animal record types");
    if (item) {
      return JSON.parse(item) as { [key: string]: AnimalRecordType };
    }
    return null;
  }

  public setAnimalRecordTypes(animals: {
    [key: string]: AnimalRecordType;
  }): any | null {
    localStorage.setItem("animal record types", JSON.stringify(animals));
  }

  // public setAnimalRecordTypes(animalsJSON: string): any | null {
  //   localStorage.setItem("animal record types", animalsJSON);
  // }

  public getData(): any | null {
    const item = localStorage.getItem("data");
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }

  public setData(data: any): void {
    localStorage.setItem("data", JSON.stringify(data));
  }
}

export default LocalStorageService;
