import { MutableRefObject } from "react";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  OnEdgesChange,
  OnNodesChange,
} from "reactflow";
// The engine is hook dependent
export interface IFlowable {
  getOnConnectEndCallback(): Function;
  getOnConnectCallback(): Function;
  // nodes: Node[];
  // onNodesChange: OnNodesChange;
  // edges: Edge[];
  // setEdges: React.Dispatch<React.SetStateAction<Edge<any>[]>>;
  // addEdge: (edgeParams: Edge | Connection, edges: Edge[]) => Edge[];
  // onEdgesChange: OnEdgesChange;
}

/*
 (
    connectingNodeId: MutableRefObject<null>,
    reactFlowWrapper: MutableRefObject<null>,
    selectedBuilding: string
  ) =>
    | (() => void)
    | ((
        event: MouseEvent | TouchEvent
      ) => ((event: MouseEvent | TouchEvent) => void) | undefined);
*/
