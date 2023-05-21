import { Handle, Position } from "reactflow";
import styled from "styled-components";

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

export const DirectionArrow = ({ turnAngle }: { turnAngle: number }) => {
  return <Arrow angle={turnAngle} />;
};

export type UnitType =
  | "Animal"
  | "Corpse"
  | "Dung"
  | "Egg"
  | "Microbe"
  | "Plant"
  | "Rock";

export const Label = styled.label<{
  unitType: UnitType;
  selected: boolean;
  UIHidden: boolean;
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
  border: ${({ UIHidden }) => UIHidden && "none"};
`;

const UnitHandle = styled(Handle).attrs((props: { UIHidden: boolean }) => ({
  UIHidden: props.UIHidden,
}))`
  visibility: ${({ UIHidden }) => (UIHidden ? "hidden" : "")};
  width: "3px";
  height: "3px";
`;

export const TargetUnitHandle = ({
  id,
  unitType,
  UIHidden,
}: {
  id: string;
  unitType: UnitType;
  UIHidden: boolean;
}) => (
  <UnitHandle
    id={id}
    type="target"
    position={String(unitType) === "Animal" ? Position.Left : Position.Top}
    UIHidden={UIHidden}
  />
);

export const SourceUnitHandle = ({
  id,
  UIHidden,
}: {
  id: string;
  UIHidden: boolean;
}) => (
  <UnitHandle
    id={id}
    type="source"
    position={Position.Right}
    UIHidden={UIHidden}
  />
);
