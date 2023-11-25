import React, { useEffect } from "react";
import { useAppUIState } from "../../containers/AppUIContext";
import { Background, BackgroundVariant, MiniMap, Panel } from "reactflow";
import WeatherComponent from "./UIElements";
import { PublicEnvironmentData } from "../../services/EnviromentSystem";

const UI = () => {
  const { dispatch } = useAppUIState();

  return (
    <>
      <Panel position="top-left">
        <button onClick={() => dispatch({ type: "TOGGLE_UI_VISIBILITY" })}>
          toggle
        </button>
      </Panel>
      <Panel position="top-center">
        {/* <WeatherComponent
        // @ts-ignore
        // data={UIState.enviromentData}
        /> */}
      </Panel>

      <Panel position="bottom-left">
        <div>avatar 🐺</div>
      </Panel>
      <Panel position="bottom-center">
        <div>other info</div>
      </Panel>

      <MiniMap />
    </>
  );
};

export default UI;
{
  /* <Background
        id="this-is-the-background"
        variant={BackgroundVariant.Cross}
        gap={50}
        color={"blue"}
      /> */
}

// useEffect(() => {
//   const backgroundElement = document.querySelector(
//     "#pattern-1this-is-the-background"
//   );

//   if (backgroundElement) {
//     const firstChild = backgroundElement.firstChild;

//     // const circleElement = document.createElement("circle");

//     // @ts-ignore
//     // firstChild?.setAttribute("cx", "30");
//     // @ts-ignore
//     // firstChild?.setAttribute("cy", "30");
//     // @ts-ignore
//     // firstChild?.setAttribute("r", "30");
//     // @ts-ignore
//     // firstChild?.setAttribute("fill", "red");

//     // backgroundElement.insertBefore(circleElement, firstChild);
//   }
// }, []);
// const rectElement = document.createElement("path");
// rectElement.setAttribute("x", x ? String(x) : "10");
// rectElement.setAttribute("y", y ? String(y) : "10");
// rectElement.setAttribute("width", "50");
// rectElement.setAttribute("height", "50");
// rectElement.setAttribute("fill", "#880808");
// rectElement.setAttribute("stroke-width", "1");
// rectElement.setAttribute("stroke", "red");
// rectElement.setAttribute("d", "M150 0 L75 200 L225 200 Z");
// @ts-ignore
// const x = firstChild?.getAttribute("x");
// @ts-ignore
// const y = firstChild?.getAttribute("y");
// const backgroundElement = document.querySelector(".react-flow__background");
// import {
//   Background, //as Bg,
//   BackgroundVariant,
//   MiniMap,
//   Panel, //as ReactFlowMinimap,
// } from "reactflow";
// import { useAppUIState } from "../../containers/AppUIContext";

// const UI = () => {
//   const { dispatch } = useAppUIState();

//   return (
//     <>
//       <Panel position="top-left">
//         <button onClick={() => dispatch({ type: "TOGGLE_UI_VISIBILITY" })}>
//           toggle
//         </button>
//       </Panel>
//       {/* @ts-ignore */}
//       <Background
//         id="this-is-the-background"
//         variant={BackgroundVariant.Cross}
//         gap={50}
//         color={"#254117"}
//       >
//         <pattern id="custom-pattern" x="10" y="10" width="50" height="50">
//           <rect width="50" height="50" fill="#880808" />
//         </pattern>
//         <rect
//           x="0"
//           y="0"
//           width="100%"
//           height="100%"
//           fill="url(#custom-pattern)"
//         />
//       </Background>

//       <MiniMap />
//     </>
//   );
// };
// export default UI;

{
  /* <svg
          id="iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"
          ref={backgroundRef}
          className="react-flow__background"
          data-testid="rf__background"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: "0",
            left: "0",
          }}
        >
          <rect
            x="10"
            y="01"
            width="100%"
            height="100%"
            fill={`url(#${patternId})`}
          />
        </svg> */
}
{
  /* </Background> */
}
//<Header tick={tick} dayTime={dayTime} />
//<BuildingsMenu />
// import { Header } from "./Header";
// import UnitStats from "./UnitStats";
// import BuildingsMenu from "./BuildingsMenu";
// import { Minimap } from "./UnitStats/UnitStatsElements";
// const Background = styled(Bg)``;

// const MiniMap = styled(ReactFlowMinimap)`
//   /* background: white;
//   border-radius: 5px;
//   box-shadow: 7px 1px 34px 7px rgba(0, 0, 0, 0.34);
//   -webkit-box-shadow: 7px 1px 34px 7px rgba(0, 0, 0, 0.34);
//   -moz-box-shadow: 7px 1px 34px 7px rgba(0, 0, 0, 0.34); */
// `;
// style={{
//   backgroundImage: `url(${tileImg})`,
//   backgroundRepeat: "repeat",
// }}
/* <UnitStats /> */
/*
const Container = styled.div`
  z-index: 1005;
  pointer-events: none;
  position: absolute;
  width: 100vw;
  height: 100vh;
`;
*/
// useEffect(() => {
//   const backgroundElement = backgroundRef.current;

//   // Create a new SVG pattern element
//   const patternElement = document.createElementNS(
//     "http://www.w3.org/2000/svg",
//     "pattern"
//   );
//   patternElement.id = patternId;
//   patternElement.setAttribute("x", "31.005608323975423");
//   patternElement.setAttribute("y", "99.24299242538359");
//   patternElement.setAttribute("width", "100");
//   patternElement.setAttribute("height", "100");
//   patternElement.setAttribute("patternUnits", "userSpaceOnUse");
//   patternElement.setAttribute("patternTransform", "translate(-6,-6)");

//   // Create a path element for the pattern
//   const pathElement = document.createElementNS(
//     "http://www.w3.org/2000/svg",
//     "path"
//   );
//   pathElement.setAttribute("stroke", "#254117");
//   pathElement.setAttribute("stroke-width", "1");
//   pathElement.setAttribute("d", "M6 0 V12 M0 6 H12");

//   // Append the path element to the pattern element
//   patternElement.appendChild(pathElement);

//   // Append the pattern element to the Background component
//   if (backgroundElement) {
//     // @ts-ignore
//     backgroundElement.appendChild(patternElement);
//   }

//   // Clean up by removing the pattern element when the component unmounts
//   return () => {
//     if (backgroundElement) {
//       // @ts-ignore
//       backgroundElement.removeChild(patternElement);
//     }
//   };
// }, []);
// const backgroundRef = useRef(null);
// const patternId = "custom-pattern";
// const CustomBackground = () => {
//   return (
//     <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
//       <defs>
//         <pattern
//           id="custom-pattern"
//           width="100"
//           height="100"
//           patternUnits="userSpaceOnUse"
//         >
//           {/* Replace the rectangle with your custom image or element */}
//           <rect width="100" height="100" fill="blue" />
//         </pattern>
//       </defs>
//       {/* Use the pattern as the fill for a rectangle that covers the whole Background */}
//       <rect width="100%" height="100%" fill="url(#custom-pattern)" />
//     </svg>
//   );
// };

// import image1 from "../../assets/images/image1.jpg";
// import image2 from "../../assets/images/image2.jpg";
// import { useEffect, useRef } from "react";

// const CustomBackground = () => {
//   return (
//     <div>
//       {/* Fixed image 1 */}
//       <img
//         src={image1}
//         width={50}
//         style={
//           {
//             // position: "absolute",
//             // top: "100px",
//             // left: "200px",
//           }
//         }
//         alt="Image 1"
//       />

//       {/* Fixed image 2 */}
//       <img
//         src={image2}
//         width={50}
//         style={
//           {
//             // position: "absolute",
//             // top: "300px",
//             // left: "500px",
//           }
//         }
//         alt="Image 2"
//       />
//     </div>
//   );
// };
