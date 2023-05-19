import { NodeTypes } from "reactflow";
import ConstructionNode from "./ConstructionNode";
import UnitNode from "./UnitNode";

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
    return <UnitNode nodeData={props} />;
  },
  Corpse: (props: NodeTypes) => {
    return <UnitNode nodeData={props} />;
  },
  Dung: (props: NodeTypes) => {
    return <UnitNode nodeData={props} />;
  },
  Egg: (props: NodeTypes) => {
    return <UnitNode nodeData={props} />;
  },
  Microbe: (props: NodeTypes) => {
    return <UnitNode nodeData={props} />;
  },
  Plant: (props: NodeTypes) => {
    return <UnitNode nodeData={props} />;
  },
  Rock: (props: NodeTypes) => {
    return <UnitNode nodeData={props} />;
  },

  // todo: Remove casting
} as unknown as NodeTypes;

export default NodeComponents;
