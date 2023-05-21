import { createGlobalStyle } from "styled-components";

const GlobalGameEntitiesStyler = createGlobalStyle<{ hideEdges: boolean }>`
.react-flow .react-flow__handle {
  background-color: #784be8;
}

.react-flow .react-flow__handle-top {
  top: -10px;
}

.react-flow .react-flow__handle-bottom {
  bottom: -10px;
}

.react-flow .react-flow__node {
  height: 40px;
  justify-content: center;
  align-items: center;
  display: flex;
  border-width: 2px;
  font-weight: 700;
}

.react-flow .react-flow__edge path,
.react-flow__connectionline path {
  stroke-width: 2;
}

.wrapper {
  flex-grow: 1;
  height: 100%;
}

.temp .react-flow__edge-path {
  stroke: #bbb;
  stroke-dasharray: 5 5;
}

[data-message] {
  display: none;
}

html,
body,
#root {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
  background-color: #3333;
}
.react-flow__edge-path {
  /* stroke: #333; */
  stroke: gray;

  stroke-width: 2;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}

.react-flow__edge-path {
  stroke: #333;
  stroke-width: 2;
}

.temp .react-flow__edge-path {
  stroke: #bbb;
  stroke-dasharray: 5 5;
}

.react-flow__edges{
  ${({ hideEdges }) => hideEdges && "display: none"}
}
`;

export default GlobalGameEntitiesStyler;
