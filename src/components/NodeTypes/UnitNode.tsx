import { NodeTypes } from "reactflow";
import { useAppUIState } from "../../containers/AppUIContext";
import {
  DirectionArrow,
  Label,
  SourceUnitHandle,
  TargetUnitHandle,
  Unit3DModel,
  UnitType,
} from "./NodeTypesElements";
import { useGameEngine } from "../../containers/GameEngineContext";

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
  const graphics = useGameEngine().gameSettings.graphics;
  const render3D = graphics === "h" && isAnimal;
  const lowResAvatar = String(label);
  return (
    <>
      <TargetUnitHandle
        id={String(nodeData.id)}
        unitType={unitType as unknown as UnitType}
        hidden={UIHidden}
      />
      <Label
        htmlFor={String(unitType)}
        unitType={unitType as unknown as UnitType}
        selected={selected as unknown as boolean}
        hidden={UIHidden}
      >
        {isAnimal && !UIHidden && (
          <DirectionArrow turnAngle={Number(publicInstanceData.turnAngle)} />
        )}

        {render3D ? (
          <Unit3DModel size={1} color={0x00ff00} />
        ) : (
          <span>{lowResAvatar}</span>
        )}
      </Label>

      {isAnimal && (
        <SourceUnitHandle id={String(nodeData.id)} hidden={UIHidden} />
      )}
    </>
  );
}
export default UnitNode;
