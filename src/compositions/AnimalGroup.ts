import { XYPosition } from "reactflow";
import Animal from "../entities/unit/Animal";
import GeneratorService from "../services/GeneratorService";
import FollowLeaderLinearStrategy from "../strategies/group/FollowLeaderLinearStrategy";
import Plant from "../entities/unit/Plant";
import FollowLeaderRingStrategy from "../strategies/group/FollowLeaderRingStrategy";
import FollowLeaderTreeStrategy from "../strategies/group/FollowLeaderTreeStrategy";
import { SocialHierarchyType } from "../data/interface/AnimalRecordType";
const generator = GeneratorService.getInstance([]);

type CommunityType = "family" | "society";

// enum Arragement {
//   FollowLeaderLinear = "linear",
//   FollowLeaderTree =    "tree",
//   ProtectLeader = "    circular",
// }

export interface Observer {
  updateOrder(order: Order): void;
  updateOrderFor(member: Animal, order: Order): void;
}

export interface Order {
  type: "move" | "attack";
  payload: XYPosition | Animal | Plant;
}

class AnimalGroup implements Observer {
  public id: string;
  private animals: Animal[];

  private communityType: CommunityType;
  private subGroup: AnimalGroup | null;
  private species: string;

  private socialHierarchyType: SocialHierarchyType;
  private leader: Animal;
  private previousLeader: Animal | null;

  private sortedMembersBysocialHierarchy: Animal[];

  // private arragement: Arragement;
  private currentStrategy:
    | FollowLeaderLinearStrategy
    | FollowLeaderTreeStrategy
    | FollowLeaderRingStrategy;

  public followLeaderLinearStrategy: FollowLeaderLinearStrategy;
  public followLeaderTreeStrategy: FollowLeaderTreeStrategy;
  public followLeaderRingStrategy: FollowLeaderRingStrategy;

  constructor(
    id: string | null,
    animals: Animal[],
    communityType: CommunityType,
    subGroup: AnimalGroup | null,
    species: string
  ) {
    if (!id) id = `${species}-group-${generator.generateRandomID()}`;
    this.id = id;
    this.animals = animals;
    this.leader = animals[0];
    this.previousLeader = null;
    this.communityType = communityType;
    this.subGroup = subGroup;
    this.species = species;

    this.socialHierarchyType = "patriarchy";
    this.sortedMembersBysocialHierarchy = [];
    this.updateSocialHierarchy();
    // this.arragement = Arragement.FollowLeaderLinear;
    this.followLeaderLinearStrategy = new FollowLeaderLinearStrategy(this);
    this.followLeaderTreeStrategy = new FollowLeaderTreeStrategy(
      this,
      100,
      100
    );
    this.followLeaderRingStrategy = new FollowLeaderRingStrategy(this, 250);
    this.currentStrategy = this.followLeaderLinearStrategy;

    if (species === "wolf") {
      this.currentStrategy = this.followLeaderTreeStrategy;
    }
    if (species === "bee") {
      this.currentStrategy = this.followLeaderRingStrategy;
    }
  }

  updateOrderFor(member: Animal, order: Order): void {}

  tick(deltaTime: number) {
    this.updateSocialHierarchy();
    const positionsByMemebers: [Animal, XYPosition][] =
      this.currentStrategy.getPositionsForMembers();

    positionsByMemebers.forEach(([member, position]) => {
      member.perceptionSystem.receiveOrder({ type: "move", payload: position });
    });
  }

  // affects leader and arragement
  private updateSocialHierarchy(): void {
    switch (this.socialHierarchyType) {
      case "dominance":
        this.sortedMembersBysocialHierarchy = this.animals
          .slice()
          .sort((a, b) => b.damage - a.damage);
        break;
      case "patriarchy":
      case "matriarchy":
        this.sortedMembersBysocialHierarchy = this.getOrderedBySexAndAge();
        break;
      default:
        this.sortedMembersBysocialHierarchy = this.animals.slice();
        break;
    }

    if (
      !this.previousLeader ||
      this.leader.id !== this.sortedMembersBysocialHierarchy[0].id
    ) {
      this.leader = this.sortedMembersBysocialHierarchy[0];
      this.leader = this.sortedMembersBysocialHierarchy[0];
      if (!this.previousLeader) this.previousLeader = this.leader;
      this.sortedMembersBysocialHierarchy.slice(1).forEach((member) => {
        member.perceptionSystem.setGroupLeader = this.leader;
        member.perceptionSystem.registerObserver(this);
      });
    }
  }

  private getOrderedBySexAndAge(): Animal[] {
    const males: Animal[] = [];
    const females: Animal[] = [];
    const others: Animal[] = [];

    for (const animal of this.animals) {
      if (animal.reproductiveSystem.sex === "m") {
        males.push(animal);
      } else if (animal.reproductiveSystem.sex === "f") {
        females.push(animal);
      } else {
        others.push(animal);
      }
    }

    const orderedSocialHierarchy: Animal[] = [];

    if (this.socialHierarchyType === "patriarchy") {
      orderedSocialHierarchy.push(...males.sort((a, b) => b.age - a.age));
      orderedSocialHierarchy.push(...females.sort((a, b) => b.age - a.age));
    } else if (this.socialHierarchyType === "matriarchy") {
      orderedSocialHierarchy.push(...females.sort((a, b) => b.age - a.age));
      orderedSocialHierarchy.push(...males.sort((a, b) => b.age - a.age));
    }

    orderedSocialHierarchy.push(...others);

    return orderedSocialHierarchy;
  }

  // updatePosition(deltaTime: number): void {
  //   this.currentStrategy.updatePosition(deltaTime);
  // }

  addMember(animal: Animal): void {
    this.animals.push(animal);
    this.updateSocialHierarchy();
    animal.perceptionSystem.registerObserver(this);
  }

  removeMember(animal: Animal): void {
    const index = this.animals.indexOf(animal);
    if (index !== -1) {
      this.animals.splice(index, 1);
      this.updateSocialHierarchy();
      animal.perceptionSystem.removeObserver(this);
    }
  }
  public get accessSocialHierarchyType(): SocialHierarchyType {
    return this.socialHierarchyType;
  }

  public get accessSortedMembers(): Animal[] {
    return this.sortedMembersBysocialHierarchy;
  }

  public get accessLeader(): Animal {
    return this.leader;
  }

  updateOrder(order: Order): void {
    // Notify other group members about the order from the leader
    this.animals.forEach((member) => {
      if (member !== this.leader) {
        member.perceptionSystem.receiveOrder(order);
      }
    });
  }
}

export default AnimalGroup;
// private getNextUnitInSocialHierarchy(currentUnit: Animal) {
//   const currentIndex =
//     this.sortedMembersBysocialHierarchy.indexOf(currentUnit);
//   if (
//     currentIndex === -1 ||
//     currentIndex === this.sortedMembersBysocialHierarchy.length - 1
//   ) {
//     return null;
//   }
//   return this.sortedMembersBysocialHierarchy[currentIndex + 1];
// }
// const localStorageService = LocalStorageService.getInstance();
// this.socialHierarchy =
//   localStorageService.getData()?.sentient.animals[
//     this.species
//     ].socialHierarchyType;
// for (const animal of this.sortedMembersBysocialHierarchy) {
//     if (animal instanceof Animal) {
//       const targetUnit = this.getNextUnitInSocialHierarchy(animal);
//       if (targetUnit) animal.motorSystem.follow(targetUnit, 0.1);
//     }
//   }
