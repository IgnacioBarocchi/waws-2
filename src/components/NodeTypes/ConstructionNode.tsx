import { Handle, NodeTypes, Position } from "reactflow";
import styled from "styled-components";

// const rotate = keyframes`
//   from {
//     transform: rotate(0deg);
//   }
//   to {
//     transform: rotate(360deg);
//   }
// `;

// const RotatingDiv = styled.div`
//   display: inline-block;
//   animation: ${rotate} 2s linear infinite;
// `;

// const Label = styled.label`
//   position: relative;
//   font-size: 2em;
// `;

// const NodeContainer = styled.div`
//   background: white;
//   height: 40px;
//   width: 40px;
//   justify-content: center;
//   align-items: center;
//   display: flex;
//   border-width: 2px;
//   font-weight: 700;
// `;

function ConstructionNode({ nodeData }: { nodeData: NodeTypes }) {
  return (
    // <NodeContainer>
    <>
      <Handle
        id={String(nodeData.id)}
        type="target"
        // @ts-ignore
        position="top" //{Position.Top}
        style={{
          width: "3px",
          height: "3px",
        }}
      />

      <div>
        {/* @ts-ignore */}
        {nodeData.data.label}
        {/* htmlFor="text" */}
        {/* <RotatingDiv>⚙️</RotatingDiv> */}
        {/* @ts-ignore */}
        {/* {nodeData.data.label} */}
      </div>
    </>
    // </NodeContainer>
  );
}
export default ConstructionNode;

/*
interface INodeData {
  id: string;
  data: {
    label: string;
  };
  type: string;
  xPosition: number;
  yPos: number;
  selected: boolean;
  isConnecteble: boolean;
  sourcePosition: string;
  targetPosition: string;
  dragging: boolean;
  zIndex: number;
}
*/
// import { ComponentType } from "react";
// NodeProps
