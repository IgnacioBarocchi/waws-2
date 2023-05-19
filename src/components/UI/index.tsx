import {
  Background, //as Bg,
  BackgroundVariant,
  MiniMap, //as ReactFlowMinimap,
} from "reactflow";
// import styled from "styled-components";

const UI = () => {
  return (
    <>
      <Background
        variant={BackgroundVariant.Cross}
        gap={50}
        color={"#254117"}
      />
      <MiniMap />
    </>
  );
};
export default UI;

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
