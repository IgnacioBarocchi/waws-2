import { XYPosition } from "reactflow";
import Animal from "../../entities/unit/Animal";
import AnimalMotorSystem from "../physical/AnimalMotorSystem";
import AnimalReproductiveSystem from "../physical/AnimalReproductiveSystem";
import AnimalPerceptionSystem from "./AnimalPerceptionSystem";
import AnimalRecordType from "../../data/interface/AnimalRecordType";

/**

@class AnimalDecisionSystem
@classdesc The AnimalDecisionSystem class is responsible for processing the output of the AnimalPerceptionSystem and making decisions based on the animal's internal state and environmental stimuli. This includes categorizing input data into threats and opportunities, evaluating the animal's current health, stress levels, and other relevant factors, and making decisions that optimize cost-benefit ratios, address urgent needs, and prioritize important actions.
The AnimalDecisionSystem provides animals with the ability to react to their environment in a way that maximizes their chances of survival and success. By leveraging the output of the AnimalPerceptionSystem and utilizing decision-making algorithms, the system can make informed choices that balance short-term needs and long-term goals.
Usage
javascript
Copy code
const perceptionSystem = new AnimalPerceptionSystem();
const decisionSystem = new AnimalDecisionSystem();
const input = getEnvironmentalData(); // Retrieve sensory input data
const perceptionResult = perceptionSystem.classify(input);
const decisionResult = decisionSystem.evaluate(perceptionResult, animalStats);
console.log(decisionResult);
Copy code
Decision Making
The decision-making process of the AnimalDecisionSystem involves evaluating the animal's internal state and environmental stimuli to determine the best course of action. This includes assessing the animal's current health, stress levels, energy reserves, and other relevant factors, as well as analyzing the potential benefits and costs of different actions.
The AnimalDecisionSystem utilizes decision-making algorithms that balance short-term and long-term goals, prioritize urgent needs, and optimize cost-benefit ratios. By considering the animal's current situation and environmental stimuli, the system can make decisions that maximize the animal's chances of survival and success.
Limitations
It's important to note that the AnimalDecisionSystem has certain limitations. The accuracy of the system's decisions depends on factors such as the quality of the sensory input, the complexity of the environment, and the diversity of stimuli encountered. Additionally, individual animals may exhibit variations in their decision-making capabilities and responses.
Future Enhancements
Future versions of the AnimalDecisionSystem aim to incorporate advanced artificial intelligence techniques, enabling even more accurate and nuanced decision making. These enhancements may involve incorporating additional factors into the decision-making process, such as social dynamics and group behavior, to improve the system's understanding of complex environments.
@constructor
Creates an instance of AnimalDecisionSystem.
*/
export default class AnimalDecisionSystem {
  private motorSystem: AnimalMotorSystem;
  private perceptionSystem: AnimalPerceptionSystem;
  private reproductiveSystem: AnimalReproductiveSystem;

  constructor(
    perceptionSystem: AnimalPerceptionSystem,
    motorSystem: AnimalMotorSystem,
    reproductiveSystem: AnimalReproductiveSystem,
    systemData: AnimalRecordType["systems"]["decision"]
  ) {
    this.motorSystem = motorSystem;
    this.perceptionSystem = perceptionSystem;
    this.reproductiveSystem = reproductiveSystem;
  }

  decide(deltaTime: number) {
    if (
      this.perceptionSystem?.getGroupLeader &&
      this.perceptionSystem.getOrderFromLeader
    ) {
      if (this.perceptionSystem.getOrderFromLeader.type === "move") {
        const { payload: position } = this.perceptionSystem.getOrderFromLeader;

        const leaderTurnAngle =
          this.perceptionSystem.getGroupLeader.motorSystem.accessTurnAngle;
        if (leaderTurnAngle) this.motorSystem.setTurnAngle = leaderTurnAngle;

        this.motorSystem.obeyMoveTo(position as XYPosition, deltaTime);
      }
    } else {
      this.motorSystem.roam(deltaTime);
    }
  }
}

/*
  private animal: Animal;
  constructor(animal: Animal) {
    this.animal = animal;
  }

  public handleNegativeInbounds(negativeInbounds: Relationship[]) {
    negativeInbounds.forEach((inbound) => {
      if (inbound.action === "hunt") {
        // implements scape strategy
      }

      if (inbound.action === "attack") {
        // implements counter-attack strategy or scape strategy based on the data received
      }

      if (inbound.action === "parasite") {
        // implements cleaning strategy
      }

      // etc...
    });
  }

  public handlePositiveInbounds(positiveInbounds: Relationship[]) {}

  public handleNeutralInbounds(neutralInbounds: Relationship[]) {}

  public handleNegativeOutbounds(negativeOutbounds: Relationship[]) {}

  public handlePositiveOutbounds(positiveOutbounds: Relationship[]) {}

  public handleNeutralOutbounds(neutralOutbounds: Relationship[]) {}

  public handleSelf(): void {}
  */
