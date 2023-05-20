import { Observer, Order } from "../../compositions/AnimalGroup";
import Animal from "../../entities/unit/Animal";
import AnimalMotorSystem from "../physical/AnimalMotorSystem";
import AnimalDecisionSystem from "./AnimalDecisionSystem";

/**
  @class AnimalPerceptionSystem
  @classdesc The AnimalPerceptionSystem class acts as an environmental perception module, classifying input and output relationships into threats and opportunities.
  This system provides animals with the ability to analyze their surroundings and identify potential risks and advantageous situations. By processing sensory input data, the AnimalPerceptionSystem employs classification algorithms to differentiate between stimuli that may pose a threat to the animal's well-being and stimuli that represent potential opportunities for survival or benefit.
  @Usage
  javascript
  Copy code
  const perceptionSystem = new AnimalPerceptionSystem();
  const input = getEnvironmentalData(); // Retrieve sensory input data
  const perceptionResult = perceptionSystem.classify(input);
  console.log(perceptionResult);
  Copy code
  @Classification
  The classification process performed by the AnimalPerceptionSystem involves analyzing various sensory inputs, such as visual, auditory, and olfactory cues, to identify and categorize environmental stimuli. These stimuli are then classified into two distinct categories:
  Threats: These are stimuli that present potential harm or danger to the animal. Examples include predators, hazardous terrain, or toxic substances.
  Opportunities: These are stimuli that offer potential benefits or advantageous situations for the animal. Examples include food sources, shelter, or mating prospects.
  The AnimalPerceptionSystem utilizes sophisticated machine learning algorithms to learn and adapt to different environments and species. Through training and experience, the system becomes more accurate in discerning threats and opportunities, enabling animals to make informed decisions and react appropriately to their surroundings.
  @Limitations
  It's important to note that the AnimalPerceptionSystem has certain limitations. The accuracy of the system's classifications depends on factors such as the quality of the sensory input, the complexity of the environment, and the diversity of stimuli encountered. Additionally, individual animals may exhibit variations in their perception capabilities and responses.
  Future Enhancements
  Future versions of the AnimalPerceptionSystem aim to incorporate advanced deep learning techniques, enabling even more accurate and nuanced classifications. These enhancements may involve incorporating additional sensory modalities and considering contextual information to improve the system's understanding of complex environments.
  @constructor
  Creates an instance of AnimalPerceptionSystem.
*/

export default class AnimalPerceptionSystem {
  private currentSuffering;
  private currentHealth;
  private decisionSystem: AnimalDecisionSystem | null;
  private groupLeader: Animal | null;
  private observers: Observer[];
  private orderFromLeader: Order | null;

  // todo: add thresholds and initials
  constructor() {
    // animal: Animal
    // this.animal = animal;
    // this.decisionSystem = this.animal.decisionSystem;
    this.decisionSystem = null;
    this.currentSuffering = 0;
    // todo: !hardcoded
    this.currentHealth = 100;
    this.groupLeader = null;
    this.observers = [];
    this.orderFromLeader = null;
  }

  perceive(deltaTime: number) {
    if (this.decisionSystem) {
      this.decisionSystem.decide(deltaTime);
    }
  }

  registerObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  receiveOrder(order: Order): void {
    this.orderFromLeader = order;
    // Handle the received order from the leader
    // ...
  }

  public get accessCurrentSuffering(): number {
    return this.currentSuffering;
  }

  public set setCurrentSuffering(v: number) {
    this.currentSuffering = v;
  }

  public get accessCurrentHealth(): number {
    return this.currentSuffering;
  }

  public set setCurrentHealth(v: number) {
    this.currentHealth = v;
  }

  public get getGroupLeader(): Animal | null {
    return this.groupLeader;
  }

  public set setGroupLeader(v: Animal) {
    this.groupLeader = v;
  }

  public set setDecisionSystem(v: AnimalDecisionSystem) {
    this.decisionSystem = v;
  }

  public get getOrderFromLeader(): Order | null {
    return this.orderFromLeader;
  }
}

/*
  public persive(): void {
    const {
      negative: negativeInbounds,
      positive: positiveInbounds,
      neutral: neutralInbounds,
    } = this.classifyRelations('inbound');

    const {
      negative: negativeOutbounds,
      positive: positiveOutbounds,
      neutral: neutralOutbounds,
    } = this.classifyRelations('outbound');

    if (negativeInbounds.length > 0) {
      this.animal.decisionSystem.handleNegativeInbounds(negativeInbounds);
      // * Focus on negative relationships and avoid multitasking
      return;
    }

    if (positiveInbounds.length > 0) {
      this.animal.decisionSystem.handlePositiveInbounds(positiveInbounds);
    }

    if (neutralInbounds.length > 0) {
      this.animal.decisionSystem.handleNeutralInbounds(neutralInbounds);
    }

    if (negativeOutbounds.length > 0) {
      this.animal.decisionSystem.handleNegativeOutbounds(negativeOutbounds);
    }

    if (positiveOutbounds.length > 0) {
      this.animal.decisionSystem.handlePositiveOutbounds(positiveOutbounds);
    }

    if (neutralOutbounds.length > 0) {
      this.animal.decisionSystem.handleNeutralOutbounds(neutralOutbounds);
    }

    this.animal.decisionSystem.handleSelf();
  }

  public getFilteredRelations(relationshipType: 'inbound' | 'outbound'): Relationship[] {
    if (relationshipType === 'inbound') {
      return this.animal.relationships.filter(
        // @ts-ignore
        (relationship) => relationship.targetEntity.id === this.animal.id
      );
    }

    if (relationshipType === 'outbound') {
      return this.animal.relationships.filter(
        // @ts-ignore
        (relationship) => relationship.sourceEntity.id === this.animal.id
      );
    }

    return [];
  }

  public classifyRelations(relationshipType: 'inbound' | 'outbound') {
    const inboundRelationships = this.getFilteredRelations(relationshipType);

    const classification: {
      negative: Relationship[];
      positive: Relationship[];
      neutral: Relationship[];
    } = {
      negative: [],
      positive: [],
      neutral: [],
    };

    inboundRelationships.forEach((relationship) => {
      const action = relationship.action as unknown as string;
      if (NEGATIVE_INBOUND_ACTIONS.includes(action)) {
        classification.negative.push(relationship);
      }
      if (POSITIVE_INBOUND_ACTIONS.includes(action)) {
        classification.positive.push(relationship);
      }
      if (NEUTRAL_INBOUND_ACTIONS) {
        classification.neutral.push(relationship);
      }
    });

    return classification;
  }
*/
