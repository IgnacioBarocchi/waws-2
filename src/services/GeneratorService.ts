import seedrandom from "seedrandom";

export default class GeneratorService {
  private static instance: GeneratorService;
  private existingIDs: string[];

  constructor(existingIDs: string[]) {
    this.existingIDs = existingIDs;
  }

  public generateRandomID(): string {
    let newID = "";
    let exists = true;

    while (exists) {
      newID = this.generateRandomString(18, "alphanumeric");
      exists = this.checkIfIDExists(newID);
    }

    this.existingIDs.push(newID);
    return newID;
  }

  public generateRandomNumber(seed: string): number {
    const rng = seedrandom(seed, { entropy: true });
    return rng();
  }

  public padNumberWithZeros(number: number, length: number): string {
    return number.toFixed(length).padStart(length, "0");
  }

  private generateRandomString(
    length: number,
    set: "alphanumeric" | "DNA"
  ): string {
    const characters =
      set === "alphanumeric"
        ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
        : "TGA";

    let result = "";

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return result;
  }

  public generateRandomDNASequence(): string {
    return this.generateRandomString(18, "DNA");
  }

  public getChildDNASequence(partner1DNA: string, partner2DNA: string): string {
    const midpoint = Math.floor(partner1DNA.length / 2);
    const firstHalf =
      Math.random() < 0.5
        ? partner1DNA.substring(0, midpoint)
        : partner2DNA.substring(0, midpoint);
    const secondHalf =
      Math.random() < 0.5
        ? partner1DNA.substring(midpoint)
        : partner2DNA.substring(midpoint);
    const childSequence = firstHalf + secondHalf;

    const randomLetter = ["T", "G", "A"][Math.floor(Math.random() * 3)];
    const modifiedChildSequence =
      randomLetter +
      childSequence.substring(1, childSequence.length - 1) +
      randomLetter;

    return modifiedChildSequence;
  }

  private checkIfIDExists(id: string): boolean {
    return this.existingIDs.includes(id);
  }

  public static getInstance(existingIDs: string[]): GeneratorService {
    if (!GeneratorService.instance) {
      GeneratorService.instance = new GeneratorService(existingIDs);
    }
    return GeneratorService.instance;
  }
}
