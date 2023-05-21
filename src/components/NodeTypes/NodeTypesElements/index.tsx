import * as THREE from "three";
import { Handle, Position } from "reactflow";
import styled from "styled-components";
import { useEffect, useRef } from "react";
import { useThree } from "../../../containers/ThreeContext";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// @ts-ignore
import wolf from "../../../assets/models/Wolf.fbx";

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
  flowHidden: boolean;
}>`
  position: relative;
  font-size: 2em;
  border: ${({ selected }) => `${selected ? 3 : 2}px solid transparent`};
  border-radius: 50%;
  border-color: ${({ flowHidden, unitType }) =>
    flowHidden
      ? "transparent"
      : `${
          {
            Animal: "#FF5733",
            Corpse: "#8B4513",
            Dung: "#964B00",
            Egg: "#FDEE00",
            Microbe: "#00FF00",
            Plant: "#00FF7F",
            Rock: "#808080",
          }[unitType]
        }`};
`;

const UnitHandle = styled(Handle).attrs((props: { hidden: boolean }) => ({
  hidden: props.hidden,
}))`
  visibility: ${({ hidden }) => hidden && "none"};
  display: ${({ hidden }) => hidden && "none"};
  width: "3px";
  height: "3px";
`;

export const TargetUnitHandle = ({
  id,
  unitType,
  hidden,
}: {
  id: string;
  unitType: UnitType;
  hidden: boolean;
}) => (
  <UnitHandle
    id={id}
    type="target"
    position={String(unitType) === "Animal" ? Position.Left : Position.Top}
    hidden={hidden}
  />
);

export const SourceUnitHandle = ({
  id,
  hidden,
}: {
  id: string;
  hidden: boolean;
}) => (
  <UnitHandle id={id} type="source" position={Position.Right} hidden={hidden} />
);

interface Unit3DModelProps {
  size: number;
  color: number;
}

export function Unit3DModel({ size, color }: Unit3DModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scene } = useThree();
  useEffect(() => {
    if (containerRef.current) {
      // Create the renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(
        containerRef.current.offsetWidth,
        containerRef.current.offsetHeight
      );
      containerRef.current.appendChild(renderer.domElement);
      // Load the model with animations
      const loader = new FBXLoader(); // Use FBXLoader for FBX format or GLTFLoader for GLB format
      loader.load(
        wolf, // Replace with the path to your model file
        (object) => {
          // alert(object);
          // Handle animations
          if (object.animations && object.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(object);
            const clipAction = mixer.clipAction(object.animations[0]);
            clipAction.play();
          }

          // Add the loaded model to the scene
          scene.add(object);
        },
        undefined,
        (error) => {
          console.error("Error loading model:", error);
        }
      );
    }
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

interface NodeAvatarProps {
  turnAngle: number;
  render3D: boolean;
  arrowHidden: boolean;
  lowResAvatar: string;
}

export const NodeAvatar = ({
  arrowHidden,
  turnAngle,
  render3D,
  lowResAvatar,
}: NodeAvatarProps) => {
  if (render3D) return <Unit3DModel size={1} color={0x00ff00} />;

  return (
    <div>
      {!arrowHidden && <DirectionArrow turnAngle={Number(turnAngle)} />}
      <span>{lowResAvatar}</span>
    </div>
  );
};
// Render the scene
// function animate() {
//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);

//   // Update animations
//   if (object.animations && object.animations.length > 0) {
//     mixer.update(deltaTime);
//   }
// }
// animate();
