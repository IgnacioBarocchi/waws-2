import AnimalRecordType from "../../data/interface/AnimalRecordType";
import Animal from "../../entities/unit/Animal";

export default class AnimalSocialSystem {
  obedience: number;
  dependent: boolean;
  spatialArragementStrategy: string;
  socialHierarchyType: string;
  constructor(systemData: AnimalRecordType["systems"]["decision"]["social"]) {
    const {
      obedience,
      dependent,
      spatialArragementStrategy,
      socialHierarchyType,
    } = systemData;
    this.obedience = obedience;
    this.dependent = dependent;
    this.spatialArragementStrategy = spatialArragementStrategy;
    this.socialHierarchyType = socialHierarchyType;
  }

  sendGroupRequest(animal: Animal) {}

  handleGroupRequest(request: any) {
    //   group.addMemeber()
  }
}
