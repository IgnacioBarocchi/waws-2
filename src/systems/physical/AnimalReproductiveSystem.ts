import AnimalRecordType from "../../data/interface/AnimalRecordType";
import Animal from "../../entities/unit/Animal";
import GeneratorService from "../../services/GeneratorService";
const generator = GeneratorService.getInstance([]);

export default class AnimalReproductiveSystem {
  public sex: "f" | "m";
  constructor(
    animal: Animal,
    systemData: AnimalRecordType["systems"]["reproduction"]
  ) {
    const sexer = animal.DNASequence;
    this.sex = ["f", "m"][
      Math.floor(generator.generateRandomNumber(sexer) * 2)
    ] as "f" | "m";
  }
}
// import Animal from '../../../Animal';

// class AnimalReproductiveSystem {
//   private animal: Animal;
//   private partnerDNA: string = '';
//   private pregnant: boolean = false;
//   private pregnacyTime: number;
//   private gestationTime: number = 0;
//   private eggFertilization: boolean = false;
//   private childrenDNA: string[] = [];

//   constructor(animal: Animal) {
//     this.animal = animal;
//     this.pregnacyTime = this.calculatePregnancyTime();
//   }

//   private calculatePregnancyTime(): number {
//     const lifespan = this.animal.lifespan;
//     const sizeValue = this.animal.size.value;
//     const reproductiveStrategy = this.animal.reproductiveStrategy;
//     const bodyStructure = this.animal.bodyStructure;

//     // Calculate pregnancy time based on animal attributes
//     const time =
//       Math.floor(lifespan / 10) +
//       Math.floor(sizeValue / 10) +
//       (reproductiveStrategy === 'K-selected' ? 2 : 0) +
//       (bodyStructure === 'vertebrate' ? 1 : 0);

//     return time;
//   }

//   public fertilize(femalePartner: Animal) {
//     if (femalePartner.reproductiveSystem.pregnant) return;
//     if (femalePartner.sex !== 'f' && femalePartner.bodyStructure === 'vertebrate')
//       throw new Error('The sex must be female and the body structure must be vertebrate');
//     femalePartner.reproductiveSystem.partnerDNA = this.animal.DNASequence;
//   }

//   public receiveSperm(malePartner: Animal) {
//     if (this.pregnant) return;
//     if (malePartner.sex !== 'm' && malePartner.bodyStructure === 'vertebrate')
//       throw new Error('The sex must be male and the body structure must be vertebrate');
//     this.partnerDNA = malePartner.DNASequence;

//     const offspringCount = this.determineOffspringCount(malePartner.reproductiveStrategy);

//     for (let i = 0; i < offspringCount; i++) {
//       const childDNA = this.generateChildDNA();
//       this.childrenDNA.push(childDNA);
//     }

//     this.pregnant = true;
//     // Todo: this
//     this.gestateOffspring(5);
//   }

//   public giveBirth() {
//     this.childrenDNA.map((childDNA, i) => {
//       const child = this.animal.objectManager.createAnimal(
//         `${Math.floor(Math.random() * 100 + 1) + i}`,
//         this.animal.recordType,
//         this.animal.position
//       );
//       child.DNASequence = childDNA;
//       return child;
//     });

//     this.pregnant = false;
//     this.eggFertilization = false;
//     this.childrenDNA = [];
//   }

//   private generateChildDNA(): string {
//     const midpoint = Math.floor(this.partnerDNA.length / 2);
//     const firstHalf =
//       Math.random() < 0.5
//         ? this.partnerDNA.substring(0, midpoint)
//         : this.animal.DNASequence.substring(0, midpoint);
//     const secondHalf =
//       Math.random() < 0.5
//         ? this.partnerDNA.substring(midpoint)
//         : this.animal.DNASequence.substring(midpoint);
//     const childSequence = firstHalf + secondHalf;

//     const randomLetter = ['T', 'G', 'A'][Math.floor(Math.random() * 3)];
//     const modifiedChildSequence =
//       randomLetter + childSequence.substring(1, childSequence.length - 1) + randomLetter;

//     return modifiedChildSequence;
//   }

//   private determineOffspringCount(strategy: string): number {
//     if (strategy === 'r') {
//       return Math.floor(Math.random() * 10) + 1; // Número aleatorio de crías grande
//     } else if (strategy === 'K') {
//       return Math.floor(Math.random() * 5) + 1; // Número aleatorio de crías pequeño
//     } else {
//       throw new Error("Estrategia reproductiva inválida. Debe ser 'r' o 'K'.");
//     }
//   }

//   public fertilizeEggs() {
//     if (!this.pregnant) {
//       throw new Error('The animal is not pregnant.');
//     }

//     if (!this.eggFertilization) {
//       // Perform egg fertilization process here
//       // This can involve modifying the eggs or performing some genetic combination

//       this.eggFertilization = true;
//     } else {
//       throw new Error('Eggs have already been fertilized.');
//     }
//   }

//   public layEggs() {
//     if (!this.pregnant) {
//       throw new Error('The animal is not pregnant.');
//     }

//     if (!this.eggFertilization) {
//       throw new Error('Eggs have not been fertilized yet.');
//     }

//     // Perform the process of laying eggs here
//     // This can involve creating new instances of Animal for each fertilized egg
//     // and assigning them the corresponding DNA sequences

//     const offspring: Animal[] = this.childrenDNA.map((childDNA, i) => {
//       const child = this.animal.objectManager.createAnimal(
//         `${Math.floor(Math.random() * 100 + 1) + i}`,
//         this.animal.recordType,
//         this.animal.position
//       );
//       child.DNASequence = childDNA;
//       return child;
//     });

//     // Reset the reproductive system after laying eggs
//     this.pregnant = false;
//     this.eggFertilization = false;
//     this.childrenDNA = [];

//     return offspring;
//   }

//   public gestateOffspring(deltaTime: number) {
//     // todo: review this rule
//     if (this.pregnacyTime <= 0) {
//       throw new Error('No offspring to gestate.');
//     }

//     this.gestationTime += deltaTime;

//     if (this.gestationTime >= this.pregnacyTime) {
//       this.giveBirth();
//     }
//   }
// }

// export default AnimalReproductiveSystem;

// /*
// class Animal {
//   private DNASequence: string;

//   constructor(private objectManager: ObjectManager) {
//     this.DNASequence = this.generateRandomDNASequence(18);
//   }

//   private generateRandomDNASequence(length: number): string {
//     const allowedCharacters = ['T', 'G', 'A'];
//     let sequence = '';
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * allowedCharacters.length);
//       sequence += allowedCharacters[randomIndex];
//     }
//     return sequence;
//   }

//   reproduce(partner: Animal): Animal {
//     const parent1Sequence = this.DNASequence;
//     const parent2Sequence = partner.DNASequence;

//     const midpoint = Math.floor(parent1Sequence.length / 2);
//     const firstHalf =
//       Math.random() < 0.5
//         ? parent1Sequence.substring(0, midpoint)
//         : parent2Sequence.substring(0, midpoint);
//     const secondHalf =
//       Math.random() < 0.5
//         ? parent1Sequence.substring(midpoint)
//         : parent2Sequence.substring(midpoint);
//     const childSequence = firstHalf + secondHalf;

//     const randomIndex = Math.floor(Math.random() * childSequence.length);
//     const randomLetter = ['T', 'G', 'A'][Math.floor(Math.random() * 3)];
//     const modifiedChildSequence =
//       randomLetter + childSequence.substring(1, childSequence.length - 1) + randomLetter;

//     const child = new Animal(this.objectManager);
//     child.DNASequence = modifiedChildSequence;
//     return child;
//   }
// }

// // function transformacionNumerica(a: number, b: number): number {
// //     const seleccion = partner.reproductiveStrategy
// //     if (seleccion === "r-selected") {
// //       return partner.size * partner.lifespan * 2; // Devuelve un número grande
// //     } else if (seleccion === "K") {
// //       return Math.floor((partner.size + partner.lifespan) / 2); // Devuelve un número pequeño
// //     } else {
// //       throw new Error("La selección no es válida. Debe ser 'r' o 'K'.");
// //     }
// //   }

// */
