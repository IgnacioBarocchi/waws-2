import { NodeTypes } from "reactflow";
import ConstructionNode from "./ConstructionNode";
import UnitNode from "./UnitNode";
import { useObjectManager } from "../../containers/ObjectManagerContext";
import Animal from "../../entities/unit/Animal";

const NodeComponents = {
  // * Constructions
  PlantFactory: (props: NodeTypes) => {
    return <ConstructionNode nodeData={props} />;
  },
  AnimalFactory: (props: NodeTypes) => {
    return <ConstructionNode nodeData={props} />;
  },
  // * Units
  Animal: (props: NodeTypes) => {
    const objectManager = useObjectManager();
    const instance = objectManager.getObjectById(
      String(props.id),
      "animals"
    ) as Animal | undefined;

    const publicInstanceData = {
      turnAngle: instance?.motorSystem?.accessTurnAngle,
    };

    return (
      // @ts-ignore
      <UnitNode publicInstanceData={publicInstanceData} nodeData={props} />
    );
  },
  Corpse: (props: NodeTypes) => {
    const objectManager = useObjectManager();
    const instance = objectManager.getObjectById(String(props.id), "corpses");
    const publicInstanceData = {};
    return (
      // @ts-ignore
      <UnitNode publicInstanceData={publicInstanceData} nodeData={props} />
    );
  },
  Dung: (props: NodeTypes) => {
    const objectManager = useObjectManager();
    const instance = objectManager.getObjectById(String(props.id), "dungs");
    const publicInstanceData = {};
    return (
      // @ts-ignore
      <UnitNode publicInstanceData={publicInstanceData} nodeData={props} />
    );
  },
  Egg: (props: NodeTypes) => {
    const objectManager = useObjectManager();
    const instance = objectManager.getObjectById(String(props.id), "eggs");
    const publicInstanceData = {};
    return (
      // @ts-ignore
      <UnitNode publicInstanceData={publicInstanceData} nodeData={props} />
    );
  },
  Microbe: (props: NodeTypes) => {
    const objectManager = useObjectManager();
    const instance = objectManager.getObjectById(String(props.id), "microbes");
    const publicInstanceData = {};
    return (
      // @ts-ignore
      <UnitNode publicInstanceData={publicInstanceData} nodeData={props} />
    );
  },
  Plant: (props: NodeTypes) => {
    const objectManager = useObjectManager();
    const instance = objectManager.getObjectById(String(props.id), "plants");
    const publicInstanceData = {};
    return (
      // @ts-ignore
      <UnitNode publicInstanceData={publicInstanceData} nodeData={props} />
    );
  },
  Rock: (props: NodeTypes) => {
    const objectManager = useObjectManager();
    const instance = objectManager.getObjectById(String(props.id), "rocks");
    const publicInstanceData = {};
    return (
      // @ts-ignore
      <UnitNode publicInstanceData={publicInstanceData} nodeData={props} />
    );
  },

  // todo: Remove casting
} as unknown as NodeTypes;

export default NodeComponents;
