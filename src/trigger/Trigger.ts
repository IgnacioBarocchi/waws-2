export default abstract class Trigger {
  abstract trigger(event: string): void;
  public addError(errorMessage: string): void {
    if (errorMessage) throw new Error(errorMessage);
  }
}
