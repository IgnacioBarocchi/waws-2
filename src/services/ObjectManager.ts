import { Node, XYPosition } from "reactflow";
import Bond from "../entities/engine/Bond";
import PlantFactory from "../entities/construction/PlantFactory";
import IDGeneratorService from "./IDGeneratorService";
import Rock from "../entities/unit/Rock";
import Animal from "../entities/unit/Animal";
import Corpse from "../entities/unit/Corpse";
import Dung from "../entities/unit/Dung";
import Egg from "../entities/unit/Egg";
import Microbe from "../entities/unit/Microbe";
import Plant from "../entities/unit/Plant";
const idGenerator = IDGeneratorService.getInstance([]);

export default class ObjectManager {
  public nodes: Node[] = [];
  public bonds: Bond[] = [];
  public gameIsCreated: boolean = false;
  public context: "DEV" | "TEST" | "PROD" = "DEV";
  public settings: any;
  public constructions: PlantFactory[] = [];
  public animals: Animal[] = [];
  public corpses: Corpse[] = [];
  public dungs: Dung[] = [];
  public eggs: Egg[] = [];
  public microbes: Microbe[] = [];
  public plants: Plant[] = [];
  public rocks: Rock[] = [];

  constructor(context: "DEV" | "TEST" | "PROD", settings: any) {
    this.context = context;
    this.gameIsCreated = false;
    this.settings = settings;
  }

  getData(effect: string | undefined): {
    nodes: Node[];
    globalSuffering: number;
  } {
    const globalSuffering = this.animals.reduce(
      (accumulator, animal) =>
        accumulator + animal.perceptionSystem.accessCurrentSuffering,
      0
    );

    // @ts-ignore
    const nodes = [
      ...this.animals,
      ...this.corpses,
      ...this.dungs,
      ...this.eggs,
      ...this.microbes,
      ...this.plants,
      ...this.rocks,
      ...this.constructions,
    ]
      .map((c) => {
        // @ts-ignore
        if (c?.type && c?.active) {
          if (effect === "tick") {
            c.tick(0.1);
          }

          // se setea aca pero el componente memoizado lo remueve.
          /*
          const table = (c.type.toLowerCase() + "s") as
            | "animals"
            | "corpses"
            | "dungs"
            | "eggs"
            | "microbes"
            | "plants"
            | "rocks";

          const instance = this.getObjectById(c.id, table) as Animal;
          if (instance && instance.type === "Animal") {
            console.log(instance.motorSystem.accessTurnAngle);
          }
          const data = { ...c.data, ...instance };
          alert(JSON.stringify(data.id));
          */

          return {
            // @ts-ignore
            id: c.id,
            // @ts-ignore
            type: c.type,
            // @ts-ignore
            data: c.data,
            // @ts-ignore
            position: c.position,
          };
        }
      })
      .filter(Boolean) as Node[];
    return { nodes, globalSuffering };
  }

  getObjectById(
    id: string,
    table:
      | "animals"
      | "corpses"
      | "dungs"
      | "eggs"
      | "microbes"
      | "plants"
      | "rocks"
  ): Animal | Corpse | Dung | Egg | Microbe | Plant | Rock | undefined {
    if (
      [
        "animals",
        "corpses",
        "dungs",
        "eggs",
        "microbes",
        "plants",
        "rocks",
      ].includes(table)
    ) {
      const collection = this[table] as (
        | Animal
        | Corpse
        | Dung
        | Egg
        | Microbe
        | Plant
        | Rock
      )[];

      if (collection) {
        return collection.find((entity) => entity.id === id);
      }

      return undefined;
    }
    return undefined;
  }

  // @ts-ignore
  getEdges(): Edge[] {
    return this.bonds.map((b) => ({
      // @ts-ignore
      id: b.id,
      // @ts-ignore
      label: b.label,
      // @ts-ignore
    })) as Edge[];
  }

  deleteInstance(
    instance: Animal | Corpse | Dung | Egg | Microbe | Plant | Rock | Bond
  ): void {
    // * Deactivate the instance
    instance.active = false;

    // * Remove the instance from the collection
    if (instance.type === "Animal") {
      this.animals = [...this.animals.filter((a) => a.id !== instance.id)];
      return;
    }

    if (instance.type === "Corpse") {
      this.corpses = [...this.corpses.filter((c) => c.id !== instance.id)];
      return;
    }

    if (instance.type === "Dung") {
      this.dungs = [...this.dungs.filter((d) => d.id !== instance.id)];
      return;
    }

    if (instance.type === "Egg") {
      this.eggs = [...this.eggs.filter((e) => e.id !== instance.id)];
      return;
    }

    if (instance.type === "Microbe") {
      this.microbes = [...this.microbes.filter((m) => m.id !== instance.id)];
      return;
    }

    if (instance.type === "Plant") {
      this.plants = [...this.plants.filter((p) => p.id !== instance.id)];
      return;
    }

    if (instance.type === "Rock") {
      this.rocks = [...this.rocks.filter((r) => r.id !== instance.id)];
      return;
    }

    if (instance.type === "Bond") {
      this.bonds = [...this.bonds.filter((r) => r.id !== instance.id)];
      return;
    }
  }

  public createBond(source: string, target: string): Bond {
    const existingBond = this.bonds.find(
      (existing) => existing.source === source && existing.target === target
    );

    if (existingBond) {
      return existingBond;
    }

    const newBond = new Bond(source, target, this);
    this.bonds.push(newBond);
    return newBond;
  }

  public createAnimal(
    id: string | null,
    species: string,
    position: XYPosition
  ): Animal {
    const newAnimal = new Animal(id, species, position, this);
    this.animals.push(newAnimal);
    return newAnimal;
  }

  public createCorpse(animal: Animal): Corpse {
    const newCorpse = new Corpse(
      `Corpse-of-${animal.id}`,
      animal.species,
      animal.position,
      this
    );
    this.corpses.push(newCorpse);
    return newCorpse;
  }

  public createDung(animal: Animal): Dung {
    const newDung = new Dung(
      `Dung-of-${animal.id}-${this.dungs.length}`,
      animal.species,
      animal.position,
      this
    );
    this.dungs.push(newDung);
    return newDung;
  }

  public createEgg(animal: Animal): Egg {
    const newEgg = new Egg(
      `Egg-of-${animal.id}-${this.eggs.length}`,
      animal.species,
      animal.position,
      this
    );
    this.eggs.push(newEgg);
    return newEgg;
  }

  public createMicrobe(emiter: Dung | Egg | Corpse | Microbe): Microbe {
    const newMicrobe = new Microbe(
      `Microbe-of-${emiter}-${this.microbes.length}`,
      emiter.species,
      emiter.position,
      this
    );
    this.microbes.push(newMicrobe);
    return newMicrobe;
  }

  public createPlant(id: string, species: string, position: XYPosition): Plant {
    const newPlant = new Plant(id, species, position, this);
    this.plants.push(newPlant);
    return newPlant;
  }

  public createRock(id: string, position: XYPosition): Rock {
    const newRock = new Rock(id, position, this);
    this.rocks.push(newRock);
    return newRock;
  }

  public createBuilding(buildingType: string, position: XYPosition) {
    if (buildingType === "PlantFactory") {
      const newConstruction = new PlantFactory(
        `${buildingType}-${idGenerator.generateRandomID()}`,
        position,
        this
      );

      // @ts-ignore
      this.constructions.push(newConstruction);
      return newConstruction;
    }
  }
}
