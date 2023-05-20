import AnimalGroup from "../compositions/AnimalGroup";
import PlantFactory from "../entities/construction/PlantFactory";
import Animal from "../entities/unit/Animal";
import Plant from "../entities/unit/Plant";
import Rock from "../entities/unit/Rock";
import GeneratorService from "../services/GeneratorService";
import ObjectManager from "../services/ObjectManager";
import {
  getRandomRecordTypesArray,
  getUnitIntances,
} from "../util/GameTriggerUtil";
import Trigger from "./Trigger";
const generator = GeneratorService.getInstance([]);

export default class GameTrigger extends Trigger {
  public objectManager: ObjectManager;
  constructor(objectManager: ObjectManager) {
    super();
    this.objectManager = objectManager;
  }

  public trigger(event: string) {
    if (event === "start game") {
      if (this.objectManager.gameIsCreated) {
        this.addError("Game is already created");
      }

      // const localStorageServiceData =
      //   LocalStorageService.getInstance().getData();
      // const { animals, plants, rocks, recordFilter } =
      //   this.objectManager.settings;

      if (this.objectManager.context === "PROD") {
        this.initializeUnitsForProductionContext();
      }

      if (this.objectManager.context === "DEV") {
        this.initializeUnitsForDevelopmentContext();
        this.objectManager.gameIsCreated = true;
      }

      if (this.objectManager.context === "TEST") {
      }

      if (!this.objectManager.gameIsCreated) {
        this.addError(
          `Did not create the game, hence the context is ${this.objectManager.context}`
        );
      }
      return;
    }
  }

  private initializeUnitsForProductionContext() {
    /*const vertebratesRecordTypes = getRandomRecordTypesArray(
      animals.numberOf.vertebrates,
      localStorageServiceData.sentient.animals,
      recordFilter
    );
    const invertebratesRecordTypes = getRandomRecordTypesArray(
      animals.numberOf.vertebrates,
      localStorageServiceData.sentient.animals,
      recordFilter
    );*/

    const vertebratesRecordTypes = ["lion", "tiger", "dog"];
    const invertebratesRecordTypes = ["tik", "fly", "slug"];
    const plantsRecordTypes = ["oak", "plead", "bush"];

    this.objectManager.animals = [
      ...(getUnitIntances(
        vertebratesRecordTypes,
        "Animal",
        this.objectManager
      ) as Animal[]),
      ...(getUnitIntances(
        invertebratesRecordTypes,
        "Animal",
        this.objectManager
      ) as Animal[]),
    ];

    this.objectManager.plants = [
      ...(getUnitIntances(
        plantsRecordTypes,
        "Plant",
        this.objectManager
      ) as Animal[]),
    ];

    this.objectManager.rocks = [];

    this.objectManager.gameIsCreated = true;
    return;
  }

  private initializeUnitsForDevelopmentContext() {
    // this.objectManager.constructions = [
    //   new PlantFactory(
    //     `PlantFactory-${generator.generateRandomID()}`,
    //     { x: 0, y: 0 },
    //     this.objectManager
    //   ),
    // ];
    // this.objectManager.createPlant(
    //   `Oak-${generator.generateRandomID()}`,
    //   "oak",
    //   { x: 0, y: 50 }
    // );
    const leader = this.objectManager.createAnimal("the-leader", "lion", {
      x: 50,
      y: 50,
    });
    leader.age = 500;
    leader.reproductiveSystem.sex = "m";

    for (let i = 0; i < 18; i++) {
      this.objectManager.createAnimal(null, "lion", { x: i, y: i + 10 });
    }

    const animalGroup = new AnimalGroup(
      null,
      this.objectManager.animals,
      "society",
      null,
      "lion"
    );
    animalGroup.tick(0.1);
    this.objectManager?.compositions?.animalGroups?.push(animalGroup);
  }
}

/*DEV
 this.objectManager.animals = [
      new Animal(
        String(Math.floor(Math.random() * 1000)),
        // @ts-ignore
        "wolf",
        {
          x: 200,
          y: 200,
        },

        this
      ),
      new Animal(
        String(Math.floor(Math.random() * 1001)),
        // @ts-ignore
        "wolf",
        {
          x: 200,
          y: 200,
        },
        this
      ),
    ];

    this.objectManager.gameIsCreated = true;
    return;
*/
/* Reduntant
  if (
    !this.objectManager.context &&
    ["PROD", "DEV", "TEST"].includes(this.objectManager.context)
  ) {
    this.addError(
      `"${this.objectManager.context}" is not a valid game context`
    );
  }
*/
