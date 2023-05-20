import { useEffect } from "react";
import { Handle, NodeTypes, Position } from "reactflow";
import styled from "styled-components";

type unitType =
  | "Animal"
  | "Corpse"
  | "Dung"
  | "Egg"
  | "Microbe"
  | "Plant"
  | "Rock";

const Arrow = styled.div<{ angle: number }>`
  position: absolute;
  top: -10%;
  left: 50%;
  width: 10;
  height: 10;
  margin-left: -3px; /* Ajusta el desplazamiento horizontal de la flecha */
  margin-top: -3px; /* Ajusta el desplazamiento vertical de la flecha */
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid black;
  transform-origin: bottom; /* Define el punto de origen de la rotación */
  /* Aplica la rotación utilizando el ángulo pasado como prop */
  transform: rotate(${(props) => props.angle}rad);
`;

const Label = styled.label<{
  unitType: unitType;
  selected: boolean;
}>`
  position: relative;
  font-size: 2em;
  border: ${({ unitType, selected }) => `${selected ? 3 : 2}px solid ${
    {
      Animal: "#FF5733",
      Corpse: "#8B4513",
      Dung: "#964B00",
      Egg: "#FDEE00",
      Microbe: "#00FF00",
      Plant: "#00FF7F",
      Rock: "#808080",
    }[unitType]
  }
  `};
  border-radius: 50%;
`;

function UnitNode({
  nodeData,
  publicInstanceData,
}: {
  nodeData: NodeTypes;
  publicInstanceData: { turnAngle: number | undefined };
}) {
  const {
    selected,
    // @ts-ignore
    data: { label },
    type: unitType,
  } = nodeData;

  useEffect(() => {
    // console.count("a");
  }, [publicInstanceData.turnAngle]);

  return (
    <>
      <Handle
        id={String(nodeData.id)}
        type="target"
        // @ts-ignore
        position={unitType === "Animal" ? Position.Left : Position.Top}
        style={{
          width: "3px",
          height: "3px",
        }}
      />
      <Label
        htmlFor={String(unitType)}
        unitType={unitType as unknown as unitType}
        selected={selected as unknown as boolean}
      >
        {/* @ts-ignore */}
        {unitType === "Animal" && (
          // @ts-ignore
          <Arrow angle={publicInstanceData.turnAngle} />
        )}
        {String(label)}
      </Label>

      {/* @ts-ignore */}
      {unitType === "Animal" && (
        <Handle
          id={String(nodeData.id)}
          type="source"
          position={Position.Right}
          style={{
            width: "3px",
            height: "3px",
          }}
        />
      )}
    </>
  );
}
export default UnitNode;
