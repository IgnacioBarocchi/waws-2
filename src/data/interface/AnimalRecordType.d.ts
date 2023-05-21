export type SocialHierarchyType = "dominance" | "patriarchy" | "matriarchy";
export type BehaviorType = "aggessive" | "territorial" | "fearful";
export type KRSelectionType = "K" | "r";
export type SpatialArragementStrategyType = "linear" | "tree" | "ring";
export type ReproductiveStrategyType = "sexual" | "asexual";
export type MoodType = "happy" | "stressed" | "hungry";
export type FMSexType = "m" | "f";
export type BodyStructureType = "vertebrate" | "invertebrate";

export default interface AnimalRecordType {
  stats: {
    // * 1 to 10
    size: number;
    // * could depend on size
    maxHealth: number;
    maxSpeed: number;
    lifespan: number;
    age: number;
    bodyStructure: BodyStructureType;
    // * graphics
    avatars: {
      low: string;
      medium: string;
      high: string;
    };
  };
  systems: {
    perception: {
      // * 1 to 300
      interactionRadius: number;
      // * could depend on size
      currentHealth: number;
      currentMood: MoodType;
      diet: {
        picks: string[];
        hunts: string[];
        parasites: string[];
      };
    };
    motor: {
      currentSpeed: number;
      stamina: number;
    };
    reproduction: {
      reproductiveStrategy: ReproductiveStrategyType;
      selection: KRSelectionType;
      sex: FMSexType;
    };
    decision: {
      behavior: BehaviorType;
      social: {
        //* 0 to 1
        obedience: number;
        dependent: boolean;
        spatialArragementStrategy: SpatialArragementStrategyType;
        socialHierarchyType: SocialHierarchyType;
      };
    };
  };
}
