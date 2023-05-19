import seedrandom from "seedrandom";

export default class IDGeneratorService {
  private static instance: IDGeneratorService;
  private existingIDs: string[];

  constructor(existingIDs: string[]) {
    this.existingIDs = existingIDs;
  }

  public generateRandomID(): string {
    let newID = "";
    let exists = true;

    while (exists) {
      newID = this.generateRandomString(18);
      exists = this.checkIfIDExists(newID);
    }

    this.existingIDs.push(newID);
    return newID;
  }

  public generateRandomNumber(seed: string): number {
    const rng = seedrandom(seed);
    return rng();
  }

  public padNumberWithZeros(number: number, length: number): string {
    return number.toFixed(length).padStart(length, "0");
  }

  private generateRandomString(length: number): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return result;
  }

  private checkIfIDExists(id: string): boolean {
    return this.existingIDs.includes(id);
  }

  public static getInstance(existingIDs: string[]): IDGeneratorService {
    if (!IDGeneratorService.instance) {
      IDGeneratorService.instance = new IDGeneratorService(existingIDs);
    }
    return IDGeneratorService.instance;
  }
}
