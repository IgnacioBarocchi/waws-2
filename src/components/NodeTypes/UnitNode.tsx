import { Handle, NodeTypes } from "reactflow";
import styled from "styled-components";
import { useAppUIState } from "../../containers/AppUIContext";
import {
  DirectionArrow,
  Label,
  SourceUnitHandle,
  TargetUnitHandle,
  UnitType,
} from "./NodeTypesElements";

const UnitHandle = styled(Handle).attrs((props: { UIHidden: boolean }) => ({
  UIHidden: props.UIHidden,
}))`
  visibility: ${({ UIHidden }) => (UIHidden ? "hidden" : "")};
  width: "3px";
  height: "3px";
`;

function UnitNode({
  nodeData,
  publicInstanceData,
}: {
  nodeData: NodeTypes;
  publicInstanceData: { turnAngle: number | undefined };
}) {
  const {
    UIState: { UIHidden },
  } = useAppUIState();

  const {
    selected,
    // @ts-ignore
    data: { label },
    type: unitType,
  } = nodeData;

  const isAnimal = String(unitType) === "Animal";

  return (
    <>
      <TargetUnitHandle
        id={String(nodeData.id)}
        unitType={unitType as unknown as UnitType}
        UIHidden={UIHidden}
      />
      <Label
        htmlFor={String(unitType)}
        unitType={unitType as unknown as UnitType}
        selected={selected as unknown as boolean}
        UIHidden={UIHidden}
      >
        {isAnimal && !UIHidden && (
          <DirectionArrow turnAngle={Number(publicInstanceData.turnAngle)} />
        )}
        {String(label)}
      </Label>

      {isAnimal && (
        <SourceUnitHandle id={String(nodeData.id)} UIHidden={UIHidden} />
      )}
    </>
  );
}
export default UnitNode;
