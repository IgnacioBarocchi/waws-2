import Microbe from "../../entities/unit/Microbe";

export default class BinaryFissionReproductiveStrategy {
  static reproduce(microbe: Microbe) {
    microbe.objectManager.createMicrobe(microbe);
  }
}
